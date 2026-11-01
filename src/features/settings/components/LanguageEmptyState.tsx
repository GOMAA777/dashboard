"use client";

import React from "react";
import { Plus, Info, Globe, Languages } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface LanguageEmptyStateProps {
  onAddLanguage: () => void;
}

export function LanguageEmptyState({ onAddLanguage }: LanguageEmptyStateProps) {
  const { isEn } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-[48px] px-[20px] text-center">
      {/* Icon Graphic Container (Figma 1:18417) */}
      <div className="relative size-[96px] rounded-[20px] bg-[#fbf6ee] dark:bg-[#281c15] border border-[#f0e6d6] dark:border-[#38271c] flex items-center justify-center mb-[24px] shadow-sm">
        <Globe className="size-[42px] text-[#9c6402] dark:text-[#e29d38] stroke-[1.75]" />
        {/* Translation Symbol Small Badge */}
        <div className="absolute -bottom-1 -end-1 size-[30px] rounded-full bg-white dark:bg-[#221812] border border-[#eae8e4] dark:border-[#38271c] shadow-sm flex items-center justify-center text-[#9c6402] dark:text-[#e29d38]">
          <Languages className="size-[15px]" />
        </div>
      </div>

      {/* Heading */}
      <h3 className="text-[20px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-[8px]">
        {isEn ? "No languages added yet" : "لا توجد لغات مضافة حتى الآن"}
      </h3>

      {/* Description */}
      <p className="text-[14px] leading-[22px] text-[#514537] dark:text-[#cdc5bd] max-w-[560px] mb-[24px]">
        {isEn
          ? "Configure certified language packs to enable live translation for legal documents, staff and client portals."
          : "قم بتهيئة الحزم اللغوية المعتمدة لتمكين الترجمة المباشرة للوثائق وواجهات المستخدمين والموكلين."}
      </p>

      {/* Add Button */}
      <button
        type="button"
        onClick={onAddLanguage}
        className="bg-[#9c6402] hover:bg-[#835401] active:bg-[#6c4501] text-white px-[28px] py-[10px] rounded-[4px] font-semibold text-[14px] flex items-center gap-[8px] transition-all shadow-sm cursor-pointer mb-[40px]"
      >
        <Plus className="size-[18px]" />
        <span>{isEn ? "Add New Language" : "إضافة لغة جديدة"}</span>
      </button>

      {/* Regulatory Info Box */}
      <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-[#eae8e4] dark:border-[#38271c] rounded-[8px] p-[16px] max-w-[760px] w-full flex items-start gap-[12px] text-start">
        <div className="size-[24px] rounded-full bg-white dark:bg-[#221812] flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0 mt-[2px] shadow-xs">
          <Info className="size-[14px]" />
        </div>
        <div className="flex flex-col gap-[2px]">
          <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
            {isEn ? "System Base Language Directive" : "توجيه تنظيمي للغة الأساسية"}
          </span>
          <span className="text-[11px] leading-[18px] font-normal text-[#514537] dark:text-[#cdc5bd]">
            {isEn
              ? "The baseline standard for judiciary compliance is Arabic (ar). When adding a new language, specify standard ISO 639-1 code and script direction (RTL or LTR)."
              : "لغة القياس والأساس الافتراضية للنظام هي العربية (ar). عند إضافة لغة جديدة سيُطلب منك تحديد كود ISO 639-1 واتجاه النص (RTL أو LTR)."}
          </span>
        </div>
      </div>
    </div>
  );
}
