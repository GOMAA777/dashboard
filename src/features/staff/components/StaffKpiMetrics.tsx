import React from "react";
import { Users, ShieldCheck, UserX, Zap } from "lucide-react";
import { StaffKpis } from "../types/staff.types";

interface StaffKpiMetricsProps {
  kpis: StaffKpis;
}

export function StaffKpiMetrics({ kpis }: StaffKpiMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* KPI 1: إجمالي الموظفين */}
      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] p-4 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between h-[120px]"
        data-node-id="1:8948"
      >
        <div className="flex items-start justify-between">
          {/* Text & Value */}
          <div className="text-start">
            <span className="text-[14px] font-medium text-[#79716b] dark:text-[#cdc5bd] leading-[20px] block">
              إجمالي الموظفين
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-[28px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[34px] font-sans">
                {kpis.totalStaff}
              </span>
              <span className="text-[13px] font-normal text-[#79716b] dark:text-[#8e8680]">
                عضواً
              </span>
            </div>
          </div>

          {/* Icon */}
          <div className="size-[40px] rounded-[8px] bg-[#f5efe6] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 text-[#9c6402] dark:text-[#e29d38] flex items-center justify-center shrink-0">
            <Users className="size-[20px]" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-1.5 text-[12px] text-[#79716b] dark:text-[#cdc5bd] pt-2 border-t border-[#f5f3ef] dark:border-[#38271c]">
          <span className="size-[6px] rounded-full bg-[#9c6402] dark:bg-[#e29d38] inline-block shrink-0" />
          <span>موزعون على {kpis.totalDepartments} أقسام تشغيلية وإدارية</span>
        </div>
      </div>

      {/* KPI 2: الموظفون النشطون */}
      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] p-4 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between h-[120px]"
        data-node-id="1:8930"
      >
        <div className="flex items-start justify-between">
          <div className="text-start">
            <span className="text-[14px] font-medium text-[#79716b] dark:text-[#cdc5bd] leading-[20px] block">
              الموظفون النشطون
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[28px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[34px] font-sans">
                {kpis.activeStaff}
              </span>
              <span className="text-[11px] font-semibold text-[#1b7340] dark:text-[#6ee7b7] bg-[#e8f5e9] dark:bg-[#132c1c] px-2.5 py-0.5 rounded-full border border-[#c8e6c9] dark:border-emerald-500/40">
                {kpis.activePercentage}%
              </span>
            </div>
          </div>

          <div className="size-[40px] rounded-[8px] bg-[#eef8f1] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 text-[#1b7340] dark:text-[#e29d38] flex items-center justify-center shrink-0">
            <ShieldCheck className="size-[20px]" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[12px] text-[#79716b] dark:text-[#cdc5bd] pt-2 border-t border-[#f5f3ef] dark:border-[#38271c]">
          <span className="size-[6px] rounded-full bg-[#1b7340] dark:bg-[#10b981] inline-block shrink-0" />
          <span>حسابات مفعلة وموثقة برقم الهوية</span>
        </div>
      </div>

      {/* KPI 3: الحسابات الموقوفة */}
      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] p-4 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between h-[120px]"
        data-node-id="1:8912"
      >
        <div className="flex items-start justify-between">
          <div className="text-start">
            <span className="text-[14px] font-medium text-[#79716b] dark:text-[#cdc5bd] leading-[20px] block">
              الحسابات الموقوفة
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-[28px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[34px] font-sans">
                {kpis.suspendedStaff}
              </span>
              <span className="text-[13px] font-normal text-[#79716b] dark:text-[#8e8680]">
                حسابات
              </span>
            </div>
          </div>

          <div className="size-[40px] rounded-[8px] bg-[#fff5ea] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 text-[#d97706] dark:text-[#e29d38] flex items-center justify-center shrink-0">
            <UserX className="size-[20px]" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[12px] text-[#79716b] dark:text-[#cdc5bd] pt-2 border-t border-[#f5f3ef] dark:border-[#38271c]">
          <span className="size-[6px] rounded-full bg-[#d97706] dark:bg-[#f59e0b] inline-block shrink-0" />
          <span>{kpis.suspendedReason}</span>
        </div>
      </div>

      {/* KPI 4: سجلوا الدخول اليوم */}
      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] p-4 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between h-[120px]"
        data-node-id="1:8894"
      >
        <div className="flex items-start justify-between">
          <div className="text-start">
            <span className="text-[14px] font-medium text-[#79716b] dark:text-[#cdc5bd] leading-[20px] block">
              سجلوا الدخول اليوم
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[28px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[34px] font-sans">
                {kpis.loggedToday}
              </span>
              <span className="text-[11px] font-semibold text-[#8e5927] dark:text-[#fbbf24] bg-[#fbf5ed] dark:bg-[#2e1d0f] px-2.5 py-0.5 rounded-full border border-[#f2e2ce] dark:border-amber-500/40">
                خلال 24 ساعة
              </span>
            </div>
          </div>

          <div className="size-[40px] rounded-[8px] bg-[#fff9eb] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 text-[#b45309] dark:text-[#e29d38] flex items-center justify-center shrink-0">
            <Zap className="size-[20px]" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[12px] text-[#79716b] dark:text-[#cdc5bd] pt-2 border-t border-[#f5f3ef] dark:border-[#38271c]">
          <span className="size-[6px] rounded-full bg-[#10b981] inline-block shrink-0" />
          <span>آخر جلسة مسجلة قبل {kpis.lastSessionMinutesAgo} دقائق</span>
        </div>
      </div>
    </div>
  );
}
