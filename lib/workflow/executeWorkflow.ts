import "server-only";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus
} from "@/types/workflow";

// timestamp: 6:23:01
export async function ExecuteWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: { workflow: true, phases: true }
  });

  if (!execution) {
    throw new Error("execution not found");
  }

  // TODO: setup execution environment
  const environment = { phases: {} };

  // TODO; initialize workflow execution
  await initializeWorkflowExecution(executionId, execution.workflowId);

  // TODO: initialize phases status
  await initializePhasesStatus(execution);

  let executionFailed = false;
  for (const phase of execution.phases) {
    // TODO: execute phase
  }

  //TODO: finalize execution

  // TODO: clean up environment

  revalidatePath("/workflows/runs");
}

async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string
) {
  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING
    }
  });

  await prisma.workFlow.update({
    where: {
      id: workflowId
    },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
      lastRunId: executionId
    }
  });
}
async function initializePhasesStatus(execution: any) {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase: any) => phase.id)
      }
    },
    data: {
      status: ExecutionPhaseStatus.RUNNING
    }
  });
}
