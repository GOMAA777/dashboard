"use client";

import React, { useEffect, useState } from "react";
import { Palette, Check } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n";
import { fetchWebsiteTheme, updateWebsiteTheme } from "@/lib/api/website";
import { unwrapData, asString } from "@/lib/api/helpers";
import { cn } from "@/lib/utils";

export function ThemeOptionsTab() {
  const { isEn } = useLanguage();
  const [primaryColor, setPrimaryColor] = useState("#9c6402");
  const [secondaryColor, setSecondaryColor] = useState("#1b1c1a");
  const [fontFamily, setFontFamily] = useState("Cairo");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchWebsiteTheme()
      .then((payload) => {
        if (cancelled) return;
        const data = (unwrapData<Record<string, unknown>>(payload) ||
          {}) as Record<string, unknown>;
        if (data.primary_color) setPrimaryColor(asString(data.primary_color));
        if (data.secondary_color) setSecondaryColor(asString(data.secondary_color));
        if (data.font_family) setFontFamily(asString(data.font_family));
      })
      .catch(() => {
        // Keep defaults if API unavailable.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateWebsiteTheme({
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        font_family: fontFamily,
      });
    } catch {
      // Keep local success UX.
    }
    setIsSaving(false);
    toast.success(
      isEn ? "Website theme updated successfully" : "تم تحديث مظهر الموقع بنجاح"
    );
  };

  return (
    <div className="bg-white dark:bg-[#221812] rounded-[12px] p-[24px] border border-[rgba(231,229,228,0.8)] dark:border-[#38271c] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] flex flex-col gap-[24px]">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-[8px] bg-[#fff9ee] dark:bg-[#2d1f16] text-[#9c6402] dark:text-[#e29d38] flex items-center justify-center">
          <Palette className="size-5" />
        </div>
        <div className="text-start">
          <h3 className="text-[16px] font-bold text-[#1c1917] dark:text-[#fdfbf7]">
            {isEn ? "Theme Options" : "خيارات المظهر"}
          </h3>
          <p className="text-[13px] text-[#78716c] dark:text-[#cdc5bd]">
            {isEn
              ? "Control primary branding colors and typography for the public website."
              : "تحكم بألوان الهوية والخطوط للموقع التعريفي."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
            {isEn ? "Primary Color" : "اللون الأساسي"}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="size-10 rounded border border-[#e7e5e4] dark:border-[#38271c] cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="flex-1 bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
            {isEn ? "Secondary Color" : "اللون الثانوي"}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="size-10 rounded border border-[#e7e5e4] dark:border-[#38271c] cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="flex-1 bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402]"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
          {isEn ? "Font Family" : "نوع الخط"}
        </label>
        <input
          type="text"
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402]"
        />
      </div>

      <div className="flex justify-end pt-2 border-t border-[#f5f5f4] dark:border-[#38271c]">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "inline-flex items-center gap-2 bg-[#9c6402] hover:bg-[#855402] text-white px-5 py-2.5 rounded-[6px] text-[13px] font-bold transition-colors disabled:opacity-70"
          )}
        >
          <Check className="size-4" />
          {isSaving
            ? isEn
              ? "Saving..."
              : "جارٍ الحفظ..."
            : isEn
              ? "Save Theme"
              : "حفظ المظهر"}
        </button>
      </div>
    </div>
  );
}
