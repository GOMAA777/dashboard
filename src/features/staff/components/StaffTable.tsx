"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Eye,
  Shield,
  Headphones,
  Calculator,
  Briefcase,
  ShoppingCart,
  Cloud,
  Scale,
  Monitor,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
} from "lucide-react";
import { Employee, IconType } from "../types/staff.types";
import { PageSizeDropdown } from "@/components/shared/PageSizeDropdown";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface StaffTableProps {
  employees: Employee[];
  onViewDetails: (employee: Employee) => void;
  onLoginAsEmployee?: (employee: Employee) => void;
  onDeactivate: (employee: Employee) => void;
  onActivate: (employee: Employee) => void;
  onResetPassword: (employee: Employee) => void;
}

export function StaffTable({
  employees,
  onViewDetails,
  onLoginAsEmployee,
  onDeactivate,
  onActivate,
  onResetPassword,
}: StaffTableProps) {
  const { t, isEn, direction } = useLanguage();
  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);

  const totalItems = employees.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePageIndex = Math.min(pageIndex, totalPages - 1);
  const startIndex = safePageIndex * pageSize;
  const paginatedEmployees = employees.slice(startIndex, startIndex + pageSize);
  const startItem = totalItems === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(startIndex + pageSize, totalItems);

  const getRoleIcon = (iconType: IconType) => {
    switch (iconType) {
      case "shield":
        return <Shield className="size-[13px] text-[#9c6402] dark:text-[#e29d38]" />;
      case "headset":
        return <Headphones className="size-[13px] text-[#514537] dark:text-[#cdc5bd]" />;
      case "calculator":
        return <Calculator className="size-[13px] text-[#514537] dark:text-[#cdc5bd]" />;
      case "briefcase":
        return <Briefcase className="size-[13px] text-[#514537] dark:text-[#cdc5bd]" />;
      case "cart":
        return <ShoppingCart className="size-[13px] text-[#514537] dark:text-[#cdc5bd]" />;
      case "cloud":
        return <Cloud className="size-[13px] text-[#514537] dark:text-[#cdc5bd]" />;
      case "scales":
        return <Scale className="size-[13px] text-[#514537] dark:text-[#cdc5bd]" />;
      case "monitor":
        return <Monitor className="size-[13px] text-[#514537] dark:text-[#cdc5bd]" />;
      default:
        return <Shield className="size-[13px] text-[#514537] dark:text-[#cdc5bd]" />;
    }
  };

  return (
    <div
      dir={direction}
      className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#f0eeea] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden font-['Cairo',sans-serif] w-full shrink-0"
      data-node-id="1:8992"
    >
      <div className="overflow-x-auto overflow-y-hidden">
        <table className="w-full text-start border-collapse">
          {/* Table Header */}
          <thead>
            <tr
              className="bg-[#f5f3ef] dark:bg-[#281c15] border-b border-[#eae8e4] dark:border-[#38271c] text-[12px] leading-[18px] font-semibold text-[#514537] dark:text-[#cdc5bd] h-[52px]"
              data-node-id="1:8995"
            >
              <th className="py-3 px-4 font-semibold min-w-[240px] text-start whitespace-nowrap">
                {t("اسم الموظف والمعرف", "Employee Name & ID")}
              </th>
              <th className="py-3 px-4 font-semibold min-w-[190px] text-center whitespace-nowrap">
                {t("البريد الإلكتروني المهني", "Work Email")}
              </th>
              <th className="py-3 px-4 font-semibold min-w-[140px] text-center whitespace-nowrap">
                {t("رقم الجوال", "Phone Number")}
              </th>
              <th className="py-3 px-4 font-semibold min-w-[170px] text-center whitespace-nowrap">
                {t("الدور والصلاحية", "Role & Permission")}
              </th>
              <th className="py-3 px-4 font-semibold min-w-[110px] text-center whitespace-nowrap">
                {t("حالة الحساب", "Status")}
              </th>
              <th className="py-3 px-4 font-semibold text-center whitespace-nowrap w-[100px]">
                {t("الإجراءات", "Actions")}
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#f0eeea] dark:divide-[#38271c]" data-node-id="1:9010">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#79716b] dark:text-[#8e8680]">
                  {t("لا توجد نتائج مطابقة لخيارات البحث المحددة.", "No matching results found for search filters.")}
                </td>
              </tr>
            ) : (
              paginatedEmployees.map((emp) => {
                const isSuspended = emp.status === "suspended";

                return (
                  <tr
                    key={emp.id}
                    className="hover:bg-[#fbf9f5] dark:hover:bg-[#281c15]/60 transition-colors group"
                  >
                    {/* Name & ID */}
                    <td className="py-3.5 px-4 text-start">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div
                          className={`size-[38px] rounded-full flex items-center justify-center font-bold text-[13px] shrink-0 overflow-hidden border border-transparent dark:border-[#423122] ${emp.avatarBg} ${emp.avatarText}`}
                        >
                          {emp.avatarImage ? (
                            <Image
                              src={emp.avatarImage}
                              alt={emp.name}
                              width={38}
                              height={38}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            emp.initials
                          )}
                        </div>

                        {/* Name & Code */}
                        <div className="flex flex-col text-start">
                          <button
                            type="button"
                            onClick={() => onViewDetails(emp)}
                            className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] hover:text-[#9c6402] dark:hover:text-[#e29d38] transition-colors text-start leading-[20px]"
                          >
                            {emp.name}
                          </button>
                          <span className="text-[11px] text-[#79716b] dark:text-[#a89f91] leading-[16px] mt-0.5">
                            {emp.empCode} • {emp.department}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 text-[13px] text-[#514537] dark:text-[#cdc5bd] font-mono text-center">
                      <span dir="ltr">{emp.email}</span>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 text-[13px] text-[#514537] dark:text-[#cdc5bd] font-mono text-center">
                      <span dir="ltr">{emp.phone}</span>
                    </td>

                    {/* Role Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[12px] font-semibold border ${emp.role.badgeClass}`}
                        >
                          {getRoleIcon(emp.role.iconType)}
                          <span>{emp.role.name}</span>
                        </span>
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex justify-center">
                        {isSuspended ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#fff5ea] dark:bg-[rgba(217,119,6,0.18)] text-[#d97706] dark:text-[#fbbf24] border border-[#fed7aa] dark:border-[#d97706]/40">
                            <span className="size-[6px] rounded-full bg-[#d97706] dark:bg-[#fbbf24]" />
                            {t("موقوف", "Suspended")}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#e8f5e9] dark:bg-[#132c1c] text-[#1b7340] dark:text-[#6ee7b7] border border-[#c8e6c9] dark:border-emerald-500/40">
                            <span className="size-[6px] rounded-full bg-[#1b7340] dark:bg-[#10b981]" />
                            {t("نشط", "Active")}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions — Eye icon only */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          aria-label={t("عرض تفاصيل الموظف", "View Employee Details")}
                          title={t("عرض تفاصيل الموظف", "View Employee Details")}
                          onClick={() => onViewDetails(emp)}
                          className="p-[6px] rounded-[4px] border border-transparent hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:text-[#9c6402] dark:hover:text-[#e29d38] transition-colors cursor-pointer outline-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#9c6402]/50 dark:focus-visible:ring-[#e29d38]/40"
                        >
                          <Eye className="size-[16px]" />
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
      <div className="bg-[#fcfaf7] dark:bg-[#1a120d] p-[16px] border-t border-[#f0eeea] dark:border-[#38271c] flex flex-col sm:flex-row items-center justify-between gap-[12px] text-[12px] text-[#514537] dark:text-[#cdc5bd] font-['Cairo']">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <span>{t("عرض ", "Showing ")}</span>
            <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{startItem}</span>
            <span>{t(" إلى ", " to ")}</span>
            <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{endItem}</span>
            <span>{t(" من أصل ", " of ")}</span>
            <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{totalItems}</span>
            <span>{t(" موظف", " employees")}</span>
          </div>

          <div className="flex items-center gap-2 border-s border-[#eae8e4] dark:border-[#38271c] ps-3">
            <span className="text-[11px] text-[#837565] dark:text-[#8e8680]">{t("صفوف بالصفحة:", "Rows per page:")}</span>
            <PageSizeDropdown
              value={pageSize}
              onChange={(newSize) => {
                setPageSize(newSize);
                setPageIndex(0);
              }}
              options={[5, 10, 20, 50]}
              dropdownPlacement="top"
            />
          </div>
        </div>

        {/* Page Controls */}
        <div className="flex items-center gap-[4px]">
          <button
            type="button"
            disabled={safePageIndex === 0 || totalItems === 0}
            onClick={() => setPageIndex(0)}
            title={t("الصفحة الأولى", "First Page")}
            className="size-[30px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronsRight className={cn("size-[14px]", isEn && "rotate-180")} />
          </button>

          <button
            type="button"
            disabled={safePageIndex === 0 || totalItems === 0}
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            title={t("الصفحة السابقة", "Previous Page")}
            className="px-[10px] py-[6px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-[4px] transition-colors cursor-pointer"
          >
            <ChevronRight className={cn("size-[13px]", isEn && "rotate-180")} />
            <span>{t("السابق", "Prev")}</span>
          </button>

          <div className="flex items-center gap-[4px] px-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              const isCurrent = i === safePageIndex;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPageIndex(i)}
                  className={`size-[30px] rounded-[4px] text-[12px] font-semibold transition-colors cursor-pointer flex items-center justify-center ${
                    isCurrent
                      ? "bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] font-bold shadow-sm"
                      : "border border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15]"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={safePageIndex >= totalPages - 1 || totalItems === 0}
            onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
            title={t("الصفحة التالية", "Next Page")}
            className="px-[10px] py-[6px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#1b1c1a] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-[4px] transition-colors cursor-pointer"
          >
            <span>{t("التالي", "Next")}</span>
            <ChevronLeft className={cn("size-[13px]", isEn && "rotate-180")} />
          </button>

          <button
            type="button"
            disabled={safePageIndex >= totalPages - 1 || totalItems === 0}
            onClick={() => setPageIndex(totalPages - 1)}
            title={t("الصفحة الأخيرة", "Last Page")}
            className="size-[30px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronsLeft className={cn("size-[14px]", isEn && "rotate-180")} />
          </button>
        </div>
      </div>
    </div>
  );
}
