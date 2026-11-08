"use client";

import React from "react";
import { MessageSquare, Check } from "lucide-react";
import { useUIStore } from "@/stores/use-ui-store";
import { translations } from "@/lib/i18n";

export function DashboardUnreadMessagesCard() {
  const { language } = useUIStore();
  const t = translations[language].unreadCard;

  return (
    <div className="bg-white dark:bg-[#1a1816] rounded-2xl border border-[#ded5c6] dark:border-[#2f2a24] p-5 shadow-[0_4px_16px_-2px_rgba(80,65,45,0.06),0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] hover:border-[#c29547]/50 dark:hover:border-[#d4a759]/50 hover:shadow-[0_8px_24px_-4px_rgba(194,149,71,0.12)] transition-all flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-md bg-[#fbf6ec] dark:bg-[#252018] border border-[#f5e7ce] dark:border-[#3d3222] flex items-center justify-center text-[#c29547] dark:text-[#d4a759]">
          <MessageSquare className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-sm font-bold text-[#1c1917] dark:text-[#f5f4f0]">
          {t.title}
        </h3>
      </div>

      {/* Empty State Inner Container */}
      <div className="bg-[#faf8f4] dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] rounded-xl p-8 flex flex-col items-center justify-center text-center min-h-[160px] shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]">
        {/* Circular Gold Checkmark */}
        <div className="w-11 h-11 rounded-full border-2 border-[#c29547] dark:border-[#d4a759] bg-white dark:bg-[#26221d] text-[#c29547] dark:text-[#d4a759] shadow-xs flex items-center justify-center mb-3">
          <Check className="w-5 h-5 stroke-[2.5]" />
        </div>

        <h4 className="text-xs md:text-sm font-bold text-[#2e2925] dark:text-[#e8e4dc] mb-1">
          {t.caughtUpTitle}
        </h4>
        <p className="text-[11px] text-[#938a7e] dark:text-[#9e968a] font-medium">
          {t.noUnread}
        </p>
      </div>
    </div>
  );
}
