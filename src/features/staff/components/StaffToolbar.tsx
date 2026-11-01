"use client";

import React from "react";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { staffRoles } from "../data/initialStaff";
import { useLanguage } from "@/lib/i18n";

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
  const { t } = useLanguage();

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
          {t("الدور والصلاحية", "Role & Permission")}
        </label>
        <DashboardSelect
          value={selectedRole}
          onChange={(e) => onRoleChange(e.target.value)}
        >
          <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
            {t("كافة الأدوار والصلاحيات", "All Roles & Permissions")}
          </option>
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
          {t("حالة الموظف", "Employee Status")}
        </label>
        <DashboardSelect
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
            {t("جميع الحالات", "All Statuses")}
          </option>
          <option value="active" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
            {t("نشط", "Active")}
          </option>
          <option value="suspended" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
            {t("موقوف", "Suspended")}
          </option>
        </DashboardSelect>
      </div>

      {/* Last Login Filter */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          {t("آخر تسجيل دخول", "Last Login")}
        </label>
        <DashboardSelect
          value={selectedLastLogin}
          onChange={(e) => onLastLoginChange(e.target.value)}
        >
          <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
            {t("الكل", "All")}
          </option>
          <option value="today" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
            {t("اليوم", "Today")}
          </option>
          <option value="week" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
            {t("هذا الأسبوع", "This Week")}
          </option>
          <option value="month" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
            {t("هذا الشهر", "This Month")}
          </option>
        </DashboardSelect>
      </div>
    </div>
  );

  return (
    <UnifiedFilterBar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder={t("ابحث بالاسم، البريد الإلكتروني، أو رقم الموظف...", "Search by name, email, or employee ID...")}
      primaryFilterValue={selectedStatus}
      onPrimaryFilterChange={onStatusChange}
      primaryFilterOptions={[
        { label: t("الكل", "All"), value: "all" },
        { label: t("نشط", "Active"), value: "active" },
        { label: t("موقوف", "Suspended"), value: "suspended" },
      ]}
      hasActiveFilters={hasActiveFilters}
      onReset={onResetFilters}
      drawerTitle={t("تصفية طاقم العمل", "Filter Staff")}
      drawerContent={drawerContent}
    />
  );
}