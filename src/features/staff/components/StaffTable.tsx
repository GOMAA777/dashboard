"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  LogIn,
  MoreVertical,
  Shield,
  Headphones,
  Calculator,
  Briefcase,
  ShoppingCart,
  Cloud,
  Scale,
  Monitor,
  Eye,
  KeyRound,
  UserX,
  UserCheck,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  Lock,
} from "lucide-react";
import { Employee, IconType } from "../types/staff.types";
import { PageSizeDropdown } from "@/components/shared/PageSizeDropdown";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface StaffTableProps {
  employees: Employee[];
  onViewDetails: (employee: Employee) => void;
  onLoginAsEmployee: (employee: Employee) => void;
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
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
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
      className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden font-['Cairo']"
      data-node-id="1:8992"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-start border-collapse">
          {/* Table Header */}
          <thead>
            <tr
              className="bg-[#fcfaf7] dark:bg-[#1a120d] border-b border-[#e6e2dc] dark:border-[#38271c] text-[13px] font-semibold text-[#514537] dark:text-[#8e8680] h-[52px]"
              data-node-id="1:8995"
            >
              <th className="py-3 px-4 font-bold min-w-[240px] text-start">
                {t("اسم الموظف والمعرف", "Employee Name & ID")}
              </th>
              <th className="py-3 px-4 font-bold min-w-[190px] text-start">
                {t("البريد الإلكتروني المهني", "Work Email")}
              </th>
              <th className="py-3 px-4 font-bold min-w-[140px] text-start">
                {t("رقم الجوال", "Phone Number")}
              </th>
              <th className="py-3 px-4 font-bold min-w-[170px] text-start">
                {t("الدور والصلاحية", "Role & Permission")}
              </th>
              <th className="py-3 px-4 font-bold min-w-[150px] text-start">
                {t("آخر تسجيل دخول", "Last Login")}
              </th>
              <th className="py-3 px-4 font-bold min-w-[110px] text-start">
                {t("حالة الحساب", "Status")}
              </th>
              <th className="py-3 px-4 font-bold text-center w-[100px]">
                {t("الإجراءات", "Actions")}
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#f2efe9] dark:divide-[#38271c]" data-node-id="1:9010">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#79716b] dark:text-[#8e8680]">
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
                          className={`size-[38px] rounded-full flex items-center justify-center font-bold text-[13px] shrink-0 overflow-hidden ${emp.avatarBg} ${emp.avatarText}`}
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
                          <span className="text-[11px] text-[#79716b] dark:text-[#8e8680] leading-[16px] mt-0.5">
                            {emp.empCode} • {emp.department}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 text-[13px] text-[#514537] dark:text-[#cdc5bd] font-mono text-start">
                      {emp.email}
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 text-[13px] text-[#514537] dark:text-[#cdc5bd] font-mono text-start" dir="ltr">
                      {emp.phone}
                    </td>

                    {/* Role Badge */}
                    <td className="py-3.5 px-4 text-start">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[12px] font-semibold border ${emp.role.badgeClass}`}
                      >
                        {getRoleIcon(emp.role.iconType)}
                        <span>{emp.role.name}</span>
                      </span>
                    </td>

                    {/* Last Login */}
                    <td className="py-3.5 px-4 text-start">
                      {emp.lastLogin.note ? (
                        <div className="flex flex-col text-[12px] text-start">
                          <span className="font-medium text-[#79716b] dark:text-[#8e8680]">
                            {emp.lastLogin.time}
                          </span>
                          <span className="text-[11px] text-[#d97706] dark:text-[#fbbf24] mt-0.5">
                            {emp.lastLogin.note}
                          </span>
                        </div>
                      ) : emp.lastLogin.ip ? (
                        <div className="flex flex-col text-[12px] text-start">
                          <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {emp.lastLogin.time}
                          </span>
                          <span className="text-[11px] text-[#79716b] dark:text-[#8e8680] font-mono mt-0.5">
                            IP: {emp.lastLogin.ip}
                          </span>
                          {emp.lastLogin.location && (
                            <span className="text-[11px] text-[#9c6402] dark:text-[#e29d38]">
                              ({emp.lastLogin.location})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-block text-[11px] text-[#79716b] dark:text-[#8e8680] bg-[#f5f3ef] dark:bg-[#281c15] px-2 py-0.5 rounded-[4px]">
                          {emp.lastLogin.time}
                        </span>
                      )}
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-4 text-start">
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
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 relative">
                        {/* Simulation / Login as employee Button */}
                        <button
                          type="button"
                          onClick={() => onLoginAsEmployee(emp)}
                          title={
                            isSuspended
                              ? t("محاولة الدخول كموظف (موقوف - سيظهر تنبيه الحوكمة)", "Try login (Suspended - Governance alert will show)")
                              : t("الدخول كالموظف (بدء وضع المعاينة)", "Login as Employee (Start Preview)")
                          }
                          className={`size-[30px] rounded-[4px] flex items-center justify-center transition-colors ${
                            isSuspended
                              ? "bg-[#fff5ea] dark:bg-[rgba(217,119,6,0.18)] text-[#d97706] dark:text-[#fbbf24] hover:bg-[#fed7aa] dark:hover:bg-[rgba(217,119,6,0.3)]"
                              : "bg-[#f5efe6] dark:bg-[#2d1f16] text-[#9c6402] dark:text-[#e29d38] hover:bg-[#eadfcf] dark:hover:bg-[#38271c]"
                          }`}
                        >
                          {isSuspended ? (
                            <Lock className="size-[14px]" />
                          ) : (
                            <LogIn className={cn("size-[14px]", isEn && "rotate-180")} />
                          )}
                        </button>

                        {/* More Menu */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuId(activeMenuId === emp.id ? null : emp.id)
                            }
                            className="size-[30px] rounded-[4px] hover:bg-[#f2efe9] dark:hover:bg-[#281c15] text-[#79716b] dark:text-[#cdc5bd] flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <MoreVertical className="size-[15px]" />
                          </button>

                          {/* Dropdown Menu */}
                          {activeMenuId === emp.id && (
                            <div
                              className="absolute end-0 top-full mt-1 w-[190px] bg-white dark:bg-[#1e1c1a] rounded-[8px] border border-[#e6e2dc] dark:border-[#38271c] shadow-lg py-1 z-20 text-start"
                              onMouseLeave={() => setActiveMenuId(null)}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onViewDetails(emp);
                                }}
                                className="w-full px-3 py-2 text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] flex items-center gap-2 text-start cursor-pointer"
                              >
                                <Eye className="size-[14px] text-[#9c6402] dark:text-[#e29d38]" />
                                <span>{t("عرض تفاصيل الموظف", "View Employee Details")}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onLoginAsEmployee(emp);
                                }}
                                className="w-full px-3 py-2 text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] flex items-center gap-2 text-start cursor-pointer"
                              >
                                <LogIn className="size-[14px] text-[#9c6402] dark:text-[#e29d38]" />
                                <span>{t("الدخول كالموظف", "Login as Employee")}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onResetPassword(emp);
                                }}
                                className="w-full px-3 py-2 text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] flex items-center gap-2 text-start cursor-pointer"
                              >
                                <KeyRound className="size-[14px] text-[#79716b] dark:text-[#8e8680]" />
                                <span>{t("إعادة تعيين كلمة المرور", "Reset Password")}</span>
                              </button>

                              <div className="my-1 border-t border-[#f2efe9] dark:border-[#38271c]" />

                              {isSuspended ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onActivate(emp);
                                  }}
                                  className="w-full px-3 py-2 text-[13px] text-[#1b7340] dark:text-[#6ee7b7] hover:bg-[#e8f5e9] dark:hover:bg-[#132c1c] flex items-center gap-2 text-start cursor-pointer"
                                >
                                  <UserCheck className="size-[14px]" />
                                  <span>{t("تفعيل حساب الموظف", "Activate Account")}</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onDeactivate(emp);
                                  }}
                                  className="w-full px-3 py-2 text-[13px] text-[#b91c1c] dark:text-[#f87171] hover:bg-[#fee2e2] dark:hover:bg-[#311616] flex items-center gap-2 text-start cursor-pointer"
                                >
                                  <UserX className="size-[14px]" />
                                  <span>{t("إيقاف حساب الموظف", "Suspend Account")}</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
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
      <div className="bg-[#fcfaf7] dark:bg-[#1a120d] border-t border-[#e6e2dc] dark:border-[#38271c] px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] font-['Cairo']">
        <div className="flex flex-wrap items-center gap-4 text-[#79716b] dark:text-[#8e8680]">
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
            />
          </div>
        </div>

        {/* Page Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={safePageIndex === 0 || totalItems === 0}
            onClick={() => setPageIndex(0)}
            title={t("الصفحة الأولى", "First Page")}
            className="size-[28px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#f2efe9] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronsRight className={cn("size-[14px]", isEn && "rotate-180")} />
          </button>

          <button
            type="button"
            disabled={safePageIndex === 0 || totalItems === 0}
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            title={t("الصفحة السابقة", "Previous Page")}
            className="px-2.5 py-1 text-[#514537] dark:text-[#cdc5bd] border border-[#eae8e4] dark:border-[#38271c] hover:bg-[#f2efe9] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 rounded-[4px] transition-colors cursor-pointer"
          >
            <ChevronRight className={cn("size-[13px]", isEn && "rotate-180")} />
            <span>{t("السابق", "Prev")}</span>
          </button>

          <div className="flex items-center gap-1 px-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              const isCurrent = i === safePageIndex;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPageIndex(i)}
                  className={`size-[28px] rounded-[4px] text-[12px] font-semibold transition-colors cursor-pointer ${
                    isCurrent
                      ? "bg-[#9c6402] text-white font-bold"
                      : "text-[#514537] dark:text-[#cdc5bd] hover:bg-[#f2efe9] dark:hover:bg-[#281c15]"
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
            className="px-2.5 py-1 text-[#514537] dark:text-[#cdc5bd] border border-[#eae8e4] dark:border-[#38271c] hover:bg-[#f2efe9] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 rounded-[4px] transition-colors cursor-pointer"
          >
            <span>{t("التالي", "Next")}</span>
            <ChevronLeft className={cn("size-[13px]", isEn && "rotate-180")} />
          </button>

          <button
            type="button"
            disabled={safePageIndex >= totalPages - 1 || totalItems === 0}
            onClick={() => setPageIndex(totalPages - 1)}
            title={t("الصفحة الأخيرة", "Last Page")}
            className="size-[28px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#f2efe9] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronsLeft className={cn("size-[14px]", isEn && "rotate-180")} />
          </button>
        </div>
      </div>
    </div>
  );
}