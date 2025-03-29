"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  content: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

/**
 * TooltipWrapper Component.
 *
 * This component wraps its children with tooltip functionality.
 * If the `content` prop is provided, it renders the tooltip using the UI tooltip components.
 * Otherwise, it renders the children as-is.
 *
 * @param {Props} props - Component properties.
 * @returns {JSX.Element} The rendered children wrapped with tooltip functionality if content exists.
 */

export default function TooltipWrapper(props: Props) {
  if (!props.content) {
    return <>{props.children}</>;
  }
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{props.children}</TooltipTrigger>
        <TooltipContent side={props.side}>{props.content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
