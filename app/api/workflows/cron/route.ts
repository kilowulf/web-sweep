import { getAppUrl } from "@/lib/helper/appUrl";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";

/**
 * GET handler for triggering scheduled workflows.
 *
 * This function queries the database for published workflows that have a cron expression
 * and whose next run time is due (i.e., less than or equal to the current time). It then
 * triggers each workflow by invoking the corresponding API endpoint.
 *
 * @param {Request} req - The incoming request object.
 * @returns {Response} A JSON response with the count of workflows that were triggered.
 */
export async function GET(req: Request) {
  // Get the current date and time.
  const now = new Date();

  // Retrieve workflows that are published, have a cron expression, and are due to run.
  const workflows = await prisma.workFlow.findMany({
    select: { id: true },
    where: {
      status: WorkflowStatus.PUBLISHED,
      cron: { not: null },
      nextRunAt: { lte: now }
    }
  });

  // Log the number of workflows to be triggered.
  console.log("@@WORKFLOW TO RUN", workflows.length);

  // Loop through each workflow and trigger its execution.
  for (const workflow of workflows) {
    triggerWorkflow(workflow.id);
  }

  // Return a JSON response with the total count of workflows triggered.
  return Response.json({ workflowsToRun: workflows.length }, { status: 200 });
}

/**
 * Triggers a workflow execution by calling its API endpoint.
 *
 * Constructs the API URL using the workflow ID and sends a fetch request with the necessary
 * authorization header. Errors during the request are caught and logged.
 *
 * @param {string} workflowId - The unique identifier of the workflow to trigger.
 */
function triggerWorkflow(workflowId: string) {
  // Construct the API endpoint URL for executing the workflow.
  const triggerApiUrl = getAppUrl(
    `api/workflows/execute?workflowId=${workflowId}`
  );
  console.log("@@TRIGGER URL", triggerApiUrl);

  // Send a request to trigger the workflow, using the API secret for authorization.
  fetch(triggerApiUrl, {
    headers: {
      Authorization: `Bearer ${process.env.API_SECRET!}`
    },
    cache: "no-store"
  }).catch((error) =>
    console.error(
      "Error triggering workflow with id",
      workflowId,
      ":error->",
      error.message
    )
  );
}
