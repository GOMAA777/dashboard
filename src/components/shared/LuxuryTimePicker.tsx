"use client";

import React, { useState } from "react";
import {
  Clock,
  ChevronUp,
  ChevronDown,
  Check,
  RotateCcw,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

export interface CustomTimeValue {
  hour: string; // "01" - "12"
  minute: string; // "00" - "59"
  period: "AM" | "PM";
  formattedText?: string;
}

interface LuxuryTimePickerProps {
  value: CustomTimeValue;
  onChange: (newValue: CustomTimeValue) => void;
  className?: string;
  onApply?: () => void;
  showPresets?: boolean;
}

export function formatCustomTime(val: CustomTimeValue, isEn = false): string {
  const h = (val.hour || "12").padStart(2, "0");
  const m = (val.minute || "00").padStart(2, "0");
  const periodLabel =
    val.period === "AM"
      ? isEn
        ? "AM"
        : "ص"
      : isEn
      ? "PM"
      : "م";
  return `${h}:${m} ${periodLabel}`;
}

export function getDefaultTimeFromNow(addHours = 2): CustomTimeValue {
  const d = new Date();
  d.setHours(d.getHours() + addHours);
  let h = d.getHours();
  const period: "AM" | "PM" = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  const m = Math.floor(d.getMinutes() / 5) * 5;
  return {
    hour: String(h).padStart(2, "0"),
    minute: String(m).padStart(2, "0"),
    period,
  };
}

export function LuxuryTimePicker({
  value,
  onChange,
  className,
  onApply,
  showPresets = true,
}: LuxuryTimePickerProps) {
  const { isEn } = useLanguage();
  const currentHour = value.hour || "04";
  const currentMinute = value.minute || "00";
  const currentPeriod: "AM" | "PM" = value.period || "PM";
  const [activeTab, setActiveTab] = useState<"stepper" | "grid">("stepper");

  const emitChange = (h: string, m: string, p: "AM" | "PM") => {
    const formattedHour = h.padStart(2, "0");
    const formattedMinute = m.padStart(2, "0");
    const formattedText = formatCustomTime(
      { hour: formattedHour, minute: formattedMinute, period: p },
      isEn
    );
    onChange({
      hour: formattedHour,
      minute: formattedMinute,
      period: p,
      formattedText,
    });
  };

  const handleHourStep = (delta: number) => {
    let num = parseInt(currentHour, 10) || 12;
    num += delta;
    if (num > 12) num = 1;
    if (num < 1) num = 12;
    const str = String(num).padStart(2, "0");
    emitChange(str, currentMinute, currentPeriod);
  };

  const handleMinuteStep = (delta: number) => {
    let num = parseInt(currentMinute, 10) || 0;
    num += delta;
    if (num >= 60) num = 0;
    if (num < 0) num = 55;
    const str = String(num).padStart(2, "0");
    emitChange(currentHour, str, currentPeriod);
  };

  const handleHourInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "").slice(-2);
    let num = parseInt(raw, 10);
    if (isNaN(num)) num = 1;
    if (num > 12) num = 12;
    if (num === 0) num = 1;
    const str = String(num).padStart(2, "0");
    emitChange(str, currentMinute, currentPeriod);
  };

  const handleMinuteInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "").slice(-2);
    let num = parseInt(raw, 10);
    if (isNaN(num)) num = 0;
    if (num >= 60) num = 59;
    const str = String(num).padStart(2, "0");
    emitChange(currentHour, str, currentPeriod);
  };

  const togglePeriod = (p: "AM" | "PM") => {
    emitChange(currentHour, currentMinute, p);
  };

  const applyPreset = (
    addHours: number,
    fixedPeriod?: "AM" | "PM",
    fixedHour?: string,
    fixedMinute?: string
  ) => {
    if (fixedHour && fixedMinute && fixedPeriod) {
      emitChange(fixedHour, fixedMinute, fixedPeriod);
      return;
    }
    const preset = getDefaultTimeFromNow(addHours);
    emitChange(preset.hour, preset.minute, preset.period);
  };

  const resetToCurrent = () => {
    const preset = getDefaultTimeFromNow(0);
    emitChange(preset.hour, preset.minute, preset.period);
  };

  const formattedDisplay = formatCustomTime(
    {
      hour: currentHour,
      minute: currentMinute,
      period: currentPeriod,
    },
    isEn
  );

  const hoursList = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const minutesList = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

  return (
    <div
      className={cn(
        "rounded-[8px] border border-[#9c6402]/30 dark:border-[#e29d38]/40 bg-[#fbf9f6] dark:bg-[#1a120d] p-[16px] sm:p-[20px] shadow-[0px_4px_12px_rgba(156,100,2,0.08)] flex flex-col gap-[16px] transition-all animate-in fade-in slide-in-from-top-1 duration-200",
        className
      )}
    >
      {/* Header bar: Title & formatted badge */}
      <div className="flex items-center justify-between border-b border-[#eae8e4] dark:border-[#38271c] pb-[12px]">
        <div className="flex items-center gap-[8px]">
          <div className="size-[28px] rounded-[6px] bg-[#9c6402]/10 dark:bg-[#e29d38]/20 text-[#9c6402] dark:text-[#f3c27e] flex items-center justify-center">
            <Clock className="size-[15px]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {isEn ? "Custom Response Time Picker" : "محدد وقت الاستجابة المخصص"}
            </span>
            <span className="text-[11px] text-[#837565] dark:text-[#a89f91]">
              {isEn
                ? "Specify expected resolution time or custom SLA"
                : "حدد الوقت الدقيق للاستجابة أو المهلة المطلوبة للتذكرة"}
            </span>
          </div>
        </div>

        {/* Formatted time pill */}
        <div className="flex items-center gap-[6px] px-[12px] py-[6px] rounded-[6px] bg-[#9c6402]/10 dark:bg-[#e29d38]/15 border border-[#9c6402]/30 dark:border-[#e29d38]/30 text-[#9c6402] dark:text-[#f3c27e] font-mono font-bold text-[13px]">
          <Sparkles className="size-[13px]" />
          <span dir="ltr">{formattedDisplay}</span>
        </div>
      </div>

      {/* Main Interactive Digital Clock Picker */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-[16px] bg-white dark:bg-[#221812] border border-[#eae8e4] dark:border-[#38271c] rounded-[8px] p-[16px]">
        {/* Digital Time Inputs (Hours : Minutes : Period) */}
        <div className="flex items-center justify-center gap-[10px] w-full sm:w-auto" dir="ltr">
          {/* Hours Box */}
          <div className="flex flex-col items-center gap-[4px]">
            <button
              type="button"
              onClick={() => handleHourStep(1)}
              aria-label="Increase hours"
              className="size-[28px] rounded-[4px] hover:bg-[#f5f3ef] dark:hover:bg-[#2e1d0f] text-[#837565] dark:text-[#a89f91] hover:text-[#9c6402] dark:hover:text-[#f3c27e] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronUp className="size-[16px]" />
            </button>
            <div className="relative">
              <input
                type="text"
                value={currentHour}
                onChange={handleHourInputChange}
                aria-label={isEn ? "Hours" : "الساعات"}
                className="w-[54px] h-[50px] text-center text-[22px] font-bold font-mono rounded-[6px] border border-[#eae8e4] dark:border-[#38271c] bg-[#faf9f6] dark:bg-[#160e0a] text-[#1b1c1a] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] shadow-inner"
              />
              <span className="text-[9px] font-medium text-[#837565] dark:text-[#8e8680] absolute -bottom-[16px] left-1/2 -translate-x-1/2">
                {isEn ? "HRS" : "ساعة"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleHourStep(-1)}
              aria-label="Decrease hours"
              className="size-[28px] rounded-[4px] hover:bg-[#f5f3ef] dark:hover:bg-[#2e1d0f] text-[#837565] dark:text-[#a89f91] hover:text-[#9c6402] dark:hover:text-[#f3c27e] flex items-center justify-center transition-colors cursor-pointer mt-3"
            >
              <ChevronDown className="size-[16px]" />
            </button>
          </div>

          {/* Colon Separator */}
          <span className="text-[26px] font-bold text-[#837565] dark:text-[#a89f91] mb-2 font-mono">
            :
          </span>

          {/* Minutes Box */}
          <div className="flex flex-col items-center gap-[4px]">
            <button
              type="button"
              onClick={() => handleMinuteStep(5)}
              aria-label="Increase minutes"
              className="size-[28px] rounded-[4px] hover:bg-[#f5f3ef] dark:hover:bg-[#2e1d0f] text-[#837565] dark:text-[#a89f91] hover:text-[#9c6402] dark:hover:text-[#f3c27e] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronUp className="size-[16px]" />
            </button>
            <div className="relative">
              <input
                type="text"
                value={currentMinute}
                onChange={handleMinuteInputChange}
                aria-label={isEn ? "Minutes" : "الدقائق"}
                className="w-[54px] h-[50px] text-center text-[22px] font-bold font-mono rounded-[6px] border border-[#eae8e4] dark:border-[#38271c] bg-[#faf9f6] dark:bg-[#160e0a] text-[#1b1c1a] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] shadow-inner"
              />
              <span className="text-[9px] font-medium text-[#837565] dark:text-[#8e8680] absolute -bottom-[16px] left-1/2 -translate-x-1/2">
                {isEn ? "MIN" : "دقيقة"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleMinuteStep(-5)}
              aria-label="Decrease minutes"
              className="size-[28px] rounded-[4px] hover:bg-[#f5f3ef] dark:hover:bg-[#2e1d0f] text-[#837565] dark:text-[#a89f91] hover:text-[#9c6402] dark:hover:text-[#f3c27e] flex items-center justify-center transition-colors cursor-pointer mt-3"
            >
              <ChevronDown className="size-[16px]" />
            </button>
          </div>

          {/* AM / PM Period Toggle */}
          <div className="flex flex-col gap-[6px] ms-2">
            <button
              type="button"
              onClick={() => togglePeriod("AM")}
              className={cn(
                "px-[12px] h-[34px] rounded-[4px] text-[12px] font-bold transition-all flex items-center gap-[4px] cursor-pointer",
                currentPeriod === "AM"
                  ? "bg-[#9c6402] text-white shadow-xs"
                  : "bg-[#f5f3ef] dark:bg-[#160e0a] text-[#837565] dark:text-[#a89f91] hover:bg-[#eae8e4] dark:hover:bg-[#2e1d0f]"
              )}
            >
              <Sun className="size-[12px]" />
              <span>{isEn ? "AM" : "صباحاً (ص)"}</span>
            </button>
            <button
              type="button"
              onClick={() => togglePeriod("PM")}
              className={cn(
                "px-[12px] h-[34px] rounded-[4px] text-[12px] font-bold transition-all flex items-center gap-[4px] cursor-pointer",
                currentPeriod === "PM"
                  ? "bg-[#9c6402] text-white shadow-xs"
                  : "bg-[#f5f3ef] dark:bg-[#160e0a] text-[#837565] dark:text-[#a89f91] hover:bg-[#eae8e4] dark:hover:bg-[#2e1d0f]"
              )}
            >
              <Moon className="size-[12px]" />
              <span>{isEn ? "PM" : "مساءً (م)"}</span>
            </button>
          </div>
        </div>

        {/* View mode toggle (Stepper vs Full Grid) */}
        <div className="flex items-center gap-[8px] shrink-0 border-t sm:border-t-0 sm:border-s border-[#eae8e4] dark:border-[#38271c] pt-3 sm:pt-0 sm:ps-4 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => setActiveTab((prev) => (prev === "stepper" ? "grid" : "stepper"))}
            className="px-[12px] py-[8px] rounded-[6px] border border-[#eae8e4] dark:border-[#38271c] hover:border-[#9c6402] dark:hover:border-[#e29d38] bg-[#faf9f6] dark:bg-[#160e0a] text-[11px] font-semibold text-[#514537] dark:text-[#cdc5bd] transition-colors cursor-pointer flex items-center gap-[6px]"
          >
            <Clock className="size-[13px] text-[#9c6402] dark:text-[#f3c27e]" />
            <span>
              {activeTab === "stepper"
                ? isEn
                  ? "Open Hours Grid"
                  : "شبكة اختيار الساعات"
                : isEn
                ? "Close Grid"
                : "إغلاق الشبكة"}
            </span>
          </button>

          <button
            type="button"
            onClick={resetToCurrent}
            title={isEn ? "Reset to current time" : "إعادة التعيين للوقت الحالي"}
            className="p-[8px] rounded-[6px] border border-[#eae8e4] dark:border-[#38271c] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] text-[#837565] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] transition-colors cursor-pointer"
          >
            <RotateCcw className="size-[14px]" />
          </button>
        </div>
      </div>

      {/* Optional Expanded Hours & Minutes Grid */}
      {activeTab === "grid" && (
        <div className="bg-white dark:bg-[#221812] border border-[#eae8e4] dark:border-[#38271c] rounded-[8px] p-[14px] flex flex-col gap-[12px] animate-in fade-in duration-150">
          {/* Hours row */}
          <div className="flex flex-col gap-[6px]">
            <span className="text-[11px] font-semibold text-[#837565] dark:text-[#a89f91]">
              {isEn ? "Select Hour:" : "اختر الساعة:"}
            </span>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-[6px]">
              {hoursList.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => {
                    emitChange(h, currentMinute, currentPeriod);
                  }}
                  className={cn(
                    "h-[32px] rounded-[4px] text-[12px] font-bold font-mono transition-all cursor-pointer",
                    currentHour === h
                      ? "bg-[#9c6402] text-white shadow-xs"
                      : "bg-[#faf9f6] dark:bg-[#160e0a] text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#2e1d0f] border border-[#eae8e4] dark:border-[#38271c]"
                  )}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* Minutes row */}
          <div className="flex flex-col gap-[6px]">
            <span className="text-[11px] font-semibold text-[#837565] dark:text-[#a89f91]">
              {isEn ? "Select Minutes (5-min intervals):" : "اختر الدقائق (مضاعفات 5 دقائق):"}
            </span>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-[6px]">
              {minutesList.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    emitChange(currentHour, m, currentPeriod);
                  }}
                  className={cn(
                    "h-[32px] rounded-[4px] text-[12px] font-bold font-mono transition-all cursor-pointer",
                    currentMinute === m
                      ? "bg-[#9c6402] text-white shadow-xs"
                      : "bg-[#faf9f6] dark:bg-[#160e0a] text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#2e1d0f] border border-[#eae8e4] dark:border-[#38271c]"
                  )}
                >
                  :{m}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Presets Section */}
      {showPresets && (
        <div className="flex flex-col gap-[8px]">
          <span className="text-[11px] font-semibold text-[#837565] dark:text-[#a89f91] flex items-center gap-[4px]">
            <Sparkles className="size-[12px] text-[#9c6402] dark:text-[#f3c27e]" />
            <span>{isEn ? "Quick Presets & Common Durations:" : "أوقات سريعة ومقترحة للاستجابة:"}</span>
          </span>
          <div className="flex flex-wrap gap-[6px]">
            <button
              type="button"
              onClick={() => applyPreset(1)}
              className="px-[10px] py-[5px] rounded-[4px] text-[11px] font-medium bg-white dark:bg-[#221812] border border-[#eae8e4] dark:border-[#38271c] hover:border-[#9c6402] dark:hover:border-[#e29d38] text-[#514537] dark:text-[#cdc5bd] transition-colors cursor-pointer"
            >
              {isEn ? "Within 1 Hour" : "خلال ساعة واحدة"}
            </button>
            <button
              type="button"
              onClick={() => applyPreset(2)}
              className="px-[10px] py-[5px] rounded-[4px] text-[11px] font-medium bg-white dark:bg-[#221812] border border-[#eae8e4] dark:border-[#38271c] hover:border-[#9c6402] dark:hover:border-[#e29d38] text-[#514537] dark:text-[#cdc5bd] transition-colors cursor-pointer"
            >
              {isEn ? "Within 2 Hours" : "خلال ساعتين"}
            </button>
            <button
              type="button"
              onClick={() => applyPreset(4)}
              className="px-[10px] py-[5px] rounded-[4px] text-[11px] font-medium bg-white dark:bg-[#221812] border border-[#eae8e4] dark:border-[#38271c] hover:border-[#9c6402] dark:hover:border-[#e29d38] text-[#514537] dark:text-[#cdc5bd] transition-colors cursor-pointer"
            >
              {isEn ? "Within 4 Hours" : "خلال 4 ساعات"}
            </button>
            <button
              type="button"
              onClick={() => applyPreset(8)}
              className="px-[10px] py-[5px] rounded-[4px] text-[11px] font-medium bg-white dark:bg-[#221812] border border-[#eae8e4] dark:border-[#38271c] hover:border-[#9c6402] dark:hover:border-[#e29d38] text-[#514537] dark:text-[#cdc5bd] transition-colors cursor-pointer"
            >
              {isEn ? "Within 8 Hours" : "خلال 8 ساعات"}
            </button>
            <button
              type="button"
              onClick={() => applyPreset(0, "PM", "05", "00")}
              className="px-[10px] py-[5px] rounded-[4px] text-[11px] font-medium bg-white dark:bg-[#221812] border border-[#eae8e4] dark:border-[#38271c] hover:border-[#9c6402] dark:hover:border-[#e29d38] text-[#514537] dark:text-[#cdc5bd] transition-colors cursor-pointer"
            >
              {isEn ? "End of workday (05:00 PM)" : "نهاية الدوام (05:00 م)"}
            </button>
            <button
              type="button"
              onClick={() => applyPreset(0, "AM", "09", "00")}
              className="px-[10px] py-[5px] rounded-[4px] text-[11px] font-medium bg-white dark:bg-[#221812] border border-[#eae8e4] dark:border-[#38271c] hover:border-[#9c6402] dark:hover:border-[#e29d38] text-[#514537] dark:text-[#cdc5bd] transition-colors cursor-pointer"
            >
              {isEn ? "Tomorrow morning (09:00 AM)" : "صباح الغد (09:00 ص)"}
            </button>
          </div>
        </div>
      )}

      {/* Done confirmation button if onApply is provided */}
      {onApply && (
        <div className="flex justify-end pt-2 border-t border-[#eae8e4] dark:border-[#38271c]">
          <button
            type="button"
            onClick={onApply}
            className="px-[16px] py-[7px] bg-[#9c6402] hover:bg-[#855402] dark:bg-[#e29d38] dark:hover:bg-[#f3c27e] text-white dark:text-[#1c140f] rounded-[4px] text-[12px] font-bold flex items-center gap-[6px] transition-colors cursor-pointer"
          >
            <Check className="size-[14px]" />
            <span>{isEn ? "Done & Set Time" : "اعتماد وتثبيت الوقت"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
