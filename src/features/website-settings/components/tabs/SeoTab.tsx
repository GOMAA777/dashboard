"use client";

import React, { useState } from "react";
import { ChevronDown, ImageIcon, Save } from "lucide-react";
import { toast } from "sonner";
import { initialSeo } from "../../data/initialWebsiteSettings";
import { SeoData } from "../../types/website-settings.types";

export function SeoTab() {
  const [data, setData] = useState<SeoData>(initialSeo);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof SeoData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setData(initialSeo);
    toast.info("تمت استعادة الإعدادات الأصلية");
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("تم تحديث إعدادات محركات البحث (SEO & Open Graph) بنجاح");
    }, 600);
  };

  return (
    <div className="bg-white rounded-[12px] p-[24px] border border-[rgba(231,229,228,0.8)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] flex flex-col gap-[24px]">
      {/* 1. Language */}
      <div>
        <label className="block text-[12px] font-semibold text-[#57534e] mb-[6px] text-right">
          Language (لغة الإعدادات المستهدفة)
        </label>
        <div className="relative">
          <select
            value={data.language}
            onChange={(e) => handleChange("language", e.target.value)}
            className="w-full bg-[#fafaf9]/60 border border-[#e7e5e4] text-[#1c1917] text-[13px] rounded-[8px] ps-[14px] pe-[36px] py-[9px] appearance-none cursor-pointer focus:outline-none focus:border-[#9c6402] focus:bg-white text-right"
          >
            <option value="English">English</option>
            <option value="العربية">العربية (Arabic)</option>
          </select>
          <ChevronDown className="absolute top-1/2 -translate-y-1/2 end-[12px] size-[15px] text-[#78716c] pointer-events-none" />
        </div>
      </div>

      {/* 2. Author Name */}
      <div>
        <label className="block text-[12px] font-semibold text-[#57534e] mb-[6px] text-right">
          Author name (اسم الكاتب / المؤسسة)
        </label>
        <input
          type="text"
          value={data.authorName}
          onChange={(e) => handleChange("authorName", e.target.value)}
          className="w-full bg-[#fafaf9]/60 border border-[#e7e5e4] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] focus:outline-none focus:border-[#9c6402] focus:bg-white text-right"
        />
      </div>

      {/* 3. Meta Title */}
      <div>
        <div className="flex items-center justify-between mb-[6px]">
          <span className="text-[11px] text-[#a8a29e]">الموصى به: 50-60 حرف</span>
          <label className="text-[12px] font-semibold text-[#57534e]">
            Meta title (عنوان الصفحة في محركات البحث)
          </label>
        </div>
        <input
          type="text"
          value={data.metaTitle}
          onChange={(e) => handleChange("metaTitle", e.target.value)}
          className="w-full bg-[#fafaf9]/60 border border-[#e7e5e4] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] focus:outline-none focus:border-[#9c6402] focus:bg-white text-right"
        />
      </div>

      {/* 4. Meta Keywords */}
      <div>
        <label className="block text-[12px] font-semibold text-[#57534e] mb-[6px] text-right">
          Meta keywords (الكلمات المفتاحية مفصولة بفواصل)
        </label>
        <input
          type="text"
          value={data.metaKeywords}
          onChange={(e) => handleChange("metaKeywords", e.target.value)}
          className="w-full bg-[#fafaf9]/60 border border-[#e7e5e4] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] focus:outline-none focus:border-[#9c6402] focus:bg-white text-right"
        />
      </div>

      {/* 5. Meta Image */}
      <div>
        <label className="block text-[12px] font-semibold text-[#57534e] mb-[6px] text-right">
          Image (1200x630) (صورة الميتا الأساسية)
        </label>
        <div className="flex items-center border border-[#e7e5e4] rounded-[8px] overflow-hidden bg-[#fafaf9]/60 mb-[8px]">
          <label className="px-[16px] py-[10px] bg-[#f5f5f4] text-[#44403c] text-[12px] font-semibold border-e border-[#e7e5e4] cursor-pointer hover:bg-[#e7e5e4] transition-colors shrink-0">
            Choose file
            <input type="file" className="hidden" />
          </label>
          <span className="px-[14px] text-[13px] text-[#1c1917] font-mono">
            {data.metaImageName}
          </span>
        </div>

        {/* Thumbnail Preview */}
        <div className="w-[140px] h-[75px] border-2 border-dashed border-[#e7e5e4] rounded-[8px] bg-[#fafaf9] flex flex-col items-center justify-center text-[#a8a29e] gap-[3px]">
          <ImageIcon className="size-[20px]" />
          <span className="text-[10px] font-mono">1200 x 630</span>
        </div>
      </div>

      {/* 6. Meta Description */}
      <div>
        <label className="block text-[12px] font-semibold text-[#57534e] mb-[6px] text-right">
          Meta description (الوصف المختصر لمحركات البحث)
        </label>
        <textarea
          rows={3}
          value={data.metaDescription}
          onChange={(e) => handleChange("metaDescription", e.target.value)}
          className="w-full bg-[#fafaf9]/60 border border-[#e7e5e4] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] focus:outline-none focus:border-[#9c6402] focus:bg-white text-right resize-none leading-[22px]"
        />
        <div className="flex items-center justify-between text-[11px] text-[#a8a29e] mt-[4px]">
          <span>الموصى به: 150-160 حرف لأفضل ظهور في نتائج Google.</span>
          <span className="font-mono">{data.metaDescription.length} / 160 حرف</span>
        </div>
      </div>

      {/* 7. Open Graph Section */}
      <div className="flex flex-col gap-[16px] pt-[16px] border-t border-[#f5f5f4]">
        <div>
          <h3 className="text-[14px] font-bold text-[#1c1917]">Open Graph</h3>
          <p className="text-[12px] text-[#78716c]">
            بيانات بطاقة المشاركة عبر منصات التواصل: (WhatsApp, X, LinkedIn, Facebook)
          </p>
        </div>

        {/* OG Title */}
        <div>
          <label className="block text-[12px] font-semibold text-[#57534e] mb-[6px] text-right">
            Title (عنوان المشاركة المجتمعية - og:title)
          </label>
          <input
            type="text"
            value={data.ogTitle}
            onChange={(e) => handleChange("ogTitle", e.target.value)}
            className="w-full bg-[#fafaf9]/60 border border-[#e7e5e4] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] focus:outline-none focus:border-[#9c6402] focus:bg-white text-right"
          />
        </div>

        {/* OG Description */}
        <div>
          <label className="block text-[12px] font-semibold text-[#57534e] mb-[6px] text-right">
            Description (وصف المشاركة الاجتماعية - og:description)
          </label>
          <textarea
            rows={2}
            value={data.ogDescription}
            onChange={(e) => handleChange("ogDescription", e.target.value)}
            className="w-full bg-[#fafaf9]/60 border border-[#e7e5e4] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] focus:outline-none focus:border-[#9c6402] focus:bg-white text-right resize-none"
          />
        </div>

        {/* OG Image */}
        <div>
          <label className="block text-[12px] font-semibold text-[#57534e] mb-[6px] text-right">
            Image (1200x630) (صورة بطاقة المشاركة - og:image)
          </label>
          <div className="flex items-center border border-[#e7e5e4] rounded-[8px] overflow-hidden bg-[#fafaf9]/60 mb-[8px]">
            <label className="px-[16px] py-[10px] bg-[#f5f5f4] text-[#44403c] text-[12px] font-semibold border-e border-[#e7e5e4] cursor-pointer hover:bg-[#e7e5e4] transition-colors shrink-0">
              Choose file
              <input type="file" className="hidden" />
            </label>
            <span className="px-[14px] text-[13px] text-[#a8a29e]">
              0 File Selected
            </span>
          </div>

          {/* Thumbnail Preview */}
          <div className="w-[140px] h-[75px] border-2 border-dashed border-[#e7e5e4] rounded-[8px] bg-[#fafaf9] flex flex-col items-center justify-center text-[#a8a29e] gap-[3px]">
            <ImageIcon className="size-[20px]" />
            <span className="text-[10px] font-mono">1200 x 630</span>
          </div>
        </div>
      </div>

      {/* 8. Bottom Action Bar */}
      <div className="border-t border-[#f5f5f4] pt-[20px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[14px]">
        <div className="flex items-center gap-[10px]">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#9c6402] hover:bg-[#835401] active:bg-[#6c4501] text-white px-[28px] py-[10px] rounded-[8px] text-[13px] font-semibold flex items-center gap-[8px] shadow-xs transition-all cursor-pointer disabled:opacity-75"
          >
            <Save className="size-[15px]" />
            <span>{isSaving ? "جارٍ الحفظ..." : "تحديث الإعدادات (Update SEO Settings)"}</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-[#f5f5f4] hover:bg-[#e7e5e4] text-[#44403c] px-[20px] py-[10px] rounded-[8px] text-[13px] font-semibold transition-all cursor-pointer"
          >
            إلغاء
          </button>
        </div>

        <span className="text-[12px] text-[#78716c]">
          يتم حفظ وتطبيق وسوم الميتا تلقائياً على خوادم المنصة والواجهة الأمامية للموقع العام.
        </span>
      </div>
    </div>
  );
}
