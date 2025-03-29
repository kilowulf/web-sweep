import { cn } from "@/lib/utils";
import { WorkflowExecutionStatus } from "@/types/workflow";
import React from "react";

/**
 * Mapping of workflow execution statuses to corresponding background color classes
 * for the indicator element.
 *
 * @type {Record<WorkflowExecutionStatus, string>}
 */
const indicatorColors: Record<WorkflowExecutionStatus, string> = {
  RUNNING: "bg-yellow-400",
  COMPLETED: "bg-emerald-600",
  FAILED: "bg-red-400",
  PENDING: "bg-slate-400"
};

/**
 * ExecutionStatusIndicator Component.
 *
 * Renders a small colored circle that visually represents the status of a workflow execution.
 * The color of the circle is determined by the execution status.
 *
 * @param {Object} props - Component properties.
 * @param {WorkflowExecutionStatus} props.status - The current status of the workflow execution.
 * @returns {JSX.Element} A div element styled as a colored circle.
 */
export default function ExecutionStatusIndicator({
  status
}: {
  status: WorkflowExecutionStatus;
}) {
  return (
    <div className={cn("w-2 h-2 rounded-full", indicatorColors[status])} />
  );
}

/**
 * Mapping of workflow execution statuses to corresponding text color classes
 * for the label element.
 *
 * @type {Record<WorkflowExecutionStatus, string>}
 */
const labelColors: Record<WorkflowExecutionStatus, string> = {
  RUNNING: "text-yellow-400",
  COMPLETED: "text-emerald-600",
  FAILED: "text-red-400",
  PENDING: "text-slate-400"
};

/**
 * ExecutionStatusLabel Component.
 *
 * Renders a text label that displays the workflow execution status in a styled manner.
 * The text color is determined by the status using the labelColors mapping.
 *
 * @param {Object} props - Component properties.
 * @param {WorkflowExecutionStatus} props.status - The current status of the workflow execution.
 * @returns {JSX.Element} A span element displaying the status text with appropriate styling.
 */
export function ExecutionStatusLabel({
  status
}: {
  status: WorkflowExecutionStatus;
}) {
  return <span className={cn("lowercase", labelColors[status])}>{status}</span>;
}
