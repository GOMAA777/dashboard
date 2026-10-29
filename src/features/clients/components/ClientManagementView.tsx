"use client";

import React, { useState } from "react";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { ClientManagementHeader } from "./ClientManagementHeader";
import { ClientKpiMetrics } from "./ClientKpiMetrics";
import { ClientManagementTable } from "./ClientManagementTable";
import { AddClientOfficeView } from "./AddClientOfficeView";
import { ClientOfficeDetailsView } from "./ClientOfficeDetailsView";
import { ClientOffice } from "../types/client.types";

export function ClientManagementView() {
  const [currentView, setCurrentView] = useState<"list" | "add" | "details">("list");
  const [selectedOffice, setSelectedOffice] = useState<ClientOffice | null>(null);

  return (
    <div className="flex h-screen w-full bg-[#f5f3ef] overflow-hidden direction-rtl font-['Cairo',sans-serif]">
      {/* 1. Global Navigation Sidebar */}
      <DashboardSidebar />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <DashboardTopNavbar />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-[24px] flex flex-col gap-[24px]">
          {currentView === "list" && (
            <>
              {/* Header with Title & Add Office Button */}
              <ClientManagementHeader onAddOffice={() => setCurrentView("add")} />

              {/* 4 KPI Metrics Cards */}
              <ClientKpiMetrics />

              {/* Main Client Offices Data Table */}
              <ClientManagementTable
                onViewOfficeDetails={(office) => {
                  setSelectedOffice(office);
                  setCurrentView("details");
                }}
                onEditOffice={(office) => {
                  setSelectedOffice(office);
                  setCurrentView("add");
                }}
              />
            </>
          )}

          {currentView === "add" && (
            <AddClientOfficeView
              onBack={() => setCurrentView("list")}
              onSuccess={() => setCurrentView("list")}
            />
          )}

          {currentView === "details" && (
            <ClientOfficeDetailsView
              office={selectedOffice}
              onBack={() => setCurrentView("list")}
              onEdit={() => setCurrentView("add")}
            />
          )}
        </main>
      </div>
    </div>
  );
}
