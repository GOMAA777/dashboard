"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { ScalesOfJusticeWatermark } from "@/components/shared/ScalesOfJusticeWatermark";
import { PlansManagementHeader } from "./PlansManagementHeader";
import { PlansKpiMetrics } from "./PlansKpiMetrics";
import { PlansToolbar } from "./PlansToolbar";
import { PlanCard } from "./PlanCard";
import { CreatePlanView } from "./CreatePlanView";
import { PlanDetailsView } from "./PlanDetailsView";
import { PricingPlanItem, PlanViewMode } from "../types/plan.types";
import { initialPricingPlans } from "../data/initialPlans";

export function PlansView() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<PlanViewMode>("list");
  const [plans, setPlans] = useState<PricingPlanItem[]>(initialPricingPlans);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlanItem>(
    initialPricingPlans.find((p) => p.id === "silver") || initialPricingPlans[1]
  );

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

  const handleToggleActive = (targetPlan: PricingPlanItem) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === targetPlan.id ? { ...p, isActive: !p.isActive } : p
      )
    );
    toast.success(
      targetPlan.isActive
        ? `تم تعطيل باقة "${targetPlan.name}".`
        : `تم تفعيل باقة "${targetPlan.name}".`
    );
  };

  const handleViewPlanDetails = (plan: PricingPlanItem) => {
    setSelectedPlan(plan);
    setViewMode("silver-details");
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
          {/* Subtle Justice Scales Emblem Watermark */}
          <ScalesOfJusticeWatermark />

          {/* View Mode Switching */}
          {viewMode === "list" && (
            <div className="space-y-[20px] relative z-10 animate-in fade-in duration-200">
              {/* Header (Figma 1:2463) */}
              <PlansManagementHeader
                onCreatePlan={() => setViewMode("create")}
                onViewSubscribedFirms={() => router.push("/accounts")}
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
                      onToggleActive={handleToggleActive}
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
                onNavigateToClients={() => router.push("/accounts")}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
