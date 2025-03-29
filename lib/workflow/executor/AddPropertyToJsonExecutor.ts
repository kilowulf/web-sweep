import { ExecutionEnvironment } from "@/types/executor";
import { AddPropertyToJsonTask } from "@/lib/workflow/task/AddPropertyToJson";

/**
 * AddPropertyToJsonExecutor
 *
 * Executes the "Add Property to JSON" task by reading input JSON data, a property name,
 * and a property value from the provided execution environment. It parses the JSON,
 * adds or updates the property with the given value, and sets the updated JSON as an output.
 *
 * If any required input is missing, an error is logged to the environment's logger.
 * In case of any exceptions during execution, the error message is logged and the function returns false.
 *
 * @param {ExecutionEnvironment<typeof AddPropertyToJsonTask>} environment - The execution environment containing inputs, logging, and output methods.
 * @returns {Promise<boolean>} A promise that resolves to true if execution succeeds, or false if an error occurs.
 */
export async function AddPropertyToJsonExecutor(
  environment: ExecutionEnvironment<typeof AddPropertyToJsonTask>
): Promise<boolean> {
  try {
    // Retrieve the input JSON string from the environment.
    const jsonData = environment.getInput("JSON");
    if (!jsonData) {
      environment.log.error("input-> JSON not defined");
    }

    // Retrieve the property name to add/update.
    const propertyName = environment.getInput("Property name");
    if (!propertyName) {
      environment.log.error("input-> Property name not defined");
    }

    // Retrieve the property value to assign.
    const propertyValue = environment.getInput("Property value");
    if (!propertyValue) {
      environment.log.error("input-> Value name not defined");
    }

    // Parse the JSON string into an object.
    const json = JSON.parse(jsonData);
    // Set or update the property with the provided value.
    json[propertyName] = propertyValue;

    // Convert the updated object back to a JSON string and set it as an output.
    environment.setOutput("Updated JSON", JSON.stringify(json));

    return true;
  } catch (error: any) {
    // Log any errors that occur during execution.
    environment.log.error(error.message);
    return false;
  }
}
