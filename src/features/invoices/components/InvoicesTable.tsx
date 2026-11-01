"use client";

import React, { useState } from "react";
import {
  Eye,
  Download,
  Copy,
  Check,
  RotateCcw,
  AlertTriangle,
  Building2,
  Calendar,
  CreditCard,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  Send,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { InvoiceItem, InvoiceStatus, PaymentMethodType } from "../types/invoices.types";
import { PageSizeDropdown } from "@/components/shared/PageSizeDropdown";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface InvoicesTableProps {
  data: InvoiceItem[];
  onViewInvoice: (invoice: InvoiceItem) => void;
  onDownloadPdf: (invoice: InvoiceItem) => void;
  onCancelInvoice: (invoice: InvoiceItem) => void;
  onRecordPayment?: (invoice: InvoiceItem) => void;
  onResendEmail?: (invoice: InvoiceItem) => void;
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newSize: number) => void;
}

export function InvoicesTable({
  data,
  onViewInvoice,
  onDownloadPdf,
  onCancelInvoice,
  onRecordPayment,
  onResendEmail,
  pageIndex,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: InvoicesTableProps) {
  const { isEn, t, direction } = useLanguage();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalItems);

  const handleCopy = (invoiceNumber: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(invoiceNumber);
    setCopiedId(id);
    toast.success(isEn ? "Invoice number copied!" : "تم نسخ رقم الفاتورة بنجاح!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return (
          <div className="bg-[#ecfdf5] border border-emerald-200 dark:bg-[#132c21] dark:border-emerald-500/40 dark:shadow-[0_0_10px_rgba(16,185,129,0.15)] flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit">
            <span className="font-bold text-[11px] text-[#065f46] dark:text-[#6ee7b7]">
              {isEn ? "Paid" : "مسددة"}
            </span>
            <div className="bg-[#10b981] shadow-[0_0_8px_#10b981] ring-1 ring-emerald-400/60 rounded-full size-[7px] shrink-0" />
          </div>
        );
      case "pending":
        return (
          <div className="bg-[#fffbeb] border border-amber-200 dark:bg-[#342711] dark:border-amber-500/40 dark:shadow-[0_0_10px_rgba(245,158,11,0.15)] flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit">
            <span className="font-bold text-[11px] text-[#78350f] dark:text-[#fbbf24]">
              {isEn ? "Pending" : "معلقة"}
            </span>
            <div className="bg-[#f59e0b] shadow-[0_0_8px_#f59e0b] ring-1 ring-amber-400/60 rounded-full size-[7px] shrink-0" />
          </div>
        );
      case "overdue":
        return (
          <div className="bg-[#fef2f2] border border-red-200 dark:bg-[#311616] dark:border-red-500/40 dark:shadow-[0_0_10px_rgba(239,68,68,0.15)] flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit">
            <span className="font-bold text-[11px] text-[#991b1b] dark:text-[#f87171]">
              {isEn ? "Overdue" : "متأخرة"}
            </span>
            <div className="bg-[#ef4444] shadow-[0_0_8px_#ef4444] ring-1 ring-red-400/60 rounded-full size-[7px] shrink-0" />
          </div>
        );
      case "refunded":
        return (
          <div className="bg-[#f0eeea] border border-[#e2ded8] dark:bg-[#2c2621] dark:border-[#4d3627] flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit">
            <span className="font-bold text-[11px] text-[#514537] dark:text-[#cdc5bd]">
              {isEn ? "Refunded" : "مستردة"}
            </span>
            <div className="bg-[#837565] rounded-full size-[7px] shrink-0" />
          </div>
        );
    }
  };

  const getPaymentMethodBadge = (method: PaymentMethodType) => {
    switch (method) {
      case "mada":
        return (
          <span className="inline-flex items-center gap-1 bg-[#f0fdf4] dark:bg-[#142d1f] text-[#166534] dark:text-[#86efac] border border-emerald-200 dark:border-emerald-700/40 px-2 py-0.5 rounded-[4px] text-[11px] font-bold">
            مدى (mada)
          </span>
        );
      case "visa":
        return (
          <span className="inline-flex items-center gap-1 bg-[#eff6ff] dark:bg-[#15253e] text-[#1e40af] dark:text-[#93c5fd] border border-blue-200 dark:border-blue-700/40 px-2 py-0.5 rounded-[4px] text-[11px] font-bold font-mono">
            VISA
          </span>
        );
      case "mastercard":
        return (
          <span className="inline-flex items-center gap-1 bg-[#fff7ed] dark:bg-[#341d11] text-[#9a3412] dark:text-[#fdba74] border border-orange-200 dark:border-orange-700/40 px-2 py-0.5 rounded-[4px] text-[11px] font-bold">
            Mastercard
          </span>
        );
      case "apple_pay":
        return (
          <span className="inline-flex items-center gap-1 bg-[#f8fafc] dark:bg-[#1e1b18] text-[#334155] dark:text-[#e2e8f0] border border-slate-200 dark:border-slate-700/40 px-2 py-0.5 rounded-[4px] text-[11px] font-bold">
            Apple Pay
          </span>
        );
      case "bank_transfer":
        return (
          <span className="inline-flex items-center gap-1 bg-[#faf5ff] dark:bg-[#271738] text-[#6b21a8] dark:text-[#d8b4fe] border border-purple-200 dark:border-purple-700/40 px-2 py-0.5 rounded-[4px] text-[11px] font-bold">
            {isEn ? "Wire Transfer" : "تحويل بنكي"}
          </span>
        );
      case "stripe":
        return (
          <span className="inline-flex items-center gap-1 bg-[#eef2ff] dark:bg-[#1d1e3d] text-[#3730a3] dark:text-[#a5b4fc] border border-indigo-200 dark:border-indigo-700/40 px-2 py-0.5 rounded-[4px] text-[11px] font-bold font-mono">
            Stripe
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#eae8e4] dark:border-[#38271c] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] overflow-hidden transition-colors">
      {/* Table responsive container */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-start border-collapse text-[13px]">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#faf8f5] dark:bg-[#1c140f] border-b border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#a89f91] text-[12px] font-bold">
              <th className="py-3.5 px-4 text-start font-bold whitespace-nowrap">
                {isEn ? "Invoice No." : "رقم الفاتورة"}
              </th>
              <th className="py-3.5 px-4 text-start font-bold whitespace-nowrap">
                {isEn ? "Law Firm / Client" : "مكتب المحاماة / العميل"}
              </th>
              <th className="py-3.5 px-4 text-start font-bold whitespace-nowrap">
                {isEn ? "Plan & Period" : "الباقة ودورة السداد"}
              </th>
              <th className="py-3.5 px-4 text-start font-bold whitespace-nowrap">
                {isEn ? "Issue & Due Date" : "تاريخ الإصدار والاستحقاق"}
              </th>
              <th className="py-3.5 px-4 text-start font-bold whitespace-nowrap">
                {isEn ? "Total (Incl. VAT 15%)" : "الإجمالي (شامل الضريبة 15%)"}
              </th>
              <th className="py-3.5 px-4 text-start font-bold whitespace-nowrap">
                {isEn ? "Payment Method" : "طريقة السداد"}
              </th>
              <th className="py-3.5 px-4 text-start font-bold whitespace-nowrap">
                {isEn ? "Status" : "الحالة"}
              </th>
              <th className="py-3.5 px-4 text-center font-bold whitespace-nowrap min-w-[210px]">
                {isEn ? "Actions" : "الإجراءات"}
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#f5f3ef] dark:divide-[#2f2219]">
            {data.map((invoice) => {
              const isPaid = invoice.status === "paid";
              const isPendingOrOverdue = invoice.status === "pending" || invoice.status === "overdue";
              const isRefunded = invoice.status === "refunded";

              return (
                <tr
                  key={invoice.id}
                  onClick={() => onViewInvoice(invoice)}
                  className="hover:bg-[#faf8f5]/80 dark:hover:bg-[#281c15]/60 transition-colors cursor-pointer group"
                >
                  {/* 1. Invoice Number & Order sequence */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-[#1b1c1a] dark:text-[#fdfbf7] group-hover:text-[#9c6402] dark:group-hover:text-[#e29d38] transition-colors">
                            {invoice.invoiceNumber}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleCopy(invoice.invoiceNumber, invoice.id, e)}
                            className="text-[#837565] hover:text-[#9c6402] dark:text-[#a89f91] dark:hover:text-[#e29d38] p-1 rounded transition-colors"
                            title={isEn ? "Copy invoice number" : "نسخ رقم الفاتورة"}
                          >
                            {copiedId === invoice.id ? (
                              <Check className="size-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="size-3.5" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-mono text-[#837565] dark:text-[#7d746d]">
                            #{invoice.orderNumber}
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#059669] dark:text-[#10b981]">
                            <ShieldCheck className="size-3" />
                            <span>{invoice.zatcaComplianceStatus === "cleared" ? (isEn ? "Cleared" : "معتمد") : (isEn ? "Reported" : "مبلّغ")}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 2. Law Firm & Contact */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col max-w-[220px]">
                      <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7] truncate" title={isEn ? invoice.lawFirmNameEn : invoice.lawFirmName}>
                        {isEn ? invoice.lawFirmNameEn : invoice.lawFirmName}
                      </span>
                      <span className="text-[11px] text-[#514537] dark:text-[#a89f91] truncate mt-0.5">
                        {invoice.clientContact} • {invoice.clientEmail}
                      </span>
                      <span className="text-[10px] text-[#837565] dark:text-[#7d746d] font-mono mt-0.5">
                        {isEn ? "VAT:" : "الرقم الضريبي:"} {invoice.taxNumber}
                      </span>
                    </div>
                  </td>

                  {/* 3. Plan Name & Billing Cycle */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px]">
                        {isEn ? invoice.planNameEn : invoice.planName}
                      </span>
                      <span className="text-[11px] text-[#837565] dark:text-[#a89f91] mt-0.5">
                        {invoice.billingPeriod === "annual"
                          ? isEn
                            ? "Annual Billing (1 Year)"
                            : "سداد سنوي (سنة كاملة)"
                          : isEn
                          ? "Monthly Billing"
                          : "سداد شهري"}
                      </span>
                    </div>
                  </td>

                  {/* 4. Issue & Due Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 text-[12px] font-mono font-medium text-[#1b1c1a] dark:text-[#fdfbf7]">
                        <Calendar className="size-3.5 text-[#837565] dark:text-[#a89f91]" />
                        <span>{invoice.issueDate}</span>
                      </div>
                      <span className="text-[11px] text-[#837565] dark:text-[#7d746d] mt-0.5 font-mono">
                        {isEn ? "Due:" : "استحقاق:"} {invoice.dueDate}
                      </span>
                    </div>
                  </td>

                  {/* 5. Total Amount (with 15% VAT) */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[15px] font-black font-mono text-[#1b1c1a] dark:text-[#fdfbf7]">
                          {invoice.totalAmount.toLocaleString()}
                        </span>
                        <span className="text-[11px] font-bold text-[#9c6402] dark:text-[#e29d38]">
                          {isEn ? invoice.currency : "ر.س"}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#837565] dark:text-[#7d746d] font-mono">
                        {isEn ? "VAT 15%:" : "الضريبة 15%:"} {invoice.taxAmount.toLocaleString()} {isEn ? "SAR" : "ر.س"}
                      </span>
                    </div>
                  </td>

                  {/* 6. Payment Method & Ref */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div>{getPaymentMethodBadge(invoice.paymentMethod)}</div>
                      <span className="text-[10px] font-mono text-[#837565] dark:text-[#7d746d] truncate max-w-[120px]">
                        {invoice.transactionReference}
                      </span>
                    </div>
                  </td>

                  {/* 7. Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(invoice.status)}
                  </td>

                  {/* 8. Actions (Prominent Button & Quick Action Icons) */}
                  <td
                    className="py-3.5 px-4 whitespace-nowrap text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {/* 1. Main Primary Action Button */}
                      {isPendingOrOverdue && (
                        <button
                          type="button"
                          onClick={() => {
                            if (onRecordPayment) onRecordPayment(invoice);
                            else onViewInvoice(invoice);
                          }}
                          className="px-2.5 py-1.5 rounded-[5px] bg-[#059669] hover:bg-[#047857] active:bg-[#065f46] text-white text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                          title={isEn ? "Record payment receipt" : "تسجيل سداد الفاتورة واستلام الدفعة"}
                        >
                          <CheckCircle2 className="size-3.5" />
                          <span>{isEn ? "Record Payment" : "تسجيل سداد"}</span>
                        </button>
                      )}

                      {isPaid && (
                        <button
                          type="button"
                          onClick={() => onViewInvoice(invoice)}
                          className="px-2.5 py-1.5 rounded-[5px] bg-[#faf8f5] hover:bg-[#f0ece1] dark:bg-[#281c15] dark:hover:bg-[#332219] text-[#9c6402] dark:text-[#e29d38] border border-[#eeddbb] dark:border-[#4d3627] text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer shrink-0"
                          title={isEn ? "View & print official tax invoice" : "عرض وطباعة الفاتورة الضريبية"}
                        >
                          <Eye className="size-3.5" />
                          <span>{isEn ? "View Invoice" : "عرض الفاتورة"}</span>
                        </button>
                      )}

                      {isRefunded && (
                        <button
                          type="button"
                          onClick={() => onViewInvoice(invoice)}
                          className="px-2.5 py-1.5 rounded-[5px] bg-[#f5f3ef] hover:bg-[#eae8e4] dark:bg-[#2c2621] dark:hover:bg-[#38332c] text-[#514537] dark:text-[#cdc5bd] border border-[#eae8e4] dark:border-[#38271c] text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer shrink-0"
                          title={isEn ? "View credit note" : "عرض الإشعار الدائن"}
                        >
                          <FileText className="size-3.5" />
                          <span>{isEn ? "Credit Note" : "عرض الإشعار"}</span>
                        </button>
                      )}

                      {/* 2. Secondary Quick Actions */}
                      <div className="flex items-center gap-1">
                        {/* Preview Eye icon for pending invoices */}
                        {isPendingOrOverdue && (
                          <button
                            type="button"
                            onClick={() => onViewInvoice(invoice)}
                            title={isEn ? "Preview Tax Invoice" : "معاينة الفاتورة الضريبية"}
                            className="p-1.5 rounded-[4px] bg-[#f5f3ef] dark:bg-[#2c2621] hover:bg-[#eae8e4] dark:hover:bg-[#38332c] text-[#514537] dark:text-[#cdc5bd] hover:text-[#9c6402] dark:hover:text-[#e29d38] transition-colors cursor-pointer"
                          >
                            <Eye className="size-3.5" />
                          </button>
                        )}

                        {/* Download PDF Button */}
                        <button
                          type="button"
                          onClick={() => onDownloadPdf(invoice)}
                          title={isEn ? "Download PDF Invoice" : "تحميل الفاتورة PDF"}
                          className="p-1.5 rounded-[4px] bg-[#f5f3ef] dark:bg-[#2c2621] hover:bg-[#eae8e4] dark:hover:bg-[#38332c] text-[#514537] dark:text-[#cdc5bd] hover:text-[#059669] dark:hover:text-[#10b981] transition-colors cursor-pointer"
                        >
                          <Download className="size-3.5" />
                        </button>

                        {/* Resend Email Button */}
                        {onResendEmail && (
                          <button
                            type="button"
                            onClick={() => onResendEmail(invoice)}
                            title={isEn ? "Resend to Client Email" : "إعادة إرسال للبريد"}
                            className="p-1.5 rounded-[4px] bg-[#f5f3ef] dark:bg-[#2c2621] hover:bg-[#eae8e4] dark:hover:bg-[#38332c] text-[#514537] dark:text-[#cdc5bd] hover:text-[#2563eb] dark:hover:text-[#60a5fa] transition-colors cursor-pointer hidden md:inline-flex"
                          >
                            <Send className="size-3.5" />
                          </button>
                        )}

                        {/* Refund / Cancel Button */}
                        {!isRefunded && (
                          <button
                            type="button"
                            onClick={() => onCancelInvoice(invoice)}
                            title={isPaid ? (isEn ? "Refund & Issue Credit Note" : "استرداد وإصدار إشعار دائن") : (isEn ? "Cancel Invoice" : "إلغاء الفاتورة")}
                            className="p-1.5 rounded-[4px] bg-[#fef2f2] dark:bg-[#311616] hover:bg-[#fee2e2] dark:hover:bg-[#411b1b] text-[#ba1a1a] dark:text-[#f87171] transition-colors cursor-pointer"
                          >
                            {isPaid ? <RotateCcw className="size-3.5" /> : <AlertTriangle className="size-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 bg-[#faf8f5] dark:bg-[#1c140f] border-t border-[#eae8e4] dark:border-[#38271c] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Count summary and Page size */}
        <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#514537] dark:text-[#a89f91]">
          <div>
            <span>{t("عرض ", "Showing ")}</span>
            <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{startItem}</span>
            <span>{t(" إلى ", " to ")}</span>
            <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{endItem}</span>
            <span>{t(" من أصل ", " of ")}</span>
            <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{totalItems}</span>
            <span>{t(" فاتورة ضريبية", " tax invoices")}</span>
          </div>

          {onPageSizeChange && (
            <div className="flex items-center gap-2 border-s border-[#eae8e4] dark:border-[#2f2a24] ps-3">
              <span className="text-[11px] text-[#837565] dark:text-[#a89f91]">
                {t("صفوف بالصفحة:", "Rows per page:")}
              </span>
              <PageSizeDropdown
                value={pageSize}
                onChange={onPageSizeChange}
                options={[5, 10, 20, 50]}
              />
            </div>
          )}
        </div>

        {/* Page navigation buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={pageIndex === 0}
            onClick={() => onPageChange(0)}
            title={t("الصفحة الأولى", "First Page")}
            className="size-8 rounded-[4px] bg-[#f5f3ef] dark:bg-[#2c2621] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#eae8e4] dark:hover:bg-[#38332c] text-[#514537] dark:text-[#d1c9bd] flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronsRight className={cn("size-4", isEn && "rotate-180")} />
          </button>

          <button
            type="button"
            disabled={pageIndex === 0}
            onClick={() => onPageChange(pageIndex - 1)}
            title={t("الصفحة السابقة", "Previous Page")}
            className="bg-[#f5f3ef] dark:bg-[#2c2621] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#eae8e4] dark:hover:bg-[#38332c] text-[#514537] dark:text-[#d1c9bd] px-2.5 py-1.5 rounded-[4px] font-semibold text-[12px] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ChevronRight className={cn("size-3.5", isEn && "rotate-180")} />
            <span>{t("السابق", "Previous")}</span>
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }).map((_, idx) => {
            if (
              idx === 0 ||
              idx === totalPages - 1 ||
              (idx >= pageIndex - 1 && idx <= pageIndex + 1)
            ) {
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onPageChange(idx)}
                  className={`size-8 rounded-[4px] text-[12px] flex items-center justify-center transition-colors cursor-pointer ${
                    pageIndex === idx
                      ? "bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] font-bold shadow-xs"
                      : "bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] font-semibold hover:bg-[#eae8e4] dark:hover:bg-[#38332c]"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            }
            if (idx === pageIndex - 2 || idx === pageIndex + 2) {
              return (
                <span key={idx} className="px-1 text-[#837565] font-semibold text-[12px]">
                  ...
                </span>
              );
            }
            return null;
          })}

          <button
            type="button"
            disabled={pageIndex >= totalPages - 1}
            onClick={() => onPageChange(pageIndex + 1)}
            title={t("الصفحة التالية", "Next Page")}
            className="bg-[#f5f3ef] dark:bg-[#2c2621] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#eae8e4] dark:hover:bg-[#38332c] text-[#1b1c1a] dark:text-[#fdfbf7] px-2.5 py-1.5 rounded-[4px] font-semibold text-[12px] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{t("التالي", "Next")}</span>
            <ChevronLeft className={cn("size-3.5", isEn && "rotate-180")} />
          </button>

          <button
            type="button"
            disabled={pageIndex >= totalPages - 1}
            onClick={() => onPageChange(totalPages - 1)}
            title={t("الصفحة الأخيرة", "Last Page")}
            className="size-8 rounded-[4px] bg-[#f5f3ef] dark:bg-[#2c2621] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#eae8e4] dark:hover:bg-[#38332c] text-[#514537] dark:text-[#d1c9bd] flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronsLeft className={cn("size-4", isEn && "rotate-180")} />
          </button>
        </div>
      </div>
    </div>
  );
}
