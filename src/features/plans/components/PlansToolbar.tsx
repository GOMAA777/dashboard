"use client";

import React from "react";
import { Search, ChevronDown } from "lucide-react";

interface PlansToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: "all" | "active" | "inactive";
  onStatusFilterChange: (status: "all" | "active" | "inactive") => void;
  billingCycle: "monthly" | "annual";
  onBillingCycleChange: (cycle: "monthly" | "annual") => void;
  sortBy: "price_desc" | "price_asc" | "subscribers";
  onSortByChange: (sort: "price_desc" | "price_asc" | "subscribers") => void;
  counts: { all: number; active: number; inactive: number };
}

export function PlansToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  billingCycle,
  onBillingCycleChange,
  sortBy,
  onSortByChange,
  counts,
}: PlansToolbarProps) {
  return (
    <div
      className="bg-white rounded-[8px] p-[16px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] flex flex-col lg:flex-row lg:items-center justify-between gap-[16px] w-full font-['Cairo',sans-serif]"
      dir="rtl"
    >
      {/* Right / Start: Search Input */}
      <div className="relative flex-1 max-w-[420px]">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ابحث باسم الباقة أو المميزات أو السعة..."
          className="w-full h-[40px] bg-[#f5f3ef] text-[#1b1c1a] placeholder-[#837565] text-[13px] rounded-[4px] pe-[36px] ps-[14px] focus:outline-none focus:ring-1 focus:ring-[#9c6402]/30 transition-all"
        />
        <div className="absolute top-1/2 -translate-y-1/2 end-[12px] pointer-events-none text-[#837565]">
          <Search className="size-[15px]" />
        </div>
      </div>

      {/* Center & Left controls */}
      <div className="flex flex-wrap items-center gap-[12px]">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-[4px] bg-[#f5f3ef] p-[3px] rounded-[4px]">
          <button
            type="button"
            onClick={() => onStatusFilterChange("all")}
            className={`px-[12px] py-[6px] rounded-[4px] text-[12px] font-bold transition-all cursor-pointer ${
              statusFilter === "all"
                ? "bg-white text-[#7b4e00] shadow-2xs"
                : "text-[#514537] hover:text-[#1b1c1a]"
            }`}
          >
            الكل ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange("active")}
            className={`px-[12px] py-[6px] rounded-[4px] text-[12px] font-bold transition-all cursor-pointer ${
              statusFilter === "active"
                ? "bg-white text-[#7b4e00] shadow-2xs"
                : "text-[#514537] hover:text-[#1b1c1a]"
            }`}
          >
            مفعلة ({counts.active})
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange("inactive")}
            className={`px-[12px] py-[6px] rounded-[4px] text-[12px] font-bold transition-all cursor-pointer ${
              statusFilter === "inactive"
                ? "bg-white text-[#7b4e00] shadow-2xs"
                : "text-[#514537] hover:text-[#1b1c1a]"
            }`}
          >
            معطلة ({counts.inactive})
          </button>
        </div>

        {/* Billing Cycle Switch */}
        <div className="flex items-center gap-[4px] bg-[#f5f3ef] p-[3px] rounded-[4px]">
          <button
            type="button"
            onClick={() => onBillingCycleChange("monthly")}
            className={`px-[12px] py-[6px] rounded-[4px] text-[12px] font-bold transition-all cursor-pointer ${
              billingCycle === "monthly"
                ? "bg-white text-[#1b1c1a] shadow-2xs"
                : "text-[#514537] hover:text-[#1b1c1a]"
            }`}
          >
            شهري
          </button>
          <button
            type="button"
            onClick={() => onBillingCycleChange("annual")}
            className={`px-[12px] py-[6px] rounded-[4px] text-[12px] font-bold transition-all cursor-pointer flex items-center gap-[4px] ${
              billingCycle === "annual"
                ? "bg-white text-[#1b1c1a] shadow-2xs"
                : "text-[#514537] hover:text-[#1b1c1a]"
            }`}
          >
            <span>سنوي</span>
            <span className="bg-[#ffddb6] text-[#7b4e00] text-[10px] font-bold px-[5px] py-[1px] rounded-full">
              خصم 15%
            </span>
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) =>
              onSortByChange(
                e.target.value as "price_desc" | "price_asc" | "subscribers"
              )
            }
            className="appearance-none bg-white border border-[#eae8e4] rounded-[4px] px-[12px] py-[7px] pe-[28px] text-[12px] font-semibold text-[#1b1c1a] focus:outline-none cursor-pointer shadow-2xs"
          >
            <option value="price_desc">ترتيب: الأعلى سعراً</option>
            <option value="price_asc">ترتيب: الأقل سعراً</option>
            <option value="subscribers">ترتيب: الأكثر مشتركين</option>
          </select>
          <ChevronDown className="size-[13px] text-[#514537] absolute start-[10px] top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
