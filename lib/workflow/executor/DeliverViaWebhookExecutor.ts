import { ExecutionEnvironment } from "@/types/executor";
import { DeliverViaWebhookTask } from "../task/DeliverViaWebhook";

/**
 * DeliverViaWebhookExecutor
 *
 * Executes the "Deliver Via Webhook" task by sending a POST request to a target URL with a JSON body.
 * It retrieves the "Target URL" and "Body" inputs from the execution environment, and logs an error if any are missing.
 * After making the POST request, it checks the response status and logs the response body.
 *
 * @param {ExecutionEnvironment<typeof DeliverViaWebhookTask>} environment - The execution environment containing inputs, logging, and page methods.
 * @returns {Promise<boolean>} A promise that resolves to true if the request is successful (status code 200), otherwise false.
 */
export async function DeliverViaWebhookExecutor(
  environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>
): Promise<boolean> {
  try {
    // Retrieve the target URL from the execution environment.
    const targetUrl = environment.getInput("Target URL");
    if (!targetUrl) {
      environment.log.error("input-> targetUrl not defined");
    }

    // Retrieve the body for the request.
    const body = environment.getInput("Body");
    if (!body) {
      environment.log.error("input-> body not defined");
    }

    // Send a POST request with the JSON body.
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    // Check the response status code.
    const statusCode = response.status;
    if (statusCode !== 200) {
      environment.log.error(`Request failed with status code: ${statusCode}`);
      return false;
    }

    // Parse and log the response body.
    const responseBody = await response.json();
    environment.log.info(JSON.stringify(responseBody, null, 4));

    return true;
  } catch (error: any) {
    // Log any error messages and return false.
    environment.log.error(error.message);
    return false;
  }
}
