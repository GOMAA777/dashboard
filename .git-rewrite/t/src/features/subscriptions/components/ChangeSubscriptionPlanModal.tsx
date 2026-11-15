"use client";

import React, { useState } from "react";
import { X, Check, CheckCheck } from "lucide-react";
import { SubscriptionRecord } from "../types/subscription.types";
import { toast } from "sonner";

interface ChangeSubscriptionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription?: SubscriptionRecord | null;
  onSuccess?: (planName: string, effectiveDate: string) => void;
}

export function ChangeSubscriptionPlanModal({
  isOpen,
  onClose,
  subscription,
  onSuccess,
}: ChangeSubscriptionPlanModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<"basic" | "silver" | "gold">("gold");
  const [timingOption, setTimingOption] = useState<"immediate" | "renewal">("immediate");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const firmName = subscription?.firm.name || "مكتب العدل للمحاماة";
  const currentPlan = subscription?.planName || "الفضية";
  const renewalDate = subscription?.renewalDate || "15 أكتوبر 2024";

  const handleConfirmChange = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const planTitle =
        selectedPlanId === "gold"
          ? "الباقة الذهبية"
          : selectedPlanId === "silver"
          ? "الباقة الفضية"
          : "الباقة الأساسية";
      onSuccess?.(planTitle, timingOption);
      toast.success(`تم تغيير باقة اشتراك "${firmName}" إلى "${planTitle}" بنجاح`);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-['Cairo']">
      <div
        className="bg-white dark:bg-[#1e1c1a] border border-[#d6c4b1]/40 dark:border-[#38332c] rounded-[8px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95"
        dir="rtl"
        data-node-id="1:6978"
        data-name="تغيير باقة الاشتراك"
      >
        {/* MODAL HEADER */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-[#f0eeea] dark:border-[#2f2a24] bg-white dark:bg-[#1e1c1a]"
          data-node-id="1:6979"
        >
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-[4px] hover:bg-[#f5f3ef] dark:hover:bg-[#2c2621] text-[#514537] dark:text-[#a89f91] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="إغلاق النافذة"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-end text-right">
            <h2 className="font-bold text-[22px] text-[#1b1c1a] dark:text-[#fdfbf7] leading-[26px]">
              تغيير باقة الاشتراك
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] text-[#837565] dark:text-[#a89f91] mt-0.5 font-medium">
              <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {firmName}
              </span>
              <span>•</span>
              <span>الباقة الحالية:</span>
              <span className="font-bold text-[#7b4e00] dark:text-[#f59e0b]">
                {currentPlan}
              </span>
              <span>•</span>
              <span>تجديد: {renewalDate}</span>
            </div>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 space-y-4">
          {/* Section 1: اختر الباقة المستهدفة */}
          <div className="space-y-2" data-node-id="1:6999">
            <div className="flex items-center gap-1.5 justify-start">
              <div className="bg-[#9c6402] h-3 w-1 rounded-full shrink-0" />
              <span className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                اختر الباقة المستهدفة
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Option 1: الأساسية */}
              <div
                onClick={() => setSelectedPlanId("basic")}
                className={`p-3 rounded-[4px] border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPlanId === "basic"
                    ? "bg-[#fff9ee] dark:bg-[#342711] border-[#9c6402] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                    : "bg-[#f5f3ef]/50 dark:bg-[#2c2621] border-transparent hover:border-[#eae8e4] opacity-85"
                }`}
              >
                <div className="flex items-center justify-between pb-1">
                  <span className="text-[10px] text-[#837565] dark:text-[#a89f91] font-semibold">
                    تنزيل
                  </span>
                  <span className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    الأساسية
                  </span>
                </div>
                <div className="flex items-baseline justify-end gap-1 my-1">
                  <span className="text-[10px] text-[#837565]">ر.س/سنة</span>
                  <span className="font-bold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    3,500
                  </span>
                </div>
                <div className="text-[10px] text-[#837565] dark:text-[#a89f91] text-right">
                  حتى 5 محامين
                </div>
              </div>

              {/* Option 2: الفضية (الحالية) */}
              <div
                onClick={() => setSelectedPlanId("silver")}
                className={`p-3 rounded-[4px] border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPlanId === "silver"
                    ? "bg-[#fff9ee] dark:bg-[#342711] border-[#9c6402] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                    : "bg-[#f5f3ef]/50 dark:bg-[#2c2621] border-transparent hover:border-[#eae8e4] opacity-85"
                }`}
              >
                <div className="flex items-center justify-between pb-1">
                  <span className="bg-[#7b4e00]/10 text-[#7b4e00] dark:text-[#f59e0b] text-[10px] font-bold px-1.5 py-0.5 rounded-[2px]">
                    الحالية
                  </span>
                  <span className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    الفضية
                  </span>
                </div>
                <div className="flex items-baseline justify-end gap-1 my-1">
                  <span className="text-[10px] text-[#837565]">ر.س/سنة</span>
                  <span className="font-semibold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    9,200
                  </span>
                </div>
                <div className="text-[10px] text-[#837565] dark:text-[#a89f91] text-right font-bold">
                  10 محامين
                </div>
              </div>

              {/* Option 3: الذهبية (المختارة) */}
              <div
                onClick={() => setSelectedPlanId("gold")}
                className={`p-3 rounded-[4px] border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPlanId === "gold"
                    ? "bg-[#fff9ee] dark:bg-[#342711] border-[#9c6402] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                    : "bg-[#f5f3ef]/50 dark:bg-[#2c2621] border-transparent hover:border-[#eae8e4] opacity-85"
                }`}
              >
                <div className="flex items-center justify-between pb-1">
                  <span className="bg-[#7b4e00]/20 text-[#643f00] dark:text-[#fbbf24] text-[10px] font-bold px-1.5 py-0.5 rounded-[2px]">
                    المختارة
                  </span>
                  <div className="flex items-center gap-1 text-[#7b4e00] dark:text-[#f59e0b]">
                    <Check className="w-3 h-3 text-[#9c6402]" />
                    <span className="font-bold text-[12px]">الذهبية</span>
                  </div>
                </div>
                <div className="flex items-baseline justify-end gap-1 my-1">
                  <span className="text-[10px] text-[#514537] dark:text-[#d1c9bd]">
                    ر.س/سنة
                  </span>
                  <span className="font-bold text-[13px] text-[#9c6402] dark:text-[#fbbf24]">
                    14,500
                  </span>
                </div>
                <div className="text-[10px] text-[#7b4e00] dark:text-[#fbbf24] text-right font-medium">
                  15 محامياً
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: ملخص الفروقات الأساسية */}
          <div
            className="bg-[#f5f3ef]/60 dark:bg-[#2c2621] p-3.5 rounded-[4px] space-y-2 border border-[#f0eeea] dark:border-[#38332c]"
            data-node-id="1:7034"
          >
            <div className="flex items-center justify-between">
              <span className="bg-[#7b4e00]/10 text-[#7b4e00] dark:text-[#fbbf24] text-[11px] font-bold px-2 py-0.5 rounded-[2px]">
                {selectedPlanId === "gold"
                  ? "الفارق: +5,300 ر.س / سنوياً"
                  : selectedPlanId === "basic"
                  ? "الفارق: -5,700 ر.س / سنوياً"
                  : "نفس الباقة الحالية"}
              </span>
              <span className="font-semibold text-[11px] text-[#514537] dark:text-[#d1c9bd]">
                ملخص الفروقات الأساسية:
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-[#eae8e4] dark:border-[#38332c]">
              <div>
                <span className="text-[10px] text-[#837565] dark:text-[#a89f91] block">
                  التخزين السحابي
                </span>
                <span className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] mt-0.5 block">
                  {selectedPlanId === "gold"
                    ? "250 GB (مشفرة)"
                    : selectedPlanId === "basic"
                    ? "50 GB"
                    : "100 GB"}
                </span>
              </div>
              <div className="border-x border-[#eae8e4] dark:border-[#38332c]">
                <span className="text-[10px] text-[#837565] dark:text-[#a89f91] block">
                  القضايا والملفات
                </span>
                <span className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] mt-0.5 block">
                  {selectedPlanId === "gold"
                    ? "500 (بدلاً من 250)"
                    : selectedPlanId === "basic"
                    ? "100 قضية"
                    : "250 قضية"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#837565] dark:text-[#a89f91] block">
                  المحامين
                </span>
                <span className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] mt-0.5 block">
                  {selectedPlanId === "gold"
                    ? "15 (+5 إضافي)"
                    : selectedPlanId === "basic"
                    ? "5 محامين"
                    : "10 محامين"}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: موعد سريان التغيير */}
          <div className="space-y-2" data-node-id="1:7050">
            <div className="flex items-center gap-1.5 justify-start">
              <div className="bg-[#9c6402] h-3 w-1 rounded-full shrink-0" />
              <span className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                موعد سريان التغيير
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Timing 1: تطبيق فوري مع التسوية */}
              <label
                onClick={() => setTimingOption("immediate")}
                className={`p-3 rounded-[4px] border flex items-center justify-between transition-all cursor-pointer ${
                  timingOption === "immediate"
                    ? "border-[#9c6402] bg-[#fff9ee]/40 dark:bg-[#342711]"
                    : "border-[#e4e2de] dark:border-[#38332c] hover:bg-[#faf9f7]"
                }`}
              >
                <div className="text-right">
                  <div className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    تطبيق فوري مع التسوية
                  </div>
                  <div className="text-[10px] text-[#7b4e00] dark:text-[#fbbf24] mt-0.5 font-semibold">
                    350.67 ر.س اليوم (فارق 21 يوماً)
                  </div>
                </div>
                <div className="size-4 rounded-full border border-[#9c6402] flex items-center justify-center p-0.5 shrink-0">
                  {timingOption === "immediate" && (
                    <div className="size-2 rounded-full bg-[#9c6402]" />
                  )}
                </div>
              </label>

              {/* Timing 2: عند التجديد القادم */}
              <label
                onClick={() => setTimingOption("renewal")}
                className={`p-3 rounded-[4px] border flex items-center justify-between transition-all cursor-pointer ${
                  timingOption === "renewal"
                    ? "border-[#9c6402] bg-[#fff9ee]/40 dark:bg-[#342711]"
                    : "border-[#e4e2de] dark:border-[#38332c] hover:bg-[#faf9f7]"
                }`}
              >
                <div className="text-right">
                  <div className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    عند التجديد القادم
                  </div>
                  <div className="text-[10px] text-[#837565] dark:text-[#a89f91] mt-0.5 font-medium">
                    {renewalDate} (0.00 ر.س الآن)
                  </div>
                </div>
                <div className="size-4 rounded-full border border-[#767676] flex items-center justify-center p-0.5 shrink-0">
                  {timingOption === "renewal" && (
                    <div className="size-2 rounded-full bg-[#9c6402]" />
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#faf9f7] dark:bg-[#25221e] border-t border-[#f0eeea] dark:border-[#2f2a24]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-[4px] bg-[#f5f3ef] dark:bg-[#2c2621] hover:bg-[#eae8e4] text-[#514537] dark:text-[#a89f91] text-[12px] font-semibold transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleConfirmChange}
            disabled={isSubmitting}
            className="bg-[#9c6402] hover:bg-[#825200] text-white px-5 py-2 rounded-[4px] font-bold text-[12px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <CheckCheck className="w-4 h-4" />
            <span>تغيير الباقة</span>
          </button>
        </div>
      </div>
    </div>
  );
}
