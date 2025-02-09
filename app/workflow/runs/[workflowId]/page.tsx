import Topbar from "@/app/workflow/_components/topbar/Topbar";

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
      <ExecutionsTable workflowId={params.workflowId} />
    </div>
  );
}
// timestamp: 8:49:05

async function ExecutionsTable({ workflowId }: { workflowId: string }) {
  const executions = await GetWorkflowExecutions(workflowId);
  return <div>ExecutionsTable</div>;
}
