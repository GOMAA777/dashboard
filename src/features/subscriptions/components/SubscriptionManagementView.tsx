"use client";

import React, { useState, useMemo } from "react";
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

export function SubscriptionManagementView() {
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

  // Local state for subscriptions list
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>(
    initialSubscriptionsList
  );

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
      all: Math.max(128, all),
      active: Math.max(96, active),
      pending: Math.max(18, pending),
      cancelled_expired: Math.max(14, cancelled_expired),
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

  const handleStatusChange = (id: string, newStatus: SubscriptionStatus) => {
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

  const handleChangePlanSuccess = (newPlanTitle: string) => {
    if (!selectedSubForAction) return;
    const targetId = selectedSubForAction.id;
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

  const handleCancelSubscriptionSuccess = (reason: string) => {
    if (!selectedSubForAction) return;
    const targetId = selectedSubForAction.id;
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
    <div className="flex min-h-screen w-full bg-[#f5f3ef] dark:bg-[#151311] direction-rtl font-['Cairo',sans-serif]">
      {/* 1. Global Navigation Sidebar */}
      <DashboardSidebar activeNav="subscriptions" />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <DashboardTopNavbar />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 flex flex-col gap-6">
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
          ) : (
            <>
              {/* Command Banner */}
              <SubscriptionManagementHeader
                onAddSubscription={() => handleStartRenew()}
              />

              {/* 4 KPI Cards (Total: 128, Active: 86, Expiring: 12, Cancelled: 18) */}
              <SubscriptionKpiCards
                totalCount={128}
                activeCount={86}
                expiringCount={12}
                cancelledCount={18}
              />

              {/* Toolbar: Tab Pills, View Size, Search, Dropdown Filters */}
              <SubscriptionTableToolbar
                currentTab={(tab as SubscriptionTabFilter) || "all"}
                onTabChange={(newTab) => {
                  setTab(newTab);
                  setPageIndex(0);
                }}
                pageSize={pageSize}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
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
        </main>
      </div>
    </div>
  );
}
