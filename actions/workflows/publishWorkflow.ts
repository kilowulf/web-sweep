"use server";

import prisma from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { CalculateWorkflowCost } from "@/lib/workflow/helpers";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * This function is responsible for publishing a workflow by updating its status, definition, credits cost, and execution plan.
 *
 * @param {Object} params - The parameters required for publishing the workflow.
 * @param {string} params.id - The unique identifier of the workflow to be published.
 * @param {string} params.flowDefinition - The JSON representation of the workflow definition.
 *
 * @throws {Error} - Throws an error if the user is not authenticated, the workflow is not found, or the workflow is not in a draft status.
 * @throws {Error} - Throws an error if the flow definition is not valid or if no execution plan is generated.
 *
 * @returns {Promise<void>} - Returns a promise that resolves when the workflow is successfully published.
 */
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

