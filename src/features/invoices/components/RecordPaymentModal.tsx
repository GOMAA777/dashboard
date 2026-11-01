"use client";

import React, { useState } from "react";
import { X, CheckCircle2, DollarSign, Calendar, CreditCard, Building2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { InvoiceItem, PaymentMethodType } from "../types/invoices.types";
import { useLanguage } from "@/lib/i18n";
import { ModalPortal } from "@/components/shared/ModalPortal";

interface RecordPaymentModalProps {
  invoice: InvoiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPayment: (invoice: InvoiceItem, paymentData: { method: PaymentMethodType; ref: string }) => void;
}

export function RecordPaymentModal({
  invoice,
  isOpen,
  onClose,
  onConfirmPayment,
}: RecordPaymentModalProps) {
  const { isEn, direction } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("mada");
  const [transactionRef, setTransactionRef] = useState(`TXN-MADA-${Math.floor(1000000 + Math.random() * 9000000)}`);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !invoice) return null;

  const handleMethodChange = (method: PaymentMethodType) => {
    setPaymentMethod(method);
    const prefix = method.toUpperCase().replace("_", "-");
    setTransactionRef(`TXN-${prefix}-${Math.floor(1000000 + Math.random() * 9000000)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmPayment(invoice, {
        method: paymentMethod,
        ref: transactionRef.trim() || `TXN-${Date.now()}`,
      });
    }, 400);
  };

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
          className="bg-white dark:bg-[#1a120d] rounded-[16px] shadow-[0px_20px_50px_0px_rgba(28,20,15,0.35)] w-full max-w-[500px] overflow-hidden flex flex-col border border-[#eae8e4] dark:border-[#38271c] animate-in zoom-in-95 duration-200 text-start font-['Cairo',sans-serif]"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="p-5 border-b border-[#eae8e4] dark:border-[#38271c] bg-[#faf8f5] dark:bg-[#221812] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-[8px] bg-[#ecfdf5] dark:bg-[#132c21] text-[#059669] dark:text-[#10b981] flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {isEn ? "Record Invoice Payment" : "تسجيل سداد وتحصيل الفاتورة"}
              </h2>
              <p className="text-[12px] text-[#837565] dark:text-[#a89f91] font-mono mt-0.5">
                {invoice.invoiceNumber}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-[6px] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#837565] dark:text-[#a89f91] transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {/* Summary Box */}
          <div className="bg-[#f5f3ef] dark:bg-[#251b14] p-4 rounded-[10px] border border-[#eae8e4] dark:border-[#38271c] space-y-2">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#837565] dark:text-[#a89f91]">
                {isEn ? "Law Firm:" : "مكتب المحاماة:"}
              </span>
              <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7] truncate max-w-[240px]">
                {isEn ? invoice.lawFirmNameEn : invoice.lawFirmName}
              </span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#837565] dark:text-[#a89f91]">
                {isEn ? "Plan / Subscription:" : "الباقة المستحقة:"}
              </span>
              <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {isEn ? invoice.planNameEn : invoice.planName}
              </span>
            </div>
            <div className="pt-2 border-t border-[#eae8e4] dark:border-[#38271c] flex items-center justify-between">
              <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {isEn ? "Total Required Amount:" : "المبلغ الإجمالي للتحصيل:"}
              </span>
              <span className="text-[18px] font-black font-mono text-[#059669] dark:text-[#10b981]">
                {invoice.totalAmount.toLocaleString()} {isEn ? "SAR" : "ر.س"}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-2">
              {isEn ? "Payment Method Used" : "طريقة التحصيل / وسيلة السداد"}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "mada", label: "مدى (mada)" },
                { id: "visa", label: "VISA" },
                { id: "mastercard", label: "Mastercard" },
                { id: "apple_pay", label: "Apple Pay" },
                { id: "bank_transfer", label: isEn ? "Bank Wire" : "تحويل بنكي" },
                { id: "stripe", label: "Stripe" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleMethodChange(m.id as PaymentMethodType)}
                  className={`p-2 rounded-[6px] text-[12px] font-bold border text-center transition-all cursor-pointer ${
                    paymentMethod === m.id
                      ? "bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] border-[#9c6402] dark:border-[#e29d38] shadow-xs"
                      : "bg-[#f5f3ef] dark:bg-[#251b14] border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:bg-[#eae8e4]"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction Reference Input */}
          <div>
            <label className="block text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1.5">
              {isEn ? "Bank / Gateway Reference Number" : "رقم المرجع البنكي / الإيصال"}
            </label>
            <input
              type="text"
              required
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              placeholder="e.g. TXN-MADA-8910245"
              className="w-full bg-[#f5f3ef] dark:bg-[#251b14] border border-[#eae8e4] dark:border-[#38271c] rounded-[8px] px-3.5 py-2 text-[13px] font-mono text-[#1b1c1a] dark:text-[#fdfbf7] focus:outline-none focus:ring-1 focus:ring-[#9c6402]"
            />
          </div>

          {/* ZATCA Tax Compliance Notice */}
          <div className="bg-[#ecfdf5] dark:bg-[#132c21] p-3 rounded-[8px] border border-emerald-200 dark:border-emerald-500/40 flex items-start gap-2.5 text-[11px] text-[#065f46] dark:text-[#6ee7b7]">
            <ShieldCheck className="size-4 shrink-0 text-[#059669] dark:text-[#10b981] mt-0.5" />
            <p className="leading-relaxed">
              {isEn
                ? "Recording payment will immediately clear this invoice under ZATCA Phase 2, update tax ledgers, and trigger a payment receipt confirmation to the law firm."
                : "تسجيل السداد سيحول الفاتورة فوراً إلى حالة معتمدة (Cleared) في منظومة الزكاة والضريبة، وسيرسل سند قبض ضريبي معتمد إلى بريد مكتب المحاماة."}
            </p>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-[#eae8e4] dark:border-[#38271c] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-[13px] font-bold rounded-[6px] bg-[#f5f3ef] dark:bg-[#2c2621] hover:bg-[#eae8e4] dark:hover:bg-[#38332c] text-[#514537] dark:text-[#cdc5bd] transition-colors cursor-pointer"
            >
              {isEn ? "Cancel" : "إلغاء"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-[13px] font-bold rounded-[6px] bg-[#059669] hover:bg-[#047857] active:bg-[#065f46] text-white flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-60"
            >
              <CheckCircle2 className="size-4" />
              <span>{isSubmitting ? (isEn ? "Processing..." : "جارٍ الاعتماد...") : (isEn ? "Confirm Payment" : "تأكيد واستلام السداد")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </ModalPortal>
  );
}

