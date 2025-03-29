import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { CodeIcon, GlobeIcon, LucideProps, TextIcon } from "lucide-react";

/**
 * ExtractTextFromElementTask
 *
 * Defines the configuration for the "Extract text from element" workflow task.
 * This task is designed to extract textual content from a provided HTML string based on a CSS selector.
 *
 * Inputs:
 * - "Html": A string (rendered as a textarea) that contains the HTML content.
 * - "Selector": A string that specifies the CSS selector for the element from which to extract text.
 *
 * Output:
 * - "Extracted text": A string representing the text extracted from the specified element.
 *
 * @property {TaskType} type - The unique identifier for this task.
 * @property {string} label - The display name of the task.
 * @property {(props: LucideProps) => JSX.Element} icon - A function that renders the task's icon.
 * @property {boolean} isEntryPoint - Indicates whether this task can serve as an entry point in the workflow.
 * @property {number} credits - The number of credits consumed when executing this task.
 * @property {readonly Array<{ name: string; type: TaskParamType; required: boolean; variant?: string }>} inputs - The list of inputs required by the task.
 * @property {readonly Array<{ name: string; type: TaskParamType }>} outputs - The outputs produced by the task.
 *
 * @satisfies {WorkflowTask}
 */
export const ExtractTextFromElementTask = {
  type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
  label: "Extract text from element",
  icon: (props: LucideProps) => (
    <TextIcon className="stroke-rose-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 2,
  inputs: [
    {
      name: "Html",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea"
    },
    {
      name: "Selector",
      type: TaskParamType.STRING,
      required: true
    }
  ] as const,
  outputs: [
    {
      name: "Extracted text",
      type: TaskParamType.STRING
    }
  ] as const
} satisfies WorkflowTask;
