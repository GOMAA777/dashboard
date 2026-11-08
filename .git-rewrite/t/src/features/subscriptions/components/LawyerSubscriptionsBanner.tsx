"use client";

import React, { useState } from "react";
import { RefreshCw, Calendar, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/use-ui-store";
import { translations } from "@/lib/i18n";

interface LawyerSubscriptionsBannerProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function LawyerSubscriptionsBanner({
  onRefresh,
  isRefreshing = false,
}: LawyerSubscriptionsBannerProps) {
  const { language } = useUIStore();
  const t = translations[language].banner;
  const ls = translations[language].lawyerSubs;
  const [selectedRange, setSelectedRange] = useState<"7d" | "30d">("7d");

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6 pb-5 relative z-10">
      {/* Greeting & Last Update Time */}
      <div className="flex items-start gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl md:text-2xl font-bold text-[#1c1917] dark:text-[#f5f4f0] tracking-tight">
              {ls.bannerTitle}
            </h2>
            <div className="w-7 h-7 rounded-lg bg-[#faf5eb] dark:bg-[#201c17] border border-[#eeddbb] dark:border-[#382b18] flex items-center justify-center text-[#c29547] dark:text-[#d4a759] shadow-2xs">
              <Scale className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <p className="text-xs text-[#8c827a] dark:text-[#9e968a] mt-1 font-medium">
            {ls.bannerSubtitle} • {t.lastUpdate}
          </p>
        </div>
      </div>

      {/* Refresh Button & Date Range Filter Pills */}
      <div className="flex items-center gap-2.5">
        {/* Refresh Button */}
        <button
          type="button"
          onClick={onRefresh}
          className="p-2 rounded-xl border border-[#ded5c6] dark:border-[#2f2a24] bg-white dark:bg-[#1a1816] text-[#7d7467] dark:text-[#a8a195] hover:text-[#c29547] dark:hover:text-[#d4a759] hover:border-[#c29547] hover:bg-[#faf7f0] dark:hover:bg-[#201d1a] shadow-xs hover:shadow-sm transition-all cursor-pointer"
          title={t.refresh}
        >
          <RefreshCw
            className={cn("w-4 h-4", isRefreshing && "animate-spin text-[#c29547]")}
          />
        </button>

        {/* 7 Days Filter Pill */}
        <button
          type="button"
          onClick={() => setSelectedRange("7d")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border shadow-xs cursor-pointer",
            selectedRange === "7d"
              ? "bg-[#faf5eb] dark:bg-[#2b2419] text-[#b8863b] dark:text-[#d4a759] border-[#d8c29d] dark:border-[#5a4321] shadow-sm"
              : "bg-white dark:bg-[#1a1816] text-[#6b6359] dark:text-[#a8a195] border-[#ded5c6] dark:border-[#2f2a24] hover:bg-[#faf7f0] dark:hover:bg-[#201d1a] hover:border-[#c29547]"
          )}
        >
          <Calendar className="w-3.5 h-3.5 text-[#b8863b] dark:text-[#d4a759]" />
          <span>{t.days7}</span>
        </button>

        {/* 30 Days Filter Pill */}
        <button
          type="button"
          onClick={() => setSelectedRange("30d")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border shadow-xs cursor-pointer",
            selectedRange === "30d"
              ? "bg-[#faf5eb] dark:bg-[#2b2419] text-[#b8863b] dark:text-[#d4a759] border-[#d8c29d] dark:border-[#5a4321] shadow-sm"
              : "bg-white dark:bg-[#1a1816] text-[#6b6359] dark:text-[#a8a195] border-[#ded5c6] dark:border-[#2f2a24] hover:bg-[#faf7f0] dark:hover:bg-[#201d1a] hover:border-[#c29547]"
          )}
        >
          <Calendar className="w-3.5 h-3.5 text-[#a89e90] dark:text-[#787166]" />
          <span>{t.days30}</span>
        </button>
      </div>
    </div>
  );
}
