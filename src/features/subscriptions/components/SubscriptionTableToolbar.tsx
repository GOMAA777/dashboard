"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal, RotateCcw, Check } from "lucide-react";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SubscriptionTabFilter } from "../types/subscription.types";
import { useLanguage } from "@/lib/i18n";

interface SubscriptionTableToolbarProps {
  currentTab: SubscriptionTabFilter;
  onTabChange: (tab: SubscriptionTabFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  planFilter: string;
  onPlanChange: (plan: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  paymentMethodFilter: string;
  onPaymentMethodChange: (method: string) => void;
  onResetFilters: () => void;
  counts?: {
    all: number;
    active: number;
    pending: number;
    cancelled_expired: number;
  };
}

export function SubscriptionTableToolbar({
  currentTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  planFilter,
  onPlanChange,
  statusFilter,
  onStatusChange,
  paymentMethodFilter,
  onPaymentMethodChange,
  onResetFilters,
  counts = {
    all: 128,
    active: 96,
    pending: 18,
    cancelled_expired: 14,
  },
}: SubscriptionTableToolbarProps) {
  const { t, direction } = useLanguage();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Check if any drawer filter (or non-default filter) is active
  const hasActiveDrawerFilters =
    planFilter !== "all" ||
    statusFilter !== "all" ||
    paymentMethodFilter !== "all";

  const hasAnyActiveFilters =
    hasActiveDrawerFilters ||
    currentTab !== "all" ||
    Boolean(searchQuery.trim());

  return (
    <div
      className="bg-white dark:bg-[#1e1c1a] rounded-[8px] p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#2f2a24] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 w-full font-['Cairo',sans-serif]"
      data-name="Subscription Table Toolbar"
    >
      {/* 1. Right in RTL: Search Input Field */}
      <div className="relative w-full md:w-[320px] lg:w-[380px] shrink-0">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t(
            "ابحث برقم الاشتراك، اسم المكتب، أو رقم الترخيص...",
            "Search by subscription ID, law firm name, or license..."
          )}
          className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder-[#837565] text-[13px] rounded-[6px] pe-[38px] ps-3.5 border border-transparent focus:border-[#9c6402]/40 focus:outline-none transition-colors"
        />
        <Search className="w-4 h-4 text-[#837565] absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* 2. Left in RTL: Small 3-Option Toggle Filter + Large Drawer Filter + Reset */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Small Filter: 3 Segmented Choices to toggle directly */}
        <div className="bg-[#f5f3ef] dark:bg-[#2c2621] p-1 rounded-[6px] flex items-center gap-1 border border-[#eae8e4] dark:border-[#38332c]">
          {/* Tab 1: الكل */}
          <button
            type="button"
            onClick={() => onTabChange("all")}
            className={cn(
              "px-3 py-1.5 rounded-[4px] text-[12px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer",
              currentTab === "all"
                ? "bg-white dark:bg-[#1e1c1a] text-[#9c6402] dark:text-[#f59e0b] font-bold shadow-[0px_1px_2px_rgba(0,0,0,0.06)]"
                : "text-[#514537] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7]"
            )}
          >
            <span>{t("الكل", "All")}</span>
            <span
              className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                currentTab === "all"
                  ? "bg-[#9c6402]/10 text-[#9c6402] dark:text-[#f59e0b]"
                  : "bg-black/5 dark:bg-white/10 text-[#837565] dark:text-[#a89f91]"
              )}
            >
              {counts.all}
            </span>
          </button>

          {/* Tab 2: النشطة */}
          <button
            type="button"
            onClick={() => onTabChange("active")}
            className={cn(
              "px-3 py-1.5 rounded-[4px] text-[12px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer",
              currentTab === "active"
                ? "bg-white dark:bg-[#1e1c1a] text-[#9c6402] dark:text-[#f59e0b] font-bold shadow-[0px_1px_2px_rgba(0,0,0,0.06)]"
                : "text-[#514537] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7]"
            )}
          >
            <span>{t("النشطة", "Active")}</span>
            <span
              className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                currentTab === "active"
                  ? "bg-[#9c6402]/10 text-[#9c6402] dark:text-[#f59e0b]"
                  : "bg-black/5 dark:bg-white/10 text-[#837565] dark:text-[#a89f91]"
              )}
            >
              {counts.active}
            </span>
          </button>

          {/* Tab 3: منتهية وملغاة */}
          <button
            type="button"
            onClick={() => onTabChange("cancelled_expired")}
            className={cn(
              "px-3 py-1.5 rounded-[4px] text-[12px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer",
              currentTab === "cancelled_expired"
                ? "bg-white dark:bg-[#1e1c1a] text-[#9c6402] dark:text-[#f59e0b] font-bold shadow-[0px_1px_2px_rgba(0,0,0,0.06)]"
                : "text-[#514537] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7]"
            )}
          >
            <span>{t("منتهية وملغاة", "Expired & Cancelled")}</span>
            <span
              className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                currentTab === "cancelled_expired"
                  ? "bg-[#9c6402]/10 text-[#9c6402] dark:text-[#f59e0b]"
                  : "bg-black/5 dark:bg-white/10 text-[#837565] dark:text-[#a89f91]"
              )}
            >
              {counts.cancelled_expired}
            </span>
          </button>
        </div>

        {/* Large Filter: Drawer (Sheet) that slides from side */}
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetTrigger
            render={
              <button
                type="button"
                title={t("تصفية متقدمة", "Advanced Filter")}
                aria-label={t("تصفية متقدمة", "Advanced Filter")}
                className={cn(
                  "h-[40px] px-3.5 rounded-[6px] bg-[#f5f3ef] dark:bg-[#2c2621] hover:bg-[#eae8e4] dark:hover:bg-[#38332c] text-[#514537] dark:text-[#d1c9bd] flex items-center gap-2 text-[13px] font-bold transition-colors cursor-pointer relative border border-[#eae8e4] dark:border-[#38332c]",
                  hasActiveDrawerFilters &&
                    "border-[#9c6402] text-[#9c6402] dark:text-[#f59e0b] bg-[#fff6e8] dark:bg-[#38271c]"
                )}
              >
                <SlidersHorizontal className="w-4 h-4 text-[#9c6402] dark:text-[#f59e0b]" />
                <span>{t("فلتر", "Filter")}</span>
                {hasActiveDrawerFilters && (
                  <span className="size-2 rounded-full bg-[#9c6402] dark:bg-[#f59e0b] ring-2 ring-white dark:ring-[#1e1c1a]" />
                )}
              </button>
            }
          />
          <SheetContent
            side={direction === "rtl" ? "left" : "right"}
            className="w-[340px] sm:w-[420px] p-0 flex flex-col justify-between bg-white dark:bg-[#1e1c1a] border-e border-[#eae8e4] dark:border-[#38271c] shadow-2xl font-['Cairo',sans-serif]"
          >
            <SheetHeader className="p-5 border-b border-[#f0eeea] dark:border-[#2f2a24] text-start">
              <SheetTitle className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-2">
                <SlidersHorizontal className="size-[18px] text-[#9c6402] dark:text-[#f59e0b]" />
                <span>{t("تصفية اشتراكات المكاتب", "Filter Law Firm Subscriptions")}</span>
              </SheetTitle>
              <SheetDescription className="text-[12px] text-[#837565] dark:text-[#a89f91] mt-1">
                {t(
                  "تخصيص نتائج الاشتراكات المعروضة حسب الباقة، الحالة، أو طريقة الدفع",
                  "Filter subscription records by plan, status, or payment method"
                )}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-start font-['Cairo',sans-serif]">
              {/* 1. Plan Filter */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                  {t("باقة الاشتراك", "Subscription Plan")}
                </label>
                <DashboardSelect
                  value={planFilter}
                  onChange={(e) => onPlanChange(e.target.value)}
                >
                  <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("جميع الباقات", "All Plans")}
                  </option>
                  <option value="custom" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("الباقة المخصصة", "Enterprise / Custom")}
                  </option>
                  <option value="gold" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("الباقة الذهبية", "Gold Plan")}
                  </option>
                  <option value="silver" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("الباقة الفضية", "Silver Plan")}
                  </option>
                  <option value="basic" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("الباقة الأساسية", "Basic Plan")}
                  </option>
                </DashboardSelect>
              </div>

              {/* 2. Status Filter */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                  {t("حالة الاشتراك", "Subscription Status")}
                </label>
                <DashboardSelect
                  value={statusFilter}
                  onChange={(e) => onStatusChange(e.target.value)}
                >
                  <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("جميع الحالات", "All Statuses")}
                  </option>
                  <option value="active" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("نشط", "Active")}
                  </option>
                  <option value="pending" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("قيد الانتظار", "Pending")}
                  </option>
                  <option value="expired" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("منتهي", "Expired")}
                  </option>
                  <option value="cancelled" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("ملغي", "Cancelled")}
                  </option>
                  <option value="rejected" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("مرفوض", "Rejected")}
                  </option>
                </DashboardSelect>
              </div>

              {/* 3. Payment Method Filter */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                  {t("طريقة الدفع", "Payment Method")}
                </label>
                <DashboardSelect
                  value={paymentMethodFilter}
                  onChange={(e) => onPaymentMethodChange(e.target.value)}
                >
                  <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("طرق الدفع (الكل)", "All Payment Methods")}
                  </option>
                  <option value="mada" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("مدى", "Mada")}
                  </option>
                  <option value="visa" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    VISA / Mastercard
                  </option>
                  <option value="sadad" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("سداد", "Sadad")}
                  </option>
                  <option value="transfer" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("تحويل بنكي", "Bank Transfer")}
                  </option>
                  <option value="settlement" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("تسوية", "Settlement")}
                  </option>
                </DashboardSelect>
              </div>
            </div>

            {/* Drawer Footer with Actions */}
            <SheetFooter className="p-4 border-t border-[#f0eeea] dark:border-[#2f2a24] bg-[#fcfbfa] dark:bg-[#1a1816] flex flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  onResetFilters();
                  setIsDrawerOpen(false);
                }}
                className="flex-1 h-[40px] rounded-[6px] border border-[#ded5c6] dark:border-[#38332c] bg-white dark:bg-[#2c2621] hover:bg-[#f5f3ef] text-[#514537] dark:text-[#d1c9bd] text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCcw className="size-[14px]" />
                <span>{t("إعادة ضبط", "Reset")}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1 h-[40px] rounded-[6px] bg-[#9c6402] hover:bg-[#7e4f02] text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
              >
                <Check className="size-[15px]" />
                <span>{t("تطبيق الفلتر", "Apply Filter")}</span>
              </button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {/* Quick Reset Button if any filter is applied */}
        {hasAnyActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            title={t("إعادة ضبط الفلاتر", "Reset Filters")}
            className="h-[40px] px-3 rounded-[6px] text-[#837565] dark:text-[#a89f91] hover:text-[#9c6402] dark:hover:text-[#f59e0b] hover:bg-[#f5f3ef] dark:hover:bg-[#2c2621] flex items-center gap-1.5 text-[12px] font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t("إعادة ضبط", "Reset")}</span>
          </button>
        )}
      </div>
    </div>
  );
}
