import { ExecutionEnvironment } from "@/types/executor";
import { WaitForElementTask } from "../task/WaitForElement";

/**
 * WaitForElementExecutor
 *
 * Executes the "Wait For Element" task by waiting for an element to either become visible or hidden on the page.
 * It retrieves the "Selector" and "Visibility" inputs from the execution environment. Based on the "Visibility" value,
 * it waits until the element specified by the selector meets the condition (visible or hidden).
 * Logs the status once the element meets the desired visibility state.
 *
 * @param {ExecutionEnvironment<typeof WaitForElementTask>} environment - The execution environment providing inputs, logging, and page methods.
 * @returns {Promise<boolean>} A promise that resolves to true if the element's visibility condition is met, otherwise false.
 */
export async function WaitForElementExecutor(
  environment: ExecutionEnvironment<typeof WaitForElementTask>
): Promise<boolean> {
  try {
    // Retrieve the selector input from the environment.
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("input-> selector not defined");
    }

    // Retrieve the desired visibility state (e.g., "visible" or "hidden").
    const visibility = environment.getInput("Visibility");
    if (!visibility) {
      environment.log.error("input-> visibility not defined");
    }

    // Wait for the element to satisfy the visibility condition.
    await environment.getPage()!.waitForSelector(selector, {
      visible: visibility === "visible",
      hidden: visibility === "hidden"
    });
    environment.log.info(`Element ${selector} became: ${visibility}`);

    return true;
  } catch (error: any) {
    // Log any errors that occur during waiting.
    environment.log.error(error.message);
    return false;
  }
}
