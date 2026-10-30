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
      {/* 1. Status Filter in Drawer */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          حالة الباقة
        </label>
        <select
          value={statusFilter}
          onChange={(e) =>
            onStatusFilterChange(e.target.value as "all" | "active" | "inactive")
          }
          className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] px-[12px] border border-transparent dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] cursor-pointer"
        >
          <option value="all">كافة حالات الباقات ({counts.all})</option>
          <option value="active">الباقات المفعلة فقط ({counts.active})</option>
          <option value="inactive">الباقات المعطلة فقط ({counts.inactive})</option>
        </select>
      </div>

      {/* 2. Billing Cycle Option */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          دورة الفوترة المعتمدة
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onBillingCycleChange("monthly")}
            className={`h-[40px] rounded-[6px] border text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center ${
              billingCycle === "monthly"
                ? "bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] border-[#9c6402] dark:border-[#e29d38] shadow-2xs"
                : "bg-[#f5f3ef] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] border-transparent dark:border-[#38271c] hover:bg-[#eae8e4] dark:hover:bg-[#38271c]"
            }`}
          >
            شهري
          </button>
          <button
            type="button"
            onClick={() => onBillingCycleChange("annual")}
            className={`h-[40px] rounded-[6px] border text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              billingCycle === "annual"
                ? "bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] border-[#9c6402] dark:border-[#e29d38] shadow-2xs"
                : "bg-[#f5f3ef] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] border-transparent dark:border-[#38271c] hover:bg-[#eae8e4] dark:hover:bg-[#38271c]"
            }`}
          >
            <span>سنوي</span>
            <span className="bg-[#ffddb6] dark:bg-[rgba(226,157,56,0.25)] text-[#7b4e00] dark:text-[#f3c27e] text-[10px] font-bold px-[6px] py-[1px] rounded-full border border-transparent dark:border-[#e29d38]/40">
              -15%
            </span>
          </button>
        </div>
      </div>

      {/* 3. Sort By Option */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          ترتيب العرض
        </label>
        <select
          value={sortBy}
          onChange={(e) =>
            onSortByChange(
              e.target.value as "price_desc" | "price_asc" | "subscribers"
            )
          }
          className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] px-[12px] border border-transparent dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] cursor-pointer"
        >
          <option value="price_desc">الأعلى سعراً أولاً</option>
          <option value="price_asc">الأقل سعراً أولاً</option>
          <option value="subscribers">الأكثر طلباً ومشتركين أولاً</option>
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
