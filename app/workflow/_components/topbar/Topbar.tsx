"use client";

import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import SaveBtn from "@/app/workflow/_components/topbar/SaveBtn";
import ExecuteBtn from "@/app/workflow/_components/topbar/ExecuteBtn";
import NavigationTabs from "@/app/workflow/_components/topbar/NavigationTabs";
import PublishBtn from "@/app/workflow/_components/topbar/PublishBtn";
import UnPublishBtn from "@/app/workflow/_components/topbar/UnPublishBtn";

interface Props {
  title: string;
  subtitle?: string;
  workflowId: string;
  hideButtons?: boolean;
  isPublished?: boolean;
}

/**
 * Topbar Component.
 *
 * Renders a header bar for the workflow editor that includes a back button, title, subtitle,
 * navigation tabs, and action buttons such as Execute, Save, Publish, and UnPublish. The display
 * of buttons is conditionally controlled by the `hideButtons` and `isPublished` props.
 *
 * @param {Props} props - Component properties.
 * @param {string} props.title - The title to be displayed in the top bar.
 * @param {string} [props.subtitle] - Optional subtitle to be displayed beneath the title.
 * @param {string} props.workflowId - The unique identifier for the workflow.
 * @param {boolean} [props.hideButtons=false] - Flag to conditionally hide the action buttons.
 * @param {boolean} [props.isPublished=false] - Flag indicating if the workflow is published.
 * @returns {JSX.Element} The rendered topbar component.
 */
export default function Topbar({
  title,
  subtitle,
  workflowId,
  hideButtons = false,
  isPublished = false
}: Props) {
  // Get the router instance for navigation functionality.
  const router = useRouter();

  return (
    <header className="flex p-2 border-b-2 border-separate justify-between w-full h-[60px] sticky top-0 bg-background z-10">
      {/* Left section: Back button and title/subtitle */}
      <div className="flex gap-1 flex-1">
        <TooltipWrapper content="Back">
          <Button variant={"ghost"} size={"icon"} onClick={() => router.back()}>
            <ChevronLeftIcon size={20} />
          </Button>
        </TooltipWrapper>
        <div>
          <p className="font-bold text-ellipsis truncate">{title}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground truncate text-ellipsis">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {/* Middle section: Navigation tabs for switching between editor and runs */}
      <NavigationTabs workflowId={workflowId} />
      {/* Right section: Action buttons */}
      <div className="flex gap-1 flex-1 justify-end">
        {hideButtons === false && (
          <>
            <ExecuteBtn workflowId={workflowId} />
            {isPublished && <UnPublishBtn workflowId={workflowId} />}
            {!isPublished && (
              <>
                <SaveBtn workflowId={workflowId} />
                <PublishBtn workflowId={workflowId} />
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
}
