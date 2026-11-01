"use client";

import React from "react";
import { CheckCircle2, Clock, RotateCw, AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface TicketsStatsCardsProps {
  openCount?: number;
  inProgressCount?: number;
  pendingCount?: number;
  closedCount?: number;
  isEmpty?: boolean;
}

export function TicketsStatsCards({
  openCount = 0,
  inProgressCount = 0,
  pendingCount = 0,
  closedCount = 0,
  isEmpty = false,
}: TicketsStatsCardsProps) {
  const { t } = useLanguage();
  const displayOpen = isEmpty ? 0 : openCount;
  const displayInProgress = isEmpty ? 0 : inProgressCount;
  const displayPending = isEmpty ? 0 : pendingCount;
  const displayClosed = isEmpty ? 0 : closedCount;

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] w-full"
      data-node-id="1:14794"
      data-name="2. Statistical Metric Cards"
    >
      {/* Card 1: Open Tickets */}
      <div
        className="bg-white dark:bg-[#221812] flex flex-col justify-between p-[16px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 dark:border-[#38271c]"
        data-node-id="1:14843"
        data-name="Card 1: Open Tickets"
      >
        <div className="flex items-start justify-between w-full">
          <div className="bg-[#e0ecf8] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 text-[#1e3a8a] dark:text-[#e29d38] flex items-center justify-center rounded-[4px] size-[40px] shrink-0">
            <AlertCircle className="size-[20px]" />
          </div>
          <div className="flex flex-col items-end">
            <span className="font-medium text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[16px] text-start">
              {t("التذاكر المفتوحة", "Open Tickets")}
            </span>
            <div className="pt-[4px]">
              <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7] text-[28px] leading-[38px] text-start">
                {displayOpen}
              </span>
            </div>
          </div>
        </div>
        <div className="pt-[12px] w-full">
          {isEmpty ? (
            <div className="h-[4px] rounded-[12px] bg-[#eae8e4] dark:bg-[#2d1f16] w-full" />
          ) : (
            <div className="flex gap-[6px] items-center justify-end pt-[8px] w-full">
              <span className="font-bold text-[#1e3a8a] dark:text-[#93c5fd] bg-[#eff6ff] border border-blue-200 dark:bg-[#162233] dark:border-blue-500/40 text-[10px] leading-[14px] px-2 py-0.5 rounded-full">
                {t("منها 4 تذاكر واردة اليوم", "4 received today")}
              </span>
              <div className="bg-[#1e3a8a] dark:bg-[#2563eb] rounded-full size-[6px] shrink-0" />
            </div>
          )}
        </div>
      </div>

      {/* Card 2: In Progress */}
      <div
        className="bg-white dark:bg-[#221812] flex flex-col justify-between p-[16px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 dark:border-[#38271c]"
        data-node-id="1:14827"
        data-name="Card 2: In Progress"
      >
        <div className="flex items-start justify-between w-full">
          <div className="bg-[rgba(255,221,182,0.5)] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 text-[#9c6402] dark:text-[#e29d38] flex items-center justify-center rounded-[4px] size-[40px] shrink-0">
            <RotateCw className="size-[19px]" />
          </div>
          <div className="flex flex-col items-end">
            <span className="font-medium text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[16px] text-start">
              {t("جاري العمل عليها", "In Progress")}
            </span>
            <div className="pt-[4px]">
              <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7] text-[28px] leading-[38px] text-start">
                {displayInProgress}
              </span>
            </div>
          </div>
        </div>
        <div className="pt-[12px] w-full">
          {isEmpty ? (
            <div className="h-[4px] rounded-[12px] bg-[#eae8e4] dark:bg-[#2d1f16] w-full" />
          ) : (
            <div className="flex gap-[6px] items-center justify-end pt-[8px] w-full">
              <span className="font-bold text-[#7b4e00] dark:text-[#fbbf24] bg-[#fbf7f0] border border-[#ffddb6] dark:bg-[#2e1d0f] dark:border-amber-500/40 text-[10px] leading-[14px] px-2 py-0.5 rounded-full">
                {t("متوسط الإنجاز: 3.2 ساعات", "Avg Resolution: 3.2 hrs")}
              </span>
              <div className="bg-[#9c6402] dark:bg-[#f59e0b] rounded-full size-[6px] shrink-0" />
            </div>
          )}
        </div>
      </div>

      {/* Card 3: Pending Tickets */}
      <div
        className="bg-white dark:bg-[#221812] flex flex-col justify-between p-[16px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 dark:border-[#38271c]"
        data-node-id="1:14811"
        data-name="Card 3: Pending Tickets"
      >
        <div className="flex items-start justify-between w-full">
          <div className="bg-[#fff4e5] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 text-[#b45309] dark:text-[#e29d38] flex items-center justify-center rounded-[4px] size-[40px] shrink-0">
            <Clock className="size-[19px]" />
          </div>
          <div className="flex flex-col items-end">
            <span className="font-medium text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[16px] text-start">
              {t("التذاكر المعلقة", "Pending Tickets")}
            </span>
            <div className="pt-[4px]">
              <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7] text-[28px] leading-[38px] text-start">
                {displayPending}
              </span>
            </div>
          </div>
        </div>
        <div className="pt-[12px] w-full">
          {isEmpty ? (
            <div className="h-[4px] rounded-[12px] bg-[#eae8e4] dark:bg-[#2d1f16] w-full" />
          ) : (
            <div className="flex gap-[6px] items-center justify-end pt-[8px] w-full">
              <span className="font-bold text-[#b45309] dark:text-[#fbbf24] bg-[#fffbeb] border border-amber-200 dark:bg-[#2e1d0f] dark:border-amber-500/40 text-[10px] leading-[14px] px-2 py-0.5 rounded-full">
                {t("بانتظار إفادة مكاتب المحامين", "Awaiting law firms feedback")}
              </span>
              <div className="bg-[#b45309] dark:bg-[#f59e0b] rounded-full size-[6px] shrink-0" />
            </div>
          )}
        </div>
      </div>

      {/* Card 4: Closed Tickets */}
      <div
        className="bg-white dark:bg-[#221812] flex flex-col justify-between p-[16px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 dark:border-[#38271c]"
        data-node-id="1:14795"
        data-name="Card 4: Closed Tickets"
      >
        <div className="flex items-start justify-between w-full">
          <div className="bg-[#e6f4ea] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 text-[#137333] dark:text-[#e29d38] flex items-center justify-center rounded-[4px] size-[40px] shrink-0">
            <CheckCircle2 className="size-[20px]" />
          </div>
          <div className="flex flex-col items-end">
            <span className="font-medium text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[16px] text-start">
              {t("التذاكر المغلقة", "Closed Tickets")}
            </span>
            <div className="pt-[4px]">
              <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7] text-[28px] leading-[38px] text-start">
                {displayClosed}
              </span>
            </div>
          </div>
        </div>
        <div className="pt-[12px] w-full">
          {isEmpty ? (
            <div className="h-[4px] rounded-[12px] bg-[#eae8e4] dark:bg-[#2d1f16] w-full" />
          ) : (
            <div className="flex gap-[6px] items-center justify-end pt-[8px] w-full">
              <span className="font-bold text-[#137333] dark:text-[#6ee7b7] bg-[#ecfdf5] border border-emerald-200 dark:bg-[#132c1c] dark:border-emerald-500/40 text-[10px] leading-[14px] px-2 py-0.5 rounded-full">
                {t("نسبة الرضا العامة 98.4%", "Satisfaction rate 98.4%")}
              </span>
              <div className="bg-[#137333] dark:bg-[#10b981] rounded-full size-[6px] shrink-0" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}