"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { CronExpressionParser } from "cron-parser";
import { revalidatePath } from "next/cache";

/**
 * Updates a workflow's cron expression and calculates the next run time.
 *
 * @remarks
 * This function is intended to be called as a server-side action. It requires
 * authentication and updates the specified workflow with the provided cron
 * expression and calculates the next run time based on the parsed cron expression.
 *
 * @param id - The unique identifier of the workflow to update.
 * @param cron - The new cron expression to set for the workflow.
 *
 * @throws Will throw an error if the user is not authenticated.
 * @throws Will throw an error if the provided cron expression is invalid.
 *
 * @returns This function does not return a value.
 */
export async function UpdateWorkflowCron({
  id,
  cron
}: {
  id: string;
  cron: string;
}) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const interval = CronExpressionParser.parse(cron, { tz: "UTC" });
    await prisma.workFlow.update({
      where: { id, userId },
      data: {
        cron,
        nextRunAt: interval.next().toDate()
      }
    });
  } catch (error: any) {
    console.error("invalid cron:", error.message);
    throw new Error("invalid cron expression");
  }

  revalidatePath("/workflows");
}

