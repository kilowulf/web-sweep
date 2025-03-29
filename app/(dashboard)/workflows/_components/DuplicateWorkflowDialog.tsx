"use client";

import React, { useCallback } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CopyIcon, Layers2Icon, Loader2 } from "lucide-react";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { useForm } from "react-hook-form";
import {
  duplicateWorkflowSchema,
  duplicateWorkflowSchemaType
} from "@/schema/workflow";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { CreateWorkflow } from "@/actions/workflows/createWorkflow";
import { toast } from "sonner";
import { DuplicateWorkflow } from "@/actions/workflows/duplicateWorkflow";
import { cn } from "@/lib/utils";

/**
 * DuplicateWorkflowDialog Component.
 *
 * Renders a dialog containing a form to duplicate an existing workflow. The form is managed
 * using react-hook-form with Zod schema validation. On form submission, the duplication
 * process is triggered via a mutation hook, and user feedback is provided through toast notifications.
 *
 * @param {Object} props - Component properties.
 * @param {string} [props.workflowId] - Optional workflow ID to be duplicated, used as a default form value.
 * @returns {JSX.Element} The DuplicateWorkflowDialog component.
 */
export default function DuplicateWorkflowDialog({
  workflowId
}: {
  workflowId?: string;
}) {
  // State to manage the dialog's open/closed status.
  const [open, setOpen] = React.useState(false);
  // Initialize the form with default values and schema validation using zodResolver.
  const form = useForm<duplicateWorkflowSchemaType>({
    resolver: zodResolver(duplicateWorkflowSchema),
    defaultValues: {
      workflowId
    }
  });

  // Setup a mutation hook to handle workflow duplication.
  // On success, display a success toast and toggle the dialog's open state.
  // On error, display an error toast.
  const { mutate, isPending } = useMutation({
    mutationFn: DuplicateWorkflow,
    onSuccess: () => {
      toast.success("Workflow duplicated successfully", {
        id: "duplicate-workflow"
      });
      setOpen((prev) => !prev);
    },
    onError: () => {
      toast.error("Failed to duplicate workflow", { id: "duplicate-workflow" });
    }
  });

  /**
   * onSubmit Callback.
   *
   * Handles form submission by triggering a loading toast and calling the duplication mutation
   * with the provided form values.
   *
   * @param {duplicateWorkflowSchemaType} values - The form values submitted by the user.
   */
  const onSubmit = useCallback(
    (values: duplicateWorkflowSchemaType) => {
      toast.loading("Duplicating workflow...", { id: "duplicate-workflow" });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      {/* Button to trigger the dialog, styled to show on hover */}
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          size={"icon"}
          className={cn(
            "ml-2 transition-opacity duration-200 opacity-0 group-hover/card:opacity-100"
          )}
        >
          <CopyIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          icon={Layers2Icon}
          title="Duplicate workflow"
          subTitle="Start building redundant workflows"
        />
        <div className="p-6">
          <Form {...form}>
            <form
              className="space-y-8 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {/**name field **/}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap1 items-center">
                      Name
                      <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a descriptive and unique name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/**description field **/}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap1 items-center">
                      Description
                      <p className="text-xs text-muted-foreground">
                        (optional)
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a brief description of what your workflow does.
                      <br />
                      This is optional but can help you remember the
                      workflow&apos;s purpose
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Submit button: displays "Continue" when not pending, or a loader icon when pending */}
              <Button type="submit" className="w-full" disabled={isPending}>
                {!isPending ? "Continue" : <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
