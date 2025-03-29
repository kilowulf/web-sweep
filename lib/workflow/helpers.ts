import { AppNode } from "@/types/appNodes";
import { TaskRegistry } from "@/lib/workflow/task/registry";

/**
 * CalculateWorkflowCost
 *
 * Computes the total cost (in credits) of executing a workflow based on its nodes.
 * It iterates over an array of nodes, retrieves the credit cost for each node's task
 * type from the TaskRegistry, and sums these values.
 *
 * @param {AppNode[]} nodes - An array of workflow nodes.
 * @returns {number} The total credit cost of the workflow.
 */
export function CalculateWorkflowCost(nodes: AppNode[]) {
  return nodes.reduce((acc, node) => {
    return acc + TaskRegistry[node.data.type].credits;
  }, 0);
}
