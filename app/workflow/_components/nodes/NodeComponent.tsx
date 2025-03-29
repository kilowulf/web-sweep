import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import NodeCard from "@/app/workflow/_components/nodes/NodeCard";
import NodeHeader from "@/app/workflow/_components/nodes/NodeHeader";
import { AppNodeData } from "@/types/appNodes";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  NodeInput,
  NodeInputs
} from "@/app/workflow/_components/nodes/NodeInputs";
import {
  NodeOutputs,
  NodeOutput
} from "@/app/workflow/_components/nodes/NodeOutputs";
import { Badge } from "@/components/ui/badge";

/**
 * DEV_MODE flag to enable development-specific UI elements.
 * It checks the NEXT_PUBLIC_DEV_MODE environment variable.
 */
const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";

/**
 * NodeComponent.
 *
 * This component represents a node within the workflow diagram.
 * It is memoized for performance optimization and uses a variety of sub-components
 * (NodeCard, NodeHeader, NodeInputs, and NodeOutputs) to display the node's content,
 * inputs, and outputs. Additionally, if in development mode, it displays a badge showing the node's ID.
 *
 * @param {NodeProps} props - The properties passed to the node component.
 * @param {string} props.id - The unique identifier for the node.
 * @param {boolean} [props.selected] - Indicates whether the node is currently selected.
 * @param {any} props.data - The data associated with the node, expected to conform to AppNodeData.
 * @returns {JSX.Element} The rendered node component.
 */
const NodeComponent = memo((props: NodeProps) => {
  // Cast the node data to the expected AppNodeData type.
  const nodeData = props.data as AppNodeData;
  // Retrieve task configuration from the registry based on node type.
  const task = TaskRegistry[nodeData.type];

  return (
    <NodeCard nodeId={props.id} isSelected={!!props.selected}>
      {DEV_MODE && <Badge>DEV: {props.id}</Badge>}
      <NodeHeader taskType={nodeData.type} nodeId={props.id} />
      <NodeInputs>
        {task.inputs.map((input) => (
          <NodeInput key={input.name} input={input} nodeId={props.id} />
        ))}
      </NodeInputs>
      <NodeOutputs>
        {task.outputs.map((output) => (
          <NodeOutput key={output.name} output={output} />
        ))}
      </NodeOutputs>
    </NodeCard>
  );
});

export default NodeComponent;

// Set a display name for debugging purposes.
NodeComponent.displayName = "NodeComponent";
