import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/GetWorkflowExecutionsWithPhases";
import Topbar from "@/app/workflow/_components/topbar/Topbar";
import { waitFor } from "@/lib/helper/waitFor";
import { auth } from "@clerk/nextjs/server";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import ExecutionViewer from "@/app/workflow/runs/[workflowId]/[executionId]/_components/ExecutionViewer";

/**
 * ExecutionViewerPage Component.
 *
 * This component renders the page for viewing workflow execution details.
 * It includes a top navigation bar (Topbar) and a main content area that lazily loads
 * the execution details via the ExecutionViewerWrapper component. A loader is shown
 * while the data is being fetched.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.params - The route parameters.
 * @param {string} props.params.executionId - The unique identifier for the workflow execution.
 * @param {string} props.params.workflowId - The unique identifier for the workflow.
 * @returns {JSX.Element} The rendered execution viewer page.
 */
export default function ExecutionViewerPage({
  params
}: {
  params: { executionId: string; workflowId: string };
}) {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Topbar
        workflowId={params.workflowId}
        title="Workflow run details"
        subtitle={`Run ID: ${params.executionId}`}
        hideButtons
      />
      <div className="flex h-full overflow-auto">
        <Suspense
          fallback={
            <div className="flex w-full items-center justify-center">
              <Loader2Icon className="h-10 w-10 animate-spin stroke-primary" />
            </div>
          }
        >
          <ExecutionViewerWrapper executionId={params.executionId} />
        </Suspense>
      </div>
    </div>
  );
}

/**
 * ExecutionViewerWrapper Component.
 *
 * This asynchronous component fetches detailed workflow execution data, including phases,
 * using the GetWorkflowExecutionWithPhases action. If the execution data is found, it renders
 * the ExecutionViewer component with the initial data; otherwise, it displays an error message.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.executionId - The unique identifier for the workflow execution.
 * @returns {Promise<JSX.Element>} The rendered content for viewing execution details.
 */
async function ExecutionViewerWrapper({
  executionId
}: {
  executionId: string;
}) {
  const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);
  if (!workflowExecution) {
    return <div>Workflow execution not found</div>;
  }
  return <ExecutionViewer initialData={workflowExecution} />;
}
