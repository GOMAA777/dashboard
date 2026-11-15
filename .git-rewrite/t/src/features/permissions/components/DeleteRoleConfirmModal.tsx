import React from "react";
import { X, Trash2, Key, UserX } from "lucide-react";
import { RoleItem } from "../types/roles.types";

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
  if (!isOpen || !role) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      dir="rtl"
      data-node-id="1:12141"
    >
      <div
        className="bg-white rounded-[12px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_10px_10px_-5px_rgba(0,0,0,0.04)] border border-[#e6e2dc] w-full max-w-[560px] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#f0eeea] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#837565] hover:text-[#1b1c1a] hover:bg-[#f5f3ef] rounded-[6px] transition-colors cursor-pointer"
          >
            <X className="size-[18px]" />
          </button>

          <div className="flex items-center gap-3">
            <h3 className="text-[20px] font-bold text-[#1b1c1a]">
              حذف الدور الوظيفي؟
            </h3>
            <div className="bg-[#fee2e2] size-[40px] rounded-[10px] flex items-center justify-center text-[#ef4444] shrink-0">
              <Trash2 className="size-[20px]" />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-right">
          {/* Role Summary Card */}
          <div className="bg-[#f5f3ef] rounded-[8px] p-4 border border-[#e6e2dc] space-y-3">
            <div className="flex items-start justify-between">
              <span className="bg-[#e8f5e9] text-[#1b7340] text-[11px] font-bold px-2.5 py-1 rounded-[4px] flex items-center gap-1.5">
                <span className="size-[5px] rounded-full bg-[#1b7340]" />
                مؤهل للحذف بأمان
              </span>
              <div className="flex flex-col items-end">
                <span className="text-[16px] font-bold text-[#1b1c1a]">
                  {role.name}
                </span>
                <span className="text-[11px] text-[#837565] font-mono">
                  المعرف البرمجي: {role.slug}
                </span>
              </div>
            </div>

            {/* Inner two-stats box */}
            <div className="bg-white rounded-[6px] p-3 border border-[#e6e2dc]/60 grid grid-cols-2 divide-x divide-x-reverse divide-[#f0eeea]">
              {/* Right: Permissions count */}
              <div className="pe-3 flex items-center justify-between">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-[#625d5d]">الصلاحيات المخصصة</span>
                  <span className="text-[13px] font-bold text-[#1b1c1a]">
                    {role.permissionsLabel}
                  </span>
                </div>
                <div className="text-[#9c6402] shrink-0">
                  <Key className="size-[18px]" />
                </div>
              </div>

              {/* Left: Assigned staff (0) */}
              <div className="ps-3 flex items-center justify-between">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-[#625d5d]">الموظفون المسندون</span>
                  <span className="text-[13px] font-bold text-[#1b1c1a]">
                    0 موظف مرتبط
                  </span>
                </div>
                <div className="text-[#837565] shrink-0">
                  <UserX className="size-[18px]" />
                </div>
              </div>
            </div>
          </div>

          {/* Warning heading & explanation */}
          <div className="space-y-1.5">
            <h4 className="text-[15px] font-bold text-[#1b1c1a]">
              هل أنت متأكد من رغبتك في حذف هذا الدور نهائياً من النظام؟
            </h4>
            <p className="text-[12px] text-[#625d5d] leading-[22px]">
              لن يمكن التراجع عن هذا الإجراء بعد تنفيذه. سيتم إزالة مصفوفة الصلاحيات المرتبطة بهذا الدور نهائياً من قائمة الأدوار المتاحة ولن يظهر في خيارات تعيين الموظفين الجدد.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#fbf9f6] border-t border-[#f0eeea] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#f0eeea] hover:bg-[#e6e2dc] text-[#514537] rounded-[6px] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            إلغاء
          </button>

          <button
            type="button"
            onClick={() => onConfirmDelete(role.id)}
            className="px-5 py-2.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-[6px] text-[13px] font-bold shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors cursor-pointer flex items-center gap-2"
          >
            <Trash2 className="size-[15px]" />
            <span>تأكيد الحذف النهائي</span>
          </button>
        </div>
      </div>
    </div>
  );
}
