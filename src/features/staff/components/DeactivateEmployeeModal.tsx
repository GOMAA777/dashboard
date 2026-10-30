"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Ban,
  AlertTriangle,
  Lock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Employee } from "../types/staff.types";

interface DeactivateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onConfirm: (reason: string) => void;
}

export function DeactivateEmployeeModal({
  isOpen,
  onClose,
  employee,
  onConfirm,
}: DeactivateEmployeeModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen || !employee) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      dir="rtl"
    >
      <div
        className="bg-white rounded-[12px] border border-[#e6e2dc] shadow-2xl max-w-[580px] w-full overflow-hidden"
        data-node-id="1:10949"
      >
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between">
          <button
            type="button"
            onClick={onClose}
            className="size-[32px] rounded-[6px] hover:bg-[#f5f3ef] text-[#79716b] flex items-center justify-center transition-colors"
          >
            <X className="size-[18px]" />
          </button>

          <div className="flex items-start gap-3 text-right">
            <div>
              <h2 className="text-[20px] font-bold text-[#1b1c1a]">
                إيقاف حساب الموظف؟
              </h2>
              <p className="text-[12px] text-[#79716b] mt-1">
                منصة الجودي • نظام إدارة طاقم العمل والصلاحيات
              </p>
            </div>

            <div className="size-[44px] rounded-[10px] bg-[#fee2e2] flex items-center justify-center shrink-0">
              <Ban className="size-[22px] text-[#b91c1c]" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-2 space-y-4">
          {/* Employee Mini Card */}
          <div className="bg-[#fcfaf7] p-4 rounded-[8px] border border-[#f0ece5] flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#e8f5e9] text-[#1b7340] border border-[#c8e6c9]">
              <span className="size-[5px] rounded-full bg-[#1b7340]" />
              نشط
            </span>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <h3 className="font-bold text-[14px] text-[#1b1c1a]">
                  {employee.name}
                </h3>
                <span className="text-[11px] text-[#79716b] block">
                  {employee.empCode} • {employee.jobTitle}
                </span>
                <span className="text-[11px] text-[#79716b] font-mono block mt-0.5" dir="ltr">
                  {employee.email}
                </span>
              </div>

              <div
                className={`size-[48px] rounded-[10px] flex items-center justify-center font-bold text-[16px] shrink-0 relative overflow-hidden ${employee.avatarBg} ${employee.avatarText}`}
              >
                {employee.avatarImage ? (
                  <Image
                    src={employee.avatarImage}
                    alt={employee.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  employee.initials
                )}
                <div className="absolute bottom-0 start-0 size-[14px] rounded-full bg-[#10b981] flex items-center justify-center border-2 border-white">
                  <CheckCircle2 className="size-[10px] text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="bg-[#fef2f2] border border-[#fee2e2] rounded-[8px] p-4 flex items-start gap-3 text-right">
            <AlertTriangle className="size-[18px] text-[#b91c1c] shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#991b1b] leading-[20px]">
              لن يتمكن الموظف من تسجيل الدخول إلى النظام بعد إيقاف حسابه فورياً، مع تعليق كافة الصلاحيات والجلسات النشطة وإنهاء جلسات الويب والجوال المفتوحة.
            </p>
          </div>

          {/* Reason Textarea */}
          <div className="text-right">
            <div className="flex items-center justify-between text-[12px] font-bold text-[#1b1c1a] mb-1.5">
              <span>سبب الإيقاف (اختياري)</span>
              <span className="text-[11px] font-normal text-[#79716b]">
                {reason.length} / 250
              </span>
            </div>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, 250))}
              placeholder="اكتب سبب إيقاف الحساب للتوثيق في سجل التدقيق (اختياري)..."
              rows={3}
              className="w-full p-3 text-[13px] bg-[#fdfbf7] border border-[#d6cfc7] rounded-[6px] text-[#1b1c1a] placeholder:text-[#948b83] focus:outline-none focus:ring-1 focus:ring-[#b91c1c] focus:border-[#b91c1c] resize-none"
            />
          </div>

          {/* Retention notice */}
          <div className="flex items-center gap-2 text-[12px] text-[#514537]">
            <ShieldCheck className="size-[16px] text-[#10b981] shrink-0" />
            <span>سيتم الاحتفاظ بكافة بيانات الموظف وسجل العمليات والنشاط السابق دون حذف.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-[#f2efe9] flex items-center justify-start gap-3">
          <button
            type="button"
            onClick={() => onConfirm(reason)}
            className="px-5 py-2.5 rounded-[6px] bg-[#b91c1c] hover:bg-[#991b1b] text-white text-[13px] font-bold flex items-center gap-2 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors"
          >
            <Lock className="size-[15px]" />
            <span>تأكيد الإيقاف</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-[6px] bg-[#f5f3ef] hover:bg-[#eae6e0] text-[#514537] text-[13px] font-semibold transition-colors"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
