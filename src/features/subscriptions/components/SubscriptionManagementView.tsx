"use client";

import React, { useEffect, useState, useMemo } from "react";
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
import {
  SubscriptionRecord,
  SubscriptionStatus,
  SubscriptionTabFilter,
} from "../types/subscription.types";
import {
  initialSubscriptionsList,
  mockActiveSubscriptionDetails,
  mockCancelledSubscriptionDetails,
  mockRejectedSubscriptionDetails,
  mockWaitingSubscriptionDetails,
} from "../data/initialSubscriptions";
import { CreateSubscriptionInput } from "../schemas/subscription.schemas";
import { useLanguage } from "@/lib/i18n";
import {
  fetchSubscriptions,
  fetchSubscriptionsStats,
  cancelSubscription,
  upgradeSubscription,
  updateSubscriptionStatus,
} from "@/lib/api/subscriptions";
import { mapSubscriptionsResponse } from "@/lib/api/mappers";
import { readStats } from "@/lib/api/helpers";

export function SubscriptionManagementView() {
  const { direction } = useLanguage();
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
  const [pageSize, setPageSize] = useState(5);

  // Local state for subscriptions list
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>(
    initialSubscriptionsList
  );
  const [isLoading, setIsLoading] = useState(true);

  const [kpiStats, setKpiStats] = useState({
    total: 0,
    active: 0,
    expiring: 0,
    cancelled: 0,
  });

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    Promise.all([
      fetchSubscriptions({ tab: tab || "all", page: 1 }),
      fetchSubscriptionsStats(),
    ])
      .then(([subsPayload, statsPayload]) => {
        if (cancelled) return;
        const mapped = mapSubscriptionsResponse(subsPayload);
        if (mapped.length > 0) setSubscriptions(mapped);
        setKpiStats({
          total: readStats(statsPayload, ["total", "total_subscriptions", "all"], 0),
          active: readStats(statsPayload, ["active", "active_subscriptions"], 0),
          expiring: readStats(statsPayload, ["expiring", "expiring_soon", "pending"], 0),
          cancelled: readStats(
            statsPayload,
            ["cancelled", "cancelled_expired", "expired"],
            0
          ),
        });
      })
      .catch(() => {
        // Keep defaults if API unavailable.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tab]);

  // Modal dialog states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isChangePlanModalOpen, setIsChangePlanModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedSubForAction, setSelectedSubForAction] =
    useState<SubscriptionRecord | null>(null);

  // Selected subscription for details view
  const activeSubscription = useMemo<SubscriptionRecord | undefined>(() => {
    if (!selectedSubId) {
      if (selectedStateVariant === "cancelled") return mockCancelledSubscriptionDetails;
      if (selectedStateVariant === "rejected") return mockRejectedSubscriptionDetails;
      if (selectedStateVariant === "pending") return mockWaitingSubscriptionDetails;
      return mockActiveSubscriptionDetails;
    }
    const found = subscriptions.find((s) => s.id === selectedSubId);
    if (found) return found;

    if (selectedStateVariant === "cancelled") return mockCancelledSubscriptionDetails;
    if (selectedStateVariant === "rejected") return mockRejectedSubscriptionDetails;
    if (selectedStateVariant === "pending") return mockWaitingSubscriptionDetails;
    return mockActiveSubscriptionDetails;
  }, [selectedSubId, subscriptions, selectedStateVariant]);

  // Tab counts
  const counts = useMemo(() => {
    const all = subscriptions.length;
    const active = subscriptions.filter((s) => s.status === "active").length;
    const pending = subscriptions.filter((s) => s.status === "pending").length;
    const cancelled_expired = subscriptions.filter(
      (s) =>
        s.status === "cancelled" ||
        s.status === "expired" ||
        s.status === "rejected"
    ).length;
    return {
      all,
      active,
      pending,
      cancelled_expired,
    };
  }, [subscriptions]);

  // Filtered subscriptions
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      // Tab filter
      if (tab === "active" && sub.status !== "active") return false;
      if (tab === "pending" && sub.status !== "pending") return false;
      if (
        tab === "cancelled_expired" &&
        sub.status !== "cancelled" &&
        sub.status !== "expired" &&
        sub.status !== "rejected"
      ) {
        return false;
      }

      // Status dropdown filter
      if (status !== "all" && sub.status !== status) return false;

      // Plan dropdown filter
      if (plan !== "all") {
        if (plan === "custom" && !sub.planName.includes("المخصصة")) return false;
        if (plan === "gold" && !sub.planName.includes("الذهبية")) return false;
        if (plan === "silver" && !sub.planName.includes("الفضية")) return false;
        if (plan === "basic" && !sub.planName.includes("الأساسية")) return false;
      }

      // Payment method dropdown filter
      if (paymentMethod !== "all" && sub.paymentMethod.type !== paymentMethod) {
        return false;
      }

      // Search query filter
      if (search.trim()) {
        const query = search.trim().toLowerCase();
        const matchesId = sub.id.toLowerCase().includes(query);
        const matchesName = sub.firm.name.toLowerCase().includes(query);
        const matchesLicense = sub.firm.licenseNumber
          .toLowerCase()
          .includes(query);
        if (!matchesId && !matchesName && !matchesLicense) return false;
      }

      return true;
    });
  }, [subscriptions, tab, status, plan, paymentMethod, search]);

  // Paginated records
  const paginatedSubscriptions = useMemo(() => {
    const start = pageIndex * pageSize;
    return filteredSubscriptions.slice(start, start + pageSize);
  }, [filteredSubscriptions, pageIndex, pageSize]);

  // Handlers
  const handleViewDetails = (sub: SubscriptionRecord) => {
    setSelectedSubId(sub.id);
    setSelectedStateVariant(sub.status);
    setView("details");
  };

  const handleBackToList = () => {
    setView("list");
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

  const handleStatusChange = async (id: string, newStatus: SubscriptionStatus) => {
    try {
      await updateSubscriptionStatus(id, newStatus);
    } catch {
      // Keep local update.
    }
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id === id) {
          const statusLabels: Record<SubscriptionStatus, string> = {
            active: "نشط",
            pending: "قيد الانتظار",
            expired: "منتهي",
            cancelled: "ملغي",
            rejected: "مرفوض",
          };
          return {
            ...sub,
            status: newStatus,
            statusLabel: statusLabels[newStatus],
          };
        }
        return sub;
      })
    );
  };

  const handleChangePlanSuccess = async (newPlanTitle: string) => {
    if (!selectedSubForAction) return;
    const targetId = selectedSubForAction.id;
    try {
      await upgradeSubscription(targetId, {
        new_plan_id: newPlanTitle,
        billing_cycle: "yearly",
      });
    } catch {
      // Keep local update.
    }
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id === targetId) {
          return {
            ...sub,
            planName: newPlanTitle,
          };
        }
        return sub;
      })
    );
  };

  const handleCancelSubscriptionSuccess = async (reason: string) => {
    if (!selectedSubForAction) return;
    const targetId = selectedSubForAction.id;
    try {
      await cancelSubscription(targetId, reason);
    } catch {
      // Keep local update.
    }
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id === targetId) {
          return {
            ...sub,
            status: "cancelled",
            statusLabel: "ملغي",
            cancellationReason: reason,
          };
        }
        return sub;
      })
    );
  };

  const handleCreateSubscription = (data: CreateSubscriptionInput) => {
    const planPrices: Record<string, string> = {
      "الباقة المخصصة": "24,500 ر.س / سنوية",
      "الباقة الذهبية": "12,000 ر.س / سنوية",
      "الباقة الفضية": "9,200 ر.س / سنوية",
      "الباقة الأساسية": "5,400 ر.س / سنوية",
    };

    const newSub: SubscriptionRecord = {
      id: `SUB-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      firm: {
        id: `firm-${Date.now()}`,
        name: data.firmName,
        licenseNumber: data.licenseNumber,
        city: data.city,
        address: `${data.city} - المملكة العربية السعودية`,
        directorName: data.ownerName,
        email: data.email,
        phone: data.phone,
      },
      planName: data.planName,
      planPrice: planPrices[data.planName] || "9,200 ر.س / سنوية",
      billingCycle: data.billingCycle,
      startDate: "اليوم",
      renewalDate: "بعد 12 شهراً",
      remainingDaysText: "متبقي 365 يوماً",
      daysUrgency: "normal",
      status: "active",
      statusLabel: "نشط",
      paymentMethod: {
        type: data.paymentMethod,
        badgeLabel: data.paymentMethod.toUpperCase(),
        cardNumber: "•••• 1234",
        statusText: "مدفوع تلقائياً",
        isAutoPaid: true,
      },
      taxNumber: data.taxNumber || "301298457200003",
      zatcaCompliant: true,
    };

    setSubscriptions((prev) => [newSub, ...prev]);
  };

  return (
    <div dir={direction} className="flex h-screen h-dvh overflow-hidden w-full bg-background text-foreground transition-colors duration-200 font-['Cairo',sans-serif]">
      {/* 1. Global Navigation Sidebar */}
      <DashboardSidebar activeNav="subscriptions" />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <DashboardTopNavbar />

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
              initialSubscription={activeSubscription}
              initialStateVariant={
                (selectedStateVariant as SubscriptionStatus) || "active"
              }
              onBack={handleBackToList}
              onStatusChange={handleStatusChange}
              onOpenRenew={handleStartRenew}
              onOpenChangePlan={handleStartChangePlan}
              onOpenCancel={handleStartCancel}
            />
          ) : isLoading && subscriptions.length === 0 ? (
            <DashboardPageSkeleton />
          ) : (
            <>
              {/* Command Banner */}
              <SubscriptionManagementHeader
                onAddSubscription={() => handleStartRenew()}
              />

              {/* 4 KPI Cards (Total: 128, Active: 86, Expiring: 12, Cancelled: 18) */}
              <SubscriptionKpiCards
                totalCount={kpiStats.total}
                activeCount={kpiStats.active}
                expiringCount={kpiStats.expiring}
                cancelledCount={kpiStats.cancelled}
              />

              {/* Toolbar: Tab Pills, View Size, Search, Dropdown Filters */}
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

              {/* Main TanStack Table with Custom Headers and Pagination */}
              <SubscriptionManagementTable
                data={paginatedSubscriptions}
                onViewDetails={handleViewDetails}
                onEdit={handleStartChangePlan}
                onRenew={handleStartRenew}
                onCancel={handleStartCancel}
                pageIndex={pageIndex}
                pageSize={pageSize}
                totalItems={filteredSubscriptions.length}
                onPageChange={(p) => setPageIndex(p)}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setPageIndex(0);
                }}
              />
            </>
          )}

          {/* Add Subscription Quick Modal */}
          <AddSubscriptionModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSubmitSuccess={handleCreateSubscription}
          />

          {/* Change Subscription Plan Modal (Figma 1:6978) */}
          <ChangeSubscriptionPlanModal
            isOpen={isChangePlanModalOpen}
            onClose={() => {
              setIsChangePlanModalOpen(false);
              setSelectedSubForAction(null);
            }}
            subscription={selectedSubForAction}
            onSuccess={handleChangePlanSuccess}
          />

          {/* Cancel Subscription Modal (Figma 1:7101) */}
          <CancelSubscriptionModal
            isOpen={isCancelModalOpen}
            onClose={() => {
              setIsCancelModalOpen(false);
              setSelectedSubForAction(null);
            }}
            subscription={selectedSubForAction}
            onConfirmCancel={handleCancelSubscriptionSuccess}
          />
          </DashboardPageTransition>
        </main>
      </div>
    </div>
  );
}
