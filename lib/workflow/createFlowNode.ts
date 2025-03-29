import { AppNode } from "@/types/appNodes";
import { TaskType } from "@/types/task";

/**
 * CreateFlowNode
 *
 * Creates a new flow node for the workflow editor.
 *
 * This function generates a new AppNode with a unique ID, a fixed type ("WebSweepNode"),
 * and an optional position. The node's data is initialized with the provided task type and
 * an empty inputs object.
 *
 * @param {TaskType} nodeType - The type of the task to associate with this node.
 * @param {{ x: number; y: number }} [position] - Optional position object specifying the x and y coordinates.
 * @returns {AppNode} A newly created flow node.
 */
export function CreateFlowNode(
  nodeType: TaskType,
  position?: { x: number; y: number }
): AppNode {
  return {
    id: crypto.randomUUID(),
    type: "WebSweepNode",
    dragHandle: ".drag-handle",
    position: position ?? { x: 0, y: 0 },
    data: {
      type: nodeType,
      inputs: {}
    }
  };
}
