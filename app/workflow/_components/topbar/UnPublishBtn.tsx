"use client";

import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { UnPublishWorkflow } from "@/actions/workflows/unpublishWorkflow";

/**
 * UnPublishBtn Component.
 *
 * Renders a button that, when clicked, unpublishes a workflow.
 * It triggers a mutation using the UnPublishWorkflow action and displays toast notifications
 * to provide user feedback on the unpublishing process.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.workflowId - The unique identifier of the workflow to be unpublished.
 * @returns {JSX.Element} The rendered UnPublishBtn component.
 */
export default function UnPublishBtn({ workflowId }: { workflowId: string }) {
  // Create a mutation to unpublish the workflow.
  const mutation = useMutation({
    mutationFn: UnPublishWorkflow,
    onSuccess: () => {
      toast.success("Workflow Unpublished", { id: "workflowId" });
    },
    onError: () => {
      toast.error("Error on attempt to unpublish workflow)", {
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
        // Show a loading toast while the workflow is being unpublished.
        toast.loading("Unpublishing workflow...", { id: "workflowId" });
        // Trigger the mutation with the workflow ID.
        mutation.mutate(workflowId);
      }}
    >
      <DownloadIcon size={16} className="stroke-orange-500" />
      Unpublish
    </Button>
  );
}
