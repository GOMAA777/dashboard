"use client";

import React from "react";
import {
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
} from "lucide-react";
import { PageSizeDropdown } from "@/components/shared/PageSizeDropdown";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface UnifiedPaginationProps {
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  /** Arabic/English noun for the entity, e.g. "مكتب محاماة مسجل" / "registered law offices" */
  itemLabel: string;
  pageSizeOptions?: number[];
  className?: string;
}

/**
 * Canonical pagination footer matching Client Management:
 * summary + rows dropdown | first / prev / pages / next / last
 */
export function UnifiedPagination({
  pageIndex,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  itemLabel,
  pageSizeOptions = [5, 10, 20, 50],
  className,
}: UnifiedPaginationProps) {
  const { t, isEn } = useLanguage();
  const totalPages = Math.max(1, Math.ceil(totalItems / Math.max(1, pageSize)));
  const safePageIndex = Math.min(pageIndex, Math.max(0, totalPages - 1));
  const startItem = totalItems === 0 ? 0 : safePageIndex * pageSize + 1;
  const endItem = Math.min((safePageIndex + 1) * pageSize, totalItems);

  const chevronFlip = isEn ? "rotate-180" : "";

  return (
    <div
      className={cn(
        "bg-[#fcfaf7] dark:bg-[#1a120d] p-[16px] border-t border-[#f0eeea] dark:border-[#38271c] flex flex-col sm:flex-row items-center justify-between gap-[12px] text-[12px] text-[#514537] dark:text-[#cdc5bd] font-['Cairo']",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <span>{t("عرض", "Showing")} </span>
          <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{startItem}</span>
          <span> {t("إلى", "to")} </span>
          <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{endItem}</span>
          <span> {t("من أصل", "of")} </span>
          <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{totalItems}</span>
          <span> {itemLabel}</span>
        </div>

        <div className="flex items-center gap-2 border-s border-[#eae8e4] dark:border-[#38271c] ps-3">
          <span className="text-[11px] text-[#837565] dark:text-[#8e8680]">
            {t("صفوف بالصفحة:", "Rows per page:")}
          </span>
          <PageSizeDropdown
            value={pageSize}
            onChange={(newSize) => {
              onPageSizeChange(newSize);
              onPageChange(0);
            }}
            options={pageSizeOptions}
            dropdownPlacement="top"
          />
        </div>
      </div>

      <div className="flex items-center gap-[4px]">
        <button
          type="button"
          disabled={safePageIndex === 0 || totalItems === 0}
          onClick={() => onPageChange(0)}
          title={t("الصفحة الأولى", "First page")}
          className="size-[30px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center cursor-pointer"
        >
          <ChevronsRight className={cn("size-[14px]", chevronFlip)} />
        </button>

        <button
          type="button"
          disabled={safePageIndex === 0 || totalItems === 0}
          onClick={() => onPageChange(Math.max(0, safePageIndex - 1))}
          title={t("الصفحة السابقة", "Previous page")}
          className="px-[10px] py-[6px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-[4px] cursor-pointer"
        >
          <ChevronRight className={cn("size-[13px]", chevronFlip)} />
          <span>{t("السابق", "Previous")}</span>
        </button>

        {totalItems === 0 ? (
          <button
            type="button"
            disabled
            className="size-[30px] rounded-[4px] font-semibold text-[12px] flex items-center justify-center border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#8e8680] opacity-40 cursor-not-allowed"
          >
            1
          </button>
        ) : (
          Array.from({ length: totalPages }, (_, i) => i).map((p) => {
            if (
              totalPages > 5 &&
              Math.abs(p - safePageIndex) > 2 &&
              p !== 0 &&
              p !== totalPages - 1
            ) {
              if (p === 1 || p === totalPages - 2) {
                return (
                  <span key={p} className="px-[2px] text-[#837565] dark:text-[#8e8680]">
                    ...
                  </span>
                );
              }
              return null;
            }
            const isActive = safePageIndex === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={cn(
                  "size-[30px] rounded-[4px] font-semibold text-[12px] flex items-center justify-center cursor-pointer transition-colors",
                  isActive
                    ? "bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] font-bold shadow-sm"
                    : "border border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15]"
                )}
              >
                {p + 1}
              </button>
            );
          })
        )}

        <button
          type="button"
          disabled={safePageIndex >= totalPages - 1 || totalItems === 0}
          onClick={() => onPageChange(Math.min(totalPages - 1, safePageIndex + 1))}
          title={t("الصفحة التالية", "Next page")}
          className="px-[10px] py-[6px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#1b1c1a] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-[4px] cursor-pointer"
        >
          <span>{t("التالي", "Next")}</span>
          <ChevronLeft className={cn("size-[13px]", chevronFlip)} />
        </button>

        <button
          type="button"
          disabled={safePageIndex >= totalPages - 1 || totalItems === 0}
          onClick={() => onPageChange(totalPages - 1)}
          title={t("الصفحة الأخيرة", "Last page")}
          className="size-[30px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center cursor-pointer"
        >
          <ChevronsLeft className={cn("size-[14px]", chevronFlip)} />
        </button>
      </div>
    </div>
  );
}
