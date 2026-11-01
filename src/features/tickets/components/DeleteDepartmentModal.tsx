"use client";

import React, { useState } from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";
import { TicketDepartment } from "../types/tickets.types";
import { useLanguage } from "@/lib/i18n";

interface DeleteDepartmentModalProps {
  department: TicketDepartment;
  onClose: () => void;
  onConfirm: (deptId: string) => void;
}

export function DeleteDepartmentModal({
  department,
  onClose,
  onConfirm,
}: DeleteDepartmentModalProps) {
  const { direction, isEn } = useLanguage();
  const [isAcknowledged, setIsAcknowledged] = useState(false);

  const handleConfirm = () => {
    if (!isAcknowledged) return;
    onConfirm(department.id);
  };

  return (
    <div
      dir={direction}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs antialiased"
    >
      <div
        className="bg-white rounded-[8px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] w-full max-w-[480px] overflow-hidden flex flex-col relative text-start animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Top Decorative Warning Band */}
        <div className="h-[6px] w-full bg-[#ba1a1a]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-[20px] pt-[16px] pb-[12px] border-b border-[#eae8e4]/60">
          <div className="flex items-center gap-[10px]">
            <div className="bg-[#ffdad6] size-[40px] rounded-[10px] flex items-center justify-center shrink-0">
              <Trash2 className="size-[18px] text-[#ba1a1a]" />
            </div>
            <h2 className="text-[#1b1c1a] font-bold text-[20px] leading-[24px]">
              {isEn ? "Delete Department" : "حذف القسم"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="bg-[#f0eeea] hover:bg-[#eae8e4] text-[#514537] size-[32px] rounded-[4px] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="size-[14px]" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex flex-col gap-[14px] p-[20px]">
          {/* Core Warning Copy */}
          <div className="flex flex-col gap-[4px] text-start">
            <h3 className="text-[#1b1c1a] font-semibold text-[15px] leading-[24px]">
              {isEn
                ? "Are you sure you want to permanently delete this department?"
                : "هل أنت متأكد من رغبتك في حذف هذا القسم نهائياً؟"}
            </h3>
            <p className="text-[#514537] text-[12px] leading-[19px]">
              {isEn
                ? "This action cannot be undone, and associated archived records will be unlinked."
                : "لا يمكن التراجع عن هذا الإجراء بعد اعتماده، وسيتم فك ارتباط أي سجلات مؤرشفة تابعة له."}
            </p>
          </div>

          {/* Department Identification Highlight Card */}
          <div className="bg-[#f5f3ef] rounded-[4px] p-[14px] flex flex-col gap-[8px] border border-[#eae8e4]/70">
            <div className="flex items-center justify-between">
              <span className="bg-[#e4e2de] text-[#1b1c1a] font-bold text-[10px] px-[8px] py-[2px] rounded-[2px] font-mono">
                {department.code}
              </span>
              <span className="text-[#514537] text-[10px] font-bold">
                {isEn ? "Target Item For Deletion:" : "البيانات المحددة للحذف:"}
              </span>
            </div>

            <div className="flex items-center gap-[8px] pt-[2px]">
              <AlertTriangle className="size-[16px] text-[#ba1a1a] shrink-0" />
              <span className="font-bold text-[#1b1c1a] text-[14px]">
                {department.name}
              </span>
            </div>

            <p className="text-[#514537] text-[11px] leading-[16px] text-start pt-[4px]">
              {isEn
                ? "The department will be immediately removed from organizational hierarchy and task assignment options."
                : "سيتم إزالة القسم فوراً من الهيكل التنظيمي وخيارات إسناد التذاكر والمهام لجميع المستشارين."}
            </p>
          </div>

          {/* Verification Checkbox */}
          <label className="flex items-start gap-[10px] pt-[4px] cursor-pointer text-start">
            <input
              type="checkbox"
              checked={isAcknowledged}
              onChange={(e) => setIsAcknowledged(e.target.checked)}
              className="mt-[3px] size-[15px] accent-[#ba1a1a] rounded cursor-pointer shrink-0"
            />
            <span className="text-[12px] text-[#1b1c1a] leading-[18px]">
              {isEn
                ? "I acknowledge as system administrator that I have reviewed the impact of deleting this department and there are no active pending tickets."
                : "أقرّ بصفتي مشرف نظام بأنني راجعت تبعات حذف هذا القسم ولا توجد تذاكر حية معلقة عليه."}
            </span>
          </label>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-[#eae8e4] px-[20px] py-[14px] flex items-center justify-end gap-[10px]">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#f0eeea] hover:bg-[#eae8e4] text-[#1b1c1a] px-[16px] py-[8px] rounded-[4px] font-semibold text-[12px] transition-colors cursor-pointer"
          >
            {isEn ? "Cancel" : "الغاء"}
          </button>
          <button
            type="button"
            disabled={!isAcknowledged}
            onClick={handleConfirm}
            className={`flex items-center gap-[6px] px-[22px] py-[8px] rounded-[4px] font-bold text-[12px] transition-all cursor-pointer ${
              isAcknowledged
                ? "bg-[#ba1a1a] hover:bg-[#93000a] text-[#fff3e9] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                : "bg-[#e4e2de] text-[#837565] cursor-not-allowed"
            }`}
          >
            <Trash2 className="size-[14px]" />
            <span>{isEn ? "Confirm Delete Department" : "تأكيد حذف القسم"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
