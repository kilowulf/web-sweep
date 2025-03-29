import { GetWorkflowsForUser } from "@/actions/workflows/getWorkflowsForUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, InboxIcon } from "lucide-react";
import React, { Suspense } from "react";
import CreateWorkflowDialog from "./_components/CreateWorkflowDialog";
import WorkflowCard from "./_components/WorkflowCard";

/**
 * Main page component for managing workflows.
 *
 * Renders a header with a title, description, and a button to create a new workflow.
 * It also displays the user's workflows in a Suspense wrapper with a fallback skeleton.
 *
 * @returns {JSX.Element} The rendered workflows management page.
 */
export default function page() {
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">WorkFlows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
        </div>
        <CreateWorkflowDialog />
      </div>
      <div className="h-full py-6">
        <Suspense fallback={<UserWorkflowsSkeleton />}>
          <UserWorkflows />
        </Suspense>
      </div>
    </div>
  );
}

/**
 * UserWorkflowsSkeleton Component.
 *
 * Provides a skeleton loader UI as a fallback while workflows data is being fetched.
 *
 * @returns {JSX.Element} The skeleton loader for workflows.
 */
function UserWorkflowsSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
}

/**
 * UserWorkflows Component.
 *
 * Asynchronously fetches the list of workflows for the user and renders them.
 * - If fetching fails, displays an error alert.
 * - If no workflows are found, displays an empty state with a prompt to create one.
 * - Otherwise, renders a grid of WorkflowCard components.
 *
 * @async
 * @returns {Promise<JSX.Element>} The rendered workflows list or an appropriate message.
 */
async function UserWorkflows() {
  const workflows = await GetWorkflowsForUser();
  if (!workflows) {
    return (
      <Alert variant={"destructive"}>
        <AlertCircle className="w-4 h-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong while fetching your workflows.
        </AlertDescription>
      </Alert>
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="flex flex-col gap-4 h-full items-center justify-center">
        <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
          <InboxIcon size={40} className="stroke-primary" />
        </div>
        <div className="flex flex-col gap-1 text-center">
          <p className="font-bold">No workflow created yet</p>
          <p className="text-sm text-muted-foreground">
            Click the button below to create your first workflow
          </p>
        </div>
        <CreateWorkflowDialog triggerText="Create your first workflow" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {workflows.map((workflow) => (
        <WorkflowCard key={workflow.id} workflow={workflow} />
      ))}
    </div>
  );
}
