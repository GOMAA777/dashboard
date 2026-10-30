"use client";

import React, { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { LanguageFormData, languageSchema } from "../schemas/language-settings.schema";
import { LanguageItem } from "../types/language-settings.types";
import { DashboardStickyActionBar } from "@/components/shared/DashboardStickyActionBar";
import { cn } from "@/lib/utils";

interface AddLanguageViewProps {
  onBack: () => void;
  onSave: (language: LanguageItem) => void;
}

export function AddLanguageView({ onBack, onSave }: AddLanguageViewProps) {
  const [formData, setFormData] = useState<LanguageFormData>({
    name: "",
    code: "",
    status: "active",
    direction: "ltr",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = languageSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      toast.error("يرجى التأكد من ملء جميع الحقول المطلوبة بشكل صحيح");
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      const codeClean = formData.code.trim().toLowerCase();
      const isArabic = codeClean === "ar" || codeClean === "ur" || codeClean === "fa";

      const newLanguage: LanguageItem = {
        id: `lang-${Date.now()}`,
        orderNumber: "04",
        name: formData.name.trim(),
        nativeName: `(${formData.name.trim()})`,
        code: codeClean,
        direction: isArabic ? "rtl" : "ltr",
        isDefault: false,
        status: formData.status,
        standardBadge: "ISO 639-1",
      };

      onSave(newLanguage);
      setIsSubmitting(false);
      toast.success("تم إضافة الحزمة اللغوية الجديدة بنجاح");
      onBack();
    }, 400);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto scrollbar-thin">
      <main className="flex-1 px-[24px] sm:px-[32px] py-[24px] max-w-[1360px] w-full mx-auto pb-[32px]">
        {/* Top Banner (Figma 1:18586) */}
        <div className="bg-white rounded-[8px] p-[24px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] relative mb-[24px] flex items-center justify-between">
          {/* Title & Subtitle */}
          <div className="flex flex-col gap-[4px] text-start">
            <h1 className="text-[28px] leading-[38px] font-bold text-[#1b1c1a]">
              إضافة لغة جديدة
            </h1>
            <p className="text-[14px] leading-[22px] font-normal text-[#514537]">
              تعريف حزمة لغوية جديدة للنظام، وضبط كود الـ Locale ومعايير التوافق مع نصوص الواجهة.
            </p>
          </div>

          {/* Return / Back Button */}
          <button
            type="button"
            onClick={onBack}
            className="bg-white hover:bg-[#f5f3ef] border border-[#ded5c6] text-[#1b1c1a] rounded-[4px] px-[16px] py-[8px] font-semibold text-[14px] flex items-center gap-[6px] transition-colors shadow-xs cursor-pointer"
          >
            <ArrowLeft className="size-[16px] rtl:rotate-180" />
            <span>العودة</span>
          </button>
        </div>

        {/* Main Form Container Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-[8px] p-[24px] sm:p-[40px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] flex flex-col gap-[28px]">
          {/* Field 1: اسم اللغة */}
          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center justify-between text-start">
              <label className="text-[14px] font-semibold text-[#1b1c1a] flex items-center gap-[2px]">
                <span>اسم اللغة</span>
                <span className="text-[#ba1a1a]">*</span>
              </label>
              <span className="text-[11px] font-medium text-[#837565]">
                الاسم المحلي للغة كما يظهر للمستخدمين
              </span>
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="مثال: العربية، الإنجليزية، الفرنسية"
              className={cn(
                "w-full bg-[#f5f3ef] text-[#1b1c1a] text-[14px] rounded-[4px] px-[16px] py-[10px] border border-transparent focus:border-[#9c6402] focus:bg-white focus:outline-none transition-all",
                errors.name && "border-[#ba1a1a]"
              )}
            />
            {errors.name && (
              <p className="text-[11px] font-medium text-[#ba1a1a] text-start">{errors.name}</p>
            )}
          </div>

          {/* Field 2: كود اللغة (Locale) */}
          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center justify-between text-start">
              <label className="text-[14px] font-semibold text-[#1b1c1a] flex items-center gap-[2px]">
                <span>كود اللغة (Locale)</span>
                <span className="text-[#ba1a1a]">*</span>
              </label>
              <span className="text-[10px] font-bold bg-[#eae8e4] text-[#1b1c1a] px-[8px] py-[2px] rounded-[2px]">
                ISO 639-1
              </span>
            </div>
            <input
              type="text"
              dir="ltr"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="مثال: ar أو en أو fr"
              className={cn(
                "w-full bg-[#f5f3ef] text-[#1b1c1a] text-[14px] rounded-[4px] px-[16px] py-[10px] text-start border border-transparent focus:border-[#9c6402] focus:bg-white focus:outline-none transition-all font-mono",
                errors.code && "border-[#ba1a1a]"
              )}
            />
            {errors.code ? (
              <p className="text-[11px] font-medium text-[#ba1a1a] text-start">{errors.code}</p>
            ) : (
              <p className="text-[10px] font-bold text-[#837565] text-start leading-[14px]">
                يتكون من حرفين صغيرين وفق المعيار الدولي الموحد
              </p>
            )}
          </div>

          {/* Field 3: حالة اللغة في النظام */}
          <div className="bg-[#f5f3ef] rounded-[8px] p-[16px] border border-[#eae8e4] flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
            {/* Text Label on Right */}
            <div className="flex flex-col text-start">
              <span className="text-[14px] font-bold text-[#1b1c1a]">
                حالة اللغة في النظام
              </span>
              <span className="text-[12px] text-[#514537]">
                تحديد ما إذا كانت اللغة متاحة فوراً لاختيار المستخدمين في شريط التنقل وتخصيص الواجهة.
              </span>
            </div>

            {/* Radio Group on Left */}
            <div className="flex items-center gap-[16px]">
              {/* Active Radio */}
              <label className="flex items-center gap-[8px] cursor-pointer select-none">
                <input
                  type="radio"
                  name="status"
                  checked={formData.status === "active"}
                  onChange={() => setFormData({ ...formData, status: "active" })}
                  className="accent-[#9c6402] size-[18px] cursor-pointer"
                />
                <span className="text-[13px] font-semibold text-[#1b1c1a]">
                  نشطة (مفعلة)
                </span>
              </label>

              {/* Inactive Radio */}
              <label className="flex items-center gap-[8px] cursor-pointer select-none">
                <input
                  type="radio"
                  name="status"
                  checked={formData.status === "inactive"}
                  onChange={() => setFormData({ ...formData, status: "inactive" })}
                  className="accent-[#9c6402] size-[18px] cursor-pointer"
                />
                <span className="text-[13px] font-normal text-[#514537]">
                  غير نشطة (محجوبة)
                </span>
              </label>
            </div>
          </div>
        </form>

        {/* Floating Sticky Action Bar */}
        <DashboardStickyActionBar>
          <div className="flex items-center gap-[10px]">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#9c6402] hover:bg-[#835401] active:bg-[#6c4501] text-white px-[32px] py-[10px] rounded-[6px] font-semibold text-[14px] flex items-center gap-[8px] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.05)] cursor-pointer disabled:opacity-70"
            >
              <Check className="size-[18px] stroke-[2.5]" />
              <span>{isSubmitting ? "جارٍ الحفظ..." : "حفظ اللغة"}</span>
            </button>

            <button
              type="button"
              onClick={onBack}
              className="bg-[#f0eeea] dark:bg-[#2c2017] hover:bg-[#e4e1dc] dark:hover:bg-[#382a1f] text-[#1b1c1a] dark:text-[#fdfbf7] border border-transparent dark:border-[#3d2a1d] px-[24px] py-[10px] rounded-[6px] font-semibold text-[14px] transition-colors cursor-pointer"
            >
              إلغاء
            </button>
          </div>

          <span className="text-[12px] text-[#837565] dark:text-[#cdc5bd] hidden sm:inline">
            سيتم تفعيل حزمة اللغة فور الحفظ وتحديث خيارات الواجهة
          </span>
        </DashboardStickyActionBar>
      </main>
    </div>
  );
}
