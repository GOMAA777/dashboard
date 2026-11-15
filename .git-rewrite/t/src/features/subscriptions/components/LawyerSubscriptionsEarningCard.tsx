"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Users, Tag, Coins } from "lucide-react";
import { useUIStore } from "@/stores/use-ui-store";
import { translations } from "@/lib/i18n";
import { ScalesOfJusticeWatermark } from "@/components/shared/ScalesOfJusticeWatermark";

const monthlyLawyerData = [
  { month: "Oct 2025", earning: 3200, firms: 12, sub: 18 },
  { month: "Nov 2025", earning: 4800, firms: 18, sub: 24 },
  { month: "Dec 2025", earning: 6100, firms: 25, sub: 32 },
  { month: "Jan 2026", earning: 8900, firms: 34, sub: 41 },
  { month: "Feb 2026", earning: 11400, firms: 42, sub: 50 },
  { month: "Mar 2026", earning: 14800, firms: 51, sub: 60 },
  { month: "Apr 2026", earning: 24850, firms: 88, sub: 79 },
  { month: "May 2026", earning: 16500, firms: 62, sub: 68 },
  { month: "Jun 2026", earning: 17200, firms: 65, sub: 71 },
  { month: "Jul 2026", earning: 19400, firms: 70, sub: 73 },
  { month: "Aug 2026", earning: 21800, firms: 79, sub: 76 },
  { month: "Sep 2026", earning: 24100, firms: 85, sub: 78 },
];

export function LawyerSubscriptionsEarningCard() {
  const { language } = useUIStore();
  const ls = translations[language].lawyerSubs;

  return (
    <div className="bg-white dark:bg-[#1a1816] rounded-2xl border border-[#ded5c6] dark:border-[#2f2a24] p-5 shadow-[0_4px_16px_-2px_rgba(80,65,45,0.06),0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] h-full flex flex-col justify-between relative overflow-hidden">
      {/* Background Scales of Justice Watermark inside card */}
      <div className="absolute top-1/2 end-2 -translate-y-1/2 w-72 h-72 pointer-events-none opacity-[0.04] dark:opacity-[0.055] text-[#c29547] dark:text-[#d4a759]">
        <ScalesOfJusticeWatermark className="w-full h-full" />
      </div>

      {/* Header with Title */}
      <div className="border-b border-[#ded5c6]/60 dark:border-[#2f2a24] pb-4 mb-4 shrink-0 relative z-10 flex items-center justify-between">
        <h2 className="text-base font-bold text-[#1c1917] dark:text-[#f5f4f0] text-start">
          {ls.earningReportTitle}
        </h2>
        <span className="text-[11px] font-semibold text-[#8c8279] dark:text-[#9e968a] bg-[#faf8f4] dark:bg-[#201d1a] px-2.5 py-1 rounded-full border border-[#ded5c6]/60 dark:border-[#2f2a24]">
          {language === "ar" ? "اشتراكات سنوية وشهرية" : "Annual & Monthly"}
        </span>
      </div>

      {/* 3 Top Sub-Metrics Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 relative z-10">
        {/* Metric 1: New Lawyers */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#faf8f4] dark:bg-[#201d1a] border border-[#ded5c6]/70 dark:border-[#2f2a24]">
          <div className="w-10 h-10 rounded-full bg-[#faf5eb] dark:bg-[#201c17] border border-[#eeddbb] dark:border-[#382b18] flex items-center justify-center text-[#c29547] dark:text-[#d4a759] shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-start">
            <span className="text-[11px] font-medium text-[#7c7366] dark:text-[#9e968a] block">
              {ls.newLawyers}
            </span>
            <span className="text-lg font-extrabold text-[#1c1917] dark:text-[#f5f4f0]">
              18
            </span>
          </div>
        </div>

        {/* Metric 2: Total Subscription */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#faf8f4] dark:bg-[#201d1a] border border-[#ded5c6]/70 dark:border-[#2f2a24]">
          <div className="w-10 h-10 rounded-full bg-[#fdf7ed] dark:bg-[#251e16] border border-[#f5dfbc] dark:border-[#44331e] flex items-center justify-center text-[#b87928] dark:text-[#e59a3c] shrink-0">
            <Tag className="w-5 h-5" />
          </div>
          <div className="text-start">
            <span className="text-[11px] font-medium text-[#7c7366] dark:text-[#9e968a] block">
              {ls.totalSubscriptions}
            </span>
            <span className="text-lg font-extrabold text-[#1c1917] dark:text-[#f5f4f0]">
              79
            </span>
          </div>
        </div>

        {/* Metric 3: Total Sales / Revenue */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#faf8f4] dark:bg-[#201d1a] border border-[#ded5c6]/70 dark:border-[#2f2a24]">
          <div className="w-10 h-10 rounded-full bg-[#faf5eb] dark:bg-[#201c17] border border-[#eeddbb] dark:border-[#382b18] flex items-center justify-center text-[#c29547] dark:text-[#d4a759] shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div className="text-start">
            <span className="text-[11px] font-medium text-[#7c7366] dark:text-[#9e968a] block">
              {ls.totalSalesRevenue}
            </span>
            <span className="text-lg font-extrabold text-[#1c1917] dark:text-[#f5f4f0]">
              $24,850.00
            </span>
          </div>
        </div>
      </div>

      {/* Chart Legends */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold mb-3 relative z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#8c7b68] dark:bg-[#9e8f7c]" />
          <span className="text-[#6c645b] dark:text-[#a8a195]">{ls.chartLawFirms}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#d4a759]" />
          <span className="text-[#6c645b] dark:text-[#a8a195]">{ls.chartActiveSubs}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#c29547]" />
          <span className="text-[#6c645b] dark:text-[#a8a195]">{ls.chartTotalEarnings}</span>
        </div>
      </div>

      {/* Main Chart */}
      <div className="w-full flex-1 min-h-[280px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyLawyerData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLawyerEarning" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c29547" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#c29547" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ded5c6" opacity={0.4} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "#8c8279" }}
              axisLine={{ stroke: "#ded5c6", opacity: 0.5 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#8c8279" }}
              axisLine={{ stroke: "#ded5c6", opacity: 0.5 }}
              tickLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1c1917",
                borderRadius: "12px",
                border: "none",
                color: "#ffffff",
                fontSize: "12px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              }}
              formatter={(value, name) => [
                name === "earning" ? `$${Number(value).toLocaleString()}` : value,
                name === "earning"
                  ? ls.chartTotalEarnings
                  : name === "firms"
                  ? ls.chartLawFirms
                  : ls.chartActiveSubs,
              ]}
            />
            <Area
              type="monotone"
              dataKey="earning"
              stroke="#c29547"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorLawyerEarning)"
              dot={{ r: 3, fill: "#c29547", strokeWidth: 1, stroke: "#fff" }}
              activeDot={{ r: 5, stroke: "#c29547", strokeWidth: 2, fill: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
