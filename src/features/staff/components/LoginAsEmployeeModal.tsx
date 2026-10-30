"use client";

import React from "react";
import Image from "next/image";
import {
  X,
  Shield,
  Info,
  Lock,
  CheckSquare,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { Employee } from "../types/staff.types";

interface LoginAsEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onConfirm: () => void;
}

export function LoginAsEmployeeModal({
  isOpen,
  onClose,
  employee,
  onConfirm,
}: LoginAsEmployeeModalProps) {
  if (!isOpen || !employee) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        className="bg-white rounded-[12px] border border-[#e6e2dc] shadow-2xl max-w-[580px] w-full overflow-hidden"
        data-node-id="1:10312"
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

          <div className="flex items-start gap-3 text-start">
            <div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-[11px] font-bold text-[#8e5927] bg-[#fbf5ed] px-2 py-0.5 rounded-[4px] border border-[#f2e2ce]">
                  تفويض إشرافي
                </span>
                <h2 className="text-[20px] font-bold text-[#1b1c1a]">
                  الدخول كالموظف؟
                </h2>
              </div>
              <p className="text-[12px] text-[#79716b] mt-1">
                وضع محاكاة صلاحيات الحساب للدعم التشغيلي والرقابة القانونية
              </p>
            </div>

            <div className="size-[44px] rounded-[10px] bg-[#f5efe6] flex items-center justify-center shrink-0">
              <Shield className="size-[22px] text-[#9c6402]" />
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
              <div className="text-start">
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

          {/* Info notice box */}
          <div className="bg-[#faf8f5] border border-[#e8e2d8] rounded-[8px] p-3.5 flex items-start gap-2.5 text-start">
            <Info className="size-[17px] text-[#9c6402] shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#514537] leading-[20px]">
              ستتمكن من معاينة النظام وفقًا لصلاحيات هذا الموظف للمساعدة في تشخيص مشكلات الوصول وحل التذاكر.
            </p>
          </div>

          {/* Security & Financial Compliance Section */}
          <div className="pt-2">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#1b1c1a] mb-2.5">
              <Shield className="size-[14px] text-[#9c6402]" />
              <span>ضوابط الأمان والامتثال المالي</span>
            </div>

            <div className="space-y-2">
              <div className="bg-[#fcfaf7] p-3 rounded-[6px] border border-[#f0ece5] flex items-start gap-2.5 text-[12px] text-[#514537] leading-[19px]">
                <Lock className="size-[16px] text-[#d97706] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1b1c1a]">وضع الحماية الإلزامية: </span>
                  سيتم قفل أي عمليات إتلافية حساسة أو معاملات دفع تلقائياً أثناء وضع المعاينة.
                </div>
              </div>

              <div className="bg-[#fcfaf7] p-3 rounded-[6px] border border-[#f0ece5] flex items-start gap-2.5 text-[12px] text-[#514537] leading-[19px]">
                <CheckSquare className="size-[16px] text-[#10b981] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1b1c1a]">توثيق الجلسة: </span>
                  تُسجّل هذه الجلسة الرقابية بالكامل في سجل العمليات باسم المشرف:{" "}
                  <span className="font-bold text-[#1b1c1a]">م. عبد العزيز بن فهد</span>.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-[#f2efe9] flex items-center justify-start gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-[6px] bg-[#9c6402] hover:bg-[#855402] text-white text-[13px] font-bold flex items-center gap-2 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-[15px] rtl:rotate-0 ltr:rotate-180" />
            <span>بدء المعاينة</span>
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
