"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { DashboardPageSkeleton } from "./DashboardPageSkeleton";

interface PageLoadingPanelProps {
  title?: string;
  statusText?: string;
  className?: string;
}

/**
 * PageLoadingPanel — displays a clean DashboardPageSkeleton without spinners or overlays.
 */
export function PageLoadingPanel({ className }: PageLoadingPanelProps = {}) {
  return (
    <div className={cn("w-full min-h-[min(62vh,560px)] select-none", className)}>
      <DashboardPageSkeleton />
    </div>
  );
}
