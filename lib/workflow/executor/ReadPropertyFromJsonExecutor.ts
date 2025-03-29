import { ExecutionEnvironment } from "@/types/executor";
import { ReadPropertyFromJsonTask } from "@/lib/workflow/task/ReadPropertyFromJson";

/**
 * ReadPropertyFromJsonExecutor
 *
 * Executes the "Read Property From JSON" task by performing the following steps:
 * 1. Retrieves the "JSON" input from the execution environment.
 * 2. Retrieves the "Property name" input from the execution environment.
 * 3. Parses the JSON string into an object.
 * 4. Reads the specified property value from the JSON object.
 * 5. If the property is found, sets it as an output with the key "Property value".
 *
 * If any required input is missing or the property is not found, an error is logged and
 * the function returns false.
 *
 * @param {ExecutionEnvironment<typeof ReadPropertyFromJsonTask>} environment - The execution environment that provides inputs, logging, and output methods.
 * @returns {Promise<boolean>} A promise that resolves to true if the property is successfully read and set, otherwise false.
 */
export async function ReadPropertyFromJsonExecutor(
  environment: ExecutionEnvironment<typeof ReadPropertyFromJsonTask>
): Promise<boolean> {
  try {
    // Retrieve the JSON input from the execution environment.
    const jsonData = environment.getInput("JSON");
    if (!jsonData) {
      environment.log.error("input-> JSON not defined");
    }

    // Retrieve the property name input from the execution environment.
    const propertyName = environment.getInput("Property name");
    if (!propertyName) {
      environment.log.error("input-> Property name not defined");
    }

    // Parse the JSON string into an object.
    const json = JSON.parse(jsonData);
    // Retrieve the property value from the JSON object.
    const propertyValue = json[propertyName];
    if (propertyValue === undefined) {
      environment.log.error(`Property ${propertyName} not found in JSON`);
      return false;
    }

    // Set the retrieved property value as output.
    environment.setOutput("Property value", propertyValue);

    return true;
  } catch (error: any) {
    // Log any error that occurs during execution.
    environment.log.error(error.message);
    return false;
  }
}
