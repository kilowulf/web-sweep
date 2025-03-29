import { ExecutionPhaseStatus } from "@/types/workflow";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleXIcon,
  Loader2Icon
} from "lucide-react";

/**
 * PhaseStatusBadge Component.
 *
 * Renders an icon that represents the status of a workflow execution phase.
 * - PENDING: Displays a dashed circle icon.
 * - RUNNING: Displays a spinning loader icon.
 * - COMPLETED: Displays a check circle icon.
 * - FAILED: Displays a circle with an X icon.
 * If the status is not recognized, it renders a simple div with the status text.
 *
 * @param {Object} props - Component properties.
 * @param {ExecutionPhaseStatus} props.status - The status of the execution phase.
 * @returns {JSX.Element} The rendered status badge icon.
 */
export default function PhaseStatusBadge({
  status
}: {
  status: ExecutionPhaseStatus;
}) {
  switch (status) {
    case ExecutionPhaseStatus.PENDING:
      return <CircleDashedIcon size={20} className="stroke-muted-foreground" />;
    case ExecutionPhaseStatus.RUNNING:
      return (
        <Loader2Icon size={20} className="animate-spin stroke-yellow-500" />
      );
    case ExecutionPhaseStatus.COMPLETED:
      return <CircleCheckIcon size={20} className="stroke-green-500" />;
    case ExecutionPhaseStatus.FAILED:
      return <CircleXIcon size={20} className="stroke-destructive" />;
    default:
      return <div className="rounded-full">{status}</div>;
  }
}
