import React from "react";

export function DashboardKpiCards() {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] w-full"
      data-node-id="1:35"
      data-name="Section 2: Primary KPI Cards (4 Tiles)"
    >
      {/* KPI 1 (Rightmost in RTL): إجمالي المكاتب */}
      <div
        className="bg-white rounded-[8px] p-[16px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] border border-[#f0eeea]/70 flex flex-col justify-between"
        data-node-id="1:97"
        data-name="KPI 1"
      >
        <div className="flex items-start justify-between w-full" data-node-id="1:98">
          {/* Icon box */}
          <div
            className="size-[44px] rounded-[4px] bg-[#eae8e4] flex items-center justify-center shrink-0"
            data-node-id="1:99"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/kpi-offices.svg"
              alt=""
              className="size-[18px] block"
            />
          </div>

          {/* Title & Value */}
          <div className="flex flex-col items-end text-end" data-node-id="1:102">
            <span
              className="text-[#625d5d] text-[12px] leading-[16px] font-medium"
              data-node-id="1:104"
            >
              إجمالي المكاتب
            </span>
            <span
              className="text-[#1b1c1a] text-[28px] leading-[38px] font-bold font-sans mt-[4px]"
              data-node-id="1:107"
            >
              128
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-[8px] w-full" data-node-id="1:108">
          <div
            className="border-t border-[#f0eeea] pt-[9px] flex items-center justify-between w-full"
            data-node-id="1:109"
          >
            {/* Badge */}
            <div
              className="bg-[#ecfdf5] rounded-[2px] px-[6px] py-[2px] flex items-center gap-[4px]"
              data-node-id="1:110"
            >
              <span className="text-[#065f46] text-[10px] leading-[14px] font-bold">
                +8.4%
              </span>
              <span className="size-[6px] rounded-full bg-[#059669] shrink-0" />
            </div>

            {/* Subtitle */}
            <span
              className="text-[#514537] text-[12px] leading-[18px] font-normal"
              data-node-id="1:115"
            >
              إجمالي المسجلة على المنصة
            </span>
          </div>
        </div>
      </div>

      {/* KPI 2: الاشتراكات النشطة */}
      <div
        className="bg-white rounded-[8px] p-[16px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] border border-[#f0eeea]/70 flex flex-col justify-between"
        data-node-id="1:78"
        data-name="KPI 2"
      >
        <div className="flex items-start justify-between w-full" data-node-id="1:79">
          {/* Icon box */}
          <div
            className="size-[44px] rounded-[4px] bg-[#ecfdf5] flex items-center justify-center shrink-0"
            data-node-id="1:80"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/kpi-subs.svg"
              alt=""
              className="w-[22px] h-[21px] block"
            />
          </div>

          {/* Title & Value */}
          <div className="flex flex-col items-end text-end" data-node-id="1:83">
            <span
              className="text-[#625d5d] text-[12px] leading-[16px] font-medium"
              data-node-id="1:85"
            >
              الاشتراكات النشطة
            </span>
            <span
              className="text-[#1b1c1a] text-[28px] leading-[38px] font-bold font-sans mt-[4px]"
              data-node-id="1:88"
            >
              96
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-[8px] w-full" data-node-id="1:89">
          <div
            className="border-t border-[#f0eeea] pt-[9px] flex items-center justify-between w-full"
            data-node-id="1:90"
          >
            {/* Badge */}
            <div
              className="bg-[#eae8e4] rounded-[2px] px-[6px] py-[2px] flex items-center gap-[4px]"
              data-node-id="1:91"
            >
              <span className="text-[#514537] text-[10px] leading-[14px] font-bold">
                75% من المكاتب
              </span>
              <span className="size-[6px] rounded-full bg-[#9c6402] shrink-0" />
            </div>

            {/* Subtitle */}
            <span
              className="text-[#514537] text-[12px] leading-[18px] font-normal"
              data-node-id="1:96"
            >
              عدد الاشتراكات السارية
            </span>
          </div>
        </div>
      </div>

      {/* KPI 3: الإيرادات الشهرية */}
      <div
        className="bg-white rounded-[8px] p-[16px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] border border-[#f0eeea]/70 flex flex-col justify-between"
        data-node-id="1:55"
        data-name="KPI 3"
      >
        <div className="flex items-start justify-between w-full" data-node-id="1:56">
          {/* Icon box */}
          <div
            className="size-[44px] rounded-[4px] bg-[#ffddb6] flex items-center justify-center shrink-0"
            data-node-id="1:57"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/kpi-revenue.svg"
              alt=""
              className="w-[22px] h-[16px] block"
            />
          </div>

          {/* Title & Value */}
          <div className="flex flex-col items-end text-end" data-node-id="1:60">
            <span
              className="text-[#625d5d] text-[12px] leading-[16px] font-medium"
              data-node-id="1:62"
            >
              الإيرادات الشهرية
            </span>
            <div className="flex items-baseline gap-[4px] mt-[4px]" data-node-id="1:64">
              <span className="text-[#625d5d] text-[12px] leading-[16px] font-normal">
                ر.س
              </span>
              <span
                className="text-[#1b1c1a] text-[28px] leading-[38px] font-bold font-sans"
                data-node-id="1:68"
              >
                48,750
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-[8px] w-full" data-node-id="1:69">
          <div
            className="border-t border-[#f0eeea] pt-[9px] flex items-center justify-between w-full"
            data-node-id="1:70"
          >
            {/* Badge */}
            <div
              className="bg-[rgba(123,78,0,0.1)] rounded-[2px] px-[6px] py-[2px] flex items-center gap-[4px]"
              data-node-id="1:71"
            >
              <span className="text-[#9c6402] text-[10px] leading-[14px] font-semibold">
                +12.2%
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/kpi-arrow-up.svg"
                alt=""
                className="w-[10px] h-[6px] block shrink-0"
              />
            </div>

            {/* Subtitle */}
            <span
              className="text-[#514537] text-[12px] leading-[18px] font-normal"
              data-node-id="1:77"
            >
              المحققة خلال الشهر الحالي
            </span>
          </div>
        </div>
      </div>

      {/* KPI 4 (Leftmost in RTL): تذاكر الدعم المفتوحة */}
      <div
        className="bg-white rounded-[8px] p-[16px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] border border-[#f0eeea]/70 flex flex-col justify-between"
        data-node-id="1:36"
        data-name="KPI 4"
      >
        <div className="flex items-start justify-between w-full" data-node-id="1:37">
          {/* Icon box */}
          <div
            className="size-[44px] rounded-[4px] bg-[rgba(255,218,214,0.4)] flex items-center justify-center shrink-0"
            data-node-id="1:38"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/kpi-support.svg"
              alt=""
              className="w-[20px] h-[18px] block"
            />
          </div>

          {/* Title & Value */}
          <div className="flex flex-col items-end text-end" data-node-id="1:41">
            <span
              className="text-[#625d5d] text-[12px] leading-[16px] font-medium"
              data-node-id="1:43"
            >
              تذاكر الدعم المفتوحة
            </span>
            <span
              className="text-[#1b1c1a] text-[28px] leading-[38px] font-bold font-sans mt-[4px]"
              data-node-id="1:46"
            >
              12
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-[8px] w-full" data-node-id="1:47">
          <div
            className="border-t border-[#f0eeea] pt-[9px] flex items-center justify-between w-full"
            data-node-id="1:48"
          >
            {/* Badge */}
            <div
              className="bg-[#ffdad6] rounded-[2px] px-[6px] py-[2px] flex items-center gap-[4px]"
              data-node-id="1:49"
            >
              <span className="text-[#93000a] text-[10px] leading-[14px] font-bold">
                4 حرجة / عاجلة
              </span>
              <span className="size-[6px] rounded-full bg-[#ba1a1a] shrink-0" />
            </div>

            {/* Subtitle */}
            <span
              className="text-[#514537] text-[12px] leading-[18px] font-normal"
              data-node-id="1:54"
            >
              تحتاج إلى متابعة
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
