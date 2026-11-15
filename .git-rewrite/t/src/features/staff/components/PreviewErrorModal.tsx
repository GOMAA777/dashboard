"use client";

import React from "react";
import Image from "next/image";
import {
  X,
  RotateCcw,
  AlertCircle,
  XCircle,
  ShieldAlert,
  Lightbulb,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { Employee } from "../types/staff.types";

interface PreviewErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onViewEmployee: () => void;
}

export function PreviewErrorModal({
  isOpen,
  onClose,
  employee,
  onViewEmployee,
}: PreviewErrorModalProps) {
  if (!isOpen || !employee) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      dir="rtl"
    >
      <div
        className="bg-white rounded-[12px] border border-[#e6e2dc] shadow-2xl max-w-[620px] w-full overflow-hidden"
        data-node-id="1:10821"
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
              <div className="flex items-center gap-2 justify-end">
                <span className="text-[11px] font-bold text-[#b91c1c] bg-[#fef2f2] px-2.5 py-0.5 rounded-[4px] border border-[#fecaca]">
                  ● تم رفض الوصول الرقابي
                </span>
                <h2 className="text-[20px] font-bold text-[#1b1c1a]">
                  تعذر بدء المعاينة
                </h2>
              </div>
              <p className="text-[12px] text-[#79716b] mt-1">
                مقيّد بموجب سياسات الحوكمة المؤسسية والأمن السيبراني لمنصة الجودي
              </p>
            </div>

            <div className="size-[44px] rounded-[10px] bg-[#fee2e2] flex items-center justify-center shrink-0">
              <RotateCcw className="size-[22px] text-[#b91c1c]" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-2 space-y-4">
          {/* Employee Card */}
          <div className="bg-[#fcfaf7] p-4 rounded-[8px] border border-[#f0ece5] flex items-center justify-between">
            <div className="text-left">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fff5ea] text-[#d97706] border border-[#fed7aa]">
                <span className="size-[5px] rounded-full bg-[#d97706]" />
                حساب موقوف
              </span>
              <span className="text-[10px] text-[#79716b] block mt-1">
                تاريخ الإيقاف: 18 ربيع الأول 1446
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <h3 className="font-bold text-[14px] text-[#1b1c1a]">
                  {employee.name}
                </h3>
                <span className="text-[11px] text-[#79716b] block">
                  #{employee.empCode} • {employee.jobTitle}
                </span>
              </div>

              <div className="size-[48px] rounded-[10px] bg-[#ebe8e2] text-[#79716b] flex items-center justify-center font-bold text-[16px] shrink-0 relative overflow-hidden">
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
                <div className="absolute bottom-0 start-0 size-[14px] rounded-full bg-[#b91c1c] flex items-center justify-center border-2 border-white">
                  <Lock className="size-[9px] text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Reasons List */}
          <div className="bg-[#fcfaf7] border border-[#f0ece5] rounded-[8px] p-4 text-right">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#b91c1c] mb-3">
              <AlertCircle className="size-[15px]" />
              <span>أسباب رفض الدخول والمحاكاة الرقابية:</span>
            </div>

            <div className="space-y-2.5 text-[12px] text-[#514537] leading-[20px]">
              <div className="flex items-start gap-2">
                <XCircle className="size-[15px] text-[#b91c1c] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1b1c1a]">حالة الحساب: </span>
                  الحساب معلق حالياً بموجب قرار رقابي أو انتهاء صلاحية الجلسة المعتمدة.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <ShieldAlert className="size-[15px] text-[#9c6402] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1b1c1a]">السياسة الأمنية (Gov-Sec 402): </span>
                  تمنع ضوابط الحوكمة والأمن السيبراني الدخول الرقابي على الحسابات غير المفعلة لتفادي تضارب الصلاحيات، وحماية سلامة سجلات التدقيق العدلي.
                </div>
              </div>
            </div>
          </div>

          {/* Corrective Action Box */}
          <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-[8px] p-4 flex items-start gap-3 text-right">
            <Lightbulb className="size-[18px] text-[#d97706] shrink-0 mt-0.5" />
            <div className="text-[12px] text-[#92400e] leading-[20px]">
              <span className="font-bold block mb-0.5">الإجراء التصحيحي الموصى به</span>
              لتشخيص الصلاحيات، يرجى تفعيل الحساب أولاً من صفحة تعديل الموظف أو مراجعة مسؤول الامتثال والحوكمة لإصدار إذن استثنائي مؤقت.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-[#f2efe9] flex items-center justify-start gap-3">
          <button
            type="button"
            onClick={onViewEmployee}
            className="px-5 py-2.5 rounded-[6px] bg-[#9c6402] hover:bg-[#855402] text-white text-[13px] font-bold flex items-center gap-2 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors"
          >
            <span>العودة لملف الموظف</span>
            <ArrowLeft className="size-[15px]" />
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
