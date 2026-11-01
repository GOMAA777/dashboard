"use client";

import React from "react";
import { X, Check, Shield, Clock, Users, Copy, CheckCheck, List, Plus } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n";

interface SendSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToList: () => void;
  onSendAnother: () => void;
  notificationData: {
    title: string;
    actionUrl: string;
    verificationCode?: string;
    targetCount?: number;
    formattedTimestamp?: string;
  };
}

export function SendSuccessModal({
  isOpen,
  onClose,
  onBackToList,
  onSendAnother,
  notificationData,
}: SendSuccessModalProps) {
  const { direction, isEn } = useLanguage();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(notificationData.actionUrl);
    setCopied(true);
    toast.success(
      isEn
        ? "Action destination copied successfully"
        : "تم نسخ وجهة الإجراء بنجاح"
    );
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      dir={direction}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200"
    >
      <div
        className="bg-white rounded-[8px] shadow-[0px_20px_50px_0px_rgba(28,20,15,0.22)] w-full max-w-[544px] overflow-hidden border border-[#eae8e4] relative scale-in-95 duration-150"
      >
        {/* Top Decorative Architectural Bar */}
        <div className="h-[6px] w-full bg-[#059669]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute end-[16px] top-[16px] size-[32px] rounded-[4px] flex items-center justify-center text-[#514537] hover:bg-[#f5f3ef] hover:text-[#1b1c1a] transition-colors cursor-pointer"
          title={isEn ? "Close" : "إغلاق"}
        >
          <X className="size-[14px]" />
        </button>

        {/* Modal Body Content */}
        <div className="p-6 pt-8 space-y-5 text-center">
          {/* Success Emblem */}
          <div className="relative mx-auto size-16 flex items-center justify-center">
            {/* Ambient Radial Glow */}
            <div className="absolute bg-[#10b981]/20 blur-[20px] rounded-full size-20 -inset-2" />
            {/* Outer Ring */}
            <div className="relative size-16 rounded-[12px] bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-center shadow-sm">
              <div className="size-12 rounded-[10px] bg-[#d1fae5] flex items-center justify-center text-[#059669] shadow-inner">
                <Check className="size-6 stroke-[2.5]" />
              </div>

              {/* Micro Judicial Gold Pip */}
              <div
                className="absolute -bottom-1 -right-1 size-[18px] rounded-full bg-[#9c6402] border-2 border-white flex items-center justify-center text-white"
                title={isEn ? "Officially Certified" : "موثق نظامياً"}
              >
                <Shield className="size-2.5 fill-current" />
              </div>
            </div>
          </div>

          {/* Headline & Subtitle */}
          <div className="space-y-1.5">
            <h2 className="text-[22px] font-bold text-[#1b1c1a] tracking-tight">
              {isEn ? "Notification Sent Successfully" : "تم إرسال الإشعار بنجاح"}
            </h2>
            <p className="text-[14px] text-[#514537] max-w-[420px] mx-auto leading-[22.75px]">
              {isEn
                ? "The organizational notification was successfully dispatched to all verified recipients with instant alerts via Aljoody Platform."
                : "تم توثيق ونشر الإشعار المؤسسي بنجاح إلى كافة المستلمين المعتمدين مع تفعيل التنبيهات الفورية عبر منصة الجودي."}
            </p>
          </div>

          {/* Audit & Verification Badge */}
          <div className="bg-[#e8f5e9] border border-[#c8e6c9] rounded-[8px] px-3 py-1.5 flex items-center justify-center gap-2 mx-auto w-fit">
            <span className="size-2 rounded-full bg-[#059669]" />
            <span className="text-[#064e3b] text-[12px] font-semibold">
              {isEn
                ? "Verified & logged in official operations registry"
                : "مؤكد وموثق بسجل العمليات النظامي"}
            </span>
            <span className="bg-[#d1fae5] text-[#065f46] text-[10px] font-bold px-1.5 py-0.5 rounded-[2px]">
              {notificationData.verificationCode || "NTF-8842-OK"}
            </span>
          </div>

          {/* Notification Summary Card */}
          <div className="bg-[#f5f3ef] rounded-[8px] p-4 text-start space-y-3.5 border border-[#eae8e4]">
            {/* Subject */}
            <div className="flex items-start justify-between border-b border-[#eae8e4] pb-3">
              <div className="flex items-start gap-2.5">
                <div className="bg-[#f0eeea] size-7 rounded-[4px] flex items-center justify-center text-[#7b4e00] shrink-0 mt-0.5 border border-[#e4e2de]">
                  <Shield className="size-3.5" />
                </div>
                <div>
                  <div className="text-[#514537] text-[10px] font-medium">
                    {isEn ? "Dispatched Notification Title" : "عنوان الإشعار الصادر"}
                  </div>
                  <h4 className="text-[#1b1c1a] text-[14px] font-bold leading-[20px]">
                    {notificationData.title}
                  </h4>
                </div>
              </div>

              <span className="bg-[rgba(123,78,0,0.1)] text-[#9c6402] text-[10px] font-bold px-2 py-0.5 rounded-[2px] shrink-0">
                {isEn ? "High Priority" : "عالي الأهمية"}
              </span>
            </div>

            {/* Target Segment & Scope */}
            <div className="grid grid-cols-2 gap-4 border-b border-[#eae8e4] pb-3">
              <div>
                <div className="text-[#514537] text-[10px] font-bold mb-1">
                  {isEn ? "Target Scope & Audience" : "النطاق والجمهور المستهدف"}
                </div>
                <div className="flex items-center gap-1.5 text-[#1b1c1a] text-[12px] font-semibold">
                  <Users className="size-3.5 text-[#7b4e00]" />
                  <span>
                    {isEn
                      ? `${notificationData.targetCount || 842} Certified Law Firms`
                      : `${notificationData.targetCount || 842} مكتب محاماة معتمد`}
                  </span>
                </div>
                <div className="text-[#837565] text-[10px] font-bold mt-0.5">
                  {isEn ? "All active licenses and partners" : "جميع التراخيص النشطة والشركاء"}
                </div>
              </div>

              <div>
                <div className="text-[#514537] text-[10px] font-bold mb-1">
                  {isEn ? "Certified Broadcast Time" : "توقيت البث الموثق"}
                </div>
                <div className="flex items-center gap-1.5 text-[#1b1c1a] text-[12px] font-semibold">
                  <Clock className="size-3.5 text-[#7b4e00]" />
                  <span>
                    {notificationData.formattedTimestamp ||
                      (isEn ? "Oct 24, 2026 • 11:42 AM" : "24 أكتوبر 2024 • 11:42 ص")}
                  </span>
                </div>
                <div className="text-[#837565] text-[10px] font-bold mt-0.5">
                  {isEn ? "Riyadh Time (UTC+3)" : "توقيت مكة المكرمة (الرياض)"}
                </div>
              </div>
            </div>

            {/* Deep Link */}
            <div className="space-y-1">
              <div className="text-[#514537] text-[10px] font-bold">
                {isEn ? "Attached Action Destination" : "وجهة الإجراء المرفقة"}
              </div>
              <div className="bg-white rounded-[2px] px-3 py-2 flex items-center justify-between border border-[#eae8e4]">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="p-1 text-[#837565] hover:text-[#1b1c1a] transition-colors rounded hover:bg-[#f5f3ef] cursor-pointer"
                  title={isEn ? "Copy link" : "نسخ الرابط"}
                >
                  {copied ? (
                    <CheckCheck className="size-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </button>
                <span className="text-[#514537] text-[12px] font-normal dir-ltr text-left truncate flex-1 mx-2">
                  {notificationData.actionUrl}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#eae8e4] px-6 py-4 flex items-center justify-end gap-2 bg-white">
          <button
            type="button"
            onClick={onSendAnother}
            className="bg-[#f0eeea] hover:bg-[#e4e2de] text-[#1b1c1a] text-[12px] font-semibold px-4 py-2 rounded-[4px] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>{isEn ? "Send New Notification" : "إرسال إشعار جديد"}</span>
          </button>
          <button
            type="button"
            onClick={onBackToList}
            className="bg-[#9c6403] hover:bg-[#855402] text-[#fff3e9] text-[12px] font-bold px-6 py-2 rounded-[4px] flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <List className="size-3.5" />
            <span>{isEn ? "Back to Notifications List" : "العودة إلى قائمة الإشعارات"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
