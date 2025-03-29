import { LaunchBrowserTask } from "@/lib/workflow/task/LaunchBrowser";
import { PageToHtmlTask } from "./PageToHtml";
import { ExtractTextFromElementTask } from "@/lib/workflow/task/ExtractTextFromElement";
import { TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { FillInputTask } from "@/lib/workflow/task/FillInput";
import { ClickElementTask } from "@/lib/workflow/task/ClickElement";
import { WaitForElementTask } from "@/lib/workflow/task/WaitForElement";
import { DeliverViaWebhookTask } from "@/lib/workflow/task/DeliverViaWebhook";
import { ExtractDataWithAITask } from "@/lib/workflow/task/ExtractDataWithAI";
import { ReadPropertyFromJsonTask } from "@/lib/workflow/task/ReadPropertyFromJson";
import { AddPropertyToJsonTask } from "@/lib/workflow/task/AddPropertyToJson";
import { NavigateUrlTask } from "@/lib/workflow/task/NavigateUrlTask";
import { ScrollToElementTask } from "@/lib/workflow/task/ScrollToElement";

/**
 * Registry is a mapping from each TaskType to its corresponding WorkflowTask configuration.
 *
 * Each key in the registry corresponds to a task type, and its value contains the configuration
 * for that task including its label, icon, inputs, outputs, and other metadata.
 *
 * @typedef {Object} Registry
 * @property {WorkflowTask & { type: K }} [K in TaskType] - The workflow task configuration for the task type.
 */
type Registry = {
  [K in TaskType]: WorkflowTask & { type: K };
};

/**
 * TaskRegistry
 *
 * A centralized registry that maps each workflow task type (TaskType) to its corresponding task configuration.
 * This registry is used throughout the application to dynamically access task definitions.
 *
 * @type {Registry}
 */
export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
  FILL_INPUT: FillInputTask,
  CLICK_ELEMENT: ClickElementTask,
  WAIT_FOR_ELEMENT: WaitForElementTask,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookTask,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAITask,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonTask,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonTask,
  NAVIGATE_URL: NavigateUrlTask,
  SCROLL_TO_ELEMENT: ScrollToElementTask
};
