"use client";

import React from "react";
import { Bot, MessageSquare, Check, TrendingUp } from "lucide-react";
import { useUIStore } from "@/stores/use-ui-store";
import { translations } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface OverviewKpiCard {
  id: string;
  titleKey: "aiAgents" | "activeChats" | "completedTasks" | "whatsappAccounts";
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  textColor: string;
  cardBorder: string;
  iconWrapper: string;
  barColor: string;
  bars: number[];
}

export function DashboardOverviewKpis() {
  const { language } = useUIStore();
  const t = translations[language].kpis;

  const kpiCards: OverviewKpiCard[] = [
    {
      id: "ai-agents",
      titleKey: "aiAgents",
      value: 0,
      icon: Bot,
      textColor: "text-[#c29547] dark:text-[#d4a759]",
      cardBorder: "border border-[#ded5c6] dark:border-[#2f2a24] hover:border-[#c29547]/60 dark:hover:border-[#d4a759]/60",
      iconWrapper: "bg-[#faf5eb] dark:bg-[#201c17] border-[#eeddbb] dark:border-[#382b18] text-[#c29547] dark:text-[#d4a759]",
      barColor: "bg-[#c29547] dark:bg-[#d4a759]",
      bars: [3, 72, 48, 62, 30, 48, 20],
    },
    {
      id: "active-chats",
      titleKey: "activeChats",
      value: 0,
      icon: MessageSquare,
      textColor: "text-[#b87928] dark:text-[#e59a3c]",
      cardBorder: "border border-[#ded5c6] dark:border-[#2f2a24] hover:border-[#b87928]/60 dark:hover:border-[#e59a3c]/60",
      iconWrapper: "bg-[#fdf7ed] dark:bg-[#251e16] border-[#f5dfbc] dark:border-[#44331e] text-[#b87928] dark:text-[#e59a3c]",
      barColor: "bg-[#b87928] dark:bg-[#e59a3c]",
      bars: [3, 35, 68, 50, 26, 42, 15],
    },
    {
      id: "completed-tasks",
      titleKey: "completedTasks",
      value: 0,
      icon: Check,
      textColor: "text-[#a67322] dark:text-[#e8bf72]",
      cardBorder: "border border-[#ded5c6] dark:border-[#2f2a24] hover:border-[#a67322]/60 dark:hover:border-[#e8bf72]/60",
      iconWrapper: "bg-[#faf5eb] dark:bg-[#201c17] border-[#eeddbb] dark:border-[#382b18] text-[#a67322] dark:text-[#e8bf72]",
      barColor: "bg-[#a67322] dark:bg-[#e8bf72]",
      bars: [3, 62, 44, 55, 38, 50, 24],
    },
    {
      id: "whatsapp-accounts",
      titleKey: "whatsappAccounts",
      value: 0,
      icon: TrendingUp,
      textColor: "text-[#c29547] dark:text-[#d4a759]",
      cardBorder: "border border-[#ded5c6] dark:border-[#2f2a24] hover:border-[#c29547]/60 dark:hover:border-[#d4a759]/60",
      iconWrapper: "bg-[#faf5eb] dark:bg-[#201c17] border-[#eeddbb] dark:border-[#382b18] text-[#c29547] dark:text-[#d4a759]",
      barColor: "bg-[#c29547] dark:bg-[#d4a759]",
      bars: [3, 48, 68, 30, 50, 32, 16],
    },
  ];

  return (
    <section
      aria-label="Overview KPI Cards"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
    >
      {kpiCards.map((kpi) => {
        const Icon = kpi.icon;

        return (
          <div
            key={kpi.id}
            className={cn(
              "bg-white dark:bg-[#1a1816] rounded-2xl p-4 flex flex-col justify-between shadow-[0_4px_16px_-2px_rgba(80,65,45,0.04),0_1px_3px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden",
              kpi.cardBorder
            )}
          >
            {/* Top Row: Label & Number on start side, Round Icon on end side */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col text-start">
                <span className="text-xs font-semibold text-[#7c7366] dark:text-[#a8a195]">
                  {t[kpi.titleKey]}
                </span>
                <span
                  className={cn(
                    "text-3xl font-extrabold tracking-tight mt-1",
                    kpi.textColor
                  )}
                >
                  {kpi.value}
                </span>
              </div>

              {/* Round Icon Badge */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-2xs",
                  kpi.iconWrapper
                )}
              >
                <Icon className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>

            {/* Bottom Row: 7 Colored Sparkline Bars */}
            <div className="h-10 flex items-end justify-between gap-1.5 pt-3">
              {kpi.bars.map((heightPercent, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex-1 rounded-sm transition-all duration-300",
                    kpi.barColor
                  )}
                  style={{ height: heightPercent <= 3 ? "2.5px" : `${heightPercent}%` }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
