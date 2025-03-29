import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger
} from "@/types/workflow";
import { timingSafeEqual } from "crypto";
import { parsers } from "date-fns";
import { CronExpressionParser } from "cron-parser";

/**
 * Validates the provided secret against the API secret stored in environment variables.
 *
 * Uses a timing-safe comparison to mitigate timing attacks.
 *
 * @param {string} secret - The secret to validate.
 * @returns {boolean} True if the secret is valid, false otherwise.
 */
function isValidSecret(secret: string): boolean {
  const API_SECRET = process.env.API_SECRET;
  if (!API_SECRET) {
    return false;
  }
  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET));
  } catch (error) {
    return false;
  }
}

/**
 * GET handler for executing a workflow triggered by a cron schedule.
 *
 * This function:
 * - Validates the incoming request's Bearer token.
 * - Retrieves the workflow specified by the "workflowId" query parameter.
 * - Parses the workflow's execution plan and cron schedule.
 * - Creates a new workflow execution record in the database.
 * - Triggers the workflow execution based on the next scheduled run time.
 *
 * @param {Request} request - The incoming request object.
 * @returns {Promise<Response>} A JSON response indicating the outcome of the request.
 */
export async function GET(request: Request): Promise<Response> {
  // Validate the authorization header for a Bearer token.
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract and validate the secret from the authorization header.
  const secret = authHeader.split(" ")[1];
  if (!isValidSecret(secret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract the workflowId from the URL's query parameters.
  const { searchParams } = new URL(request.url);
  const workflowId = searchParams.get("workflowId") as string;
  if (!workflowId) {
    return Response.json({ error: "Bad Request" }, { status: 400 });
  }

  // Retrieve the workflow from the database.
  const workflow = await prisma.workFlow.findUnique({
    where: { id: workflowId }
  });
  if (!workflow) {
    return Response.json({ error: "Workflow not found" }, { status: 400 });
  }

  // Parse the execution plan from the workflow record.
  const executionPlan = JSON.parse(
    workflow.executionPlan!
  ) as WorkflowExecutionPlan;
  if (!executionPlan) {
    return Response.json(
      { error: "Execution plan not found" },
      { status: 400 }
    );
  }

  try {
    // Parse the cron expression and compute the next run date.
    const cron = CronExpressionParser.parse(workflow.cron!, { tz: "UTC" });
    const nextRun = cron.next().toDate();

    // Create a new workflow execution record in the database.
    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId,
        userId: workflow.userId,
        definition: workflow.definition,
        status: WorkflowExecutionStatus.PENDING,
        startedAt: new Date(),
        trigger: WorkflowExecutionTrigger.CRON,
        phases: {
          create: executionPlan.flatMap((phase) => {
            return phase.nodes.flatMap((node) => {
              return {
                userId: workflow.userId,
                status: ExecutionPhaseStatus.CREATED,
                number: phase.phase,
                node: JSON.stringify(node),
                name: TaskRegistry[node.data.type].label
              };
            });
          })
        }
      }
    });

    // Trigger the workflow execution, scheduling it for the next run time.
    await ExecuteWorkflow(execution.id, nextRun);
    return new Response(null, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: "Internal server error: NextRun - execute-route" },
      { status: 500 }
    );
  }
}
