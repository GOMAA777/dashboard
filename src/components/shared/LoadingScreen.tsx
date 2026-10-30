"use client";

import React, { useState, useEffect } from "react";
import { Scale } from "lucide-react";

interface LoadingScreenProps {
  statusText?: string;
  progressPercent?: number;
}

export function LoadingScreen({
  statusText = "توثيق مساحة العمل والبيانات...",
  progressPercent,
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(progressPercent ?? 15);

  // Smooth simulated progress bar if not provided externally
  useEffect(() => {
    if (progressPercent !== undefined) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90;
        const next = prev + Math.floor(Math.random() * 12) + 4;
        return next > 90 ? 90 : next;
      });
    }, 350);

    return () => clearInterval(interval);
  }, [progressPercent]);

  const currentProgress = progressPercent !== undefined ? progressPercent : progress;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fcfbfa] dark:bg-[#121110] text-[#1c1917] dark:text-[#f5f4f0] select-none overflow-hidden">
      {/* Background Subtle Grid & Ambient Gold Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(#ded5c6_1px,transparent_1px)] dark:bg-[radial-gradient(#2f2a24_1px,transparent_1px)] [background-size:28px_28px] opacity-60 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-[#c29547]/8 dark:bg-[#d4a759]/6 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Center Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm px-4">
        {/* Animated Orbital Spinner with Central Brand Logo */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-4">
          {/* Outer Dashed Orbit Ring */}
          <div className="absolute inset-0 rounded-full border border-dashed border-[#c29547]/30 dark:border-[#d4a759]/30 animate-spin" style={{ animationDuration: "14s" }} />

          {/* Middle Smooth Revolving Orbit Ring with Glowing Satellite Dot */}
          <div className="absolute inset-2 rounded-full border border-[#c29547]/20 dark:border-[#d4a759]/20" />
          
          <div className="absolute inset-1.5 animate-spin" style={{ animationDuration: "3s" }}>
            {/* The Revolving Satellite Dot */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-tr from-[#c29547] to-[#e8bf72] shadow-[0_0_10px_rgba(194,149,71,0.8)] border border-white dark:border-[#121110]" />
          </div>

          {/* Counter-rotating Inner Arc */}
          <svg className="absolute inset-4 w-28 h-28 animate-spin" style={{ animationDuration: "4s", animationDirection: "reverse" }} viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#c29547"
              strokeWidth="2"
              strokeDasharray="40 180"
              strokeLinecap="round"
              className="opacity-60 dark:opacity-80"
            />
          </svg>

          {/* Central Logo Badge */}
          <div className="relative z-10 w-20 h-20 rounded-full bg-[#faf5eb] dark:bg-[#201c17] border border-[#eeddbb] dark:border-[#382b18] p-3 flex items-center justify-center shadow-[0_8px_24px_-4px_rgba(194,149,71,0.25)] hover:scale-105 transition-transform duration-300">
            <Scale className="w-10 h-10 text-[#c29547] dark:text-[#d4a759]" />
          </div>
        </div>

        {/* Brand Name & Description */}
        <h2 className="text-xl font-extrabold text-[#c29547] dark:text-[#d4a759] tracking-tight">
          الجودي
        </h2>
        <p className="text-[11px] font-medium text-[#7c7366] dark:text-[#9e968a] mt-1">
          منصة إدارة حملات ومحادثات واتساب
        </p>

        {/* Animated 3-Dots Status Pill */}
        <div className="my-4.5 px-3 py-1 rounded-full bg-[#faf5eb] dark:bg-[#201c17] border border-[#eeddbb] dark:border-[#382b18] shadow-2xs inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c29547] animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#c29547] animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#c29547] animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>

        {/* Progress Bar Container */}
        <div className="w-64 sm:w-72 h-1.5 bg-[#eeddbb]/50 dark:bg-[#2c261e] rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#d4a759] via-[#c29547] to-[#a8782a] rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(194,149,71,0.5)]"
            style={{ width: `${currentProgress}%` }}
          />
        </div>

        {/* Status Text with Pulsing Indicator */}
        <div className="flex items-center gap-2 mt-3 text-xs text-[#7c7366] dark:text-[#9e968a] font-medium">
          <span className="w-2 h-2 rounded-full bg-[#c29547] dark:bg-[#d4a759] animate-pulse" />
          <span>{statusText}</span>
        </div>
      </div>
    </div>
  );
}
