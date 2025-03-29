"use client";

import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position } from "@xyflow/react";
import React, { ReactNode } from "react";
import { ColorForHandle } from "@/app/workflow/_components/nodes/common";

/**
 * NodeOutputs Component.
 *
 * A container component that arranges its child output elements in a vertical layout,
 * separated by dividers. This is used to group multiple node output elements together.
 *
 * @param {Object} props - Component props.
 * @param {ReactNode} props.children - The output elements to be rendered within the container.
 * @returns {JSX.Element} The rendered container for node outputs.
 */
export function NodeOutputs({ children }: { children: ReactNode }) {
  return <div className="flex flex-col divide-y gap-1">{children}</div>;
}

/**
 * NodeOutput Component.
 *
 * Renders an individual node output element. It displays the name of the output and
 * renders a connection handle on the right side. The handle is styled with a background
 * color determined by the output type using the ColorForHandle mapping.
 *
 * @param {Object} props - Component props.
 * @param {TaskParam} props.output - The task parameter representing the output details.
 * @returns {JSX.Element} The rendered node output element with a connection handle.
 */
export function NodeOutput({ output }: { output: TaskParam }) {
  return (
    <div className="flex justify-end relative p-3 bg-secondary">
      <p className="text-xs text-muted-foreground"> {output.name}</p>
      <Handle
        id={output.name}
        type="source"
        position={Position.Right}
        className={cn(
          "!bg-muted-foreground !border-2 !border-background !-right-2 !w-4 !h-4",
          ColorForHandle[output.type]
        )}
      />
    </div>
  );
}
