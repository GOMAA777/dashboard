"use client";

import React from "react";
import { X, Trash2, Key, UserX } from "lucide-react";
import { RoleItem } from "../types/roles.types";
import { useLanguage } from "@/lib/i18n";
import { ModalPortal } from "@/components/shared/ModalPortal";

interface DeleteRoleConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: RoleItem | null;
  onConfirmDelete: (roleId: string) => void;
}

export function DeleteRoleConfirmModal({
  isOpen,
  onClose,
  role,
  onConfirmDelete,
}: DeleteRoleConfirmModalProps) {
  const { t, direction } = useLanguage();

  if (!isOpen || !role) return null;

  return (
    <ModalPortal isOpen={isOpen}>
      <div
        dir={direction}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-['Cairo']"
        data-node-id="1:12141"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="bg-white dark:bg-[#221812] rounded-[12px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_10px_10px_-5px_rgba(0,0,0,0.04)] border border-[#e6e2dc] dark:border-[#38271c] w-full max-w-[560px] overflow-hidden"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="p-6 border-b border-[#f0eeea] dark:border-[#38271c] flex items-center justify-between">
          <div className="flex items-center gap-3 order-1 rtl:order-2">
            <div className="bg-[#fee2e2] dark:bg-[#311616] size-[40px] rounded-[10px] flex items-center justify-center text-[#ef4444] shrink-0">
              <Trash2 className="size-[20px]" />
            </div>
            <h3 className="text-[20px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {t("حذف الدور الوظيفي؟", "Delete Role?")}
            </h3>
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
          {/* Role Summary Card */}
          <div className="bg-[#f5f3ef] dark:bg-[#281c15] rounded-[8px] p-4 border border-[#e6e2dc] dark:border-[#38271c] space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex flex-col text-start">
                <span className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {role.name}
                </span>
                <span className="text-[11px] text-[#837565] dark:text-[#a89f91] font-mono">
                  {t("المعرف البرمجي:", "Slug:")} {role.slug}
                </span>
              </div>

              <span className="bg-[#e8f5e9] dark:bg-[#132c21] text-[#1b7340] dark:text-[#34d399] text-[11px] font-bold px-2.5 py-1 rounded-[4px] flex items-center gap-1.5">
                <span className="size-[5px] rounded-full bg-[#1b7340]" />
                {t("مؤهل للحذف بأمان", "Safe to Delete")}
              </span>
            </div>

            {/* Inner two-stats box */}
            <div className="bg-white dark:bg-[#221812] rounded-[6px] p-3 border border-[#e6e2dc]/60 dark:border-[#38271c] grid grid-cols-2 divide-x rtl:divide-x-reverse divide-[#f0eeea] dark:divide-[#38271c]">
              {/* Permissions count */}
              <div className="px-3 flex items-center justify-between">
                <div className="text-[#9c6402] dark:text-[#f59e0b] shrink-0">
                  <Key className="size-[18px]" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-[#625d5d] dark:text-[#a89f91]">
                    {t("الصلاحيات المخصصة", "Configured Permissions")}
                  </span>
                  <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {role.permissionsLabel}
                  </span>
                </div>
              </div>

              {/* Assigned staff (0) */}
              <div className="px-3 flex items-center justify-between">
                <div className="text-[#837565] dark:text-[#a89f91] shrink-0">
                  <UserX className="size-[18px]" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-[#625d5d] dark:text-[#a89f91]">
                    {t("الموظفون المسندون", "Assigned Staff")}
                  </span>
                  <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("0 موظف مرتبط", "0 Staff Assigned")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Warning heading & explanation */}
          <div className="space-y-1.5">
            <h4 className="text-[15px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {t("هل أنت متأكد من رغبتك في حذف هذا الدور نهائياً من النظام؟", "Are you sure you want to permanently delete this role?")}
            </h4>
            <p className="text-[12px] text-[#625d5d] dark:text-[#a89f91] leading-[22px]">
              {t(
                "لن يمكن التراجع عن هذا الإجراء بعد تنفيذه. سيتم إزالة مصفوفة الصلاحيات المرتبطة بهذا الدور نهائياً من قائمة الأدوار المتاحة ولن يظهر في خيارات تعيين الموظفين الجدد.",
                "This action cannot be undone. The permissions matrix for this role will be removed permanently and won't appear for new employee assignments."
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
            onClick={() => onConfirmDelete(role.id)}
            className="px-5 py-2.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-[6px] text-[13px] font-bold shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors cursor-pointer flex items-center gap-2"
          >
            <Trash2 className="size-[15px]" />
            <span>{t("تأكيد الحذف النهائي", "Confirm Permanent Deletion")}</span>
          </button>
        </div>
      </div>
    </div>
  </ModalPortal>
  );
}