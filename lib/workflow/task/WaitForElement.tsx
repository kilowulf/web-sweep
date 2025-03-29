import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import {
  CodeIcon,
  EyeIcon,
  GlobeIcon,
  LucideProps,
  MousePointerClick,
  TextIcon
} from "lucide-react";

/**
 * WaitForElementTask
 *
 * Defines the configuration for the "Wait for element" workflow task.
 * This task instructs a browser instance to wait for a specific element to reach a desired visibility state.
 *
 * Inputs:
 * - "webpage": A browser instance (BROWSER_INSTANCE) on which the wait operation is executed.
 * - "Selector": A string (STRING) representing the CSS selector to identify the target element.
 * - "Visibility": A select input (SELECT) with options "visible" and "hidden" indicating the desired visibility state.
 *
 * Output:
 * - "Web page": The updated browser instance (BROWSER_INSTANCE) after the wait condition is met.
 *
 * Additional Details:
 * - This task is not an entry point.
 * - It consumes 1 credit upon execution.
 *
 * @satisfies {WorkflowTask}
 */
export const WaitForElementTask = {
  type: TaskType.WAIT_FOR_ELEMENT,
  label: "Wait for element",
  icon: (props: LucideProps) => (
    <EyeIcon className="stroke-amber-400" {...props} />
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
    },
    {
      name: "Visibility",
      type: TaskParamType.SELECT,
      hideHandle: true,
      required: true,
      options: [
        { label: "Visible", value: "visible" },
        { label: "Hidden", value: "hidden" }
      ]
    }
  ] as const,
  outputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSER_INSTANCE
    }
  ] as const
} satisfies WorkflowTask;
