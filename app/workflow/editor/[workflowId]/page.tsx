import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import Editor from "@/app/workflow/_components/Editor";

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
