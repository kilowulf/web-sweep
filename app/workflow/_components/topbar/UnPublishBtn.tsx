"use client";

import { Button } from "@/components/ui/button";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { DownloadIcon, PlayIcon, UploadIcon } from "lucide-react";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { RunWorkflow } from "@/actions/workflows/runWorkflow";
import { toast } from "sonner";
import { useReactFlow } from "@xyflow/react";
import { PublishWorkflow } from "@/actions/workflows/publishWorkflow";
import { UnPublishWorkflow } from "@/actions/workflows/unpublishWorkflow";

export default function UnPublishBtn({ workflowId }: { workflowId: string }) {
  const mutation = useMutation({
    mutationFn: UnPublishWorkflow,
    onSuccess: () => {
      toast.success("Workflow Unpublished", { id: "workflowId" });
    },
    onError: () => {
      toast.error("Error on attempt to unpublish workflow)", {
        id: "workflowId"
      });
    }
  });
  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading("Unpublishing workflow...", { id: "workflowId" });

        mutation.mutate(workflowId);
      }}
    >
      <DownloadIcon size={16} className="stroke-orange-500" />
      Unpublish
    </Button>
  );
}
