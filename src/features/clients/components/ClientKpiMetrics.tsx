import React from "react";
import {
  Building2,
  UserCheck,
  Clock,
  Ban,
  Hourglass,
} from "lucide-react";

export function ClientKpiMetrics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] w-full" data-node-id="1:760">
      {/* 1. إجمالي المكاتب */}
      <div className="bg-white rounded-[8px] p-[20px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] flex items-center justify-between">
        <div className="flex flex-col items-start text-right">
          <span className="text-[#514537] text-[12px] leading-[18px] font-normal">
            إجمالي المكاتب
          </span>
          <div className="flex items-baseline gap-[6px] mt-[4px]">
            <span className="text-[#1b1c1a] text-[28px] leading-[34px] font-bold">
              128
            </span>
          </div>
          <span className="text-[#837565] text-[11px] leading-[16px] mt-[2px]">
            مكتب مسجل
          </span>
        </div>
        <div className="bg-[#f5f3ef] text-[#9c6402] size-[44px] rounded-[6px] flex items-center justify-center shrink-0">
          <Building2 className="size-[22px]" />
        </div>
      </div>

      {/* 2. الحسابات النشطة */}
      <div className="bg-white rounded-[8px] p-[20px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] flex items-center justify-between">
        <div className="flex flex-col items-start text-right">
          <span className="text-[#514537] text-[12px] leading-[18px] font-normal">
            الحسابات النشطة
          </span>
          <div className="flex items-baseline gap-[8px] mt-[4px]">
            <span className="text-[#1b1c1a] text-[28px] leading-[34px] font-bold">
              96
            </span>
            <span className="bg-[#e8f5e9] text-[#1b7340] text-[10px] leading-[14px] font-bold px-[6px] py-[2px] rounded-[2px]">
              75% من الإجمالي
            </span>
          </div>
          <span className="text-[#837565] text-[11px] leading-[16px] mt-[2px]">
            كافة التراخيص الفعالة
          </span>
        </div>
        <div className="bg-[#e8f5e9] text-[#1b7340] size-[44px] rounded-[6px] flex items-center justify-center shrink-0">
          <UserCheck className="size-[22px]" />
        </div>
      </div>

      {/* 3. تحت التجربة */}
      <div className="bg-white rounded-[8px] p-[20px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] flex items-center justify-between">
        <div className="flex flex-col items-start text-right">
          <span className="text-[#514537] text-[12px] leading-[18px] font-normal">
            تحت التجربة
          </span>
          <div className="flex items-baseline gap-[8px] mt-[4px]">
            <span className="text-[#1b1c1a] text-[28px] leading-[34px] font-bold">
              18
            </span>
            <span className="text-[#837565] text-[11px] leading-[16px]">
              فترة مجانية
            </span>
          </div>
          <div className="flex items-center gap-[4px] mt-[2px] text-[#9c6402] text-[11px] leading-[16px] font-medium">
            <Hourglass className="size-[12px]" />
            <span>متوسط 14 يوماً متبقية</span>
          </div>
        </div>
        <div className="bg-[#fffbeb] text-[#b45309] size-[44px] rounded-[6px] flex items-center justify-center shrink-0">
          <Clock className="size-[22px]" />
        </div>
      </div>

      {/* 4. الحسابات المعطلة */}
      <div className="bg-white rounded-[8px] p-[20px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] flex items-center justify-between">
        <div className="flex flex-col items-start text-right">
          <span className="text-[#514537] text-[12px] leading-[18px] font-normal">
            الحسابات المعطلة
          </span>
          <div className="flex items-baseline gap-[8px] mt-[4px]">
            <span className="text-[#1b1c1a] text-[28px] leading-[34px] font-bold">
              14
            </span>
            <span className="text-[#dc2626] text-[11px] leading-[16px] font-bold">
              تتطلب تدقيق
            </span>
          </div>
          <span className="text-[#837565] text-[11px] leading-[16px] mt-[2px]">
            بانتظار السداد
          </span>
        </div>
        <div className="bg-[#fef2f2] text-[#dc2626] size-[44px] rounded-[6px] flex items-center justify-center shrink-0">
          <Ban className="size-[22px]" />
        </div>
      </div>
    </div>
  );
}
