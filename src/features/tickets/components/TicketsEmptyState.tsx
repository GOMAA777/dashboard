"use client";

import React from "react";
import { Plus, Check, ShieldCheck, Headphones } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface TicketsEmptyStateProps {
  onCreateTicket: () => void;
  onResetFilter?: () => void;
  isFiltered?: boolean;
}

export function TicketsEmptyState({
  onCreateTicket,
  onResetFilter,
  isFiltered = false,
}: TicketsEmptyStateProps) {
  const { t } = useLanguage();

  return (
    <div
      className="bg-white rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 p-[48px] sm:p-[64px] flex flex-col items-center justify-center text-center w-full min-h-[460px] relative overflow-hidden"
      data-node-id="1:16031"
      data-name="لا توجد تذاكر دعم فني نشطة حالياً"
    >
      {/* Decorative Golden Ring Emblem */}
      <div className="relative mb-[28px] shrink-0" data-node-id="1:16111">
        <div className="size-[96px] rounded-full bg-[rgba(255,221,182,0.3)] border-2 border-[#9c6402]/25 flex items-center justify-center shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.05)]">
          <Headphones className="size-[42px] text-[#9c6402]" />
        </div>

        {/* Floating Indicator Badge Top-Right */}
        <div
          className="absolute -top-[6px] -end-[6px] size-[28px] rounded-full bg-[#7b4e00] flex items-center justify-center text-white shadow-[0px_1px_2px_rgba(0,0,0,0.15)]"
          data-node-id="1:16117"
        >
          <Check className="size-[14px]" />
        </div>

        {/* Floating Indicator Badge Bottom-Left */}
        <div
          className="absolute -bottom-[6px] -start-[6px] size-[26px] rounded-full bg-[#f0eeea] border border-[#eae8e4] flex items-center justify-center text-[#514537] shadow-[0px_1px_2px_rgba(0,0,0,0.08)]"
          data-node-id="1:16120"
        >
          <ShieldCheck className="size-[14px] text-[#059669]" />
        </div>
      </div>

      {/* Headings & Copy */}
      <div className="max-w-[560px] flex flex-col items-center gap-[12px] mb-[32px]">
        <h2 className="text-[#1b1c1a] font-bold text-[24px] sm:text-[28px] leading-[36px] tracking-[-0.5px]">
          {isFiltered
            ? t("لا توجد نتائج مطابقة لبحثك", "No matching results found")
            : t("لا توجد تذاكر دعم فني نشطة حالياً", "No active support tickets currently")}
        </h2>

        <p className="text-[#514537] font-medium text-[14px] sm:text-[15px] leading-[26px]">
          {isFiltered
            ? t(
                "لم نتمكن من العثور على أي تذاكر تطابق معايير البحث أو التصفية الحالية. يمكنك إعادة تعيين التصفية.",
                "We couldn't find any tickets matching your search or filter criteria. You can reset filters."
              )
            : t(
                "لم يتم تسجيل أي بلاغات أو نزاعات تشغيلية في النظام حتى هذه اللحظة، أو لا توجد نتائج مطابقة لمعايير البحث والتصفية المحددة أعلاه. بوابات التوثيق تعمل باستقرار كامل.",
                "No technical issues or disputes registered at the moment. Verification portals are operating stably."
              )}
        </p>
      </div>

      {/* Direct Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-[12px]">
        <button
          type="button"
          onClick={onCreateTicket}
          className="bg-[#9c6402] hover:bg-[#855402] text-white flex items-center gap-[8px] px-[20px] py-[10px] rounded-[4px] font-semibold text-[14px] leading-[20px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-all cursor-pointer"
          data-node-id="1:16132"
        >
          <Plus className="size-[16px]" />
          <span>{t("إنشاء تذكرة جديدة", "Create New Ticket")}</span>
        </button>

        {isFiltered && onResetFilter && (
          <button
            type="button"
            onClick={onResetFilter}
            className="bg-[#f0eeea] hover:bg-[#eae8e4] text-[#1b1c1a] px-[18px] py-[10px] rounded-[4px] font-semibold text-[14px] leading-[20px] transition-colors cursor-pointer"
          >
            {t("إعادة تعيين البحث", "Reset Search")}
          </button>
        )}
      </div>
    </div>
  );
}