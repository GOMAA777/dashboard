"use client";

import React from "react";
import { Coins, CheckCircle2, Clock, AlertTriangle, TrendingUp, ArrowUpRight } from "lucide-react";
import { InvoiceKpiMetrics } from "../types/invoices.types";
import { useLanguage } from "@/lib/i18n";

interface InvoicesKpiCardsProps {
  metrics: InvoiceKpiMetrics;
}

export function InvoicesKpiCards({ metrics }: InvoicesKpiCardsProps) {
  const { isEn } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Collected Revenue */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col justify-between gap-3 text-start relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-[#837565] dark:text-[#a89f91]">
            {isEn ? "Total Collected Revenue" : "إجمالي الإيرادات المحصلة"}
          </span>
          <div className="size-9 rounded-[8px] bg-[rgba(255,221,182,0.4)] dark:bg-[rgba(226,157,56,0.18)] text-[#9c6402] dark:text-[#e29d38] flex items-center justify-center shrink-0">
            <Coins className="size-4" />
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-[26px] font-black font-mono text-[#1b1c1a] dark:text-[#fdfbf7] tracking-tight">
              {metrics.totalRevenueSar.toLocaleString()}
            </h3>
            <span className="text-[12px] font-bold text-[#9c6402] dark:text-[#e29d38]">
              {isEn ? "SAR" : "ر.س"}
            </span>
          </div>
          <p className="text-[11px] text-[#837565] dark:text-[#8e8680] font-mono mt-0.5">
            ≈ ${metrics.totalRevenueUsd.toLocaleString()} USD
          </p>
        </div>

        <div className="flex items-center gap-1.5 pt-2 border-t border-[#f5f3ef] dark:border-[#38271c] text-[11px] text-[#059669] dark:text-[#10b981] font-bold">
          <ArrowUpRight className="size-3.5" />
          <span>{isEn ? "+18.4% vs last period" : "+18.4% نمو عن الشهر السابق"}</span>
        </div>
      </div>

      {/* 2. Paid Invoices */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col justify-between gap-3 text-start relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-[#837565] dark:text-[#a89f91]">
            {isEn ? "Paid Invoices" : "الفواتير المسددة"}
          </span>
          <div className="size-9 rounded-[8px] bg-[#ecfdf5] dark:bg-[#132c21] text-[#059669] dark:text-[#10b981] flex items-center justify-center shrink-0">
            <CheckCircle2 className="size-4" />
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-[26px] font-black font-mono text-[#1b1c1a] dark:text-[#fdfbf7] tracking-tight">
              {metrics.paidCount}
            </h3>
            <span className="text-[12px] font-semibold text-[#514537] dark:text-[#cdc5bd]">
              {isEn ? `of ${metrics.totalInvoicesCount} invoices` : `من أصل ${metrics.totalInvoicesCount} فواتير`}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1.5 bg-[#f0eeea] dark:bg-[#38271c] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#059669] dark:bg-[#10b981] rounded-full"
                style={{ width: `${metrics.paidPercentage}%` }}
              />
            </div>
            <span className="text-[11px] font-mono font-bold text-[#059669] dark:text-[#10b981]">
              {metrics.paidPercentage}%
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#f5f3ef] dark:border-[#38271c] text-[11px] text-[#514537] dark:text-[#cdc5bd]">
          <span>{isEn ? "Healthy collection rate" : "معدل تحصيل مالي منتظم"}</span>
        </div>
      </div>

      {/* 3. Pending Invoices */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col justify-between gap-3 text-start relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-[#837565] dark:text-[#a89f91]">
            {isEn ? "Pending Collection" : "معلقة بانتظار التحصيل"}
          </span>
          <div className="size-9 rounded-[8px] bg-[#fffbeb] dark:bg-amber-950/40 text-[#d97706] dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="size-4" />
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-[26px] font-black font-mono text-[#1b1c1a] dark:text-[#fdfbf7] tracking-tight">
              {metrics.pendingAmountSar.toLocaleString()}
            </h3>
            <span className="text-[12px] font-bold text-[#d97706] dark:text-amber-400">
              {isEn ? "SAR" : "ر.س"}
            </span>
          </div>
          <p className="text-[12px] text-[#837565] dark:text-[#8e8680] mt-0.5 font-semibold">
            {isEn ? `${metrics.pendingCount} pending invoices` : `${metrics.pendingCount} فواتير قيد السداد`}
          </p>
        </div>

        <div className="pt-2 border-t border-[#f5f3ef] dark:border-[#38271c] text-[11px] text-[#b45309] dark:text-amber-300/80">
          <span>{isEn ? "Follow-up notices scheduled" : "إشعارات تذكير مجدولة للمكاتب"}</span>
        </div>
      </div>

      {/* 4. Overdue & Refunded */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col justify-between gap-3 text-start relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold text-[#837565] dark:text-[#a89f91]">
            {isEn ? "Overdue & Refunded" : "المتأخرة والمستردة"}
          </span>
          <div className="size-9 rounded-[8px] bg-[rgba(255,218,214,0.6)] dark:bg-[rgba(186,26,26,0.2)] text-[#ba1a1a] dark:text-[#f87171] flex items-center justify-center shrink-0">
            <AlertTriangle className="size-4" />
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-[26px] font-black font-mono text-[#ba1a1a] dark:text-[#f87171] tracking-tight">
              {metrics.overdueAmountSar.toLocaleString()}
            </h3>
            <span className="text-[12px] font-bold text-[#ba1a1a] dark:text-[#f87171]">
              {isEn ? "SAR" : "ر.س"}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-[11px] text-[#837565] dark:text-[#a89f91]">
            <span>{isEn ? `${metrics.overdueCount} Overdue` : `${metrics.overdueCount} متأخرة`}</span>
            <span>•</span>
            <span>{isEn ? `${metrics.refundedCount} Refunded` : `${metrics.refundedCount} مستردة`}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#f5f3ef] dark:border-[#38271c] text-[11px] text-[#ba1a1a] dark:text-rose-400">
          <span>{isEn ? "Action required for overdue cards" : "يتطلب تحديث وسيلة الدفع"}</span>
        </div>
      </div>
    </div>
  );
}

