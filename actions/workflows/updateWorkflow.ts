"use server";

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

export async function UpdateWorkflow({
  id,
  definition
}: {
  id: string;
  definition: string;
}) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const workflow = await prisma.workFlow.findUnique({
    where: {
      id: id,
      userId
    }
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("workflow is not a draft");
  }

  await prisma.workFlow.update({
    where: {
      id,
      userId
    },
    data: {
      definition
    }
  });
}
