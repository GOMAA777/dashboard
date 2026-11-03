"use client";

import React from "react";
import { Receipt, RotateCcw, Plus } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface InvoicesEmptyStateProps {
  onResetFilters?: () => void;
  onCreateInvoice?: () => void;
  isFiltered?: boolean;
}

export function InvoicesEmptyState({
  onResetFilters,
  onCreateInvoice,
  isFiltered = false,
}: InvoicesEmptyStateProps) {
  const { isEn } = useLanguage();

  return (
    <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#eae8e4] dark:border-[#38271c] p-12 text-center flex flex-col items-center justify-center my-4 transition-colors">
      {/* Icon with luxury gold circle */}
      <div className="size-16 rounded-full bg-[rgba(255,221,182,0.35)] dark:bg-[rgba(226,157,56,0.15)] text-[#9c6402] dark:text-[#e29d38] flex items-center justify-center mb-4 ring-8 ring-[rgba(255,221,182,0.15)] dark:ring-[rgba(226,157,56,0.05)]">
        <Receipt className="size-8 stroke-[1.8]" />
      </div>

      <h3 className="text-[18px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1.5">
        {isFiltered
          ? isEn
            ? "No Invoices Match Your Filter"
            : "لم يتم العثور على فواتير مطابقة لمعايير البحث"
          : isEn
          ? "No Invoices Recorded Yet"
          : "لا توجد فواتير مسجلة حتى الآن"}
      </h3>

      <p className="text-[13px] text-[#514537] dark:text-[#a89f91] max-w-md mx-auto mb-6 leading-relaxed">
        {isFiltered
          ? isEn
            ? "Try resetting your search query or selecting a different status filter to view all financial records."
            : "جرّب إعادة ضبط خيارات البحث أو تصفية الحالات لعرض كافة السجلات والمعاملات المالية المسجلة."
          : isEn
          ? "Start issuing official ZATCA Phase 2 tax invoices and subscription billing receipts for registered law firms."
          : "ابدأ بإصدار الفواتير الضريبية المعتمدة وسندات تحصيل الاشتراكات لمكاتب وشركات المحاماة المسجلة في المنصة."}
      </p>

      <div className="flex items-center gap-3">
        {isFiltered && onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2 text-[13px] font-bold rounded-[6px] bg-[#f5f3ef] dark:bg-[#281c15] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] border border-[#eae8e4] dark:border-[#38271c] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            <span>{isEn ? "Reset Filters" : "إعادة ضبط التصفية"}</span>
          </button>
        )}

        {onCreateInvoice && (
          <button
            type="button"
            onClick={onCreateInvoice}
            className="px-4 py-2 text-[13px] font-bold rounded-[6px] bg-[#9c6402] hover:bg-[#835401] active:bg-[#6c4501] dark:bg-[#e29d38] dark:hover:bg-[#c28328] text-white dark:text-[#1c140f] flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span>{isEn ? "Issue New Invoice" : "إصدار فاتورة جديدة"}</span>
          </button>
        )}
      </div>
    </div>
  );
}

