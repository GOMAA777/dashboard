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
import { useLanguage } from "@/lib/i18n";
import { ModalPortal } from "@/components/shared/ModalPortal";

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
  const { t, direction } = useLanguage();

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
          className="bg-white dark:bg-[#221812] rounded-[12px] border border-[#e6e2dc] dark:border-[#38271c] shadow-2xl max-w-[580px] w-full overflow-hidden"
          data-node-id="1:11022"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between border-b border-[#f0eeea] dark:border-[#38271c]">
          <div className="flex items-start gap-3 text-start order-1 rtl:order-2">
            <div className="size-[44px] rounded-[10px] bg-[#eef8f1] dark:bg-[#132c21] flex items-center justify-center shrink-0">
              <UserCheck className="size-[22px] text-[#1b7340] dark:text-[#34d399]" />
            </div>

            <div>
              <h2 className="text-[20px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("تفعيل حساب الموظف؟", "Activate Employee Account?")}
              </h2>
              <p className="text-[12px] text-[#79716b] dark:text-[#a89f91] mt-1">
                {t("منصة الجودي • نظام إدارة طاقم العمل والصلاحيات", "Al-Joudi Platform • Staff & Permissions Governance")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-[32px] rounded-[6px] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] text-[#79716b] dark:text-[#a89f91] flex items-center justify-center transition-colors cursor-pointer order-2 rtl:order-1"
          >
            <X className="size-[18px]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Employee Mini Card */}
          <div className="bg-[#fcfaf7] dark:bg-[#281c15] p-4 rounded-[8px] border border-[#f0ece5] dark:border-[#38271c] flex items-center justify-between">
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

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fff5ea] dark:bg-[#341e13] text-[#d97706] dark:text-[#fbbf24] border border-[#fed7aa] dark:border-[#542918]">
              <span className="size-[5px] rounded-full bg-[#d97706]" />
              {t("موقوف حالياً", "Currently Suspended")}
            </span>
          </div>

          <div className="p-4 bg-[#f0fdf4] dark:bg-[#132c21] border border-[#bbf7d0] dark:border-[#1e4a36] rounded-[8px] flex items-start gap-3 text-start">
            <ShieldCheck className="size-[20px] text-[#16a34a] shrink-0 mt-0.5" />
            <div className="text-[12px] text-[#166534] dark:text-[#86efac] leading-relaxed">
              <span className="font-bold block text-[13px] mb-1">
                {t("إعادة تفعيل الصلاحيات التشغيلية", "Reactivate Operational Permissions")}
              </span>
              {t(
                "عند تأكيد التفعيل، سيتم استئناف قدرة الموظف على تسجيل الدخول فوراً وممارسة كافة الصلاحيات المرتبطة بدوره الوظيفي.",
                "Upon confirmation, employee login access will resume immediately along with all permissions associated with their role."
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#fcfaf7] dark:bg-[#221812] border-t border-[#f0eeea] dark:border-[#38271c] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#f0eeea] dark:bg-[#281c15] hover:bg-[#e6e2dc] text-[#514537] dark:text-[#a89f91] rounded-[6px] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            {t("إلغاء", "Cancel")}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 bg-[#1b7340] hover:bg-[#145a32] text-white rounded-[6px] text-[13px] font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Check className="size-[15px]" />
            <span>{t("تأكيد تفعيل الحساب", "Confirm Account Activation")}</span>
          </button>
        </div>
      </div>
    </div>
  </ModalPortal>
  );
}