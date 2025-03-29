import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus
} from "@/types/workflow";
import { waitFor } from "../helper/waitFor";
import { ExecutionPhase } from "@prisma/client";
import { AppNode } from "@/types/appNodes";
import { TaskRegistry } from "./task/registry";
import { ExecutorRegistry } from "@/lib/workflow/executor/registry";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { TaskParamType } from "@/types/task";
import { Browser, Page } from "puppeteer";
import { Edge } from "@xyflow/react";
import { LogCollector } from "@/types/log";
import { createLogCollector } from "@/lib/log";

/**
 * ExecuteWorkflow
 *
 * Main function to execute a workflow. It performs the following operations:
 * - Retrieves the execution instance from the database (including workflow and phases).
 * - Sets up the execution environment.
 * - Initializes the execution status and phases in the database.
 * - Iterates through each phase and executes them sequentially using the corresponding executor.
 * - Accumulates the total credits consumed and halts execution on failure.
 * - Finalizes the execution status and updates the workflow record.
 * - Cleans up the execution environment (e.g., closes the browser).
 * - Revalidates the path for the workflow runs page.
 *
 * @param {string} executionId - The unique identifier for the workflow execution.
 * @param {Date} [nextRunAt] - Optional date for scheduling the next run.
 * @returns {Promise<void>} Resolves when execution and cleanup are complete.
 * @throws {Error} Throws an error if the execution is not found.
 */
export async function ExecuteWorkflow(executionId: string, nextRunAt?: Date) {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: { workflow: true, phases: true }
  });

  if (!execution) {
    throw new Error("execution not found");
  }

  const edges = JSON.parse(execution.definition).edges as Edge[];

  // Setup execution environment
  const environment: Environment = { phases: {} };

  // Initialize workflow execution state in the database
  await initializeWorkflowExecution(
    executionId,
    execution.workflowId,
    nextRunAt
  );

  // Initialize all phases status to PENDING
  await initializePhasesStatus(execution);

  let creditsConsumed = 0;
  let executionFailed = false;

  // Execute each phase sequentially
  for (const phase of execution.phases) {
    const phaseExecution = await executeWorkflowPhase(
      phase,
      environment,
      edges,
      execution.userId
    );
    creditsConsumed += phaseExecution.creditsConsumed;
    // If any phase fails, halt further execution
    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
  }

  // Finalize the workflow execution by updating statuses and credits
  await finalizeWorkflowExecution(
    executionId,
    execution.workflowId,
    executionFailed,
    creditsConsumed
  );

  // Clean up the execution environment (e.g., close the browser)
  await cleanupEnvironment(environment);

  // Revalidate the workflows/runs path to update cached pages
  revalidatePath("/workflows/runs");
}

/**
 * initializeWorkflowExecution
 *
 * Sets the initial state for the workflow execution in the database.
 * It updates the workflow execution record with the current start time and sets its status to RUNNING.
 * It also updates the corresponding workflow record with last run details and optionally the next run time.
 *
 * @param {string} executionId - The execution id to update.
 * @param {string} workflowId - The id of the workflow being executed.
 * @param {Date} [nextRunAt] - Optional date for the next run.
 * @returns {Promise<void>}
 */
async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string,
  nextRunAt?: Date
) {
  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING
    }
  });

  await prisma.workFlow.update({
    where: {
      id: workflowId
    },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
      lastRunId: executionId,
      ...(nextRunAt && { nextRunAt })
    }
  });
}

/**
 * initializePhasesStatus
 *
 * Updates the status of all phases related to the execution to PENDING.
 *
 * @param {any} execution - The execution object containing phase information.
 * @returns {Promise<void>}
 */
async function initializePhasesStatus(execution: any) {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase: any) => phase.id)
      }
    },
    data: {
      status: ExecutionPhaseStatus.PENDING
    }
  });
}

