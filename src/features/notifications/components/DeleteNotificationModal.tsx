"use client";

import React from "react";
import { X, Trash2, ShieldAlert, Clock, Building2 } from "lucide-react";
import { NotificationItem } from "../types/notifications.types";
import { useLanguage } from "@/lib/i18n";

interface DeleteNotificationModalProps {
  notification: NotificationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function DeleteNotificationModal({
  notification,
  isOpen,
  onClose,
  onConfirmDelete,
  isDeleting = false,
}: DeleteNotificationModalProps) {
  const { direction, isEn } = useLanguage();

  if (!isOpen || !notification) return null;

  return (
    <div
      dir={direction}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200"
    >
      <div
        className="bg-white rounded-[8px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] w-full max-w-[512px] overflow-hidden border border-[#eae8e4] relative scale-in-95 duration-150 text-start"
      >
        {/* Top Decorative Structural Accent */}
        <div className="h-[6px] w-full bg-[#ba1a1a]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="absolute end-[16px] top-[16px] size-[32px] bg-[#f5f3ef] hover:bg-[#e4e2de] rounded-[4px] flex items-center justify-center text-[#514537] hover:text-[#1b1c1a] transition-colors cursor-pointer"
          title={isEn ? "Close" : "إغلاق"}
        >
          <X className="size-[14px]" />
        </button>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Header with Restrained Destructive Badge */}
          <div className="flex items-start gap-3.5">
            <div
              className="bg-[#ffdad6]/60 rounded-[8px] size-12 flex items-center justify-center text-[#ba1a1a] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] shrink-0"
            >
              <Trash2 className="size-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-[22px] font-bold text-[#1b1c1a] leading-[26px]">
                  {isEn ? "Delete Notification" : "حذف الإشعار"}
                </h2>
                <span className="bg-[#ffdad6] text-[#93000a] text-[10px] font-semibold px-2 py-0.5 rounded-[2px]">
                  {isEn ? "Irreversible Action" : "إجراء لا تراجع فيه"}
                </span>
              </div>
              <p className="text-[14px] text-[#514537] mt-1.5 leading-[22.75px]">
                {isEn
                  ? "Are you sure you want to delete this notification from the system? Associated constraints will be removed."
                  : "هل أنت متأكد من رغبتك في حذف هذا الإشعار من المنظومة؟ سيترتب على ذلك إزالة القيود المرتبطة به."}
              </p>
            </div>
          </div>

          {/* Notification Details Card */}
          <div className="bg-[#f5f3ef] rounded-[4px] p-4 space-y-2.5 border border-[#e4e2de]/60">
            <div className="flex items-center justify-between">
              <span className="text-[#837565] text-[10px] font-bold">
                {notification.code}
              </span>
              <div className="bg-[#e4e2de] text-[#514537] text-[10px] font-medium px-2 py-0.5 rounded-[2px] flex items-center gap-1.5">
                <span>{notification.statusLabel}</span>
                <span className="size-1.5 rounded-full bg-[#837565]" />
              </div>
            </div>

            <h3 className="text-[#1b1c1a] text-[14px] font-bold leading-[20px]">
              {notification.title}
            </h3>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#514537]">
              <div className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-[#837565]" />
                <span>{notification.sentAt}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building2 className="size-3.5 text-[#837565]" />
                <span>
                  {notification.targetAudienceLabel} (
                  {isEn
                    ? `${notification.targetCount} firms`
                    : `${notification.targetCount} مكتب`}
                  )
                </span>
              </div>
            </div>
          </div>

          {/* Compliance & Regulatory Policy Box */}
          <div className="bg-[#f0eeea] rounded-[4px] p-3.5 flex items-start gap-2.5 border border-[#e4e2de]/70">
            <ShieldAlert className="size-4 text-[#837565] shrink-0 mt-0.5" />
            <div className="space-y-1 text-[12px] leading-[19.5px]">
              <div className="font-semibold text-[#1b1c1a]">
                {isEn ? "Regulatory & Archival Notice:" : "تنبيه نظامي وتوثيقي:"}
              </div>
              <p className="text-[#514537]">
                {isEn
                  ? "Deleting a draft notification removes the record permanently. If the notification was already broadcast to firms, an immutable archival copy will be retained in the Security Audit Log in compliance with electronic record regulations."
                  : "حذف مسودة الإشعار يزيل السجل نهائياً من شاشة الإشعارات المجدولة. في حال كان الإشعار قد تم بثه مسبقاً للمكاتب، سيتم الاحتفاظ بنسخة أرشيفية غير قابلة للتعديل في سجل التدقيق الأمني (Audit Log) امتثالاً لضوابط التوثيق الرقمي واللوائح المنظمة."}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="border-t border-[#eae8e4] px-6 py-4 flex items-center justify-end gap-2 bg-white">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="bg-[#f0eeea] hover:bg-[#e4e2de] text-[#1b1c1a] text-[12px] font-semibold px-4 py-2 rounded-[4px] transition-colors cursor-pointer"
          >
            {isEn ? "Cancel" : "الغاء"}
          </button>
          <button
            type="button"
            onClick={() => onConfirmDelete(notification.id)}
            disabled={isDeleting}
            className="bg-[#ba1a1a] hover:bg-[#93000a] text-white text-[12px] font-bold px-6 py-2 rounded-[4px] flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="size-3.5" />
            <span>
              {isDeleting
                ? isEn
                  ? "Deleting..."
                  : "جارٍ الحذف..."
                : isEn
                ? "Confirm Delete Notification"
                : "تأكيد حذف الإشعار"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
