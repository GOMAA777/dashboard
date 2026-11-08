"use client";

import React from "react";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
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
  className?: string;
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
    all: 0,
    active: 0,
    pending: 0,
    cancelled_expired: 0,
  },
  className,
}: SubscriptionTableToolbarProps) {
  const { t } = useLanguage();

  // Check if any drawer filter is active
  const hasActiveDrawerFilters =
    planFilter !== "all" ||
    statusFilter !== "all" ||
    paymentMethodFilter !== "all";

  const hasAnyActiveFilters =
    hasActiveDrawerFilters ||
    currentTab !== "all" ||
    Boolean(searchQuery.trim());

  const primaryFilterOptions = [
    { label: `${t("الكل", "All")} (${counts.all})`, value: "all" },
    { label: `${t("النشطة", "Active")} (${counts.active})`, value: "active" },
    ...(counts.pending > 0
      ? [
          {
            label: `${t("معلقة", "Pending")} (${counts.pending})`,
            value: "pending" as SubscriptionTabFilter,
          },
        ]
      : []),
    {
      label: `${t("منتهية وملغاة", "Expired & Cancelled")} (${counts.cancelled_expired})`,
      value: "cancelled_expired",
    },
  ];

  return (
    <UnifiedFilterBar
      className={className}
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder={t(
        "ابحث برقم الاشتراك، اسم المكتب، أو رقم الترخيص...",
        "Search by subscription ID, law firm name, or license..."
      )}
      primaryFilterValue={currentTab}
      onPrimaryFilterChange={(v) => onTabChange(v as SubscriptionTabFilter)}
      primaryFilterMode="pills"
      primaryFilterOptions={primaryFilterOptions}
      hasActiveFilters={hasAnyActiveFilters}
      onReset={onResetFilters}
      drawerTitle={t("تصفية اشتراكات المكاتب", "Filter Law Firm Subscriptions")}
      drawerDescription={t(
        "تخصيص نتائج الاشتراكات المعروضة حسب الباقة، الحالة، أو طريقة الدفع",
        "Filter subscription records by plan, status, or payment method"
      )}
      drawerContent={
        <div className="space-y-5">
          {/* 1. Plan Filter */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
              {t("باقة الاشتراك", "Subscription Plan")}
            </label>
            <DashboardSelect
              value={planFilter}
              onChange={(e) => onPlanChange(e.target.value)}
            >
              <option
                value="all"
                className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]"
              >
                {t("جميع الباقات", "All Plans")}
              </option>
              <option
                value="custom"
                className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]"
              >
                {t("الباقة المخصصة", "Enterprise / Custom")}
              </option>
              <option
                value="gold"
                className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]"
              >
                {t("الباقة الذهبية", "Gold Plan")}
              </option>
              <option
                value="silver"
                className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]"
              >
                {t("الباقة الفضية", "Silver Plan")}
              </option>
              <option
                value="basic"
                className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]"
              >
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
              <option
                value="all"
                className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]"
              >
                {t("جميع الحالات", "All Statuses")}
              </option>
              <option
                value="active"
                className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]"
              >
                {t("نشط", "Active")}
              </option>
              <option
                value="pending"
                className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]"
              >
                {t("قيد الانتظار", "Pending")}
              </option>
              <option
                value="expired"
                className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]"
              >
                {t("منتهي", "Expired")}
              </option>
              <option
                value="cancelled"
                className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]"
              >
                {t("ملغي", "Cancelled")}
              </option>
              <option
                value="rejected"
                className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]"
              >
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
              <option
                value="all"
                className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]"
              >
                {t("طرق الدفع (الكل)", "All Payment Methods")}
              </option>
              <option
                value="mada"
                className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]"
              >
                {t("مدى", "Mada")}
              </option>
              <option
                value="visa"
                className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]"
              >
                VISA / Mastercard
              </option>
              <option
                value="sadad"
                className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]"
              >
                {t("سداد", "Sadad")}
              </option>
              <option
                value="transfer"
                className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]"
              >
                {t("تحويل بنكي", "Bank Transfer")}
              </option>
              <option
                value="settlement"
                className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]"
              >
                {t("تسوية", "Settlement")}
              </option>
            </DashboardSelect>
          </div>
        </div>
      }
    />
  );
}
