"use client";

import React from "react";
import { X, Lock, Building2, ArrowLeft } from "lucide-react";
import { PricingPlanItem } from "../types/plan.types";
import { useLanguage } from "@/lib/i18n";
import { ModalPortal } from "@/components/shared/ModalPortal";

interface CannotDeletePlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: PricingPlanItem | null;
  onViewSubscribers?: () => void;
}

export function CannotDeletePlanDialog({
  isOpen,
  onClose,
  plan,
  onViewSubscribers,
}: CannotDeletePlanDialogProps) {
  const { t, isEn } = useLanguage();
  if (!isOpen) return null;

  const planName = plan?.name || t("الباقة الفضية", "Silver Plan");
  const monthlyPrice = plan?.monthlyPrice || 399;
  const subscribersCount = plan?.subscribedFirmsCount || 52;

  return (
    <ModalPortal isOpen={isOpen}>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-[16px] animate-in fade-in duration-200"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="relative w-full max-w-[500px] bg-white dark:bg-[#221812] rounded-[10px] shadow-2xl border border-[#e2ded7] dark:border-[#38271c] overflow-hidden font-['Cairo',sans-serif]"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="flex items-center justify-between p-[20px] pb-[16px]">
          <div className="flex items-center gap-[12px]">
            <div className="size-[42px] rounded-[10px] bg-[#fee2e2] dark:bg-[#381a1a] border border-[#fecaca] dark:border-[#5c2424] text-[#dc2626] dark:text-[#f87171] flex items-center justify-center shrink-0">
              <Lock className="size-[20px]" />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("لا يمكن حذف الباقة", "Cannot Delete Plan")}
              </h2>
              <p className="text-[12px] text-[#737067] dark:text-[#cdc5bd]">
                {t("إجراء غير متاح حالياً", "Action currently unavailable")}
              </p>
            </div>
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
          {/* Plan Info Card */}
          <div className="bg-[#faf8f5] dark:bg-[#281c15] border border-[#f0eeea] dark:border-[#38271c] rounded-[8px] p-[16px]">
            <div className="flex items-center justify-between mb-[8px]">
              <span className="text-[15px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {planName}
              </span>
              <span className="inline-flex items-center gap-[4px] text-[11px] font-bold text-[#15803d] dark:text-[#6ee7b7] bg-[#e8f5e9] dark:bg-[#132c1c] px-[8px] py-[2px] rounded border border-[#c8e6c9] dark:border-[#165a2e]">
                <span className="size-[6px] rounded-full bg-[#15803d] dark:bg-[#6ee7b7]" />
                <span>{t("نشطة", "Active")}</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-[12px] text-[#514537] dark:text-[#cdc5bd] pt-[4px]">
              <div className="flex items-center gap-[6px] text-[#9c6402] dark:text-[#f3c27e] font-bold">
                <Building2 className="size-[15px]" />
                <span>
                  {subscribersCount}{" "}
                  {t("مكتباً نشطاً", "active offices")}
                </span>
              </div>
              <div>
                {t("السعر:", "Price:")} {monthlyPrice} {t("ر.س / شهرياً", "SAR / month")}
              </div>
            </div>
          </div>

          {/* Explanation Text */}
          <p className="text-[13px] text-[#514537] dark:text-[#cdc5bd] leading-relaxed">
            {t(
              `لا يمكن حذف هذه الباقة لوجود ${subscribersCount} مكتباً مشتركاً بها حالياً. يجب نقل أو تسوية اشتراكات المكاتب أولاً قبل الحذف.`,
              `Cannot delete this plan because ${subscribersCount} offices are currently subscribed. You must migrate or resolve office subscriptions first before deleting.`
            )}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-[16px] bg-[#faf8f5] dark:bg-[#281c15] border-t border-[#f0eeea] dark:border-[#38271c] flex items-center justify-end gap-[10px]">
          <button
            type="button"
            onClick={onClose}
            className="px-[18px] py-[9px] rounded-[6px] bg-white dark:bg-[#221812] border border-[#e2ded7] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            {t("إغلاق", "Close")}
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onViewSubscribers) onViewSubscribers();
            }}
            className="px-[20px] py-[9px] rounded-[6px] bg-[#9c6402] hover:bg-[#855402] dark:bg-[#e29d38] dark:hover:bg-[#d08c2a] text-white dark:text-[#1c140f] text-[13px] font-bold flex items-center gap-[6px] shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-[15px] rtl:rotate-0 ltr:rotate-180" />
            <span>{t("عرض المكاتب المشتركة", "View Subscribed Offices")}</span>
          </button>
        </div>
      </div>
    </div>
  </ModalPortal>
  );
}
