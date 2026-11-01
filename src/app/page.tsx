import React from "react";
import type { Metadata } from "next";
import { DashboardAuthGate } from "@/components/shared/DashboardAuthGate";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardHomeView } from "@/features/dashboard/components/DashboardHomeView";

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
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 space-y-6 w-full max-w-full scrollbar-thin">
            <DashboardHomeView />
          </main>
        </div>
      </div>
    </DashboardAuthGate>
  );
}
