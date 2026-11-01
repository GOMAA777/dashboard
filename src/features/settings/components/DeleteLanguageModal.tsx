"use client";

import React from "react";
import { X, Trash2 } from "lucide-react";
import { LanguageItem } from "../types/language-settings.types";
import { useLanguage } from "@/lib/i18n";

interface DeleteLanguageModalProps {
  isOpen: boolean;
  language: LanguageItem | null;
  onClose: () => void;
  onConfirm: (language: LanguageItem) => void;
  isDeleting?: boolean;
}

export function DeleteLanguageModal({
  isOpen,
  language,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteLanguageModalProps) {
  const { direction, isEn } = useLanguage();
  if (!isOpen || !language) return null;

  return (
    <div
      dir={direction}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      {/* Modal Card (Figma 1:18783) */}
      <div className="bg-white dark:bg-[#221812] rounded-[16px] shadow-[0px_20px_50px_0px_rgba(28,20,15,0.28)] w-full max-w-[480px] overflow-hidden flex flex-col border border-[#eae8e4] dark:border-[#38271c] animate-in zoom-in-95 duration-200">
        {/* Header: Close button & Alert Icon (Figma 1:18785) */}
        <div className="p-[24px] pb-[16px] flex items-start justify-between">
          {/* Close Button on Start */}
          <button
            type="button"
            onClick={onClose}
            className="size-[32px] rounded-[4px] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] text-[#837565] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] flex items-center justify-center transition-colors cursor-pointer"
            aria-label={isEn ? "Close dialog" : "إغلاق النافذة"}
          >
            <X className="size-[16px]" />
          </button>

          {/* Title & Red Icon on End */}
          <div className="flex items-center gap-[12px]">
            <h2 className="text-[22px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[28px]">
              {isEn ? "Delete Language" : "حذف اللغة"}
            </h2>
            <div className="size-[48px] rounded-[8px] bg-[rgba(255,218,214,0.6)] dark:bg-[rgba(186,26,26,0.2)] flex items-center justify-center text-[#ba1a1a] dark:text-[#f87171] shrink-0">
              <Trash2 className="size-[20px]" />
            </div>
          </div>
        </div>

        {/* Main Modal Body Content (Figma 1:18796) */}
        <div className="px-[24px] py-[8px]">
          <div className="bg-[#f5f3ef] dark:bg-[#281c15] rounded-[8px] p-[14px] flex items-center justify-between gap-[14px] border border-transparent dark:border-[#38271c]">
            <div className="flex flex-col text-start gap-[2px]">
              <p className="text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[22px]">
                {isEn
                  ? `Are you sure you want to delete language "${language.name} ${language.nativeName ? `${language.nativeName} - ` : ""}${language.code}"?`
                  : `هل أنت متأكد من حذف اللغة «${language.name} ${language.nativeName ? `${language.nativeName} - ` : ""}${language.code}»؟`}
              </p>
              <p className="text-[12px] text-[#514537] dark:text-[#cdc5bd] leading-[18px]">
                {isEn
                  ? `International pack code: ${language.code}-${language.code.toUpperCase()}`
                  : `رمز الحزمة الدولي: ${language.code}-${language.code.toUpperCase()}`}
              </p>
            </div>
            <div className="size-[36px] rounded-[4px] bg-[#eae8e4] dark:bg-[#38271c] flex items-center justify-center text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] font-bold shrink-0">
              {language.code.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Footer Actions (Figma 1:18805) */}
        <div className="border-t border-[#eae8e4] dark:border-[#38271c] p-[16px] px-[24px] flex items-center justify-start gap-[8px] mt-[16px]">
          {/* Delete Button */}
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => onConfirm(language)}
            className="bg-[#ba1a1a] hover:bg-[#991515] active:bg-[#7a1111] text-[#fff3e9] h-[40px] px-[24px] py-[8px] rounded-[4px] font-bold text-[12px] flex items-center gap-[6px] transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
          >
            <Trash2 className="size-[14px]" />
            <span>{isDeleting ? (isEn ? "Deleting..." : "جارٍ الحذف...") : (isEn ? "Delete Language" : "حذف اللغة")}</span>
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={onClose}
            className="bg-[#f0eeea] dark:bg-[#281c15] hover:bg-[#e4e1dc] dark:hover:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] h-[40px] px-[16px] py-[8px] rounded-[4px] font-semibold text-[12px] transition-colors cursor-pointer"
          >
            {isEn ? "Cancel" : "إلغاء"}
          </button>
        </div>
      </div>
    </div>
  );
}
