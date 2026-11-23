"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function PlansPageSkeleton() {
  return (
    <div className="w-full space-y-6 select-none font-['Cairo',sans-serif]">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white dark:bg-[#221812] rounded-[8px] border border-[#f0eeea] dark:border-[#38271c] shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
        <div className="space-y-2">
          <Skeleton className="h-6 w-44 bg-[#ece7df] dark:bg-[#2c221c] rounded-md" />
          <Skeleton className="h-4 w-72 bg-[#f2eee9] dark:bg-[#281c15] rounded" />
        </div>
        <Skeleton className="h-10 w-36 bg-[#9c6402]/30 dark:bg-[#e29d38]/20 rounded-[6px]" />
      </div>

      {/* 2. 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex items-center justify-between"
          >
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-24 bg-[#f2eee9] dark:bg-[#281c15] rounded" />
              <div className="flex items-baseline gap-2">
                <Skeleton className="h-8 w-16 bg-[#ece7df] dark:bg-[#2c221c] rounded" />
              </div>
              <Skeleton className="h-3 w-28 bg-[#f2eee9] dark:bg-[#281c15] rounded" />
            </div>
            <Skeleton className="size-[44px] rounded-[6px] bg-[#f5f3ef] dark:bg-[#2d1f16] shrink-0" />
          </div>
        ))}
      </div>

      {/* 3. Plans Toolbar */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] p-4 border border-[#f0eeea] dark:border-[#38271c] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="h-10 w-full max-w-sm rounded-[6px] bg-[#f5f3ef] dark:bg-[#281c15]" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-[6px] bg-[#f5f3ef] dark:bg-[#281c15]" />
          <Skeleton className="h-9 w-28 rounded-[6px] bg-[#f5f3ef] dark:bg-[#281c15]" />
          <Skeleton className="h-9 w-28 rounded-[6px] bg-[#f5f3ef] dark:bg-[#281c15]" />
        </div>
      </div>

      {/* 4. 4 Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#221812] rounded-[12px] border border-[#f0eeea] dark:border-[#38271c] p-6 flex flex-col justify-between space-y-6 shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-24 bg-[#ece7df] dark:bg-[#2c221c] rounded" />
                <Skeleton className="h-5 w-16 rounded-full bg-[#f2eee9] dark:bg-[#281c15]" />
              </div>
              <Skeleton className="h-4 w-full bg-[#f2eee9] dark:bg-[#281c15] rounded" />
              <div className="pt-2">
                <Skeleton className="h-9 w-32 bg-[#ece7df] dark:bg-[#2c221c] rounded" />
                <Skeleton className="h-3.5 w-20 bg-[#f2eee9] dark:bg-[#281c15] rounded mt-1" />
              </div>
              <div className="space-y-2.5 pt-4 border-t border-[#f0eeea] dark:border-[#38271c]">
                {Array.from({ length: 4 }).map((__, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <Skeleton className="size-4 rounded-full bg-[#f2eee9] dark:bg-[#281c15] shrink-0" />
                    <Skeleton className="h-3.5 w-40 bg-[#f2eee9] dark:bg-[#281c15] rounded" />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2 pt-4">
              <Skeleton className="h-10 w-full rounded-[6px] bg-[#ece7df] dark:bg-[#2c221c]" />
              <Skeleton className="h-9 w-full rounded-[6px] bg-[#f2eee9] dark:bg-[#281c15]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
