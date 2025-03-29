import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { DatabaseIcon, LucideProps } from "lucide-react";

/**
 * AddPropertyToJsonTask
 *
 * Defines the configuration for the "Add Property to JSON" workflow task.
 * This task takes a JSON string along with a property name and value as inputs,
 * and outputs an updated JSON string with the new property added.
 *
 * @property {TaskType} type - The task type identifier.
 * @property {string} label - The display label for the task.
 * @property {(props: LucideProps) => JSX.Element} icon - A function returning the icon component for the task.
 * @property {boolean} isEntryPoint - Indicates if this task is an entry point in the workflow.
 * @property {number} credits - The number of credits required to execute this task.
 * @property {readonly Array<{ name: string; type: TaskParamType; required: boolean }>} inputs - The list of required inputs.
 * @property {readonly Array<{ name: string; type: TaskParamType }>} outputs - The list of outputs produced by the task.
 *
 * @satisfies {WorkflowTask}
 */
export const AddPropertyToJsonTask = {
  type: TaskType.ADD_PROPERTY_TO_JSON,
  label: "Add property to JSON",
  icon: (props: LucideProps) => (
    <DatabaseIcon className="stroke-orange-600" {...props} />
  ),
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "JSON",
      type: TaskParamType.STRING,
      required: true
    },
    {
      name: "Property name",
      type: TaskParamType.STRING,
      required: true
    },
    {
      name: "Property value",
      type: TaskParamType.STRING,
      required: true
    }
  ] as const,
  outputs: [
    {
      name: "Updated JSON",
      type: TaskParamType.STRING
    }
  ] as const
} satisfies WorkflowTask;
