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
import { useLanguage } from "@/lib/i18n";
import { ModalPortal } from "@/components/shared/ModalPortal";
import { cn } from "@/lib/utils";

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
  const { t, direction, isEn } = useLanguage();

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
          data-node-id="1:10312"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between border-b border-[#f0eeea] dark:border-[#2f2a24]">
          <div className="flex items-start gap-3 text-start order-1 rtl:order-2">
            <div className="size-[44px] rounded-[10px] bg-[#f5efe6] dark:bg-[#342711] flex items-center justify-center shrink-0">
              <Shield className="size-[22px] text-[#9c6402] dark:text-[#f59e0b]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[20px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("الدخول كالموظف؟", "Login as Employee?")}
                </h2>
                <span className="text-[11px] font-bold text-[#8e5927] dark:text-[#fbbf24] bg-[#fbf5ed] dark:bg-[#342711] px-2 py-0.5 rounded-[4px] border border-[#f2e2ce] dark:border-[#5c4217]">
                  {t("تفويض إشرافي", "Supervisor Delegation")}
                </span>
              </div>
              <p className="text-[12px] text-[#79716b] dark:text-[#a89f91] mt-1">
                {t(
                  "وضع محاكاة صلاحيات الحساب للدعم التشغيلي والرقابة القانونية",
                  "Permissions simulation mode for operational support and audit"
                )}
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
                <div className="absolute bottom-0 start-0 size-[14px] rounded-full bg-[#10b981] flex items-center justify-center border-2 border-white dark:border-[#2c2621]">
                  <CheckCircle2 className="size-[10px] text-white" />
                </div>
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

          {/* Info notice box */}
          <div className="bg-[#faf8f5] dark:bg-[#2c2621] border border-[#e8e2d8] dark:border-[#38271c] rounded-[8px] p-3.5 flex items-start gap-2.5 text-start">
            <Info className="size-[17px] text-[#9c6402] dark:text-[#f59e0b] shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#514537] dark:text-[#d1c9bd] leading-[20px]">
              {t(
                "ستتمكن من معاينة النظام وفقًا لصلاحيات هذا الموظف للمساعدة في تشخيص مشكلات الوصول وحل التذاكر.",
                "You will preview the dashboard with this staff member's permissions to diagnose issues and resolve tickets."
              )}
            </p>
          </div>

          {/* Security & Financial Compliance Section */}
          <div className="pt-2 text-start">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-2.5">
              <Shield className="size-[14px] text-[#9c6402] dark:text-[#f59e0b]" />
              <span>{t("ضوابط الأمان والامتثال المالي", "Security & Financial Controls")}</span>
            </div>

            <div className="space-y-2">
              <div className="bg-[#fcfaf7] dark:bg-[#2c2621] p-3 rounded-[6px] border border-[#f0ece5] dark:border-[#38271c] flex items-start gap-2.5 text-[12px] text-[#514537] dark:text-[#d1c9bd] leading-[19px]">
                <Lock className="size-[16px] text-[#d97706] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{t("وضع الحماية الإلزامية: ", "Mandatory Protection Mode: ")}</span>
                  {t(
                    "سيتم قفل أي عمليات إتلافية حساسة أو معاملات دفع تلقائياً أثناء وضع المعاينة.",
                    "Destructive actions or payment transactions are automatically locked during preview mode."
                  )}
                </div>
              </div>

              <div className="bg-[#fcfaf7] dark:bg-[#2c2621] p-3 rounded-[6px] border border-[#f0ece5] dark:border-[#38271c] flex items-start gap-2.5 text-[12px] text-[#514537] dark:text-[#d1c9bd] leading-[19px]">
                <CheckSquare className="size-[16px] text-[#10b981] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{t("توثيق الجلسة: ", "Session Audit: ")}</span>
                  {t(
                    "تُسجّل هذه الجلسة الرقابية بالكامل في سجل العمليات باسم المشرف: م. عبد العزيز بن فهد.",
                    "This supervisory session is logged in audit records under supervisor: Eng. Abdulaziz bin Fahd."
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#fcfaf7] dark:bg-[#25221e] border-t border-[#f2efe9] dark:border-[#2f2a24] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-[6px] bg-[#f5f3ef] dark:bg-[#2c2621] hover:bg-[#eae6e0] text-[#514537] dark:text-[#a89f91] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            {t("إلغاء", "Cancel")}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-[6px] bg-[#9c6402] hover:bg-[#855402] text-white text-[13px] font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className={cn("size-[15px]", isEn && "rotate-180")} />
            <span>{t("بدء المعاينة", "Start Preview")}</span>
          </button>
        </div>
      </div>
    </div>
  </ModalPortal>
  );
}