import React from "react";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";

export default function Loading() {
  return (
    <div
      className="flex h-screen h-dvh w-full bg-[#fcfbfa] dark:bg-[#151311] text-[#1b1c1a] dark:text-[#fdfbf7] overflow-hidden"
    >
      <DashboardSidebar activeNav="plans" />
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <DashboardTopNavbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 w-full scrollbar-thin">
          <DashboardPageSkeleton />
        </main>
      </div>
    </div>
  );
}
