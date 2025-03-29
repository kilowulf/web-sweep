"use server";

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Updates a workflow definition for a specific user.
 *
 * @remarks
 * This function is responsible for updating the workflow definition for a given workflow ID.
 * It first checks if the user is authenticated and then verifies if the workflow exists and is in a draft state.
 * If all checks pass, it updates the workflow definition and triggers a cache revalidation for the "/workflows" path.
 *
 * @param id - The unique identifier of the workflow to be updated.
 * @param definition - The new workflow definition to be applied.
 *
 * @throws Will throw an error if the user is not authenticated, the workflow is not found, or the workflow is not in a draft state.
 *
 * @returns {Promise<void>} - Returns a promise that resolves when the workflow update is complete.
 */
export async function UpdateWorkflow({
  id,
  definition
}: {
  id: string;
  definition: string;
}) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const workflow = await prisma.workFlow.findUnique({
    where: {
      id: id,
      userId
    }
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("workflow is not a draft");
  }

  await prisma.workFlow.update({
    where: {
      id,
      userId
    },
    data: {
      definition
    }
  });

  revalidatePath("/workflows");
}

