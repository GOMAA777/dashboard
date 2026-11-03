"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Building2,
  UserCheck,
  Clock,
  Ban,
  Hourglass,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { fetchFirmsStats } from "@/lib/api/firms";
import { unwrapData, asNumber } from "@/lib/api/helpers";
import { ClientOffice } from "../types/client.types";

interface FirmStatsState {
  total: number;
  active: number;
  activePct: number;
  trial: number;
  trialAvgDaysLeft: number;
  suspended: number;
  suspendedAwaitingPayment: number;
}

interface ClientKpiMetricsProps {
  offices?: ClientOffice[];
  isLoading?: boolean;
  refreshTrigger?: number;
}

export function ClientKpiMetrics({
  offices,
  isLoading: propIsLoading,
  refreshTrigger = 0,
}: ClientKpiMetricsProps = {}) {
  const { t } = useLanguage();
  const [apiStats, setApiStats] = useState<FirmStatsState>({
    total: 0,
    active: 0,
    activePct: 0,
    trial: 0,
    trialAvgDaysLeft: 0,
    suspended: 0,
    suspendedAwaitingPayment: 0,
  });
  const [isApiLoading, setIsApiLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsApiLoading(true);

    fetchFirmsStats()
      .then((payload) => {
        if (cancelled) return;
        const data = (unwrapData<Record<string, unknown>>(payload) || {}) as Record<string, unknown>;
        const rawTotal = asNumber(data.total_firms ?? data.total, 0);
        const suspended = asNumber(data.suspended_firms ?? data.suspended, 0);
        // Every firm is either active or suspended. A trial firm is a plan type, not a third status.
        // Therefore, active firms = total - suspended (or the server's active count if already accurate).
        const rawActive = asNumber(data.active_firms ?? data.active, 0);
        const active = rawTotal > 0 ? Math.max(rawActive, rawTotal - suspended) : rawActive;
        const activePct = rawTotal > 0 ? Math.round((active / rawTotal) * 100) : 0;
        const trial = asNumber(data.trial_firms ?? data.trial, 0);
        const trialAvgDaysLeft = asNumber(data.trial_avg_days_left, 0);
        const suspendedAwaitingPayment = asNumber(
          data.suspended_awaiting_payment,
          0
        );

        setApiStats({
          total: rawTotal,
          active,
          activePct,
          trial,
          trialAvgDaysLeft,
          suspended,
          suspendedAwaitingPayment,
        });
      })
      .catch((err) => {
        console.error("Failed to fetch firms stats:", err);
      })
      .finally(() => {
        if (!cancelled) setIsApiLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshTrigger]);

  // Authoritative server stats from /admin/firms/stats endpoint (Single source of truth)
  const stats = useMemo<FirmStatsState>(() => {
    // If the authoritative API stats are available, use them directly as the source of truth
    if (apiStats.total > 0) {
      return apiStats;
    }

    if (offices && offices.length > 0) {
      const localActiveCount = offices.filter(
        (o) => o.accountStatus.type === "active"
      ).length;
      const localTrialCount = offices.filter(
        (o) =>
          o.accountStatus.type === "trial" ||
          o.subscriptionStatus.type === "trial" ||
          o.planType === "trial" ||
          o.plan?.includes("تجربة") ||
          o.plan?.toLowerCase().includes("trial")
      ).length;
      const localSuspendedCount = offices.filter(
        (o) => o.accountStatus.type === "suspended"
      ).length;

      const total = offices.length;
      const active = localActiveCount;
      const activePct = total > 0 ? Math.round((active / total) * 100) : 0;

      return {
        total,
        active,
        activePct,
        trial: localTrialCount,
        trialAvgDaysLeft: apiStats.trialAvgDaysLeft,
        suspended: localSuspendedCount,
        suspendedAwaitingPayment: apiStats.suspendedAwaitingPayment,
      };
    }

    return apiStats;
  }, [offices, apiStats]);

  const isLoading = propIsLoading !== undefined ? propIsLoading : isApiLoading;

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 w-full shrink-0"
      data-node-id="1:760"
    >
      {/* 1. إجمالي المكاتب */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex items-center justify-between">
        <div className="flex flex-col items-start text-start">
          <span className="text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[18px] font-normal">
            {t("إجمالي المكاتب", "Total Offices")}
          </span>
          <div className="flex items-baseline gap-[6px] mt-[4px]">
            {isLoading ? (
              <div className="h-8 w-14 bg-black/5 dark:bg-white/10 animate-pulse rounded" />
            ) : (
              <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[28px] leading-[34px] font-bold">
                {stats.total}
              </span>
            )}
          </div>
          <span className="text-[#837565] dark:text-[#8e8680] text-[11px] leading-[16px] mt-[2px]">
            {t("مكتب مسجل", "Registered Offices")}
          </span>
        </div>
        <div className="bg-[#f5f3ef] dark:bg-[#2d1f16] text-[#9c6402] dark:text-[#e29d38] border border-transparent dark:border-[#4d3627]/60 size-[44px] rounded-[6px] flex items-center justify-center shrink-0">
          <Building2 className="size-[22px]" />
        </div>
      </div>

      {/* 2. الحسابات النشطة */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex items-center justify-between">
        <div className="flex flex-col items-start text-start">
          <span className="text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[18px] font-normal">
            {t("الحسابات النشطة", "Active Accounts")}
          </span>
          <div className="flex items-baseline gap-[8px] mt-[4px]">
            {isLoading ? (
              <div className="h-8 w-14 bg-black/5 dark:bg-white/10 animate-pulse rounded" />
            ) : (
              <>
                <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[28px] leading-[34px] font-bold">
                  {stats.active}
                </span>
                <span className="bg-[#ecfdf5] border border-emerald-200 dark:bg-[#132c1c] dark:border-emerald-500/40 text-[#065f46] dark:text-[#6ee7b7] text-[10px] leading-[14px] font-bold px-2.5 py-0.5 rounded-full">
                  {t(`${stats.activePct}% من الإجمالي`, `${stats.activePct}% of Total`)}
                </span>
              </>
            )}
          </div>
          <span className="text-[#837565] dark:text-[#8e8680] text-[11px] leading-[16px] mt-[2px]">
            {t("كافة التراخيص الفعالة", "All Active Licenses")}
          </span>
        </div>
        <div className="bg-[#f5f3ef] dark:bg-[#2d1f16] text-[#9c6402] dark:text-[#e29d38] border border-transparent dark:border-[#4d3627]/60 size-[44px] rounded-[6px] flex items-center justify-center shrink-0">
          <UserCheck className="size-[22px]" />
        </div>
      </div>

      {/* 3. تحت التجربة */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex items-center justify-between">
        <div className="flex flex-col items-start text-start">
          <span className="text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[18px] font-normal">
            {t("تحت التجربة", "Trial Accounts")}
          </span>
          <div className="flex items-baseline gap-[8px] mt-[4px]">
            {isLoading ? (
              <div className="h-8 w-14 bg-black/5 dark:bg-white/10 animate-pulse rounded" />
            ) : (
              <>
                <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[28px] leading-[34px] font-bold">
                  {stats.trial}
                </span>
                <span className="text-[#837565] dark:text-[#8e8680] text-[11px] leading-[16px]">
                  {t("فترة مجانية", "Free Period")}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-[4px] mt-[2px] text-[#9c6402] dark:text-[#e29d38] text-[11px] leading-[16px] font-medium">
            <Hourglass className="size-[12px]" />
            <span>
              {stats.trial === 0 && stats.trialAvgDaysLeft === 0
                ? t("لا توجد فترات تجريبية (0 يوم متبقي)", "No active trials (0 days left)")
                : stats.trial === 0
                ? t(
                    `لا توجد فترات تجريبية (${stats.trialAvgDaysLeft} يوماً متبقية)`,
                    `No active trials (${stats.trialAvgDaysLeft} days left)`
                  )
                : t(
                    `متوسط ${stats.trialAvgDaysLeft} يوماً متبقية`,
                    `Avg ${stats.trialAvgDaysLeft} Days Remaining`
                  )}
            </span>
          </div>
        </div>
        <div className="bg-[#f5f3ef] dark:bg-[#2d1f16] text-[#9c6402] dark:text-[#e29d38] border border-transparent dark:border-[#4d3627]/60 size-[44px] rounded-[6px] flex items-center justify-center shrink-0">
          <Clock className="size-[22px]" />
        </div>
      </div>

      {/* 4. الحسابات المعطلة */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex items-center justify-between">
        <div className="flex flex-col items-start text-start">
          <span className="text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[18px] font-normal">
            {t("الحسابات المعطلة", "Suspended Accounts")}
          </span>
          <div className="flex items-baseline gap-[8px] mt-[4px]">
            {isLoading ? (
              <div className="h-8 w-14 bg-black/5 dark:bg-white/10 animate-pulse rounded" />
            ) : (
              <>
                <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[28px] leading-[34px] font-bold">
                  {stats.suspended}
                </span>
                <span className="bg-[#fff1f2] border border-rose-200 dark:bg-[#381616] dark:border-rose-500/40 text-[#9f1239] dark:text-[#fca5a5] text-[10px] leading-[14px] font-bold px-2.5 py-0.5 rounded-full">
                  {stats.suspended === 0 ? t("لا توجد", "None") : t("معطلة", "Suspended")}
                </span>
              </>
            )}
          </div>
          <span className="text-[#837565] dark:text-[#8e8680] text-[11px] leading-[16px] mt-[2px]">
            {t(
              `بانتظار السداد (${stats.suspendedAwaitingPayment})`,
              `Pending Payment (${stats.suspendedAwaitingPayment})`
            )}
          </span>
        </div>
        <div className="bg-[#f5f3ef] dark:bg-[#2d1f16] text-[#9c6402] dark:text-[#e29d38] border border-transparent dark:border-[#4d3627]/60 size-[44px] rounded-[6px] flex items-center justify-center shrink-0">
          <Ban className="size-[22px]" />
        </div>
      </div>
    </div>
  );
}
