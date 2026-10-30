"use client";

import React from "react";
import { X, Trash2 } from "lucide-react";
import { LanguageItem } from "../types/language-settings.types";

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
  if (!isOpen || !language) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      {/* Modal Card (Figma 1:18783) */}
      <div className="bg-white rounded-[16px] shadow-[0px_20px_50px_0px_rgba(28,20,15,0.28)] w-full max-w-[480px] overflow-hidden flex flex-col border border-[#eae8e4] animate-in zoom-in-95 duration-200">
        {/* Header: Close button & Alert Icon (Figma 1:18785) */}
        <div className="p-[24px] pb-[16px] flex items-start justify-between">
          {/* Close Button on Start / Left in RTL */}
          <button
            type="button"
            onClick={onClose}
            className="size-[32px] rounded-[4px] hover:bg-[#f5f3ef] text-[#837565] hover:text-[#1b1c1a] flex items-center justify-center transition-colors"
            aria-label="إغلاق النافذة"
          >
            <X className="size-[16px]" />
          </button>

          {/* Title & Red Icon on End / Right in RTL */}
          <div className="flex items-center gap-[12px]">
            <h2 className="text-[22px] font-bold text-[#1b1c1a] leading-[28px]">
              حذف اللغة
            </h2>
            <div className="size-[48px] rounded-[8px] bg-[rgba(255,218,214,0.6)] flex items-center justify-center text-[#ba1a1a] shrink-0">
              <Trash2 className="size-[20px]" />
            </div>
          </div>
        </div>

        {/* Main Modal Body Content (Figma 1:18796) */}
        <div className="px-[24px] py-[8px]">
          <div className="bg-[#f5f3ef] rounded-[8px] p-[14px] flex items-center justify-between gap-[14px]">
            <div className="flex flex-col text-start gap-[2px]">
              <p className="text-[14px] font-bold text-[#1b1c1a] leading-[22px]">
                هل أنت متأكد من حذف اللغة «{language.name} {language.nativeName ? `${language.nativeName} - ` : ""}{language.code}»؟
              </p>
              <p className="text-[12px] text-[#514537] leading-[18px]">
                رمز الحزمة الدولي: {language.code}-{language.code.toUpperCase()}
              </p>
            </div>
            <div className="size-[36px] rounded-[4px] bg-[#eae8e4] flex items-center justify-center text-[#1b1c1a] text-[12px] font-bold shrink-0">
              {language.code.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Footer Actions (Figma 1:18805) */}
        <div className="border-t border-[#eae8e4] p-[16px] px-[24px] flex items-center justify-start gap-[8px] mt-[16px]">
          {/* Delete Button */}
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => onConfirm(language)}
            className="bg-[#ba1a1a] hover:bg-[#991515] active:bg-[#7a1111] text-[#fff3e9] h-[40px] px-[24px] py-[8px] rounded-[4px] font-bold text-[12px] flex items-center gap-[6px] transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
          >
            <Trash2 className="size-[14px]" />
            <span>{isDeleting ? "جارٍ الحذف..." : "حذف اللغة"}</span>
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={onClose}
            className="bg-[#f0eeea] hover:bg-[#e4e1dc] text-[#1b1c1a] h-[40px] px-[16px] py-[8px] rounded-[4px] font-semibold text-[12px] transition-colors cursor-pointer"
          >
            الغاء
          </button>
        </div>
      </div>
    </div>
  );
}
