import { Loader2Icon } from "lucide-react";
import React from "react";

/**
 * Loading Component.
 *
 * This component displays a full-screen loading spinner, centered both vertically and horizontally.
 * It is useful as a fallback UI during data fetching or any asynchronous operations.
 *
 * @returns {JSX.Element} The rendered loading spinner.
 */
export default function loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2Icon size={30} className="animate-spin stroke-primary" />
    </div>
  );
}
