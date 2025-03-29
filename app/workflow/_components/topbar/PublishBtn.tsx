"use client";

import { Button } from "@/components/ui/button";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { PlayIcon, UploadIcon } from "lucide-react";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { RunWorkflow } from "@/actions/workflows/runWorkflow";
import { toast } from "sonner";
import { useReactFlow } from "@xyflow/react";
import { PublishWorkflow } from "@/actions/workflows/publishWorkflow";

/**
 * PublishBtn Component.
 *
 * Renders a button that publishes the workflow when clicked.
 * It generates an execution plan and serializes the current flow definition,
 * then triggers a mutation to publish the workflow.
 * Toast notifications provide user feedback during the publishing process.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.workflowId - The unique identifier of the workflow to publish.
 * @returns {JSX.Element} The rendered publish button.
 */
export default function PublishBtn({ workflowId }: { workflowId: string }) {
  // Generate an execution plan for the workflow.
  const generate = useExecutionPlan();
  // Convert the current flow definition into an object.
  const { toObject } = useReactFlow();

  // Set up a mutation to publish the workflow.
  const mutation = useMutation({
    mutationFn: PublishWorkflow,
    onSuccess: () => {
      toast.success("Workflow Published", { id: "workflowId" });
    },
    onError: () => {
      toast.error("Error on attempt to publish workflow)", {
        id: "workflowId"
      });
    }
  });

  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        // Generate the execution plan.
        const plan = generate();
        if (!plan) {
          // Abort if the execution plan is not valid.
          return;
        }
        // Display a loading toast before publishing.
        toast.loading("Publishing workflow...", { id: "workflowId" });
        // Trigger the mutation to publish the workflow with its ID and serialized flow definition.
        mutation.mutate({
          id: workflowId,
          flowDefinition: JSON.stringify(toObject())
        });
      }}
    >
      <UploadIcon size={16} className="stroke-green-400" />
      Publish
    </Button>
  );
}
