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

const monthlyData = [
  { month: "Oct 2025", earning: 0, client: 1, sub: 0 },
  { month: "Nov 2025", earning: 0, client: 1, sub: 0 },
  { month: "Dec 2025", earning: 0, client: 1, sub: 0 },
  { month: "Jan 2026", earning: 0, client: 2, sub: 0 },
  { month: "Feb 2026", earning: 0, client: 2, sub: 0 },
  { month: "Mar 2026", earning: 0, client: 3, sub: 0 },
  { month: "Apr 2026", earning: 10976, client: 9, sub: 39 },
  { month: "May 2026", earning: 0, client: 4, sub: 2 },
  { month: "Jun 2026", earning: 0, client: 5, sub: 1 },
  { month: "Jul 2026", earning: 0, client: 6, sub: 2 },
  { month: "Aug 2026", earning: 500, client: 7, sub: 4 },
  { month: "Sep 2026", earning: 0, client: 9, sub: 3 },
];

export function DashboardEarningReportCard() {
  const { language } = useUIStore();
  const t = translations[language].overview;

  return (
    <div className="bg-white dark:bg-[#1a1816] rounded-2xl border border-[#ded5c6] dark:border-[#2f2a24] p-5 shadow-[0_4px_16px_-2px_rgba(80,65,45,0.06),0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] h-full flex flex-col justify-between">
      {/* Header with Title */}
      <div className="border-b border-[#ded5c6]/60 dark:border-[#2f2a24] pb-4 mb-4 shrink-0">
        <h2 className="text-base font-bold text-[#1c1917] dark:text-[#f5f4f0] text-start">
          {t.earningReport}
        </h2>
      </div>

      {/* 3 Top Sub-Metrics Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {/* Metric 1: New Clients */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#faf8f4] dark:bg-[#201d1a] border border-[#ded5c6]/70 dark:border-[#2f2a24]">
          <div className="w-10 h-10 rounded-full bg-[#faf5eb] dark:bg-[#201c17] border border-[#eeddbb] dark:border-[#382b18] flex items-center justify-center text-[#c29547] dark:text-[#d4a759] shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-start">
            <span className="text-[11px] font-medium text-[#7c7366] dark:text-[#9e968a] block">
              {t.newClients}
            </span>
            <span className="text-lg font-extrabold text-[#1c1917] dark:text-[#f5f4f0]">
              9
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
              {t.totalSubscription}
            </span>
            <span className="text-lg font-extrabold text-[#1c1917] dark:text-[#f5f4f0]">
              39
            </span>
          </div>
        </div>

        {/* Metric 3: Total Sale */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#faf8f4] dark:bg-[#201d1a] border border-[#ded5c6]/70 dark:border-[#2f2a24]">
          <div className="w-10 h-10 rounded-full bg-[#faf5eb] dark:bg-[#201c17] border border-[#eeddbb] dark:border-[#382b18] flex items-center justify-center text-[#c29547] dark:text-[#d4a759] shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div className="text-start">
            <span className="text-[11px] font-medium text-[#7c7366] dark:text-[#9e968a] block">
              {t.totalSale}
            </span>
            <span className="text-lg font-extrabold text-[#1c1917] dark:text-[#f5f4f0]">
              $10,976.00
            </span>
          </div>
        </div>
      </div>

      {/* Chart Legends */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold mb-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#8c7b68] dark:bg-[#9e8f7c]" />
          <span className="text-[#6c645b] dark:text-[#a8a195]">Total Client</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#d4a759]" />
          <span className="text-[#6c645b] dark:text-[#a8a195]">Total Active Subscriptions</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#c29547]" />
          <span className="text-[#6c645b] dark:text-[#a8a195]">Total Earning</span>
        </div>
      </div>

      {/* Main Chart */}
      <div className="w-full flex-1 min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEarning" x1="0" y1="0" x2="0" y2="1">
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
                name === "earning" ? "Total Earning" : name === "client" ? "Total Client" : "Subscriptions",
              ]}
            />
            <Area
              type="monotone"
              dataKey="earning"
              stroke="#c29547"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorEarning)"
              dot={{ r: 3, fill: "#c29547", strokeWidth: 1, stroke: "#fff" }}
              activeDot={{ r: 5, stroke: "#c29547", strokeWidth: 2, fill: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
