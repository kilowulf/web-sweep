import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { CodeIcon, Edit3Icon, GlobeIcon, LucideProps } from "lucide-react";

/**
 * FillInputTask
 *
 * Defines the configuration for the "Fill input elements" workflow task.
 * This task simulates typing into an input element on a web page.
 * It requires the following inputs:
 * - "Web page": A browser instance (BROWSER_INSTANCE) on which the action will be performed.
 * - "Selector": A CSS selector (STRING) to locate the input element.
 * - "Value": A string (STRING) to be typed into the input element.
 *
 * The task outputs the updated browser instance.
 *
 * @property {TaskType} type - The unique identifier for this task.
 * @property {string} label - The display name of the task.
 * @property {(props: LucideProps) => JSX.Element} icon - A function that returns the icon component for the task.
 * @property {boolean} isEntryPoint - Specifies whether this task can serve as an entry point in the workflow.
 * @property {number} credits - The number of credits consumed when executing this task.
 * @property {readonly Array<{ name: string; type: TaskParamType; required: boolean }>} inputs - The list of inputs required for the task.
 * @property {readonly Array<{ name: string; type: TaskParamType }>} outputs - The outputs produced by the task.
 *
 * @satisfies {WorkflowTask}
 */
export const FillInputTask = {
  type: TaskType.FILL_INPUT,
  label: "Fill input elements",
  icon: (props: LucideProps) => (
    <Edit3Icon className="stroke-orange-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true
    },
    {
      name: "Selector",
      type: TaskParamType.STRING,
      required: true
    },
    {
      name: "Value",
      type: TaskParamType.STRING,
      required: true
    }
  ] as const,
  outputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE
    }
  ] as const
} satisfies WorkflowTask;
