"use client";

import React from "react";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { GatewayFilterStatus } from "../types/payment-gateways.types";
import { useLanguage } from "@/lib/i18n";

interface GatewaysFilterBarProps {
  filter: GatewayFilterStatus;
  onFilterChange: (status: GatewayFilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
  activeCount: number;
  disabledCount: number;
}

export function GatewaysFilterBar({
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  totalCount,
  activeCount,
  disabledCount,
}: GatewaysFilterBarProps) {
  const { t } = useLanguage();
  const hasActiveFilters = filter !== "all" || Boolean(searchQuery);

  const drawerContent = (
    <div className="space-y-4 text-start font-sans">
      {/* Gateway Status Filter */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          {t("حالة الاتصال والربط", "Connection Status")}
        </label>
        <DashboardSelect
          value={filter}
          onChange={(e) => onFilterChange(e.target.value as GatewayFilterStatus)}
        >
          <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
            {t(`كل بوابات الدفع (${totalCount})`, `All Payment Gateways (${totalCount})`)}
          </option>
          <option value="active" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
            {t(`البوابات المتصلة والنشطة (${activeCount})`, `Active Gateways (${activeCount})`)}
          </option>
          <option value="disabled" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
            {t(`البوابات غير المفعلة (${disabledCount})`, `Disabled Gateways (${disabledCount})`)}
          </option>
        </DashboardSelect>
      </div>
    </div>
  );

  return (
    <UnifiedFilterBar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder={t("البحث عن بوابة دفع، بروتوكول، أو معرّف...", "Search gateway, protocol, or ID...")}
      primaryFilterValue={filter}
      onPrimaryFilterChange={(v) => onFilterChange(v as GatewayFilterStatus)}
      primaryFilterOptions={[
        { label: t(`كل البوابات (${totalCount})`, `All Gateways (${totalCount})`), value: "all" },
        { label: t(`النشطة (${activeCount})`, `Active (${activeCount})`), value: "active" },
        { label: t(`المعطلة (${disabledCount})`, `Disabled (${disabledCount})`), value: "disabled" },
      ]}
      hasActiveFilters={hasActiveFilters}
      onReset={() => {
        onSearchChange("");
        onFilterChange("all");
      }}
      drawerTitle={t("تصفية بوابات الدفع الإلكتروني", "Filter Payment Gateways")}
      drawerContent={drawerContent}
    />
  );
}