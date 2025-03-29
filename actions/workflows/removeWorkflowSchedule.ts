"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Removes the workflow schedule associated with the given ID.
 *
 * @remarks
 * This function updates the specified workflow in the database by setting the cron and nextRunAt fields to null.
 * It also triggers a cache revalidation for the "/workflows" path.
 *
 * @param id - The unique identifier of the workflow to remove the schedule for.
 * @throws Will throw an error if the user is not authenticated.
 * @returns {Promise<void>} - A promise that resolves when the workflow schedule is successfully removed.
 */
export async function RemoveWorkflowSchedule(id: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  await prisma.workFlow.update({
    where: {
      id,
      userId
    },
    data: {
      cron: null,
      nextRunAt: null
    }
  });

  revalidatePath("/workflows");
}

