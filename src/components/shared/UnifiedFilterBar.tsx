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
  primaryFilterMode?: "pills" | "select";
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
  primaryFilterMode = "pills",
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
        "bg-white dark:bg-[#221812] rounded-[8px] p-[16px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-wrap md:flex-nowrap items-center justify-between gap-[16px] w-full max-w-full font-['Cairo',sans-serif] select-none",
        className
      )}
    >
      {/* 3 Unified Filter Controls in a Single Row */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-[12px] flex-1">
        {/* 1. Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-[420px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder-[#837565] dark:placeholder-[#8e8680] text-[13px] rounded-[6px] pe-[36px] ps-[14px] border border-transparent dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] transition-all font-sans"
          />
          <div className="absolute top-1/2 -translate-y-1/2 end-[12px] pointer-events-none text-[#837565] dark:text-[#8e8680]">
            <Search className="size-[15px]" />
          </div>
        </div>

        {/* 2. Primary Tabs / Segmented Pills (Direct switching) OR Select Dropdown */}
        {primaryFilterMode === "select" ? (
          <div className="relative shrink-0">
            <select
              value={primaryFilterValue}
              onChange={(e) => onPrimaryFilterChange(e.target.value)}
              className="appearance-none bg-[#f5f3ef] dark:bg-[#281c15] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] border border-transparent dark:border-[#38271c] rounded-[6px] h-[40px] px-[14px] pe-[34px] text-[13px] font-bold text-[#514537] dark:text-[#cdc5bd] focus:outline-none focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] cursor-pointer transition-colors"
            >
              {primaryFilterOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="size-[14px] text-[#837565] dark:text-[#8e8680] absolute end-[10px] top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        ) : (
          <div className="bg-[#f5f3ef] dark:bg-[#1a120d] p-[3px] rounded-[6px] border border-[#eae8e4] dark:border-[#38271c] inline-flex items-center gap-[3px] shrink-0 overflow-x-auto scrollbar-none">
            {primaryFilterOptions.map((opt) => {
              const isActive = primaryFilterValue === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onPrimaryFilterChange(opt.value)}
                  className={cn(
                    "px-[12px] py-[6px] rounded-[4px] text-[12px] font-bold transition-all cursor-pointer whitespace-nowrap",
                    isActive
                      ? "bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] shadow-xs"
                      : "text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] hover:bg-[#eae8e4]/60 dark:hover:bg-[#281c15]"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}

        {/* 3. Filter Drawer Button (Opens Sheet Drawer) */}
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetTrigger
            render={
              <button
                type="button"
                title="تصفية متقدمة"
                aria-label="تصفية متقدمة"
                className={cn(
                  "h-[40px] px-[12px] rounded-[6px] bg-[#f5f3ef] dark:bg-[#281c15] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] flex items-center gap-[6px] shrink-0 cursor-pointer transition-colors border border-transparent dark:border-[#38271c] relative",
                  hasActiveFilters &&
                    "text-[#9c6402] dark:text-[#f3c27e] bg-[#fff6e8] dark:bg-[rgba(226,157,56,0.18)] border-[#ffddb6] dark:border-[#e29d38]/50"
                )}
              >
                <SlidersHorizontal className="size-[16px]" />
                <span className="text-[12px] font-bold">فلتر</span>
                {hasActiveFilters && (
                  <span className="size-[7px] rounded-full bg-[#9c6402] dark:bg-[#e29d38]" />
                )}
              </button>
            }
          />
          <SheetContent
            side="left"
            className="w-[340px] sm:w-[420px] p-0 flex flex-col justify-between bg-white dark:bg-[#221812] border-e border-[#eae8e4] dark:border-[#38271c] shadow-2xl font-['Cairo',sans-serif]"
          >
            <SheetHeader className="p-5 border-b border-[#f0eeea] dark:border-[#38271c] text-start">
              <SheetTitle className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-2">
                <SlidersHorizontal className="size-[18px] text-[#9c6402] dark:text-[#e29d38]" />
                <span>{drawerTitle}</span>
              </SheetTitle>
              <SheetDescription className="text-[12px] text-[#837565] dark:text-[#8e8680] mt-1">
                {drawerDescription}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {drawerContent ? (
                drawerContent
              ) : (
                <div className="text-center py-10 text-[#837565] dark:text-[#8e8680] text-xs">
                  لا توجد خيارات تصفية إضافية لهذه الصفحة
                </div>
              )}
            </div>

            <SheetFooter className="p-4 border-t border-[#f0eeea] dark:border-[#38271c] bg-[#fcfbfa] dark:bg-[#1a120d] flex flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  onReset();
                  setIsDrawerOpen(false);
                }}
                className="flex-1 h-[40px] rounded-[6px] border border-[#ded5c6] dark:border-[#38271c] bg-white dark:bg-[#221812] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCcw className="size-[14px]" />
                <span>إعادة ضبط الفلتر</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1 h-[40px] rounded-[6px] bg-[#9c6402] dark:bg-[#e29d38] hover:bg-[#7b4e00] dark:hover:bg-[#d08c2a] text-white dark:text-[#1c140f] text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
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
