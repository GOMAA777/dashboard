"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  ChevronDown,
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
import { cn } from "@/lib/utils";

export function LanguageSettingsView() {
  const [languages, setLanguages] = useState<LanguageItem[]>(initialLanguages);
  const [currentView, setCurrentView] = useState<"list" | "add">("list");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [languageToDelete, setLanguageToDelete] = useState<LanguageItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtered languages
  const filteredLanguages = useMemo(() => {
    return languages.filter((l) => {
      // Tab filter
      if (activeTab === "active" && l.status !== "active") return false;
      if (activeTab === "inactive" && l.status !== "inactive") return false;

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
  }, [languages, activeTab, searchQuery]);

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
    <div className="flex h-screen h-dvh bg-[#f5f3ef] font-sans antialiased overflow-hidden selection:bg-[#ffddb6]/30 selection:text-[#643f00]" dir="rtl">
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
          <main className="flex-1 overflow-y-auto px-[24px] sm:px-[32px] py-[24px] max-w-[1360px] w-full mx-auto pb-[80px] scrollbar-thin">
            {/* Top Identity & Command Banner (Figma 1:18083) */}
            <div className="bg-white rounded-[8px] p-[24px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] relative mb-[24px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px]">
              {/* Title & Description */}
              <div className="flex flex-col gap-[4px] text-right">
                <h1 className="text-[28px] leading-[38px] font-bold text-[#1b1c1a]">
                  إعدادات اللغة
                </h1>
                <p className="text-[14px] leading-[22px] font-normal text-[#514537]">
                  إدارة وتفعيل حزم اللغات المعتمدة لدعم الترجمة المؤسسية وسير العمل القضائي والقانوني.
                </p>
              </div>

              {/* Action Button: إضافة لغة جديدة (Gold) */}
              <button
                type="button"
                onClick={() => setCurrentView("add")}
                className="bg-[#9c6402] hover:bg-[#835401] active:bg-[#6c4501] text-white px-[20px] py-[10px] rounded-[4px] font-semibold text-[14px] flex items-center gap-[8px] transition-all shadow-sm cursor-pointer shrink-0"
              >
                <Plus className="size-[18px]" />
                <span>إضافة لغة جديدة</span>
              </button>
            </div>

            {/* Informational System Default Banner (Figma 1:18083) */}
            <div className="bg-white rounded-[8px] p-[20px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] mb-[24px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px]">
              {/* Right Side: Translation Icon & Information */}
              <div className="flex items-center gap-[16px] text-right">
                <div className="size-[48px] rounded-[10px] bg-[rgba(255,221,182,0.4)] text-[#9c6402] flex items-center justify-center shrink-0">
                  <Languages className="size-[24px]" />
                </div>
                <div className="flex flex-col gap-[4px]">
                  <div className="flex items-center gap-[8px]">
                    <span className="text-[15px] font-bold text-[#1b1c1a]">
                      اللغة الافتراضية للنظام: العربية (ar)
                    </span>
                    <span className="bg-[#ecfdf5] text-[#065f46] text-[11px] font-bold px-[8px] py-[2px] rounded-[4px] flex items-center gap-[4px]">
                      <span className="size-[5px] rounded-full bg-[#059669]" />
                      <span>معيار الإسناد الوطني</span>
                    </span>
                  </div>
                  <p className="text-[12px] text-[#514537] leading-[18px]">
                    البيئة القانونية مهيأة بالكامل للترميز الثنائي RTL و LTR بما يضمن توافق صياغة العقود ومذكرات الترافع الرقمية.
                  </p>
                </div>
              </div>

              {/* Left Side: ISO Benchmark Badge */}
              <div className="bg-[#f5f3ef] border border-[#eae8e4] rounded-[6px] px-[12px] py-[6px] flex items-center gap-[6px] text-[#514537] shrink-0">
                <ShieldCheck className="size-[14px] text-[#059669]" />
                <span className="text-[11px] font-mono font-bold">ISO 639-1 / BCP 47</span>
              </div>
            </div>

            {/* Main Table Card (Figma 1:18083 / Empty State 1:18417) */}
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
                      {languages.length}
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

              {/* Search Bar */}
              <div className="px-[20px] py-[14px] border-b border-[#eae8e4]">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="البحث باسم اللغة أو الرمز..."
                    className="w-full bg-[#f5f3ef] text-[#1b1c1a] placeholder-[#837565] text-[13px] rounded-[6px] ps-[16px] pe-[40px] py-[10px] border border-transparent focus:border-[#9c6402] focus:bg-white focus:outline-none transition-all"
                  />
                  <Search className="absolute top-1/2 -translate-y-1/2 end-[14px] size-[16px] text-[#837565]" />
                </div>
              </div>

              {/* Table or Empty State */}
              {filteredLanguages.length === 0 ? (
                <LanguageEmptyState onAddLanguage={() => setCurrentView("add")} />
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                      <thead>
                        <tr className="bg-[#f5f3ef]/70 text-[#514537] text-[13px] font-semibold border-b border-[#eae8e4]">
                          <th className="py-[14px] px-[20px] w-[60px]">#</th>
                          <th className="py-[14px] px-[20px]">اسم اللغة والتصنيف</th>
                          <th className="py-[14px] px-[20px]">كود اللغة (Locale)</th>
                          <th className="py-[14px] px-[20px]">اتجاه النص</th>
                          <th className="py-[14px] px-[20px]">الحالة التشغيلية</th>
                          <th className="py-[14px] px-[20px] text-center w-[120px]">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eae8e4] text-[14px] text-[#1b1c1a]">
                        {filteredLanguages.map((language) => (
                          <tr
                            key={language.id}
                            className="hover:bg-[#faf9f6] transition-colors"
                          >
                            {/* Order Number */}
                            <td className="py-[16px] px-[20px] text-[#837565] font-mono text-[13px]">
                              {language.orderNumber}
                            </td>

                            {/* Name & Classification */}
                            <td className="py-[16px] px-[20px]">
                              <div className="flex items-center gap-[8px]">
                                <span className="font-bold text-[#1b1c1a]">
                                  {language.name}
                                </span>
                                {language.nativeName && (
                                  <span className="text-[12px] text-[#514537]">
                                    {language.nativeName}
                                  </span>
                                )}
                                {language.isDefault && (
                                  <span className="inline-flex items-center gap-[4px] bg-[rgba(255,221,182,0.4)] text-[#9c6402] text-[10px] font-bold px-[8px] py-[2px] rounded-[3px]">
                                    <Lock className="size-[10px]" />
                                    <span>الافتراضية للنظام</span>
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Locale Code Badge */}
                            <td className="py-[16px] px-[20px]">
                              <div className="flex items-center gap-[6px]">
                                <span className="bg-[#f0eeea] text-[#1b1c1a] font-mono font-bold text-[11px] px-[8px] py-[3px] rounded-[4px]">
                                  {language.code}
                                </span>
                                <span className="text-[10px] text-[#837565] font-mono">
                                  ISO 639-1
                                </span>
                              </div>
                            </td>

                            {/* Text Direction */}
                            <td className="py-[16px] px-[20px]">
                              <div className="flex items-center gap-[6px] text-[13px] text-[#514537]">
                                <span>
                                  {language.direction === "rtl"
                                    ? "RTL (يمين إلى يسار)"
                                    : "LTR (يسار إلى يمين)"}
                                </span>
                                <Pilcrow className="size-[14px] text-[#837565]" />
                              </div>
                            </td>

                            {/* Operational Status */}
                            <td className="py-[16px] px-[20px]">
                              {language.status === "active" ? (
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
                                  onClick={() => toast.info(`تعديل حزمة «${language.name}»`)}
                                  className="size-[32px] rounded-[4px] hover:bg-[#f5f3ef] text-[#514537] hover:text-[#1b1c1a] flex items-center justify-center transition-colors cursor-pointer"
                                  title="تعديل"
                                >
                                  <PenSquare className="size-[15px]" />
                                </button>
                                {language.isDefault ? (
                                  <button
                                    type="button"
                                    disabled
                                    className="size-[32px] rounded-[4px] text-[#b9b3ae] flex items-center justify-center opacity-40 cursor-not-allowed"
                                    title="لا يمكن حذف اللغة الافتراضية"
                                  >
                                    <Trash2 className="size-[15px]" />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setLanguageToDelete(language)}
                                    className="size-[32px] rounded-[4px] hover:bg-[rgba(186,26,26,0.1)] text-[#ba1a1a] flex items-center justify-center transition-colors cursor-pointer"
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
                  <div className="p-[16px] px-[20px] border-t border-[#eae8e4] flex flex-col sm:flex-row items-center justify-between gap-[12px]">
                    <span className="text-[13px] text-[#514537]">
                      عرض 1 إلى {filteredLanguages.length} من أصل {languages.length} لغات مسجلة بالنظام
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
                </>
              )}
            </div>
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
