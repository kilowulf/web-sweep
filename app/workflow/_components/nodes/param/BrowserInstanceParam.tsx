"use client";

import { ParamProps } from "@/types/appNodes";
import React from "react";

/**
 * BrowserInstanceParam Component.
 *
 * This component renders a simple paragraph element that displays the name of a parameter.
 * It accepts a prop containing the parameter details and styles the text with a small font size.
 *
 * @param {ParamProps} props - The component props.
 * @param {object} props.param - The parameter object containing at least a "name" property.
 * @returns {JSX.Element} A paragraph element displaying the parameter's name.
 */
export default function BrowserInstanceParam({ param }: ParamProps) {
  return <p className="text-xs">{param.name}</p>;
}
