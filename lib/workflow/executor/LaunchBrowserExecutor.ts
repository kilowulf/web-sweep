import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "@/lib/workflow/task/LaunchBrowser";

// websocket url: brightdata webscraper
// const BROWSER_WS =
//   "wss://brd-customer-hl_34644058-zone-web_sweep_scrape_browser:ibcu0tb5uhtl@brd.superproxy.io:9222";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput("Website Url");

    const browser = await puppeteer.launch({
      headless: true
    });

    // brightdata proxy implementation:
    // const browser = await puppeteer.connect({
    //   browserWSEndpoint: BROWSER_WS
    // });
    environment.log.info("Browser started successfully");
    environment.setBrowser(browser);
    const page = await browser.newPage();
    page.setViewport({ width: 2560, height: 1440 });
    // authenticate to brightdata datacenter proxy service

    await page.goto(websiteUrl);
    environment.setPage(page);
    environment.log.info(`Opened page at: ${websiteUrl}`);
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }

  return true;
}
