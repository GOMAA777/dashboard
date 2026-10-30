"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronDown, CheckCircle2, AlertTriangle } from "lucide-react";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { initialServerDirectives } from "../data/initialServerDirectives";
import { ServerDirectiveItem } from "../types/server-info.types";
import { cn } from "@/lib/utils";

export function ServerInfoView() {
  const [directives] = useState<ServerDirectiveItem[]>(initialServerDirectives);
  const [activeTab, setActiveTab] = useState<"all" | "compatible" | "needs_review">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDirectives = useMemo(() => {
    return directives.filter((d) => {
      if (activeTab === "compatible" && d.status !== "compatible") return false;
      if (activeTab === "needs_review" && d.status !== "needs_review") return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = d.title.toLowerCase().includes(q);
        const matchesName = d.directiveName.toLowerCase().includes(q);
        const matchesVal = d.currentValue.toLowerCase().includes(q);
        if (!matchesTitle && !matchesName && !matchesVal) return false;
      }

      return true;
    });
  }, [directives, activeTab, searchQuery]);

  const compatibleCount = useMemo(
    () => directives.filter((d) => d.status === "compatible").length,
    [directives]
  );
  const reviewCount = useMemo(
    () => directives.filter((d) => d.status === "needs_review").length,
    [directives]
  );

  return (
    <div
      className="flex h-screen bg-[#f5f3ef] font-sans antialiased overflow-hidden selection:bg-[#ffddb6]/30 selection:text-[#643f00]"
      dir="rtl"
    >
      {/* 1. Global Navigation Sidebar */}
      <DashboardSidebar activeNav="utility" activeSubNav="server-info" />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <DashboardTopNavbar />

        <main className="flex-1 overflow-y-auto px-[24px] sm:px-[32px] py-[24px] max-w-[1360px] w-full mx-auto pb-[80px] scrollbar-thin">
          {/* Main Identity & Command Banner (Figma 1:19057) */}
          <div className="bg-white rounded-[8px] p-[24px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] relative mb-[24px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px]">
            <div className="flex flex-col gap-[4px] text-right">
              <h1 className="text-[28px] leading-[38px] font-bold text-[#1b1c1a]">
                معلومات السيرفر
              </h1>
              <p className="text-[14px] leading-[22px] font-normal text-[#514537]">
                فحص ومراقبة البيئة التقنية وإعدادات خادم التطبيق وتوافقها مع متطلبات النظام
              </p>
            </div>
          </div>

          {/* Main Card (Figma 1:19069) */}
          <div className="bg-white rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] flex flex-col overflow-hidden">
            {/* Card Controls Toolbar: Tabs & Page Limit (Figma 1:19071) */}
            <div className="p-[20px] pb-[16px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px] border-b border-[#eae8e4]">
              {/* Tabs Filter (Right in RTL) */}
              <div className="flex items-center bg-[#f5f3ef] p-[4px] rounded-[8px] border border-[#eae8e4]">
                {/* Tab All */}
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={cn(
                    "px-[16px] py-[6px] rounded-[6px] text-[13px] font-semibold transition-all flex items-center gap-[6px] cursor-pointer",
                    activeTab === "all"
                      ? "bg-white text-[#9c6402] shadow-xs"
                      : "text-[#514537] hover:text-[#1b1c1a]"
                  )}
                >
                  <span>الكل</span>
                  <span className="text-[11px] px-[6px] py-[1px] rounded-full bg-[#f0eeea] text-[#7b4e00] font-bold">
                    {directives.length}
                  </span>
                </button>

                {/* Tab Compatible */}
                <button
                  type="button"
                  onClick={() => setActiveTab("compatible")}
                  className={cn(
                    "px-[16px] py-[6px] rounded-[6px] text-[13px] font-semibold transition-all flex items-center gap-[6px] cursor-pointer",
                    activeTab === "compatible"
                      ? "bg-white text-[#065f46] shadow-xs"
                      : "text-[#514537] hover:text-[#1b1c1a]"
                  )}
                >
                  <span>متوافق</span>
                  <span className="text-[11px] px-[6px] py-[1px] rounded-full bg-[#f0eeea] text-[#514537] font-bold">
                    {compatibleCount}
                  </span>
                </button>

                {/* Tab Needs Review */}
                <button
                  type="button"
                  onClick={() => setActiveTab("needs_review")}
                  className={cn(
                    "px-[16px] py-[6px] rounded-[6px] text-[13px] font-semibold transition-all flex items-center gap-[6px] cursor-pointer",
                    activeTab === "needs_review"
                      ? "bg-white text-[#78350f] shadow-xs"
                      : "text-[#514537] hover:text-[#1b1c1a]"
                  )}
                >
                  <span>يحتاج مراجعة</span>
                  <span className="text-[11px] px-[6px] py-[1px] rounded-full bg-[#f0eeea] text-[#514537] font-bold">
                    {reviewCount}
                  </span>
                </button>
              </div>

              {/* Page Limit Selector (Left in RTL) */}
              <div className="flex items-center gap-[8px] text-[13px] text-[#514537]">
                <span>عرض الصفحة:</span>
                <div className="relative">
                  <select
                    className="bg-[#f5f3ef] border border-[#eae8e4] text-[#1b1c1a] text-[13px] font-semibold rounded-[4px] ps-[12px] pe-[28px] py-[6px] appearance-none cursor-pointer focus:outline-none"
                    defaultValue="10"
                  >
                    <option value="10">10 سجلات</option>
                    <option value="25">25 سجل</option>
                    <option value="50">50 سجل</option>
                  </select>
                  <ChevronDown className="absolute top-1/2 -translate-y-1/2 end-[8px] size-[14px] text-[#837565] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Search Bar (Figma 1:19096) */}
            <div className="px-[20px] py-[14px] border-b border-[#eae8e4]">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="البحث في إعدادات السيرفر أو اسم المتغير..."
                  className="w-full bg-[#f5f3ef] text-[#1b1c1a] placeholder-[#837565] text-[13px] rounded-[6px] ps-[16px] pe-[40px] py-[10px] border border-transparent focus:border-[#9c6402] focus:bg-white focus:outline-none transition-all"
                />
                <Search className="absolute top-1/2 -translate-y-1/2 end-[14px] size-[16px] text-[#837565]" />
              </div>
            </div>

            {/* Structured Server Directives Table (Figma 1:19103) */}
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-[#f5f3ef]/70 text-[#514537] text-[13px] font-bold border-b border-[#eae8e4]">
                    <th className="py-[14px] px-[20px] w-[60px] text-center">#</th>
                    <th className="py-[14px] px-[20px]">اسم الإعداد والمتغير</th>
                    <th className="py-[14px] px-[20px]">القيمة الحالية</th>
                    <th className="py-[14px] px-[20px]">القيمة الموصى بها</th>
                    <th className="py-[14px] px-[20px] text-center w-[140px]">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eae8e4] text-[14px] text-[#1b1c1a]">
                  {filteredDirectives.map((directive) => {
                    const isWarning = directive.status === "needs_review";
                    return (
                      <tr
                        key={directive.id}
                        className={cn(
                          "transition-colors",
                          isWarning
                            ? "bg-[rgba(255,251,235,0.4)] hover:bg-[rgba(255,251,235,0.7)]"
                            : "hover:bg-[#faf9f6]"
                        )}
                      >
                        {/* Order Number */}
                        <td className="py-[18px] px-[20px] text-center font-mono text-[13px] text-[#514537]">
                          {directive.orderNumber}
                        </td>

                        {/* Title & Variable Name */}
                        <td className="py-[18px] px-[20px]">
                          <div className="flex flex-col gap-[2px]">
                            <span className="font-semibold text-[#1b1c1a] text-[14px]">
                              {directive.title}
                            </span>
                            <span className="font-mono text-[12px] text-[#837565]">
                              {directive.directiveName}
                            </span>
                          </div>
                        </td>

                        {/* Current Value */}
                        <td className="py-[18px] px-[20px]">
                          <span
                            className={cn(
                              "font-mono font-bold text-[12px] px-[10px] py-[3px] rounded-[3px] inline-block",
                              isWarning
                                ? "bg-[#fef3c7] text-[#78350f]"
                                : "bg-[#f0eeea] text-[#1b1c1a]"
                            )}
                          >
                            {directive.currentValue}
                          </span>
                        </td>

                        {/* Recommended Value */}
                        <td className="py-[18px] px-[20px]">
                          <div className="flex flex-col gap-[2px]">
                            <span className="font-semibold text-[#514537] text-[12px]">
                              {directive.recommendedValue}
                            </span>
                            {directive.recommendedNote && (
                              <span className="text-[11px] font-normal text-[#92400e]">
                                {directive.recommendedNote}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-[18px] px-[20px] text-center">
                          {isWarning ? (
                            <span className="inline-flex items-center gap-[4px] bg-[#fef3c7] text-[#78350f] text-[11px] font-bold px-[10px] py-[4px] rounded-[3px]">
                              <AlertTriangle className="size-[12px] text-[#78350f]" />
                              <span>يحتاج مراجعة</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-[4px] bg-[#d1fae5] text-[#065f46] text-[11px] font-bold px-[10px] py-[4px] rounded-[3px]">
                              <CheckCircle2 className="size-[12px] text-[#059669]" />
                              <span>متوافق</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer (Figma 1:19054) */}
            <div className="p-[16px] px-[20px] border-t border-[#eae8e4] flex flex-col sm:flex-row items-center justify-between gap-[12px]">
              <span className="text-[13px] text-[#514537]">
                عرض 1 إلى {filteredDirectives.length} من أصل {directives.length} إعدادات فنية مسجلة
              </span>

              <div className="flex items-center gap-[4px]">
                <button
                  type="button"
                  disabled
                  className="px-[12px] py-[6px] text-[12px] font-medium rounded-[4px] border border-[#eae8e4] bg-[#f5f3ef] text-[#837565] opacity-60 cursor-not-allowed"
                >
                  السابق
                </button>
                <button
                  type="button"
                  className="size-[32px] text-[12px] font-bold rounded-[4px] bg-[#9c6402] text-white flex items-center justify-center shadow-xs"
                >
                  1
                </button>
                <button
                  type="button"
                  className="size-[32px] text-[12px] font-medium rounded-[4px] border border-[#eae8e4] text-[#1b1c1a] hover:bg-[#f5f3ef] flex items-center justify-center transition-colors"
                >
                  2
                </button>
                <button
                  type="button"
                  className="size-[32px] text-[12px] font-medium rounded-[4px] border border-[#eae8e4] text-[#1b1c1a] hover:bg-[#f5f3ef] flex items-center justify-center transition-colors"
                >
                  3
                </button>
                <span className="px-[4px] text-[#837565]">...</span>
                <button
                  type="button"
                  className="size-[32px] text-[12px] font-medium rounded-[4px] border border-[#eae8e4] text-[#1b1c1a] hover:bg-[#f5f3ef] flex items-center justify-center transition-colors"
                >
                  16
                </button>
                <button
                  type="button"
                  className="px-[12px] py-[6px] text-[12px] font-medium rounded-[4px] border border-[#eae8e4] bg-white text-[#1b1c1a] hover:bg-[#f5f3ef] transition-colors cursor-pointer"
                >
                  التالي
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
