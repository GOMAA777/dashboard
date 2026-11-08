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
  selectedLastLogin?: string;
  onLastLoginChange?: (period: string) => void;
  onResetFilters: () => void;
  isEmptyView?: boolean;
  onToggleEmptyView?: () => void;
  roles?: { id: string; name: string }[];
  statusCounts?: {
    all: number;
    active: number;
    suspended: number;
  };
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
  roles,
  statusCounts,
}: StaffToolbarProps) {
  const { t } = useLanguage();

  const counts = statusCounts ?? { all: 0, active: 0, suspended: 0 };

  const hasActiveFilters =
    selectedRole !== "all" ||
    selectedStatus !== "all" ||
    (selectedLastLogin && selectedLastLogin !== "all") ||
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
          {(roles && roles.length > 0 ? roles : staffRoles).map((r) => (
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
    </div>
  );

  return (
    <UnifiedFilterBar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder={t(
        "ابحث بالاسم، البريد الإلكتروني، أو رقم الموظف...",
        "Search by name, email, or employee ID..."
      )}
      primaryFilterValue={selectedStatus}
      onPrimaryFilterChange={onStatusChange}
      primaryFilterMode="pills"
      primaryFilterOptions={[
        { label: `${t("الكل", "All")} (${counts.all})`, value: "all" },
        { label: `${t("النشطة", "Active")} (${counts.active})`, value: "active" },
        {
          label: `${t("الموقوفة", "Suspended")} (${counts.suspended})`,
          value: "suspended",
        },
      ]}
      hasActiveFilters={hasActiveFilters}
      onReset={onResetFilters}
      drawerTitle={t("تصفية طاقم العمل", "Filter Staff")}
      drawerDescription={t(
        "خيارات تصفية متقدمة للوصول الدقيق لبيانات الموظفين",
        "Advanced filter options for precise staff queries"
      )}
      drawerContent={drawerContent}
    />
  );
}