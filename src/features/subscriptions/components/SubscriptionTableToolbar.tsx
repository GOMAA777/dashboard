"use client";

import React from "react";
import { Search, RotateCcw, ChevronDown } from "lucide-react";
import { SubscriptionTabFilter } from "../types/subscription.types";

interface SubscriptionTableToolbarProps {
  currentTab: SubscriptionTabFilter;
  onTabChange: (tab: SubscriptionTabFilter) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  planFilter: string;
  onPlanChange: (plan: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  paymentMethodFilter: string;
  onPaymentMethodChange: (method: string) => void;
  onResetFilters: () => void;
  counts?: {
    all: number;
    active: number;
    pending: number;
    cancelled_expired: number;
  };
}

export function SubscriptionTableToolbar({
  currentTab,
  onTabChange,
  pageSize,
  onPageSizeChange,
  searchQuery,
  onSearchChange,
  planFilter,
  onPlanChange,
  statusFilter,
  onStatusChange,
  paymentMethodFilter,
  onPaymentMethodChange,
  onResetFilters,
  counts = {
    all: 128,
    active: 96,
    pending: 18,
    cancelled_expired: 14,
  },
}: SubscriptionTableToolbarProps) {
  const tabs: Array<{ id: SubscriptionTabFilter; label: string; count: number }> = [
    { id: "all", label: "الكل", count: counts.all },
    { id: "active", label: "النشطة", count: counts.active },
    { id: "pending", label: "قيد الانتظار", count: counts.pending },
    { id: "cancelled_expired", label: "منتهية وملغاة", count: counts.cancelled_expired },
  ];

  return (
    <div
      className="bg-white dark:bg-[#1e1c1a] flex flex-col gap-4 p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full"
      data-node-id="1:5336"
      data-name="Tabs and Search / Filter Header"
    >
      {/* Top Row: Tab Pills & Page View Size */}
      <div
        className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 w-full"
        data-node-id="1:5337"
      >
        {/* Page View Size */}
        <div className="flex items-center gap-2 self-start md:self-auto" data-node-id="1:5338">
          <span className="font-['Cairo'] text-[12px] text-[#837565] dark:text-[#a89f91]">
            عرض الصفحة:
          </span>
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="appearance-none bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] font-['Cairo'] font-semibold text-[12px] py-1.5 ps-3 pe-8 rounded-[4px] border-none focus:outline-none focus:ring-1 focus:ring-[#9c6402] cursor-pointer"
            >
              <option value={10}>10 مكاتب</option>
              <option value={20}>20 مكتباً</option>
              <option value={50}>50 مكتباً</option>
              <option value={100}>100 مكتب</option>
            </select>
            <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#514537] dark:text-[#a89f91] pointer-events-none" />
          </div>
        </div>

        {/* Tab Pills */}
        <div
          className="bg-[#f5f3ef] dark:bg-[#2c2621] p-1 rounded-[12px] flex items-center gap-1.5 overflow-x-auto w-full md:w-auto"
          data-node-id="1:5346"
        >
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-[12px] transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-white dark:bg-[#1b1917] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] text-[#9c6402] dark:text-[#f59e0b] font-semibold"
                    : "text-[#514537] dark:text-[#d1c9bd] hover:text-[#1b1c1a] dark:hover:text-[#ffffff] font-medium"
                }`}
              >
                <span
                  className={`font-['Cairo'] text-[10px] font-bold px-1.5 py-0.5 rounded-[12px] ${
                    isActive
                      ? "bg-[#f0eeea] dark:bg-[#342711] text-[#7b4e00] dark:text-[#f59e0b]"
                      : "bg-[#f0eeea] dark:bg-[#38332c] text-[#514537] dark:text-[#b4aba0]"
                  }`}
                >
                  {tab.count}
                </span>
                <span className="font-['Cairo'] text-[14px]">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Row: Filter Row & Search Bar */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2 items-center w-full"
        data-node-id="1:5367"
      >
        {/* Reset Button */}
        <div className="lg:col-span-1 order-5 lg:order-1 flex justify-end lg:justify-start">
          <button
            type="button"
            onClick={onResetFilters}
            title="إعادة ضبط الفلاتر"
            className="bg-[#f5f3ef] dark:bg-[#2c2621] hover:bg-[#eae8e4] dark:hover:bg-[#38332c] text-[#514537] dark:text-[#d1c9bd] h-[34px] w-[34px] lg:w-full flex items-center justify-center rounded-[4px] transition-colors cursor-pointer"
            data-node-id="1:5389"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#514537] dark:text-[#d1c9bd]" />
          </button>
        </div>

        {/* Dropdown 3: Payment Method */}
        <div className="lg:col-span-2 order-4 lg:order-2 relative" data-node-id="1:5384">
          <select
            value={paymentMethodFilter}
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            className="w-full h-[34px] appearance-none bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] font-['Cairo'] text-[12px] ps-3 pe-8 rounded-[4px] border-none focus:outline-none focus:ring-1 focus:ring-[#9c6402] cursor-pointer"
          >
            <option value="all">طرق الدفع (الكل)</option>
            <option value="mada">مدى</option>
            <option value="visa">VISA / Mastercard</option>
            <option value="sadad">سداد</option>
            <option value="transfer">تحويل بنكي</option>
            <option value="settlement">تسوية</option>
          </select>
          <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#514537] dark:text-[#a89f91] pointer-events-none" />
        </div>

        {/* Dropdown 2: Status */}
        <div className="lg:col-span-2 order-3 lg:order-3 relative" data-node-id="1:5379">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full h-[34px] appearance-none bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] font-['Cairo'] text-[12px] ps-3 pe-8 rounded-[4px] border-none focus:outline-none focus:ring-1 focus:ring-[#9c6402] cursor-pointer"
          >
            <option value="all">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="pending">قيد الانتظار</option>
            <option value="expired">منتهي</option>
            <option value="cancelled">ملغي</option>
            <option value="rejected">مرفوض</option>
          </select>
          <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#514537] dark:text-[#a89f91] pointer-events-none" />
        </div>

        {/* Dropdown 1: Plan */}
        <div className="lg:col-span-2 order-2 lg:order-4 relative" data-node-id="1:5374">
          <select
            value={planFilter}
            onChange={(e) => onPlanChange(e.target.value)}
            className="w-full h-[34px] appearance-none bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] font-['Cairo'] text-[12px] ps-3 pe-8 rounded-[4px] border-none focus:outline-none focus:ring-1 focus:ring-[#9c6402] cursor-pointer"
          >
            <option value="all">جميع الباقات</option>
            <option value="custom">الباقة المخصصة</option>
            <option value="gold">الباقة الذهبية</option>
            <option value="silver">الباقة الفضية</option>
            <option value="basic">الباقة الأساسية</option>
          </select>
          <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#514537] dark:text-[#a89f91] pointer-events-none" />
        </div>

        {/* Search Bar */}
        <div className="lg:col-span-5 order-1 lg:order-5 relative" data-node-id="1:5368">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث برقم الاشتراك، اسم المكتب، أو رقم الترخيص..."
            className="w-full h-[34px] bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder-[#837565] dark:placeholder-[#a89f91] font-['Cairo'] text-[12px] ps-10 pe-3 rounded-[4px] border-none focus:outline-none focus:ring-1 focus:ring-[#9c6402]"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#837565] dark:text-[#a89f91] pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
