"use client";

import React from "react";
import { Layers, CheckCircle2, ShieldCheck, Check, FileCheck } from "lucide-react";

interface TelemetryCardsProps {
  totalCount: number;
  activeCount: number;
}

export function TelemetryCards({
  totalCount,
  activeCount,
}: TelemetryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* 1. Total Gateways Card */}
      <div className="bg-white dark:bg-[#221812] rounded-[16px] p-5 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-between border border-[#eae8e4]/60 dark:border-[#38271c] text-start">
        {/* Right side in RTL: Text */}
        <div className="flex flex-col items-start text-start">
          <span className="text-[#837565] dark:text-[#cdc5bd] text-[10px] font-bold leading-[14px]">
            إجمالي البوابات المتاحة
          </span>
          <span className="text-[#1c140f] dark:text-[#fdfbf7] text-[28px] font-bold leading-[38px] my-0.5">
            {totalCount}
          </span>
          <span className="text-[#514537] dark:text-[#8e8680] text-[10px] font-bold leading-[14px]">
            بوابات مهيأة للمنظومة
          </span>
        </div>
        {/* Left side in RTL: Icon */}
        <div className="bg-[#f0eeea] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 text-[#837565] dark:text-[#e29d38] rounded-[8px] size-12 flex items-center justify-center shrink-0">
          <Layers className="size-5" />
        </div>
      </div>

      {/* 2. Active Gateways Card */}
      <div className="bg-white dark:bg-[#221812] rounded-[16px] p-5 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-between border border-[#eae8e4]/60 dark:border-[#38271c] text-start">
        {/* Right side in RTL: Text */}
        <div className="flex flex-col items-start text-start">
          <span className="text-[#837565] dark:text-[#cdc5bd] text-[10px] font-bold leading-[14px]">
            البوابات النشطة للتحصيل
          </span>
          <div className="flex items-center gap-2 my-0.5">
            <span className="text-[#1c140f] dark:text-[#fdfbf7] text-[28px] font-bold leading-[38px]">
              {activeCount}
            </span>
            <span className="bg-[#ecfdf5] border border-emerald-200 dark:bg-[#132c1c] dark:border-emerald-500/40 text-[#047857] dark:text-[#6ee7b7] text-[10px] font-semibold rounded-full px-2.5 py-0.5">
              جاهزية 100%
            </span>
          </div>
          <span className="text-[#514537] dark:text-[#8e8680] text-[10px] font-bold leading-[14px]">
            تستقبل الفواتير والاشتراكات
          </span>
        </div>
        {/* Left side in RTL: Icon */}
        <div className="bg-[#ecfdf5] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 text-[#047857] dark:text-[#e29d38] rounded-[8px] size-12 flex items-center justify-center shrink-0">
          <CheckCircle2 className="size-5" />
        </div>
      </div>

      {/* 3. Security / PCI-DSS Card */}
      <div className="bg-white dark:bg-[#221812] rounded-[16px] p-5 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-between border border-[#eae8e4]/60 dark:border-[#38271c] text-start">
        {/* Right side in RTL: Text */}
        <div className="flex flex-col items-start text-start">
          <span className="text-[#837565] dark:text-[#cdc5bd] text-[10px] font-bold leading-[14px]">
            معايير التشفير والأمان
          </span>
          <span className="text-[#1c140f] dark:text-[#fdfbf7] text-[18px] font-bold leading-[26px] tracking-[-0.45px] my-1">
            PCI-DSS L1
          </span>
          <div className="flex items-center gap-1.5">
            <span className="bg-[#059669] dark:bg-[#10b981] rounded-full size-1.5 shrink-0" />
            <span className="text-[#047857] dark:text-[#6ee7b7] text-[10px] font-semibold leading-[14px]">
              تشفير بنكي 256-bit TLS
            </span>
          </div>
        </div>
        {/* Left side in RTL: Icon */}
        <div className="bg-[rgba(156,100,2,0.1)] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 text-[#9c6402] dark:text-[#e29d38] rounded-[8px] size-12 flex items-center justify-center shrink-0">
          <ShieldCheck className="size-5" />
        </div>
      </div>

      {/* 4. ZATCA Card */}
      <div className="bg-white dark:bg-[#221812] rounded-[16px] p-5 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-between border border-[#eae8e4]/60 dark:border-[#38271c] text-start">
        {/* Right side in RTL: Text */}
        <div className="flex flex-col items-start text-start">
          <span className="text-[#837565] dark:text-[#cdc5bd] text-[10px] font-bold leading-[14px]">
            الفوترة الإلكترونية
          </span>
          <span className="text-[#1c140f] dark:text-[#fdfbf7] text-[18px] font-bold leading-[26px] my-1">
            هيئة الزكاة (ZATCA)
          </span>
          <div className="flex items-center gap-1">
            <Check className="size-3 text-[#059669] dark:text-[#10b981]" />
            <span className="text-[#514537] dark:text-[#8e8680] text-[10px] font-bold leading-[14px]">
              المرحلة الثانية (الربط والتكامل)
            </span>
          </div>
        </div>
        {/* Left side in RTL: Icon */}
        <div className="bg-[#f0eeea] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 text-[#837565] dark:text-[#e29d38] rounded-[8px] size-12 flex items-center justify-center shrink-0">
          <FileCheck className="size-5" />
        </div>
      </div>
    </div>
  );
}
