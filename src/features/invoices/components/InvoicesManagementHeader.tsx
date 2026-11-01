"use client";

import React from "react";
import { Plus, Download, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface InvoicesManagementHeaderProps {
  onCreateInvoice: () => void;
  onExportReport: () => void;
}

export function InvoicesManagementHeader({
  onCreateInvoice,
  onExportReport,
}: InvoicesManagementHeaderProps) {
  const { isEn } = useLanguage();

  return (
    <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] relative flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-colors">
      {/* Title & Description */}
      <div className="flex flex-col gap-1.5 text-start">
        <div className="flex items-center gap-3">
          <h1 className="text-[24px] sm:text-[28px] leading-[36px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
            {isEn ? "Invoices & Financial Transactions" : "الفواتير والمعاملات المالية"}
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1.5 bg-[#ecfdf5] dark:bg-[#132c21] text-[#065f46] dark:text-[#6ee7b7] border border-emerald-200 dark:border-emerald-500/40 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <ShieldCheck className="size-3.5 text-[#059669] dark:text-[#10b981]" />
            <span>{isEn ? "ZATCA Phase 2 Verified" : "معتمد ZATCA مرحلة 2"}</span>
          </span>
        </div>
        <p className="text-[13px] sm:text-[14px] leading-[22px] font-normal text-[#514537] dark:text-[#a89f91] max-w-3xl">
          {isEn
            ? "Manage certified e-invoices, billing vouchers for subscribed law firms, tax reporting (15% VAT), and financial audit trails."
            : "إدارة الفواتير الضريبية الإلكترونية المعتمدة، سندات القبض لاشتراكات مكاتب المحاماة، ومطابقة ضريبة القيمة المضافة 15% وسجلات التحصيل."}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Export Report Button */}
        <button
          type="button"
          onClick={onExportReport}
          className="bg-white dark:bg-[#281c15] hover:bg-[#f5f3ef] dark:hover:bg-[#32231a] text-[#514537] dark:text-[#cdc5bd] border border-[#eae8e4] dark:border-[#38271c] px-3.5 py-2 rounded-[6px] font-semibold text-[13px] flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
          title={isEn ? "Export Financial Report (Excel / PDF)" : "تصدير التقرير المالي (Excel / PDF)"}
        >
          <Download className="size-4 text-[#837565] dark:text-[#a89f91]" />
          <span>{isEn ? "Export" : "تصدير"}</span>
        </button>

        {/* Create Invoice Primary Button (Gold) */}
        <button
          type="button"
          onClick={onCreateInvoice}
          className="bg-[#9c6402] hover:bg-[#835401] active:bg-[#6c4501] dark:bg-[#e29d38] dark:hover:bg-[#c28328] text-white dark:text-[#1c140f] px-4 py-2 rounded-[6px] font-bold text-[13px] flex items-center gap-2 transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>{isEn ? "Create Invoice" : "إنشاء فاتورة جديدة"}</span>
        </button>
      </div>
    </div>
  );
}
