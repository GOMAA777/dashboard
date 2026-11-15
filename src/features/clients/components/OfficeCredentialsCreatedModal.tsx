"use client";

import React, { useState } from "react";
import { X, Check, Copy, KeyRound, ShieldAlert, CheckCircle2 } from "lucide-react";
import { ModalPortal } from "@/components/shared/ModalPortal";
import { useLanguage } from "@/lib/i18n";
import { toast } from "sonner";

interface OfficeCredentialsCreatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  officeName: string;
  ownerName: string;
  email: string;
  password: string;
}

export function OfficeCredentialsCreatedModal({
  isOpen,
  onClose,
  officeName,
  ownerName,
  email,
  password,
}: OfficeCredentialsCreatedModalProps) {
  const { t } = useLanguage();
  const [copiedField, setCopiedField] = useState<"all" | "email" | "password" | null>(null);

  if (!isOpen) return null;

  const handleCopy = async (text: string, field: "all" | "email" | "password") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(t("تم النسخ إلى الحافظة بنجاح", "Copied to clipboard successfully"));
      setTimeout(() => setCopiedField(null), 2500);
    } catch {
      toast.error(t("تعذر النسخ تلقائياً", "Failed to copy"));
    }
  };

  const fullCredentialsText = `بيانات تسجيل دخول مكتب المحاماة:
المكتب: ${officeName}
المسؤول: ${ownerName}
البريد الإلكتروني: ${email}
كلمة المرور: ${password}
رابط الدخول: https://law.elmoroj.com/lawyer/login`;

  return (
    <ModalPortal isOpen={isOpen}>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-['Cairo',sans-serif]"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="relative w-full max-w-[520px] bg-white dark:bg-[#1f1a16] rounded-[14px] p-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.35)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col gap-[20px] animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between w-full">
            <button
              type="button"
              onClick={onClose}
              className="p-[6px] rounded-[6px] hover:bg-[#f5f3ef] dark:hover:bg-[#2c221a] text-[#837565] hover:text-[#1b1c1a] dark:text-[#a89f91] dark:hover:text-[#fdfbf7] transition-colors cursor-pointer"
            >
              <X className="size-[18px]" />
            </button>

            <div className="flex items-center gap-[12px] text-end">
              <div>
                <h3 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("بيانات دخول حساب المكتب الجديد", "New Office Login Credentials")}
                </h3>
                <p className="text-[12px] text-[#837565] dark:text-[#a89f91]">
                  {officeName}
                </p>
              </div>
              <div className="size-[40px] rounded-[10px] bg-[#ecfdf5] dark:bg-[#132c1c] border border-[#a7f3d0] dark:border-[#1b7340]/40 flex items-center justify-center text-[#10b981] shrink-0">
                <CheckCircle2 className="size-[22px]" />
              </div>
            </div>
          </div>

          {/* Security Alert Banner */}
          <div className="p-3.5 rounded-[8px] bg-[#fffbeb] dark:bg-[rgba(226,157,56,0.12)] border border-[#fde68a] dark:border-[#e29d38]/30 flex items-start gap-2.5">
            <ShieldAlert className="size-[18px] text-[#b45309] dark:text-[#f3c27e] shrink-0 mt-0.5" />
            <div className="text-[12px] text-[#92400e] dark:text-[#f3c27e] leading-relaxed">
              <span className="font-bold">{t("تنبيه أمني هام: ", "Important Security Notice: ")}</span>
              {t(
                "احفظ كلمة المرور الآن وانسخها لمشاركتها مع صاحب المكتب. لن يتم عرض كلمة المرور مرة أخرى في أي مكان لدواعي الأمان والخصوصية.",
                "Please copy and save the password now to share with the office owner. It will never be displayed again for security and privacy reasons."
              )}
            </div>
          </div>

          {/* Credentials Display Boxes */}
          <div className="space-y-3">
            {/* Email Field */}
            <div>
              <label className="block text-[12px] font-semibold text-[#514537] dark:text-[#a89f91] mb-1">
                {t("البريد الإلكتروني لتسجيل الدخول", "Login Email")}
              </label>
              <div className="flex items-center justify-between p-2.5 px-3 bg-[#f5f3ef] dark:bg-[#160e0a] rounded-[8px] border border-[#e5e0d8] dark:border-[#38271c]">
                <button
                  type="button"
                  onClick={() => handleCopy(email, "email")}
                  className="p-1.5 rounded-[4px] hover:bg-white dark:hover:bg-[#2c221a] text-[#837565] hover:text-[#9c6402] dark:hover:text-[#e29d38] transition-colors"
                  title={t("نسخ البريد الإلكتروني", "Copy email")}
                >
                  {copiedField === "email" ? (
                    <Check className="size-4 text-[#10b981]" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
                <span className="font-mono text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] select-all" dir="ltr">
                  {email}
                </span>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[12px] font-semibold text-[#514537] dark:text-[#a89f91] mb-1">
                {t("كلمة المرور الأولية", "Initial Password")}
              </label>
              <div className="flex items-center justify-between p-2.5 px-3 bg-[#f5f3ef] dark:bg-[#160e0a] rounded-[8px] border border-[#e5e0d8] dark:border-[#38271c]">
                <button
                  type="button"
                  onClick={() => handleCopy(password, "password")}
                  className="p-1.5 rounded-[4px] hover:bg-white dark:hover:bg-[#2c221a] text-[#837565] hover:text-[#9c6402] dark:hover:text-[#e29d38] transition-colors"
                  title={t("نسخ كلمة المرور", "Copy password")}
                >
                  {copiedField === "password" ? (
                    <Check className="size-4 text-[#10b981]" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
                <span className="font-mono text-[14px] font-bold text-[#9c6402] dark:text-[#e29d38] select-all tracking-wider" dir="ltr">
                  {password}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2 border-t border-[#eae8e4] dark:border-[#38271c]">
            <button
              type="button"
              onClick={() => handleCopy(fullCredentialsText, "all")}
              className="flex-1 h-[42px] rounded-[8px] bg-[#9c6402] hover:bg-[#825301] text-white font-semibold text-[13px] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              {copiedField === "all" ? (
                <>
                  <Check className="size-4" />
                  <span>{t("تم نسخ كامل البيانات", "All Credentials Copied")}</span>
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  <span>{t("نسخ بيانات الدخول كاملة", "Copy All Credentials")}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-[42px] px-5 rounded-[8px] border border-[#d5cfc4] dark:border-[#4d382c] text-[#514537] dark:text-[#cfc7be] hover:bg-[#f5f3ef] dark:hover:bg-[#2c221a] font-medium text-[13px] transition-colors cursor-pointer"
            >
              {t("تم الحفظ والإغلاق", "Saved & Close")}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
