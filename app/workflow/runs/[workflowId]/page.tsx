import Topbar from "@/app/workflow/_components/topbar/Topbar";
import { GetWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import { Suspense } from "react";
import { InboxIcon, Loader2Icon } from "lucide-react";
import ExecutionsTable from "@/app/workflow/runs/[workflowId]/_components/ExecutionsTable";

/**
 * ExecutionsPage Component.
 *
 * This component renders the main page displaying all workflow runs.
 * It includes a top navigation bar (Topbar) with title and subtitle, and
 * uses a Suspense boundary to lazily load the executions table.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.params - Route parameters.
 * @param {string} props.params.workflowId - The unique identifier of the workflow.
 * @returns {JSX.Element} The rendered ExecutionsPage component.
 */
export default function ExecutionsPage({
  params
}: {
  params: { workflowId: string };
}) {
  return (
    <div className="h-full w-full overflow-auto">
      <Topbar
        workflowId={params.workflowId}
        hideButtons
        title="All runs"
        subtitle="List of all workflow runs"
      />
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <Loader2Icon size={30} className="animate-spin stroke-primary" />
          </div>
        }
      >
        <ExecutionsTableWrapper workflowId={params.workflowId} />
      </Suspense>
    </div>
  );
}

/**
 * ExecutionsTableWrapper Component.
 *
 * This asynchronous component fetches the executions data for the given workflow using
 * the GetWorkflowExecutions action and renders the ExecutionsTable component.
 * It handles cases where no data is returned or the executions array is empty.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.workflowId - The unique identifier of the workflow.
 * @returns {Promise<JSX.Element>} The rendered executions table or a message indicating no data.
 */
async function ExecutionsTableWrapper({ workflowId }: { workflowId: string }) {
  const executions = await GetWorkflowExecutions(workflowId);
  if (!executions) {
    return <div>No data</div>;
  }

  if (executions.length === 0) {
    return (
      <div className="container w-full py-6">
        <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">
              No runs have been triggered yet for this workflow
            </p>
            <p className="text-sm text-muted-foreground">
              You can trigger a new run in the editor page
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container py-6 w-full">
      <ExecutionsTable workflowId={workflowId} initialData={executions} />
    </div>
  );
}
