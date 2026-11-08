"use client";

import React from "react";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";

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
  const hasActiveFilters =
    statusFilter !== "all" ||
    billingCycle !== "monthly" ||
    sortBy !== "price_desc" ||
    Boolean(searchQuery);

  const handleReset = () => {
    onSearchChange("");
    onStatusFilterChange("all");
    onBillingCycleChange("monthly");
    onSortByChange("price_desc");
  };

  const drawerContent = (
    <div className="space-y-5 text-start font-['Cairo',sans-serif]">
      {/* Billing Cycle Option */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] block">
          دورة الفوترة
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onBillingCycleChange("monthly")}
            className={`h-[40px] rounded-[4px] border text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center ${
              billingCycle === "monthly"
                ? "bg-[#9c6402] text-white border-[#9c6402] shadow-2xs"
                : "bg-[#f5f3ef] text-[#514537] border-transparent hover:bg-[#eae8e4]"
            }`}
          >
            شهري
          </button>
          <button
            type="button"
            onClick={() => onBillingCycleChange("annual")}
            className={`h-[40px] rounded-[4px] border text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              billingCycle === "annual"
                ? "bg-[#9c6402] text-white border-[#9c6402] shadow-2xs"
                : "bg-[#f5f3ef] text-[#514537] border-transparent hover:bg-[#eae8e4]"
            }`}
          >
            <span>سنوي</span>
            <span className="bg-[#ffddb6] text-[#7b4e00] text-[10px] font-bold px-[6px] py-[1px] rounded-full">
              -15%
            </span>
          </button>
        </div>
      </div>

      {/* Sort By Option */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] block">
          ترتيب العرض
        </label>
        <select
          value={sortBy}
          onChange={(e) =>
            onSortByChange(
              e.target.value as "price_desc" | "price_asc" | "subscribers"
            )
          }
          className="w-full h-[40px] bg-[#f5f3ef] text-[#1b1c1a] text-[13px] font-semibold rounded-[4px] px-[12px] border border-transparent focus:outline-none focus:ring-1 focus:ring-[#9c6402]/30 cursor-pointer"
        >
          <option value="price_desc">الأعلى سعراً أولاً</option>
          <option value="price_asc">الأقل سعراً أولاً</option>
          <option value="subscribers">الأكثر مشتركين أولاً</option>
        </select>
      </div>
    </div>
  );

  return (
    <UnifiedFilterBar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="ابحث باسم الباقة أو المميزات..."
      primaryFilterValue={statusFilter}
      onPrimaryFilterChange={(v) =>
        onStatusFilterChange(v as "all" | "active" | "inactive")
      }
      primaryFilterOptions={[
        { label: `كل الحالات (${counts.all})`, value: "all" },
        { label: `مفعلة (${counts.active})`, value: "active" },
        { label: `معطلة (${counts.inactive})`, value: "inactive" },
      ]}
      hasActiveFilters={hasActiveFilters}
      onReset={handleReset}
      drawerTitle="تصفية الباقات والأسعار"
      drawerContent={drawerContent}
    />
  );
}
