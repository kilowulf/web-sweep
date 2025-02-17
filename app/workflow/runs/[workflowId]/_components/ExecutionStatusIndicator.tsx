import { cn } from "@/lib/utils";
import { WorkflowExecutionStatus } from "@/types/workflow";
import React from "react";

// timestamp: 10:49:20

const indicatorColors: Record<WorkflowExecutionStatus, string> = {
  RUNNING: "bg-yellow-400",
  COMPLETED: "bg-emerald-600",
  FAILED: "bg-red-400",
  PENDING: "bg-slate-400"
};

export default function ExecutionStatusIndicator({
  status
}: {
  status: WorkflowExecutionStatus;
}) {
  return (
    <div className={cn("w-2 h-2 rounded-full", indicatorColors[status])} />
  );
}

const labelColors: Record<WorkflowExecutionStatus, string> = {
  RUNNING: "text-yellow-400",
  COMPLETED: "text-emerald-600",
  FAILED: "text-red-400",
  PENDING: "text-slate-400"
};

export function ExecutionStatusLabel({
  status
}: {
  status: WorkflowExecutionStatus;
}) {
  return <span className={cn("lowercase", labelColors[status])}>{status}</span>;
}
