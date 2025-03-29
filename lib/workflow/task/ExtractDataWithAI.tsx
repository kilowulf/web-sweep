import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import {
  BrainIcon,
  CodeIcon,
  GlobeIcon,
  LucideProps,
  MousePointerClick,
  TextIcon
} from "lucide-react";

/**
 * ExtractDataWithAITask
 *
 * Defines the configuration for the "Extract data with AI" workflow task.
 * This task leverages an AI service to extract structured data from provided content based on a prompt.
 * It requires three inputs:
 * - "Content": A string containing the text or HTML content from which data is to be extracted.
 * - "Credentials": A credential input for authenticating with the AI service.
 * - "Prompt": A string (rendered as a textarea) containing instructions for the AI on what data to extract.
 *
 * The task outputs the extracted data as a string.
 *
 * @property {TaskType} type - The unique identifier for this task.
 * @property {string} label - The display name of the task.
 * @property {(props: LucideProps) => JSX.Element} icon - A function that returns the task icon component.
 * @property {boolean} isEntryPoint - Specifies that this task is not an entry point in the workflow.
 * @property {number} credits - The number of credits consumed when executing this task.
 * @property {readonly Array<{ name: string; type: TaskParamType; required: boolean; variant?: string }>} inputs - The list of inputs required by the task.
 * @property {readonly Array<{ name: string; type: TaskParamType }>} outputs - The list of outputs produced by the task.
 *
 * @satisfies {WorkflowTask}
 */
export const ExtractDataWithAITask = {
  type: TaskType.EXTRACT_DATA_WITH_AI,
  label: "Extract data with AI",
  icon: (props: LucideProps) => (
    <BrainIcon className="stroke-rose-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 4,
  inputs: [
    {
      name: "Content",
      type: TaskParamType.STRING,
      required: true
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true
    },
    {
      name: "Prompt",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea"
    }
  ] as const,
  outputs: [
    {
      name: "Extracted data",
      type: TaskParamType.STRING
    }
  ] as const
} satisfies WorkflowTask;
