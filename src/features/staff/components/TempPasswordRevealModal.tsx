"use client";

import React, { useState } from "react";
import { X, KeyRound, Copy, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { ModalPortal } from "@/components/shared/ModalPortal";
import { useLanguage } from "@/lib/i18n";

interface TempPasswordRevealModalProps {
  isOpen: boolean;
  password: string;
  employeeName: string;
  employeeEmail?: string;
  title?: string;
  onClose: () => void;
}

export function TempPasswordRevealModal({
  isOpen,
  password,
  employeeName,
  employeeEmail,
  title,
  onClose,
}: TempPasswordRevealModalProps) {
  const { t } = useLanguage();
  const [copiedField, setCopiedField] = useState<"email" | "password" | "all" | null>(null);

  if (!isOpen || !password) return null;

  const handleCopy = async (text: string, field: "email" | "password" | "all") => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(t("تم النسخ إلى الحافظة بنجاح", "Copied to clipboard successfully"));
      setTimeout(() => setCopiedField(null), 2500);
    } catch {
      toast.error(t("تعذر النسخ", "Copy failed"));
    }
  };

  const handleClose = () => {
    setCopiedField(null);
    onClose();
  };

  const fullCredentialsText = [
    employeeName ? `${t("الموظف", "Employee")}: ${employeeName}` : "",
    employeeEmail ? `${t("البريد الإلكتروني", "Email")}: ${employeeEmail}` : "",
    `${t("كلمة المرور", "Password")}: ${password}`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <ModalPortal isOpen={isOpen}>
      <div
        dir="rtl"
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-['Cairo',sans-serif]"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <div
          className="relative w-full max-w-[480px] bg-white dark:bg-[#1f1a16] rounded-[14px] p-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.35)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col gap-[18px] animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between w-full">
            <button
              type="button"
              onClick={handleClose}
              className="p-[6px] rounded-[6px] hover:bg-[#f5f3ef] dark:hover:bg-[#2c221a] text-[#837565] hover:text-[#1b1c1a] dark:text-[#a89f91] dark:hover:text-[#fdfbf7] transition-colors cursor-pointer"
            >
              <X className="size-[18px]" />
            </button>

            <div className="flex items-center gap-[12px] text-end">
              <div>
                <h3 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {title || t("كلمة المرور المؤقتة", "Temporary Password")}
                </h3>
                <p className="text-[12px] text-[#837565] dark:text-[#a89f91]">
                  {employeeName}
                  {employeeEmail ? ` (${employeeEmail})` : ""}
                </p>
              </div>
              <div className="size-[40px] rounded-[10px] bg-[#fff9ee] dark:bg-[rgba(226,157,56,0.15)] border border-[#fde68a] dark:border-[#e29d38]/40 flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
                <KeyRound className="size-[20px]" />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-[8px] bg-[#fff7ed] dark:bg-[#2b1c11] border border-[#fde68a] dark:border-[#e29d38]/30 flex items-start gap-2.5">
            <AlertTriangle className="size-4 text-[#9c6402] dark:text-[#e29d38] shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#7c4a02] dark:text-[#f3c27e] leading-relaxed">
              {t(
                "اعرض هذه الكلمة مرة واحدة فقط، وانسخها الآن وأبلغ بها الموظف. لن تظهر مرة أخرى، وسيُطلب منه تغييرها عند أول دخول.",
                "This password is shown once. Copy it now and share it with the employee. It will not appear again, and they must change it on first login."
              )}
            </p>
          </div>

          <div className="space-y-3">
            {employeeEmail ? (
              <div>
                <label className="block text-[12px] font-semibold text-[#514537] dark:text-[#a89f91] mb-1.5">
                  {t("البريد الإلكتروني", "Email")}
                </label>
                <div className="flex items-center justify-between gap-2 p-2.5 px-3 bg-[#f5f3ef] dark:bg-[#160e0a] rounded-[8px] border border-[#e5e0d8] dark:border-[#38271c]">
                  <button
                    type="button"
                    onClick={() => handleCopy(employeeEmail, "email")}
                    className="inline-flex items-center gap-1.5 h-9 px-3 rounded-[6px] bg-[#9c6402] hover:bg-[#825301] text-white text-[12px] font-semibold transition-colors cursor-pointer shrink-0"
                    title={t("نسخ البريد الإلكتروني", "Copy email")}
                  >
                    {copiedField === "email" ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    <span>{copiedField === "email" ? t("تم النسخ", "Copied") : t("نسخ", "Copy")}</span>
                  </button>
                  <span
                    className="font-mono text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] select-all text-end break-all"
                    dir="ltr"
                  >
                    {employeeEmail}
                  </span>
                </div>
              </div>
            ) : null}

            <div>
              <label className="block text-[12px] font-semibold text-[#514537] dark:text-[#a89f91] mb-1.5">
                {t("كلمة المرور المؤقتة", "Temporary password")}
              </label>
              <div className="flex items-center justify-between gap-2 p-2.5 px-3 bg-[#f5f3ef] dark:bg-[#160e0a] rounded-[8px] border border-[#e5e0d8] dark:border-[#38271c]">
                <button
                  type="button"
                  onClick={() => handleCopy(password, "password")}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-[6px] bg-[#9c6402] hover:bg-[#825301] text-white text-[12px] font-semibold transition-colors cursor-pointer shrink-0"
                  title={t("نسخ كلمة المرور", "Copy password")}
                >
                  {copiedField === "password" ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  <span>{copiedField === "password" ? t("تم النسخ", "Copied") : t("نسخ", "Copy")}</span>
                </button>
                <span
                  className="font-mono text-[14px] font-bold text-[#9c6402] dark:text-[#e29d38] select-all tracking-wider text-end break-all"
                  dir="ltr"
                >
                  {password}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleCopy(fullCredentialsText, "all")}
              className="flex-1 h-[42px] rounded-[8px] border border-[#d5cfc4] dark:border-[#4d382c] text-[#514537] dark:text-[#cfc7be] hover:bg-[#f5f3ef] dark:hover:bg-[#2c221a] font-semibold text-[13px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copiedField === "all" ? <Check className="size-4 text-[#10b981]" /> : <Copy className="size-4" />}
              <span>
                {copiedField === "all"
                  ? t("تم نسخ كامل البيانات", "All Credentials Copied")
                  : t("نسخ بيانات الدخول كاملة", "Copy All Credentials")}
              </span>
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="h-[42px] px-5 rounded-[8px] bg-[#9c6402] hover:bg-[#825301] text-white font-semibold text-[13px] transition-colors cursor-pointer shadow-sm shrink-0"
            >
              {t("تم، أغلقت النافذة", "Done")}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
