import { AppNode } from "@/types/appNodes";
import { WorkflowExecutionPlan } from "@/types/workflow";
import { Edge } from "@xyflow/react";
import { TaskRegistry } from "@/lib/workflow/task/registry";

type FlowToExecutionPlanType = {
  executionPlan?: WorkflowExecutionPlan;
};

// timestamp: 4:32:31
export function FlowToExecutionPlan(
  nodes: AppNode[],
  edges: Edge[]
): FlowToExecutionPlanType {
  const entryPoint = nodes.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint
  );

  if (!entryPoint) {
    throw new Error("TODO: Handle entrypoint error");
  }
  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint]
    }
  ];

  for (let phase = 2; phase <= nodes.length; phase++) {}
  return { executionPlan };
}
