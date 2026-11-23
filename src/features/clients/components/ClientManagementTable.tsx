"use client";

import React, { useState, useMemo } from "react";
import {
  Eye,
  Mail,
  Phone,
  User,
  Trash2,
  DoorOpen,
  PenSquare,
  KeyRound,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { ClientOffice, TabFilter } from "../types/client.types";
import { initialOffices } from "../data/initialOffices";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";
import { UnifiedPagination } from "@/components/shared/UnifiedPagination";
import { DataTableCard } from "@/components/shared/DataTableCard";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { useLanguage } from "@/lib/i18n";
import { getLocalCustomAutoRenew, resolveOfficeLogo, DEFAULT_OFFICE_LOGO, withCacheBust, formatSaudiPhoneDisplay } from "@/lib/api/mappers";
import { localizePlanName, localizeLicense, getLocalizedCityName } from "@/lib/localize";

export { initialOffices };

interface ClientManagementTableProps {
  offices?: ClientOffice[];
  isLoading?: boolean;
  isEnteringOffice?: boolean;
  enteringOfficeId?: string | number | null;
  onViewOfficeDetails: (office: ClientOffice) => void;
  onEditOffice?: (office: ClientOffice) => void;
  onResetPassword?: (office: ClientOffice) => void;
  onEnterOfficeAsAdmin?: (office: ClientOffice) => void;
  onOpenDeactivateModal?: (office: ClientOffice) => void;
  onOpenDeleteModal?: (office: ClientOffice) => void;
  onManageSubscriptions?: (office: ClientOffice) => void;
  onReactivate?: (office: ClientOffice) => void;
  canEditStatus?: boolean;
}

export function ClientManagementTable({
  offices: propOffices,
  isLoading = false,
  isEnteringOffice = false,
  enteringOfficeId = null,
  onViewOfficeDetails,
  onEditOffice,
  onResetPassword,
  onEnterOfficeAsAdmin,
  onOpenDeactivateModal,
  onOpenDeleteModal,
  onManageSubscriptions,
  onReactivate,
  canEditStatus = true,
}: ClientManagementTableProps) {
  const { t, isEn } = useLanguage();
  const [internalOffices, setInternalOffices] = useState<ClientOffice[]>([]);
  const offices = propOffices !== undefined ? propOffices : internalOffices;
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [planFilter, setPlanFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "name">("newest");

  // Pagination
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (text: string, fieldKey: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const value = String(text || "").trim();
    if (!value || value === "—") return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(fieldKey);
      toast.success(t("تم النسخ إلى الحافظة", "Copied to clipboard"));
      window.setTimeout(() => {
        setCopiedField((prev) => (prev === fieldKey ? null : prev));
      }, 1500);
    } catch {
      toast.error(t("تعذر النسخ", "Copy failed"));
    }
  };

  const filteredOffices = useMemo(() => {
    const list = offices.filter((item) => {
      // Tab filter (Quick filter outside)
      if (activeTab === "active" && item.accountStatus.type !== "active") return false;
      if (
        activeTab === "trial" &&
        item.accountStatus.type !== "trial" &&
        item.subscriptionStatus.type !== "trial" &&
        item.planType !== "trial" &&
        !item.plan?.includes("تجرب") &&
        !item.plan?.toLowerCase().includes("trial")
      )
        return false;
      if (activeTab === "suspended" && item.accountStatus.type !== "suspended") return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesOwner = item.owner.toLowerCase().includes(q);
        const matchesPhone = item.phone.includes(q);
        const matchesEmail = item.email.toLowerCase().includes(q);
        const companyIdStr = String(item.companyId || item.id || "").toLowerCase();
        const matchesCompanyId =
          companyIdStr.includes(q.replace(/^#/, "")) ||
          `id: ${companyIdStr}`.includes(q) ||
          `id:#${companyIdStr}`.includes(q);
        if (!matchesName && !matchesOwner && !matchesPhone && !matchesEmail && !matchesCompanyId) return false;
      }

      // Comprehensive Filters inside Drawer
      if (planFilter !== "all" && !item.plan.includes(planFilter)) return false;
      if (cityFilter !== "all" && item.city !== cityFilter) return false;

      return true;
    });

    return list.sort((a, b) => {
      if (sortOrder === "name") return a.name.localeCompare(b.name, "ar");
      if (sortOrder === "oldest") return (Number(a.id) || 0) - (Number(b.id) || 0);
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    });
  }, [offices, activeTab, searchQuery, planFilter, cityFilter, sortOrder]);

  const tabCounts = useMemo(() => {
    const all = offices.length;
    const trial = offices.filter(
      (item) =>
        item.accountStatus.type === "trial" ||
        item.subscriptionStatus.type === "trial" ||
        item.planType === "trial" ||
        item.plan?.includes("تجرب") ||
        item.plan?.toLowerCase().includes("trial")
    ).length;
    const suspended = offices.filter((item) => item.accountStatus.type === "suspended").length;
    const active = offices.filter((item) => item.accountStatus.type === "active").length;
    return { all, active, trial, suspended };
  }, [offices]);

  const totalItems = filteredOffices.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePageIndex = Math.min(pageIndex, Math.max(0, totalPages - 1));

  const paginatedOffices = useMemo(() => {
    if (pageSize >= 9999) return filteredOffices;
    const start = safePageIndex * pageSize;
    return filteredOffices.slice(start, start + pageSize);
  }, [filteredOffices, safePageIndex, pageSize]);

  const handleDeactivateToggle = (office: ClientOffice) => {
    const isCurrentlyActive = office.accountStatus.type === "active";
    setInternalOffices((prev) =>
      prev.map((o) => {
        if (String(o.id) === String(office.id)) {
          return {
            ...o,
            accountStatus: isCurrentlyActive
              ? {
                  label: "غير نشط",
                  type: "suspended",
                  bgClass: "bg-[#fef2f2] dark:bg-[#2c1313]",
                  textClass: "text-[#dc2626] dark:text-[#f87171]",
                  dotClass: "bg-[#dc2626] dark:bg-[#ef4444]",
                }
              : {
                  label: "نشط",
                  type: "active",
                  bgClass: "bg-[#e8f5e9] dark:bg-[#132c1c]",
                  textClass: "text-[#1b7340] dark:text-[#6ee7b7]",
                  dotClass: "bg-[#1b7340] dark:bg-[#10b981]",
                },
          };
        }
        return o;
      })
    );
    toast.success(
      isCurrentlyActive
        ? t(`تم تعطيل حساب ${office.name} مؤقتاً`, `Temporarily deactivated ${office.name}`)
        : t(`تم إعادة تفعيل حساب ${office.name} بنجاح`, `Successfully reactivated ${office.name}`)
    );
  };

  const handleToggleOfficeStatus = (office: ClientOffice) => {
    const accType = office.accountStatus.type as string | undefined;
    const isRowSuspended =
      accType === "suspended" ||
      accType === "inactive" ||
      office.accountStatus.label === "غير نشط" ||
      office.accountStatus.label === "معطل";

    if (isRowSuspended) {
      if (onReactivate) {
        onReactivate(office);
      } else {
        handleDeactivateToggle(office);
      }
    } else {
      if (onOpenDeactivateModal) {
        onOpenDeactivateModal(office);
      } else {
        handleDeactivateToggle(office);
      }
    }
  };

  const handleDeleteOffice = (office: ClientOffice) => {
    setInternalOffices((prev) => prev.filter((o) => o.id !== office.id));
    toast.error(t(`تم حذف مكتب "${office.name}" نهائياً من النظام`, `Office "${office.name}" permanently deleted`));
  };

  return (
    <div className="flex flex-col gap-6 w-full shrink-0 font-['Cairo',sans-serif]">
      {/* Unified Filter Bar (Separate Card matching Staff layout) */}
      <UnifiedFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={t("ابحث باسم المكتب، المالك، رقم الجوال...", "Search by office name, owner, phone...")}
        primaryFilterValue={activeTab}
        onPrimaryFilterChange={(v) => setActiveTab(v as TabFilter)}
        primaryFilterMode="pills"
        primaryFilterOptions={[
          { label: `${t("الكل", "All")} (${tabCounts.all})`, value: "all" },
          { label: `${t("النشطة", "Active")} (${tabCounts.active})`, value: "active" },
          { label: `${t("تحت التجربة", "Trial")} (${tabCounts.trial})`, value: "trial" },
          { label: `${t("المعطلة", "Suspended")} (${tabCounts.suspended})`, value: "suspended" },
        ]}
        hasActiveFilters={
          activeTab !== "all" ||
          planFilter !== "all" ||
          cityFilter !== "all" ||
          sortOrder !== "newest" ||
          Boolean(searchQuery)
        }
        onReset={() => {
          setSearchQuery("");
          setActiveTab("all");
          setPlanFilter("all");
          setCityFilter("all");
          setSortOrder("newest");
        }}
        drawerTitle={t("تصفية شاملة لمكاتب المحاماة", "Comprehensive Law Firm Filters")}
        drawerDescription={t("خيارات تصفية وفلترة متقدمة للوصول الدقيق لبيانات المنشآت", "Advanced filter options for precise office queries")}
        drawerContent={
          <div className="space-y-6 text-start font-['Cairo',sans-serif]">
            {/* 1. Account Status */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                {t("حالة الحساب", "Account Status")}
              </label>
              <DashboardSelect
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as TabFilter)}
              >
                <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("كافة الحالات (الكل)", "All Statuses")}</option>
                <option value="active" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("الحسابات النشطة فقط", "Active Accounts Only")}</option>
                <option value="trial" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("الحسابات تحت التجربة فقط", "Trial Accounts Only")}</option>
                <option value="suspended" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("الحسابات المعطلة فقط", "Suspended Accounts Only")}</option>
              </DashboardSelect>
            </div>

            {/* 2. Plan Filter */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                {t("باقة الاشتراك المعتمدة", "Approved Plan")}
              </label>
              <DashboardSelect
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
              >
                <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("جميع الباقات", "All Plans")}</option>
                <option value="التميز" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("باقة التميز العدلي (VIP)", "Legal Excellence Plan (VIP)")}</option>
                <option value="الاحترافية" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("الباقة الاحترافية (Pro)", "Professional Plan (Pro)")}</option>
                <option value="الشركات" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("باقة الشركات (Enterprise)", "Enterprise Plan")}</option>
                <option value="الأساسية" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("الباقة الأساسية (Basic)", "Basic Plan")}</option>
                <option value="مجانية" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("تجربة مجانية (Free Trial)", "Free Trial")}</option>
              </DashboardSelect>
            </div>

            {/* 4. City Filter */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                {t("المدينة / المقر الرئيسي", "City / Headquarters")}
              </label>
              <DashboardSelect
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              >
                <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("كافة المدن والمناطق", "All Cities & Regions")}</option>
                <option value="الرياض" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("مدينة الرياض", "Riyadh")}</option>
                <option value="جدة" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("مدينة جدة", "Jeddah")}</option>
                <option value="الدمام" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("الدمام والمنطقة الشرقية", "Dammam & Eastern Region")}</option>
                <option value="الخبر" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("محافظة الخبر", "Khobar")}</option>
                <option value="مكة المكرمة" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("مكة المكرمة", "Makkah")}</option>
                <option value="المدينة المنورة" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("المدينة المنورة", "Madinah")}</option>
              </DashboardSelect>
            </div>

            {/* 5. Sort Order */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                {t("ترتيب النتائج", "Sort Order")}
              </label>
              <DashboardSelect
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest" | "name")}
              >
                <option value="newest" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("الأحدث تسجيلاً أولاً", "Newest Registered First")}</option>
                <option value="oldest" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("الأقدم تسجيلاً أولاً", "Oldest Registered First")}</option>
                <option value="name" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("أبجدياً حسب اسم المنشأة (أ - ي)", "Alphabetical by Office Name")}</option>
              </DashboardSelect>
            </div>

            {/* 6. Page Size Control */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                {t("عدد المكاتب المعروضة (الترقيم)", "Offices Per Page")}
              </label>
              <DashboardSelect
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPageIndex(0);
                }}
              >
                <option value={5} className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("5 مكاتب بالصفحة", "5 offices / page")}</option>
                <option value={10} className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("10 مكاتب بالصفحة", "10 offices / page")}</option>
                <option value={20} className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("20 مكتب بالصفحة", "20 offices / page")}</option>
                <option value={50} className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("50 مكتب بالصفحة", "50 offices / page")}</option>
                <option value={9999} className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">{t("عرض كافة المكاتب (الكل)", "Show All Offices")}</option>
              </DashboardSelect>
            </div>
          </div>
        }
      />

      {/* Separate Data Table & Pagination Card */}
      <DataTableCard data-node-id="1:770">
      {/* Table Data */}
      <div className="overflow-x-auto overflow-y-hidden scrollbar-none w-full">
        <table className="w-full text-start border-collapse min-w-[1020px]">
          <thead>
            <tr className="bg-[#f5f3ef] dark:bg-[#281c15] border-b border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[18px] font-bold">
              <th className="py-[12px] px-[12px] w-[50px] min-w-[50px] text-center font-bold">#</th>
              <th className="py-[12px] px-[16px] text-start font-bold whitespace-nowrap min-w-[260px]">{t("اسم المكتب والترخيص", "Office & License")}</th>
              <th className="py-[12px] px-[16px] text-start font-bold whitespace-nowrap min-w-[130px]">{t("المالك", "Owner")}</th>
              <th className="py-[12px] px-[16px] text-start font-bold whitespace-nowrap min-w-[200px]">{t("البريد الإلكتروني", "Email")}</th>
              <th className="py-[12px] px-[16px] text-start font-bold whitespace-nowrap min-w-[130px]">{t("رقم التواصل", "Phone Number")}</th>
              <th className="py-[12px] px-[16px] text-start font-bold whitespace-nowrap min-w-[130px]">{t("الباقة الحالية", "Current Plan")}</th>
              <th className="py-[12px] px-[16px] text-start font-bold whitespace-nowrap min-w-[100px]">{t("الحالة", "Status")}</th>
              <th className="py-[12px] px-[16px] text-center font-bold whitespace-nowrap min-w-[140px] w-[140px]">{t("الإجراءات", "Actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0eeea] dark:divide-[#38271c]">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`sk-${i}`} className="animate-pulse">
                  <td className="py-[16px] px-[12px] text-center">
                    <div className="size-[24px] rounded-[4px] bg-black/5 dark:bg-white/10 mx-auto" />
                  </td>
                  <td className="py-[16px] px-[16px] text-start">
                    <div className="flex items-center gap-[12px]">
                      <div className="size-[36px] rounded-[4px] bg-black/5 dark:bg-white/10 shrink-0" />
                      <div className="flex flex-col gap-1.5 flex-1">
                        <div className="h-4 w-40 bg-black/5 dark:bg-white/10 rounded" />
                        <div className="h-3 w-24 bg-black/5 dark:bg-white/10 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="py-[16px] px-[16px] text-start">
                    <div className="flex items-center gap-[6px]">
                      <div className="size-[13px] rounded-full bg-black/5 dark:bg-white/10 shrink-0" />
                      <div className="h-4 w-24 bg-black/5 dark:bg-white/10 rounded" />
                    </div>
                  </td>
                  <td className="py-[16px] px-[16px] text-start">
                    <div className="flex items-center gap-[6px]">
                      <div className="size-[13px] rounded-[2px] bg-black/5 dark:bg-white/10 shrink-0" />
                      <div className="h-4 w-32 bg-black/5 dark:bg-white/10 rounded" />
                    </div>
                  </td>
                  <td className="py-[16px] px-[16px] text-start">
                    <div className="flex items-center gap-[6px]">
                      <div className="size-[13px] rounded-full bg-black/5 dark:bg-white/10 shrink-0" />
                      <div className="h-4 w-24 bg-black/5 dark:bg-white/10 rounded" />
                    </div>
                  </td>
                  <td className="py-[16px] px-[16px] text-start">
                    <div className="h-5 w-24 bg-black/5 dark:bg-white/10 rounded-full" />
                  </td>
                  <td className="py-[16px] px-[16px] text-start">
                    <div className="h-5 w-20 bg-black/5 dark:bg-white/10 rounded-full" />
                  </td>
                  <td className="py-[16px] px-[16px] text-center">
                    <div className="size-[32px] rounded-[4px] bg-black/5 dark:bg-white/10 mx-auto" />
                  </td>
                </tr>
              ))
            ) : paginatedOffices.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-[48px] text-center text-[#837565] dark:text-[#8e8680] text-[14px]">
                  {t("لا توجد مكاتب تطابق معايير البحث الحالية", "No law offices match the current search criteria")}
                </td>
              </tr>
            ) : (
              paginatedOffices.map((office, index) => (
                <tr
                  key={office.id}
                  className="hover:bg-[#faf9f7] dark:hover:bg-[#281c15]/60 transition-colors group"
                >
                  {/* 0. ترقيم العميل (#) */}
                  <td className="py-[16px] px-[12px] text-center">
                    <span className="inline-flex items-center justify-center size-[24px] rounded-[4px] font-mono text-[11px] font-bold text-[#837565] dark:text-[#cdc5bd] bg-[#f5f3ef] dark:bg-[#1a120d] border border-transparent dark:border-[#38271c]">
                      {pageIndex * pageSize + index + 1}
                    </span>
                  </td>
                  {/* 1. اسم المكتب والترخيص */}
                  <td className="py-[16px] px-[16px] text-start">
                    <div className="flex items-center gap-[12px] min-w-0">
                      {(() => {
                        const candidateLogo = resolveOfficeLogo(office.logo, office.id);
                        const isFailed = failedLogos[candidateLogo];
                        const tableLogo = !isFailed ? candidateLogo : DEFAULT_OFFICE_LOGO;

                        return (
                          <div className="size-[36px] rounded-[4px] bg-white dark:bg-[#1a120d] border border-[#eae8e4] dark:border-[#422e20] p-0.5 flex items-center justify-center shrink-0 overflow-hidden relative">
                            <span className={`text-[12px] font-bold ${office.initialText} absolute pointer-events-none select-none`}>
                              {office.initial}
                            </span>
                            <img
                              src={withCacheBust(tableLogo, office.updatedAt || office.id)}
                              alt={office.name}
                              className="max-h-full max-w-full object-contain relative z-10 bg-white dark:bg-[#1a120d]"
                              onError={() => {
                                if (tableLogo !== DEFAULT_OFFICE_LOGO) {
                                  setFailedLogos((prev) => ({ ...prev, [tableLogo]: true }));
                                }
                              }}
                            />
                          </div>
                        );
                      })()}
                      <div className="flex flex-col gap-[4px] min-w-0 flex-1">
                        <span
                          className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-bold leading-[19px] truncate"
                          title={office.name}
                        >
                          {(() => {
                            const words = String(office.name || "")
                              .trim()
                              .split(/\s+/)
                              .filter(Boolean);
                            if (words.length <= 4) return office.name;
                            return `${words.slice(0, 4).join(" ")}…`;
                          })()}
                        </span>
                        <span className="text-[#837565] dark:text-[#8e8680] text-[11px] leading-[16px] truncate">
                          {localizeLicense(office.licenseNumber, isEn)} • {getLocalizedCityName(office.city, isEn)}
                        </span>
                        <span
                          className="inline-flex items-center self-start px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#f4efe6] dark:bg-[#271d15] text-[#78644f] dark:text-[#c4b3a3] border border-[#dfd7cc] dark:border-[#423122] shrink-0"
                          title={`معرف المنشأة (Company ID): #${office.companyId || office.id}${office.officeId ? ` • المعرّف: ${office.officeId}` : ""}`}
                        >
                          {office.officeId ? `@${office.officeId}` : `ID: #${office.companyId || office.id}`}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 2. المالك */}
                  <td className="py-[16px] px-[16px] text-start">
                    <div className="flex items-center gap-[6px] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-medium leading-[18px]">
                      <User className="size-[13px] text-[#837565] dark:text-[#8e8680] shrink-0" />
                      <span>{office.owner}</span>
                    </div>
                  </td>

                  {/* 3. البريد الإلكتروني */}
                  <td className="py-[16px] px-[16px] text-start">
                    <div className="flex items-center gap-[6px] text-[#514537] dark:text-[#cdc5bd] text-[12px] font-normal group/email">
                      <Mail className="size-[13px] text-[#837565] dark:text-[#8e8680] shrink-0" />
                      <span dir="ltr" className="font-mono truncate max-w-[180px]">{office.email}</span>
                      {office.email ? (
                        <button
                          type="button"
                          onClick={(e) =>
                            void handleCopy(office.email, `email-${office.id}`, e)
                          }
                          className="text-[#837565] hover:text-[#9c6402] dark:hover:text-[#e29d38] p-0.5 cursor-pointer shrink-0 opacity-70 group-hover/email:opacity-100 transition-opacity"
                          title={t("نسخ البريد", "Copy Email")}
                          aria-label={t("نسخ البريد", "Copy Email")}
                        >
                          {copiedField === `email-${office.id}` ? (
                            <Check className="size-[12px] text-emerald-600" />
                          ) : (
                            <Copy className="size-[12px]" />
                          )}
                        </button>
                      ) : null}
                    </div>
                  </td>

                  {/* 4. رقم التواصل */}
                  <td className="py-[16px] px-[16px] text-start">
                    <div className="flex items-center gap-[6px] text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] font-normal font-mono group/phone">
                      <Phone className="size-[13px] text-[#837565] dark:text-[#8e8680] shrink-0" />
                      <span dir="ltr" className="inline-block whitespace-nowrap">
                        {formatSaudiPhoneDisplay(office.phone)}
                      </span>
                      {office.phone ? (
                        <button
                          type="button"
                          onClick={(e) =>
                            void handleCopy(formatSaudiPhoneDisplay(office.phone), `phone-${office.id}`, e)
                          }
                          className="text-[#837565] hover:text-[#9c6402] dark:hover:text-[#e29d38] p-0.5 cursor-pointer shrink-0 opacity-70 group-hover/phone:opacity-100 transition-opacity"
                          title={t("نسخ الرقم", "Copy Phone")}
                          aria-label={t("نسخ الرقم", "Copy Phone")}
                        >
                          {copiedField === `phone-${office.id}` ? (
                            <Check className="size-[12px] text-emerald-600" />
                          ) : (
                            <Copy className="size-[12px]" />
                          )}
                        </button>
                      ) : null}
                    </div>
                  </td>

                  {/* 5. الباقة الحالية */}
                  <td className="py-[16px] px-[16px] text-start">
                    <div className="flex flex-col gap-1 items-start">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap border ${office.planBadgeClass}`}
                      >
                        {localizePlanName(office.plan, isEn)}
                      </span>
                      {(() => {
                        const effectiveAutoRenew = office.id ? getLocalCustomAutoRenew(office.id) ?? office.autoRenew : office.autoRenew;
                        if (effectiveAutoRenew === undefined) return null;
                        return (
                          <span className={`text-[10px] font-semibold inline-flex items-center gap-1 ${
                            effectiveAutoRenew ? "text-[#065f46] dark:text-[#6ee7b7]" : "text-[#dc2626] dark:text-[#f87171]"
                          }`}>
                            <span className={`size-1.5 rounded-full ${effectiveAutoRenew ? "bg-[#10b981]" : "bg-[#dc2626]"}`} />
                            {effectiveAutoRenew ? t("تجديد تلقائي", "Auto-renew") : t("تجديد يدوي", "Manual renew")}
                          </span>
                        );
                      })()}
                    </div>
                  </td>

                  {/* 6. الحالة */}
                  <td className="py-[16px] px-[16px] text-start">
                    {(() => {
                      const statusType = office.accountStatus.type;
                      const isActiveStatus = statusType === "active";
                      const isTrialStatus = statusType === "trial";
                      const statusTone = isActiveStatus
                        ? {
                            wrap: "bg-[#e8f5e9] dark:bg-[#132c1c] text-[#1b7340] dark:text-[#6ee7b7] border-[#c8e6c9] dark:border-emerald-500/40 hover:bg-[#c8e6c9]/40 dark:hover:bg-[#1b432a]",
                            dot: "bg-[#1b7340] dark:bg-[#10b981]",
                          }
                        : isTrialStatus
                        ? {
                            wrap: "bg-[#fffbeb] dark:bg-[#342711] text-[#92400e] dark:text-[#fbbf24] border-[#fde68a] dark:border-[#e29d38]/40 hover:bg-[#fde68a]/40 dark:hover:bg-[#4a3718]",
                            dot: "bg-[#d97706] dark:bg-[#fbbf24]",
                          }
                        : {
                            wrap: "bg-[#fef2f2] dark:bg-[#2c1313] text-[#dc2626] dark:text-[#f87171] border-[#fecaca] dark:border-rose-500/40 hover:bg-[#fecaca]/40 dark:hover:bg-[#441d1d]",
                            dot: "bg-[#dc2626] dark:bg-[#ef4444]",
                          };
                      return canEditStatus ? (
                        <button
                          type="button"
                          onClick={() => handleToggleOfficeStatus(office)}
                          title={
                            isActiveStatus
                              ? t("انقر للتعطيل المؤقت", "Click to deactivate / suspend office")
                              : t("انقر للتنشيط والتفعيل", "Click to activate office")
                          }
                          aria-label={
                            isActiveStatus
                              ? t("تعطيل الحساب", "Deactivate account")
                              : t("تنشيط وتفعيل الحساب", "Activate account")
                          }
                          className={`w-fit inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap border cursor-pointer select-none transition-all hover:scale-[1.04] active:scale-[0.96] hover:shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[#9c6402] dark:focus-visible:ring-[#e29d38] ${statusTone.wrap}`}
                        >
                          <span
                            className={`size-[7px] rounded-full shadow-[0_0_8px_currentColor] ring-1 ring-current/40 shrink-0 ${statusTone.dot}`}
                          />
                          <span>
                            {isEn
                              ? isActiveStatus
                                ? "Active"
                                : isTrialStatus
                                ? "Trial"
                                : "Inactive"
                              : isActiveStatus
                              ? "نشط"
                              : isTrialStatus
                              ? "تحت التجربة"
                              : "غير نشط"}
                          </span>
                        </button>
                      ) : (
                        <span
                          className={`w-fit inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap border select-none ${statusTone.wrap}`}
                        >
                          <span
                            className={`size-[7px] rounded-full shadow-[0_0_8px_currentColor] ring-1 ring-current/40 shrink-0 ${statusTone.dot}`}
                          />
                          <span>
                            {isEn
                              ? isActiveStatus
                                ? "Active"
                                : isTrialStatus
                                ? "Trial"
                                : "Inactive"
                              : isActiveStatus
                              ? "نشط"
                              : isTrialStatus
                              ? "تحت التجربة"
                              : "غير نشط"}
                          </span>
                        </span>
                      );
                    })()}
                  </td>

                  {/* 8. الإجراءات */}
                  <td className="py-[16px] px-[16px] text-center relative">
                    <div className="flex items-center justify-center gap-[6px]">
                      {/* زر عرض التفاصيل (Eye) */}
                      <button
                        type="button"
                        aria-label={t("عرض التفاصيل", "View Details")}
                        onClick={() => onViewOfficeDetails(office)}
                        className="p-[6px] rounded-[4px] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] transition-colors cursor-pointer"
                        title={t("عرض التفاصيل", "View Details")}
                      >
                        <Eye className="size-[15px]" />
                      </button>

                      {/* زر تعديل بيانات الحساب */}
                      {onEditOffice && (
                        <button
                          type="button"
                          aria-label={t("تعديل بيانات الحساب", "Edit Account Details")}
                          onClick={() => onEditOffice(office)}
                          className="p-[6px] rounded-[4px] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] transition-colors cursor-pointer"
                          title={t("تعديل بيانات الحساب", "Edit Account Details")}
                        >
                          <PenSquare className="size-[15px]" />
                        </button>
                      )}

                      {/* زر إعادة تعيين كلمة المرور */}
                      {onResetPassword && (
                        <button
                          type="button"
                          aria-label={t("إعادة تعيين كلمة المرور", "Reset Password")}
                          onClick={() => onResetPassword(office)}
                          className="p-[6px] rounded-[4px] hover:bg-[#fff9ee] dark:hover:bg-[#342711] text-[#9c6402] dark:text-[#e29d38] transition-colors cursor-pointer"
                          title={t("إعادة تعيين كلمة المرور", "Reset Password")}
                        >
                          <KeyRound className="size-[15px]" />
                        </button>
                      )}

                      {/* زر دخول المكتب كمسؤول (أيقونة الباب فقط بدون كلمة) */}
                      {onEnterOfficeAsAdmin && (
                        <button
                          type="button"
                          aria-label={t("دخول نظام المكتب", "Enter Office System")}
                          onClick={() => onEnterOfficeAsAdmin(office)}
                          disabled={isEnteringOffice && enteringOfficeId === office.id}
                          className="size-[30px] rounded-[4px] bg-[#fff9ee] dark:bg-[#342711] border border-[#eeddbb] dark:border-[#523b2c] text-[#9c6402] dark:text-[#e29d38] hover:bg-[#9c6402] hover:text-white dark:hover:bg-[#e29d38] dark:hover:text-[#1c140f] inline-flex items-center justify-center transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-[0px_1px_2px_rgba(0,0,0,0.03)]"
                          title={t("دخول نظام المكتب كمسؤول", "Enter office system as admin")}
                        >
                          <DoorOpen className="size-[15px]" />
                        </button>
                      )}

                      {/* زر حذف المكتب نهائياً */}
                      {onOpenDeleteModal && (
                        <button
                          type="button"
                          aria-label={t("حذف المكتب نهائياً", "Delete Office")}
                          onClick={() => {
                            onOpenDeleteModal(office);
                          }}
                          className="p-[6px] rounded-[4px] hover:bg-[#fef2f2] dark:hover:bg-[#311616] text-[#dc2626] dark:text-[#f87171] transition-colors cursor-pointer"
                          title={t("حذف المكتب نهائياً", "Delete Office")}
                        >
                          <Trash2 className="size-[15px]" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <UnifiedPagination
          pageIndex={safePageIndex}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setPageIndex}
          onPageSizeChange={setPageSize}
          itemLabel={t("مكتب محاماة مسجل", "registered law offices")}
        />
      </DataTableCard>
    </div>
  );
}
