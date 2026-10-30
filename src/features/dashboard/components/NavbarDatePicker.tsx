"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Check,
  RotateCcw,
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

  // Selected date state (defaults to 24 October 2024 to match system mockup snapshot)
  const [selectedDay, setSelectedDay] = useState(24);
  const [selectedMonth, setSelectedMonth] = useState(9); // 0-indexed: 9 = October
  const [selectedYear, setSelectedYear] = useState(2024);

  // Time state
  const [selectedHour, setSelectedHour] = useState("10");
  const [selectedMinute, setSelectedMinute] = useState("45");
  const [selectedPeriod, setSelectedPeriod] = useState<"ص" | "م">("ص");

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

  const monthNamesAr = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const monthNamesEn = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeekAr = ["أحد", "إثن", "ثلث", "أربع", "خمس", "جمع", "سبت"];
  const daysOfWeekEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysOfWeek = language === "en" ? daysOfWeekEn : daysOfWeekAr;

  // Quick time presets
  const timePresets = [
    { label: "09:00 ص", h: "09", m: "00", p: "ص" as const },
    { label: "10:45 ص", h: "10", m: "45", p: "ص" as const },
    { label: "01:30 م", h: "01", m: "30", p: "م" as const },
    { label: "04:00 م", h: "04", m: "00", p: "م" as const },
    { label: "06:30 م", h: "06", m: "30", p: "م" as const },
  ];

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    setSelectedDay(24);
    setSelectedMonth(9);
    setSelectedYear(2024);
    setSelectedHour("10");
    setSelectedMinute("45");
    setSelectedPeriod("ص");
  };

  // Calendar days count in selected month
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayIndex = new Date(selectedYear, selectedMonth, 1).getDay();

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
        title="عرض تفاصيل التاريخ والوقت"
        className={cn(
          "h-[36px] px-3 rounded-[6px] bg-[#f5f3ef] dark:bg-[#251b14] hover:bg-[#eae8e4] dark:hover:bg-[#2e2118] text-[#1b1c1a] dark:text-[#fdfbf7] border border-[#eae8e4] dark:border-[#38271c] text-[12px] font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-2xs select-none",
          isOpen && "ring-1 ring-[#9c6402] border-[#9c6402] bg-[#f0ede6] dark:bg-[#2e2118]"
        )}
      >
        <CalendarIcon className="size-[15px] text-[#9c6402] dark:text-[#f59e0b] shrink-0" />

        <div className="flex items-center gap-1.5">
          <span className="font-medium text-[#1b1c1a] dark:text-[#fdfbf7]">
            {language === "en"
              ? `Thu, ${selectedDay} ${monthNamesEn[selectedMonth]} ${selectedYear}`
              : `الخميس، ${selectedDay} ${monthNamesAr[selectedMonth]} ${selectedYear}`}
          </span>
          <span className="text-[#837565] dark:text-[#a89f91] hidden sm:inline">•</span>
          <span className="text-[#837565] dark:text-[#a89f91] font-mono text-[11px] hidden sm:inline" dir="ltr">
            {selectedHour}:{selectedMinute} {selectedPeriod}
          </span>
        </div>

        <ChevronDown
          className={cn(
            "size-3 text-[#837565] dark:text-[#a89f91] transition-transform duration-200 ms-0.5",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* 2. Rich Date & Time Picker Dropdown */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="منتقي التاريخ والوقت"
          className="absolute top-full mt-2 end-0 z-50 w-[340px] sm:w-[380px] bg-white dark:bg-[#1c140f] border border-[#eae8e4] dark:border-[#2c221c] rounded-[12px] shadow-2xl p-4 space-y-4 text-start font-['Cairo',sans-serif] animate-in fade-in zoom-in-95 select-none"
        >
          {/* Header Card: Full Date Details (Gregorian + Hijri + Live Clock) */}
          <div className="bg-[#faf8f5] dark:bg-[#251b14] p-3.5 rounded-[8px] border border-[#ede8e1] dark:border-[#38271c] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] uppercase tracking-wider">
                التاريخ والوقت الرسمي للمنصة
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#065f46] dark:text-[#6ee7b7] bg-[#ecfdf5] dark:bg-[#132c21] px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/40">
                <span className="size-1.5 rounded-full bg-[#10b981] animate-pulse" />
                <span>توقيت مكة المكرمة (GMT+3)</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[15px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-2">
                <CalendarIcon className="size-4 text-[#9c6402] dark:text-[#f59e0b]" />
                <span>الخميس، {selectedDay} {monthNamesAr[selectedMonth]} {selectedYear} م</span>
              </div>
              <div className="text-[12px] font-semibold text-[#837565] dark:text-[#a89f91] ps-6">
                الموافق: 21 ربيع الثاني 1446 هـ
              </div>
            </div>
          </div>

          {/* Month / Year Navigator */}
          <div className="flex items-center justify-between px-1">
            <div className="text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {monthNamesAr[selectedMonth]} {selectedYear}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                title="الشهر السابق"
                className="size-7 rounded-[4px] bg-[#f5f3ef] dark:bg-[#251b14] hover:bg-[#eae8e4] text-[#514537] dark:text-[#cdc5bd] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="size-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                title="الشهر التالي"
                className="size-7 rounded-[4px] bg-[#f5f3ef] dark:bg-[#251b14] hover:bg-[#eae8e4] text-[#514537] dark:text-[#cdc5bd] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="size-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="space-y-1">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {daysOfWeek.map((d, i) => (
                <div
                  key={i}
                  className="text-[11px] font-bold text-[#837565] dark:text-[#a89f91] py-1"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-[12px]">
              {/* Empty leading days */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="size-8" />
              ))}

              {/* Day numbers */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const isSelected = dayNum === selectedDay;
                const isToday = dayNum === 24 && selectedMonth === 9;

                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => setSelectedDay(dayNum)}
                    className={cn(
                      "size-8 rounded-[6px] font-semibold flex items-center justify-center transition-all cursor-pointer mx-auto",
                      isSelected
                        ? "bg-[#9c6402] text-white font-bold shadow-xs scale-105"
                        : isToday
                        ? "bg-[#fff6e8] dark:bg-[#38271c] text-[#9c6402] dark:text-[#f59e0b] font-bold border border-[#ffddb6]"
                        : "text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#251b14]"
                    )}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Picker Section */}
          <div className="border-t border-[#eae8e4] dark:border-[#2c221c] pt-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1.5">
                <Clock className="size-3.5 text-[#9c6402] dark:text-[#f59e0b]" />
                <span>ضبط واختيار الوقت (Time Picker)</span>
              </span>
              <span className="text-[11px] font-mono text-[#837565] dark:text-[#a89f91]" dir="ltr">
                {selectedHour}:{selectedMinute} {selectedPeriod}
              </span>
            </div>

            {/* Time input selectors */}
            <div className="flex items-center justify-center gap-2 bg-[#f5f3ef] dark:bg-[#251b14] p-2 rounded-[8px] border border-[#eae8e4] dark:border-[#38271c]">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <label className="text-[9px] text-[#837565] font-bold">ساعة</label>
                <select
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(e.target.value)}
                  className="bg-white dark:bg-[#1c140f] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-mono font-bold px-2 py-1 rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] focus:outline-none cursor-pointer"
                >
                  {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-lg font-bold text-[#837565] mt-3">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <label className="text-[9px] text-[#837565] font-bold">دقيقة</label>
                <select
                  value={selectedMinute}
                  onChange={(e) => setSelectedMinute(e.target.value)}
                  className="bg-white dark:bg-[#1c140f] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-mono font-bold px-2 py-1 rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] focus:outline-none cursor-pointer"
                >
                  {["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* AM / PM */}
              <div className="flex flex-col items-center">
                <label className="text-[9px] text-[#837565] font-bold">الفترة</label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setSelectedPeriod("ص")}
                    className={cn(
                      "px-2 py-1 rounded-[4px] text-[11px] font-bold cursor-pointer transition-colors",
                      selectedPeriod === "ص"
                        ? "bg-[#9c6402] text-white shadow-2xs"
                        : "bg-white dark:bg-[#1c140f] text-[#514537] hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    ص
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPeriod("م")}
                    className={cn(
                      "px-2 py-1 rounded-[4px] text-[11px] font-bold cursor-pointer transition-colors",
                      selectedPeriod === "م"
                        ? "bg-[#9c6402] text-white shadow-2xs"
                        : "bg-white dark:bg-[#1c140f] text-[#514537] hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    م
                  </button>
                </div>
              </div>
            </div>

            {/* Quick time chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-[#837565] font-semibold">أوقات شائعة:</span>
              {timePresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedHour(preset.h);
                    setSelectedMinute(preset.m);
                    setSelectedPeriod(preset.p);
                  }}
                  className="px-2 py-0.5 rounded-[4px] bg-[#f5f3ef] dark:bg-[#251b14] hover:bg-[#eae8e4] text-[#514537] dark:text-[#cdc5bd] text-[10px] font-mono font-semibold transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-[#eae8e4] dark:border-[#2c221c] pt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={handleJumpToToday}
              className="text-[12px] font-bold text-[#9c6402] dark:text-[#f59e0b] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="size-3" />
              <span>العودة لليوم الحالي</span>
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="h-[30px] px-3.5 rounded-[6px] bg-[#9c6402] hover:bg-[#855401] text-white text-[12px] font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
            >
              <Check className="size-3.5" />
              <span>تأكيد الإغلاق</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
