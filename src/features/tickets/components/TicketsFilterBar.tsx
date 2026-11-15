"use client";

import React from "react";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { TicketFilterStatus } from "../types/tickets.types";
import { useLanguage } from "@/lib/i18n";

interface TicketsFilterBarProps {
  filterStatus: TicketFilterStatus;
  onFilterChange: (status: TicketFilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  counts: {
    all: number;
    open: number;
    in_progress: number;
    closed: number;
    pending?: number;
  };
}

export function TicketsFilterBar({
  filterStatus,
  onFilterChange,
  searchQuery,
  onSearchChange,
  counts,
}: TicketsFilterBarProps) {
  const { t } = useLanguage();
  const hasActiveFilters = filterStatus !== "all" || Boolean(searchQuery);

  const drawerContent = (
    <div className="space-y-4 text-start font-sans">
      {/* Ticket Status Filter */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          {t("حالة التذكرة", "Ticket Status")}
        </label>
        <DashboardSelect
          value={filterStatus}
          onChange={(e) => onFilterChange(e.target.value as TicketFilterStatus)}
        >
          <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
            {t(`كل التذاكر (${counts.all})`, `All Tickets (${counts.all})`)}
          </option>
          <option value="open" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
            {t(`تذاكر مفتوحة (${counts.open})`, `Open Tickets (${counts.open})`)}
          </option>
          <option value="in_progress" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
            {t(`تذاكر جارية المعالجة (${counts.in_progress})`, `In Progress (${counts.in_progress})`)}
          </option>
          <option value="closed" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
            {t(`تذاكر مغلقة (${counts.closed})`, `Closed Tickets (${counts.closed})`)}
          </option>
        </DashboardSelect>
      </div>
    </div>
  );

  return (
    <UnifiedFilterBar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder={t(
        "ابحث برقم التذكرة (#TCK-...)، عنوان المشكلة، أو مكتب المحاماة...",
        "Search ticket #, title, or law firm..."
      )}
      primaryFilterValue={filterStatus}
      onPrimaryFilterChange={(v) => onFilterChange(v as TicketFilterStatus)}
      primaryFilterOptions={[
        { label: t(`كل التذاكر (${counts.all})`, `All Tickets (${counts.all})`), value: "all" },
        { label: t(`مفتوحة (${counts.open})`, `Open (${counts.open})`), value: "open" },
        { label: t(`جارية (${counts.in_progress})`, `In Progress (${counts.in_progress})`), value: "in_progress" },
        { label: t(`مغلقة (${counts.closed})`, `Closed (${counts.closed})`), value: "closed" },
      ]}
      hasActiveFilters={hasActiveFilters}
      onReset={() => {
        onSearchChange("");
        onFilterChange("all");
      }}
      drawerTitle={t("تصفية تذاكر الدعم الفني", "Filter Support Tickets")}
      drawerContent={drawerContent}
    />
  );
}