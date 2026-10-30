import React from "react";
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
} from "lucide-react";
import { RoleItem } from "../types/roles.types";

interface RolesTableProps {
  roles: RoleItem[];
  onEditRole: (role: RoleItem) => void;
  onDeleteRole: (role: RoleItem) => void;
}

export function RolesTable({ roles, onEditRole, onDeleteRole }: RolesTableProps) {
  const getRoleIcon = (type: string) => {
    switch (type) {
      case "shield":
        return <Shield className="size-[17px] text-[#9c6402]" />;
      case "headset":
        return <Headphones className="size-[16px] text-[#514537]" />;
      case "monitor":
        return <Monitor className="size-[16px] text-[#514537]" />;
      case "calculator":
        return <Calculator className="size-[16px] text-[#514537]" />;
      case "briefcase":
        return <Briefcase className="size-[16px] text-[#514537]" />;
      case "scale":
        return <Scale className="size-[16px] text-[#514537]" />;
      default:
        return <Shield className="size-[16px] text-[#514537]" />;
    }
  };

  return (
    <div
      className="bg-white rounded-b-[8px] border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden"
      data-node-id="1:11626"
      dir="rtl"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          {/* Header Row */}
          <thead>
            <tr
              className="bg-[#f0eeea] border-b border-[#e6e2dc] text-[#514537] text-[12px] font-bold"
              data-node-id="1:11644"
            >
              <th className="py-3.5 px-4 w-[340px]" data-node-id="1:11645">
                اسم الدور الوظيفي
              </th>
              <th className="py-3.5 px-4 w-[180px]" data-node-id="1:11647">
                المعرّف البرمجي (Slug)
              </th>
              <th className="py-3.5 px-4 w-[190px]" data-node-id="1:11649">
                نطاق الصلاحيات
              </th>
              <th className="py-3.5 px-4 w-[160px]" data-node-id="1:11651">
                الموظفون المنسوبون
              </th>
              <th className="py-3.5 px-4 w-[130px]" data-node-id="1:11653">
                نوع الدور
              </th>
              <th className="py-3.5 px-4 text-center w-[90px]" data-node-id="1:11655">
                الإجراءات
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#f0eeea]" data-node-id="1:11657">
            {roles.map((role) => (
              <tr
                key={role.id}
                className="hover:bg-[#fbf9f6] transition-colors"
                data-node-id={`row-${role.id}`}
              >
                {/* 1. اسم الدور الوظيفي */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    {/* Icon container */}
                    <div
                      className={`${role.iconBg} size-[36px] rounded-[4px] flex items-center justify-center shrink-0`}
                    >
                      {getRoleIcon(role.iconType)}
                    </div>

                    <div className="flex flex-col items-start text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-[18px] font-semibold text-[#1b1c1a] leading-[26px]">
                          {role.name}
                        </span>
                        {role.hasFullPermissionsBadge && (
                          <span className="bg-[#ffddb6] text-[#2a1800] text-[10px] font-bold px-[6px] py-[2px] rounded-[2px] leading-[14px]">
                            صلاحيات كاملة
                          </span>
                        )}
                      </div>
                      <span className="text-[12px] font-normal text-[#625d5d] leading-[18px]">
                        {role.subtitle}
                      </span>
                    </div>
                  </div>
                </td>

                {/* 2. المعرف البرمجي (Slug) */}
                <td className="py-4 px-4">
                  <span className="inline-block bg-[#f0eeea] text-[#625d5d] font-mono text-[12px] font-bold tracking-[0.6px] px-[10px] py-[3px] rounded-[2px]">
                    {role.slug}
                  </span>
                </td>

                {/* 3. نطاق الصلاحيات */}
                <td className="py-4 px-4">
                  <div className="inline-flex items-center gap-1.5 bg-[#f5f3ef] px-[10px] py-[4px] rounded-[2px]">
                    <div
                      className={`size-[6px] rounded-full shrink-0 ${
                        role.hasFullPermissionsBadge ? "bg-[#9c6402]" : "bg-[#625d5d]"
                      }`}
                    />
                    <span className="text-[11px] font-semibold text-[#1b1c1a]">
                      {role.permissionsLabel}
                    </span>
                  </div>
                </td>

                {/* 4. الموظفون المنسوبون */}
                <td className="py-4 px-4">
                  {role.assignedEmployeesInitials ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-semibold text-[#1b1c1a]">
                        {role.assignedEmployeesCount} موظفين
                      </span>
                      {/* Initials Stack (RTL: first on right) */}
                      <div className="flex items-center -space-x-2 -space-x-reverse">
                        {role.assignedEmployeesInitials.map((emp, i) => (
                          <div
                            key={i}
                            style={{ backgroundColor: emp.bg, color: emp.text }}
                            className="size-[28px] rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-xs shrink-0 select-none"
                            title={emp.label}
                          >
                            {emp.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-semibold text-[#1b1c1a]">
                        {role.assignedEmployeesCount} موظفاً
                      </span>
                      <div className="bg-[#f0eeea] size-[28px] rounded-full flex items-center justify-center text-[#625d5d] shrink-0">
                        <Users className="size-[13px]" />
                      </div>
                    </div>
                  )}
                </td>

                {/* 5. نوع الدور */}
                <td className="py-4 px-4">
                  <div
                    className={`inline-flex items-center gap-1.5 px-[8px] py-[3px] rounded-[2px] ${role.typeBadge.badgeClass}`}
                  >
                    <div className={`size-[6px] rounded-full shrink-0 ${role.typeBadge.dotClass}`} />
                    <span className="text-[10px] font-bold whitespace-nowrap">
                      {role.typeBadge.label}
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
                        title="دور أساسي محمي - لا يمكن حذفه"
                        className="p-1.5 text-[#948b83] opacity-60 cursor-not-allowed rounded-[4px]"
                        data-node-id="1:11660"
                      >
                        <Lock className="size-[14px]" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onDeleteRole(role)}
                        title="حذف الدور الوظيفي"
                        className="p-1.5 text-[#625d5d] hover:text-[#b91c1c] hover:bg-[#fee2e2] rounded-[4px] transition-colors cursor-pointer"
                        data-node-id="1:11705"
                      >
                        <Trash2 className="size-[14px]" />
                      </button>
                    )}

                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={() => onEditRole(role)}
                      title="تعديل الدور والصلاحيات"
                      className="p-1.5 text-[#625d5d] hover:text-[#9c6402] hover:bg-[#f5f3ef] rounded-[4px] transition-colors cursor-pointer"
                      data-node-id="1:11663"
                    >
                      <Pencil className="size-[14px]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer (Figma 1:11855) */}
      <div
        className="bg-white border-t border-[#e6e2dc] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-right"
        data-node-id="1:11855"
      >
        {/* Total counts text */}
        <div className="text-[12px] text-[#514537]" data-node-id="1:11877">
          <span>عرض </span>
          <strong className="font-bold text-[#1b1c1a]">1</strong>
          <span> إلى </span>
          <strong className="font-bold text-[#1b1c1a]">{roles.length}</strong>
          <span> من أصل </span>
          <strong className="font-bold text-[#1b1c1a]">10</strong>
          <span> أدوار مسجلة</span>
        </div>

        {/* Numeric page buttons */}
        <div className="flex items-center gap-1.5" data-node-id="1:11856">
          {/* Next */}
          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#f5f3ef] hover:bg-[#eae8e4] text-[#1b1c1a] rounded-[4px] text-[12px] font-semibold transition-colors cursor-pointer"
            data-node-id="1:11857"
          >
            <span>التالي</span>
            <ChevronLeft className="size-[13px]" />
          </button>

          {/* Last page */}
          <button
            type="button"
            className="size-[32px] bg-[#f5f3ef] hover:bg-[#eae8e4] text-[#1b1c1a] rounded-[4px] text-[12px] font-semibold flex items-center justify-center transition-colors cursor-pointer"
          >
            16
          </button>

          <span className="text-[#837565] text-[12px] px-1 font-semibold">...</span>

          {/* Page 3 */}
          <button
            type="button"
            className="size-[32px] bg-[#f5f3ef] hover:bg-[#eae8e4] text-[#1b1c1a] rounded-[4px] text-[12px] font-semibold flex items-center justify-center transition-colors cursor-pointer"
          >
            3
          </button>

          {/* Page 2 */}
          <button
            type="button"
            className="size-[32px] bg-[#f5f3ef] hover:bg-[#eae8e4] text-[#1b1c1a] rounded-[4px] text-[12px] font-semibold flex items-center justify-center transition-colors cursor-pointer"
          >
            2
          </button>

          {/* Page 1 (Active) */}
          <button
            type="button"
            className="size-[32px] bg-[#9c6402] text-white rounded-[4px] text-[12px] font-bold flex items-center justify-center shadow-xs cursor-default"
            data-node-id="1:11870"
          >
            1
          </button>

          {/* Previous */}
          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#f5f3ef] hover:bg-[#eae8e4] text-[#837565] rounded-[4px] text-[12px] font-semibold transition-colors cursor-pointer"
            data-node-id="1:11872"
          >
            <ChevronRight className="size-[13px]" />
            <span>السابق</span>
          </button>
        </div>
      </div>
    </div>
  );
}
