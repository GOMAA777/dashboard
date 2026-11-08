"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useUIStore } from "@/stores/use-ui-store";
import { translations } from "@/lib/i18n";
import { Scale, ShieldCheck } from "lucide-react";

export function AuthSideVisual() {
  const { language } = useUIStore();
  const t = translations[language].auth;

  return (
    <div className="relative w-full h-full bg-[#151311] text-white p-8 md:p-12 flex flex-col justify-between overflow-hidden select-none">
      {/* Background Decorative Concentric Radar Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[600px] h-[600px] flex items-center justify-center">
        <div className="w-[520px] h-[520px] rounded-full border border-[#c29547]/10" />
        <div className="absolute w-[400px] h-[400px] rounded-full border border-[#c29547]/15" />
        <div className="absolute w-[280px] h-[280px] rounded-full border border-[#c29547]/20" />
        <div className="absolute w-[160px] h-[160px] rounded-full bg-[#c29547]/5 blur-2xl" />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={language}
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full h-full flex flex-col justify-between"
        >
          {/* Top: Small Tagline */}
          <div className="text-start">
        <p className="text-xs text-[#a8a195] font-medium tracking-wide max-w-xs leading-relaxed opacity-90">
          {t.leftTagline}
        </p>
      </div>

      {/* Middle: Prominent Heading & Subheading */}
      <div className="relative z-10 text-start my-auto py-6">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-[#fcfbfa] tracking-tight leading-[1.15] max-w-sm">
          {t.leftHeading}
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-[#8c8279] max-w-xs leading-relaxed">
          {t.leftSubheading}
        </p>
      </div>

      {/* Center-Bottom: Realistic 3D Angled Smartphone Mockup with Legal Cases UI */}
      <div className="relative z-10 flex items-center justify-center mt-2 pb-6">
        <div className="w-[240px] sm:w-[260px] bg-[#1a1816] rounded-[38px] border-[5px] border-[#38332c] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_rgba(194,149,71,0.1)] p-3 text-start transform -rotate-3 hover:rotate-0 transition-transform duration-500">
          {/* Dynamic Island / Notch */}
          <div className="w-20 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-end px-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38332c]" />
          </div>

          {/* Screen Inner Card */}
          <div className="bg-[#23201d] rounded-[26px] p-3 border border-[#3f382e] text-xs">
            {/* Header info */}
            <div className="flex items-center justify-between text-[10px] text-[#a8a195] mb-1">
              <span>{language === "ar" ? "قضايا هذا الأسبوع" : "Weekly Hearings"}</span>
              <Scale className="w-3.5 h-3.5 text-[#c29547]" />
            </div>

            {/* Main Metric */}
            <div className="text-xl font-black text-white tracking-tight mb-2 flex items-baseline gap-1.5">
              <span>{language === "ar" ? "١٢٤ قضية" : "124 Cases"}</span>
              <span className="text-[10px] font-semibold text-[#c29547]">
                {language === "ar" ? "قيد التداول" : "Active"}
              </span>
            </div>

            {/* Mini Bar Chart inside phone */}
            <div className="h-14 flex items-end justify-between gap-1 pt-2 pb-1 border-b border-[#38332c]">
              {[35, 55, 45, 90, 70, 40, 60].map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-sm transition-all ${
                    i === 3
                      ? "bg-gradient-to-t from-[#c29547] to-[#d4a759] shadow-[0_0_8px_rgba(194,149,71,0.6)]"
                      : "bg-[#38332c]"
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 gap-1.5 mt-2.5">
              <div className="bg-[#1a1816] p-2 rounded-xl border border-[#38332c]">
                <span className="text-[9px] text-[#8c8279] block">
                  {language === "ar" ? "الجلسات القادمة" : "Hearings"}
                </span>
                <span className="text-[11px] font-bold text-white block mt-0.5">
                  {language === "ar" ? "١٤ جلسة" : "14 Sessions"}
                </span>
              </div>
              <div className="bg-[#1a1816] p-2 rounded-xl border border-[#38332c]">
                <span className="text-[9px] text-[#8c8279] block">
                  {language === "ar" ? "نظام المحاماة" : "Legal Suite"}
                </span>
                <span className="text-[11px] font-bold text-[#c29547] block mt-0.5">
                  {language === "ar" ? "ساري ونشط" : "Active"}
                </span>
              </div>
            </div>
          </div>

          {/* Phone Bottom Dock / Glowing Circle */}
          <div className="flex items-center justify-center pt-2.5">
            <div className="w-7 h-7 rounded-full border border-[#c29547]/50 flex items-center justify-center shadow-[0_0_12px_rgba(194,149,71,0.3)]">
              <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#c29547] to-[#d4a759]" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Subtle Security Badge */}
      <div className="relative z-10 flex items-center justify-start gap-2 text-[11px] text-[#8c8279] pt-2">
        <ShieldCheck className="w-3.5 h-3.5 text-[#c29547]" />
        <span>
          {language === "ar"
            ? "سرية تامة وتشفير شامل لبيانات القضايا وأسرار الموكلين"
            : "End-to-end encrypted legal case records & client privacy"}
        </span>
      </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
