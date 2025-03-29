import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "@/lib/workflow/task/LaunchBrowser";

/**
 * LaunchBrowserExecutor
 *
 * Executes the "Launch Browser" task by launching a new Puppeteer browser instance,
 * opening a new page, setting its viewport, and navigating to the provided website URL.
 *
 * The function retrieves the "Website Url" input from the execution environment.
 * It then launches a headless Puppeteer browser, logs a success message, and saves
 * the browser instance in the environment. After opening a new page and setting the viewport,
 * it navigates to the specified URL, sets the page in the environment, and logs the page URL.
 *
 * In case of an error during any step, the error message is logged and the function returns false.
 *
 * @param {ExecutionEnvironment<typeof LaunchBrowserTask>} environment - The execution environment containing inputs, logging, and methods to set the browser and page.
 * @returns {Promise<boolean>} A promise that resolves to true if the browser is launched and the page is opened successfully, otherwise false.
 */
export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    // Retrieve the website URL from the execution environment.
    const websiteUrl = environment.getInput("Website Url");

    // Launch a new headless Puppeteer browser instance.
    const browser = await puppeteer.launch({
      headless: true
    });

    // Uncomment the following code for Brightdata proxy implementation:
    // const browser = await puppeteer.connect({
    //   browserWSEndpoint: BROWSER_WS
    // });

    environment.log.info("Browser started successfully");
    // Save the browser instance in the execution environment.
    environment.setBrowser(browser);

    // Open a new page and set the viewport.
    const page = await browser.newPage();
    page.setViewport({ width: 2560, height: 1440 });

    // Navigate to the specified website URL.
    await page.goto(websiteUrl);
    // Save the page instance in the execution environment.
    environment.setPage(page);
    environment.log.info(`Opened page at: ${websiteUrl}`);
  } catch (error: any) {
    // Log any error that occurs during execution.
    environment.log.error(error.message);
    return false;
  }

  return true;
}
