"use client";

import React from "react";
import { Plus, Info, Globe, Languages } from "lucide-react";

interface LanguageEmptyStateProps {
  onAddLanguage: () => void;
}

export function LanguageEmptyState({ onAddLanguage }: LanguageEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-[48px] px-[20px] text-center" dir="rtl">
      {/* Icon Graphic Container (Figma 1:18417) */}
      <div className="relative size-[96px] rounded-[20px] bg-[#fbf6ee] border border-[#f0e6d6] flex items-center justify-center mb-[24px] shadow-sm">
        <Globe className="size-[42px] text-[#9c6402] stroke-[1.75]" />
        {/* Translation Symbol Small Badge */}
        <div className="absolute -bottom-1 -end-1 size-[30px] rounded-full bg-white border border-[#eae8e4] shadow-sm flex items-center justify-center text-[#9c6402]">
          <Languages className="size-[15px]" />
        </div>
      </div>

      {/* Heading */}
      <h3 className="text-[20px] font-bold text-[#1b1c1a] mb-[8px]">
        لا توجد لغات مضافة حتى الآن
      </h3>

      {/* Description */}
      <p className="text-[14px] leading-[22px] text-[#514537] max-w-[560px] mb-[24px]">
        قم بتهيئة الحزم اللغوية المعتمدة لتمكين الترجمة المباشرة للوثائق وواجهات المستخدمين والموكلين.
      </p>

      {/* Add Button */}
      <button
        type="button"
        onClick={onAddLanguage}
        className="bg-[#9c6402] hover:bg-[#835401] active:bg-[#6c4501] text-white px-[28px] py-[10px] rounded-[4px] font-semibold text-[14px] flex items-center gap-[8px] transition-all shadow-sm cursor-pointer mb-[40px]"
      >
        <Plus className="size-[18px]" />
        <span>إضافة لغة جديدة</span>
      </button>

      {/* Regulatory Info Box */}
      <div className="bg-[#f5f3ef] border border-[#eae8e4] rounded-[8px] p-[16px] max-w-[760px] w-full flex items-start gap-[12px] text-right">
        <div className="size-[24px] rounded-full bg-white flex items-center justify-center text-[#9c6402] shrink-0 mt-[2px] shadow-xs">
          <Info className="size-[14px]" />
        </div>
        <div className="flex flex-col gap-[2px]">
          <span className="text-[12px] font-bold text-[#1b1c1a]">
            توجيه تنظيمي للعملة الأساسية
          </span>
          <span className="text-[11px] leading-[18px] font-normal text-[#514537]">
            عملة القياس والأساس الافتراضية للنظام هي الدولار الأمريكي (USD). عند إضافة عملة جديدة سيُطلب منك تحديد سعر الصرف مقابل عملة الأساس وتحديد كود ISO 4217 المقابل لها.
          </span>
        </div>
      </div>
    </div>
  );
}
