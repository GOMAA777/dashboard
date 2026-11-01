"use client";

import React, { useState, useMemo } from "react";
import {
  Eye,
  MoreVertical,
  Mail,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  DoorOpen,
} from "lucide-react";
import { toast } from "sonner";
import { ClientOffice, TabFilter } from "../types/client.types";
import { initialOffices } from "../data/initialOffices";
import { ClientRowActionMenu } from "./ClientRowActionMenu";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";
import { PageSizeDropdown } from "@/components/shared/PageSizeDropdown";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { useLanguage } from "@/lib/i18n";

export { initialOffices };

interface ClientManagementTableProps {
  offices?: ClientOffice[];
  isLoading?: boolean;
  onViewOfficeDetails: (office: ClientOffice) => void;
  onEditOffice: (office: ClientOffice) => void;
  onEnterOfficeAsAdmin?: (office: ClientOffice) => void;
  onOpenDeactivateModal?: (office: ClientOffice) => void;
  onOpenDeleteModal?: (office: ClientOffice) => void;
  onManageSubscriptions?: (office: ClientOffice) => void;
}

export function ClientManagementTable({
  offices: propOffices,
  isLoading = false,
  onViewOfficeDetails,
  onEditOffice,
  onEnterOfficeAsAdmin,
  onOpenDeactivateModal,
  onOpenDeleteModal,
  onManageSubscriptions,
}: ClientManagementTableProps) {
  const { t, isEn } = useLanguage();
  const [internalOffices, setInternalOffices] = useState<ClientOffice[]>([]);
  const offices = propOffices !== undefined ? propOffices : internalOffices;
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuRowId, setOpenMenuRowId] = useState<string | null>(null);

  // Filters
  const [planFilter, setPlanFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [subscriptionStatusFilter, setSubscriptionStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "name">("newest");

  // Pagination
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});

  const filteredOffices = useMemo(() => {
    const list = offices.filter((item) => {
      // Tab filter (Quick filter outside)
      if (activeTab === "active" && item.accountStatus.type !== "active") return false;
      if (activeTab === "suspended" && item.accountStatus.type !== "suspended") return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesOwner = item.owner.toLowerCase().includes(q);
        const matchesPhone = item.phone.includes(q);
        const matchesEmail = item.email.toLowerCase().includes(q);
        if (!matchesName && !matchesOwner && !matchesPhone && !matchesEmail) return false;
      }

      // Comprehensive Filters inside Drawer
      if (planFilter !== "all" && !item.plan.includes(planFilter)) return false;
      if (cityFilter !== "all" && item.city !== cityFilter) return false;
      if (subscriptionStatusFilter !== "all" && item.subscriptionStatus.type !== subscriptionStatusFilter) {
        return false;
      }

      return true;
    });

    return list.sort((a, b) => {
      if (sortOrder === "name") return a.name.localeCompare(b.name, "ar");
      if (sortOrder === "oldest") return (Number(a.id) || 0) - (Number(b.id) || 0);
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    });
  }, [offices, activeTab, searchQuery, planFilter, cityFilter, subscriptionStatusFilter, sortOrder]);

  const totalItems = filteredOffices.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePageIndex = Math.min(pageIndex, Math.max(0, totalPages - 1));
  const startItem = totalItems === 0 ? 0 : safePageIndex * pageSize + 1;
  const endItem = Math.min((safePageIndex + 1) * pageSize, totalItems);

  const paginatedOffices = useMemo(() => {
    if (pageSize >= 9999) return filteredOffices;
    const start = safePageIndex * pageSize;
    return filteredOffices.slice(start, start + pageSize);
  }, [filteredOffices, safePageIndex, pageSize]);

  const handleDeactivateToggle = (office: ClientOffice) => {
    const isCurrentlyActive = office.accountStatus.type === "active";
    setInternalOffices((prev) =>
      prev.map((o) => {
        if (o.id === office.id) {
          return {
            ...o,
            accountStatus: isCurrentlyActive
              ? {
                  label: "معطل",
                  type: "suspended",
                  bgClass: "bg-[#fef2f2]",
                  textClass: "text-[#dc2626]",
                  dotClass: "bg-[#dc2626]",
                }
              : {
                  label: "نشط",
                  type: "active",
                  bgClass: "bg-[#e8f5e9]",
                  textClass: "text-[#1b7340]",
                  dotClass: "bg-[#1b7340]",
                },
          };
        }
        return o;
      })
    );
    toast.success(
      isCurrentlyActive
        ? `تم تعطيل حساب ${office.name} مؤقتاً`
        : `تم إعادة تفعيل حساب ${office.name} بنجاح`
    );
  };

  const handleDeleteOffice = (office: ClientOffice) => {
    setInternalOffices((prev) => prev.filter((o) => o.id !== office.id));
    toast.error(`تم حذف مكتب "${office.name}" نهائياً من النظام`);
  };

  return (
    <div
      className="bg-white dark:bg-[#221812] rounded-[8px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] overflow-hidden w-full shrink-0 font-['Cairo',sans-serif]"
      data-node-id="1:770"
    >
      {/* Unified Filter Bar with 3 Pills + Comprehensive Drawer */}
      <UnifiedFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={t("ابحث باسم المكتب، المالك، رقم الجوال...", "Search by office name, owner, phone...")}
        primaryFilterValue={activeTab}
        onPrimaryFilterChange={(v) => setActiveTab(v as TabFilter)}
        primaryFilterMode="pills"
        primaryFilterOptions={[
          { label: t("الكل (128)", "All (128)"), value: "all" },
          { label: t("النشطة (96)", "Active (96)"), value: "active" },
          { label: t("المعطلة (14)", "Suspended (14)"), value: "suspended" },
        ]}
        hasActiveFilters={
          activeTab !== "all" ||
          planFilter !== "all" ||
          cityFilter !== "all" ||
          subscriptionStatusFilter !== "all" ||
          sortOrder !== "newest" ||
          Boolean(searchQuery)
        }
        onReset={() => {
          setSearchQuery("");
          setActiveTab("all");
          setPlanFilter("all");
          setCityFilter("all");
          setSubscriptionStatusFilter("all");
          setSortOrder("newest");
        }}
        drawerTitle={t("تصفية شاملة لمكاتب المحاماة", "Comprehensive Law Firm Filters")}
        drawerDescription={t("خيارات تصفية وفلترة متقدمة للوصول الدقيق لبيانات المنشآت", "Advanced filter options for precise office queries")}
        drawerContent={
          <div className="space-y-6 text-start font-['Cairo',sans-serif]">
            {/* 1. Account Status */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                حالة الحساب
              </label>
              <DashboardSelect
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as TabFilter)}
              >
                <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">كافة الحالات (الكل)</option>
                <option value="active" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">الحسابات النشطة فقط</option>
                <option value="suspended" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">الحسابات المعطلة فقط</option>
              </DashboardSelect>
            </div>

            {/* 2. Subscription Status */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                حالة الاشتراك
              </label>
              <DashboardSelect
                value={subscriptionStatusFilter}
                onChange={(e) => setSubscriptionStatusFilter(e.target.value)}
              >
                <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">كافة اشتراكات المكاتب</option>
                <option value="active" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">اشتراك نشط وساري</option>
                <option value="trial" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">تحت التجربة المجانية</option>
                <option value="expired" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">منتهي الصلاحية</option>
              </DashboardSelect>
            </div>

            {/* 3. Plan Filter */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                باقة الاشتراك المعتمدة
              </label>
              <DashboardSelect
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
              >
                <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">جميع الباقات</option>
                <option value="الاحترافية" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">الباقة الاحترافية (Pro)</option>
                <option value="الشركات" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">باقة الشركات (Enterprise)</option>
                <option value="الأساسية" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">الباقة الأساسية (Basic)</option>
                <option value="مجانية" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">تجربة مجانية (Free Trial)</option>
              </DashboardSelect>
            </div>

            {/* 4. City Filter */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                المدينة / المقر الرئيسي
              </label>
              <DashboardSelect
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              >
                <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">كافة المدن والمناطق</option>
                <option value="الرياض" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">مدينة الرياض</option>
                <option value="جدة" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">مدينة جدة</option>
                <option value="الدمام" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">الدمام والمنطقة الشرقية</option>
                <option value="الخبر" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">محافظة الخبر</option>
                <option value="مكة المكرمة" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">مكة المكرمة</option>
                <option value="المدينة المنورة" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">المدينة المنورة</option>
              </DashboardSelect>
            </div>

            {/* 5. Sort Order */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                ترتيب النتائج
              </label>
              <DashboardSelect
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest" | "name")}
              >
                <option value="newest" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">الأحدث تسجيلاً أولاً</option>
                <option value="oldest" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">الأقدم تسجيلاً أولاً</option>
                <option value="name" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">أبجدياً حسب اسم المنشأة (أ - ي)</option>
              </DashboardSelect>
            </div>

            {/* 6. Page Size Control */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                عدد المكاتب المعروضة (الترقيم)
              </label>
              <DashboardSelect
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPageIndex(0);
                }}
              >
                <option value={5} className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">5 مكاتب بالصفحة</option>
                <option value={10} className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">10 مكاتب بالصفحة</option>
                <option value={20} className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">20 مكتب بالصفحة</option>
                <option value={50} className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">50 مكتب بالصفحة</option>
                <option value={9999} className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">عرض كافة المكاتب (الكل)</option>
              </DashboardSelect>
            </div>
          </div>
        }
        className="rounded-b-none border-b-0"
      />

      {/* Table Data */}
      <div className="overflow-x-auto scrollbar-none w-full">
        <table className="w-full text-start border-collapse">
          <thead>
            <tr className="bg-[#f5f3ef] dark:bg-[#281c15] border-b border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[18px] font-semibold">
              <th className="py-[12px] px-[12px] w-[50px] text-center font-bold">#</th>
              <th className="py-[12px] px-[16px] whitespace-nowrap">{t("اسم المكتب والترخيص", "Office & License")}</th>
              <th className="py-[12px] px-[16px] whitespace-nowrap">{t("المالك", "Owner")}</th>
              <th className="py-[12px] px-[16px] whitespace-nowrap">{t("البريد الإلكتروني", "Email")}</th>
              <th className="py-[12px] px-[16px] whitespace-nowrap">{t("رقم التواصل", "Phone Number")}</th>
              <th className="py-[12px] px-[16px] whitespace-nowrap">{t("الباقة الحالية", "Current Plan")}</th>
              <th className="py-[12px] px-[16px] whitespace-nowrap">{t("حالة الاشتراك", "Subscription")}</th>
              <th className="py-[12px] px-[16px] whitespace-nowrap">{t("حالة الحساب", "Account Status")}</th>
              <th className="py-[12px] px-[16px] text-center whitespace-nowrap">{t("الإجراءات", "Actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0eeea] dark:divide-[#38271c]">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`sk-${i}`} className="animate-pulse">
                  <td className="py-[16px] px-[12px] text-center">
                    <div className="size-[24px] rounded-[4px] bg-black/5 dark:bg-white/10 mx-auto" />
                  </td>
                  <td className="py-[16px] px-[16px]">
                    <div className="flex items-center gap-[12px]">
                      <div className="size-[36px] rounded-[4px] bg-black/5 dark:bg-white/10 shrink-0" />
                      <div className="flex flex-col gap-1.5 flex-1">
                        <div className="h-4 w-40 bg-black/5 dark:bg-white/10 rounded" />
                        <div className="h-3 w-24 bg-black/5 dark:bg-white/10 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="py-[16px] px-[16px]">
                    <div className="h-4 w-28 bg-black/5 dark:bg-white/10 rounded" />
                  </td>
                  <td className="py-[16px] px-[16px]">
                    <div className="h-4 w-36 bg-black/5 dark:bg-white/10 rounded" />
                  </td>
                  <td className="py-[16px] px-[16px]">
                    <div className="h-4 w-28 bg-black/5 dark:bg-white/10 rounded" />
                  </td>
                  <td className="py-[16px] px-[16px]">
                    <div className="h-5 w-24 bg-black/5 dark:bg-white/10 rounded-full" />
                  </td>
                  <td className="py-[16px] px-[16px]">
                    <div className="h-5 w-20 bg-black/5 dark:bg-white/10 rounded-full" />
                  </td>
                  <td className="py-[16px] px-[16px]">
                    <div className="h-5 w-16 bg-black/5 dark:bg-white/10 rounded-full" />
                  </td>
                  <td className="py-[16px] px-[16px] text-center">
                    <div className="size-[32px] rounded-[4px] bg-black/5 dark:bg-white/10 mx-auto" />
                  </td>
                </tr>
              ))
            ) : paginatedOffices.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-[48px] text-center text-[#837565] dark:text-[#8e8680] text-[14px]">
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
                  <td className="py-[16px] px-[16px]">
                    <div className="flex items-center gap-[12px]">
                      {office.logo && !failedLogos[office.id] ? (
                        <div className="size-[36px] rounded-[4px] bg-white dark:bg-[#1a120d] border border-[#eae8e4] dark:border-[#422e20] p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
                          <img
                            src={office.logo}
                            alt={office.name}
                            className="max-h-full max-w-full object-contain"
                            onError={() => setFailedLogos((prev) => ({ ...prev, [office.id]: true }))}
                          />
                        </div>
                      ) : (
                        <div
                          className={`size-[36px] rounded-[4px] flex items-center justify-center font-bold text-[14px] shrink-0 ${office.initialBg} ${office.initialText}`}
                        >
                          {office.initial}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-bold leading-[19px]">
                          {office.name}
                        </span>
                        <span className="text-[#837565] dark:text-[#8e8680] text-[11px] leading-[16px]">
                          {office.licenseNumber} • {office.city}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 2. المالك */}
                  <td className="py-[16px] px-[16px]">
                    <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-medium leading-[18px]">
                      {office.owner}
                    </span>
                  </td>

                  {/* 3. البريد الإلكتروني */}
                  <td className="py-[16px] px-[16px]">
                    <div className="flex items-center gap-[6px] text-[#514537] dark:text-[#cdc5bd] text-[12px] font-normal direction-ltr">
                      <Mail className="size-[13px] text-[#837565] dark:text-[#8e8680] shrink-0" />
                      <span>{office.email}</span>
                    </div>
                  </td>

                  {/* 4. رقم التواصل */}
                  <td className="py-[16px] px-[16px]">
                    <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] font-normal direction-ltr block">
                      {office.phone}
                    </span>
                  </td>

                  {/* 5. الباقة الحالية */}
                  <td className="py-[16px] px-[16px]">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap border ${office.planBadgeClass}`}
                    >
                      {isEn
                        ? office.plan
                            .replace("الباقة الاحترافية", "Professional")
                            .replace("باقة الشركات", "Enterprise")
                            .replace("الباقة الأساسية", "Basic")
                            .replace("تجربة مجانية", "Free Trial")
                        : office.plan}
                    </span>
                  </td>

                  {/* 6. حالة الاشتراك */}
                  <td className="py-[16px] px-[16px]">
                    <span
                      className={`w-fit inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap border ${office.subscriptionStatus.bgClass} ${office.subscriptionStatus.textClass}`}
                    >
                      <span>
                        {isEn
                          ? office.subscriptionStatus.label === "نشط"
                            ? "Active"
                            : office.subscriptionStatus.label === "ساري"
                            ? "Valid"
                            : office.subscriptionStatus.label === "منتهي"
                            ? "Expired"
                            : office.subscriptionStatus.label
                          : office.subscriptionStatus.label}
                      </span>
                      {office.subscriptionStatus.note && (
                        <span className="font-medium text-[10px] opacity-90">
                          {isEn
                            ? office.subscriptionStatus.note
                                .replace("(ساري)", "(Valid)")
                                .replace("(منتهي)", "(Expired)")
                                .replace("متبقي", "Remaining")
                            : office.subscriptionStatus.note}
                        </span>
                      )}
                    </span>
                  </td>

                  {/* 7. حالة الحساب */}
                  <td className="py-[16px] px-[16px]">
                    <span
                      className={`w-fit inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap border ${office.accountStatus.bgClass} ${office.accountStatus.textClass}`}
                    >
                      <span className={`size-[7px] rounded-full shadow-[0_0_8px_currentColor] ring-1 ring-current/40 shrink-0 ${office.accountStatus.dotClass}`} />
                      <span>
                        {isEn
                          ? office.accountStatus.label === "نشط"
                            ? "Active"
                            : office.accountStatus.label === "معطل"
                            ? "Suspended"
                            : office.accountStatus.label
                          : office.accountStatus.label}
                      </span>
                    </span>
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

                      {/* زر دخول المكتب كمسؤول (باب) */}
                      {onEnterOfficeAsAdmin && (
                        <button
                          type="button"
                          aria-label={t("دخول المكتب كمسؤول", "Enter Office as Admin")}
                          onClick={() => onEnterOfficeAsAdmin(office)}
                          className="p-[6px] rounded-[4px] hover:bg-[#fff9ee] dark:hover:bg-[#342711] text-[#9c6402] dark:text-[#e29d38] hover:text-[#825200] transition-colors cursor-pointer"
                          title={t("دخول المكتب كمسؤول", "Enter Office as Admin")}
                        >
                          <DoorOpen className="size-[15px]" />
                        </button>
                      )}

                      {/* زر القائمة المنسدلة (3 dots) */}
                      <div className="relative">
                        <button
                          type="button"
                          aria-label={t("خيارات إضافية", "More Options")}
                          onClick={() =>
                            setOpenMenuRowId(openMenuRowId === office.id ? null : office.id)
                          }
                          className="p-[6px] rounded-[4px] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] transition-colors cursor-pointer"
                        >
                          <MoreVertical className="size-[15px]" />
                        </button>

                        <ClientRowActionMenu
                          isOpen={openMenuRowId === office.id}
                          onClose={() => setOpenMenuRowId(null)}
                          onViewDetails={() => onViewOfficeDetails(office)}
                          onEnterOfficeAsAdmin={
                            onEnterOfficeAsAdmin
                              ? () => onEnterOfficeAsAdmin(office)
                              : undefined
                          }
                          onEdit={() => onEditOffice(office)}
                          onManageSubscriptions={() => {
                            if (onManageSubscriptions) {
                              onManageSubscriptions(office);
                            } else {
                              toast.info(`إدارة اشتراكات وفواتير مكتب ${office.name}`);
                            }
                          }}
                          onDeactivate={() => {
                            if (onOpenDeactivateModal) {
                              onOpenDeactivateModal(office);
                            } else {
                              handleDeactivateToggle(office);
                            }
                          }}
                          onDelete={() => {
                            if (onOpenDeleteModal) {
                              onOpenDeleteModal(office);
                            } else {
                              handleDeleteOffice(office);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-[#fcfaf7] dark:bg-[#1a120d] p-[16px] border-t border-[#f0eeea] dark:border-[#38271c] flex flex-col sm:flex-row items-center justify-between gap-[12px] text-[12px] text-[#514537] dark:text-[#cdc5bd] font-['Cairo']">
          {/* Right in RTL: Count Summary & Rows per page */}
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <span>{t("عرض", "Showing")} </span>
            <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{startItem}</span>
            <span> {t("إلى", "to")} </span>
            <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{endItem}</span>
            <span> {t("من أصل", "of")} </span>
            <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{totalItems}</span>
            <span> {t("مكتب محاماة مسجل", "registered law offices")}</span>
          </div>

          <div className="flex items-center gap-2 border-s border-[#eae8e4] dark:border-[#38271c] ps-3">
            <span className="text-[11px] text-[#837565] dark:text-[#8e8680]">{t("صفوف بالصفحة:", "Rows per page:")}</span>
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

        {/* Left in RTL: Page Controls */}
        <div className="flex items-center gap-[4px]">
          <button
            type="button"
            disabled={safePageIndex === 0 || totalItems === 0}
            onClick={() => setPageIndex(0)}
            title={t("الصفحة الأولى", "First page")}
            className="size-[30px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center cursor-pointer"
          >
            <ChevronsRight className="size-[14px] rtl:rotate-0 rotate-180" />
          </button>

          <button
            type="button"
            disabled={safePageIndex === 0 || totalItems === 0}
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            title={t("الصفحة السابقة", "Previous page")}
            className="px-[10px] py-[6px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-[4px] cursor-pointer"
          >
            <ChevronRight className="size-[13px] rtl:rotate-0 rotate-180" />
            <span>{t("السابق", "Previous")}</span>
          </button>

          {totalItems === 0 ? (
            <button
              type="button"
              disabled
              className="size-[30px] rounded-[4px] font-semibold text-[12px] flex items-center justify-center border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#8e8680] opacity-40 cursor-not-allowed"
            >
              1
            </button>
          ) : (
            Array.from({ length: totalPages }, (_, i) => i).map((p) => {
              if (totalPages > 5 && Math.abs(p - safePageIndex) > 2 && p !== 0 && p !== totalPages - 1) {
                if (p === 1 || p === totalPages - 2) {
                  return (
                    <span key={p} className="px-[2px] text-[#837565] dark:text-[#8e8680]">
                      ...
                    </span>
                  );
                }
                return null;
              }
              const isActive = safePageIndex === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPageIndex(p)}
                  className={`size-[30px] rounded-[4px] font-semibold text-[12px] flex items-center justify-center cursor-pointer transition-colors ${
                    isActive
                      ? "bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] font-bold shadow-sm"
                      : "border border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15]"
                  }`}
                >
                  {p + 1}
                </button>
              );
            })
          )}

          <button
            type="button"
            disabled={safePageIndex >= totalPages - 1 || totalItems === 0}
            onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
            title={t("الصفحة التالية", "Next page")}
            className="px-[10px] py-[6px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#1b1c1a] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-[4px] cursor-pointer"
          >
            <span>{t("التالي", "Next")}</span>
            <ChevronLeft className="size-[13px] rtl:rotate-0 rotate-180" />
          </button>

          <button
            type="button"
            disabled={safePageIndex >= totalPages - 1 || totalItems === 0}
            onClick={() => setPageIndex(totalPages - 1)}
            title={t("الصفحة الأخيرة", "Last page")}
            className="size-[30px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center cursor-pointer"
          >
            <ChevronsLeft className="size-[14px] rtl:rotate-0 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
