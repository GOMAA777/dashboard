"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { SubscriptionManagementHeader } from "./SubscriptionManagementHeader";
import { SubscriptionKpiCards } from "./SubscriptionKpiCards";
import { SubscriptionTableToolbar } from "./SubscriptionTableToolbar";
import { SubscriptionManagementTable } from "./SubscriptionManagementTable";
import { SubscriptionDetailsView } from "./SubscriptionDetailsView";
import { RenewSubscriptionView } from "./RenewSubscriptionView";
import { ChangeSubscriptionPlanModal } from "./ChangeSubscriptionPlanModal";
import { CancelSubscriptionModal } from "./CancelSubscriptionModal";
import { AddSubscriptionView } from "./AddSubscriptionView";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { SubscriptionsPageSkeleton } from "./SubscriptionsPageSkeleton";
import { useQueryClient } from "@tanstack/react-query";
import {
  useSubscriptionsQuery,
  useSubscriptionsStatsQuery,
  invalidateSubscriptionsQueries,
} from "../hooks/useSubscriptionsQuery";
import { useFirmsQuery } from "@/features/clients/hooks/useClientsQuery";
import { InvalidationGraph } from "@/lib/query-keys";
import { LuxuryAlertDialog } from "@/components/shared/LuxuryAlertDialog";
import {
  SubscriptionRecord,
  SubscriptionStatus,
  SubscriptionTabFilter,
} from "../types/subscription.types";
import { useLanguage } from "@/lib/i18n";
import { usePermissions } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import {
  fetchSubscriptions,
  fetchSubscriptionsStats,
  updateSubscriptionStatus,
  approveSubscription,
  rejectSubscription,
} from "@/lib/api/subscriptions";
import { fetchFirms } from "@/lib/api/firms";
import { mapSubscriptionsResponse, mapSubscriptionFromApi, getLocalCustomFirmPlan } from "@/lib/api/mappers";
import { readStats } from "@/lib/api/helpers";
import { toast } from "sonner";
import { AlertTriangle, RefreshCw, CheckCircle2, XCircle, X } from "lucide-react";
import { ModalPortal } from "@/components/shared/ModalPortal";

