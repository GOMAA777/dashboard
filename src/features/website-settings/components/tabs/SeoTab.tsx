"use client";

import React, { useState } from "react";
import { ImageIcon, Save } from "lucide-react";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
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
    <div className="bg-white dark:bg-[#221812] rounded-[12px] p-[24px] border border-[rgba(231,229,228,0.8)] dark:border-[#38271c] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] flex flex-col gap-[24px]">
      {/* 1. Language */}
      <div>
        <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
          Language (لغة الإعدادات المستهدفة)
        </label>
        <DashboardSelect
          value={data.language}
          onChange={(e) => handleChange("language", e.target.value)}
        >
          <option value="English" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">English</option>
          <option value="العربية" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">العربية (Arabic)</option>
        </DashboardSelect>
      </div>

      {/* 2. Author Name */}
      <div>
        <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
          Author name (اسم الكاتب / المؤسسة)
        </label>
        <input
          type="text"
          value={data.authorName}
          onChange={(e) => handleChange("authorName", e.target.value)}
          className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start"
        />
      </div>

      {/* 3. Meta Title */}
      <div>
        <div className="flex items-center justify-between mb-[6px]">
          <span className="text-[11px] text-[#a8a29e] dark:text-[#8e8680]">الموصى به: 50-60 حرف</span>
          <label className="text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd]">
            Meta title (عنوان الصفحة في محركات البحث)
          </label>
        </div>
        <input
          type="text"
          value={data.metaTitle}
          onChange={(e) => handleChange("metaTitle", e.target.value)}
          className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start"
        />
      </div>

      {/* 4. Meta Keywords */}
      <div>
        <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
          Meta keywords (الكلمات المفتاحية مفصولة بفواصل)
        </label>
        <input
          type="text"
          value={data.metaKeywords}
          onChange={(e) => handleChange("metaKeywords", e.target.value)}
          className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start"
        />
      </div>

      {/* 5. Meta Image */}
      <div>
        <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
          Image (1200x630) (صورة الميتا الأساسية)
        </label>
        <div className="flex items-center border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] overflow-hidden bg-[#fafaf9]/60 dark:bg-[#1a120d] mb-[8px]">
          <label className="px-[16px] py-[10px] bg-[#f5f5f4] dark:bg-[#281c15] text-[#44403c] dark:text-[#fdfbf7] text-[12px] font-semibold border-e border-[#e7e5e4] dark:border-[#38271c] cursor-pointer hover:bg-[#e7e5e4] dark:hover:bg-[#38271c] transition-colors shrink-0">
            Choose file
            <input type="file" className="hidden" />
          </label>
          <span className="px-[14px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] font-mono">
            {data.metaImageName}
          </span>
        </div>

        {/* Thumbnail Preview */}
        <div className="w-[140px] h-[75px] border-2 border-dashed border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] bg-[#fafaf9] dark:bg-[#1a120d] flex flex-col items-center justify-center text-[#a8a29e] dark:text-[#8e8680] gap-[3px]">
          <ImageIcon className="size-[20px]" />
          <span className="text-[10px] font-mono">1200 x 630</span>
        </div>
      </div>

      {/* 6. Meta Description */}
      <div>
        <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
          Meta description (الوصف المختصر لمحركات البحث)
        </label>
        <textarea
          rows={3}
          value={data.metaDescription}
          onChange={(e) => handleChange("metaDescription", e.target.value)}
          className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start resize-none leading-[22px]"
        />
        <div className="flex items-center justify-between text-[11px] text-[#a8a29e] dark:text-[#8e8680] mt-[4px]">
          <span>الموصى به: 150-160 حرف لأفضل ظهور في نتائج Google.</span>
          <span className="font-mono">{data.metaDescription.length} / 160 حرف</span>
        </div>
      </div>

      {/* 7. Open Graph Section */}
      <div className="flex flex-col gap-[16px] pt-[16px] border-t border-[#f5f5f4] dark:border-[#38271c]">
        <div>
          <h3 className="text-[14px] font-bold text-[#1c1917] dark:text-[#fdfbf7]">Open Graph</h3>
          <p className="text-[12px] text-[#78716c] dark:text-[#cdc5bd]">
            بيانات بطاقة المشاركة عبر منصات التواصل: (WhatsApp, X, LinkedIn, Facebook)
          </p>
        </div>

        {/* OG Title */}
        <div>
          <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
            Title (عنوان المشاركة المجتمعية - og:title)
          </label>
          <input
            type="text"
            value={data.ogTitle}
            onChange={(e) => handleChange("ogTitle", e.target.value)}
            className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start"
          />
        </div>

        {/* OG Description */}
        <div>
          <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
            Description (وصف المشاركة الاجتماعية - og:description)
          </label>
          <textarea
            rows={2}
            value={data.ogDescription}
            onChange={(e) => handleChange("ogDescription", e.target.value)}
            className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start resize-none"
          />
        </div>

        {/* OG Image */}
        <div>
          <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
            Image (1200x630) (صورة بطاقة المشاركة - og:image)
          </label>
          <div className="flex items-center border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] overflow-hidden bg-[#fafaf9]/60 dark:bg-[#1a120d] mb-[8px]">
            <label className="px-[16px] py-[10px] bg-[#f5f5f4] dark:bg-[#281c15] text-[#44403c] dark:text-[#fdfbf7] text-[12px] font-semibold border-e border-[#e7e5e4] dark:border-[#38271c] cursor-pointer hover:bg-[#e7e5e4] dark:hover:bg-[#38271c] transition-colors shrink-0">
              Choose file
              <input type="file" className="hidden" />
            </label>
            <span className="px-[14px] text-[13px] text-[#a8a29e] dark:text-[#8e8680]">
              0 File Selected
            </span>
          </div>

          {/* Thumbnail Preview */}
          <div className="w-[140px] h-[75px] border-2 border-dashed border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] bg-[#fafaf9] dark:bg-[#1a120d] flex flex-col items-center justify-center text-[#a8a29e] dark:text-[#8e8680] gap-[3px]">
            <ImageIcon className="size-[20px]" />
            <span className="text-[10px] font-mono">1200 x 630</span>
          </div>
        </div>
      </div>

      {/* 8. Bottom Action Bar */}
      <div className="border-t border-[#f5f5f4] dark:border-[#38271c] pt-[20px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[14px]">
        <div className="flex items-center gap-[10px]">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#9c6402] hover:bg-[#835401] active:bg-[#6c4501] dark:bg-[#e29d38] dark:hover:bg-[#c28328] text-white dark:text-[#1c140f] px-[28px] py-[10px] rounded-[8px] text-[13px] font-bold flex items-center gap-[8px] shadow-xs transition-all cursor-pointer disabled:opacity-75"
          >
            <Save className="size-[15px]" />
            <span>{isSaving ? "جارٍ الحفظ..." : "تحديث الإعدادات (Update SEO Settings)"}</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-[#f5f5f4] hover:bg-[#e7e5e4] dark:bg-[#281c15] dark:hover:bg-[#38271c] text-[#44403c] dark:text-[#fdfbf7] px-[20px] py-[10px] rounded-[8px] text-[13px] font-semibold transition-all cursor-pointer"
          >
            إلغاء
          </button>
        </div>

        <span className="text-[12px] text-[#78716c] dark:text-[#8e8680]">
          يتم حفظ وتطبيق وسوم الميتا تلقائياً على خوادم المنصة والواجهة الأمامية للموقع العام.
        </span>
      </div>
    </div>
  );
}
