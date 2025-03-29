import { Node } from "@xyflow/react";
import { TaskParam, TaskType } from "@/types/task";

/**
 * AppNodeData interface.
 *
 * Represents the data structure for a workflow node.
 * It includes the type of the task, a record of input values, and may contain additional properties.
 *
 * @property {TaskType} type - The type of task associated with this node.
 * @property {Record<string, string>} inputs - A mapping of input names to their values.
 * @property {any} [key: string] - Any additional properties that may be associated with the node.
 */
export interface AppNodeData {
  type: TaskType;
  inputs: Record<string, string>;
  [key: string]: any;
}

/**
 * AppNode interface.
 *
 * Extends the base Node interface from React Flow to include specific workflow node data.
 *
 * @extends {Node}
 * @property {AppNodeData} data - The data associated with the workflow node.
 */
export interface AppNode extends Node {
  data: AppNodeData;
}

/**
 * ParamProps interface.
 *
 * Defines the props for a parameter input field component used within a workflow node.
 *
 * @property {TaskParam} param - The parameter configuration.
 * @property {string} value - The current value of the parameter.
 * @property {(newValue: string) => void} updateNodeParamValue - Function to update the parameter value.
 * @property {boolean} [disabled] - Optional flag to disable the input field.
 */
export interface ParamProps {
  param: TaskParam;
  value: string;
  updateNodeParamValue: (newValue: string) => void;
  disabled?: boolean;
}

/**
 * AppNodeMissingInputs type.
 *
 * Represents the structure for reporting missing inputs in a workflow node.
 *
 * @property {string} nodeId - The identifier of the node with missing inputs.
 * @property {string[]} inputs - An array of input names that are missing or invalid.
 */
export type AppNodeMissingInputs = {
  nodeId: string;
  inputs: string[];
};
