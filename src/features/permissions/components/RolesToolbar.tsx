"use client";

import React from "react";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { useLanguage } from "@/lib/i18n";

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
  const { t } = useLanguage();
  const hasActiveFilters = selectedType !== "all" || Boolean(searchQuery);

  const drawerContent = (
    <div className="space-y-6 text-start font-['Cairo',sans-serif]">
      {/* Role Type Filter */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          {t("تصنيف نوع الدور", "Role Type Classification")}
        </label>
        <DashboardSelect
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
        >
          <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
            {t("جميع الأنواع", "All Types")}
          </option>
          <option value="system" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
            {t("أدوار النظام الأساسية (المحمية)", "Core System Roles (Protected)")}
          </option>
          <option value="custom" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
            {t("الأدوار المخصصة", "Custom Roles")}
          </option>
        </DashboardSelect>
      </div>

      {/* Scope / Permissions */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          {t("نطاق الصلاحيات", "Permissions Scope")}
        </label>
        <DashboardSelect>
          <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
            {t("كافة نطاقات الصلاحيات", "All Permission Scopes")}
          </option>
          <option value="full" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
            {t("صلاحيات كاملة شاملة", "Full Comprehensive Access")}
          </option>
          <option value="partial" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
            {t("صلاحيات وظيفية مخصصة", "Custom Functional Scope")}
          </option>
        </DashboardSelect>
      </div>
    </div>
  );

  return (
    <UnifiedFilterBar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder={t("ابحث باسم الدور أو المعرّف البرمجي...", "Search by role name or slug...")}
      primaryFilterValue={selectedType}
      onPrimaryFilterChange={onTypeChange}
      primaryFilterOptions={[
        { label: t("جميع الأنواع", "All Types"), value: "all" },
        { label: t("أدوار النظام", "System Roles"), value: "system" },
        { label: t("أدوار مخصصة", "Custom Roles"), value: "custom" },
      ]}
      hasActiveFilters={hasActiveFilters}
      onReset={onReset}
      drawerTitle={t("تصفية الأدوار والصلاحيات", "Filter Roles & Permissions")}
      drawerContent={drawerContent}
      className="rounded-b-none border-b-0"
    />
  );
}