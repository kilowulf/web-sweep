"use client";
import { WorkFlow } from "@prisma/client";
import React from "react";
import { ReactFlowProvider } from "@xyflow/react";
import FlowEditor from "@/app/workflow/_components/FlowEditor";
import Topbar from "@/app/workflow/_components/topbar/Topbar";
import TaskMenu from "@/app/workflow/_components/TaskMenu";
import { FlowValidationContextProvider } from "@/components/context/FlowValidationContext";
import { WorkflowStatus } from "@/types/workflow";

export default function Editor({ workflow }: { workflow: WorkFlow }) {
  return (
    <FlowValidationContextProvider>
      <ReactFlowProvider>
        <div className="flex flex-col h-full overflow-hidden">
          <Topbar
            title="Workflow editor"
            subtitle={workflow.name}
            workflowId={workflow.id}
            isPublished={workflow.status === WorkflowStatus.PUBLISHED}
          />
          <div className="flex h-full overflow-auto">
            <TaskMenu />
            <FlowEditor workflow={workflow} />
          </div>
        </div>
      </ReactFlowProvider>
    </FlowValidationContextProvider>
  );
}
