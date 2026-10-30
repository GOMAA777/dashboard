"use client";

import React, { useState } from "react";
import { MessageCircle, Check } from "lucide-react";
import { toast } from "sonner";
import { initialHeroSection } from "../../data/initialWebsiteSettings";
import { HeroSectionData } from "../../types/website-settings.types";
import { cn } from "@/lib/utils";

export function HeroSectionTab() {
  const [data, setData] = useState<HeroSectionData>(initialHeroSection);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = <K extends keyof HeroSectionData>(
    field: K,
    value: HeroSectionData[K]
  ) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("تم تحديث قسم الهيرو بنجاح");
    }, 600);
  };

  return (
    <div className="bg-white dark:bg-[#221812] rounded-[12px] p-[24px] border border-[rgba(231,229,228,0.8)] dark:border-[#38271c] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] flex flex-col gap-[24px]">
      {/* 1. Title */}
      <div>
        <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
          Title (العنوان الرئيسي)
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[14px] text-[#1c1917] dark:text-[#fdfbf7] font-medium focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start"
        />
      </div>

      {/* 2. Subtitle */}
      <div>
        <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
          Subtitle (العنوان الفرعي)
        </label>
        <input
          type="text"
          value={data.subtitle}
          onChange={(e) => handleChange("subtitle", e.target.value)}
          className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start"
        />
      </div>

      {/* 3. Description */}
      <div>
        <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
          Description (الوصف التفصيلي)
        </label>
        <textarea
          rows={3}
          value={data.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start resize-none"
        />
      </div>

      {/* 4. Action Button Row */}
      <div className="flex flex-col gap-[12px] pt-[8px] border-t border-[#f5f5f4] dark:border-[#38271c]">
        <div className="flex items-center justify-start gap-[12px]">
          <button
            type="button"
            role="switch"
            aria-checked={data.actionButtonEnabled}
            onClick={() => handleChange("actionButtonEnabled", !data.actionButtonEnabled)}
            className={cn(
              "w-[44px] h-[24px] rounded-full p-[2px] transition-colors cursor-pointer flex items-center shrink-0",
              data.actionButtonEnabled ? "bg-[#9c6402] dark:bg-[#e29d38]" : "bg-[#d6d3d1] dark:bg-[#38271c]"
            )}
          >
            <div
              className={cn(
                "size-[20px] rounded-full bg-white dark:bg-[#1a120d] shadow-sm transition-transform duration-200",
                data.actionButtonEnabled ? "-translate-x-[20px]" : "translate-x-0"
              )}
            />
          </button>
          <span className="text-[13px] font-semibold text-[#44403c] dark:text-[#fdfbf7]">
            Action button
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
          <div>
            <label className="block text-[12px] text-[#78716c] dark:text-[#8e8680] mb-[4px] text-start">
              Action button label
            </label>
            <input
              type="text"
              value={data.actionButtonLabel}
              onChange={(e) => handleChange("actionButtonLabel", e.target.value)}
              className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start"
            />
          </div>
          <div>
            <label className="block text-[12px] text-[#78716c] dark:text-[#8e8680] mb-[4px] text-start">
              Action button URL
            </label>
            <input
              type="text"
              value={data.actionButtonUrl}
              onChange={(e) => handleChange("actionButtonUrl", e.target.value)}
              className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-left font-mono"
            />
          </div>
        </div>
      </div>

      {/* 5. Secondary Action Button Row */}
      <div className="flex flex-col gap-[12px] pt-[8px] border-t border-[#f5f5f4] dark:border-[#38271c]">
        <div className="flex items-center justify-start gap-[12px]">
          <button
            type="button"
            role="switch"
            aria-checked={data.secondaryActionButtonEnabled}
            onClick={() =>
              handleChange(
                "secondaryActionButtonEnabled",
                !data.secondaryActionButtonEnabled
              )
            }
            className={cn(
              "w-[44px] h-[24px] rounded-full p-[2px] transition-colors cursor-pointer flex items-center shrink-0",
              data.secondaryActionButtonEnabled ? "bg-[#9c6402] dark:bg-[#e29d38]" : "bg-[#d6d3d1] dark:bg-[#38271c]"
            )}
          >
            <div
              className={cn(
                "size-[20px] rounded-full bg-white dark:bg-[#1a120d] shadow-sm transition-transform duration-200",
                data.secondaryActionButtonEnabled ? "-translate-x-[20px]" : "translate-x-0"
              )}
            />
          </button>
          <span className="text-[13px] font-semibold text-[#44403c] dark:text-[#fdfbf7]">
            Secondary action button
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
          <div>
            <label className="block text-[12px] text-[#78716c] dark:text-[#8e8680] mb-[4px] text-start">
              Secondary action button label
            </label>
            <input
              type="text"
              value={data.secondaryActionButtonLabel}
              onChange={(e) =>
                handleChange("secondaryActionButtonLabel", e.target.value)
              }
              placeholder="نص الزر الثانوي"
              className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start"
            />
          </div>
          <div>
            <label className="block text-[12px] text-[#78716c] dark:text-[#8e8680] mb-[4px] text-start">
              Secondary action button URL
            </label>
            <input
              type="text"
              value={data.secondaryActionButtonUrl}
              onChange={(e) =>
                handleChange("secondaryActionButtonUrl", e.target.value)
              }
              placeholder="https://"
              className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-left font-mono"
            />
          </div>
        </div>
      </div>

      {/* 6. Image Upload & Preview */}
      <div className="flex flex-col gap-[12px] pt-[8px] border-t border-[#f5f5f4] dark:border-[#38271c]">
        <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] text-start">
          Image (صورة الهيرو الحالية والمرفقة)
        </label>
        <div className="flex items-center border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] overflow-hidden bg-[#fafaf9]/60 dark:bg-[#1a120d]">
          <label className="px-[16px] py-[10px] bg-[#f5f5f4] dark:bg-[#281c15] text-[#44403c] dark:text-[#fdfbf7] text-[12px] font-semibold border-e border-[#e7e5e4] dark:border-[#38271c] cursor-pointer hover:bg-[#e7e5e4] dark:hover:bg-[#38271c] transition-colors shrink-0">
            Choose file
            <input type="file" className="hidden" />
          </label>
          <span className="px-[14px] text-[13px] text-[#78716c] dark:text-[#8e8680]">
            0 File Choosen
          </span>
        </div>

        {/* Current Image Preview */}
        <div className="relative size-[100px] rounded-[10px] bg-[#00a884] flex flex-col items-center justify-center text-white overflow-hidden shadow-xs mt-[6px]">
          <MessageCircle className="size-[34px]" />
          <span className="text-[9px] font-bold mt-[4px] tracking-wide">
            CAMPAIGN 3D
          </span>
          <span className="absolute bottom-0 inset-x-0 bg-[#b45309] text-[9px] font-bold text-center py-[2px]">
            Current
          </span>
        </div>
      </div>

      {/* 7. Action Button */}
      <div className="border-t border-[#f5f5f4] dark:border-[#38271c] pt-[20px] flex items-center justify-start">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#9c6402] hover:bg-[#835401] active:bg-[#6c4501] dark:bg-[#e29d38] dark:hover:bg-[#c28328] text-white dark:text-[#1c140f] px-[32px] py-[10px] rounded-[8px] text-[13px] font-bold flex items-center gap-[8px] shadow-xs transition-all cursor-pointer disabled:opacity-75"
        >
          <Check className="size-[16px]" />
          <span>{isSaving ? "جارٍ التحديث..." : "تحديث"}</span>
        </button>
      </div>
    </div>
  );
}
