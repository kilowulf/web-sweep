import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { CodeIcon, GlobeIcon, LucideProps } from "lucide-react";

/**
 * PageToHtmlTask
 *
 * Defines the configuration for the "Get html from page" workflow task.
 * This task retrieves the HTML content from a given browser instance.
 *
 * Inputs:
 * - "Web page": A browser instance (BROWSER_INSTANCE) on which the HTML content is retrieved.
 *
 * Outputs:
 * - "HTML": A string containing the HTML content of the page.
 * - "Web page": The updated browser instance after retrieving the HTML content.
 *
 * @property {TaskType} type - The unique identifier for this task.
 * @property {string} label - The display name of the task.
 * @property {(props: LucideProps) => JSX.Element} icon - A function that returns the icon component for the task.
 * @property {boolean} isEntryPoint - Indicates whether this task can serve as an entry point in the workflow.
 * @property {number} credits - The number of credits required to execute this task.
 * @property {readonly Array<{ name: string; type: TaskParamType; required: boolean }>} inputs - The list of inputs required by the task.
 * @property {readonly Array<{ name: string; type: TaskParamType }>} outputs - The outputs produced by the task.
 *
 * @satisfies {WorkflowTask}
 */
export const PageToHtmlTask = {
  type: TaskType.PAGE_TO_HTML,
  label: "Get html from page",
  icon: (props: LucideProps) => (
    <CodeIcon className="stroke-rose-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE,
      required: true
    }
  ] as const,
  outputs: [
    { name: "HTML", type: TaskParamType.STRING },
    { name: "Web page", type: TaskParamType.BROWSER_INSTANCE }
  ] as const
} satisfies WorkflowTask;
