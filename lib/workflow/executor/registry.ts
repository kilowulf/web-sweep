import { LaunchBrowserExecutor } from "@/lib/workflow/executor/LaunchBrowserExecutor";
import { PageToHtmlExecutor } from "@/lib/workflow/executor/PageToHtmlExecutor";
import { ExecutionEnvironment } from "@/types/executor";
import { TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { ExtractTextFromElementExecutor } from "@/lib/workflow/executor/ExtractTextFromElementExecutor";
import { FillInputExecutor } from "@/lib/workflow/executor/FillInputExecutor";
import { ClickElementExecutor } from "@/lib/workflow/executor/ClickElementExecutor";
import { WaitForElementExecutor } from "@/lib/workflow/executor/WaitForElementExecutor";
import { DeliverViaWebhookExecutor } from "@/lib/workflow/executor/DeliverViaWebhookExecutor";
import { ExtractDataWithAIExecutor } from "@/lib/workflow/executor/ExtractDataWithAIExecutor";
import { ReadPropertyFromJsonExecutor } from "@/lib/workflow/executor/ReadPropertyFromJsonExecutor";
import { AddPropertyToJsonExecutor } from "@/lib/workflow/executor/AddPropertyToJsonExecutor";
import { NavigateUrlExecutor } from "@/lib/workflow/executor/NavigateUrlExecutor";
import { ScrollToElementExecutor } from "@/lib/workflow/executor/ScrollToElementExecutor";

/**
 * ExecutorFn is a type alias for an executor function that takes an execution environment
 * for a specific workflow task and returns a promise that resolves to a boolean.
 *
 * @template T - The type of workflow task.
 */
type ExecutorFn<T extends WorkflowTask> = (
  environment: ExecutionEnvironment<T>
) => Promise<boolean>;

/**
 * RegistryType is a mapping of TaskType values to their corresponding executor functions.
 * Each task type key maps to an executor function that handles that specific task.
 */
type RegistryType = {
  [K in TaskType]: ExecutorFn<WorkflowTask & { type: K }>;
};

/**
 * ExecutorRegistry is a centralized registry that maps each workflow task type to its
 * corresponding executor function. This registry is used to dynamically execute tasks
 * based on their type.
 */
export const ExecutorRegistry: RegistryType = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
  FILL_INPUT: FillInputExecutor,
  CLICK_ELEMENT: ClickElementExecutor,
  WAIT_FOR_ELEMENT: WaitForElementExecutor,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookExecutor,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAIExecutor,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonExecutor,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonExecutor,
  NAVIGATE_URL: NavigateUrlExecutor,
  SCROLL_TO_ELEMENT: ScrollToElementExecutor
};
