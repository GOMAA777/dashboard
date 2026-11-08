"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Edit3,
  Building2,
  CreditCard,
  TrendingUp,
  Users,
  Scale,
  Briefcase,
  UserCheck,
  Cloud,
  FileText,
  CheckCircle2,
  XCircle,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { toast } from "sonner";
import { PricingPlanItem, SubscribedFirm } from "../types/plan.types";
import { PageSizeDropdown } from "@/components/shared/PageSizeDropdown";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { fetchPlanById, fetchPlanSubscribers } from "@/lib/api/plans";
import { mapPlanFromApi, normalizeLogoUrl } from "@/lib/api/mappers";
import { unwrapData, unwrapList, asString } from "@/lib/api/helpers";

interface PlanDetailsViewProps {
  plan?: PricingPlanItem;
  onBack: () => void;
  onEdit: (plan?: PricingPlanItem) => void;
  onNavigateToClients?: () => void;
}

export function PlanDetailsView({
  plan,
  onBack,
  onEdit,
  onNavigateToClients,
}: PlanDetailsViewProps) {
  const { t, isEn } = useLanguage();
  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [livePlan, setLivePlan] = useState<PricingPlanItem | undefined>(plan);
  const [subscribers, setSubscribers] = useState<SubscribedFirm[]>([]);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(true);

  useEffect(() => {
    setLivePlan(plan);
    if (!plan?.id) return;
    let cancelled = false;

    fetchPlanById(plan.id)
      .then((payload) => {
        if (cancelled) return;
        const raw = (unwrapData<Record<string, unknown>>(payload) ||
          payload) as Record<string, unknown>;
        if (raw?.id || raw?.name) {
          setLivePlan(mapPlanFromApi(raw));
        }
      })
      .catch(() => {
        // Keep prop plan if detail fetch fails.
      });

    setIsLoadingSubscribers(true);
    fetchPlanSubscribers(plan.id)
      .then((payload) => {
        if (cancelled) return;
        const list = unwrapList<Record<string, unknown>>(payload);
        const mappedSubscribers: SubscribedFirm[] = list.map((item) => {
          const firmName = asString(item.name || item.firm_name, "مكتب محاماة");
          const activeSub = (item.active_subscription || {}) as Record<string, unknown>;
          const billing = asString(activeSub.billing_cycle || item.billing_cycle, "monthly");
          const subEnd = asString(activeSub.renewal_date || item.subscription_end || item.renewal_date, "—");
          const subStart = asString(activeSub.start_date || item.subscription_start || item.created_at, "—");
          const subStatus = asString(activeSub.status || item.status, "active");
          return {
            id: asString(item.id, String(Math.random())),
            initial: firmName.trim().charAt(0) || "م",
            name: firmName,
            licenseNumber: asString(item.license_number, "—"),
            city: asString(item.city, "—"),
            owner: asString(item.owner_name || item.owner, "—"),
            ownerRole: "المدير العام للمكتب",
            subscriptionDate: subStart && subStart.includes("T") ? subStart.split("T")[0] : subStart,
            renewalDate: subEnd && subEnd.includes("T") ? subEnd.split("T")[0] : subEnd,
            billingCycle: billing.includes("year") || billing.includes("سنو") ? "سنوي" : "شهري",
            status: subStatus === "active" ? "active" : "suspended",
          };
        });
        setSubscribers(mappedSubscribers);
      })
      .catch(() => {
        if (!cancelled) setSubscribers([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingSubscribers(false);
      });

    return () => {
      cancelled = true;
    };
  }, [plan]);

  const totalItems = subscribers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const pagedFirms = subscribers.slice(
    (validCurrentPage - 1) * pageSize,
    validCurrentPage * pageSize
  );

  const planCode = livePlan?.code || "CODE: PLAN-SLV-02";
  const planName = livePlan?.name || t("الباقة الفضية", "Silver Plan");
  const subscribedFirmsCount = livePlan?.subscribedFirmsCount ?? 0;
  const planDescription =
    livePlan?.description ||
    t(
      "للفرق القانونية النامية والمكاتب المتوسطة التي تتطلب أدوات أتمتة العمليات القضائية والربط",
      "For growing legal teams and mid-sized law firms requiring judicial automation and system integrations"
    );

  return (
    <div className="w-full space-y-6 font-['Cairo',sans-serif]">
      {/* 1. Top Identity & Command Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        {/* Right: Plan Code, Title & Description */}
        <div className="flex flex-col items-start gap-[6px]">
          <div className="flex items-center gap-[10px] flex-wrap">
            <span className="font-mono text-[11px] font-semibold text-[#737067] bg-[#f5f3ef] dark:bg-[#281c15] dark:text-[#cdc5bd] dark:border-[#38271c] px-[8px] py-[3px] rounded border border-[#e2ded7]">
              {planCode}
            </span>
            {livePlan?.badge && (
              <span
                className="inline-flex items-center gap-[4px] text-[11px] font-bold px-[10px] py-[2px] rounded-full"
                style={{
                  backgroundColor: livePlan.badgeColor ? `${livePlan.badgeColor}18` : "#fef3c7",
                  color: livePlan.badgeColor || "#d97706",
                  borderColor: livePlan.badgeColor ? `${livePlan.badgeColor}40` : "#fcd34d",
                  borderWidth: 1,
                }}
              >
                <span>★</span>
                <span>{livePlan.badge}</span>
              </span>
            )}
            <span className="text-[11px] font-bold text-[#15803d] bg-[#e8f5e9] dark:bg-[#132c1c] dark:text-[#6ee7b7] dark:border-[#165a2e] px-[8px] py-[2px] rounded-full border border-[#c8e6c9]">
              {livePlan?.isActive !== false ? t("باقة مفعلة", "Active Plan") : t("باقة معطلة", "Inactive Plan")}
            </span>
          </div>

          <div className="flex items-center gap-[12px]">
            <button
              type="button"
              onClick={onBack}
              className="p-[6px] rounded-[6px] hover:bg-[#eae8e4] dark:hover:bg-[#281c15] text-[#737067] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] transition-colors cursor-pointer"
              title={t("العودة للباقات", "Back to Plans")}
            >
              <ArrowRight className={cn("size-[20px]", isEn && "rotate-180")} />
            </button>
            <h1 className="text-[28px] font-extrabold text-[#1b1c1a] dark:text-[#fdfbf7] leading-tight">
              {planName}
            </h1>
          </div>

          <p className="text-[13px] text-[#737067] dark:text-[#cdc5bd] max-w-[650px] leading-relaxed">
            {planDescription}
          </p>
        </div>

        {/* Left: Action Buttons */}
        <div className="flex items-center gap-[10px] shrink-0">
          <button
            type="button"
            onClick={onNavigateToClients || onBack}
            className="border border-[#e2ded7] dark:border-[#38271c] bg-white dark:bg-[#221812] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] font-bold text-[13px] px-[16px] py-[9px] rounded-[6px] shadow-2xs flex items-center gap-[8px] transition-colors cursor-pointer"
          >
            <Building2 className="size-[16px] text-[#737067] dark:text-[#cdc5bd]" />
            <span>{t(`عرض المكاتب (${subscribedFirmsCount})`, `View Offices (${subscribedFirmsCount})`)}</span>
          </button>

          <button
            type="button"
            onClick={() => onEdit(livePlan)}
            className="bg-[#9c6402] hover:bg-[#855402] dark:bg-[#e29d38] dark:hover:bg-[#d08c2a] text-white dark:text-[#1c140f] font-bold text-[13px] px-[18px] py-[9px] rounded-[6px] shadow-xs flex items-center gap-[8px] transition-all cursor-pointer"
          >
            <Edit3 className="size-[16px]" />
            <span>{t("تعديل الباقة", "Edit Plan")}</span>
          </button>
        </div>
      </div>

      {/* 2. Top KPI Metrics (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Monthly Price */}
        <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#e2ded7] dark:border-[#38271c] p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-[10px]">
            <span className="text-[12px] font-semibold text-[#737067] dark:text-[#cdc5bd]">
              {t("السعر الشهري المعتمد", "Approved Monthly Price")}
            </span>
            <div className="p-[8px] rounded-[6px] bg-[#fbf6ee] text-[#9c6402] dark:bg-[#2d1f16] dark:text-[#e29d38] dark:border dark:border-[#4d3627]/60">
              <CreditCard className="size-[18px]" />
            </div>
          </div>
          <div className="flex items-baseline gap-[6px] mb-[8px]">
            <span className="text-[28px] font-black text-[#1b1c1a] dark:text-[#fdfbf7]">
              {livePlan?.monthlyPrice ?? 399}
            </span>
            <span className="text-[13px] font-bold text-[#737067] dark:text-[#8e8680]">
              {t("ر.س / شهر", "SAR / month")}
            </span>
          </div>
          <div className="flex items-center gap-[6px]">
            <span className="text-[11px] font-bold text-[#9c6402] bg-[#fbf6ee] dark:bg-[rgba(226,157,56,0.18)] dark:text-[#f3c27e] dark:border-[#e29d38]/50 px-[8px] py-[2px] rounded border border-[#f5e3c8]">
              {(() => {
                const disc =
                  livePlan?.yearlyDiscountPercent && livePlan.yearlyDiscountPercent > 0
                    ? livePlan.yearlyDiscountPercent
                    : (livePlan?.monthlyPrice ?? 0) > 0 &&
                      (livePlan?.annualPrice ?? 0) > 0 &&
                      (livePlan?.annualPrice ?? 0) < (livePlan?.monthlyPrice ?? 0) * 12
                    ? Math.round(
                        (((livePlan!.monthlyPrice * 12) - livePlan!.annualPrice!) /
                          (livePlan!.monthlyPrice * 12)) *
                          100
                      )
                    : 0;
                if (disc > 0) {
                  return t("خصم عند السداد السنوي", "Discount on annual billing");
                }
                if (livePlan?.annualPrice) {
                  return t(`السعر السنوي: ${livePlan.annualPrice} ر.س`, `Annual: ${livePlan.annualPrice} SAR`);
                }
                return t("خصم عند السداد السنوي", "Annual billing discount");
              })()}
            </span>
          </div>
        </div>

        {/* Metric 2: Subscribed Firms */}
        <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#e2ded7] dark:border-[#38271c] p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-[10px]">
            <span className="text-[12px] font-semibold text-[#737067] dark:text-[#cdc5bd]">
              {t("المكاتب المشتركة حالياً", "Currently Subscribed Offices")}
            </span>
            <div className="p-[8px] rounded-[6px] bg-[#fbf6ee] text-[#9c6402] dark:bg-[#2d1f16] dark:text-[#e29d38] dark:border dark:border-[#4d3627]/60">
              <Building2 className="size-[18px]" />
            </div>
          </div>
          <div className="flex items-baseline gap-[6px] mb-[6px]">
            <span className="text-[28px] font-black text-[#1b1c1a] dark:text-[#fdfbf7]">
              {subscribedFirmsCount}
            </span>
            <span className="text-[13px] font-bold text-[#737067] dark:text-[#8e8680]">
              {t("مكتباً نشطاً", "active offices")}
            </span>
          </div>
          {/* Progress bar */}
          <div className="space-y-[4px]">
            <div className="h-[6px] w-full bg-[#eeebe5] dark:bg-[#38271c] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#9c6402] dark:bg-[#e29d38] rounded-full"
                style={{ width: livePlan?.sharePercentage || "40%" }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#737067] dark:text-[#cdc5bd] font-medium">
              <span>{livePlan?.sharePercentage || `${subscribedFirmsCount} ${t("مكاتب مشتركة", "subscribed offices")}`}</span>
              {livePlan?.isPopular && (
                <span className="text-[#9c6402] dark:text-[#f3c27e] font-bold">
                  {t("الأكثر طلباً", "Most Popular")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Metric 3: Generated Monthly Revenue */}
        <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#e2ded7] dark:border-[#38271c] p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-[10px]">
            <span className="text-[12px] font-semibold text-[#737067] dark:text-[#cdc5bd]">
              {t("الإيراد الشهري الناتج", "Monthly Generated Revenue")}
            </span>
            <div className="p-[8px] rounded-[6px] bg-[#e8f5e9] text-[#15803d] dark:bg-[#132c1c] dark:text-[#6ee7b7] dark:border dark:border-[#165a2e]">
              <TrendingUp className="size-[18px]" />
            </div>
          </div>
          <div className="flex items-baseline gap-[6px] mb-[8px]">
            <span className="text-[28px] font-black text-[#1b1c1a] dark:text-[#fdfbf7]">
              {((livePlan?.monthlyPrice ?? 399) * (subscribedFirmsCount || 1)).toLocaleString()}
            </span>
            <span className="text-[13px] font-bold text-[#737067] dark:text-[#8e8680]">
              {t("ر.س / شهر", "SAR / month")}
            </span>
          </div>
          <div className="flex items-center gap-[6px]">
            <span className="text-[11px] font-bold text-[#15803d] bg-[#e8f5e9] dark:bg-[#132c1c] dark:text-[#6ee7b7] dark:border-[#165a2e] px-[8px] py-[2px] rounded border border-[#c8e6c9] flex items-center gap-[4px]">
              <span>↑</span>
              <span>{t("+12.4% مقارنة بالربع السابق", "+12.4% vs previous quarter")}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Usage Limits & Cloud Resources (5 Compact Cards Row) */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#e2ded7] dark:border-[#38271c] p-5 sm:p-6 shadow-2xs">
        <div className="mb-[16px]">
          <h2 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
            {t("حدود الاستخدام والموارد السحابية للباقة", "Plan Usage Limits & Cloud Resources")}
          </h2>
          <p className="text-[12px] text-[#737067] dark:text-[#cdc5bd]">
            {t(
              "المواصفات التقنية والمخصصات البرمجية لكل مكتب مشترك في الباقة الفضية",
              "Technical specifications and quotas assigned to each law firm subscribed to the Silver Plan"
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-[12px]">
          {/* Limit 1: Lawyers */}
          <div className="bg-[#faf8f5] dark:bg-[#281c15] border border-[#f0eeea] dark:border-[#38271c] rounded-[8px] p-[14px] flex flex-col items-start gap-[8px]">
            <div className="p-[7px] bg-[#fbf6ee] dark:bg-[#2d1f16] border border-[#f5e3c8] dark:border-[#4d3627]/60 text-[#9c6402] dark:text-[#e29d38] rounded-[6px]">
              <Users className="size-[18px]" />
            </div>
            <div>
              <div className="text-[15px] font-extrabold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {livePlan?.limits?.lawyers || t("4 محامين", "4 Lawyers")}
              </div>
              <div className="text-[11px] text-[#737067] dark:text-[#8e8680] leading-relaxed mt-[2px]">
                {t("تراخيص مستخدمين ومستشارين", "User licenses & consultants")}
              </div>
            </div>
          </div>

          {/* Limit 2: Cases */}
          <div className="bg-[#faf8f5] dark:bg-[#281c15] border border-[#f0eeea] dark:border-[#38271c] rounded-[8px] p-[14px] flex flex-col items-start gap-[8px]">
            <div className="p-[7px] bg-[#fbf6ee] dark:bg-[#2d1f16] border border-[#f5e3c8] dark:border-[#4d3627]/60 text-[#9c6402] dark:text-[#e29d38] rounded-[6px]">
              <Scale className="size-[18px]" />
            </div>
            <div>
              <div className="text-[15px] font-extrabold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {livePlan?.limits?.cases || t("200 قضية", "200 Cases")}
              </div>
              <div className="text-[11px] text-[#737067] dark:text-[#8e8680] leading-relaxed mt-[2px]">
                {t("قضية ومعاملة نشطة بالتوازي", "Active cases & proceedings")}
              </div>
            </div>
          </div>

          {/* Limit 3: Agents */}
          <div className="bg-[#faf8f5] dark:bg-[#281c15] border border-[#f0eeea] dark:border-[#38271c] rounded-[8px] p-[14px] flex flex-col items-start gap-[8px]">
            <div className="p-[7px] bg-[#fbf6ee] dark:bg-[#2d1f16] border border-[#f5e3c8] dark:border-[#4d3627]/60 text-[#9c6402] dark:text-[#e29d38] rounded-[6px]">
              <Briefcase className="size-[18px]" />
            </div>
            <div>
              <div className="text-[15px] font-extrabold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {livePlan?.limits?.agents || t("5 وكلاء", "5 Agents")}
              </div>
              <div className="text-[11px] text-[#737067] dark:text-[#8e8680] leading-relaxed mt-[2px]">
                {t("وكلاء ومفوضون شرعيون", "Authorized legal agents")}
              </div>
            </div>
          </div>

          {/* Limit 4: Assistants */}
          <div className="bg-[#faf8f5] dark:bg-[#281c15] border border-[#f0eeea] dark:border-[#38271c] rounded-[8px] p-[14px] flex flex-col items-start gap-[8px]">
            <div className="p-[7px] bg-[#fbf6ee] dark:bg-[#2d1f16] border border-[#f5e3c8] dark:border-[#4d3627]/60 text-[#9c6402] dark:text-[#e29d38] rounded-[6px]">
              <UserCheck className="size-[18px]" />
            </div>
            <div>
              <div className="text-[15px] font-extrabold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {livePlan?.limits?.assistants || t("15 مساعدين", "15 Assistants")}
              </div>
              <div className="text-[11px] text-[#737067] dark:text-[#8e8680] leading-relaxed mt-[2px]">
                {t("مساعدين إداريين وقانونيين", "Admin & legal assistants")}
              </div>
            </div>
          </div>

          {/* Limit 5: Clients */}
          <div className="bg-[#faf8f5] dark:bg-[#281c15] border border-[#f0eeea] dark:border-[#38271c] rounded-[8px] p-[14px] flex flex-col items-start gap-[8px]">
            <div className="p-[7px] bg-[#fbf6ee] dark:bg-[#2d1f16] border border-[#f5e3c8] dark:border-[#4d3627]/60 text-[#9c6402] dark:text-[#e29d38] rounded-[6px]">
              <Users className="size-[18px]" />
            </div>
            <div>
              <div className="text-[15px] font-extrabold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {livePlan?.limits?.clients || t("1,000 عميل", "1,000 Clients")}
              </div>
              <div className="text-[11px] text-[#737067] dark:text-[#8e8680] leading-relaxed mt-[2px]">
                {t("سجلات عملاء وموكلين", "Client & corporate dossiers")}
              </div>
            </div>
          </div>

          {/* Limit 6: Storage */}
          <div className="bg-[#faf8f5] dark:bg-[#281c15] border border-[#f0eeea] dark:border-[#38271c] rounded-[8px] p-[14px] flex flex-col items-start gap-[8px]">
            <div className="p-[7px] bg-[#fbf6ee] dark:bg-[#2d1f16] border border-[#f5e3c8] dark:border-[#4d3627]/60 text-[#9c6402] dark:text-[#e29d38] rounded-[6px]">
              <Cloud className="size-[18px]" />
            </div>
            <div>
              <div className="text-[15px] font-extrabold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {livePlan?.limits?.storage || "20 GB"}
              </div>
              <div className="text-[11px] text-[#737067] dark:text-[#8e8680] leading-relaxed mt-[2px]">
                {t("تخزين سحابي مشفر للوثائق", "Encrypted document storage")}
              </div>
            </div>
          </div>

          {/* Limit 7: Documents */}
          <div className="bg-[#faf8f5] dark:bg-[#281c15] border border-[#f0eeea] dark:border-[#38271c] rounded-[8px] p-[14px] flex flex-col items-start gap-[8px]">
            <div className="p-[7px] bg-[#fbf6ee] dark:bg-[#2d1f16] border border-[#f5e3c8] dark:border-[#4d3627]/60 text-[#9c6402] dark:text-[#e29d38] rounded-[6px]">
              <FileText className="size-[18px]" />
            </div>
            <div>
              <div className="text-[15px] font-extrabold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {livePlan?.limits?.documents || t("5,000 مستند", "5,000 Documents")}
              </div>
              <div className="text-[11px] text-[#737067] dark:text-[#8e8680] leading-relaxed mt-[2px]">
                {t("العقود والوثائق المرفوعة", "Uploaded contracts & documents")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Two-Column Middle Section: Billing Cycles (left) & Features (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Billing Cycles & Prices (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#221812] rounded-[8px] border border-[#e2ded7] dark:border-[#38271c] p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-[4px]">
              <h2 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("دورات الفوترة والأسعار", "Billing Cycles & Pricing")}
              </h2>
              <span className="text-[10px] font-bold bg-[#f5f3ef] dark:bg-[#281c15] text-[#737067] dark:text-[#cdc5bd] px-[6px] py-[2px] rounded border border-[#e2ded7] dark:border-[#38271c]">
                {t("باقة تجارية", "Commercial Plan")}
              </span>
            </div>
            <p className="text-[12px] text-[#737067] dark:text-[#cdc5bd] mb-[18px]">
              {t("خيارات الاشتراك الرسمية المتاحة للمكاتب القانونية", "Official subscription options available for law firms")}
            </p>

            <div className="space-y-[12px]">
              {/* Option 1: Monthly */}
              <div className="border border-[#e2ded7] dark:border-[#38271c] rounded-[6px] p-[16px] bg-[#faf8f5] dark:bg-[#281c15]">
                <div className="flex items-center justify-between mb-[6px]">
                  <span className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("الدورة الشهرية", "Monthly Billing")}
                  </span>
                  <span className="text-[10px] font-bold bg-[#eeebe5] dark:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] px-[6px] py-[2px] rounded">
                    {t("تجدد تلقائي", "Auto Renewal")}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-[11px] text-[#737067] dark:text-[#8e8680]">
                    {t("تجدد كل 30 يوماً مع إشعار استباقي", "Renews every 30 days with prior notice")}
                  </div>
                  <div className="text-left rtl:text-left ltr:text-right">
                    <span className="text-[20px] font-black text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {livePlan?.monthlyPrice ?? 399}
                    </span>
                    <span className="text-[11px] text-[#737067] dark:text-[#8e8680] ms-[4px]">
                      {t("ر.س / شهرياً", "SAR / month")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Option 2: Annual (Highlighted) */}
              <div className="border-2 border-[#9c6402] dark:border-[#e29d38] rounded-[6px] p-[16px] bg-[#fcf9f2] dark:bg-[rgba(226,157,56,0.1)] relative shadow-xs">
                <div className="flex items-center justify-between mb-[6px]">
                  <div className="flex items-center gap-[8px]">
                    <span className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {t("الدورة السنوية (12 شهراً)", "Annual Billing (12 months)")}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] px-[8px] py-[2px] rounded">
                    {(() => {
                      const disc =
                        livePlan?.yearlyDiscountPercent && livePlan.yearlyDiscountPercent > 0
                          ? livePlan.yearlyDiscountPercent
                          : (livePlan?.monthlyPrice ?? 0) > 0 &&
                            (livePlan?.annualPrice ?? 0) > 0 &&
                            (livePlan?.annualPrice ?? 0) < (livePlan?.monthlyPrice ?? 0) * 12
                          ? Math.round(
                              (((livePlan!.monthlyPrice * 12) - livePlan!.annualPrice!) /
                                (livePlan!.monthlyPrice * 12)) *
                                100
                            )
                          : 0;
                      return disc > 0
                        ? t("الأكثر طلباً (خصم)", "Most Popular (discount)")
                        : t("الأكثر طلباً", "Most Popular");
                    })()}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-[11px] text-[#737067] dark:text-[#cdc5bd]">
                    {livePlan?.annualPrice
                      ? t(
                          `تعادل ${Math.round(livePlan.annualPrice / 12)} ر.س / شهرياً عند الدفع لمرة واحدة`,
                          `Equivalent to ${Math.round(livePlan.annualPrice / 12)} SAR / month paid annually`
                        )
                      : t("تعادل 339 ر.س / شهرياً عند الدفع لمرة واحدة", "Equivalent to 339 SAR / month paid annually")}
                  </div>
                  <div className="text-left rtl:text-left ltr:text-right">
                    <span className="text-[22px] font-black text-[#9c6402] dark:text-[#f3c27e]">
                      {livePlan?.annualPrice ?? 4068}
                    </span>
                    <span className="text-[11px] text-[#737067] dark:text-[#8e8680] ms-[4px]">
                      {t("ر.س / سنوياً", "SAR / year")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-[16px] mt-[16px] border-t border-[#f0eeea] dark:border-[#38271c] text-[11px] text-[#737067] dark:text-[#8e8680] leading-relaxed">
            {t(
              "* جميع الأسعار غير شاملة ضريبة القيمة المضافة 15% ويتم إصدار فاتورة ضريبية إلكترونية فورية لكل دفعة.",
              "* All prices exclude 15% VAT. An instant electronic tax invoice is generated for every billing cycle."
            )}
          </div>
        </div>

        {/* Right: Features and Ecosystem Integrations (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#221812] rounded-[8px] border border-[#e2ded7] dark:border-[#38271c] p-[20px] shadow-2xs">
          <div className="flex items-center justify-between mb-[4px]">
            <h2 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {t("مميزات الباقة وتكاملات المنظومة", "Plan Features & Ecosystem Integrations")}
            </h2>
            <span className="text-[11px] font-bold bg-[#fbf6ee] dark:bg-[rgba(226,157,56,0.18)] text-[#9c6402] dark:text-[#f3c27e] px-[8px] py-[2px] rounded border border-[#f5e3c8] dark:border-[#e29d38]/50">
              {livePlan?.features && livePlan.features.length > 0
                ? `${livePlan.features.filter((f) => f.isIncluded).length} ${t("مميزات مفعلة", "Active Features")}`
                : t("4 من 6 مميزات", "4 of 6 Features")}
            </span>
          </div>
          <p className="text-[12px] text-[#737067] dark:text-[#cdc5bd] mb-[16px]">
            {t(
              "الخدمات المفعلة والمستثناة ضمن اتفاقية مستوى الخدمة لهذه الباقة",
              "Included and excluded services under the SLA agreement for this plan"
            )}
          </p>

          <div className="space-y-[10px]">
            {livePlan?.features && livePlan.features.length > 0 ? (
              livePlan.features.map((feat) => (
                <div
                  key={feat.id}
                  className="flex items-start justify-between gap-[12px] p-[12px] rounded-[6px] bg-[#faf8f5] dark:bg-[#281c15] border border-[#f0eeea] dark:border-[#38271c]"
                >
                  <div className="flex items-start gap-[10px]">
                    {feat.isIncluded ? (
                      <CheckCircle2 className="size-[18px] text-[#15803d] dark:text-[#6ee7b7] shrink-0 mt-[2px]" />
                    ) : (
                      <XCircle className="size-[18px] text-[#9e9e9e] dark:text-[#6f6760] shrink-0 mt-[2px]" />
                    )}
                    <div>
                      <div className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                        {feat.title}
                      </div>
                      {feat.description && (
                        <div className="text-[11px] text-[#737067] dark:text-[#8e8680] mt-[2px]">
                          {feat.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-[8px] py-[3px] rounded border shrink-0 ${
                      feat.isIncluded
                        ? "bg-[#e8f5e9] dark:bg-[#132c1c] text-[#15803d] dark:text-[#6ee7b7] border-[#c8e6c9] dark:border-[#165a2e]"
                        : "bg-[#f5f5f5] dark:bg-[#221812] text-[#757575] dark:text-[#8e8680] border-[#e0e0e0] dark:border-[#38271c]"
                    }`}
                  >
                    {feat.isIncluded ? t("مشمولة في الباقة", "Included in Plan") : t("غير متوفرة", "Not Included")}
                  </span>
                </div>
              ))
            ) : (
              <>
                {/* Feature 1: Priority SLA */}
            <div className="flex items-start justify-between gap-[12px] p-[12px] rounded-[6px] bg-[#faf8f5] dark:bg-[#281c15] border border-[#f0eeea] dark:border-[#38271c]">
              <div className="flex items-start gap-[10px]">
                <CheckCircle2 className="size-[18px] text-[#15803d] dark:text-[#6ee7b7] shrink-0 mt-[2px]" />
                <div>
                  <div className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("دعم فني ذو أولوية للمكتب", "Priority Technical Support for Law Firm")}
                  </div>
                  <div className="text-[11px] text-[#737067] dark:text-[#8e8680] mt-[2px]">
                    {t(
                      "استجابة مضمونة خلال 4 ساعات عمل كحد أقصى مع قناة محادثة مباشرة.",
                      "Guaranteed response within 4 working hours maximum with a direct live chat channel."
                    )}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-[#e8f5e9] dark:bg-[#132c1c] text-[#15803d] dark:text-[#6ee7b7] px-[8px] py-[3px] rounded border border-[#c8e6c9] dark:border-[#165a2e] shrink-0">
                {t("مشمولة في الباقة", "Included in Plan")}
              </span>
            </div>

            {/* Feature 2: Najiz Sync */}
            <div className="flex items-start justify-between gap-[12px] p-[12px] rounded-[6px] bg-[#faf8f5] dark:bg-[#281c15] border border-[#f0eeea] dark:border-[#38271c]">
              <div className="flex items-start gap-[10px]">
                <CheckCircle2 className="size-[18px] text-[#15803d] dark:text-[#6ee7b7] shrink-0 mt-[2px]" />
                <div>
                  <div className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t(
                      "الربط التلقائي المباشر مع منصة ناجز ووزارة العدل",
                      "Direct Automatic Integration with Najiz Portal & Ministry of Justice"
                    )}
                  </div>
                  <div className="text-[11px] text-[#737067] dark:text-[#8e8680] mt-[2px]">
                    {t(
                      "مزامنة الجلسات، التبليغات القضائية، والقرارات التنفيذية بصورة لحظية.",
                      "Real-time synchronization of court sessions, judicial summons, and enforcement decisions."
                    )}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-[#e8f5e9] dark:bg-[#132c1c] text-[#15803d] dark:text-[#6ee7b7] px-[8px] py-[3px] rounded border border-[#c8e6c9] dark:border-[#165a2e] shrink-0">
                {t("مشمولة في الباقة", "Included in Plan")}
              </span>
            </div>

            {/* Feature 3: ZATCA Phase 2 */}
            <div className="flex items-start justify-between gap-[12px] p-[12px] rounded-[6px] bg-[#faf8f5] dark:bg-[#281c15] border border-[#f0eeea] dark:border-[#38271c]">
              <div className="flex items-start gap-[10px]">
                <CheckCircle2 className="size-[18px] text-[#15803d] dark:text-[#6ee7b7] shrink-0 mt-[2px]" />
                <div>
                  <div className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t(
                      "الفوترة الإلكترونية المتوافقة مع هيئة الزكاة والضريبة (ZATCA Phase 2)",
                      "ZATCA Phase 2 Compliant E-Invoicing Integration"
                    )}
                  </div>
                  <div className="text-[11px] text-[#737067] dark:text-[#8e8680] mt-[2px]">
                    {t(
                      "إصدار فواتير ضريبية إلكترونية مشفرة برمز QR وفق متطلبات المرحلة الثانية.",
                      "Generation of encrypted tax e-invoices with QR codes compliant with Phase 2 requirements."
                    )}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-[#e8f5e9] dark:bg-[#132c1c] text-[#15803d] dark:text-[#6ee7b7] px-[8px] py-[3px] rounded border border-[#c8e6c9] dark:border-[#165a2e] shrink-0">
                {t("مشمولة في الباقة", "Included in Plan")}
              </span>
            </div>

            {/* Feature 4: KPI Analytics */}
            <div className="flex items-start justify-between gap-[12px] p-[12px] rounded-[6px] bg-[#faf8f5] dark:bg-[#281c15] border border-[#f0eeea] dark:border-[#38271c]">
              <div className="flex items-start gap-[10px]">
                <CheckCircle2 className="size-[18px] text-[#15803d] dark:text-[#6ee7b7] shrink-0 mt-[2px]" />
                <div>
                  <div className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t(
                      "تقارير مؤشرات الأداء والتحليلات القضائية",
                      "Performance KPI Reports & Judicial Analytics"
                    )}
                  </div>
                  <div className="text-[11px] text-[#737067] dark:text-[#8e8680] mt-[2px]">
                    {t(
                      "لوحات مؤشرات متقدمة لقياس معدلات إنجاز القضايا ومستحقات أتعاب المحاماة.",
                      "Advanced dashboards for measuring case clearance rates and legal fees collections."
                    )}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-[#e8f5e9] dark:bg-[#132c1c] text-[#15803d] dark:text-[#6ee7b7] px-[8px] py-[3px] rounded border border-[#c8e6c9] dark:border-[#165a2e] shrink-0">
                {t("مشمولة في الباقة", "Included in Plan")}
              </span>
            </div>

            {/* Feature 5: Dedicated Account Manager (Excluded) */}
            <div className="flex items-start justify-between gap-[12px] p-[12px] rounded-[6px] bg-[#fdfdfc] dark:bg-[#281c15]/50 border border-[#ece9e3] dark:border-[#38271c]/60 opacity-80">
              <div className="flex items-start gap-[10px]">
                <XCircle className="size-[18px] text-[#9e9e9e] dark:text-[#8e8680] shrink-0 mt-[2px]" />
                <div>
                  <div className="text-[13px] font-medium text-[#737067] dark:text-[#8e8680] line-through decoration-1">
                    {t("مدير حساب استشاري مخصص", "Dedicated Advisory Account Manager")}
                  </div>
                  <div className="text-[11px] text-[#9e9e9e] dark:text-[#6f6760] mt-[2px]">
                    {t(
                      "متاح حصرياً للمشتركين في الباقة الذهبية أو الباقات المخصصة لكبرى الشركات.",
                      "Exclusively available for subscribers of Gold or Enterprise tailored packages."
                    )}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-[#f5f5f5] dark:bg-[#221812] text-[#757575] dark:text-[#8e8680] px-[8px] py-[3px] rounded border border-[#e0e0e0] dark:border-[#38271c] shrink-0">
                {t("غير متوفرة", "Not Included")}
              </span>
            </div>

            {/* Feature 6: Custom API Integration (Excluded) */}
            <div className="flex items-start justify-between gap-[12px] p-[12px] rounded-[6px] bg-[#fdfdfc] dark:bg-[#281c15]/50 border border-[#ece9e3] dark:border-[#38271c]/60 opacity-80">
              <div className="flex items-start gap-[10px]">
                <XCircle className="size-[18px] text-[#9e9e9e] dark:text-[#8e8680] shrink-0 mt-[2px]" />
                <div>
                  <div className="text-[13px] font-medium text-[#737067] dark:text-[#8e8680] line-through decoration-1">
                    {t("تكامل واجهة البرمجة (Custom API Integration)", "Custom API Integration")}
                  </div>
                  <div className="text-[11px] text-[#9e9e9e] dark:text-[#6f6760] mt-[2px]">
                    {t(
                      "ربط أنظمة الـ ERP الخاصة بالمكتب كـ Oracle و SAP (متوفر في الباقة المخصصة).",
                      "Connecting office ERP systems like Oracle & SAP (available in Enterprise plan)."
                    )}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-[#f5f5f5] dark:bg-[#221812] text-[#757575] dark:text-[#8e8680] px-[8px] py-[3px] rounded border border-[#e0e0e0] dark:border-[#38271c] shrink-0">
                {t("غير متوفرة", "Not Included")}
              </span>
            </div>
            </>
            )}
          </div>
        </div>
      </div>

      {/* 5. Subscribed Offices Table */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#e2ded7] dark:border-[#38271c] p-5 sm:p-6 shadow-2xs">
        {/* Table Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[10px] pb-[16px] border-b border-[#f0eeea] dark:border-[#38271c]">
          <div className="flex items-center gap-[10px]">
            <h2 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {t("المكاتب المشتركة في الباقة", "Firms Subscribed to this Plan")}
            </h2>
            <span className="text-[11px] font-bold bg-[#f5f3ef] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] px-[8px] py-[2px] rounded border border-[#e2ded7] dark:border-[#38271c]">
              {subscribedFirmsCount} {t("مكتباً", "firms")}
            </span>
            <span className="text-[12px] text-[#737067] dark:text-[#cdc5bd] hidden md:inline">
              | {t(`استعراض لأحدث المكاتب والشركات القانونية المسجلة في ${planName}`, `Overview of recent law firms subscribed to ${planName}`)}
            </span>
          </div>

          <button
            type="button"
            onClick={onNavigateToClients || onBack}
            className="text-[13px] font-bold text-[#9c6402] dark:text-[#f3c27e] hover:text-[#855402] dark:hover:text-[#e29d38] flex items-center gap-[4px] cursor-pointer transition-colors"
          >
            <span>{t(`عرض جميع المكاتب المشتركة (${subscribedFirmsCount})`, `View all subscribed firms (${subscribedFirmsCount})`)}</span>
            <span aria-hidden="true" className={cn(isEn && "rotate-180 inline-block")}>&larr;</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-start text-[13px]">
            <thead>
              <tr className="border-b border-[#f0eeea] dark:border-[#38271c] text-[#737067] dark:text-[#cdc5bd] text-[12px] font-semibold">
                <th className="py-[12px] px-[12px] text-start">{t("اسم المنشأة القانونية", "Legal Firm Name")}</th>
                <th className="py-[12px] px-[12px] text-start">{t("المدير التنفيذي / المالك", "CEO / Owner")}</th>
                <th className="py-[12px] px-[12px] text-start">{t("تاريخ الاشتراك", "Subscription Date")}</th>
                <th className="py-[12px] px-[12px] text-start">{t("موعد التجديد", "Renewal Date")}</th>
                <th className="py-[12px] px-[12px] text-start">{t("دورة السداد والحالة", "Billing Cycle & Status")}</th>
                <th className="py-[12px] px-[12px] text-center">{t("الإجراءات", "Actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0eeea] dark:divide-[#38271c]">
              {isLoadingSubscribers ? (
                <tr>
                  <td colSpan={6} className="py-[32px] text-center text-[#737067] dark:text-[#cdc5bd]">
                    {t("جاري تحميل المكاتب المشتركة...", "Loading subscribed firms...")}
                  </td>
                </tr>
              ) : pagedFirms.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-[32px] text-center text-[#737067] dark:text-[#cdc5bd]">
                    {t("لا يوجد مكاتب مشتركة في هذه الباقة حالياً.", "No offices currently subscribed to this plan.")}
                  </td>
                </tr>
              ) : (
                pagedFirms.map((firm) => (
                  <tr
                    key={firm.id}
                    className="hover:bg-[#faf8f5] dark:hover:bg-[#281c15]/60 transition-colors"
                  >
                  {/* Firm name and license */}
                  <td className="py-[14px] px-[12px]">
                    <div className="flex items-center gap-[10px]">
                      <div className="size-[34px] rounded-[6px] bg-[#f5f3ef] dark:bg-[#281c15] border border-[#e2ded7] dark:border-[#38271c] flex items-center justify-center font-bold text-[#9c6402] dark:text-[#e29d38] shrink-0">
                        {firm.initial}
                      </div>
                      <div>
                        <div className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                          {firm.name}
                        </div>
                        <div className="text-[11px] text-[#737067] dark:text-[#8e8680]">
                          {firm.licenseNumber} • {firm.city}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Owner */}
                  <td className="py-[14px] px-[12px]">
                    <div className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{firm.owner}</div>
                    <div className="text-[11px] text-[#737067] dark:text-[#8e8680]">
                      {firm.ownerRole}
                    </div>
                  </td>

                  {/* Subscription Date */}
                  <td className="py-[14px] px-[12px] text-[#514537] dark:text-[#cdc5bd] font-medium">
                    {firm.subscriptionDate}
                  </td>

                  {/* Renewal Date */}
                  <td className="py-[14px] px-[12px]">
                    <span
                      className={`font-semibold ${
                        firm.status === "auto_renew"
                          ? "text-[#b45309] dark:text-[#f3c27e]"
                          : "text-[#1b1c1a] dark:text-[#fdfbf7]"
                      }`}
                    >
                      {firm.renewalDate}
                    </span>
                  </td>

                  {/* Billing cycle & Status badge */}
                  <td className="py-[14px] px-[12px]">
                    {firm.status === "active" ? (
                      <span className="inline-flex items-center gap-[6px] bg-[#e8f5e9] dark:bg-[#132c1c] text-[#15803d] dark:text-[#6ee7b7] border border-[#c8e6c9] dark:border-[#165a2e] px-[8px] py-[3px] rounded-full text-[11px] font-bold">
                        <span className="size-[6px] rounded-full bg-[#15803d] dark:bg-[#6ee7b7]" />
                        <span>{t(firm.billingCycle, firm.billingCycle === "سنوي" ? "Annual" : "Monthly")}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-[6px] bg-[#fef3c7] dark:bg-[rgba(226,157,56,0.18)] text-[#92400e] dark:text-[#f3c27e] border border-[#fde68a] dark:border-[#e29d38]/40 px-[8px] py-[3px] rounded-full text-[11px] font-bold">
                        <span className="size-[6px] rounded-full bg-[#f59e0b] dark:bg-[#f3c27e]" />
                        <span>{t(firm.billingCycle, firm.billingCycle === "سنوي" ? "Annual" : "Monthly")}</span>
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-[14px] px-[12px]">
                    <div className="flex items-center justify-center gap-[8px]">
                      <button
                        type="button"
                        onClick={() =>
                          toast.info(t(`عرض تفاصيل منشأة: ${firm.name}`, `View firm details: ${firm.name}`))
                        }
                        className="p-[6px] rounded-[4px] hover:bg-[#eae8e4] dark:hover:bg-[#281c15] text-[#737067] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] cursor-pointer"
                        title={t("عرض الملف", "View Profile")}
                      >
                        <Eye className="size-[15px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          toast.info(t(`إدارة اشتراك منشأة: ${firm.name}`, `Manage subscription: ${firm.name}`))
                        }
                        className="p-[6px] rounded-[4px] hover:bg-[#eae8e4] dark:hover:bg-[#281c15] text-[#737067] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] cursor-pointer"
                        title={t("إعدادات الاشتراك", "Subscription Settings")}
                      >
                        <SlidersHorizontal className="size-[15px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[12px] pt-[16px] mt-[12px] border-t border-[#f0eeea] dark:border-[#38271c] text-[12px] text-[#737067] dark:text-[#cdc5bd]">
          <div className="flex items-center gap-3">
            <div>
              {t(
                `عرض ${totalItems === 0 ? 0 : (validCurrentPage - 1) * pageSize + 1} إلى ${Math.min(validCurrentPage * pageSize, totalItems)} من أصل ${totalItems} مكتباً`,
                `Showing ${totalItems === 0 ? 0 : (validCurrentPage - 1) * pageSize + 1} to ${Math.min(validCurrentPage * pageSize, totalItems)} of ${totalItems} law firms`
              )}
            </div>

            <div className="flex items-center gap-2 border-s border-[#eae8e4] dark:border-[#38271c] ps-3">
              <span className="text-[11px] text-[#837565] dark:text-[#cdc5bd]">
                {t("صفوف بالصفحة:", "Rows per page:")}
              </span>
              <PageSizeDropdown
                value={pageSize}
                onChange={(newSize) => {
                  setPageSize(newSize);
                  setCurrentPage(1);
                }}
                options={[5, 10, 20, 50]}
              />
            </div>
          </div>

          <div className="flex items-center gap-[4px]">
            {/* First Page */}
            <button
              type="button"
              disabled={validCurrentPage <= 1}
              onClick={() => setCurrentPage(1)}
              title={t("الصفحة الأولى", "First Page")}
              className="size-[28px] rounded border border-[#e2ded7] dark:border-[#38271c] bg-white dark:bg-[#221812] text-[#737067] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
            >
              <ChevronsRight className={cn("size-[14px]", isEn && "rotate-180")} />
            </button>

            {/* Previous Page */}
            <button
              type="button"
              disabled={validCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-[10px] py-[4px] rounded border border-[#e2ded7] dark:border-[#38271c] bg-white dark:bg-[#221812] text-[#737067] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-[4px]"
            >
              <ChevronRight className={cn("size-[14px]", isEn && "rotate-180")} />
              <span>{t("السابق", "Previous")}</span>
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNumber = idx + 1;
              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`size-[28px] rounded font-bold text-[12px] flex items-center justify-center cursor-pointer ${
                    validCurrentPage === pageNumber
                      ? "bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f]"
                      : "border border-[#e2ded7] dark:border-[#38271c] bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15]"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            {/* Next Page */}
            <button
              type="button"
              disabled={validCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-[10px] py-[4px] rounded border border-[#e2ded7] dark:border-[#38271c] bg-white dark:bg-[#221812] text-[#737067] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-[4px]"
            >
              <span>{t("التالي", "Next")}</span>
              <ChevronLeft className={cn("size-[14px]", isEn && "rotate-180")} />
            </button>

            {/* Last Page */}
            <button
              type="button"
              disabled={validCurrentPage >= totalPages}
              onClick={() => setCurrentPage(totalPages)}
              title={t("الصفحة الأخيرة", "Last Page")}
              className="size-[28px] rounded border border-[#e2ded7] dark:border-[#38271c] bg-white dark:bg-[#221812] text-[#737067] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
            >
              <ChevronsLeft className={cn("size-[14px]", isEn && "rotate-180")} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
