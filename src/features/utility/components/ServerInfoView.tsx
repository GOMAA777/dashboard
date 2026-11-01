"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Search, ChevronDown, CheckCircle2, AlertTriangle } from "lucide-react";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { initialServerDirectives } from "../data/initialServerDirectives";
import { ServerDirectiveItem } from "../types/server-info.types";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { fetchServerInfo } from "@/lib/api/settings";
import { unwrapList, asString } from "@/lib/api/helpers";

export function ServerInfoView() {
  const { direction, isEn } = useLanguage();
  const [directives, setDirectives] = useState<ServerDirectiveItem[]>(initialServerDirectives);
  const [activeTab, setActiveTab] = useState<"all" | "compatible" | "needs_review">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchServerInfo()
      .then((payload) => {
        if (cancelled) return;
        const list = unwrapList<Record<string, unknown>>(payload);
        if (list.length === 0) return;
        setDirectives(
          list.map((item, idx) => {
            const statusRaw = asString(item.status, "compatible").toLowerCase();
            return {
              id: asString(item.id, String(idx + 1)),
              orderNumber: idx + 1,
              title: asString(item.title || item.name, "Directive"),
              directiveName: asString(item.directive || item.key, "php.ini"),
              currentValue: asString(item.current_value || item.value, "—"),
              recommendedValue: asString(item.recommended_value || item.recommended, "—"),
              status: statusRaw.includes("review") || statusRaw.includes("warn")
                ? ("needs_review" as const)
                : ("compatible" as const),
            };
          })
        );
      })
      .catch(() => {
        // Keep mock directives if API unavailable.
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
      dir={direction}
      className="flex h-screen bg-[#f5f3ef] dark:bg-[#1a120d] font-sans antialiased overflow-hidden selection:bg-[#ffddb6]/30 selection:text-[#643f00]"
    >
      {/* 1. Global Navigation Sidebar */}
      <DashboardSidebar activeNav="utility" activeSubNav="server-info" />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <DashboardTopNavbar />

        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 py-6 max-w-[1360px] w-full mx-auto pb-24 sm:pb-28 space-y-6 scrollbar-thin">
          {/* Main Identity & Command Banner (Figma 1:19057) */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-[4px] text-start">
              <h1 className="text-[28px] leading-[38px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {isEn ? "Server Information" : "معلومات السيرفر"}
              </h1>
              <p className="text-[14px] leading-[22px] font-normal text-[#514537] dark:text-[#cdc5bd]">
                {isEn
                  ? "Inspect and monitor the technical environment, application server configurations, and system compatibility"
                  : "فحص ومراقبة البيئة التقنية وإعدادات خادم التطبيق وتوافقها مع متطلبات النظام"}
              </p>
            </div>
          </div>

          {/* Main Card (Figma 1:19069) */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col overflow-hidden">
            {/* Card Controls Toolbar: Tabs & Page Limit (Figma 1:19071) */}
            <div className="p-[20px] pb-[16px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px] border-b border-[#eae8e4] dark:border-[#38271c]">
              {/* Tabs Filter */}
              <div className="flex items-center bg-[#f5f3ef] dark:bg-[#1a120d] p-[4px] rounded-[8px] border border-[#eae8e4] dark:border-[#38271c]">
                {/* Tab All */}
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={cn(
                    "px-[16px] py-[6px] rounded-[6px] text-[13px] font-semibold transition-all flex items-center gap-[6px] cursor-pointer",
                    activeTab === "all"
                      ? "bg-white dark:bg-[#281c15] text-[#9c6402] dark:text-[#e29d38] shadow-xs"
                      : "text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7]"
                  )}
                >
                  <span>{isEn ? "All" : "الكل"}</span>
                  <span className="text-[11px] px-[6px] py-[1px] rounded-full bg-[#f0eeea] dark:bg-[#38271c] text-[#7b4e00] dark:text-[#e29d38] font-bold">
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
                      ? "bg-white dark:bg-[#281c15] text-[#065f46] dark:text-emerald-400 shadow-xs"
                      : "text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7]"
                  )}
                >
                  <span>{isEn ? "Compatible" : "متوافق"}</span>
                  <span className="text-[11px] px-[6px] py-[1px] rounded-full bg-[#f0eeea] dark:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] font-bold">
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
                      ? "bg-white dark:bg-[#281c15] text-[#78350f] dark:text-amber-400 shadow-xs"
                      : "text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7]"
                  )}
                >
                  <span>{isEn ? "Needs Review" : "يحتاج مراجعة"}</span>
                  <span className="text-[11px] px-[6px] py-[1px] rounded-full bg-[#f0eeea] dark:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] font-bold">
                    {reviewCount}
                  </span>
                </button>
              </div>

              {/* Page Limit Selector */}
              <div className="flex items-center gap-[8px] text-[13px] text-[#514537] dark:text-[#cdc5bd]">
                <span>{isEn ? "Page size:" : "عرض الصفحة:"}</span>
                <div className="w-[130px]">
                  <DashboardSelect
                    className="h-[36px] text-[12px] bg-[#f5f3ef] dark:bg-[#1a120d] border-[#eae8e4] dark:border-[#38271c]"
                    defaultValue="10"
                  >
                    <option value="10">{isEn ? "10 records" : "10 سجلات"}</option>
                    <option value="25">{isEn ? "25 records" : "25 سجل"}</option>
                    <option value="50">{isEn ? "50 records" : "50 سجل"}</option>
                  </DashboardSelect>
                </div>
              </div>
            </div>

            {/* Search Bar (Figma 1:19096) */}
            <div className="px-[20px] py-[14px] border-b border-[#eae8e4] dark:border-[#38271c]">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isEn ? "Search server settings or directive names..." : "البحث في إعدادات السيرفر أو اسم المتغير..."}
                  className="w-full bg-[#f5f3ef] dark:bg-[#1a120d] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder-[#837565] dark:placeholder-[#8e8680] text-[13px] rounded-[6px] ps-[16px] pe-[40px] py-[10px] border border-transparent dark:border-[#38271c] focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#281c15] focus:outline-none transition-all"
                />
                <Search className="absolute top-1/2 -translate-y-1/2 end-[14px] size-[16px] text-[#837565] dark:text-[#8e8680]" />
              </div>
            </div>

            {/* Structured Server Directives Table (Figma 1:19103) */}
            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse">
                <thead>
                  <tr className="bg-[#f5f3ef]/70 dark:bg-[#1a120d]/80 text-[#514537] dark:text-[#cdc5bd] text-[13px] font-bold border-b border-[#eae8e4] dark:border-[#38271c]">
                    <th className="py-[14px] px-[20px] w-[60px] text-center">#</th>
                    <th className="py-[14px] px-[20px] text-start">{isEn ? "Setting & Directive Name" : "اسم الإعداد والمتغير"}</th>
                    <th className="py-[14px] px-[20px] text-start">{isEn ? "Current Value" : "القيمة الحالية"}</th>
                    <th className="py-[14px] px-[20px] text-start">{isEn ? "Recommended Value" : "القيمة الموصى بها"}</th>
                    <th className="py-[14px] px-[20px] text-center w-[140px]">{isEn ? "Status" : "الحالة"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eae8e4] dark:divide-[#38271c] text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {filteredDirectives.map((directive) => {
                    const isWarning = directive.status === "needs_review";
                    return (
                      <tr
                        key={directive.id}
                        className={cn(
                          "transition-colors",
                          isWarning
                            ? "bg-[rgba(255,251,235,0.4)] dark:bg-amber-950/20 hover:bg-[rgba(255,251,235,0.7)] dark:hover:bg-amber-950/30"
                            : "hover:bg-[#faf9f6] dark:hover:bg-[#281c15]/60"
                        )}
                      >
                        {/* Order Number */}
                        <td className="py-[18px] px-[20px] text-center font-mono text-[13px] text-[#514537] dark:text-[#8e8680]">
                          {directive.orderNumber}
                        </td>

                        {/* Title & Variable Name */}
                        <td className="py-[18px] px-[20px] text-start">
                          <div className="flex flex-col gap-[2px]">
                            <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-[14px]">
                              {directive.title}
                            </span>
                            <span className="font-mono text-[12px] text-[#837565] dark:text-[#8e8680]">
                              {directive.directiveName}
                            </span>
                          </div>
                        </td>

                        {/* Current Value */}
                        <td className="py-[18px] px-[20px] text-start">
                          <span
                            className={cn(
                              "font-mono font-bold text-[12px] px-[10px] py-[3px] rounded-[3px] inline-block",
                              isWarning
                                ? "bg-[#fef3c7] dark:bg-amber-950/60 text-[#78350f] dark:text-amber-400 border border-transparent dark:border-amber-800/40"
                                : "bg-[#f0eeea] dark:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7]"
                            )}
                          >
                            {directive.currentValue}
                          </span>
                        </td>

                        {/* Recommended Value */}
                        <td className="py-[18px] px-[20px] text-start">
                          <div className="flex flex-col gap-[2px]">
                            <span className="font-semibold text-[#514537] dark:text-[#cdc5bd] text-[12px]">
                              {directive.recommendedValue}
                            </span>
                            {directive.recommendedNote && (
                              <span className="text-[11px] font-normal text-[#92400e] dark:text-amber-400">
                                {directive.recommendedNote}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-[18px] px-[20px] text-center">
                          {isWarning ? (
                            <span className="inline-flex items-center gap-[4px] bg-[#fef3c7] dark:bg-amber-950/60 text-[#78350f] dark:text-amber-400 border border-transparent dark:border-amber-800/40 text-[11px] font-bold px-[10px] py-[4px] rounded-[3px]">
                              <AlertTriangle className="size-[12px] text-[#78350f] dark:text-amber-400" />
                              <span>{isEn ? "Needs Review" : "يحتاج مراجعة"}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-[4px] bg-[#d1fae5] dark:bg-emerald-950/60 text-[#065f46] dark:text-emerald-400 border border-transparent dark:border-emerald-800/40 text-[11px] font-bold px-[10px] py-[4px] rounded-[3px]">
                              <CheckCircle2 className="size-[12px] text-[#059669] dark:text-emerald-400" />
                              <span>{isEn ? "Compatible" : "متوافق"}</span>
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
            <div className="p-[16px] px-[20px] border-t border-[#eae8e4] dark:border-[#38271c] flex flex-col sm:flex-row items-center justify-between gap-[12px]">
              <span className="text-[13px] text-[#514537] dark:text-[#cdc5bd]">
                {isEn
                  ? `Showing 1 to ${filteredDirectives.length} of ${directives.length} registered technical directives`
                  : `عرض 1 إلى ${filteredDirectives.length} من أصل ${directives.length} إعدادات فنية مسجلة`}
              </span>

              <div className="flex items-center gap-[4px]">
                <button
                  type="button"
                  disabled
                  className="px-[12px] py-[6px] text-[12px] font-medium rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] bg-[#f5f3ef] dark:bg-[#1a120d] text-[#837565] dark:text-[#8e8680] opacity-60 cursor-not-allowed"
                >
                  {isEn ? "Previous" : "السابق"}
                </button>
                <button
                  type="button"
                  className="size-[32px] text-[12px] font-bold rounded-[4px] bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] flex items-center justify-center shadow-xs"
                >
                  1
                </button>
                <button
                  type="button"
                  className="size-[32px] text-[12px] font-medium rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] flex items-center justify-center transition-colors"
                >
                  2
                </button>
                <button
                  type="button"
                  className="size-[32px] text-[12px] font-medium rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] flex items-center justify-center transition-colors"
                >
                  3
                </button>
                <span className="px-[4px] text-[#837565] dark:text-[#8e8680]">...</span>
                <button
                  type="button"
                  className="size-[32px] text-[12px] font-medium rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] flex items-center justify-center transition-colors"
                >
                  16
                </button>
                <button
                  type="button"
                  className="px-[12px] py-[6px] text-[12px] font-medium rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] bg-white dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#38271c] transition-colors cursor-pointer"
                >
                  {isEn ? "Next" : "التالي"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
