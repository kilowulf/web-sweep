import { ExecutionEnvironment } from "@/types/executor";
import { ExtractDataWithAITask } from "@/lib/workflow/task/ExtractDataWithAI";
import prisma from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";
import OpenAI from "openai";

/**
 * ExtractDataWithAIExecutor
 *
 * Executes the "Extract Data With AI" task by performing the following steps:
 * 1. Retrieves the required inputs ("Credentials", "Prompt", and "Content") from the execution environment.
 * 2. Validates the presence of these inputs and logs an error if any are missing.
 * 3. Fetches the credential record from the database using the provided credential ID.
 * 4. Decrypts the stored credential value using symmetric decryption.
 * 5. Initializes the OpenAI client with the decrypted API key.
 * 6. Calls the OpenAI chat completion API with a system message and user-provided content and prompt.
 * 7. Logs token usage details from the OpenAI response.
 * 8. If the response is valid, sets the output "Extracted data" with the AI-generated result.
 *
 * In case of any error during the process, the error message is logged and the function returns false.
 *
 * @param {ExecutionEnvironment<typeof ExtractDataWithAITask>} environment - The execution environment containing inputs, logging, and output methods.
 * @returns {Promise<boolean>} A promise that resolves to true if the task completes successfully, or false if an error occurs.
 */
export async function ExtractDataWithAIExecutor(
  environment: ExecutionEnvironment<typeof ExtractDataWithAITask>
): Promise<boolean> {
  try {
    // Retrieve necessary inputs from the execution environment.
    const credentials = environment.getInput("Credentials");
    if (!credentials) {
      environment.log.error("input-> credentials not defined");
    }

    const prompt = environment.getInput("Prompt");
    if (!prompt) {
      environment.log.error("input-> prompt not defined");
    }

    const content = environment.getInput("Content");
    if (!content) {
      environment.log.error("input-> content not defined");
    }

    // Fetch the credential record from the database.
    const credential = await prisma.credential.findUnique({
      where: { id: credentials }
    });

    if (!credential) {
      environment.log.error("credential not found");
      return false;
    }

    // Decrypt the credential value.
    const plainCredentialValue = symmetricDecrypt(credential.value);
    if (!plainCredentialValue) {
      environment.log.error("cannot decrypt credential");
      return false;
    }

    // Initialize the OpenAI client with the decrypted API key.
    const openai = new OpenAI({
      apiKey: plainCredentialValue
    });

    // Request a chat completion from OpenAI using the provided prompt and content.
    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a web scrapper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input and also the prompt with the data you have to extract. The response should always be only the extracted data as a JSON array or object, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text."
        },
        {
          role: "user",
          content: content
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 1
      // Optionally, max_tokens can be specified to limit token usage.
    });

    // Log token usage details.
    environment.log.info(
      `Prompt tokens: ${openaiResponse.usage?.prompt_tokens}`
    );
    environment.log.info(
      `Completion tokens: ${openaiResponse.usage?.completion_tokens}`
    );

    // Extract the response content from the first choice.
    const result = openaiResponse.choices[0].message?.content;
    if (!result) {
      environment.log.error("no response from AI");
      return false;
    }

    // Set the extracted data as the output.
    environment.setOutput("Extracted data", result);

    return true;
  } catch (error: any) {
    // Log any errors and return false.
    environment.log.error(error.message);
    return false;
  }
}
