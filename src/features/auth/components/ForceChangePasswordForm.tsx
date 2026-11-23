"use client";

import React, { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { AlJoudyLogo } from "@/components/shared/BrandLogos";
import { getAuthSession, getAuthUser, updateAuthUser } from "@/lib/auth-client";
import { resetStaffPassword } from "@/lib/api/staff";
import {
  clearForceChangePasswordContext,
  getForceChangeCurrentPassword,
} from "@/lib/api/auth";
import { validateForcedPasswordChange } from "@/lib/api/password";
import type { AdminUser } from "@/lib/api/types";
import { ApiError } from "@/lib/api/http";
import { withBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";

export function ForceChangePasswordForm() {
  const user = getAuthUser<AdminUser>();
  const [currentPassword, setCurrentPassword] = useState(
    () => getForceChangeCurrentPassword() || ""
  );

  useEffect(() => {
    if (!getAuthSession()) {
      const target = withBasePath("/login");
      window.location.replace(target.endsWith("/") ? target : `${target}/`);
      return;
    }
    const u = getAuthUser<AdminUser>();
    if (!u?.mustChangePassword) {
      const home = withBasePath("/");
      window.location.replace(home.endsWith("/") ? home : `${home}/`);
    }
  }, []);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputBase =
    "peer w-full h-13 rounded-full ps-5 pe-12 text-sm bg-white dark:bg-[#281c15] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none transition-all shadow-2xs";
  const inputOk =
    "border border-[#ded5c6] dark:border-[#38271c] focus:border-[#c29547] dark:focus:border-[#d4a759] focus:ring-3 focus:ring-[#c29547]/15";
  const inputBad =
    "border border-red-400 dark:border-red-500/60 focus:border-red-500 focus:ring-3 focus:ring-red-500/15";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const errors = validateForcedPasswordChange({
      newPassword,
      confirmPassword,
      currentPassword: currentPassword || getForceChangeCurrentPassword(),
    });

    if (!currentPassword && !getForceChangeCurrentPassword()) {
      errors.currentPassword = "أدخل كلمة المرور المؤقتة الحالية";
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (!user?.id) {
      setFormError("تعذر تحديد حساب المستخدم، يرجى تسجيل الدخول مجدداً");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetStaffPassword(user.id, newPassword);
      clearForceChangePasswordContext();
      updateAuthUser<AdminUser>({ mustChangePassword: false });
      toast.success("تم تغيير كلمة المرور بنجاح");
      const home = withBasePath("/");
      window.location.assign(home.endsWith("/") ? home : `${home}/`);
    } catch (err: unknown) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "تعذر حفظ كلمة المرور الجديدة، يرجى المحاولة مرة أخرى";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="h-full w-full bg-[#f7f4ef] dark:bg-[#1a120d] flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-10 font-['Cairo']"
    >
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="flex flex-col items-center text-center gap-3">
          <AlJoudyLogo className="h-10 w-auto" />
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fbf5ed] dark:bg-[#2e1d13] text-[#9c6402] dark:text-[#d4a759] text-[11px] font-bold border border-[#f0dfc3] dark:border-[#4d321d]">
            <ShieldCheck className="size-3.5" />
            تغيير إجباري لكلمة المرور
          </div>
          <h1 className="text-[22px] font-bold text-[#1c1917] dark:text-[#fdfbf7]">
            أنشئ كلمة مرور جديدة
          </h1>
          <p className="text-[13px] text-[#78716c] dark:text-[#a8a29e] leading-relaxed">
            لأسباب أمنية يجب تغيير كلمة المرور المؤقتة قبل الدخول إلى لوحة التحكم.
          </p>
        </div>

        {formError && (
          <div className="rounded-[12px] bg-red-50 dark:bg-[#2c1313] border border-red-200 dark:border-red-900/40 p-3 text-center">
            <p className="text-[13px] font-semibold text-red-700 dark:text-red-300">
              {formError}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label className="block text-[13px] font-semibold text-[#1c1917] dark:text-[#fdfbf7]">
              كلمة المرور المؤقتة الحالية <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, currentPassword: undefined }));
                }}
                disabled={isSubmitting}
                className={cn(
                  inputBase,
                  fieldErrors.currentPassword ? inputBad : inputOk
                )}
                autoComplete="current-password"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute end-4 top-1/2 -translate-y-1/2 text-[#a8a29e] hover:text-[#1c1917] dark:hover:text-[#fdfbf7] p-1"
              >
                {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {fieldErrors.currentPassword && (
              <p className="text-[12px] text-red-600">{fieldErrors.currentPassword}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-semibold text-[#1c1917] dark:text-[#fdfbf7]">
              كلمة المرور الجديدة <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, newPassword: undefined }));
                }}
                disabled={isSubmitting}
                placeholder="8 أحرف على الأقل، حرف ورقم"
                className={cn(inputBase, fieldErrors.newPassword ? inputBad : inputOk)}
                autoComplete="new-password"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowNew((v) => !v)}
                className="absolute end-4 top-1/2 -translate-y-1/2 text-[#a8a29e] hover:text-[#1c1917] dark:hover:text-[#fdfbf7] p-1"
              >
                {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {fieldErrors.newPassword && (
              <p className="text-[12px] text-red-600">{fieldErrors.newPassword}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-semibold text-[#1c1917] dark:text-[#fdfbf7]">
              تأكيد كلمة المرور الجديدة <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                disabled={isSubmitting}
                className={cn(
                  inputBase,
                  fieldErrors.confirmPassword ? inputBad : inputOk
                )}
                autoComplete="new-password"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute end-4 top-1/2 -translate-y-1/2 text-[#a8a29e] hover:text-[#1c1917] dark:hover:text-[#fdfbf7] p-1"
              >
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="text-[12px] text-red-600">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={
              isSubmitting || !newPassword || !confirmPassword || !currentPassword
            }
            className="w-full h-13 rounded-full bg-gradient-to-r from-[#9c6402] to-[#b37402] hover:from-[#855402] hover:to-[#9c6402] text-white font-bold text-[14px] shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <KeyRound className="size-4" />
                حفظ ومتابعة الدخول
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
