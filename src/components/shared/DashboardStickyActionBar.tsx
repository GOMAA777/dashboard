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
        "sticky bottom-1.5 sm:bottom-2 z-30 w-full mt-auto pt-3 pointer-events-none transition-all duration-300",
        containerClassName
      )}
    >
      <div className="relative pointer-events-auto w-full group">
        {/* Subtle Ambient Gold Aura Effect behind the floating bar */}
        <div
          className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#e29d38]/0 via-[#e29d38]/12 to-[#e29d38]/0 blur-md pointer-events-none -z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
          aria-hidden="true"
        />

        <div
          className={cn(
            "relative w-full bg-white/90 dark:bg-[#1a120d]/92 backdrop-blur-xl rounded-2xl border border-[#eae8e4]/90 dark:border-[#38271c] py-3 px-5 sm:px-7 shadow-[0px_8px_30px_rgba(0,0,0,0.08),0_0_18px_rgba(226,157,56,0.1),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0px_12px_40px_rgba(0,0,0,0.7),0_0_24px_rgba(226,157,56,0.15)] flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 hover:border-[#e29d38]/30 dark:hover:border-[#e29d38]/40",
            className
          )}
        >
          {/* Top Architectural Ambient Gold Refraction Ray */}
          <div
            className="absolute inset-x-8 -top-px h-[1.5px] bg-gradient-to-r from-transparent via-[#e29d38]/45 dark:via-[#e29d38]/65 to-transparent pointer-events-none rounded-full"
            aria-hidden="true"
          />

          {children}
        </div>
      </div>
    </div>
  );
}
