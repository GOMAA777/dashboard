"use client";

import React, { useState } from "react";
import { X, Trash2, AlertTriangle, RotateCcw } from "lucide-react";
import { InvoiceItem } from "../types/invoices.types";
import { useLanguage } from "@/lib/i18n";
import { ModalPortal } from "@/components/shared/ModalPortal";
import { DashboardSelect } from "@/components/shared/DashboardSelect";

interface CancelInvoiceModalProps {
  invoice: InvoiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (invoice: InvoiceItem, action: "refund" | "cancel") => void;
  isProcessing?: boolean;
}

export function CancelInvoiceModal({
  invoice,
  isOpen,
  onClose,
  onConfirm,
  isProcessing = false,
}: CancelInvoiceModalProps) {
  const { isEn, direction } = useLanguage();
  const [reason, setReason] = useState("طلب العميل استرداد المبلغ خلال فترة الضمان الذهبي");

  if (!isOpen || !invoice) return null;

  const isPaid = invoice.status === "paid";

  return (
    <ModalPortal isOpen={isOpen}>
      <div
        dir={direction}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="bg-white dark:bg-[#1a120d] rounded-[16px] shadow-[0px_20px_50px_0px_rgba(28,20,15,0.35)] w-full max-w-[480px] overflow-hidden flex flex-col border border-[#eae8e4] dark:border-[#38271c] animate-in zoom-in-95 duration-200 text-start"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="p-5 border-b border-[#eae8e4] dark:border-[#38271c] bg-[#faf8f5] dark:bg-[#221812] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-[8px] bg-[rgba(255,218,214,0.6)] dark:bg-[rgba(186,26,26,0.2)] text-[#ba1a1a] dark:text-[#f87171] flex items-center justify-center shrink-0">
              {isPaid ? <RotateCcw className="size-5" /> : <AlertTriangle className="size-5" />}
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {isPaid ? (isEn ? "Refund Tax Invoice" : "استرداد الفاتورة وإصدار إشعار دائن") : (isEn ? "Cancel Pending Invoice" : "إلغاء الفاتورة المعلقة")}
              </h2>
              <span className="font-mono text-[12px] font-bold text-[#ba1a1a] dark:text-[#f87171]">
                {invoice.invoiceNumber}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-[6px] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#837565] dark:text-[#a89f91] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-[#faf8f5] dark:bg-[#221812] rounded-[8px] p-3.5 border border-[#eae8e4] dark:border-[#38271c] text-[13px] space-y-1">
            <p className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {isEn ? invoice.lawFirmNameEn : invoice.lawFirmName}
            </p>
            <div className="flex items-center justify-between text-[12px] text-[#837565] dark:text-[#a89f91]">
              <span>{isEn ? "Amount to process:" : "المبلغ الخاضع للإجراء:"}</span>
              <span className="font-mono font-bold text-[#ba1a1a] dark:text-[#f87171]">
                {invoice.totalAmount.toLocaleString()} ر.س
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {isEn ? "Reason for cancellation / refund" : "سبب الإلغاء أو الاسترداد المالي"}
            </label>
            <DashboardSelect
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-10 text-[13px]"
            >
              <option value="طلب العميل استرداد المبلغ خلال فترة الضمان الذهبي">{isEn ? "Client requested refund under 14-day warranty" : "طلب العميل استرداد المبلغ خلال فترة الضمان الذهبي"}</option>
              <option value="تغيير الباقة وإعادة إصدار فاتورة سنوية جديدة">{isEn ? "Plan changed - Reissuing annual contract" : "تغيير الباقة وإعادة إصدار فاتورة سنوية جديدة"}</option>
              <option value="خطأ في بيانات العميل أو الرقم الضريبي">{isEn ? "Correction of Tax ID or billing info" : "خطأ في بيانات العميل أو الرقم الضريبي"}</option>
              <option value="تعثر تحصيل الفاتورة وإلغاء أمر الدفع">{isEn ? "Collection failed - Voiding payment order" : "تعثر تحصيل الفاتورة وإلغاء أمر الدفع"}</option>
            </DashboardSelect>
          </div>

          <p className="text-[11px] text-[#837565] dark:text-[#8e8680] leading-relaxed">
            {isEn
              ? "Note: Under ZATCA regulations, confirmed paid invoices will be marked as Refunded and an electronic Credit Note will be generated."
              : "تنبيه نظامي: وفق لوائح هيئة الزكاة والضريبة والجمارك، سيتم تسجيل إشعار دائن ضريبي معتمد وإلغاء احتساب الضريبة في الإقرار."}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#eae8e4] dark:border-[#38271c] bg-[#faf8f5] dark:bg-[#221812] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-[6px] bg-[#f0eeea] dark:bg-[#281c15] hover:bg-[#e4e1dc] text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] font-semibold cursor-pointer transition-colors"
          >
            {isEn ? "Cancel" : "تراجع"}
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={() => onConfirm(invoice, isPaid ? "refund" : "cancel")}
            className="h-9 px-5 rounded-[6px] bg-[#ba1a1a] hover:bg-[#991515] text-white text-[12px] font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all disabled:opacity-60"
          >
            {isPaid ? <RotateCcw className="size-3.5" /> : <Trash2 className="size-3.5" />}
            <span>
              {isProcessing
                ? (isEn ? "Processing..." : "جارٍ التنفيذ...")
                : isPaid
                ? (isEn ? "Confirm Refund" : "تأكيد الاسترداد وإصدار الإشعار")
                : (isEn ? "Confirm Cancellation" : "تأكيد الإلغاء")}
            </span>
          </button>
        </div>
      </div>
    </div>
  </ModalPortal>
  );
}

