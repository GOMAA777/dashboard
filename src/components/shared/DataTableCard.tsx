"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { DATA_TABLE_CARD } from "./list-layout.styles";

export interface DataTableCardProps {
  children: React.ReactNode;
  className?: string;
  /** Optional node id for Figma parity */
  "data-node-id"?: string;
}

/**
 * White rounded container for the data table + pagination footer.
 * Must stay separate from KPIs and from UnifiedFilterBar.
 */
export function DataTableCard({
  children,
  className,
  "data-node-id": dataNodeId,
}: DataTableCardProps) {
  return (
    <div className={cn(DATA_TABLE_CARD, className)} data-node-id={dataNodeId}>
      {children}
    </div>
  );
}
