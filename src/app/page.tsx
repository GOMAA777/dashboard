import React from "react";
import type { Metadata } from "next";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardHeaderSection } from "@/features/dashboard/components/DashboardHeaderSection";
import { DashboardKpiCards } from "@/features/dashboard/components/DashboardKpiCards";
import { DashboardAnalyticsSection } from "@/features/dashboard/components/DashboardAnalyticsSection";
import { DashboardLawOfficesTable } from "@/features/dashboard/components/DashboardLawOfficesTable";
import { DashboardBottomSection } from "@/features/dashboard/components/DashboardBottomSection";

export const metadata: Metadata = {
  title: "الرئيسية - الجودي لوحة الإدارة العليا",
  description:
    "نظرة عامة على أداء المنصة والاشتراكات والمكاتب المرخصة - منصة الجودي لإدارة مكاتب وشركات المحاماة",
};

export default function DashboardHomePage() {
  return (
    <div
      className="flex h-screen overflow-hidden bg-[#fcfbfa] text-[#1b1c1a]"
      dir="rtl"
      data-node-id="1:3"
      data-name="الرئيسية"
    >
      {/* 1. Main Navigation Sidebar (240px, on start/right in RTL) */}
      <DashboardSidebar />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar Header (64px) */}
        <DashboardTopNavbar />

        {/* Scrollable Dashboard Workspace Content */}
        <main className="flex-1 overflow-y-auto px-[32px] py-[32px] space-y-[24px] scrollbar-thin w-full">
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
        </main>
      </div>
    </div>
  );
}
