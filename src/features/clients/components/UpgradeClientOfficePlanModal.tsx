"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  Check,
  CheckCircle2,
  Users,
  Briefcase,
  HardDrive,
  Headphones,
  ShieldCheck,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import { ClientOffice } from "../types/client.types";
import { useLanguage } from "@/lib/i18n";
import { ModalPortal } from "@/components/shared/ModalPortal";

export interface AvailablePlan {
  id: string;
  name: string;
  badge?: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  lawyersLimit: string;
  casesLimit: string;
  storageLimit: string;
  supportLevel: string;
  features: string[];
  isPopular?: boolean;
}

export const PLATFORM_PLANS: AvailablePlan[] = [
  {
    id: "basic",
    name: "الباقة الأساسية",
    badge: "للممارسين المستقلين",
    monthlyPrice: 199,
    annualPrice: 2029,
    description: "مثالية للمحامين المستقلين والمكاتب الناشئة لبدء أتمتة العمليات الأساسية.",
    lawyersLimit: "2 محامين ومستشارين",
    casesLimit: "50 قضية نشطة",
    storageLimit: "5 GB سعة سحابية",
    supportLevel: "دعم فني قياسي (24 ساعة)",
    features: [
      "الربط الأساسي مع منصة ناجز",
      "الفوترة الإلكترونية الأساسية",
      "تقارير قضايا ومذكرات مبسطة",
    ],
  },
  {
    id: "silver",
    name: "الباقة الفضية",
    badge: "للفرق النامية",
    monthlyPrice: 399,
    annualPrice: 4068,
    description: "للفرق القانونية النامية التي تتطلب متابعة أوسع للجلسات والمستندات.",
    lawyersLimit: "4 محامين ومستشارين",
    casesLimit: "200 قضية نشطة",
    storageLimit: "20 GB سعة سحابية",
    supportLevel: "دعم ذو أولوية (4 ساعات)",
    features: [
      "مزامنة تلقائية مع ناجز ووزارة العدل",
      "فوترة ZATCA المرحلة الثانية برمز QR",
      "تقارير متقدمة لمعدلات إنجاز القضايا",
    ],
  },
  {
    id: "pro",
    name: "الباقة الاحترافية",
    badge: "الأكثر طلباً • الموصى بها",
    monthlyPrice: 750,
    annualPrice: 7650,
    description: "الخيار الأمثل للمكاتب النشطة ذات الحجم المتوسط وأعباء العمل اليومية العالية.",
    lawyersLimit: "15 محامياً ومستشاراً",
    casesLimit: "قضايا وجلسات غير محدودة",
    storageLimit: "100 GB سعة سحابية مؤمنة",
    supportLevel: "دعم فني مباشر فوري (VIP)",
    features: [
      "ربط مباشر وشامل مع كافة بوابات القضاء",
      "فوترة إلكترونية متقدمة وسندات قبض متعددة",
      "لوحات تحليلات الذكاء القضائي ومؤشرات الأداء",
      "إدارة متقدمة لصلاحيات أعضاء الفريق",
    ],
    isPopular: true,
  },
  {
    id: "enterprise",
    name: "باقة الشركات",
    badge: "للمكاتب الكبرى",
    monthlyPrice: 1450,
    annualPrice: 14790,
    description: "حلول شاملة للشركات المهنية القانونية الكبرى مع مدير حساب مخصص وسعة موسعة.",
    lawyersLimit: "25 محامياً ومستشاراً",
    casesLimit: "قضايا غير محدودة",
    storageLimit: "250 GB سعة تخزين سحابية",
    supportLevel: "مدير حساب استشاري مخصص على مدار الساعة",
    features: [
      "مدير حساب شخصي معتمد للمكتب",
      "تحليلات الذكاء القضائي والتنبؤ بالأحكام",
      "ربط API مخصص مع أنظمة ERP والمالية",
      "نسخ احتياطي فوري وسيرفر سحابي معزول",
    ],
  },
  {
    id: "custom",
    name: "الباقة المخصصة (SLA المؤسسي)",
    badge: "مؤسسية مخصصة",
    monthlyPrice: 2200,
    annualPrice: 22440,
    description: "مرونة مطلقة واتفاقية مستوى خدمة مخصصة تلبي كافة الاحتياجات التنظيمية المعقدة.",
    lawyersLimit: "غير محدود من المحامين والمستشارين",
    casesLimit: "غير محدود من القضايا والوكلاء",
    storageLimit: "500 GB سعة سحابية مخصصة",
    supportLevel: "فريق دعم وتقنية مخصص 24/7",
    features: [
      "تخصيص كامل لواجهة النظام وهوية المكتب",
      "تكامل API ثنائي الاتجاه مع أنظمة ERP و CRM",
      "أعلى معايير تشفير وأمان متوافقة مع الأمن السيبراني",
      "تدريب ميداني وإعداد مخصص لفريق المكتب",
    ],
  },
];

