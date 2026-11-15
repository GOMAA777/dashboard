"use client";

import React, { useState, useRef, useEffect } from "react";
import { Palette, Check } from "lucide-react";
import { useUIStore, ColorPalette } from "@/stores/use-ui-store";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface PaletteOption {
  id: ColorPalette;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  lightPrimaryHex: string;
  darkPrimaryHex: string;
  previewBg: string;
}

export const PALETTE_OPTIONS: PaletteOption[] = [
  {
    id: "royal-gold",
    nameAr: "ذهبي ملكي (الافتراضي)",
    nameEn: "Royal Gold",
    descriptionAr: "الهوية الملكية الدافئة للمنصة وبوابة الموكلين",
    descriptionEn: "Warm royal gold & rich espresso luxury",
    lightPrimaryHex: "#9c6402",
    darkPrimaryHex: "#e29d38",
    previewBg: "#f8f6f2",
  },
  {
    id: "midnight-navy",
    nameAr: "الوقار القانوني النيلي",
    nameEn: "Midnight Navy",
    descriptionAr: "كحلي نيلي رسمي مع لمسات الشامبين المذهب",
    descriptionEn: "Executive deep navy & champagne gold",
    lightPrimaryHex: "#1e3a8a",
    darkPrimaryHex: "#d4a359",
    previewBg: "#f4f6f9",
  },
  {
    id: "onyx-bronze",
    nameAr: "الفخامة الحيادية المعاصرة",
    nameEn: "Onyx & Bronze",
    descriptionAr: "كربون هادئ مع برونز صحراوي حديث",
    descriptionEn: "Modern obsidian charcoal & desert bronze",
    lightPrimaryHex: "#a36b28",
    darkPrimaryHex: "#e4c087",
    previewBg: "#f9f9f8",
  },
  {
    id: "emerald-justice",
    nameAr: "عدالة الزمرد",
    nameEn: "Emerald Justice",
    descriptionAr: "أخضر زمردي يعبر عن الرسوخ والنمو المتوازن",
    descriptionEn: "Refined institutional emerald & soft mint",
    lightPrimaryHex: "#065f46",
    darkPrimaryHex: "#34d399",
    previewBg: "#f6f8f6",
  },
  {
    id: "ruby-burgundy",
    nameAr: "العنابي الدبلوماسي",
    nameEn: "Ruby Burgundy",
    descriptionAr: "أناقة وفخامة مخصصة لمكاتب النخبة والتحكيم",
    descriptionEn: "Prestige royal burgundy & silver rose",
    lightPrimaryHex: "#881337",
    darkPrimaryHex: "#fb7185",
    previewBg: "#faf6f7",
  },
  {
    id: "charcoal-executive",
    nameAr: "الفحمي الكلاسيكي",
    nameEn: "Charcoal Executive",
    descriptionAr: "طابع تنفيذي معاصر شديد الوضوح والتركيز",
    descriptionEn: "High-contrast slate gray & corporate blue",
    lightPrimaryHex: "#334155",
    darkPrimaryHex: "#64748b",
    previewBg: "#f8fafc",
  },
];

export function PaletteSwitcher({ className }: { className?: string }) {
  const { t, isEn } = useLanguage();
  const currentPalette = useUIStore((state) => state.palette);
  const setPalette = useUIStore((state) => state.setPalette);
  const theme = useUIStore((state) => state.theme);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeOption =
    PALETTE_OPTIONS.find((p) => p.id === currentPalette) || PALETTE_OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={cn("relative", className)} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title={t("تغيير باليت الألوان", "Change Color Palette")}
        aria-label={t("تغيير باليت الألوان", "Change Color Palette")}
        className="size-[36px] rounded-[6px] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] border border-transparent hover:border-[#eae8e4] dark:hover:border-[#38271c] transition-colors flex items-center justify-center shrink-0 cursor-pointer relative"
      >
        <Palette className="size-[17px] text-[var(--accent)]" />
        <span
          className="absolute bottom-1.5 end-1.5 size-1.5 rounded-full border border-white dark:border-[#1c140f]"
          style={{
            backgroundColor:
              theme === "dark"
                ? activeOption.darkPrimaryHex
                : activeOption.lightPrimaryHex,
          }}
        />
      </button>

      {isOpen && (
        <div className="absolute end-0 top-[calc(100%+8px)] z-50 w-72 bg-white dark:bg-[#1e1612] border border-[#eae8e4] dark:border-[#38271c] rounded-[10px] shadow-xl p-2 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-[#f0ede8] dark:border-[#2d2119] mb-1">
            <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block text-start">
              {t("اختر باليت الألوان للمنصة", "Select Platform Color Palette")}
            </span>
            <span className="text-[10px] text-[#837565] dark:text-[#a89f91] block text-start mt-0.5">
              {t("تطبيق متناسق وفوري لجميع عناصر النظام", "Instant cohesive theme for all screens")}
            </span>
          </div>

          <div className="flex flex-col gap-1 max-h-[320px] overflow-y-auto">
            {PALETTE_OPTIONS.map((option) => {
              const isSelected = option.id === currentPalette;
              const primaryHex =
                theme === "dark"
                  ? option.darkPrimaryHex
                  : option.lightPrimaryHex;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setPalette(option.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center justify-between gap-3 px-3 py-2 rounded-[8px] transition-colors text-start cursor-pointer w-full",
                    isSelected
                      ? "bg-[#fff8e1] dark:bg-[#2e2118] border border-[#c29547]/30 dark:border-[#e29d38]/30"
                      : "hover:bg-[#fbfaf8] dark:hover:bg-[#281c15] border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="size-4 rounded-full shrink-0 border border-black/10 shadow-xs"
                      style={{ backgroundColor: primaryHex }}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] truncate">
                        {isEn ? option.nameEn : option.nameAr}
                      </span>
                      <span className="text-[10px] text-[#837565] dark:text-[#a89f91] truncate">
                        {isEn ? option.descriptionEn : option.descriptionAr}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="size-4 text-[var(--accent)] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
