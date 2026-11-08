"use client";

import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  Plus,
  Building2,
  ShieldCheck,
  Hourglass,
  BellRing,
  MoreVertical,
  ArrowUp,
  Ban,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { toast } from "sonner";
import { DetailedSubscribedFirm, PricingPlanItem } from "../types/plan.types";
import { UpgradeSubscriptionDialog } from "./UpgradeSubscriptionDialog";
import { DeactivateSubscriptionDialog } from "./DeactivateSubscriptionDialog";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";
import { PageSizeDropdown } from "@/components/shared/PageSizeDropdown";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { fetchPlanSubscribers } from "@/lib/api/plans";
import { unwrapList, asString, asNumber } from "@/lib/api/helpers";
import { normalizeLogoUrl } from "@/lib/api/mappers";

interface SubscribedFirmsViewProps {
  plan?: PricingPlanItem;
  onBack: () => void;
  onAddNewFirm?: () => void;
  onViewOfficeDetails?: (firm: DetailedSubscribedFirm) => void;
}

function mapSubscriberFirm(raw: Record<string, unknown>): DetailedSubscribedFirm {
  const name = asString(raw.name || raw.firm_name, "مكتب");
  const activeSub = (raw.active_subscription || {}) as Record<string, unknown>;
  const statusRaw = asString(activeSub.status || raw.status || raw.subscription_status, "active").toLowerCase();
  const status: DetailedSubscribedFirm["status"] = statusRaw.includes("trial")
    ? "trial"
    : statusRaw.includes("suspend") || statusRaw.includes("تعطيل")
      ? "suspended"
      : statusRaw.includes("pend")
        ? "pending_payment"
        : statusRaw.includes("expir")
          ? "expiring_soon"
          : "active";

  const rawRenewal = asString(activeSub.renewal_date || raw.subscription_end || raw.renewal_date || raw.ends_at, "");
  let remainingDaysText = "—";
  if (rawRenewal) {
    try {
      const diffMs = new Date(rawRenewal).getTime() - Date.now();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      remainingDaysText = diffDays > 0 ? `${diffDays} يوماً` : "منتهي";
    } catch {
      // ignore
    }
  }

  const rawCycle = asString(activeSub.billing_cycle || raw.billing_cycle, "yearly").toLowerCase();
  const renewalCycle = rawCycle.includes("month") || rawCycle.includes("شهر") ? "شهري" : "سنوي";

  return {
    id: asString(raw.id, String(Math.random())),
    initial: name.trim().charAt(0) || "م",
    name,
    licenseNumber: asString(raw.license_number, "—"),
    city: asString(raw.city, "—"),
    owner: asString(raw.owner_name || raw.owner, "—"),
    contact: asString(raw.phone || raw.email, "—"),
    logo: normalizeLogoUrl(raw.logo ? String(raw.logo) : undefined),
    taxNumber: raw.tax_number ? asString(raw.tax_number) : undefined,
    subscriptionCode: activeSub.subscription_code ? asString(activeSub.subscription_code) : undefined,
    amount: activeSub.amount ? asString(activeSub.amount) : undefined,
    paymentMethod: activeSub.payment_method ? asString(activeSub.payment_method) : undefined,
    lawyersUsed: asNumber(raw.lawyers_used, 0),
    lawyersLimit: asNumber(raw.lawyers_limit || (raw.plan as any)?.max_lawyers, 8),
    casesUsed: asNumber(raw.cases_used, 0),
    casesLimit: asNumber(raw.cases_limit || (raw.plan as any)?.max_cases, 350),
    agentsUsed: asNumber(raw.agents_used, 0),
    agentsLimit: asNumber(raw.agents_limit || (raw.plan as any)?.max_power_of_attorney, 555),
    renewalDate: rawRenewal && rawRenewal.includes("T") ? rawRenewal.split("T")[0] : rawRenewal || "—",
    renewalCycle,
    remainingDaysText,
    status,
  };
}

