"use client";

import { ParamProps } from "@/types/appNodes";
import React, { useId } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

/**
 * OptionType defines the structure for options in the select dropdown.
 *
 * @typedef {Object} OptionType
 * @property {string} label - The display label for the option.
 * @property {string} value - The value associated with the option.
 */
type OptionType = {
  label: string;
  value: string;
};

/**
 * SelectParam Component.
 *
 * This component renders a labeled select dropdown populated with options provided in the `param`.
 * It is designed to update the parameter value when the user selects an option.
 *
 * @param {ParamProps} props - The component properties.
 * @param {object} props.param - The parameter object which contains metadata including the name, required flag, and options.
 * @param {function} props.updateNodeParamValue - Callback function to update the parameter value.
 * @param {string} props.value - The current value of the parameter.
 * @returns {JSX.Element} The rendered select dropdown component.
 */
export default function SelectParam({
  param,
  updateNodeParamValue,
  value
}: ParamProps) {
  // Generate a unique ID for the label to associate it with the select input.
  const id = useId();

  return (
    <div className="flex flex-col gap-1 w-full">
      {/* Render the label for the select input. If the parameter is required, display an asterisk. */}
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      {/* Render the select dropdown component */}
      <Select
        onValueChange={(value) => updateNodeParamValue(value)}
        defaultValue={value}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Options</SelectLabel>
            {/* Map through the parameter options and render each as a select item */}
            {param.options.map((option: OptionType) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
