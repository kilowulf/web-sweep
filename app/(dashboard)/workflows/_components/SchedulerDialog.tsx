"use client";
import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { CalendarIcon, ClockIcon, TriangleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { UpdateWorkflowCron } from "@/actions/workflows/updateWorkflowCron";
import { toast } from "sonner";
import cronstrue from "cronstrue";
import { RemoveWorkflowSchedule } from "@/actions/workflows/removeWorkflowSchedule";
import { Separator } from "@/components/ui/separator";

/**
 * SchedulerDialog Component.
 *
 * Renders a dialog that allows the user to set, update, or remove a cron schedule
 * for periodic workflow execution. The component validates the cron expression and
 * displays a human-readable description of the schedule.
 *
 * @param {Object} props - Component properties.
 * @param {string|null} props.cron - The current cron expression for the workflow, or null if not set.
 * @param {string} props.workflowId - The unique identifier of the workflow.
 * @returns {JSX.Element} The SchedulerDialog component.
 */

export default function SchedulerDialog(props: {
  cron: string | null;
  workflowId: string;
}) {
  // Initialize the input state with the saved cron expression (if any)
  const [cron, setCron] = useState(props.cron || "");

  // Compute the validity and human-readable string synchronously from the current input.
  const { validCron, humanCronStr } = useMemo(() => {
    if (!cron) {
      return { validCron: false, humanCronStr: "Not a valid cron expression" };
    }
    try {
      const humanCronStr = cronstrue.toString(cron);
      return { validCron: true, humanCronStr };
    } catch (error) {
      return { validCron: false, humanCronStr: "Not a valid cron expression" };
    }
  }, [cron]);

  // Compute the human-readable form of the saved cron (if one exists)
  const workflowHasValidCron = props.cron && props.cron.length > 0;
  const readableSavedCron = workflowHasValidCron
    ? (() => {
        try {
          return cronstrue.toString(props.cron!);
        } catch (error) {
          return "Not a valid cron expression";
        }
      })()
    : "";

  // mutation: create / update cron task
  const mutation = useMutation({
    mutationFn: UpdateWorkflowCron,
    onSuccess: () => {
      toast.success("Schedule updated successfully", { id: "cron" });
    },
    onError: () => {
      toast.error("Schedule failed to update", { id: "cron" });
    }
  });

  // mutation: remove old cron
  const removeScheduleMutation = useMutation({
    mutationFn: RemoveWorkflowSchedule,
    onSuccess: () => {
      toast.success("Schedule removed successfully", { id: "cron" });
    },
    onError: () => {
      toast.error("Schedule failed to be removed", { id: "cron" });
    }
  });

  return (
    <Dialog>
      {/* Dialog trigger button displays the current schedule or a prompt to set one */}
      <DialogTrigger asChild>
        <Button
          variant={"link"}
          className={cn(
            "text-sm p-0 h-auto text-orange-500",
            workflowHasValidCron && "text-primary"
          )}
          size={"sm"}
        >
          {workflowHasValidCron ? (
            <div className="flex items-center gap-2">
              <ClockIcon />
              {readableSavedCron}
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <TriangleAlertIcon className="h-3 w-3" />
              Set schedule
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        {/* Custom header with title and calendar icon */}
        <CustomDialogHeader
          title="Schedule workflow execution"
          icon={CalendarIcon}
        />
        <div className="p-6 space-y-4">
          {/* Instructional text */}
          <p className="text-muted-foreground text-sm">
            Specify a cron expression to schedule periodic workflow execution.
            <br />
            <span className="text-muted-foreground text-xs">
              * All times are UTC timezone
            </span>
          </p>
          {/* Input for the cron expression */}
          <Input
            placeholder="e.g. * * * * *"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
          />
          {/* Display the human-readable cron string with dynamic styling based on validity */}
          <div
            className={cn(
              "bg-accent rounded-md p-4 border text-sm",
              validCron
                ? "border-primary text-primary"
                : "border-destructive text-destructive"
            )}
          >
            {humanCronStr}
          </div>
          {/* If a valid schedule exists, provide an option to remove it */}
          {workflowHasValidCron && (
            <DialogClose asChild>
              <div className="">
                <Button
                  variant={"outline"}
                  className="w-full text-destructive border-destructive hover:text-destructive"
                  disabled={
                    mutation.isPending || removeScheduleMutation.isPending
                  }
                  onClick={() => {
                    toast.loading("Removing schedule...", { id: "cron" });
                    removeScheduleMutation.mutate(props.workflowId);
                  }}
                >
                  Remove schedule
                </Button>
                <Separator className="my-4" />
              </div>
            </DialogClose>
          )}
        </div>
        {/* Dialog footer with Cancel and Save actions */}
        <DialogFooter className="px-6 gap-2">
          <DialogClose asChild>
            <Button className="w-full" variant={"secondary"}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="w-full"
              disabled={mutation.isPending || !validCron}
              onClick={() => {
                toast.loading("Saving schedule...", { id: "cron" });
                mutation.mutate({ id: props.workflowId, cron });
              }}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
