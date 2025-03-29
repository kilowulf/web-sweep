"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * NavigationTabs Component.
 *
 * Renders a tabbed navigation interface for a workflow.
 * It determines the active tab based on the current URL pathname.
 * The component provides two tabs:
 * - Editor: Navigates to the workflow editor.
 * - Runs: Navigates to the workflow runs page.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.workflowId - The unique identifier of the workflow.
 * @returns {JSX.Element} The rendered navigation tabs component.
 */
export default function NavigationTabs({ workflowId }: { workflowId: string }) {
  // Retrieve the current pathname using Next.js navigation hook.
  const pathName = usePathname();
  // Extract the active tab from the URL; expects the active value at the 3rd segment.
  const activeValue = pathName?.split("/")[2];
  console.log("ACTIVE VALUE", activeValue);

  return (
    <Tabs value={activeValue} className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        {/* Editor Tab */}
        <Link href={`/workflow/editor/${workflowId}`}>
          <TabsTrigger value="editor" className="w-full">
            Editor
          </TabsTrigger>
        </Link>
        {/* Runs Tab */}
        <Link href={`/workflow/runs/${workflowId}`}>
          <TabsTrigger value="runs" className="w-full">
            Runs
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  );
}
