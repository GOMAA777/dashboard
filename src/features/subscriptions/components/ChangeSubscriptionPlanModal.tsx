"use client";

import React, { useState } from "react";
import { X, Check, CheckCheck, Settings2 } from "lucide-react";
import { SubscriptionRecord } from "../types/subscription.types";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n";
import { ModalPortal } from "@/components/shared/ModalPortal";
import { cn } from "@/lib/utils";

type PlanId = "basic" | "silver" | "gold" | "custom";

interface CustomPlanConfig {
  annualPrice: number;
  lawyersLimit: number;
  casesLimit: number;
  storageGb: number;
}

interface ChangeSubscriptionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription?: SubscriptionRecord | null;
  onSuccess?: (planName: string, effectiveDate: string) => void;
}

export function ChangeSubscriptionPlanModal({
  isOpen,
  onClose,
  subscription,
  onSuccess,
}: ChangeSubscriptionPlanModalProps) {
  const { t } = useLanguage();
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>("gold");
  const [timingOption, setTimingOption] = useState<"immediate" | "renewal">("immediate");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customConfig, setCustomConfig] = useState<CustomPlanConfig>({
    annualPrice: 24500,
    lawyersLimit: 30,
    casesLimit: 1000,
    storageGb: 500,
  });

  if (!isOpen) return null;

  const firmName = subscription?.firm.name || t("مكتب العدل للمحاماة", "Al-Adl Law Firm");
  const currentPlan = subscription?.planName || t("الفضية", "Silver");
  const renewalDate = subscription?.renewalDate || t("15 أكتوبر 2024", "15 Oct 2024");

  const planTitleById: Record<PlanId, string> = {
    basic: t("الباقة الأساسية", "Basic Plan"),
    silver: t("الباقة الفضية", "Silver Plan"),
    gold: t("الباقة الذهبية", "Gold Plan"),
    custom: t("باقة مخصصة", "Custom Plan"),
  };

  const handleConfirmChange = () => {
    if (selectedPlanId === "custom") {
      if (
        customConfig.annualPrice <= 0 ||
        customConfig.lawyersLimit <= 0 ||
        customConfig.casesLimit <= 0 ||
        customConfig.storageGb <= 0
      ) {
        toast.error(
          t(
            "يرجى تعبئة حدود الباقة المخصصة بقيم صحيحة",
            "Please fill custom plan limits with valid values"
          )
        );
        return;
      }
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const planTitle =
        selectedPlanId === "custom"
          ? t(
              `باقة مخصصة (${customConfig.annualPrice.toLocaleString()} ر.س)`,
              `Custom Plan (${customConfig.annualPrice.toLocaleString()} SAR)`
            )
          : planTitleById[selectedPlanId];

      onSuccess?.(planTitle, timingOption);
      toast.success(
        t(
          `تم تغيير باقة اشتراك "${firmName}" إلى "${planTitle}" بنجاح`,
          `Successfully changed subscription for "${firmName}" to "${planTitle}"`
        )
      );
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  const differenceLabel =
    selectedPlanId === "gold"
      ? t("الفارق: +5,300 ر.س / سنوياً", "Difference: +5,300 SAR / yr")
      : selectedPlanId === "basic"
        ? t("الفارق: -5,700 ر.س / سنوياً", "Difference: -5,700 SAR / yr")
        : selectedPlanId === "custom"
          ? t(
              `باقة خاصة بهذا العميل • ${customConfig.annualPrice.toLocaleString()} ر.س`,
              `Client-specific plan • ${customConfig.annualPrice.toLocaleString()} SAR`
            )
          : t("نفس الباقة الحالية", "Same current plan");

  const summary = {
    storage:
      selectedPlanId === "gold"
        ? t("250 GB (مشفرة)", "250 GB (Encrypted)")
        : selectedPlanId === "basic"
          ? "50 GB"
          : selectedPlanId === "custom"
            ? `${customConfig.storageGb} GB`
            : "100 GB",
    cases:
      selectedPlanId === "gold"
        ? t("500 (بدلاً من 250)", "500 (instead of 250)")
        : selectedPlanId === "basic"
          ? t("100 قضية", "100 cases")
          : selectedPlanId === "custom"
            ? t(`${customConfig.casesLimit} قضية`, `${customConfig.casesLimit} cases`)
            : t("250 قضية", "250 cases"),
    lawyers:
      selectedPlanId === "gold"
        ? t("15 (+5 إضافي)", "15 (+5 extra)")
        : selectedPlanId === "basic"
          ? t("5 محامين", "5 lawyers")
          : selectedPlanId === "custom"
            ? t(`${customConfig.lawyersLimit} محامياً`, `${customConfig.lawyersLimit} lawyers`)
            : t("10 محامين", "10 lawyers"),
  };

  const fieldClass =
    "w-full bg-white dark:bg-[#1a1612] text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] rounded-[4px] px-3 py-2 border border-[#e4e2de] dark:border-[#38332c] focus:border-[#9c6402] focus:outline-none";

  return (
    <ModalPortal isOpen={isOpen}>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-['Cairo']"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="bg-white dark:bg-[#1e1c1a] border border-[#d6c4b1]/40 dark:border-[#38332c] rounded-[8px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col"
          data-node-id="1:6978"
          data-name="تغيير باقة الاشتراك"
          onClick={(e) => e.stopPropagation()}
        >
          {/* MODAL HEADER */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b border-[#f0eeea] dark:border-[#2f2a24] bg-white dark:bg-[#1e1c1a] shrink-0"
            data-node-id="1:6979"
          >
            <button
              type="button"
              onClick={onClose}
              className="size-8 rounded-[4px] hover:bg-[#f5f3ef] dark:hover:bg-[#2c2621] text-[#514537] dark:text-[#a89f91] flex items-center justify-center transition-colors cursor-pointer"
              aria-label={t("إغلاق النافذة", "Close window")}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-end text-start">
              <h2 className="font-bold text-[22px] text-[#1b1c1a] dark:text-[#fdfbf7] leading-[26px]">
                {t("تغيير باقة الاشتراك", "Change Subscription Plan")}
              </h2>
              <div className="flex items-center gap-1.5 text-[11px] text-[#837565] dark:text-[#a89f91] mt-0.5 font-medium flex-wrap justify-end">
                <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {firmName}
                </span>
                <span>•</span>
                <span>{t("الباقة الحالية:", "Current Plan:")}</span>
                <span className="font-bold text-[#7b4e00] dark:text-[#f59e0b]">
                  {currentPlan}
                </span>
                <span>•</span>
                <span>
                  {t("تجديد:", "Renewal:")} {renewalDate}
                </span>
              </div>
            </div>
          </div>

          {/* MODAL BODY */}
          <div className="p-6 space-y-4 overflow-y-auto">
            {/* Section 1: اختر الباقة المستهدفة */}
            <div className="space-y-2" data-node-id="1:6999">
              <div className="flex items-center gap-1.5 justify-start">
                <div className="bg-[#9c6402] h-3 w-1 rounded-full shrink-0" />
                <span className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("اختر الباقة المستهدفة", "Select Target Plan")}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* Basic */}
                <button
                  type="button"
                  onClick={() => setSelectedPlanId("basic")}
                  className={cn(
                    "p-3 rounded-[4px] border transition-all cursor-pointer flex flex-col justify-between text-start",
                    selectedPlanId === "basic"
                      ? "bg-[#fff9ee] dark:bg-[#342711] border-[#9c6402] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                      : "bg-[#f5f3ef]/50 dark:bg-[#2c2621] border-transparent hover:border-[#eae8e4] opacity-85"
                  )}
                >
                  <div className="flex items-center justify-between pb-1 gap-1">
                    <span className="text-[10px] text-[#837565] dark:text-[#a89f91] font-semibold">
                      {t("تنزيل", "Downgrade")}
                    </span>
                    <span className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {t("الأساسية", "Basic")}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-end gap-1 my-1">
                    <span className="text-[10px] text-[#837565]">{t("ر.س/سنة", "SAR/yr")}</span>
                    <span className="font-bold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                      3,500
                    </span>
                  </div>
                  <div className="text-[10px] text-[#837565] dark:text-[#a89f91]">
                    {t("حتى 5 محامين", "Up to 5 lawyers")}
                  </div>
                </button>

                {/* Silver */}
                <button
                  type="button"
                  onClick={() => setSelectedPlanId("silver")}
                  className={cn(
                    "p-3 rounded-[4px] border transition-all cursor-pointer flex flex-col justify-between text-start",
                    selectedPlanId === "silver"
                      ? "bg-[#fff9ee] dark:bg-[#342711] border-[#9c6402] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                      : "bg-[#f5f3ef]/50 dark:bg-[#2c2621] border-transparent hover:border-[#eae8e4] opacity-85"
                  )}
                >
                  <div className="flex items-center justify-between pb-1 gap-1">
                    <span className="bg-[#7b4e00]/10 text-[#7b4e00] dark:text-[#f59e0b] text-[10px] font-bold px-1.5 py-0.5 rounded-[2px]">
                      {t("الحالية", "Current")}
                    </span>
                    <span className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {t("الفضية", "Silver")}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-end gap-1 my-1">
                    <span className="text-[10px] text-[#837565]">{t("ر.س/سنة", "SAR/yr")}</span>
                    <span className="font-semibold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                      9,200
                    </span>
                  </div>
                  <div className="text-[10px] text-[#837565] dark:text-[#a89f91] font-bold">
                    {t("10 محامين", "10 lawyers")}
                  </div>
                </button>

                {/* Gold */}
                <button
                  type="button"
                  onClick={() => setSelectedPlanId("gold")}
                  className={cn(
                    "p-3 rounded-[4px] border transition-all cursor-pointer flex flex-col justify-between text-start",
                    selectedPlanId === "gold"
                      ? "bg-[#fff9ee] dark:bg-[#342711] border-[#9c6402] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                      : "bg-[#f5f3ef]/50 dark:bg-[#2c2621] border-transparent hover:border-[#eae8e4] opacity-85"
                  )}
                >
                  <div className="flex items-center justify-between pb-1 gap-1">
                    {selectedPlanId === "gold" ? (
                      <span className="bg-[#7b4e00]/20 text-[#643f00] dark:text-[#fbbf24] text-[10px] font-bold px-1.5 py-0.5 rounded-[2px]">
                        {t("المختارة", "Selected")}
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#837565]">&nbsp;</span>
                    )}
                    <div className="flex items-center gap-1 text-[#7b4e00] dark:text-[#f59e0b]">
                      {selectedPlanId === "gold" && (
                        <Check className="w-3 h-3 text-[#9c6402]" />
                      )}
                      <span className="font-bold text-[12px]">{t("الذهبية", "Gold")}</span>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-end gap-1 my-1">
                    <span className="text-[10px] text-[#514537] dark:text-[#d1c9bd]">
                      {t("ر.س/سنة", "SAR/yr")}
                    </span>
                    <span className="font-bold text-[13px] text-[#9c6402] dark:text-[#fbbf24]">
                      14,500
                    </span>
                  </div>
                  <div className="text-[10px] text-[#7b4e00] dark:text-[#fbbf24] font-medium">
                    {t("15 محامياً", "15 lawyers")}
                  </div>
                </button>

                {/* Custom */}
                <button
                  type="button"
                  onClick={() => setSelectedPlanId("custom")}
                  className={cn(
                    "p-3 rounded-[4px] border transition-all cursor-pointer flex flex-col justify-between text-start",
                    selectedPlanId === "custom"
                      ? "bg-[#fff9ee] dark:bg-[#342711] border-[#9c6402] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                      : "bg-[#f5f3ef]/50 dark:bg-[#2c2621] border-transparent hover:border-[#eae8e4] opacity-85"
                  )}
                >
                  <div className="flex items-center justify-between pb-1 gap-1">
                    <span className="bg-[#1d4ed8]/10 text-[#1d4ed8] dark:text-[#93c5fd] text-[10px] font-bold px-1.5 py-0.5 rounded-[2px]">
                      {t("مخصص", "Custom")}
                    </span>
                    <div className="flex items-center gap-1 text-[#1d4ed8] dark:text-[#93c5fd]">
                      {selectedPlanId === "custom" && (
                        <Check className="w-3 h-3 text-[#9c6402]" />
                      )}
                      <span className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                        {t("مخصصة", "Custom")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-end gap-1 my-1">
                    <span className="text-[10px] text-[#514537] dark:text-[#d1c9bd]">
                      {t("ر.س/سنة", "SAR/yr")}
                    </span>
                    <span className="font-bold text-[13px] text-[#1d4ed8] dark:text-[#93c5fd]">
                      {customConfig.annualPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#1d4ed8] dark:text-[#93c5fd] font-medium">
                    {t("لهذا العميل فقط", "For this client only")}
                  </div>
                </button>
              </div>
            </div>

            {/* Custom plan editor */}
            {selectedPlanId === "custom" && (
              <div className="bg-[#eff6ff]/70 dark:bg-[#172554]/40 border border-[#bfdbfe] dark:border-blue-500/30 rounded-[6px] p-3.5 space-y-3">
                <div className="flex items-center gap-2 justify-start">
                  <Settings2 className="size-4 text-[#1d4ed8] dark:text-[#93c5fd]" />
                  <span className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t(
                      "تخصيص الباقة لهذا العميل فقط",
                      "Customize plan for this client only"
                    )}
                  </span>
                </div>
                <p className="text-[10px] text-[#514537] dark:text-[#a89f91] text-start">
                  {t(
                    "القيم أدناه تخص هذا المكتب فقط ولن تؤثر على باقات بقية العملاء.",
                    "Values below apply to this office only and will not affect other clients' plans."
                  )}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[#514537] dark:text-[#cdc5bd] text-start">
                      {t("السعر السنوي (ر.س)", "Annual price (SAR)")}
                    </label>
                    <input
                      type="number"
                      min={1}
                      dir="ltr"
                      value={customConfig.annualPrice}
                      onChange={(e) =>
                        setCustomConfig({
                          ...customConfig,
                          annualPrice: Number(e.target.value) || 0,
                        })
                      }
                      className={fieldClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[#514537] dark:text-[#cdc5bd] text-start">
                      {t("عدد المحامين", "Lawyers limit")}
                    </label>
                    <input
                      type="number"
                      min={1}
                      dir="ltr"
                      value={customConfig.lawyersLimit}
                      onChange={(e) =>
                        setCustomConfig({
                          ...customConfig,
                          lawyersLimit: Number(e.target.value) || 0,
                        })
                      }
                      className={fieldClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[#514537] dark:text-[#cdc5bd] text-start">
                      {t("عدد القضايا", "Cases limit")}
                    </label>
                    <input
                      type="number"
                      min={1}
                      dir="ltr"
                      value={customConfig.casesLimit}
                      onChange={(e) =>
                        setCustomConfig({
                          ...customConfig,
                          casesLimit: Number(e.target.value) || 0,
                        })
                      }
                      className={fieldClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-[#514537] dark:text-[#cdc5bd] text-start">
                      {t("التخزين (GB)", "Storage (GB)")}
                    </label>
                    <input
                      type="number"
                      min={1}
                      dir="ltr"
                      value={customConfig.storageGb}
                      onChange={(e) =>
                        setCustomConfig({
                          ...customConfig,
                          storageGb: Number(e.target.value) || 0,
                        })
                      }
                      className={fieldClass}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: ملخص الفروقات الأساسية */}
            <div
              className="bg-[#f5f3ef]/60 dark:bg-[#2c2621] p-3.5 rounded-[4px] space-y-2 border border-[#f0eeea] dark:border-[#38332c]"
              data-node-id="1:7034"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="bg-[#7b4e00]/10 text-[#7b4e00] dark:text-[#fbbf24] text-[11px] font-bold px-2 py-0.5 rounded-[2px]">
                  {differenceLabel}
                </span>
                <span className="font-semibold text-[11px] text-[#514537] dark:text-[#d1c9bd]">
                  {t("ملخص الفروقات الأساسية:", "Key Differences Summary:")}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-[#eae8e4] dark:border-[#38332c]">
                <div>
                  <span className="text-[10px] text-[#837565] dark:text-[#a89f91] block">
                    {t("التخزين السحابي", "Cloud Storage")}
                  </span>
                  <span className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] mt-0.5 block">
                    {summary.storage}
                  </span>
                </div>
                <div className="border-x border-[#eae8e4] dark:border-[#38332c]">
                  <span className="text-[10px] text-[#837565] dark:text-[#a89f91] block">
                    {t("القضايا والملفات", "Cases & Files")}
                  </span>
                  <span className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] mt-0.5 block">
                    {summary.cases}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#837565] dark:text-[#a89f91] block">
                    {t("المحامين", "Lawyers")}
                  </span>
                  <span className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] mt-0.5 block">
                    {summary.lawyers}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3: موعد سريان التغيير */}
            <div className="space-y-2" data-node-id="1:7050">
              <div className="flex items-center gap-1.5 justify-start">
                <div className="bg-[#9c6402] h-3 w-1 rounded-full shrink-0" />
                <span className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("موعد سريان التغيير", "Effective Date")}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label
                  onClick={() => setTimingOption("immediate")}
                  className={cn(
                    "p-3 rounded-[4px] border flex items-center justify-between transition-all cursor-pointer",
                    timingOption === "immediate"
                      ? "border-[#9c6402] bg-[#fff9ee]/40 dark:bg-[#342711]"
                      : "border-[#e4e2de] dark:border-[#38332c] hover:bg-[#faf9f7]"
                  )}
                >
                  <div className="text-start">
                    <div className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {t("تطبيق فوري مع التسوية", "Immediate with Pro-rata Settlement")}
                    </div>
                    <div className="text-[10px] text-[#7b4e00] dark:text-[#fbbf24] mt-0.5 font-semibold">
                      {selectedPlanId === "custom"
                        ? t(
                            "تُحتسب التسوية حسب السعر المخصص",
                            "Settlement calculated from custom price"
                          )
                        : t(
                            "350.67 ر.س اليوم (فارق 21 يوماً)",
                            "350.67 SAR today (21 days difference)"
                          )}
                    </div>
                  </div>
                  <div className="size-4 rounded-full border border-[#9c6402] flex items-center justify-center p-0.5 shrink-0">
                    {timingOption === "immediate" && (
                      <div className="size-2 rounded-full bg-[#9c6402]" />
                    )}
                  </div>
                </label>

                <label
                  onClick={() => setTimingOption("renewal")}
                  className={cn(
                    "p-3 rounded-[4px] border flex items-center justify-between transition-all cursor-pointer",
                    timingOption === "renewal"
                      ? "border-[#9c6402] bg-[#fff9ee]/40 dark:bg-[#342711]"
                      : "border-[#e4e2de] dark:border-[#38332c] hover:bg-[#faf9f7]"
                  )}
                >
                  <div className="text-start">
                    <div className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {t("عند التجديد القادم", "At Next Renewal")}
                    </div>
                    <div className="text-[10px] text-[#837565] dark:text-[#a89f91] mt-0.5 font-medium">
                      {renewalDate} ({t("0.00 ر.س الآن", "0.00 SAR now")})
                    </div>
                  </div>
                  <div className="size-4 rounded-full border border-[#767676] flex items-center justify-center p-0.5 shrink-0">
                    {timingOption === "renewal" && (
                      <div className="size-2 rounded-full bg-[#9c6402]" />
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* MODAL FOOTER */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#faf9f7] dark:bg-[#25221e] border-t border-[#f0eeea] dark:border-[#2f2a24] shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-[4px] bg-[#f5f3ef] dark:bg-[#2c2621] hover:bg-[#eae8e4] text-[#514537] dark:text-[#a89f91] text-[12px] font-semibold transition-colors cursor-pointer"
            >
              {t("إلغاء", "Cancel")}
            </button>
            <button
              type="button"
              onClick={handleConfirmChange}
              disabled={isSubmitting}
              className="bg-[#9c6402] hover:bg-[#825200] text-white px-5 py-2 rounded-[4px] font-bold text-[12px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <CheckCheck className="w-4 h-4" />
              <span>
                {selectedPlanId === "custom"
                  ? t("تطبيق الباقة المخصصة", "Apply Custom Plan")
                  : t("تغيير الباقة", "Change Plan")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
