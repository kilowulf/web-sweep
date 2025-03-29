"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Deletes a workflow based on the provided ID and the authenticated user.
 *
 * @param id - The unique identifier of the workflow to be deleted.
 * @throws Will throw an error if the user is not authenticated.
 * @returns {Promise<void>} - Resolves when the workflow is successfully deleted.
 */
export async function DeleteWorkflow(id: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  await prisma.workFlow.delete({
    where: {
      id: id,
      userId: userId
    }
  });

  revalidatePath("/workflow");
}

