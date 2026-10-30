"use client";

import React from "react";
import { X, Lock, Building2, ArrowLeft } from "lucide-react";
import { PricingPlanItem } from "../types/plan.types";

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
  if (!isOpen) return null;

  const planName = plan?.name || "الباقة الفضية";
  const monthlyPrice = plan?.monthlyPrice || 399;
  const subscribersCount = plan?.subscribedFirmsCount || 52;

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
            <div className="size-[42px] rounded-[10px] bg-[#fee2e2] border border-[#fecaca] text-[#dc2626] flex items-center justify-center shrink-0">
              <Lock className="size-[20px]" />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#1b1c1a]">
                لا يمكن حذف الباقة
              </h2>
              <p className="text-[12px] text-[#737067]">إجراء غير متاح حالياً</p>
            </div>
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
          <div className="bg-[#faf8f5] border border-[#f0eeea] rounded-[8px] p-[16px]">
            <div className="flex items-center justify-between mb-[8px]">
              <span className="text-[15px] font-bold text-[#1b1c1a]">
                {planName}
              </span>
              <span className="inline-flex items-center gap-[4px] text-[11px] font-bold text-[#15803d] bg-[#e8f5e9] px-[8px] py-[2px] rounded border border-[#c8e6c9]">
                <span className="size-[6px] rounded-full bg-[#15803d]" />
                <span>نشطة</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-[12px] text-[#514537] pt-[4px]">
              <div className="flex items-center gap-[6px] text-[#9c6402] font-bold">
                <Building2 className="size-[15px]" />
                <span>{subscribersCount} مكتباً نشطاً</span>
              </div>
              <div>السعر: {monthlyPrice} ر.س / شهرياً</div>
            </div>
          </div>

          {/* Explanation Text */}
          <p className="text-[13px] text-[#514537] leading-relaxed">
            لا يمكن حذف هذه الباقة لوجود {subscribersCount} مكتباً مشتركاً بها
            حالياً. يجب نقل أو تسوية اشتراكات المكاتب أولاً قبل الحذف.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-[16px] bg-[#faf8f5] border-t border-[#f0eeea] flex items-center justify-end gap-[10px]">
          <button
            type="button"
            onClick={onClose}
            className="px-[18px] py-[9px] rounded-[6px] bg-white border border-[#e2ded7] text-[#514537] hover:bg-[#f5f3ef] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            إغلاق
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onViewSubscribers) onViewSubscribers();
            }}
            className="px-[20px] py-[9px] rounded-[6px] bg-[#9c6402] hover:bg-[#855402] text-white text-[13px] font-bold flex items-center gap-[6px] shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-[15px] rtl:rotate-0 ltr:rotate-180" />
            <span>عرض المكاتب المشتركة</span>
          </button>
        </div>
      </div>
    </div>
  );
}
