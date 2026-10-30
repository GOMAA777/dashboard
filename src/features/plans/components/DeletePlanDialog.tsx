"use client";

import React from "react";
import { X, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";
import { PricingPlanItem } from "../types/plan.types";

interface DeletePlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: PricingPlanItem | null;
  onConfirmDelete?: (planId: string) => void;
}

export function DeletePlanDialog({
  isOpen,
  onClose,
  plan,
  onConfirmDelete,
}: DeletePlanDialogProps) {
  if (!isOpen) return null;

  const planName = plan?.name || "باقة البداية (Starter)";
  const monthlyPrice = plan?.monthlyPrice || 149;

  const handleConfirm = () => {
    if (onConfirmDelete && plan) {
      onConfirmDelete(plan.id);
    } else {
      toast.success(`تم حذف "${planName}" نهائياً من النظام.`);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-[16px] animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-[500px] bg-white rounded-[10px] shadow-2xl border border-[#e2ded7] overflow-hidden font-['Cairo',sans-serif]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-[20px] pb-[16px]">
          <div className="flex items-center gap-[12px]">
            <div className="size-[42px] rounded-[10px] bg-[#fee2e2] border border-[#fecaca] text-[#b91c1c] flex items-center justify-center shrink-0">
              <Trash2 className="size-[20px]" />
            </div>
            <h2 className="text-[20px] font-bold text-[#1b1c1a]">
              حذف الباقة؟
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-[6px] rounded-[4px] text-[#737067] hover:bg-[#f5f3ef] hover:text-[#1b1c1a] transition-colors cursor-pointer"
          >
            <X className="size-[18px]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-[20px] pb-[20px] space-y-[16px]">
          {/* Plan Info Card */}
          <div className="bg-[#faf8f5] border border-[#f0eeea] rounded-[8px] p-[16px] flex items-center justify-between">
            <div className="flex items-center gap-[12px]">
              <div className="size-[38px] rounded-[6px] bg-[#eae7e1] text-[#737067] flex items-center justify-center shrink-0">
                <Tag className="size-[18px]" />
              </div>
              <div>
                <div className="text-[14px] font-bold text-[#1b1c1a]">
                  {planName}
                </div>
                <div className="text-[12px] text-[#737067] mt-[2px]">
                  {monthlyPrice} ر.س / شهرياً
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-[4px]">
              <span className="text-[10px] font-bold bg-[#eeebe5] text-[#737067] px-[8px] py-[2px] rounded">
                معطلة
              </span>
              <span className="text-[11px] text-[#737067]">0 مكتب</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-[13px] text-[#514537] leading-relaxed">
            هل أنت متأكد من حذف هذه الباقة نهائيًا من النظام؟ لن يتم حذف أي
            فواتير أو سجلات مالية سابقة مرتبطة بها.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-[16px] bg-[#faf8f5] border-t border-[#f0eeea] flex items-center justify-end gap-[10px]">
          <button
            type="button"
            onClick={onClose}
            className="px-[18px] py-[9px] rounded-[6px] bg-white border border-[#e2ded7] text-[#514537] hover:bg-[#f5f3ef] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            إلغاء
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-[20px] py-[9px] rounded-[6px] bg-[#b91c1c] hover:bg-[#991b1b] text-white text-[13px] font-bold flex items-center gap-[6px] shadow-xs transition-colors cursor-pointer"
          >
            <Trash2 className="size-[15px]" />
            <span>حذف الباقة</span>
          </button>
        </div>
      </div>
    </div>
  );
}
