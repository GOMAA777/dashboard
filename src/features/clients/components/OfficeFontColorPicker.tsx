"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Type,
  Palette,
  Sparkles,
  Check,
  ChevronDown,
  Home,
  Scale,
  Calendar,
  Wand2,
} from "lucide-react";
import {
  OFFICE_COLOR_PALETTE,
  OFFICE_FONT_COLOR_PRESETS,
  OFFICE_COLOR_TRIOS,
  OFFICE_ACCENT_COLOR_PRESETS,
  OfficeColorTrio,
  DEFAULT_OFFICE_FONT_COLOR,
  DEFAULT_OFFICE_THEME_COLOR,
  getOfficeColorName,
  getOfficeFontColorName,
  getOfficeAccentColorName,
  isValidHexColor,
  isLightColor,
  suggestColorsFromLogo,
} from "../constants/office-colors";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface OfficeFontColorPickerProps {
  backgroundColor?: string; // background_color
  onBackgroundColorChange?: (hex: string) => void;
  accentColor?: string; // color (secondary / accent)
  onAccentColorChange?: (hex: string) => void;
  fontColor?: string; // font_color
  onFontColorChange?: (hex: string) => void;
  logoUrl?: string | null;
  firmName?: string;
  className?: string;
  label?: string;

  // Backward compatibility props:
  value?: string;
  onChange?: (hex: string) => void;
  themeColor?: string;
  onThemeColorChange?: (hex: string) => void;
}

type PickerTab = "trios" | "bg" | "accent" | "font";

/**
 * Enterprise 3-Color Coordinated Brand & Portal Palette Picker.
 * Manages the three core brand colors required by the platform:
 * 1. background_color (لون الخلفية)
 * 2. color (اللون الثانوي / التمييز والأزرار)
 * 3. font_color (لون الخط)
 * Includes pre-matched trios, individual color customization,
 * real-time sidebar mockup preview, and 1-click logo palette extraction.
 */
