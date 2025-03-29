"use server";

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * This function is responsible for unpublishing a workflow.
 * It updates the workflow status to Draft, clears the execution plan, and sets the credits cost to 0.
 *
 * @param id - The unique identifier of the workflow to be unpublished.
 * @throws Will throw an error if the user is not authenticated.
 * @throws Will throw an error if the workflow is not found.
 * @throws Will throw an error if the workflow is not in the Published status.
 * @returns {Promise<void>} - The function does not return any value.
 */
export async function UnPublishWorkflow(id: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const workflow = await prisma.workFlow.findUnique({
    where: {
      id,
      userId
    }
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  if (workflow.status !== WorkflowStatus.PUBLISHED) {
    throw new Error("workflow is not published");
  }

  await prisma.workFlow.update({
    where: {
      id,
      userId
    },
    data: {
      status: WorkflowStatus.DRAFT,
      executionPlan: null,
      creditsCost: 0
    }
  });

  revalidatePath(`/workflow/editor/${id}`);
}

