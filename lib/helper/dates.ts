import { Period } from "@/types/analytics";
import { endOfMonth, intervalToDuration, startOfMonth } from "date-fns";

/**
 * Converts the duration between a start and an end date into a human-readable string.
 *
 * If either the start or end date is missing, it returns null.
 * For intervals less than 1000 milliseconds, the duration is returned in milliseconds.
 * Otherwise, the duration is expressed in minutes and seconds.
 *
 * @param {Date | null | undefined} end - The end date of the interval.
 * @param {Date | null | undefined} start - The start date of the interval.
 * @returns {string | null} The duration as a string (e.g., "2m 30s") or null if the interval is invalid.
 */
export function DatesToDurationString(
  end: Date | null | undefined,
  start: Date | null | undefined
) {
  if (!start || !end) return null;

  const timeElapsed = end.getTime() - start.getTime();
  if (timeElapsed < 1000) {
    return `${timeElapsed}ms`;
  }

  const duration = intervalToDuration({ start: 0, end: timeElapsed });

  return `${duration.minutes || 0}m ${duration.seconds || 0}s`;
}

/**
 * Converts a given period into a date range representing the full month.
 *
 * The function calculates the start date as the first day of the month and the end date
 * as the last day of the month, based on the provided year and month.
 *
 * @param {Period} period - An object containing the year and month.
 * @returns {{ startDate: Date, endDate: Date }} An object with the start and end dates for the month.
 */
export function PeriodToDateRange(period: Period) {
  const startDate = startOfMonth(new Date(period.year, period.month));
  const endDate = endOfMonth(new Date(period.year, period.month));
  return { startDate, endDate };
}
