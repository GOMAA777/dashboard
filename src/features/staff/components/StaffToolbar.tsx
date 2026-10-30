"use client";

import React from "react";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
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
        <DashboardSelect
          value={selectedRole}
          onChange={(e) => onRoleChange(e.target.value)}
        >
          <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">كافة الأدوار والصلاحيات</option>
          {staffRoles.map((r) => (
            <option key={r.id} value={r.id} className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
              {r.name}
            </option>
          ))}
        </DashboardSelect>
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          حالة الموظف
        </label>
        <DashboardSelect
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">جميع الحالات</option>
          <option value="active" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">نشط</option>
          <option value="suspended" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">موقوف</option>
        </DashboardSelect>
      </div>

      {/* Last Login Filter */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          آخر تسجيل دخول
        </label>
        <DashboardSelect
          value={selectedLastLogin}
          onChange={(e) => onLastLoginChange(e.target.value)}
        >
          <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">الكل</option>
          <option value="today" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">اليوم</option>
          <option value="week" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">هذا الأسبوع</option>
          <option value="month" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">هذا الشهر</option>
        </DashboardSelect>
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
