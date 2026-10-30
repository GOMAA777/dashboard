"use client";

import React from "react";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";

interface RolesToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedType: string;
  onTypeChange: (val: string) => void;
  onReset: () => void;
  isEmptyView: boolean;
  onToggleEmptyView: () => void;
}

export function RolesToolbar({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  onReset,
  isEmptyView,
  onToggleEmptyView,
}: RolesToolbarProps) {
  const hasActiveFilters = selectedType !== "all" || Boolean(searchQuery);

  const drawerContent = (
    <div className="space-y-4 text-start font-['Cairo',sans-serif]">
      {/* Role Type Filter */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          تصنيف نوع الدور
        </label>
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] px-[12px] border border-transparent dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] cursor-pointer"
        >
          <option value="all">جميع الأنواع</option>
          <option value="system">أدوار النظام الأساسية (المحمية)</option>
          <option value="custom">الأدوار المخصصة</option>
        </select>
      </div>

      {/* Scope / Permissions */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          نطاق الصلاحيات
        </label>
        <select
          className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] px-[12px] border border-transparent dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] cursor-pointer"
        >
          <option value="all">كافة نطاقات الصلاحيات</option>
          <option value="full">صلاحيات كاملة شاملة</option>
          <option value="partial">صلاحيات وظيفية مخصصة</option>
        </select>
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
        { label: "أدوار النظام الأساسية", value: "system" },
        { label: "أدوار مخصصة", value: "custom" },
      ]}
      hasActiveFilters={hasActiveFilters}
      onReset={onReset}
      drawerTitle="تصفية الأدوار والصلاحيات"
      drawerContent={drawerContent}
      className="rounded-b-none border-b-0"
      actionButton={
        <button
          type="button"
          onClick={onToggleEmptyView}
          className="text-[12px] text-[#79716b] hover:text-[#9c6402] px-2.5 py-1.5 rounded-[4px] border border-dashed border-[#d6cfc7] hover:border-[#9c6402] transition-colors cursor-pointer"
        >
          {isEmptyView ? "العودة للجدول المكتمل" : "معاينة الحالة الفارغة"}
        </button>
      }
    />
  );
}
