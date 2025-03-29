"use server";

import React from "react";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

/**
 * Retrieves workflows associated with the authenticated user.
 *
 * @remarks
 * This function is designed to be used as a server-side action in a Next.js application.
 * It retrieves workflows from the database based on the authenticated user's ID.
 *
 * @returns {Promise<import("@prisma/client").WorkFlow[]>}
 * An array of workflow objects, sorted by creation date in ascending order.
 *
 * @throws {Error}
 * Throws an error if the user is not authenticated.
 *
 * @example
 * ```typescript
 * const workflows = await GetWorkflowsForUser();
 * console.log(workflows);
 * ```
 */
export async function GetWorkflowsForUser() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  return prisma.workFlow.findMany({
    where: {
      userId: userId
    },
    orderBy: {
      createdAt: "asc"
    }
  });
}

