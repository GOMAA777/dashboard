"use client";

import React from "react";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";
import { DashboardSelect } from "@/components/shared/DashboardSelect";

interface RolesToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedType: string;
  onTypeChange: (val: string) => void;
  onReset: () => void;
  isEmptyView?: boolean;
  onToggleEmptyView?: () => void;
}

export function RolesToolbar({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  onReset,
}: RolesToolbarProps) {
  const hasActiveFilters = selectedType !== "all" || Boolean(searchQuery);

  const drawerContent = (
    <div className="space-y-6 text-start font-['Cairo',sans-serif]">
      {/* Role Type Filter */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          تصنيف نوع الدور
        </label>
        <DashboardSelect
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
        >
          <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">جميع الأنواع</option>
          <option value="system" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">أدوار النظام الأساسية (المحمية)</option>
          <option value="custom" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">الأدوار المخصصة</option>
        </DashboardSelect>
      </div>

      {/* Scope / Permissions */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          نطاق الصلاحيات
        </label>
        <DashboardSelect>
          <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">كافة نطاقات الصلاحيات</option>
          <option value="full" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">صلاحيات كاملة شاملة</option>
          <option value="partial" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">صلاحيات وظيفية مخصصة</option>
        </DashboardSelect>
      </div>
    </div>
  );

  return (
    <UnifiedFilterBar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="ابحث باسم الدور أو المعرّف البرمجي..."
      primaryFilterValue={selectedType}
      onPrimaryFilterChange={onTypeChange}
      primaryFilterOptions={[
        { label: "جميع الأنواع", value: "all" },
        { label: "أدوار النظام", value: "system" },
        { label: "أدوار مخصصة", value: "custom" },
      ]}
      hasActiveFilters={hasActiveFilters}
      onReset={onReset}
      drawerTitle="تصفية الأدوار والصلاحيات"
      drawerContent={drawerContent}
      className="rounded-b-none border-b-0"
    />
  );
}
