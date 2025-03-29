"use client";

import { UpdateWorkflow } from "@/actions/workflows/updateWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";

/**
 * SaveBtn Component.
 *
 * Renders a button that saves the current workflow. When clicked, it serializes the current flow definition
 * using the React Flow context and triggers a mutation to update the workflow via the UpdateWorkflow action.
 * Toast notifications are used to provide user feedback during the saving process.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.workflowId - The unique identifier of the workflow to be saved.
 * @returns {JSX.Element} The rendered SaveBtn component.
 */
export default function SaveBtn({ workflowId }: { workflowId: string }) {
  // Retrieve the current flow definition as an object from React Flow context.
  const { toObject } = useReactFlow();

  // Setup a mutation to update the workflow.
  const saveMutation = useMutation({
    mutationFn: UpdateWorkflow,
    onSuccess: () => {
      // Log the current flow definition and display a success toast.
      console.log("@FLOW", toObject());
      toast.success("Workflow saved", { id: "save-workflow" });
    },
    onError: () => {
      // Display an error toast if saving fails.
      toast.error("Failed to save workflow", { id: "save-workflow-error" });
    }
  });

  return (
    <Button
      disabled={saveMutation.isPending}
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        // Serialize the current flow definition.
        const workflowDefinition = JSON.stringify(toObject());
        // Display a loading toast while the workflow is being saved.
        toast.loading("Saving workflow...", { id: "save-workflow" });
        // Trigger the mutation with the workflow ID and the serialized definition.
        saveMutation.mutate({
          id: workflowId,
          definition: workflowDefinition
        });
      }}
    >
      <CheckIcon size={16} className="stroke-green-400" />
      Save
    </Button>
  );
}
