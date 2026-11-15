"use client";

import React from "react";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";
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
      <div className="space-y-1.5">
        <label className="text-[13px] font-bold text-[#1b1c1a] block">
          حالة الاتصال والربط
        </label>
        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value as GatewayFilterStatus)}
          className="w-full h-[40px] bg-[#f5f3ef] text-[#1b1c1a] text-[13px] font-semibold rounded-[4px] px-[12px] border border-transparent focus:outline-none focus:ring-1 focus:ring-[#9c6402] cursor-pointer"
        >
          <option value="all">كل بوابات الدفع ({totalCount})</option>
          <option value="active">البوابات المتصلة والنشطة ({activeCount})</option>
          <option value="disabled">البوابات غير المفعلة ({disabledCount})</option>
        </select>
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
