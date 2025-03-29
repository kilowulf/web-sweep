import { ExecutionEnvironment } from "@/types/executor";
import { ClickElementTask } from "@/lib/workflow/task/ClickElement";

/**
 * ClickElementExecutor
 *
 * Executes the "Click Element" task by retrieving a selector from the execution environment
 * and triggering a click action on the corresponding element on the page.
 *
 * The function logs an error if the "Selector" input is missing, and returns a boolean
 * indicating the success of the operation. In case of any error during the click action,
 * the error is logged and the function returns false.
 *
 * @param {ExecutionEnvironment<typeof ClickElementTask>} environment - The execution environment containing inputs, logging, and page methods.
 * @returns {Promise<boolean>} A promise that resolves to true if the click action succeeds, or false if an error occurs.
 */
export async function ClickElementExecutor(
  environment: ExecutionEnvironment<typeof ClickElementTask>
): Promise<boolean> {
  try {
    // Retrieve the selector input from the execution environment.
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("input-> selector not defined");
    }

    // Execute a click action on the element matching the selector.
    await environment.getPage()!.click(selector);

    return true;
  } catch (error: any) {
    // Log the error message and return false if an exception occurs.
    environment.log.error(error.message);
    return false;
  }
}
