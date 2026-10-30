"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";

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
        <div className="relative">
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full h-[42px] appearance-none bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] px-[14px] pe-[36px] border border-[#eae8e4] dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] cursor-pointer"
          >
            <option value="all">جميع الأنواع</option>
            <option value="system">أدوار النظام الأساسية (المحمية)</option>
            <option value="custom">الأدوار المخصصة</option>
          </select>
          <ChevronDown className="size-[15px] text-[#837565] dark:text-[#8e8680] absolute end-[12px] top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Scope / Permissions */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          نطاق الصلاحيات
        </label>
        <div className="relative">
          <select
            className="w-full h-[42px] appearance-none bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] px-[14px] pe-[36px] border border-[#eae8e4] dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] cursor-pointer"
          >
            <option value="all">كافة نطاقات الصلاحيات</option>
            <option value="full">صلاحيات كاملة شاملة</option>
            <option value="partial">صلاحيات وظيفية مخصصة</option>
          </select>
          <ChevronDown className="size-[15px] text-[#837565] dark:text-[#8e8680] absolute end-[12px] top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
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
