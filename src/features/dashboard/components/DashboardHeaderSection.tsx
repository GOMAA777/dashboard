"use client";

import React, { useState } from "react";
import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";

const filterOptions = [
  { id: "custom", label: "نطاق مخصص", hasIcon: true },
  { id: "6m", label: "آخر 6 أشهر", hasIcon: false },
  { id: "this_month", label: "هذا الشهر", hasIcon: false },
  { id: "30d", label: "آخر 30 يومًا", hasIcon: false },
];

export function DashboardHeaderSection() {
  const [activeRange, setActiveRange] = useQueryState("range", {
    defaultValue: "30d",
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div
      className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full"
      data-node-id="1:6"
      data-name="Section 1: Page Introduction & Action Bar"
    >
      {/* Right / Start (in RTL): Title and Subtitle */}
      <div className="flex flex-col items-start text-start" data-node-id="1:27">
        <h1
          className="font-bold text-[#1b1c1a] text-[28px] leading-[38px] tracking-[-0.7px] font-sans"
          data-node-id="1:30"
        >
          الرئيسية
        </h1>
        <p
          className="font-normal text-[#514537] text-[14px] leading-[22px]"
          data-node-id="1:33"
        >
          نظرة عامة على أداء المنصة والاشتراكات والمكاتب المرخصة
        </p>
      </div>

      {/* Left / End (in RTL): Action Bar and Range Filters */}
      <div
        className="bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] rounded-[12px] p-[6px] flex flex-wrap items-center gap-[8px] self-start md:self-auto shrink-0 border border-[#f0eeea]/60"
        data-node-id="1:7"
        data-name="Filters & Refresh Trigger"
      >
        {/* Refresh Button */}
        <button
          type="button"
          onClick={handleRefresh}
          className="bg-[#f5f3ef] hover:bg-[#eae8e4] text-[#514537] active:scale-[0.98] transition-all flex items-center gap-[6px] px-[12px] py-[6px] rounded-[8px] cursor-pointer"
          data-node-id="1:8"
        >
          <span className="text-[12px] leading-[16px] font-semibold">
            تحديث البيانات
          </span>
          <div className="size-[12px] flex items-center justify-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/refresh.svg"
              alt=""
              className={cn("size-[12px] block", isRefreshing && "animate-spin")}
            />
          </div>
        </button>

        {/* Vertical Divider */}
        <div className="h-[24px] w-px bg-[#eae8e4] mx-[2px]" data-node-id="1:14" />

        {/* Range Filter Buttons Group */}
        <div
          className="bg-[#f5f3ef] p-[4px] rounded-[12px] flex items-center gap-[2px]"
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
                    ? "bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] rounded-[12px] font-semibold text-[#9c6402]"
                    : "rounded-[6px] font-medium text-[#625d5d] hover:text-[#1b1c1a]"
                )}
              >
                {opt.hasIcon && (
                  <div className="size-[10.5px] flex items-center justify-center shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/figma/filter.svg"
                      alt=""
                      className="size-[10.5px] block opacity-75"
                    />
                  </div>
                )}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
