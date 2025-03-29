import { LucideProps } from "lucide-react";
import { TaskParam, TaskType } from "@/types/task";
import { AppNode } from "@/types/appNodes";

/**
 * WorkflowStatus enum.
 *
 * Represents the publication status of a workflow.
 * - DRAFT: The workflow is still in development.
 * - PUBLISHED: The workflow is live and can be executed.
 */
export enum WorkflowStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED"
}

/**
 * WorkflowTask type.
 *
 * Defines the configuration for a task within a workflow.
 *
 * @property {string} label - The display name of the task.
 * @property {React.FC<LucideProps>} icon - The icon component for the task.
 * @property {TaskType} type - The unique task type identifier.
 * @property {boolean} [isEntryPoint] - Indicates if the task can serve as an entry point in the workflow.
 * @property {TaskParam[]} inputs - The list of input parameters required by the task.
 * @property {TaskParam[]} outputs - The list of output parameters produced by the task.
 * @property {number} credits - The cost in credits to execute the task.
 */
export type WorkflowTask = {
  label: string;
  icon: React.FC<LucideProps>;
  type: TaskType;
  isEntryPoint?: boolean;
  inputs: TaskParam[];
  outputs: TaskParam[];
  credits: number;
};

/**
 * WorkflowExecutionPlanPhase type.
 *
 * Represents a single phase within the workflow execution plan.
 *
 * @property {number} phase - The phase number.
 * @property {AppNode[]} nodes - An array of nodes (tasks) to be executed in this phase.
 */
export type WorkflowExecutionPlanPhase = {
  phase: number;
  nodes: AppNode[];
};

/**
 * WorkflowExecutionPlan type.
 *
 * Represents the overall execution plan as an array of phases.
 */
export type WorkflowExecutionPlan = WorkflowExecutionPlanPhase[];

/**
 * WorkflowExecutionStatus enum.
 *
 * Represents the various statuses that a workflow execution can have.
 * - PENDING: The execution is waiting to be started.
 * - RUNNING: The execution is currently in progress.
 * - COMPLETED: The execution finished successfully.
 * - FAILED: The execution encountered an error.
 */
export enum WorkflowExecutionStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}

/**
 * WorkflowExecutionTrigger enum.
 *
 * Indicates the source or method by which a workflow execution was triggered.
 * - MANUAL: Triggered by user action.
 * - SCHEDULED: Triggered by a scheduled event.
 * - CRON: Triggered by a cron job.
 */
export enum WorkflowExecutionTrigger {
  MANUAL = "MANUAL",
  SCHEDULED = "SCHEDULED",
  CRON = "CRON"
}

/**
 * ExecutionPhaseStatus enum.
 *
 * Represents the status of an individual phase within a workflow execution.
 * - CREATED: The phase has been created.
 * - PENDING: The phase is pending execution.
 * - RUNNING: The phase is currently executing.
 * - COMPLETED: The phase executed successfully.
 * - FAILED: The phase encountered an error during execution.
 */
export enum ExecutionPhaseStatus {
  CREATED = "CREATED",
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}
