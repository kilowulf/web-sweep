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

// timestamp: 13:52:18
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
