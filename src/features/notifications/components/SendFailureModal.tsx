"use client";

import React from "react";
import { X, AlertCircle, RotateCw, Edit3, Building2, Link as LinkIcon } from "lucide-react";
import { SendNotificationFormValues } from "../schemas/notifications.schemas";
import { useLanguage } from "@/lib/i18n";

interface SendFailureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  onBackToEdit: () => void;
  formData: SendNotificationFormValues;
  isRetrying?: boolean;
}

export function SendFailureModal({
  isOpen,
  onClose,
  onRetry,
  onBackToEdit,
  formData,
  isRetrying = false,
}: SendFailureModalProps) {
  const { direction, isEn } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      dir={direction}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200"
    >
      <div
        className="bg-white rounded-[8px] shadow-[0px_20px_50px_0px_rgba(28,20,15,0.22)] w-full max-w-[544px] overflow-hidden border border-[#eae8e4] relative scale-in-95 duration-150 text-start"
      >
        {/* Top Decorative Red Accent Bar */}
        <div className="h-[6px] w-full bg-[#ba1a1a]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isRetrying}
          className="absolute end-[16px] top-[16px] size-[32px] rounded-[4px] flex items-center justify-center text-[#514537] hover:bg-[#f5f3ef] hover:text-[#1b1c1a] transition-colors cursor-pointer"
          title={isEn ? "Close" : "إغلاق"}
        >
          <X className="size-[14px]" />
        </button>

        {/* Modal Body Content */}
        <div className="p-6 pt-8 space-y-4 text-center">
          {/* Failure Emblem */}
          <div className="relative mx-auto size-14 rounded-[12px] bg-[#ffdad6]/60 flex items-center justify-center text-[#ba1a1a] shadow-sm">
            <AlertCircle className="size-8 stroke-[2.2]" />
            <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center text-[10px] font-bold">
              !
            </div>
          </div>

          {/* Headline & Subtitle */}
          <div className="space-y-1">
            <h2 className="text-[22px] font-bold text-[#1b1c1a]">
              {isEn ? "Failed to Send Notification" : "تعذر إرسال الإشعار"}
            </h2>
            <p className="text-[14px] text-[#514537]">
              {isEn
                ? "An error occurred while attempting to send the notification. Please try again."
                : "حدث خطأ أثناء محاولة إرسال الإشعار. يرجى المحاولة مرة أخرى."}
            </p>
          </div>

          {/* Error Callout Banner */}
          <div className="bg-[#ffdad6]/40 border border-[#ffdad6] rounded-[4px] p-3 text-start text-[12px] text-[#93000a] flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#ba1a1a] shrink-0" />
            <span className="leading-[18px]">
              {isEn
                ? "Temporary gateway connection timeout (Gateway Timeout • ERR-NTF-504) — No billing deduction or duplicate notice sent."
                : "فشل الاتصال المؤقت ببوابة البث المباشر (Gateway Timeout • ERR-NTF-504) — لم يتم الخصم أو تكرار الإشعار للمستلمين"}
            </span>
          </div>

          {/* Notification Summary Card */}
          <div className="bg-[#f5f3ef] rounded-[8px] p-4 text-start space-y-3 border border-[#eae8e4]">
            {/* Title */}
            <div className="border-b border-[#eae8e4] pb-2">
              <span className="text-[#837565] text-[10px] font-semibold">
                {isEn ? "Official Notification Title" : "عنوان الإشعار الرسمي"}
              </span>
              <p className="text-[#1b1c1a] text-[14px] font-bold mt-0.5">
                {formData.title}
              </p>
            </div>

            {/* Audience */}
            <div className="border-b border-[#eae8e4] pb-2">
              <span className="text-[#837565] text-[10px] font-semibold">
                {isEn ? "Target Audience & Recipients" : "الجمهور والمستلمون المستهدفون"}
              </span>
              <div className="bg-white rounded-[4px] p-2 flex items-center justify-between border border-[#eae8e4] mt-1">
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-[#7b4e00]" />
                  <span className="text-[#1b1c1a] text-[12px] font-semibold">
                    {formData.audienceType === "all"
                      ? isEn
                        ? "All Subscribed Law Firms"
                        : "جميع مكاتب المحاماة المشتركة"
                      : isEn
                      ? "Specific Law Firm"
                      : "مكتب محدد بعينه"}
                  </span>
                </div>
                <span className="bg-[#f0eeea] text-[#514537] text-[10px] font-medium px-2 py-0.5 rounded-[6px]">
                  {formData.audienceType === "all"
                    ? isEn
                      ? "842 active firms"
                      : "842 مكتب نشط"
                    : isEn
                    ? "1 firm"
                    : "1 مكتب"}
                </span>
              </div>
            </div>

            {/* Action URL */}
            <div>
              <span className="text-[#837565] text-[10px] font-semibold">
                {isEn ? "Direct Action Link Included" : "رابط الإجراء المباشر المتضمن"}
              </span>
              <div className="bg-white rounded-[4px] px-2.5 py-1.5 flex items-center gap-2 border border-[#eae8e4] mt-1">
                <LinkIcon className="size-3.5 text-[#7b4e00] shrink-0" />
                <span className="text-[#7b4e00] text-[11px] font-semibold dir-ltr text-left truncate flex-1">
                  {formData.actionUrl}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#eae8e4] px-6 py-4 flex items-center justify-end gap-2 bg-white">
          <button
            type="button"
            onClick={onBackToEdit}
            disabled={isRetrying}
            className="bg-[#f0eeea] hover:bg-[#e4e2de] text-[#1b1c1a] text-[12px] font-semibold px-4 py-2 rounded-[4px] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="size-3.5" />
            <span>{isEn ? "Back to Edit" : "العودة للتعديل"}</span>
          </button>
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="bg-[#9c6403] hover:bg-[#855402] text-[#fff3e9] text-[12px] font-bold px-6 py-2 rounded-[4px] flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`size-3.5 ${isRetrying ? "animate-spin" : ""}`} />
            <span>
              {isRetrying
                ? isEn
                  ? "Retrying..."
                  : "جارٍ المحاولة..."
                : isEn
                ? "Retry Now"
                : "إعادة المحاولة"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
