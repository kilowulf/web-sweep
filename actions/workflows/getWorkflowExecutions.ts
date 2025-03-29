"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Retrieves workflow executions based on the provided workflow ID and the authenticated user.
 *
 * @param workflowId - The unique identifier of the workflow for which to retrieve executions.
 * @returns A Promise that resolves to an array of workflow executions, ordered by creation date in descending order.
 * @throws Will throw an error if the user is not authenticated.
 *
 * @example
 * ```typescript
 * try {
 *   const workflowExecutions = await GetWorkflowExecutions("workflow-123");
 *   console.log(workflowExecutions);
 * } catch (error) {
 *   console.error(error.message);
 * }
 * ```
 */
export async function GetWorkflowExecutions(workflowId: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }

  return prisma.workflowExecution.findMany({
    where: {
      workflowId,
      userId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

