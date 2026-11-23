"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Trash2,
  ExternalLink,
  Search,
  ChevronDown,
  SlidersHorizontal,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Bell,
  CreditCard,
  UserCheck,
  Key,
  Receipt,
  Settings,
  Plus,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { LuxuryAlertDialog } from "@/components/shared/LuxuryAlertDialog";
import {
  useDraftsStore,
  DraftItem,
  DraftType,
  saveUnifiedDraft,
} from "@/stores/use-drafts-store";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type TabFilter = "all" | DraftType;

export function DraftsManagementView() {
  const { direction, isEn, t } = useLanguage();
  const router = useRouter();

  const drafts = useDraftsStore((state) => state.drafts);
  const initDrafts = useDraftsStore((state) => state.init);
  const deleteDraft = useDraftsStore((state) => state.deleteDraft);
  const clearAllDrafts = useDraftsStore((state) => state.clearAllDrafts);

  useEffect(() => {
    initDrafts();
  }, [initDrafts]);

  // State
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "title">("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const [draftToDelete, setDraftToDelete] = useState<DraftItem | null>(null);
  const [isClearAllDialogOpen, setIsClearAllDialogOpen] = useState(false);

  // Filtered and Sorted Drafts
  const filteredDrafts = useMemo(() => {
    let result = drafts.filter((item) => {
      if (activeTab !== "all" && item.type !== activeTab) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesSummary = item.summary?.toLowerCase().includes(q);
        const matchesType = (item.typeLabelAr + " " + item.typeLabelEn).toLowerCase().includes(q);
        if (!matchesTitle && !matchesSummary && !matchesType) {
          return false;
        }
      }
      return true;
    });

    if (sortOrder === "newest") {
      result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } else if (sortOrder === "oldest") {
      result.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
    } else if (sortOrder === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [drafts, activeTab, searchQuery, sortOrder]);

  // Counts by tab
  const counts = useMemo(() => {
    return {
      all: drafts.length,
      notifications: drafts.filter((d) => d.type === "notifications").length,
      plans: drafts.filter((d) => d.type === "plans").length,
      roles: drafts.filter((d) => d.type === "roles").length,
      staff: drafts.filter((d) => d.type === "staff").length,
      subscriptions: drafts.filter((d) => d.type === "subscriptions").length,
      settings: drafts.filter((d) => d.type === "settings").length,
    };
  }, [drafts]);

  // Format date helper
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat(isEn ? "en-US" : "ar-SA-u-nu-latn", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return isoString;
    }
  };

  const getTypeIcon = (type: DraftType) => {
    switch (type) {
      case "notifications":
        return <Bell className="size-4" />;
      case "plans":
        return <CreditCard className="size-4" />;
      case "roles":
        return <Key className="size-4" />;
      case "staff":
        return <UserCheck className="size-4" />;
      case "subscriptions":
        return <Receipt className="size-4" />;
      case "settings":
        return <Settings className="size-4" />;
      default:
        return <FileText className="size-4" />;
    }
  };

  const getTypeColorClasses = (type: DraftType) => {
    switch (type) {
      case "notifications":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900";
      case "plans":
        return "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900";
      case "roles":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900";
      case "staff":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900";
      case "subscriptions":
        return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900";
      case "settings":
        return "bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-800";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const handleResumeDraft = (draft: DraftItem) => {
    router.push(draft.targetUrl);
  };

  const handleDeleteConfirm = () => {
    if (!draftToDelete) return;
    deleteDraft(draftToDelete.id);
    toast.success(
      isEn
        ? `Draft "${draftToDelete.title}" deleted successfully.`
        : `تم حذف مسودة "${draftToDelete.title}" بنجاح.`
    );
    setDraftToDelete(null);
  };

  const handleClearAllConfirm = () => {
    clearAllDrafts();
    toast.success(
      isEn
        ? "All saved drafts have been cleared."
        : "تم إفراغ وحذف كافة المسودات بنجاح."
    );
    setIsClearAllDialogOpen(false);
  };

  const handleAddSampleDraft = () => {
    const demo = saveUnifiedDraft({
      type: "notifications",
      typeLabelAr: "إشعار وتنبيه",
      typeLabelEn: "Notification",
      title: "تنبيه هام: تحديث خدمات السجل التجاري الموحد",
      summary: "مسودة تنبيه لجميع المكاتب حول مزامنة وتوثيق بيانات الشركات مع وزارة التجارة.",
      targetUrl: `/notifications?view=new&draftId=demo_${Date.now()}`,
      badge: "تحديث جديد",
      data: {
        title: "تنبيه هام: تحديث خدمات السجل التجاري الموحد",
        description: "يرجى من مسؤولي المكاتب التأكد من مطابقة السجل التجاري والترخيص المهني.",
        audienceType: "all",
        actionUrl: "https://mc.gov.sa",
        categoryBadge: "الامتثال النظامي",
      },
    });
    toast.success(
      isEn
        ? `Sample draft "${demo.title}" created.`
        : `تم إنشاء مسودة تجريبية "${demo.title}".`
    );
  };

  useEffect(() => {
    if (!sortOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSortOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [sortOpen]);

  const sortOptions = [
    { value: "newest" as const, label: isEn ? "Newest" : "الأحدث حفظاً" },
    { value: "oldest" as const, label: isEn ? "Oldest" : "الأقدم حفظاً" },
    { value: "title" as const, label: isEn ? "Title (A-Z)" : "الأبجدي (أ - ي)" },
  ];
  const currentSortLabel = sortOptions.find((option) => option.value === sortOrder)?.label;

  const breadcrumbs = [
    { label: isEn ? "Dashboard" : "لوحة التحكم", href: "/" },
    { label: isEn ? "System Settings" : "إعدادات النظام", href: "/settings/general" },
    { label: isEn ? "Drafts" : "المسودات" },
  ];

  return (
    <div
      dir={direction}
      className="flex h-screen h-dvh overflow-hidden bg-background text-foreground transition-colors duration-200 font-sans antialiased"
    >
      <DashboardSidebar activeNav="system-settings" activeSubNav="drafts" />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <DashboardTopNavbar customBreadcrumbs={breadcrumbs} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 w-full space-y-6 scrollbar-thin">
          <DashboardPageTransition>
            {/* 1. Header Banner */}
            <div className="bg-white dark:bg-[#221812] rounded-2xl p-6 sm:p-7 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="size-[52px] rounded-xl bg-[#9c6402]/10 dark:bg-[#e29d38]/15 border border-[#9c6402]/20 dark:border-[#e29d38]/30 flex items-center justify-center shrink-0 text-[#9c6402] dark:text-[#e29d38]">
                  <FileText className="size-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-[20px] sm:text-[22px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {isEn ? "Central Drafts Hub" : "مركز إدارة المسودات"}
                    </h1>
                    <span className="bg-[#9c6402] text-white dark:text-[#1c140f] text-[12px] font-bold px-2.5 py-0.5 rounded-full font-mono">
                      {drafts.length}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#514537] dark:text-[#cdc5bd] mt-1 max-w-2xl">
                    {isEn
                      ? "All items saved as draft across notifications, plans, staff, roles, and settings. Resume and edit anytime."
                      : "جميع النماذج والعناصر التي قمت بحفظها كمسودة عبر النظام (الإشعارات، الباقات، الصلاحيات، الموظفين، الإعدادات) للرجوع إليها واستكمالها فوراً."}
                  </p>
                </div>
              </div>

              {/* Actions Header */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {drafts.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsClearAllDialogOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#ba1a1a] dark:text-[#ff897d] bg-[#ba1a1a]/10 hover:bg-[#ba1a1a]/15 dark:bg-[#ba1a1a]/20 dark:hover:bg-[#ba1a1a]/25 transition-colors cursor-pointer"
                  >
                    <Trash2 className="size-4" />
                    <span>{isEn ? "Clear All Drafts" : "إفراغ كافة المسودات"}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleAddSampleDraft}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#514537] dark:text-[#fdfbf7] bg-[#f0eeea] hover:bg-[#e4e2de] dark:bg-[#281c15] dark:hover:bg-[#38271c] transition-colors cursor-pointer"
                >
                  <Plus className="size-4" />
                  <span>{isEn ? "Add Test Draft" : "إضافة مسودة تجريبية"}</span>
                </button>
              </div>
            </div>

            {/* 2. Category Tabs & Filters */}
            <div className="bg-white dark:bg-[#221812] rounded-xl p-3 border border-[#e6e2dc] dark:border-[#38271c] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none py-1">
                {[
                  { id: "all", label: isEn ? "All Drafts" : "كافة المسودات", count: counts.all },
                  { id: "notifications", label: isEn ? "Notifications" : "الإشعارات", count: counts.notifications },
                  { id: "plans", label: isEn ? "Plans" : "الباقات والأسعار", count: counts.plans },
                  { id: "staff", label: isEn ? "Staff" : "طاقم العمل", count: counts.staff },
                  { id: "roles", label: isEn ? "Roles" : "الأدوار والصلاحيات", count: counts.roles },
                  { id: "subscriptions", label: isEn ? "Subscriptions" : "الاشتراكات", count: counts.subscriptions },
                  { id: "settings", label: isEn ? "Settings" : "الإعدادات", count: counts.settings },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as TabFilter)}
                      className={cn(
                        "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all whitespace-nowrap cursor-pointer",
                        isActive
                          ? "bg-[#9c6402] text-white dark:text-[#1c140f] shadow-xs font-bold"
                          : "text-[#514537] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15]"
                      )}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={cn(
                          "text-[11px] font-bold px-1.5 py-0.2 rounded-full font-mono",
                          isActive
                            ? "bg-white/20 text-white dark:bg-black/20 dark:text-[#1c140f]"
                            : "bg-[#e6e2dc] text-[#514537] dark:bg-[#38271c] dark:text-[#cdc5bd]"
                        )}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search & Sort */}
              <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
                <div className="relative flex-1 md:w-[240px]">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-[#837565] dark:text-[#a89f91] pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isEn ? "Search drafts..." : "بحث في المسودات..."}
                    className="w-full h-[38px] ps-9 pe-3 text-[13px] rounded-lg bg-[#f5f3ef] dark:bg-[#1a120d] border border-transparent dark:border-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#8e8680] focus:outline-none focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute end-2.5 top-1/2 -translate-y-1/2 text-xs text-[#837565] hover:text-[#1b1c1a] dark:text-[#cdc5bd]"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div ref={sortMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setSortOpen((open) => !open)}
                    aria-haspopup="listbox"
                    aria-expanded={sortOpen}
                    className="h-[38px] px-3 text-[12px] font-semibold rounded-lg bg-[#f5f3ef] dark:bg-[#1a120d] border border-transparent dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] flex items-center gap-2"
                  >
                    <span className="whitespace-nowrap">{currentSortLabel}</span>
                    <ChevronDown
                      className={cn(
                        "size-3.5 text-[#837565] dark:text-[#a89f91] transition-transform",
                        sortOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {sortOpen && (
                    <div
                      role="listbox"
                      className="absolute end-0 top-[calc(100%+4px)] z-30 min-w-full overflow-hidden rounded-lg border border-[#e6e2dc] dark:border-[#38271c] bg-white dark:bg-[#221812] py-1 shadow-md"
                    >
                      {sortOptions.map((option) => {
                        const selected = sortOrder === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            role="option"
                            aria-selected={selected}
                            onClick={() => {
                              setSortOrder(option.value);
                              setSortOpen(false);
                            }}
                            className={cn(
                              "w-full cursor-pointer whitespace-nowrap px-3 py-2 text-start text-[12px] font-semibold transition-colors",
                              selected
                                ? "bg-[#9c6402] text-white dark:bg-[#e29d38] dark:text-[#1c140f]"
                                : "text-[#514537] hover:bg-[#fbf6ec] hover:text-[#9c6402] dark:text-[#cdc5bd] dark:hover:bg-[#281c15] dark:hover:text-[#e29d38]"
                            )}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Drafts Cards Grid */}
            {filteredDrafts.length === 0 ? (
              <div className="bg-white dark:bg-[#221812] rounded-2xl p-12 text-center border border-[#e6e2dc] dark:border-[#38271c] shadow-xs flex flex-col items-center justify-center gap-4">
                <div className="size-16 rounded-full bg-[#f5f3ef] dark:bg-[#281c15] flex items-center justify-center text-[#837565] dark:text-[#cdc5bd]">
                  <FileText className="size-8" />
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {isEn ? "No drafts found" : "لا توجد مسودات حالياً"}
                  </h3>
                  <p className="text-[13px] text-[#514537] dark:text-[#cdc5bd] mt-1 max-w-md">
                    {isEn
                      ? "When you click 'Save as Draft' in any form (Notifications, Plans, Staff, Settings), it will automatically appear here."
                      : "عندما تضغط على زر 'حفظ كمسودة' في أي نموذج (الإشعارات، الباقات، الموظفين، الأدوار، الإعدادات)، سيتم نقله وحفظه تلقائياً هنا."}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                  <Link
                    href="/notifications/?view=new"
                    className="px-4 py-2 text-[12px] font-semibold rounded-xl bg-[#f0eeea] hover:bg-[#e4e2de] dark:bg-[#281c15] dark:hover:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] transition-colors"
                  >
                    {isEn ? "+ Create Notification" : "+ إنشاء إشعار"}
                  </Link>
                  <Link
                    href="/plans/"
                    className="px-4 py-2 text-[12px] font-semibold rounded-xl bg-[#f0eeea] hover:bg-[#e4e2de] dark:bg-[#281c15] dark:hover:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] transition-colors"
                  >
                    {isEn ? "+ Create Plan" : "+ إنشاء باقة"}
                  </Link>
                  <Link
                    href="/permissions/?tab=staff"
                    className="px-4 py-2 text-[12px] font-semibold rounded-xl bg-[#f0eeea] hover:bg-[#e4e2de] dark:bg-[#281c15] dark:hover:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] transition-colors"
                  >
                    {isEn ? "+ Add Employee" : "+ إضافة موظف"}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {filteredDrafts.map((draft) => {
                  const typeClasses = getTypeColorClasses(draft.type);
                  const icon = getTypeIcon(draft.type);

                  return (
                    <div
                      key={draft.id}
                      className="bg-white dark:bg-[#221812] rounded-2xl p-5 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] hover:border-[#9c6402]/40 dark:hover:border-[#e29d38]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                    >
                      {/* Top Bar: Type Pill & Time */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border",
                              typeClasses
                            )}
                          >
                            {icon}
                            <span>{isEn ? draft.typeLabelEn : draft.typeLabelAr}</span>
                          </span>

                          <div className="flex items-center gap-1 text-[11px] text-[#837565] dark:text-[#a89f91] font-mono">
                            <Clock className="size-3" />
                            <span>{formatDate(draft.updatedAt)}</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="text-[15px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-snug group-hover:text-[#9c6402] dark:group-hover:text-[#e29d38] transition-colors line-clamp-2">
                          {draft.title}
                        </h4>

                        {/* Summary */}
                        <p className="text-[12px] text-[#514537] dark:text-[#cdc5bd] mt-2 line-clamp-3 leading-relaxed">
                          {draft.summary}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-4 mt-4 border-t border-[#f0eeea] dark:border-[#2f221a] flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setDraftToDelete(draft)}
                          title={isEn ? "Delete Draft" : "حذف المسودة"}
                          className="size-[34px] rounded-xl flex items-center justify-center text-[#837565] hover:text-[#ba1a1a] hover:bg-[#ba1a1a]/10 dark:text-[#a89f91] dark:hover:text-[#ff897d] dark:hover:bg-[#ba1a1a]/20 transition-colors cursor-pointer"
                        >
                          <Trash2 className="size-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleResumeDraft(draft)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold bg-[#9c6402] hover:bg-[#855402] dark:bg-[#e29d38] dark:hover:bg-[#c28328] text-white dark:text-[#1c140f] transition-all cursor-pointer shadow-xs"
                        >
                          <span>{isEn ? "Resume & Edit" : "استئناف وتعديل"}</span>
                          {direction === "rtl" ? (
                            <ArrowLeft className="size-3.5" />
                          ) : (
                            <ArrowRight className="size-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </DashboardPageTransition>
        </main>
      </div>

      {/* Delete Single Draft Dialog */}
      <LuxuryAlertDialog
        isOpen={Boolean(draftToDelete)}
        title={isEn ? "Delete Draft" : "حذف المسودة نهائياً"}
        description={
          isEn
            ? `Are you sure you want to delete the draft "${draftToDelete?.title}"? This action cannot be undone.`
            : `هل أنت متأكد من رغبتك في حذف مسودة "${draftToDelete?.title}" نهائياً من النظام؟ لا يمكن التراجع عن هذا الإجراء.`
        }
        confirmText={isEn ? "Delete Draft" : "حذف المسودة"}
        cancelText={isEn ? "Cancel" : "إلغاء"}
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDraftToDelete(null)}
      />

      {/* Clear All Drafts Dialog */}
      <LuxuryAlertDialog
        isOpen={isClearAllDialogOpen}
        title={isEn ? "Clear All Drafts" : "إفراغ كافة المسودات"}
        description={
          isEn
            ? "Are you sure you want to permanently delete all saved drafts across all modules? This action cannot be undone."
            : "هل أنت متأكد من رغبتك في إفراغ وحذف جميع المسودات المحفوظة لكافة النماذج والأقسام؟ لا يمكن التراجع عن هذه العملية."
        }
        confirmText={isEn ? "Clear All" : "إفراغ الكل"}
        cancelText={isEn ? "Cancel" : "إلغاء"}
        variant="danger"
        onConfirm={handleClearAllConfirm}
        onClose={() => setIsClearAllDialogOpen(false)}
      />
    </div>
  );
}
