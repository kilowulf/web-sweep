import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import Editor from "@/app/workflow/_components/Editor";

/**
 * Page Component.
 *
 * This asynchronous component serves as the main entry point for the workflow editor page.
 * It retrieves the workflow ID from the route parameters and uses Clerk to verify the user's authentication status.
 * - If the user is not authenticated, it displays an "Unauthenticated" message.
 * - If the workflow is not found (or does not belong to the authenticated user), it displays a "Workflow Not found" message.
 * - Otherwise, it renders the Editor component with the retrieved workflow data.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.params - Route parameters.
 * @param {string} props.params.workflowId - The unique identifier of the workflow.
 * @returns {JSX.Element} The rendered page component.
 */
export default async function page({
  params
}: {
  params: { workflowId: string };
}) {
  const { workflowId } = params;
  const { userId } = auth();
  if (!userId) {
    return <div>Unauthenticated</div>;
  }

  const workflow = await prisma.workFlow.findUnique({
    where: {
      id: workflowId,
      userId
    }
  });

  if (!workflow) {
    return <div>Workflow Not found</div>;
  }
  return <Editor workflow={workflow} />;
}
