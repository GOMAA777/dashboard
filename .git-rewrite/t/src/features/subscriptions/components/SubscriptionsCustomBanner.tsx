"use client";

import React from "react";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { useUIStore } from "@/stores/use-ui-store";

export function SubscriptionsCustomBanner() {
  const { direction } = useUIStore();

  return (
    <section className="w-full max-w-6xl mx-auto px-4 mb-14 relative z-10">
      <div className="rounded-3xl bg-white dark:bg-[#1a1816] p-5 sm:p-6 border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-start hover:border-[#c29547]/50 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#faf5eb] dark:bg-[#251f17] border border-[#eeddbb] dark:border-[#4d3a1f] flex items-center justify-center text-[#c29547] dark:text-[#d4a759] shrink-0">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-[#1c1917] dark:text-[#f5f4f0]">
              هل تحتاج إلى باقة مخصصة لشركتك أو فروع متعددة؟
            </h2>
            <p className="text-xs text-[#7d7367] dark:text-[#9e968a] mt-0.5">
              فريق مستشارينا جاهز لتصميم خطة متكاملة توافق شروطك واحتياجاتك القانونية الخاصة بدقة.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {}}
          className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-[#c29547] dark:text-[#d4a759] hover:text-[#1c1917] dark:hover:text-[#f5f4f0] bg-[#faf5eb] dark:bg-[#251f17] hover:bg-[#eeddbb] dark:hover:bg-[#342a1e] border border-[#eeddbb] dark:border-[#4d3a1f] transition-all cursor-pointer shadow-2xs group"
        >
          <span>تواصل مع مستشارينا الآن</span>
          {direction === "rtl" ? (
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          ) : (
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          )}
        </button>
      </div>
    </section>
  );
}
