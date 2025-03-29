"use client";

import { Input } from "@/components/ui/input";
import { TaskParam, TaskParamType } from "@/types/task";
import StringParam from "@/app/workflow/_components/nodes/param/StringParam";
import { useReactFlow } from "@xyflow/react";
import { AppNode } from "@/types/appNodes";
import { useCallback } from "react";
import BrowserInstanceParam from "@/app/workflow/_components/nodes/param/BrowserInstanceParam";
import SelectParam from "@/app/workflow/_components/nodes/param/SelectParam";
import CredentialsParam from "@/app/workflow/_components/nodes/param/CredentialsParam";

/**
 * NodeParamField Component.
 *
 * Renders the appropriate input field for a node parameter based on its type.
 * It utilizes the React Flow context to retrieve and update the node's input data.
 *
 * @param {Object} props - Component properties.
 * @param {TaskParam} props.param - The parameter configuration for the node.
 * @param {string} props.nodeId - The unique identifier of the node.
 * @param {boolean} props.disabled - Indicates whether the input should be disabled.
 * @returns {JSX.Element} The rendered parameter input field.
 */
export default function NodeParamField({
  param,
  nodeId,
  disabled
}: {
  param: TaskParam;
  nodeId: string;
  disabled: boolean;
}) {
  // Access update and retrieval functions from the React Flow context.
  const { updateNodeData, getNode } = useReactFlow();
  // Retrieve the node object based on its ID and cast it to AppNode.
  const node = getNode(nodeId) as AppNode;
  // Get the current value of the parameter from the node's inputs.
  const value = node?.data.inputs?.[param.name];

  /**
   * updateNodeParamValue Callback.
   *
   * Updates the node's input value for the given parameter by merging the new value
   * with the existing inputs in the node's data.
   *
   * @param {string} newValue - The new value to set for the parameter.
   */
  const updateNodeParamValue = useCallback(
    (newValue: string) => {
      updateNodeData(nodeId, {
        inputs: {
          ...node?.data.inputs,
          [param.name]: newValue
        }
      });
    },
    [nodeId, updateNodeData, param.name, node?.data.inputs]
  );

  // Render the corresponding parameter component based on the parameter type.
  switch (param.type) {
    case TaskParamType.STRING:
      return (
        <StringParam
          param={param}
          value={value}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );
    case TaskParamType.SELECT:
      return (
        <SelectParam
          param={param}
          value={value}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );
    case TaskParamType.CREDENTIAL:
      return (
        <CredentialsParam
          param={param}
          value={value}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );
    case TaskParamType.BROWSER_INSTANCE:
      return (
        <BrowserInstanceParam
          param={param}
          value={""}
          updateNodeParamValue={updateNodeParamValue}
        />
      );
    default:
      // For any unhandled parameter type, display a "Not Implemented" message.
      return (
        <div className="w-full">
          <p className="text-xs text-muted-foreground">Not Implemented</p>
        </div>
      );
  }
}
