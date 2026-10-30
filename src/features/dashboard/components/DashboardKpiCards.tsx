"use client";

import React, { useSyncExternalStore } from "react";
import {
  BadgeCheck,
  Banknote,
  Building2,
  Headphones,
  TrendingUp,
} from "lucide-react";
import { useUIStore } from "@/stores/use-ui-store";

export function DashboardKpiCards() {
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const language = useUIStore((state) => state.language);
  const currentLang = isMounted ? language : "ar";

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] w-full"
      data-node-id="1:35"
      data-name="Section 2: Primary KPI Cards (4 Tiles)"
    >
      {/* KPI 1: إجمالي المكاتب */}
      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] p-[16px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] border border-[#f0eeea]/70 dark:border-[#38271c] flex flex-col justify-between"
        data-node-id="1:97"
        data-name="KPI 1"
      >
        <div className="flex items-start justify-between w-full" data-node-id="1:98">
          {/* Icon box */}
          <div
            className="size-[44px] rounded-[4px] bg-[#eae8e4] dark:bg-[#2d1f16] flex items-center justify-center shrink-0"
            data-node-id="1:99"
          >
            <Building2 className="size-[18px] block text-[#9c6402] dark:text-[#e29d38]" />
          </div>

          {/* Title & Value */}
          <div className="flex flex-col items-end text-end" data-node-id="1:102">
            <span
              className="text-[#625d5d] dark:text-[#a89f91] text-[12px] leading-[16px] font-medium"
              data-node-id="1:104"
            >
              {currentLang === "en" ? "Total Law Offices" : "إجمالي المكاتب"}
            </span>
            <span
              className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[28px] leading-[38px] font-bold font-sans mt-[4px]"
              data-node-id="1:107"
            >
              128
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-[8px] w-full" data-node-id="1:108">
          <div
            className="border-t border-[#f0eeea] dark:border-[#38271c] pt-[9px] flex items-center justify-between w-full"
            data-node-id="1:109"
          >
            {/* Badge */}
            <div
              className="bg-[#ecfdf5] border border-emerald-200 dark:bg-[#132c1c] dark:border-emerald-500/40 dark:shadow-[0_0_10px_rgba(16,185,129,0.15)] rounded-full px-2.5 py-0.5 flex items-center gap-1.5 transition-colors"
              data-node-id="1:110"
            >
              <span className="size-[7px] rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981] ring-1 ring-emerald-400/60 shrink-0" />
              <span className="text-[#065f46] dark:text-[#6ee7b7] text-[11px] font-bold">
                +8.4%
              </span>
            </div>

            {/* Subtitle */}
            <span
              className="text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[18px] font-normal"
              data-node-id="1:115"
            >
              {currentLang === "en" ? "Total registered on platform" : "إجمالي المسجلة على المنصة"}
            </span>
          </div>
        </div>
      </div>

      {/* KPI 2: الاشتراكات النشطة */}
      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] p-[16px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] border border-[#f0eeea]/70 dark:border-[#38271c] flex flex-col justify-between"
        data-node-id="1:78"
        data-name="KPI 2"
      >
        <div className="flex items-start justify-between w-full" data-node-id="1:79">
          {/* Icon box */}
          <div
            className="size-[44px] rounded-[4px] bg-[#ecfdf5] dark:bg-[#12281a] flex items-center justify-center shrink-0"
            data-node-id="1:80"
          >
            <BadgeCheck className="w-[22px] h-[21px] block text-[#047857] dark:text-[#6ee7b7]" />
          </div>

          {/* Title & Value */}
          <div className="flex flex-col items-end text-end" data-node-id="1:83">
            <span
              className="text-[#625d5d] dark:text-[#a89f91] text-[12px] leading-[16px] font-medium"
              data-node-id="1:85"
            >
              {currentLang === "en" ? "Active Subscriptions" : "الاشتراكات النشطة"}
            </span>
            <span
              className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[28px] leading-[38px] font-bold font-sans mt-[4px]"
              data-node-id="1:88"
            >
              96
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-[8px] w-full" data-node-id="1:89">
          <div
            className="border-t border-[#f0eeea] dark:border-[#38271c] pt-[9px] flex items-center justify-between w-full"
            data-node-id="1:90"
          >
            {/* Badge */}
            <div
              className="bg-[#f5f3ef] border border-[#eae8e4] dark:bg-[#2d1f16] dark:border-[#4d3627] rounded-full px-2.5 py-0.5 flex items-center gap-1.5 transition-colors"
              data-node-id="1:91"
            >
              <span className="size-[7px] rounded-full bg-[#9c6402] dark:bg-[#e29d38] shadow-[0_0_6px_#9c6402] shrink-0" />
              <span className="text-[#514537] dark:text-[#cdc5bd] text-[11px] font-bold">
                {currentLang === "en" ? "75% of offices" : "75% من المكاتب"}
              </span>
            </div>

            {/* Subtitle */}
            <span
              className="text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[18px] font-normal"
              data-node-id="1:96"
            >
              {currentLang === "en" ? "Number of active plans" : "عدد الاشتراكات السارية"}
            </span>
          </div>
        </div>
      </div>

      {/* KPI 3: الإيرادات الشهرية */}
      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] p-[16px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] border border-[#f0eeea]/70 dark:border-[#38271c] flex flex-col justify-between"
        data-node-id="1:55"
        data-name="KPI 3"
      >
        <div className="flex items-start justify-between w-full" data-node-id="1:56">
          {/* Icon box */}
          <div
            className="size-[44px] rounded-[4px] bg-[#ffddb6] dark:bg-[#3d2716] flex items-center justify-center shrink-0"
            data-node-id="1:57"
          >
            <Banknote className="w-[22px] h-[16px] block text-[#9c6402] dark:text-[#e29d38]" />
          </div>

          {/* Title & Value */}
          <div className="flex flex-col items-end text-end" data-node-id="1:60">
            <span
              className="text-[#625d5d] dark:text-[#a89f91] text-[12px] leading-[16px] font-medium"
              data-node-id="1:62"
            >
              {currentLang === "en" ? "Monthly Revenue" : "الإيرادات الشهرية"}
            </span>
            <div className="flex items-baseline gap-[4px] mt-[4px]" data-node-id="1:64">
              <span className="text-[#625d5d] dark:text-[#a89f91] text-[12px] leading-[16px] font-normal">
                {currentLang === "en" ? "SAR" : "ر.س"}
              </span>
              <span
                className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[28px] leading-[38px] font-bold font-sans"
                data-node-id="1:68"
              >
                48,750
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-[8px] w-full" data-node-id="1:69">
          <div
            className="border-t border-[#f0eeea] dark:border-[#38271c] pt-[9px] flex items-center justify-between w-full"
            data-node-id="1:70"
          >
            {/* Badge */}
            <div
              className="bg-[#9c6402]/10 border border-[#9c6402]/30 dark:bg-[rgba(226,157,56,0.18)] dark:border-[#e29d38]/40 rounded-full px-2.5 py-0.5 flex items-center gap-1.5 transition-colors"
              data-node-id="1:71"
            >
              <TrendingUp className="size-3 block shrink-0 text-[#9c6402] dark:text-[#e29d38]" />
              <span className="text-[#9c6402] dark:text-[#e29d38] text-[11px] font-bold">
                +12.2%
              </span>
            </div>

            {/* Subtitle */}
            <span
              className="text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[18px] font-normal"
              data-node-id="1:77"
            >
              {currentLang === "en" ? "Achieved this month" : "المحققة خلال الشهر الحالي"}
            </span>
          </div>
        </div>
      </div>

      {/* KPI 4: تذاكر الدعم المفتوحة */}
      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] p-[16px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] border border-[#f0eeea]/70 dark:border-[#38271c] flex flex-col justify-between"
        data-node-id="1:36"
        data-name="KPI 4"
      >
        <div className="flex items-start justify-between w-full" data-node-id="1:37">
          {/* Icon box */}
          <div
            className="size-[44px] rounded-[4px] bg-[rgba(255,218,214,0.4)] dark:bg-[#381616] flex items-center justify-center shrink-0"
            data-node-id="1:38"
          >
            <Headphones className="w-[20px] h-[18px] block text-[#ba1a1a] dark:text-[#f87171]" />
          </div>

          {/* Title & Value */}
          <div className="flex flex-col items-end text-end" data-node-id="1:41">
            <span
              className="text-[#625d5d] dark:text-[#a89f91] text-[12px] leading-[16px] font-medium"
              data-node-id="1:43"
            >
              {currentLang === "en" ? "Open Support Tickets" : "تذاكر الدعم المفتوحة"}
            </span>
            <span
              className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[28px] leading-[38px] font-bold font-sans mt-[4px]"
              data-node-id="1:46"
            >
              12
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-[8px] w-full" data-node-id="1:47">
          <div
            className="border-t border-[#f0eeea] dark:border-[#38271c] pt-[9px] flex items-center justify-between w-full"
            data-node-id="1:48"
          >
            {/* Badge */}
            <div
              className="bg-[#fff1f2] border border-rose-200 dark:bg-[#381616] dark:border-rose-500/40 dark:shadow-[0_0_10px_rgba(244,63,94,0.15)] rounded-full px-2.5 py-0.5 flex items-center gap-1.5 transition-colors"
              data-node-id="1:49"
            >
              <span className="size-[7px] rounded-full bg-[#e11d48] shadow-[0_0_8px_#e11d48] ring-1 ring-rose-400/60 shrink-0" />
              <span className="text-[#9f1239] dark:text-[#fca5a5] text-[11px] font-bold">
                {currentLang === "en" ? "4 Critical / Urgent" : "4 حرجة / عاجلة"}
              </span>
            </div>

            {/* Subtitle */}
            <span
              className="text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[18px] font-normal"
              data-node-id="1:54"
            >
              {currentLang === "en" ? "Requires immediate follow-up" : "تحتاج إلى متابعة"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
