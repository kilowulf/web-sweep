"use client";

import React, { useCallback } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Layers2Icon, Loader2 } from "lucide-react";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { useForm } from "react-hook-form";
import {
  createWorkflowSchema,
  createWorkflowSchemaType
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

/**
 * CreateWorkflowDialog Component.
 *
 * Renders a dialog containing a form for creating a new workflow. It leverages
 * react-hook-form for form state management with Zod schema validation, and uses
 * a mutation hook to trigger the CreateWorkflow action. Toast notifications are
 * displayed during the workflow creation process to provide user feedback.
 *
 * @param {Object} props - Component properties.
 * @param {string} [props.triggerText] - Optional text to display on the trigger button.
 *                                        Defaults to "Create workflow" if not provided.
 * @returns {JSX.Element} The CreateWorkflowDialog component.
 */
export default function CreateWorkflowDialog({
  triggerText
}: {
  triggerText?: string;
}) {
  // State to manage the dialog's open/close status.
  const [open, setOpen] = React.useState(false);

  // Initialize the form with validation schema and default values.
  const form = useForm<createWorkflowSchemaType>({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: {}
  });

  // Setup mutation for creating a workflow.
  // Displays success or error toasts based on the outcome.
  const { mutate, isPending } = useMutation({
    mutationFn: CreateWorkflow,
    onSuccess: () => {
      toast.success("Workflow created successfully", { id: "create-workflow" });
    },
    onError: () => {
      toast.error("Failed to create workflow", { id: "create-workflow" });
    }
  });

  /**
   * onSubmit Callback.
   *
   * Called when the form is submitted. It triggers a loading toast and the mutation
   * to create a workflow using the provided form values.
   *
   * @param {createWorkflowSchemaType} values - The form data submitted by the user.
   */
  const onSubmit = useCallback(
    (values: createWorkflowSchemaType) => {
      toast.loading("Creating workflow...", { id: "create-workflow" });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        // Reset the form state when the dialog's open status changes.
        form.reset();
        setOpen(open);
      }}
    >
      {/* Button that triggers the dialog display */}
      <DialogTrigger asChild>
        <Button>{triggerText ?? "Create workflow"}</Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        {/* Custom dialog header with an icon, title, and subtitle */}
        <CustomDialogHeader
          icon={Layers2Icon}
          title="Create workflow"
          subTitle="Start building your workflow"
        />
        <div className="p-6">
          {/* Form wrapper integrating react-hook-form */}
          <Form {...form}>
            <form
              className="space-y-8 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {/** Name Field */}
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
              {/** Description Field */}
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
              {/* Submit button that shows a loader if the mutation is in progress */}
              <Button type="submit" className="w-full" disabled={isPending}>
                {!isPending && "Proceed"}
                {isPending && <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
