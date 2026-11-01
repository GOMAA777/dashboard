"use client";

import React, { useState } from "react";
import { QrCode, RefreshCw, CheckCircle2, Link } from "lucide-react";
import { toast } from "sonner";
import { initialAIChat } from "../../data/initialWebsiteSettings";
import { AIChatData } from "../../types/website-settings.types";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

export function AIChatTab() {
  const { isEn } = useLanguage();
  const [data, setData] = useState<AIChatData>(initialAIChat);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof AIChatData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success(isEn ? "AI chat settings updated successfully" : "تم تحديث إعدادات المحادثة الذكية بنجاح");
    }, 600);
  };

  return (
    <div className="bg-white dark:bg-[#221812] rounded-[12px] p-[24px] border border-[rgba(231,229,228,0.8)] dark:border-[#38271c] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] flex flex-col gap-[24px]">
      {/* 1. Title */}
      <div>
        <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
          {isEn ? "Title (Main Headline)" : "Title (العنوان الرئيسي)"}
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[14px] text-[#1c1917] dark:text-[#fdfbf7] font-medium focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start font-sans"
        />
      </div>

      {/* 2. Description */}
      <div>
        <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
          {isEn ? "Description (Visitor Guidance)" : "Description (الوصف الإرشادي للزائر)"}
        </label>
        <textarea
          rows={3}
          value={data.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start resize-none font-sans"
        />
        <p className="text-[12px] text-[#a8a29e] dark:text-[#8e8680] mt-[4px] text-start">
          {isEn
            ? "This text appears above the QR code to guide clients on starting immediate interactive chats."
            : "يظهر هذا النص أعلى رمز الاستجابة السريعة (QR) لإرشاد الموكلين حول كيفية بدء المحادثة التفاعلية الفورية."}
        </p>
      </div>

      {/* 3. Action Button Label & URL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
        <div>
          <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
            {isEn ? "Action button label" : "Action button label (نص زر الإجراء)"}
          </label>
          <input
            type="text"
            value={data.actionButtonLabel}
            onChange={(e) => handleChange("actionButtonLabel", e.target.value)}
            className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start font-sans"
          />
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
            {isEn ? "Action button URL" : "Action button URL (رابط الزر)"}
          </label>
          <div className="relative">
            <input
              type="text"
              value={data.actionButtonUrl}
              onChange={(e) => handleChange("actionButtonUrl", e.target.value)}
              className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] ps-[14px] pe-[36px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-left font-mono"
            />
            <Link className="absolute top-1/2 -translate-y-1/2 end-[12px] size-[15px] text-[#a8a29e] dark:text-[#8e8680]" />
          </div>
        </div>
      </div>

      {/* 4. QR Image & Specifications */}
      <div className="flex flex-col gap-[12px] pt-[8px] border-t border-[#f5f5f4] dark:border-[#38271c]">
        <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] text-start">
          {isEn ? "QR Image (QR Code graphic)" : "QR Image (صورة رمز الاستجابة السريعة QR Code)"}
        </label>
        <div className="flex items-center border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] overflow-hidden bg-[#fafaf9]/60 dark:bg-[#1a120d]">
          <label className="px-[16px] py-[10px] bg-[#f5f5f4] dark:bg-[#281c15] text-[#44403c] dark:text-[#fdfbf7] text-[12px] font-semibold border-e border-[#e7e5e4] dark:border-[#38271c] cursor-pointer hover:bg-[#e7e5e4] dark:hover:bg-[#38271c] transition-colors shrink-0">
            {isEn ? "Choose file" : "Choose file"}
            <input type="file" className="hidden" />
          </label>
          <span className="px-[14px] text-[13px] text-[#a8a29e] dark:text-[#8e8680]">
            {isEn ? "Choose a file from your device" : "اختر ملفاً من جهازك (Choose File)"}
          </span>
        </div>

        {/* Specs and Preview Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] items-center mt-[4px]">
          {/* Specifications */}
          <div className="bg-[#fafaf9] dark:bg-[#1a120d] border border-[#f5f5f4] dark:border-[#38271c] rounded-[8px] p-[16px] text-start">
            <h4 className="text-[12px] font-bold text-[#44403c] dark:text-[#fdfbf7] mb-[8px]">
              {isEn ? "Recommended QR code specifications:" : "المواصفات الموصى بها لرمز الاستجابة السريعة:"}
            </h4>
            <ul className="text-[11px] text-[#78716c] dark:text-[#cdc5bd] space-y-[4px] list-disc list-inside">
              <li>{isEn ? "Ideal dimensions: 500 × 500 px with 1:1 square aspect ratio." : "الأبعاد المثالية: 500 × 500 بكسل بنسبة أبعاد 1:1 مربعة."}</li>
              <li>{isEn ? "Supported formats: PNG, JPG, WebP, or SVG." : "الصيغ المدعومة: PNG, JPG, WebP أو SVG لخلفية شفافة عالية الوضوح."}</li>
              <li>{isEn ? "Preferably links directly to client live support chat." : "يُفضل أن يوجه الرمز مباشرة إلى رابط الدردشة الآلية الفورية لخدمة العملاء."}</li>
            </ul>
          </div>

          {/* QR Preview Box */}
          <div className="flex justify-center md:justify-end">
            <div className="size-[100px] border-2 border-dashed border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] bg-white dark:bg-[#1a120d] flex flex-col items-center justify-center text-[#a8a29e] dark:text-[#8e8680] gap-[4px]">
              <QrCode className="size-[36px] text-[#78716c] dark:text-[#8e8680]" />
              <span className="text-[10px] font-medium">{isEn ? "QR Preview" : "معاينة QR"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Actions */}
      <div className="border-t border-[#f5f5f4] dark:border-[#38271c] pt-[20px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[14px]">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#9c6402] hover:bg-[#835401] active:bg-[#6c4501] dark:bg-[#e29d38] dark:hover:bg-[#c28328] text-white dark:text-[#1c140f] px-[28px] py-[10px] rounded-[8px] text-[13px] font-bold flex items-center gap-[8px] shadow-xs transition-all cursor-pointer disabled:opacity-75"
        >
          <RefreshCw className={cn("size-[16px]", isSaving && "animate-spin")} />
          <span>{isSaving ? (isEn ? "Updating..." : "جارٍ التحديث...") : (isEn ? "Update Settings" : "تحديث (Update الإعدادات)")}</span>
        </button>

        <div className="flex items-center gap-[6px] text-[#059669] dark:text-emerald-400 text-[12px]">
          <CheckCircle2 className="size-[15px]" />
          <span>
            {isEn
              ? "Modifications are automatically saved and applied to the database and portal."
              : "يتم حفظ وتطبيق التعديلات تلقائياً في قاعدة البيانات وعكسها على البوابة."}
          </span>
        </div>
      </div>
    </div>
  );
}
