"use client";

import React, { useState, useEffect, useRef } from "react";
import { Palette, Check, RefreshCw, ChevronDown } from "lucide-react";
import {
  OFFICE_COLOR_PALETTE,
  DEFAULT_OFFICE_THEME_COLOR,
  getOfficeColorName,
  isValidHexColor,
  isLightColor,
} from "../constants/office-colors";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface OfficeColorPalettePickerProps {
  value: string;
  onChange: (hex: string) => void;
  firmName?: string;
  className?: string;
}

/**
 * Enterprise Office Color Palette Menu Component.
 * Formatted identically to input fields in a 2-column grid row.
 * Opens a compact floating popup menu displaying suggested brand colors,
 * hex input, native picker, and reset to default.
 */
export function OfficeColorPalettePicker({
  value,
  onChange,
  firmName = "مكتب المحاماة",
  className,
}: OfficeColorPalettePickerProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentColor = isValidHexColor(value) ? value : DEFAULT_OFFICE_THEME_COLOR;
  const colorName = getOfficeColorName(currentColor);
  const isLight = isLightColor(currentColor);

  const [hexInput, setHexInput] = useState(currentColor);

  useEffect(() => {
    if (value && isValidHexColor(value) && value.toLowerCase() !== hexInput.toLowerCase()) {
      setHexInput(value);
    }
  }, [value]);

  // Click outside listener & Escape to close
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectPreset = (hex: string) => {
    setHexInput(hex);
    onChange(hex);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.trim();
    if (!raw.startsWith("#") && raw.length > 0) {
      raw = `#${raw}`;
    }
    setHexInput(raw);
    if (isValidHexColor(raw)) {
      onChange(raw);
    }
  };

  const handleResetDefault = () => {
    setHexInput(DEFAULT_OFFICE_THEME_COLOR);
    onChange(DEFAULT_OFFICE_THEME_COLOR);
  };

  return (
    <div ref={containerRef} className={cn("relative w-full text-start font-['Cairo',sans-serif]", className)}>
      {/* Trigger Button - Matches h-[44px] input field style */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={t("تحديد لون هوية المكتب والبوابة", "Select Office Brand Color")}
        className={cn(
          "w-full h-[44px] px-[14px] bg-[#f5f3ef] dark:bg-[#160e0a] border rounded-[6px] text-[13px] font-bold flex items-center justify-between transition-all cursor-pointer shadow-2xs select-none",
          isOpen
            ? "border-[#9c6402] dark:border-[#e29d38] ring-1 ring-[#9c6402] dark:ring-[#e29d38]"
            : "border-[#eae8e4] dark:border-[#38271c] hover:border-[#9c6402]/60 dark:hover:border-[#e29d38]/60 text-[#1b1c1a] dark:text-[#fdfbf7]"
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Color Swatch Circle */}
          <span
            className="size-[20px] rounded-full border border-black/10 dark:border-white/20 shrink-0 shadow-xs transition-transform"
            style={{ backgroundColor: currentColor }}
          />

          {/* Color Label */}
          <span className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] truncate">
            {colorName}
          </span>
        </div>

        {/* Chevron Icon & Palette icon */}
        <div className="flex items-center gap-1.5 shrink-0 text-[#837565] dark:text-[#a89f91]">
          <Palette className="size-[15px]" />
          <ChevronDown
            className={cn(
              "size-[14px] transition-transform duration-200",
              isOpen && "rotate-180 text-[#9c6402] dark:text-[#e29d38]"
            )}
          />
        </div>
      </button>

      {/* Floating Menu Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={t("باليت ألوان المكتب", "Office Color Palette")}
          className="absolute z-50 mt-2 start-0 end-0 sm:start-auto sm:end-0 sm:w-[320px] bg-white dark:bg-[#1c130d] border border-[#ded5c6] dark:border-[#422e20] rounded-[10px] shadow-2xl p-3.5 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-150 select-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#eae8e4] dark:border-[#2f2218]">
            <div className="flex items-center gap-1.5">
              <Palette className="size-3.5 text-[#9c6402] dark:text-[#e29d38]" />
              <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("لون هوية المكتب", "Office Brand Color")}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#f5f3ef] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] uppercase border border-[#eae8e4] dark:border-[#38271c]">
              {currentColor}
            </span>
          </div>

          {/* Suggested Colors Section (الألوان المقترحة) */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-[#514537] dark:text-[#cdc5bd]">
              {t("الألوان المقترحة:", "Suggested Colors:")}
            </span>

            {/* 5x2 Compact Swatches Grid */}
            <div className="grid grid-cols-5 gap-2">
              {OFFICE_COLOR_PALETTE.map((swatch) => {
                const isSelected = currentColor.toLowerCase() === swatch.hex.toLowerCase();
                const lightSwatch = isLightColor(swatch.hex);
                return (
                  <button
                    key={swatch.hex}
                    type="button"
                    onClick={() => handleSelectPreset(swatch.hex)}
                    title={`${swatch.nameAr} (${swatch.hex})`}
                    className={cn(
                      "size-[32px] rounded-[6px] border border-black/10 dark:border-white/10 flex items-center justify-center cursor-pointer transition-all hover:scale-110 shadow-xs relative",
                      isSelected
                        ? "ring-2 ring-offset-2 ring-[#9c6402] dark:ring-[#e29d38] scale-105"
                        : "hover:opacity-90"
                    )}
                    style={{ backgroundColor: swatch.hex }}
                  >
                    {isSelected && (
                      <Check
                        className={cn(
                          "size-[14px] stroke-[3]",
                          lightSwatch ? "text-[#1b1c1a]" : "text-white"
                        )}
                      />
                    )}
                    <span className="sr-only">{swatch.nameAr}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Color Picker & Hex Input */}
          <div className="flex items-center gap-2 pt-2 border-t border-[#eae8e4] dark:border-[#2f2218]">
            <span className="text-[11px] font-semibold text-[#514537] dark:text-[#cdc5bd] shrink-0">
              {t("لون مخصص:", "Custom:")}
            </span>

            <div className="flex items-center gap-1.5 flex-1">
              {/* Native Color Picker Trigger */}
              <div
                className="relative size-[28px] rounded-[5px] overflow-hidden border border-[#ded5c6] dark:border-[#4d3627] shadow-xs shrink-0 cursor-pointer"
                title={t("افتح منتقي الألوان", "Open color picker")}
              >
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => {
                    setHexInput(e.target.value);
                    onChange(e.target.value);
                  }}
                  className="absolute inset-0 size-full opacity-0 cursor-pointer"
                />
                <div
                  className="size-full flex items-center justify-center"
                  style={{ backgroundColor: currentColor }}
                >
                  <Palette
                    className={cn(
                      "size-[12px]",
                      isLight ? "text-[#1b1c1a]" : "text-white"
                    )}
                  />
                </div>
              </div>

              {/* Hex Input Field */}
              <input
                type="text"
                dir="ltr"
                value={hexInput}
                onChange={handleHexInputChange}
                maxLength={7}
                placeholder="#9C6402"
                className={cn(
                  "h-[28px] flex-1 bg-[#f5f3ef] dark:bg-[#281c15] border rounded-[5px] px-2 font-mono text-[11px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] uppercase focus:outline-none transition-colors",
                  isValidHexColor(hexInput)
                    ? "border-[#ded5c6] dark:border-[#4d3627] focus:border-[#9c6402] dark:focus:border-[#e29d38]"
                    : "border-red-400 focus:border-red-500"
                )}
              />
            </div>
          </div>

          {/* Reset to Default Gold Button (when changed) */}
          {currentColor.toLowerCase() !== DEFAULT_OFFICE_THEME_COLOR.toLowerCase() && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleResetDefault}
                className="text-[10px] text-[#837565] dark:text-[#a89f91] hover:text-[#9c6402] dark:hover:text-[#e29d38] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw className="size-2.5" />
                <span>{t("استعادة الذهبي الافتراضي", "Reset to Default")}</span>
              </button>
            </div>
          )}

          {/* Mini Preview Chip */}
          <div
            className="p-2 rounded-[6px] border flex items-center justify-between gap-2 text-[11px] bg-[#fdfbf7] dark:bg-[#170e09]"
            style={{ borderColor: `${currentColor}35` }}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="size-[10px] rounded-full shrink-0"
                style={{ backgroundColor: currentColor }}
              />
              <span className="truncate font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {firmName}
              </span>
            </div>
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
              style={{
                backgroundColor: `${currentColor}20`,
                color: currentColor,
              }}
            >
              {t("معاينة البوابة", "Portal")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
