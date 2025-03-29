import {
  FlowToExecutionPlan,
  FlowToExecutionPlanValidationError
} from "@/lib/workflow/executionPlan";
import { AppNode } from "@/types/appNodes";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import useFlowValidation from "@/components/hooks/useFlowValidation";
import { toast } from "sonner";

/**
 * useExecutionPlan is a custom hook that generates an execution plan from the current flow.
 *
 * It retrieves the current flow (nodes and edges) from React Flow, converts it into an execution plan,
 * and handles any validation errors by displaying appropriate toast notifications and updating the validation context.
 *
 * @returns {() => any | null} A function that, when called, returns the generated execution plan or null if an error occurs.
 */
const useExecutionPlan = () => {
  const { toObject } = useReactFlow();
  const { setInvalidInputs, clearErrors } = useFlowValidation();

  /**
   * handleError handles validation errors encountered during the execution plan generation.
   *
   * Depending on the error type, it displays a corresponding toast error message.
   * For invalid inputs, it logs the details and updates the invalid inputs state.
   *
   * @param {any} error - The error object returned from FlowToExecutionPlan.
   */
  const handleError = useCallback(
    (error: any) => {
      switch (error.type) {
        case FlowToExecutionPlanValidationError.NO_ENTRY_POINT:
          toast.error("No entry point found");
          break;
        case FlowToExecutionPlanValidationError.INVALID_INPUTS:
          toast.error("Not all input values have been set.");
          console.log(
            "Invalid inputs:switch case error",
            error.InvalidElements
          );
          setInvalidInputs(error.InvalidElements);
          break;
        default:
          toast.error("Default Error: Something went wrong");
          break;
      }
    },
    [setInvalidInputs]
  );

  /**
   * generateExecutionPlan converts the current flow (nodes and edges) into an execution plan.
   *
   * If any validation error occurs during the conversion, it handles the error and returns null.
   * Otherwise, it clears any previous validation errors and returns the generated execution plan.
   *
   * @returns {any | null} The execution plan if successful, otherwise null.
   */
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
