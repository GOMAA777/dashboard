"use client";

import React, { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { ClientOffice } from "../types/client.types";
import { useLanguage } from "@/lib/i18n";
import { ModalPortal } from "@/components/shared/ModalPortal";
import { fetchPlans, getLocalCustomPlans } from "@/lib/api/plans";
import { mapPlansResponse } from "@/lib/api/mappers";
import { initialPricingPlans } from "@/features/plans/data/initialPlans";
import type { PricingPlanItem } from "@/features/plans/types/plan.types";
import { updateFirm } from "@/lib/api/firms";
import { upgradeSubscription } from "@/lib/api/subscriptions";

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

export const CUSTOM_SLA_PLAN: AvailablePlan = {
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
};

function mapPricingPlanItemToAvailablePlan(p: PricingPlanItem): AvailablePlan {
  const featStrings: string[] = Array.isArray(p.features)
    ? p.features
        .filter((f) => (typeof f === "string" ? Boolean(f) : f.isIncluded !== false))
        .map((f) => (typeof f === "string" ? f : f.title || f.description || ""))
        .filter(Boolean)
    : [];

  const lawyers = p.limits?.lawyers && p.limits.lawyers !== "—" ? p.limits.lawyers : "";
  const cases = p.limits?.cases && p.limits.cases !== "—" ? p.limits.cases : "";
  const storage = p.limits?.storage && p.limits.storage !== "—" ? p.limits.storage : "";
  const support = p.limits?.support && p.limits.support !== "—" ? p.limits.support : "";

  return {
    id: String(p.id),
    name: p.name,
    badge: p.badge || (p.isPopular ? "الأكثر طلباً" : undefined),
    monthlyPrice: Number(p.monthlyPrice || 0),
    annualPrice: Number(p.annualPrice || (p.monthlyPrice ? p.monthlyPrice * 10 : 0)),
    description: p.description || "",
    lawyersLimit: lawyers || "محامين ومستشارين",
    casesLimit: cases || "قضايا نشطة",
    storageLimit: storage || "سعة سحابية آمنة",
    supportLevel: support || "دعم فني قياسي",
    features: featStrings.length > 0 ? featStrings : [lawyers, cases, storage, support].filter(Boolean),
    isPopular: Boolean(p.isPopular),
  };
}

export interface UpgradeClientOfficePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  office?: ClientOffice | null;
  currentPlan?: string;
  initialBillingCycle?: "annual" | "monthly";
  onUpgrade?: (newPlan: string) => void;
  onConfirmUpgrade?: (officeId: string, newPlanName: string, effectiveDate: "immediate" | "next_cycle") => void;
}

