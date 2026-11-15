"use client";

import React from "react";
import { Bot, Plus } from "lucide-react";
import { useUIStore } from "@/stores/use-ui-store";
import { translations } from "@/lib/i18n";

interface DashboardActiveChatbotsCardProps {
  onCreateBot?: () => void;
}

export function DashboardActiveChatbotsCard({
  onCreateBot,
}: DashboardActiveChatbotsCardProps) {
  const { language } = useUIStore();
  const t = translations[language].activeBotsCard;

  return (
    <div className="bg-white dark:bg-[#1a1816] rounded-2xl border border-[#ded5c6] dark:border-[#2f2a24] p-5 shadow-[0_4px_16px_-2px_rgba(80,65,45,0.06),0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_24px_-4px_rgba(194,149,71,0.12)] transition-all flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-md bg-[#fbf6ec] dark:bg-[#252018] border border-[#f5e7ce] dark:border-[#3d3222] flex items-center justify-center text-[#c29547] dark:text-[#d4a759]">
          <Bot className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-sm font-bold text-[#1c1917] dark:text-[#f5f4f0]">
          {t.title}
        </h3>
      </div>

      {/* Empty State Inner Container */}
      <div className="bg-[#faf8f4] dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] rounded-xl p-7 flex flex-col items-center justify-center text-center min-h-[175px] shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]">
        {/* Robot Icon */}
        <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#26221d] border border-[#ded5c6] dark:border-[#3d362c] text-[#a89d8f] flex items-center justify-center mb-3 shadow-xs">
          <Bot className="w-5 h-5 text-[#9a8f81] dark:text-[#d4a759]" />
        </div>

        <h4 className="text-xs md:text-sm font-bold text-[#2e2925] dark:text-[#e8e4dc] mb-1">
          {t.emptyTitle}
        </h4>
        <p className="text-[11px] text-[#938a7e] dark:text-[#9e968a] font-medium mb-3.5">
          {t.emptySubtitle}
        </p>

        {/* Action Button */}
        <button
          type="button"
          onClick={onCreateBot}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-[#b8863b] dark:text-[#d4a759] bg-white dark:bg-[#26221d] border border-[#ded5c6] dark:border-[#524128] hover:border-[#c29547] hover:bg-[#faf5ea] dark:hover:bg-[#302a22] shadow-xs hover:shadow-sm transition-all active:scale-98"
        >
          <Plus className="w-3.5 h-3.5 text-[#b8863b] dark:text-[#d4a759]" />
          <span>{t.createButton}</span>
        </button>
      </div>
    </div>
  );
}