interface UpgradeClientOfficePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  office?: ClientOffice | null;
  currentPlan?: string;
  onUpgrade?: (newPlan: string) => void;
  onConfirmUpgrade?: (officeId: string, newPlanName: string, effectiveDate: "immediate" | "next_cycle") => void;
}

export function UpgradeClientOfficePlanModal({
  isOpen,
  onClose,
  office,
  currentPlan,
  onUpgrade,
  onConfirmUpgrade,
}: UpgradeClientOfficePlanModalProps) {
  const { t } = useLanguage();

  // Determine currently active plan from office
  const currentOfficePlan = office?.plan || currentPlan || "الباقة الاحترافية";

  // Pre-select next tier or Pro
  const [selectedPlanId, setSelectedPlanId] = useState<string>(() => {
    if (currentOfficePlan.includes("أساسية")) return "silver";
    if (currentOfficePlan.includes("فضية")) return "pro";
    if (currentOfficePlan.includes("احترافية")) return "enterprise";
    if (currentOfficePlan.includes("شركات")) return "custom";
    return "enterprise";
  });

  const [effectiveOption, setEffectiveOption] = useState<"immediate" | "next_cycle">("immediate");
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customAnnualPrice, setCustomAnnualPrice] = useState(22440);
  const [customLawyers, setCustomLawyers] = useState(50);
  const [customCases, setCustomCases] = useState(2000);
  const [customStorageGb, setCustomStorageGb] = useState(500);

  if (!isOpen) return null;

  const selectedPlan = PLATFORM_PLANS.find((p) => p.id === selectedPlanId) || PLATFORM_PLANS[2];

  const resolvedPlanName =
    selectedPlanId === "custom"
      ? t(
          `باقة مخصصة (${customAnnualPrice.toLocaleString()} ر.س)`,
          `Custom Plan (${customAnnualPrice.toLocaleString()} SAR)`
        )
      : selectedPlan.name;

  const handleConfirm = () => {
    if (selectedPlanId === "custom" && customAnnualPrice <= 0) {
      toast.error(
        t("أدخل سعراً صالحاً للباقة المخصصة", "Enter a valid custom plan price")
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      if (onUpgrade) {
        onUpgrade(resolvedPlanName);
      }
      if (onConfirmUpgrade && office) {
        onConfirmUpgrade(office.id, resolvedPlanName, effectiveOption);
      }
      const officeTitle = office ? `"${office.name}" ` : "";
      toast.success(
        t(
          `تمت ترقية الاشتراك ${officeTitle}إلى "${resolvedPlanName}" بنجاح.`,
          `Successfully upgraded subscription ${officeTitle}to "${resolvedPlanName}".`
        )
      );
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <ModalPortal isOpen={isOpen}>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs font-['Cairo',sans-serif] animate-in fade-in duration-150"
        data-node-id="upgrade-plan-modal"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="relative w-full max-w-4xl bg-white dark:bg-[#1e1c1a] rounded-[12px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.35)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col max-h-[92vh] overflow-hidden"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
        {/* ======================================================== */}
        {/* 1. MODAL HEADER */}
        {/* ======================================================== */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#f0eeea] dark:border-[#38271c] bg-white dark:bg-[#1e1c1a] shrink-0">
          {/* Close button (Left in RTL) */}
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-[4px] hover:bg-[#f5f3ef] dark:hover:bg-[#2c221a] text-[#837565] hover:text-[#1b1c1a] dark:text-[#a89f91] dark:hover:text-[#fdfbf7] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="إغلاق النافذة"
          >
            <X className="size-5" />
          </button>

          {/* Title & Target Office Info (Right in RTL) */}
          <div className="flex items-center gap-3 text-start">
            <div className="flex flex-col text-start">
              <div className="flex items-center gap-2">
                <h2 className="text-[19px] sm:text-[21px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[26px]">
                  {t("ترقية باقة اشتراك المنشأة", "Upgrade Law Firm Plan")}
                </h2>
                {office?.name && (
                  <span className="bg-[#ffddb6]/40 dark:bg-[rgba(226,157,56,0.18)] text-[#9c6402] dark:text-[#f3c27e] border border-[#ffddb6] dark:border-[#e29d38]/50 text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {office.name}
                  </span>
                )}
              </div>
              <p className="text-[12px] text-[#514537] dark:text-[#cdc5bd] mt-0.5">
                {t("اختر الباقة المناسبة لتوسيع مقاعد المستخدمين، سعة التخزين، والمزايا القضائية المتقدمة للمكتب.", "Select a higher tier to increase user seats, storage quota, and access advanced legal features.")}
              </p>
            </div>

            <div className="size-[42px] rounded-[8px] bg-[#9c6402] dark:bg-[#c29547] text-white dark:text-[#1c140f] flex items-center justify-center shadow-xs shrink-0">
              <Sparkles className="size-5" />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. MODAL BODY (SCROLLABLE) */}
        {/* ======================================================== */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
          {/* Billing Cycle Switcher */}
          <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-[#eae8e4] dark:border-[#38271c] rounded-[8px] p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-start">
              <ShieldCheck className="size-4 text-[#059669] dark:text-[#10b981] shrink-0" />
              <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("الباقة الحالية للمكتب:", "Current Active Plan:")}{" "}
                <strong className="text-[#9c6402] dark:text-[#e29d38]">{currentOfficePlan}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1 bg-white dark:bg-[#1a120d] p-1 rounded-[6px] border border-[#eae8e4] dark:border-[#38271c] self-stretch sm:self-auto">
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={`flex-1 sm:flex-initial px-3 py-1 rounded-[4px] text-[11px] font-bold transition-all cursor-pointer ${
                  billingCycle === "annual"
                    ? "bg-[#9c6402] dark:bg-[#c29547] text-white dark:text-[#1c140f] shadow-xs"
                    : "text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7]"
                }`}
              >
                <span>{t("اشتراك سنوي (خصم 15%)", "Annual (15% Off)")}</span>
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`flex-1 sm:flex-initial px-3 py-1 rounded-[4px] text-[11px] font-bold transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-[#9c6402] dark:bg-[#c29547] text-white dark:text-[#1c140f] shadow-xs"
                    : "text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7]"
                }`}
              >
                <span>{t("اشتراك شهري", "Monthly")}</span>
              </button>
            </div>
          </div>

          {/* Available Plans Cards Grid */}
          <div className="space-y-3 text-start">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#837565] dark:text-[#a89f91]">
                {t("حدد الباقة المستهدفة للترقية الفورية أو عند التجديد", "Select target tier to apply immediately or on next renewal")}
              </span>
              <h3 className="text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("جميع الباقات المتاحة للمكتب:", "All Available Platform Plans:")}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {PLATFORM_PLANS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                const isCurrent = currentOfficePlan.includes(plan.name) || currentOfficePlan.includes(plan.id);
                const displayPrice = billingCycle === "annual" ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice;

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`relative rounded-[8px] p-4 flex flex-col justify-between transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-[#fffdfa] dark:bg-[#251911] border-[#9c6402] dark:border-[#e29d38] ring-2 ring-[#9c6402] dark:ring-[#e29d38] shadow-md"
                        : "bg-white dark:bg-[#221812] border-[#eae8e4] dark:border-[#38271c] hover:border-[#9c6402]/50 dark:hover:border-[#e29d38]/50"
                    }`}
                  >
                    {/* Top Badges */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex flex-wrap gap-1">
                        {isCurrent && (
                          <span className="bg-[#e8f5e9] dark:bg-[#132c1c] text-[#1b7340] dark:text-[#6ee7b7] border border-[#c8e6c9] dark:border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {t("الباقة الحالية", "Current Plan")}
                          </span>
                        )}
                        {plan.isPopular && (
                          <span className="bg-[#fffbeb] dark:bg-[#2e1d0f] text-[#b45309] dark:text-[#f3c27e] border border-amber-300 dark:border-[#e29d38]/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {t("الأكثر طلباً", "Popular")}
                          </span>
                        )}
                      </div>

                      {/* Selection Radio */}
                      <div
                        className={`size-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f]"
                            : "border border-[#d6cfc7] dark:border-[#4d3a2e]"
                        }`}
                      >
                        {isSelected && <Check className="size-3 stroke-[3]" />}
                      </div>
                    </div>

                    {/* Plan Name & Price */}
                    <div className="text-start">
                      <h4 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                        {plan.name}
                      </h4>
                      <p className="text-[11px] text-[#514537] dark:text-[#cdc5bd] mt-0.5 line-clamp-2 leading-[16px]">
                        {plan.description}
                      </p>

                      <div className="flex items-baseline gap-1.5 mt-3 pt-2 border-t border-[#f0eeea] dark:border-[#38271c]">
                        <span className="text-[24px] font-extrabold text-[#1b1c1a] dark:text-[#fdfbf7] leading-none">
                          {displayPrice}
                        </span>
                        <span className="text-[11px] text-[#837565] dark:text-[#a89f91] font-semibold">
                          ر.س / شهرياً {billingCycle === "annual" ? "(تدفع سنوياً)" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Capacity Limits & Features */}
                    <div className="mt-3.5 space-y-2 pt-2.5 border-t border-[#f0eeea] dark:border-[#38271c] text-[11px]">
                      <div className="flex items-center gap-2 text-[#1b1c1a] dark:text-[#fdfbf7]">
                        <Users className="size-3.5 text-[#9c6402] dark:text-[#e29d38] shrink-0" />
                        <span>{plan.lawyersLimit}</span>
                      </div>

                      <div className="flex items-center gap-2 text-[#1b1c1a] dark:text-[#fdfbf7]">
                        <Briefcase className="size-3.5 text-[#9c6402] dark:text-[#e29d38] shrink-0" />
                        <span>{plan.casesLimit}</span>
                      </div>

                      <div className="flex items-center gap-2 text-[#1b1c1a] dark:text-[#fdfbf7]">
                        <HardDrive className="size-3.5 text-[#9c6402] dark:text-[#e29d38] shrink-0" />
                        <span>{plan.storageLimit}</span>
                      </div>

                      <div className="flex items-center gap-2 text-[#1b1c1a] dark:text-[#fdfbf7]">
                        <Headphones className="size-3.5 text-[#9c6402] dark:text-[#e29d38] shrink-0" />
                        <span>{plan.supportLevel}</span>
                      </div>

                      {/* Top Included Features */}
                      <div className="pt-2 border-t border-dashed border-[#eae8e4] dark:border-[#38271c] space-y-1">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[10px] text-[#514537] dark:text-[#cdc5bd]">
                            <CheckCircle2 className="size-3 text-[#059669] dark:text-[#10b981] shrink-0 mt-0.5" />
                            <span className="leading-[14px]">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {selectedPlanId === "custom" && (
            <div className="bg-[#eff6ff]/70 dark:bg-[#172554]/40 border border-[#bfdbfe] dark:border-blue-500/30 rounded-[8px] p-4 space-y-3 text-start">
              <h4 className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t(
                  "تخصيص الباقة لهذا العميل فقط",
                  "Customize plan for this client only"
                )}
              </h4>
              <p className="text-[11px] text-[#514537] dark:text-[#a89f91]">
                {t(
                  "يمكنك ضبط السعر والحدود لهذا المكتب دون التأثير على باقي العملاء.",
                  "Adjust price and limits for this office without affecting other clients."
                )}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-[#514537] dark:text-[#cdc5bd]">
                    {t("السعر السنوي", "Annual price")}
                  </label>
                  <input
                    type="number"
                    min={1}
                    dir="ltr"
                    value={customAnnualPrice}
                    onChange={(e) => setCustomAnnualPrice(Number(e.target.value) || 0)}
                    className="w-full bg-white dark:bg-[#1a120d] border border-[#eae8e4] dark:border-[#38271c] rounded-[6px] px-3 py-2 text-[12px] focus:border-[#9c6402] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-[#514537] dark:text-[#cdc5bd]">
                    {t("المحامون", "Lawyers")}
                  </label>
                  <input
                    type="number"
                    min={1}
                    dir="ltr"
                    value={customLawyers}
                    onChange={(e) => setCustomLawyers(Number(e.target.value) || 0)}
                    className="w-full bg-white dark:bg-[#1a120d] border border-[#eae8e4] dark:border-[#38271c] rounded-[6px] px-3 py-2 text-[12px] focus:border-[#9c6402] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-[#514537] dark:text-[#cdc5bd]">
                    {t("القضايا", "Cases")}
                  </label>
                  <input
                    type="number"
                    min={1}
                    dir="ltr"
                    value={customCases}
                    onChange={(e) => setCustomCases(Number(e.target.value) || 0)}
                    className="w-full bg-white dark:bg-[#1a120d] border border-[#eae8e4] dark:border-[#38271c] rounded-[6px] px-3 py-2 text-[12px] focus:border-[#9c6402] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-[#514537] dark:text-[#cdc5bd]">
                    {t("التخزين GB", "Storage GB")}
                  </label>
                  <input
                    type="number"
                    min={1}
                    dir="ltr"
                    value={customStorageGb}
                    onChange={(e) => setCustomStorageGb(Number(e.target.value) || 0)}
                    className="w-full bg-white dark:bg-[#1a120d] border border-[#eae8e4] dark:border-[#38271c] rounded-[6px] px-3 py-2 text-[12px] focus:border-[#9c6402] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Timing Option (Immediate vs Next Cycle) */}
          <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-[#eae8e4] dark:border-[#38271c] rounded-[8px] p-4 text-start space-y-2.5">
            <h4 className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {t("موعد تفعيل وتطبيق الترقية:", "Effective Date of Upgrade:")}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setEffectiveOption("immediate")}
                className={`flex items-start gap-3 p-3 rounded-[6px] border cursor-pointer transition-all ${
                  effectiveOption === "immediate"
                    ? "bg-white dark:bg-[#1f1610] border-[#9c6402] dark:border-[#e29d38] ring-1 ring-[#9c6402] dark:ring-[#e29d38]"
                    : "bg-white/60 dark:bg-[#1a120d] border-transparent hover:border-[#eae8e4] dark:hover:border-[#38271c]"
                }`}
              >
                <input
                  type="radio"
                  name="effective_option"
                  checked={effectiveOption === "immediate"}
                  onChange={() => setEffectiveOption("immediate")}
                  className="mt-1 text-[#9c6402] focus:ring-[#9c6402]"
                />
                <div className="flex flex-col text-start">
                  <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("تطبيق الترقية فورياً (موصى به)", "Apply Upgrade Immediately (Recommended)")}
                  </span>
                  <span className="text-[10px] text-[#514537] dark:text-[#a89f91] mt-0.5 leading-[15px]">
                    {t("ترقية الموارد وسعة المقاعد لحظياً وإصدار فاتورة فرق الباقة التناسبية تلقائياً.", "Instantly upgrades seats and storage, calculating prorated difference on invoice.")}
                  </span>
                </div>
              </label>

              <label
                onClick={() => setEffectiveOption("next_cycle")}
                className={`flex items-start gap-3 p-3 rounded-[6px] border cursor-pointer transition-all ${
                  effectiveOption === "next_cycle"
                    ? "bg-white dark:bg-[#1f1610] border-[#9c6402] dark:border-[#e29d38] ring-1 ring-[#9c6402] dark:ring-[#e29d38]"
                    : "bg-white/60 dark:bg-[#1a120d] border-transparent hover:border-[#eae8e4] dark:hover:border-[#38271c]"
                }`}
              >
                <input
                  type="radio"
                  name="effective_option"
                  checked={effectiveOption === "next_cycle"}
                  onChange={() => setEffectiveOption("next_cycle")}
                  className="mt-1 text-[#9c6402] focus:ring-[#9c6402]"
                />
                <div className="flex flex-col text-start">
                  <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("مع بداية دورة التجديد القادمة", "Upon Next Renewal Cycle")}
                  </span>
                  <span className="text-[10px] text-[#514537] dark:text-[#a89f91] mt-0.5 leading-[15px]">
                    {t("يستمر المكتب على الباقة الحالية حتى تاريخ انتهاء الاشتراك، ثم تُطبّق الباقة الجديدة.", "Maintains current plan limits until active expiration date, then switches automatically.")}
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. MODAL FOOTER */}
        {/* ======================================================== */}
        <div className="p-4 sm:p-5 border-t border-[#f0eeea] dark:border-[#38271c] bg-white dark:bg-[#1e1c1a] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-[12px] text-[#514537] dark:text-[#cdc5bd] self-start sm:self-auto">
            <Clock className="size-4 text-[#9c6402] dark:text-[#e29d38] shrink-0" />
            <span>
              {t("الباقة المختارة:", "Selected Tier:")}{" "}
              <strong className="text-[#1b1c1a] dark:text-[#fdfbf7] font-bold">{selectedPlan.name}</strong>{" "}
              ({selectedPlan.monthlyPrice} ر.س / شهرياً)
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial bg-[#f0eeea] dark:bg-[#281c15] hover:bg-[#eae8e4] dark:hover:bg-[#34241b] text-[#1b1c1a] dark:text-[#fdfbf7] border border-[#eae8e4] dark:border-[#38271c] px-5 py-2.5 rounded-[4px] text-[13px] font-semibold transition-colors cursor-pointer"
            >
              {t("إلغاء", "Cancel")}
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial bg-[#9c6402] hover:bg-[#855402] dark:bg-[#c29547] dark:hover:bg-[#b0833b] text-white dark:text-[#1c140f] px-6 py-2.5 rounded-[4px] text-[13px] font-bold shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? t("جاري الترقية...", "Upgrading...") : t("تأكيد ترقية الباقة", "Confirm Plan Upgrade")}</span>
              <ArrowUpRight className="size-4 rtl:rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </ModalPortal>
  );
}

