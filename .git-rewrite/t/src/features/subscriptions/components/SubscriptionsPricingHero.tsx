"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubscriptionsPricingHeroProps {
  billingCycle: "monthly" | "annual";
  onBillingCycleChange: (cycle: "monthly" | "annual") => void;
}

export function SubscriptionsPricingHero({
  billingCycle,
  onBillingCycleChange,
}: SubscriptionsPricingHeroProps) {
  return (
    <section className="text-center max-w-3xl mx-auto pt-6 pb-8 px-4 relative z-10">
      {/* Top Pill Tag */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#faf5eb] dark:bg-[#251f17] border border-[#eeddbb] dark:border-[#4d3a1f] text-[#c29547] dark:text-[#d4a759] text-xs font-bold shadow-2xs mb-5">
        <Sparkles className="w-3.5 h-3.5 text-[#c29547] dark:text-[#d4a759]" />
        <span>باقات واشتراكات المحامين ومكاتب المحاماة</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1c1917] dark:text-[#f5f4f0] tracking-tight leading-tight mb-4">
        ابدأ مجاناً، وبدون أي تكاليف خفية
      </h1>

      {/* Subtitle Paragraph */}
      <p className="text-sm sm:text-base text-[#6f675c] dark:text-[#a8a195] leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
        خطط تسعير واضحة ومرنة صُممت خصيصاً لتلائم احتياجات المحامي المستقل، مكاتب المحاماة الصاعدة، والشركات القانونية الكبرى مع حرية الترقية أو الإلغاء في أي وقت.
      </p>

      {/* Segmented Monthly / Annual Billing Switch Pill */}
      <div className="inline-flex items-center p-1.5 rounded-2xl bg-[#f2ede4] dark:bg-[#201c18] border border-[#ded5c6] dark:border-[#383126] shadow-inner gap-1">
        <button
          type="button"
          onClick={() => onBillingCycleChange("monthly")}
          className={cn(
            "px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
            billingCycle === "monthly"
              ? "bg-white dark:bg-[#2c241a] text-[#1c1917] dark:text-[#f5f4f0] shadow-sm border border-[#ded5c6]/60 dark:border-[#4d3a1f]"
              : "text-[#7a7164] dark:text-[#9e968a] hover:text-[#1c1917] dark:hover:text-[#f5f4f0]"
          )}
        >
          الدفع الشهري
        </button>

        <button
          type="button"
          onClick={() => onBillingCycleChange("annual")}
          className={cn(
            "flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
            billingCycle === "annual"
              ? "bg-[#1c1917] text-white dark:bg-[#c29547] dark:text-[#171513] shadow-sm"
              : "text-[#7a7164] dark:text-[#9e968a] hover:text-[#1c1917] dark:hover:text-[#f5f4f0]"
          )}
        >
          <span>الاشتراك السنوي</span>
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide",
              billingCycle === "annual"
                ? "bg-[#c29547] text-white dark:bg-[#1c1917] dark:text-[#f5f4f0]"
                : "bg-[#e5dbc9] dark:bg-[#342b20] text-[#7a5a22] dark:text-[#d4a759]"
            )}
          >
            خصم 20%
          </span>
        </button>
      </div>

      <p className="text-[11px] text-[#8c8279] dark:text-[#80786e] mt-2.5 font-medium">
        وفر شهرين كاملين سنوياً مع خطة الدفع السنوي
      </p>
    </section>
  );
}
