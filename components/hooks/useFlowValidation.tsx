import { FlowValidationContext } from "@/components/context/FlowValidationContext";
import { useContext } from "react";

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
