import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import {
  CodeIcon,
  FileJson2Icon,
  GlobeIcon,
  LucideProps,
  MousePointerClick,
  TextIcon
} from "lucide-react";

/**
 * ReadPropertyFromJsonTask
 *
 * Defines the configuration for the "Read property from JSON object" workflow task.
 * This task extracts a specified property value from a JSON object.
 *
 * Inputs:
 * - "JSON": A string representing a JSON object. This input is required.
 * - "Property name": A string specifying the key whose value should be extracted from the JSON. This input is required.
 *
 * Output:
 * - "Property value": A string containing the value of the specified property from the JSON object.
 *
 * @property {TaskType} type - The unique identifier for this task.
 * @property {string} label - The display name of the task.
 * @property {(props: LucideProps) => JSX.Element} icon - A function returning the icon component for the task.
 * @property {boolean} isEntryPoint - Specifies that this task is not an entry point in the workflow.
 * @property {number} credits - The number of credits consumed when executing this task.
 * @property {readonly Array<{ name: string; type: TaskParamType; required: boolean }>} inputs - The required inputs for the task.
 * @property {readonly Array<{ name: string; type: TaskParamType }>} outputs - The outputs produced by the task.
 *
 * @satisfies {WorkflowTask}
 */
export const ReadPropertyFromJsonTask = {
  type: TaskType.READ_PROPERTY_FROM_JSON,
  label: "Read property from JSON object",
  icon: (props: LucideProps) => (
    <FileJson2Icon className="stroke-orange-400" {...props} />
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
    }
  ] as const,
  outputs: [
    {
      name: "Property value",
      type: TaskParamType.STRING
    }
  ] as const
} satisfies WorkflowTask;
