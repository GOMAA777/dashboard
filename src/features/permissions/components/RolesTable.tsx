"use client";

import React, { useState } from "react";
import {
  Shield,
  Headphones,
  Monitor,
  Calculator,
  Briefcase,
  Scale,
  Users,
  Lock,
  Pencil,
  Trash2,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
} from "lucide-react";
import { RoleItem } from "../types/roles.types";
import { PageSizeDropdown } from "@/components/shared/PageSizeDropdown";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface RolesTableProps {
  roles: RoleItem[];
  onEditRole: (role: RoleItem) => void;
  onDeleteRole: (role: RoleItem) => void;
}

export function RolesTable({ roles, onEditRole, onDeleteRole }: RolesTableProps) {
  const { t, isEn, direction } = useLanguage();
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageIndex, setPageIndex] = useState<number>(0);

  const totalPages = Math.max(1, Math.ceil(roles.length / pageSize));
  const safePageIndex = Math.min(pageIndex, totalPages - 1);
  const pagedRoles = roles.slice(
    safePageIndex * pageSize,
    (safePageIndex + 1) * pageSize
  );
  const startItem = roles.length === 0 ? 0 : safePageIndex * pageSize + 1;
  const endItem = Math.min((safePageIndex + 1) * pageSize, roles.length);

  const getRoleIcon = (type: string) => {
    switch (type) {
      case "shield":
        return <Shield className="size-[17px] text-[#9c6402] dark:text-[#e29d38]" />;
      case "headset":
        return <Headphones className="size-[16px] text-[#9c6402] dark:text-[#e29d38]" />;
      case "monitor":
        return <Monitor className="size-[16px] text-[#9c6402] dark:text-[#e29d38]" />;
      case "calculator":
        return <Calculator className="size-[16px] text-[#9c6402] dark:text-[#e29d38]" />;
      case "briefcase":
        return <Briefcase className="size-[16px] text-[#9c6402] dark:text-[#e29d38]" />;
      case "scale":
        return <Scale className="size-[16px] text-[#9c6402] dark:text-[#e29d38]" />;
      default:
        return <Shield className="size-[16px] text-[#9c6402] dark:text-[#e29d38]" />;
    }
  };

  return (
    <div
      dir={direction}
      className="bg-white dark:bg-[#221812] rounded-b-[8px] border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden"
      data-node-id="1:11626"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-start border-collapse">
          {/* Header Row */}
          <thead>
            <tr
              className="bg-[#f0eeea] dark:bg-[#1a120d] border-b border-[#e6e2dc] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] text-[12px] font-bold"
              data-node-id="1:11644"
            >
              <th className="py-3.5 px-4 text-start w-[340px]" data-node-id="1:11645">
                {t("اسم الدور الوظيفي", "Role Name")}
              </th>
              <th className="py-3.5 px-4 text-start w-[180px]" data-node-id="1:11647">
                {t("المعرّف البرمجي (Slug)", "Identifier (Slug)")}
              </th>
              <th className="py-3.5 px-4 text-start w-[190px]" data-node-id="1:11649">
                {t("نطاق الصلاحيات", "Permissions Scope")}
              </th>
              <th className="py-3.5 px-4 text-start w-[160px]" data-node-id="1:11651">
                {t("الموظفون المنسوبون", "Assigned Staff")}
              </th>
              <th className="py-3.5 px-4 text-start w-[130px]" data-node-id="1:11653">
                {t("نوع الدور", "Role Type")}
              </th>
              <th className="py-3.5 px-4 text-center w-[90px]" data-node-id="1:11655">
                {t("الإجراءات", "Actions")}
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#f0eeea] dark:divide-[#38271c]" data-node-id="1:11657">
            {pagedRoles.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-[#837565] dark:text-[#a89f91]">
                  {t("لا توجد أدوار وظيفية", "No roles found")}
                </td>
              </tr>
            ) : (
              pagedRoles.map((role) => (
              <tr
                key={role.id}
                className="hover:bg-[#fbf9f6] dark:hover:bg-[#281c15]/60 transition-colors"
                data-node-id={`row-${role.id}`}
              >
                {/* 1. اسم الدور الوظيفي */}
                <td className="py-4 px-4 text-start">
                  <div className="flex items-center gap-3">
                    {/* Icon container */}
                    <div
                      className="size-[38px] rounded-[6px] flex items-center justify-center shrink-0 bg-[#fbf6ee] dark:bg-[#2d1f16] border border-[#f5e3c8] dark:border-[#4d3627]/60 shadow-2xs"
                    >
                      {getRoleIcon(role.iconType)}
                    </div>

                    <div className="flex flex-col items-start text-start">
                      <div className="flex items-center gap-2">
                        <span className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[26px]">
                          {role.name}
                        </span>
                        {role.hasFullPermissionsBadge && (
                          <span className="bg-[#ffddb6] dark:bg-[rgba(226,157,56,0.18)] text-[#2a1800] dark:text-[#f3c27e] border border-[#f5e3c8] dark:border-[#e29d38]/50 text-[10px] font-bold px-[6px] py-[2px] rounded-[4px] leading-[14px]">
                            {t("صلاحيات كاملة", "Full Access")}
                          </span>
                        )}
                      </div>
                      <span className="text-[12px] font-normal text-[#625d5d] dark:text-[#cdc5bd] leading-[18px]">
                        {role.subtitle}
                      </span>
                    </div>
                  </div>
                </td>

                {/* 2. المعرف البرمجي (Slug) */}
                <td className="py-4 px-4 text-start">
                  <span className="inline-block bg-[#f0eeea] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] border border-[#e2ded7] dark:border-[#38271c] font-mono text-[12px] font-bold tracking-[0.6px] px-[10px] py-[3px] rounded-[4px]">
                    {role.slug}
                  </span>
                </td>

                {/* 3. نطاق الصلاحيات */}
                <td className="py-4 px-4 text-start">
                  <div className="inline-flex items-center gap-1.5 bg-[#f5f3ef] dark:bg-[#281c15] border border-[#eae8e4] dark:border-[#38271c] px-[10px] py-[4px] rounded-[4px]">
                    <div
                      className={`size-[6px] rounded-full shrink-0 ${
                        role.hasFullPermissionsBadge ? "bg-[#9c6402] dark:bg-[#e29d38]" : "bg-[#837565] dark:bg-[#8e8680]"
                      }`}
                    />
                    <span className="text-[11px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {role.permissionsLabel}
                    </span>
                  </div>
                </td>

                {/* 4. الموظفون المنسوبون */}
                <td className="py-4 px-4 text-start">
                  {role.assignedEmployeesInitials ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                        {role.assignedEmployeesCount} {t("موظفين", "employees")}
                      </span>
                      {/* Initials Stack */}
                      <div className="flex items-center -space-x-2 rtl:space-x-reverse">
                        {role.assignedEmployeesInitials.map((emp, i) => (
                          <div
                            key={i}
                            style={{ backgroundColor: emp.bg, color: emp.text }}
                            className="size-[28px] rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-[#221812] shadow-xs shrink-0 select-none"
                            title={emp.label}
                          >
                            {emp.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                        {role.assignedEmployeesCount} {t("موظفاً", "employees")}
                      </span>
                      <div className="bg-[#f0eeea] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] size-[28px] rounded-full flex items-center justify-center text-[#625d5d] dark:text-[#cdc5bd] shrink-0">
                        <Users className="size-[13px]" />
                      </div>
                    </div>
                  )}
                </td>

                {/* 5. نوع الدور */}
                <td className="py-4 px-4 text-start">
                  <div
                    className={`inline-flex items-center gap-1.5 px-[8px] py-[3px] rounded-[4px] border ${role.typeBadge.badgeClass}`}
                  >
                    <div className={`size-[6px] rounded-full shrink-0 ${role.typeBadge.dotClass}`} />
                    <span className="text-[10px] font-bold whitespace-nowrap">
                      {role.typeBadge.label === "نظام أساسي"
                        ? t("نظام أساسي", "Core System")
                        : role.typeBadge.label === "مخصص"
                        ? t("مخصص", "Custom")
                        : role.typeBadge.label}
                    </span>
                  </div>
                </td>

                {/* 6. الإجراءات */}
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {/* Delete or Lock button */}
                    {role.isProtected ? (
                      <button
                        type="button"
                        disabled
                        title={t("دور أساسي محمي - لا يمكن حذفه", "Protected core role - Cannot be deleted")}
                        className="p-1.5 text-[#948b83] dark:text-[#8e8680] opacity-60 cursor-not-allowed rounded-[4px]"
                        data-node-id="1:11660"
                      >
                        <Lock className="size-[14px]" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onDeleteRole(role)}
                        title={t("حذف الدور الوظيفي", "Delete Role")}
                        className="p-1.5 text-[#625d5d] dark:text-[#cdc5bd] hover:text-[#b91c1c] dark:hover:text-[#f87171] hover:bg-[#fee2e2] dark:hover:bg-[#341616] rounded-[4px] transition-colors cursor-pointer"
                        data-node-id="1:11705"
                      >
                        <Trash2 className="size-[14px]" />
                      </button>
                    )}

                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={() => onEditRole(role)}
                      title={t("تعديل الدور والصلاحيات", "Edit Role & Permissions")}
                      className="p-1.5 text-[#625d5d] dark:text-[#cdc5bd] hover:text-[#9c6402] dark:hover:text-[#e29d38] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] rounded-[4px] transition-colors cursor-pointer"
                      data-node-id="1:11663"
                    >
                      <Pencil className="size-[14px]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div
        className="bg-[#fcfaf7] dark:bg-[#1a120d] border-t border-[#e6e2dc] dark:border-[#38271c] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-start"
        data-node-id="1:11855"
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-[12px] text-[#514537] dark:text-[#cdc5bd]" data-node-id="1:11877">
            <span>{t("عرض ", "Showing ")}</span>
            <strong className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{startItem}</strong>
            <span>{t(" إلى ", " to ")}</span>
            <strong className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{endItem}</strong>
            <span>{t(" من أصل ", " of ")}</span>
            <strong className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{roles.length}</strong>
            <span>{t(" أدوار مسجلة", " registered roles")}</span>
          </div>

          <div className="flex items-center gap-2 border-s border-[#eae8e4] dark:border-[#38271c] ps-3">
            <span className="text-[11px] text-[#837565] dark:text-[#8e8680]">
              {t("صفوف بالصفحة:", "Rows per page:")}
            </span>
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

        {/* Numeric page buttons */}
        <div className="flex items-center gap-1.5" data-node-id="1:11856">
          {/* First Page */}
          <button
            type="button"
            disabled={safePageIndex === 0}
            onClick={() => setPageIndex(0)}
            title={t("الصفحة الأولى", "First Page")}
            className="size-[32px] rounded-[4px] border border-[#e6e2dc] dark:border-[#38271c] bg-[#f5f3ef] dark:bg-[#281c15] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronsRight className={cn("size-[14px]", isEn && "rotate-180")} />
          </button>

          {/* Previous */}
          <button
            type="button"
            disabled={safePageIndex === 0}
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#f5f3ef] dark:bg-[#281c15] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] disabled:opacity-40 disabled:cursor-not-allowed text-[#837565] dark:text-[#cdc5bd] border border-transparent dark:border-[#38271c] rounded-[4px] text-[12px] font-semibold transition-colors cursor-pointer"
            data-node-id="1:11872"
          >
            <ChevronRight className={cn("size-[13px]", isEn && "rotate-180")} />
            <span>{t("السابق", "Prev")}</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i).map((p) => {
            if (totalPages > 5 && Math.abs(p - safePageIndex) > 2 && p !== 0 && p !== totalPages - 1) {
              if (p === 1 || p === totalPages - 2) {
                return (
                  <span key={p} className="text-[#837565] dark:text-[#8e8680] text-[12px] px-1 font-semibold">
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
                className={`size-[32px] rounded-[4px] text-[12px] font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] font-bold shadow-xs cursor-default"
                    : "bg-[#f5f3ef] dark:bg-[#281c15] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] border border-transparent dark:border-[#38271c]"
                }`}
              >
                {p + 1}
              </button>
            );
          })}

          {/* Next */}
          <button
            type="button"
            disabled={safePageIndex >= totalPages - 1}
            onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#f5f3ef] dark:bg-[#281c15] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] disabled:opacity-40 disabled:cursor-not-allowed text-[#1b1c1a] dark:text-[#fdfbf7] border border-transparent dark:border-[#38271c] rounded-[4px] text-[12px] font-semibold transition-colors cursor-pointer"
            data-node-id="1:11857"
          >
            <span>{t("التالي", "Next")}</span>
            <ChevronLeft className={cn("size-[13px]", isEn && "rotate-180")} />
          </button>

          {/* Last Page */}
          <button
            type="button"
            disabled={safePageIndex >= totalPages - 1}
            onClick={() => setPageIndex(totalPages - 1)}
            title={t("الصفحة الأخيرة", "Last Page")}
            className="size-[32px] rounded-[4px] border border-[#e6e2dc] dark:border-[#38271c] bg-[#f5f3ef] dark:bg-[#281c15] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronsLeft className={cn("size-[14px]", isEn && "rotate-180")} />
          </button>
        </div>
      </div>
    </div>
  );
}