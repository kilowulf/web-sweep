"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

// timestamp: 2:09:32
export default function NodeCard({
  children,
  nodeId,
  isSelected
}: {
  nodeId: string;
  children: ReactNode;
  isSelected: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-md cursor-pointer bg-background border-2 borer-separate w-[420px] text-xs gap-1 flex flex-col",
        isSelected && "border-primary"
      )}
    >
      {children}
    </div>
  );
}
