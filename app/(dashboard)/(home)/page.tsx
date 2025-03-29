import React, { Suspense } from "react";
import { GetPeriods } from "@/actions/analytics/getPeriods";
import PeriodSelector from "@/app/(dashboard)/(home)/_components/PeriodSelector";
import { Period } from "@/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { GetStatsCardsValues } from "@/actions/analytics/getStatsCardsValues";
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from "lucide-react";
import StatsCard from "@/app/(dashboard)/(home)/_components/StatsCard";
import { GetWorkflowExecutionStats } from "@/actions/analytics/getWorkflowExecutionStats";
import ExecutionStatusChart from "@/app/(dashboard)/(home)/_components/ExecutionStatusChart";
import { GetCreditUsageInPeriod } from "@/actions/analytics/getCreditUsageInPeriod";
import CreditUsageChart from "@/app/(dashboard)/billing/_components/CreditUsageChart";


/**
 * The HomePage component is the main content of the dashboard home page.
 * It displays various statistics, charts, and selectors related to the application's analytics.
 *
 * @param searchParams - An object containing optional month and year query parameters.
 * @param searchParams.month - The selected month for filtering analytics data.
 * @param searchParams.year - The selected year for filtering analytics data.
 *
 * @returns A React component that renders the home page content.
 */
export default function HomePage({searchParams}: {searchParams: { month?: string; year?: string };
}) {
  const currentDate = new Date();
  const { month, year } = searchParams;
  const period: Period = {
    month: month ? parseInt(month) : currentDate.getMonth(),
    year: year ? parseInt(year) : currentDate.getFullYear()
  };
  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Home</h1>
        <Suspense fallback={<Skeleton className="w-[180px] h-[40px]" />}>
          <PeriodSelectorWrapper selectedPeriod={period} />
        </Suspense>
      </div>
      <div className="h-full py-6 flex flex-col gap-4">
        <Suspense fallback={<StatsCardSkeleton />}>
          <StatsCards selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <StatsExecutionStatus selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <CreditsUsageInPeriod selectedPeriod={period} />
        </Suspense>
      </div>
    </div>
  );
}


/**
 * PeriodSelectorWrapper is a React functional component that retrieves and displays a list of periods.
 * It is a wrapper for the PeriodSelector component, fetching the periods data asynchronously.
 *
 * @param props - An object containing the following properties:
 * @param props.selectedPeriod - The currently selected period.
 *
 * @returns A React component that renders the PeriodSelector with the fetched periods data.
 */
async function PeriodSelectorWrapper({
  selectedPeriod
}: {
  selectedPeriod: Period;
}) {
  const periods = await GetPeriods();

  return <PeriodSelector selectedPeriod={selectedPeriod} periods={periods} />;
}


/**
 * The `StatsCards` function is responsible for fetching and displaying the statistics related to workflow execution, phase execution, and credits consumed.
 * It fetches the data asynchronously using the `GetStatsCardsValues` function and renders the data using the `StatsCard` component.
 *
 * @param props - An object containing the following properties:
 * @param props.selectedPeriod - The currently selected period for filtering analytics data.
 *
 * @returns A React component that renders a grid of `StatsCard` components with the fetched statistics data.
 */
async function StatsCards({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await GetStatsCardsValues(selectedPeriod);
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]">
      <StatsCard
        title="Workflow execution"
        value={data.workflowExecutions}
        icon={CirclePlayIcon}
      />
      <StatsCard
        title="Phase execution"
        value={data.phaseExecutions}
        icon={WaypointsIcon}
      />
      <StatsCard
        title="Credits consumed"
        value={data.creditsConsumed}
        icon={CoinsIcon}
      />
    </div>
  );
}


/**
 * The `StatsCardSkeleton` function is a React functional component that renders a skeleton UI for the `StatsCard` components.
 * It is used to display a loading state while the actual statistics data is being fetched.
 *
 * @returns A React component that renders a grid of skeleton UI elements representing the `StatsCard` components.
 */
function StatsCardSkeleton() {
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="w-full min-h-[120px]" />
      ))}
    </div>
  );
}


/**
 * The `StatsExecutionStatus` function is responsible for fetching and displaying the workflow execution statistics.
 * It fetches the data asynchronously using the `GetWorkflowExecutionStats` function and renders the data using the `ExecutionStatusChart` component.
 *
 * @param props - An object containing the following properties:
 * @param props.selectedPeriod - The currently selected period for filtering analytics data.
 *
 * @returns A React component that renders the `ExecutionStatusChart` with the fetched workflow execution statistics data.
 */
async function StatsExecutionStatus({
  selectedPeriod
}: {
  selectedPeriod: Period;
}) {
  const data = await GetWorkflowExecutionStats(selectedPeriod);
  return <ExecutionStatusChart data={data} />;
}


/**
 * The `CreditsUsageInPeriod` function is responsible for fetching and displaying the daily credits usage within a specified period.
 * It fetches the data asynchronously using the `GetCreditUsageInPeriod` function and renders the data using the `CreditUsageChart` component.
 *
 * @param props - An object containing the following properties:
 * @param props.selectedPeriod - The currently selected period for filtering analytics data.
 * @param props.selectedPeriod.month - The selected month for filtering analytics data.
 * @param props.selectedPeriod.year - The selected year for filtering analytics data.
 *
 * @returns A React component that renders the `CreditUsageChart` with the fetched daily credits usage data.
 * The `CreditUsageChart` component displays a line chart showing the daily credits spent within the selected time period.
 */
async function CreditsUsageInPeriod({
  selectedPeriod
}: {
  selectedPeriod: Period;
}) {
  const data = await GetCreditUsageInPeriod(selectedPeriod);
  return (
    <CreditUsageChart
      data={data}
      title="Daily credits spent"
      description="Daily credits consumed within selected time period"
    />
  );
}

