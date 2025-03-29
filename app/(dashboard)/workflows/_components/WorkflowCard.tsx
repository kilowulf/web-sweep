"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WorkflowExecutionStatus, WorkflowStatus } from "@/types/workflow";
import { WorkFlow } from "@prisma/client";
import {
  ChevronRightIcon,
  ClockIcon,
  CoinsIcon,
  CornerLeftDown,
  CornerRightDown,
  FileTextIcon,
  MoreVerticalIcon,
  MoveRightIcon,
  PlayIcon,
  ShuffleIcon,
  TrashIcon
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import TooltipWrapper from "@/components/TooltipWrapper";
import DeleteWorkflowDialog from "@/app/(dashboard)/workflows/_components/DeleteWorkflowDialog";
import RunBtn from "@/app/(dashboard)/workflows/_components/RunBtn";
import SchedulerDialog from "@/app/(dashboard)/workflows/_components/SchedulerDialog";
import { Badge } from "@/components/ui/badge";
import ExecutionStatusIndicator, {
  ExecutionStatusLabel
} from "@/app/workflow/runs/[workflowId]/_components/ExecutionStatusIndicator";
import { format, formatDistanceToNow } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import DuplicateWorkflowDialog from "./DuplicateWorkflowDialog";

const statusColors = {
  [WorkflowStatus.DRAFT]: "bg-yellow-500",
  [WorkflowStatus.PUBLISHED]: "bg-green-500"
};

/**
 * WorkflowCard Component.
 *
 * Renders a card displaying key details of a workflow including its status, name, scheduling information,
 * and various actions such as run, edit, duplicate, and delete.
 *
 * @param {Object} props - Component properties.
 * @param {WorkFlow} props.workflow - The workflow data to display.
 * @returns {JSX.Element} The rendered workflow card.
 */
export default function WorkflowCard({ workflow }: { workflow: WorkFlow }) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;
  return (
    <Card className="border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-md dark:shadow-primary/30 group/card">
      <CardContent className="p-4 flex items-center justify-between h-[100px]">
        <div className="flex items-center justify-end space-x-3">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              statusColors[workflow.status as WorkflowStatus]
            )}
          >
            {isDraft ? (
              <FileTextIcon className="h-5 w-5" />
            ) : (
              <PlayIcon className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-based font-bold text-muted-foreground flex items-center">
              <TooltipWrapper content={workflow.description}>
                <Link
                  href={`/workflow/editor/${workflow.id}`}
                  className="flex items-center hover:underline"
                >
                  {workflow.name}
                </Link>
              </TooltipWrapper>

              {isDraft && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Draft
                </span>
              )}
              <DuplicateWorkflowDialog workflowId={workflow.id} />
            </h3>
            <SchedulerSection
              isDraft={isDraft}
              creditsCost={workflow.creditsCost}
              workflowId={workflow.id}
              cron={workflow.cron}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isDraft && <RunBtn workflowId={workflow.id} />}
          <Link
            href={`/workflow/editor/${workflow.id}`}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "sm"
              }),
              "flex items-center gap-2"
            )}
          >
            <ShuffleIcon size={16} />
            Edit
          </Link>
          <WorkflowActions
            workflowName={workflow.name}
            workflowId={workflow.id}
          />
        </div>
      </CardContent>
      <LastRunDetails workflow={workflow} />
    </Card>
  );
}

/**
 * WorkflowActions Component.
 *
 * Renders a dropdown menu with additional actions for a workflow, such as deletion.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.workflowName - The name of the workflow.
 * @param {string} props.workflowId - The unique identifier of the workflow.
 * @returns {JSX.Element} The rendered actions dropdown.
 */
