import { AppNode } from "@/types/appNodes";
import { TaskType } from "@/types/task";

export function CreateFlowNode(
  nodeType: TaskType,
  position?: { x: number; y: number }
): AppNode {
  return {
    id: crypto.randomUUID(),
    type: "WebSweepNode",
    position: position ?? { x: 0, y: 0 },
    data: {
      type: nodeType,
      inputs: {}
    }
  };
}
