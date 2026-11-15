"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Building2,
  Briefcase,
  Scale,
  Shield,
  FileCheck,
  FolderKanban,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { TicketDepartment, DepartmentFilterStatus } from "../types/tickets.types";
import { PageSizeDropdown } from "@/components/shared/PageSizeDropdown";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface DepartmentsSectionProps {
  departments: TicketDepartment[];
  onOpenAddModal: () => void;
  onOpenDeleteModal: (dept: TicketDepartment) => void;
  onEditDept?: (dept: TicketDepartment) => void;
}

export function DepartmentsSection({
  departments,
  onOpenAddModal,
  onOpenDeleteModal,
  onEditDept,
}: DepartmentsSectionProps) {
  const { t, isEn } = useLanguage();
  const [filter, setFilter] = useState<DepartmentFilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "name" | "code">("newest");
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageIndex, setPageIndex] = useState<number>(0);

  const totalCount = departments.length;
  const activeCount = useMemo(
    () => departments.filter((d) => d.status === "active").length,
    [departments]
  );
  const inactiveCount = useMemo(
    () => departments.filter((d) => d.status === "inactive").length,
    [departments]
  );

  const filteredDepartments = useMemo(() => {
    const list = departments.filter((dept) => {
      if (filter === "active" && dept.status !== "active") return false;
      if (filter === "inactive" && dept.status !== "inactive") return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          dept.name.toLowerCase().includes(q) ||
          dept.code.toLowerCase().includes(q) ||
          dept.description.toLowerCase().includes(q)
        );
      }

      return true;
    });

    return list.sort((a, b) => {
      if (sortOrder === "name") return a.name.localeCompare(b.name, "ar");
      if (sortOrder === "code") return a.code.localeCompare(b.code);
      if (sortOrder === "oldest") return (Number(a.id) || 0) - (Number(b.id) || 0);
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    });
  }, [departments, filter, searchQuery, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredDepartments.length / pageSize));
  const safePageIndex = Math.min(pageIndex, Math.max(0, totalPages - 1));
  const pagedDepartments = filteredDepartments.slice(
    safePageIndex * pageSize,
    (safePageIndex + 1) * pageSize
  );
  const startItem = filteredDepartments.length === 0 ? 0 : safePageIndex * pageSize + 1;
  const endItem = Math.min((safePageIndex + 1) * pageSize, filteredDepartments.length);

  const getDepartmentIcon = (code: string) => {
    switch (code) {
      case "DEP-01":
        return <Briefcase className="size-[16px] text-[#514537]" />;
      case "DEP-02":
        return <Building2 className="size-[16px] text-[#514537]" />;
      case "DEP-03":
        return <Shield className="size-[16px] text-[#514537]" />;
      case "DEP-04":
        return <Scale className="size-[16px] text-[#514537]" />;
      case "DEP-05":
        return <FileCheck className="size-[16px] text-[#514537]" />;
      case "DEP-06":
      default:
        return <FolderKanban className="size-[16px] text-[#514537]" />;
    }
  };

  return (
    <div
      className="flex flex-col gap-[20px] w-full"
      data-node-id="1:16259"
      data-name="الأقسام"
    >
      {/* Main Identity & Command Banner */}
      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] p-[24px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 dark:border-[#38271c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px]"
        data-node-id="1:16262"
      >
        <div className="flex flex-col gap-[4px] text-start">
          <h1 className="text-[#1b1c1a] dark:text-[#fdfbf7] font-bold text-[24px] sm:text-[28px] leading-[38px]">
            {t("الأقسام", "Departments")}
          </h1>
          <p className="text-[#514537] dark:text-[#cdc5bd] text-[13px] sm:text-[14px] leading-[22px]">
            {t(
              "إدارة الهيكل التنظيمي وأقسام الترافع والخدمات القانونية بالمنصة",
              "Manage organizational structure and platform legal services departments"
            )}
          </p>
        </div>

        {/* Action Button: Add Department */}
        <button
          type="button"
          onClick={onOpenAddModal}
          className="bg-[#9c6402] hover:bg-[#855402] text-white flex items-center gap-[8px] px-[20px] py-[10px] rounded-[4px] font-semibold text-[14px] leading-[20px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-all shrink-0 cursor-pointer"
          data-node-id="1:16265"
        >
          <Plus className="size-[16px]" />
          <span>{t("إضافة قسم", "Add Department")}</span>
        </button>
      </div>

      {/* Departments Data Table & Filter Card */}
      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 dark:border-[#38271c] overflow-hidden w-full font-['Cairo',sans-serif]"
        data-node-id="1:16277"
      >
        {/* Unified Filter Bar with Pills + Comprehensive Drawer */}
        <UnifiedFilterBar
          searchQuery={searchQuery}
          onSearchChange={(val) => {
            setSearchQuery(val);
            setPageIndex(0);
          }}
          searchPlaceholder={t(
            "البحث باسم القسم أو الرقم التعريفي...",
            "Search by department name or ID..."
          )}
          primaryFilterValue={filter}
          onPrimaryFilterChange={(val) => {
            setFilter(val as DepartmentFilterStatus);
            setPageIndex(0);
          }}
          primaryFilterMode="pills"
          primaryFilterOptions={[
            { label: `${t("الكل", "All")} (${totalCount})`, value: "all" },
            { label: `${t("نشط", "Active")} (${activeCount})`, value: "active" },
            { label: `${t("غير نشط", "Inactive")} (${inactiveCount})`, value: "inactive" },
          ]}
          hasActiveFilters={
            filter !== "all" ||
            sortOrder !== "newest" ||
            Boolean(searchQuery)
          }
          onReset={() => {
            setSearchQuery("");
            setFilter("all");
            setSortOrder("newest");
            setPageIndex(0);
          }}
          drawerTitle={t("تصفية شاملة للأقسام", "Comprehensive Department Filters")}
          drawerDescription={t(
            "خيارات تصفية وفلترة متقدمة للوصول الدقيق لبيانات الأقسام",
            "Advanced filter options for precise department queries"
          )}
          drawerContent={
            <div className="space-y-6 text-start font-['Cairo',sans-serif]">
              {/* 1. Status Filter */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                  {t("حالة القسم", "Department Status")}
                </label>
                <DashboardSelect
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value as DepartmentFilterStatus);
                    setPageIndex(0);
                  }}
                >
                  <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t(`كافة الحالات (${totalCount})`, `All Statuses (${totalCount})`)}
                  </option>
                  <option value="active" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t(`الأقسام النشطة فقط (${activeCount})`, `Active Departments Only (${activeCount})`)}
                  </option>
                  <option value="inactive" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t(`الأقسام غير النشطة فقط (${inactiveCount})`, `Inactive Departments Only (${inactiveCount})`)}
                  </option>
                </DashboardSelect>
              </div>

              {/* 2. Sort Order */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                  {t("ترتيب النتائج", "Sort Order")}
                </label>
                <DashboardSelect
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value as "newest" | "oldest" | "name" | "code");
                    setPageIndex(0);
                  }}
                >
                  <option value="newest" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("الأحدث إضافة أولاً", "Newest first")}
                  </option>
                  <option value="oldest" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("الأقدم إضافة أولاً", "Oldest first")}
                  </option>
                  <option value="name" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("أبجدياً حسب اسم القسم (أ-ي)", "Alphabetical by name (A-Z)")}
                  </option>
                  <option value="code" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("حسب الرمز التعريفي", "By Department Code")}
                  </option>
                </DashboardSelect>
              </div>
            </div>
          }
          className="rounded-b-none border-b-0"
        />

        {/* Departments Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-start">
            <thead>
              <tr className="bg-[#f0eeea] dark:bg-[#281c15] h-[56px] border-b border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] text-[12px] font-bold tracking-[0.6px] uppercase">
                <th className="px-[24px] py-[14px] font-bold text-start whitespace-nowrap w-[160px]">
                  {t("الرقم التعريفي", "Department Code")}
                </th>
                <th className="px-[24px] py-[14px] font-bold text-start whitespace-nowrap min-w-[320px]">
                  {t("اسم القسم", "Department Name")}
                </th>
                <th className="px-[24px] py-[14px] font-bold text-center whitespace-nowrap w-[170px]">
                  {t("الحالة", "Status")}
                </th>
                <th className="px-[24px] py-[14px] font-bold text-center whitespace-nowrap w-[120px]">
                  {t("الإجراءات", "Actions")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#eae8e4]/60 dark:divide-[#38271c]">
              {pagedDepartments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-[#837565] dark:text-[#cdc5bd] text-[13px]">
                    {t("لا توجد أقسام مطابقة لمعايير البحث والفلترة", "No departments match search and filter criteria")}
                  </td>
                </tr>
              ) : (
                pagedDepartments.map((dept, idx) => {
                  const isEven = idx % 2 === 1;

                  return (
                    <tr
                      key={dept.id}
                      className={`transition-colors hover:bg-[#faf9f6] dark:hover:bg-[#2c221c]/60 ${
                        isEven ? "bg-[rgba(245,243,239,0.3)] dark:bg-[#1a120d]" : "bg-white dark:bg-[#221812]"
                      }`}
                    >
                      {/* Column 1: Code */}
                      <td className="px-[24px] py-[20px] whitespace-nowrap">
                        <span className="bg-[#f0eeea] dark:bg-[#2d1f16] text-[#61564f] dark:text-[#cdc5bd] font-bold text-[12px] px-[8px] py-[3px] rounded-[4px] font-mono">
                          {dept.code}
                        </span>
                      </td>

                      {/* Column 2: Department Name & Details */}
                      <td className="px-[24px] py-[20px]">
                        <div className="flex items-center gap-[12px] text-start">
                          <div className="bg-[#f0eeea] dark:bg-[#2d1f16] size-[36px] rounded-[4px] flex items-center justify-center shrink-0">
                            {getDepartmentIcon(dept.code)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-[14px] leading-[22px]">
                              {dept.name}
                            </span>
                            <span className="text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[18px]">
                              {dept.description}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Column 3: Status */}
                      <td className="px-[24px] py-[20px] text-center whitespace-nowrap">
                        <div className="flex justify-center">
                          {dept.status === "active" ? (
                            <div className="bg-[#ecfdf5] border border-emerald-200 dark:bg-[#132c1c] dark:border-emerald-500/40 dark:shadow-[0_0_10px_rgba(16,185,129,0.15)] flex items-center gap-1.5 px-2.5 py-1 rounded-full">
                              <div className="size-[7px] rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981] ring-1 ring-emerald-400/60 shrink-0" />
                              <span className="font-bold text-[#065f46] dark:text-[#6ee7b7] text-[11px] leading-[14px]">
                                {t("نشط", "Active")}
                              </span>
                            </div>
                          ) : (
                            <div className="bg-[#f5f3ef] border border-[#eae8e4] dark:bg-[#281c15] dark:border-[#4d3627] flex items-center gap-1.5 px-2.5 py-1 rounded-full">
                              <div className="size-[7px] rounded-full bg-[#837565] shrink-0" />
                              <span className="font-bold text-[#666261] dark:text-[#cdc5bd] text-[11px] leading-[14px]">
                                {t("غير نشط", "Inactive")}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Column 4: Actions */}
                      <td className="px-[24px] py-[20px] text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-[6px]">
                          <button
                            type="button"
                            onClick={() => onEditDept && onEditDept(dept)}
                            title={t("تعديل القسم", "Edit Department")}
                            className="size-[28px] rounded-[4px] hover:bg-[#f0eeea] dark:hover:bg-[#2c221c] flex items-center justify-center text-[#514537] dark:text-[#cdc5bd] hover:text-[#9c6402] dark:hover:text-[#ffddb6] transition-colors cursor-pointer"
                          >
                            <Pencil className="size-[14px]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenDeleteModal(dept)}
                            title={t("حذف القسم", "Delete Department")}
                            className="size-[28px] rounded-[4px] hover:bg-[#ffdad6]/60 dark:hover:bg-[#381616] flex items-center justify-center text-[#514537] dark:text-[#cdc5bd] hover:text-[#ba1a1a] dark:hover:text-[#f87171] transition-colors cursor-pointer"
                          >
                            <Trash2 className="size-[14px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-white dark:bg-[#221812] flex flex-col sm:flex-row items-center justify-between p-[16px] border-t border-[#eae8e4] dark:border-[#38271c] gap-[12px]">
          <div className="flex items-center gap-[12px] order-1 sm:order-2">
            <div className="text-[12px] text-[#514537] dark:text-[#cdc5bd]">
              {t(
                `عرض ${startItem} إلى ${endItem} من أصل ${filteredDepartments.length} قسم`,
                `Showing ${startItem} to ${endItem} of ${filteredDepartments.length} departments`
              )}
            </div>

            <div className="flex items-center gap-2 border-s border-[#eae8e4] dark:border-[#38271c] ps-3">
              <span className="text-[11px] text-[#837565]">{t("صفوف بالصفحة:", "Rows per page:")}</span>
              <PageSizeDropdown
                value={pageSize}
                onChange={(newSize) => {
                  setPageSize(newSize);
                  setPageIndex(0);
                }}
                options={[5, 10, 20, 50]}
              />
            </div>
          </div>

          <div className="flex items-center gap-[6px] order-2 sm:order-1">
            {/* First Page */}
            <button
              type="button"
              disabled={safePageIndex === 0}
              onClick={() => setPageIndex(0)}
              title={t("الصفحة الأولى", "First page")}
              className="size-[32px] rounded-[4px] border border-[#eae8e4] text-[#837565] hover:bg-[#eae8e4] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronsRight className={cn("size-[14px]", isEn && "rotate-180")} />
            </button>

            {/* Previous Page */}
            <button
              type="button"
              disabled={safePageIndex === 0}
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              className="bg-[#f5f3ef] flex items-center gap-[4px] px-[12px] py-[6px] rounded-[4px] text-[12px] font-semibold text-[#837565] hover:text-[#1b1c1a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight className={cn("size-[12px]", isEn && "rotate-180")} />
              <span>{t("السابق", "Previous")}</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i).map((p) => {
              if (totalPages > 5 && Math.abs(p - safePageIndex) > 2 && p !== 0 && p !== totalPages - 1) {
                if (p === 1 || p === totalPages - 2) {
                  return (
                    <span key={p} className="text-[#837565] px-[4px] text-[12px]">
                      ...
                    </span>
                  );
                }
                return null;
              }
              const isActive = safePageIndex === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPageIndex(p)}
                  className={`size-[32px] rounded-[4px] font-bold text-[12px] flex items-center justify-center transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#9c6402] text-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                      : "bg-[#f5f3ef] text-[#1b1c1a] hover:bg-[#eae8e4]"
                  }`}
                >
                  {p + 1}
                </button>
              );
            })}

            {/* Next Page */}
            <button
              type="button"
              disabled={safePageIndex >= totalPages - 1}
              onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
              className="bg-[#f5f3ef] flex items-center gap-[4px] px-[12px] py-[6px] rounded-[4px] text-[12px] font-semibold text-[#1b1c1a] hover:bg-[#eae8e4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <span>{t("التالي", "Next")}</span>
              <ChevronLeft className={cn("size-[12px]", isEn && "rotate-180")} />
            </button>

            {/* Last Page */}
            <button
              type="button"
              disabled={safePageIndex >= totalPages - 1}
              onClick={() => setPageIndex(totalPages - 1)}
              title={t("الصفحة الأخيرة", "Last page")}
              className="size-[32px] rounded-[4px] border border-[#eae8e4] text-[#837565] hover:bg-[#eae8e4] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronsLeft className={cn("size-[14px]", isEn && "rotate-180")} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}