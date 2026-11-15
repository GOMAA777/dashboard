import React from "react";
import { formatMinorUnits, formatDecimalString, MoneyOptions } from "@/lib/money";

interface CurrencyFormatterProps extends MoneyOptions {
  /** Amount in minor units (e.g. cents) */
  minorAmount?: number | bigint | null;
  /** Decimal string representation from backend API (e.g. "125.50") */
  decimalString?: string | null;
  className?: string;
}

export function CurrencyFormatter({
  minorAmount,
  decimalString,
  currency = "USD",
  locale = "en-US",
  className,
}: CurrencyFormatterProps) {
  let formatted = "-";

  if (minorAmount !== undefined && minorAmount !== null) {
    formatted = formatMinorUnits(minorAmount, { currency, locale });
  } else if (decimalString) {
    formatted = formatDecimalString(decimalString, { currency, locale });
  }

  return <span className={className}>{formatted}</span>;
}
