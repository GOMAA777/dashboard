"use client";

import React from "react";
import { CheckCircle2, Clock, RotateCw, AlertCircle } from "lucide-react";

interface TicketsStatsCardsProps {
  openCount?: number;
  inProgressCount?: number;
  pendingCount?: number;
  closedCount?: number;
  isEmpty?: boolean;
}

export function TicketsStatsCards({
  openCount = 18,
  inProgressCount = 24,
  pendingCount = 7,
  closedCount = 342,
  isEmpty = false,
}: TicketsStatsCardsProps) {
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
        className="bg-white flex flex-col justify-between p-[16px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60"
        data-node-id="1:14843"
        data-name="Card 1: Open Tickets"
      >
        <div className="flex items-start justify-between w-full">
          <div className="bg-[#e0ecf8] flex items-center justify-center rounded-[4px] size-[40px] shrink-0">
            <AlertCircle className="size-[20px] text-[#1e3a8a]" />
          </div>
          <div className="flex flex-col items-end">
            <span className="font-medium text-[#514537] text-[12px] leading-[16px] text-right">
              التذاكر المفتوحة
            </span>
            <div className="pt-[4px]">
              <span className="font-bold text-[#1b1c1a] text-[28px] leading-[38px] text-right">
                {displayOpen}
              </span>
            </div>
          </div>
        </div>
        <div className="pt-[12px] w-full">
          {isEmpty ? (
            <div className="h-[4px] rounded-[12px] bg-[#eae8e4] w-full" />
          ) : (
            <div className="flex gap-[6px] items-center justify-end pt-[8px] w-full">
              <span className="font-bold text-[#1e3a8a] text-[10px] leading-[14px]">
                منها 4 تذاكر واردة اليوم
              </span>
              <div className="bg-[#1e3a8a] rounded-[12px] size-[6px] shrink-0" />
            </div>
          )}
        </div>
      </div>

      {/* Card 2: In Progress */}
      <div
        className="bg-white flex flex-col justify-between p-[16px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60"
        data-node-id="1:14827"
        data-name="Card 2: In Progress"
      >
        <div className="flex items-start justify-between w-full">
          <div className="bg-[rgba(255,221,182,0.5)] flex items-center justify-center rounded-[4px] size-[40px] shrink-0">
            <RotateCw className="size-[19px] text-[#9c6402]" />
          </div>
          <div className="flex flex-col items-end">
            <span className="font-medium text-[#514537] text-[12px] leading-[16px] text-right">
              جاري العمل عليها
            </span>
            <div className="pt-[4px]">
              <span className="font-bold text-[#1b1c1a] text-[28px] leading-[38px] text-right">
                {displayInProgress}
              </span>
            </div>
          </div>
        </div>
        <div className="pt-[12px] w-full">
          {isEmpty ? (
            <div className="h-[4px] rounded-[12px] bg-[#eae8e4] w-full" />
          ) : (
            <div className="flex gap-[6px] items-center justify-end pt-[8px] w-full">
              <span className="font-bold text-[#7b4e00] text-[10px] leading-[14px]">
                متوسط الإنجاز: 3.2 ساعات
              </span>
              <div className="bg-[#9c6402] rounded-[12px] size-[6px] shrink-0" />
            </div>
          )}
        </div>
      </div>

      {/* Card 3: Pending Tickets */}
      <div
        className="bg-white flex flex-col justify-between p-[16px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60"
        data-node-id="1:14811"
        data-name="Card 3: Pending Tickets"
      >
        <div className="flex items-start justify-between w-full">
          <div className="bg-[#fff4e5] flex items-center justify-center rounded-[4px] size-[40px] shrink-0">
            <Clock className="size-[19px] text-[#b45309]" />
          </div>
          <div className="flex flex-col items-end">
            <span className="font-medium text-[#514537] text-[12px] leading-[16px] text-right">
              التذاكر المعلقة
            </span>
            <div className="pt-[4px]">
              <span className="font-bold text-[#1b1c1a] text-[28px] leading-[38px] text-right">
                {displayPending}
              </span>
            </div>
          </div>
        </div>
        <div className="pt-[12px] w-full">
          {isEmpty ? (
            <div className="h-[4px] rounded-[12px] bg-[#eae8e4] w-full" />
          ) : (
            <div className="flex gap-[6px] items-center justify-end pt-[8px] w-full">
              <span className="font-bold text-[#b45309] text-[10px] leading-[14px]">
                بانتظار إفادة مكاتب المحامين
              </span>
              <div className="bg-[#b45309] rounded-[12px] size-[6px] shrink-0" />
            </div>
          )}
        </div>
      </div>

      {/* Card 4: Closed Tickets */}
      <div
        className="bg-white flex flex-col justify-between p-[16px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60"
        data-node-id="1:14795"
        data-name="Card 4: Closed Tickets"
      >
        <div className="flex items-start justify-between w-full">
          <div className="bg-[#e6f4ea] flex items-center justify-center rounded-[4px] size-[40px] shrink-0">
            <CheckCircle2 className="size-[20px] text-[#137333]" />
          </div>
          <div className="flex flex-col items-end">
            <span className="font-medium text-[#514537] text-[12px] leading-[16px] text-right">
              التذاكر المغلقة
            </span>
            <div className="pt-[4px]">
              <span className="font-bold text-[#1b1c1a] text-[28px] leading-[38px] text-right">
                {displayClosed}
              </span>
            </div>
          </div>
        </div>
        <div className="pt-[12px] w-full">
          {isEmpty ? (
            <div className="h-[4px] rounded-[12px] bg-[#eae8e4] w-full" />
          ) : (
            <div className="flex gap-[6px] items-center justify-end pt-[8px] w-full">
              <span className="font-bold text-[#137333] text-[10px] leading-[14px]">
                نسبة الرضا العامة 98.4%
              </span>
              <div className="bg-[#137333] rounded-[12px] size-[6px] shrink-0" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
