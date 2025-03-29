"use server";

import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { auth } from "@clerk/nextjs/server";

/**
 * Retrieves a list of periods (year and month combinations) for which workflow executions exist for the authenticated user.
 *
 * @returns {Promise<Period[]>} A promise that resolves to an array of period objects, each containing a year and month.
 *
 * @throws Will throw an error if the user is not authenticated.
 */
export async function GetPeriods() {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const years = await prisma.workflowExecution.aggregate({
    where: { userId },
    _min: { startedAt: true }
  });

  const currentYear = new Date().getFullYear();

  const periods: Period[] = [];

  const minYear = years._min.startedAt
    ? years._min.startedAt.getFullYear()
    : currentYear;

  for (let year = minYear; year <= currentYear; year++) {
    for (let month = 0; month <= 11; month++) {
      periods.push({ year, month });
    }
  }
  return periods;
}

