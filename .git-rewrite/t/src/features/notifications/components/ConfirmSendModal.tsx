"use client";

import React from "react";
import Image from "next/image";
import { X, Send, ShieldCheck, Building2, Link as LinkIcon } from "lucide-react";
import { SendNotificationFormValues } from "../schemas/notifications.schemas";

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
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200"
      dir="rtl"
    >
      <div
        className="bg-white border border-[rgba(214,196,177,0.6)] rounded-[16px] shadow-[0px_20px_48px_0px_rgba(28,20,15,0.22)] w-full max-w-[576px] overflow-hidden relative scale-in-95 duration-150"
        data-node-id="1:13564"
      >
        {/* Top Subtle Gold Architectural Accent Line */}
        <div
          className="h-[6px] w-full bg-gradient-to-r from-[#9c6402] via-[#d4a03c] to-[#9c6402]"
          data-node-id="1:13565"
        />

        {/* Close Button Top Left in RTL */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSending}
          className="absolute left-[16px] top-[16px] size-[32px] rounded-[12px] flex items-center justify-center text-[#514537] hover:bg-[#f5f3ef] hover:text-[#1b1c1a] transition-colors cursor-pointer"
          data-node-id="1:13566"
          title="إغلاق"
        >
          <X className="size-[14px]" />
        </button>

        {/* Modal Body Wrapper */}
        <div className="p-6 space-y-4" data-node-id="1:13569">
          {/* Header & Graphic Indicator */}
          <div className="flex items-start gap-3.5" data-node-id="1:13570">
            <div
              className="bg-[rgba(255,221,182,0.4)] rounded-[8px] size-12 flex items-center justify-center text-[#7b4e00] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] shrink-0"
              data-node-id="1:13576"
            >
              <Send className="size-5" />
            </div>

            <div className="flex-1 min-w-0" data-node-id="1:13571">
              <h2
                className="text-[22px] font-bold text-[#1c140f] leading-[26px]"
                data-node-id="1:13573"
              >
                تأكيد إرسال الإشعار
              </h2>
              <p
                className="text-[14px] text-[#514537] mt-1 leading-[22px]"
                data-node-id="1:13575"
              >
                هل تريد إرسال هذا الإشعار المباشر إلى المستلمين المحددين؟
              </p>
            </div>
          </div>

          {/* Structured Summary Box */}
          <div
            className="bg-[#f5f3ef] rounded-[8px] p-4 space-y-3 border border-[#eae8e4]"
            data-node-id="1:13579"
          >
            {/* Field 1: Notification Title */}
            <div
              className="border-b border-[rgba(234,232,228,0.8)] pb-2.5 space-y-1"
              data-node-id="1:13580"
            >
              <div className="flex items-center justify-between">
                <span className="text-[#837565] text-[10px] font-semibold">
                  عنوان الإشعار الرسمي
                </span>
                <span
                  className="bg-[#ffdad6] text-[#93000a] text-[10px] font-bold px-1.5 py-0.5 rounded-[2px] flex items-center gap-1"
                  data-node-id="1:13582"
                >
                  <span className="size-1.5 rounded-full bg-[#ba1a1a]" />
                  <span>تنبيه إلزامي</span>
                </span>
              </div>
              <p
                className="text-[#1b1c1a] text-[14px] font-bold leading-[20px]"
                data-node-id="1:13589"
              >
                {formData.title || "تحديث أمني إلزامي: ترقية معايير المصادقة الثنائية (2FA)"}
              </p>
            </div>

            {/* Field 2: Target Audience */}
            <div
              className="border-b border-[rgba(234,232,228,0.8)] pb-2.5 space-y-1.5"
              data-node-id="1:13590"
            >
              <div className="text-[#837565] text-[10px] font-semibold">
                الجمهور والمستلمون المستهدفون
              </div>
              <div
                className="bg-white rounded-[4px] p-2 flex items-center justify-between border border-[#eae8e4]"
                data-node-id="1:13593"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-[#7b4e00]" />
                  <span className="text-[#1b1c1a] text-[12px] font-semibold">
                    {formData.audienceType === "all"
                      ? "جميع مكاتب المحاماة المشتركة"
                      : "مكتب محدد بعينه"}
                  </span>
                </div>
                <span className="bg-[#f0eeea] text-[#514537] text-[10px] font-medium px-2 py-0.5 rounded-[6px]">
                  {formData.audienceType === "all" ? "842 مكتب نشط" : "1 مكتب محدد"}
                </span>
              </div>
            </div>

            {/* Field 3: Concise Preview Snippet */}
            <div
              className="border-b border-[rgba(234,232,228,0.8)] pb-2.5 space-y-1"
              data-node-id="1:13600"
            >
              <div className="text-[#837565] text-[10px] font-semibold">نص الإشعار</div>
              <div
                className="bg-[rgba(255,255,255,0.6)] rounded-[4px] p-2.5 border border-[#eae8e4] text-[#514537] text-[12px] leading-[19.5px] max-h-[70px] overflow-y-auto"
                data-node-id="1:13603"
              >
                «{formData.description}»
              </div>
            </div>

            {/* Field 4: Attached Media Preview Card */}
            <div
              className="border-b border-[rgba(234,232,228,0.8)] pb-2.5 space-y-1.5"
              data-node-id="1:13607"
            >
              <div className="text-[#837565] text-[10px] font-semibold">الصورة المرفقة</div>
              <div
                className="bg-white rounded-[4px] p-2 flex items-center justify-between border border-[#eae8e4]"
                data-node-id="1:13610"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-[#f0eeea] border border-[rgba(214,196,177,0.4)] rounded-[6px] size-9 overflow-hidden shrink-0 relative flex items-center justify-center">
                    <Image
                      src={formData.imageUrl || "/figma/placeholder-banner.png"}
                      alt="Thumbnail"
                      width={48}
                      height={36}
                      className="object-cover size-full"
                    />
                  </div>
                  <div>
                    <p className="text-[#1b1c1a] text-[12px] font-semibold max-w-[200px] truncate">
                      {formData.imageFileName || "security_update_banner.png"}
                    </p>
                    <p className="text-[#837565] text-[10px] font-medium">
                      {formData.imageFileSize || "480 KB"} • {formData.imageDimensions || "800 × 450 بكسل"}
                    </p>
                  </div>
                </div>
                <span className="bg-[#f0eeea] text-[#514537] text-[10px] font-medium px-2 py-0.5 rounded-[2px]">
                  PNG
                </span>
              </div>
            </div>

            {/* Field 5: Action Destination Link */}
            <div className="space-y-1" data-node-id="1:13621">
              <div className="text-[#837565] text-[10px] font-semibold">
                رابط الإجراء المباشر المتضمن
              </div>
              <div
                className="bg-[rgba(255,221,182,0.2)] border border-[#ffddb6]/40 rounded-[4px] px-2.5 py-1.5 flex items-center gap-2"
                data-node-id="1:13624"
              >
                <LinkIcon className="size-3.5 text-[#7b4e00] shrink-0" />
                <span className="text-[#7b4e00] text-[11px] font-semibold dir-ltr text-left truncate flex-1">
                  {formData.actionUrl || "https://aljudy.sa/law-firm/security-settings"}
                </span>
              </div>
            </div>
          </div>

          {/* Assurance & Audit Trail Callout */}
          <div
            className="bg-[#fff8e1] border border-[rgba(255,224,130,0.8)] rounded-[8px] p-3 flex items-start gap-2.5"
            data-node-id="1:13629"
          >
            <ShieldCheck className="size-4 text-[#7b4e00] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="text-[#7b4e00] text-[10px] font-bold">
                توثيق أمني وسيادي فوري
              </div>
              <p className="text-[#643f00] text-[12px] leading-[16.5px]">
                سيتم بث الإشعار فوراً لكافة المكاتب وتوثيق العملية في سجل التدقيق الأمني لا يمكن التراجع عن الرسائل بعد الإرسال المباشر.
              </p>
            </div>
          </div>
        </div>

        {/* Background Horizontal Border & Actions */}
        <div
          className="border-t border-[#eae8e4] px-6 py-4 flex items-center justify-end gap-2 bg-white"
          data-node-id="1:13639"
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            className="bg-[#f0eeea] hover:bg-[#e4e2de] text-[#1b1c1a] text-[12px] font-semibold px-4 py-2 rounded-[4px] transition-colors cursor-pointer"
            data-node-id="1:13645"
          >
            الرجوع للتعديل
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSending}
            className="bg-[#9c6403] hover:bg-[#855402] text-[#fff3e9] text-[12px] font-bold px-6 py-2 rounded-[4px] flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            data-node-id="1:13641"
          >
            <Send className="size-3.5" />
            <span>{isSending ? "جارٍ الإرسال..." : "ارسال الاشعار"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
