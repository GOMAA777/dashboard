"use client";

import React from "react";
import Image from "next/image";
import {
  X,
  ShieldCheck,
  Check,
  UserCheck,
  Shield,
  Lock,
} from "lucide-react";
import { Employee } from "../types/staff.types";

interface ActivateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onConfirm: () => void;
}

export function ActivateEmployeeModal({
  isOpen,
  onClose,
  employee,
  onConfirm,
}: ActivateEmployeeModalProps) {
  if (!isOpen || !employee) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      dir="rtl"
    >
      <div
        className="bg-white rounded-[12px] border border-[#e6e2dc] shadow-2xl max-w-[580px] w-full overflow-hidden"
        data-node-id="1:11022"
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
                تفعيل حساب الموظف؟
              </h2>
              <p className="text-[12px] text-[#79716b] mt-1">
                منصة الجودي • نظام إدارة طاقم العمل والصلاحيات
              </p>
            </div>

            <div className="size-[44px] rounded-[10px] bg-[#eef8f1] flex items-center justify-center shrink-0">
              <UserCheck className="size-[22px] text-[#1b7340]" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-2 space-y-4">
          {/* Employee Mini Card */}
          <div className="bg-[#fcfaf7] p-4 rounded-[8px] border border-[#f0ece5] flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fff5ea] text-[#d97706] border border-[#fed7aa]">
              <span className="size-[5px] rounded-full bg-[#d97706]" />
              موقوف حالياً
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
                <div className="absolute bottom-0 start-0 size-[14px] rounded-full bg-[#d97706] flex items-center justify-center border-2 border-white">
                  <Lock className="size-[9px] text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Info box */}
          <div className="bg-[#faf8f5] border border-[#e8e2d8] rounded-[8px] p-4 flex items-start gap-3 text-right">
            <ShieldCheck className="size-[18px] text-[#9c6402] shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#514537] leading-[21px]">
              سيتمكن الموظف من تسجيل الدخول فوراً وفقاً للصلاحيات الممنوحة لحسابه في موديول الأدوار، وإعادة تفعيل التحقق الثنائي عبر رسالة نصية قصيرة ورمز الدخول المؤقت.
            </p>
          </div>

          {/* Restored Permissions */}
          <div>
            <div className="flex items-center justify-between text-[12px] mb-2.5">
              <span className="font-bold text-[#1b1c1a]">
                الصلاحيات المستعادة تلقائياً:
              </span>
              <span className="text-[#79716b] text-[11px]">4 وحدات نظام</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                "إدارة عقود باقات الشركات",
                "إصدار عروض الأسعار",
                "سجلات التواصل بالعملاء",
                "التقارير التحليلية الشهرية",
              ].map((perm, idx) => (
                <div
                  key={idx}
                  className="bg-[#fcfaf7] p-2.5 rounded-[6px] border border-[#f0ece5] flex items-center justify-between text-[12px] text-[#1b1c1a]"
                >
                  <span>{perm}</span>
                  <div className="size-[18px] rounded-full bg-[#fbf5ed] border border-[#ebdcc8] text-[#9c6402] flex items-center justify-center shrink-0">
                    <Check className="size-[12px]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Notice */}
          <div className="bg-[#fcfaf7] border border-[#f0ece5] rounded-[8px] p-3 flex items-start gap-2.5 text-[11px] text-[#79716b] leading-[18px]">
            <Shield className="size-[14px] text-[#9c6402] shrink-0 mt-0.5" />
            <span>
              سيتم تسجيل حركة استعادة التفعيل في سجل الرقابة وتدقيق العمليات باسم المشرف العام (م. عبد العزيز بن فهد ).
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-[#f2efe9] flex items-center justify-start gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-[6px] bg-[#9e1c1c] hover:bg-[#851616] text-white text-[13px] font-bold flex items-center gap-2 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors"
          >
            <UserCheck className="size-[15px]" />
            <span>تأكيد التفعيل</span>
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
