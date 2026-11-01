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
import { useLanguage } from "@/lib/i18n";
import { ModalPortal } from "@/components/shared/ModalPortal";
import { cn } from "@/lib/utils";

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
  const { t, isEn, direction } = useLanguage();

  if (!isOpen || !employee) return null;

  return (
    <ModalPortal isOpen={isOpen}>
      <div
        dir={direction}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="bg-white rounded-[12px] border border-[#e6e2dc] shadow-2xl max-w-[620px] w-full overflow-hidden"
          data-node-id="1:10821"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between">
          <div className="flex items-start gap-3 text-start">
            <div className="size-[44px] rounded-[10px] bg-[#fee2e2] flex items-center justify-center shrink-0">
              <RotateCcw className="size-[22px] text-[#b91c1c]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[20px] font-bold text-[#1b1c1a]">
                  {t("تعذر بدء المعاينة", "Unable to Start Preview")}
                </h2>
                <span className="text-[11px] font-bold text-[#b91c1c] bg-[#fef2f2] px-2.5 py-0.5 rounded-[4px] border border-[#fecaca]">
                  {t("● تم رفض الوصول الرقابي", "● Audit Access Denied")}
                </span>
              </div>
              <p className="text-[12px] text-[#79716b] mt-1">
                {t(
                  "مقيّد بموجب سياسات الحوكمة المؤسسية والأمن السيبراني لمنصة الجودي",
                  "Restricted under institutional governance & cybersecurity policies of Al-Judy"
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-[32px] rounded-[6px] hover:bg-[#f5f3ef] text-[#79716b] flex items-center justify-center transition-colors"
          >
            <X className="size-[18px]" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-2 space-y-4">
          {/* Employee Card */}
          <div className="bg-[#fcfaf7] p-4 rounded-[8px] border border-[#f0ece5] flex items-center justify-between">
            <div className="flex items-center gap-3">
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

              <div className="text-start">
                <h3 className="font-bold text-[14px] text-[#1b1c1a]">
                  {employee.name}
                </h3>
                <span className="text-[11px] text-[#79716b] block">
                  #{employee.empCode} • {employee.jobTitle}
                </span>
              </div>
            </div>

            <div className="text-end">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fff5ea] text-[#d97706] border border-[#fed7aa]">
                <span className="size-[5px] rounded-full bg-[#d97706]" />
                {t("حساب موقوف", "Suspended Account")}
              </span>
              <span className="text-[10px] text-[#79716b] block mt-1">
                {t("تاريخ الإيقاف: 18 ربيع الأول 1446", "Suspension Date: 18 Rabi' I 1446")}
              </span>
            </div>
          </div>

          {/* Reasons List */}
          <div className="bg-[#fcfaf7] border border-[#f0ece5] rounded-[8px] p-4 text-start">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#b91c1c] mb-3">
              <AlertCircle className="size-[15px]" />
              <span>{t("أسباب رفض الدخول والمحاكاة الرقابية:", "Reasons for Denying Access & Simulation:")}</span>
            </div>

            <div className="space-y-2.5 text-[12px] text-[#514537] leading-[20px]">
              <div className="flex items-start gap-2">
                <XCircle className="size-[15px] text-[#b91c1c] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1b1c1a]">{t("حالة الحساب: ", "Account Status: ")}</span>
                  {t(
                    "الحساب معلق حالياً بموجب قرار رقابي أو انتهاء صلاحية الجلسة المعتمدة.",
                    "The account is currently suspended by regulatory decision or expired session."
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2">
                <ShieldAlert className="size-[15px] text-[#9c6402] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1b1c1a]">{t("السياسة الأمنية (Gov-Sec 402): ", "Security Policy (Gov-Sec 402): ")}</span>
                  {t(
                    "تمنع ضوابط الحوكمة والأمن السيبراني الدخول الرقابي على الحسابات غير المفعلة لتفادي تضارب الصلاحيات، وحماية سلامة سجلات التدقيق العدلي.",
                    "Governance and cybersecurity controls prevent audit login on inactive accounts to prevent privilege collision and protect legal audit integrity."
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Corrective Action Box */}
          <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-[8px] p-4 flex items-start gap-3 text-start">
            <Lightbulb className="size-[18px] text-[#d97706] shrink-0 mt-0.5" />
            <div className="text-[12px] text-[#92400e] leading-[20px]">
              <span className="font-bold block mb-0.5">{t("الإجراء التصحيحي الموصى به", "Recommended Corrective Action")}</span>
              {t(
                "لتشخيص الصلاحيات، يرجى تفعيل الحساب أولاً من صفحة تعديل الموظف أو مراجعة مسؤول الامتثال والحوكمة لإصدار إذن استثنائي مؤقت.",
                "To diagnose permissions, please activate the account first from employee edit page or contact compliance officer for temporary exception."
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-[#f2efe9] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-[6px] bg-[#f5f3ef] hover:bg-[#eae6e0] text-[#514537] text-[13px] font-semibold transition-colors"
          >
            {t("إلغاء", "Cancel")}
          </button>

          <button
            type="button"
            onClick={onViewEmployee}
            className="px-5 py-2.5 rounded-[6px] bg-[#9c6402] hover:bg-[#855402] text-white text-[13px] font-bold flex items-center gap-2 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors cursor-pointer"
          >
            <ArrowLeft className={cn("size-[15px]", isEn && "rotate-180")} />
            <span>{t("العودة لملف الموظف", "Back to Employee Profile")}</span>
          </button>
        </div>
      </div>
    </div>
  </ModalPortal>
  );
}