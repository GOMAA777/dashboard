"use client";

import React from "react";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { PlanBillingCycle, PlanStatusFilter } from "../types/plan.types";

interface PlansToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: PlanStatusFilter;
  onStatusFilterChange: (status: PlanStatusFilter) => void;
  billingCycle: PlanBillingCycle;
  onBillingCycleChange: (cycle: PlanBillingCycle) => void;
  sortBy: "price_desc" | "price_asc" | "subscribers";
  onSortByChange: (sort: "price_desc" | "price_asc" | "subscribers") => void;
  counts: { all: number; active: number; inactive: number; custom?: number };
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
  const { t } = useLanguage();
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
    <div className="space-y-6 text-start font-['Cairo',sans-serif]">
      {/* 1. Status Filter in Drawer */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          {t("حالة الباقة", "Plan Status")}
        </label>
        <DashboardSelect
          value={statusFilter}
          onChange={(e) =>
            onStatusFilterChange(e.target.value as PlanStatusFilter)
          }
        >
          <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("كافة حالات الباقات", "All Plan Statuses")} ({counts.all})</option>
          <option value="active" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("الباقات المفعلة فقط", "Active Plans Only")} ({counts.active})</option>
          <option value="inactive" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("الباقات المعطلة فقط", "Inactive Plans Only")} ({counts.inactive})</option>
          {counts.custom !== undefined && counts.custom > 0 && (
            <option value="custom" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("الباقات المخصصة فقط", "Custom Plans Only")} ({counts.custom})</option>
          )}
        </DashboardSelect>
      </div>

      {/* 2. Billing Cycle Option */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          {t("دورة الفوترة ونوع العرض", "Billing Cycle & Display Mode")}
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onBillingCycleChange("monthly")}
            className={`h-[42px] rounded-[6px] border text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center ${
              billingCycle === "monthly"
                ? "bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] border-[#9c6402] dark:border-[#e29d38] shadow-2xs"
                : "bg-[#f5f3ef] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] border-transparent dark:border-[#38271c] hover:bg-[#eae8e4] dark:hover:bg-[#38271c]"
            }`}
          >
            {t("شهري", "Monthly")}
          </button>
          <button
            type="button"
            onClick={() => onBillingCycleChange("annual")}
            className={`h-[42px] rounded-[6px] border text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              billingCycle === "annual"
                ? "bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] border-[#9c6402] dark:border-[#e29d38] shadow-2xs"
                : "bg-[#f5f3ef] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] border-transparent dark:border-[#38271c] hover:bg-[#eae8e4] dark:hover:bg-[#38271c]"
            }`}
          >
            <span>{t("سنوي", "Annual")}</span>
            <span className="bg-[#ffddb6] dark:bg-[rgba(226,157,56,0.25)] text-[#7b4e00] dark:text-[#f3c27e] text-[10px] font-bold px-[6px] py-[1px] rounded-full border border-transparent dark:border-[#e29d38]/40">
              -15%
            </span>
          </button>
          <button
            type="button"
            onClick={() => onBillingCycleChange("custom")}
            className={`h-[42px] rounded-[6px] border text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              billingCycle === "custom"
                ? "bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] border-[#9c6402] dark:border-[#e29d38] shadow-2xs"
                : "bg-[#f5f3ef] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] border-transparent dark:border-[#38271c] hover:bg-[#eae8e4] dark:hover:bg-[#38271c]"
            }`}
          >
            <span>{t("مخصص", "Custom")}</span>
          </button>
        </div>
      </div>

      {/* 3. Sort By Option */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          {t("ترتيب العرض", "Sort Display")}
        </label>
        <DashboardSelect
          value={sortBy}
          onChange={(e) =>
            onSortByChange(
              e.target.value as "price_desc" | "price_asc" | "subscribers"
            )
          }
        >
          <option value="price_desc" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("الأعلى سعراً أولاً", "Highest Price First")}</option>
          <option value="price_asc" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("الأقل سعراً أولاً", "Lowest Price First")}</option>
          <option value="subscribers" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("الأكثر طلباً ومشتركين أولاً", "Most Subscribers First")}</option>
        </DashboardSelect>
      </div>
    </div>
  );

  const billingCycleToggle = (
    <div
      role="group"
      aria-label={t("دورة الفوترة", "Billing Cycle")}
      className="bg-[#f5f3ef] dark:bg-[#1a120d] p-[3px] rounded-[6px] border border-[#eae8e4] dark:border-[#38271c] inline-flex items-center gap-[3px] shrink-0"
    >
      <button
        type="button"
        onClick={() => onBillingCycleChange("monthly")}
        className={cn(
          "px-[12px] py-[6px] rounded-[4px] text-[12px] font-bold transition-all cursor-pointer whitespace-nowrap",
          billingCycle === "monthly"
            ? "bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] shadow-xs"
            : "text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] hover:bg-[#eae8e4]/60 dark:hover:bg-[#281c15]"
        )}
      >
        {t("شهري", "Monthly")}
      </button>
      <button
        type="button"
        onClick={() => onBillingCycleChange("annual")}
        className={cn(
          "px-[12px] py-[6px] rounded-[4px] text-[12px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5",
          billingCycle === "annual"
            ? "bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] shadow-xs"
            : "text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] hover:bg-[#eae8e4]/60 dark:hover:bg-[#281c15]"
        )}
      >
        <span>{t("سنوي", "Annual")}</span>
        <span
          className={cn(
            "text-[10px] font-bold px-[6px] py-[1px] rounded-full transition-colors",
            billingCycle === "annual"
              ? "bg-white/20 text-white dark:text-[#1c140f]"
              : "bg-[#ffddb6] dark:bg-[rgba(226,157,56,0.25)] text-[#7b4e00] dark:text-[#f3c27e]"
          )}
        >
          {t("خصم شهرين", "2 Mo. Free")}
        </span>
      </button>
      <button
        type="button"
        onClick={() => onBillingCycleChange("custom")}
        className={cn(
          "px-[12px] py-[6px] rounded-[4px] text-[12px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5",
          billingCycle === "custom"
            ? "bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] shadow-xs"
            : "text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] hover:bg-[#eae8e4]/60 dark:hover:bg-[#281c15]"
        )}
      >
        <span>{t("مخصص", "Custom")}</span>
        <span
          className={cn(
            "text-[10px] font-bold px-[6px] py-[1px] rounded-full transition-colors",
            billingCycle === "custom"
              ? "bg-white/20 text-white dark:text-[#1c140f]"
              : "bg-[#ffddb6] dark:bg-[rgba(226,157,56,0.25)] text-[#7b4e00] dark:text-[#f3c27e]"
          )}
        >
          {t("تعاقدي", "Custom")}
        </span>
      </button>
    </div>
  );

  return (
    <UnifiedFilterBar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder={t("ابحث باسم الباقة أو المميزات...", "Search by plan name or features...")}
      primaryFilterValue={statusFilter}
      onPrimaryFilterChange={(v) =>
        onStatusFilterChange(v as PlanStatusFilter)
      }
      primaryFilterOptions={[
        { label: `${t("كل الحالات", "All Statuses")} (${counts.all})`, value: "all" },
        { label: `${t("مفعلة", "Active")} (${counts.active})`, value: "active" },
        { label: `${t("معطلة", "Inactive")} (${counts.inactive})`, value: "inactive" },
        ...(counts.custom !== undefined && counts.custom > 0
          ? [{ label: `${t("مخصصة", "Custom")} (${counts.custom})`, value: "custom" }]
          : []),
      ]}
      secondaryPills={billingCycleToggle}
      hasActiveFilters={hasActiveFilters}
      onReset={handleReset}
      drawerTitle={t("تصفية الباقات والأسعار", "Filter Plans & Pricing")}
      drawerContent={drawerContent}
    />
  );
}
