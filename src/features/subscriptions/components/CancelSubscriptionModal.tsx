"use client";

import React, { useState } from "react";
import { X, AlertCircle, Building2, CheckCheck } from "lucide-react";
import { SubscriptionRecord } from "../types/subscription.types";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n";
import { ModalPortal } from "@/components/shared/ModalPortal";
import { DashboardSelect } from "@/components/shared/DashboardSelect";

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
  const { t, direction, isEn } = useLanguage();
  const [timingOption, setTimingOption] = useState<"end_of_period" | "immediate">("end_of_period");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subId = subscription?.id || "SUB-00128";
  const firmName = subscription?.firm.name || (isEn ? "Al-Adl Law Firm & Legal Consultations" : "مكتب العدل للمحاماة والاستشارات القانونية");
  const currentPlan = subscription?.planName || (isEn ? "Silver Plan" : "الباقة الفضية");
  const renewalDate = subscription?.renewalDate || (isEn ? "15 Oct 2024" : "15 أكتوبر 2024");
  const remainingText = subscription?.remainingDaysText || (isEn ? "21 days remaining" : "متبقي 21 يوماً");

  const handleCancel = () => {
    if (!reason) {
      toast.error(t("يرجى تحديد سبب الإلغاء الرئيسي للمكتب", "Please select the main cancellation reason for the office"));
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmCancel?.(reason, timingOption);
      toast.success(t(`تم إلغاء اشتراك "${firmName}" وتجميد التجديد`, `Subscription for "${firmName}" was cancelled and renewal frozen`));
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <ModalPortal isOpen={isOpen}>
      <div
        dir={direction}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-['Cairo']"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="bg-white dark:bg-[#221812] border border-[#d6c4b1]/40 dark:border-[#38271c] rounded-[8px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95"
          data-node-id="1:7101"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Top Decorative Accent Warning Line */}
        <div className="h-[4px] bg-[#dc2626] w-full shrink-0" data-node-id="1:7102" />

        {/* MODAL HEADER */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-[#f0eeea] dark:border-[#38271c] bg-white dark:bg-[#221812]"
          data-node-id="1:7103"
        >
          <div className="flex items-center gap-3 order-1 rtl:order-2">
            <div className="size-10 rounded-[12px] bg-[#fef2f2] dark:bg-[#311616] flex items-center justify-center text-[#dc2626] shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-[22px] text-[#1b1c1a] dark:text-[#fdfbf7] leading-[26px]">
              {t("إلغاء اشتراك المكتب؟", "Cancel Office Subscription?")}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-[4px] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] text-[#514537] dark:text-[#a89f91] flex items-center justify-center transition-colors cursor-pointer order-2 rtl:order-1"
            aria-label={t("إغلاق النافذة", "Close Window")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* 1. Office & Subscription Summary Box */}
          <div
            className="bg-[#f5f3ef] dark:bg-[#281c15] p-3.5 rounded-[4px] space-y-2.5 border border-[#eae8e4] dark:border-[#38271c]"
            data-node-id="1:7115"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#e4e2de] dark:border-[#38271c]">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#9c6402]" />
                <span className="font-bold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {firmName}
                </span>
              </div>
              <span className="bg-[#f0eeea] dark:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] font-bold text-[10px] px-2 py-0.5 rounded-[2px]">
                {subId}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-start">
              <div>
                <span className="text-[11px] text-[#514537] dark:text-[#a89f91] block">
                  {t("نهاية الفترة الحالية", "End of Current Period")}
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
                  {t("حالة الاشتراك", "Subscription Status")}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="size-1.5 rounded-full bg-[#059669]" />
                  <span className="font-semibold text-[12px] text-[#065f46] dark:text-[#34d399]">
                    {t("نشط حالياً", "Currently Active")}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-[#514537] dark:text-[#a89f91] block">
                  {t("الباقة الحالية", "Current Plan")}
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
              {t("موعد سريان الإلغاء وتجميد التجديد", "Cancellation Effective Date & Renewal Freeze")}
            </span>

            {/* Option 1: End of Period (Recommended) */}
            <div
              onClick={() => setTimingOption("end_of_period")}
              className={`p-3 rounded-[4px] border transition-all cursor-pointer flex items-start gap-3 ${
                timingOption === "end_of_period"
                  ? "border-[#9c6402] bg-[#fff9ee]/30 dark:bg-[#342711]/40 shadow-xs"
                  : "border-[#e4e2de] dark:border-[#38271c] hover:bg-[#faf9f7]"
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
                    {t(`الإلغاء عند نهاية الفترة الحالية (${renewalDate})`, `Cancel at End of Current Period (${renewalDate})`)}
                  </span>
                  <span className="bg-[#fef3c7] dark:bg-[#342711] text-[#78350f] dark:text-[#fbbf24] text-[10px] font-bold px-2 py-0.5 rounded-[2px]">
                    {t("موصى به نظامياً", "Recommended")}
                  </span>
                </div>
                <p className="text-[11px] text-[#514537] dark:text-[#a89f91] mt-1 leading-relaxed">
                  {t(
                    "يحتفظ المكتب بكامل الصلاحيات، متابعة القضايا، والوصول للأرشفة حتى نهاية المدة المدفوعة، ولن يتم احتساب أي فواتير أو تجديد تلقائي بعد ذلك.",
                    "The office retains full privileges, case tracking, and archive access until the end of the paid term. No further invoices or auto-renewals will occur."
                  )}
                </p>
              </div>
            </div>

            {/* Option 2: Immediate Cancellation */}
            <div
              onClick={() => setTimingOption("immediate")}
              className={`p-3 rounded-[4px] border transition-all cursor-pointer flex items-start gap-3 ${
                timingOption === "immediate"
                  ? "border-[#9c6402] bg-[#fff9ee]/30 dark:bg-[#342711]/40 shadow-xs"
                  : "border-[#e4e2de] dark:border-[#38271c] hover:bg-[#faf9f7]"
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
                    {t("إلغاء فوري من اللحظة", "Cancel Immediately")}
                  </span>
                  <span className="bg-[#ffebee] dark:bg-[#311616] text-[#c62828] dark:text-[#f87171] text-[10px] font-bold px-2 py-0.5 rounded-[2px]">
                    {t("إيقاف مباشر", "Immediate Termination")}
                  </span>
                </div>
                <p className="text-[11px] text-[#514537] dark:text-[#a89f91] mt-1 leading-relaxed">
                  {t(
                    "يتم إيقاف تفعيل ميزات الباقة التفاعلية فوراً وتجميد مزامنة ناجز وتنبيهات الجلسات، مع بقاء كافة بيانات المكتب مخزنة ومحمية للرجوع المحاسبي.",
                    "Active plan features will be halted immediately, and sync alerts paused, while all office data remains archived and protected for accounting records."
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* 3. Reason for Cancellation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("سبب الإلغاء *", "Cancellation Reason *")}
              </label>
              <span className="text-[10px] text-[#837565] dark:text-[#a89f91]">
                {t("توثيق إداري داخلي للمنصة", "Internal Platform Record")}
              </span>
            </div>

            <DashboardSelect
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t("يرجى تحديد سبب الإلغاء الرئيسي...", "Select primary cancellation reason...")}
              className="h-10 text-[12px] rounded-[4px]"
            >
              <option value="">{t("يرجى تحديد سبب الإلغاء الرئيسي...", "Select primary cancellation reason...")}</option>
              <option value="بطلب من العميل لعدم الحاجة الحالية">{t("بطلب من العميل لعدم الحاجة الحالية", "Requested by client (no current need)")}</option>
              <option value="ارتفاع التكلفة مقارنة بالاستخدام">{t("ارتفاع التكلفة مقارنة بالاستخدام", "Cost too high relative to usage")}</option>
              <option value="الانتقال إلى نظام إداري بديل">{t("الانتقال إلى نظام إداري بديل", "Switching to alternative administrative system")}</option>
              <option value="توقف أو تجميد نشاط المكتب القضائي">{t("توقف أو تجميد نشاط المكتب القضائي", "Suspension of office legal practice")}</option>
              <option value="عدم التوافق مع المتطلبات التقنية">{t("عدم التوافق مع المتطلبات التقنية", "Technical compatibility mismatch")}</option>
            </DashboardSelect>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("دون ملاحظات إضافية لسجل المراجعة (اختياري)...", "Note additional details for audit log (optional)...")}
              rows={2}
              className="w-full p-2.5 bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder-[#837565] rounded-[4px] text-[12px] border border-[#e4e2de] dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] resize-none"
            />
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#faf9f7] dark:bg-[#221812] border-t border-[#f0eeea] dark:border-[#38271c]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-[4px] bg-[#f5f3ef] dark:bg-[#281c15] hover:bg-[#eae8e4] text-[#514537] dark:text-[#a89f91] text-[12px] font-semibold transition-colors cursor-pointer"
          >
            {t("إلغاء", "Cancel")}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="bg-[#ba1a1a] hover:bg-[#991b1b] text-white px-5 py-2 rounded-[4px] font-bold text-[12px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <CheckCheck className="w-4 h-4" />
            <span>{t("تأكيد إلغاء الاشتراك", "Confirm Subscription Cancellation")}</span>
          </button>
        </div>
      </div>
    </div>
  </ModalPortal>
  );
}