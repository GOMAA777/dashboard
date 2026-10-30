import React from "react";
import { X, Trash2, AlertTriangle, Users, ArrowLeft, Ban, UserCheck } from "lucide-react";
import { RoleItem } from "../types/roles.types";

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
  if (!isOpen || !role) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      data-node-id="1:11997"
    >
      <div
        className="bg-white rounded-[12px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_10px_10px_-5px_rgba(0,0,0,0.04)] border border-[#e6e2dc] w-full max-w-[620px] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-[#f0eeea] flex items-center justify-between">
          {/* Close button on start (left in RTL) */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#837565] hover:text-[#1b1c1a] hover:bg-[#f5f3ef] rounded-[6px] transition-colors cursor-pointer"
          >
            <X className="size-[18px]" />
          </button>

          {/* Title + Badge + Red Trash Icon on end */}
          <div className="flex items-center gap-3">
            <span className="bg-[#fef3c7] text-[#b76e00] text-[11px] font-bold px-2.5 py-1 rounded-[4px] flex items-center gap-1.5">
              <span className="size-[6px] rounded-full bg-[#b76e00]" />
              إجراء محظور نظامياً
            </span>
            <h3 className="text-[20px] font-bold text-[#1b1c1a]">
              حذف الدور الوظيفي؟
            </h3>
            <div className="bg-[#fee2e2] size-[40px] rounded-[10px] flex items-center justify-center text-[#ef4444] shrink-0">
              <Trash2 className="size-[20px]" />
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-start">
          {/* 1. Role Info Card */}
          <div className="bg-[#f5f3ef] rounded-[8px] p-4 border border-[#e6e2dc] space-y-3">
            <div className="flex items-start justify-between">
              <span className="bg-[#e6e2dc] text-[#514537] text-[11px] font-semibold px-2.5 py-1 rounded-[2px]">
                {role.permissionsLabel}
              </span>
              <div className="flex items-center gap-2.5">
                <div className="flex flex-col items-end">
                  <span className="text-[15px] font-bold text-[#1b1c1a]">
                    {role.name}
                  </span>
                  <span className="text-[11px] text-[#837565] font-mono">
                    slug: {role.slug}
                  </span>
                </div>
                <div className="bg-[#e6e2dc] size-[34px] rounded-[6px] flex items-center justify-center text-[#514537]">
                  <UserCheck className="size-[18px]" />
                </div>
              </div>
            </div>

            {/* Inner row: Active employees notice */}
            <div className="bg-white rounded-[6px] p-3 border border-[#e6e2dc]/60 flex items-center justify-between">
              <span className="bg-[#fee2e2] text-[#b91c1c] text-[10px] font-bold px-2 py-0.5 rounded-[4px] flex items-center gap-1">
                <span className="size-[5px] rounded-full bg-[#b91c1c]" />
                نشط وغير قابل للحذف
              </span>
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-end">
                  <span className="text-[13px] font-bold text-[#1b1c1a]">
                    {role.assignedEmployeesCount} موظفاً مرتبطاً بهذا الدور حالياً
                  </span>
                  <span className="text-[11px] text-[#625d5d]">
                    جميعهم يمارسون مهام وظيفية معتمدة عبر المنصة
                  </span>
                </div>
                <div className="text-[#9c6402] shrink-0">
                  <Users className="size-[18px]" />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Judicial Continuity Warning Box */}
          <div className="bg-[#fffbeb] border border-[#fef08a] rounded-[8px] p-4 flex items-start gap-3">
            <div className="text-[#b45309] shrink-0 mt-0.5">
              <AlertTriangle className="size-[20px]" />
            </div>
            <div className="flex-1">
              <h4 className="text-[13px] font-bold text-[#92400e]">
                أمان استمرارية الأعمال القضائية
              </h4>
              <p className="text-[12px] text-[#78350f] leading-[20px] mt-1">
                لا يمكن حذف هذا الدور لوجود موظفين مرتبطين به. يرجى إعادة تعيين أدوار الموظفين أو نقلهم إلى دور بديل أولاً لتجنب فقدان صلاحياتهم التشغيلية وتوقف معالجة قضايا الموكلين.
              </p>
            </div>
          </div>

          {/* 3. Affected Staff Box */}
          <div className="bg-[#f5f3ef] rounded-[8px] p-4 border border-[#e6e2dc] space-y-3">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#1b1c1a]">
              <Users className="size-[15px] text-[#9c6402]" />
              <span>الموظفون المتأثرون بهذا الإجراء:</span>
            </div>

            {/* Employee pills */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-white border border-[#e6e2dc] rounded-[6px] px-2.5 py-1.5 flex items-center gap-2 shadow-2xs">
                <div className="size-[22px] rounded-full bg-[#f0eeea] text-[#514537] text-[10px] font-bold flex items-center justify-center">
                  س
                </div>
                <span className="text-[11px] font-semibold text-[#1b1c1a]">
                  د. سارة القحطاني
                </span>
                <span className="text-[10px] text-[#837565]">
                  مشرف ميداني
                </span>
              </div>

              <div className="bg-white border border-[#e6e2dc] rounded-[6px] px-2.5 py-1.5 flex items-center gap-2 shadow-2xs">
                <div className="size-[22px] rounded-full bg-[#f0eeea] text-[#514537] text-[10px] font-bold flex items-center justify-center">
                  م
                </div>
                <span className="text-[11px] font-semibold text-[#1b1c1a]">
                  أ. ماجد الشمري
                </span>
                <span className="text-[10px] text-[#837565]">
                  أخصائي قضايا
                </span>
              </div>

              <div className="bg-[#e6e2dc] text-[#514537] rounded-[6px] px-2.5 py-1.5 text-[11px] font-semibold">
                ... و {Math.max(0, role.assignedEmployeesCount - 2)} موظفاً إضافياً
              </div>
            </div>

            {/* Action link to reassign */}
            <button
              type="button"
              onClick={() => onGoToReassign(role)}
              className="text-[12px] font-bold text-[#9c6402] hover:text-[#855402] flex items-center gap-1 pt-1 transition-colors cursor-pointer"
            >
              <span>إعادة تعيين أدوار الموظفين ({role.assignedEmployeesCount} موظف)</span>
              <ArrowLeft className="size-[14px]" />
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#fbf9f6] border-t border-[#f0eeea] flex items-center justify-between gap-3">
          {/* Cancel button on right */}
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#f0eeea] hover:bg-[#e6e2dc] text-[#514537] rounded-[6px] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            إلغاء
          </button>

          {/* Middle: Disabled delete button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled
              className="px-4 py-2.5 bg-[#e6e2dc] text-[#948b83] rounded-[6px] text-[13px] font-semibold cursor-not-allowed flex items-center gap-1.5"
            >
              <Ban className="size-[14px]" />
              <span>حذف الدور (غير متاح)</span>
            </button>

            {/* Primary Action: Reassign staff first */}
            <button
              type="button"
              onClick={() => onGoToReassign(role)}
              className="px-5 py-2.5 bg-[#9c6402] hover:bg-[#855402] text-white rounded-[6px] text-[13px] font-bold shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors cursor-pointer flex items-center gap-2"
            >
              <Users className="size-[15px]" />
              <span>إعادة تعيين الموظفين أولاً</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
