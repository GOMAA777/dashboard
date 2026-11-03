import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DashboardPageSkeletonProps {
  className?: string;
  cardsCount?: number;
  tableRowsCount?: number;
}

export function DashboardPageSkeleton({
  className,
  cardsCount = 4,
  tableRowsCount = 6,
}: DashboardPageSkeletonProps) {
  return (
    <div
      className={cn("w-full space-y-6 select-none animate-in fade-in duration-300", className)}
      aria-label="جاري تحميل محتوى الصفحة..."
      role="status"
    >
      {/* 1. Header Banner Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-[#1a120d] border border-[#eae8e4] dark:border-[#2c221c] rounded-2xl shadow-xs">
        <div className="space-y-2.5">
          <Skeleton className="h-7 w-52 bg-[#ece7df] dark:bg-[#2c221c] rounded-lg" />
          <Skeleton className="h-4 w-72 max-w-full bg-[#f2eee9] dark:bg-[#281c15] rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-28 bg-[#ece7df] dark:bg-[#2c221c] rounded-xl" />
          <Skeleton className="h-10 w-36 bg-[#c29547]/30 dark:bg-[#d4a759]/20 rounded-xl" />
        </div>
      </div>

      {/* 2. KPI / Metrics Cards Grid Skeleton (Default: 4 Tiles) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {Array.from({ length: cardsCount }).map((_, i) => (
          <div
            key={i}
            className="p-5 bg-white dark:bg-[#1a120d] border border-[#eae8e4] dark:border-[#2c221c] rounded-2xl space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="size-11 rounded-xl bg-[#ece7df] dark:bg-[#2c221c]" />
              <Skeleton className="h-5 w-16 rounded-full bg-[#f2eee9] dark:bg-[#281c15]" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-24 bg-[#ece7df] dark:bg-[#2c221c] rounded-lg" />
              <Skeleton className="h-3.5 w-36 bg-[#f2eee9] dark:bg-[#281c15] rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Filter Bar & Search Skeleton */}
      <div className="p-4 bg-white dark:bg-[#1a120d] border border-[#eae8e4] dark:border-[#2c221c] rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <Skeleton className="h-10 w-full max-w-sm rounded-xl bg-[#ece7df] dark:bg-[#2c221c]" />
          <Skeleton className="h-10 w-24 rounded-xl bg-[#f2eee9] dark:bg-[#281c15] hidden md:block" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20 rounded-lg bg-[#f2eee9] dark:bg-[#281c15]" />
          <Skeleton className="h-9 w-20 rounded-lg bg-[#f2eee9] dark:bg-[#281c15]" />
          <Skeleton className="h-9 w-9 rounded-lg bg-[#f2eee9] dark:bg-[#281c15]" />
        </div>
      </div>

      {/* 4. Data Table Skeleton */}
      <div className="bg-white dark:bg-[#1a120d] border border-[#eae8e4] dark:border-[#2c221c] rounded-2xl overflow-hidden shadow-xs">
        {/* Table Head Skeleton */}
        <div className="h-12 bg-[#f8f6f2] dark:bg-[#221812] px-6 border-b border-[#eae8e4] dark:border-[#2c221c] flex items-center justify-between gap-4">
          <Skeleton className="h-4 w-32 bg-[#ece7df] dark:bg-[#2c221c] rounded" />
          <Skeleton className="h-4 w-24 bg-[#ece7df] dark:bg-[#2c221c] rounded hidden sm:block" />
          <Skeleton className="h-4 w-28 bg-[#ece7df] dark:bg-[#2c221c] rounded hidden md:block" />
          <Skeleton className="h-4 w-20 bg-[#ece7df] dark:bg-[#2c221c] rounded hidden lg:block" />
          <Skeleton className="h-4 w-16 bg-[#ece7df] dark:bg-[#2c221c] rounded" />
        </div>

        {/* Table Rows Skeleton */}
        <div className="divide-y divide-[#f2eee9] dark:divide-[#281f18]">
          {Array.from({ length: tableRowsCount }).map((_, idx) => (
            <div
              key={idx}
              className="px-6 py-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-full bg-[#ece7df] dark:bg-[#2c221c] shrink-0" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-36 bg-[#ece7df] dark:bg-[#2c221c] rounded" />
                  <Skeleton className="h-3 w-20 bg-[#f2eee9] dark:bg-[#281c15] rounded" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full bg-[#f2eee9] dark:bg-[#281c15] hidden sm:block" />
              <Skeleton className="h-4 w-24 bg-[#ece7df] dark:bg-[#2c221c] rounded hidden md:block" />
              <Skeleton className="h-4 w-16 bg-[#ece7df] dark:bg-[#2c221c] rounded hidden lg:block" />
              <div className="flex items-center gap-2">
                <Skeleton className="size-8 rounded-lg bg-[#f2eee9] dark:bg-[#281c15]" />
                <Skeleton className="size-8 rounded-lg bg-[#f2eee9] dark:bg-[#281c15]" />
              </div>
            </div>
          ))}
        </div>

        {/* Table Footer / Pagination Skeleton */}
        <div className="h-14 px-6 border-t border-[#eae8e4] dark:border-[#2c221c] bg-[#faf8f5] dark:bg-[#1a120d] flex items-center justify-between">
          <Skeleton className="h-4 w-40 bg-[#ece7df] dark:bg-[#2c221c] rounded" />
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-8 rounded-md bg-[#ece7df] dark:bg-[#2c221c]" />
            <Skeleton className="size-8 rounded-md bg-[#ece7df] dark:bg-[#2c221c]" />
            <Skeleton className="size-8 rounded-md bg-[#ece7df] dark:bg-[#2c221c]" />
          </div>
        </div>
      </div>
    </div>
  );
}
