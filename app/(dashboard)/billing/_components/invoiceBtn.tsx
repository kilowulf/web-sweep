"use client";

import { DownloadInvoice } from "@/actions/billing/downloadInvoice";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

/**
 * Invoice Button Component
 *
 * Overview:
 * This component renders a button that, when clicked, triggers the download of an invoice.
 * It uses the React Query `useMutation` hook to manage the asynchronous operation.
 *
 * Key Functions and Variables:
 * - DownloadInvoice: Function that initiates the invoice download process.
 * - useMutation: Hook from "@tanstack/react-query" to handle asynchronous mutations.
 * - mutation: Object returned by useMutation that manages the mutation state (e.g., isPending).
 * - Button: Reusable UI component for rendering the styled button.
 * - Loader2Icon: Icon component that displays a loading spinner during the download operation.
 * - toast: Notification tool from "sonner" used to display error messages.
 *
 * How It Works:
 * - When the button is clicked, the `mutation.mutate(id)` function is called with the invoice ID.
 * - On success, the user is redirected to the URL returned by the download action (stripe invoice page).
 * - On error, an error toast notification is displayed.
 *
 * 
 */

export default function InvoiceBtn({ id }: { id: string }) {
  const mutation = useMutation({
    mutationFn: DownloadInvoice,
    onSuccess: (data) => (window.location.href = data as string),
    onError: () => {
      toast.error("Failed to download invoice");
    }
  });
  return (
    <Button
      variant={"ghost"}
      size={"sm"}
      className="text-xs gap-2 text-muted-foreground px-1"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate(id)}
    >
      invoice
      {mutation.isPending && <Loader2Icon className="w-4 h-4 animate-spin" />}
    </Button>
  );
}
