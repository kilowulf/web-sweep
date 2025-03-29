/**
 * BillingPage and Subcomponents
 *
 * Overview:
 * This module composes the main billing dashboard with several sections:
 * - BalanceCard: Displays the user's available credits with an animated counter.
 * - CreditsPurchase: Provides an interface to purchase additional credits.
 * - CreditUsageCard: Shows daily credit consumption for the current month.
 * - TransactionHistoryCard: Lists past transactions with invoice download options.
 *
 * Key Functions / API Calls:
 * - GetAvailableCredits: Fetches the user's current credit balance.
 * - GetCreditUsageInPeriod: Retrieves credit usage data for a given period.
 * - GetUserPurchaseHistory: Fetches the user's purchase history.
 *
 * Suspense and Skeleton components are used to handle asynchronous data loading.
 */

import { GetAvailableCredits } from "@/actions/billing/getAvailableCredits";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";
import { ArrowLeftRightIcon, CoinsIcon } from "lucide-react";
import CreditsPurchase from "@/app/(dashboard)/billing/_components/CreditsPurchase";
import { Period } from "@/types/analytics";
import { GetCreditUsageInPeriod } from "@/actions/analytics/getCreditUsageInPeriod";
import CreditUsageChart from "@/app/(dashboard)/billing/_components/CreditUsageChart";
import { GetUserPurchaseHistory } from "@/actions/billing/GetUserPurchaseHistory";
import InvoiceBtn from "@/app/(dashboard)/billing/_components/invoiceBtn";

/**
 * The BillingPage component is the main entry point for the billing dashboard.
 * It displays various sections related to user's billing information, such as balance,
 * credit purchases, daily credit consumption, and transaction history.
 *
 * @returns {React.ReactElement} - The BillingPage component.
 */
/**
 * The BillingPage component is the main entry point for the billing dashboard.
 * It displays various sections related to user's billing information, such as balance,
 * credit purchases, daily credit consumption, and transaction history.
 *
 * @returns {React.ReactElement} - The BillingPage component.
 */
export default function BillingPage() {
  return (
    <div className="mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Billing</h1>
      <Suspense fallback={<Skeleton className="h-[166px] w-full" />} />
      <BalanceCard />
      <CreditsPurchase />
      {/*Daily Credit Consumption */}
      <Suspense fallback={<Skeleton className="h-[300px]" />}>
        <CreditUsageCard />
      </Suspense>
      {/*Transaction history */}
      <Suspense fallback={<Skeleton className="h-[300px]" />}>
        <TransactionHistoryCard />
      </Suspense>
    </div>
  );
}


/**
 * Displays the user's available credit balance with an animated counter.
 *
 * @returns {React.ReactElement} - The BalanceCard component.
 */
async function BalanceCard() {
  const userBalance = await GetAvailableCredits();
  return (
    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 shadow-lg flex justify-between flex-col overflow-hidden">
      <CardContent className="p-6 relative items-center">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Available Credits
            </h3>
            <p className="text-4xl font-bold text-primary">
              <ReactCountUpWrapper value={userBalance} />
            </p>
          </div>
        </div>
        <CoinsIcon
          size={140}
          className="text-primary opacity-20 absolute bottom-0 right-0"
        />
      </CardContent>
      <CardFooter className="text-muted-foreground text-sm">
        Automated workflows will cease when credit balance is exhausted.
      </CardFooter>
    </Card>
  );
}


/**
 * Fetches and displays the credit usage data for the current month.
 *
 * @remarks
 * This function fetches the credit usage data for the current month using the
 * `GetCreditUsageInPeriod` action. It then passes the data to the `CreditUsageChart`
 * component to render a chart.
 *
 * @returns {React.ReactElement} - The CreditUsageCard component with the fetched data.
 *
 * @throws Will throw an error if the `GetCreditUsageInPeriod` action fails.
 */
async function CreditUsageCard() {
  const period: Period = {
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  };

  const data = await GetCreditUsageInPeriod(period);

  return (
    <CreditUsageChart
      data={data}
      title="Credits consumed"
      description="Daily credit consumed in the current month."
    />
  );
}


/**
 * Fetches and displays the user's transaction history.
 *
 * This function fetches the user's purchase history using the `GetUserPurchaseHistory` action.
 * It then renders a card component displaying the transaction history, including the date, description,
 * amount, and an invoice download button for each purchase.
 *
 * @returns {React.ReactElement} - The TransactionHistoryCard component with the fetched data.
 *
 * @throws Will throw an error if the `GetUserPurchaseHistory` action fails.
 */
async function TransactionHistoryCard() {
  const purchases = await GetUserPurchaseHistory();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ArrowLeftRightIcon className="h-6 w-6 text-primary" />
          Transaction History
        </CardTitle>
        <CardDescription>
          View your transaction history and download invoices.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {purchases.length === 0 && (
          <p className="text-muted-foreground">No Transactions found</p>
        )}
        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            className="flex justify-between items-center py-3 border-b last:border-b-0"
          >
            <div>
              <p className="font-medium">{formatDate(purchase.date)}</p>
              <p className="text-sm text-muted-foreground">
                {purchase.description}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {formatAmount(purchase.amount, purchase.currency)}
              </p>
              <InvoiceBtn id={purchase.id} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  /**
   * Formats a date object into a human-readable string.
   *
   * @param {Date} date - The date to format.
   * @returns {string} - The formatted date string.
   */
  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(date);
  }

  /**
   * Formats an amount and currency into a human-readable string.
   *
   * @param {number} amount - The amount to format.
   * @param {string} currency - The currency code.
   * @returns {string} - The formatted amount string.
   */
  function formatAmount(amount: number, currency: string) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency
    }).format(amount / 100);
  }
}

