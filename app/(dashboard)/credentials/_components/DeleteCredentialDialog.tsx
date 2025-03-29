"use client";

import { DeleteCredential } from "@/actions/credentials/deleteCredential";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Props for DeleteCredentialDialog component.
 *
 * @typedef {Object} Props
 * @property {string} name - The name of the credential to be deleted. This value is also used for confirmation.
 */
interface Props {
  name: string;
}

/**
 * DeleteCredentialDialog Component.
 *
 * This component renders a confirmation dialog that requires the user to type in the name of the credential
 * before proceeding with deletion. It uses the react-query mutation hook to perform the deletion action,
 * and displays appropriate toast notifications for success or error states.
 *
 * @param {Props} props - The props for the component.
 * @param {string} props.name - The name of the credential to be deleted.
 * @returns {JSX.Element} A dialog component that handles credential deletion.
 */

export default function DeleteCredentialDialog({ name }: Props) {
  // State to hold the confirmation text input by the user.
  const [confirmText, setConfirmText] = useState("");
  // State to manage the visibility of the alert dialog.
  const [open, setOpen] = useState(false);

  // Configure the mutation to delete a credential using the provided DeleteCredential function.
  // On success, a success toast is displayed, and the dialog is closed.
  // On error, an error toast is displayed.
  const deleteMutation = useMutation({
    mutationFn: DeleteCredential,
    onSuccess: () => {
      toast.success("Credential deleted successfully", {
        id: name
      });
      // Reset the confirmation input and close the dialog after successful deletion.
      setConfirmText("");
      setOpen(false);
    },
    onError: () => {
      toast.error("Something went wrong while deleting credential", {
        id: name
      });
    }
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} size={"icon"}>
          <XIcon size={18} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this credential?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Credential will be permanently deleted if you proceed.
            <div className="flex flex-col py-4 gap-2">
              <p>
                Enter <b>{name}</b> to confirm:
              </p>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText("")}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmText !== name || deleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => {
              toast.loading("Deleting credential...", {
                id: name
              });
              deleteMutation.mutate(name);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
