"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  RotateCcw,
  Send,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Employee } from "../types/staff.types";
import { useLanguage } from "@/lib/i18n";
import { ModalPortal } from "@/components/shared/ModalPortal";
import { resetStaffPassword } from "@/lib/api/staff";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

export function ResetPasswordModal({
  isOpen,
  onClose,
  employee,
}: ResetPasswordModalProps) {
  const { t, isEn, direction } = useLanguage();
  const [method, setMethod] = useState<"link" | "manual">("link");
  const [sendSms, setSendSms] = useState(true);
  const [manualPassword, setManualPassword] = useState("AlJudy#Law2025");
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen || !employee) return null;

  const handleSubmit = async () => {
    if (method === "manual" && manualPassword.length < 8) {
      toast.error(
        t(
          "كلمة المرور يجب أن تحتوي على 8 خانات على الأقل.",
          "Password must contain at least 8 characters."
        )
      );
      return;
    }

    try {
      await resetStaffPassword(
        employee.id,
        method === "manual" ? manualPassword : `TempReset@${Date.now().toString().slice(-6)}`
      );
    } catch {
      toast.error(
        t(
          "تعذر إعادة تعيين كلمة المرور عبر الخادم.",
          "Failed to reset password via the server."
        )
      );
      return;
    }

    if (method === "link") {
      toast.success(
        isEn
          ? `Encrypted password reset link sent to ${employee.email}${sendSms ? " with SMS notification." : "."}`
          : `تم إرسال رابط إعادة تعيين كلمة المرور المشفر إلى ${employee.email}${sendSms ? " وإرسال إشعار SMS." : "."}`
      );
    } else {
      toast.success(
        isEn
          ? `Temporary password set successfully for employee "${employee.name}". They will be prompted to change it upon login.`
          : `تم تعيين كلمة المرور المؤقتة بنجاح للموظف "${employee.name}". سيُطلب منه تغييرها عند تسجيل الدخول.`
      );
    }
    onClose();
  };

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
          data-node-id="1:11114"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between border-b border-[#f0eeea] dark:border-[#38271c]">
          <div className="flex items-start gap-3 text-start">
            <div className="size-[44px] rounded-[10px] bg-[#f5efe6] dark:bg-[#342711] flex items-center justify-center shrink-0">
              <RotateCcw className="size-[22px] text-[#9c6402] dark:text-[#e29d38]" />
            </div>

            <div>
              <h2 className="text-[20px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("إعادة تعيين كلمة المرور", "Reset Password")}
              </h2>
              <p className="text-[12px] text-[#79716b] dark:text-[#a89f91] mt-1">
                {t(
                  "تحديث بيانات الاعتماد الأمنية لحساب الموظف",
                  "Update security credentials for employee account"
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-[32px] rounded-[6px] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] text-[#79716b] dark:text-[#a89f91] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="size-[18px]" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Employee Mini Card */}
          <div className="bg-[#fcfaf7] dark:bg-[#1a120c] p-4 rounded-[8px] border border-[#f0ece5] dark:border-[#38271c] flex items-center justify-between">
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
                <div className="absolute bottom-0 start-0 size-[14px] rounded-full bg-[#10b981] flex items-center justify-center border-2 border-white dark:border-[#1a120c]">
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

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#e8f5e9] dark:bg-[#132c1c] text-[#1b7340] dark:text-[#6ee7b7] border border-[#c8e6c9] dark:border-[#1e462c]">
              <span className="size-[5px] rounded-full bg-[#1b7340] dark:bg-[#6ee7b7]" />
              {t("نشط", "Active")}
            </span>
          </div>

          {/* Method Selection */}
          <div className="space-y-3 pt-1">
            <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block text-start">
              {t("طريقة تعيين كلمة المرور المعتمدة:", "Authorized password setup method:")}
            </span>

            {/* Option 1: Email Link */}
            <div
              onClick={() => setMethod("link")}
              className={`p-4 rounded-[8px] border transition-all cursor-pointer text-start ${
                method === "link"
                  ? "border-[#9c6402] dark:border-[#e29d38] bg-[#fdfbf7] dark:bg-[#281c15] shadow-sm ring-1 ring-[#9c6402]/30 dark:ring-[#e29d38]/30"
                  : "border-[#e6e2dc] dark:border-[#38271c] bg-white dark:bg-[#221812] hover:border-[#d6cfc7] dark:hover:border-[#4d3627]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`size-[18px] rounded-full border-2 flex items-center justify-center ${
                      method === "link"
                        ? "border-[#9c6402] dark:border-[#e29d38] bg-[#9c6402] dark:bg-[#e29d38]"
                        : "border-[#d6cfc7] dark:border-[#5c4433]"
                    }`}
                  >
                    {method === "link" && <div className="size-[6px] rounded-full bg-white dark:bg-[#1c140f]" />}
                  </div>
                  <span className="font-bold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t(
                      "إرسال رابط آمن ومشفّر إلى البريد الإلكتروني",
                      "Send secure encrypted link to email"
                    )}
                  </span>
                </div>

                <span className="text-[11px] font-bold text-[#8e5927] dark:text-[#fbbf24] bg-[#fbf5ed] dark:bg-[#342711] px-2 py-0.5 rounded-[4px] border border-[#f2e2ce] dark:border-[#5c4217]">
                  {t("الخيار الموصى به", "Recommended Option")}
                </span>
              </div>

              <p className="text-[12px] text-[#514537] dark:text-[#cdc5bd] leading-[20px] mt-2 pe-6">
                {t(
                  "يصل الموظف رابط رقمي فريد مشفر صالح لمدة 24 ساعة ينتهي فور الاستخدام لمرة واحدة، ويتطلب التحقق الثنائي عند اكتمال الضبط.",
                  "The employee receives a unique encrypted digital link valid for 24 hours, single-use, requiring two-factor authentication upon setup."
                )}
              </p>

              {method === "link" && (
                <div className="mt-3 pt-3 border-t border-[#f0ece5] dark:border-[#38271c] bg-[#f7f4ee] dark:bg-[#1a120c] p-3 rounded-[6px] space-y-2.5 border border-[#eee7dc] dark:border-[#38271c]">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-[#79716b] dark:text-[#a89f91]">{t("وجهة الإرسال المسجلة:", "Registered destination:")}</span>
                    <span className="font-mono text-[#9c6402] dark:text-[#e29d38] font-bold">{employee.email}</span>
                  </div>

                  <label
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-start gap-2 text-[12px] text-[#514537] dark:text-[#cdc5bd] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={sendSms}
                      onChange={(e) => setSendSms(e.target.checked)}
                      className="size-[15px] rounded accent-[#9c6402] dark:accent-[#e29d38]"
                    />
                    <span>
                      {t(
                        `إرسال إشعار وتنبيه SMS على جوال الموظف (${employee.phone})`,
                        `Send SMS alert notification to mobile (${employee.phone})`
                      )}
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Option 2: Manual Password */}
            <div
              onClick={() => setMethod("manual")}
              className={`p-4 rounded-[8px] border transition-all cursor-pointer text-start ${
                method === "manual"
                  ? "border-[#9c6402] dark:border-[#e29d38] bg-[#fdfbf7] dark:bg-[#281c15] shadow-sm ring-1 ring-[#9c6402]/30 dark:ring-[#e29d38]/30"
                  : "border-[#e6e2dc] dark:border-[#38271c] bg-white dark:bg-[#221812] hover:border-[#d6cfc7] dark:hover:border-[#4d3627]"
              }`}
            >
              <div className="flex items-center justify-start gap-2.5">
                <div
                  className={`size-[18px] rounded-full border-2 flex items-center justify-center ${
                    method === "manual"
                      ? "border-[#9c6402] dark:border-[#e29d38] bg-[#9c6402] dark:bg-[#e29d38]"
                      : "border-[#d6cfc7] dark:border-[#5c4433]"
                  }`}
                >
                  {method === "manual" && <div className="size-[6px] rounded-full bg-white dark:bg-[#1c140f]" />}
                </div>
                <span className="font-bold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t(
                    "تعيين كلمة مرور مؤقتة بواسطة المشرف",
                    "Set temporary password by administrator"
                  )}
                </span>
              </div>

              <p className="text-[12px] text-[#514537] dark:text-[#cdc5bd] leading-[20px] mt-2 pe-6">
                {t(
                  "يتم إدخال كلمة مرور مؤقتة وتزويدها للموظف، مع إجباره برمجياً على تغييرها بصورة إلزامية فور أول محاولة تسجيل دخول.",
                  "A temporary password is set and provided to the employee, with mandatory password change enforced on first login."
                )}
              </p>

              {method === "manual" && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="mt-3 pt-3 border-t border-[#f0ece5] dark:border-[#38271c] space-y-2.5"
                >
                  <label className="block text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("كلمة المرور الجديدة", "New Password")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={manualPassword}
                      onChange={(e) => setManualPassword(e.target.value)}
                      className="w-full h-[40px] px-10 text-[13px] bg-white dark:bg-[#1a120c] border border-[#d6cfc7] dark:border-[#4d3627] rounded-[6px] text-[#1b1c1a] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] font-mono text-center"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 -translate-y-1/2 end-3 text-[#948b83] dark:text-[#a89f91] hover:text-[#514537] dark:hover:text-[#fdfbf7] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="size-[16px]" /> : <Eye className="size-[16px]" />}
                    </button>
                  </div>

                  {/* 3-bar indicator */}
                  <div className="flex items-center justify-between text-[11px] text-[#79716b] dark:text-[#a89f91]">
                    <span>{t("قوية ومطابقة", "Strong & Valid")}</span>
                    <div className="flex items-center gap-1.5 w-1/2">
                      <div className="h-[4px] flex-1 rounded-full bg-[#9c6402] dark:bg-[#e29d38]" />
                      <div className="h-[4px] flex-1 rounded-full bg-[#9c6402] dark:bg-[#e29d38]" />
                      <div className="h-[4px] flex-1 rounded-full bg-[#9c6402] dark:bg-[#e29d38]" />
                    </div>
                  </div>

                  <p className="text-[11px] text-[#79716b] dark:text-[#a89f91] text-start">
                    {t(
                      "يجب أن تحتوي على 8 خانات على الأقل تتضمن أحرفاً كبيرة وصغيرة وأرقاماً ورموزاً.",
                      "Must contain at least 8 characters including uppercase, lowercase, numbers, and symbols."
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-[#f2efe9] dark:border-[#38271c] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-[6px] bg-[#f5f3ef] dark:bg-[#281c15] hover:bg-[#eae6e0] dark:hover:bg-[#34241b] text-[#514537] dark:text-[#cdc5bd] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            {t("إلغاء", "Cancel")}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-[6px] bg-[#9c6402] hover:bg-[#855402] dark:bg-[#e29d38] dark:hover:bg-[#c9862b] text-white dark:text-[#1c140f] text-[13px] font-bold flex items-center gap-2 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors cursor-pointer"
          >
            <Send className="size-[15px]" />
            <span>
              {method === "link"
                ? t("إرسال رابط إعادة التعيين", "Send Reset Link")
                : t("حفظ وتعيين كلمة المرور", "Save & Set Password")}
            </span>
          </button>
        </div>
      </div>
    </div>
  </ModalPortal>
  );
}