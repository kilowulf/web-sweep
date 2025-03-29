import { FlowValidationContext } from "@/components/context/FlowValidationContext";
import { useContext } from "react";

/**
 * useFlowValidation Hook.
 *
 * This custom hook provides access to the FlowValidationContext, which manages validation
 * state (such as invalid inputs) for workflow nodes. It ensures that the hook is used within
 * a FlowValidationContext provider, and if not, throws an error.
 *
 * @returns {FlowValidationContextType} The current flow validation context including invalidInputs, setInvalidInputs, and clearErrors.
 * @throws {Error} If the hook is used outside of a FlowValidationContext provider.
 */
export default function useFlowValidation() {
  const context = useContext(FlowValidationContext);
  if (!context) {
    throw new Error(
      "useFlowValidation must be used within a FlowValidationContext"
    );
  }

  const { invalidInputs, setInvalidInputs, clearErrors } = context;
  console.log("invalidInputs: useFlowValidation", invalidInputs);
  return context;
}
