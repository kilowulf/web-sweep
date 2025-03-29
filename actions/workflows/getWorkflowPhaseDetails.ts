"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Retrieves detailed information about a specific workflow phase based on the provided phaseId.
 * The function ensures that the authenticated user is the owner of the workflow phase.
 *
 * @param phaseId - The unique identifier of the workflow phase to retrieve details for.
 * @returns A Promise that resolves to the detailed information about the workflow phase,
 *          or rejects with an error if the user is not authenticated or the phaseId is invalid.
 *          The returned object includes the phase details and associated logs, ordered by timestamp.
 */
export async function GetWorkflowPhaseDetails(phaseId: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }

  return prisma.executionPhase.findUnique({
    where: {
      id: phaseId,
      execution: {
        userId
      }
    },
    include: {
      logs: {
        orderBy: {
          timestamp: "asc"
        }
      }
    }
  });
}

