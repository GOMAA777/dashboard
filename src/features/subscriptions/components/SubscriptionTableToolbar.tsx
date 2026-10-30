"use client";

import React from "react";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";
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
  const hasActiveFilters =
    currentTab !== "all" ||
    planFilter !== "all" ||
    statusFilter !== "all" ||
    paymentMethodFilter !== "all" ||
    Boolean(searchQuery);

  const drawerContent = (
    <div className="space-y-4 text-start font-['Cairo',sans-serif]">
      {/* Plan Filter */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          باقة الاشتراك
        </label>
        <select
          value={planFilter}
          onChange={(e) => onPlanChange(e.target.value)}
          className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[4px] px-[12px] border border-transparent focus:outline-none focus:ring-1 focus:ring-[#9c6402] cursor-pointer"
        >
          <option value="all">جميع الباقات</option>
          <option value="custom">الباقة المخصصة</option>
          <option value="gold">الباقة الذهبية</option>
          <option value="silver">الباقة الفضية</option>
          <option value="basic">الباقة الأساسية</option>
        </select>
      </div>

      {/* Status Filter */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          حالة الاشتراك
        </label>
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[4px] px-[12px] border border-transparent focus:outline-none focus:ring-1 focus:ring-[#9c6402] cursor-pointer"
        >
          <option value="all">جميع الحالات</option>
          <option value="active">نشط</option>
          <option value="pending">قيد الانتظار</option>
          <option value="expired">منتهي</option>
          <option value="cancelled">ملغي</option>
          <option value="rejected">مرفوض</option>
        </select>
      </div>

      {/* Payment Method Filter */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          طريقة الدفع
        </label>
        <select
          value={paymentMethodFilter}
          onChange={(e) => onPaymentMethodChange(e.target.value)}
          className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[4px] px-[12px] border border-transparent focus:outline-none focus:ring-1 focus:ring-[#9c6402] cursor-pointer"
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
  );

  return (
    <UnifiedFilterBar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="ابحث برقم الاشتراك، اسم المكتب، أو رقم الترخيص..."
      primaryFilterValue={currentTab}
      onPrimaryFilterChange={(v) => onTabChange(v as SubscriptionTabFilter)}
      primaryFilterOptions={[
        { label: `الكل (${counts.all})`, value: "all" },
        { label: `النشطة (${counts.active})`, value: "active" },
        { label: `قيد الانتظار (${counts.pending})`, value: "pending" },
        { label: `منتهية وملغاة (${counts.cancelled_expired})`, value: "cancelled_expired" },
      ]}
      hasActiveFilters={hasActiveFilters}
      onReset={onResetFilters}
      drawerTitle="تصفية اشتراكات المكاتب"
      drawerContent={drawerContent}
    />
  );
}
