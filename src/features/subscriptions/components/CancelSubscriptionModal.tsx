"use client";

import React, { useState } from "react";
import { X, AlertCircle, Building2, CheckCheck, Loader2 } from "lucide-react";
import { SubscriptionRecord } from "../types/subscription.types";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n";
import { ModalPortal } from "@/components/shared/ModalPortal";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { cancelSubscription } from "@/lib/api/subscriptions";
import { LuxuryAlertDialog } from "@/components/shared/LuxuryAlertDialog";
import { ApiError } from "@/lib/api/http";

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
  const [reasonError, setReasonError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  if (!isOpen) return null;

  const subId = subscription?.id || "";
  const firmName = subscription?.firm.name || (isEn ? "Law Firm" : "مكتب المحاماة");
  const currentPlan = subscription?.planName || (isEn ? "Silver Plan" : "الباقة الفضية");
  const renewalDate = subscription?.renewalDate || (isEn ? "15 Oct 2024" : "15 أكتوبر 2024");
  const remainingText = subscription?.remainingDaysText || (isEn ? "21 days remaining" : "متبقي 21 يوماً");

  const handleOpenConfirm = () => {
    setReasonError("");
    if (!reason.trim()) {
      setReasonError(t("يرجى تحديد سبب الإلغاء الرئيسي للمكتب", "Please select the main cancellation reason"));
      toast.error(t("يرجى تحديد سبب الإلغاء الرئيسي للمكتب", "Please select the main cancellation reason"));
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleExecuteCancel = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);
    setReasonError("");

    const fullReason = notes.trim() ? `${reason} - ${notes.trim()}` : reason;

    try {
      if (subId) {
        await cancelSubscription(subId, fullReason);
      }
      toast.success(t(`تم إلغاء اشتراك "${firmName}" وتجميد التجديد التلقائي بنجاح`, `Subscription for "${firmName}" was cancelled successfully`));
      onConfirmCancel?.(fullReason, timingOption);
      onClose();
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 422 && typeof err.body === "object" && err.body !== null) {
        const bodyObj = err.body as { errors?: Record<string, string[]> };
        const serverErrors = bodyObj.errors?.reason;
        if (serverErrors && serverErrors.length > 0) {
          setReasonError(serverErrors[0]);
        }
      }
      const message = err instanceof Error ? err.message : t("حدث خطأ أثناء إلغاء الاشتراك", "Error cancelling subscription");
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ModalPortal isOpen={isOpen}>
        <div
          dir={direction}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-['Cairo']"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubmitting) onClose();
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
                disabled={isSubmitting}
                className="size-8 rounded-[4px] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] text-[#514537] dark:text-[#a89f91] flex items-center justify-center transition-colors cursor-pointer order-2 rtl:order-1 disabled:opacity-50"
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
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block text-start">
                  {t("توقيت سريان الإلغاء", "Cancellation Effective Timing")}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label
                    onClick={() => setTimingOption("end_of_period")}
                    className={`p-3 rounded-[6px] border text-start cursor-pointer transition-all ${
                      timingOption === "end_of_period"
                        ? "border-[#ba1a1a] bg-[#ba1a1a]/5 dark:bg-[#ba1a1a]/10"
                        : "border-[#e4e2de] dark:border-[#38271c] hover:border-[#ba1a1a]/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                        {t("عند نهاية الفترة الحالية", "At End of Current Period")}
                      </span>
                      <span className="size-3.5 rounded-full border border-[#ba1a1a] flex items-center justify-center p-0.5">
                        {timingOption === "end_of_period" && (
                          <span className="size-2 rounded-full bg-[#ba1a1a]" />
                        )}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#514537] dark:text-[#a89f91] leading-relaxed">
                      {t(
                        "يستمر وصول المكتب حتى انتهاء الفترة ولا يتم تجديده تلقائياً (موصى به).",
                        "Office access continues until period ends, auto-renewal stopped."
                      )}
                    </p>
                  </label>

                  <label
                    onClick={() => setTimingOption("immediate")}
                    className={`p-3 rounded-[6px] border text-start cursor-pointer transition-all ${
                      timingOption === "immediate"
                        ? "border-[#ba1a1a] bg-[#ba1a1a]/5 dark:bg-[#ba1a1a]/10"
                        : "border-[#e4e2de] dark:border-[#38271c] hover:border-[#ba1a1a]/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[12px] text-[#ba1a1a]">
                        {t("إلغاء فوري الآن", "Immediate Cancellation Now")}
                      </span>
                      <span className="size-3.5 rounded-full border border-[#ba1a1a] flex items-center justify-center p-0.5">
                        {timingOption === "immediate" && (
                          <span className="size-2 rounded-full bg-[#ba1a1a]" />
                        )}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#514537] dark:text-[#a89f91] leading-relaxed">
                      {t(
                        "إيقاف الصلاحيات فوراً وتحويل الحساب للقراءة فقط دون استرجاع الأيام.",
                        "Revoke permissions immediately, convert account to read-only."
                      )}
                    </p>
                  </label>
                </div>
              </div>

              {/* 3. Reason & Notes */}
              <div className="space-y-2 text-start">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    <span className="text-[#dc2626] me-1">*</span>
                    {t("سبب الإلغاء", "Cancellation Reason")}
                  </label>
                  <span className="text-[10px] text-[#837565] dark:text-[#a89f91]">
                    {t("توثيق إداري داخلي للمنصة", "Internal Platform Record")}
                  </span>
                </div>

                <DashboardSelect
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (reasonError) setReasonError("");
                  }}
                  className={`w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] rounded-[4px] border h-10 text-[12px] ${
                    reasonError ? "border-[#dc2626]" : "border-[#e4e2de] dark:border-[#38271c]"
                  }`}
                >
                  <option value="">{t("يرجى تحديد سبب الإلغاء الرئيسي...", "Select primary cancellation reason...")}</option>
                  <option value="تم إلغاء التجديد التلقائي بناءً على طلب المنشأة كتابياً.">{t("تم إلغاء التجديد التلقائي بناءً على طلب المنشأة كتابياً.", "Cancelled per written client request")}</option>
                  <option value="بطلب من العميل لعدم الحاجة الحالية">{t("بطلب من العميل لعدم الحاجة الحالية", "Requested by client (no current need)")}</option>
                  <option value="ارتفاع التكلفة مقارنة بالاستخدام">{t("ارتفاع التكلفة مقارنة بالاستخدام", "Cost too high relative to usage")}</option>
                  <option value="الانتقال إلى نظام إداري بديل">{t("الانتقال إلى نظام إداري بديل", "Switching to alternative administrative system")}</option>
                  <option value="توقف أو تجميد نشاط المكتب القضائي">{t("توقف أو تجميد نشاط المكتب القضائي", "Suspension of office legal practice")}</option>
                  <option value="عدم التوافق مع المتطلبات التقنية">{t("عدم التوافق مع المتطلبات التقنية", "Technical compatibility mismatch")}</option>
                </DashboardSelect>

                {reasonError && (
                  <p className="text-[11px] text-[#dc2626] font-semibold mt-1">
                    {reasonError}
                  </p>
                )}

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
                disabled={isSubmitting}
                className="px-4 py-2 rounded-[4px] bg-[#f5f3ef] dark:bg-[#281c15] hover:bg-[#eae8e4] text-[#514537] dark:text-[#a89f91] text-[12px] font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                {t("إلغاء", "Cancel")}
              </button>
              <button
                type="button"
                onClick={handleOpenConfirm}
                disabled={isSubmitting}
                className="bg-[#ba1a1a] hover:bg-[#991b1b] text-white px-5 py-2 rounded-[4px] font-bold text-[12px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCheck className="w-4 h-4" />
                )}
                <span>{t("تأكيد إلغاء الاشتراك", "Confirm Subscription Cancellation")}</span>
              </button>
            </div>
          </div>
        </div>
      </ModalPortal>

      <LuxuryAlertDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleExecuteCancel}
        variant="danger"
        title={t("تأكيد إلغاء اشتراك المكتب", "Confirm Subscription Cancellation")}
        description={t(
          `هل أنت متأكد من رغبتك في إلغاء اشتراك "${firmName}" وإيقاف التجديد التلقائي؟`,
          `Are you sure you want to cancel the subscription for "${firmName}" and stop auto-renewal?`
        )}
        confirmLabel={t("تأكيد الإلغاء نهائياً", "Confirm Cancellation")}
        cancelLabel={t("تراجع", "Cancel")}
      />
    </>
  );
}
