"use client";

import React from "react";
import { Bot, MessageSquare, CheckCircle, TrendingUp } from "lucide-react";
import { useUIStore } from "@/stores/use-ui-store";
import { translations } from "@/lib/i18n";

interface KpiCardData {
  id: string;
  titleKey: "aiAgents" | "activeChats" | "completedTasks" | "whatsappAccounts";
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  bars: number[]; // Percentage heights for the 7 mini sparkline bars
}

export function DashboardKpiStatCards() {
  const { language } = useUIStore();
  const t = translations[language].kpis;

  const kpiCards: KpiCardData[] = [
    {
      id: "ai-agents",
      titleKey: "aiAgents",
      value: 0,
      icon: Bot,
      bars: [45, 60, 30, 40, 20, 35, 10],
    },
    {
      id: "active-chats",
      titleKey: "activeChats",
      value: 0,
      icon: MessageSquare,
      bars: [30, 45, 65, 50, 25, 40, 10],
    },
    {
      id: "completed-tasks",
      titleKey: "completedTasks",
      value: 0,
      icon: CheckCircle,
      bars: [50, 30, 45, 60, 40, 55, 10],
    },
    {
      id: "whatsapp-accounts",
      titleKey: "whatsappAccounts",
      value: 0,
      icon: TrendingUp,
      bars: [35, 55, 70, 45, 50, 60, 10],
    },
  ];

  return (
    <section aria-label="Key Performance Indicators" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiCards.map((kpi) => {
        const Icon = kpi.icon;

        return (
          <div
            key={kpi.id}
            className="bg-white dark:bg-[#1a1816] rounded-2xl border border-[#ded5c6] dark:border-[#2f2a24] p-4 flex flex-col justify-between shadow-[0_4px_16px_-2px_rgba(80,65,45,0.06),0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] hover:border-[#c29547]/60 dark:hover:border-[#d4a759]/60 hover:shadow-[0_8px_24px_-4px_rgba(194,149,71,0.18)] hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden"
          >
            {/* Top row: Title & Icon */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#5c544b] dark:text-[#a8a195]">
                {t[kpi.titleKey]}
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#fbf6ec] dark:bg-[#252018] border border-[#f5e7ce] dark:border-[#3d3222] flex items-center justify-center text-[#c29547] dark:text-[#d4a759]">
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Middle row: Large Metric Value */}
            <div className="my-2">
              <span className="text-3xl font-extrabold text-[#1c1917] dark:text-[#f5f4f0] tracking-tight">
                {kpi.value}
              </span>
            </div>

            {/* Bottom row: Mini Bar Sparkline Chart */}
            <div className="h-9 flex items-end justify-between gap-1 pt-2">
              {kpi.bars.map((heightPercent, idx) => (
                <div
                  key={idx}
                  className="flex-1 rounded-sm bg-[#e8dcce]/80 dark:bg-[#332e27] hover:bg-[#d9c7b0] dark:hover:bg-[#473f35] transition-colors"
                  style={{ height: `${heightPercent}%` }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
