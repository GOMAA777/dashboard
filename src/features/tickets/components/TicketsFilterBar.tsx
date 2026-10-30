"use client";

import React from "react";
import { Search, ChevronDown, Sparkles } from "lucide-react";
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
  isEmptyToggle = false,
  onToggleEmptyState,
}: TicketsFilterBarProps) {
  return (
    <div
      className="bg-white flex flex-col gap-[16px] p-[20px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 w-full"
      data-node-id="1:14424"
      data-name="Tabs and Search / Filter Header"
    >
      {/* Top row: Tab pills and page view size */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-[12px] w-full">
        {/* Right side (RTL): Status Pills */}
        <div
          className="bg-[#f5f3ef] flex gap-[6px] items-center p-[4px] rounded-[12px] overflow-x-auto"
          data-node-id="1:14434"
        >
          {/* 1. All */}
          <button
            type="button"
            onClick={() => onFilterChange("all")}
            className={`flex items-center gap-[8px] px-[16px] py-[6px] rounded-[10px] text-[14px] leading-[20px] font-semibold transition-all cursor-pointer ${
              filterStatus === "all"
                ? "bg-white text-[#9c6402] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                : "text-[#514537] hover:text-[#1b1c1a]"
            }`}
          >
            <span
              className={`px-[6px] rounded-[12px] text-[10px] font-bold leading-[14px] ${
                filterStatus === "all"
                  ? "bg-[#f0eeea] text-[#7b4e00]"
                  : "bg-[#f0eeea] text-[#514537]"
              }`}
            >
              {counts.all}
            </span>
            <span>الكل</span>
          </button>

          {/* 2. Open */}
          <button
            type="button"
            onClick={() => onFilterChange("open")}
            className={`flex items-center gap-[8px] px-[16px] py-[6px] rounded-[10px] text-[14px] leading-[20px] font-medium transition-all cursor-pointer ${
              filterStatus === "open"
                ? "bg-white text-[#9c6402] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] font-semibold"
                : "text-[#514537] hover:text-[#1b1c1a]"
            }`}
          >
            <span className="bg-[#f0eeea] text-[#514537] px-[6px] rounded-[12px] text-[10px] font-bold leading-[14px]">
              {counts.open}
            </span>
            <span>مفتوحة</span>
          </button>

          {/* 3. In Progress */}
          <button
            type="button"
            onClick={() => onFilterChange("in_progress")}
            className={`flex items-center gap-[8px] px-[16px] py-[6px] rounded-[10px] text-[14px] leading-[20px] font-medium transition-all cursor-pointer ${
              filterStatus === "in_progress"
                ? "bg-white text-[#9c6402] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] font-semibold"
                : "text-[#514537] hover:text-[#1b1c1a]"
            }`}
          >
            <span className="bg-[#f0eeea] text-[#514537] px-[6px] rounded-[12px] text-[10px] font-bold leading-[14px]">
              {counts.in_progress}
            </span>
            <span>جارية</span>
          </button>

          {/* 4. Closed */}
          <button
            type="button"
            onClick={() => onFilterChange("closed")}
            className={`flex items-center gap-[8px] px-[16px] py-[6px] rounded-[10px] text-[14px] leading-[20px] font-medium transition-all cursor-pointer ${
              filterStatus === "closed"
                ? "bg-white text-[#9c6402] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] font-semibold"
                : "text-[#514537] hover:text-[#1b1c1a]"
            }`}
          >
            <span className="bg-[#f0eeea] text-[#514537] px-[6px] rounded-[12px] text-[10px] font-bold leading-[14px]">
              {counts.closed}
            </span>
            <span>مغلقة</span>
          </button>
        </div>

        {/* Left side (RTL): Page view selector & Empty test toggle */}
        <div className="flex items-center gap-[12px] justify-between sm:justify-end">
          {onToggleEmptyState && (
            <button
              type="button"
              onClick={onToggleEmptyState}
              title="معاينة شاشة الحالة الفارغة (Figma 1:16031)"
              className={`flex items-center gap-[6px] px-[12px] py-[6px] rounded-[6px] text-[11px] font-semibold border transition-all cursor-pointer ${
                isEmptyToggle
                  ? "bg-[#9c6402]/10 border-[#9c6402] text-[#9c6402]"
                  : "bg-white border-[#eae8e4] text-[#837565] hover:border-[#9c6402]/40"
              }`}
            >
              <Sparkles className="size-[13px] text-[#9c6402]" />
              <span>{isEmptyToggle ? "عرض التذاكر النشطة" : "معاينة شاشة لا توجد تذاكر"}</span>
            </button>
          )}

          <div className="flex items-center gap-[8px]">
            <span className="text-[#837565] text-[12px] leading-[18px]">
              عرض الصفحة:
            </span>
            <div className="bg-[#f5f3ef] flex items-center gap-[6px] px-[12px] py-[6px] rounded-[4px] cursor-pointer">
              <span className="font-semibold text-[#1b1c1a] text-[12px] leading-[16px]">
                {pageSize} تذاكر
              </span>
              <ChevronDown className="size-[12px] text-[#514537]" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Input Row */}
      <div className="relative w-full">
        <div className="relative flex items-center w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث برقم التذكرة (#TCK-...)، عنوان المشكلة، أو مكتب المحاماة..."
            className="w-full bg-[#f5f3ef] border-0 rounded-[4px] py-[8px] ps-[14px] pe-[40px] text-[12px] text-[#1b1c1a] placeholder:text-[#837565] focus:outline-none focus:ring-1 focus:ring-[#9c6402]/40 text-start"
          />
          <Search className="absolute end-[12px] size-[15px] text-[#837565] pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
