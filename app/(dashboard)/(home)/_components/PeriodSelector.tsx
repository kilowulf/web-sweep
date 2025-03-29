"use client";

import { Period } from "@/types/analytics";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

// Month names: array of strings
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
] as const;

/**
 * PeriodSelector is a React component that renders a dropdown menu for selecting a specific period.
 * It uses the Next.js navigation library to update the URL query parameters when a new period is selected.
 *
 * @param periods - An array of Period objects representing the available periods to choose from.
 * @param selectedPeriod - The currently selected Period object.
 *
 * @returns A React component that renders the PeriodSelector.
 */
export default function PeriodSelector({
  periods,
  selectedPeriod
}: {
  periods: Period[];
  selectedPeriod: Period;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <Select
      value={`${selectedPeriod.month}-${selectedPeriod.year}`}
      onValueChange={(value) => {
        const [month, year] = value.split("-");
        const params = new URLSearchParams(searchParams);
        params.set("month", month);
        params.set("year", year);
        router.push(`?${params.toString()}`);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {periods.map((period, index) => (
          <SelectItem key={index} value={`${period.month}-${period.year}`}>{`${
            MONTH_NAMES[period.month]
          } ${period.year}`}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

