import { AppNode, AppNodeMissingInputs } from "@/types/appNodes";
import {
  WorkflowExecutionPlan,
  WorkflowExecutionPlanPhase
} from "@/types/workflow";
import { Edge } from "@xyflow/react";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import useFlowValidation from "@/components/hooks/useFlowValidation";

/**
 * Enum representing validation error types encountered during conversion of the flow to an execution plan.
 */
export enum FlowToExecutionPlanValidationError {
  NO_ENTRY_POINT,
  INVALID_INPUTS
}

/**
 * Type representing the result of converting a flow into an execution plan.
 *
 * - executionPlan: The generated execution plan if successful.
 * - error: An error object containing the type of validation error and any invalid elements.
 */
type FlowToExecutionPlanType = {
  executionPlan?: WorkflowExecutionPlan;
  error?: {
    type: FlowToExecutionPlanValidationError;
    invalidElements?: AppNodeMissingInputs[];
  };
};

/**
 * Converts a set of nodes and edges from a flow into a structured workflow execution plan.
 *
 * The function:
 * 1. Identifies the entry point (the node with an entry point task).
 * 2. Validates inputs for the entry point and subsequent nodes.
 * 3. Groups nodes into phases such that each phase only contains nodes whose inputs are satisfied by nodes in earlier phases.
 * 4. Accumulates any validation errors encountered.
 *
 * @param {AppNode[]} nodes - Array of flow nodes.
 * @param {Edge[]} edges - Array of edges connecting the nodes.
 * @returns {FlowToExecutionPlanType} An object containing either the execution plan or a validation error.
 */
export function FlowToExecutionPlan(
  nodes: AppNode[],
  edges: Edge[]
): FlowToExecutionPlanType {
  // Identify the entry point node based on its task configuration.
  const entryPoint = nodes.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint
  );

  if (!entryPoint) {
    return {
      error: {
        type: FlowToExecutionPlanValidationError.NO_ENTRY_POINT
      }
    };
  }

  // Array to collect nodes with invalid inputs.
  const inputsWithErrors: AppNodeMissingInputs[] = [];
  // Set to keep track of nodes that have been included in the execution plan.
  const planned = new Set<string>();

  // Check invalid inputs for the entry point.
  const invalidInputs = getInvalidInputs(entryPoint, edges, planned);
  if (invalidInputs.length > 0) {
    inputsWithErrors.push({
      nodeId: entryPoint.id,
      inputs: invalidInputs
    });
  }

  // Initialize execution plan with phase 1 containing the entry point.
  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint]
    }
  ];
  planned.add(entryPoint.id);

  // Build subsequent phases until all nodes are planned or maximum phases reached.
  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] };
    for (const currentNode of nodes) {
      if (planned.has(currentNode.id)) {
        // Skip nodes that are already planned.
        continue;
      }
      // Validate inputs for the current node based on nodes already planned.
      const invalidInputs = getInvalidInputs(currentNode, edges, planned);
      if (invalidInputs.length > 0) {
        // If all incomers (nodes connected to this node) are already planned, then inputs are invalid.
        const incomers = getIncomers(currentNode, nodes, edges);
        if (incomers.every((incomer) => planned.has(incomer.id))) {
          console.error(
            "invalid inputs: executionPlan",
            currentNode,
            invalidInputs
          );
          inputsWithErrors.push({
            nodeId: currentNode.id,
            inputs: invalidInputs
          });
        } else {
          // Skip the node if its inputs are not yet ready.
          continue;
        }
      }
      // If inputs are valid, include the node in the next phase.
      nextPhase.nodes.push(currentNode);
    }
    // Mark all nodes in this phase as planned.
    for (const node of nextPhase.nodes) {
      planned.add(node.id);
    }
    executionPlan.push(nextPhase);
  }

  // If any invalid inputs were found, return an error.
  if (inputsWithErrors.length > 0) {
    return {
      error: {
        type: FlowToExecutionPlanValidationError.INVALID_INPUTS,
        invalidElements: inputsWithErrors
      }
    };
  }

  // Return the generated execution plan.
  return { executionPlan };
}

/**
 * getInvalidInputs
 *
 * Checks a given node for missing or invalid inputs.
 * It verifies whether each required input is either provided directly in the node's data or is linked
 * via an edge from a node that has been planned.
 *
 * @param {AppNode} node - The node to check for invalid inputs.
 * @param {Edge[]} edges - Array of edges connecting the nodes.
 * @param {Set<string>} planned - Set of node IDs that have already been included in the execution plan.
 * @returns {string[]} An array of input names that are invalid or missing.
 */
function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
  const invalidInputs: string[] = [];
  const inputs = TaskRegistry[node.data.type].inputs;

  for (const input of inputs) {
    const inputValue = node.data.inputs[input.name];
    const inputValueProvided = inputValue?.length > 0;
    if (inputValueProvided) {
      // Input value is directly provided.
      continue;
    }
    // Check if there is an incoming edge for this input.
    const incomingEdges = edges.filter((edge) => edge.target === node.id);
    const inputLinkedToOutput = incomingEdges.find(
      (edge) => edge.targetHandle === input.name
    );

    const requiredInputProvidedByVisitedOutput =
      input.required &&
      inputLinkedToOutput &&
      planned.has(inputLinkedToOutput.source);

    if (requiredInputProvidedByVisitedOutput) {
      // Input is required and its value is provided by an upstream node that is already planned.
      continue;
    } else if (!input.required) {
      // For non-required inputs, if an edge exists, ensure its source is planned.
      if (!inputLinkedToOutput) continue;
      if (inputLinkedToOutput && planned.has(inputLinkedToOutput.source)) {
        continue;
      }
    }

    // If none of the conditions are met, mark the input as invalid.
    invalidInputs.push(input.name);
  }

  return invalidInputs;
}

/**
 * getIncomers
 *
 * Retrieves the nodes that are connected to the specified node via incoming edges.
 *
 * @param {AppNode} node - The node for which to find incomers.
 * @param {AppNode[]} nodes - The full array of nodes.
 * @param {Edge[]} edges - The full array of edges.
 * @returns {AppNode[]} An array of nodes that have edges leading into the specified node.
 */
function getIncomers(node: AppNode, nodes: AppNode[], edges: Edge[]) {
  if (!node.id) {
    return [];
  }
  const incomersIds = new Set<string>();
  edges.forEach((edge) => {
    if (edge.target === node.id) {
      incomersIds.add(edge.source);
    }
  });
  return nodes.filter((n) => incomersIds.has(n.id));
}
