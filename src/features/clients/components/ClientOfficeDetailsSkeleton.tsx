"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ClientOfficeDetailsSkeleton() {
  return (
    <div className="w-full space-y-6 select-none font-['Cairo',sans-serif]">
      {/* 1. Header with Breadcrumbs & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-[#221812] rounded-[8px] border border-[#f0eeea] dark:border-[#38271c]">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-[6px] bg-[#f5f3ef] dark:bg-[#281c15]" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-44 bg-[#ece7df] dark:bg-[#2c221c] rounded" />
            <Skeleton className="h-3.5 w-60 bg-[#f2eee9] dark:bg-[#281c15] rounded" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-[6px] bg-[#f5f3ef] dark:bg-[#281c15]" />
          <Skeleton className="h-9 w-28 rounded-[6px] bg-[#9c6402]/30 dark:bg-[#e29d38]/20" />
        </div>
      </div>

      {/* 2. Office Identity Card */}
      <div className="p-6 bg-white dark:bg-[#221812] rounded-[8px] border border-[#f0eeea] dark:border-[#38271c] space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Skeleton className="size-16 rounded-[8px] bg-[#f5f3ef] dark:bg-[#281c15]" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-52 bg-[#ece7df] dark:bg-[#2c221c] rounded" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-28 bg-[#f2eee9] dark:bg-[#281c15] rounded" />
                <Skeleton className="h-4 w-20 bg-[#f2eee9] dark:bg-[#281c15] rounded" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-20 rounded-full bg-[#f2eee9] dark:bg-[#281c15]" />
            <Skeleton className="h-7 w-24 rounded-full bg-[#ece7df] dark:bg-[#2c221c]" />
          </div>
        </div>

        {/* 3. Grid of Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#f0eeea] dark:border-[#38271c]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 rounded-[6px] bg-[#fcfbfa] dark:bg-[#1a120d] space-y-2">
              <Skeleton className="h-3.5 w-20 bg-[#f2eee9] dark:bg-[#281c15] rounded" />
              <Skeleton className="h-5 w-32 bg-[#ece7df] dark:bg-[#2c221c] rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Tab Navigation & Content Box */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#f0eeea] dark:border-[#38271c] p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-[#f0eeea] dark:border-[#38271c] pb-3">
          <Skeleton className="h-8 w-24 rounded bg-[#ece7df] dark:bg-[#2c221c]" />
          <Skeleton className="h-8 w-24 rounded bg-[#f2eee9] dark:bg-[#281c15]" />
          <Skeleton className="h-8 w-24 rounded bg-[#f2eee9] dark:bg-[#281c15]" />
        </div>
        <div className="space-y-3 pt-2">
          <Skeleton className="h-4 w-full bg-[#f2eee9] dark:bg-[#281c15] rounded" />
          <Skeleton className="h-4 w-5/6 bg-[#f2eee9] dark:bg-[#281c15] rounded" />
          <Skeleton className="h-4 w-4/6 bg-[#f2eee9] dark:bg-[#281c15] rounded" />
        </div>
      </div>
    </div>
  );
}
