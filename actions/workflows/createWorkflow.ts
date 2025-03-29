"use server";

import prisma from "@/lib/prisma";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import {
  createWorkflowSchema,
  createWorkflowSchemaType
} from "@/schema/workflow";
import { AppNode } from "@/types/appNodes";
import { TaskType } from "@/types/task";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { Edge } from "@xyflow/react";
import { redirect } from "next/navigation";
import { z } from "zod";


/**
 * This function is responsible for creating a new workflow based on the provided form data.
 * It first validates the form data using the `createWorkflowSchema`. If the form data is invalid,
 * it throws an error. Then, it retrieves the authenticated user's ID using the `auth` function.
 * If the user is not authenticated, it throws an error.
 *
 * The function initializes an `initialFlow` object with an empty array of nodes and edges.
 * It then adds a new node of type `TaskType.LAUNCH_BROWSER` to the `initialFlow` nodes.
 *
 * After that, it creates a new workflow in the database using the `prisma.workFlow.create` method.
 * The workflow data includes the authenticated user's ID, a status of `WorkflowStatus.DRAFT`,
 * the JSON-stringified `initialFlow` definition, and any additional form data.
 *
 * If the workflow creation is successful, it redirects the user to the workflow editor page using the
 * `redirect` function with the newly created workflow's ID.
 *
 * If any error occurs during the process, it throws an error with an appropriate message.
 *
 * @param form - The form data used to create the new workflow.
 * @throws Error - If the form data is invalid, the user is not authenticated, or the workflow creation fails.
 */
export async function CreateWorkflow(form: createWorkflowSchemaType) {
  const { success, data } = createWorkflowSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const initialFlow: { nodes: AppNode[]; edges: Edge[] } = {
    nodes: [],
    edges: []
  };

  initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER));

  const result = await prisma.workFlow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(initialFlow),
      ...data
    }
  });

  if (!result) {
    throw new Error("Failed to create workflow");
  }

  redirect(`/workflow/editor/${result.id}`);
}

