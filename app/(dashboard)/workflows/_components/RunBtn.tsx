"use client";

import { RunWorkflow } from "@/actions/workflows/runWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { PlayIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

/**
 * Props for the RunBtn component.
 *
 * @typedef {Object} RunBtnProps
 * @property {string} workflowId - The unique identifier for the workflow to be run.
 */

/**
 * RunBtn Component.
 *
 * This component renders a button that, when clicked, initiates the execution of a workflow.
 * It uses a mutation hook from react-query to trigger the RunWorkflow action, and provides
 * real-time feedback via toast notifications on the action's status.
 *
 * @param {RunBtnProps} props - The properties for the component.
 * @returns {JSX.Element} A button component that starts the workflow.
 */

export default function RunBtn({ workflowId }: { workflowId: string }) {
  // Initialize a mutation for running the workflow.
  // On success, display a success toast. On error, display an error toast.
  const mutation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: () => {
      toast.success("Workflow started", { id: workflowId });
    },
    onError: () => {
      toast.error("Workflow failed to start", { id: workflowId });
    }
  });
  return (
    <Button
      variant={"outline"}
      size={"sm"}
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading("Scheduling run...", { id: workflowId });
        mutation.mutate({
          workflowId
        });
      }}
    >
      <PlayIcon size={16} />
      Run
    </Button>
  );
}
