"use server";

import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

const { COMPLETED, FAILED } = WorkflowExecutionStatus;

/**
 * Retrieves and calculates statistics for the user's workflow executions within a specified period.
 *
 * @param period - The time period for which to retrieve and calculate statistics.
 *
 * @returns An object containing the following statistics:
 * - `workflowExecutions`: The total number of workflow executions within the specified period.
 * - `creditsConsumed`: The total number of credits consumed by all workflow executions within the specified period.
 * - `phaseExecutions`: The total number of phase executions within the specified period.
 *
 * @throws Will throw an error if the user is not authenticated.
 */
export async function GetStatsCardsValues(period: Period) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not found");
  }
  const dateRange = PeriodToDateRange(period);
  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate
      },
      status: {
        in: [COMPLETED, FAILED]
      }
    },
    select: {
      creditsConsumed: true,
      phases: {
        where: {
          creditsConsumed: {
            not: null
          }
        },
        select: {
          creditsConsumed: true
        }
      }
    }
  });

  const stats = {
    workflowExecutions: executions.length,
    creditsConsumed: 0,
    phaseExecutions: 0
  };

  stats.creditsConsumed = executions.reduce(
    (sum, execution) => sum + execution.creditsConsumed,
    0
  );

  stats.phaseExecutions = executions.reduce(
    (sum, execution) => sum + execution.phases.length,
    0
  );

  return stats;
}