/**
 * finalizeWorkflowExecution
 *
 * Finalizes the workflow execution by setting the final status (COMPLETED or FAILED),
 * recording the completion time, and updating the consumed credits.
 * It also updates the workflow record with the final run status.
 *
 * @param {string} executionId - The execution id.
 * @param {string} workflowId - The workflow id.
 * @param {boolean} executionFailed - Indicates whether the execution failed.
 * @param {number} creditsConsumed - The total credits consumed during execution.
 * @returns {Promise<void>}
 */
async function finalizeWorkflowExecution(
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditsConsumed: number
) {
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;

  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      completedAt: new Date(),
      status: finalStatus,
      creditsConsumed
    }
  });

  await prisma.workFlow
    .update({
      where: {
        id: workflowId,
        lastRunId: executionId
      },
      data: {
        lastRunStatus: finalStatus
      }
    })
    .catch((err) => {
      // If the update fails (e.g., due to concurrent execution), log error but do not propagate.
    });
}

/**
 * executeWorkflowPhase
 *
 * Executes an individual phase of the workflow.
 * It sets up the environment for the phase, updates its status, and decrements user credits.
 * The phase is then executed using its corresponding executor function, and outputs are finalized.
 *
 * @param {ExecutionPhase} phase - The phase record from the database.
 * @param {Environment} environment - The shared execution environment.
 * @param {Edge[]} edges - Array of edges representing connections between nodes.
 * @param {string} userId - The user id for credit deduction.
 * @returns {Promise<{ success: boolean; creditsConsumed: number }>} The result of the phase execution and credits consumed.
 */
async function executeWorkflowPhase(
  phase: ExecutionPhase,
  environment: Environment,
  edges: Edge[],
  userId: string
) {
  const logCollector = createLogCollector();
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;

  // Setup the phase-specific environment by populating inputs from connected outputs.
  setupEnvironmentForPhase(node, environment, edges);

  // Update the phase record to indicate it is running.
  await prisma.executionPhase.update({
    where: { id: phase.id },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
      inputs: JSON.stringify(environment.phases[node.id].inputs)
    }
  });

  const creditsRequired = TaskRegistry[node.data.type].credits;

  // Decrement user credits for this phase.
  let success = await decrementCredits(userId, creditsRequired, logCollector);
  const creditsConsumed = success ? creditsRequired : 0;
  if (success) {
    // Execute the phase if sufficient credits exist.
    success = await executePhase(phase, node, environment, logCollector);
  }

  // Finalize the phase outputs and status.
  const outputs = environment.phases[node.id].outputs;
  await finalizePhase(
    phase.id,
    success,
    outputs,
    logCollector,
    creditsConsumed
  );
  return { success, creditsConsumed };
}

/**
 * finalizePhase
 *
 * Finalizes the execution of a phase by updating its status, recording the completion time,
 * storing outputs, and logging execution details.
 *
 * @param {string} phaseId - The id of the phase to finalize.
 * @param {boolean} success - Indicates whether the phase executed successfully.
 * @param {any} outputs - The outputs generated by the phase.
 * @param {LogCollector} logCollector - A log collector instance containing logs for this phase.
 * @param {number} creditsConsumed - The credits consumed during phase execution.
 * @returns {Promise<void>}
 */
async function finalizePhase(
  phaseId: string,
  success: boolean,
  outputs: any,
  logCollector: LogCollector,
  creditsConsumed: number
) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;

  await prisma.executionPhase.update({
    where: {
      id: phaseId
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
      creditsConsumed,
      logs: {
        createMany: {
          data: logCollector.getAll().map((log) => ({
            message: log.message,
            timestamp: log.timestamp,
            logLevel: log.level
          }))
        }
      }
    }
  });
}

/**
 * executePhase
 *
 * Executes the individual phase by invoking the appropriate executor function from the ExecutorRegistry.
 * It creates an execution environment tailored for the phase and returns the success status.
 *
 * @param {ExecutionPhase} phase - The phase record.
 * @param {AppNode} node - The node associated with the phase.
 * @param {Environment} environment - The overall workflow execution environment.
 * @param {LogCollector} logCollector - A log collector for gathering logs during phase execution.
 * @returns {Promise<boolean>} True if the phase executes successfully, otherwise false.
 */
