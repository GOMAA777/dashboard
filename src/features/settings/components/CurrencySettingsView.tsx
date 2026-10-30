"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  PenSquare,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { initialCurrencies } from "../data/initialCurrencies";
import { CurrencyItem } from "../types/currency-settings.types";
import { CurrencyEmptyState } from "./CurrencyEmptyState";
import { AddCurrencyView } from "./AddCurrencyView";
import { DeleteCurrencyModal } from "./DeleteCurrencyModal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PageSizeDropdown } from "@/components/shared/PageSizeDropdown";

export function CurrencySettingsView() {
  const [currencies, setCurrencies] = useState<CurrencyItem[]>(initialCurrencies);
  const [currentView, setCurrentView] = useState<"list" | "add">("list");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [currencyToDelete, setCurrencyToDelete] = useState<CurrencyItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtered currencies
  const filteredCurrencies = useMemo(() => {
    return currencies.filter((c) => {
      // Tab filter
      if (activeTab === "active" && c.status !== "active") return false;
      if (activeTab === "inactive" && c.status !== "inactive") return false;

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
  }, [currencies, activeTab, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredCurrencies.length / pageSize));
  const safePageIndex = Math.min(pageIndex, totalPages - 1);
  const pagedCurrencies = filteredCurrencies.slice(
    safePageIndex * pageSize,
    (safePageIndex + 1) * pageSize
  );
  const startItem = filteredCurrencies.length === 0 ? 0 : safePageIndex * pageSize + 1;
  const endItem = Math.min((safePageIndex + 1) * pageSize, filteredCurrencies.length);

  // Tab count stats
  const activeCount = useMemo(() => currencies.filter((c) => c.status === "active").length, [currencies]);
  const inactiveCount = useMemo(() => currencies.filter((c) => c.status === "inactive").length, [currencies]);

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

  return (
    <div className="flex h-screen h-dvh bg-[#f5f3ef] font-sans antialiased overflow-hidden selection:bg-[#ffddb6]/30 selection:text-[#643f00]">
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
            <div className="bg-white rounded-[8px] p-[24px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] relative mb-[24px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px]">
              {/* Title & Description */}
              <div className="flex flex-col gap-[4px] text-start">
                <h1 className="text-[28px] leading-[38px] font-bold text-[#1b1c1a]">
                  إعدادات العملة
                </h1>
                <p className="text-[14px] leading-[22px] font-normal text-[#514537]">
                  إدارة العملات المعتمدة، أسعار التحويل، ومعدلات الدقة المحاسبية لجميع المكاتب المرتبطة.
                </p>
              </div>

              {/* Action Button: إضافة عملة جديدة (Gold) */}
              <button
                type="button"
                onClick={() => setCurrentView("add")}
                className="bg-[#9c6402] hover:bg-[#835401] active:bg-[#6c4501] text-white px-[20px] py-[10px] rounded-[4px] font-semibold text-[14px] flex items-center gap-[8px] transition-all shadow-sm cursor-pointer shrink-0"
              >
                <Plus className="size-[18px]" />
                <span>إضافة عملة جديدة</span>
              </button>
            </div>

            {/* Main Table Card (Figma 1:17292 / Empty State 1:17887) */}
            <div className="bg-white rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] flex flex-col overflow-hidden">
              {/* Card Controls Toolbar: Tabs & Page Limit */}
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
                        ? "bg-white text-[#1b1c1a] shadow-xs"
                        : "text-[#514537] hover:text-[#1b1c1a]"
                    )}
                  >
                    <span>الكل</span>
                    <span className="text-[11px] px-[6px] py-[1px] rounded-full bg-[#eae8e4] text-[#1b1c1a] font-bold">
                      {currencies.length}
                    </span>
                  </button>

                  {/* Tab Active */}
                  <button
                    type="button"
                    onClick={() => setActiveTab("active")}
                    className={cn(
                      "px-[16px] py-[6px] rounded-[6px] text-[13px] font-semibold transition-all flex items-center gap-[6px] cursor-pointer",
                      activeTab === "active"
                        ? "bg-white text-[#1b1c1a] shadow-xs"
                        : "text-[#514537] hover:text-[#1b1c1a]"
                    )}
                  >
                    <span>نشط</span>
                    <span className="text-[11px] px-[6px] py-[1px] rounded-full bg-[#eae8e4] text-[#1b1c1a] font-bold">
                      {activeCount}
                    </span>
                  </button>

                  {/* Tab Inactive */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("inactive");
                      setPageIndex(0);
                    }}
                    className={cn(
                      "px-[16px] py-[6px] rounded-[6px] text-[13px] font-semibold transition-all flex items-center gap-[6px] cursor-pointer",
                      activeTab === "inactive"
                        ? "bg-white text-[#1b1c1a] shadow-xs"
                        : "text-[#514537] hover:text-[#1b1c1a]"
                    )}
                  >
                    <span>غير نشط</span>
                    <span className="text-[11px] px-[6px] py-[1px] rounded-full bg-[#eae8e4] text-[#1b1c1a] font-bold">
                      {inactiveCount}
                    </span>
                  </button>
                </div>
              </div>

              {/* Search Bar (Figma 1:17292) */}
              <div className="px-[20px] py-[14px] border-b border-[#eae8e4]">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="البحث باسم العملة، الكود، أو الرمز..."
                    className="w-full bg-[#f5f3ef] text-[#1b1c1a] placeholder-[#837565] text-[13px] rounded-[6px] ps-[16px] pe-[40px] py-[10px] border border-transparent focus:border-[#9c6402] focus:bg-white focus:outline-none transition-all"
                  />
                  <Search className="absolute top-1/2 -translate-y-1/2 end-[14px] size-[16px] text-[#837565]" />
                </div>
              </div>

              {/* Table or Empty State */}
              {filteredCurrencies.length === 0 ? (
                <CurrencyEmptyState onAddCurrency={() => setCurrentView("add")} />
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-start border-collapse">
                      <thead>
                        <tr className="bg-[#f5f3ef]/70 text-[#514537] text-[13px] font-semibold border-b border-[#eae8e4]">
                          <th className="py-[14px] px-[20px] w-[60px]">#</th>
                          <th className="py-[14px] px-[20px]">اسم العملة والدولة</th>
                          <th className="py-[14px] px-[20px]">كود العملة</th>
                          <th className="py-[14px] px-[20px]">الرمز</th>
                          <th className="py-[14px] px-[20px]">سعر الصرف مقابل الأساس (USD)</th>
                          <th className="py-[14px] px-[20px]">الحالة التشغيلية</th>
                          <th className="py-[14px] px-[20px] text-center w-[120px]">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eae8e4] text-[14px] text-[#1b1c1a]">
                        {pagedCurrencies.map((currency) => (
                          <tr
                            key={currency.id}
                            className="hover:bg-[#faf9f6] transition-colors"
                          >
                            {/* Order Number */}
                            <td className="py-[16px] px-[20px] text-[#837565] font-mono text-[13px]">
                              {currency.orderNumber}
                            </td>

                            {/* Name */}
                            <td className="py-[16px] px-[20px] font-bold text-[#1b1c1a]">
                              {currency.name}
                            </td>

                            {/* Code Badge */}
                            <td className="py-[16px] px-[20px]">
                              <span className="bg-[#f0eeea] text-[#1b1c1a] font-mono font-bold text-[11px] px-[8px] py-[3px] rounded-[4px]">
                                {currency.code}
                              </span>
                            </td>

                            {/* Symbol */}
                            <td className="py-[16px] px-[20px] font-semibold text-[#514537]">
                              {currency.symbol}
                            </td>

                            {/* Exchange Rate */}
                            <td className="py-[16px] px-[20px] text-[#1b1c1a] font-medium font-mono text-[13px]">
                              {currency.exchangeRate}
                            </td>

                            {/* Operational Status */}
                            <td className="py-[16px] px-[20px]">
                              {currency.status === "active" ? (
                                <span className="inline-flex items-center gap-[6px] bg-[#ecfdf5] text-[#065f46] text-[12px] font-semibold px-[10px] py-[3px] rounded-full">
                                  <span className="size-[6px] rounded-full bg-[#059669]" />
                                  <span>نشطة</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-[6px] bg-[#f0eeea] text-[#514537] text-[12px] font-medium px-[10px] py-[3px] rounded-full">
                                  <span className="size-[6px] rounded-full bg-[#837565]" />
                                  <span>غير نشطة</span>
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-[16px] px-[20px]">
                              <div className="flex items-center justify-center gap-[8px]">
                                <button
                                  type="button"
                                  onClick={() => toast.info(`تعديل بيانات «${currency.name}»`)}
                                  className="size-[32px] rounded-[4px] hover:bg-[#f5f3ef] text-[#514537] hover:text-[#1b1c1a] flex items-center justify-center transition-colors cursor-pointer"
                                  title="تعديل"
                                >
                                  <PenSquare className="size-[15px]" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setCurrencyToDelete(currency)}
                                  className="size-[32px] rounded-[4px] hover:bg-[rgba(186,26,26,0.1)] text-[#ba1a1a] flex items-center justify-center transition-colors cursor-pointer"
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
                  <div className="p-[16px] px-[20px] border-t border-[#eae8e4] flex flex-col sm:flex-row items-center justify-between gap-[12px]">
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] text-[#514537]">
                        عرض {startItem} إلى {endItem} من أصل {filteredCurrencies.length} عملة مسجلة
                      </span>

                      <div className="flex items-center gap-2 border-s border-[#eae8e4] ps-3">
                        <span className="text-[11px] text-[#837565]">صفوف بالصفحة:</span>
                        <PageSizeDropdown
                          value={pageSize}
                          onChange={(newSize) => {
                            setPageSize(newSize);
                            setPageIndex(0);
                          }}
                          options={[5, 10, 20, 50]}
                        />
                      </div>
                    </div>

                    {/* Pagination Buttons (Left in RTL) */}
                    <div className="flex items-center gap-[4px]">
                      <button
                        type="button"
                        disabled={safePageIndex === 0}
                        onClick={() => setPageIndex(0)}
                        title="الصفحة الأولى"
                        className="size-[32px] rounded-[4px] border border-[#eae8e4] text-[#837565] hover:bg-[#eae8e4] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <ChevronsRight className="size-[14px]" />
                      </button>

                      <button
                        type="button"
                        disabled={safePageIndex === 0}
                        onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                        className="px-[12px] py-[6px] text-[12px] font-medium rounded-[4px] border border-[#eae8e4] bg-[#f5f3ef] text-[#514537] hover:bg-[#eae8e4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-[4px]"
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
                                ? "bg-[#9c6402] text-white shadow-xs"
                                : "border border-[#eae8e4] text-[#1b1c1a] hover:bg-[#f5f3ef]"
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
                        className="px-[12px] py-[6px] text-[12px] font-medium rounded-[4px] border border-[#eae8e4] bg-white text-[#1b1c1a] hover:bg-[#f5f3ef] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-[4px]"
                      >
                        <span>التالي</span>
                        <ChevronLeft className="size-[12px]" />
                      </button>

                      <button
                        type="button"
                        disabled={safePageIndex >= totalPages - 1}
                        onClick={() => setPageIndex(totalPages - 1)}
                        title="الصفحة الأخيرة"
                        className="size-[32px] rounded-[4px] border border-[#eae8e4] text-[#837565] hover:bg-[#eae8e4] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
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
