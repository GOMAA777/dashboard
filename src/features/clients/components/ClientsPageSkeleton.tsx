"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ClientsPageSkeleton() {
  return (
    <div className="w-full space-y-6 select-none font-['Cairo',sans-serif]">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white dark:bg-[#221812] rounded-[8px] border border-[#f0eeea] dark:border-[#38271c] shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 bg-[#ece7df] dark:bg-[#2c221c] rounded-md" />
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
            <div className="space-y-2.5">
              <Skeleton className="h-3.5 w-24 bg-[#f2eee9] dark:bg-[#281c15] rounded" />
              <div className="flex items-baseline gap-2">
                <Skeleton className="h-8 w-16 bg-[#ece7df] dark:bg-[#2c221c] rounded" />
                <Skeleton className="h-4 w-12 bg-[#f2eee9] dark:bg-[#281c15] rounded-full" />
              </div>
              <Skeleton className="h-3 w-28 bg-[#f2eee9] dark:bg-[#281c15] rounded" />
            </div>
            <Skeleton className="size-[44px] rounded-[6px] bg-[#f5f3ef] dark:bg-[#2d1f16] shrink-0" />
          </div>
        ))}
      </div>

      {/* 3. Filter Bar */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] p-4 border border-[#f0eeea] dark:border-[#38271c] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <Skeleton className="h-10 w-full max-w-sm rounded-[6px] bg-[#f5f3ef] dark:bg-[#281c15]" />
          <div className="hidden md:flex items-center gap-2">
            <Skeleton className="h-9 w-16 rounded-full bg-[#f5f3ef] dark:bg-[#281c15]" />
            <Skeleton className="h-9 w-16 rounded-full bg-[#f5f3ef] dark:bg-[#281c15]" />
            <Skeleton className="h-9 w-16 rounded-full bg-[#f5f3ef] dark:bg-[#281c15]" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-[6px] bg-[#f5f3ef] dark:bg-[#281c15]" />
          <Skeleton className="h-9 w-24 rounded-[6px] bg-[#f5f3ef] dark:bg-[#281c15]" />
        </div>
      </div>

      {/* 4. Clients Table Skeleton */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#f0eeea] dark:border-[#38271c] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Table Head */}
        <div className="h-12 bg-[#f5f3ef] dark:bg-[#281c15] px-4 border-b border-[#eae8e4] dark:border-[#38271c] flex items-center justify-between gap-4">
          <Skeleton className="h-4 w-10 bg-[#ece7df] dark:bg-[#2c221c] rounded" />
          <Skeleton className="h-4 w-40 bg-[#ece7df] dark:bg-[#2c221c] rounded" />
          <Skeleton className="h-4 w-24 bg-[#ece7df] dark:bg-[#2c221c] rounded hidden sm:block" />
          <Skeleton className="h-4 w-32 bg-[#ece7df] dark:bg-[#2c221c] rounded hidden md:block" />
          <Skeleton className="h-4 w-28 bg-[#ece7df] dark:bg-[#2c221c] rounded hidden lg:block" />
          <Skeleton className="h-4 w-20 bg-[#ece7df] dark:bg-[#2c221c] rounded" />
          <Skeleton className="h-4 w-16 bg-[#ece7df] dark:bg-[#2c221c] rounded" />
          <Skeleton className="h-4 w-12 bg-[#ece7df] dark:bg-[#2c221c] rounded" />
        </div>

        {/* Table Rows (7 mock rows) */}
        <div className="divide-y divide-[#f2eee9] dark:divide-[#281f18]">
          {Array.from({ length: 7 }).map((_, idx) => (
            <div key={idx} className="px-4 py-3.5 flex items-center justify-between gap-4">
              <Skeleton className="size-6 rounded-[4px] bg-[#ece7df] dark:bg-[#2c221c] shrink-0" />
              <div className="flex items-center gap-3 min-w-[180px]">
                <Skeleton className="size-9 rounded-[4px] bg-[#ece7df] dark:bg-[#2c221c] shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-32 bg-[#ece7df] dark:bg-[#2c221c] rounded" />
                  <Skeleton className="h-3 w-20 bg-[#f2eee9] dark:bg-[#281c15] rounded" />
                </div>
              </div>
              <Skeleton className="h-4 w-24 bg-[#f2eee9] dark:bg-[#281c15] rounded hidden sm:block" />
              <Skeleton className="h-4 w-28 bg-[#f2eee9] dark:bg-[#281c15] rounded hidden md:block" />
              <Skeleton className="h-4 w-24 bg-[#f2eee9] dark:bg-[#281c15] rounded hidden lg:block" />
              <Skeleton className="h-5 w-20 bg-[#ece7df] dark:bg-[#2c221c] rounded-full" />
              <Skeleton className="h-5 w-16 bg-[#ece7df] dark:bg-[#2c221c] rounded-full" />
              <Skeleton className="size-8 rounded-[4px] bg-[#f2eee9] dark:bg-[#281c15]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
