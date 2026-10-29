"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
import { PricingPlanItem, PlanViewMode } from "../types/plan.types";
import { initialPricingPlans } from "../data/initialPlans";

export function PlansView() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<PlanViewMode>("list");
  const [plans, setPlans] = useState<PricingPlanItem[]>(initialPricingPlans);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlanItem>(
    initialPricingPlans.find((p) => p.id === "silver") || initialPricingPlans[1]
  );

  // Dialog States
  const [planForAction, setPlanForAction] = useState<PricingPlanItem | null>(null);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [isCannotDeleteDialogOpen, setIsCannotDeleteDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [sortBy, setSortBy] = useState<"price_desc" | "price_asc" | "subscribers">("price_desc");

  // Filtered & Sorted Plans
  const filteredPlans = useMemo(() => {
    return plans
      .filter((plan) => {
        // Status filter
        if (statusFilter === "active" && !plan.isActive) return false;
        if (statusFilter === "inactive" && plan.isActive) return false;

        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = plan.name.toLowerCase().includes(q);
          const matchCode = plan.code.toLowerCase().includes(q);
          const matchDesc = plan.description.toLowerCase().includes(q);
          const matchLimits = Object.values(plan.limits).some((val) =>
            val.toLowerCase().includes(q)
          );
          if (!matchName && !matchCode && !matchDesc && !matchLimits) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_desc") {
          return b.monthlyPrice - a.monthlyPrice;
        }
        if (sortBy === "price_asc") {
          return a.monthlyPrice - b.monthlyPrice;
        }
        if (sortBy === "subscribers") {
          return b.subscribedFirmsCount - a.subscribedFirmsCount;
        }
        return 0;
      });
  }, [plans, statusFilter, searchQuery, sortBy]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: plans.length,
      active: plans.filter((p) => p.isActive).length,
      inactive: plans.filter((p) => !p.isActive).length,
    };
  }, [plans]);

  const handleCreatePlanSuccess = (newPlan: PricingPlanItem) => {
    setPlans((prev) => [newPlan, ...prev]);
    toast.success(`تم إنشاء باقة "${newPlan.name}" بنجاح وتفعيلها في المنظومة.`);
    setViewMode("list");
  };

  const handleOpenDeactivateDialog = (targetPlan: PricingPlanItem) => {
    setPlanForAction(targetPlan);
    setIsDeactivateDialogOpen(true);
  };

  const handleConfirmDeactivatePlan = (planId: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, isActive: false } : p))
    );
    toast.success("تم تعطيل الباقة بنجاح ولم تعد متاحة للاشتراكات الجديدة.");
  };

  const handleOpenDeleteDialog = (targetPlan: PricingPlanItem) => {
    setPlanForAction(targetPlan);
    if (targetPlan.subscribedFirmsCount > 0) {
      setIsCannotDeleteDialogOpen(true);
    } else {
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDeletePlan = (planId: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== planId));
    toast.success("تم حذف الباقة نهائياً من النظام.");
  };

  const handleViewPlanDetails = (plan: PricingPlanItem) => {
    setSelectedPlan(plan);
    setViewMode("silver-details");
  };

  const handleViewSubscribedFirms = (plan?: PricingPlanItem) => {
    if (plan) setSelectedPlan(plan);
    setViewMode("subscribed-firms");
  };

  const handleEditPlan = (plan: PricingPlanItem) => {
    if (plan.id === "silver" || plan.id === "basic" || plan.id === "gold") {
      setSelectedPlan(plan);
      setViewMode("silver-details");
    } else {
      setSelectedPlan(plan);
      setViewMode("create");
    }
  };

  return (
    <div
      className="flex min-h-screen bg-[#f5f3ef] text-[#1b1c1a] font-['Cairo',sans-serif] selection:bg-[#9c6402]/20 selection:text-[#9c6402]"
      dir="rtl"
    >
      {/* 1. Global Navigation Sidebar */}
      <DashboardSidebar activeNav="plans" />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar with Notifications Flyout */}
        <DashboardTopNavbar />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 relative p-[20px] md:p-[28px] max-w-[1580px] w-full mx-auto">

          {/* View Mode Switching */}
          {viewMode === "list" && (
            <div className="space-y-[20px] relative z-10 animate-in fade-in duration-200">
              {/* Header (Figma 1:2463) */}
              <PlansManagementHeader
                onCreatePlan={() => setViewMode("create")}
                onViewSubscribedFirms={() => setViewMode("subscribed-firms")}
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[20px] items-stretch">
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
                <div className="bg-white rounded-[8px] border border-[#f0eeea] p-[48px] text-center shadow-2xs">
                  <p className="text-[14px] text-[#737067] font-medium">
                    لم يتم العثور على أي باقات تطابق معايير البحث أو التصفية
                    المحددة.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                    }}
                    className="mt-[12px] text-[13px] font-bold text-[#9c6402] hover:underline cursor-pointer"
                  >
                    إعادة ضبط الفلاتر
                  </button>
                </div>
              )}
            </div>
          )}

          {viewMode === "create" && (
            <div className="relative z-10 animate-in fade-in duration-200">
              <CreatePlanView
                onBack={() => setViewMode("list")}
                onSuccess={handleCreatePlanSuccess}
              />
            </div>
          )}

          {viewMode === "silver-details" && (
            <div className="relative z-10 animate-in fade-in duration-200">
              <PlanDetailsView
                plan={selectedPlan}
                onBack={() => setViewMode("list")}
                onEdit={() => setViewMode("create")}
                onNavigateToClients={() => setViewMode("subscribed-firms")}
              />
            </div>
          )}

          {viewMode === "subscribed-firms" && (
            <div className="relative z-10 animate-in fade-in duration-200">
              <SubscribedFirmsView
                onBack={() => setViewMode("silver-details")}
                onAddNewFirm={() => router.push("/accounts")}
              />
            </div>
          )}
        </main>
      </div>

      {/* Dialog 1: Deactivate Plan Confirmation (Figma 1:4973) */}
      <DeactivatePlanDialog
        isOpen={isDeactivateDialogOpen}
        onClose={() => setIsDeactivateDialogOpen(false)}
        plan={planForAction}
        onConfirmDeactivate={handleConfirmDeactivatePlan}
        onViewSubscribers={() => {
          setIsDeactivateDialogOpen(false);
          setViewMode("subscribed-firms");
        }}
      />

      {/* Dialog 2: Cannot Delete Plan (Subscribers Exist) (Figma 1:5154) */}
      <CannotDeletePlanDialog
        isOpen={isCannotDeleteDialogOpen}
        onClose={() => setIsCannotDeleteDialogOpen(false)}
        plan={planForAction}
        onViewSubscribers={() => {
          setIsCannotDeleteDialogOpen(false);
          setViewMode("subscribed-firms");
        }}
      />

      {/* Dialog 3: Delete Plan (0 Subscribers) (Figma 1:5203) */}
      <DeletePlanDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        plan={planForAction}
        onConfirmDelete={handleConfirmDeletePlan}
      />
    </div>
  );
}
