"use server";

import { getAppUrl } from "@/lib/helper/appUrl";
import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
  WorkflowStatus
} from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * This function is responsible for running a workflow based on the provided form data.
 * It first authenticates the user, validates the input parameters, retrieves the workflow,
 * and generates or retrieves the execution plan based on the workflow status.
 * Then, it creates a new workflow execution record in the database, populates the execution phases,
 * and starts the execution process.
 *
 * @param form - An object containing the workflowId and optional flowDefinition.
 * @param form.workflowId - The unique identifier of the workflow to be executed.
 * @param form.flowDefinition - The JSON string representing the workflow definition.
 *
 * @throws Will throw an error if the user is not authenticated, if the workflowId is missing,
 * if the workflow is not found, if no execution plan is found in a published workflow,
 * if the flow definition is not provided for a non-published workflow,
 * if the flow definition is not valid, if no execution plan is generated,
 * or if the workflow execution record cannot be created.
 *
 * @returns {Promise<void>} - The function does not return any value.
 */
export async function RunWorkflow(form: {
  workflowId: string;
  flowDefinition?: string;
}) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { workflowId, flowDefinition } = form;
  if (!workflowId) {
    throw new Error("Workflow ID is required");
  }

  const workflow = await prisma.workFlow.findUnique({
    where: {
      userId,
      id: workflowId
    }
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  let executionPlan: WorkflowExecutionPlan;
  let workflowDefinition = flowDefinition;
  if (workflow.status === WorkflowStatus.PUBLISHED) {
    if (!workflow.executionPlan) {
      throw new Error("no execution plan found in published workflow");
    }
    executionPlan = JSON.parse(workflow.executionPlan);
    workflowDefinition = workflow.definition;
  } else {
    if (!flowDefinition) {
      throw new Error("flow definition is not defined");
    }
    const flow = JSON.parse(flowDefinition);
    const result = FlowToExecutionPlan(flow.nodes, flow.edges);
    if (result.error) {
      throw new Error("flow definition not valid");
    }

    if (!result.executionPlan) {
      throw new Error("no execution plan generated");
    }

    executionPlan = result.executionPlan;
  }

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId: workflow.id,
      userId: userId,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      definition: workflowDefinition,
      phases: {
        create: executionPlan.flatMap((phase) => {
          return phase.nodes.flatMap((node) => {
            return {
              userId,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label
            };
          });
        })
      }
    },
    select: {
      id: true,
      phases: true
    }
  });

  if (!execution) {
    throw new Error("Failed to create workflow execution");
  }

  const triggerApiUrl = getAppUrl(
    `api/workflows/execute?executionId=${execution.id}`
  );
  console.log("@@TRIGGER URL", triggerApiUrl);

  // Send a request to trigger the workflow, using the API secret for authorization.
  fetch(triggerApiUrl, {
    headers: {
      Authorization: `Bearer ${process.env.API_SECRET!}`
    },
    cache: "no-store"
  }).catch((error) =>
    console.error(
      "Error triggering workflow with id",
      workflowId,
      ":error->",
      error.message
    )
  );
  redirect(`/workflow/runs/${workflowId}/${execution.id}`);
}
