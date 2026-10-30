"use client";

import React, { useState } from "react";
import { ArrowLeft, Check, Coins, Globe, Tag, ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";
import { CurrencyFormData, currencySchema } from "../schemas/currency-settings.schema";
import { CurrencyItem } from "../types/currency-settings.types";
import { DashboardStickyActionBar } from "@/components/shared/DashboardStickyActionBar";
import { cn } from "@/lib/utils";

interface AddCurrencyViewProps {
  onBack: () => void;
  onSave: (currency: CurrencyItem) => void;
}

export function AddCurrencyView({ onBack, onSave }: AddCurrencyViewProps) {
  const [formData, setFormData] = useState<CurrencyFormData>({
    name: "",
    exchangeRate: "",
    code: "",
    symbol: "",
    status: "active",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = currencySchema.safeParse(formData);

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
      const newCurrency: CurrencyItem = {
        id: `cur-${Date.now()}`,
        orderNumber: "05",
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        symbol: formData.symbol.trim(),
        exchangeRate: `${formData.exchangeRate.trim()} ${formData.code.trim().toUpperCase()} / 1 USD`,
        status: formData.status,
      };

      onSave(newCurrency);
      setIsSubmitting(false);
      toast.success("تم إضافة العملة الجديدة بنجاح");
      onBack();
    }, 400);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto scrollbar-thin bg-[#f5f3ef] dark:bg-[#17120e] text-[#1b1c1a] dark:text-[#fdfbf7] transition-colors duration-200">
      <main className="flex-1 overflow-x-hidden px-4 sm:px-6 lg:px-8 py-6 max-w-[1360px] w-full mx-auto pb-28 sm:pb-32">
        {/* Top Banner (Figma 1:17618) */}
        <div className="bg-white dark:bg-[#221812] rounded-[8px] p-[24px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] relative mb-[24px] flex items-center justify-between">
          {/* Title & Subtitle */}
          <div className="flex flex-col gap-[4px] text-start">
            <h1 className="text-[28px] leading-[38px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              إضافة عملة جديدة
            </h1>
            <p className="text-[14px] leading-[22px] font-normal text-[#514537] dark:text-[#a89f91]">
              تعريف عملة جديدة في المنظومة، وتحديد سعر التحويل مقابل عملة الأساس (USD)، وضبط معايير الدقة الحسابية.
            </p>
          </div>

          {/* Return / Back Button */}
          <button
            type="button"
            onClick={onBack}
            className="bg-white dark:bg-[#221812] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] border border-[#ded5c6] dark:border-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] rounded-[6px] px-[16px] py-[8px] font-semibold text-[14px] flex items-center gap-[6px] transition-colors shadow-xs cursor-pointer"
          >
            <ArrowLeft className="size-[16px] rtl:rotate-180" />
            <span>العودة</span>
          </button>
        </div>

        {/* Main Form Container Card */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#221812] rounded-[8px] p-[24px] sm:p-[40px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col gap-[28px]">
          {/* Card Section Header */}
          <div className="flex items-center justify-between">
            {/* Title & Icon */}
            <div className="flex items-center gap-[14px]">
              <div className="size-[40px] rounded-[8px] bg-[rgba(156,100,2,0.1)] dark:bg-[rgba(226,157,56,0.15)] flex items-center justify-center shrink-0 text-[#9c6402] dark:text-[#f59e0b]">
                <Coins className="size-[20px]" />
              </div>
              <h2 className="text-[18px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[26px]">
                بيانات العملة وسعر الصرف
              </h2>
            </div>

            {/* Audit Log Badge */}
            <div className="flex items-center gap-[6px] text-[#514537] dark:text-[#a89f91] text-[11px] font-medium bg-[#f5f3ef] dark:bg-[#281c15] px-[12px] py-[4px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c]">
              <span className="size-[6px] rounded-full bg-[#9c6402] dark:bg-[#e29d38]" />
              <span>سجل الرقابة المالية #CUR-701</span>
            </div>
          </div>

          {/* Regulatory Note Box */}
          <div className="bg-[#f5f3ef] dark:bg-[#281c15] rounded-[8px] p-[16px] border border-[#eae8e4] dark:border-[#38271c] flex flex-col gap-[4px] text-start">
            <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              ملاحظة تنظيمية حول عملة الأساس
            </span>
            <span className="text-[11px] leading-[18px] text-[#514537] dark:text-[#a89f91]">
              عملة القياس والأساس المعتمدة للمنظومة هي الدولار الأمريكي (USD). يُرجى إدخال سعر الصرف مقابل 1 دولار أمريكي بدقة عشرية تصل إلى 4 خانات لضمان صحة احتساب أتعاب القضايا والفواتير الضريبية.
            </span>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[24px] gap-y-[20px]">
            {/* Row 1, Col 1 (Right): اسم العملة */}
            <div className="flex flex-col gap-[6px]">
              <div className="flex items-center justify-between text-start">
                <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-[2px]">
                  <span>اسم العملة</span>
                  <span className="text-[#ba1a1a]">*</span>
                </label>
                <span className="text-[11px] font-medium text-[#837565] dark:text-[#a89f91]">
                  الاسم القانوني الرسمي
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: الدرهم الإماراتي، الريال القطري"
                  className={cn(
                    "w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder-[#837565] dark:placeholder-[#8e8680] text-[14px] rounded-[6px] ps-[16px] pe-[40px] py-[10px] border border-transparent dark:border-[#38271c] focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] focus:outline-none transition-all",
                    errors.name && "border-[#ba1a1a]"
                  )}
                />
                <Tag className="absolute top-1/2 -translate-y-1/2 end-[14px] size-[16px] text-[#837565] dark:text-[#8e8680]" />
              </div>
              {errors.name ? (
                <p className="text-[11px] font-medium text-[#ba1a1a] text-start">{errors.name}</p>
              ) : (
                <p className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] text-start leading-[14px]">
                  يظهر هذا الاسم في السندات وسندات القبض ومذكرات الدفع.
                </p>
              )}
            </div>

            {/* Row 1, Col 2 (Left): سعر الصرف مقابل الدولار */}
            <div className="flex flex-col gap-[6px]">
              <div className="flex items-center justify-between text-start">
                <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-[2px]">
                  <span>سعر الصرف مقابل الدولار (USD)</span>
                  <span className="text-[#ba1a1a]">*</span>
                </label>
                <span className="text-[11px] font-medium text-[#837565] dark:text-[#a89f91]">
                  1 USD = ؟ وحدة
                </span>
              </div>
              <div className="relative flex items-center">
                <span className="absolute start-[12px] bg-white dark:bg-[#221812] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#a89f91] text-[11px] font-bold px-[8px] py-[3px] rounded-[3px] pointer-events-none">
                  لكل 1 USD
                </span>
                <input
                  type="text"
                  dir="ltr"
                  value={formData.exchangeRate}
                  onChange={(e) => setFormData({ ...formData, exchangeRate: e.target.value })}
                  placeholder="3.7500 أو 0.2723"
                  className={cn(
                    "w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder-[#837565] dark:placeholder-[#8e8680] text-[14px] rounded-[6px] ps-[84px] pe-[40px] py-[10px] text-start border border-transparent dark:border-[#38271c] focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] focus:outline-none transition-all font-mono",
                    errors.exchangeRate && "border-[#ba1a1a]"
                  )}
                />
                <ArrowLeftRight className="absolute top-1/2 -translate-y-1/2 end-[14px] size-[16px] text-[#837565] dark:text-[#8e8680]" />
              </div>
              {errors.exchangeRate ? (
                <p className="text-[11px] font-medium text-[#ba1a1a] text-start">{errors.exchangeRate}</p>
              ) : (
                <p className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] text-start leading-[14px]">
                  يُرجى اعتماد السعر المعتمد من مؤسسة النقد أو البنك المركزي.
                </p>
              )}
            </div>

            {/* Row 2, Col 1 (Right): كود العملة (ISO Code) */}
            <div className="flex flex-col gap-[6px]">
              <div className="flex items-center justify-between text-start">
                <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-[2px]">
                  <span>كود العملة (ISO Code)</span>
                  <span className="text-[#ba1a1a]">*</span>
                </label>
                <span className="text-[11px] font-medium text-[#837565] dark:text-[#a89f91]">
                  3 أحرف قياسية
                </span>
              </div>
              <div className="relative flex items-center">
                <span className="absolute end-[12px] bg-[#eae8e4] dark:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px] pointer-events-none">
                  ISO
                </span>
                <input
                  type="text"
                  dir="ltr"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="BHD أو QAR أو AED"
                  className={cn(
                    "w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder-[#837565] dark:placeholder-[#8e8680] text-[14px] rounded-[6px] ps-[40px] pe-[54px] py-[10px] text-start border border-transparent dark:border-[#38271c] focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] focus:outline-none transition-all uppercase font-mono",
                    errors.code && "border-[#ba1a1a]"
                  )}
                />
                <Globe className="absolute top-1/2 -translate-y-1/2 start-[14px] size-[16px] text-[#837565] dark:text-[#8e8680]" />
              </div>
              {errors.code ? (
                <p className="text-[11px] font-medium text-[#ba1a1a] text-start">{errors.code}</p>
              ) : (
                <p className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] text-start leading-[14px]">
                  معيار ISO 4217 المستخدم للمطابقة مع بوابات الدفع الإلكتروني.
                </p>
              )}
            </div>

            {/* Row 2, Col 2 (Left): رمز العملة */}
            <div className="flex flex-col gap-[6px]">
              <div className="flex items-center justify-between text-start">
                <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-[2px]">
                  <span>رمز العملة</span>
                  <span className="text-[#ba1a1a]">*</span>
                </label>
              </div>
              <div className="relative">
                <span className="absolute end-[14px] top-1/2 -translate-y-1/2 text-[#837565] dark:text-[#8e8680] font-bold text-[14px] pointer-events-none">
                  $
                </span>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  placeholder="د.إ أو ر.ق أو د.ب أو AED"
                  className={cn(
                    "w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder-[#837565] dark:placeholder-[#8e8680] text-[14px] rounded-[6px] ps-[16px] pe-[36px] py-[10px] border border-transparent dark:border-[#38271c] focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] focus:outline-none transition-all",
                    errors.symbol && "border-[#ba1a1a]"
                  )}
                />
              </div>
              {errors.symbol ? (
                <p className="text-[11px] font-medium text-[#ba1a1a] text-start">{errors.symbol}</p>
              ) : (
                <p className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] text-start leading-[14px]">
                  الرمز الذي سيظهر بجانب المبالغ في الجداول والفواتير المعروضة.
                </p>
              )}
            </div>

            {/* Row 3: حالة العملة في النظام (Full Width Box) */}
            <div className="md:col-span-2 bg-[#f5f3ef] dark:bg-[#281c15] rounded-[8px] p-[16px] border border-[#eae8e4] dark:border-[#38271c] flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
              {/* Text Label on Right */}
              <div className="flex flex-col text-start">
                <span className="text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  حالة العملة في النظام
                </span>
                <span className="text-[12px] text-[#514537] dark:text-[#a89f91]">
                  تحديد ما إذا كانت العملة متاحة فوراً لإصدار العقود والرسوم المالية
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
                    className="accent-[#9c6402] dark:accent-[#e29d38] size-[18px] cursor-pointer"
                  />
                  <span className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
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
                    className="accent-[#9c6402] dark:accent-[#e29d38] size-[18px] cursor-pointer"
                  />
                  <span className="text-[13px] font-normal text-[#514537] dark:text-[#a89f91]">
                    غير نشطة (محجوبة)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </form>

        {/* Floating Sticky Action Bar */}
        <DashboardStickyActionBar>
          {/* Text note on the Right (Start in RTL) */}
          <span className="text-[12px] font-normal text-[#837565] dark:text-[#cdc5bd] hidden sm:inline text-start">
            سيتم تفعيل العملة فور الحفظ وتحديث معاملات النظام
          </span>

          {/* Action Buttons on the Left (End in RTL) */}
          <div className="flex items-center gap-[10px] ms-auto sm:ms-0">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#9c6402] hover:bg-[#835401] active:bg-[#6c4501] text-white px-[32px] py-[10px] rounded-[6px] font-semibold text-[14px] flex items-center gap-[8px] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.05)] cursor-pointer disabled:opacity-70"
            >
              <Check className="size-[18px] stroke-[2.5]" />
              <span>{isSubmitting ? "جارٍ الحفظ..." : "حفظ العملة"}</span>
            </button>

            <button
              type="button"
              onClick={onBack}
              className="bg-[#f0eeea] dark:bg-[#2c2017] hover:bg-[#e4e1dc] dark:hover:bg-[#382a1f] text-[#1b1c1a] dark:text-[#fdfbf7] border border-transparent dark:border-[#3d2a1d] px-[24px] py-[10px] rounded-[6px] font-semibold text-[14px] transition-colors cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </DashboardStickyActionBar>
      </main>
    </div>
  );
}
