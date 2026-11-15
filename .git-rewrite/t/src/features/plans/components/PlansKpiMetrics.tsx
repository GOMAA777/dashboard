"use client";

import React from "react";
import { Layers, CheckCircle2, Building, Landmark, TrendingUp } from "lucide-react";

export function PlansKpiMetrics() {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] w-full font-['Cairo',sans-serif]"
      data-node-id="1:2464"
      dir="rtl"
    >
      {/* Card 1: إجمالي الباقات */}
      <div
        className="bg-white rounded-[8px] p-[20px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] flex items-center justify-between"
        data-node-id="1:2515"
      >
        <div className="flex flex-col text-right">
          <span className="text-[12px] font-medium text-[#514537]">
            إجمالي الباقات
          </span>
          <span className="text-[28px] font-bold text-[#1b1c1a] tracking-[-0.7px] leading-[38px] mt-[2px]">
            4
          </span>
          <div className="flex items-center gap-[4px] text-[10px] text-[#837565] font-bold mt-[4px]">
            <Layers className="size-[12px]" />
            <span>خطط الاشتراك المعرّفة بالنظام</span>
          </div>
        </div>

        <div className="size-[48px] rounded-[4px] bg-[#f0eeea] flex items-center justify-center text-[#514537] shrink-0">
          <Layers className="size-[22px]" />
        </div>
      </div>

      {/* Card 2: الباقات المفعّلة */}
      <div
        className="bg-white rounded-[8px] p-[20px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] flex items-center justify-between"
        data-node-id="1:2501"
      >
        <div className="flex flex-col text-right">
          <span className="text-[12px] font-medium text-[#514537]">
            الباقات المفعّلة
          </span>
          <span className="text-[28px] font-bold text-[#1b1c1a] tracking-[-0.7px] leading-[38px] mt-[2px]">
            3
          </span>
          <div className="flex items-center gap-[6px] text-[10px] text-[#047857] font-bold mt-[4px]">
            <span className="size-[7px] rounded-full bg-[#059669]" />
            <span>متاحة لاشتراك مكاتب المحاماة</span>
          </div>
        </div>

        <div className="size-[48px] rounded-[4px] bg-[#ecfdf5] flex items-center justify-center text-[#059669] shrink-0">
          <CheckCircle2 className="size-[22px]" />
        </div>
      </div>

      {/* Card 3: المكاتب المشتركة */}
      <div
        className="bg-white rounded-[8px] p-[20px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] flex items-center justify-between"
        data-node-id="1:2483"
      >
        <div className="flex flex-col text-right">
          <span className="text-[12px] font-medium text-[#514537]">
            المكاتب المشتركة
          </span>
          <div className="flex items-baseline gap-[8px] mt-[2px]">
            <span className="text-[28px] font-bold text-[#1b1c1a] tracking-[-0.7px] leading-[38px]">
              96
            </span>
            <span className="bg-[#ecfdf5] text-[#047857] text-[10px] font-bold px-[6px] py-[2px] rounded-[2px]">
              +8% هذا الشهر
            </span>
          </div>
          <div className="flex items-center gap-[4px] text-[10px] text-[#837565] font-bold mt-[4px]">
            <Building className="size-[12px]" />
            <span>مكتب محاماة وشركة مهنية</span>
          </div>
        </div>

        <div className="size-[48px] rounded-[4px] bg-[#f0eeea] flex items-center justify-center text-[#514537] shrink-0">
          <Building className="size-[22px]" />
        </div>
      </div>

      {/* Card 4: الإيراد الشهري المتكرر (MRR) */}
      <div
        className="bg-white rounded-[8px] p-[20px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] flex items-center justify-between"
        data-node-id="1:2465"
      >
        <div className="flex flex-col text-right">
          <span className="text-[12px] font-medium text-[#514537]">
            الإيراد الشهري المتكرر (MRR)
          </span>
          <div className="flex items-baseline gap-[4px] mt-[2px]">
            <span className="text-[28px] font-bold text-[#1b1c1a] tracking-[-0.7px] leading-[38px]">
              48,500
            </span>
            <span className="text-[11px] font-bold text-[#514537]">ر.س</span>
          </div>
          <div className="flex items-center gap-[4px] text-[10px] text-[#047857] font-semibold mt-[4px]">
            <TrendingUp className="size-[13px]" />
            <span>+14.2% مقارنة بالربع السابق</span>
          </div>
        </div>

        <div className="size-[48px] rounded-[4px] bg-[#f0eeea] flex items-center justify-center text-[#514537] shrink-0">
          <Landmark className="size-[22px]" />
        </div>
      </div>
    </div>
  );
}
