"use client";

import React from "react";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";
import { Sparkles } from "lucide-react";
import { TicketFilterStatus } from "../types/tickets.types";

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
  };
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  isEmptyToggle?: boolean;
  onToggleEmptyState?: () => void;
}

export function TicketsFilterBar({
  filterStatus,
  onFilterChange,
  searchQuery,
  onSearchChange,
  counts,
  pageSize = 10,
  onPageSizeChange,
  isEmptyToggle = false,
  onToggleEmptyState,
}: TicketsFilterBarProps) {
  const hasActiveFilters = filterStatus !== "all" || Boolean(searchQuery);

  const drawerContent = (
    <div className="space-y-4 text-start font-['Cairo',sans-serif]">
      {/* Ticket Status Filter */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-bold text-[#1b1c1a] block">
          حالة التذكرة
        </label>
        <select
          value={filterStatus}
          onChange={(e) => onFilterChange(e.target.value as TicketFilterStatus)}
          className="w-full h-[40px] bg-[#f5f3ef] text-[#1b1c1a] text-[13px] font-semibold rounded-[4px] px-[12px] border border-transparent focus:outline-none focus:ring-1 focus:ring-[#9c6402] cursor-pointer"
        >
          <option value="all">كل التذاكر ({counts.all})</option>
          <option value="open">تذاكر مفتوحة ({counts.open})</option>
          <option value="in_progress">تذاكر جارية المعالجة ({counts.in_progress})</option>
          <option value="closed">تذاكر مغلقة ({counts.closed})</option>
        </select>
      </div>

      {/* Page Size in Drawer */}
      {onPageSizeChange && (
        <div className="space-y-1.5">
          <label className="text-[13px] font-bold text-[#1b1c1a] block">
            عرض الصفحة
          </label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="w-full h-[40px] bg-[#f5f3ef] text-[#1b1c1a] text-[13px] font-semibold rounded-[4px] px-[12px] border border-transparent focus:outline-none focus:ring-1 focus:ring-[#9c6402] cursor-pointer"
          >
            <option value={10}>10 تذاكر</option>
            <option value={20}>20 تذكرة</option>
            <option value={50}>50 تذكرة</option>
          </select>
        </div>
      )}
    </div>
  );

  return (
    <UnifiedFilterBar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="ابحث برقم التذكرة (#TCK-...)، عنوان المشكلة، أو مكتب المحاماة..."
      primaryFilterValue={filterStatus}
      onPrimaryFilterChange={(v) => onFilterChange(v as TicketFilterStatus)}
      primaryFilterOptions={[
        { label: `كل التذاكر (${counts.all})`, value: "all" },
        { label: `مفتوحة (${counts.open})`, value: "open" },
        { label: `جارية (${counts.in_progress})`, value: "in_progress" },
        { label: `مغلقة (${counts.closed})`, value: "closed" },
      ]}
      hasActiveFilters={hasActiveFilters}
      onReset={() => {
        onSearchChange("");
        onFilterChange("all");
      }}
      drawerTitle="تصفية تذاكر الدعم الفني"
      drawerContent={drawerContent}
      actionButton={
        onToggleEmptyState && (
          <button
            type="button"
            onClick={onToggleEmptyState}
            title="معاينة شاشة الحالة الفارغة"
            className={`flex items-center gap-[6px] px-[12px] py-[8px] rounded-[4px] text-[11px] font-semibold border transition-all cursor-pointer ${
              isEmptyToggle
                ? "bg-[#9c6402]/10 border-[#9c6402] text-[#9c6402]"
                : "bg-white border-[#eae8e4] text-[#837565] hover:border-[#9c6402]/40"
            }`}
          >
            <Sparkles className="size-[13px] text-[#9c6402]" />
            <span>{isEmptyToggle ? "عرض التذاكر النشطة" : "معاينة شاشة لا توجد تذاكر"}</span>
          </button>
        )
      }
    />
  );
}
