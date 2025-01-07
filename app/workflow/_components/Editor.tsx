"use client";
import { WorkFlow } from "@prisma/client";
import React from "react";
import { ReactFlowProvider } from "@xyflow/react";
import FlowEditor from "@/app/workflow/_components/FlowEditor";
import Topbar from "@/app/workflow/_components/topbar/Topbar";

export default function Editor({ workflow }: { workflow: WorkFlow }) {
  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-full overflow-hidden">
        <Topbar
          title="Workflow editor"
          subtitle={workflow.name}
          workflowId={workflow.id}
        />
        <section className="flex h-full overflow-auto">
          <FlowEditor workflow={workflow} />
        </section>
      </div>
    </ReactFlowProvider>
  );
}
