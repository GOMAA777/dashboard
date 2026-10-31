"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  PenSquare,
  Trash2,
  Lock,
  ShieldCheck,
  Languages,
  Pilcrow,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { initialLanguages } from "../data/initialLanguages";
import { LanguageItem } from "../types/language-settings.types";
import { LanguageEmptyState } from "./LanguageEmptyState";
import { AddLanguageView } from "./AddLanguageView";
import { DeleteLanguageModal } from "./DeleteLanguageModal";
import { toast } from "sonner";
import { PageSizeDropdown } from "@/components/shared/PageSizeDropdown";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";

export function LanguageSettingsView() {
  const [languages, setLanguages] = useState<LanguageItem[]>(initialLanguages);
  const [currentView, setCurrentView] = useState<"list" | "add">("list");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">("all");
  const [directionFilter, setDirectionFilter] = useState<"all" | "rtl" | "ltr">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [languageToDelete, setLanguageToDelete] = useState<LanguageItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtered languages
  const filteredLanguages = useMemo(() => {
    return languages.filter((l) => {
      // Tab status filter
      if (activeTab === "active" && l.status !== "active") return false;
      if (activeTab === "inactive" && l.status !== "inactive") return false;

      // Direction filter from drawer
      if (directionFilter === "rtl" && l.direction !== "rtl") return false;
      if (directionFilter === "ltr" && l.direction !== "ltr") return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = l.name.toLowerCase().includes(q);
        const matchesNative = l.nativeName?.toLowerCase().includes(q) ?? false;
        const matchesCode = l.code.toLowerCase().includes(q);
        if (!matchesName && !matchesNative && !matchesCode) return false;
      }

      return true;
    });
  }, [languages, activeTab, directionFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredLanguages.length / pageSize));
  const safePageIndex = Math.min(pageIndex, totalPages - 1);
  const pagedLanguages = filteredLanguages.slice(
    safePageIndex * pageSize,
    (safePageIndex + 1) * pageSize
  );
  const startItem = filteredLanguages.length === 0 ? 0 : safePageIndex * pageSize + 1;
  const endItem = Math.min((safePageIndex + 1) * pageSize, filteredLanguages.length);

  // Tab counts
  const activeCount = useMemo(() => languages.filter((l) => l.status === "active").length, [languages]);
  const inactiveCount = useMemo(() => languages.filter((l) => l.status === "inactive").length, [languages]);

  const hasActiveFilters = activeTab !== "all" || directionFilter !== "all" || Boolean(searchQuery);

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveTab("all");
    setDirectionFilter("all");
    setPageIndex(0);
  };

  // Drawer Content
  const drawerContent = (
    <div className="space-y-4 text-start font-['Cairo',sans-serif]">
      {/* 1. Status Filter */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          الحالة التشغيلية
        </label>
        <select
          value={activeTab}
          onChange={(e) => {
            setActiveTab(e.target.value as "all" | "active" | "inactive");
            setPageIndex(0);
          }}
          className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] px-[12px] border border-[#eae8e4] dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] cursor-pointer"
        >
          <option value="all">كل اللغات ({languages.length})</option>
          <option value="active">اللغات النشطة فقط ({activeCount})</option>
          <option value="inactive">اللغات المعطلة ({inactiveCount})</option>
        </select>
      </div>

      {/* 2. Direction Filter */}
      <div className="space-y-1.5">
        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
          اتجاه النص (Direction)
        </label>
        <select
          value={directionFilter}
          onChange={(e) => {
            setDirectionFilter(e.target.value as "all" | "rtl" | "ltr");
            setPageIndex(0);
          }}
          className="w-full h-[40px] bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] px-[12px] border border-[#eae8e4] dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] cursor-pointer"
        >
          <option value="all">كافة الاتجاهات (الكل)</option>
          <option value="rtl">RTL (من اليمين إلى اليسار)</option>
          <option value="ltr">LTR (من اليسار إلى اليمين)</option>
        </select>
      </div>
    </div>
  );

  const handleDeleteConfirm = (language: LanguageItem) => {
    if (language.isDefault) {
      toast.error("لا يمكن حذف لغة النظام الافتراضية");
      setLanguageToDelete(null);
      return;
    }

    setIsDeleting(true);
    setTimeout(() => {
      setLanguages((prev) => prev.filter((l) => l.id !== language.id));
      setIsDeleting(false);
      setLanguageToDelete(null);
      toast.success(`تم حذف اللغة «${language.name}» بنجاح`);
    }, 400);
  };

  const handleSaveNewLanguage = (newLanguage: LanguageItem) => {
    setLanguages((prev) => [newLanguage, ...prev]);
  };

  return (
    <div className="flex h-screen h-dvh bg-[#f5f3ef] dark:bg-[#1a120d] text-[#1b1c1a] dark:text-[#fdfbf7] font-sans antialiased overflow-hidden selection:bg-[#ffddb6]/30 selection:text-[#643f00]">
      {/* 1. Global Navigation Sidebar */}
      <DashboardSidebar activeNav="system-settings" activeSubNav="language" />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <DashboardTopNavbar />

        {currentView === "add" ? (
          <AddLanguageView
            onBack={() => setCurrentView("list")}
            onSave={handleSaveNewLanguage}
          />
        ) : (
          <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 py-6 max-w-[1360px] w-full mx-auto pb-24 sm:pb-28 space-y-6 scrollbar-thin">
            <DashboardPageTransition>
              <div className="space-y-6 w-full">
                {/* Top Identity & Command Banner (Figma 1:18083) */}
                <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Title & Description */}
                  <div className="flex flex-col gap-[4px] text-start">
                    <h1 className="text-[28px] leading-[38px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      إعدادات اللغة
                    </h1>
                    <p className="text-[14px] leading-[22px] font-normal text-[#514537] dark:text-[#a89f91]">
                      إدارة وتفعيل حزم اللغات المعتمدة لدعم الترجمة المؤسسية وسير العمل القضائي والقانوني.
                    </p>
                  </div>

                  {/* Action Button: إضافة لغة جديدة (Gold) */}
                  <button
                    type="button"
                    onClick={() => setCurrentView("add")}
                    className="bg-[#9c6402] hover:bg-[#835401] active:bg-[#6c4501] text-white px-[20px] py-[10px] rounded-[6px] font-semibold text-[14px] flex items-center gap-[8px] transition-all shadow-sm cursor-pointer shrink-0"
                  >
                    <Plus className="size-[18px]" />
                    <span>إضافة لغة جديدة</span>
                  </button>
                </div>

                {/* Informational System Default Banner (Figma 1:18083) */}
                <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Right Side: Translation Icon & Information */}
                  <div className="flex items-center gap-[16px] text-start">
                    <div className="size-[48px] rounded-[10px] bg-[rgba(255,221,182,0.4)] dark:bg-[rgba(226,157,56,0.18)] text-[#9c6402] dark:text-[#e29d38] flex items-center justify-center shrink-0">
                      <Languages className="size-[24px]" />
                    </div>
                    <div className="flex flex-col gap-[4px]">
                      <div className="flex items-center gap-[8px]">
                        <span className="text-[15px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                          اللغة الافتراضية للنظام: العربية (ar)
                        </span>
                        <span className="bg-[#ecfdf5] dark:bg-[#132c1c] text-[#065f46] dark:text-[#6ee7b7] border border-emerald-200 dark:border-emerald-500/40 text-[11px] font-bold px-[8px] py-[2px] rounded-[4px] flex items-center gap-[4px]">
                          <span className="size-[5px] rounded-full bg-[#059669] dark:bg-[#10b981]" />
                          <span>معيار الإسناد الوطني</span>
                        </span>
                      </div>
                      <p className="text-[12px] text-[#514537] dark:text-[#cdc5bd] leading-[18px]">
                        البيئة القانونية مهيأة بالكامل للترميز الثنائي RTL و LTR بما يضمن توافق صياغة العقود ومذكرات الترافع الرقمية.
                      </p>
                    </div>
                  </div>

                  {/* Left Side: ISO Benchmark Badge */}
                  <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-[#eae8e4] dark:border-[#38271c] rounded-[6px] px-[12px] py-[6px] flex items-center gap-[6px] text-[#514537] dark:text-[#cdc5bd] shrink-0">
                    <ShieldCheck className="size-[14px] text-[#059669] dark:text-[#34d399]" />
                    <span className="text-[11px] font-mono font-bold">ISO 639-1 / BCP 47</span>
                  </div>
                </div>

                {/* Unified Filter Bar */}
                <div>
                  <UnifiedFilterBar
                    searchQuery={searchQuery}
                    onSearchChange={(q) => {
                      setSearchQuery(q);
                      setPageIndex(0);
                    }}
                    searchPlaceholder="البحث باسم اللغة، الكود، أو الاسم الأصلي..."
                    primaryFilterValue={activeTab}
                    onPrimaryFilterChange={(v) => {
                      setActiveTab(v as "all" | "active" | "inactive");
                      setPageIndex(0);
                    }}
                    primaryFilterOptions={[
                      { label: `الكل (${languages.length})`, value: "all" },
                      { label: `نشط (${activeCount})`, value: "active" },
                      { label: `غير نشط (${inactiveCount})`, value: "inactive" },
                    ]}
                    hasActiveFilters={hasActiveFilters}
                    onReset={handleResetFilters}
                    drawerTitle="تصفية اللغات المعيارية"
                    drawerDescription="تخصيص معايير فلترة حزم اللغات واتجاه النصوص"
                    drawerContent={drawerContent}
                    actionButton={
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
                    }
                  />
                </div>

                {/* Main Table Card (Figma 1:18083 / Empty State 1:18417) */}
                <div className="bg-white dark:bg-[#221812] rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col overflow-hidden">
                  {/* Table or Empty State */}
                  {filteredLanguages.length === 0 ? (
                    <LanguageEmptyState onAddLanguage={() => setCurrentView("add")} />
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-start border-collapse">
                          <thead>
                            <tr className="bg-[#f5f3ef] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] text-[13px] font-semibold border-b border-[#eae8e4] dark:border-[#38271c]">
                              <th className="py-[14px] px-[20px] w-[60px]">#</th>
                              <th className="py-[14px] px-[20px]">اسم اللغة والتصنيف</th>
                              <th className="py-[14px] px-[20px]">كود اللغة (Locale)</th>
                              <th className="py-[14px] px-[20px]">اتجاه النص</th>
                              <th className="py-[14px] px-[20px]">الحالة التشغيلية</th>
                              <th className="py-[14px] px-[20px] text-center w-[120px]">الإجراءات</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#eae8e4] dark:divide-[#38271c] text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {pagedLanguages.map((language) => (
                              <tr
                                key={language.id}
                                className="hover:bg-[#faf9f6] dark:hover:bg-[#281c15]/60 transition-colors"
                              >
                                {/* Order Number */}
                                <td className="py-[16px] px-[20px] text-[#837565] dark:text-[#a89f91] font-mono text-[13px]">
                                  {language.orderNumber}
                                </td>

                                {/* Name & Classification */}
                                <td className="py-[16px] px-[20px]">
                                  <div className="flex items-center gap-[8px]">
                                    <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                                      {language.name}
                                    </span>
                                    {language.nativeName && (
                                      <span className="text-[12px] text-[#514537] dark:text-[#a89f91]">
                                        {language.nativeName}
                                      </span>
                                    )}
                                    {language.isDefault && (
                                      <span className="inline-flex items-center gap-[4px] bg-[rgba(255,221,182,0.4)] dark:bg-[rgba(226,157,56,0.18)] text-[#9c6402] dark:text-[#e29d38] text-[10px] font-bold px-[8px] py-[2px] rounded-[3px]">
                                        <Lock className="size-[10px]" />
                                        <span>الافتراضية للنظام</span>
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* Locale Code Badge */}
                                <td className="py-[16px] px-[20px]">
                                  <div className="flex items-center gap-[6px]">
                                    <span className="bg-[#f0eeea] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] font-mono font-bold text-[11px] px-[8px] py-[3px] rounded-[4px] border border-transparent dark:border-[#38271c]">
                                      {language.code}
                                    </span>
                                    <span className="text-[10px] text-[#837565] dark:text-[#8e8680] font-mono">
                                      ISO 639-1
                                    </span>
                                  </div>
                                </td>

                                {/* Text Direction */}
                                <td className="py-[16px] px-[20px]">
                                  <div className="flex items-center gap-[6px] text-[13px] text-[#514537] dark:text-[#cdc5bd]">
                                    <span>
                                      {language.direction === "rtl"
                                        ? "RTL (يمين إلى يسار)"
                                        : "LTR (يسار إلى يمين)"}
                                    </span>
                                    <Pilcrow className="size-[14px] text-[#837565] dark:text-[#8e8680]" />
                                  </div>
                                </td>

                                {/* Operational Status */}
                                <td className="py-[16px] px-[20px]">
                                  {language.status === "active" ? (
                                    <span className="inline-flex items-center gap-[6px] bg-[#ecfdf5] dark:bg-[#132c1c] text-[#065f46] dark:text-[#6ee7b7] border border-emerald-200 dark:border-emerald-500/40 text-[12px] font-semibold px-[10px] py-[3px] rounded-full">
                                      <span className="size-[6px] rounded-full bg-[#059669] dark:bg-[#10b981]" />
                                      <span>نشطة</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-[6px] bg-[#f0eeea] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] border border-[#ded5c6] dark:border-[#38271c] text-[12px] font-medium px-[10px] py-[3px] rounded-full">
                                      <span className="size-[6px] rounded-full bg-[#837565] dark:text-[#8e8680]" />
                                      <span>غير نشطة</span>
                                    </span>
                                  )}
                                </td>

                                {/* Actions */}
                                <td className="py-[16px] px-[20px]">
                                  <div className="flex items-center justify-center gap-[8px]">
                                    <button
                                      type="button"
                                      onClick={() => toast.info(`تعديل حزمة «${language.name}»`)}
                                      className="size-[32px] rounded-[4px] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] flex items-center justify-center transition-colors cursor-pointer"
                                      title="تعديل"
                                    >
                                      <PenSquare className="size-[15px]" />
                                    </button>
                                    {language.isDefault ? (
                                      <button
                                        type="button"
                                        disabled
                                        className="size-[32px] rounded-[4px] text-[#b9b3ae] dark:text-[#6e5849] flex items-center justify-center opacity-40 cursor-not-allowed"
                                        title="لا يمكن حذف اللغة الافتراضية"
                                      >
                                        <Trash2 className="size-[15px]" />
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => setLanguageToDelete(language)}
                                        className="size-[32px] rounded-[4px] hover:bg-[rgba(186,26,26,0.1)] dark:hover:bg-rose-950/40 text-[#ba1a1a] dark:text-[#f87171] flex items-center justify-center transition-colors cursor-pointer"
                                        title="حذف"
                                      >
                                        <Trash2 className="size-[15px]" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Footer */}
                      <div className="p-[16px] px-[20px] border-t border-[#eae8e4] dark:border-[#38271c] bg-[#fcfaf7] dark:bg-[#1a120d] flex flex-col sm:flex-row items-center justify-between gap-[12px]">
                        <div className="flex items-center gap-3">
                          <span className="text-[13px] text-[#514537] dark:text-[#cdc5bd]">
                            عرض {startItem} إلى {endItem} من أصل {filteredLanguages.length} لغات مسجلة بالنظام
                          </span>

                          <div className="flex items-center gap-2 border-s border-[#eae8e4] dark:border-[#38271c] ps-3">
                            <span className="text-[11px] text-[#837565] dark:text-[#8e8680]">صفوف بالصفحة:</span>
                            <PageSizeDropdown
                              value={pageSize}
                              onChange={(newSize) => {
                                setPageSize(newSize);
                                setPageIndex(0);
                              }}
                              options={[5, 10, 20, 50]}
                              dropdownPlacement="top"
                            />
                          </div>
                        </div>

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
                                    ? "bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] shadow-xs"
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
              </div>
            </DashboardPageTransition>
          </main>
        )}
      </div>

      {/* Delete Language Confirmation Dialog (Figma 1:18783) */}
      <DeleteLanguageModal
        isOpen={!!languageToDelete}
        language={languageToDelete}
        onClose={() => setLanguageToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
