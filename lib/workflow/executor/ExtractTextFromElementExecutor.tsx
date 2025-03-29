import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromElementTask } from "@/lib/workflow/task/ExtractTextFromElement";
import * as cheerio from "cheerio";

/**
 * ExtractTextFromElementExecutor
 *
 * Executes the "Extract Text From Element" task by parsing provided HTML content,
 * selecting an element using a CSS selector, and extracting its text.
 *
 * Process:
 * 1. Retrieve the "Selector" and "Html" inputs from the execution environment.
 * 2. Validate that both inputs are provided; if not, log an error and return false.
 * 3. Load the HTML content using Cheerio.
 * 4. Select the element matching the provided selector.
 * 5. Extract the text from the element. If no text is found, log an error and return false.
 * 6. Set the extracted text as an output ("Extracted text") in the execution environment.
 *
 * @param {ExecutionEnvironment<typeof ExtractTextFromElementTask>} environment - The execution environment containing inputs, logging, and output methods.
 * @returns {Promise<boolean>} A promise that resolves to true if the task executes successfully, or false if an error occurs.
 */
export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>
): Promise<boolean> {
  try {
    // Retrieve the CSS selector input.
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("Selector not defined");
      return false;
    }

    // Retrieve the HTML content input.
    const html = environment.getInput("Html");
    if (!html) {
      environment.log.error("Html not defined");
      return false;
    }

    // Load the HTML content using Cheerio.
    const $ = cheerio.load(html);

    // Select the element using the provided selector.
    const element = $(selector);
    if (!element || element.length === 0) {
      environment.log.error("Element not found");
      return false;
    }

    // Extract the text content from the selected element.
    const extractedText = element.text();
    if (!extractedText) {
      environment.log.error("Element has no text");
      return false;
    }

    // Set the extracted text as output in the execution environment.
    environment.setOutput("Extracted text", extractedText);

    return true;
  } catch (error: any) {
    // Log any error that occurs during execution.
    environment.log.error(error.message);
    return false;
  }
}
