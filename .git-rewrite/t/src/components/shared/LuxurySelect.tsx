"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption<T extends string | number = string> {
  value: T;
  label: string;
  badge?: string;
  icon?: React.ReactNode;
}

interface LuxurySelectProps<T extends string | number = string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  placement?: "bottom" | "top";
  compact?: boolean;
  className?: string;
  dropdownClassName?: string;
  minWidth?: string;
  disabled?: boolean;
}

export function LuxurySelect<T extends string | number = string>({
  value,
  onChange,
  options,
  placeholder,
  placement = "bottom",
  compact = false,
  className = "",
  dropdownClassName = "",
  minWidth = "min-w-[140px]",
  disabled = false,
}: LuxurySelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

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
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2.5 rounded-xl border transition-all select-none ${
          disabled
            ? "opacity-60 cursor-not-allowed bg-stone-100 dark:bg-[#1a1816] border-[#ded5c6]/60 dark:border-[#2f2a24]"
            : "cursor-pointer"
        } ${
          compact
            ? "h-8 px-2.5 text-xs font-bold"
            : "h-10.5 px-3.5 text-xs font-semibold"
        } ${
          isOpen
            ? "border-[#c29547] bg-[#faf5eb] dark:bg-[#282218] text-[#966e2e] dark:text-[#eeddbb] shadow-[0_2px_12px_rgba(194,149,71,0.18)]"
            : "border-[#ded5c6] dark:border-[#2f2a24] bg-[#faf8f4] dark:bg-[#201d1a] text-[#1c1917] dark:text-[#f5f4f0] hover:border-[#c29547]"
        }`}
      >
        <span className="truncate text-start">
          {selectedOption ? selectedOption.label : placeholder || ""}
        </span>
        <ChevronDown
          className={`shrink-0 transition-transform duration-200 ${
            compact ? "w-3.5 h-3.5" : "w-4 h-4"
          } ${isOpen ? "rotate-180 text-[#c29547]" : "text-[#8c8279]"}`}
        />
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div
          className={`absolute z-50 ${minWidth} rounded-2xl border border-[#eeddbb] dark:border-[#382b18] bg-white dark:bg-[#1a1714] p-1.5 shadow-[0_12px_36px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.6)] backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150 ${
            placement === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5"
          } start-0 ${dropdownClassName}`}
        >
          <div className="max-h-60 overflow-y-auto scrollbar-thin space-y-0.5">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer text-start ${
                    isSelected
                      ? "bg-[#faf5eb] dark:bg-[#282218] text-[#966e2e] dark:text-[#eeddbb]"
                      : "text-[#2c2825] dark:text-[#e4ded5] hover:bg-[#faf5eb]/60 dark:hover:bg-[#241f1a] hover:text-[#c29547]"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                    <span className="truncate">{opt.label}</span>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#c29547] shrink-0" />
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
