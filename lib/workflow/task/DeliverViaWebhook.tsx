import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import {
  CodeIcon,
  GlobeIcon,
  LucideProps,
  MousePointerClick,
  SendIcon,
  TextIcon
} from "lucide-react";

/**
 * DeliverViaWebhookTask
 *
 * Defines the configuration for the "Deliver via Webhook" workflow task.
 * This task is designed to send data to an external endpoint via an HTTP POST request.
 * It requires two inputs:
 *  - "Target URL": A string representing the URL to which the request should be sent.
 *  - "Body": A string representing the payload to include in the POST request.
 *
 * The task does not produce any outputs.
 *
 * @property {TaskType} type - The unique identifier for this task type.
 * @property {string} label - The display name of the task.
 * @property {(props: LucideProps) => JSX.Element} icon - A function that renders the icon for the task.
 * @property {boolean} isEntryPoint - Indicates whether this task can serve as an entry point in the workflow (false in this case).
 * @property {number} credits - The number of credits consumed when this task is executed.
 * @property {readonly Array<{ name: string; type: TaskParamType; required: boolean }>} inputs - The required inputs for the task.
 * @property {readonly any[]} outputs - The outputs produced by the task (empty array since there are none).
 *
 * @satisfies {WorkflowTask}
 */
export const DeliverViaWebhookTask = {
  type: TaskType.DELIVER_VIA_WEBHOOK,
  label: "Deliver via Webhook",
  icon: (props: LucideProps) => (
    <SendIcon className="stroke-blue-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Target URL",
      type: TaskParamType.STRING,
      required: true
    },
    {
      name: "Body",
      type: TaskParamType.STRING,
      required: true
    }
  ] as const,
  outputs: [] as const
} satisfies WorkflowTask;
