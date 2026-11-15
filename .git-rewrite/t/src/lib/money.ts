                                                                                            /**
 * Financial precision utility to avoid IEEE 754 floating point errors.
 * Stores and handles amounts in minor units (cents, piasters, etc.) or decimal strings.
 */

export interface MoneyOptions {
  currency?: string;
  locale?: string;
}

/**
 * Formats minor units (e.g. 1050 cents) into localized currency string (e.g. $10.50).
 */
export function formatMinorUnits(
  minorAmount: number | bigint,
  options: MoneyOptions = {}
): string {
  const { currency = "USD", locale = "en-US" } = options;
  const majorAmount = Number(minorAmount) / 100;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(majorAmount);
}

/**
 * Formats a decimal string from the backend into a localized currency string.
 */
export function formatDecimalString(
  decimalAmountStr: string,
  options: MoneyOptions = {}
): string {
  const { currency = "USD", locale = "en-US" } = options;
  const parsed = parseFloat(decimalAmountStr);
  if (isNaN(parsed)) return "";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(parsed);
}

/**
 * Converts a major unit number (e.g. 10.50) safely to integer minor units (e.g. 1050).
 */
export function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Converts minor units (e.g. 1050) to decimal number (10.50).
 */
export function toMajorUnits(minorAmount: number): number {
  return minorAmount / 100;
}
