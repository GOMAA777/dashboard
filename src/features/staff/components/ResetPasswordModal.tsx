"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { X, KeyRound, Copy, Check, Eye, EyeOff, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Employee } from "../types/staff.types";
import { useLanguage } from "@/lib/i18n";
import { ModalPortal } from "@/components/shared/ModalPortal";
import { resetStaffPassword } from "@/lib/api/staff";
import { ApiError } from "@/lib/api/http";
import { InvalidationGraph } from "@/lib/query-keys";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onSuccess?: () => void;
}

export function ResetPasswordModal({
  isOpen,
  onClose,
  employee,
  onSuccess,
}: ResetPasswordModalProps) {
  const { t, direction } = useLanguage();
  const queryClient = useQueryClient();
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetCompleted, setResetCompleted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !employee) return null;

  const generateStrongPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(pass);
    setErrorMsg(null);
  };

  const handleClose = () => {
    if (isLoading) return;
    setNewPassword("");
    setShowPassword(false);
    setIsLoading(false);
    setResetCompleted(false);
    setCopied(false);
    setErrorMsg(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg(t("يجب أن تكون كلمة المرور 6 خانات على الأقل", "Password must be at least 6 characters"));
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      await resetStaffPassword(employee.id, newPassword);
      await InvalidationGraph.onStaffMutation(queryClient);
      setResetCompleted(true);
      toast.success(
        t(
          `تم تحديث كلمة المرور للموظف «${employee.name}» بنجاح`,
          `Password reset for «${employee.name}» successfully`
        )
      );
      onSuccess?.();
    } catch (err: unknown) {
      const msg =
        err instanceof ApiError
          ? err.message
          : (err as Error)?.message ||
            t("تعذر إعادة تعيين كلمة المرور", "Failed to reset password");
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(newPassword);
      setCopied(true);
      toast.success(t("تم نسخ كلمة المرور الجديدة", "New password copied"));
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error(t("تعذر النسخ", "Copy failed"));
    }
  };

  return (
    <ModalPortal isOpen={isOpen}>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-['Cairo',sans-serif]"
        dir={direction}
        onClick={(e) => {
          if (e.target === e.currentTarget && !isLoading) handleClose();
        }}
      >
        <div
          className="relative w-full max-w-[500px] bg-white dark:bg-[#1f1a16] rounded-[14px] p-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.35)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col gap-[20px] animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between w-full">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleClose}
              className="p-[6px] rounded-[6px] hover:bg-[#f5f3ef] dark:hover:bg-[#2c221a] text-[#837565] hover:text-[#1b1c1a] dark:text-[#a89f91] dark:hover:text-[#fdfbf7] transition-colors cursor-pointer"
            >
              <X className="size-[18px]" />
            </button>

            <div className="flex items-center gap-[12px] text-end">
              <div>
                <h3 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("إعادة تعيين كلمة المرور", "Reset Account Password")}
                </h3>
                <p className="text-[12px] text-[#837565] dark:text-[#a89f91]">
                  {employee.name} ({employee.email})
                </p>
              </div>
              <div className="size-[40px] rounded-[10px] bg-[#fff9ee] dark:bg-[rgba(226,157,56,0.15)] border border-[#fde68a] dark:border-[#e29d38]/40 flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
                <KeyRound className="size-[20px]" />
              </div>
            </div>
          </div>

          {!resetCompleted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-[13px] text-[#514537] dark:text-[#cfc7be] leading-relaxed">
                {t(
                  "أدخل كلمة المرور الجديدة لحساب الموظف. سيتم تحديث كلمة المرور في النظام فوراً، وسيتم إلغاء كلمة المرور السابقة.",
                  "Enter the new password for this employee. It will be updated immediately and the old password will cease to work."
                )}
              </p>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <button
                    type="button"
                    onClick={generateStrongPassword}
                    className="text-[12px] text-[#9c6402] dark:text-[#e29d38] hover:underline font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="size-3.5" />
                    <span>{t("توليد كلمة مرور قوية", "Generate strong password")}</span>
                  </button>
                  <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("كلمة المرور الجديدة *", "New Password *")}
                  </label>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrorMsg(null);
                    }}
                    placeholder={t("أدخل كلمة مرور (6 أحرف فأكثر)", "Enter password (6+ chars)")}
                    className="w-full h-[44px] bg-[#f5f3ef] dark:bg-[#160e0a] rounded-[8px] ps-[42px] pe-[14px] text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] font-mono border border-[#e5e0d8] dark:border-[#38271c] focus:outline-none focus:border-[#9c6402] text-start"
                    dir="ltr"
                    disabled={isLoading}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute start-[12px] top-1/2 -translate-y-1/2 text-[#837565] hover:text-[#1b1c1a] dark:text-[#a89f91] dark:hover:text-[#fdfbf7] p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>

                {errorMsg && (
                  <p className="mt-1.5 text-[12px] text-[#dc2626] dark:text-[#f87171] flex items-center gap-1">
                    <AlertCircle className="size-3.5 shrink-0" />
                    <span>{errorMsg}</span>
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2 border-t border-[#eae8e4] dark:border-[#38271c]">
                <button
                  type="submit"
                  disabled={isLoading || !newPassword}
                  className="flex-1 h-[42px] rounded-[8px] bg-[#9c6402] hover:bg-[#825301] disabled:opacity-50 text-white font-semibold text-[13px] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm disabled:cursor-not-allowed"
                >
                  <span>{t("تأكيد وتعيين كلمة المرور", "Confirm & Set Password")}</span>
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleClose}
                  className="h-[42px] px-5 rounded-[8px] border border-[#d5cfc4] dark:border-[#4d382c] text-[#514537] dark:text-[#cfc7be] hover:bg-[#f5f3ef] dark:hover:bg-[#2c221a] font-medium text-[13px] transition-colors cursor-pointer"
                >
                  {t("إلغاء", "Cancel")}
                </button>
              </div>
            </form>
          ) : (
            /* Reset Success View: Shows new password once with copy */
            <div className="space-y-4">
              <div className="p-3.5 rounded-[8px] bg-[#ecfdf5] dark:bg-[#132c1c] border border-[#a7f3d0] dark:border-[#1b7340]/40 flex items-start gap-2.5">
                <Check className="size-4 text-[#10b981] shrink-0 mt-0.5" />
                <p className="text-[13px] text-[#065f46] dark:text-[#6ee7b7] leading-relaxed">
                  {t(
                    "تم تحديث كلمة المرور في الخادم بنجاح. أصبحت كلمة المرور الجديدة فعالة، وألغيت كلمة المرور القديمة تماماً.",
                    "Password updated successfully on the server. The new password is now active and the old one is invalid."
                  )}
                </p>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#514537] dark:text-[#a89f91] mb-1">
                  {t("كلمة المرور الجديدة (انسخها الآن، لن تعرض مرة أخرى)", "New Password (Copy now, will not be shown again)")}
                </label>
                <div className="flex items-center justify-between p-2.5 px-3 bg-[#f5f3ef] dark:bg-[#160e0a] rounded-[8px] border border-[#e5e0d8] dark:border-[#38271c]">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1.5 rounded-[4px] hover:bg-white dark:hover:bg-[#2c221a] text-[#837565] hover:text-[#9c6402] dark:hover:text-[#e29d38] transition-colors cursor-pointer"
                    title={t("نسخ", "Copy")}
                  >
                    {copied ? <Check className="size-4 text-[#10b981]" /> : <Copy className="size-4" />}
                  </button>
                  <span className="font-mono text-[14px] font-bold text-[#9c6402] dark:text-[#e29d38] select-all tracking-wider" dir="ltr">
                    {newPassword}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#eae8e4] dark:border-[#38271c]">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full h-[42px] rounded-[8px] bg-[#9c6402] hover:bg-[#825301] text-white font-semibold text-[13px] transition-colors cursor-pointer shadow-sm"
                >
                  {t("تم الحفظ والنسخ", "Saved & Done")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalPortal>
  );
}
