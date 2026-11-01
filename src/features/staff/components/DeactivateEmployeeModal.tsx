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
import { useLanguage } from "@/lib/i18n";
import { ModalPortal } from "@/components/shared/ModalPortal";

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
  const { t, direction } = useLanguage();
  const [reason, setReason] = useState("");

  if (!isOpen || !employee) return null;

  return (
    <ModalPortal isOpen={isOpen}>
      <div
        dir={direction}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200 font-['Cairo']"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="bg-white dark:bg-[#1e1c1a] rounded-[12px] border border-[#e6e2dc] dark:border-[#38271c] shadow-2xl max-w-[580px] w-full overflow-hidden"
          data-node-id="1:10949"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between border-b border-[#f0eeea] dark:border-[#2f2a24]">
          <div className="flex items-start gap-3 text-start order-1 rtl:order-2">
            <div className="size-[44px] rounded-[10px] bg-[#fee2e2] dark:bg-[#311616] flex items-center justify-center shrink-0">
              <Ban className="size-[22px] text-[#b91c1c] dark:text-[#f87171]" />
            </div>

            <div>
              <h2 className="text-[20px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("إيقاف حساب الموظف؟", "Suspend Employee Account?")}
              </h2>
              <p className="text-[12px] text-[#79716b] dark:text-[#a89f91] mt-1">
                {t("منصة الجودي • نظام إدارة طاقم العمل والصلاحيات", "Al-Joudi Platform • Staff & Permissions Governance")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-[32px] rounded-[6px] hover:bg-[#f5f3ef] dark:hover:bg-[#2c2621] text-[#79716b] dark:text-[#a89f91] flex items-center justify-center transition-colors cursor-pointer order-2 rtl:order-1"
          >
            <X className="size-[18px]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Employee Mini Card */}
          <div className="bg-[#fcfaf7] dark:bg-[#2c2621] p-4 rounded-[8px] border border-[#f0ece5] dark:border-[#38271c] flex items-center justify-between">
            <div className="flex items-center gap-3">
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
              </div>

              <div className="text-start">
                <h3 className="font-bold text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {employee.name}
                </h3>
                <span className="text-[11px] text-[#79716b] dark:text-[#a89f91] block">
                  {employee.empCode} • {employee.jobTitle}
                </span>
                <span className="text-[11px] text-[#79716b] dark:text-[#a89f91] font-mono block mt-0.5" dir="ltr">
                  {employee.email}
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#e8f5e9] dark:bg-[#132c1c] text-[#1b7340] dark:text-[#34d399] border border-[#c8e6c9] dark:border-emerald-500/40">
              <span className="size-[5px] rounded-full bg-[#1b7340]" />
              {t("نشط", "Active")}
            </span>
          </div>

          <div className="p-4 bg-[#fff1f2] dark:bg-[#38141b] border border-[#fecdd3] dark:border-[#5a1b26] rounded-[8px] flex items-start gap-3 text-start">
            <AlertTriangle className="size-[20px] text-[#be123c] shrink-0 mt-0.5" />
            <div className="text-[12px] text-[#9f1239] dark:text-[#fb7185] leading-relaxed">
              <span className="font-bold block text-[13px] mb-1">
                {t("تجميد فوري لصلاحيات الدخول", "Immediate Access Suspension")}
              </span>
              {t(
                "سيتم إنهاء الجلسة المفتوحة حالياً للموظف ومنعه من الدخول للوحة التحكم لحين إعادة تفعيل الحساب بقرار إداري.",
                "The current session will terminate immediately, and login access will be blocked until reinstated."
              )}
            </div>
          </div>

          <div className="space-y-1.5 text-start">
            <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] block">
              {t("سبب الإيقاف الإداري (اختياري)", "Suspension Reason (Optional)")}
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t("اكتب سبب الإيقاف أو ملحوظة للتدقيق الداخلي...", "Enter suspension reason or audit note...")}
              className="w-full p-2.5 text-[12px] bg-[#fdfbf7] dark:bg-[#2c2621] border border-[#d6cfc7] dark:border-[#38332c] rounded-[6px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#948b83] focus:outline-none focus:ring-1 focus:ring-[#ba1a1a] resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#fcfaf7] dark:bg-[#25221e] border-t border-[#f0eeea] dark:border-[#2f2a24] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#f0eeea] dark:bg-[#2c2621] hover:bg-[#e6e2dc] text-[#514537] dark:text-[#a89f91] rounded-[6px] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            {t("إلغاء", "Cancel")}
          </button>

          <button
            type="button"
            onClick={() => onConfirm(reason)}
            className="px-5 py-2.5 bg-[#ba1a1a] hover:bg-[#991b1b] text-white rounded-[6px] text-[13px] font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Ban className="size-[15px]" />
            <span>{t("تأكيد إيقاف الحساب", "Confirm Suspension")}</span>
          </button>
        </div>
      </div>
    </div>
  </ModalPortal>
  );
}