"use client";

import React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LuxuryCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  title?: string;
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
}

export function LuxuryCheckbox({
  checked,
  indeterminate = false,
  onChange,
  title,
  ariaLabel,
  className,
  disabled = false,
}: LuxuryCheckboxProps) {
  const isChecked = checked || indeterminate;

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={ariaLabel || title}
      title={title}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) {
          onChange();
        }
      }}
      className={cn(
        "w-4.5 h-4.5 rounded-[5px] inline-flex items-center justify-center transition-all duration-150 cursor-pointer select-none align-middle shrink-0",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c29547] focus-visible:ring-offset-1",
        isChecked
          ? "bg-gradient-to-tr from-[#b8863b] to-[#d4a759] border border-[#a67730] shadow-[0_1px_3px_rgba(194,149,71,0.3)] text-white"
          : "bg-white dark:bg-[#1a1714] border border-[#d2c7b7] dark:border-[#3d3326] hover:border-[#c29547] dark:hover:border-[#c29547] shadow-2xs",
        disabled && "opacity-40 cursor-not-allowed",
        className
      )}
    >
      {checked && !indeterminate && (
        <Check className="w-3 h-3 stroke-[3] text-white animate-in zoom-in-75 duration-150" />
      )}
      {indeterminate && (
        <Minus className="w-3 h-3 stroke-[3] text-white animate-in zoom-in-75 duration-150" />
      )}
    </button>
  );
}
