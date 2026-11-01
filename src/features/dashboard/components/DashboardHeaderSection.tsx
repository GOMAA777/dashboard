"use client";

import React, { useState, useSyncExternalStore } from "react";
import { useQueryState } from "nuqs";
import { RefreshCw, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/use-ui-store";

const filterOptions = [
  { id: "custom", labelAr: "نطاق مخصص", labelEn: "Custom Range", hasIcon: true },
  { id: "6m", labelAr: "آخر 6 أشهر", labelEn: "Last 6 Months", hasIcon: false },
  { id: "this_month", labelAr: "هذا الشهر", labelEn: "This Month", hasIcon: false },
  { id: "30d", labelAr: "آخر 30 يومًا", labelEn: "Last 30 Days", hasIcon: false },
];

interface DashboardHeaderSectionProps {
  onRefresh?: () => Promise<void> | void;
  isRefreshing?: boolean;
}

export function DashboardHeaderSection({
  onRefresh,
  isRefreshing: externalIsRefreshing,
}: DashboardHeaderSectionProps = {}) {
  const [activeRange, setActiveRange] = useQueryState("range", {
    defaultValue: "30d",
  });
  const [internalRefreshing, setInternalRefreshing] = useState(false);
  const isRefreshing = externalIsRefreshing ?? internalRefreshing;

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const language = useUIStore((state) => state.language);
  const currentLang = isMounted ? language : "ar";

  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
    } else {
      setInternalRefreshing(true);
      setTimeout(() => {
        setInternalRefreshing(false);
      }, 600);
    }
  };

  return (
    <div
      className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full"
      data-node-id="1:6"
      data-name="Section 1: Page Introduction & Action Bar"
    >
      {/* Title and Subtitle */}
      <div className="flex flex-col items-start text-start" data-node-id="1:27">
        <h1
          className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7] text-[28px] leading-[38px] tracking-[-0.7px] font-sans"
          data-node-id="1:30"
        >
          {currentLang === "en" ? "Dashboard" : "الرئيسية"}
        </h1>
        <p
          className="font-normal text-[#514537] dark:text-[#cdc5bd] text-[14px] leading-[22px]"
          data-node-id="1:33"
        >
          {currentLang === "en"
            ? "Overview of platform performance, subscriptions, and licensed law firms"
            : "نظرة عامة على أداء المنصة والاشتراكات والمكاتب المرخصة"}
        </p>
      </div>

      {/* Action Bar and Range Filters */}
      <div
        className="bg-white dark:bg-[#221812] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] rounded-[12px] p-[6px] flex flex-wrap items-center gap-[8px] self-start md:self-auto shrink-0 border border-[#f0eeea]/60 dark:border-[#38271c]"
        data-node-id="1:7"
        data-name="Filters & Refresh Trigger"
      >
        {/* Refresh Button */}
        <button
          type="button"
          onClick={handleRefresh}
          className="bg-[#f5f3ef] dark:bg-[#2a1d15] hover:bg-[#eae8e4] dark:hover:bg-[#342419] text-[#514537] dark:text-[#cdc5bd] active:scale-[0.98] transition-all flex items-center gap-[6px] px-[12px] py-[6px] rounded-[8px] cursor-pointer"
          data-node-id="1:8"
        >
          <span className="text-[12px] leading-[16px] font-semibold">
            {currentLang === "en" ? "Refresh Data" : "تحديث البيانات"}
          </span>
          <div className="size-[12px] flex items-center justify-center shrink-0">
            <RefreshCw
              className={cn("size-[12px] block text-[#514537] dark:text-[#cdc5bd]", isRefreshing && "animate-spin")}
            />
          </div>
        </button>

        {/* Vertical Divider */}
        <div className="h-[24px] w-px bg-[#eae8e4] dark:bg-[#38271c] mx-[2px]" data-node-id="1:14" />

        {/* Range Filter Buttons Group */}
        <div
          className="bg-[#f5f3ef] dark:bg-[#1a120d] p-[4px] rounded-[12px] flex items-center gap-[2px]"
          data-node-id="1:15"
        >
          {filterOptions.map((opt) => {
            const isSelected = activeRange === opt.id;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setActiveRange(opt.id)}
                className={cn(
                  "flex items-center justify-center gap-[4px] px-[12px] py-[6px] text-[12px] leading-[16px] transition-all cursor-pointer",
                  isSelected
                    ? "bg-white dark:bg-[#2e1f16] dark:border dark:border-[#9c6402]/40 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] rounded-[12px] font-semibold text-[#9c6402] dark:text-[#e29d38]"
                    : "rounded-[6px] font-medium text-[#625d5d] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7]"
                )}
              >
                {opt.hasIcon && (
                  <div className="size-[10.5px] flex items-center justify-center shrink-0">
                    <SlidersHorizontal className="size-[10.5px] block text-[#625d5d] dark:text-[#a89f91] opacity-75" />
                  </div>
                )}
                <span>{currentLang === "en" ? opt.labelEn : opt.labelAr}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
