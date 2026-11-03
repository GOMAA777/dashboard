"use client";

import React from "react";
import {
  X,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Headphones,
  FileCheck,
  TrendingUp,
  ArrowUpRight,
  Gift,
  Clock,
  Layers,
} from "lucide-react";
import { ClientOffice } from "../types/client.types";
import { useLanguage } from "@/lib/i18n";
import { ModalPortal } from "@/components/shared/ModalPortal";

interface AnnualPlanBenefitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  office: ClientOffice | null;
  onUpgradeToAnnual?: () => void;
}

export function AnnualPlanBenefitsModal({
  isOpen,
  onClose,
  office,
  onUpgradeToAnnual,
}: AnnualPlanBenefitsModalProps) {
  const { isEn, t } = useLanguage();

  if (!isOpen) return null;

  const currentPlanName = office?.plan || t("الباقة المعتمدة", "Approved Plan");
  const monthlyPrice = Number(
    office?.activeSubscriptionDetails?.amount ||
      office?.planDetails?.monthlyPrice ||
      500
  );
  const yearlyPrice = Number(
    office?.planDetails?.yearlyPrice || monthlyPrice * 10
  );
  const yearlyRegularCost = monthlyPrice * 12;
  const directSavings = Math.max(0, yearlyRegularCost - yearlyPrice);
  const discountPercent =
    yearlyRegularCost > 0
      ? Math.round((directSavings / yearlyRegularCost) * 100)
      : 20;

  const benefits = [
    {
      icon: Gift,
      color: "text-[#9c6402] dark:text-[#f3c27e] bg-[#fef3c7] dark:bg-[#3d2919]",
      title: t("وفر مالي يعادل شهرين مجاناً", "Save 2 Full Months Free"),
      description: t(
        "سداد قيمة 10 أشهر فقط والاستفادة الكاملة من كافة إمكانيات ومقاعد المنظومة لمدة 12 شهراً متواصلاً.",
        "Pay for only 10 months and enjoy full platform capabilities for 12 continuous months."
      ),
    },
    {
      icon: ShieldCheck,
      color: "text-[#1b7340] dark:text-[#6ee7b7] bg-[#e8f5e9] dark:bg-[#132c1c]",
      title: t("تثبيت السعر والحماية من الزيادات", "Price Lock & Protection"),
      description: t(
        "حماية تعاقدية لمكتبك ضد أي تعديلات أو زيادات في تسعير الباقات أو الخدمات السحابية طوال مدة الاشتراك.",
        "Contractual price guarantee for your firm against any future price increases throughout the year."
      ),
    },
    {
      icon: Zap,
      color: "text-[#b45309] dark:text-[#fcd34d] bg-[#fffbeb] dark:bg-[#38271c]",
      title: t("استمرارية الأعمال دون انقطاع", "Uninterrupted Service"),
      description: t(
        "تجنب تعليق الصلاحيات أو توقف الوصول لملفات القضايا والموكلين بسبب انتهاء الفوترة الشهرية أو تأخر بطاقات الدفع.",
        "Zero downtime risk from expired monthly invoices or payment card renewals."
      ),
    },
    {
      icon: Headphones,
      color: "text-[#0284c7] dark:text-[#38bdf8] bg-[#e0f2fe] dark:bg-[#082f49]",
      title: t("أولوية الدعم الفني VIP", "Priority VIP Support"),
      description: t(
        "أولوية قصوى لكافة التذاكر والاستفسارات مع توجيه مباشر لمدير حساب مخصص وفريق الدعم القضائي المتقدم.",
        "Top queue priority for tickets with direct routing to a dedicated account manager."
      ),
    },
    {
      icon: FileCheck,
      color: "text-[#7c3aed] dark:text-[#c084fc] bg-[#f3e8ff] dark:bg-[#2e1065]",
      title: t("فاتورة ضريبية موحدة معتمدة", "Unified Certified Tax Invoice"),
      description: t(
        "فاتورة إلكترونية موحدة متوافقة كلياً مع متطلبات هيئة الزكاة والضريبة والجمارك (ZATCA) لتسهيل المحاسبة السنوية.",
        "A single annual ZATCA-compliant certified tax invoice for simplified financial reporting."
      ),
    },
    {
      icon: TrendingUp,
      color: "text-[#d97706] dark:text-[#fbbf24] bg-[#fef3c7] dark:bg-[#451a03]",
      title: t("مرونة توسعة الموارد والمقاعد", "Flexible Scalability"),
      description: t(
        "إمكانية ترقية عدد مقاعد المحامين وزيادة المساحة التخزينية للقضايا بأسعار الحزم السنوية المخفضة في أي وقت.",
        "Upgrade seats and cloud storage space at discounted annual rates anytime."
      ),
    },
  ];

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div
          role="dialog"
          aria-modal="true"
          className="bg-white dark:bg-[#1c140f] border border-[#eae8e4] dark:border-[#38271c] rounded-[10px] shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden text-start"
        >
          {/* Header */}
          <div className="bg-[#f5f3ef] dark:bg-[#251a13] border-b border-[#eae8e4] dark:border-[#38271c] px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-full bg-[#9c6402] dark:bg-[#c29547] text-white dark:text-[#1c140f] flex items-center justify-center shadow-xs">
                <Sparkles className="size-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t(
                    "مميزات وعوائد الاشتراك السنوي",
                    "Annual Subscription Benefits"
                  )}
                </h3>
                <span className="text-[11px] text-[#837565] dark:text-[#a89f91]">
                  {t(
                    "مقارنة المزايا الحصرية والوفر المالي المباشر لمكتبكم",
                    "Exclusive benefits and direct cost savings for your law firm"
                  )}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="size-8 rounded-[6px] hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center text-[#837565] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-white transition-colors cursor-pointer"
              title={t("إغلاق", "Close")}
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 overflow-y-auto space-y-4 text-start">
            {/* Hero Savings Banner */}
            <div className="bg-gradient-to-br from-[#1c140f] via-[#2c1e15] to-[#3a271c] text-white rounded-[8px] p-4 sm:p-5 border border-transparent dark:border-[#4d3627] relative overflow-hidden shadow-sm">
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#ffddb6] text-[#7b4e00] font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {t("عرض مميز وموصى به", "Recommended Deal")}
                    </span>
                    <span className="text-[11px] text-[#ffddb6] font-semibold">
                      {currentPlanName}
                    </span>
                  </div>

                  <h4 className="text-[19px] sm:text-[21px] font-bold text-white mt-1.5 leading-tight">
                    {t(
                      "وفر شهرين مجاناً كل سنة (خصم حتى 20%)",
                      "Save 2 Months Free Every Year (Up to 20% Off)"
                    )}
                  </h4>

                  <p className="text-[12px] text-[#cdc5bd] mt-1 leading-relaxed">
                    {t(
                      "بدلاً من السداد الشهري المتكرر، انتقل للخطة السنوية واحصل على استقرار تشغيلي كامل لمكتبك مع وفر مالي مباشر.",
                      "Switch to annual billing to gain continuous stability and immediate financial savings for your practice."
                    )}
                  </p>
                </div>

                {/* Savings Pill */}
                {directSavings > 0 && (
                  <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-[6px] p-3 flex flex-col items-center justify-center text-center shrink-0 min-w-[140px]">
                    <span className="text-[10px] text-[#cdc5bd]">
                      {t("إجمالي التوفير السنوي", "Annual Savings")}
                    </span>
                    <span className="text-[22px] font-extrabold text-[#ffddb6] font-mono leading-none my-1">
                      {directSavings.toLocaleString("en-US")} {t("ر.س", "SAR")}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-400">
                      {t("خصم يعادل شهرين", "Equals 2 free months")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Comparison Box */}
            <div className="bg-[#f5f3ef] dark:bg-[#251a13] border border-[#eae8e4] dark:border-[#38271c] rounded-[6px] p-3 text-[11px]">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="flex flex-col bg-white dark:bg-[#1c140f] p-2.5 rounded border border-[#eae8e4] dark:border-[#38271c]">
                  <span className="text-[#837565] dark:text-[#8e8680]">
                    {t("الاشتراك الشهري الحالي", "Current Monthly")}
                  </span>
                  <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] font-mono mt-0.5">
                    {monthlyPrice.toLocaleString("en-US")} {t("ر.س / شهر", "SAR/mo")}
                  </span>
                </div>

                <div className="flex flex-col bg-white dark:bg-[#1c140f] p-2.5 rounded border border-[#eae8e4] dark:border-[#38271c]">
                  <span className="text-[#837565] dark:text-[#8e8680]">
                    {t("التكلفة الشهرية لمدة عام", "12 Months Regular")}
                  </span>
                  <span className="text-[13px] font-bold text-[#837565] dark:text-[#a89f91] font-mono line-through mt-0.5">
                    {yearlyRegularCost.toLocaleString("en-US")} {t("ر.س", "SAR")}
                  </span>
                </div>

                <div className="flex flex-col bg-white dark:bg-[#1c140f] p-2.5 rounded border border-[#9c6402]/30 dark:border-[#c29547]/30 ring-1 ring-[#9c6402]/20">
                  <span className="text-[#9c6402] dark:text-[#f3c27e] font-bold">
                    {t("الاشتراك السنوي بعد الخصم", "Annual Plan Price")}
                  </span>
                  <span className="text-[13px] font-bold text-[#9c6402] dark:text-[#f3c27e] font-mono mt-0.5">
                    {yearlyPrice.toLocaleString("en-US")} {t("ر.س / سنة", "SAR/yr")}
                  </span>
                </div>

                <div className="flex flex-col bg-emerald-50 dark:bg-[#132c1c] p-2.5 rounded border border-emerald-200 dark:border-emerald-500/30">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                    {t("نسبة التوفير الصافية", "Net Savings Rate")}
                  </span>
                  <span className="text-[13px] font-bold text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
                    {discountPercent}% {t("وفر مباشر", "Direct")}
                  </span>
                </div>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="flex flex-col gap-2 pt-1">
              <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1.5">
                <Layers className="size-3.5 text-[#9c6402] dark:text-[#e29d38]" />
                <span>{t("المزايا الحصرية للاشتراك السنوي", "Exclusive Annual Perks")}</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {benefits.map((benefit, idx) => {
                  const Icon = benefit.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-white dark:bg-[#251a13] border border-[#eae8e4] dark:border-[#38271c] rounded-[6px] p-3 flex items-start gap-3 hover:border-[#9c6402]/40 transition-colors"
                    >
                      <div
                        className={`size-8 rounded-[6px] flex items-center justify-center shrink-0 ${benefit.color}`}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-tight">
                          {benefit.title}
                        </span>
                        <p className="text-[11px] text-[#514537] dark:text-[#cdc5bd] mt-1 leading-[16px]">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="bg-[#f5f3ef] dark:bg-[#251a13] border-t border-[#eae8e4] dark:border-[#38271c] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] text-[#837565] dark:text-[#a89f91]">
              <Clock className="size-3.5" />
              <span>
                {t(
                  "يتم تطبيق الترقية السنوية فوراً أو مع بداية الدورة القادمة",
                  "Annual upgrade applies immediately or next billing cycle"
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-white dark:bg-[#1c140f] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] border border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] px-3.5 py-1.5 rounded-[4px] text-[12px] font-semibold transition-colors cursor-pointer"
              >
                {t("إغلاق", "Close")}
              </button>

              {onUpgradeToAnnual && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onUpgradeToAnnual();
                  }}
                  className="bg-[#9c6402] hover:bg-[#855402] text-white px-4 py-1.5 rounded-[4px] text-[12px] font-bold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="size-3.5" />
                  <span>
                    {t(
                      "التحويل إلى الاشتراك السنوي الآن",
                      "Switch to Annual Now"
                    )}
                  </span>
                  <ArrowUpRight className="size-3.5 rtl:rotate-[-90deg]" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
