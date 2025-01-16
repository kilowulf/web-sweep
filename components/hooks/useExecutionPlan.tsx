import {
  FlowToExecutionPlan,
  FlowToExecutionPlanValidationError
} from "@/lib/workflow/executionPlan";
import { AppNode } from "@/types/appNodes";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import useFlowValidation from "@/components/hooks/useFlowValidation";
import { toast } from "sonner";

//timestamp: 5:03:15
const useExecutionPlan = () => {
  const { toObject } = useReactFlow();
  const { setInvalidInputs, clearErrors } = useFlowValidation();
  const handleError = useCallback(
    (error: any) => {
      switch (error.type) {
        case FlowToExecutionPlanValidationError.NO_ENTRY_POINT:
          toast.error("No entry point found");
          break;
        case FlowToExecutionPlanValidationError.INVALID_INPUTS:
          toast.error("Not all input values have been set.");
          console.log("Invalid inputs:switch case error", error.InvalidElements);
          setInvalidInputs(error.InvalidElements);
          break;
        default:
          toast.error("Default Error: Something went wrong");
          break;
      }
    },
    [setInvalidInputs]
  );
  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();
    const { executionPlan, error } = FlowToExecutionPlan(
      nodes as AppNode[],
      edges
    );

    if (error) {
      handleError(error);
      return null;
    }
    clearErrors();
    return executionPlan;
  }, [toObject, handleError, clearErrors]);

  return generateExecutionPlan;
};

export default useExecutionPlan;
