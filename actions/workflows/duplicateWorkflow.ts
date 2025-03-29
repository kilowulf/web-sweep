"use server";

import prisma from "@/lib/prisma";
import {
  duplicateWorkflowSchema,
  duplicateWorkflowSchemaType
} from "@/schema/workflow";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * This function duplicates an existing workflow for the authenticated user.
 *
 * @param form - The form data containing the workflowId and the new workflow's name and description.
 * @throws Will throw an error if the form data is invalid, the user is not authenticated,
 * the source workflow is not found, or the workflow duplication fails.
 *
 * @returns {Promise<void>} - Resolves when the workflow duplication is successful.
 *
 * @remarks
 * The function uses the provided form data to create a new workflow with the same definition as the source workflow.
 * The new workflow's status is set to DRAFT.
 * After successful duplication, the function revalidates the "/workflows" path to ensure the updated list of workflows is displayed.
 */
export async function DuplicateWorkflow(form: duplicateWorkflowSchemaType) {
  const { success, data } = duplicateWorkflowSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const sourceWorkflow = await prisma.workFlow.findUnique({
    where: { id: data.workflowId, userId }
  });

  if (!sourceWorkflow) {
    throw new Error("Source workflow not found");
  }

  const result = await prisma.workFlow.create({
    data: {
      userId,
      name: data.name,
      description: data.description,
      status: WorkflowStatus.DRAFT,
      definition: sourceWorkflow.definition
    }
  });

  if (!result) {
    throw new Error("Failed to duplicate workflow");
  }

  revalidatePath("/workflows");
}

