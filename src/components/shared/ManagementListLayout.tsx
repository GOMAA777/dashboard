"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LIST_PAGE_STACK } from "./list-layout.styles";

export interface ManagementListLayoutProps {
  /** Optional page header / command banner */
  header?: React.ReactNode;
  /** KPI metrics row — always above the filter */
  kpis?: React.ReactNode;
  /** Standalone filter bar (UnifiedFilterBar) — never inside the table card */
  filter?: React.ReactNode;
  /** Table card (DataTableCard) with pagination footer inside */
  table: React.ReactNode;
  /** Optional content after the table (empty states, footnotes, etc.) */
  footer?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Canonical management list stack:
 * Header → KPIs → Filter (separate card) → Table card (+ pagination) → Footer
 */
export function ManagementListLayout({
  header,
  kpis,
  filter,
  table,
  footer,
  className,
  children,
}: ManagementListLayoutProps) {
  return (
    <div className={cn(LIST_PAGE_STACK, className)}>
      {header}
      {kpis}
      {filter}
      {table}
      {footer}
      {children}
    </div>
  );
}
