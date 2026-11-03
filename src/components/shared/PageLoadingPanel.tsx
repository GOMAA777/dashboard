"use client";

import React, { useEffect, useState } from "react";
import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageLoadingPanelProps {
  title?: string;
  statusText?: string;
  className?: string;
}

/**
 * Unified in-page loading panel — same look & placement under the navbar
 * across the whole dashboard (warm brown / gold clients palette).
 */
export function PageLoadingPanel({
  title = "جاري التحميل",
  statusText = "نجهّز مساحة العمل والبيانات...",
  className,
}: PageLoadingPanelProps) {
  const [progress, setProgress] = useState(18);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return 92;
        const next = prev + Math.floor(Math.random() * 10) + 3;
        return next > 92 ? 92 : next;
      });
    }, 380);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={title}
      className={cn(
        "w-full min-h-[min(62vh,560px)] flex items-center justify-center select-none animate-in fade-in duration-300",
        className
      )}
    >
      <div className="relative w-full max-w-[420px] mx-auto">
        {/* Soft ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-[#c29547]/10 dark:bg-[#e29d38]/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative bg-white dark:bg-[#221812] border border-[#eae8e4] dark:border-[#38271c] rounded-[16px] shadow-[0px_8px_28px_rgba(0,0,0,0.06)] dark:shadow-[0px_12px_36px_rgba(0,0,0,0.35)] px-8 py-10 flex flex-col items-center text-center overflow-hidden">
          {/* Top gold accent line */}
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-l from-transparent via-[#c29547] dark:via-[#e29d38] to-transparent opacity-80" />

          {/* Orbital spinner */}
          <div className="relative w-[120px] h-[120px] flex items-center justify-center mb-5">
            <div
              className="absolute inset-0 rounded-full border border-dashed border-[#c29547]/35 dark:border-[#e29d38]/35 animate-spin"
              style={{ animationDuration: "14s" }}
            />
            <div className="absolute inset-2 rounded-full border border-[#c29547]/15 dark:border-[#e29d38]/20" />
            <div className="absolute inset-1.5 animate-spin" style={{ animationDuration: "2.8s" }}>
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 size-[10px] rounded-full bg-gradient-to-tr from-[#c29547] to-[#e8bf72] dark:from-[#e29d38] dark:to-[#f3c27e] shadow-[0_0_10px_rgba(226,157,56,0.7)] border border-white dark:border-[#221812]" />
            </div>
            <svg
              className="absolute inset-3.5 w-[92px] h-[92px] animate-spin"
              style={{ animationDuration: "3.6s", animationDirection: "reverse" }}
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#e29d38"
                strokeWidth="2.2"
                strokeDasharray="36 180"
                strokeLinecap="round"
                className="opacity-70"
              />
            </svg>
            <div className="relative z-10 size-[68px] rounded-full bg-[#faf5eb] dark:bg-[#2d1f16] border border-[#eeddbb] dark:border-[#4d3627] flex items-center justify-center shadow-[0_6px_18px_-4px_rgba(194,149,71,0.28)]">
              <Scale className="size-[30px] text-[#9c6402] dark:text-[#e29d38]" />
            </div>
          </div>

          <h2 className="text-[18px] font-extrabold text-[#1b1c1a] dark:text-[#fdfbf7] tracking-tight">
            {title}
          </h2>
          <p className="text-[12px] font-medium text-[#837565] dark:text-[#a89f91] mt-1.5">
            منصة الجودي
          </p>

          {/* Dots */}
          <div className="mt-4 mb-5 px-3 py-1 rounded-full bg-[#f5f3ef] dark:bg-[#281c15] border border-[#eae8e4] dark:border-[#38271c] inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-[#c29547] dark:bg-[#e29d38] animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="size-1.5 rounded-full bg-[#c29547] dark:bg-[#e29d38] animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="size-1.5 rounded-full bg-[#c29547] dark:bg-[#e29d38] animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>

          {/* Progress */}
          <div className="w-full max-w-[260px] h-[6px] bg-[#f0eeea] dark:bg-[#1a120d] rounded-full overflow-hidden border border-[#eae8e4]/60 dark:border-[#38271c]">
            <div
              className="h-full rounded-full bg-gradient-to-l from-[#d4a759] via-[#c29547] to-[#9c6402] dark:from-[#f3c27e] dark:via-[#e29d38] dark:to-[#c29547] transition-all duration-300 shadow-[0_0_10px_rgba(226,157,56,0.35)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center gap-2 mt-3.5 text-[12px] text-[#837565] dark:text-[#a89f91] font-medium">
            <span className="size-1.5 rounded-full bg-[#c29547] dark:bg-[#e29d38] animate-pulse" />
            <span>{statusText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
