import { LaunchBrowserExecutor } from "@/lib/workflow/executor/LaunchBrowserExecutor";

export const ExecutorRegistry = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: () => Promise.resolve(true),
  EXTRACT_TEXT_FROM_ELEMENT: () => Promise.resolve(true)
};
