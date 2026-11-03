"use client";

import React, { useEffect, useState } from "react";
import { Layers, CheckCircle2, Building, Landmark, TrendingUp } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { fetchPlansStats } from "@/lib/api/plans";
import { readStats } from "@/lib/api/helpers";

export function PlansKpiMetrics() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    subscribers: 0,
    mrr: 0,
    growth: 0,
  });

  useEffect(() => {
    let cancelled = false;
    fetchPlansStats()
      .then((payload) => {
        if (cancelled) return;
        setStats({
          total: readStats(payload, ["total_plans", "total", "plans_count"], 0),
          active: readStats(payload, ["active_plans", "active", "active_count"], 0),
          subscribers: readStats(
            payload,
            ["subscribed_firms", "subscribers", "firms_count"],
            0
          ),
          mrr: readStats(payload, ["mrr", "monthly_revenue", "revenue"], 0),
          growth: readStats(payload, ["growth_percentage", "growth"], 0),
        });
      })
      .catch(() => {
        // Keep defaults if API unavailable.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 w-full font-['Cairo',sans-serif]"
      data-node-id="1:2464"
    >
      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex items-center justify-between"
        data-node-id="1:2515"
      >
        <div className="flex flex-col text-start">
          <span className="text-[12px] font-medium text-[#514537] dark:text-[#cdc5bd]">
            {t("إجمالي الباقات", "Total Plans")}
          </span>
          <span className="text-[28px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] tracking-[-0.7px] leading-[38px] mt-[2px]">
            {stats.total}
          </span>
          <div className="flex items-center gap-[4px] text-[10px] text-[#837565] dark:text-[#8e8680] font-bold mt-[4px]">
            <Layers className="size-[12px] text-[#9c6402] dark:text-[#e29d38]" />
            <span>{t("خطط الاشتراك المعرّفة بالنظام", "Defined Subscription Plans")}</span>
          </div>
        </div>

        <div className="size-[48px] rounded-[6px] bg-[#f0eeea] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
          <Layers className="size-[22px]" />
        </div>
      </div>

      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex items-center justify-between"
        data-node-id="1:2501"
      >
        <div className="flex flex-col text-start">
          <span className="text-[12px] font-medium text-[#514537] dark:text-[#cdc5bd]">
            {t("الباقات المفعّلة", "Active Plans")}
          </span>
          <span className="text-[28px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] tracking-[-0.7px] leading-[38px] mt-[2px]">
            {stats.active}
          </span>
          <div className="flex items-center gap-[6px] text-[10px] text-[#047857] dark:text-[#6ee7b7] font-bold mt-[4px]">
            <span className="size-[7px] rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981] ring-1 ring-emerald-400/60" />
            <span>{t("متاحة لاشتراك مكاتب المحاماة", "Available for Law Firm Subscriptions")}</span>
          </div>
        </div>

        <div className="size-[48px] rounded-[6px] bg-[#ecfdf5] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 flex items-center justify-center text-[#059669] dark:text-[#e29d38] shrink-0">
          <CheckCircle2 className="size-[22px]" />
        </div>
      </div>

      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex items-center justify-between"
        data-node-id="1:2483"
      >
        <div className="flex flex-col text-start">
          <span className="text-[12px] font-medium text-[#514537] dark:text-[#cdc5bd]">
            {t("المكاتب المشتركة", "Subscribed Law Firms")}
          </span>
          <div className="flex items-baseline gap-[8px] mt-[2px]">
            <span className="text-[28px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] tracking-[-0.7px] leading-[38px]">
              {stats.subscribers}
            </span>
            <span className="bg-[#ecfdf5] border border-emerald-200 dark:bg-[#132c1c] dark:border-emerald-500/40 text-[#047857] dark:text-[#6ee7b7] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              {t("+8% هذا الشهر", "+8% this month")}
            </span>
          </div>
          <div className="flex items-center gap-[4px] text-[10px] text-[#837565] dark:text-[#8e8680] font-bold mt-[4px]">
            <Building className="size-[12px] text-[#9c6402] dark:text-[#e29d38]" />
            <span>{t("مكتب محاماة وشركة مهنية", "Law firms & practices")}</span>
          </div>
        </div>

        <div className="size-[48px] rounded-[6px] bg-[#f0eeea] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
          <Building className="size-[22px]" />
        </div>
      </div>

      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex items-center justify-between"
        data-node-id="1:2465"
      >
        <div className="flex flex-col text-start">
          <span className="text-[12px] font-medium text-[#514537] dark:text-[#cdc5bd]">
            {t("الإيراد الشهري المتكرر (MRR)", "Monthly Recurring Revenue (MRR)")}
          </span>
          <div className="flex items-baseline gap-[4px] mt-[2px]">
            <span className="text-[28px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] tracking-[-0.7px] leading-[38px]">
              {stats.mrr.toLocaleString("en-US")}
            </span>
            <span className="text-[11px] font-bold text-[#514537] dark:text-[#cdc5bd]">{t("ر.س", "SAR")}</span>
          </div>
          <div className="flex items-center gap-[4px] text-[10px] text-[#047857] dark:text-[#6ee7b7] font-semibold mt-[4px]">
            <TrendingUp className="size-[13px]" />
            <span>
              {t(
                `+${stats.growth}% مقارنة بالربع السابق`,
                `+${stats.growth}% vs previous quarter`
              )}
            </span>
          </div>
        </div>

        <div className="size-[48px] rounded-[6px] bg-[#ffddb6] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
          <Landmark className="size-[22px]" />
        </div>
      </div>
    </div>
  );
}