function WorkflowActions({
  workflowName,
  workflowId
}: {
  workflowName: string;
  workflowId: string;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  return (
    <>
      <DeleteWorkflowDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        workflowName={workflowName}
        workflowId={workflowId}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} size={"sm"}>
            <TooltipWrapper content={"More actions"}>
              <div className="flex items-center justify-center w-full h-full">
                <MoreVerticalIcon size={18} />
              </div>
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive flex items-center gap-2"
            onSelect={() => {
              setShowDeleteDialog((prev) => !prev);
            }}
          >
            <TrashIcon size={16} /> Delete
          </DropdownMenuItem>
          <DropdownMenuItem></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

/**
 * SchedulerSection Component.
 *
 * Displays scheduling information for a workflow. When the workflow is published (not in draft),
 * it shows a scheduler dialog to update the cron schedule and a badge indicating credit consumption.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.isDraft - Indicates if the workflow is in draft mode.
 * @param {number} props.creditsCost - The cost in credits for running the workflow.
 * @param {string} props.workflowId - The unique identifier of the workflow.
 * @param {string|null} props.cron - The cron expression string for scheduling.
 * @returns {JSX.Element|null} The rendered scheduling section or null if the workflow is a draft.
 */
function SchedulerSection({
  isDraft,
  creditsCost,
  workflowId,
  cron
}: {
  isDraft: boolean;
  creditsCost: number;
  workflowId: string;
  cron: string | null;
}) {
  if (isDraft) return null;
  return (
    <div className="flex items-center gap-2">
      <CornerRightDown className="h-4 w-4 text-muted-foreground" />
      {/**
       * SchedulerDialog renders a dialog to update or set the cron schedule.
       * A key is provided to force a refresh when the cron or workflowId changes.
       */}
      <SchedulerDialog
        workflowId={workflowId}
        cron={cron}
        key={`${cron}-${workflowId}`}
      />
      <MoveRightIcon className="h-4 w-4 text-muted-foreground" />
      <TooltipWrapper content={"Credit consumption for full run"}>
        <div className="flex items-center gap-3">
          <Badge
            variant={"outline"}
            className="space-x-2 text-muted-foreground rounded-sm"
          />
          <CoinsIcon className="h-4 w-4" />
          <span className="text-sm">{creditsCost}</span>
        </div>
      </TooltipWrapper>
    </div>
  );
}

/**
 * LastRunDetails Component.
 *
 * Displays information about the last and upcoming runs of a workflow. If the workflow is published,
 * it shows the time since the last run, the run status, and details about the next scheduled run.
 *
 * @param {Object} props - Component properties.
 * @param {WorkFlow} props.workflow - The workflow object containing run details.
 * @returns {JSX.Element|null} The rendered run details or null if the workflow is a draft.
 */
function LastRunDetails({ workflow }: { workflow: WorkFlow }) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;
  if (isDraft) {
    return null;
  }
  const { lastRunAt, lastRunStatus, lastRunId, nextRunAt } = workflow;
  const formattedStartedAt =
    lastRunAt && formatDistanceToNow(lastRunAt, { addSuffix: true });
  const nextSchedule = nextRunAt && format(nextRunAt, "yyyy-MM-dd HH:mm");
  const nextScheduleUTC =
    nextRunAt && formatInTimeZone(nextRunAt, "UTC", "HH:mm");

  return (
    <div className="bg-primary/5 px-4 py-1 flex justify-between items-center text-muted-foreground ">
      <div className="flex items-center text-sm gap-2 group">
        {lastRunAt ? (
          <Link
            href={`/workflow/runs/${workflow.id}/${lastRunId}`}
            className="flex items-center text-sm gap-2"
          >
            <span>Last run:</span>
            <ExecutionStatusIndicator
              status={lastRunStatus as WorkflowExecutionStatus}
            />
            <ExecutionStatusLabel
              status={lastRunStatus as WorkflowExecutionStatus}
            />
            <span>{formattedStartedAt}</span>
            <ChevronRightIcon
              size={14}
              className="-translate-x-[2px] group-hover:translate-x-0 transition"
            />
          </Link>
        ) : (
          <p>No runs yet</p>
        )}
      </div>
      {nextRunAt && (
        <div className="flex items-center text-sm gap-2">
          <ClockIcon size={12} />
          <span>Next run at:</span>
          <span>{nextSchedule}</span>
          <span className="text-xs">({nextScheduleUTC}) UTC</span>
        </div>
      )}
    </div>
  );
}
