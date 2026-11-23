"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Eye,
  Pencil,
  Trash2,
  Shield,
  Headphones,
  Calculator,
  Briefcase,
  ShoppingCart,
  Cloud,
  Scale,
  Monitor,
  KeyRound,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Employee, IconType, isEmployeeAdmin } from "../types/staff.types";
import { UnifiedPagination } from "@/components/shared/UnifiedPagination";
import { useLanguage } from "@/lib/i18n";

interface StaffTableProps {
  employees: Employee[];
  onViewDetails: (employee: Employee) => void;
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
  onLoginAsEmployee?: (employee: Employee) => void;
  onDeactivate?: (employee: Employee) => void;
  onActivate?: (employee: Employee) => void;
  onResetPassword?: (employee: Employee) => void;
}

export function StaffTable({
  employees,
  onViewDetails,
  onEdit,
  onDelete,
  onLoginAsEmployee,
  onDeactivate,
  onActivate,
  onResetPassword,
}: StaffTableProps) {
  const { t, direction } = useLanguage();
  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (text: string, key: string, label: string) => {
    if (!text || text === "—") return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast.success(t(`تم نسخ ${label}`, `${label} copied`));
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      toast.error(t("تعذر النسخ", "Copy failed"));
    }
  };

  const totalItems = employees.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePageIndex = Math.min(pageIndex, totalPages - 1);
  const startIndex = safePageIndex * pageSize;
  const paginatedEmployees = employees.slice(startIndex, startIndex + pageSize);

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
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => onViewDetails(emp)}
                              className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] hover:text-[#9c6402] dark:hover:text-[#e29d38] transition-colors text-start leading-[20px]"
                            >
                              {emp.name}
                            </button>
                            {emp.id ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  void handleCopy(
                                    String(emp.id),
                                    `${emp.id}-id`,
                                    t("معرّف الموظف", "Staff ID")
                                  );
                                }}
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#f4efe6] dark:bg-[#271d15] text-[#78644f] dark:text-[#c4b3a3] border border-[#dfd7cc] dark:border-[#423122] shrink-0 hover:border-[#9c6402] dark:hover:border-[#e29d38] transition-colors cursor-pointer"
                                title={t("معرّف الموظف (انقر للنسخ)", "Staff ID (Click to copy)")}
                              >
                                {copiedKey === `${emp.id}-id` ? (
                                  <Check className="size-[10px] text-emerald-600" />
                                ) : (
                                  <Copy className="size-[10px] opacity-70" />
                                )}
                                <span>ID: #{emp.id}</span>
                              </button>
                            ) : null}
                          </div>
                          <span className="text-[11px] text-[#79716b] dark:text-[#a89f91] leading-[16px] mt-0.5">
                            {emp.empCode} • {emp.department}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 text-[13px] text-[#514537] dark:text-[#cdc5bd] font-mono text-center">
                      <div className="inline-flex items-center justify-center gap-1.5 max-w-full">
                        <span dir="ltr" className="truncate">
                          {emp.email}
                        </span>
                        {emp.email ? (
                          <button
                            type="button"
                            onClick={() =>
                              void handleCopy(
                                emp.email,
                                `${emp.id}-email`,
                                t("البريد الإلكتروني", "Email")
                              )
                            }
                            className="shrink-0 p-0.5 rounded-[3px] text-[#837565] hover:text-[#9c6402] dark:text-[#a89f91] dark:hover:text-[#e29d38] transition-colors cursor-pointer"
                            title={t("نسخ البريد", "Copy Email")}
                          >
                            {copiedKey === `${emp.id}-email` ? (
                              <Check className="size-[12px] text-emerald-600" />
                            ) : (
                              <Copy className="size-[12px]" />
                            )}
                          </button>
                        ) : null}
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 text-[13px] text-[#514537] dark:text-[#cdc5bd] font-mono text-center">
                      <div className="inline-flex items-center justify-center gap-1.5 max-w-full">
                        <span dir="ltr" className="truncate">
                          {emp.phone}
                        </span>
                        {emp.phone ? (
                          <button
                            type="button"
                            onClick={() =>
                              void handleCopy(
                                emp.phone,
                                `${emp.id}-phone`,
                                t("رقم الجوال", "Phone")
                              )
                            }
                            className="shrink-0 p-0.5 rounded-[3px] text-[#837565] hover:text-[#9c6402] dark:text-[#a89f91] dark:hover:text-[#e29d38] transition-colors cursor-pointer"
                            title={t("نسخ رقم الجوال", "Copy Phone")}
                          >
                            {copiedKey === `${emp.id}-phone` ? (
                              <Check className="size-[12px] text-emerald-600" />
                            ) : (
                              <Copy className="size-[12px]" />
                            )}
                          </button>
                        ) : null}
                      </div>
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
                          onActivate ? (
                            <button
                              type="button"
                              onClick={() => onActivate(emp)}
                              title={t("انقر لتفعيل حساب الموظف", "Click to activate employee account")}
                              aria-label={t("تفعيل حساب الموظف", "Activate employee account")}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#fff5ea] dark:bg-[rgba(217,119,6,0.18)] text-[#d97706] dark:text-[#fbbf24] border border-[#fed7aa] dark:border-[#d97706]/40 hover:bg-[#fed7aa]/60 dark:hover:bg-[rgba(217,119,6,0.3)] transition-all cursor-pointer hover:scale-[1.04] active:scale-[0.96] shadow-2xs outline-none focus-visible:ring-1 focus-visible:ring-[#d97706]/50"
                            >
                              <span className="size-[6px] rounded-full bg-[#d97706] dark:bg-[#fbbf24]" />
                              <span>{t("موقوف", "Suspended")}</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#fff5ea] dark:bg-[rgba(217,119,6,0.18)] text-[#d97706] dark:text-[#fbbf24] border border-[#fed7aa] dark:border-[#d97706]/40 select-none">
                              <span className="size-[6px] rounded-full bg-[#d97706] dark:bg-[#fbbf24]" />
                              <span>{t("موقوف", "Suspended")}</span>
                            </span>
                          )
                        ) : onDeactivate ? (
                          <button
                            type="button"
                            onClick={() => onDeactivate(emp)}
                            title={t("انقر لإيقاف حساب الموظف", "Click to suspend / deactivate employee account")}
                            aria-label={t("إيقاف حساب الموظف", "Suspend employee account")}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#e8f5e9] dark:bg-[#132c1c] text-[#1b7340] dark:text-[#6ee7b7] border border-[#c8e6c9] dark:border-emerald-500/40 hover:bg-[#c8e6c9]/60 dark:hover:bg-emerald-900/40 transition-all cursor-pointer hover:scale-[1.04] active:scale-[0.96] shadow-2xs outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/50"
                          >
                            <span className="size-[6px] rounded-full bg-[#1b7340] dark:bg-[#10b981]" />
                            <span>{t("نشط", "Active")}</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#e8f5e9] dark:bg-[#132c1c] text-[#1b7340] dark:text-[#6ee7b7] border border-[#c8e6c9] dark:border-emerald-500/40 select-none">
                            <span className="size-[6px] rounded-full bg-[#1b7340] dark:bg-[#10b981]" />
                            <span>{t("نشط", "Active")}</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          aria-label={t("عرض تفاصيل الموظف", "View Employee Details")}
                          title={t("عرض تفاصيل الموظف", "View Employee Details")}
                          onClick={() => onViewDetails(emp)}
                          className="p-[6px] rounded-[4px] border border-transparent hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:text-[#9c6402] dark:hover:text-[#e29d38] transition-colors cursor-pointer outline-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#9c6402]/50 dark:focus-visible:ring-[#e29d38]/40"
                        >
                          <Eye className="size-[16px]" />
                        </button>
                        {onEdit && (
                          <button
                            type="button"
                            aria-label={t("تعديل بيانات الموظف", "Edit Employee")}
                            title={t("تعديل بيانات الموظف", "Edit Employee")}
                            onClick={() => onEdit(emp)}
                            className="p-[6px] rounded-[4px] border border-transparent hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:text-[#9c6402] dark:hover:text-[#e29d38] transition-colors cursor-pointer outline-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#9c6402]/50 dark:focus-visible:ring-[#e29d38]/40"
                          >
                            <Pencil className="size-[16px]" />
                          </button>
                        )}
                        {onResetPassword && (
                          <button
                            type="button"
                            aria-label={t("تغيير كلمة المرور", "Change Password")}
                            title={t("تغيير كلمة المرور", "Change Password")}
                            onClick={() => onResetPassword(emp)}
                            className="p-[6px] rounded-[4px] border border-transparent hover:bg-[#fff9ee] dark:hover:bg-[#342711] text-[#9c6402] dark:text-[#e29d38] transition-colors cursor-pointer outline-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#9c6402]/50 dark:focus-visible:ring-[#e29d38]/40"
                          >
                            <KeyRound className="size-[16px]" />
                          </button>
                        )}
                        {!isEmployeeAdmin(emp) && onDelete && (
                          <button
                            type="button"
                            aria-label={t("حذف حساب الموظف", "Delete Employee")}
                            title={t("حذف حساب الموظف", "Delete Employee")}
                            onClick={() => onDelete(emp)}
                            className="p-[6px] rounded-[4px] border border-transparent hover:bg-[#fee2e2] dark:hover:bg-[#381a1a] text-[#514537] dark:text-[#cdc5bd] hover:text-[#dc2626] dark:hover:text-[#f87171] transition-colors cursor-pointer outline-none focus:outline-none focus-visible:ring-1 focus-visible:ring-red-500/40"
                          >
                            <Trash2 className="size-[16px]" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <UnifiedPagination
        pageIndex={safePageIndex}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPageIndex}
        onPageSizeChange={setPageSize}
        itemLabel={t("موظف", "employees")}
      />
    </div>
  );
}
