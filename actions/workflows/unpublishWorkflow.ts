"use server";

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function UnPublishWorkflow(id: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const workflow = await prisma.workFlow.findUnique({
    where: {
      id,
      userId
    }
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  if (workflow.status !== WorkflowStatus.PUBLISHED) {
    throw new Error("workflow is not published");
  }

  await prisma.workFlow.update({
    where: {
      id,
      userId
    },
    data: {
      status: WorkflowStatus.DRAFT,
      executionPlan: null,
      creditsCost: 0
    }
  });

  revalidatePath(`/workflow/editor/${id}`);
}
