"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Retrieves a workflow execution with its associated phases based on the provided execution ID.
 * The function ensures that the authenticated user is the owner of the workflow execution.
 *
 * @param executionId - The unique identifier of the workflow execution to retrieve.
 * @returns A promise that resolves to the workflow execution with its associated phases.
 *          If the user is not authenticated, the promise will reject with an error.
 *
 * @throws Will throw an error if the user is not authenticated.
 *
 * @example
 * ```typescript
 * const executionId = "12345";
 * try {
 *   const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);
 *   console.log(workflowExecution);
 * } catch (error) {
 *   console.error(error);
 * }
 * ```
 */
export async function GetWorkflowExecutionWithPhases(executionId: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }

  return prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
      userId
    },
    include: {
      phases: {
        orderBy: {
          number: "asc"
        }
      }
    }
  });
}

