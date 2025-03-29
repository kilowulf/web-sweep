import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import {
  CodeIcon,
  GlobeIcon,
  LucideProps,
  MousePointerClick,
  TextIcon
} from "lucide-react";

/**
 * ClickElementTask
 *
 * Defines the configuration for the "Click Element" workflow task.
 * This task is used to simulate a click action on a web page element.
 * It takes two inputs:
 * - "webpage": A browser instance (BROWSER_INSTANCE) where the action is to be performed.
 * - "Selector": A CSS selector (STRING) that identifies the element to click.
 *
 * The task outputs the updated browser instance as "Web page" (BROWSER_INSTANCE).
 *
 * @property {TaskType} type - The unique task type identifier.
 * @property {string} label - The display label for the task.
 * @property {(props: LucideProps) => JSX.Element} icon - A function that returns the icon component for the task.
 * @property {boolean} isEntryPoint - Indicates whether the task can serve as an entry point in the workflow.
 * @property {number} credits - The number of credits consumed when executing the task.
 * @property {readonly Array<{ name: string; type: TaskParamType; required: boolean }>} inputs - The inputs required for the task.
 * @property {readonly Array<{ name: string; type: TaskParamType }>} outputs - The outputs produced by the task.
 *
 * @satisfies {WorkflowTask}
 */
export const ClickElementTask = {
  type: TaskType.CLICK_ELEMENT,
  label: "Click element",
  icon: (props: LucideProps) => (
    <MousePointerClick className="stroke-orange-400" {...props} />
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
