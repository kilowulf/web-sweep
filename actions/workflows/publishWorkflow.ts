"use server";

import prisma from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { CalculateWorkflowCost } from "@/lib/workflow/helpers";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function PublishWorkflow({
  id,
  flowDefinition
}: {
  id: string;
  flowDefinition: string;
}) {
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

  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("workflow is not a draft");
  }

  const flow = JSON.parse(flowDefinition);
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);

  if (result.error) {
    throw new Error("flow definition not valid");
  }

  if (!result.executionPlan) {
    throw new Error("no execution plan generated");
  }

  const creditsCost = CalculateWorkflowCost(flow.nodes);
  await prisma.workFlow.update({
    where: {
      id,
      userId
    },
    data: {
      status: WorkflowStatus.PUBLISHED,
      definition: flowDefinition,
      creditsCost,
      executionPlan: JSON.stringify(result.executionPlan)
    }
  });

  revalidatePath(`/workflow/editor/${id}`);
}
