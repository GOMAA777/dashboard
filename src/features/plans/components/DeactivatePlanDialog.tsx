"use client";

import React from "react";
import { X, Pause, AlertTriangle, ShieldCheck, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PricingPlanItem } from "../types/plan.types";
import { useLanguage } from "@/lib/i18n";
import { ModalPortal } from "@/components/shared/ModalPortal";

interface DeactivatePlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: PricingPlanItem | null;
  onConfirmDeactivate?: (planId: string) => void | Promise<void>;
  onViewSubscribers?: () => void;
  isLoading?: boolean;
}

export function DeactivatePlanDialog({
  isOpen,
  onClose,
  plan,
  onConfirmDeactivate,
  onViewSubscribers,
  isLoading = false,
}: DeactivatePlanDialogProps) {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const planName = plan?.name || t("الباقة الفضية", "Silver Plan");
  const planCode = plan?.code || "PLAN-SLV-02";
  const monthlyPrice = plan?.monthlyPrice || 399;
  const subscribersCount = plan?.subscribedFirmsCount || 52;

  const handleConfirm = () => {
    if (onConfirmDeactivate && plan) {
      onConfirmDeactivate(plan.id);
    } else {
      toast.success(
        t(
          `تم تعطيل "${planName}" بنجاح ولم تعد متاحة للاشتراكات الجديدة.`,
          `"${planName}" was successfully deactivated and is no longer available for new subscriptions.`
        )
      );
    }
    onClose();
  };

  return (
    <ModalPortal isOpen={isOpen}>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-[16px] animate-in fade-in duration-200"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="relative w-full max-w-[560px] bg-white dark:bg-[#221812] rounded-[10px] shadow-2xl border border-[#e2ded7] dark:border-[#38271c] overflow-hidden font-['Cairo',sans-serif]"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="flex items-center justify-between p-[20px] pb-[16px]">
          <div className="flex items-center gap-[12px]">
            <div className="size-[42px] rounded-[10px] bg-[#fbf6ee] dark:bg-[#2d1f16] border border-[#f5e3c8] dark:border-[#4d3627]/60 text-[#9c6402] dark:text-[#e29d38] flex items-center justify-center shrink-0">
              <Pause className="size-[20px] fill-current" />
            </div>
            <h2 className="text-[20px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {t("تعطيل الباقة؟", "Deactivate Plan?")}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-[6px] rounded-[4px] text-[#737067] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] transition-colors cursor-pointer"
          >
            <X className="size-[18px]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-[20px] pb-[20px] space-y-[16px]">
          {/* Plan Info Box */}
          <div className="bg-[#faf8f5] dark:bg-[#281c15] border border-[#f0eeea] dark:border-[#38271c] rounded-[8px] p-[16px]">
            <div className="flex items-center justify-between mb-[8px]">
              <div className="flex items-center gap-[8px]">
                <span className="text-[15px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {planName}
                </span>
                <span className="text-[11px] font-mono text-[#737067] dark:text-[#cdc5bd] bg-[#eeebe5] dark:bg-[#38271c] px-[6px] py-[2px] rounded">
                  {planCode}
                </span>
              </div>
              <span className="inline-flex items-center gap-[4px] text-[11px] font-bold text-[#9c6402] dark:text-[#f3c27e] bg-[#fbf6ee] dark:bg-[rgba(226,157,56,0.18)] px-[8px] py-[2px] rounded border border-[#f5e3c8] dark:border-[#e29d38]/50">
                <span className="size-[6px] rounded-full bg-[#9c6402] dark:bg-[#e29d38]" />
                <span>{t("مفعلة ومتاحة للاشتراك", "Active and available")}</span>
              </span>
            </div>

            <div className="flex items-center gap-[18px] text-[12px] text-[#514537] dark:text-[#cdc5bd] pt-[4px]">
              <span>
                {t("المكاتب المشتركة:", "Subscribed offices:")} {subscribersCount}{" "}
                {t("مكتباً حالياً", "offices currently")}
              </span>
              <span>•</span>
              <span>
                {t("السعر:", "Price:")} {monthlyPrice} {t("ر.س / شهرياً", "SAR / month")}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-[13px] text-[#514537] dark:text-[#cdc5bd] leading-relaxed">
            {t(
              "لن تكون هذه الباقة متاحة للاشتراكات الجديدة بعد تعطيلها. راجع المكاتب المشتركة حاليًا قبل المتابعة.",
              "This plan will not be available for new subscriptions once deactivated. Please review currently subscribed law firms before proceeding."
            )}
          </p>

          {/* Warning Box */}
          <div className="bg-[#fcfaf7] dark:bg-[#281c15] border border-[#f5e3c8] dark:border-[#4d3627]/60 rounded-[8px] p-[14px] flex items-start gap-[12px]">
            <AlertTriangle className="size-[18px] text-[#9c6402] dark:text-[#e29d38] shrink-0 mt-[2px]" />
            <div className="space-y-[6px]">
              <p className="text-[12px] text-[#514537] dark:text-[#cdc5bd] leading-relaxed font-medium">
                {t(
                  "يوجد مكاتب مشتركة في هذه الباقة. تعطيلها لا يعني تلقائيًا إلغاء اشتراكاتهم الحالية؛ سيتم التعامل معها وفق سياسة الاشتراك المعتمدة.",
                  "There are law firms currently subscribed to this plan. Deactivation does not automatically cancel their active subscriptions; they will continue under the approved policy."
                )}
              </p>
              {onViewSubscribers && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewSubscribers();
                  }}
                  className="text-[12px] font-bold text-[#9c6402] dark:text-[#f3c27e] hover:text-[#855402] dark:hover:text-[#e29d38] flex items-center gap-[4px] cursor-pointer"
                >
                  <ExternalLink className="size-[12px]" />
                  <span>
                    {t("عرض المكاتب المشتركة", "View Subscribed Offices")} ({subscribersCount}{" "}
                    {t("مكتباً", "offices")})
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Security / System Footer Note */}
          <div className="flex items-center gap-[8px] text-[11px] text-[#737067] dark:text-[#cdc5bd]">
            <ShieldCheck className="size-[15px] text-[#9c6402] dark:text-[#e29d38] shrink-0" />
            <span>
              {t(
                "نظام الجودي: لن يتم إلغاء الاشتراكات القائمة أو تعديل الأسعار للمشتركين الحاليين.",
                "Al-Joudi System: Existing subscriptions and active billing prices will remain unchanged."
              )}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-[16px] bg-[#faf8f5] dark:bg-[#281c15] border-t border-[#f0eeea] dark:border-[#38271c] flex items-center justify-end gap-[10px]">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-[18px] py-[9px] rounded-[6px] bg-white dark:bg-[#221812] border border-[#e2ded7] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] text-[13px] font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("إلغاء", "Cancel")}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-[20px] py-[9px] rounded-[6px] bg-[#9c6402] hover:bg-[#855402] dark:bg-[#e29d38] dark:hover:bg-[#d08c2a] text-white dark:text-[#1c140f] text-[13px] font-bold flex items-center gap-[6px] shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="size-[14px] animate-spin" />
            ) : (
              <Pause className="size-[14px] fill-current" />
            )}
            <span>{isLoading ? t("جاري التعطيل...", "Deactivating...") : t("تعطيل الباقة", "Deactivate Plan")}</span>
          </button>
        </div>
      </div>
    </div>
  </ModalPortal>
  );
}
