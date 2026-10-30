"use client";

import React from "react";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { GatewayFilterStatus } from "../types/payment-gateways.types";

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
  const hasActiveFilters = filter !== "all" || Boolean(searchQuery);

  const drawerContent = (
    <div className="space-y-4 text-start font-['Cairo',sans-serif]">
      {/* Gateway Status Filter */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          حالة الاتصال والربط
        </label>
        <DashboardSelect
          value={filter}
          onChange={(e) => onFilterChange(e.target.value as GatewayFilterStatus)}
        >
          <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
            كل بوابات الدفع ({totalCount})
          </option>
          <option value="active" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
            البوابات المتصلة والنشطة ({activeCount})
          </option>
          <option value="disabled" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
            البوابات غير المفعلة ({disabledCount})
          </option>
        </DashboardSelect>
      </div>
    </div>
  );

  return (
    <UnifiedFilterBar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="البحث عن بوابة دفع، بروتوكول، أو معرّف..."
      primaryFilterValue={filter}
      onPrimaryFilterChange={(v) => onFilterChange(v as GatewayFilterStatus)}
      primaryFilterOptions={[
        { label: `كل البوابات (${totalCount})`, value: "all" },
        { label: `النشطة (${activeCount})`, value: "active" },
        { label: `المعطلة (${disabledCount})`, value: "disabled" },
      ]}
      hasActiveFilters={hasActiveFilters}
      onReset={() => {
        onSearchChange("");
        onFilterChange("all");
      }}
      drawerTitle="تصفية بوابات الدفع الإلكتروني"
      drawerContent={drawerContent}
    />
  );
}
