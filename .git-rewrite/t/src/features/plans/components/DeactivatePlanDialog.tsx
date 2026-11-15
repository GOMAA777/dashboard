"use client";

import React from "react";
import { X, Pause, AlertTriangle, ShieldCheck, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { PricingPlanItem } from "../types/plan.types";

interface DeactivatePlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: PricingPlanItem | null;
  onConfirmDeactivate?: (planId: string) => void;
  onViewSubscribers?: () => void;
}

export function DeactivatePlanDialog({
  isOpen,
  onClose,
  plan,
  onConfirmDeactivate,
  onViewSubscribers,
}: DeactivatePlanDialogProps) {
  if (!isOpen) return null;

  const planName = plan?.name || "الباقة الفضية";
  const planCode = plan?.code || "PLAN-SLV-02";
  const monthlyPrice = plan?.monthlyPrice || 399;
  const subscribersCount = plan?.subscribedFirmsCount || 52;

  const handleConfirm = () => {
    if (onConfirmDeactivate && plan) {
      onConfirmDeactivate(plan.id);
    } else {
      toast.success(`تم تعطيل "${planName}" بنجاح ولم تعد متاحة للاشتراكات الجديدة.`);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-[16px] animate-in fade-in duration-200"
      dir="rtl"
    >
      <div
        className="relative w-full max-w-[560px] bg-white rounded-[10px] shadow-2xl border border-[#e2ded7] overflow-hidden font-['Cairo',sans-serif]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-[20px] pb-[16px]">
          <div className="flex items-center gap-[12px]">
            <div className="size-[42px] rounded-[10px] bg-[#fbf6ee] border border-[#f5e3c8] text-[#9c6402] flex items-center justify-center shrink-0">
              <Pause className="size-[20px] fill-current" />
            </div>
            <h2 className="text-[20px] font-bold text-[#1b1c1a]">
              تعطيل الباقة؟
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
          {/* Plan Info Box */}
          <div className="bg-[#faf8f5] border border-[#f0eeea] rounded-[8px] p-[16px]">
            <div className="flex items-center justify-between mb-[8px]">
              <div className="flex items-center gap-[8px]">
                <span className="text-[15px] font-bold text-[#1b1c1a]">
                  {planName}
                </span>
                <span className="text-[11px] font-mono text-[#737067] bg-[#eeebe5] px-[6px] py-[2px] rounded">
                  {planCode}
                </span>
              </div>
              <span className="inline-flex items-center gap-[4px] text-[11px] font-bold text-[#9c6402] bg-[#fbf6ee] px-[8px] py-[2px] rounded border border-[#f5e3c8]">
                <span className="size-[6px] rounded-full bg-[#9c6402]" />
                <span>مفعلة ومتاحة للاشتراك</span>
              </span>
            </div>

            <div className="flex items-center gap-[18px] text-[12px] text-[#514537] pt-[4px]">
              <span>المكاتب المشتركة: {subscribersCount} مكتباً حالياً</span>
              <span>•</span>
              <span>السعر: {monthlyPrice} ر.س / شهرياً</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-[13px] text-[#514537] leading-relaxed">
            لن تكون هذه الباقة متاحة للاشتراكات الجديدة بعد تعطيلها. راجع المكاتب
            المشتركة حاليًا قبل المتابعة.
          </p>

          {/* Warning Box */}
          <div className="bg-[#fcfaf7] border border-[#f5e3c8] rounded-[8px] p-[14px] flex items-start gap-[12px]">
            <AlertTriangle className="size-[18px] text-[#9c6402] shrink-0 mt-[2px]" />
            <div className="space-y-[6px]">
              <p className="text-[12px] text-[#514537] leading-relaxed font-medium">
                يوجد مكاتب مشتركة في هذه الباقة. تعطيلها لا يعني تلقائيًا إلغاء
                اشتراكاتهم الحالية؛ سيتم التعامل معها وفق سياسة الاشتراك
                المعتمدة.
              </p>
              {onViewSubscribers && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewSubscribers();
                  }}
                  className="text-[12px] font-bold text-[#9c6402] hover:text-[#855402] flex items-center gap-[4px] cursor-pointer"
                >
                  <span>عرض المكاتب المشتركة ({subscribersCount} مكتباً)</span>
                  <ExternalLink className="size-[12px]" />
                </button>
              )}
            </div>
          </div>

          {/* Security / System Footer Note */}
          <div className="flex items-center gap-[8px] text-[11px] text-[#737067]">
            <ShieldCheck className="size-[15px] text-[#9c6402] shrink-0" />
            <span>
              نظام الجودي: لن يتم إلغاء الاشتراكات القائمة أو تعديل الأسعار
              للمشتركين الحاليين.
            </span>
          </div>
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
            className="px-[20px] py-[9px] rounded-[6px] bg-[#9c6402] hover:bg-[#855402] text-white text-[13px] font-bold flex items-center gap-[6px] shadow-xs transition-colors cursor-pointer"
          >
            <Pause className="size-[14px] fill-current" />
            <span>تعطيل الباقة</span>
          </button>
        </div>
      </div>
    </div>
  );
}
