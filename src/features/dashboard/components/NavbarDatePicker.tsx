"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronDown,
  Check,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarDatePickerProps {
  language?: "ar" | "en";
  className?: string;
}

export function NavbarDatePicker({
  language = "ar",
  className,
}: NavbarDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isEn = language === "en";

  // System reference date & time
  const dateStr = isEn ? "Thursday, 24 October 2024" : "الخميس، 24 أكتوبر 2024 م";
  const hijriStr = isEn ? "21 Rabi' Al-Thani 1446 AH" : "21 ربيع الثاني 1446 هـ";
  const timeStr = isEn ? "10:45 AM" : "10:45 ص";
  const timezoneStr = isEn ? "Makkah (GMT+3)" : "توقيت مكة (GMT+3)";

  // Close on click outside or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      className={cn("relative inline-block font-['Cairo',sans-serif]", className)}
      ref={containerRef}
    >
      {/* 1. Date Trigger Button on Navbar */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        title={isEn ? "View Date & Time" : "عرض التاريخ والوقت"}
        className={cn(
          "h-[36px] px-3 rounded-[6px] bg-[#f5f3ef] dark:bg-[#251b14] hover:bg-[#eae8e4] dark:hover:bg-[#2e2118] text-[#1b1c1a] dark:text-[#fdfbf7] border border-[#eae8e4] dark:border-[#38271c] text-[12px] font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-2xs select-none",
          isOpen && "ring-1 ring-[#9c6402] border-[#9c6402] bg-[#f0ede6] dark:bg-[#2e2118]"
        )}
      >
        <CalendarIcon className="size-[15px] text-[#9c6402] dark:text-[#f59e0b] shrink-0" />

        <div className="flex items-center gap-1.5">
          <span className="font-medium text-[#1b1c1a] dark:text-[#fdfbf7]">
            {isEn ? "Thu, 24 Oct 2024" : "الخميس، 24 أكتوبر 2024"}
          </span>
          <span className="text-[#837565] dark:text-[#a89f91] hidden sm:inline">•</span>
          <span className="text-[#837565] dark:text-[#a89f91] font-mono text-[11px] hidden sm:inline" dir="ltr">
            {timeStr}
          </span>
        </div>

        <ChevronDown
          className={cn(
            "size-3 text-[#837565] dark:text-[#a89f91] transition-transform duration-200 ms-0.5",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* 2. Compact, Sleek Date & Time Dropdown */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={isEn ? "Date and Time Details" : "تفاصيل التاريخ والوقت"}
          className="absolute top-full mt-1.5 end-0 z-50 w-[270px] bg-white dark:bg-[#1c140f] border border-[#eae8e4] dark:border-[#2c221c] rounded-[10px] shadow-xl p-3.5 space-y-3 text-start font-['Cairo',sans-serif] animate-in fade-in zoom-in-95 select-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#f0ede8] dark:border-[#2c221c]">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              <CalendarIcon className="size-3.5 text-[#9c6402] dark:text-[#f59e0b]" />
              <span>{isEn ? "Date & Time" : "التاريخ والوقت"}</span>
            </div>
            <span className="text-[10px] font-semibold text-[#837565] dark:text-[#a89f91] bg-[#f5f3ef] dark:bg-[#251b14] px-1.5 py-0.5 rounded-[4px] border border-[#eae8e4] dark:border-[#38271c]">
              {timezoneStr}
            </span>
          </div>

          {/* Clean Content Cards */}
          <div className="bg-[#fbfaf8] dark:bg-[#251b14] p-2.5 rounded-[8px] border border-[#f0ede8] dark:border-[#38271c] space-y-2">
            {/* Gregorian Date */}
            <div className="flex items-center gap-2.5">
              <div className="size-7 rounded-[6px] bg-[#9c6402]/10 dark:bg-[#9c6402]/20 flex items-center justify-center shrink-0">
                <CalendarIcon className="size-3.5 text-[#9c6402] dark:text-[#f59e0b]" />
              </div>
              <div className="flex flex-col text-start min-w-0">
                <span className="text-[10px] font-medium text-[#837565] dark:text-[#a89f91] leading-tight">
                  {isEn ? "Gregorian Date" : "التاريخ الميلادي"}
                </span>
                <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] truncate">
                  {dateStr}
                </span>
              </div>
            </div>

            {/* Hijri Date */}
            <div className="flex items-center gap-2.5 pt-1.5 border-t border-[#ede8e1]/60 dark:border-[#38271c]/60">
              <div className="size-7 rounded-[6px] bg-[#9c6402]/10 dark:bg-[#9c6402]/20 flex items-center justify-center shrink-0">
                <Moon className="size-3.5 text-[#9c6402] dark:text-[#f59e0b]" />
              </div>
              <div className="flex flex-col text-start min-w-0">
                <span className="text-[10px] font-medium text-[#837565] dark:text-[#a89f91] leading-tight">
                  {isEn ? "Hijri Date" : "التاريخ الهجري"}
                </span>
                <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] truncate">
                  {hijriStr}
                </span>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2.5 pt-1.5 border-t border-[#ede8e1]/60 dark:border-[#38271c]/60">
              <div className="size-7 rounded-[6px] bg-[#9c6402]/10 dark:bg-[#9c6402]/20 flex items-center justify-center shrink-0">
                <Clock className="size-3.5 text-[#9c6402] dark:text-[#f59e0b]" />
              </div>
              <div className="flex flex-col text-start min-w-0">
                <span className="text-[10px] font-medium text-[#837565] dark:text-[#a89f91] leading-tight">
                  {isEn ? "Current Time" : "الوقت الحالي"}
                </span>
                <span className="text-[12px] font-bold font-mono text-[#1b1c1a] dark:text-[#fdfbf7]" dir="ltr">
                  {timeStr}
                </span>
              </div>
            </div>
          </div>

          {/* Simple Confirmation Button: "موافق" */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full h-[32px] rounded-[6px] bg-[#9c6402] hover:bg-[#855401] active:bg-[#744501] text-white text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Check className="size-3.5" />
            <span>{isEn ? "OK" : "موافق"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
