"use client";

import React, { useState } from "react";
import { X, ArrowUp, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { DetailedSubscribedFirm } from "../types/plan.types";
import { useLanguage } from "@/lib/i18n";
import { ModalPortal } from "@/components/shared/ModalPortal";

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
  const { t } = useLanguage();
  const [selectedTargetPlan, setSelectedTargetPlan] = useState<"gold" | "enterprise">("gold");
  const [effectiveDateOption, setEffectiveDateOption] = useState<"immediate" | "next_cycle">("immediate");

  if (!isOpen) return null;

  const firmName = firm?.name || t("مكتب د. خالد بن عبد العزيز العجلان للمحاماة", "Dr. Khalid Al-Ajlan Law Firm");
  const renewalDate = firm?.renewalDate || (t("15 يناير 2025", "Jan 15, 2025"));
  const remainingDays = firm?.remainingDaysText || (t("متبقي 83 يوماً", "83 days remaining"));

  const handleConfirm = () => {
    const targetPlanName =
      selectedTargetPlan === "gold"
        ? t("الباقة الذهبية", "Gold Plan")
        : t("باقة المؤسسات", "Enterprise Plan");
    if (onConfirmUpgrade && firm) {
      onConfirmUpgrade(firm.id, targetPlanName);
    } else {
      toast.success(
        t(
          `تمت ترقية اشتراك "${firmName}" إلى ${targetPlanName} بنجاح.`,
          `Successfully upgraded subscription for "${firmName}" to ${targetPlanName}.`
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
          className="relative w-full max-w-[672px] bg-white dark:bg-[#1e1c1a] rounded-[10px] shadow-2xl border border-[#e2ded7] dark:border-[#38271c] overflow-hidden font-['Cairo',sans-serif]"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="flex items-center justify-between p-[20px] pb-[16px] border-b border-[#f0eeea] dark:border-[#38271c]">
          <div className="flex items-center gap-[12px]">
            <div className="size-[42px] rounded-[8px] bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] flex items-center justify-center shadow-xs shrink-0">
              <ArrowUp className="size-[22px] stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("ترقية اشتراك المكتب", "Upgrade Law Firm Subscription")}
              </h2>
              <p className="text-[12px] text-[#737067] dark:text-[#cdc5bd]">{firmName}</p>
            </div>
          </div>

          <div className="flex items-center gap-[12px]">
            <span className="text-[11px] font-bold text-[#514537] dark:text-[#f3c27e] bg-[#f5f3ef] dark:bg-[rgba(226,157,56,0.18)] border border-[#e2ded7] dark:border-[#e29d38]/50 px-[10px] py-[4px] rounded-full">
              {t("الحالية: الفضية (399 ر.س/ش)", "Current: Silver (399 SAR/mo)")}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-[6px] rounded-[4px] text-[#737067] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] transition-colors cursor-pointer"
            >
              <X className="size-[18px]" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-[20px] space-y-[20px] max-h-[80vh] overflow-y-auto">
          {/* Section 1: Choose Target Plan */}
          <div>
            <h3 className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-[12px]">
              {t("اختر الباقة المستهدفة للترقية:", "Select Target Plan for Upgrade:")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
              {/* Card 1: Gold Plan (Recommended) */}
              <div
                onClick={() => setSelectedTargetPlan("gold")}
                className={`relative rounded-[8px] p-[16px] transition-all cursor-pointer flex flex-col justify-between ${
                  selectedTargetPlan === "gold"
                    ? "border-2 border-[#9c6402] dark:border-[#e29d38] bg-[#fdfbf7] dark:bg-[#2c2017] shadow-xs"
                    : "border border-[#e2ded7] dark:border-[#38271c] bg-white dark:bg-[#281c15] hover:border-[#cfcac1]"
                }`}
              >
                {/* Recommended Ribbon */}
                <div className="absolute -top-[11px] start-[14px] bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] text-[10px] font-bold px-[10px] py-[2px] rounded-full shadow-2xs">
                  {t("الموصى بها للمكتب", "Recommended for this firm")}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-[6px] pt-[2px]">
                    <div className="flex items-center gap-[8px]">
                      <div
                        className={`size-[18px] rounded-full border flex items-center justify-center shrink-0 ${
                          selectedTargetPlan === "gold"
                            ? "border-[#9c6402] dark:border-[#e29d38] bg-[#9c6402] dark:bg-[#e29d38]"
                            : "border-[#cfcac1] dark:border-[#4d3627] bg-white dark:bg-[#1e1c1a]"
                        }`}
                      >
                        {selectedTargetPlan === "gold" && (
                          <div className="size-[6px] rounded-full bg-white dark:bg-[#1c140f]" />
                        )}
                      </div>
                      <span className="text-[15px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                        {t("الباقة الذهبية", "Gold Plan")}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-[4px]">
                      <span className="text-[17px] font-black text-[#1b1c1a] dark:text-[#fdfbf7]">
                        699 {t("ر.س", "SAR")}
                      </span>
                      <span className="text-[11px] text-[#737067] dark:text-[#cdc5bd]">
                        {t("/ شهر", "/ mo")}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#737067] dark:text-[#cdc5bd] leading-relaxed mb-[12px]">
                    {t("فرق السعر:", "Price diff:")}{" "}
                    <span className="font-bold text-[#9c6402] dark:text-[#f3c27e]">+300 {t("ر.س", "SAR")}</span>{" "}
                    {t("شهرياً فقط مع مضاعفة السعة التشغيلية.", "monthly with doubled operational quota.")}
                  </p>
                </div>

                {/* Pill Badges */}
                <div className="flex flex-wrap items-center gap-[6px] pt-[10px] border-t border-[#f0eeea] dark:border-[#38271c]">
                  <span className="text-[10px] font-bold bg-[#f5f3ef] dark:bg-[#1e1c1a] border border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] px-[6px] py-[2px] rounded-full">
                    {t("10 محامين (+6)", "10 Lawyers (+6)")}
                  </span>
                  <span className="text-[10px] font-bold bg-[#f5f3ef] dark:bg-[#1e1c1a] border border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] px-[6px] py-[2px] rounded-full">
                    {t("500 قضية (+300)", "500 Cases (+300)")}
                  </span>
                  <span className="text-[10px] font-bold bg-[#f5f3ef] dark:bg-[#1e1c1a] border border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] px-[6px] py-[2px] rounded-full">
                    {t("15 وكيلاً", "15 Agents")}
                  </span>
                </div>
              </div>

              {/* Card 2: Enterprise Plan */}
              <div
                onClick={() => setSelectedTargetPlan("enterprise")}
                className={`relative rounded-[8px] p-[16px] transition-all cursor-pointer flex flex-col justify-between ${
                  selectedTargetPlan === "enterprise"
                    ? "border-2 border-[#9c6402] dark:border-[#e29d38] bg-[#fdfbf7] dark:bg-[#2c2017] shadow-xs"
                    : "border border-[#e2ded7] dark:border-[#38271c] bg-white dark:bg-[#281c15] hover:border-[#cfcac1]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-[6px] pt-[2px]">
                    <div className="flex items-center gap-[8px]">
                      <div
                        className={`size-[18px] rounded-full border flex items-center justify-center shrink-0 ${
                          selectedTargetPlan === "enterprise"
                            ? "border-[#9c6402] dark:border-[#e29d38] bg-[#9c6402] dark:bg-[#e29d38]"
                            : "border-[#cfcac1] dark:border-[#4d3627] bg-white dark:bg-[#1e1c1a]"
                        }`}
                      >
                        {selectedTargetPlan === "enterprise" && (
                          <div className="size-[6px] rounded-full bg-white dark:bg-[#1c140f]" />
                        )}
                      </div>
                      <span className="text-[15px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                        {t("باقة المؤسسات", "Enterprise Plan")}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#737067] dark:text-[#cdc5bd] leading-relaxed mb-[12px]">
                    {t(
                      "سعات مفتوحة غير محدودة للمحامين والقضايا مع مدير حساب خاص وخوادم مخصصة.",
                      "Unlimited quotas for lawyers and cases with dedicated account manager and dedicated servers."
                    )}
                  </p>
                </div>

                {/* Pill Badges */}
                <div className="flex flex-wrap items-center gap-[6px] pt-[10px] border-t border-[#f0eeea] dark:border-[#38271c]">
                  <span className="text-[10px] font-bold bg-[#f5f3ef] dark:bg-[#1e1c1a] border border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] px-[6px] py-[2px] rounded-full">
                    {t("قضايا مفتوحة", "Unlimited Cases")}
                  </span>
                  <span className="text-[10px] font-bold bg-[#f5f3ef] dark:bg-[#1e1c1a] border border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] px-[6px] py-[2px] rounded-full">
                    {t("دعم VIP", "VIP Support")}
                  </span>
                  <span className="text-[10px] font-bold bg-[#f5f3ef] dark:bg-[#1e1c1a] border border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] px-[6px] py-[2px] rounded-full">
                    {t("محامين غير محدود", "Unlimited Lawyers")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Effective Date & Billing Mechanism */}
          <div>
            <h3 className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-[12px]">
              {t("تاريخ سريان الباقة وآلية الفوترة:", "Effective Date & Billing Model:")}
            </h3>

            <div className="space-y-[10px]">
              {/* Option 1: Immediate Pro-Rata */}
              <div
                onClick={() => setEffectiveDateOption("immediate")}
                className={`p-[14px] rounded-[8px] transition-all cursor-pointer flex items-start gap-[12px] ${
                  effectiveDateOption === "immediate"
                    ? "bg-[#faf7f0] dark:bg-[#2c2017] border border-[#f5e3c8] dark:border-[#e29d38]/50"
                    : "bg-white dark:bg-[#281c15] border border-[#e2ded7] dark:border-[#38271c] hover:bg-[#faf8f5]"
                }`}
              >
                <div
                  className={`size-[18px] rounded-full border flex items-center justify-center shrink-0 mt-[2px] ${
                    effectiveDateOption === "immediate"
                      ? "border-[#9c6402] dark:border-[#e29d38] bg-[#9c6402] dark:bg-[#e29d38]"
                      : "border-[#cfcac1] dark:border-[#4d3627] bg-white dark:bg-[#1e1c1a]"
                  }`}
                >
                  {effectiveDateOption === "immediate" && (
                    <div className="size-[6px] rounded-full bg-white dark:bg-[#1c140f]" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {t("تفعيل فوري مع احتساب تسوية تناسبية", "Immediate activation with pro-rata settlement")}
                    </span>
                    <span className="text-[13px] font-black text-[#9c6402] dark:text-[#f3c27e]">
                      828.49 {t("ر.س شامل الضريبة", "SAR incl. VAT")}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#737067] dark:text-[#cdc5bd] leading-relaxed mt-[2px]">
                    {t(
                      `يتم ترقية المكتب حالاً واحتساب فارق الأيام المتبقية (${remainingDays}) حتى موعد التجديد القادم في ${renewalDate}.`,
                      `Law firm is upgraded immediately with prorated difference for remaining days (${remainingDays}) until renewal on ${renewalDate}.`
                    )}
                  </p>
                </div>
              </div>

              {/* Option 2: Next Cycle */}
              <div
                onClick={() => setEffectiveDateOption("next_cycle")}
                className={`p-[14px] rounded-[8px] transition-all cursor-pointer flex items-start gap-[12px] ${
                  effectiveDateOption === "next_cycle"
                    ? "bg-[#faf7f0] dark:bg-[#2c2017] border border-[#f5e3c8] dark:border-[#e29d38]/50"
                    : "bg-white dark:bg-[#281c15] border border-[#e2ded7] dark:border-[#38271c] hover:bg-[#faf8f5]"
                }`}
              >
                <div
                  className={`size-[18px] rounded-full border flex items-center justify-center shrink-0 mt-[2px] ${
                    effectiveDateOption === "next_cycle"
                      ? "border-[#9c6402] dark:border-[#e29d38] bg-[#9c6402] dark:bg-[#e29d38]"
                      : "border-[#cfcac1] dark:border-[#4d3627] bg-white dark:bg-[#1e1c1a]"
                  }`}
                >
                  {effectiveDateOption === "next_cycle" && (
                    <div className="size-[6px] rounded-full bg-white dark:bg-[#1c140f]" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {t(`السريان مع بداية دورة التجديد القادمة (${renewalDate})`, `Effective with next renewal cycle (${renewalDate})`)}
                    </span>
                    <span className="text-[13px] font-bold text-[#737067] dark:text-[#cdc5bd]">
                      0.00 {t("ر.س الآن", "SAR now")}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#737067] dark:text-[#cdc5bd] leading-relaxed mt-[2px]">
                    {t(
                      "يبقى المكتب على الباقة الفضية حتى نهاية الدورة الحالية مع جدولة الترقية آلياً في الفاتورة القادمة.",
                      "The firm remains on Silver until current cycle ends, automatically scheduling the upgrade on the next invoice."
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-[16px] bg-[#faf8f5] dark:bg-[#221812] border-t border-[#f0eeea] dark:border-[#38271c] flex items-center justify-end gap-[10px]">
          <button
            type="button"
            onClick={onClose}
            className="px-[18px] py-[9px] rounded-[6px] bg-white dark:bg-[#281c15] border border-[#e2ded7] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#38271c] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            {t("إلغاء", "Cancel")}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-[20px] py-[9px] rounded-[6px] bg-[#9c6402] dark:bg-[#e29d38] hover:bg-[#855402] text-white dark:text-[#1c140f] text-[13px] font-bold flex items-center gap-[6px] shadow-xs transition-colors cursor-pointer"
          >
            <CheckCircle2 className="size-[16px]" />
            <span>{t("تأكيد الترقية", "Confirm Upgrade")}</span>
          </button>
        </div>
      </div>
    </div>
  </ModalPortal>
  );
}
