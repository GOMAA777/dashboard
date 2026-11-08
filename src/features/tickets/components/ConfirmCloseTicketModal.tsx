"use client";

import React from "react";
import { X, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { ModalPortal } from "@/components/shared/ModalPortal";

interface ConfirmCloseTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  ticketNumber: string;
  ticketTitle: string;
  isSubmitting?: boolean;
}

export function ConfirmCloseTicketModal({
  isOpen,
  onClose,
  onConfirm,
  ticketNumber,
  ticketTitle,
  isSubmitting = false,
}: ConfirmCloseTicketModalProps) {
  const { t, direction } = useLanguage();

  if (!isOpen) return null;

  return (
    <ModalPortal isOpen={isOpen}>
      <div
        dir={direction}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-['Cairo']"
        onClick={(e) => {
          if (e.target === e.currentTarget && !isSubmitting) onClose();
        }}
      >
        <div
          className="bg-white dark:bg-[#221812] rounded-[12px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1)] border border-[#e6e2dc] dark:border-[#38271c] w-full max-w-[500px] overflow-hidden"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-[#f0eeea] dark:border-[#38271c] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#ecfdf5] dark:bg-[#132c1c] size-[40px] rounded-[10px] flex items-center justify-center text-[#10b981] shrink-0">
                <CheckCircle2 className="size-[20px]" />
              </div>
              <h3 className="text-[18px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("تأكيد إغلاق تذكرة الدعم؟", "Confirm Close Support Ticket?")}
              </h3>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="p-1.5 text-[#837565] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] rounded-[6px] transition-colors cursor-pointer"
            >
              <X className="size-[18px]" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 text-start">
            <div className="bg-[#f5f3ef] dark:bg-[#281c15] rounded-[8px] p-4 border border-[#e6e2dc] dark:border-[#38271c]">
              <span className="text-[11px] font-mono font-bold text-[#625d5d] dark:text-[#a89f91] block">
                {ticketNumber}
              </span>
              <p className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] mt-1">
                {ticketTitle}
              </p>
            </div>

            <p className="text-[13px] text-[#514537] dark:text-[#cdc5bd] leading-[22px]">
              {t(
                "هل أنت متأكد من رغبتك في إغلاق هذه التذكرة بنجاح واعتماد حل المشكلة؟ سيتم توثيق إغلاق التذكرة في سجل المراجعة وإشعار العميل.",
                "Are you sure you want to close this ticket successfully and confirm resolution? This action will be recorded in the audit trail and the client will be notified."
              )}
            </p>
          </div>

          {/* Footer */}
          <div className="p-4 bg-[#fbf9f6] dark:bg-[#221812] border-t border-[#f0eeea] dark:border-[#38271c] flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-5 py-2.5 bg-[#f0eeea] dark:bg-[#281c15] hover:bg-[#e6e2dc] text-[#514537] dark:text-[#a89f91] rounded-[6px] text-[13px] font-semibold transition-colors cursor-pointer"
            >
              {t("إلغاء", "Cancel")}
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={onConfirm}
              className="px-6 py-2.5 bg-[#9c6402] hover:bg-[#855402] text-white rounded-[6px] text-[13px] font-bold shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t("جاري الإغلاق...", "Closing...")}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-[16px]" />
                  <span>{t("تأكيد الإغلاق", "Confirm Close")}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
