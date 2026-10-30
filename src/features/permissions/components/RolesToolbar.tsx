import React from "react";
import { Search, ChevronDown, RotateCcw } from "lucide-react";

interface RolesToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedType: string;
  onTypeChange: (val: string) => void;
  onReset: () => void;
  isEmptyView: boolean;
  onToggleEmptyView: () => void;
}

export function RolesToolbar({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  onReset,
  isEmptyView,
  onToggleEmptyView,
}: RolesToolbarProps) {
  return (
    <div
      className="bg-white rounded-t-[8px] p-4 border border-[#e6e2dc] border-b-0 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      data-node-id="1:11627"
      dir="rtl"
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input (covers the larger space) */}
        <div className="relative flex-1" data-node-id="1:11629">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث باسم الدور أو المعرّف البرمجي..."
            className="w-full h-[36px] pe-9 ps-3 text-[12px] bg-[#f5f3ef] border border-[#d6cfc7]/60 rounded-[4px] text-[#1b1c1a] placeholder:text-[#837565] focus:outline-none focus:ring-1 focus:ring-[#9c6402] focus:border-[#9c6402] transition-colors text-right"
            data-node-id="1:11630"
          />
          <Search className="size-[14px] text-[#837565] absolute top-1/2 -translate-y-1/2 end-3 pointer-events-none" />
        </div>

        {/* Filters and Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Role Type Filter */}
          <div className="relative min-w-[140px]" data-node-id="1:11638">
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="w-full h-[36px] pe-8 ps-3 text-[12px] bg-[#f5f3ef] border border-[#d6cfc7]/60 rounded-[4px] text-[#1b1c1a] appearance-none focus:outline-none focus:ring-1 focus:ring-[#9c6402] focus:border-[#9c6402] cursor-pointer text-right"
              data-node-id="1:11639"
            >
              <option value="all">جميع الأنواع</option>
              <option value="system">أدوار النظام الأساسية</option>
              <option value="custom">أدوار مخصصة</option>
            </select>
            <ChevronDown className="size-[13px] text-[#514537] absolute top-1/2 -translate-y-1/2 end-2.5 pointer-events-none" />
          </div>

          {/* Reset Filters Button */}
          <button
            type="button"
            onClick={onReset}
            title="إعادة تعيين الفلاتر"
            className="h-[36px] px-3 bg-[#f5f3ef] hover:bg-[#eae8e4] text-[#514537] border border-[#d6cfc7]/60 rounded-[4px] flex items-center justify-center transition-colors cursor-pointer"
            data-node-id="1:11635"
          >
            <RotateCcw className="size-[14px]" />
          </button>

          {/* Demonstration toggle for empty state */}
          <button
            type="button"
            onClick={onToggleEmptyView}
            className="h-[36px] px-3 bg-[#f5f3ef] hover:bg-[#eae8e4] text-[#837565] hover:text-[#1b1c1a] border border-[#d6cfc7]/60 rounded-[4px] text-[11px] font-semibold transition-colors cursor-pointer"
          >
            {isEmptyView ? "العودة للجدول المكتمل" : "معاينة الحالة الفارغة"}
          </button>
        </div>
      </div>
    </div>
  );
}
