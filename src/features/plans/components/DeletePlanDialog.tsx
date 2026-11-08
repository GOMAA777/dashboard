"use client";

import React from "react";
import { X, Trash2, Tag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PricingPlanItem } from "../types/plan.types";
import { useLanguage } from "@/lib/i18n";
import { ModalPortal } from "@/components/shared/ModalPortal";

interface DeletePlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: PricingPlanItem | null;
  onConfirmDelete?: (planId: string) => void | Promise<void>;
  isLoading?: boolean;
}

export function DeletePlanDialog({
  isOpen,
  onClose,
  plan,
  onConfirmDelete,
  isLoading = false,
}: DeletePlanDialogProps) {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const planName = plan?.name || t("باقة البداية (Starter)", "Starter Plan");
  const monthlyPrice = plan?.monthlyPrice || 149;

  const handleConfirm = () => {
    if (onConfirmDelete && plan) {
      onConfirmDelete(plan.id);
    } else {
      toast.success(
        t(
          `تم حذف "${planName}" نهائياً من النظام.`,
          `"${planName}" was permanently deleted from the system.`
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
          className="relative w-full max-w-[500px] bg-white dark:bg-[#221812] rounded-[10px] shadow-2xl border border-[#e2ded7] dark:border-[#38271c] overflow-hidden font-['Cairo',sans-serif]"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="flex items-center justify-between p-[20px] pb-[16px]">
          <div className="flex items-center gap-[12px]">
            <div className="size-[42px] rounded-[10px] bg-[#fee2e2] dark:bg-[#381a1a] border border-[#fecaca] dark:border-[#5c2424] text-[#b91c1c] dark:text-[#f87171] flex items-center justify-center shrink-0">
              <Trash2 className="size-[20px]" />
            </div>
            <h2 className="text-[20px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {t("حذف الباقة؟", "Delete Plan?")}
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
          {/* Plan Info Card */}
          <div className="bg-[#faf8f5] dark:bg-[#281c15] border border-[#f0eeea] dark:border-[#38271c] rounded-[8px] p-[16px] flex items-center justify-between">
            <div className="flex items-center gap-[12px]">
              <div className="size-[38px] rounded-[6px] bg-[#eae7e1] dark:bg-[#38271c] text-[#737067] dark:text-[#cdc5bd] flex items-center justify-center shrink-0">
                <Tag className="size-[18px]" />
              </div>
              <div>
                <div className="text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {planName}
                </div>
                <div className="text-[12px] text-[#737067] dark:text-[#cdc5bd] mt-[2px]">
                  {monthlyPrice} {t("ر.س / شهرياً", "SAR / month")}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-[4px]">
              <span className="text-[10px] font-bold bg-[#eeebe5] dark:bg-[#38271c] text-[#737067] dark:text-[#cdc5bd] px-[8px] py-[2px] rounded">
                {t("معطلة", "Inactive")}
              </span>
              <span className="text-[11px] text-[#737067] dark:text-[#cdc5bd]">
                0 {t("مكتب", "offices")}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-[13px] text-[#514537] dark:text-[#cdc5bd] leading-relaxed">
            {t(
              "هل أنت متأكد من حذف هذه الباقة نهائيًا من النظام؟ لن يتم حذف أي فواتير أو سجلات مالية سابقة مرتبطة بها.",
              "Are you sure you want to permanently delete this plan from the system? Past invoices and financial records will remain unaffected."
            )}
          </p>
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
            className="px-[20px] py-[9px] rounded-[6px] bg-[#b91c1c] hover:bg-[#991b1b] text-white text-[13px] font-bold flex items-center gap-[6px] shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="size-[15px] animate-spin" />
            ) : (
              <Trash2 className="size-[15px]" />
            )}
            <span>{isLoading ? t("جاري الحذف...", "Deleting...") : t("حذف الباقة", "Delete Plan")}</span>
          </button>
        </div>
      </div>
    </div>
  </ModalPortal>
  );
}
