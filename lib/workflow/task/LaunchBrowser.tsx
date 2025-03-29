import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { GlobeIcon, LucideProps } from "lucide-react";

/**
 * LaunchBrowserTask
 *
 * Defines the configuration for the "Launch browser" workflow task.
 * This task launches a browser instance and navigates to a specified website URL.
 * It is marked as an entry point, meaning it can initiate a workflow.
 *
 * Inputs:
 * - "Website Url": A string representing the URL to navigate to. A helper text is provided to show an example URL.
 *   The input is required and the handle is hidden since it doesn't need to be connected to other tasks.
 *
 * Outputs:
 * - "Web page": A browser instance (BROWSER_INSTANCE) representing the launched web page.
 *
 * @property {TaskType} type - The unique identifier for this task.
 * @property {string} label - The display name of the task.
 * @property {(props: LucideProps) => JSX.Element} icon - A function that renders the task's icon.
 * @property {boolean} isEntryPoint - Indicates that this task can be used as an entry point in the workflow.
 * @property {number} credits - The number of credits required to execute this task.
 * @property {readonly Array<{ name: string; type: TaskParamType; required: boolean; helperText?: string; hideHandle?: boolean }>} inputs - The inputs required by the task.
 * @property {readonly Array<{ name: string; type: TaskParamType }>} outputs - The outputs produced by the task.
 *
 * @satisfies {WorkflowTask}
 */
export const LaunchBrowserTask = {
  type: TaskType.LAUNCH_BROWSER,
  label: "Launch browser",
  icon: (props: LucideProps) => (
    <GlobeIcon className="stroke-pink-400" {...props} />
  ),
  isEntryPoint: true,
  credits: 5,
  inputs: [
    {
      name: "Website Url",
      type: TaskParamType.STRING,
      helperText: "eg: https://github.com/",
      required: true,
      hideHandle: true
    }
  ] as const,
  outputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE
    }
  ] as const
} satisfies WorkflowTask;
