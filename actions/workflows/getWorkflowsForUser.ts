"use server";

import React from "react";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

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