export function SubscribedFirmsView({
  plan,
  onBack,
  onAddNewFirm,
  onViewOfficeDetails,
}: SubscribedFirmsViewProps) {
  const { t, isEn } = useLanguage();
  const [firms, setFirms] = useState<DetailedSubscribedFirm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentPlan: PricingPlanItem = plan || {
    id: "silver",
    name: t("الباقة الفضية", "Silver Plan"),
    code: "PLAN-SLV-02",
    description: "",
    type: "paid",
    monthlyPrice: 399,
    subscribedFirmsCount: firms.length,
    sharePercentage: "0%",
    isActive: true,
    limits: {
      lawyers: "—",
      cases: "—",
      agents: "—",
      clients: "—",
      storage: "—",
      support: "—",
    },
  };

  const loadSubscribers = React.useCallback(() => {
    if (!plan?.id) {
      setIsLoading(false);
      setFirms([]);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetchPlanSubscribers(plan.id)
      .then((payload) => {
        if (cancelled) return;
        const mapped = unwrapList<Record<string, unknown>>(payload).map(mapSubscriberFirm);
        setFirms(mapped);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "فشل تحميل قائمة المكاتب المشتركة");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [plan?.id]);

  useEffect(() => {
    return loadSubscribers();
  }, [loadSubscribers]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "active" | "trial" | "near_limit" | "overdue"
  >("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [renewalFilter, setRenewalFilter] = useState("all");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Active Menu Dropdown state (rendered via createPortal to prevent table scrollbars)
  const [openMenuFirm, setOpenMenuFirm] = useState<{
    firm: DetailedSubscribedFirm;
    coords: { left: number; top?: number; bottom?: number };
  } | null>(null);

  useEffect(() => {
    if (!openMenuFirm) return;
    const handleClose = () => setOpenMenuFirm(null);
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-actions-menu]") && !target.closest("[data-actions-popover]")) {
        setOpenMenuFirm(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenuFirm(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleClose, true);
    window.addEventListener("resize", handleClose);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleClose, true);
      window.removeEventListener("resize", handleClose);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openMenuFirm]);

  const toggleFirmMenu = (e: React.MouseEvent<HTMLButtonElement>, firm: DetailedSubscribedFirm) => {
    e.stopPropagation();
    if (openMenuFirm?.firm.id === firm.id) {
      setOpenMenuFirm(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const menuEstimatedHeight = 150;
    const menuWidth = 190;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUp = spaceBelow < menuEstimatedHeight + 12 && spaceAbove > spaceBelow;

    let left = rect.left;
    if (left + menuWidth > window.innerWidth - 8) {
      left = window.innerWidth - menuWidth - 8;
    }
    if (left < 8) {
      left = 8;
    }

    setOpenMenuFirm({
      firm,
      coords: {
        left,
        top: openUp ? undefined : rect.bottom + 4,
        bottom: openUp ? window.innerHeight - rect.top + 4 : undefined,
      },
    });
  };

  // Dialog states
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [selectedFirm, setSelectedFirm] =
    useState<DetailedSubscribedFirm | null>(null);

  const handleOpenUpgrade = (firm: DetailedSubscribedFirm) => {
    setSelectedFirm(firm);
    setOpenMenuFirm(null);
    setUpgradeDialogOpen(true);
  };

  const handleOpenDeactivate = (firm: DetailedSubscribedFirm) => {
    setSelectedFirm(firm);
    setOpenMenuFirm(null);
    setDeactivateDialogOpen(true);
  };

  const handleConfirmUpgrade = (firmId: string, targetPlan: string) => {
    toast.success(`تمت ترقية اشتراك المكتب إلى "${targetPlan}" بنجاح.`);
  };

  const handleConfirmDeactivate = (
    firmId: string,
    reason: string,
    notes: string,
    mode: "immediate" | "end_of_cycle"
  ) => {
    setFirms((prev) =>
      prev.map((f) =>
        f.id === firmId ? { ...f, status: "suspended" as const } : f
      )
    );
    toast.success(
      mode === "immediate"
        ? "تم تعطيل اشتراك المكتب فورياً بنجاح."
        : "تمت جدولة تعطيل اشتراك المكتب بنهاية الدورة الحالية."
    );
  };

  // Tab counts dynamically calculated from actual firms
  const tabCounts = useMemo(() => {
    const all = firms.length;
    const active = firms.filter((f) => f.status === "active").length;
    const trial = firms.filter((f) => f.status === "trial").length;
    const near_limit = firms.filter(
      (f) => f.casesCritical || f.lawyersUsed >= f.lawyersLimit
    ).length;
    const overdue = firms.filter(
      (f) => f.status === "pending_payment" || f.isOverdue
    ).length;
    return { all, active, trial, near_limit, overdue };
  }, [firms]);

  // Filtered firms
  const filteredFirms = useMemo(() => {
    return firms.filter((firm) => {
      // Tab filter
      if (activeTab === "active" && firm.status !== "active") return false;
      if (activeTab === "trial" && firm.status !== "trial") return false;
      if (
        activeTab === "near_limit" &&
        !firm.casesCritical &&
        firm.lawyersUsed < firm.lawyersLimit
      ) {
        return false;
      }
      if (
        activeTab === "overdue" &&
        firm.status !== "pending_payment" &&
        !firm.isOverdue
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = firm.name.toLowerCase().includes(q);
        const matchOwner = firm.owner.toLowerCase().includes(q);
        const matchLicense = firm.licenseNumber.includes(q);
        const matchCity = firm.city.toLowerCase().includes(q);
        if (!matchName && !matchOwner && !matchLicense && !matchCity) {
          return false;
        }
      }

      return true;
    });
  }, [firms, activeTab, searchQuery]);

  const totalItems = filteredFirms.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const paginatedFirms = useMemo(() => {
    if (pageSize >= 9999) return filteredFirms;
    const start = (currentPage - 1) * pageSize;
    return filteredFirms.slice(start, start + pageSize);
  }, [filteredFirms, currentPage, pageSize]);

  return (
    <div className="w-full space-y-6 font-['Cairo',sans-serif]">
      {/* 1. Top Identity & Action Header */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-2xs border border-[#f0eeea] dark:border-[#38271c] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Right: Title & Badge */}
        <div>
          <div className="flex items-center gap-[12px] mb-[6px]">
            <button
              type="button"
              onClick={onBack}
              className="p-[6px] rounded-[6px] hover:bg-[#eae8e4] dark:hover:bg-[#281c15] text-[#737067] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] transition-colors cursor-pointer"
              title={t("العودة للباقات", "Back to Plans")}
            >
              <ArrowRight className={cn("size-[20px]", isEn && "rotate-180")} />
            </button>
            <h1 className="text-[24px] md:text-[26px] font-extrabold text-[#1b1c1a] dark:text-[#fdfbf7] leading-tight">
              {t("المكاتب المشتركة في", "Offices Subscribed to")} {currentPlan.name}
            </h1>
            <span className="font-bold text-[11px] text-[#514537] dark:text-[#cdc5bd] bg-[#f5f3ef] dark:bg-[#281c15] border border-[#e2ded7] dark:border-[#38271c] px-[10px] py-[3px] rounded">
              {currentPlan.name} | {currentPlan.monthlyPrice} {t("ر.س / شهرياً", "SAR / month")}
            </span>
          </div>

          <p className="text-[13px] text-[#737067] dark:text-[#cdc5bd] max-w-[650px] leading-relaxed">
            {t(
              `متابعة المكاتب المسجلة على ${currentPlan.name} وإدارة اشتراكاتها ومراقبة حدود استهلاك الموارد.`,
              `Monitor law firms registered to ${currentPlan.name}, manage their subscriptions, and observe resource quotas.`
            )}
          </p>
        </div>

        {/* Left: Add Firm CTA */}
        <div className="shrink-0 flex items-center gap-[10px]">
          <button
            type="button"
            onClick={
              onAddNewFirm || (() => toast.info(t("فتح نموذج إضافة اشتراك مكتب جديد", "Open add new law firm subscription form")))
            }
            className="bg-[#9c6402] hover:bg-[#855402] dark:bg-[#e29d38] dark:hover:bg-[#d08c2a] text-white dark:text-[#1c140f] font-bold text-[13px] px-[18px] py-[9px] rounded-[6px] shadow-xs flex items-center gap-[8px] transition-colors cursor-pointer"
          >
            <Plus className="size-[16px] stroke-[2.5]" />
            <span>{t("إضافة اشتراك مكتب", "Add Office Subscription")}</span>
          </button>
        </div>
      </div>

      {/* 2. Four KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total */}
        <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#e2ded7] dark:border-[#38271c] p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-[10px]">
            <span className="text-[12px] font-semibold text-[#737067] dark:text-[#cdc5bd]">
              {t("إجمالي المكاتب المشتركة", "Total Subscribed Offices")}
            </span>
            <div className="p-[8px] rounded-[6px] bg-[#fbf6ee] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 text-[#9c6402] dark:text-[#e29d38]">
              <Building2 className="size-[18px]" />
            </div>
          </div>
          <div className="flex items-baseline gap-[6px] mb-[6px]">
            <span className="text-[28px] font-black text-[#1b1c1a] dark:text-[#fdfbf7]">{currentPlan.subscribedFirmsCount}</span>
            <span className="text-[13px] font-bold text-[#737067] dark:text-[#8e8680]">
              {t("مكتباً", "offices")}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold bg-[#fbf6ee] dark:bg-[#2e1d0f] text-[#9c6402] dark:text-[#fbbf24] px-[8px] py-[2px] rounded-full border border-[#f5e3c8] dark:border-amber-500/40">
              {currentPlan.sharePercentage || t("حصة الباقة من المنصة", "Plan platform share")}
            </span>
          </div>
        </div>

        {/* Card 2: Active */}
        <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#e2ded7] dark:border-[#38271c] p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-[10px]">
            <span className="text-[12px] font-semibold text-[#737067] dark:text-[#cdc5bd]">
              {t("اشتراكات نشطة", "Active Subscriptions")}
            </span>
            <div className="p-[8px] rounded-[6px] bg-[#e8f5e9] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 text-[#15803d] dark:text-[#e29d38]">
              <ShieldCheck className="size-[18px]" />
            </div>
          </div>
          <div className="flex items-baseline gap-[6px] mb-[6px]">
            <span className="text-[28px] font-black text-[#1b1c1a] dark:text-[#fdfbf7]">
              {Math.max(1, Math.round(currentPlan.subscribedFirmsCount * 0.92))}
            </span>
            <span className="text-[13px] font-bold text-[#737067] dark:text-[#8e8680]">
              {t("مكتباً", "offices")}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold bg-[#e8f5e9] dark:bg-[#132c1c] text-[#15803d] dark:text-[#6ee7b7] px-[8px] py-[2px] rounded-full border border-[#c8e6c9] dark:border-emerald-500/40">
              {t("• 92.3% نشط", "• 92.3% active")}
            </span>
          </div>
        </div>

        {/* Card 3: Trial */}
        <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#e2ded7] dark:border-[#38271c] p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-[10px]">
            <span className="text-[12px] font-semibold text-[#737067] dark:text-[#cdc5bd]">
              {t("اشتراكات قيد التجربة", "Trial Subscriptions")}
            </span>
            <div className="p-[8px] rounded-[6px] bg-[#e0f2fe] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 text-[#0369a1] dark:text-[#e29d38]">
              <Hourglass className="size-[18px]" />
            </div>
          </div>
          <div className="flex items-baseline gap-[6px] mb-[6px]">
            <span className="text-[28px] font-black text-[#1b1c1a] dark:text-[#fdfbf7]">
              {Math.max(1, Math.round(currentPlan.subscribedFirmsCount * 0.058))}
            </span>
            <span className="text-[13px] font-bold text-[#737067] dark:text-[#8e8680]">
              {t("مكاتب", "offices")}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold bg-[#e0f2fe] dark:bg-[#1e293b] text-[#0369a1] dark:text-[#93c5fd] px-[8px] py-[2px] rounded-full border border-[#bae6fd] dark:border-blue-500/40">
              {t("فترة تجريبية سارية", "Active trial period")}
            </span>
          </div>
        </div>

        {/* Card 4: Overdue/Expiring */}
        <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#e2ded7] dark:border-[#38271c] p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-[10px]">
            <span className="text-[12px] font-semibold text-[#737067] dark:text-[#cdc5bd]">
              {t("اشتراكات منتهية أو متأخرة", "Expired or Overdue Subscriptions")}
            </span>
            <div className="p-[8px] rounded-[6px] bg-[#fee2e2] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 text-[#b91c1c] dark:text-[#e29d38]">
              <BellRing className="size-[18px]" />
            </div>
          </div>
          <div className="flex items-baseline gap-[6px] mb-[6px]">
            <span className="text-[28px] font-black text-[#b91c1c] dark:text-[#f87171]">
              {Math.max(1, currentPlan.subscribedFirmsCount - Math.round(currentPlan.subscribedFirmsCount * 0.92) - Math.max(1, Math.round(currentPlan.subscribedFirmsCount * 0.058)))}
            </span>
            <span className="text-[13px] font-bold text-[#737067] dark:text-[#8e8680]">
              {t("مكاتب", "offices")}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold bg-[#fee2e2] dark:bg-[#2c1515] text-[#b91c1c] dark:text-[#fca5a5] px-[8px] py-[2px] rounded-full border border-[#fecaca] dark:border-rose-500/40">
              {t("• يتطلب متابعة مالية", "• Requires financial follow-up")}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Unified Filter Bar */}
      <UnifiedFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={t(
          "ابحث باسم المكتب، المالك، رقم الترخيص، أو السجل...",
          "Search by office name, owner, license, or CR..."
        )}
        primaryFilterValue={activeTab}
        onPrimaryFilterChange={(v) =>
          setActiveTab(
            v as "all" | "active" | "trial" | "near_limit" | "overdue"
          )
        }
        primaryFilterOptions={[
          { label: `${t("الكل", "All")} (${tabCounts.all})`, value: "all" },
          { label: `${t("النشطة", "Active")} (${tabCounts.active})`, value: "active" },
          { label: `${t("تحت التجربة", "Trial")} (${tabCounts.trial})`, value: "trial" },
          { label: `${t("اقترب من الحد", "Near Limit")} (${tabCounts.near_limit})`, value: "near_limit" },
          { label: `${t("متعثر الدفع", "Overdue")} (${tabCounts.overdue})`, value: "overdue" },
        ]}
        hasActiveFilters={
          activeTab !== "all" ||
          statusFilter !== "all" ||
          renewalFilter !== "all" ||
          resourceFilter !== "all" ||
          Boolean(searchQuery)
        }
        onReset={() => {
          setSearchQuery("");
          setActiveTab("all");
          setStatusFilter("all");
          setRenewalFilter("all");
          setResourceFilter("all");
        }}
        drawerTitle={t("تصفية المشتركين في الباقة", "Filter Plan Subscribers")}
        drawerContent={
          <div className="space-y-4 text-start font-['Cairo',sans-serif]">
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                {t("حالة الاشتراك", "Subscription Status")}
              </label>
              <DashboardSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("الكل", "All")}
                </option>
                <option value="active" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("نشط", "Active")}
                </option>
                <option value="trial" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("قيد التجربة", "Trial")}
                </option>
                <option value="pending" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("بانتظار السداد", "Pending Payment")}
                </option>
              </DashboardSelect>
            </div>

            {/* Renewal Filter */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                {t("موعد التجديد", "Renewal Schedule")}
              </label>
              <DashboardSelect
                value={renewalFilter}
                onChange={(e) => setRenewalFilter(e.target.value)}
              >
                <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("الكل", "All")}
                </option>
                <option value="annual" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("سنوي", "Annual")}
                </option>
                <option value="monthly" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("شهري", "Monthly")}
                </option>
              </DashboardSelect>
            </div>

            {/* Resource Filter */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                {t("استهلاك الموارد", "Resource Usage")}
              </label>
              <DashboardSelect
                value={resourceFilter}
                onChange={(e) => setResourceFilter(e.target.value)}
              >
                <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("الكل", "All")}
                </option>
                <option value="high" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("استهلاك مرتفع (>80%)", "High Usage (>80%)")}
                </option>
                <option value="full" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("بلغ الحد الأقصى", "Max Quota Reached")}
                </option>
              </DashboardSelect>
            </div>
          </div>
        }
      />

      {/* 4. Comprehensive Data Table */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#e2ded7] dark:border-[#38271c] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full text-start text-[12px]">
            <thead>
              <tr className="bg-[#faf8f5] dark:bg-[#281c15] border-b border-[#f0eeea] dark:border-[#38271c] text-[#737067] dark:text-[#cdc5bd] font-semibold">
                <th className="py-[12px] px-[14px] text-start">{t("اسم المنشأة والمكتب", "Firm & Office Name")}</th>
                <th className="py-[12px] px-[14px] text-start">{t("المالك والمسؤول", "Owner & Officer")}</th>
                <th className="py-[12px] px-[14px] text-start">{t("المحامين (حد 4)", "Lawyers (Max 4)")}</th>
                <th className="py-[12px] px-[14px] text-start">{t("القضايا (حد 200)", "Cases (Max 200)")}</th>
                <th className="py-[12px] px-[14px] text-start">{t("الوكلاء (حد 5)", "Agents (Max 5)")}</th>
                <th className="py-[12px] px-[14px] text-start">{t("التجديد الدوري", "Periodic Renewal")}</th>
                <th className="py-[12px] px-[14px] text-start">{t("حالة الاشتراك", "Subscription Status")}</th>
                <th className="py-[12px] px-[14px] text-center">{t("الإجراءات", "Actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0eeea] dark:divide-[#38271c]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-[#837565] dark:text-[#a89f91]">
                    {t("جاري تحميل المكاتب المشتركة...", "Loading subscribed firms...")}
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-red-600 dark:text-red-400">
                    <div>{error}</div>
                    <button
                      type="button"
                      onClick={loadSubscribers}
                      className="mt-2 px-3 py-1 bg-[#9c6402] hover:bg-[#855402] text-white text-xs font-bold rounded cursor-pointer"
                    >
                      {t("إعادة المحاولة", "Retry")}
                    </button>
                  </td>
                </tr>
              ) : paginatedFirms.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-[#837565] dark:text-[#a89f91]">
                    {t("لا يوجد مشتركون في هذه الباقة", "No subscribers in this plan")}
                  </td>
                </tr>
              ) : (
                paginatedFirms.map((firm) => (
                <tr
                  key={firm.id}
                  className="hover:bg-[#faf8f5] dark:hover:bg-[#281c15]/60 transition-colors"
                >
                  {/* Firm name & details */}
                  <td className="py-[14px] px-[14px]">
                    <div className="flex items-center gap-[10px]">
                      <div className="size-[34px] rounded-[6px] bg-[#f5f3ef] dark:bg-[#281c15] border border-[#e2ded7] dark:border-[#38271c] flex items-center justify-center font-bold text-[#9c6402] dark:text-[#e29d38] shrink-0 overflow-hidden">
                        {firm.logo ? (
                          <img
                            src={firm.logo}
                            alt={firm.name}
                            className="size-full object-cover rounded-[6px]"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          firm.initial
                        )}
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => onViewOfficeDetails?.(firm)}
                          className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7] hover:text-[#9c6402] dark:hover:text-[#f3c27e] transition-colors text-start cursor-pointer block"
                        >
                          {firm.name}
                        </button>
                        <div className="text-[11px] text-[#737067] dark:text-[#8e8680]">
                          {firm.licenseNumber} • {firm.city}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Owner & contact */}
                  <td className="py-[14px] px-[14px]">
                    <div className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{firm.owner}</div>
                    <div className="text-[11px] text-[#737067] dark:text-[#8e8680]">
                      {firm.contact}
                    </div>
                  </td>

                  {/* Lawyers limit progress */}
                  <td className="py-[14px] px-[14px] min-w-[120px]">
                    <div className="space-y-[4px]">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                          {firm.lawyersUsed} / {firm.lawyersLimit}
                        </span>
                        {firm.lawyersUsed >= firm.lawyersLimit ? (
                          <span className="text-[10px] font-bold text-[#b91c1c] dark:text-[#f87171] bg-[#fee2e2] dark:bg-[#381a1a] px-[4px] py-[1px] rounded">
                            {t("بلغ الحد", "Maxed")}
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#15803d] dark:text-[#6ee7b7]">
                            {t(`متبقي ${firm.lawyersLimit - firm.lawyersUsed}`, `${firm.lawyersLimit - firm.lawyersUsed} left`)}
                          </span>
                        )}
                      </div>
                      <div className="h-[4px] w-full bg-[#eeebe5] dark:bg-[#38271c] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            firm.lawyersUsed >= firm.lawyersLimit
                              ? "bg-[#b91c1c] dark:bg-[#ef4444]"
                              : "bg-[#15803d] dark:bg-[#22c55e]"
                          }`}
                          style={{
                            width: `${(firm.lawyersUsed / firm.lawyersLimit) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Cases limit progress */}
                  <td className="py-[14px] px-[14px] min-w-[130px]">
                    <div className="space-y-[4px]">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                          {firm.casesUsed} / {firm.casesLimit}
                        </span>
                        {firm.casesCritical ? (
                          <span className="text-[10px] font-bold text-[#b91c1c] dark:text-[#f87171] bg-[#fee2e2] dark:bg-[#381a1a] px-[4px] py-[1px] rounded">
                            {Math.round((firm.casesUsed / firm.casesLimit) * 100)}% ({t("حرج", "Critical")})
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#737067] dark:text-[#8e8680]">
                            {Math.round((firm.casesUsed / firm.casesLimit) * 100)}%
                          </span>
                        )}
                      </div>
                      <div className="h-[4px] w-full bg-[#eeebe5] dark:bg-[#38271c] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            firm.casesCritical
                              ? "bg-[#b91c1c] dark:bg-[#ef4444]"
                              : firm.casesUsed / firm.casesLimit > 0.7
                              ? "bg-[#d97706] dark:bg-[#f59e0b]"
                              : "bg-[#15803d] dark:bg-[#22c55e]"
                          }`}
                          style={{
                            width: `${(firm.casesUsed / firm.casesLimit) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Agents limit progress */}
                  <td className="py-[14px] px-[14px] min-w-[110px]">
                    <div className="space-y-[4px]">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                          {firm.agentsUsed} / {firm.agentsLimit}
                        </span>
                        {firm.agentsUsed >= firm.agentsLimit ? (
                          <span className="text-[10px] font-bold text-[#b91c1c] dark:text-[#f87171]">
                            {t("مكتمل", "Maxed")}
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#737067] dark:text-[#8e8680]">
                            {Math.round((firm.agentsUsed / firm.agentsLimit) * 100)}%
                          </span>
                        )}
                      </div>
                      <div className="h-[4px] w-full bg-[#eeebe5] dark:bg-[#38271c] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            firm.agentsUsed >= firm.agentsLimit
                              ? "bg-[#b91c1c] dark:bg-[#ef4444]"
                              : "bg-[#15803d] dark:bg-[#22c55e]"
                          }`}
                          style={{
                            width: `${(firm.agentsUsed / firm.agentsLimit) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Renewal Date & Cycle */}
                  <td className="py-[14px] px-[14px]">
                    <div className="flex items-center gap-[6px]">
                      <span
                        className={`font-bold ${
                          firm.isOverdue ? "text-[#b91c1c] dark:text-[#f87171]" : "text-[#1b1c1a] dark:text-[#fdfbf7]"
                        }`}
                      >
                        {firm.renewalDate}
                      </span>
                      <span className="text-[10px] font-bold bg-[#f5f3ef] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] px-[6px] py-[1px] rounded border border-[#e2ded7] dark:border-[#38271c]">
                        {t(firm.renewalCycle, firm.renewalCycle === "سنوي" ? "Annual" : "Monthly")}
                      </span>
                    </div>
                    <div
                      className={`text-[11px] mt-[2px] ${
                        firm.isOverdue ? "text-[#b91c1c] dark:text-[#f87171] font-bold" : "text-[#737067] dark:text-[#8e8680]"
                      }`}
                    >
                      {firm.remainingDaysText}
                    </div>
                  </td>

                  {/* Subscription status badge */}
                  <td className="py-[14px] px-[14px]">
                    {firm.status === "active" && (
                      <span className="inline-flex items-center gap-[4px] text-[11px] font-bold text-[#15803d] dark:text-[#6ee7b7] bg-[#e8f5e9] dark:bg-[#132c1c] px-[8px] py-[3px] rounded-full border border-[#c8e6c9] dark:border-[#165a2e]">
                        <span className="size-[6px] rounded-full bg-[#15803d] dark:bg-[#6ee7b7]" />
                        <span>{t("نشط", "Active")}</span>
                      </span>
                    )}

                    {firm.status === "expiring_soon" && (
                      <span className="inline-flex items-center gap-[4px] text-[11px] font-bold text-[#92400e] dark:text-[#f3c27e] bg-[#fef3c7] dark:bg-[rgba(226,157,56,0.18)] px-[8px] py-[3px] rounded-full border border-[#fde68a] dark:border-[#e29d38]/40">
                        <span className="size-[6px] rounded-full bg-[#f59e0b] dark:bg-[#f3c27e]" />
                        <span>{t("ينتهي قريباً", "Expiring Soon")}</span>
                      </span>
                    )}

                    {firm.status === "trial" && (
                      <span className="inline-flex items-center gap-[4px] text-[11px] font-bold text-[#0369a1] dark:text-[#93c5fd] bg-[#e0f2fe] dark:bg-[#1e293b] px-[8px] py-[3px] rounded-full border border-[#bae6fd] dark:border-blue-500/40">
                        <span className="size-[6px] rounded-full bg-[#0284c7] dark:bg-[#60a5fa]" />
                        <span>{t("قيد التجربة", "Trial")}</span>
                      </span>
                    )}

                    {firm.status === "pending_payment" && (
                      <span className="inline-flex items-center gap-[4px] text-[11px] font-bold text-[#b91c1c] dark:text-[#f87171] bg-[#fee2e2] dark:bg-[#2c1515] px-[8px] py-[3px] rounded-full border border-[#fecaca] dark:border-rose-500/40">
                        <span className="size-[6px] rounded-full bg-[#b91c1c] dark:bg-[#f87171]" />
                        <span>{t("بانتظار السداد", "Pending Payment")}</span>
                      </span>
                    )}

                    {firm.status === "suspended" && (
                      <span className="inline-flex items-center gap-[4px] text-[11px] font-bold text-[#737067] dark:text-[#cdc5bd] bg-[#f5f3ef] dark:bg-[#281c15] px-[8px] py-[3px] rounded-full border border-[#e2ded7] dark:border-[#38271c]">
                        <span className="size-[6px] rounded-full bg-[#737067] dark:text-[#8e8680]" />
                        <span>{t("معطل", "Suspended")}</span>
                      </span>
                    )}
                  </td>

                  {/* Actions dropdown */}
                  <td className="py-[14px] px-[14px] text-center" data-actions-menu>
                    <button
                      type="button"
                      onClick={(e) => toggleFirmMenu(e, firm)}
                      className={`p-[6px] rounded-[4px] transition-colors cursor-pointer ${
                        openMenuFirm?.firm.id === firm.id
                          ? "bg-[#eae8e4] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7]"
                          : "text-[#737067] dark:text-[#cdc5bd] hover:bg-[#eae8e4] dark:hover:bg-[#281c15] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7]"
                      }`}
                      title={t("خيارات إضافية", "More options")}
                    >
                      <MoreVertical className="size-[16px]" />
                    </button>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="p-[14px] border-t border-[#f0eeea] dark:border-[#38271c] flex flex-col sm:flex-row sm:items-center justify-between gap-[12px] text-[12px] text-[#737067] dark:text-[#cdc5bd] font-['Cairo']">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <span>{t("عرض ", "Showing ")}</span>
              <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{startItem}</span>
              <span>{t(" إلى ", " to ")}</span>
              <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{endItem}</span>
              <span>{t(" من أصل ", " of ")}</span>
              <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{currentPlan.subscribedFirmsCount}</span>
              <span>{t(` مكتباً مسجلاً في ${currentPlan.name}`, ` law firms registered in ${currentPlan.name}`)}</span>
            </div>

            <div className="flex items-center gap-2 border-s border-[#e2ded7] dark:border-[#38271c] ps-3">
              <span className="text-[11px] text-[#737067] dark:text-[#cdc5bd]">
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
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              title={t("الصفحة الأولى", "First Page")}
              className="size-[28px] rounded border border-[#e2ded7] dark:border-[#38271c] bg-white dark:bg-[#221812] text-[#737067] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
            >
              <ChevronsRight className={cn("size-[14px]", isEn && "rotate-180")} />
            </button>

            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              title={t("الصفحة السابقة", "Previous Page")}
              className="px-[10px] py-[4px] rounded border border-[#e2ded7] dark:border-[#38271c] bg-white dark:bg-[#221812] text-[#737067] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-[4px]"
            >
              <ChevronRight className={cn("size-[14px]", isEn && "rotate-180")} />
              <span>{t("السابق", "Previous")}</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              if (totalPages > 5 && Math.abs(p - currentPage) > 2 && p !== 1 && p !== totalPages) {
                if (p === 2 || p === totalPages - 1) {
                  return (
                    <span key={p} className="px-[2px] text-[#737067] dark:text-[#cdc5bd]">
                      ...
                    </span>
                  );
                }
                return null;
              }
              const isActive = currentPage === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentPage(p)}
                  className={`size-[28px] rounded font-bold text-[12px] flex items-center justify-center cursor-pointer transition-colors ${
                    isActive
                      ? "bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f]"
                      : "border border-[#e2ded7] dark:border-[#38271c] bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15]"
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              title={t("الصفحة التالية", "Next Page")}
              className="px-[10px] py-[4px] rounded border border-[#e2ded7] dark:border-[#38271c] bg-white dark:bg-[#221812] text-[#737067] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-[4px]"
            >
              <span>{t("التالي", "Next")}</span>
              <ChevronLeft className={cn("size-[14px]", isEn && "rotate-180")} />
            </button>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(totalPages)}
              title={t("الصفحة الأخيرة", "Last Page")}
              className="size-[28px] rounded border border-[#e2ded7] dark:border-[#38271c] bg-white dark:bg-[#221812] text-[#737067] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
            >
              <ChevronsLeft className={cn("size-[14px]", isEn && "rotate-180")} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Menu Popover (Rendered in document.body via Portal to prevent table scrollbars) */}
      {typeof document !== "undefined" && openMenuFirm && createPortal(
        <div
          data-actions-popover
          style={{
            position: "fixed",
            left: `${openMenuFirm.coords.left}px`,
            ...(openMenuFirm.coords.top !== undefined ? { top: `${openMenuFirm.coords.top}px` } : {}),
            ...(openMenuFirm.coords.bottom !== undefined ? { bottom: `${openMenuFirm.coords.bottom}px` } : {}),
            zIndex: 9999,
          }}
          className="w-[190px] bg-white dark:bg-[#221812] rounded-[6px] shadow-[0px_8px_24px_rgba(0,0,0,0.14)] border border-[#e2ded7] dark:border-[#38271c] p-[4px] text-start animate-in fade-in-50 zoom-in-95 select-none font-['Cairo',sans-serif]"
        >
          <button
            type="button"
            onClick={() => handleOpenUpgrade(openMenuFirm.firm)}
            className="w-full flex items-center gap-[8px] px-[10px] py-[7px] text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#faf8f5] dark:hover:bg-[#281c15] rounded-[4px] cursor-pointer"
          >
            <ArrowUp className="size-[14px] text-[#9c6402] dark:text-[#e29d38]" />
            <span>{t("ترقية اشتراك المكتب", "Upgrade Subscription")}</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenDeactivate(openMenuFirm.firm)}
            className="w-full flex items-center gap-[8px] px-[10px] py-[7px] text-[12px] font-semibold text-[#b91c1c] dark:text-[#f87171] hover:bg-[#fee2e2]/40 dark:hover:bg-[#381a1a] rounded-[4px] cursor-pointer"
          >
            <Ban className="size-[14px] text-[#b91c1c] dark:text-[#f87171]" />
            <span>{t("تعطيل اشتراك المكتب", "Deactivate Subscription")}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const firm = openMenuFirm.firm;
              setOpenMenuFirm(null);
              if (onViewOfficeDetails) {
                onViewOfficeDetails(firm);
              }
            }}
            className="w-full flex items-center gap-[8px] px-[10px] py-[7px] text-[12px] font-semibold text-[#514537] dark:text-[#cdc5bd] hover:bg-[#faf8f5] dark:hover:bg-[#281c15] rounded-[4px] cursor-pointer"
          >
            <Eye className="size-[14px]" />
            <span>{t("عرض تفاصيل المكتب", "View Office Details")}</span>
          </button>
        </div>,
        document.body
      )}

      {/* Upgrade Subscription Dialog */}
      <UpgradeSubscriptionDialog
        isOpen={upgradeDialogOpen}
        onClose={() => setUpgradeDialogOpen(false)}
        firm={selectedFirm}
        onConfirmUpgrade={handleConfirmUpgrade}
      />

      {/* Deactivate Subscription Dialog */}
      <DeactivateSubscriptionDialog
        isOpen={deactivateDialogOpen}
        onClose={() => setDeactivateDialogOpen(false)}
        firm={selectedFirm}
        onConfirmDeactivate={handleConfirmDeactivate}
      />
    </div>
  );
}
