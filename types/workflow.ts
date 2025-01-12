import { LucideProps } from "lucide-react";
import { TaskParam, TaskType } from "@/types/task";
import { AppNode } from "@/types/appNodes";

export enum WorkflowStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED"
}

export type WorkflowTask = {
  label: string;
  icon: React.FC<LucideProps>;
  type: TaskType;
  isEntryPoint?: boolean;
  inputs: TaskParam[];
  outputs: TaskParam[];
  credits: number;
};

export type WorkflowExecutionPlan = {
  phase: number;
  nodes: AppNode[];
}[];
