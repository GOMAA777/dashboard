"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Revenue Chart Data from Figma:
// May (34.2k), Jun (38.5k), Jul (41.0k), Aug (44.8k), Sep (46.9k), Oct (48.7k)
// In RTL, the chart flows from right (start = May) to left (latest = Oct), or standard chronological
const revenueData = [
  { month: "مايو (34.2k)", value: 34200, label: "مايو 2024" },
  { month: "يونيو (38.5k)", value: 38500, label: "يونيو 2024" },
  { month: "يوليو (41.0k)", value: 41000, label: "يوليو 2024" },
  { month: "أغسطس (44.8k)", value: 44800, label: "أغسطس 2024" },
  { month: "سبتمبر (46.9k)", value: 46900, label: "سبتمبر 2024" },
  { month: "أكتوبر (48.7k)", value: 48750, label: "أكتوبر 2024 (الأعلى)", isHighest: true },
];

// Donut Chart Data from Figma
const planData = [
  { name: "الباقة الاحترافية", value: 68, percentage: "53%", color: "#9c6402" },
  { name: "باقة الشركات", value: 36, percentage: "28%", color: "#1c140f" },
  { name: "الباقة الأساسية", value: 24, percentage: "19%", color: "#b9b9b9" },
];

export function DashboardAnalyticsSection() {
  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-12 gap-[16px] w-full"
      data-node-id="1:117"
      data-name="Section 3: Visual Analytics Section (Revenue Area Chart & Plan Donut)"
    >
      {/* Right / Wider (in RTL): Revenue Evolution Chart (65% / 8 cols) */}
      <div
        className="lg:col-span-8 bg-white rounded-[8px] p-[24px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] border border-[#f0eeea]/70 flex flex-col justify-between relative min-h-[395px]"
        data-node-id="1:118"
        data-name="Revenue Evolution Chart (65% on Desktop)"
      >
        {/* Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full"
          data-node-id="1:120"
        >
          {/* Title & Subtitle */}
          <div className="flex flex-col items-start text-start" data-node-id="1:132">
            <h2
              className="text-[#1b1c1a] text-[18px] leading-[26px] font-bold font-sans"
              data-node-id="1:134"
            >
              تحليل الإيرادات
            </h2>
            <p
              className="text-[#514537] text-[12px] leading-[18px] font-normal"
              data-node-id="1:136"
            >
              نمو الإيرادات خلال آخر 6 أشهر ومقارنة الأداء المستهدف
            </p>
          </div>

          {/* Metric Pill: Total Period & +14% */}
          <div
            className="bg-[#f5f3ef] rounded-[4px] px-[12px] py-[6px] flex items-center gap-[16px] shrink-0 self-start sm:self-auto"
            data-node-id="1:121"
          >
            {/* +14% Badge */}
            <div
              className="bg-[#ecfdf5] rounded-[2px] px-[8px] py-[2px] flex items-center gap-[4px]"
              data-node-id="1:122"
            >
              <span className="text-[#065f46] text-[10px] leading-[14px] font-semibold">
                +14% مقارنة
              </span>
              <div className="size-[8.75px] flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/figma/chart-trend-up.svg"
                  alt=""
                  className="size-[8.75px] block"
                />
              </div>
            </div>

            {/* Total Period Text */}
            <div className="flex flex-col items-end text-end" data-node-id="1:127">
              <span className="text-[#625d5d] text-[10px] leading-[14px] font-bold">
                إجمالي الفترة
              </span>
              <span className="text-[#1b1c1a] text-[14px] leading-[20px] font-bold font-sans">
                264,800 ر.س
              </span>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="w-full h-[250px] mt-4 relative">
          {/* Static Figma Tooltip Card badge positioned above October */}
          <div
            className="absolute top-0 end-[20px] z-10 bg-[#1c140f] rounded-[4px] px-[12px] py-[6px] shadow-lg flex flex-col items-center pointer-events-none"
            data-node-id="1:171"
          >
            <span className="text-[#ffddb6] text-[10px] font-bold leading-[14px]">
              أكتوبر 2024 (الأعلى)
            </span>
            <span className="text-[#fdfbf7] text-[12px] font-bold leading-[16px]">
              48,750 ر.س
            </span>
            {/* Triangle indicator */}
            <div className="absolute -bottom-[4px] start-1/2 -translate-x-1/2 size-[8px] bg-[#1c140f] rotate-45" />
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueData}
              margin={{ top: 25, right: 20, left: 20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueFigmaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9c6402" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#9c6402" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                stroke="#625d5d"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#f0eeea" }}
                interval={0}
                tick={({ x, y, payload }) => {
                  const isOct = payload.value.includes("أكتوبر");
                  return (
                    <text
                      x={Number(x)}
                      y={Number(y) + 16}
                      textAnchor="middle"
                      fill={isOct ? "#9c6402" : "#625d5d"}
                      fontWeight={isOct ? 700 : 600}
                      fontSize={12}
                      fontFamily="var(--font-cairo), sans-serif"
                    >
                      {payload.value}
                    </text>
                  );
                }}
              />
              <YAxis
                orientation="right"
                domain={[25000, 52000]}
                ticks={[30000, 40000, 50000]}
                tickFormatter={(val) => `${val / 1000}k ر.س`}
                stroke="#837565"
                fontSize={10.5}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#837565", fontFamily: "var(--font-cairo), sans-serif" }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#1c140f] rounded-[4px] px-[12px] py-[6px] shadow-lg text-center font-sans">
                        <p className="text-[#ffddb6] text-[10px] font-bold leading-[14px]">
                          {data.label}
                        </p>
                        <p className="text-[#fdfbf7] text-[12px] font-bold leading-[16px]">
                          {data.value.toLocaleString()} ر.س
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#9c6402"
                strokeWidth={2.5}
                fill="url(#revenueFigmaGradient)"
                dot={({ cx, cy, index }) => (
                  <circle
                    key={`dot-${index}`}
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill="#ffffff"
                    stroke="#9c6402"
                    strokeWidth={2.5}
                  />
                )}
                activeDot={{ r: 6, fill: "#9c6402", stroke: "#ffffff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Left / Narrower (in RTL): Office Plan Distribution Donut Chart (35% / 4 cols) */}
      <div
        className="lg:col-span-4 bg-white rounded-[8px] p-[24px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] border border-[#f0eeea]/70 flex flex-col justify-between min-h-[395px]"
        data-node-id="1:178"
        data-name="Office Plan Distribution Donut Chart (35% on Desktop)"
      >
        {/* Header */}
        <div className="flex flex-col items-start text-start" data-node-id="1:179">
          <h2
            className="text-[#1b1c1a] text-[18px] leading-[26px] font-bold font-sans"
            data-node-id="1:181"
          >
            توزيع المكاتب حسب الباقة
          </h2>
          <p
            className="text-[#514537] text-[12px] leading-[18px] font-normal"
            data-node-id="1:183"
          >
            حصة الباقات من إجمالي 128 مكتب مرخص
          </p>
        </div>

        {/* Center Donut with Metric Label */}
        <div className="relative size-[192px] mx-auto my-2 flex items-center justify-center">
          <ResponsiveContainer width={192} height={192}>
            <PieChart>
              <Pie
                data={planData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={84}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                stroke="#ffffff"
                strokeWidth={2}
              >
                {planData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Metric Label */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center"
            data-node-id="1:222"
          >
            <span
              className="text-[#625d5d] text-[10px] font-medium leading-[14px]"
              data-node-id="1:224"
            >
              المجموع الكلي
            </span>
            <span
              className="text-[#1b1c1a] text-[28px] font-bold font-sans leading-[30px] my-[1px]"
              data-node-id="1:227"
            >
              128
            </span>
            <span
              className="text-[#514537] text-[10px] font-bold leading-[14px]"
              data-node-id="1:229"
            >
              مكتب معتمد
            </span>
          </div>
        </div>

        {/* Legend */}
        <div
          className="border-t border-[#f0eeea] pt-[12px] flex flex-col gap-[8px] w-full"
          data-node-id="1:184"
        >
          {planData.map((plan, idx) => (
            <div
              key={plan.name}
              className="flex items-center justify-between w-full text-[12px]"
              data-node-id={`1:${185 + idx * 10}`}
            >
              {/* Right: Color indicator and name */}
              <div className="flex items-center gap-[8px]">
                <span
                  className="size-[12px] rounded-full shrink-0"
                  style={{ backgroundColor: plan.color }}
                />
                <span className="font-semibold text-[#1b1c1a] text-[12px] leading-[16px]">
                  {plan.name}
                </span>
              </div>

              {/* Left: Quantity and Percentage */}
              <div className="flex items-center gap-[8px]">
                <span className="font-bold text-[#1b1c1a] text-[12px] leading-[16px]">
                  {plan.value} مكتب
                </span>
                <span className="font-semibold text-[#625d5d] text-[12px] leading-[16px]">
                  ({plan.percentage})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
