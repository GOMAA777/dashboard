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
import { AddSubscriptionModal } from "./AddSubscriptionModal";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { LuxuryAlertDialog } from "@/components/shared/LuxuryAlertDialog";
import {
  SubscriptionRecord,
  SubscriptionStatus,
  SubscriptionTabFilter,
} from "../types/subscription.types";
import { useLanguage } from "@/lib/i18n";
import {
  fetchSubscriptions,
  fetchSubscriptionsStats,
  updateSubscriptionStatus,
} from "@/lib/api/subscriptions";
import { mapSubscriptionsResponse } from "@/lib/api/mappers";
import { readStats } from "@/lib/api/helpers";
import { toast } from "sonner";
import { AlertTriangle, RefreshCw } from "lucide-react";

export function SubscriptionManagementView() {
  const { direction, t } = useLanguage();
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
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<{ status?: number; message: string } | null>(null);

  const [kpiStats, setKpiStats] = useState({
    total: 0,
    active: 0,
    expiring: 0,
    cancelled: 0,
  });

  // Modal dialog states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isChangePlanModalOpen, setIsChangePlanModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedSubForAction, setSelectedSubForAction] =
    useState<SubscriptionRecord | null>(null);

  // Confirmation dialog for direct status change
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    id: string;
    newStatus: SubscriptionStatus;
  } | null>(null);

  // Data fetching logic
  const loadSubscriptions = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const [subsPayload, statsPayload] = await Promise.all([
        fetchSubscriptions({
          tab: tab || "all",
          page: pageIndex + 1,
          per_page: pageSize,
          search: search.trim() || undefined,
          plan: plan !== "all" ? plan : undefined,
          status: status !== "all" ? status : undefined,
        }),
        fetchSubscriptionsStats().catch(() => null),
      ]);

      const mapped = mapSubscriptionsResponse(subsPayload);
      setSubscriptions(mapped);

      const metaTotal =
        (subsPayload as unknown as { data?: { total?: number }; meta?: { total?: number }; total?: number })?.data?.total ??
        (subsPayload as unknown as { meta?: { total?: number }; total?: number })?.meta?.total ??
        (subsPayload as unknown as { total?: number })?.total;

      setTotalItems(typeof metaTotal === "number" ? metaTotal : mapped.length);

      if (statsPayload) {
        setKpiStats({
          total: readStats(statsPayload, ["total", "total_subscriptions", "all"], mapped.length),
          active: readStats(statsPayload, ["active", "active_subscriptions"], mapped.filter((s) => s.status === "active").length),
          expiring: readStats(statsPayload, ["expiring", "expiring_soon", "pending"], mapped.filter((s) => s.status === "pending").length),
          cancelled: readStats(
            statsPayload,
            ["cancelled", "cancelled_expired", "expired"],
            mapped.filter((s) => s.status === "cancelled" || s.status === "expired" || s.status === "rejected").length
          ),
        });
      } else {
        setKpiStats({
          total: mapped.length,
          active: mapped.filter((s) => s.status === "active").length,
          expiring: mapped.filter((s) => s.status === "pending").length,
          cancelled: mapped.filter((s) => s.status === "cancelled" || s.status === "expired" || s.status === "rejected").length,
        });
      }
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 401) {
        router.push("/login");
        return;
      }
      setSubscriptions([]);
      setTotalItems(0);
      const message =
        err instanceof Error
          ? err.message
          : status === 403
          ? t("ليس لديك صلاحية لعرض قائمة الاشتراكات.", "You do not have permission to view subscriptions.")
          : status === 404
          ? t("لم يتم العثور على أي بيانات للاشتراكات.", "Subscriptions not found.")
          : status && status >= 500
          ? t("حدث خطأ في الخادم أثناء تحميل الاشتراكات.", "Server error while loading subscriptions.")
          : t("فشل في تحميل بيانات الاشتراكات. يرجى التحقق من الاتصال والمحاولة مجدداً.", "Failed to load subscriptions. Please check connection and try again.");
      setApiError({ status, message });
    } finally {
      setIsLoading(false);
    }
  }, [tab, pageIndex, pageSize, search, plan, status, t, router]);

  useEffect(() => {
    let ignore = false;
    const timer = setTimeout(() => {
      if (!ignore) {
        loadSubscriptions();
      }
    }, 0);
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [loadSubscriptions]);

  // Selected subscription for details view (found in live data)
  const activeSubscription = useMemo<SubscriptionRecord | undefined>(() => {
    if (!selectedSubId) return undefined;
    return subscriptions.find((s) => s.id === selectedSubId);
  }, [selectedSubId, subscriptions]);

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
    return subscriptions.filter((sub) => {
      // Payment method filter (if not supported on backend)
      if (paymentMethod !== "all" && sub.paymentMethod?.type !== paymentMethod) {
        return false;
      }
      return true;
    });
  }, [subscriptions, paymentMethod]);

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
    loadSubscriptions();
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
      await loadSubscriptions();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("حدث خطأ أثناء تحديث حالة الاشتراك", "Error updating subscription status");
      toast.error(msg);
    }
  };

  // Breadcrumbs: finance parent → subscriptions root (+ current sub-view)
  const breadcrumbs = useMemo(
    () => [
      { label: t("الفواتير والمالية", "Invoices & Finance"), href: "/invoices" },
      { label: t("إدارة الاشتراكات", "Subscriptions"), href: "/subscriptions" },
      ...(view === "renew"
        ? [{ label: t("تجديد الاشتراك", "Renew Subscription") }]
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
            {view === "renew" ? (
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
                onRefreshList={loadSubscriptions}
              />
            ) : isLoading && subscriptions.length === 0 ? (
              <DashboardPageSkeleton />
            ) : apiError && subscriptions.length === 0 ? (
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
                  onClick={loadSubscriptions}
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
                  onAddSubscription={() => setIsAddModalOpen(true)}
                />

                {/* 4 KPI Cards */}
                <SubscriptionKpiCards
                  totalCount={kpiStats.total}
                  activeCount={kpiStats.active}
                  expiringCount={kpiStats.expiring}
                  cancelledCount={kpiStats.cancelled}
                />

                {/* Unified Table Container */}
                <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#f0eeea] dark:border-[#38271c] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] overflow-hidden w-full font-['Cairo',sans-serif]">
                  {/* Toolbar */}
                  <SubscriptionTableToolbar
                    className="rounded-b-none border-0 border-b border-[#f0eeea] dark:border-[#38271c]"
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

                  {/* Main TanStack Table with Custom Headers and Pagination */}
                  <SubscriptionManagementTable
                    className="border-0 shadow-none rounded-none"
                    data={displayedSubscriptions}
                    onViewDetails={handleViewDetails}
                    onEdit={handleStartChangePlan}
                    onRenew={handleStartRenew}
                    onCancel={handleStartCancel}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    totalItems={totalItems || filteredSubscriptions.length}
                    onPageChange={(p) => setPageIndex(p)}
                    onPageSizeChange={(newSize) => {
                      setPageSize(newSize);
                      setPageIndex(0);
                    }}
                  />
                </div>
              </>
            )}

            {/* Add Subscription Quick Modal */}
            <AddSubscriptionModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onSubmitSuccess={() => {
                loadSubscriptions();
              }}
            />

            {/* Change Subscription Plan Modal */}
            <ChangeSubscriptionPlanModal
              isOpen={isChangePlanModalOpen}
              onClose={() => {
                setIsChangePlanModalOpen(false);
                setSelectedSubForAction(null);
              }}
              subscription={selectedSubForAction}
              onSuccess={() => {
                loadSubscriptions();
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
                loadSubscriptions();
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
          </DashboardPageTransition>
        </main>
      </div>
    </div>
  );
}
