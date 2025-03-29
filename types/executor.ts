import { Browser, Page } from "puppeteer";
import { WorkflowTask } from "@/types/workflow";
import { LogCollector } from "@/types/log";

/**
 * Environment type.
 *
 * Represents the overall execution environment for a workflow.
 * It may contain a Puppeteer browser instance and a page instance, and holds a phases record.
 * The phases record maps a node ID (string) to an object containing:
 *  - inputs: A record of input values (key: input name, value: string).
 *  - outputs: A record of output values (key: output name, value: string).
 */
export type Environment = {
  browser?: Browser;
  page?: Page;
  phases: Record<
    string,
    { inputs: Record<string, string>; outputs: Record<string, string> }
  >;
};

/**
 * ExecutionEnvironment type.
 *
 * Represents the execution environment tailored for a specific workflow task.
 * It provides functions to retrieve inputs and set outputs, as well as methods for interacting
 * with the Puppeteer browser and page. It also includes a logging mechanism.
 *
 * @template T - The specific WorkflowTask for which this execution environment is created.
 *
 * @property {function(name: string): string} getInput - Retrieves the value for the given input name.
 * @property {function(name: string, value: string): void} setOutput - Sets the value for the specified output.
 * @property {function(): Browser | undefined} getBrowser - Retrieves the current Puppeteer browser instance.
 * @property {function(browser: Browser): void} setBrowser - Sets the Puppeteer browser instance.
 * @property {function(): Page | undefined} getPage - Retrieves the current Puppeteer page instance.
 * @property {function(page: Page): void} setPage - Sets the Puppeteer page instance.
 * @property {LogCollector} log - A logging mechanism for capturing logs during task execution.
 */
export type ExecutionEnvironment<T extends WorkflowTask> = {
  getInput(name: T["inputs"][number]["name"]): string;
  setOutput(name: T["outputs"][number]["name"], value: string): void;
  getBrowser(): Browser | undefined;
  setBrowser(browser: Browser): void;
  getPage(): Page | undefined;
  setPage(page: Page): void;
  log: LogCollector;
};
