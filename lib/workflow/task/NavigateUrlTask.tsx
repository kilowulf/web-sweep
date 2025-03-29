import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Link2Icon, LucideProps } from "lucide-react";

/**
 * NavigateUrlTask
 *
 * This workflow task configuration defines the "Navigate Url" task.
 * It instructs a browser instance to navigate to a specified URL.
 *
 * Inputs:
 * - "webpage": A browser instance (BROWSER_INSTANCE) where the navigation is executed.
 * - "URL": A string that specifies the target URL.
 *
 * Output:
 * - "Web page": The updated browser instance after the navigation has occurred.
 *
 * @property {TaskType} type - Unique identifier for the task.
 * @property {string} label - The display name of the task.
 * @property {(props: LucideProps) => JSX.Element} icon - A function that returns the icon component for the task.
 * @property {boolean} isEntryPoint - Indicates whether this task can serve as an entry point in the workflow.
 * @property {number} credits - The number of credits required to execute the task.
 * @property {readonly Array<{ name: string; type: TaskParamType; required: boolean }>} inputs - The list of inputs required by the task.
 * @property {readonly Array<{ name: string; type: TaskParamType }>} outputs - The outputs produced by the task.
 *
 * @satisfies {WorkflowTask}
 */
export const NavigateUrlTask = {
  type: TaskType.NAVIGATE_URL,
  label: "Navigate Url",
  icon: (props: LucideProps) => (
    <Link2Icon className="stroke-orange-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "webpage",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true
    },
    {
      name: "URL",
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
