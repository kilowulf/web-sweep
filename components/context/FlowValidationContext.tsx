import { AppNodeMissingInputs } from "@/types/appNodes";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState
} from "react";

/**
 * FlowValidationContextType defines the shape of the context used for managing
 * validation errors in the workflow nodes. It includes the current list of invalid inputs,
 * a setter function to update the list, and a helper function to clear all errors.
 *
 * @typedef {Object} FlowValidationContextType
 * @property {AppNodeMissingInputs[]} invalidInputs - An array of nodes with missing inputs.
 * @property {Dispatch<SetStateAction<AppNodeMissingInputs[]>>} setInvalidInputs - Function to update the invalidInputs state.
 * @property {() => void} clearErrors - Function to clear all validation errors.
 */
type FlowValidationContextType = {
  invalidInputs: AppNodeMissingInputs[];
  setInvalidInputs: Dispatch<SetStateAction<AppNodeMissingInputs[]>>;
  clearErrors: () => void;
};

/**
 * FlowValidationContext is a React context used to provide and manage validation errors
 * for workflow nodes across the application. It is initialized with null and will be provided
 * by the FlowValidationContextProvider component.
 */
export const FlowValidationContext =
  createContext<FlowValidationContextType | null>(null);

/**
 * FlowValidationContextProvider Component.
 *
 * This component wraps its children with a FlowValidationContext.Provider and provides
 * state management for tracking invalid inputs in workflow nodes. It initializes the invalidInputs
 * state as an empty array and exposes a clearErrors function to reset the errors.
 *
 * @param {Object} props - Component properties.
 * @param {ReactNode} props.children - The child elements that will have access to the validation context.
 * @returns {JSX.Element} The FlowValidationContextProvider component wrapping its children.
 */
export function FlowValidationContextProvider({
  children
}: {
  children: ReactNode;
}) {
  const [invalidInputs, setInvalidInputs] = useState<AppNodeMissingInputs[]>(
    []
  );

  /**
   * clearErrors resets the invalidInputs state to an empty array,
   * effectively clearing all recorded validation errors.
   */
  const clearErrors = () => {
    setInvalidInputs([]);
  };

  return (
    <FlowValidationContext.Provider
      value={{
        invalidInputs,
        setInvalidInputs,
        clearErrors
      }}
    >
      {children}
    </FlowValidationContext.Provider>
  );
}
