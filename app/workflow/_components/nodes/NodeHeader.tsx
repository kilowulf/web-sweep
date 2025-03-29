"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { AppNode } from "@/types/appNodes";
import { TaskType } from "@/types/task";
import { useReactFlow } from "@xyflow/react";
import { CoinsIcon, CopyIcon, GripVerticalIcon, TrashIcon } from "lucide-react";
import React from "react";

/**
 * NodeHeader Component.
 *
 * This component renders the header section for a workflow node.
 * It displays the task icon, label, credits, and a set of action buttons such as
 * delete, duplicate, and a drag handle.
 * - If the task is marked as an entry point, it displays an "Entry point" badge.
 * - For non-entry point tasks, it provides buttons to delete the node and to duplicate it.
 * - The drag handle button enables moving the node.
 *
 * @param {Object} props - Component props.
 * @param {TaskType} props.taskType - The type of the task associated with the node.
 * @param {string} props.nodeId - The unique identifier of the node.
 * @returns {JSX.Element} The rendered node header component.
 */
export default function NodeHeader({
  taskType,
  nodeId
}: {
  taskType: TaskType;
  nodeId: string;
}) {
  // Retrieve the task configuration from the registry based on the task type.
  const task = TaskRegistry[taskType];
  // Get functions from the React Flow context to manipulate nodes.
  const { deleteElements, getNode, addNodes } = useReactFlow();

  return (
    <div className="flex items-center gap-2 p-2">
      {/* Render the task icon with a fixed size */}
      <task.icon size={16} />
      <div className="flex justify-between items-center w-full">
        {/* Render the task label in uppercase */}
        <p className="text-xs font-bold uppercase text-muted-foreground">
          {task.label}
        </p>
        <div className="flex gap-1 items-center">
          {/* If the task is an entry point, display an "Entry point" badge */}
          {task.isEntryPoint && <Badge>Entry point</Badge>}
          {/* Display a badge with credits information */}
          <Badge className="gap-2 flex items-center text-xs">
            <CoinsIcon size={16} />
            {task.credits}
          </Badge>
          {/* Render delete and duplicate buttons only for non-entry point tasks */}
          {!task.isEntryPoint && (
            <>
              {/* Delete node button */}
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => {
                  deleteElements({ nodes: [{ id: nodeId }] });
                }}
              >
                <TrashIcon size={12} />
              </Button>
              {/* Duplicate node button */}
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => {
                  const node = getNode(nodeId) as AppNode;
                  const newX = node.position.x;
                  const newY = node.position.y + node.measured?.height! + 20;
                  const newNode = CreateFlowNode(node.data.type, {
                    x: newX,
                    y: newY
                  });
                  addNodes([newNode]);
                }}
              >
                <CopyIcon size={12} />
              </Button>
            </>
          )}
          {/* Drag handle button to enable node movement */}
          <Button
            variant={"ghost"}
            size={"icon"}
            className="drag-handle cursor-grab"
          >
            <GripVerticalIcon size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