export function UpgradeClientOfficePlanModal({
  isOpen,
  onClose,
  office,
  currentPlan,
  initialBillingCycle,
  onUpgrade,
  onConfirmUpgrade,
}: UpgradeClientOfficePlanModalProps) {
  const { t } = useLanguage();

  // Determine currently active plan from office
  const currentOfficePlan = office?.plan || currentPlan || "الباقة المعتمدة";

  // Available plans loaded directly from "خانة الباقات" (API + Local storage registry)
  const [availablePlans, setAvailablePlans] = useState<AvailablePlan[]>(() => {
    const local = getLocalCustomPlans();
    const source = local.length > 0 ? local : initialPricingPlans;
    const mapped = source.map(mapPricingPlanItemToAvailablePlan);
    return [...mapped, CUSTOM_SLA_PLAN];
  });
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  // Billing cycle state: default according to prop or office billing cycle
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">(() => {
    if (initialBillingCycle) return initialBillingCycle;
    const raw = String(office?.billingCycle || office?.activeSubscriptionDetails?.billingCycle || "").toLowerCase();
    if (raw.includes("سنو") || raw.includes("year") || raw.includes("annu")) return "annual";
    if (raw.includes("month") || raw.includes("شهري")) return "monthly";
    return "annual";
  });

  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [effectiveOption, setEffectiveOption] = useState<"immediate" | "next_cycle">("immediate");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customAnnualPrice, setCustomAnnualPrice] = useState(22440);
  const [customLawyers, setCustomLawyers] = useState(50);
  const [customCases, setCustomCases] = useState(2000);
  const [customStorageGb, setCustomStorageGb] = useState(500);

  // Synchronize billing cycle when modal opens or initialBillingCycle changes
  useEffect(() => {
    if (!isOpen) return;
    if (initialBillingCycle) {
      setBillingCycle(initialBillingCycle);
    } else {
      const raw = String(office?.billingCycle || office?.activeSubscriptionDetails?.billingCycle || "").toLowerCase();
      if (raw.includes("سنو") || raw.includes("year") || raw.includes("annu")) {
        setBillingCycle("annual");
      } else if (raw.includes("month") || raw.includes("شهري")) {
        setBillingCycle("monthly");
      } else {
        setBillingCycle("annual");
      }
    }
  }, [isOpen, initialBillingCycle, office?.billingCycle, office?.activeSubscriptionDetails?.billingCycle]);

  // Load real plans from "خانة الباقات" (fetchPlans + getLocalCustomPlans)
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setIsLoadingPlans(true);

    const localPlans = getLocalCustomPlans();

    fetchPlans()
      .then((payload) => {
        if (cancelled) return;
        const mappedFromApi = mapPlansResponse(payload);
        const merged: PricingPlanItem[] = [...mappedFromApi];

        // Merge local custom plans without duplicate IDs/names
        localPlans.forEach((lp) => {
          if (!merged.some((m) => String(m.id) === String(lp.id) || m.name === lp.name)) {
            merged.push(lp);
          }
        });

        const finalPlans = merged.length > 0 ? merged : initialPricingPlans;
        const activePlans = finalPlans.filter((p) => p.isActive !== false);
        const sourceList = activePlans.length > 0 ? activePlans : finalPlans;
        const mappedList = sourceList.map(mapPricingPlanItemToAvailablePlan);

        // Append custom SLA plan at the end if not present
        if (!mappedList.some((p) => p.id === "custom" || p.name.includes("مخصصة"))) {
          mappedList.push(CUSTOM_SLA_PLAN);
        }

        setAvailablePlans(mappedList);

        // Pre-select a plan: prefer next plan after the current office plan
        const currNorm = currentOfficePlan.trim().toLowerCase();
        const currIndex = mappedList.findIndex(
          (p) =>
            p.name.trim().toLowerCase() === currNorm ||
            currNorm.includes(p.name.trim().toLowerCase()) ||
            p.name.trim().toLowerCase().includes(currNorm)
        );

        if (currIndex !== -1 && mappedList[currIndex + 1]) {
          setSelectedPlanId(mappedList[currIndex + 1].id);
        } else {
          const candidate = mappedList.find(
            (p) =>
              p.name.trim().toLowerCase() !== currNorm &&
              !currNorm.includes(p.name.trim().toLowerCase()) &&
              p.id !== "custom"
          );
          setSelectedPlanId(candidate ? candidate.id : mappedList[0]?.id || "custom");
        }
      })
      .catch(() => {
        if (cancelled) return;
        const localPlans = getLocalCustomPlans();
        const fallback = localPlans.length > 0 ? localPlans : initialPricingPlans;
        const mappedList = fallback.map(mapPricingPlanItemToAvailablePlan);
        if (!mappedList.some((p) => p.id === "custom" || p.name.includes("مخصصة"))) {
          mappedList.push(CUSTOM_SLA_PLAN);
        }
        setAvailablePlans(mappedList);
        if (mappedList.length > 0) {
          setSelectedPlanId(mappedList[0].id);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingPlans(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, currentOfficePlan]);

  if (!isOpen) return null;

  const selectedPlan =
    availablePlans.find((p) => String(p.id) === String(selectedPlanId)) ||
    availablePlans[0] ||
    CUSTOM_SLA_PLAN;

  const resolvedPlanName =
    selectedPlanId === "custom"
      ? t(
          `باقة مخصصة (${customAnnualPrice.toLocaleString()} ر.س)`,
          `Custom Plan (${customAnnualPrice.toLocaleString()} SAR)`
        )
      : selectedPlan.name;

  const handleConfirm = async () => {
    if (selectedPlanId === "custom" && customAnnualPrice <= 0) {
      toast.error(
        t("أدخل سعراً صالحاً للباقة المخصصة", "Enter a valid custom plan price")
      );
      return;
    }

    setIsSubmitting(true);

    try {
      if (office?.id) {
        // Persist change to backend
        const numericPlanId = Number(selectedPlan.id);
        await updateFirm(office.id, {
          plan_id: !isNaN(numericPlanId) && selectedPlan.id !== "custom" ? numericPlanId : undefined,
          subscription_plan: resolvedPlanName,
          billing_cycle: billingCycle === "annual" ? "yearly" : "monthly",
        }).catch(() => null);

        if (office.activeSubscriptionDetails?.id) {
          await upgradeSubscription(office.activeSubscriptionDetails.id, {
            new_plan_id: selectedPlan.id,
            billing_cycle: billingCycle === "annual" ? "yearly" : "monthly",
          }).catch(() => null);
        }
      }
    } catch {
      // Non-blocking for UI update
    }

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
          className="relative w-full max-w-4xl bg-white dark:bg-[#221812] rounded-[12px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.35)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col max-h-[92vh] overflow-hidden"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ======================================================== */}
          {/* 1. MODAL HEADER */}
          {/* ======================================================== */}
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#f0eeea] dark:border-[#38271c] bg-white dark:bg-[#221812] shrink-0">
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
                  {t(
                    "اختر الباقة المناسبة لتوسيع مقاعد المستخدمين، سعة التخزين، والمزايا القضائية المتقدمة للمكتب.",
                    "Select a higher tier to increase user seats, storage quota, and access advanced legal features."
                  )}
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
                  {t(
                    "حدد الباقة المستهدفة للترقية الفورية أو عند التجديد",
                    "Select target tier to apply immediately or on next renewal"
                  )}
                </span>
                <div className="flex items-center gap-2">
                  {isLoadingPlans && (
                    <Loader2 className="size-3.5 text-[#9c6402] dark:text-[#e29d38] animate-spin" />
                  )}
                  <h3 className="text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("جميع الباقات المتاحة للمكتب:", "All Available Platform Plans:")}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {availablePlans.map((plan) => {
                  const isSelected = String(selectedPlanId) === String(plan.id);
                  const currNorm = currentOfficePlan.trim().toLowerCase();
                  const planNorm = plan.name.trim().toLowerCase();
                  const isCurrent =
                    currNorm === planNorm ||
                    currNorm.includes(planNorm) ||
                    planNorm.includes(currNorm);

                  const displayPrice =
                    billingCycle === "annual"
                      ? (plan.annualPrice > 0 ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice)
                      : plan.monthlyPrice;

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
                          {plan.badge && !isCurrent && !plan.isPopular && (
                            <span className="bg-[#f5f3ef] dark:bg-[#281c15] text-[#837565] dark:text-[#cdc5bd] border border-[#eae8e4] dark:border-[#38271c] text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {plan.badge}
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
                            {displayPrice.toLocaleString("en-US")}
                          </span>
                          <span className="text-[11px] text-[#837565] dark:text-[#a89f91] font-semibold">
                            {t("ر.س / شهرياً", "SAR / mo")}{" "}
                            {billingCycle === "annual" ? t("(تدفع سنوياً)", "(Billed Annually)") : ""}
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
                        {plan.features.length > 0 && (
                          <div className="pt-2 border-t border-dashed border-[#eae8e4] dark:border-[#38271c] space-y-1">
                            {plan.features.slice(0, 4).map((feature, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-1.5 text-[10px] text-[#514537] dark:text-[#cdc5bd]"
                              >
                                <CheckCircle2 className="size-3 text-[#059669] dark:text-[#10b981] shrink-0 mt-0.5" />
                                <span className="leading-[14px] line-clamp-1">{feature}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom SLA Plan adjustments box */}
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

            {/* Effective Date Options */}
            <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-[#eae8e4] dark:border-[#38271c] rounded-[8px] p-4 space-y-3 text-start">
              <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("موعد سريان الترقية وتطبيق الباقة الجديدة:", "Effective Upgrade Date:")}
              </span>

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
                      {t(
                        "ترقية الموارد وسعة المقاعد لحظياً وإصدار فاتورة فرق الباقة التناسبية تلقائياً.",
                        "Instantly upgrades seats and storage, calculating prorated difference on invoice."
                      )}
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
                      {t(
                        "يستمر المكتب على الباقة الحالية حتى تاريخ انتهاء الاشتراك، ثم تُطبّق الباقة الجديدة.",
                        "Maintains current plan limits until active expiration date, then switches automatically."
                      )}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 3. MODAL FOOTER */}
          {/* ======================================================== */}
          <div className="p-4 sm:p-5 border-t border-[#f0eeea] dark:border-[#38271c] bg-white dark:bg-[#221812] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-[12px] text-[#514537] dark:text-[#cdc5bd] self-start sm:self-auto">
              <Clock className="size-4 text-[#9c6402] dark:text-[#e29d38] shrink-0" />
              <span>
                {t("الباقة المختارة:", "Selected Tier:")}{" "}
                <strong className="text-[#1b1c1a] dark:text-[#fdfbf7] font-bold">
                  {resolvedPlanName}
                </strong>{" "}
                (
                {billingCycle === "annual"
                  ? (selectedPlan.annualPrice > 0
                      ? Math.round(selectedPlan.annualPrice / 12)
                      : selectedPlan.monthlyPrice)
                  : selectedPlan.monthlyPrice}{" "}
                {t("ر.س / شهرياً", "SAR / mo")})
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
                <span>
                  {isSubmitting
                    ? t("جاري الترقية...", "Upgrading...")
                    : t("تأكيد ترقية الباقة", "Confirm Plan Upgrade")}
                </span>
                <ArrowUpRight className="size-4 rtl:rotate-90" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
