"use client";

import React from "react";
import { X, Shield, LogOut, Info } from "lucide-react";

interface EndPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeName: string;
  onConfirmEnd: () => void;
  sessionDuration?: string;
}

export function EndPreviewModal({
  isOpen,
  onClose,
  employeeName,
  onConfirmEnd,
  sessionDuration = "04:21 دقيقة",
}: EndPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        className="bg-white rounded-[12px] border border-[#e6e2dc] shadow-2xl max-w-[560px] w-full overflow-hidden"
        data-node-id="1:10899"
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
                إنهاء المعاينة والعودة لحساب المشرف؟
              </h2>
              <p className="text-[12px] text-[#79716b] mt-1">
                نظام الرقابة المؤسسية • منصة الجودي
              </p>
            </div>

            <div className="size-[44px] rounded-[10px] bg-[#f5efe6] flex items-center justify-center shrink-0">
              <Shield className="size-[22px] text-[#9c6402]" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-2 space-y-4">
          <p className="text-[13px] text-[#514537] leading-[22px] text-start">
            أنت على وشك مغادرة وضع المعاينة بصفة الموظف ({employeeName}) واستعادة هوية المشرف العام بكامل الصلاحيات الإدارية والمالية.
          </p>

          <div className="bg-[#fcfaf7] p-4 rounded-[8px] border border-[#f0ece5] space-y-3 text-start">
            {/* Field 1 */}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#79716b]">الحساب المستعاد:</span>
              <span className="font-bold text-[#1b1c1a] flex items-center gap-1.5">
                <span>م. عبد العزيز بن فهد (مشرف النظام العام)</span>
                <Shield className="size-[14px] text-[#9c6402]" />
              </span>
            </div>

            {/* Field 2 */}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#79716b]">معرف الجلسة الرقابية:</span>
              <span className="font-mono text-[11px] font-bold text-[#8e5927] bg-[#fbf5ed] px-2 py-0.5 rounded-[4px] border border-[#f2e2ce]">
                LOG-9842-ACT
              </span>
            </div>

            {/* Field 3 */}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#79716b]">مدة الجلسة المنقضية:</span>
              <span className="font-bold text-[#1b1c1a] font-mono">
                {sessionDuration}
              </span>
            </div>

            {/* ISO notice */}
            <div className="pt-3 border-t border-[#f0ece5] flex items-start gap-2 text-[11px] text-[#79716b] leading-[18px]">
              <Info className="size-[14px] text-[#9c6402] shrink-0 mt-0.5" />
              <span>
                سيتم إغلاق الجلسة وتوثيق ملخص النشاط الرقابي تلقائياً في سجل تدقيق النظام وفق ضوابط الأمن السيبراني ISO-27001.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-[#f2efe9] flex items-center justify-start gap-3">
          <button
            type="button"
            onClick={onConfirmEnd}
            className="px-5 py-2.5 rounded-[6px] bg-[#9c6402] hover:bg-[#855402] text-white text-[13px] font-bold flex items-center gap-2 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors"
          >
            <LogOut className="size-[15px]" />
            <span>تأكيد الإنهاء</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-[6px] bg-[#f5f3ef] hover:bg-[#eae6e0] text-[#514537] text-[13px] font-semibold transition-colors"
          >
            متابعة المعاينة
          </button>
        </div>
      </div>
    </div>
  );
}
