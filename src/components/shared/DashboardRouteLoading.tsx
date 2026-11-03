import React from "react";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { PageLoadingPanel } from "@/components/shared/PageLoadingPanel";

interface DashboardRouteLoadingProps {
  activeNav?: string;
  activeSubNav?: string;
  title?: string;
  statusText?: string;
}

/**
 * Shared route-level loading shell: sidebar + navbar stay put,
 * content area shows the unified branded loading panel.
 */
export function DashboardRouteLoading({
  activeNav,
  activeSubNav,
  title = "جاري التحميل",
  statusText = "نجهّز مساحة العمل والبيانات...",
}: DashboardRouteLoadingProps) {
  return (
    <div className="flex h-screen h-dvh w-full bg-[#fcfbfa] dark:bg-[#150f0b] text-[#1b1c1a] dark:text-[#fdfbf7] overflow-hidden">
      <DashboardSidebar activeNav={activeNav} activeSubNav={activeSubNav} />
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <DashboardTopNavbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 w-full scrollbar-thin flex flex-col">
          <PageLoadingPanel title={title} statusText={statusText} />
        </main>
      </div>
    </div>
  );
}
