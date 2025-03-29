import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { ArrowUpIcon, LucideProps } from "lucide-react";

/**
 * ScrollToElementTask
 *
 * Defines the configuration for the "Scroll to element" workflow task.
 * This task scrolls a given browser instance to a specific element identified by a CSS selector.
 *
 * Inputs:
 * - "webpage": A browser instance (BROWSER_INSTANCE) on which the scroll action is executed.
 * - "Selector": A string specifying the CSS selector for the element to scroll to.
 *
 * Output:
 * - "Web page": The updated browser instance after scrolling.
 *
 * @property {TaskType} type - The unique task type identifier.
 * @property {string} label - The display label for the task.
 * @property {(props: LucideProps) => JSX.Element} icon - A function that returns the icon component for the task.
 * @property {boolean} isEntryPoint - Indicates that this task is not an entry point in the workflow.
 * @property {number} credits - The number of credits consumed when executing this task.
 * @property {readonly Array<{ name: string; type: TaskParamType; required: boolean }>} inputs - The inputs required by the task.
 * @property {readonly Array<{ name: string; type: TaskParamType }>} outputs - The outputs produced by the task.
 *
 * @satisfies {WorkflowTask}
 */
export const ScrollToElementTask = {
  type: TaskType.SCROLL_TO_ELEMENT,
  label: "Scroll to element",
  icon: (props: LucideProps) => (
    <ArrowUpIcon className="stroke-orange-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "webpage",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true
    },
    {
      name: "Selector",
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
