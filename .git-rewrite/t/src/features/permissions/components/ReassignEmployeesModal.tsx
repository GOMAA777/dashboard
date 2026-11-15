import React, { useState } from "react";
import { X, ArrowLeftRight, ChevronDown, ShieldCheck, UserCheck } from "lucide-react";
import { RoleItem } from "../types/roles.types";

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      dir="rtl"
      data-node-id="1:12092"
    >
      <div
        className="bg-white rounded-[12px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_10px_10px_-5px_rgba(0,0,0,0.04)] border border-[#e6e2dc] w-full max-w-[540px] overflow-hidden"
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
            <div className="flex flex-col items-end">
              <h3 className="text-[20px] font-bold text-[#1b1c1a]">
                إعادة تعيين الموظفين
              </h3>
              <p className="text-[12px] text-[#625d5d]">
                نقل موظفي الدور الحالي إلى دور وظيفي جديد
              </p>
            </div>
            <div className="bg-[#fff8e1] size-[40px] rounded-[10px] flex items-center justify-center text-[#9c6402] shrink-0">
              <ArrowLeftRight className="size-[20px]" />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-right">
          {/* Current Source Role Banner */}
          <div className="bg-[#f5f3ef] rounded-[8px] p-3.5 border border-[#e6e2dc] flex items-center justify-between">
            <span className="bg-[#e6e2dc] text-[#514537] text-[12px] font-bold px-2.5 py-1 rounded-[4px] flex items-center gap-1.5">
              <span>{sourceRole.assignedEmployeesCount} موظفاً</span>
            </span>

            <div className="text-[13px] text-[#514537]">
              <span>من الدور: </span>
              <strong className="font-bold text-[#1b1c1a]">{sourceRole.name}</strong>
            </div>
          </div>

          {/* Target Role Selector */}
          <div className="space-y-2">
            <label className="block text-[13px] font-semibold text-[#1b1c1a]">
              الدور الوظيفي الجديد (البديل)<span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <select
                value={selectedTargetId}
                onChange={(e) => setSelectedTargetId(e.target.value)}
                className="w-full h-[42px] pe-3 ps-9 text-[13px] bg-[#fdfbf7] border border-[#d6cfc7] rounded-[6px] text-[#1b1c1a] appearance-none focus:outline-none focus:ring-1 focus:ring-[#9c6402] focus:border-[#9c6402] cursor-pointer text-right font-medium"
              >
                {eligibleTargetRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name} ({role.permissionsLabel})
                  </option>
                ))}
              </select>
              <ChevronDown className="size-[15px] text-[#514537] absolute top-1/2 -translate-y-1/2 start-3 pointer-events-none" />
            </div>
          </div>

          {/* Security & Audit Notice */}
          <div className="flex items-center gap-2 text-[12px] text-[#625d5d] pt-1">
            <ShieldCheck className="size-[16px] text-[#9c6402] shrink-0" />
            <span>
              سيتم تحويل كافة الموظفين تلقائياً إلى الدور الجديد والاحتفاظ بسجلاتهم السابقة بأمان.
            </span>
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
            onClick={handleConfirm}
            className="px-5 py-2.5 bg-[#9c6402] hover:bg-[#855402] text-white rounded-[6px] text-[13px] font-bold shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors cursor-pointer flex items-center gap-2"
          >
            <UserCheck className="size-[15px]" />
            <span>نقل وتعيين الموظفين</span>
          </button>
        </div>
      </div>
    </div>
  );
}
