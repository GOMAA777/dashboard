"use client";

import React from "react";
import Image from "next/image";
import { X, ExternalLink, Copy, CheckCheck, Clock, Building2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { NotificationItem } from "../types/notifications.types";

interface NotificationDetailsModalProps {
  notification: NotificationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (notification: NotificationItem) => void;
}

export function NotificationDetailsModal({
  notification,
  isOpen,
  onClose,
  onEdit,
}: NotificationDetailsModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !notification) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(notification.actionUrl);
    setCopied(true);
    toast.success("تم نسخ رابط الإجراء بنجاح");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-[12px] shadow-[0px_20px_48px_0px_rgba(28,20,15,0.22)] w-full max-w-[620px] overflow-hidden border border-[#eae8e4] relative scale-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Top Gold Accent Line */}
        <div className="h-[6px] w-full bg-gradient-to-r from-[#9c6402] via-[#d4a03c] to-[#9c6402] shrink-0" />

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-[#eae8e4] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#ffddb6]/40 text-[#7b4e00] size-9 rounded-[8px] flex items-center justify-center font-bold text-[12px]">
              {notification.code}
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-[#1b1c1a]">تفاصيل الإشعار</h2>
              <p className="text-[12px] text-[#837565]">سجل الإشعار المعتمد في المنظومة</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-[32px] rounded-[6px] flex items-center justify-center text-[#514537] hover:bg-[#f5f3ef] hover:text-[#1b1c1a] transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="size-[16px]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Status & Priority Row */}
          <div className="flex items-center justify-between bg-[#f5f3ef] p-3 rounded-[6px]">
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[#514537] font-semibold">حالة الإرسال:</span>
              <span className="bg-white px-2.5 py-0.5 rounded text-[11px] font-bold text-[#1b1c1a] border border-[#e4e2de]">
                {notification.statusLabel}
              </span>
            </div>

            {notification.categoryBadge && (
              <span className="bg-[#ffddb6]/40 text-[#7b4e00] text-[11px] font-bold px-2 py-0.5 rounded-[4px]">
                {notification.categoryBadge}
              </span>
            )}
          </div>

          {/* Title */}
          <div className="space-y-1">
            <span className="text-[#837565] text-[11px] font-semibold">عنوان الإشعار</span>
            <h3 className="text-[16px] font-bold text-[#1b1c1a] leading-[24px]">
              {notification.title}
            </h3>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <span className="text-[#837565] text-[11px] font-semibold">نص الإشعار المرسل</span>
            <div className="bg-[#f5f3ef] rounded-[6px] p-3 text-[13px] text-[#514537] leading-[22px] border border-[#eae8e4]">
              {notification.description}
            </div>
          </div>

          {/* Image Banner if present */}
          {notification.imageUrl && (
            <div className="space-y-1">
              <span className="text-[#837565] text-[11px] font-semibold">الصورة المرفقة</span>
              <div className="relative rounded-[6px] overflow-hidden border border-[#eae8e4] h-[160px] bg-[#f0eeea]">
                <Image
                  src={notification.imageUrl}
                  alt={notification.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Target Audience & Timestamp Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#f5f3ef] p-3 rounded-[6px] space-y-1 border border-[#eae8e4]">
              <div className="flex items-center gap-1.5 text-[11px] text-[#837565]">
                <Building2 className="size-3.5 text-[#7b4e00]" />
                <span>الجمهور المستهدف</span>
              </div>
              <p className="text-[13px] font-bold text-[#1b1c1a]">
                {notification.targetAudienceLabel}
              </p>
              <p className="text-[11px] text-[#514537]">
                العدد الإجمالي: {notification.targetCount} مكتب
              </p>
            </div>

            <div className="bg-[#f5f3ef] p-3 rounded-[6px] space-y-1 border border-[#eae8e4]">
              <div className="flex items-center gap-1.5 text-[11px] text-[#837565]">
                <Clock className="size-3.5 text-[#7b4e00]" />
                <span>تاريخ وتوقيت البث</span>
              </div>
              <p className="text-[13px] font-bold text-[#1b1c1a]">
                {notification.sentAt}
              </p>
              <p className="text-[11px] text-[#514537]">
                توقيت مكة المكرمة (الرياض)
              </p>
            </div>
          </div>

          {/* Action Destination URL */}
          <div className="space-y-1">
            <span className="text-[#837565] text-[11px] font-semibold">رابط الإجراء المباشر</span>
            <div className="bg-[#f5f3ef] rounded-[6px] p-2.5 flex items-center justify-between border border-[#eae8e4]">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="p-1 text-[#837565] hover:text-[#1b1c1a] transition-colors rounded hover:bg-white cursor-pointer"
                  title="نسخ الرابط"
                >
                  {copied ? (
                    <CheckCheck className="size-4 text-emerald-600" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
                <a
                  href={notification.actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-[#837565] hover:text-[#9c6402] transition-colors rounded hover:bg-white"
                  title="فتح الرابط في نافذة جديدة"
                >
                  <ExternalLink className="size-4" />
                </a>
              </div>
              <span className="text-[12px] text-[#1b1c1a] font-mono dir-ltr text-left truncate flex-1 mx-2">
                {notification.actionUrl}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#eae8e4] bg-[#f5f3ef] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="bg-white hover:bg-[#e4e2de] text-[#1b1c1a] text-[13px] font-semibold px-5 py-2 rounded-[6px] border border-[#d6c4b1] transition-colors cursor-pointer"
          >
            إغلاق
          </button>

          {notification.status === "draft" && onEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(notification);
              }}
              className="bg-[#9c6402] hover:bg-[#855402] text-white text-[13px] font-bold px-5 py-2 rounded-[6px] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="size-4 rtl:rotate-0 ltr:rotate-180" />
              <span>متابعة إرسال المسودة</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
