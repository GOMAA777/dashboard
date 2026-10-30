"use client";

import React, { useState } from "react";
import { QrCode, RefreshCw, CheckCircle2, Link } from "lucide-react";
import { toast } from "sonner";
import { initialAIChat } from "../../data/initialWebsiteSettings";
import { AIChatData } from "../../types/website-settings.types";
import { cn } from "@/lib/utils";

export function AIChatTab() {
  const [data, setData] = useState<AIChatData>(initialAIChat);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof AIChatData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("تم تحديث إعدادات المحادثة الذكية بنجاح");
    }, 600);
  };

  return (
    <div className="bg-white rounded-[12px] p-[24px] border border-[rgba(231,229,228,0.8)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] flex flex-col gap-[24px]">
      {/* 1. Title */}
      <div>
        <label className="block text-[12px] font-semibold text-[#57534e] mb-[6px] text-right">
          Title (العنوان الرئيسي)
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full bg-[#fafaf9]/60 border border-[#e7e5e4] rounded-[8px] px-[14px] py-[9px] text-[14px] text-[#1c1917] font-medium focus:outline-none focus:border-[#9c6402] focus:bg-white text-right font-sans"
        />
      </div>

      {/* 2. Description */}
      <div>
        <label className="block text-[12px] font-semibold text-[#57534e] mb-[6px] text-right">
          Description (الوصف الإرشادي للزائر)
        </label>
        <textarea
          rows={3}
          value={data.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full bg-[#fafaf9]/60 border border-[#e7e5e4] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] focus:outline-none focus:border-[#9c6402] focus:bg-white text-right resize-none font-sans"
        />
        <p className="text-[12px] text-[#a8a29e] mt-[4px] text-right">
          يظهر هذا النص أعلى رمز الاستجابة السريعة (QR) لإرشاد الموكلين حول كيفية بدء المحادثة التفاعلية الفورية.
        </p>
      </div>

      {/* 3. Action Button Label & URL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
        <div>
          <label className="block text-[12px] font-semibold text-[#57534e] mb-[6px] text-right">
            Action button label (نص زر الإجراء)
          </label>
          <input
            type="text"
            value={data.actionButtonLabel}
            onChange={(e) => handleChange("actionButtonLabel", e.target.value)}
            className="w-full bg-[#fafaf9]/60 border border-[#e7e5e4] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] focus:outline-none focus:border-[#9c6402] focus:bg-white text-right font-sans"
          />
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-[#57534e] mb-[6px] text-right">
            Action button URL (رابط الزر)
          </label>
          <div className="relative">
            <input
              type="text"
              value={data.actionButtonUrl}
              onChange={(e) => handleChange("actionButtonUrl", e.target.value)}
              className="w-full bg-[#fafaf9]/60 border border-[#e7e5e4] rounded-[8px] ps-[14px] pe-[36px] py-[9px] text-[13px] text-[#1c1917] focus:outline-none focus:border-[#9c6402] focus:bg-white text-left font-mono"
            />
            <Link className="absolute top-1/2 -translate-y-1/2 end-[12px] size-[15px] text-[#a8a29e]" />
          </div>
        </div>
      </div>

      {/* 4. QR Image & Specifications */}
      <div className="flex flex-col gap-[12px] pt-[8px] border-t border-[#f5f5f4]">
        <label className="block text-[12px] font-semibold text-[#57534e] text-right">
          QR Image (صورة رمز الاستجابة السريعة QR Code)
        </label>
        <div className="flex items-center border border-[#e7e5e4] rounded-[8px] overflow-hidden bg-[#fafaf9]/60">
          <label className="px-[16px] py-[10px] bg-[#f5f5f4] text-[#44403c] text-[12px] font-semibold border-e border-[#e7e5e4] cursor-pointer hover:bg-[#e7e5e4] transition-colors shrink-0">
            Choose file
            <input type="file" className="hidden" />
          </label>
          <span className="px-[14px] text-[13px] text-[#a8a29e]">
            اختر ملفاً من جهازك (Choose File)
          </span>
        </div>

        {/* Specs and Preview Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] items-center mt-[4px]">
          {/* Specifications */}
          <div className="bg-[#fafaf9] border border-[#f5f5f4] rounded-[8px] p-[16px] text-right">
            <h4 className="text-[12px] font-bold text-[#44403c] mb-[8px]">
              المواصفات الموصى بها لرمز الاستجابة السريعة:
            </h4>
            <ul className="text-[11px] text-[#78716c] space-y-[4px] list-disc list-inside">
              <li>الأبعاد المثالية: 500 × 500 بكسل بنسبة أبعاد 1:1 مربعة.</li>
              <li>الصيغ المدعومة: PNG, JPG, WebP أو SVG لخلفية شفافة عالية الوضوح.</li>
              <li>يُفضل أن يوجه الرمز مباشرة إلى رابط الدردشة الآلية الفورية لخدمة العملاء.</li>
            </ul>
          </div>

          {/* QR Preview Box */}
          <div className="flex justify-center md:justify-end">
            <div className="size-[100px] border-2 border-dashed border-[#e7e5e4] rounded-[8px] bg-white flex flex-col items-center justify-center text-[#a8a29e] gap-[4px]">
              <QrCode className="size-[36px] text-[#78716c]" />
              <span className="text-[10px] font-medium">معاينة QR</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Actions */}
      <div className="border-t border-[#f5f5f4] pt-[20px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[14px]">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#9c6402] hover:bg-[#835401] active:bg-[#6c4501] text-white px-[28px] py-[10px] rounded-[8px] text-[13px] font-semibold flex items-center gap-[8px] shadow-xs transition-all cursor-pointer disabled:opacity-75"
        >
          <RefreshCw className={cn("size-[16px]", isSaving && "animate-spin")} />
          <span>{isSaving ? "جارٍ التحديث..." : "تحديث (Update الإعدادات)"}</span>
        </button>

        <div className="flex items-center gap-[6px] text-[#059669] text-[12px]">
          <CheckCircle2 className="size-[15px]" />
          <span>يتم حفظ وتطبيق التعديلات تلقائياً في قاعدة البيانات وعكسها على البوابة.</span>
        </div>
      </div>
    </div>
  );
}
