"use client";

import React, { useState } from "react";
import { Search, ChevronDown, SlidersHorizontal, RotateCcw, Check } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface PrimaryFilterOption {
  label: string;
  value: string;
}

export interface UnifiedFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  primaryFilterValue: string;
  onPrimaryFilterChange: (value: string) => void;
  primaryFilterOptions: PrimaryFilterOption[];
  hasActiveFilters?: boolean;
  onReset: () => void;
  drawerTitle?: string;
  drawerDescription?: string;
  drawerContent?: React.ReactNode;
  actionButton?: React.ReactNode;
  className?: string;
}

export function UnifiedFilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "البحث في القائمة...",
  primaryFilterValue,
  onPrimaryFilterChange,
  primaryFilterOptions,
  hasActiveFilters = false,
  onReset,
  drawerTitle = "خيارات التصفية المتقدمة",
  drawerDescription = "تخصيص نتائج العرض حسب المعايير المحددة",
  drawerContent,
  actionButton,
  className,
}: UnifiedFilterBarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div
      className={cn(
        "bg-white rounded-[8px] p-[16px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] flex items-center justify-between gap-[16px] w-full font-['Cairo',sans-serif] select-none",
        className
      )}
      dir="rtl"
    >
      {/* 3 Unified Filter Controls in a Single Row */}
      <div className="flex items-center gap-[12px] flex-1 max-w-[800px]">
        {/* 1. Search Input */}
        <div className="relative flex-1 max-w-[420px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full h-[40px] bg-[#f5f3ef] text-[#1b1c1a] placeholder-[#837565] text-[13px] rounded-[4px] pe-[36px] ps-[14px] focus:outline-none focus:ring-1 focus:ring-[#9c6402]/30 transition-all font-sans"
          />
          <div className="absolute top-1/2 -translate-y-1/2 end-[12px] pointer-events-none text-[#837565]">
            <Search className="size-[15px]" />
          </div>
        </div>

        {/* 2. Primary Select Dropdown */}
        <div className="relative shrink-0">
          <select
            value={primaryFilterValue}
            onChange={(e) => onPrimaryFilterChange(e.target.value)}
            className="appearance-none bg-[#f5f3ef] hover:bg-[#eae8e4] border-0 rounded-[4px] h-[40px] px-[14px] pe-[34px] text-[13px] font-bold text-[#514537] focus:outline-none focus:ring-1 focus:ring-[#9c6402]/30 cursor-pointer transition-colors"
          >
            {primaryFilterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="size-[14px] text-[#837565] absolute end-[10px] top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* 3. Filter Drawer Icon Button (Opens Sheet Drawer) */}
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetTrigger
            render={
              <button
                type="button"
                title="تصفية متقدمة"
                aria-label="تصفية متقدمة"
                className={cn(
                  "size-[40px] rounded-[4px] bg-[#f5f3ef] hover:bg-[#eae8e4] text-[#514537] hover:text-[#1b1c1a] flex items-center justify-center shrink-0 cursor-pointer transition-colors relative",
                  hasActiveFilters && "text-[#9c6402] bg-[#fff6e8] border border-[#ffddb6]"
                )}
              >
                <SlidersHorizontal className="size-[16px]" />
                {hasActiveFilters && (
                  <span className="absolute top-[8px] end-[8px] size-[7px] rounded-full bg-[#9c6402] ring-2 ring-white" />
                )}
              </button>
            }
          />
          <SheetContent
            side="left"
            className="w-[340px] sm:w-[420px] p-0 flex flex-col justify-between bg-white border-e border-[#eae8e4] shadow-2xl font-['Cairo',sans-serif]"
            dir="rtl"
          >
            <SheetHeader className="p-5 border-b border-[#f0eeea] text-start">
              <SheetTitle className="text-[16px] font-bold text-[#1b1c1a] flex items-center gap-2">
                <SlidersHorizontal className="size-[18px] text-[#9c6402]" />
                <span>{drawerTitle}</span>
              </SheetTitle>
              <SheetDescription className="text-[12px] text-[#837565] mt-1">
                {drawerDescription}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {drawerContent ? (
                drawerContent
              ) : (
                <div className="text-center py-10 text-[#837565] text-xs">
                  لا توجد خيارات تصفية إضافية لهذه الصفحة
                </div>
              )}
            </div>

            <SheetFooter className="p-4 border-t border-[#f0eeea] bg-[#fcfbfa] flex flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  onReset();
                  setIsDrawerOpen(false);
                }}
                className="flex-1 h-[40px] rounded-[4px] border border-[#ded5c6] bg-white hover:bg-[#f5f3ef] text-[#514537] text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCcw className="size-[14px]" />
                <span>إعادة ضبط الفلتر</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1 h-[40px] rounded-[4px] bg-[#9c6402] hover:bg-[#7b4e00] text-white text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
              >
                <Check className="size-[14px]" />
                <span>تطبيق الفلاتر</span>
              </button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Optional Page Action Button (e.g. Add Staff, New Role, Export) */}
      {actionButton && <div className="shrink-0">{actionButton}</div>}
    </div>
  );
}
