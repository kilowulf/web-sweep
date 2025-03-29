"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ParamProps } from "@/types/appNodes";
import { TaskParam } from "@/types/task";
import { useEffect, useId, useState } from "react";

/**
 * StringParam Component.
 *
 * Renders an input field for string parameters. Depending on the `variant` specified
 * in the `param` prop, it will render either a standard input or a textarea.
 * The component maintains an internal state for the input value and notifies
 * the parent component of changes via the `updateNodeParamValue` callback on blur.
 *
 * @param {ParamProps} props - The component props.
 * @param {object} props.param - The parameter metadata including name, required flag, helper text, and variant.
 * @param {string} props.value - The current value of the parameter.
 * @param {function} props.updateNodeParamValue - Callback to update the parameter value.
 * @param {boolean} props.disabled - Determines if the input field is disabled.
 * @returns {JSX.Element} The rendered string input component.
 */
export default function StringParam({
  param,
  value,
  updateNodeParamValue,
  disabled
}: ParamProps) {
  // Generate a unique ID for the input field.
  const id = useId();

  // Manage the internal state for the input value.
  const [internalValue, setInternalValue] = useState(value);

  // Update internal state when the value prop changes.
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Select the component to use: default to Input; if variant is "textarea", use Textarea.
  let Component: any = Input;
  if (param.variant === "textarea") {
    Component = Textarea;
  }

  return (
    <div className="space-y-1 p-1 w-full">
      {/* Label for the input field. Displays an asterisk if the field is required. */}
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      {/* Render the chosen input component with appropriate props and event handlers. */}
      <Component
        id={id}
        disabled={disabled}
        className="text-xs text-muted-foreground"
        value={internalValue}
        placeholder="Enter value here"
        onChange={(e: any) => setInternalValue(e.target.value)}
        onBlur={(e: any) => updateNodeParamValue(e.target.value)}
      />
      {/* Display helper text if provided in the param object. */}
      {param.helperText && (
        <p className="text-muted-foreground px-2">{param.helperText}</p>
      )}
    </div>
  );
}
