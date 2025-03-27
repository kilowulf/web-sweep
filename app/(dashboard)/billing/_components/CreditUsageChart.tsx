/**
 * CreditUsageChart Component
 *
 * Overview:
 * This component displays a bar chart representing credit usage data over a period.
 * It visualizes two types of credit usage: "Successful Phase Credit Usage" and "Failed Phase Credit Usage".
 * The chart is built using a combination of custom UI components (Card, ChartContainer, etc.)
 * and the Recharts library for rendering the bar chart.
 *
 * Important Functions and Variables:
 * - GetCreditUsageInPeriod: An action that fetches the credit usage data; its return type is used for type safety.
 * - ChartData: A TypeScript type alias derived from the awaited return value of GetCreditUsageInPeriod.
 * - chartConfig: A configuration object that holds labels and colors for the "success" and "failed" data series.
 * - Card, CardHeader, CardContent, etc.: UI components for structured layout.
 * - BarChart, Bar, CartesianGrid, XAxis: Recharts components to build the bar chart visualization.
 * - ChartLegend and ChartTooltip: Custom components to display a legend and tooltip for the chart.
 *
 * How It Works:
 * - The component receives three props: `data` (the chart data), `title`, and `description`.
 * - It defines a chartConfig object that assigns a label and color to each data series (success and failed).
 * - The component renders a Card containing a header (with title and description) and a content area.
 * - Within the content, a ChartContainer wraps the Recharts BarChart.
 * - The BarChart is configured with grid lines, formatted X-axis labels (displaying dates in "MMM DD" format),
 *   a legend, and a tooltip.
 * - Two Bar elements are stacked to represent the "failed" and "success" credit usage metrics.
 *
 * 
 */

"use client";

import { GetWorkflowExecutionStats } from "@/actions/analytics/getWorkflowExecutionStats";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartLegendContent,
  ChartTooltipContent
} from "@/components/ui/chart";
import { ChartColumnStackedIcon, Layers2 } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { GetCreditUsageInPeriod } from "@/actions/analytics/getCreditUsageInPeriod";

type ChartData = Awaited<ReturnType<typeof GetCreditUsageInPeriod>>;

export default function CreditUsageChart({
  data,
  title,
  description
}: {
  data: ChartData;
  title: string;
  description: string;
}) {
  const chartConfig = {
    success: {
      label: "Successful Phase Credit Usage",
      color: "hsl(var(--chart-2))"
    },
    failed: {
      label: "Failed Phase Credit Usage",
      color: "hsl(var(--chart-1))"
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ChartColumnStackedIcon className="w-6 h-6 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <BarChart
            data={data}
            height={200}
            accessibilityLayer
            margin={{ top: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={"date"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric"
                });
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[250px]" />}
            />
            <Bar
              // min={0}
              radius={[0, 0, 4, 4]}
              fill="var(--color-failed)"
              stroke="var(--color-failed)"
              fillOpacity={0.8}
              dataKey={"failed"}
              stackId={"a"}
            />
            <Bar
              // min={0}
              radius={[4, 4, 0, 0]}
              fill="var(--color-success)"
              stroke="var(--color-success)"
              fillOpacity={0.8}
              dataKey={"success"}
              stackId={"a"}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
