"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DashboardSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  containerClassName?: string;
  iconClassName?: string;
}

/**
 * Enterprise Dashboard Select Component.
 * Eliminates browser-native dropdown arrows (e.g. Chrome's cramped border arrow),
 * applies custom branding tokens for both Light and Dark modes,
 * and ensures generous, elegant spacing between the chevron icon and the border.
 */
export const DashboardSelect = React.forwardRef<
  HTMLSelectElement,
  DashboardSelectProps
>(
  (
    {
      className,
      containerClassName,
      iconClassName,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("relative w-full group", containerClassName)}>
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full h-[42px] appearance-none cursor-pointer select-none",
            "bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7]",
            "border border-[#eae8e4] dark:border-[#38271c]",
            "rounded-[8px] ps-[14px] pe-[42px] text-[13px] font-semibold font-['Cairo',sans-serif]",
            "hover:border-[#9c6402]/40 dark:hover:border-[#e29d38]/40 hover:bg-[#faf9f7] dark:hover:bg-[#2e2018]",
            "focus:outline-none focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] focus:border-[#9c6402] dark:focus:border-[#e29d38]",
            "transition-all duration-150",
            disabled && "opacity-60 cursor-not-allowed hover:border-[#eae8e4] dark:hover:border-[#38271c]",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <div
          className={cn(
            "absolute end-[14px] top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center text-[#837565] dark:text-[#8e8680] group-hover:text-[#9c6402] dark:group-hover:text-[#e29d38] transition-colors duration-150",
            iconClassName
          )}
        >
          <ChevronDown className="size-[15px]" />
        </div>
      </div>
    );
  }
);

DashboardSelect.displayName = "DashboardSelect";
