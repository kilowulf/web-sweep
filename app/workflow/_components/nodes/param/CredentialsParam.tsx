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
import { useQuery } from "@tanstack/react-query";
import { GetCredentialsForUser } from "@/actions/credentials/getCredentialsForUser";

/**
 * CredentialsParam Component.
 *
 * This component renders a labeled select dropdown populated with user credentials.
 * It uses react-query to fetch the credentials data and displays the options within the select.
 * When a credential is selected, it calls the updateNodeParamValue callback with the new value.
 *
 * @param {ParamProps} props - Component properties.
 * @param {object} props.param - The parameter object containing metadata such as the parameter name and whether it is required.
 * @param {function} props.updateNodeParamValue - Callback function to update the parameter value when the selection changes.
 * @param {string} props.value - The current value of the parameter.
 * @returns {JSX.Element} The rendered credentials select dropdown component.
 */
export default function CredentialsParam({
  param,
  updateNodeParamValue,
  value
}: ParamProps) {
  // Generate a unique id for the label association.
  const id = useId();

  // Fetch the user's credentials using react-query with a refetch interval of 10 seconds.
  const query = useQuery({
    queryKey: ["credentials-for-user"],
    queryFn: () => GetCredentialsForUser(),
    refetchInterval: 10000
  });

  return (
    <div className="flex flex-col gap-1 w-full">
      {/* Label for the select input */}
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      {/* Select dropdown for choosing a credential */}
      <Select
        onValueChange={(value) => updateNodeParamValue(value)}
        defaultValue={value}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Credentials</SelectLabel>
            {query.data?.map((credential) => (
              <SelectItem key={credential.id} value={credential.id}>
                {credential.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
