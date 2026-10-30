"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  PenSquare,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  DollarSign,
} from "lucide-react";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { initialCurrencies } from "../data/initialCurrencies";
import { CurrencyItem } from "../types/currency-settings.types";
import { CurrencyEmptyState } from "./CurrencyEmptyState";
import { AddCurrencyView } from "./AddCurrencyView";
import { DeleteCurrencyModal } from "./DeleteCurrencyModal";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";
import { PageSizeDropdown } from "@/components/shared/PageSizeDropdown";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { toast } from "sonner";

export function CurrencySettingsView() {
  const [currencies, setCurrencies] = useState<CurrencyItem[]>(initialCurrencies);
  const [currentView, setCurrentView] = useState<"list" | "add">("list");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">("all");
  const [baseFilter, setBaseFilter] = useState<"all" | "base" | "secondary">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [currencyToDelete, setCurrencyToDelete] = useState<CurrencyItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Tab count stats
  const activeCount = useMemo(() => currencies.filter((c) => c.status === "active").length, [currencies]);
  const inactiveCount = useMemo(() => currencies.filter((c) => c.status === "inactive").length, [currencies]);

  // Filtered currencies
  const filteredCurrencies = useMemo(() => {
    return currencies.filter((c) => {
      // Tab status filter
      if (activeTab === "active" && c.status !== "active") return false;
      if (activeTab === "inactive" && c.status !== "inactive") return false;

      // Base filter from drawer
      if (baseFilter === "base" && !c.isBaseCurrency) return false;
      if (baseFilter === "secondary" && c.isBaseCurrency) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesCode = c.code.toLowerCase().includes(q);
        const matchesSymbol = c.symbol.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesSymbol) return false;
      }

      return true;
    });
  }, [currencies, activeTab, baseFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredCurrencies.length / pageSize));
  const safePageIndex = Math.min(pageIndex, totalPages - 1);
  const pagedCurrencies = filteredCurrencies.slice(
    safePageIndex * pageSize,
    (safePageIndex + 1) * pageSize
  );
  const startItem = filteredCurrencies.length === 0 ? 0 : safePageIndex * pageSize + 1;
  const endItem = Math.min((safePageIndex + 1) * pageSize, filteredCurrencies.length);

  const handleDeleteConfirm = (currency: CurrencyItem) => {
    if (currency.isBaseCurrency) {
      toast.error("لا يمكن حذف عملة الأساس للمنظومة");
      setCurrencyToDelete(null);
      return;
    }

    setIsDeleting(true);
    setTimeout(() => {
      setCurrencies((prev) => prev.filter((c) => c.id !== currency.id));
      setIsDeleting(false);
      setCurrencyToDelete(null);
      toast.success(`تم حذف العملة «${currency.name}» بنجاح`);
    }, 400);
  };

  const handleSaveNewCurrency = (newCurrency: CurrencyItem) => {
    setCurrencies((prev) => [newCurrency, ...prev]);
  };

  const hasActiveFilters =
    activeTab !== "all" || baseFilter !== "all" || Boolean(searchQuery);

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveTab("all");
    setBaseFilter("all");
    setPageIndex(0);
  };

  // Comprehensive Drawer Filter Content
  const drawerContent = (
    <div className="space-y-4 text-start font-['Cairo',sans-serif]">
      {/* 1. Status Filter */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          الحالة التشغيلية
        </label>
        <DashboardSelect
          value={activeTab}
          onChange={(e) => {
            setActiveTab(e.target.value as "all" | "active" | "inactive");
            setPageIndex(0);
          }}
        >
          <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">كل العملات ({currencies.length})</option>
          <option value="active" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">العملات النشطة فقط ({activeCount})</option>
          <option value="inactive" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">العملات غير النشطة ({inactiveCount})</option>
        </DashboardSelect>
      </div>

      {/* 2. Base Currency Filter */}
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          تصنيف عملة الأساس
        </label>
        <DashboardSelect
          value={baseFilter}
          onChange={(e) => {
            setBaseFilter(e.target.value as "all" | "base" | "secondary");
            setPageIndex(0);
          }}
        >
          <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">كافة العملات</option>
          <option value="base" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">عملة الأساس فقط (USD)</option>
          <option value="secondary" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">العملات التابعة والفرعية</option>
        </DashboardSelect>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen h-dvh bg-[#f5f3ef] dark:bg-[#17120e] text-[#1b1c1a] dark:text-[#fdfbf7] font-sans antialiased overflow-hidden selection:bg-[#ffddb6]/30 selection:text-[#643f00] transition-colors duration-200">
      {/* 1. Global Navigation Sidebar */}
      <DashboardSidebar activeNav="system-settings" activeSubNav="currency" />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <DashboardTopNavbar />

        {currentView === "add" ? (
          <AddCurrencyView
            onBack={() => setCurrentView("list")}
            onSave={handleSaveNewCurrency}
          />
        ) : (
          <main className="flex-1 overflow-y-auto px-[24px] sm:px-[32px] py-[24px] max-w-[1360px] w-full mx-auto pb-[80px] scrollbar-thin">
            <DashboardPageTransition>
              <>
                {/* Top Identity & Command Banner (Figma 1:17292) */}
                <div className="bg-white dark:bg-[#221812] rounded-[8px] p-[24px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] relative mb-[24px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px]">
                  {/* Title & Description */}
                  <div className="flex flex-col gap-[4px] text-start">
                    <h1 className="text-[28px] leading-[38px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      إعدادات العملة
                    </h1>
                    <p className="text-[14px] leading-[22px] font-normal text-[#514537] dark:text-[#a89f91]">
                      إدارة العملات المعتمدة، أسعار التحويل، ومعدلات الدقة المحاسبية لجميع المكاتب المرتبطة.
                    </p>
                  </div>

                  {/* Action Button: إضافة عملة جديدة (Gold) */}
                  <button
                    type="button"
                    onClick={() => setCurrentView("add")}
                    className="bg-[#9c6402] hover:bg-[#835401] active:bg-[#6c4501] text-white px-[20px] py-[10px] rounded-[6px] font-semibold text-[14px] flex items-center gap-[8px] transition-all shadow-sm cursor-pointer shrink-0"
                  >
                    <Plus className="size-[18px]" />
                    <span>إضافة عملة جديدة</span>
                  </button>
                </div>

                {/* Unified Filter Bar (Search Right, Pills & Small Filter Drawer Left in RTL) */}
                <div className="mb-[16px]">
                  <UnifiedFilterBar
                    searchQuery={searchQuery}
                    onSearchChange={(q) => {
                      setSearchQuery(q);
                      setPageIndex(0);
                    }}
                    searchPlaceholder="ابحث باسم العملة، الكود، أو الرمز..."
                    primaryFilterValue={activeTab}
                    onPrimaryFilterChange={(v) => {
                      setActiveTab(v as "all" | "active" | "inactive");
                      setPageIndex(0);
                    }}
                    primaryFilterOptions={[
                      { label: `الكل (${currencies.length})`, value: "all" },
                      { label: `نشطة (${activeCount})`, value: "active" },
                      { label: `غير نشطة (${inactiveCount})`, value: "inactive" },
                    ]}
                    hasActiveFilters={hasActiveFilters}
                    onReset={handleResetFilters}
                    drawerTitle="تصفية العملات وأسعار الصرف"
                    drawerDescription="تخصيص معايير فلترة العملات المعتمدة ومعدلات الصرف"
                    drawerContent={drawerContent}
                    actionButton={
                      <div className="flex items-center gap-3 border-s border-[#eae8e4] dark:border-[#38271c] ps-3">
                        {/* Dollar / Base Currency Filter on Left */}
                        <div className="w-[145px]">
                          <DashboardSelect
                            value={baseFilter}
                            onChange={(e) => {
                              setBaseFilter(e.target.value as "all" | "base" | "secondary");
                              setPageIndex(0);
                            }}
                            className="h-[36px] text-[12px] rounded-[6px] pe-[36px]"
                            aria-label="فلتر عملة الأساس (الدولار)"
                          >
                            <option value="all">كل العملات</option>
                            <option value="base">دولار الأساس (USD)</option>
                            <option value="secondary">العملات التابعة</option>
                          </DashboardSelect>
                        </div>

                        {/* Page Size */}
                        <div className="flex items-center gap-2 border-s border-[#eae8e4] dark:border-[#38271c] ps-3">
                          <span className="text-[12px] font-semibold text-[#837565] dark:text-[#8e8680] whitespace-nowrap">
                            الترقيم:
                          </span>
                          <PageSizeDropdown
                            value={pageSize}
                            onChange={(newSize) => {
                              setPageSize(newSize);
                              setPageIndex(0);
                            }}
                            options={[5, 10, 20, 50]}
                            dropdownPlacement="bottom"
                          />
                        </div>
                      </div>
                    }
                  />
                </div>

                {/* Main Table Card (Figma 1:17292 / Empty State 1:17887) */}
                <div className="bg-white dark:bg-[#221812] rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col overflow-hidden">
                  {/* Table or Empty State */}
                  {filteredCurrencies.length === 0 ? (
                    <CurrencyEmptyState onAddCurrency={() => setCurrentView("add")} />
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-start border-collapse">
                          <thead>
                            <tr className="bg-[#f5f3ef]/70 dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] text-[13px] font-semibold border-b border-[#eae8e4] dark:border-[#38271c]">
                              <th className="py-[14px] px-[20px] text-start w-[60px]">#</th>
                              <th className="py-[14px] px-[20px] text-start">اسم العملة والدولة</th>
                              <th className="py-[14px] px-[20px] text-start">كود العملة</th>
                              <th className="py-[14px] px-[20px] text-start">الرمز</th>
                              <th className="py-[14px] px-[20px] text-start">سعر الصرف مقابل الأساس (USD)</th>
                              <th className="py-[14px] px-[20px] text-start">الحالة التشغيلية</th>
                              <th className="py-[14px] px-[20px] text-center w-[120px]">الإجراءات</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#eae8e4] dark:divide-[#38271c] text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {pagedCurrencies.map((currency) => (
                              <tr
                                key={currency.id}
                                className="hover:bg-[#faf9f6] dark:hover:bg-[#281c15]/60 transition-colors"
                              >
                                {/* Order Number */}
                                <td className="py-[16px] px-[20px] text-start text-[#837565] dark:text-[#a89f91] font-mono text-[13px]">
                                  {currency.orderNumber}
                                </td>

                                {/* Name */}
                                <td className="py-[16px] px-[20px] text-start font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                                  <div className="flex items-center gap-2">
                                    <span>{currency.name}</span>
                                    {currency.isBaseCurrency && (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#9c6402]/10 dark:bg-[#9c6402]/25 text-[#9c6402] dark:text-[#f3c27e] border border-[#9c6402]/20">
                                        عملة الأساس
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* Code Badge (Strictly aligned under header, visible in light & dark) */}
                                <td className="py-[16px] px-[20px] text-start">
                                  <span className="bg-[#f0eeea] dark:bg-[#2c221c] text-[#1b1c1a] dark:text-[#fdfbf7] border border-transparent dark:border-[#38271c] font-mono font-bold text-[11px] px-[8px] py-[3px] rounded-[4px] inline-block tracking-wider" dir="ltr">
                                    {currency.code}
                                  </span>
                                </td>

                                {/* Symbol (Strictly aligned under header) */}
                                <td className="py-[16px] px-[20px] text-start font-semibold text-[#514537] dark:text-[#cdc5bd]">
                                  {currency.symbol}
                                </td>

                                {/* Exchange Rate */}
                                <td className="py-[16px] px-[20px] text-start text-[#1b1c1a] dark:text-[#fdfbf7] font-medium font-mono text-[13px]" dir="ltr">
                                  <div className="flex items-center gap-1.5 rtl:justify-end ltr:justify-start">
                                    <span>{currency.exchangeRate}</span>
                                  </div>
                                </td>

                                {/* Operational Status (High contrast in both light & dark mode) */}
                                <td className="py-[16px] px-[20px] text-start">
                                  {currency.status === "active" ? (
                                    <span className="inline-flex items-center gap-[6px] bg-[#ecfdf5] dark:bg-[#132c21] text-[#065f46] dark:text-[#6ee7b7] border border-emerald-200 dark:border-emerald-500/30 text-[12px] font-semibold px-[10px] py-[3px] rounded-full shadow-2xs">
                                      <span className="size-[6px] rounded-full bg-[#059669] dark:bg-[#10b981]" />
                                      <span>نشطة</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-[6px] bg-[#f5f3ef] dark:bg-[#281c15] text-[#78716c] dark:text-[#d6cfc7] border border-[#e7e5e4] dark:border-[#44372e] text-[12px] font-semibold px-[10px] py-[3px] rounded-full shadow-2xs">
                                      <span className="size-[6px] rounded-full bg-[#a8a29e] dark:bg-[#837565]" />
                                      <span>غير نشطة</span>
                                    </span>
                                  )}
                                </td>

                                {/* Actions */}
                                <td className="py-[16px] px-[20px] text-center">
                                  <div className="flex items-center justify-center gap-[8px]">
                                    <button
                                      type="button"
                                      onClick={() => toast.info(`تعديل بيانات «${currency.name}»`)}
                                      className="size-[32px] rounded-[4px] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] text-[#514537] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] flex items-center justify-center transition-colors cursor-pointer"
                                      title="تعديل"
                                    >
                                      <PenSquare className="size-[15px]" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setCurrencyToDelete(currency)}
                                      className="size-[32px] rounded-[4px] hover:bg-[rgba(186,26,26,0.1)] dark:hover:bg-[rgba(248,113,113,0.15)] text-[#ba1a1a] dark:text-[#f87171] flex items-center justify-center transition-colors cursor-pointer"
                                      title="حذف"
                                    >
                                      <Trash2 className="size-[15px]" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Footer (Figma 1:17292) */}
                      <div className="p-[16px] px-[20px] border-t border-[#eae8e4] dark:border-[#38271c] flex flex-col sm:flex-row items-center justify-between gap-[12px]">
                        <div className="flex items-center gap-3">
                          <span className="text-[13px] text-[#514537] dark:text-[#a89f91]">
                            عرض {startItem} إلى {endItem} من أصل {filteredCurrencies.length} عملة مسجلة
                          </span>
                        </div>

                        {/* Pagination Buttons (Left in RTL) */}
                        <div className="flex items-center gap-[4px]">
                          <button
                            type="button"
                            disabled={safePageIndex === 0}
                            onClick={() => setPageIndex(0)}
                            title="الصفحة الأولى"
                            className="size-[32px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] bg-white dark:bg-[#221812] text-[#837565] dark:text-[#a89f91] hover:bg-[#eae8e4] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <ChevronsRight className="size-[14px]" />
                          </button>

                          <button
                            type="button"
                            disabled={safePageIndex === 0}
                            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                            className="px-[12px] py-[6px] text-[12px] font-medium rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] bg-[#f5f3ef] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] hover:bg-[#eae8e4] dark:hover:bg-[#34241b] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-[4px]"
                          >
                            <ChevronRight className="size-[12px]" />
                            <span>السابق</span>
                          </button>

                          {Array.from({ length: totalPages }, (_, i) => i).map((p) => {
                            const isActive = safePageIndex === p;
                            return (
                              <button
                                key={p}
                                type="button"
                                onClick={() => setPageIndex(p)}
                                className={`size-[32px] text-[12px] font-bold rounded-[4px] flex items-center justify-center transition-colors cursor-pointer ${
                                  isActive
                                    ? "bg-[#9c6402] dark:bg-[#e29d38] text-white shadow-xs"
                                    : "border border-[#eae8e4] dark:border-[#38271c] bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15]"
                                }`}
                              >
                                {p + 1}
                              </button>
                            );
                          })}

                          <button
                            type="button"
                            disabled={safePageIndex >= totalPages - 1}
                            onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
                            className="px-[12px] py-[6px] text-[12px] font-medium rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-[4px]"
                          >
                            <span>التالي</span>
                            <ChevronLeft className="size-[12px]" />
                          </button>

                          <button
                            type="button"
                            disabled={safePageIndex >= totalPages - 1}
                            onClick={() => setPageIndex(totalPages - 1)}
                            title="الصفحة الأخيرة"
                            className="size-[32px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] bg-white dark:bg-[#221812] text-[#837565] dark:text-[#a89f91] hover:bg-[#eae8e4] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <ChevronsLeft className="size-[14px]" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            </DashboardPageTransition>
          </main>
        )}
      </div>

      {/* Delete Currency Confirmation Dialog (Figma 1:18055) */}
      <DeleteCurrencyModal
        isOpen={!!currencyToDelete}
        currency={currencyToDelete}
        onClose={() => setCurrencyToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
