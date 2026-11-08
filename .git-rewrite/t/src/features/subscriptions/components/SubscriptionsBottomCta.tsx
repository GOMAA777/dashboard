"use client";

import React from "react";
import { Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
import { useUIStore } from "@/stores/use-ui-store";

export function SubscriptionsBottomCta() {
  const { direction } = useUIStore();

  return (
    <section className="w-full max-w-4xl mx-auto px-4 mb-20 text-center relative z-10">
      {/* Decorative Divider */}
      <div className="flex items-center justify-center gap-1.5 mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c29547]/40" />
        <span className="w-2 h-2 rounded-full bg-[#c29547]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#c29547]/40" />
      </div>

      <div className="rounded-3xl bg-gradient-to-b from-white to-[#faf7f0] dark:from-[#1a1816] dark:to-[#141210] p-8 sm:p-12 border border-[#ded5c6] dark:border-[#2f2a24] shadow-md relative overflow-hidden">
        {/* Ambient subtle glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-72 h-72 bg-[#c29547]/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-[#faf5eb] dark:bg-[#251f17] border border-[#eeddbb] dark:border-[#4d3a1f] flex items-center justify-center text-[#c29547] dark:text-[#d4a759] mx-auto mb-5 shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1c1917] dark:text-[#f5f4f0] tracking-tight leading-tight mb-4">
            ابدأ تنظيم وإدارة قضايا مكتبك اليوم بأعلى كفاءة واحترافية
          </h2>

          <p className="text-xs sm:text-sm text-[#736a5e] dark:text-[#a8a195] leading-relaxed mb-8 font-normal">
            انضم إلى أكثر من 280 مكتب وشركة محاماة تعتمد على منصة الجودي لإدارة آلاف القضايا والجلسات. ابدأ مجاناً الآن مع تجربة متكاملة وبدون أي بطاقة بنكية.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              className="w-full sm:w-auto px-7 py-3 rounded-2xl text-xs font-bold text-white dark:text-[#171513] bg-[#1c1917] dark:bg-[#c29547] hover:bg-[#c29547] dark:hover:bg-[#d4a759] transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>ابدأ التجربة المجانية الآن</span>
              {direction === "rtl" ? (
                <ArrowLeft className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-bold text-[#2d2823] dark:text-[#ded7cc] bg-white dark:bg-[#201d1a] hover:bg-[#faf7f0] dark:hover:bg-[#282420] border border-[#ded5c6] dark:border-[#383126] transition-all shadow-2xs active:scale-95 cursor-pointer"
            >
              طلب عرض توضيحي للمكتب
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
