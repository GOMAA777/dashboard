import React from "react";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";

export default function Loading() {
  return (
    <div
      className="flex h-screen h-dvh w-full bg-[#fcfbfa] dark:bg-[#151311] text-[#1b1c1a] dark:text-[#fdfbf7] overflow-hidden"
    >
      <DashboardSidebar activeNav="support" />
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <DashboardTopNavbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <DashboardPageSkeleton />
        </main>
      </div>
    </div>
  );
}
