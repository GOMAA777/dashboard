"use client";

import React from "react";
import { Plus, Building2 } from "lucide-react";

interface PlansManagementHeaderProps {
  onCreatePlan: () => void;
  onViewSubscribedFirms?: () => void;
}

export function PlansManagementHeader({
  onCreatePlan,
  onViewSubscribedFirms,
}: PlansManagementHeaderProps) {
  return (
    <div
      className="bg-white rounded-[8px] p-[24px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] flex flex-col md:flex-row md:items-center justify-between gap-[16px] w-full font-['Cairo',sans-serif]"
      data-node-id="1:2463"
      dir="rtl"
    >
      {/* Right / Start (in RTL): Title & Description */}
      <div className="flex flex-col text-right">
        <h1 className="text-[26px] leading-[36px] font-bold text-[#1b1c1a]">
          الباقات والأسعار
        </h1>
        <p className="text-[#514537] text-[13px] leading-[20px] font-normal mt-[4px]">
          إدارة الباقات والأسعار ومميزات الاشتراك وحدود الاستخدام لكل مكتب محاماة مسجل بالمنصة.
        </p>
      </div>

      {/* Left / End (in RTL): CTA Action Buttons */}
      <div className="flex items-center gap-[10px] self-start md:self-auto shrink-0">
        {/* زر عرض المكاتب المشتركة */}
        <button
          type="button"
          onClick={onViewSubscribedFirms}
          className="bg-white hover:bg-[#f5f3ef] border border-[#eae8e4] text-[#1b1c1a] px-[16px] py-[9px] rounded-[4px] text-[13px] font-semibold flex items-center gap-[8px] shadow-2xs transition-colors cursor-pointer"
        >
          <Building2 className="size-[15px] text-[#514537]" />
          <span>عرض المكاتب المشتركة</span>
        </button>

        {/* زر إنشاء باقة جديدة */}
        <button
          type="button"
          onClick={onCreatePlan}
          className="bg-[#9c6402] hover:bg-[#855402] text-white px-[18px] py-[9px] rounded-[4px] text-[13px] font-semibold flex items-center gap-[8px] shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="size-[16px] stroke-[2.5]" />
          <span>إنشاء باقة جديدة</span>
        </button>
      </div>
    </div>
  );
}
