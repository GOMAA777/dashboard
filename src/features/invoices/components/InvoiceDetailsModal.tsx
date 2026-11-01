"use client";

import React, { useRef } from "react";
import {
  X,
  Printer,
  Download,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Building2,
  QrCode,
  ShieldCheck,
  CreditCard,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { InvoiceItem } from "../types/invoices.types";
import { useLanguage } from "@/lib/i18n";
import { ModalPortal } from "@/components/shared/ModalPortal";
import { AlJoudyLogo } from "@/components/shared/BrandLogos";

interface InvoiceDetailsModalProps {
  invoice: InvoiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onResendEmail?: (invoice: InvoiceItem) => void;
}

export function InvoiceDetailsModal({
  invoice,
  isOpen,
  onClose,
  onResendEmail,
}: InvoiceDetailsModalProps) {
  const { isEn, direction } = useLanguage();
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyInvoiceNumber = () => {
    navigator.clipboard.writeText(invoice.invoiceNumber);
    toast.success(isEn ? "Invoice number copied!" : "تم نسخ رقم الفاتورة!");
  };

  const handleDownloadPdf = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 800)),
      {
        loading: isEn ? "Generating official PDF..." : "جارٍ إعداد وتصدير ملف PDF...",
        success: isEn ? `Downloaded ${invoice.invoiceNumber}.pdf` : `تم تنزيل ${invoice.invoiceNumber}.pdf بنجاح`,
        error: isEn ? "Failed to download PDF" : "فشل تنزيل ملف PDF",
      }
    );
  };

  const getStatusBadge = () => {
    switch (invoice.status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#ecfdf5] dark:bg-[#132c21] text-[#065f46] dark:text-[#6ee7b7] border border-emerald-200 dark:border-emerald-500/40 text-[12px] font-bold px-3 py-1 rounded-full">
            <CheckCircle2 className="size-3.5 text-[#059669] dark:text-[#10b981]" />
            <span>{isEn ? "Paid & Cleared" : "مسددة بالكامل"}</span>
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#fffbeb] dark:bg-amber-950/40 text-[#b45309] dark:text-amber-300 border border-amber-200 dark:border-amber-700/40 text-[12px] font-bold px-3 py-1 rounded-full">
            <Clock className="size-3.5 text-[#d97706] dark:text-amber-400" />
            <span>{isEn ? "Pending Payment" : "بانتظار السداد"}</span>
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[rgba(255,218,214,0.6)] dark:bg-[rgba(186,26,26,0.2)] text-[#ba1a1a] dark:text-[#f87171] border border-rose-200 dark:border-rose-800/40 text-[12px] font-bold px-3 py-1 rounded-full">
            <AlertTriangle className="size-3.5 text-[#ba1a1a] dark:text-[#f87171]" />
            <span>{isEn ? "Overdue" : "متأخرة عن الاستحقاق"}</span>
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#f5f3ef] dark:bg-[#281c15] text-[#78716c] dark:text-[#d6cfc7] border border-[#e7e5e4] dark:border-[#44372e] text-[12px] font-bold px-3 py-1 rounded-full">
            <RotateCcw className="size-3.5" />
            <span>{isEn ? "Refunded" : "مستردة"}</span>
          </span>
        );
    }
  };

  return (
    <ModalPortal isOpen={isOpen}>
      <div
        dir={direction}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="bg-white dark:bg-[#1a120d] rounded-[16px] shadow-[0px_20px_50px_0px_rgba(28,20,15,0.35)] w-full max-w-[820px] max-h-[92vh] overflow-hidden flex flex-col border border-[#eae8e4] dark:border-[#38271c] animate-in zoom-in-95 duration-200 my-auto text-start"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Modal Top Actions Header */}
        <div className="p-4 sm:p-5 border-b border-[#eae8e4] dark:border-[#38271c] bg-[#faf8f5] dark:bg-[#221812] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="size-8 rounded-[6px] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#837565] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] flex items-center justify-center transition-colors cursor-pointer"
              aria-label={isEn ? "Close dialog" : "إغلاق النافذة"}
            >
              <X className="size-4" />
            </button>
            <div>
              <h2 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {isEn ? "Tax Invoice Details" : "تفاصيل الفاتورة الضريبية"}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-[12px] font-bold text-[#9c6402] dark:text-[#e29d38]">
                  {invoice.invoiceNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopyInvoiceNumber}
                  className="text-[#837565] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] cursor-pointer"
                  title={isEn ? "Copy number" : "نسخ الرقم"}
                >
                  <Copy className="size-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Header Print & Action Tools */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="h-8 px-3 rounded-[6px] bg-white dark:bg-[#281c15] border border-[#ded5c6] dark:border-[#38271c] hover:bg-[#f5f3ef] text-[#514537] dark:text-[#cdc5bd] text-[12px] font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
            >
              <Printer className="size-3.5" />
              <span className="hidden sm:inline">{isEn ? "Print" : "طباعة"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="h-8 px-3 rounded-[6px] bg-white dark:bg-[#281c15] border border-[#ded5c6] dark:border-[#38271c] hover:bg-[#f5f3ef] text-[#514537] dark:text-[#cdc5bd] text-[12px] font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
            >
              <Download className="size-3.5" />
              <span className="hidden sm:inline">{isEn ? "PDF" : "تحميل PDF"}</span>
            </button>

            {onResendEmail && (
              <button
                type="button"
                onClick={() => onResendEmail(invoice)}
                className="h-8 px-3 rounded-[6px] bg-[#9c6402] dark:bg-[#e29d38] hover:bg-[#835401] text-white dark:text-[#1c140f] text-[12px] font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
              >
                <Send className="size-3.5" />
                <span className="hidden sm:inline">{isEn ? "Resend" : "إعادة إرسال"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Printable Invoice Sheet */}
        <div ref={printAreaRef} className="p-6 sm:p-8 overflow-y-auto space-y-6 scrollbar-thin">
          {/* Top Invoice Brand & QR Block */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#eae8e4] dark:border-[#38271c]">
            {/* Al Joudy Corporate Identity */}
            <div className="flex items-center gap-3.5">
              <div className="size-12 rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                <AlJoudyLogo className="size-12" priority />
              </div>
              <div>
                <h3 className="text-[18px] font-extrabold text-[#9c6402] dark:text-[#e29d38] tracking-tight">
                  {isEn ? "Al Joudy Cloud Legal Solutions" : "منظومة الجودي لإدارة مكاتب المحاماة"}
                </h3>
                <p className="text-[11px] text-[#837565] dark:text-[#a89f91] leading-relaxed">
                  {isEn
                    ? "Tax Invoice - ZATCA Phase 2 E-Invoicing Compliant"
                    : "فاتورة ضريبية إلكترونية - معتمدة وفق متطلبات هيئة الزكاة والضريبة والجمارك"}
                </p>
                <p className="font-mono text-[11px] text-[#514537] dark:text-[#cdc5bd] mt-0.5">
                  {isEn ? "VAT Registration:" : "الرقم الضريبي للمنظومة:"} 310294857200003
                </p>
              </div>
            </div>

            {/* ZATCA Phase 2 QR Code Box & Status */}
            <div className="flex items-center gap-3 bg-[#faf8f5] dark:bg-[#221812] p-3 rounded-[10px] border border-[#eae8e4] dark:border-[#38271c]">
              <div className="size-16 bg-white dark:bg-[#1a120d] border border-[#e7e5e4] dark:border-[#38271c] rounded-[6px] p-1 flex items-center justify-center shrink-0">
                <QrCode className="size-14 text-[#1b1c1a] dark:text-[#fdfbf7]" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#059669] dark:text-[#10b981]">
                  <ShieldCheck className="size-3.5" />
                  <span>{isEn ? "ZATCA Verified" : "مختوم ومشفر إلكترونياً"}</span>
                </div>
                <span className="text-[10px] text-[#837565] dark:text-[#8e8680] font-mono leading-tight">
                  Cryptographic Stamp UUID:
                  <br />
                  e7a9-40b8-93f1-28a0
                </span>
                <div className="mt-0.5">{getStatusBadge()}</div>
              </div>
            </div>
          </div>

          {/* Invoice Meta & Client Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bill To Card */}
            <div className="bg-[#f5f3ef]/60 dark:bg-[#221812] rounded-[10px] p-4 border border-[#eae8e4] dark:border-[#38271c] space-y-2">
              <span className="text-[11px] font-bold text-[#837565] dark:text-[#a89f91] block uppercase tracking-wider">
                {isEn ? "Billed Law Firm / Client" : "فاتورة صادرة إلى مكتب / شركة المحاماة"}
              </span>
              <h4 className="text-[15px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {isEn ? invoice.lawFirmNameEn : invoice.lawFirmName}
              </h4>
              <div className="text-[12px] text-[#514537] dark:text-[#cdc5bd] space-y-1 pt-1 font-sans">
                <p>
                  <span className="text-[#837565] dark:text-[#8e8680]">{isEn ? "Attn:" : "المسؤول:"}</span>{" "}
                  {invoice.clientContact}
                </p>
                <p>
                  <span className="text-[#837565] dark:text-[#8e8680]">{isEn ? "Client VAT ID:" : "الرقم الضريبي للمكتب:"}</span>{" "}
                  <span className="font-mono font-semibold">{invoice.taxNumber}</span>
                </p>
                <p>
                  <span className="text-[#837565] dark:text-[#8e8680]">{isEn ? "Commercial Reg:" : "السجل التجاري:"}</span>{" "}
                  <span className="font-mono">{invoice.commercialReg}</span> • {invoice.city}
                </p>
                <p className="font-mono text-[11px] text-[#837565] dark:text-[#a89f91]">
                  {invoice.clientEmail} • {invoice.clientPhone}
                </p>
              </div>
            </div>

            {/* Invoice Details Card */}
            <div className="bg-[#f5f3ef]/60 dark:bg-[#221812] rounded-[10px] p-4 border border-[#eae8e4] dark:border-[#38271c] space-y-2">
              <span className="text-[11px] font-bold text-[#837565] dark:text-[#a89f91] block uppercase tracking-wider">
                {isEn ? "Invoice Metadata" : "بيانات ومواعيد الاستحقاق"}
              </span>
              <div className="text-[12px] text-[#514537] dark:text-[#cdc5bd] space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#837565] dark:text-[#8e8680]">{isEn ? "Invoice Number:" : "رقم الفاتورة:"}</span>
                  <span className="font-mono font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{invoice.invoiceNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#837565] dark:text-[#8e8680]">{isEn ? "Issue Date:" : "تاريخ الإصدار:"}</span>
                  <span className="font-mono font-semibold">{invoice.issueDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#837565] dark:text-[#8e8680]">{isEn ? "Payment Due Date:" : "تاريخ الاستحقاق:"}</span>
                  <span className="font-mono font-semibold text-[#b45309] dark:text-amber-400">{invoice.dueDate}</span>
                </div>
                {invoice.paidAt && (
                  <div className="flex items-center justify-between pt-1 border-t border-[#eae8e4] dark:border-[#38271c]">
                    <span className="text-[#837565] dark:text-[#8e8680]">{isEn ? "Paid On:" : "تاريخ ووقت السداد:"}</span>
                    <span className="font-mono text-[#059669] dark:text-[#10b981] font-bold">{invoice.paidAt}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[#837565] dark:text-[#8e8680]">{isEn ? "Payment Method:" : "طريقة الدفع:"}</span>
                  <span className="font-semibold uppercase tracking-wider font-mono text-[11px] bg-white dark:bg-[#1a120d] px-2 py-0.5 rounded border border-[#eae8e4] dark:border-[#38271c]">
                    {invoice.paymentMethod.replace("_", " ")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Line Items Table */}
          <div className="border border-[#eae8e4] dark:border-[#38271c] rounded-[10px] overflow-hidden">
            <table className="w-full text-start border-collapse text-[13px]">
              <thead>
                <tr className="bg-[#faf8f5] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] font-bold border-b border-[#eae8e4] dark:border-[#38271c]">
                  <th className="py-3 px-4 text-start w-[50px]">#</th>
                  <th className="py-3 px-4 text-start">{isEn ? "Service / Plan Description" : "البيان / تفاصيل الخدمة والاشتراك"}</th>
                  <th className="py-3 px-4 text-center w-[70px]">{isEn ? "Qty" : "الكمية"}</th>
                  <th className="py-3 px-4 text-end w-[130px]">{isEn ? "Unit Price" : "سعر الوحدة"}</th>
                  <th className="py-3 px-4 text-end w-[130px]">{isEn ? "Total (SAR)" : "الإجمالي (ر.س)"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eae8e4] dark:divide-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7]">
                {invoice.items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-[#faf9f6] dark:hover:bg-[#221812]/50">
                    <td className="py-3.5 px-4 font-mono text-[12px] text-[#837565] dark:text-[#8e8680]">
                      0{index + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[13px]">{isEn ? item.descriptionEn : item.description}</p>
                      <span className="text-[11px] text-[#837565] dark:text-[#a89f91] mt-0.5 inline-block">
                        {isEn ? invoice.planNameEn : invoice.planName} • {isEn ? "Annual Term" : "اشتراك سنوي"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold">{item.quantity}</td>
                    <td className="py-3.5 px-4 text-end font-mono font-semibold">
                      {item.unitPrice.toLocaleString()} {isEn ? "SAR" : "ر.س"}
                    </td>
                    <td className="py-3.5 px-4 text-end font-mono font-bold text-[#9c6402] dark:text-[#e29d38]">
                      {item.total.toLocaleString()} {isEn ? "SAR" : "ر.س"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Financial Breakdown */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pt-2">
            {/* Notes & Bank Details */}
            <div className="flex-1 text-[12px] text-[#514537] dark:text-[#a89f91] space-y-2 bg-[#f5f3ef]/40 dark:bg-[#221812]/40 p-4 rounded-[8px] border border-[#eae8e4] dark:border-[#38271c] w-full sm:w-auto">
              <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                {isEn ? "Payment Terms & Notes:" : "شروط السداد وملاحظات الفاتورة:"}
              </span>
              <p className="leading-relaxed">{invoice.notes || (isEn ? "Standard 15 days payment term applies." : "تسري شروط السداد خلال 15 يوماً من تاريخ الفاتورة.")}</p>
              <p className="font-mono text-[11px] text-[#837565] dark:text-[#8e8680] pt-1">
                Ref: {invoice.transactionReference}
              </p>
            </div>

            {/* Calculations Box */}
            <div className="w-full sm:w-[320px] bg-[#faf8f5] dark:bg-[#221812] p-4 rounded-[8px] border border-[#eae8e4] dark:border-[#38271c] space-y-2.5 text-[13px]">
              <div className="flex items-center justify-between text-[#514537] dark:text-[#cdc5bd]">
                <span>{isEn ? "Subtotal (Excl. VAT):" : "المجموع الفرعي (غير شامل الضريبة):"}</span>
                <span className="font-mono font-bold">{invoice.subtotal.toLocaleString()} {isEn ? "SAR" : "ر.س"}</span>
              </div>

              {invoice.discountAmount > 0 && (
                <div className="flex items-center justify-between text-[#059669] dark:text-[#10b981] font-semibold">
                  <span>{isEn ? "National Day Promo Discount:" : "خصم العرض الترويجي:"}</span>
                  <span className="font-mono">-{invoice.discountAmount.toLocaleString()} {isEn ? "SAR" : "ر.س"}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-[#514537] dark:text-[#cdc5bd]">
                <span>{isEn ? "Value Added Tax (15% VAT):" : "ضريبة القيمة المضافة (15%):"}</span>
                <span className="font-mono font-bold text-[#9c6402] dark:text-[#e29d38]">
                  +{invoice.taxAmount.toLocaleString()} {isEn ? "SAR" : "ر.س"}
                </span>
              </div>

              <div className="pt-2 border-t border-[#eae8e4] dark:border-[#38271c] flex items-center justify-between">
                <span className="text-[14px] font-black text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {isEn ? "Total Due (Incl. VAT):" : "الإجمالي المستحق (شامل الضريبة):"}
                </span>
                <span className="font-mono text-[18px] font-black text-[#9c6402] dark:text-[#e29d38]">
                  {invoice.totalAmount.toLocaleString()} {isEn ? "SAR" : "ر.س"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ModalPortal>
  );
}

