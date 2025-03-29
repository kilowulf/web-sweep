"use client";

import { Button } from "@/components/ui/button";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { PlayIcon } from "lucide-react";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { RunWorkflow } from "@/actions/workflows/runWorkflow";
import { toast } from "sonner";
import { useReactFlow } from "@xyflow/react";

/**
 * ExecuteBtn Component.
 *
 * Renders a button that triggers the execution of a workflow.
 * It generates an execution plan using a custom hook, serializes the current flow definition,
 * and invokes a mutation to run the workflow. Toast notifications provide user feedback on the action's status.
 *
 * @param {Object} props - Component props.
 * @param {string} props.workflowId - The unique identifier of the workflow to execute.
 * @returns {JSX.Element} The rendered execute button.
 */
export default function ExecuteBtn({ workflowId }: { workflowId: string }) {
  // Custom hook to generate an execution plan for the workflow.
  const generate = useExecutionPlan();
  // Retrieve the flow object converter from the React Flow context.
  const { toObject } = useReactFlow();

  // Define a mutation to run the workflow using the RunWorkflow action.
  const mutation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: () => {
      // Notify success when workflow execution starts.
      toast.success("Execution started", { id: "flow-execution" });
    },
    onError: () => {
      // Notify error if workflow execution fails to start.
      toast.error("Error on execution start", { id: "flow-execution" });
    }
  });

  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        // Generate the execution plan.
        const plan = generate();
        if (!plan) {
          // If the plan is not valid, abort execution.
          return;
        }

        // Trigger the mutation with the workflow ID and the serialized flow definition.
        mutation.mutate({
          workflowId: workflowId,
          flowDefinition: JSON.stringify(toObject())
        });
      }}
    >
      <PlayIcon size={16} className="stroke-orange-400" />
      Execute
    </Button>
  );
}
