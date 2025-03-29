"use server";

import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";

type Stats = Record<string, { success: number; failed: number }>;
/**
 * Retrieves workflow execution statistics for a given period.
 *
 * @param period - The period for which to retrieve statistics.
 * @returns An array of objects containing the date and success/failed counts for each day within the specified period.
 *
 * @throws Will throw an error if the user is not authenticated.
 */
export async function GetWorkflowExecutionStats(period: Period) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const dateRange = PeriodToDateRange(period);
  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate
      }
    }
  });
  const dateFormat = "yyyy-MM-dd";

  const stats: Stats = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate
  })
    .map((date) => format(date, dateFormat))
    .reduce((acc, date) => {
      acc[date] = {
        success: 0,
        failed: 0
      };
      return acc;
    }, {} as any);

  executions.forEach((execution) => {
    const date = format(execution.startedAt!, dateFormat);
    if (execution.status === WorkflowExecutionStatus.COMPLETED) {
      stats[date].success += 1;
    }
    if (execution.status === WorkflowExecutionStatus.FAILED) {
      stats[date].failed += 1;
    }
  });

  const result = Object.entries(stats).map(([date, info]) => ({
    date,
    ...info
  }));

  return result;
}