async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): Promise<boolean> {
  const runFn = ExecutorRegistry[node.data.type];
  if (!runFn) {
    logCollector.error(`Executor not found: ${node.data.type}`);
    return false;
  }

  const executionEnvironment: ExecutionEnvironment<any> =
    createExecutionEnvironment(node, environment, logCollector);

  return await runFn(executionEnvironment);
}

/**
 * setupEnvironmentForPhase
 *
 * Prepares the execution environment for a specific phase by initializing its inputs.
 * It sets up an empty inputs/outputs object for the node and populates inputs either from
 * the node's own data or from connected outputs via edges.
 *
 * @param {AppNode} node - The node representing the phase.
 * @param {Environment} environment - The overall workflow execution environment.
 * @param {Edge[]} edges - The list of edges connecting nodes.
 */
function setupEnvironmentForPhase(
  node: AppNode,
  environment: Environment,
  edges: Edge[]
) {
  environment.phases[node.id] = {
    inputs: {},
    outputs: {}
  };

  const inputs = TaskRegistry[node.data.type].inputs;
  for (const input of inputs) {
    // Skip browser instance inputs.
    if (input.type === TaskParamType.BROWSER_INSTANCE) continue;
    const inputValue = node.data.inputs[input.name];
    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }
    // Retrieve connected output from upstream node if available.
    const connectedEdge = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name
    );
    if (!connectedEdge) {
      console.error("Missing edge for input", input.name, "node id:", node.id);
      continue;
    }

    const outputValue =
      environment.phases[connectedEdge.source].outputs[
        connectedEdge.sourceHandle!
      ];

    environment.phases[node.id].inputs[input.name] = outputValue;
  }
}

/**
 * createExecutionEnvironment
 *
 * Creates a phase-specific execution environment for a node.
 * This environment provides methods to get inputs, set outputs, and interact with the browser and page.
 *
 * @param {AppNode} node - The node for which to create the execution environment.
 * @param {Environment} environment - The overall workflow execution environment.
 * @param {LogCollector} logCollector - A log collector for logging messages during execution.
 * @returns {ExecutionEnvironment<any>} The tailored execution environment for the phase.
 */
function createExecutionEnvironment(
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): ExecutionEnvironment<any> {
  return {
    getInput: (name: string) => environment.phases[node.id]?.inputs[name],
    setOutput: (name: string, value: string) => {
      environment.phases[node.id].outputs[name] = value;
    },
    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => {
      environment.browser = browser;
    },
    getPage: () => environment.page,
    setPage: (page: Page) => {
      environment.page = page;
    },
    log: logCollector
  };
}

/**
 * cleanupEnvironment
 *
 * Cleans up the execution environment by closing the browser instance if it exists.
 *
 * @param {Environment} environment - The execution environment to clean up.
 * @returns {Promise<void>}
 */
async function cleanupEnvironment(environment: Environment) {
  if (environment.browser) {
    await environment.browser
      .close()
      .catch((err) => console.error("Cannot close browser, reason:", err));
  }
}

/**
 * decrementCredits
 *
 * Attempts to decrement the user's credits by a specified amount.
 * If the user does not have sufficient credits, logs an error and returns false.
 *
 * @param {string} userId - The id of the user whose credits are to be decremented.
 * @param {number} amount - The amount of credits to decrement.
 * @param {LogCollector} logCollector - A log collector to log errors.
 * @returns {Promise<boolean>} True if the credits were successfully decremented, otherwise false.
 */
async function decrementCredits(
  userId: string,
  amount: number,
  logCollector: LogCollector
) {
  try {
    await prisma.userBalance.update({
      where: { userId, credits: { gte: amount } },
      data: { credits: { decrement: amount } }
    });
    return true;
  } catch (err) {
    logCollector.error("Insufficient credits");
    return false;
  }
}