export function OfficeFontColorPicker({
  backgroundColor,
  onBackgroundColorChange,
  accentColor,
  onAccentColorChange,
  fontColor,
  onFontColorChange,
  logoUrl,
  value,
  onChange,
  themeColor,
  onThemeColorChange,
  firmName,
  className,
  label,
}: OfficeFontColorPickerProps) {
  const { t, isEn } = useLanguage();
  const resolvedFirmName = firmName || t("مكتب المحاماة والاستشارات", "Law Firm & Consultancy");
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<PickerTab>("trios");
  const containerRef = useRef<HTMLDivElement>(null);

  // Resolved current color values
  const currentBgColor = isValidHexColor(backgroundColor || "")
    ? (backgroundColor as string)
    : isValidHexColor(themeColor || "")
    ? (themeColor as string)
    : "#203b3c";

  const currentAccentColor = isValidHexColor(accentColor || "")
    ? (accentColor as string)
    : isValidHexColor(themeColor || "")
    ? (themeColor as string)
    : "#d5a058";

  const currentFontColor = isValidHexColor(fontColor || "")
    ? (fontColor as string)
    : isValidHexColor(value || "")
    ? (value as string)
    : DEFAULT_OFFICE_FONT_COLOR;

  const [hexBgInput, setHexBgInput] = useState(currentBgColor);
  const [hexAccentInput, setHexAccentInput] = useState(currentAccentColor);
  const [hexFontInput, setHexFontInput] = useState(currentFontColor);

  useEffect(() => {
    if (backgroundColor && isValidHexColor(backgroundColor)) setHexBgInput(backgroundColor);
  }, [backgroundColor]);

  useEffect(() => {
    if (accentColor && isValidHexColor(accentColor)) setHexAccentInput(accentColor);
  }, [accentColor]);

  useEffect(() => {
    if (fontColor && isValidHexColor(fontColor)) setHexFontInput(fontColor);
  }, [fontColor]);

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

  // Handle selecting a 3-color pre-matched trio
  const handleSelectTrio = (trio: OfficeColorTrio) => {
    setHexBgInput(trio.bgHex);
    setHexAccentInput(trio.accentHex);
    setHexFontInput(trio.fontHex);

    if (onBackgroundColorChange) onBackgroundColorChange(trio.bgHex);
    if (onAccentColorChange) onAccentColorChange(trio.accentHex);
    if (onFontColorChange) onFontColorChange(trio.fontHex);

    if (onThemeColorChange) onThemeColorChange(trio.accentHex);
    if (onChange) onChange(trio.fontHex);
  };

  // Handle individual color selection
  const handleSelectBg = (hex: string) => {
    setHexBgInput(hex);
    if (onBackgroundColorChange) onBackgroundColorChange(hex);
    if (onThemeColorChange) onThemeColorChange(hex);
  };

  const handleSelectAccent = (hex: string) => {
    setHexAccentInput(hex);
    if (onAccentColorChange) onAccentColorChange(hex);
    if (onThemeColorChange) onThemeColorChange(hex);
  };

  const handleSelectFont = (hex: string) => {
    setHexFontInput(hex);
    if (onFontColorChange) onFontColorChange(hex);
    if (onChange) onChange(hex);
  };

  // Handle Hex text inputs
  const handleBgHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.trim();
    if (!raw.startsWith("#") && raw.length > 0) raw = `#${raw}`;
    setHexBgInput(raw);
    if (isValidHexColor(raw)) {
      if (onBackgroundColorChange) onBackgroundColorChange(raw);
      if (onThemeColorChange) onThemeColorChange(raw);
    }
  };

  const handleAccentHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.trim();
    if (!raw.startsWith("#") && raw.length > 0) raw = `#${raw}`;
    setHexAccentInput(raw);
    if (isValidHexColor(raw)) {
      if (onAccentColorChange) onAccentColorChange(raw);
      if (onThemeColorChange) onThemeColorChange(raw);
    }
  };

  const handleFontHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.trim();
    if (!raw.startsWith("#") && raw.length > 0) raw = `#${raw}`;
    setHexFontInput(raw);
    if (isValidHexColor(raw)) {
      if (onFontColorChange) onFontColorChange(raw);
      if (onChange) onChange(raw);
    }
  };

  // Smart Logo color analysis & automatic coordination
  const handleExtractFromLogo = async () => {
    if (!logoUrl) {
      toast.info(t("يرجى إرفاق شعار المنشأة أولاً لاقتراح الألوان المتناسقة معه", "Please upload a logo first to extract matching colors"));
      return;
    }
    try {
      const extracted = await suggestColorsFromLogo(logoUrl);
      setHexBgInput(extracted.backgroundColor);
      setHexAccentInput(extracted.accentColor);
      setHexFontInput(extracted.fontColor);

      if (onBackgroundColorChange) onBackgroundColorChange(extracted.backgroundColor);
      if (onAccentColorChange) onAccentColorChange(extracted.accentColor);
      if (onFontColorChange) onFontColorChange(extracted.fontColor);

      if (onThemeColorChange) onThemeColorChange(extracted.accentColor);
      if (onChange) onChange(extracted.fontColor);

      toast.success(t("تم تنسيق الألوان الثلاثة (الخلفية، الثانوي، الخط) تلقائياً مع الشعار المرفق بنجاح", "Successfully coordinated the 3 colors with your uploaded logo"));
    } catch {
      toast.error(t("تعذر تحليل ألوان الشعار المرفق", "Failed to analyze logo colors"));
    }
  };

  const lightFontPresets = OFFICE_FONT_COLOR_PRESETS.filter((p) => p.category === "light" || p.category === "gold");
  const darkFontPresets = OFFICE_FONT_COLOR_PRESETS.filter((p) => p.category === "dark");

  return (
    <div
      ref={containerRef}
      className={cn("relative flex flex-col gap-[6px] text-start", isOpen && "z-50", className)}
    >
      {/* Header Label & Smart Logo Suggestion Trigger */}
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1.5">
          <Palette className="size-3.5 text-[#9c6402] dark:text-[#e29d38]" />
          <span>{label || t("ألوان الهوية المعتمدة (الخلفية • الثانوي • الخط)", "Brand & Portal Colors (Bg • Secondary • Font)")}</span>
        </label>

        {logoUrl && (
          <button
            type="button"
            onClick={handleExtractFromLogo}
            className="text-[11px] font-bold text-[#9c6402] dark:text-[#e29d38] hover:underline flex items-center gap-1 transition-colors cursor-pointer"
            title={t("تنسيق الألوان تلقائياً مع الشعار المرفق", "Coordinate colors with logo")}
          >
            <Wand2 className="size-3" />
            <span>{t("اقتراح من الشعار", "Match Logo")}</span>
          </button>
        )}
      </div>

      {/* Trigger Button - Displays the 3 coordinated colors simultaneously */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-[44px] px-[14px] rounded-[6px] text-[13px] font-medium transition-all flex items-center justify-between cursor-pointer border text-start",
          "bg-[#f5f3ef] dark:bg-[#160e0a] border-[#eae8e4] dark:border-[#38271c] hover:border-[#9c6402]/60 dark:hover:border-[#e29d38]/60 focus:outline-none focus:ring-1 focus:ring-[#9c6402]",
          isOpen && "ring-1 ring-[#9c6402] border-[#9c6402]"
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Trio Swatch Badge */}
          <div
            className="h-[24px] px-2 rounded-full shrink-0 border border-black/15 shadow-2xs flex items-center gap-1.5 transition-colors"
            style={{
              backgroundColor: currentBgColor,
            }}
          >
            {/* Secondary Accent Dot */}
            <span
              className="size-2.5 rounded-full border border-black/20 shrink-0"
              style={{ backgroundColor: currentAccentColor }}
            />
            {/* Font Sample Text */}
            <span
              className="text-[10px] font-bold"
              style={{ color: currentFontColor }}
            >
              Aa
            </span>
          </div>

          <div className="flex items-center gap-1.5 truncate text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
            <span>{getOfficeColorName(currentBgColor, isEn)}</span>
            <span className="opacity-40">•</span>
            <span className="text-[#9c6402] dark:text-[#e29d38]">{getOfficeAccentColorName(currentAccentColor, isEn)}</span>
            <span className="opacity-40">•</span>
            <span className="opacity-80">{getOfficeFontColorName(currentFontColor, isEn)}</span>
          </div>
        </div>

        <ChevronDown
          className={cn(
            "size-4 text-[#837565] dark:text-[#9e9286] transition-transform duration-200 shrink-0",
            isOpen && "rotate-180 text-[#9c6402] dark:text-[#e29d38]"
          )}
        />
      </button>

      {/* Floating Dropdown Popover */}
      {isOpen && (
        <div
          className={cn(
            "absolute top-[calc(100%+6px)] right-0 left-0 sm:left-auto sm:w-[430px] z-50",
            "bg-white dark:bg-[#1a120d] border border-[#ded5c6] dark:border-[#4d3627] rounded-[10px] shadow-2xl p-3.5 flex flex-col gap-3",
            "animate-in fade-in-50 zoom-in-95 duration-150"
          )}
        >
          {/* Navigation Tabs Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#eae8e4] dark:border-[#2d1f16]">
            <div className="flex items-center gap-1 bg-[#f5f3ef] dark:bg-[#281c15] p-0.5 rounded-[6px] border border-[#eae8e4] dark:border-[#38271c] w-full">
              <button
                type="button"
                onClick={() => setActiveTab("trios")}
                className={cn(
                  "flex-1 py-1 rounded-[4px] text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer",
                  activeTab === "trios"
                    ? "bg-white dark:bg-[#1a120d] text-[#9c6402] dark:text-[#e29d38] shadow-xs"
                    : "text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a]"
                )}
              >
                <Sparkles className="size-3" />
                <span>{t("أطقم متناسقة", "Combos")}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("bg")}
                className={cn(
                  "flex-1 py-1 rounded-[4px] text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer",
                  activeTab === "bg"
                    ? "bg-white dark:bg-[#1a120d] text-[#9c6402] dark:text-[#e29d38] shadow-xs"
                    : "text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a]"
                )}
              >
                <span className="size-2 rounded-full border border-black/20" style={{ backgroundColor: currentBgColor }} />
                <span>{t("الخلفية", "Background")}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("accent")}
                className={cn(
                  "flex-1 py-1 rounded-[4px] text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer",
                  activeTab === "accent"
                    ? "bg-white dark:bg-[#1a120d] text-[#9c6402] dark:text-[#e29d38] shadow-xs"
                    : "text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a]"
                )}
              >
                <span className="size-2 rounded-full border border-black/20" style={{ backgroundColor: currentAccentColor }} />
                <span>{t("الثانوي", "Secondary")}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("font")}
                className={cn(
                  "flex-1 py-1 rounded-[4px] text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer",
                  activeTab === "font"
                    ? "bg-white dark:bg-[#1a120d] text-[#9c6402] dark:text-[#e29d38] shadow-xs"
                    : "text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a]"
                )}
              >
                <Type className="size-3" />
                <span>{t("الخط", "Font")}</span>
              </button>
            </div>
          </div>

          {/* TAB 1: 3-COLOR PRE-MATCHED COMBOS */}
          {activeTab === "trios" && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#514537] dark:text-[#cdc5bd]">
                  {t("أطقم ثلاثية متناسقة جاهزة (خلفية • ثانوي • خط)", "Pre-matched 3-Color Combos")}
                </span>
                {logoUrl && (
                  <button
                    type="button"
                    onClick={handleExtractFromLogo}
                    className="text-[10px] font-bold text-[#9c6402] dark:text-[#e29d38] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Wand2 className="size-3" />
                    <span>{t("تنسيق مع الشعار", "Match Logo")}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[220px] overflow-y-auto pe-1">
                {OFFICE_COLOR_TRIOS.map((trio) => {
                  const isActive =
                    currentBgColor.toLowerCase() === trio.bgHex.toLowerCase() &&
                    currentAccentColor.toLowerCase() === trio.accentHex.toLowerCase() &&
                    currentFontColor.toLowerCase() === trio.fontHex.toLowerCase();

                  return (
                    <button
                      key={trio.id}
                      type="button"
                      onClick={() => handleSelectTrio(trio)}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-[6px] border transition-all text-start cursor-pointer",
                        isActive
                          ? "bg-[#9c6402]/15 dark:bg-[#e29d38]/20 border-[#9c6402] dark:border-[#e29d38] ring-1 ring-[#9c6402]"
                          : "bg-[#f5f3ef] dark:bg-[#1c140f] border-transparent hover:border-[#ded5c6] dark:hover:border-[#38271c]"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {/* 3-Color Mini Swatch Indicator */}
                        <div
                          className="size-7 rounded-[4px] shrink-0 border border-black/15 shadow-2xs flex items-center justify-center relative overflow-hidden"
                          style={{ backgroundColor: trio.bgHex }}
                        >
                          {/* Accent corner stripe */}
                          <div
                            className="absolute bottom-0 right-0 size-3 rounded-tl-[3px]"
                            style={{ backgroundColor: trio.accentHex }}
                          />
                          <span
                            className="font-bold text-[10px] z-10"
                            style={{ color: trio.fontHex }}
                          >
                            Aa
                          </span>
                        </div>

                        <div className="flex flex-col truncate">
                          <span className="text-[11px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] truncate">
                            {isEn ? trio.nameEn : trio.nameAr}
                          </span>
                          <span className="text-[9px] text-[#837565] dark:text-[#9e9286] font-mono">
                            {trio.bgHex} • {trio.accentHex}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isActive && <Check className="size-3.5 text-[#9c6402] dark:text-[#e29d38]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: BACKGROUND COLOR */}
          {activeTab === "bg" && (
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-bold text-[#514537] dark:text-[#cdc5bd]">
                {t("ألوان الخلفية (القوائم والشريط الجانبي)", "Sidebar Background Colors")}
              </span>
              <div className="grid grid-cols-2 gap-1.5 max-h-[190px] overflow-y-auto pe-1">
                {OFFICE_COLOR_PALETTE.map((preset) => {
                  const isSelected = currentBgColor.toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => handleSelectBg(preset.hex)}
                      className={cn(
                        "flex items-center justify-between p-1.5 rounded-[6px] border transition-all text-start cursor-pointer",
                        isSelected
                          ? "bg-[#9c6402]/10 dark:bg-[#e29d38]/15 border-[#9c6402] dark:border-[#e29d38]"
                          : "bg-[#f5f3ef] dark:bg-[#1c140f] border-transparent hover:border-[#ded5c6] dark:hover:border-[#38271c]"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="size-5 rounded-full border border-black/20 shrink-0"
                          style={{ backgroundColor: preset.hex }}
                        />
                        <span className="text-[11px] font-medium text-[#1b1c1a] dark:text-[#fdfbf7] truncate">
                          {isEn ? preset.nameEn : preset.nameAr.split(" ")[0]}
                        </span>
                      </div>
                      {isSelected && <Check className="size-3.5 text-[#9c6402] dark:text-[#e29d38]" />}
                    </button>
                  );
                })}
              </div>

              {/* Custom Bg Hex Input */}
              <div className="pt-2 border-t border-[#eae8e4] dark:border-[#2d1f16] flex items-center gap-2">
                <div className="relative size-8 rounded-[6px] overflow-hidden border border-[#eae8e4] dark:border-[#38271c] shrink-0 cursor-pointer">
                  <input
                    type="color"
                    value={isValidHexColor(currentBgColor) ? currentBgColor : "#203b3c"}
                    onChange={(e) => {
                      setHexBgInput(e.target.value);
                      if (onBackgroundColorChange) onBackgroundColorChange(e.target.value);
                      if (onThemeColorChange) onThemeColorChange(e.target.value);
                    }}
                    className="absolute -top-2 -left-2 size-12 cursor-pointer border-0 p-0"
                  />
                </div>

                <input
                  type="text"
                  dir="ltr"
                  value={hexBgInput}
                  onChange={handleBgHexChange}
                  placeholder="#203B3C"
                  maxLength={7}
                  className="flex-1 h-[34px] px-2.5 rounded-[6px] text-[12px] font-mono uppercase bg-[#f5f3ef] dark:bg-[#160e0a] border border-[#eae8e4] dark:border-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] focus:outline-none focus:ring-1 focus:ring-[#9c6402] text-left"
                />

                <span className="text-[11px] text-[#837565] dark:text-[#9e9286] font-medium">
                  {t("كود الخلفية", "Bg Hex")}
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: SECONDARY / ACCENT COLOR */}
          {activeTab === "accent" && (
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-bold text-[#514537] dark:text-[#cdc5bd]">
                {t("اللون الثانوي (الأزرار والعناصر النشطة والتمييز)", "Secondary & Accent Color (Buttons & Active)")}
              </span>
              <div className="grid grid-cols-2 gap-1.5 max-h-[190px] overflow-y-auto pe-1">
                {OFFICE_ACCENT_COLOR_PRESETS.map((preset) => {
                  const isSelected = currentAccentColor.toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => handleSelectAccent(preset.hex)}
                      className={cn(
                        "flex items-center justify-between p-1.5 rounded-[6px] border transition-all text-start cursor-pointer",
                        isSelected
                          ? "bg-[#9c6402]/10 dark:bg-[#e29d38]/15 border-[#9c6402] dark:border-[#e29d38]"
                          : "bg-[#f5f3ef] dark:bg-[#1c140f] border-transparent hover:border-[#ded5c6] dark:hover:border-[#38271c]"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="size-5 rounded-full border border-black/20 shrink-0"
                          style={{ backgroundColor: preset.hex }}
                        />
                        <span className="text-[11px] font-medium text-[#1b1c1a] dark:text-[#fdfbf7] truncate">
                          {isEn ? preset.nameEn : preset.nameAr}
                        </span>
                      </div>
                      {isSelected && <Check className="size-3.5 text-[#9c6402] dark:text-[#e29d38]" />}
                    </button>
                  );
                })}
              </div>

              {/* Custom Accent Hex Input */}
              <div className="pt-2 border-t border-[#eae8e4] dark:border-[#2d1f16] flex items-center gap-2">
                <div className="relative size-8 rounded-[6px] overflow-hidden border border-[#eae8e4] dark:border-[#38271c] shrink-0 cursor-pointer">
                  <input
                    type="color"
                    value={isValidHexColor(currentAccentColor) ? currentAccentColor : "#d5a058"}
                    onChange={(e) => {
                      setHexAccentInput(e.target.value);
                      if (onAccentColorChange) onAccentColorChange(e.target.value);
                      if (onThemeColorChange) onThemeColorChange(e.target.value);
                    }}
                    className="absolute -top-2 -left-2 size-12 cursor-pointer border-0 p-0"
                  />
                </div>

                <input
                  type="text"
                  dir="ltr"
                  value={hexAccentInput}
                  onChange={handleAccentHexChange}
                  placeholder="#D5A058"
                  maxLength={7}
                  className="flex-1 h-[34px] px-2.5 rounded-[6px] text-[12px] font-mono uppercase bg-[#f5f3ef] dark:bg-[#160e0a] border border-[#eae8e4] dark:border-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] focus:outline-none focus:ring-1 focus:ring-[#9c6402] text-left"
                />

                <span className="text-[11px] text-[#837565] dark:text-[#9e9286] font-medium">
                  {t("كود الثانوي", "Accent Hex")}
                </span>
              </div>
            </div>
          )}

          {/* TAB 4: FONT COLOR */}
          {activeTab === "font" && (
            <div className="flex flex-col gap-3">
              {/* Light text options */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold text-[#514537] dark:text-[#cdc5bd]">
                  {t("ألوان فاتحة", "Light Colors")}
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {lightFontPresets.map((preset) => {
                    const isSelected = currentFontColor.toLowerCase() === preset.hex.toLowerCase();
                    return (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => handleSelectFont(preset.hex)}
                        className={cn(
                          "flex items-center justify-between p-1.5 rounded-[6px] border transition-all text-start cursor-pointer",
                          isSelected
                            ? "bg-[#9c6402]/10 dark:bg-[#e29d38]/15 border-[#9c6402] dark:border-[#e29d38]"
                            : "bg-[#f5f3ef] dark:bg-[#1c140f] border-transparent hover:border-[#ded5c6] dark:hover:border-[#38271c]"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="size-5 rounded-full border border-black/20 shrink-0 flex items-center justify-center text-[9px] font-bold"
                            style={{
                              backgroundColor: preset.hex,
                              color: currentBgColor,
                            }}
                          >
                            Aa
                          </span>
                          <span className="text-[11px] font-medium text-[#1b1c1a] dark:text-[#fdfbf7] truncate">
                            {isEn ? preset.nameEn : preset.nameAr.split(" ")[0]}
                          </span>
                        </div>
                        {isSelected && <Check className="size-3.5 text-[#9c6402] dark:text-[#e29d38]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dark text options */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold text-[#514537] dark:text-[#cdc5bd]">
                  {t("ألوان داكنة", "Dark Colors")}
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {darkFontPresets.map((preset) => {
                    const isSelected = currentFontColor.toLowerCase() === preset.hex.toLowerCase();
                    return (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => handleSelectFont(preset.hex)}
                        className={cn(
                          "flex items-center justify-between p-1.5 rounded-[6px] border transition-all text-start cursor-pointer",
                          isSelected
                            ? "bg-[#9c6402]/10 dark:bg-[#e29d38]/15 border-[#9c6402] dark:border-[#e29d38]"
                            : "bg-[#f5f3ef] dark:bg-[#1c140f] border-transparent hover:border-[#ded5c6] dark:hover:border-[#38271c]"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="size-5 rounded-full border border-black/20 shrink-0 flex items-center justify-center text-[9px] font-bold"
                            style={{
                              backgroundColor: preset.hex,
                              color: currentBgColor,
                            }}
                          >
                            Aa
                          </span>
                          <span className="text-[11px] font-medium text-[#1b1c1a] dark:text-[#fdfbf7] truncate">
                            {isEn ? preset.nameEn : preset.nameAr.split(" ")[0]}
                          </span>
                        </div>
                        {isSelected && <Check className="size-3.5 text-[#9c6402] dark:text-[#e29d38]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Font Hex Input */}
              <div className="pt-2 border-t border-[#eae8e4] dark:border-[#2d1f16] flex items-center gap-2">
                <div className="relative size-8 rounded-[6px] overflow-hidden border border-[#eae8e4] dark:border-[#38271c] shrink-0 cursor-pointer">
                  <input
                    type="color"
                    value={isValidHexColor(currentFontColor) ? currentFontColor : DEFAULT_OFFICE_FONT_COLOR}
                    onChange={(e) => {
                      setHexFontInput(e.target.value);
                      if (onFontColorChange) onFontColorChange(e.target.value);
                      if (onChange) onChange(e.target.value);
                    }}
                    className="absolute -top-2 -left-2 size-12 cursor-pointer border-0 p-0"
                  />
                </div>

                <input
                  type="text"
                  dir="ltr"
                  value={hexFontInput}
                  onChange={handleFontHexChange}
                  placeholder="#FFFFFF"
                  maxLength={7}
                  className="flex-1 h-[34px] px-2.5 rounded-[6px] text-[12px] font-mono uppercase bg-[#f5f3ef] dark:bg-[#160e0a] border border-[#eae8e4] dark:border-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] focus:outline-none focus:ring-1 focus:ring-[#9c6402] text-left"
                />

                <span className="text-[11px] text-[#837565] dark:text-[#9e9286] font-medium">
                  {t("كود الخط", "Font Hex")}
                </span>
              </div>
            </div>
          )}

          {/* Unified Real-Time Preview (Matching Portal Sidebar in Image 2) */}
          <div
            className="rounded-[8px] p-3 text-start shadow-md transition-all border flex flex-col gap-2.5"
            style={{
              backgroundColor: currentBgColor,
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            {/* Header: Logo + Office Name */}
            <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
              <div className="size-8 rounded-[6px] p-0.5 flex items-center justify-center shrink-0 border border-white/20 bg-white/10">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="max-size-full object-contain" />
                ) : (
                  <Scale className="size-4" style={{ color: currentAccentColor }} />
                )}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-[12px] font-bold truncate" style={{ color: currentFontColor }}>
                  {resolvedFirmName}
                </span>
                <span className="text-[10px] opacity-75 truncate" style={{ color: currentFontColor }}>
                  {t("لوحة تحكم المكتب • بوابة الموكلين", "Law Office Portal")}
                </span>
              </div>
            </div>

            {/* Navigation Sample Items */}
            <div className="flex flex-col gap-1 text-[11px] font-semibold">
              {/* Active Item: highlighted in Secondary/Accent color */}
              <div
                className="px-2.5 py-1.5 rounded-[5px] flex items-center justify-between transition-colors shadow-2xs"
                style={{
                  backgroundColor: currentAccentColor,
                  color: isLightColor(currentAccentColor) ? "#1b1c1a" : "#ffffff",
                }}
              >
                <div className="flex items-center gap-2">
                  <Home className="size-3.5" />
                  <span>{t("الرئيسية", "Dashboard")}</span>
                </div>
                <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-black/15">
                  {t("نشط", "Active")}
                </span>
              </div>

              {/* Inactive Item 1 */}
              <div
                className="px-2.5 py-1.5 rounded-[5px] flex items-center gap-2 opacity-80 hover:opacity-100"
                style={{ color: currentFontColor }}
              >
                <Scale className="size-3.5 opacity-80" />
                <span>{t("القضايا والمعاملات", "Cases & Files")}</span>
              </div>

              {/* Inactive Item 2 */}
              <div
                className="px-2.5 py-1.5 rounded-[5px] flex items-center gap-2 opacity-80 hover:opacity-100"
                style={{ color: currentFontColor }}
              >
                <Calendar className="size-3.5 opacity-80" />
                <span>{t("الجلسات والمواعيد", "Sessions")}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
