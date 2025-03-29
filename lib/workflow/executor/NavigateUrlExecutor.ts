import { ExecutionEnvironment } from "@/types/executor";
import { NavigateUrlTask } from "../task/NavigateUrlTask";

/**
 * NavigateUrlExecutor
 *
 * Executes the "Navigate URL" task by retrieving a URL from the execution environment and navigating
 * the Puppeteer page to that URL.
 *
 * Process:
 * 1. Retrieve the "URL" input from the execution environment.
 * 2. Validate that the URL is provided; if not, log an error.
 * 3. Navigate the page to the provided URL using the page's goto method.
 * 4. Log a success message upon navigation.
 *
 * In case of any errors during navigation, the error is logged and the function returns false.
 *
 * @param {ExecutionEnvironment<typeof NavigateUrlTask>} environment - The execution environment that provides inputs, logging, and page methods.
 * @returns {Promise<boolean>} A promise that resolves to true if navigation is successful, otherwise false.
 */
export async function NavigateUrlExecutor(
  environment: ExecutionEnvironment<typeof NavigateUrlTask>
): Promise<boolean> {
  try {
    // Retrieve the URL input from the execution environment.
    const url = environment.getInput("URL");
    if (!url) {
      environment.log.error("input-> URL not defined");
    }

    // Navigate the page to the provided URL.
    await environment.getPage()!.goto(url);
    environment.log.info(`Navigated to ${url}`);

    return true;
  } catch (error: any) {
    // Log any error and return false.
    environment.log.error(error.message);
    return false;
  }
}
