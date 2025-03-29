import { ExecutionEnvironment } from "@/types/executor";
import { PageToHtmlTask } from "@/lib/workflow/task/PageToHtml";

/**
 * PageToHtmlExecutor
 *
 * Executes the "Page To HTML" task by retrieving the current HTML content of the page
 * from the execution environment. The HTML content is then set as an output under the key "HTML".
 *
 * @param {ExecutionEnvironment<typeof PageToHtmlTask>} environment - The execution environment providing
 * inputs, page interaction, logging, and output methods.
 * @returns {Promise<boolean>} A promise that resolves to true if the HTML is successfully retrieved and set,
 * or false if an error occurs.
 */
export async function PageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean> {
  try {
    // Retrieve the current HTML content from the page.
    const html = await environment.getPage()!.content();

    // Set the retrieved HTML as an output with the key "HTML".
    environment.setOutput("HTML", html);

    return true;
  } catch (error: any) {
    // Log any errors that occur during execution.
    environment.log.error(error.message);
    return false;
  }
}
