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
  const [method, setMethod] = useState<"link" | "manual">("link");
  const [sendSms, setSendSms] = useState(true);
  const [manualPassword, setManualPassword] = useState("AlJudy#Law2025");
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen || !employee) return null;

  const handleSubmit = () => {
    if (method === "link") {
      toast.success(
        `تم إرسال رابط إعادة تعيين كلمة المرور المشفر إلى ${employee.email}${
          sendSms ? " وإرسال إشعار SMS." : "."
        }`
      );
    } else {
      if (manualPassword.length < 8) {
        toast.error("كلمة المرور يجب أن تحتوي على 8 خانات على الأقل.");
        return;
      }
      toast.success(
        `تم تعيين كلمة المرور المؤقتة بنجاح للموظف "${employee.name}". سيُطلب منه تغييرها عند تسجيل الدخول.`
      );
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        className="bg-white rounded-[12px] border border-[#e6e2dc] shadow-2xl max-w-[580px] w-full overflow-hidden"
        data-node-id="1:11114"
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

          <div className="flex items-start gap-3 text-start">
            <div>
              <h2 className="text-[20px] font-bold text-[#1b1c1a]">
                إعادة تعيين كلمة المرور
              </h2>
              <p className="text-[12px] text-[#79716b] mt-1">
                تحديث بيانات الاعتماد الأمنية لحساب الموظف
              </p>
            </div>

            <div className="size-[44px] rounded-[10px] bg-[#f5efe6] flex items-center justify-center shrink-0">
              <RotateCcw className="size-[22px] text-[#9c6402]" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-2 space-y-4">
          {/* Employee Mini Card */}
          <div className="bg-[#fcfaf7] p-4 rounded-[8px] border border-[#f0ece5] flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#e8f5e9] text-[#1b7340] border border-[#c8e6c9]">
              <span className="size-[5px] rounded-full bg-[#1b7340]" />
              نشط
            </span>

            <div className="flex items-center gap-3">
              <div className="text-start">
                <h3 className="font-bold text-[14px] text-[#1b1c1a]">
                  {employee.name}
                </h3>
                <span className="text-[11px] text-[#79716b] block">
                  {employee.empCode} • {employee.jobTitle}
                </span>
                <span className="text-[11px] text-[#79716b] font-mono block mt-0.5" dir="ltr">
                  {employee.email}
                </span>
              </div>

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
                <div className="absolute bottom-0 start-0 size-[14px] rounded-full bg-[#10b981] flex items-center justify-center border-2 border-white">
                  <CheckCircle2 className="size-[10px] text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Method Selection */}
          <div className="space-y-3 pt-1">
            <span className="text-[12px] font-bold text-[#1b1c1a] block text-start">
              طريقة تعيين كلمة المرور المعتمدة:
            </span>

            {/* Option 1: Email Link */}
            <div
              onClick={() => setMethod("link")}
              className={`p-4 rounded-[8px] border transition-all cursor-pointer text-start ${
                method === "link"
                  ? "border-[#9c6402] bg-[#fdfbf7] shadow-sm"
                  : "border-[#e6e2dc] bg-white hover:border-[#d6cfc7]"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold text-[#8e5927] bg-[#fbf5ed] px-2 py-0.5 rounded-[4px] border border-[#f2e2ce]">
                  الخيار الموصى به
                </span>

                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-[13px] text-[#1b1c1a]">
                    إرسال رابط آمن ومشفّر إلى البريد الإلكتروني
                  </span>
                  <div
                    className={`size-[18px] rounded-full border-2 flex items-center justify-center ${
                      method === "link"
                        ? "border-[#9c6402] bg-[#9c6402]"
                        : "border-[#d6cfc7]"
                    }`}
                  >
                    {method === "link" && <div className="size-[6px] rounded-full bg-white" />}
                  </div>
                </div>
              </div>

              <p className="text-[12px] text-[#514537] leading-[20px] mt-2 pe-6">
                يصل الموظف رابط رقمي فريد مشفر صالح لمدة 24 ساعة ينتهي فور الاستخدام لمرة واحدة، ويتطلب التحقق الثنائي عند اكتمال الضبط.
              </p>

              {method === "link" && (
                <div className="mt-3 pt-3 border-t border-[#f0ece5] bg-[#f5f3ef]/50 p-3 rounded-[6px] space-y-2">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-mono text-[#1b1c1a] font-bold">{employee.email}</span>
                    <span className="text-[#79716b]">وجهة الإرسال المسجلة:</span>
                  </div>

                  <label
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-end gap-2 text-[12px] text-[#514537] cursor-pointer"
                  >
                    <span>
                      إرسال إشعار وتنبيه SMS على جوال الموظفة ({employee.phone})
                    </span>
                    <input
                      type="checkbox"
                      checked={sendSms}
                      onChange={(e) => setSendSms(e.target.checked)}
                      className="size-[15px] rounded accent-[#9c6402]"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Option 2: Manual Password */}
            <div
              onClick={() => setMethod("manual")}
              className={`p-4 rounded-[8px] border transition-all cursor-pointer text-start ${
                method === "manual"
                  ? "border-[#9c6402] bg-[#fdfbf7] shadow-sm"
                  : "border-[#e6e2dc] bg-white hover:border-[#d6cfc7]"
              }`}
            >
              <div className="flex items-center justify-end gap-2.5">
                <span className="font-bold text-[13px] text-[#1b1c1a]">
                  تعيين كلمة مرور مؤقتة بواسطة المشرف
                </span>
                <div
                  className={`size-[18px] rounded-full border-2 flex items-center justify-center ${
                    method === "manual"
                      ? "border-[#9c6402] bg-[#9c6402]"
                      : "border-[#d6cfc7]"
                  }`}
                >
                  {method === "manual" && <div className="size-[6px] rounded-full bg-white" />}
                </div>
              </div>

              <p className="text-[12px] text-[#514537] leading-[20px] mt-2 pe-6">
                يتم إدخال كلمة مرور مؤقتة وتزويدها للموظف، مع إجباره برمجياً على تغييرها بصورة إلزامية فور أول محاولة تسجيل دخول.
              </p>

              {method === "manual" && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="mt-3 pt-3 border-t border-[#f0ece5] space-y-2.5"
                >
                  <label className="block text-[12px] font-bold text-[#1b1c1a]">
                    كلمة المرور الجديدة <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={manualPassword}
                      onChange={(e) => setManualPassword(e.target.value)}
                      className="w-full h-[40px] px-10 text-[13px] bg-white border border-[#d6cfc7] rounded-[6px] text-[#1b1c1a] focus:outline-none focus:border-[#9c6402] font-mono text-center"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 -translate-y-1/2 start-3 text-[#948b83] hover:text-[#514537]"
                    >
                      {showPassword ? <EyeOff className="size-[16px]" /> : <Eye className="size-[16px]" />}
                    </button>
                  </div>

                  {/* 3-bar indicator */}
                  <div className="flex items-center justify-between text-[11px] text-[#79716b]">
                    <span>قوية ومطابقة</span>
                    <div className="flex items-center gap-1.5 w-1/2">
                      <div className="h-[4px] flex-1 rounded-full bg-[#9c6402]" />
                      <div className="h-[4px] flex-1 rounded-full bg-[#9c6402]" />
                      <div className="h-[4px] flex-1 rounded-full bg-[#9c6402]" />
                    </div>
                  </div>

                  <p className="text-[11px] text-[#79716b] text-start">
                    يجب أن تحتوي على 8 خانات على الأقل تتضمن أحرفاً كبيرة وصغيرة وأرقاماً ورموزاً.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-[#f2efe9] flex items-center justify-start gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-[6px] bg-[#9c6402] hover:bg-[#855402] text-white text-[13px] font-bold flex items-center gap-2 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors"
          >
            <Send className="size-[15px]" />
            <span>
              {method === "link" ? "إرسال رابط إعادة التعيين" : "حفظ وتعيين كلمة المرور"}
            </span>
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
