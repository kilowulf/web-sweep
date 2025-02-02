import { ExecutionEnvironment } from "@/types/executor";

import { PageToHtmlTask } from "@/lib/workflow/task/PageToHtml";

export async function PageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean> {
  try {
    const html = await environment.getPage()!.content();
    console.log("@@PAGE HTML", html);
    environment.setOutput("HTML", html);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
