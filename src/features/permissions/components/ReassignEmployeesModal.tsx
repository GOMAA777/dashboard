"use client";

import React, { useState } from "react";
import { X, ArrowLeftRight, ChevronDown, ShieldCheck, UserCheck } from "lucide-react";
import { RoleItem } from "../types/roles.types";
import { useLanguage } from "@/lib/i18n";
import { ModalPortal } from "@/components/shared/ModalPortal";
import { cn } from "@/lib/utils";

interface ReassignEmployeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceRole: RoleItem | null;
  availableRoles: RoleItem[];
  onConfirmReassign: (sourceRoleId: string, targetRoleId: string) => void;
}

export function ReassignEmployeesModal({
  isOpen,
  onClose,
  sourceRole,
  availableRoles,
  onConfirmReassign,
}: ReassignEmployeesModalProps) {
  const { t, direction, isEn } = useLanguage();

  const eligibleTargetRoles = availableRoles.filter(
    (r) => r.id !== sourceRole?.id
  );

  const [selectedTargetId, setSelectedTargetId] = useState<string>(
    eligibleTargetRoles[0]?.id || ""
  );

  if (!isOpen || !sourceRole) return null;

  const handleConfirm = () => {
    if (!selectedTargetId) return;
    onConfirmReassign(sourceRole.id, selectedTargetId);
  };

  return (
    <ModalPortal isOpen={isOpen}>
      <div
        dir={direction}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-['Cairo']"
        data-node-id="1:12092"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="bg-white dark:bg-[#221812] rounded-[12px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_10px_10px_-5px_rgba(0,0,0,0.04)] border border-[#e6e2dc] dark:border-[#38271c] w-full max-w-[540px] overflow-hidden"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="p-6 border-b border-[#f0eeea] dark:border-[#38271c] flex items-center justify-between">
          <div className="flex items-center gap-3 order-1 rtl:order-2">
            <div className="bg-[#fff8e1] dark:bg-[#342711] size-[40px] rounded-[10px] flex items-center justify-center text-[#9c6402] shrink-0">
              <ArrowLeftRight className="size-[20px]" />
            </div>
            <div className="flex flex-col text-start">
              <h3 className="text-[20px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("إعادة تعيين الموظفين", "Reassign Employees")}
              </h3>
              <p className="text-[12px] text-[#625d5d] dark:text-[#a89f91]">
                {t("نقل موظفي الدور الحالي إلى دور وظيفي جديد", "Transfer current role staff to a new role")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#837565] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] rounded-[6px] transition-colors cursor-pointer order-2 rtl:order-1"
          >
            <X className="size-[18px]" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-start">
          {/* Current Source Role Banner */}
          <div className="bg-[#f5f3ef] dark:bg-[#281c15] rounded-[8px] p-3.5 border border-[#e6e2dc] dark:border-[#38271c] flex items-center justify-between">
            <div className="text-[13px] text-[#514537] dark:text-[#cdc5bd]">
              <span>{t("من الدور: ", "From Role: ")}</span>
              <strong className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{sourceRole.name}</strong>
            </div>

            <span className="bg-[#e6e2dc] dark:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] text-[12px] font-bold px-2.5 py-1 rounded-[4px] flex items-center gap-1.5">
              <span>{sourceRole.assignedEmployeesCount} {t("موظفاً", "staff")}</span>
            </span>
          </div>

          {/* Target Role Selector */}
          <div className="space-y-2">
            <label className="block text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {t("الدور الوظيفي الجديد (البديل)", "New Target Role")}<span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <select
                value={selectedTargetId}
                onChange={(e) => setSelectedTargetId(e.target.value)}
                className="w-full h-[42px] px-3 pe-9 text-[13px] bg-[#fdfbf7] dark:bg-[#281c15] border border-[#d6cfc7] dark:border-[#38271c] rounded-[6px] text-[#1b1c1a] dark:text-[#fdfbf7] appearance-none focus:outline-none focus:ring-1 focus:ring-[#9c6402] focus:border-[#9c6402] cursor-pointer text-start font-medium"
              >
                {eligibleTargetRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name} ({role.permissionsLabel})
                  </option>
                ))}
              </select>
              <ChevronDown className={cn("size-[16px] text-[#837565] absolute top-1/2 -translate-y-1/2 pointer-events-none", isEn ? "right-3" : "left-3")} />
            </div>
            <p className="text-[11px] text-[#837565] dark:text-[#a89f91]">
              {t(
                "سيتم نقل جميع صلاحيات الموظفين فورياً إلى الدور المختار دون انقطاع خدمتهم.",
                "All staff permissions will transfer immediately to the selected role without service disruption."
              )}
            </p>
          </div>

          {/* Notice info */}
          <div className="bg-[#f0fdf4] dark:bg-[#132c21] border border-[#bbf7d0] dark:border-[#1e4a36] rounded-[8px] p-3.5 flex items-start gap-2.5 text-[12px] text-[#166534] dark:text-[#86efac]">
            <ShieldCheck className="size-[16px] shrink-0 mt-0.5 text-[#16a34a]" />
            <p className="leading-relaxed">
              {t(
                "عملية النقل تضمن بقاء الدور القديم بدون أي موظفين، مما يتيح لك حذفه لاحقاً بأمان تام.",
                "Reassignment ensures the previous role has zero assigned staff, enabling safe deletion."
              )}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#fbf9f6] dark:bg-[#221812] border-t border-[#f0eeea] dark:border-[#38271c] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#f0eeea] dark:bg-[#281c15] hover:bg-[#e6e2dc] text-[#514537] dark:text-[#a89f91] rounded-[6px] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            {t("إلغاء", "Cancel")}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2.5 bg-[#9c6402] hover:bg-[#855402] text-white rounded-[6px] text-[13px] font-bold shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors cursor-pointer flex items-center gap-2"
          >
            <UserCheck className="size-[16px]" />
            <span>{t("تأكيد النقل وإعادة التعيين", "Confirm Reassignment")}</span>
          </button>
        </div>
      </div>
    </div>
  </ModalPortal>
  );
}