export function SubscriptionManagementView() {
  const { direction, t } = useLanguage();
  const { hasPermission } = usePermissions();
  const router = useRouter();
  // URL Query State using nuqs
  const [view, setView] = useQueryState("view", { defaultValue: "list" });
  const [tab, setTab] = useQueryState("tab", { defaultValue: "all" });
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [plan, setPlan] = useQueryState("plan", { defaultValue: "all" });
  const [status, setStatus] = useQueryState("status", { defaultValue: "all" });
  const [paymentMethod, setPaymentMethod] = useQueryState("payment", {
    defaultValue: "all",
  });
  const [selectedSubId, setSelectedSubId] = useQueryState("id", {
    defaultValue: "",
  });
  const [selectedStateVariant, setSelectedStateVariant] = useQueryState(
    "state",
    { defaultValue: "active" }
  );

  // Pagination state (internal)
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Subscriptions list state (zero mock data)
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [apiError, setApiError] = useState<{ status?: number; message: string } | null>(null);

  const [kpiStats, setKpiStats] = useState({
    total: 0,
    active: 0,
    expiring: 0,
    cancelled: 0,
  });

  // Modal dialog states
  const [isChangePlanModalOpen, setIsChangePlanModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedSubForAction, setSelectedSubForAction] =
    useState<SubscriptionRecord | null>(null);

  // Confirmation dialog for direct status change
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    id: string;
    newStatus: SubscriptionStatus;
  } | null>(null);

  // Quick approve and reject dialog states
  const [subToApprove, setSubToApprove] = useState<SubscriptionRecord | null>(null);
  const [subToReject, setSubToReject] = useState<SubscriptionRecord | null>(null);
  const [quickRejectReason, setQuickRejectReason] = useState("");
  const [quickRejectError, setQuickRejectError] = useState("");
  const [isSubmittingQuickAction, setIsSubmittingQuickAction] = useState(false);

  const queryClient = useQueryClient();
  const subsQueryParams = useMemo(
    () => ({
      tab: tab || "all",
      page: pageIndex + 1,
      per_page: pageSize,
      search: search.trim() || undefined,
      plan: plan !== "all" && plan !== "unlimited" ? plan : undefined,
      status: status !== "all" ? status : undefined,
    }),
    [tab, pageIndex, pageSize, search, plan, status]
  );
  const subsQuery = useSubscriptionsQuery(subsQueryParams);
  const statsQuery = useSubscriptionsStatsQuery();
  const firmsQuery = useFirmsQuery({ per_page: 100 });

  useEffect(() => {
    if (!subsQuery.data) return;
    const subsPayload = subsQuery.data;
    const mapped = mapSubscriptionsResponse(subsPayload);
    const firmsPayload = firmsQuery.data;

    if (firmsPayload) {
      const rawFirmsList = Array.isArray(firmsPayload)
        ? firmsPayload
        : Array.isArray((firmsPayload as Record<string, unknown>).items)
        ? ((firmsPayload as Record<string, unknown>).items as unknown[])
        : Array.isArray((firmsPayload as Record<string, unknown>).data)
        ? ((firmsPayload as Record<string, unknown>).data as unknown[])
        : [];

      rawFirmsList.forEach((fUnknown) => {
        const f = (fUnknown || {}) as Record<string, unknown>;
        const fid = f.id ? String(f.id) : "";
        const localPlan = fid ? getLocalCustomFirmPlan(fid) : undefined;
        const planStr = String(
          localPlan?.planType ||
            localPlan?.plan ||
            f.plan_type ||
            f.planType ||
            f.subscription_plan ||
            f.subscriptionPlan ||
            (f.plan as Record<string, unknown> | undefined)?.type ||
            (f.plan as Record<string, unknown> | undefined)?.name ||
            f.plan ||
            ""
        ).toLowerCase();

        const isUnlim = planStr.includes("unlimited") || planStr.includes("غير محدود");
        if (isUnlim) {
          const alreadyExists = mapped.some(
            (m) => (fid && String(m.firm.id) === fid) || m.firm.name === f.name
          );
          if (!alreadyExists) {
            const unlimitedSub = mapSubscriptionFromApi({
              id: `SUB-UNL-${fid || Math.floor(Math.random() * 10000)}`,
              code: `SUB-UNL-${fid || "0"}`,
              firm: {
                id: fid || "0",
                name: String(f.name || f.firm_name || "مكتب محاماة"),
                license_number: String(f.license_number || f.licenseNumber || "—"),
                city: String(f.city || "—"),
                address: String(f.address || "—"),
                owner_name: String(f.owner_name || f.director_name || f.owner || "—"),
                email: String(f.email || ""),
                phone: String(f.phone || ""),
              },
              plan_name: "غير محدود",
              plan_type: "unlimited",
              subscription_plan: "unlimited",
              plan_price: "بدون سعر (مجاني)",
              billing_cycle: "دائم",
              start_date: f.created_at ? new Date(String(f.created_at)).toLocaleDateString("ar-SA") : "—",
              renewal_date: "دائم (بدون انتهاء)",
              remaining_days: "∞",
              remaining_days_text: "∞",
              status: "active",
              status_label: "صلاحيات كاملة",
            });
            mapped.unshift(unlimitedSub);
          }
        }
      });
    }

    setSubscriptions(mapped);

    const metaTotal =
      (subsPayload as unknown as { data?: { total?: number }; meta?: { total?: number }; total?: number })?.data?.total ??
      (subsPayload as unknown as { meta?: { total?: number }; total?: number })?.meta?.total ??
      (subsPayload as unknown as { total?: number })?.total;

    setTotalItems(typeof metaTotal === "number" ? metaTotal : mapped.length);
  }, [subsQuery.data, firmsQuery.data]);

  useEffect(() => {
    if (statsQuery.data) {
      const statsPayload = statsQuery.data;
      setKpiStats({
        total: readStats(statsPayload, ["total", "total_subscriptions", "all"], subscriptions.length),
        active: readStats(statsPayload, ["active", "active_subscriptions"], subscriptions.filter((s) => s.status === "active").length),
        expiring: readStats(statsPayload, ["expiring", "expiring_soon", "pending"], subscriptions.filter((s) => s.status === "pending").length),
        cancelled: readStats(
          statsPayload,
          ["cancelled", "cancelled_expired", "expired"],
          subscriptions.filter((s) => s.status === "cancelled" || s.status === "expired" || s.status === "rejected").length
        ),
      });
    }
  }, [statsQuery.data, subscriptions]);

  const effectiveSubscriptions = useMemo(() => {
    if (subscriptions.length > 0) return subscriptions;
    if (subsQuery.data) {
      return mapSubscriptionsResponse(subsQuery.data);
    }
    return [];
  }, [subscriptions, subsQuery.data]);

  const isLoading = subsQuery.isLoading && effectiveSubscriptions.length === 0;

  const reloadSubscriptions = useCallback(async () => {
    await Promise.all([
      subsQuery.refetch(),
      statsQuery.refetch(),
      firmsQuery.refetch(),
    ]);
  }, [subsQuery, statsQuery, firmsQuery]);

  // Selected subscription for details view (found in live data)
  const activeSubscription = useMemo<SubscriptionRecord | undefined>(() => {
    if (!selectedSubId) return undefined;
    return effectiveSubscriptions.find((s) => s.id === selectedSubId);
  }, [selectedSubId, effectiveSubscriptions]);

  // Tab counts
  const counts = useMemo(() => {
    return {
      all: kpiStats.total || subscriptions.length,
      active: kpiStats.active || subscriptions.filter((s) => s.status === "active").length,
      pending: kpiStats.expiring || subscriptions.filter((s) => s.status === "pending").length,
      cancelled_expired:
        kpiStats.cancelled ||
        subscriptions.filter(
          (s) =>
            s.status === "cancelled" ||
            s.status === "expired" ||
            s.status === "rejected"
        ).length,
    };
  }, [kpiStats, subscriptions]);

  // Filtered subscriptions (client-side safety check)
  const filteredSubscriptions = useMemo(() => {
    return effectiveSubscriptions.filter((sub) => {
      // Plan filter for unlimited
      if (plan === "unlimited") {
        const isUnlim =
          sub.planName?.includes("غير محدود") ||
          (sub.billingCycle as string) === "دائم" ||
          sub.statusLabel === "صلاحيات كاملة";
        if (!isUnlim) return false;
      }
      // Payment method filter (if not supported on backend)
      if (paymentMethod !== "all" && sub.paymentMethod?.type !== paymentMethod) {
        return false;
      }
      return true;
    });
  }, [subscriptions, plan, paymentMethod]);

  // Paginated records
  const displayedSubscriptions = useMemo(() => {
    if (totalItems > filteredSubscriptions.length && filteredSubscriptions.length <= pageSize) {
      return filteredSubscriptions;
    }
    const start = pageIndex * pageSize;
    return filteredSubscriptions.slice(start, start + pageSize);
  }, [filteredSubscriptions, totalItems, pageIndex, pageSize]);

  // Handlers
  const handleViewDetails = (sub: SubscriptionRecord) => {
    setSelectedSubId(sub.id);
    setSelectedStateVariant(sub.status);
    setView("details");
  };

  const handleBackToList = () => {
    setSelectedSubId("");
    setView("list");
    void InvalidationGraph.onSubscriptionMutation(queryClient);
  };

  const handleStartRenew = (sub?: SubscriptionRecord) => {
    if (sub) {
      setSelectedSubForAction(sub);
      setSelectedSubId(sub.id);
    }
    setView("renew");
  };

  const handleStartChangePlan = (sub: SubscriptionRecord) => {
    setSelectedSubForAction(sub);
    setIsChangePlanModalOpen(true);
  };

  const handleStartCancel = (sub: SubscriptionRecord) => {
    setSelectedSubForAction(sub);
    setIsCancelModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearch("");
    setPlan("all");
    setStatus("all");
    setPaymentMethod("all");
    setTab("all");
    setPageIndex(0);
  };

  const handleStatusChange = (id: string, newStatus: SubscriptionStatus) => {
    setPendingStatusChange({ id, newStatus });
  };

  const handleConfirmStatusChange = async () => {
    if (!pendingStatusChange) return;
    const { id, newStatus } = pendingStatusChange;
    try {
      await updateSubscriptionStatus(id, newStatus);
      toast.success(t("تم تحديث حالة الاشتراك بنجاح", "Subscription status updated successfully"));
      setPendingStatusChange(null);
      void InvalidationGraph.onSubscriptionMutation(queryClient);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("حدث خطأ أثناء تحديث حالة الاشتراك", "Error updating subscription status");
      toast.error(msg);
    }
  };

  const handleConfirmApprove = async () => {
    if (!subToApprove) return;
    setIsSubmittingQuickAction(true);
    try {
      await approveSubscription(subToApprove.id);
      toast.success(t("تمت الموافقة وتفعيل الاشتراك بنجاح", "Subscription approved and activated successfully"));
      setSubToApprove(null);
      void InvalidationGraph.onSubscriptionMutation(queryClient);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("حدث خطأ أثناء اعتماد الاشتراك", "Error approving subscription");
      toast.error(msg);
    } finally {
      setIsSubmittingQuickAction(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!subToReject) return;
    if (!quickRejectReason.trim()) {
      setQuickRejectError(t("يرجى كتابة سبب رفض طلب الاشتراك", "Please enter rejection reason"));
      return;
    }
    setQuickRejectError("");
    setIsSubmittingQuickAction(true);
    try {
      await rejectSubscription(subToReject.id, quickRejectReason.trim());
      toast.success(t("تم رفض طلب الاشتراك بنجاح", "Subscription request rejected"));
      setSubToReject(null);
      setQuickRejectReason("");
      void InvalidationGraph.onSubscriptionMutation(queryClient);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("حدث خطأ أثناء رفض الاشتراك", "Error rejecting subscription");
      toast.error(msg);
    } finally {
      setIsSubmittingQuickAction(false);
    }
  };

  // Breadcrumbs: finance parent → subscriptions root (+ current sub-view)
  const breadcrumbs = useMemo(
    () => [
      { label: t("الفواتير والمالية", "Invoices & Finance"), href: "/invoices" },
      { label: t("إدارة الاشتراكات", "Subscriptions"), href: "/subscriptions" },
      ...(view === "renew"
        ? [{ label: t("تجديد الاشتراك", "Renew Subscription") }]
        : view === "add"
          ? [{ label: t("إضافة اشتراك جديد", "Add New Subscription") }]
          : view === "details"
            ? [{ label: t("تفاصيل الاشتراك", "Subscription Details") }]
            : []),
    ],
    [view, t]
  );

  return (
    <div dir={direction} className="flex h-screen h-dvh overflow-hidden w-full bg-background text-foreground transition-colors duration-200 font-['Cairo',sans-serif]">
      {/* 1. Global Navigation Sidebar */}
      <DashboardSidebar activeNav="finance" activeSubNav="subscriptions" />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <DashboardTopNavbar customBreadcrumbs={breadcrumbs} />

        {/* Dynamic Page Content (Scroll Y only, zero horizontal overflow) */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 flex flex-col gap-6 w-full max-w-full scrollbar-thin">
          <DashboardPageTransition>
            {view === "add" ? (
              <AddSubscriptionView onBack={handleBackToList} onSuccess={handleBackToList} />
            ) : view === "renew" ? (
              <RenewSubscriptionView
                subscription={selectedSubForAction || activeSubscription}
                onBack={handleBackToList}
                onSuccess={handleBackToList}
              />
            ) : view === "details" ? (
              <SubscriptionDetailsView
                subscriptionId={selectedSubId || undefined}
                initialSubscription={activeSubscription}
                initialStateVariant={
                  (selectedStateVariant as SubscriptionStatus) || "active"
                }
                onBack={handleBackToList}
                onStatusChange={handleStatusChange}
                onOpenRenew={handleStartRenew}
                onOpenChangePlan={handleStartChangePlan}
                onOpenCancel={handleStartCancel}
                onRefreshList={reloadSubscriptions}
              />
            ) : isLoading && effectiveSubscriptions.length === 0 ? (
              <SubscriptionsPageSkeleton />
            ) : apiError && effectiveSubscriptions.length === 0 ? (
              <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-red-200 dark:border-red-500/30 p-8 text-center flex flex-col items-center justify-center gap-4">
                <div className="size-12 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[16px] text-red-700 dark:text-red-400">
                    {t("تعذر تحميل الاشتراكات", "Failed to load subscriptions")}
                  </h3>
                  <p className="text-[13px] text-[#514537] dark:text-[#a89f91] mt-1 max-w-md">
                    {apiError.message}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={reloadSubscriptions}
                  className="bg-[#9c6402] hover:bg-[#825200] text-white px-4 py-2 rounded-[6px] font-semibold text-[13px] flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{t("إعادة المحاولة", "Retry")}</span>
                </button>
              </div>
            ) : (
              <>
                {/* Command Banner */}
                <SubscriptionManagementHeader
                  onAddSubscription={
                    hasPermission("subscriptions.approve") || hasPermission("subscriptions.create")
                      ? () => setView("add")
                      : undefined
                  }
                />

                {/* 4 KPI Cards (separate from filter) */}
                <SubscriptionKpiCards
                  totalCount={kpiStats.total}
                  activeCount={kpiStats.active}
                  expiringCount={kpiStats.expiring}
                  cancelledCount={kpiStats.cancelled}
                />

                {/* Standalone Filter Bar — never nested inside the table card */}
                <SubscriptionTableToolbar
                  currentTab={(tab as SubscriptionTabFilter) || "all"}
                  onTabChange={(newTab) => {
                    setTab(newTab);
                    setPageIndex(0);
                  }}
                  searchQuery={search}
                  onSearchChange={(q) => {
                    setSearch(q);
                    setPageIndex(0);
                  }}
                  planFilter={plan}
                  onPlanChange={(p) => {
                    setPlan(p);
                    setPageIndex(0);
                  }}
                  statusFilter={status}
                  onStatusChange={(s) => {
                    setStatus(s);
                    setPageIndex(0);
                  }}
                  paymentMethodFilter={paymentMethod}
                  onPaymentMethodChange={(m) => {
                    setPaymentMethod(m);
                    setPageIndex(0);
                  }}
                  onResetFilters={handleResetFilters}
                  counts={counts}
                />

                {/* Separate Data Table & Pagination Card */}
                <SubscriptionManagementTable
                  data={displayedSubscriptions}
                  onViewDetails={handleViewDetails}
                  onEdit={hasPermission("subscriptions.upgrade") ? handleStartChangePlan : undefined}
                  onRenew={hasPermission("subscriptions.renew") ? handleStartRenew : undefined}
                  onCancel={hasPermission("subscriptions.cancel") ? handleStartCancel : undefined}
                  onApprove={
                    hasPermission("subscriptions.approve")
                      ? (sub) => setSubToApprove(sub)
                      : undefined
                  }
                  onReject={
                    hasPermission("subscriptions.reject")
                      ? (sub) => {
                          setSubToReject(sub);
                          setQuickRejectReason("");
                          setQuickRejectError("");
                        }
                      : undefined
                  }
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  totalItems={totalItems || filteredSubscriptions.length}
                  onPageChange={(p) => setPageIndex(p)}
                  onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setPageIndex(0);
                  }}
                />
              </>
            )}

            {/* Change Subscription Plan Modal */}
            <ChangeSubscriptionPlanModal
              isOpen={isChangePlanModalOpen}
              onClose={() => {
                setIsChangePlanModalOpen(false);
                setSelectedSubForAction(null);
              }}
              subscription={selectedSubForAction}
              onSuccess={() => {
                void InvalidationGraph.onSubscriptionMutation(queryClient);
              }}
            />

            {/* Cancel Subscription Modal */}
            <CancelSubscriptionModal
              isOpen={isCancelModalOpen}
              onClose={() => {
                setIsCancelModalOpen(false);
                setSelectedSubForAction(null);
              }}
              subscription={selectedSubForAction}
              onConfirmCancel={() => {
                void InvalidationGraph.onSubscriptionMutation(queryClient);
              }}
            />

            {/* Confirm Direct Status Change Dialog */}
            <LuxuryAlertDialog
              isOpen={!!pendingStatusChange}
              onClose={() => setPendingStatusChange(null)}
              onConfirm={handleConfirmStatusChange}
              title={t("تأكيد تعديل حالة الاشتراك", "Confirm Subscription Status Change")}
              description={t(
                "هل أنت متأكد من تغيير حالة هذا الاشتراك؟ سيتم تطبيق التعديلات وتحديث سجلات النظام فوراً.",
                "Are you sure you want to change the status of this subscription? Changes will apply immediately."
              )}
              confirmLabel={t("تأكيد التعديل", "Confirm Change")}
              cancelLabel={t("إلغاء", "Cancel")}
              variant="info"
            />

            {/* Confirm Quick Approve Dialog */}
            <LuxuryAlertDialog
              isOpen={!!subToApprove}
              onClose={() => setSubToApprove(null)}
              onConfirm={handleConfirmApprove}
              title={t("اعتماد وتفعيل طلب الاشتراك", "Approve & Activate Subscription")}
              description={t(
                `هل أنت متأكد من رغبتك في اعتماد وتفعيل اشتراك "${subToApprove?.firm.name}"؟ سيتم تفعيل حساب المكتب فوراً وإتاحة كافة صلاحيات الباقة.`,
                `Are you sure you want to approve and activate the subscription for "${subToApprove?.firm.name}"? The firm will be activated immediately.`
              )}
              confirmLabel={t("اعتماد وتفعيل", "Approve & Activate")}
              cancelLabel={t("إلغاء", "Cancel")}
              variant="success"
              isLoading={isSubmittingQuickAction}
            />

            {/* Quick Reject Modal */}
            {subToReject && (
              <ModalPortal>
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-['Cairo',sans-serif] animate-in fade-in duration-200"
                  dir={direction}
                >
                  <div className="bg-white dark:bg-[#1a120c] border border-[#f0eeea] dark:border-[#38271c] rounded-[10px] w-full max-w-[500px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0eeea] dark:border-[#2f2218]">
                      <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                        <XCircle className="w-5 h-5" />
                        <h3 className="font-bold text-[15px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                          {t("رفض طلب الاشتراك", "Reject Subscription Request")}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSubToReject(null)}
                        disabled={isSubmittingQuickAction}
                        className="size-8 rounded-[4px] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] text-[#514537] dark:text-[#a89f91] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-6 space-y-4">
                      <p className="text-[13px] text-[#514537] dark:text-[#a89f91]">
                        {t(
                          `يرجى تسجيل سبب رفض طلب اشتراك "${subToReject.firm.name}" بشكل واضح لحفظه في السجلات وإبلاغ المنشأة.`,
                          `Please record the rejection reason for "${subToReject.firm.name}" clearly.`
                        )}
                      </p>

                      <div className="space-y-1.5">
                        <label className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                          {t("سبب الرفض الرسمي", "Official Rejection Reason")} <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={4}
                          value={quickRejectReason}
                          onChange={(e) => {
                            setQuickRejectReason(e.target.value);
                            if (quickRejectError) setQuickRejectError("");
                          }}
                          placeholder={t(
                            "مثال: عدم تطابق السجل التجاري مع وثيقة الترخيص، أو وجود تعارض في الرقم الضريبي...",
                            "E.g., Mismatch in commercial register or licensing document..."
                          )}
                          className={cn(
                            "w-full bg-[#f5f3ef] dark:bg-[#221812] border rounded-[6px] p-3 text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder-[#837565] dark:placeholder-[#6e6355] focus:outline-none transition-colors resize-none",
                            quickRejectError
                              ? "border-red-400 focus:border-red-500"
                              : "border-[#ded5c6] dark:border-[#422e20] focus:border-[#9c6402] dark:focus:border-[#e29d38]"
                          )}
                        />
                        {quickRejectError && (
                          <p className="text-red-500 text-[11px] font-medium">{quickRejectError}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-[#faf9f7] dark:bg-[#20150e] border-t border-[#f0eeea] dark:border-[#2f2218]">
                      <button
                        type="button"
                        onClick={() => setSubToReject(null)}
                        disabled={isSubmittingQuickAction}
                        className="px-4 py-2 rounded-[6px] bg-[#f5f3ef] dark:bg-[#281c15] hover:bg-[#eae8e4] text-[#514537] dark:text-[#a89f91] text-[12px] font-bold transition-colors cursor-pointer"
                      >
                        {t("إلغاء", "Cancel")}
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmReject}
                        disabled={isSubmittingQuickAction}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-[6px] font-bold text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t("تأكيد الرفض", "Confirm Rejection")}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </ModalPortal>
            )}
          </DashboardPageTransition>
        </main>
      </div>
    </div>
  );
}
