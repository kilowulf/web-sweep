import { AppNode } from "@/types/appNodes";
import { TaskRegistry } from "@/lib/workflow/task/registry";

export function CalculateWorkflowCost(nodes: AppNode[]) {
  return nodes.reduce((acc, node) => {
    return acc + TaskRegistry[node.data.type].credits;
  }, 0);
}
