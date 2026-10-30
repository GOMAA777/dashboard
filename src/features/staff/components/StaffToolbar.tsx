import React from "react";
import { Search, ChevronDown, RotateCcw } from "lucide-react";
import { staffRoles } from "../data/initialStaff";

interface StaffToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedLastLogin: string;
  onLastLoginChange: (period: string) => void;
  onResetFilters: () => void;
  isEmptyView: boolean;
  onToggleEmptyView: () => void;
}

export function StaffToolbar({
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedStatus,
  onStatusChange,
  selectedLastLogin,
  onLastLoginChange,
  onResetFilters,
  isEmptyView,
  onToggleEmptyView,
}: StaffToolbarProps) {
  return (
    <div
      className="bg-white rounded-[8px] p-4 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      data-node-id="1:8966"
      dir="rtl"
    >
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Right side: Search bar & Filters */}
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Search Bar */}
          <div className="relative min-w-[280px] flex-1 max-w-[360px]" data-node-id="1:8968">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث بالاسم، البريد الإلكتروني، أو رقم الموظف..."
              className="w-full h-[38px] pe-9 ps-3 text-[13px] bg-[#fdfbf7] border border-[#d6cfc7] rounded-[6px] text-[#1b1c1a] placeholder:text-[#948b83] focus:outline-none focus:ring-1 focus:ring-[#9c6402] focus:border-[#9c6402] transition-colors text-right"
              data-node-id="1:8969"
            />
            <Search className="size-[15px] text-[#948b83] absolute top-1/2 -translate-y-1/2 end-3 pointer-events-none" />
          </div>

          {/* Role Filter */}
          <div className="relative min-w-[140px]" data-node-id="1:8974">
            <select
              value={selectedRole}
              onChange={(e) => onRoleChange(e.target.value)}
              className="w-full h-[38px] pe-8 ps-3 text-[13px] bg-[#fdfbf7] border border-[#d6cfc7] rounded-[6px] text-[#514537] appearance-none focus:outline-none focus:ring-1 focus:ring-[#9c6402] focus:border-[#9c6402] cursor-pointer text-right"
            >
              <option value="all">جميع الأدوار</option>
              {staffRoles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <ChevronDown className="size-[14px] text-[#948b83] absolute top-1/2 -translate-y-1/2 end-2.5 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[130px]" data-node-id="1:8979">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full h-[38px] pe-8 ps-3 text-[13px] bg-[#fdfbf7] border border-[#d6cfc7] rounded-[6px] text-[#514537] appearance-none focus:outline-none focus:ring-1 focus:ring-[#9c6402] focus:border-[#9c6402] cursor-pointer text-right"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="suspended">موقوف</option>
            </select>
            <ChevronDown className="size-[14px] text-[#948b83] absolute top-1/2 -translate-y-1/2 end-2.5 pointer-events-none" />
          </div>

          {/* Last Login Filter */}
          <div className="relative min-w-[140px]" data-node-id="1:8984">
            <select
              value={selectedLastLogin}
              onChange={(e) => onLastLoginChange(e.target.value)}
              className="w-full h-[38px] pe-8 ps-3 text-[13px] bg-[#fdfbf7] border border-[#d6cfc7] rounded-[6px] text-[#514537] appearance-none focus:outline-none focus:ring-1 focus:ring-[#9c6402] focus:border-[#9c6402] cursor-pointer text-right"
            >
              <option value="all">آخر تسجيل دخول</option>
              <option value="today">اليوم</option>
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
            </select>
            <ChevronDown className="size-[14px] text-[#948b83] absolute top-1/2 -translate-y-1/2 end-2.5 pointer-events-none" />
          </div>

          {/* Reset Button */}
          <button
            type="button"
            onClick={onResetFilters}
            title="إعادة ضبط الفلاتر"
            className="size-[38px] rounded-[6px] border border-[#d6cfc7] bg-[#fdfbf7] hover:bg-[#f5f3ef] text-[#514537] flex items-center justify-center transition-colors shrink-0"
            data-node-id="1:8989"
          >
            <RotateCcw className="size-[15px]" />
          </button>
        </div>

        {/* Left side: View State Demo Switcher */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            type="button"
            onClick={onToggleEmptyView}
            className="text-[12px] text-[#79716b] hover:text-[#9c6402] px-2.5 py-1.5 rounded-[4px] border border-dashed border-[#d6cfc7] hover:border-[#9c6402] transition-colors"
          >
            {isEmptyView ? "عرض الجدول المكتمل" : "معاينة الحالة الفارغة (Figma 1:8699)"}
          </button>
        </div>
      </div>
    </div>
  );
}
