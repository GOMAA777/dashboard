"use client";

import React from "react";
import Image from "next/image";
import placeholderBannerImg from "../../../../public/figma/placeholder-banner.png";
import { X, Send, ShieldCheck, Building2, Link as LinkIcon } from "lucide-react";
import { SendNotificationFormValues } from "../schemas/notifications.schemas";
import { useLanguage } from "@/lib/i18n";

interface ConfirmSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formData: SendNotificationFormValues;
  isSending?: boolean;
}

export function ConfirmSendModal({
  isOpen,
  onClose,
  onConfirm,
  formData,
  isSending = false,
}: ConfirmSendModalProps) {
  const { direction, isEn } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      dir={direction}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="bg-white dark:bg-[#221812] border border-[#d6c4b1]/60 dark:border-[#38271c] rounded-2xl shadow-[0px_20px_48px_0px_rgba(28,20,15,0.22)] dark:shadow-[0px_20px_48px_0px_rgba(0,0,0,0.7)] w-full max-w-[576px] overflow-hidden relative scale-in-95 duration-150 text-start"
      >
        {/* Top Subtle Gold Architectural Accent Line */}
        <div
          className="h-[4px] w-full bg-gradient-to-r from-[#9c6402] via-[#e29d38] to-[#9c6402]"
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSending}
          className="absolute end-[16px] top-[16px] size-[32px] rounded-xl flex items-center justify-center text-[#514537] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] transition-colors cursor-pointer"
          title={isEn ? "Close" : "إغلاق"}
        >
          <X className="size-[14px]" />
        </button>

        {/* Modal Body Wrapper */}
        <div className="p-6 space-y-4">
          {/* Header & Graphic Indicator */}
          <div className="flex items-start gap-3.5">
            <div
              className="bg-[rgba(255,221,182,0.4)] dark:bg-[#281c15] border border-transparent dark:border-[#4d3627] rounded-xl size-12 flex items-center justify-center text-[#7b4e00] dark:text-[#e29d38] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] shrink-0"
            >
              <Send className="size-5" />
            </div>

            <div className="flex-1 min-w-0">
              <h2
                className="text-[20px] font-bold text-[#1c140f] dark:text-[#fdfbf7] leading-[26px]"
              >
                {isEn ? "Confirm Send Notification" : "تأكيد إرسال الإشعار"}
              </h2>
              <p
                className="text-[13px] text-[#514537] dark:text-[#cdc5bd] mt-1 leading-[22px]"
              >
                {isEn
                  ? "Do you want to send this direct notification and log it in the security audit trail?"
                  : "هل تريد إرسال هذا الإشعار المباشر وتوثيق العملية في سجل التدقيق الأمني؟"}
              </p>
            </div>
          </div>

          {/* Structured Summary Box */}
          <div
            className="bg-[#f5f3ef] dark:bg-[#1a120d] rounded-xl p-4 space-y-3 border border-[#eae8e4] dark:border-[#38271c]"
          >
            {/* Field 1: Notification Title */}
            <div
              className="border-b border-[#eae8e4]/80 dark:border-[#38271c] pb-2.5 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-semibold">
                  {isEn ? "Official Notification Title" : "عنوان الإشعار الرسمي"}
                </span>
                <span
                  className="bg-[#ffdad6] dark:bg-rose-950/50 text-[#93000a] dark:text-rose-300 text-[10px] font-bold px-1.5 py-0.5 rounded-[3px] flex items-center gap-1 border border-transparent dark:border-rose-900"
                >
                  <span className="size-1.5 rounded-full bg-[#ba1a1a]" />
                  <span>{isEn ? "Mandatory Alert" : "تنبيه إلزامي"}</span>
                </span>
              </div>
              <p
                className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[14px] font-bold leading-[20px]"
              >
                {formData.title ||
                  (isEn
                    ? "Mandatory Security Update: 2FA Standards Upgrade"
                    : "تحديث أمني إلزامي: ترقية معايير المصادقة الثنائية (2FA)")}
              </p>
            </div>

            {/* Field 2: Target Audience */}
            <div
              className="border-b border-[#eae8e4]/80 dark:border-[#38271c] pb-2.5 space-y-1.5"
            >
              <div className="text-[#837565] dark:text-[#8e8680] text-[10px] font-semibold">
                {isEn ? "Target Audience & Recipients" : "الجمهور والمستلمون المستهدفون"}
              </div>
              <div
                className="bg-white dark:bg-[#281c15] rounded-lg p-2.5 flex items-center justify-between border border-[#eae8e4] dark:border-[#38271c]"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-[#7b4e00] dark:text-[#e29d38]" />
                  <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] font-semibold">
                    {formData.audienceType === "all"
                      ? isEn
                        ? "All Subscribed Law Firms"
                        : "جميع مكاتب المحاماة المشتركة"
                      : isEn
                      ? "Specific Law Firm"
                      : "مكتب محدد بعينه"}
                  </span>
                </div>
                <span className="bg-[#f0eeea] dark:bg-[#1a120d] text-[#514537] dark:text-[#cdc5bd] text-[10px] font-medium px-2 py-0.5 rounded-[4px] border border-transparent dark:border-[#38271c]">
                  {formData.audienceType === "all"
                    ? isEn
                      ? "842 active firms"
                      : "842 مكتب نشط"
                    : isEn
                    ? "1 firm"
                    : "1 مكتب محدد"}
                </span>
              </div>
            </div>

            {/* Field 3: Concise Preview Snippet */}
            <div
              className="border-b border-[#eae8e4]/80 dark:border-[#38271c] pb-2.5 space-y-1"
            >
              <div className="text-[#837565] dark:text-[#8e8680] text-[10px] font-semibold">
                {isEn ? "Notification Body" : "نص الإشعار"}
              </div>
              <div
                className="bg-white/80 dark:bg-[#281c15]/60 rounded-lg p-2.5 border border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[19.5px] max-h-[70px] overflow-y-auto"
              >
                «{formData.description}»
              </div>
            </div>

            {/* Field 4: Attached Media Preview Card */}
            <div
              className="border-b border-[#eae8e4]/80 dark:border-[#38271c] pb-2.5 space-y-1.5"
            >
              <div className="text-[#837565] dark:text-[#8e8680] text-[10px] font-semibold">
                {isEn ? "Attached Image" : "الصورة المرفقة"}
              </div>
              <div
                className="bg-white dark:bg-[#281c15] rounded-lg p-2 flex items-center justify-between border border-[#eae8e4] dark:border-[#38271c]"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-[#f0eeea] dark:bg-[#1a120d] border border-[#d6c4b1]/40 dark:border-[#38271c] rounded-lg size-9 overflow-hidden shrink-0 relative flex items-center justify-center">
                    <Image
                      src={formData.imageUrl || placeholderBannerImg}
                      alt="Thumbnail"
                      width={48}
                      height={36}
                      className="object-cover size-full"
                    />
                  </div>
                  <div>
                    <p className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] font-semibold max-w-[200px] truncate">
                      {formData.imageFileName || "security_update_banner.png"}
                    </p>
                    <p className="text-[#837565] dark:text-[#8e8680] text-[10px] font-medium">
                      {formData.imageFileSize || "480 KB"} •{" "}
                      {formData.imageDimensions ||
                        (isEn ? "800 × 450 px" : "800 × 450 بكسل")}
                    </p>
                  </div>
                </div>
                <span className="bg-[#f0eeea] dark:bg-[#1a120d] text-[#514537] dark:text-[#cdc5bd] text-[10px] font-medium px-2 py-0.5 rounded-[2px]">
                  PNG
                </span>
              </div>
            </div>

            {/* Field 5: Action Destination Link */}
            <div className="space-y-1">
              <div className="text-[#837565] dark:text-[#8e8680] text-[10px] font-semibold">
                {isEn ? "Direct Action Link Included" : "رابط الإجراء المباشر المتضمن"}
              </div>
              <div
                className="bg-[#ffddb6]/20 dark:bg-[#281c15] border border-[#ffddb6]/40 dark:border-[#4d3627] rounded-lg px-2.5 py-1.5 flex items-center gap-2"
              >
                <LinkIcon className="size-3.5 text-[#7b4e00] dark:text-[#e29d38] shrink-0" />
                <span className="text-[#7b4e00] dark:text-[#e29d38] text-[11px] font-semibold dir-ltr text-left truncate flex-1">
                  {formData.actionUrl || "https://aljudy.sa/law-firm/security-settings"}
                </span>
              </div>
            </div>
          </div>

          {/* Assurance & Audit Trail Callout */}
          <div
            className="bg-[#fff8e1] dark:bg-[#281c15] border border-[#ffe082]/80 dark:border-[#4d3627] rounded-xl p-3 flex items-start gap-2.5"
          >
            <ShieldCheck className="size-4 text-[#7b4e00] dark:text-[#e29d38] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="text-[#7b4e00] dark:text-[#e29d38] text-[10px] font-bold">
                {isEn ? "Instant Sovereign & Security Logging" : "توثيق أمني وسيادي فوري"}
              </div>
              <p className="text-[#643f00] dark:text-[#cdc5bd] text-[12px] leading-[16.5px]">
                {isEn
                  ? "The notification will be broadcast immediately to all law firms and logged in the security audit trail. Direct messages cannot be recalled after sending."
                  : "سيتم بث الإشعار فوراً لكافة المكاتب وتوثيق العملية في سجل التدقيق الأمني لا يمكن التراجع عن الرسائل بعد الإرسال المباشر."}
              </p>
            </div>
          </div>
        </div>

        {/* Action Bar Footer */}
        <div
          className="border-t border-[#eae8e4] dark:border-[#38271c] px-6 py-3.5 flex items-center justify-end gap-2.5 bg-white dark:bg-[#1a120d]"
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            className="bg-[#f0eeea] hover:bg-[#e4e2de] dark:bg-[#281c15] dark:hover:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            {isEn ? "Back to Edit" : "الرجوع للتعديل"}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSending}
            className="bg-[#9c6403] hover:bg-[#855402] dark:bg-[#e29d38] dark:hover:bg-[#c28328] text-white dark:text-[#1c140f] text-[12px] font-bold px-6 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm shadow-[#9c6403]/20 dark:shadow-none cursor-pointer disabled:opacity-50"
          >
            <Send className="size-3.5" />
            <span>
              {isSending
                ? isEn
                  ? "Sending..."
                  : "جارٍ الإرسال..."
                : isEn
                ? "Confirm & Send Notification"
                : "تأكيد وإرسال الإشعار"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
