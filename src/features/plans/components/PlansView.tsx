"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { PlansManagementHeader } from "./PlansManagementHeader";
import { PlansKpiMetrics } from "./PlansKpiMetrics";
import { PlansToolbar } from "./PlansToolbar";
import { PlanCard } from "./PlanCard";
import { CreatePlanView } from "./CreatePlanView";
import { PlanDetailsView } from "./PlanDetailsView";
import { SubscribedFirmsView } from "./SubscribedFirmsView";
import { DeactivatePlanDialog } from "./DeactivatePlanDialog";
import { CannotDeletePlanDialog } from "./CannotDeletePlanDialog";
import { DeletePlanDialog } from "./DeletePlanDialog";
import { PricingPlanItem, PlanViewMode, DetailedSubscribedFirm, PlanStatusFilter, PlanBillingCycle } from "../types/plan.types";
import { initialPricingPlans, detailedSilverSubscribedFirms } from "../data/initialPlans";
import { ClientOfficeDetailsView } from "@/features/clients/components/ClientOfficeDetailsView";
import { initialOffices } from "@/features/clients/data/initialOffices";
import { ClientOffice } from "@/features/clients/types/client.types";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { useLanguage } from "@/lib/i18n";
import { fetchPlans, deletePlan, updatePlanStatus, getLocalCustomPlans, saveLocalCustomPlan, removeLocalCustomPlan } from "@/lib/api/plans";
import { mapPlansResponse, getLocalCustomThemeColor } from "@/lib/api/mappers";
import { ApiError } from "@/lib/api/http";

function firmToClientOffice(
  firm: DetailedSubscribedFirm | null,
  planName = "الباقة الفضية"
): ClientOffice {
  if (!firm) {
    return (
      initialOffices[0] || {
        id: "1",
        initial: "م",
        initialBg: "bg-[#ffddb6] dark:bg-[#2d1f16]",
        initialText: "text-[#7b4e00] dark:text-[#f3c27e]",
        name: "—",
        licenseNumber: "—",
        city: "—",
        owner: "—",
        email: "",
        phone: "",
        plan: planName,
        planBadgeClass: "bg-[#ffddb6]/40 text-[#7b4e00]",
        registrationDate: "—",
        accountStatus: {
          label: "نشط",
          type: "active",
          bgClass: "bg-[#e8f5e9]",
          textClass: "text-[#1b7340]",
          dotClass: "bg-[#1b7340]",
        },
        subscriptionStatus: {
          label: "نشط",
          type: "active",
          bgClass: "bg-[#e8f5e9]",
          textClass: "text-[#1b7340]",
        },
      }
    );
  }
  const existing = initialOffices.find((o) => o.name === firm.name || o.id === firm.id);
  if (existing) {
    return existing;
  }
  return {
    id: firm.id,
    initial: firm.initial || firm.name[0] || "م",
    initialBg: "bg-[#ffddb6] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60",
    initialText: "text-[#7b4e00] dark:text-[#f3c27e]",
    themeColor:
      (firm as unknown as { themeColor?: string })?.themeColor ||
      getLocalCustomThemeColor(firm.id) ||
      "#9c6402",
    name: firm.name,
    licenseNumber: firm.licenseNumber.startsWith("ترخيص")
      ? firm.licenseNumber
      : `ترخيص عدلي: ${firm.licenseNumber}`,
    city: firm.city,
    owner: firm.owner,
    email: firm.contact.includes("@") ? firm.contact : "",
    phone: firm.contact.includes("@") ? "" : firm.contact,
    plan: planName,
    planBadgeClass:
      "bg-[#ffddb6]/40 text-[#7b4e00] border border-[#ffddb6] dark:bg-[rgba(226,157,56,0.18)] dark:text-[#f3c27e] dark:border-[#e29d38]/50",
    registrationDate: "—",
    accountStatus: {
      label: firm.status === "suspended" ? "معطل" : "نشط",
      type: firm.status === "suspended" ? "suspended" : "active",
      bgClass:
        firm.status === "suspended"
          ? "bg-[#fef2f2]"
          : "bg-[#e8f5e9] border border-[#c8e6c9] dark:bg-[#132c1c] dark:border-emerald-500/40",
      textClass: firm.status === "suspended" ? "text-[#dc2626]" : "text-[#1b7340] dark:text-[#6ee7b7]",
      dotClass: firm.status === "suspended" ? "bg-[#dc2626]" : "bg-[#1b7340] dark:bg-[#10b981]",
    },
    subscriptionStatus: {
      label: "نشط",
      note: firm.remainingDaysText ? `(متبقي ${firm.remainingDaysText})` : "",
      type: "active",
      bgClass: "bg-[#e8f5e9] border border-[#c8e6c9] dark:bg-[#132c1c] dark:border-emerald-500/40",
      textClass: "text-[#1b7340] dark:text-[#6ee7b7]",
    },
  };
}

