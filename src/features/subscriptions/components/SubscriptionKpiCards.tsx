"use client";

import React from "react";
import { Building2, ShieldCheck, Clock, Ban, Scale } from "lucide-react";

interface SubscriptionKpiCardsProps {
  totalCount?: number;
  activeCount?: number;
  expiringCount?: number;
  cancelledCount?: number;
}

export function SubscriptionKpiCards({
  totalCount = 128,
  activeCount = 86,
  expiringCount = 12,
  cancelledCount = 18,
}: SubscriptionKpiCardsProps) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full"
      data-node-id="1:5256"
      data-name="KPI Metric Cards Grid"
    >
      {/* KPI 1: إجمالي الاشتراكات */}
      <div
        className="bg-white dark:bg-[#1e1c1a] flex flex-col justify-between p-4 rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#2f2a24] relative overflow-hidden"
        data-node-id="1:5318"
      >
        <div className="flex items-start justify-between w-full">
          <div className="bg-[#f0eeea] dark:bg-[#2c2621] flex items-center justify-center rounded-[4px] size-[40px] shrink-0 text-[#7b4e00]">
            <Building2 className="w-[18px] h-[18px]" />
          </div>
          <div className="flex flex-col items-end text-end">
            <span className="font-['Cairo'] font-semibold text-[12px] text-[#514537] dark:text-[#a89f91] leading-[16px]">
              إجمالي الاشتراكات
            </span>
            <div className="pt-1">
              <span className="font-['Cairo'] font-bold text-[28px] text-[#1b1c1a] dark:text-[#fdfbf7] leading-[38px]">
                {totalCount}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-1.5 border-t border-[#f0eeea]/60 dark:border-[#2a2622] mt-3">
          <span className="font-['Cairo'] font-bold text-[10px] text-[#514537] dark:text-[#a89f91]">
            موزعة عبر 4 باقات قانونية معتمدة
          </span>
          <Scale className="w-3 h-3 text-[#7b4e00]" />
        </div>
      </div>

      {/* KPI 2: الاشتراكات النشطة */}
      <div
        className="bg-white dark:bg-[#1e1c1a] flex flex-col justify-between p-4 rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#2f2a24] relative overflow-hidden"
        data-node-id="1:5298"
      >
        <div className="flex items-start justify-between w-full">
          <div className="bg-[#ecfdf5] dark:bg-[#132c21] flex items-center justify-center rounded-[4px] size-[40px] shrink-0 text-[#059669]">
            <ShieldCheck className="w-[20px] h-[20px]" />
          </div>
          <div className="flex flex-col items-end text-end">
            <span className="font-['Cairo'] font-semibold text-[12px] text-[#514537] dark:text-[#a89f91] leading-[16px]">
              الاشتراكات النشطة
            </span>
            <div className="flex items-center gap-2 pt-1">
              <span className="bg-[#ecfdf5] dark:bg-[#132c21] font-['Cairo'] font-bold text-[10px] text-[#065f46] dark:text-[#34d399] px-1.5 py-0.5 rounded-[2px] leading-[14px]">
                67.2%
              </span>
              <span className="font-['Cairo'] font-bold text-[28px] text-[#1b1c1a] dark:text-[#fdfbf7] leading-[38px]">
                {activeCount}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-1.5 border-t border-[#f0eeea]/60 dark:border-[#2a2622] mt-3">
          <span className="font-['Cairo'] font-bold text-[10px] text-[#514537] dark:text-[#a89f91]">
            صلاحية وصول سارية المفعول
          </span>
          <div className="bg-[#059669] rounded-full size-[8px] shrink-0" />
        </div>
      </div>

      {/* KPI 3: تنتهي خلال 7 أيام */}
      <div
        className="bg-white dark:bg-[#1e1c1a] flex flex-col justify-between p-4 rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#2f2a24] relative overflow-hidden"
        data-node-id="1:5277"
      >
        <div className="flex items-start justify-between w-full">
          <div className="bg-[#fffbeb] dark:bg-[#342711] flex items-center justify-center rounded-[4px] size-[40px] shrink-0 text-[#b45309]">
            <Clock className="w-[18px] h-[18px]" />
          </div>
          <div className="flex flex-col items-end text-end">
            <span className="font-['Cairo'] font-semibold text-[12px] text-[#514537] dark:text-[#a89f91] leading-[16px]">
              تنتهي خلال 7 أيام
            </span>
            <div className="flex items-center gap-2 pt-1">
              <span className="bg-[#fffbeb] dark:bg-[#342711] font-['Cairo'] font-bold text-[10px] text-[#78350f] dark:text-[#fbbf24] px-1.5 py-0.5 rounded-[2px] leading-[14px]">
                حرجة
              </span>
              <span className="font-['Cairo'] font-bold text-[28px] text-[#b45309] leading-[38px]">
                {expiringCount}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-1.5 border-t border-[#f0eeea]/60 dark:border-[#2a2622] mt-3">
          <span className="font-['Cairo'] font-bold text-[10px] text-[#92400e] dark:text-[#fbbf24]">
            تتطلب متابعة وإشعار تجديد فوري
          </span>
          <Clock className="w-3 h-3 text-[#b45309]" />
        </div>
      </div>

      {/* KPI 4: الاشتراكات المنتهية والملغاة */}
      <div
        className="bg-white dark:bg-[#1e1c1a] flex flex-col justify-between p-4 rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#2f2a24] relative overflow-hidden"
        data-node-id="1:5257"
      >
        <div className="flex items-start justify-between w-full">
          <div className="bg-[#fef2f2] dark:bg-[#311616] flex items-center justify-center rounded-[4px] size-[40px] shrink-0 text-[#dc2626]">
            <Ban className="w-[18px] h-[18px]" />
          </div>
          <div className="flex flex-col items-end text-end">
            <span className="font-['Cairo'] font-semibold text-[12px] text-[#514537] dark:text-[#a89f91] leading-[16px]">
              الاشتراكات المنتهية والملغاة
            </span>
            <div className="flex items-center gap-2 pt-1">
              <span className="bg-[#f0eeea] dark:bg-[#2c2621] font-['Cairo'] font-bold text-[10px] text-[#514537] dark:text-[#a89f91] px-1.5 py-0.5 rounded-[2px] leading-[14px]">
                14%
              </span>
              <span className="font-['Cairo'] font-bold text-[28px] text-[#1b1c1a] dark:text-[#fdfbf7] leading-[38px]">
                {cancelledCount}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-1.5 border-t border-[#f0eeea]/60 dark:border-[#2a2622] mt-3">
          <span className="font-['Cairo'] font-bold text-[10px] text-[#514537] dark:text-[#a89f91]">
            حسابات متوقفة أو قيد التحصيل
          </span>
          <div className="bg-[#dc2626] rounded-full size-[8px] shrink-0" />
        </div>
      </div>
    </div>
  );
}
