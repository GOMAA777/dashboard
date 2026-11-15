import { format, parseISO, isValid } from "date-fns";

export function formatDate(
  date: Date | string | number | null | undefined,
  dateFormat = "MMM dd, yyyy"
): string {
  if (!date) return "-";
  const parsed = typeof date === "string" ? parseISO(date) : new Date(date);
  if (!isValid(parsed)) return "-";
  return format(parsed, dateFormat);
}

export function formatDateTime(
  date: Date | string | number | null | undefined,
  dateTimeFormat = "MMM dd, yyyy HH:mm"
): string {
  return formatDate(date, dateTimeFormat);
}

export function formatNumber(
  value: number | null | undefined,
  locale = "en-US",
  options?: Intl.NumberFormatOptions
): string {
  if (value === null || value === undefined || isNaN(value)) return "0";
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatCompactNumber(
  value: number | null | undefined,
  locale = "en-US"
): string {
  return formatNumber(value, locale, { notation: "compact", maximumFractionDigits: 1 });
}
