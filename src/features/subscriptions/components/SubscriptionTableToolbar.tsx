"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal, RotateCcw, Check } from "lucide-react";
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
          placeholder="ابحث برقم الاشتراك، اسم المكتب، أو رقم الترخيص..."
          className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder-[#837565] text-[13px] rounded-[6px] pe-[38px] ps-3.5 border border-transparent focus:border-[#9c6402]/40 focus:outline-none transition-colors"
        />
        <Search className="w-4 h-4 text-[#837565] absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* 2. Left in RTL: Small 3-Option Toggle Filter + Large Drawer Filter + Reset */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Small Filter: 3 Segmented Choices to toggle directly (NOT a dropdown) */}
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
            <span>الكل</span>
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
            <span>النشطة</span>
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
            <span>منتهية وملغاة</span>
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
                title="تصفية متقدمة"
                aria-label="تصفية متقدمة"
                className={cn(
                  "h-[40px] px-3.5 rounded-[6px] bg-[#f5f3ef] dark:bg-[#2c2621] hover:bg-[#eae8e4] dark:hover:bg-[#38332c] text-[#514537] dark:text-[#d1c9bd] flex items-center gap-2 text-[13px] font-bold transition-colors cursor-pointer relative border border-[#eae8e4] dark:border-[#38332c]",
                  hasActiveDrawerFilters &&
                    "border-[#9c6402] text-[#9c6402] dark:text-[#f59e0b] bg-[#fff6e8] dark:bg-[#38271c]"
                )}
              >
                <SlidersHorizontal className="w-4 h-4 text-[#9c6402] dark:text-[#f59e0b]" />
                <span>فلتر</span>
                {hasActiveDrawerFilters && (
                  <span className="size-2 rounded-full bg-[#9c6402] dark:bg-[#f59e0b] ring-2 ring-white dark:ring-[#1e1c1a]" />
                )}
              </button>
            }
          />
          <SheetContent
            side="left"
            className="w-[340px] sm:w-[420px] p-0 flex flex-col justify-between bg-white dark:bg-[#1e1c1a] border-e border-[#eae8e4] dark:border-[#38271c] shadow-2xl font-['Cairo',sans-serif]"
          >
            <SheetHeader className="p-5 border-b border-[#f0eeea] dark:border-[#2f2a24] text-start">
              <SheetTitle className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-2">
                <SlidersHorizontal className="size-[18px] text-[#9c6402] dark:text-[#f59e0b]" />
                <span>تصفية اشتراكات المكاتب</span>
              </SheetTitle>
              <SheetDescription className="text-[12px] text-[#837565] dark:text-[#a89f91] mt-1">
                تخصيص نتائج الاشتراكات المعروضة حسب الباقة، الحالة، أو طريقة الدفع
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-start font-['Cairo',sans-serif]">
              {/* 1. Plan Filter */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                  باقة الاشتراك
                </label>
                <select
                  value={planFilter}
                  onChange={(e) => onPlanChange(e.target.value)}
                  className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] px-3 border border-[#eae8e4] dark:border-[#38332c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] cursor-pointer"
                >
                  <option value="all">جميع الباقات</option>
                  <option value="custom">الباقة المخصصة</option>
                  <option value="gold">الباقة الذهبية</option>
                  <option value="silver">الباقة الفضية</option>
                  <option value="basic">الباقة الأساسية</option>
                </select>
              </div>

              {/* 2. Status Filter */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                  حالة الاشتراك
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => onStatusChange(e.target.value)}
                  className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] px-3 border border-[#eae8e4] dark:border-[#38332c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] cursor-pointer"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="active">نشط</option>
                  <option value="pending">قيد الانتظار</option>
                  <option value="expired">منتهي</option>
                  <option value="cancelled">ملغي</option>
                  <option value="rejected">مرفوض</option>
                </select>
              </div>

              {/* 3. Payment Method Filter */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                  طريقة الدفع
                </label>
                <select
                  value={paymentMethodFilter}
                  onChange={(e) => onPaymentMethodChange(e.target.value)}
                  className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] px-3 border border-[#eae8e4] dark:border-[#38332c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] cursor-pointer"
                >
                  <option value="all">طرق الدفع (الكل)</option>
                  <option value="mada">مدى</option>
                  <option value="visa">VISA / Mastercard</option>
                  <option value="sadad">سداد</option>
                  <option value="transfer">تحويل بنكي</option>
                  <option value="settlement">تسوية</option>
                </select>
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
                <span>إعادة ضبط</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1 h-[40px] rounded-[6px] bg-[#9c6402] hover:bg-[#7e4f02] text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
              >
                <Check className="size-[15px]" />
                <span>تطبيق الفلتر</span>
              </button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {/* Quick Reset Button if any filter is applied */}
        {hasAnyActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            title="إعادة ضبط الفلاتر"
            className="h-[40px] px-3 rounded-[6px] text-[#837565] dark:text-[#a89f91] hover:text-[#9c6402] dark:hover:text-[#f59e0b] hover:bg-[#f5f3ef] dark:hover:bg-[#2c2621] flex items-center gap-1.5 text-[12px] font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ضبط</span>
          </button>
        )}
      </div>
    </div>
  );
}
