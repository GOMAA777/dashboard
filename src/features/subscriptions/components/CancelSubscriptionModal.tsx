"use client";

import React, { useState } from "react";
import { X, AlertCircle, Building2, CheckCheck } from "lucide-react";
import { SubscriptionRecord } from "../types/subscription.types";
import { toast } from "sonner";

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription?: SubscriptionRecord | null;
  onConfirmCancel?: (reason: string, timing: "end_of_period" | "immediate") => void;
}

export function CancelSubscriptionModal({
  isOpen,
  onClose,
  subscription,
  onConfirmCancel,
}: CancelSubscriptionModalProps) {
  const [timingOption, setTimingOption] = useState<"end_of_period" | "immediate">("end_of_period");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subId = subscription?.id || "SUB-00128";
  const firmName = subscription?.firm.name || "مكتب العدل للمحاماة والاستشارات القانونية";
  const currentPlan = subscription?.planName || "الباقة الفضية";
  const renewalDate = subscription?.renewalDate || "15 أكتوبر 2024";
  const remainingText = subscription?.remainingDaysText || "متبقي 21 يوماً";

  const handleCancel = () => {
    if (!reason) {
      toast.error("يرجى تحديد سبب الإلغاء الرئيسي للمكتب");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmCancel?.(reason, timingOption);
      toast.success(`تم إلغاء اشتراك "${firmName}" وتجميد التجديد`);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-['Cairo']">
      <div
        className="bg-white dark:bg-[#1e1c1a] border border-[#d6c4b1]/40 dark:border-[#38332c] rounded-[8px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95"
        data-node-id="1:7101"
        data-name="إلغاء اشتراك المكتب؟"
      >
        {/* Top Decorative Accent Warning Line */}
        <div className="h-[4px] bg-[#dc2626] w-full shrink-0" data-node-id="1:7102" />

        {/* MODAL HEADER */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-[#f0eeea] dark:border-[#2f2a24] bg-white dark:bg-[#1e1c1a]"
          data-node-id="1:7103"
        >
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-[4px] hover:bg-[#f5f3ef] dark:hover:bg-[#2c2621] text-[#514537] dark:text-[#a89f91] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="إغلاق النافذة"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="size-10 rounded-[12px] bg-[#fef2f2] dark:bg-[#311616] flex items-center justify-center text-[#dc2626] shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-[22px] text-[#1b1c1a] dark:text-[#fdfbf7] leading-[26px]">
              إلغاء اشتراك المكتب؟
            </h2>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* 1. Office & Subscription Summary Box */}
          <div
            className="bg-[#f5f3ef] dark:bg-[#2c2621] p-3.5 rounded-[4px] space-y-2.5 border border-[#eae8e4] dark:border-[#38332c]"
            data-node-id="1:7115"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#e4e2de] dark:border-[#38332c]">
              <span className="bg-[#f0eeea] dark:bg-[#38332c] text-[#514537] dark:text-[#d1c9bd] font-bold text-[10px] px-2 py-0.5 rounded-[2px]">
                {subId}
              </span>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#9c6402]" />
                <span className="font-bold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {firmName}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-start">
              <div>
                <span className="text-[11px] text-[#514537] dark:text-[#a89f91] block">
                  نهاية الفترة الحالية
                </span>
                <span className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] mt-0.5 block">
                  {renewalDate}
                </span>
                <span className="text-[10px] text-[#b45309] dark:text-[#fbbf24] font-semibold">
                  ({remainingText})
                </span>
              </div>

              <div>
                <span className="text-[11px] text-[#514537] dark:text-[#a89f91] block">
                  حالة الاشتراك
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="size-1.5 rounded-full bg-[#059669]" />
                  <span className="font-semibold text-[12px] text-[#065f46] dark:text-[#34d399]">
                    نشط حالياً
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-[#514537] dark:text-[#a89f91] block">
                  الباقة الحالية
                </span>
                <span className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] mt-0.5 block">
                  {currentPlan}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Cancellation Timing Options */}
          <div className="space-y-2" data-node-id="1:7142">
            <span className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] block">
              موعد سريان الإلغاء وتجميد التجديد
            </span>

            {/* Option 1: End of Period (Recommended) */}
            <div
              onClick={() => setTimingOption("end_of_period")}
              className={`p-3 rounded-[4px] border transition-all cursor-pointer flex items-start gap-3 ${
                timingOption === "end_of_period"
                  ? "border-[#9c6402] bg-[#fff9ee]/30 dark:bg-[#342711]/40 shadow-xs"
                  : "border-[#e4e2de] dark:border-[#38332c] hover:bg-[#faf9f7]"
              }`}
            >
              <div className="pt-0.5">
                <div className="size-4 rounded-full border border-[#9c6402] flex items-center justify-center p-0.5">
                  {timingOption === "end_of_period" && (
                    <div className="size-2 rounded-full bg-[#9c6402]" />
                  )}
                </div>
              </div>
              <div className="flex-1 text-start">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    الإلغاء عند نهاية الفترة الحالية ({renewalDate})
                  </span>
                  <span className="bg-[#fef3c7] dark:bg-[#342711] text-[#78350f] dark:text-[#fbbf24] text-[10px] font-bold px-2 py-0.5 rounded-[2px]">
                    موصى به نظامياً
                  </span>
                </div>
                <p className="text-[11px] text-[#514537] dark:text-[#a89f91] mt-1 leading-relaxed">
                  يحتفظ المكتب بكامل الصلاحيات، متابعة القضايا، والوصول للأرشفة حتى نهاية المدة المدفوعة، ولن يتم احتساب أي فواتير أو تجديد تلقائي بعد ذلك.
                </p>
              </div>
            </div>

            {/* Option 2: Immediate Cancellation */}
            <div
              onClick={() => setTimingOption("immediate")}
              className={`p-3 rounded-[4px] border transition-all cursor-pointer flex items-start gap-3 ${
                timingOption === "immediate"
                  ? "border-[#9c6402] bg-[#fff9ee]/30 dark:bg-[#342711]/40 shadow-xs"
                  : "border-[#e4e2de] dark:border-[#38332c] hover:bg-[#faf9f7]"
              }`}
            >
              <div className="pt-0.5">
                <div className="size-4 rounded-full border border-[#767676] flex items-center justify-center p-0.5">
                  {timingOption === "immediate" && (
                    <div className="size-2 rounded-full bg-[#9c6402]" />
                  )}
                </div>
              </div>
              <div className="flex-1 text-start">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    إلغاء فوري من اللحظة
                  </span>
                  <span className="bg-[#ffebee] dark:bg-[#311616] text-[#c62828] dark:text-[#f87171] text-[10px] font-bold px-2 py-0.5 rounded-[2px]">
                    إيقاف مباشر
                  </span>
                </div>
                <p className="text-[11px] text-[#514537] dark:text-[#a89f91] mt-1 leading-relaxed">
                  يتم إيقاف تفعيل ميزات الباقة التفاعلية فوراً وتجميد مزامنة ناجز وتنبيهات الجلسات، مع بقاء كافة بيانات المكتب مخزنة ومحمية للرجوع المحاسبي.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Reason for Cancellation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#837565] dark:text-[#a89f91]">
                توثيق إداري داخلي للمنصة
              </span>
              <label className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                سبب الإلغاء *
              </label>
            </div>

            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-10 px-3 bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] rounded-[4px] text-[12px] border border-[#e4e2de] dark:border-[#38332c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] cursor-pointer"
            >
              <option value="">يرجى تحديد سبب الإلغاء الرئيسي...</option>
              <option value="بطلب من العميل لعدم الحاجة الحالية">بطلب من العميل لعدم الحاجة الحالية</option>
              <option value="ارتفاع التكلفة مقارنة بالاستخدام">ارتفاع التكلفة مقارنة بالاستخدام</option>
              <option value="الانتقال إلى نظام إداري بديل">الانتقال إلى نظام إداري بديل</option>
              <option value="توقف أو تجميد نشاط المكتب القضائي">توقف أو تجميد نشاط المكتب القضائي</option>
              <option value="عدم التوافق مع المتطلبات التقنية">عدم التوافق مع المتطلبات التقنية</option>
            </select>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="دون ملاحظات إضافية لسجل المراجعة (اختياري)..."
              rows={2}
              className="w-full p-2.5 bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder-[#837565] rounded-[4px] text-[12px] border border-[#e4e2de] dark:border-[#38332c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] resize-none"
            />
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
            onClick={handleCancel}
            disabled={isSubmitting}
            className="bg-[#ba1a1a] hover:bg-[#991b1b] text-white px-5 py-2 rounded-[4px] font-bold text-[12px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <CheckCheck className="w-4 h-4" />
            <span>تأكيد إلغاء الاشتراك</span>
          </button>
        </div>
      </div>
    </div>
  );
}