export function PlansView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, isEn } = useLanguage();

  const viewParam = searchParams?.get("view") as PlanViewMode | null;
  const planIdParam = searchParams?.get("planId");
  const firmIdParam = searchParams?.get("firmId");

  const [viewMode, setViewMode] = useState<PlanViewMode>(viewParam || "list");
  const [plans, setPlans] = useState<PricingPlanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlanItem | null>(null);

  const loadData = React.useCallback(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    const localPlans = getLocalCustomPlans();
    fetchPlans()
      .then((payload) => {
        if (cancelled) return;
        const mapped = mapPlansResponse(payload);
        const merged = [...mapped];
        localPlans.forEach((lp) => {
          const idx = merged.findIndex(
            (m) => String(m.id) === String(lp.id) || m.name === lp.name
          );
          if (idx !== -1) {
            const apiLimits = merged[idx].limits || {};
            const localLimits = lp.limits || {};
            merged[idx] = {
              ...lp,
              ...merged[idx],
              limits: {
                ...localLimits,
                ...apiLimits,
                lawyers: apiLimits.lawyers && apiLimits.lawyers !== "—" ? apiLimits.lawyers : (localLimits.lawyers || apiLimits.lawyers),
                cases: apiLimits.cases && apiLimits.cases !== "—" ? apiLimits.cases : (localLimits.cases || apiLimits.cases),
                agents: apiLimits.agents && apiLimits.agents !== "—" ? apiLimits.agents : (localLimits.agents || apiLimits.agents),
                assistants: apiLimits.assistants && apiLimits.assistants !== "—" ? apiLimits.assistants : (localLimits.assistants || apiLimits.assistants),
                clients: apiLimits.clients && apiLimits.clients !== "—" ? apiLimits.clients : (localLimits.clients || apiLimits.clients),
                documents: apiLimits.documents && apiLimits.documents !== "—" ? apiLimits.documents : (localLimits.documents || apiLimits.documents),
                storage: apiLimits.storage && apiLimits.storage !== "—" ? apiLimits.storage : (localLimits.storage || apiLimits.storage),
                support: apiLimits.support && apiLimits.support !== "—" ? apiLimits.support : (localLimits.support || apiLimits.support),
              },
              yearlyDiscountPercent:
                merged[idx].yearlyDiscountPercent ?? lp.yearlyDiscountPercent,
              colorTheme: lp.colorTheme || merged[idx].colorTheme,
            };
          } else if (mapped.length === 0) {
            merged.push(lp);
          }
        });
        setPlans(merged);
        if (planIdParam) {
          const found = merged.find((p) => String(p.id) === String(planIdParam));
          if (found) setSelectedPlan(found);
          else if (merged.length > 0) setSelectedPlan(merged[0]);
        } else if (merged.length > 0) {
          setSelectedPlan(merged[0]);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "فشل تحميل الباقات والأسعار");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [planIdParam]);

  useEffect(() => {
    return loadData();
  }, [loadData]);

  const initialFirm = useMemo(() => {
    if (firmIdParam) {
      const found = detailedSilverSubscribedFirms.find((f) => f.id === firmIdParam);
      if (found) return found;
    }
    return detailedSilverSubscribedFirms[0] || null;
  }, [firmIdParam]);

  const [selectedFirm, setSelectedFirm] = useState<DetailedSubscribedFirm | null>(initialFirm);

  // Sync state when URL search params change (e.g. browser back/forward, direct link, refresh)
  const [prevViewParam, setPrevViewParam] = useState(viewParam);
  const [prevPlanIdParam, setPrevPlanIdParam] = useState(planIdParam);
  const [prevFirmIdParam, setPrevFirmIdParam] = useState(firmIdParam);

  if (viewParam !== prevViewParam || planIdParam !== prevPlanIdParam || firmIdParam !== prevFirmIdParam) {
    setPrevViewParam(viewParam);
    setPrevPlanIdParam(planIdParam);
    setPrevFirmIdParam(firmIdParam);

    const mappedMode: PlanViewMode = viewParam || "list";
    setViewMode(mappedMode);

    if (planIdParam) {
      const p = plans.find((item) => String(item.id) === String(planIdParam));
      if (p) setSelectedPlan(p);
    }
    if (firmIdParam) {
      const f = detailedSilverSubscribedFirms.find((item) => item.id === firmIdParam);
      if (f) setSelectedFirm(f);
    }
  }

  const navigateToView = (mode: PlanViewMode, planId?: string, firmId?: string) => {
    setViewMode(mode);
    const params = new URLSearchParams();
    if (mode !== "list") {
      params.set("view", mode);
    }
    const targetPlanId = planId || selectedPlan?.id || "silver";
    if (mode !== "list" && targetPlanId) {
      params.set("planId", targetPlanId);
    }
    if (firmId) {
      params.set("firmId", firmId);
    }
    const query = params.toString();
    router.push(query ? `/plans?${query}` : "/plans");
  };

  // Dialog States
  const [planForAction, setPlanForAction] = useState<PricingPlanItem | null>(null);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [isCannotDeleteDialogOpen, setIsCannotDeleteDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PlanStatusFilter>("all");
  const [billingCycle, setBillingCycle] = useState<PlanBillingCycle>("monthly");
  const [sortBy, setSortBy] = useState<"price_desc" | "price_asc" | "subscribers">("price_desc");

  // Helper: Detect whether a plan is custom/enterprise
  const isCustomPlan = (plan: PricingPlanItem): boolean => {
    if (plan.isEnterprise) return true;
    if (plan.type === "custom" || plan.type === "enterprise") return true;
    if (plan.badge && plan.badge.includes("مخصص")) return true;
    if (plan.name && (plan.name.includes("مخصص") || plan.name.includes("المخصصة"))) return true;
    if (plan.description && plan.description.includes("مخصص")) return true;
    return false;
  };

  // Filtered & Sorted Plans
  const filteredPlans = useMemo(() => {
    return plans
      .filter((plan) => {
        // Status filter
        if (statusFilter === "active" && !plan.isActive) return false;
        if (statusFilter === "inactive" && plan.isActive) return false;
        if (statusFilter === "custom" && !isCustomPlan(plan)) return false;

        // Custom cycle filter:
        if (billingCycle === "custom") {
          const hasAnyCustom = plans.some(isCustomPlan);
          if (hasAnyCustom && !isCustomPlan(plan)) return false;
        }

        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = plan.name.toLowerCase().includes(q);
          const matchCode = plan.code.toLowerCase().includes(q);
          const matchDesc = plan.description.toLowerCase().includes(q);
          const matchBadge = Boolean(plan.badge?.toLowerCase().includes(q));
          const matchLimits = plan.limits
            ? Object.values(plan.limits).some((val) =>
                typeof val === "string" ? val.toLowerCase().includes(q) : String(val).includes(q)
              )
            : false;
          if (!matchName && !matchCode && !matchDesc && !matchBadge && !matchLimits) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const priceA =
          billingCycle === "annual"
            ? a.annualPrice && a.annualPrice > 0
              ? a.annualPrice
              : a.monthlyPrice * 10
            : a.monthlyPrice;
        const priceB =
          billingCycle === "annual"
            ? b.annualPrice && b.annualPrice > 0
              ? b.annualPrice
              : b.monthlyPrice * 10
            : b.monthlyPrice;

        if (sortBy === "price_desc") {
          return priceB - priceA;
        }
        if (sortBy === "price_asc") {
          return priceA - priceB;
        }
        if (sortBy === "subscribers") {
          return b.subscribedFirmsCount - a.subscribedFirmsCount;
        }
        return 0;
      });
  }, [plans, statusFilter, searchQuery, sortBy, billingCycle]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: plans.length,
      active: plans.filter((p) => p.isActive).length,
      inactive: plans.filter((p) => !p.isActive).length,
      custom: plans.filter(isCustomPlan).length,
    };
  }, [plans]);

  const handleSavePlanSuccess = (savedPlan: PricingPlanItem) => {
    saveLocalCustomPlan(savedPlan, selectedPlan?.id, selectedPlan?.name);
    setPlans((prev) => {
      const targetId = String(savedPlan.id);
      const oldSelectedId = selectedPlan ? String(selectedPlan.id) : undefined;
      const existsIndex = prev.findIndex(
        (p) =>
          String(p.id) === targetId ||
          (oldSelectedId !== undefined && String(p.id) === oldSelectedId) ||
          p.name === savedPlan.name ||
          (selectedPlan && p.name === selectedPlan.name)
      );
      if (existsIndex !== -1) {
        const next = [...prev];
        next[existsIndex] = savedPlan;
        return next;
      }
      return [savedPlan, ...prev];
    });
    setSelectedPlan(savedPlan);
    // Refresh from API so paid→trial (and prices) match the server after edit.
    void fetchPlans()
      .then((payload) => {
        const mapped = mapPlansResponse(payload);
        if (mapped.length === 0) return;
        setPlans((prev) => {
          const byId = new Map(mapped.map((p) => [String(p.id), p]));
          const next = prev.map((p) => {
            const fresh = byId.get(String(p.id));
            return fresh ? { ...p, ...fresh, colorTheme: p.colorTheme } : p;
          });
          for (const p of mapped) {
            if (!next.some((x) => String(x.id) === String(p.id))) next.push(p);
          }
          return next;
        });
        const freshSelected = mapped.find(
          (p) => String(p.id) === String(savedPlan.id)
        );
        if (freshSelected) {
          setSelectedPlan((prev) =>
            prev
              ? {
                  ...prev,
                  ...freshSelected,
                  colorTheme: prev.colorTheme,
                }
              : freshSelected
          );
        }
      })
      .catch(() => {
        // Keep optimistic saved plan if refresh fails.
      });
    navigateToView("list");
  };

  const handleOpenDeactivateDialog = async (targetPlan: PricingPlanItem) => {
    if (!targetPlan.isActive) {
      setActionLoading(true);
      try {
        await updatePlanStatus(targetPlan.id, "active");
        setPlans((prev) =>
          prev.map((p) => (String(p.id) === String(targetPlan.id) ? { ...p, isActive: true } : p))
        );
        toast.success(t("تم تفعيل الباقة بنجاح وأصبحت متاحة للاشتراك.", "Plan activated successfully."));
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : t("فشل تفعيل الباقة", "Failed to activate plan");
        toast.error(msg);
      } finally {
        setActionLoading(false);
      }
      return;
    }
    setPlanForAction(targetPlan);
    setIsDeactivateDialogOpen(true);
  };

  const handleConfirmDeactivatePlan = async (planId: string) => {
    setActionLoading(true);
    try {
      await updatePlanStatus(planId, "disabled");
      setPlans((prev) =>
        prev.map((p) => (String(p.id) === String(planId) ? { ...p, isActive: false } : p))
      );
      toast.success(t("تم تعطيل الباقة بنجاح ولم تعد متاحة للاشتراكات الجديدة.", "Plan deactivated successfully."));
      setIsDeactivateDialogOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("فشل تعطيل الباقة", "Failed to deactivate plan");
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenDeleteDialog = (targetPlan: PricingPlanItem) => {
    setPlanForAction(targetPlan);
    if (targetPlan.subscribedFirmsCount > 0) {
      setIsCannotDeleteDialogOpen(true);
    } else {
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDeletePlan = async (planId: string) => {
    setActionLoading(true);
    try {
      await deletePlan(planId);
      removeLocalCustomPlan(planId);
      setPlans((prev) => prev.filter((p) => String(p.id) !== String(planId)));
      toast.success(t("تم حذف الباقة نهائياً من النظام.", "Plan deleted successfully."));
      setIsDeleteDialogOpen(false);
    } catch (err: unknown) {
      const isBlocked =
        err instanceof ApiError &&
        (err.status === 400 || err.status === 409 || err.status === 422);
      if (isBlocked) {
        setIsDeleteDialogOpen(false);
        setIsCannotDeleteDialogOpen(true);
      } else {
        const msg = err instanceof Error ? err.message : t("فشل حذف الباقة", "Failed to delete plan");
        toast.error(msg);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewPlanDetails = (plan: PricingPlanItem) => {
    setSelectedPlan(plan);
    navigateToView("silver-details", plan.id);
  };

  const handleViewSubscribedFirms = (plan?: PricingPlanItem) => {
    const p = plan || selectedPlan;
    if (plan) setSelectedPlan(plan);
    if (p) navigateToView("subscribed-firms", p.id);
  };

  const handleEditPlan = (plan: PricingPlanItem) => {
    setSelectedPlan(plan);
    navigateToView("edit", plan.id);
  };

  const handleViewFirmDetails = (firm: DetailedSubscribedFirm) => {
    setSelectedFirm(firm);
    navigateToView("firm-details", selectedPlan?.id || plans[0]?.id || "", firm.id);
  };

  // Breadcrumbs path calculation
  const breadcrumbs = useMemo(() => {
    const planName = selectedPlan?.name || t("الباقة", "Plan");
    const planId = selectedPlan?.id || "";
    if (viewMode === "create") {
      return [
        { label: t("الفواتير والمالية", "Invoices & Finance"), href: "/invoices" },
        { label: t("الباقات والأسعار", "Plans & Pricing"), href: "/plans" },
        { label: t("إنشاء باقة جديدة", "Create New Plan") },
      ];
    }
    if (viewMode === "edit") {
      return [
        { label: t("الفواتير والمالية", "Invoices & Finance"), href: "/invoices" },
        { label: t("الباقات والأسعار", "Plans & Pricing"), href: "/plans" },
        { label: t("تعديل الباقة", "Edit Plan") },
        { label: planName },
      ];
    }
    if (viewMode === "silver-details") {
      return [
        { label: t("الفواتير والمالية", "Invoices & Finance"), href: "/invoices" },
        { label: t("الباقات والأسعار", "Plans & Pricing"), href: "/plans" },
        { label: planName },
      ];
    }
    if (viewMode === "subscribed-firms") {
      return [
        { label: t("الفواتير والمالية", "Invoices & Finance"), href: "/invoices" },
        { label: t("الباقات والأسعار", "Plans & Pricing"), href: "/plans" },
        { label: planName, href: `/plans?view=silver-details&planId=${planId}` },
        { label: t("المكاتب المشتركة", "Subscribed Firms") },
      ];
    }
    if (viewMode === "firm-details") {
      return [
        { label: t("الفواتير والمالية", "Invoices & Finance"), href: "/invoices" },
        { label: t("الباقات والأسعار", "Plans & Pricing"), href: "/plans" },
        { label: planName, href: `/plans?view=silver-details&planId=${planId}` },
        { label: t("المكاتب المشتركة", "Subscribed Firms"), href: `/plans?view=subscribed-firms&planId=${planId}` },
        { label: selectedFirm?.name || t("تفاصيل المكتب", "Office Details") },
      ];
    }
    return undefined;
  }, [viewMode, selectedPlan, selectedFirm, t]);

  return (
    <div
      className="flex h-screen h-dvh overflow-hidden w-full bg-background text-foreground transition-colors duration-200 font-['Cairo',sans-serif] selection:bg-[#9c6402]/20 selection:text-[#9c6402]"
    >
      {/* 1. Global Navigation Sidebar */}
      <DashboardSidebar activeNav="finance" activeSubNav="plans" />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Navbar with dynamic breadcrumbs */}
        <DashboardTopNavbar customBreadcrumbs={breadcrumbs} />

        {/* Dynamic Workspace Container (Scroll Y only, zero horizontal overflow) */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 w-full max-w-full scrollbar-thin">
          <DashboardPageTransition>
            <div className="w-full space-y-6">

          {/* View Mode Switching */}
          {viewMode === "list" && (
            isLoading && plans.length === 0 ? (
              <DashboardPageSkeleton />
            ) : error && plans.length === 0 ? (
              <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-red-200 dark:border-red-900/40 p-[48px] text-center shadow-2xs space-y-4">
                <p className="text-[14px] text-red-600 dark:text-red-400 font-medium">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={loadData}
                  className="px-5 py-2.5 bg-[#9c6402] hover:bg-[#855402] text-white text-[13px] font-bold rounded-[6px] transition-colors cursor-pointer"
                >
                  {t("إعادة المحاولة", "Retry")}
                </button>
              </div>
            ) : (
            <div className="space-y-6 relative z-10 animate-in fade-in duration-200">
              {/* Header (Figma 1:2463) */}
              <PlansManagementHeader
                onCreatePlan={() => navigateToView("create")}
                onViewSubscribedFirms={() => navigateToView("subscribed-firms", selectedPlan?.id || plans[0]?.id || "silver")}
              />

              {/* KPI Metrics Summary (Figma 1:2464) */}
              <PlansKpiMetrics />

              {/* Filter Toolbar (Figma 1:2461) */}
              <PlansToolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                billingCycle={billingCycle}
                onBillingCycleChange={setBillingCycle}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                counts={counts}
              />

              {/* Responsive Grid of Plan Cards (Figma 1:2461) */}
              {filteredPlans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
                  {filteredPlans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      billingCycle={billingCycle}
                      onEdit={handleEditPlan}
                      onViewDetails={handleViewPlanDetails}
                      onViewSubscribers={handleViewSubscribedFirms}
                      onToggleActive={handleOpenDeactivateDialog}
                      onDelete={handleOpenDeleteDialog}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#f0eeea] dark:border-[#38271c] p-[48px] text-center shadow-2xs">
                  <p className="text-[14px] text-[#737067] dark:text-[#cdc5bd] font-medium">
                    {t(
                      "لم يتم العثور على أي باقات تطابق معايير البحث أو التصفية المحددة.",
                      "No plans found matching the selected search or filter criteria."
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                    }}
                    className="mt-[12px] text-[13px] font-bold text-[#9c6402] dark:text-[#f3c27e] hover:underline cursor-pointer"
                  >
                    {t("إعادة ضبط الفلاتر", "Reset Filters")}
                  </button>
                </div>
              )}
            </div>
            )
          )}

          {viewMode === "create" && (
            <div className="relative z-10 animate-in fade-in duration-200">
              <CreatePlanView
                mode="create"
                onBack={() => navigateToView("list")}
                onSuccess={handleSavePlanSuccess}
              />
            </div>
          )}

          {viewMode === "edit" && (
            <div className="relative z-10 animate-in fade-in duration-200">
              <CreatePlanView
                mode="edit"
                planToEdit={selectedPlan}
                onBack={() => navigateToView("list")}
                onSuccess={handleSavePlanSuccess}
              />
            </div>
          )}

          {viewMode === "silver-details" && (
            <div className="relative z-10 animate-in fade-in duration-200">
              <PlanDetailsView
                plan={selectedPlan || undefined}
                onBack={() => navigateToView("list")}
                onEdit={() => selectedPlan && handleEditPlan(selectedPlan)}
                onNavigateToClients={() => navigateToView("subscribed-firms", selectedPlan?.id || "silver")}
              />
            </div>
          )}

          {viewMode === "subscribed-firms" && (
            <div className="relative z-10 animate-in fade-in duration-200">
              <SubscribedFirmsView
                plan={selectedPlan || undefined}
                onBack={() => navigateToView("list")}
                onAddNewFirm={() => router.push("/accounts")}
                onViewOfficeDetails={handleViewFirmDetails}
              />
            </div>
          )}

          {viewMode === "firm-details" && (
            <div className="relative z-10 animate-in fade-in duration-200">
              <ClientOfficeDetailsView
                office={firmToClientOffice(selectedFirm, selectedPlan?.name || "الباقة")}
                onBack={() => navigateToView("subscribed-firms", selectedPlan?.id || "silver")}
                onEdit={() => router.push(`/accounts?officeId=${selectedFirm?.id || "1"}&action=edit`)}
                onUpgradePlan={(_office, newPlan) => {
                  toast.success(
                    t(
                      `تم ترقية اشتراك ${selectedFirm?.name} إلى ${newPlan}`,
                      `Upgraded ${selectedFirm?.name} to ${newPlan}`
                    )
                  );
                }}
              />
            </div>
          )}
            </div>
          </DashboardPageTransition>
        </main>
      </div>

      {/* Dialog 1: Deactivate Plan Confirmation (Figma 1:4973) */}
      <DeactivatePlanDialog
        isOpen={isDeactivateDialogOpen}
        onClose={() => !actionLoading && setIsDeactivateDialogOpen(false)}
        plan={planForAction}
        onConfirmDeactivate={handleConfirmDeactivatePlan}
        isLoading={actionLoading}
        onViewSubscribers={() => {
          setIsDeactivateDialogOpen(false);
          navigateToView("subscribed-firms", planForAction?.id || selectedPlan?.id || "");
        }}
      />

      {/* Dialog 2: Cannot Delete Plan (Subscribers Exist) (Figma 1:5154) */}
      <CannotDeletePlanDialog
        isOpen={isCannotDeleteDialogOpen}
        onClose={() => setIsCannotDeleteDialogOpen(false)}
        plan={planForAction}
        onViewSubscribers={() => {
          setIsCannotDeleteDialogOpen(false);
          navigateToView("subscribed-firms", planForAction?.id || selectedPlan?.id || "");
        }}
      />

      {/* Dialog 3: Delete Plan (0 Subscribers) (Figma 1:5203) */}
      <DeletePlanDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => !actionLoading && setIsDeleteDialogOpen(false)}
        plan={planForAction}
        isLoading={actionLoading}
        onConfirmDelete={handleConfirmDeletePlan}
      />
    </div>
  );
}
