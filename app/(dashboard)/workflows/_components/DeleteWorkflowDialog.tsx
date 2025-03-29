"use client";

import { DeleteWorkflow } from "@/actions/workflows/deleteWorkflow";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Props for the DeleteWorkflowDialog component.
 *
 * @typedef {Object} Props
 * @property {boolean} open - Determines if the dialog is open.
 * @property {(open: boolean) => void} setOpen - Function to update the dialog's open state.
 * @property {string} workflowName - The name of the workflow to be deleted.
 * @property {string} workflowId - The unique identifier of the workflow.
 */

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  workflowName: string;
  workflowId: string;
}

/**
 * DeleteWorkflowDialog Component.
 *
 * Renders a confirmation dialog that prompts the user to enter the workflow name in order
 * to confirm deletion. It uses a mutation hook to call the DeleteWorkflow action and shows
 * toast notifications for success or error states.
 *
 * @param {Props} props - The component properties.
 * @returns {JSX.Element} The alert dialog for deleting a workflow.
 */

export default function DeleteWorkflowDialog({
  open,
  setOpen,
  workflowName,
  workflowId
}: Props) {
  // State to store the confirmation input text.
  const [confirmText, setConfirmText] = useState("");

  // Setup mutation for deleting the workflow.
  // On success, a success toast is displayed and the confirmation text is reset.
  // On error, an error toast is displayed.
  const deleteMutation = useMutation({
    mutationFn: DeleteWorkflow,
    onSuccess: () => {
      toast.success("Workflow deleted successfully", {
        id: workflowId
      });
      setConfirmText("");
    },
    onError: () => {
      toast.error("Something went wrong while deleting workflow", {
        id: workflowId
      });
    }
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this workflow?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Workflow will be permanently deleted if you proceed.
            <div className="flex flex-col py-4 gap-2">
              <p>
                Enter <b>{workflowName}</b> to confirm:
              </p>
              {/* Input for user confirmation: the workflow name must be entered exactly */}
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* Cancel button: resets the confirmation text when clicked */}
          <AlertDialogCancel onClick={() => setConfirmText("")}>
            Cancel
          </AlertDialogCancel>
          {/* Delete button: triggers the delete mutation if the confirmation text matches
              the workflow name and the deletion is not already in progress */}
          <AlertDialogAction
            disabled={confirmText !== workflowName || deleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => {
              toast.loading("Deleting workflow...", {
                id: workflowId
              });
              deleteMutation.mutate(workflowId);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
