"use client";

import React, { useState } from "react";
import { X, ArrowUp, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { DetailedSubscribedFirm } from "../types/plan.types";

interface UpgradeSubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  firm?: DetailedSubscribedFirm | null;
  onConfirmUpgrade?: (firmId: string, targetPlan: string) => void;
}

export function UpgradeSubscriptionDialog({
  isOpen,
  onClose,
  firm,
  onConfirmUpgrade,
}: UpgradeSubscriptionDialogProps) {
  const [selectedTargetPlan, setSelectedTargetPlan] = useState<"gold" | "enterprise">("gold");
  const [effectiveDateOption, setEffectiveDateOption] = useState<"immediate" | "next_cycle">("immediate");

  if (!isOpen) return null;

  const firmName = firm?.name || "مكتب د. خالد بن عبد العزيز العجلان للمحاماة";
  const renewalDate = firm?.renewalDate || "15 يناير 2025";
  const remainingDays = firm?.remainingDaysText || "متبقي 83 يوماً";

  const handleConfirm = () => {
    if (onConfirmUpgrade && firm) {
      onConfirmUpgrade(firm.id, selectedTargetPlan === "gold" ? "الباقة الذهبية" : "باقة المؤسسات");
    } else {
      toast.success(
        `تمت ترقية اشتراك "${firmName}" إلى ${
          selectedTargetPlan === "gold" ? "الباقة الذهبية" : "باقة المؤسسات"
        } بنجاح.`
      );
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-[16px] animate-in fade-in duration-200"
      dir="rtl"
    >
      <div
        className="relative w-full max-w-[672px] bg-white rounded-[10px] shadow-2xl border border-[#e2ded7] overflow-hidden font-['Cairo',sans-serif]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-[20px] pb-[16px] border-b border-[#f0eeea]">
          <div className="flex items-center gap-[12px]">
            <div className="size-[42px] rounded-[8px] bg-[#9c6402] text-white flex items-center justify-center shadow-xs shrink-0">
              <ArrowUp className="size-[22px] stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-[#1b1c1a]">
                ترقية اشتراك المكتب
              </h2>
              <p className="text-[12px] text-[#737067]">{firmName}</p>
            </div>
          </div>

          <div className="flex items-center gap-[12px]">
            <span className="text-[11px] font-bold text-[#514537] bg-[#f5f3ef] border border-[#e2ded7] px-[10px] py-[4px] rounded-[4px]">
              الحالية: الفضية (399 ر.س/ش)
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-[6px] rounded-[4px] text-[#737067] hover:bg-[#f5f3ef] hover:text-[#1b1c1a] transition-colors cursor-pointer"
            >
              <X className="size-[18px]" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-[20px] space-y-[20px] max-h-[80vh] overflow-y-auto">
          {/* Section 1: Choose Target Plan */}
          <div>
            <h3 className="text-[13px] font-bold text-[#1b1c1a] mb-[12px]">
              اختر الباقة المستهدفة للترقية:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
              {/* Card 1: Gold Plan (Recommended) */}
              <div
                onClick={() => setSelectedTargetPlan("gold")}
                className={`relative rounded-[8px] p-[16px] transition-all cursor-pointer flex flex-col justify-between ${
                  selectedTargetPlan === "gold"
                    ? "border-2 border-[#9c6402] bg-[#fdfbf7] shadow-xs"
                    : "border border-[#e2ded7] bg-white hover:border-[#cfcac1]"
                }`}
              >
                {/* Recommended Ribbon */}
                <div className="absolute -top-[11px] start-[14px] bg-[#9c6402] text-white text-[10px] font-bold px-[10px] py-[2px] rounded-full shadow-2xs">
                  الموصى بها للمكتب
                </div>

                <div>
                  <div className="flex items-center justify-between mb-[6px] pt-[2px]">
                    <div className="flex items-center gap-[8px]">
                      <div
                        className={`size-[18px] rounded-full border flex items-center justify-center shrink-0 ${
                          selectedTargetPlan === "gold"
                            ? "border-[#9c6402] bg-[#9c6402]"
                            : "border-[#cfcac1] bg-white"
                        }`}
                      >
                        {selectedTargetPlan === "gold" && (
                          <div className="size-[6px] rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-[15px] font-bold text-[#1b1c1a]">
                        الباقة الذهبية
                      </span>
                    </div>

                    <div className="flex items-baseline gap-[4px]">
                      <span className="text-[17px] font-black text-[#1b1c1a]">
                        699 ر.س
                      </span>
                      <span className="text-[11px] text-[#737067]">/ شهر</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#737067] leading-relaxed mb-[12px]">
                    فرق السعر:{" "}
                    <span className="font-bold text-[#9c6402]">+300 ر.س</span>{" "}
                    شهرياً فقط مع مضاعفة السعة التشغيلية.
                  </p>
                </div>

                {/* Pill Badges */}
                <div className="flex flex-wrap items-center gap-[6px] pt-[10px] border-t border-[#f0eeea]">
                  <span className="text-[10px] font-bold bg-[#f5f3ef] text-[#514537] px-[6px] py-[2px] rounded">
                    10 محامين (+6)
                  </span>
                  <span className="text-[10px] font-bold bg-[#f5f3ef] text-[#514537] px-[6px] py-[2px] rounded">
                    500 قضية (+300)
                  </span>
                  <span className="text-[10px] font-bold bg-[#f5f3ef] text-[#514537] px-[6px] py-[2px] rounded">
                    15 وكيلاً
                  </span>
                </div>
              </div>

              {/* Card 2: Enterprise Plan */}
              <div
                onClick={() => setSelectedTargetPlan("enterprise")}
                className={`relative rounded-[8px] p-[16px] transition-all cursor-pointer flex flex-col justify-between ${
                  selectedTargetPlan === "enterprise"
                    ? "border-2 border-[#9c6402] bg-[#fdfbf7] shadow-xs"
                    : "border border-[#e2ded7] bg-white hover:border-[#cfcac1]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-[6px] pt-[2px]">
                    <div className="flex items-center gap-[8px]">
                      <div
                        className={`size-[18px] rounded-full border flex items-center justify-center shrink-0 ${
                          selectedTargetPlan === "enterprise"
                            ? "border-[#9c6402] bg-[#9c6402]"
                            : "border-[#cfcac1] bg-white"
                        }`}
                      >
                        {selectedTargetPlan === "enterprise" && (
                          <div className="size-[6px] rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-[15px] font-bold text-[#1b1c1a]">
                        باقة المؤسسات
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#737067] leading-relaxed mb-[12px]">
                    سعات مفتوحة غير محدودة للمحامين والقضايا مع مدير حساب خاص
                    وخوادم مخصصة.
                  </p>
                </div>

                {/* Pill Badges */}
                <div className="flex flex-wrap items-center gap-[6px] pt-[10px] border-t border-[#f0eeea]">
                  <span className="text-[10px] font-bold bg-[#f5f3ef] text-[#514537] px-[6px] py-[2px] rounded">
                    قضايا مفتوحة
                  </span>
                  <span className="text-[10px] font-bold bg-[#f5f3ef] text-[#514537] px-[6px] py-[2px] rounded">
                    دعم VIP
                  </span>
                  <span className="text-[10px] font-bold bg-[#f5f3ef] text-[#514537] px-[6px] py-[2px] rounded">
                    محامين غير محدود
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Effective Date & Billing Mechanism */}
          <div>
            <h3 className="text-[13px] font-bold text-[#1b1c1a] mb-[12px]">
              تاريخ سريان الباقة وآلية الفوترة:
            </h3>

            <div className="space-y-[10px]">
              {/* Option 1: Immediate Pro-Rata */}
              <div
                onClick={() => setEffectiveDateOption("immediate")}
                className={`p-[14px] rounded-[8px] transition-all cursor-pointer flex items-start gap-[12px] ${
                  effectiveDateOption === "immediate"
                    ? "bg-[#faf7f0] border border-[#f5e3c8]"
                    : "bg-white border border-[#e2ded7] hover:bg-[#faf8f5]"
                }`}
              >
                <div
                  className={`size-[18px] rounded-full border flex items-center justify-center shrink-0 mt-[2px] ${
                    effectiveDateOption === "immediate"
                      ? "border-[#9c6402] bg-[#9c6402]"
                      : "border-[#cfcac1] bg-white"
                  }`}
                >
                  {effectiveDateOption === "immediate" && (
                    <div className="size-[6px] rounded-full bg-white" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-[#1b1c1a]">
                      تفعيل فوري مع احتساب تسوية تناسبية
                    </span>
                    <span className="text-[13px] font-black text-[#9c6402]">
                      828.49 ر.س شامل الضريبة
                    </span>
                  </div>
                  <p className="text-[11px] text-[#737067] leading-relaxed mt-[2px]">
                    يتم ترقية المكتب حالاً واحتساب فارق الأيام المتبقية (
                    {remainingDays}) حتى موعد التجديد القادم في {renewalDate}.
                  </p>
                </div>
              </div>

              {/* Option 2: Next Cycle */}
              <div
                onClick={() => setEffectiveDateOption("next_cycle")}
                className={`p-[14px] rounded-[8px] transition-all cursor-pointer flex items-start gap-[12px] ${
                  effectiveDateOption === "next_cycle"
                    ? "bg-[#faf7f0] border border-[#f5e3c8]"
                    : "bg-white border border-[#e2ded7] hover:bg-[#faf8f5]"
                }`}
              >
                <div
                  className={`size-[18px] rounded-full border flex items-center justify-center shrink-0 mt-[2px] ${
                    effectiveDateOption === "next_cycle"
                      ? "border-[#9c6402] bg-[#9c6402]"
                      : "border-[#cfcac1] bg-white"
                  }`}
                >
                  {effectiveDateOption === "next_cycle" && (
                    <div className="size-[6px] rounded-full bg-white" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-[#1b1c1a]">
                      السريان مع بداية دورة التجديد القادمة ({renewalDate})
                    </span>
                    <span className="text-[13px] font-bold text-[#737067]">
                      0.00 ر.س الآن
                    </span>
                  </div>
                  <p className="text-[11px] text-[#737067] leading-relaxed mt-[2px]">
                    يبقى المكتب على الباقة الفضية حتى نهاية الدورة الحالية مع
                    جدولة الترقية آلياً في الفاتورة القادمة.
                  </p>
                </div>
              </div>
            </div>
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
            <CheckCircle2 className="size-[16px]" />
            <span>تأكيد الترقية</span>
          </button>
        </div>
      </div>
    </div>
  );
}
