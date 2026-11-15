"use client";

import React, { useState } from "react";
import { Megaphone, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/use-ui-store";
import { translations } from "@/lib/i18n";

export function DashboardBulkCampaignsCard() {
  const { language } = useUIStore();
  const t = translations[language].campaignsCard;
  const [isEnabled, setIsEnabled] = useState(true);

  return (
    <div className="bg-white dark:bg-[#1a1816] rounded-2xl border border-[#ded5c6] dark:border-[#2f2a24] p-5 shadow-[0_4px_16px_-2px_rgba(80,65,45,0.06),0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_24px_-4px_rgba(194,149,71,0.12)] transition-all flex flex-col justify-between">
      {/* Top Header Row with Megaphone Icon & Title + ON Toggle Badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#fbf6ec] dark:bg-[#252018] border border-[#f5e7ce] dark:border-[#3d3222] flex items-center justify-center text-[#c29547] dark:text-[#d4a759]">
            <Megaphone className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-bold text-[#1c1917] dark:text-[#f5f4f0]">
            {t.title}
          </h3>
        </div>

        {/* ON Toggle Status Badge */}
        <button
          type="button"
          onClick={() => setIsEnabled(!isEnabled)}
          className={cn(
            "px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase transition-all tracking-wider border shadow-2xs",
            isEnabled
              ? "bg-[#faf4e6] dark:bg-[#2e261a] text-[#b8863b] dark:text-[#d4a759] border-[#d8c29d] dark:border-[#524128]"
              : "bg-[#f4f2ed] dark:bg-[#201d1a] text-[#8e8578] dark:text-[#787166] border-[#ded5c6] dark:border-[#2f2a24]"
          )}
        >
          {isEnabled ? "ON" : "OFF"}
        </button>
      </div>

      {/* Main Campaign Description */}
      <p className="text-xs text-[#6e665d] dark:text-[#a8a195] leading-relaxed mb-3">
        {t.description}
      </p>

      {/* Sub Feature Row: Smart Random Intervals */}
      <div className="flex items-center gap-2 text-[11px] text-[#857b6f] dark:text-[#9e968a] font-medium pt-2.5 border-t border-[#ded5c6] dark:border-[#2f2a24]">
        <Clock className="w-3.5 h-3.5 text-[#b8863b] dark:text-[#d4a759] shrink-0" />
        <span>{t.randomIntervals}</span>
      </div>
    </div>
  );
}
