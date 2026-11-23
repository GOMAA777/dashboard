"use client";

import React from "react";
import { Plus, RefreshCw } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface PlansManagementHeaderProps {
  onCreatePlan?: () => void;
  onViewSubscribedFirms?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function PlansManagementHeader({
  onCreatePlan,
  onRefresh,
  isRefreshing,
}: PlansManagementHeaderProps) {
  const { t } = useLanguage();

  return (
    <div
      className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col md:flex-row md:items-center justify-between gap-4 w-full font-['Cairo',sans-serif]"
      data-node-id="1:2463"
    >
      {/* Right / Start (in RTL): Title & Description */}
      <div className="flex flex-col text-start">
        <h1 className="text-[26px] leading-[36px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
          {t("الباقات والأسعار", "Plans & Pricing")}
        </h1>
        <p className="text-[#514537] dark:text-[#cdc5bd] text-[13px] leading-[20px] font-normal mt-[4px]">
          {t(
            "إدارة الباقات والأسعار ومميزات الاشتراك وحدود الاستخدام لكل مكتب محاماة مسجل بالمنصة.",
            "Manage plans, pricing tiers, features, and usage quotas for law firms."
          )}
        </p>
      </div>

      {/* Left / End (in RTL): CTA Action Buttons */}
      <div className="flex items-center gap-[10px] self-start md:self-auto shrink-0">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            title={t("تحديث البيانات", "Refresh data")}
            aria-label={t("تحديث البيانات", "Refresh data")}
            className="size-[38px] rounded-[4px] border border-[#e4e1dc] dark:border-[#38271c] bg-white dark:bg-[#2d1f16] text-[#514537] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#382a1f] flex items-center justify-center transition-all cursor-pointer shrink-0"
          >
            <RefreshCw className={`size-[16px] ${isRefreshing ? "animate-spin text-[#9c6402]" : ""}`} />
          </button>
        )}
        {onCreatePlan ? (
          <button
            type="button"
            onClick={onCreatePlan}
            className="bg-[#9c6402] hover:bg-[#855402] text-white px-[18px] py-[9px] rounded-[4px] text-[13px] font-semibold flex items-center gap-[8px] shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="size-[16px] stroke-[2.5]" />
            <span>{t("إنشاء باقة جديدة", "Create New Plan")}</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
