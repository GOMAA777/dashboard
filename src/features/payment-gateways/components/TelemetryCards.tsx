"use client";

import React from "react";

interface TelemetryCardsProps {
  totalCount: number;
  activeCount: number;
}

export function TelemetryCards({
  totalCount,
  activeCount,
}: TelemetryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full" dir="rtl">
      {/* 1. Total Gateways Card */}
      <div className="bg-white rounded-[16px] p-5 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-between border border-[#eae8e4]/60 text-start">
        {/* Right side in RTL: Text */}
        <div className="flex flex-col items-start text-start">
          <span className="text-[#837565] text-[10px] font-bold leading-[14px]">
            إجمالي البوابات المتاحة
          </span>
          <span className="text-[#1c140f] text-[28px] font-bold leading-[38px] my-0.5">
            {totalCount}
          </span>
          <span className="text-[#514537] text-[10px] font-bold leading-[14px]">
            بوابات مهيأة للمنظومة
          </span>
        </div>
        {/* Left side in RTL: Icon */}
        <div className="bg-[#f0eeea] rounded-[8px] size-12 flex items-center justify-center shrink-0">
          <img
            alt=""
            className="w-[19px] h-[18px]"
            src="/figma/payment-gateways/total-gateways.svg"
          />
        </div>
      </div>

      {/* 2. Active Gateways Card */}
      <div className="bg-white rounded-[16px] p-5 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-between border border-[#eae8e4]/60 text-start">
        {/* Right side in RTL: Text */}
        <div className="flex flex-col items-start text-start">
          <span className="text-[#837565] text-[10px] font-bold leading-[14px]">
            البوابات النشطة للتحصيل
          </span>
          <div className="flex items-center gap-2 my-0.5">
            <span className="text-[#1c140f] text-[28px] font-bold leading-[38px]">
              {activeCount}
            </span>
            <span className="bg-[#ecfdf5] text-[#047857] text-[10px] font-semibold rounded-[2px] px-1.5 py-0.5">
              جاهزية 100%
            </span>
          </div>
          <span className="text-[#514537] text-[10px] font-bold leading-[14px]">
            تستقبل الفواتير والاشتراكات
          </span>
        </div>
        {/* Left side in RTL: Icon */}
        <div className="bg-[#ecfdf5] rounded-[8px] size-12 flex items-center justify-center shrink-0">
          <img
            alt=""
            className="w-[22px] h-[21px]"
            src="/figma/payment-gateways/active-gateways.svg"
          />
        </div>
      </div>

      {/* 3. Security / PCI-DSS Card */}
      <div className="bg-white rounded-[16px] p-5 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-between border border-[#eae8e4]/60 text-start">
        {/* Right side in RTL: Text */}
        <div className="flex flex-col items-start text-start">
          <span className="text-[#837565] text-[10px] font-bold leading-[14px]">
            معايير التشفير والأمان
          </span>
          <span className="text-[#1c140f] text-[18px] font-bold leading-[26px] tracking-[-0.45px] my-1">
            PCI-DSS L1
          </span>
          <div className="flex items-center gap-1.5">
            <span className="bg-[#059669] rounded-full size-1.5 shrink-0" />
            <span className="text-[#047857] text-[10px] font-semibold leading-[14px]">
              تشفير بنكي 256-bit TLS
            </span>
          </div>
        </div>
        {/* Left side in RTL: Icon */}
        <div className="bg-[rgba(156,100,2,0.1)] rounded-[8px] size-12 flex items-center justify-center shrink-0">
          <img
            alt=""
            className="w-4 h-5"
            src="/figma/payment-gateways/shield-icon.svg"
          />
        </div>
      </div>

      {/* 4. ZATCA Card */}
      <div className="bg-white rounded-[16px] p-5 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-between border border-[#eae8e4]/60 text-start">
        {/* Right side in RTL: Text */}
        <div className="flex flex-col items-start text-start">
          <span className="text-[#837565] text-[10px] font-bold leading-[14px]">
            الفوترة الإلكترونية
          </span>
          <span className="text-[#1c140f] text-[18px] font-bold leading-[26px] my-1">
            هيئة الزكاة (ZATCA)
          </span>
          <div className="flex items-center gap-1">
            <img
              alt=""
              className="size-[11.6px] shrink-0"
              src="/figma/payment-gateways/check-zatca.svg"
            />
            <span className="text-[#514537] text-[10px] font-bold leading-[14px]">
              المرحلة الثانية (الربط والتكامل)
            </span>
          </div>
        </div>
        {/* Left side in RTL: Icon */}
        <div className="bg-[#f0eeea] rounded-[8px] size-12 flex items-center justify-center shrink-0">
          <img
            alt=""
            className="w-[18px] h-5"
            src="/figma/payment-gateways/zatca-icon.svg"
          />
        </div>
      </div>
    </div>
  );
}
