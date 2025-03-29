import { ExecutionEnvironment } from "@/types/executor";
import { ScrollToElementTask } from "../task/ScrollToElement";

/**
 * ScrollToElementExecutor
 *
 * Executes the "Scroll To Element" task by scrolling the page to the position of a specified element.
 *
 * Process:
 * 1. Retrieve the "Selector" input from the execution environment.
 * 2. Log an error if the selector is not defined.
 * 3. Use the page's evaluate method to run code in the browser context:
 *    - Locate the element using the provided selector.
 *    - If the element is not found, throw an error.
 *    - Calculate the element's vertical position.
 *    - Scroll the window to the element's top position.
 * 4. Return true if the scroll action is successful; otherwise, catch any errors, log them, and return false.
 *
 * @param {ExecutionEnvironment<typeof ScrollToElementTask>} environment - The execution environment providing inputs, logging, and page methods.
 * @returns {Promise<boolean>} A promise that resolves to true if the scrolling action succeeds, otherwise false.
 */
export async function ScrollToElementExecutor(
  environment: ExecutionEnvironment<typeof ScrollToElementTask>
): Promise<boolean> {
  try {
    // Retrieve the selector input from the environment.
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("input-> selector not defined");
    }

    // Execute scrolling logic within the page context.
    await environment.getPage()!.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error(`Element not found: ${selector}`);
      }
      const top = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top });
    }, selector);

    return true;
  } catch (error: any) {
    // Log any error that occurs during the scrolling process.
    environment.log.error(error.message);
    return false;
  }
}
