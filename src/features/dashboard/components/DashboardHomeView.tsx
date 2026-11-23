"use client";

import React, { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { DashboardHeaderSection } from "./DashboardHeaderSection";
import { DashboardKpiCards } from "./DashboardKpiCards";
import { DashboardAnalyticsSection } from "./DashboardAnalyticsSection";
import { DashboardLawOfficesTable } from "./DashboardLawOfficesTable";
import { DashboardBottomSection } from "./DashboardBottomSection";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { useDashboardQuery } from "../hooks/useDashboardQuery";
import { useUIStore } from "@/stores/use-ui-store";

export function DashboardHomeView() {
  const { data, isLoading, refetch, isRefetching } = useDashboardQuery();
  const language = useUIStore((state) => state.language);
  const isEn = language === "en";

  const handleManualRefresh = async () => {
    try {
      await refetch();
      toast.success(
        isEn
          ? "Dashboard data updated directly from API"
          : "تم تحديث بيانات لوحة التحكم مباشرة من الخادم والـ API"
      );
    } catch {
      toast.error(
        isEn
          ? "Failed to refresh dashboard data"
          : "تعذر تحديث بعض بيانات لوحة التحكم"
      );
    }
  };

  if (isLoading && !data) {
    return (
      <div className="w-full space-y-6">
        <DashboardPageSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <DashboardPageTransition>
        {/* Section 1: Page Introduction & Action Bar */}
        <DashboardHeaderSection
          onRefresh={handleManualRefresh}
          isRefreshing={isRefetching}
        />

        {/* Section 2: Primary KPI Cards (4 Tiles) */}
        <DashboardKpiCards kpis={data?.kpis} />

        {/* Section 3: Visual Analytics Section (Revenue Area Chart & Plan Donut) */}
        <DashboardAnalyticsSection
          revenueInfo={data?.revenueInfo}
          revenueData={data?.revenueData}
          planData={data?.planDistribution}
        />

        {/* Section 4: Recently Registered Law Offices Table */}
        <DashboardLawOfficesTable offices={data?.recentOffices} />

        {/* Section 5: Bottom Grid (Recent Activity Feed & Support Summary) */}
        <DashboardBottomSection
          activities={data?.activities}
          supportSummary={data?.supportSummary}
        />
      </DashboardPageTransition>
    </div>
  );
}
