"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PageSizeDropdownProps {
  value: number;
  onChange: (newSize: number) => void;
  options?: number[];
  className?: string;
  dropdownPlacement?: "top" | "bottom";
}

export function PageSizeDropdown({
  value,
  onChange,
  options = [5, 6, 8, 10, 20, 50, 9999],
  className,
  dropdownPlacement = "top",
}: PageSizeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
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

  const formatOptionLabel = (opt: number) => {
    if (opt >= 9999) return "عرض الكل";
    return `${opt} صفوف`;
  };

  return (
    <div
      className={cn("relative inline-block font-['Cairo',sans-serif]", className)}
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="h-[32px] px-2.5 rounded-[6px] border border-[#e5e2dc] dark:border-[#38271c] bg-[#f5f3ef] dark:bg-[#281c15] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] font-bold text-[12px] flex items-center justify-between gap-2.5 transition-colors cursor-pointer select-none"
      >
        <span>{formatOptionLabel(value)}</span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-[#837565] dark:text-[#8e8680] transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className={cn(
            "absolute z-50 min-w-[96px] rounded-[6px] border border-[#e5e2dc] dark:border-[#38271c] bg-white dark:bg-[#221812] p-1 shadow-lg font-['Cairo'] animate-in fade-in zoom-in-95",
            dropdownPlacement === "bottom"
              ? "top-full mt-1.5 start-0"
              : "bottom-full mb-1.5 start-0"
          )}
        >
          {options.map((option) => {
            const isSelected = option === value;
            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-2.5 py-1.5 rounded-[4px] text-[12px] font-semibold text-start flex items-center justify-between cursor-pointer transition-colors whitespace-nowrap",
                  isSelected
                    ? "bg-[#9c6402]/10 dark:bg-[rgba(226,157,56,0.18)] text-[#9c6402] dark:text-[#e29d38] font-bold"
                    : "text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15]"
                )}
              >
                <span>{formatOptionLabel(option)}</span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-[#9c6402] dark:text-[#e29d38] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
