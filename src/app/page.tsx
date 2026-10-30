import React from "react";
import type { Metadata } from "next";
import { DashboardAuthGate } from "@/components/shared/DashboardAuthGate";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardHeaderSection } from "@/features/dashboard/components/DashboardHeaderSection";
import { DashboardKpiCards } from "@/features/dashboard/components/DashboardKpiCards";
import { DashboardAnalyticsSection } from "@/features/dashboard/components/DashboardAnalyticsSection";
import { DashboardLawOfficesTable } from "@/features/dashboard/components/DashboardLawOfficesTable";
import { DashboardBottomSection } from "@/features/dashboard/components/DashboardBottomSection";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";

export const metadata: Metadata = {
  title: "الرئيسية - الجودي لوحة الإدارة العليا",
  description:
    "نظرة عامة على أداء المنصة والاشتراكات والمكاتب المرخصة - منصة الجودي لإدارة مكاتب وشركات المحاماة",
};

export default function DashboardHomePage() {
  return (
    <DashboardAuthGate>
      <div
        className="flex h-screen h-dvh overflow-hidden bg-background text-foreground transition-colors duration-200"
        data-node-id="1:3"
        data-name="الرئيسية"
      >
        {/* 1. Main Navigation Sidebar (240px, on start/right in RTL) */}
        <DashboardSidebar />

        {/* 2. Main Content Viewport */}
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden w-full max-w-full">
          {/* Top Navbar Header (Fixed with Breadcrumbs) */}
          <DashboardTopNavbar />

          {/* Dashboard Workspace Content (Only area that scrolls on Y, zero horizontal scroll) */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden px-[16px] sm:px-[32px] py-[24px] sm:py-[32px] space-y-[24px] w-full max-w-full scrollbar-thin">
            <DashboardPageTransition>
              {/* Section 1: Page Introduction & Action Bar */}
              <DashboardHeaderSection />

              {/* Section 2: Primary KPI Cards (4 Tiles) */}
              <DashboardKpiCards />

              {/* Section 3: Visual Analytics Section (Revenue Area Chart & Plan Donut) */}
              <DashboardAnalyticsSection />

              {/* Section 4: Recently Registered Law Offices Table */}
              <DashboardLawOfficesTable />

              {/* Section 5: Bottom Grid (Recent Activity Feed & Support Summary) */}
              <DashboardBottomSection />
            </DashboardPageTransition>
          </main>
        </div>
      </div>
    </DashboardAuthGate>
  );
}
