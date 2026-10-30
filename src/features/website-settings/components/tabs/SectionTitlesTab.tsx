"use client";

import React, { useState } from "react";
import {
  RotateCcw,
  Check,
  Monitor,
  Smartphone,
  Sparkles,
  ShieldCheck,
  Scale,
  Briefcase,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { initialSectionTitles } from "../../data/initialWebsiteSettings";
import { SectionTitlesData } from "../../types/website-settings.types";
import { cn } from "@/lib/utils";

export function SectionTitlesTab() {
  const [data, setData] = useState<SectionTitlesData>(initialSectionTitles);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof SectionTitlesData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setData(initialSectionTitles);
    toast.info("تمت استعادة العناوين الافتراضية");
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("تم حفظ وتحديث عناوين ووصف الأقسام بنجاح");
    }, 600);
  };

  return (
    <div className="flex flex-col gap-[24px]">
      {/* Form Settings Card */}
      <div className="bg-white dark:bg-[#221812] rounded-[12px] p-[24px] border border-[rgba(231,229,228,0.8)] dark:border-[#38271c] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] flex flex-col gap-[28px]">
        {/* Section 1: قسم الشركاء ورواية النجاح */}
        <div className="flex flex-col gap-[16px]">
          <div className="flex items-center gap-[8px] text-[#78350f] dark:text-[#e29d38] border-b border-[#f5f5f4] dark:border-[#38271c] pb-[10px]">
            <Briefcase className="size-[18px] text-[#9c6402] dark:text-[#e29d38]" />
            <h3 className="text-[15px] font-bold text-[#1c1917] dark:text-[#fdfbf7]">قسم الشركاء ورواية النجاح</h3>
          </div>
          <div className="flex flex-col gap-[12px]">
            <div>
              <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
                عنوان قسم الشركاء (Partner Section Title)
              </label>
              <input
                type="text"
                value={data.partnerSectionTitle}
                onChange={(e) => handleChange("partnerSectionTitle", e.target.value)}
                className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
              <div>
                <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
                  عنوان قسم قصتنا (Story Section Title)
                </label>
                <input
                  type="text"
                  value={data.storySectionTitle}
                  onChange={(e) => handleChange("storySectionTitle", e.target.value)}
                  className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
                  الوصف الفرعي لقسم قصتنا (Story Section Subtitle)
                </label>
                <input
                  type="text"
                  value={data.storySectionSubtitle}
                  onChange={(e) => handleChange("storySectionSubtitle", e.target.value)}
                  className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: المزايا الفريدة والخصائص التقنية */}
        <div className="flex flex-col gap-[16px]">
          <div className="flex items-center gap-[8px] text-[#78350f] dark:text-[#e29d38] border-b border-[#f5f5f4] dark:border-[#38271c] pb-[10px]">
            <Sparkles className="size-[18px] text-[#9c6402] dark:text-[#e29d38]" />
            <h3 className="text-[15px] font-bold text-[#1c1917] dark:text-[#fdfbf7]">المزايا الفريدة والخصائص التقنية</h3>
          </div>
          <div className="flex flex-col gap-[12px]">
            <div>
              <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
                عنوان قسم المزايا الفريدة (Unique Feature Section Title)
              </label>
              <input
                type="text"
                value={data.uniqueFeatureSectionTitle}
                onChange={(e) => handleChange("uniqueFeatureSectionTitle", e.target.value)}
                className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
              <div>
                <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
                  عنوان قسم المميزات (Feature Section Title)
                </label>
                <input
                  type="text"
                  value={data.featureSectionTitle}
                  onChange={(e) => handleChange("featureSectionTitle", e.target.value)}
                  className="w-full bg-[#fafaf9]/60 border border-[#e7e5e4] dark:bg-[#1a120d] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
                  الوصف الفرعي لقسم المميزات (Feature Section Subtitle)
                </label>
                <input
                  type="text"
                  value={data.featureSectionSubtitle}
                  onChange={(e) => handleChange("featureSectionSubtitle", e.target.value)}
                  className="w-full bg-[#fafaf9]/60 border border-[#e7e5e4] dark:bg-[#1a120d] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: آراء العملاء وباقات الاشتراك */}
        <div className="flex flex-col gap-[16px]">
          <div className="flex items-center gap-[8px] text-[#78350f] dark:text-[#e29d38] border-b border-[#f5f5f4] dark:border-[#38271c] pb-[10px]">
            <Users className="size-[18px] text-[#9c6402] dark:text-[#e29d38]" />
            <h3 className="text-[15px] font-bold text-[#1c1917] dark:text-[#fdfbf7]">آراء العملاء وباقات الاشتراك</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
            <div>
              <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
                عنوان قسم آراء العملاء (Testimonial Section Title)
              </label>
              <input
                type="text"
                value={data.testimonialSectionTitle}
                onChange={(e) => handleChange("testimonialSectionTitle", e.target.value)}
                className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
                الوصف الفرعي لقسم آراء العملاء (Testimonial Section Subtitle)
              </label>
              <input
                type="text"
                value={data.testimonialSectionSubtitle}
                onChange={(e) => handleChange("testimonialSectionSubtitle", e.target.value)}
                className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
                عنوان قسم خطط الأسعار (Pricing Section Title)
              </label>
              <input
                type="text"
                value={data.pricingSectionTitle}
                onChange={(e) => handleChange("pricingSectionTitle", e.target.value)}
                className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
                الوصف الفرعي لقسم خطط الأسعار (Pricing Section Subtitle)
              </label>
              <input
                type="text"
                value={data.pricingSectionSubtitle}
                onChange={(e) => handleChange("pricingSectionSubtitle", e.target.value)}
                className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start"
              />
            </div>
          </div>
        </div>

        {/* Section 4: المزايا التنافسية والأسئلة الشائعة */}
        <div className="flex flex-col gap-[16px]">
          <div className="flex items-center gap-[8px] text-[#78350f] dark:text-[#e29d38] border-b border-[#f5f5f4] dark:border-[#38271c] pb-[10px]">
            <Scale className="size-[18px] text-[#9c6402] dark:text-[#e29d38]" />
            <h3 className="text-[15px] font-bold text-[#1c1917] dark:text-[#fdfbf7]">المزايا التنافسية والأسئلة الشائعة</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
            <div>
              <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
                عنوان قسم المزايا التنافسية (Advantage Section Title)
              </label>
              <input
                type="text"
                value={data.advantageSectionTitle}
                onChange={(e) => handleChange("advantageSectionTitle", e.target.value)}
                className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
                الوصف الفرعي لقسم المزايا التنافسية (Advantage Section Subtitle)
              </label>
              <input
                type="text"
                value={data.advantageSectionSubtitle}
                onChange={(e) => handleChange("advantageSectionSubtitle", e.target.value)}
                className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start"
              />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-[#57534e] dark:text-[#cdc5bd] mb-[6px] text-start">
              عنوان قسم الأسئلة الشائعة (FAQ Section Title)
            </label>
            <input
              type="text"
              value={data.faqSectionTitle}
              onChange={(e) => handleChange("faqSectionTitle", e.target.value)}
              className="w-full bg-[#fafaf9]/60 dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[8px] px-[14px] py-[9px] text-[13px] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] text-start"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-[#f5f5f4] dark:border-[#38271c] pt-[20px] flex items-center justify-between">
          <div className="flex items-center gap-[10px]">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#9c6402] hover:bg-[#835401] active:bg-[#6c4501] dark:bg-[#e29d38] dark:hover:bg-[#c28328] text-white dark:text-[#1c140f] px-[28px] py-[10px] rounded-[8px] text-[13px] font-bold flex items-center gap-[8px] shadow-xs transition-all cursor-pointer disabled:opacity-75"
            >
              <Check className="size-[16px]" />
              <span>{isSaving ? "جارٍ الحفظ..." : "حفظ وتحديث"}</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-[#f5f5f4] hover:bg-[#e7e5e4] dark:bg-[#281c15] dark:hover:bg-[#38271c] text-[#44403c] dark:text-[#fdfbf7] px-[20px] py-[10px] rounded-[8px] text-[13px] font-semibold flex items-center gap-[6px] transition-all cursor-pointer"
            >
              <RotateCcw className="size-[15px]" />
              <span>الافتراضي</span>
            </button>
          </div>
          <span className="text-[12px] text-[#78716c] dark:text-[#8e8680]">
            سيتم تفعيل هذه العناوين فوراً على الصفحة الرئيسية بعد النقر على التحديث.
          </span>
        </div>
      </div>

      {/* Live Interactive Preview Card */}
      <div className="bg-white dark:bg-[#221812] rounded-[12px] p-[24px] border border-[rgba(231,229,228,0.8)] dark:border-[#38271c] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] flex flex-col gap-[20px]">
        {/* Device Switcher Header */}
        <div className="flex items-center justify-between border-b border-[#f5f5f4] dark:border-[#38271c] pb-[16px]">
          <div className="flex items-center gap-[8px] bg-[#f5f5f4] dark:bg-[#1a120d] border border-transparent dark:border-[#38271c] p-[3px] rounded-[8px]">
            <button
              type="button"
              onClick={() => setPreviewDevice("desktop")}
              className={cn(
                "px-[12px] py-[6px] rounded-[6px] text-[12px] font-semibold flex items-center gap-[6px] transition-all cursor-pointer",
                previewDevice === "desktop"
                  ? "bg-white dark:bg-[#281c15] text-[#9c6402] dark:text-[#e29d38] shadow-xs"
                  : "text-[#78716c] dark:text-[#8e8680] hover:text-[#1c1917] dark:hover:text-[#fdfbf7]"
              )}
            >
              <Monitor className="size-[14px]" />
              <span>سطح المكتب</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice("mobile")}
              className={cn(
                "px-[12px] py-[6px] rounded-[6px] text-[12px] font-semibold flex items-center gap-[6px] transition-all cursor-pointer",
                previewDevice === "mobile"
                  ? "bg-white dark:bg-[#281c15] text-[#9c6402] dark:text-[#e29d38] shadow-xs"
                  : "text-[#78716c] dark:text-[#8e8680] hover:text-[#1c1917] dark:hover:text-[#fdfbf7]"
              )}
            >
              <Smartphone className="size-[14px]" />
              <span>الجوال</span>
            </button>
          </div>
          <span className="text-[14px] font-bold text-[#1c1917] dark:text-[#fdfbf7]">
            معاينة تفاعلية فورية للأقسام
          </span>
        </div>

        {/* Preview Frame */}
        <div
          className={cn(
            "bg-[#fffdf9] dark:bg-[#1a120d] border border-[#ffddb6]/60 dark:border-[#38271c] rounded-[12px] p-[28px] mx-auto transition-all text-center flex flex-col items-center gap-[16px]",
            previewDevice === "desktop" ? "w-full max-w-[760px]" : "w-full max-w-[360px]"
          )}
        >
          <span className="bg-[#fef3c7] dark:bg-amber-950/60 text-[#92400e] dark:text-amber-400 border border-transparent dark:border-amber-800/40 text-[11px] font-bold px-[12px] py-[4px] rounded-full">
            {data.uniqueFeatureSectionTitle}
          </span>
          <h2 className="text-[24px] font-bold text-[#1c1917] dark:text-[#fdfbf7] leading-[36px]">
            {data.featureSectionTitle}
          </h2>
          <p className="text-[13px] text-[#57534e] dark:text-[#cdc5bd] max-w-[540px] leading-[22px]">
            {data.featureSectionSubtitle}
          </p>

          {/* Cards Sample */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[14px] w-full pt-[14px]">
            <div className="bg-white dark:bg-[#221812] border border-[#f3efe6] dark:border-[#38271c] rounded-[8px] p-[16px] text-start flex flex-col gap-[6px]">
              <div className="size-[32px] rounded-[6px] bg-[#fef3c7] dark:bg-amber-950/60 text-[#92400e] dark:text-amber-400 flex items-center justify-center">
                <Sparkles className="size-[16px]" />
              </div>
              <h4 className="text-[13px] font-bold text-[#1c1917] dark:text-[#fdfbf7]">تسويق عبر واتساب</h4>
              <p className="text-[11px] text-[#78716c] dark:text-[#cdc5bd] leading-[18px]">حملات ذكية متصلة مع عملائك بدقة عالية واستجابة فورية.</p>
            </div>
            <div className="bg-white dark:bg-[#221812] border border-[#f3efe6] dark:border-[#38271c] rounded-[8px] p-[16px] text-start flex flex-col gap-[6px]">
              <div className="size-[32px] rounded-[6px] bg-[#fef3c7] dark:bg-amber-950/60 text-[#92400e] dark:text-amber-400 flex items-center justify-center">
                <Scale className="size-[16px]" />
              </div>
              <h4 className="text-[13px] font-bold text-[#1c1917] dark:text-[#fdfbf7]">إدارة ملفات القضايا</h4>
              <p className="text-[11px] text-[#78716c] dark:text-[#cdc5bd] leading-[18px]">متابعة الجلسات والمواعيد القضائية بشكل آلي بالكامل.</p>
            </div>
            <div className="bg-white dark:bg-[#221812] border border-[#f3efe6] dark:border-[#38271c] rounded-[8px] p-[16px] text-start flex flex-col gap-[6px]">
              <div className="size-[32px] rounded-[6px] bg-[#fef3c7] dark:bg-amber-950/60 text-[#92400e] dark:text-amber-400 flex items-center justify-center">
                <ShieldCheck className="size-[16px]" />
              </div>
              <h4 className="text-[13px] font-bold text-[#1c1917] dark:text-[#fdfbf7]">باقات مرنة تنافسية</h4>
              <p className="text-[11px] text-[#78716c] dark:text-[#cdc5bd] leading-[18px]">أسعار واضحة وباقات مدروسة بدون أي رسوم خفية للمكاتب.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
