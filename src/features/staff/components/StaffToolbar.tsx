"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";
import { staffRoles } from "../data/initialStaff";

interface StaffToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedLastLogin: string;
  onLastLoginChange: (period: string) => void;
  onResetFilters: () => void;
  isEmptyView?: boolean;
  onToggleEmptyView?: () => void;
}

export function StaffToolbar({
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedStatus,
  onStatusChange,
  selectedLastLogin,
  onLastLoginChange,
  onResetFilters,
}: StaffToolbarProps) {
  const hasActiveFilters =
    selectedRole !== "all" ||
    selectedStatus !== "all" ||
    selectedLastLogin !== "all" ||
    Boolean(searchQuery);

  const drawerContent = (
    <div className="space-y-6 text-start font-['Cairo',sans-serif]">
      {/* Role Filter in Drawer */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          الدور والصلاحية
        </label>
        <div className="relative">
          <select
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="w-full h-[42px] appearance-none bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] px-[14px] pe-[36px] border border-[#eae8e4] dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] cursor-pointer"
          >
            <option value="all">كافة الأدوار والصلاحيات</option>
            {staffRoles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <ChevronDown className="size-[15px] text-[#837565] dark:text-[#8e8680] absolute end-[12px] top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          حالة الموظف
        </label>
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full h-[42px] appearance-none bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] px-[14px] pe-[36px] border border-[#eae8e4] dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] cursor-pointer"
          >
            <option value="all">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="suspended">موقوف</option>
          </select>
          <ChevronDown className="size-[15px] text-[#837565] dark:text-[#8e8680] absolute end-[12px] top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Last Login Filter */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          آخر تسجيل دخول
        </label>
        <div className="relative">
          <select
            value={selectedLastLogin}
            onChange={(e) => onLastLoginChange(e.target.value)}
            className="w-full h-[42px] appearance-none bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] px-[14px] pe-[36px] border border-[#eae8e4] dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] cursor-pointer"
          >
            <option value="all">الكل</option>
            <option value="today">اليوم</option>
            <option value="week">هذا الأسبوع</option>
            <option value="month">هذا الشهر</option>
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
      searchPlaceholder="ابحث بالاسم، البريد الإلكتروني، أو رقم الموظف..."
      primaryFilterValue={selectedStatus}
      onPrimaryFilterChange={onStatusChange}
      primaryFilterOptions={[
        { label: "الكل", value: "all" },
        { label: "نشط", value: "active" },
        { label: "موقوف", value: "suspended" },
      ]}
      hasActiveFilters={hasActiveFilters}
      onReset={onResetFilters}
      drawerTitle="تصفية طاقم العمل"
      drawerContent={drawerContent}
    />
  );
}
