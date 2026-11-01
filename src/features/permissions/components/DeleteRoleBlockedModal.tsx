"use client";

import React from "react";
import { X, Trash2, AlertTriangle, Users, ArrowLeft, Ban, UserCheck } from "lucide-react";
import { RoleItem } from "../types/roles.types";
import { useLanguage } from "@/lib/i18n";
import { ModalPortal } from "@/components/shared/ModalPortal";
import { cn } from "@/lib/utils";

interface DeleteRoleBlockedModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: RoleItem | null;
  onGoToReassign: (role: RoleItem) => void;
}

export function DeleteRoleBlockedModal({
  isOpen,
  onClose,
  role,
  onGoToReassign,
}: DeleteRoleBlockedModalProps) {
  const { t, isEn, direction } = useLanguage();

  if (!isOpen || !role) return null;

  return (
    <ModalPortal isOpen={isOpen}>
      <div
        dir={direction}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-['Cairo']"
        data-node-id="1:11997"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="bg-white dark:bg-[#1e1c1a] rounded-[12px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_10px_10px_-5px_rgba(0,0,0,0.04)] border border-[#e6e2dc] dark:border-[#38271c] w-full max-w-[620px] overflow-hidden"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Modal Header */}
        <div className="p-6 border-b border-[#f0eeea] dark:border-[#2f2a24] flex items-center justify-between">
          <div className="flex items-center gap-3 order-1 rtl:order-2">
            <div className="bg-[#fee2e2] dark:bg-[#311616] size-[40px] rounded-[10px] flex items-center justify-center text-[#ef4444] shrink-0">
              <Trash2 className="size-[20px]" />
            </div>
            <h3 className="text-[20px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {t("حذف الدور الوظيفي؟", "Delete Role?")}
            </h3>
            <span className="bg-[#fef3c7] dark:bg-[#342711] text-[#b76e00] dark:text-[#fbbf24] text-[11px] font-bold px-2.5 py-1 rounded-[4px] flex items-center gap-1.5">
              <span className="size-[6px] rounded-full bg-[#b76e00]" />
              {t("إجراء محظور نظامياً", "Restricted by Policy")}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#837565] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#2c2621] rounded-[6px] transition-colors cursor-pointer order-2 rtl:order-1"
          >
            <X className="size-[18px]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-start">
          {/* 1. Role Info Card */}
          <div className="bg-[#f5f3ef] dark:bg-[#2c2621] rounded-[8px] p-4 border border-[#e6e2dc] dark:border-[#38271c] space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="bg-[#e6e2dc] dark:bg-[#38271c] size-[34px] rounded-[6px] flex items-center justify-center text-[#514537] dark:text-[#d1c9bd]">
                  <UserCheck className="size-[18px]" />
                </div>
                <div className="flex flex-col text-start">
                  <span className="text-[15px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {role.name}
                  </span>
                  <span className="text-[11px] text-[#837565] dark:text-[#a89f91] font-mono">
                    slug: {role.slug}
                  </span>
                </div>
              </div>

              <span className="bg-[#e6e2dc] dark:bg-[#38271c] text-[#514537] dark:text-[#d1c9bd] text-[11px] font-semibold px-2.5 py-1 rounded-[2px]">
                {role.permissionsLabel}
              </span>
            </div>

            {/* Inner row: Active employees notice */}
            <div className="bg-white dark:bg-[#1e1c1a] rounded-[6px] p-3 border border-[#e6e2dc]/60 dark:border-[#38271c] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-[#9c6402] dark:text-[#f59e0b] shrink-0">
                  <Users className="size-[18px]" />
                </div>
                <div className="flex flex-col text-start">
                  <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t(
                      `${role.assignedEmployeesCount} موظفاً مرتبطاً بهذا الدور حالياً`,
                      `${role.assignedEmployeesCount} employees currently assigned to this role`
                    )}
                  </span>
                  <span className="text-[11px] text-[#625d5d] dark:text-[#a89f91]">
                    {t(
                      "جميعهم يمارسون مهام وظيفية معتمدة عبر المنصة",
                      "All actively performing verified tasks on the platform"
                    )}
                  </span>
                </div>
              </div>

              <span className="bg-[#fee2e2] dark:bg-[#311616] text-[#b91c1c] dark:text-[#f87171] text-[10px] font-bold px-2 py-0.5 rounded-[4px] flex items-center gap-1">
                <span className="size-[5px] rounded-full bg-[#b91c1c]" />
                {t("نشط وغير قابل للحذف", "Active & Non-deletable")}
              </span>
            </div>
          </div>

          {/* 2. Judicial Continuity Warning Box */}
          <div className="bg-[#fffbeb] dark:bg-[#342711] border border-[#fef08a] dark:border-[#5c4217] rounded-[8px] p-4 flex items-start gap-3">
            <div className="text-[#b45309] dark:text-[#fbbf24] shrink-0 mt-0.5">
              <AlertTriangle className="size-[20px]" />
            </div>
            <div className="flex-1 text-start">
              <h4 className="text-[13px] font-bold text-[#92400e] dark:text-[#fbbf24]">
                {t("أمان استمرارية الأعمال القضائية", "Judicial Continuity Security")}
              </h4>
              <p className="text-[12px] text-[#78350f] dark:text-[#fde68a] leading-[20px] mt-1">
                {t(
                  "لا يمكن حذف هذا الدور لوجود موظفين مرتبطين به. يرجى إعادة تعيين أدوار الموظفين أو نقلهم إلى دور بديل أولاً لتجنب فقدان صلاحياتهم التشغيلية وتوقف معالجة قضايا الموكلين.",
                  "Cannot delete this role while employees are assigned. Please reassign them to an alternative role first to avoid interrupting client cases."
                )}
              </p>
            </div>
          </div>

          {/* 3. Affected Staff Box */}
          <div className="bg-[#f5f3ef] dark:bg-[#2c2621] rounded-[8px] p-4 border border-[#e6e2dc] dark:border-[#38271c] space-y-3">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              <Users className="size-[15px] text-[#9c6402] dark:text-[#f59e0b]" />
              <span>{t("الموظفون المتأثرون بهذا الإجراء:", "Employees affected by this action:")}</span>
            </div>

            {/* Employee pills */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-white dark:bg-[#1e1c1a] border border-[#e6e2dc] dark:border-[#38271c] rounded-[6px] px-2.5 py-1.5 flex items-center gap-2 shadow-2xs">
                <div className="size-[22px] rounded-full bg-[#f0eeea] dark:bg-[#38271c] text-[#514537] dark:text-[#d1c9bd] text-[10px] font-bold flex items-center justify-center">
                  S
                </div>
                <span className="text-[11px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("د. سارة القحطاني", "Dr. Sarah Al-Qahtani")}
                </span>
                <span className="text-[10px] text-[#837565] dark:text-[#a89f91]">
                  {t("مشرف ميداني", "Field Supervisor")}
                </span>
              </div>

              <div className="bg-white dark:bg-[#1e1c1a] border border-[#e6e2dc] dark:border-[#38271c] rounded-[6px] px-2.5 py-1.5 flex items-center gap-2 shadow-2xs">
                <div className="size-[22px] rounded-full bg-[#f0eeea] dark:bg-[#38271c] text-[#514537] dark:text-[#d1c9bd] text-[10px] font-bold flex items-center justify-center">
                  M
                </div>
                <span className="text-[11px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("أ. ماجد الشمري", "Majed Al-Shammari")}
                </span>
                <span className="text-[10px] text-[#837565] dark:text-[#a89f91]">
                  {t("أخصائي قضايا", "Case Specialist")}
                </span>
              </div>

              <div className="bg-[#e6e2dc] dark:bg-[#38271c] text-[#514537] dark:text-[#d1c9bd] rounded-[6px] px-2.5 py-1.5 text-[11px] font-semibold">
                {t(
                  `... و ${Math.max(0, role.assignedEmployeesCount - 2)} موظفاً إضافياً`,
                  `... and ${Math.max(0, role.assignedEmployeesCount - 2)} more staff`
                )}
              </div>
            </div>

            {/* Action link to reassign */}
            <button
              type="button"
              onClick={() => onGoToReassign(role)}
              className="text-[12px] font-bold text-[#9c6402] dark:text-[#f59e0b] hover:underline flex items-center gap-1 pt-1 transition-colors cursor-pointer"
            >
              <span>{t(`إعادة تعيين أدوار الموظفين (${role.assignedEmployeesCount} موظف)`, `Reassign roles (${role.assignedEmployeesCount} employees)`)}</span>
              <ArrowLeft className={cn("size-[14px]", !isEn && "rotate-180")} />
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#fbf9f6] dark:bg-[#25221e] border-t border-[#f0eeea] dark:border-[#2f2a24] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#f0eeea] dark:bg-[#2c2621] hover:bg-[#e6e2dc] text-[#514537] dark:text-[#a89f91] rounded-[6px] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            {t("إلغاء", "Cancel")}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled
              className="px-4 py-2.5 bg-[#e6e2dc] dark:bg-[#38271c] text-[#948b83] dark:text-[#6e675f] rounded-[6px] text-[13px] font-semibold cursor-not-allowed flex items-center gap-1.5"
            >
              <Ban className="size-[14px]" />
              <span>{t("حذف الدور (غير متاح)", "Delete Role (Unavailable)")}</span>
            </button>

            <button
              type="button"
              onClick={() => onGoToReassign(role)}
              className="px-5 py-2.5 bg-[#9c6402] hover:bg-[#855402] text-white rounded-[6px] text-[13px] font-bold shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors cursor-pointer flex items-center gap-2"
            >
              <Users className="size-[15px]" />
              <span>{t("إعادة تعيين الموظفين أولاً", "Reassign Employees First")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </ModalPortal>
  );
}