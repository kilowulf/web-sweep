import { ExecutionEnvironment } from "@/types/executor";
import { FillInputTask } from "../task/FillInput";

/**
 * FillInputExecutor
 *
 * Executes the "Fill Input" task by simulating typing into an input element on a web page.
 * It retrieves the "Selector" and "Value" inputs from the execution environment,
 * logs errors if any input is missing, and then types the provided value into the
 * element matching the selector using the page's type method.
 *
 * @param {ExecutionEnvironment<typeof FillInputTask>} environment - The execution environment providing inputs, logging, and page interaction methods.
 * @returns {Promise<boolean>} A promise that resolves to true if the operation is successful, or false if an error occurs.
 */
export async function FillInputExecutor(
  environment: ExecutionEnvironment<typeof FillInputTask>
): Promise<boolean> {
  try {
    // Retrieve the CSS selector input.
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("input-> selector not defined");
    }

    // Retrieve the value to type into the input element.
    const value = environment.getInput("Value");
    if (!value) {
      environment.log.error("input-> value not defined");
    }

    // Simulate typing the value into the element matching the selector.
    await environment.getPage()!.type(selector, value);

    return true;
  } catch (error: any) {
    // Log any error that occurs during execution.
    environment.log.error(error.message);
    return false;
  }
}
