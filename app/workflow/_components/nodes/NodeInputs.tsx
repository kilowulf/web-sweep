import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position, useEdges } from "@xyflow/react";
import { ReactNode } from "react";
import NodeParamField from "@/app/workflow/_components/nodes/NodeParamField";
import { ColorForHandle } from "@/app/workflow/_components/nodes/common";
import useFlowValidation from "@/components/hooks/useFlowValidation";

/**
 * NodeInputs Component.
 *
 * A simple container that arranges its children in a vertical column with dividers.
 *
 * @param {Object} props - Component props.
 * @param {ReactNode} props.children - Child elements to be rendered inside the container.
 * @returns {JSX.Element} A container for node inputs.
 */
export function NodeInputs({ children }: { children: ReactNode }) {
  return <div className="flex flex-col divide-y gap-2">{children}</div>;
}

/**
 * NodeInput Component.
 *
 * Renders an individual node input field with validation and connection status.
 * It displays a parameter field and conditionally renders a connection handle.
 * The handle is only rendered if the input is not marked to hide the handle.
 * Styling of the input container changes if there are validation errors.
 *
 * @param {Object} props - Component props.
 * @param {TaskParam} props.input - The parameter data for this input.
 * @param {string} props.nodeId - The unique identifier for the node.
 * @returns {JSX.Element} The rendered node input component.
 */
export function NodeInput({
  input,
  nodeId
}: {
  input: TaskParam;
  nodeId: string;
}) {
  // Retrieve invalid input data from flow validation hook.
  const { invalidInputs } = useFlowValidation();
  // Get the current edges from the React Flow context.
  const edges = useEdges();

  // Determine if the input is connected by checking for an edge that targets this node and input.
  const isConnected = edges.some(
    (edge) => edge.target === nodeId && edge.targetHandle === input.name
  );

  // Check if there are any validation errors for this input.
  const hasErrors = invalidInputs
    ?.find((node) => node.nodeId === nodeId)
    ?.inputs.find((invalidInput) => invalidInput === input.name);

  return (
    <div
      className={cn(
        "flex justify-start relative p-3 bg-secondary w-full",
        // Apply error styling if the input has validation errors.
        hasErrors && "bg-destructive border-2"
      )}
    >
      {/* Render the node parameter field with the input data.
          Disable the field if the input is already connected. */}
      <NodeParamField param={input} nodeId={nodeId} disabled={isConnected} />

      {/* Render the connection handle unless the input is marked to hide it. */}
      {!input.hideHandle && (
        <Handle
          id={input.name}
          isConnectable={!isConnected}
          type="target"
          position={Position.Left}
          className={cn(
            "!bg-mute-foreground !border-2 !border-background !-left-2 !w-4 !h-4",
            // Use a color class based on the input type.
            ColorForHandle[input.type]
          )}
        />
      )}
    </div>
  );
}
