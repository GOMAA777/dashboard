import React from "react";
import { Users, ShieldCheck, UserX, Zap } from "lucide-react";
import { StaffKpis } from "../types/staff.types";

interface StaffKpiMetricsProps {
  kpis: StaffKpis;
}

export function StaffKpiMetrics({ kpis }: StaffKpiMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4" dir="rtl">
      {/* KPI 1: إجمالي الموظفين */}
      <div
        className="bg-white rounded-[8px] p-4 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between h-[120px]"
        data-node-id="1:8948"
      >
        <div className="flex items-start justify-between">
          {/* Text & Value */}
          <div className="text-right">
            <span className="text-[14px] font-medium text-[#79716b] leading-[20px] block">
              إجمالي الموظفين
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-[28px] font-bold text-[#1b1c1a] leading-[34px] font-sans">
                {kpis.totalStaff}
              </span>
              <span className="text-[13px] font-normal text-[#79716b]">
                عضواً
              </span>
            </div>
          </div>

          {/* Icon */}
          <div className="size-[40px] rounded-[8px] bg-[#f5efe6] flex items-center justify-center shrink-0">
            <Users className="size-[20px] text-[#9c6402]" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-1.5 text-[12px] text-[#79716b] pt-2 border-t border-[#f5f3ef]">
          <span className="size-[6px] rounded-full bg-[#9c6402] inline-block shrink-0" />
          <span>موزعون على {kpis.totalDepartments} أقسام تشغيلية وإدارية</span>
        </div>
      </div>

      {/* KPI 2: الموظفون النشطون */}
      <div
        className="bg-white rounded-[8px] p-4 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between h-[120px]"
        data-node-id="1:8930"
      >
        <div className="flex items-start justify-between">
          <div className="text-right">
            <span className="text-[14px] font-medium text-[#79716b] leading-[20px] block">
              الموظفون النشطون
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[28px] font-bold text-[#1b1c1a] leading-[34px] font-sans">
                {kpis.activeStaff}
              </span>
              <span className="text-[11px] font-semibold text-[#1b7340] bg-[#e8f5e9] px-2 py-0.5 rounded-full border border-[#c8e6c9]">
                {kpis.activePercentage}%
              </span>
            </div>
          </div>

          <div className="size-[40px] rounded-[8px] bg-[#eef8f1] flex items-center justify-center shrink-0">
            <ShieldCheck className="size-[20px] text-[#1b7340]" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[12px] text-[#79716b] pt-2 border-t border-[#f5f3ef]">
          <span className="size-[6px] rounded-full bg-[#1b7340] inline-block shrink-0" />
          <span>حسابات مفعلة وموثقة برقم الهوية</span>
        </div>
      </div>

      {/* KPI 3: الحسابات الموقوفة */}
      <div
        className="bg-white rounded-[8px] p-4 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between h-[120px]"
        data-node-id="1:8912"
      >
        <div className="flex items-start justify-between">
          <div className="text-right">
            <span className="text-[14px] font-medium text-[#79716b] leading-[20px] block">
              الحسابات الموقوفة
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-[28px] font-bold text-[#1b1c1a] leading-[34px] font-sans">
                {kpis.suspendedStaff}
              </span>
              <span className="text-[13px] font-normal text-[#79716b]">
                حسابات
              </span>
            </div>
          </div>

          <div className="size-[40px] rounded-[8px] bg-[#fff5ea] flex items-center justify-center shrink-0">
            <UserX className="size-[20px] text-[#d97706]" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[12px] text-[#79716b] pt-2 border-t border-[#f5f3ef]">
          <span className="size-[6px] rounded-full bg-[#d97706] inline-block shrink-0" />
          <span>{kpis.suspendedReason}</span>
        </div>
      </div>

      {/* KPI 4: سجلوا الدخول اليوم */}
      <div
        className="bg-white rounded-[8px] p-4 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between h-[120px]"
        data-node-id="1:8894"
      >
        <div className="flex items-start justify-between">
          <div className="text-right">
            <span className="text-[14px] font-medium text-[#79716b] leading-[20px] block">
              سجلوا الدخول اليوم
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[28px] font-bold text-[#1b1c1a] leading-[34px] font-sans">
                {kpis.loggedToday}
              </span>
              <span className="text-[11px] font-semibold text-[#8e5927] bg-[#fbf5ed] px-2 py-0.5 rounded-full border border-[#f2e2ce]">
                خلال 24 ساعة
              </span>
            </div>
          </div>

          <div className="size-[40px] rounded-[8px] bg-[#fff9eb] flex items-center justify-center shrink-0">
            <Zap className="size-[20px] text-[#b45309]" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[12px] text-[#79716b] pt-2 border-t border-[#f5f3ef]">
          <span className="size-[6px] rounded-full bg-[#10b981] inline-block shrink-0" />
          <span>آخر جلسة مسجلة قبل {kpis.lastSessionMinutesAgo} دقائق</span>
        </div>
      </div>
    </div>
  );
}
