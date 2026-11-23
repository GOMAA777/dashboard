"use client";

import React from "react";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { TicketFilterStatus } from "../types/tickets.types";
import { useLanguage } from "@/lib/i18n";
import { Building2, X } from "lucide-react";

interface TicketsFilterBarProps {
  filterStatus: TicketFilterStatus;
  onFilterChange: (status: TicketFilterStatus) => void;
  filterChannel?: string;
  onChannelChange?: (channel: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCompanyId?: string;
  onCompanyChange?: (companyId: string) => void;
  companies?: Array<{ id: string | number; name: string }>;
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
  filterChannel = "all",
  onChannelChange,
  searchQuery,
  onSearchChange,
  selectedCompanyId,
  onCompanyChange,
  companies,
  counts,
}: TicketsFilterBarProps) {
  const { t, isEn } = useLanguage();
  const hasActiveFilters =
    filterStatus !== "all" ||
    Boolean(searchQuery) ||
    Boolean(selectedCompanyId) ||
    (Boolean(filterChannel) && filterChannel !== "all");

  const selectedCompanyName = selectedCompanyId
    ? companies?.find((c) => String(c.id) === String(selectedCompanyId))?.name ||
      (isEn ? `Firm #${selectedCompanyId}` : `المكتب #${selectedCompanyId}`)
    : null;

  const drawerContent = (
    <div className="space-y-4 text-start font-sans">
      {/* Law Firm Filter */}
      {companies && companies.length > 0 && onCompanyChange && (
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
            {t("المكتب / العميل المستفيد", "Law Firm / Client")}
          </label>
          <DashboardSelect
            value={selectedCompanyId || ""}
            onChange={(e) => onCompanyChange(e.target.value)}
          >
            <option
              value=""
              className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]"
            >
              {t("جميع المكاتب والعملاء", "All Law Firms & Clients")}
            </option>
            {companies.map((c) => (
              <option
                key={c.id}
                value={String(c.id)}
                className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]"
              >
                {c.name}
              </option>
            ))}
          </DashboardSelect>
        </div>
      )}

      {/* Intake Channel Filter */}
      {onChannelChange && (
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
            {t("قناة ورود التذكرة (وسيلة التواصل)", "Intake Channel")}
          </label>
          <DashboardSelect
            value={filterChannel || "all"}
            onChange={(e) => onChannelChange(e.target.value)}
          >
            <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
              {t("جميع القنوات", "All Channels")}
            </option>
            <option value="whatsapp" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
              {t("واتساب الأعمال", "WhatsApp Business")}
            </option>
            <option value="portal" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
              {t("الشات المباشر / البوابة", "Live Chat / Portal")}
            </option>
            <option value="phone" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
              {t("رقمنا (مكالمة هاتفية)", "Phone Call (Our Line)")}
            </option>
            <option value="email" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
              {t("البريد الإلكتروني", "Email")}
            </option>
          </DashboardSelect>
        </div>
      )}

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

  const secondaryPills = (
    <div className="flex items-center gap-2 flex-wrap">
      {selectedCompanyName && onCompanyChange && (
        <div className="flex items-center gap-1.5 bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] px-2.5 py-1 rounded-full text-[12px] font-medium border border-[#eae8e4] dark:border-[#38271c]">
          <Building2 className="size-3.5 text-[#9c6402] dark:text-[#e29d38]" />
          <span>{selectedCompanyName}</span>
          <button
            type="button"
            onClick={() => onCompanyChange("")}
            className="text-[#837565] dark:text-[#8e8680] hover:text-[#ba1a1a] dark:hover:text-[#f87171] p-0.5 rounded-full cursor-pointer"
            title={t("إزالة التصفية", "Clear filter")}
          >
            <X className="size-3" />
          </button>
        </div>
      )}
      {filterChannel && filterChannel !== "all" && onChannelChange && (
        <div className="flex items-center gap-1.5 bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] px-2.5 py-1 rounded-full text-[12px] font-medium border border-[#eae8e4] dark:border-[#38271c]">
          <span className="text-[#9c6402] dark:text-[#e29d38] font-bold text-[10px]">
            {t("القناة:", "Channel:")}
          </span>
          <span>
            {filterChannel === "whatsapp"
              ? (isEn ? "WhatsApp" : "واتساب")
              : filterChannel === "portal"
                ? (isEn ? "Live Chat" : "شات")
                : filterChannel === "phone"
                  ? (isEn ? "Phone (Our Line)" : "رقمنا")
                  : (isEn ? "Email" : "إيميل")}
          </span>
          <button
            type="button"
            onClick={() => onChannelChange("all")}
            className="text-[#837565] dark:text-[#8e8680] hover:text-[#ba1a1a] dark:hover:text-[#f87171] p-0.5 rounded-full cursor-pointer"
            title={t("إزالة التصفية", "Clear filter")}
          >
            <X className="size-3" />
          </button>
        </div>
      )}
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
      secondaryPills={
        (selectedCompanyName || (filterChannel && filterChannel !== "all"))
          ? secondaryPills
          : undefined
      }
      hasActiveFilters={hasActiveFilters}
      onReset={() => {
        onSearchChange("");
        onFilterChange("all");
        onCompanyChange?.("");
        onChannelChange?.("all");
      }}
      drawerTitle={t("تصفية تذاكر الدعم الفني", "Filter Support Tickets")}
      drawerContent={drawerContent}
    />
  );
}