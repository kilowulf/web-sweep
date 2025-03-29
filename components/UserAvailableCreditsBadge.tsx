"use client";
import { GetAvailableCredits } from "@/actions/billing/getAvailableCredits";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CoinsIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";
import ReactCountUpWrapper from "./ReactCountUpWrapper";
import { buttonVariants } from "@/components/ui/button";

/**
 * UserAvailableCreditsBadge Component.
 *
 * Displays a badge showing the user's available credits.
 * It fetches the available credits using react-query and refreshes the data every 30 seconds.
 * While loading, a spinner is shown; when loaded, the credits count is animated via ReactCountUpWrapper.
 * The badge is wrapped in a link that navigates to the billing page.
 *
 * @returns {JSX.Element} The rendered badge component with available credits.
 */
export default function UserAvailableCreditsBadge() {
  const query = useQuery({
    queryKey: ["user-available-credits"],
    queryFn: () => GetAvailableCredits(),
    refetchInterval: 30 * 1000 // Refetch every 30 seconds
  });

  return (
    <Link
      href={"/billing"}
      className={cn(
        "w-full space-x-2 items-center",
        buttonVariants({ variant: "outline" })
      )}
    >
      <CoinsIcon size={20} className="text-primary" />
      <span className="font-semibold capitalize">
        {query.isLoading && <Loader2Icon className="w-4 h-4 animate-spin" />}
        {!query.isLoading && query.data !== undefined && (
          <ReactCountUpWrapper value={query.data} />
        )}
        {!query.isLoading && query.data === undefined && "-"}
      </span>
    </Link>
  );
}
