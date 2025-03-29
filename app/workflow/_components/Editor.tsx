"use client";

import { WorkFlow } from "@prisma/client";
import React from "react";
import { ReactFlowProvider } from "@xyflow/react";
import FlowEditor from "@/app/workflow/_components/FlowEditor";
import Topbar from "@/app/workflow/_components/topbar/Topbar";
import TaskMenu from "@/app/workflow/_components/TaskMenu";
import { FlowValidationContextProvider } from "@/components/context/FlowValidationContext";
import { WorkflowStatus } from "@/types/workflow";

/**
 * Editor Component.
 *
 * This component renders the main workflow editor interface. It wraps its children
 * with both a FlowValidationContextProvider and a ReactFlowProvider, which supply the
 * necessary context for validating flow inputs and managing the React Flow state respectively.
 *
 * The layout consists of a Topbar (displaying the editor title, workflow name, and publication status),
 * followed by a horizontal layout where the TaskMenu (for adding new tasks) is rendered alongside
 * the FlowEditor, which displays and manages the workflow diagram.
 *
 * @param {Object} props - Component properties.
 * @param {WorkFlow} props.workflow - The workflow object retrieved from the database. It contains
 *                                      metadata such as the workflow's id, name, and status.
 * @returns {JSX.Element} The rendered Editor component.
 */
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
