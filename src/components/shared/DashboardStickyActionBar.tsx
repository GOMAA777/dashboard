"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DashboardStickyActionBarProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

/**
 * Shared floating sticky action bar for dashboard forms and detail views.
 * Anchored to the bottom of the scrollable content area (inside <main>),
 * ensuring it never overlaps or enters the sidebar, floats with smooth rounded corners,
 * and seamlessly adapts to Light and Dark modes.
 */
export function DashboardStickyActionBar({
  children,
  className,
  containerClassName,
}: DashboardStickyActionBarProps) {
  return (
    <div
      className={cn(
        "sticky bottom-4 z-30 w-full mt-6 pointer-events-none transition-all duration-200",
        containerClassName
      )}
    >
      <div
        className={cn(
          "pointer-events-auto w-full bg-white/95 dark:bg-[#1f1712]/95 backdrop-blur-md rounded-[12px] border border-[#eae8e4] dark:border-[#38271c] py-3.5 px-6 sm:px-8 shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.06)] dark:shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.6),0px_8px_10px_-6px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
