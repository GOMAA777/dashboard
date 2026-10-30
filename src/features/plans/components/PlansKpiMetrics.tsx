"use client";

import React from "react";
import { Layers, CheckCircle2, Building, Landmark, TrendingUp } from "lucide-react";

export function PlansKpiMetrics() {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] w-full font-['Cairo',sans-serif]"
      data-node-id="1:2464"
    >
      {/* Card 1: إجمالي الباقات */}
      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] p-[20px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex items-center justify-between"
        data-node-id="1:2515"
      >
        <div className="flex flex-col text-start">
          <span className="text-[12px] font-medium text-[#514537] dark:text-[#cdc5bd]">
            إجمالي الباقات
          </span>
          <span className="text-[28px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] tracking-[-0.7px] leading-[38px] mt-[2px]">
            4
          </span>
          <div className="flex items-center gap-[4px] text-[10px] text-[#837565] dark:text-[#8e8680] font-bold mt-[4px]">
            <Layers className="size-[12px] text-[#9c6402] dark:text-[#e29d38]" />
            <span>خطط الاشتراك المعرّفة بالنظام</span>
          </div>
        </div>

        <div className="size-[48px] rounded-[6px] bg-[#f0eeea] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
          <Layers className="size-[22px]" />
        </div>
      </div>

      {/* Card 2: الباقات المفعّلة */}
      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] p-[20px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex items-center justify-between"
        data-node-id="1:2501"
      >
        <div className="flex flex-col text-start">
          <span className="text-[12px] font-medium text-[#514537] dark:text-[#cdc5bd]">
            الباقات المفعّلة
          </span>
          <span className="text-[28px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] tracking-[-0.7px] leading-[38px] mt-[2px]">
            3
          </span>
          <div className="flex items-center gap-[6px] text-[10px] text-[#047857] dark:text-[#6ee7b7] font-bold mt-[4px]">
            <span className="size-[7px] rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981] ring-1 ring-emerald-400/60" />
            <span>متاحة لاشتراك مكاتب المحاماة</span>
          </div>
        </div>

        <div className="size-[48px] rounded-[6px] bg-[#ecfdf5] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 flex items-center justify-center text-[#059669] dark:text-[#e29d38] shrink-0">
          <CheckCircle2 className="size-[22px]" />
        </div>
      </div>

      {/* Card 3: المكاتب المشتركة */}
      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] p-[20px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex items-center justify-between"
        data-node-id="1:2483"
      >
        <div className="flex flex-col text-start">
          <span className="text-[12px] font-medium text-[#514537] dark:text-[#cdc5bd]">
            المكاتب المشتركة
          </span>
          <div className="flex items-baseline gap-[8px] mt-[2px]">
            <span className="text-[28px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] tracking-[-0.7px] leading-[38px]">
              96
            </span>
            <span className="bg-[#ecfdf5] border border-emerald-200 dark:bg-[#132c1c] dark:border-emerald-500/40 text-[#047857] dark:text-[#6ee7b7] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              +8% هذا الشهر
            </span>
          </div>
          <div className="flex items-center gap-[4px] text-[10px] text-[#837565] dark:text-[#8e8680] font-bold mt-[4px]">
            <Building className="size-[12px] text-[#9c6402] dark:text-[#e29d38]" />
            <span>مكتب محاماة وشركة مهنية</span>
          </div>
        </div>

        <div className="size-[48px] rounded-[6px] bg-[#f0eeea] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
          <Building className="size-[22px]" />
        </div>
      </div>

      {/* Card 4: الإيراد الشهري المتكرر (MRR) */}
      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] p-[20px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex items-center justify-between"
        data-node-id="1:2465"
      >
        <div className="flex flex-col text-start">
          <span className="text-[12px] font-medium text-[#514537] dark:text-[#cdc5bd]">
            الإيراد الشهري المتكرر (MRR)
          </span>
          <div className="flex items-baseline gap-[4px] mt-[2px]">
            <span className="text-[28px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] tracking-[-0.7px] leading-[38px]">
              48,500
            </span>
            <span className="text-[11px] font-bold text-[#514537] dark:text-[#cdc5bd]">ر.س</span>
          </div>
          <div className="flex items-center gap-[4px] text-[10px] text-[#047857] dark:text-[#6ee7b7] font-semibold mt-[4px]">
            <TrendingUp className="size-[13px]" />
            <span>+14.2% مقارنة بالربع السابق</span>
          </div>
        </div>

        <div className="size-[48px] rounded-[6px] bg-[#ffddb6] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
          <Landmark className="size-[22px]" />
        </div>
      </div>
    </div>
  );
}
