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
import { Layers2 } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

type ChartData = Awaited<ReturnType<typeof GetWorkflowExecutionStats>>;


/**
 * A component that displays a chart showing the daily number of successful and failed workflow executions.
 *
 * @param props - The component's props.
 * @param props.data - The chart data, which is an array of objects with 'date', 'success', and 'failed' properties.
 *
 * @returns - A React component that renders the chart.
 */
export default function ExecutionStatusChart({ data }: { data: ChartData }) {
  const chartConfig = {
    success: {
      label: "Success",
      color: "hsl(var(--chart-2))"
    },
    failed: {
      label: "Failed",
      color: "hsl(var(--chart-1))"
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Layers2 className="w-6 h-6 text-primary" />
          Workflow execution status
        </CardTitle>
        <CardDescription>
          Daily number of successful and failed workflow executions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <AreaChart
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
            <Area
              min={0}
              type={"basis"}
              fill="var(--color-failed)"
              stroke="var(--color-failed)"
              fillOpacity={0.6}
              dataKey={"failed"}
              stackId={"a"}
            />
            <Area
              min={0}
              type={"basis"}
              fill="var(--color-success)"
              stroke="var(--color-success)"
              fillOpacity={0.6}
              dataKey={"success"}
              stackId={"a"}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

