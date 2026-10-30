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
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { ClientOffice, TabFilter } from "../types/client.types";
import { initialOffices } from "../data/initialOffices";
import { ClientRowActionMenu } from "./ClientRowActionMenu";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";
import { PageSizeDropdown } from "@/components/shared/PageSizeDropdown";

export { initialOffices };

interface ClientManagementTableProps {
  offices?: ClientOffice[];
  onViewOfficeDetails: (office: ClientOffice) => void;
  onEditOffice: (office: ClientOffice) => void;
  onOpenDeactivateModal?: (office: ClientOffice) => void;
  onOpenDeleteModal?: (office: ClientOffice) => void;
}

export function ClientManagementTable({
  offices: propOffices,
  onViewOfficeDetails,
  onEditOffice,
  onOpenDeactivateModal,
  onOpenDeleteModal,
}: ClientManagementTableProps) {
  const [internalOffices, setInternalOffices] = useState<ClientOffice[]>(initialOffices);
  const offices = propOffices || internalOffices;
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
  const [pageSize, setPageSize] = useState(6);

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
      if (sortOrder === "oldest") return a.id.localeCompare(b.id);
      return b.id.localeCompare(a.id);
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
        searchPlaceholder="ابحث باسم المكتب، المالك، رقم الجوال..."
        primaryFilterValue={activeTab}
        onPrimaryFilterChange={(v) => setActiveTab(v as TabFilter)}
        primaryFilterMode="pills"
        primaryFilterOptions={[
          { label: "الكل (128)", value: "all" },
          { label: "النشطة (96)", value: "active" },
          { label: "المعطلة (14)", value: "suspended" },
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
              options={[5, 6, 8, 10, 12, 20, 50, 9999]}
              dropdownPlacement="bottom"
            />
          </div>
        }
        drawerTitle="تصفية شاملة لمكاتب المحاماة"
        drawerDescription="خيارات تصفية وفلترة متقدمة للوصول الدقيق لبيانات المنشآت"
        drawerContent={
          <div className="space-y-6 text-start font-['Cairo',sans-serif]">
            {/* 1. Account Status */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                حالة الحساب
              </label>
              <div className="relative">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value as TabFilter)}
                  className="w-full h-[42px] appearance-none bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] px-[14px] pe-[36px] border border-[#eae8e4] dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] cursor-pointer"
                >
                  <option value="all">كافة الحالات (الكل)</option>
                  <option value="active">الحسابات النشطة فقط</option>
                  <option value="suspended">الحسابات المعطلة فقط</option>
                </select>
                <ChevronDown className="size-[15px] text-[#837565] dark:text-[#8e8680] absolute end-[12px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 2. Subscription Status */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                حالة الاشتراك
              </label>
              <div className="relative">
                <select
                  value={subscriptionStatusFilter}
                  onChange={(e) => setSubscriptionStatusFilter(e.target.value)}
                  className="w-full h-[42px] appearance-none bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] px-[14px] pe-[36px] border border-[#eae8e4] dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] cursor-pointer"
                >
                  <option value="all">كافة اشتراكات المكاتب</option>
                  <option value="active">اشتراك نشط وساري</option>
                  <option value="trial">تحت التجربة المجانية</option>
                  <option value="expired">منتهي الصلاحية</option>
                </select>
                <ChevronDown className="size-[15px] text-[#837565] dark:text-[#8e8680] absolute end-[12px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 3. Plan Filter */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                باقة الاشتراك المعتمدة
              </label>
              <div className="relative">
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="w-full h-[42px] appearance-none bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] px-[14px] pe-[36px] border border-[#eae8e4] dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] cursor-pointer"
                >
                  <option value="all">جميع الباقات</option>
                  <option value="الاحترافية">الباقة الاحترافية (Pro)</option>
                  <option value="الشركات">باقة الشركات (Enterprise)</option>
                  <option value="الأساسية">الباقة الأساسية (Basic)</option>
                  <option value="مجانية">تجربة مجانية (Free Trial)</option>
                </select>
                <ChevronDown className="size-[15px] text-[#837565] dark:text-[#8e8680] absolute end-[12px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 4. City Filter */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                المدينة / المقر الرئيسي
              </label>
              <div className="relative">
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full h-[42px] appearance-none bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] px-[14px] pe-[36px] border border-[#eae8e4] dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] cursor-pointer"
                >
                  <option value="all">كافة المدن والمناطق</option>
                  <option value="الرياض">مدينة الرياض</option>
                  <option value="جدة">مدينة جدة</option>
                  <option value="الدمام">الدمام والمنطقة الشرقية</option>
                  <option value="الخبر">محافظة الخبر</option>
                  <option value="مكة المكرمة">مكة المكرمة</option>
                  <option value="المدينة المنورة">المدينة المنورة</option>
                </select>
                <ChevronDown className="size-[15px] text-[#837565] dark:text-[#8e8680] absolute end-[12px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 5. Sort Order */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                ترتيب النتائج
              </label>
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest" | "name")}
                  className="w-full h-[42px] appearance-none bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] px-[14px] pe-[36px] border border-[#eae8e4] dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] cursor-pointer"
                >
                  <option value="newest">الأحدث تسجيلاً أولاً</option>
                  <option value="oldest">الأقدم تسجيلاً أولاً</option>
                  <option value="name">أبجدياً حسب اسم المنشأة (أ - ي)</option>
                </select>
                <ChevronDown className="size-[15px] text-[#837565] dark:text-[#8e8680] absolute end-[12px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 6. Page Size Control */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                عدد المكاتب المعروضة (الترقيم)
              </label>
              <div className="relative">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPageIndex(0);
                  }}
                  className="w-full h-[42px] appearance-none bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] px-[14px] pe-[36px] border border-[#eae8e4] dark:border-[#38271c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] cursor-pointer"
                >
                  <option value={5}>5 مكاتب بالصفحة</option>
                  <option value={6}>6 مكاتب بالصفحة</option>
                  <option value={8}>8 مكاتب بالصفحة</option>
                  <option value={10}>10 مكاتب بالصفحة</option>
                  <option value={12}>12 مكتب بالصفحة</option>
                  <option value={20}>20 مكتب بالصفحة</option>
                  <option value={9999}>عرض كافة المكاتب (الكل)</option>
                </select>
                <ChevronDown className="size-[15px] text-[#837565] dark:text-[#8e8680] absolute end-[12px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
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
              <th className="py-[12px] px-[16px] whitespace-nowrap">اسم المكتب والترخيص</th>
              <th className="py-[12px] px-[16px] whitespace-nowrap">المالك</th>
              <th className="py-[12px] px-[16px] whitespace-nowrap">البريد الإلكتروني</th>
              <th className="py-[12px] px-[16px] whitespace-nowrap">رقم التواصل</th>
              <th className="py-[12px] px-[16px] whitespace-nowrap">الباقة الحالية</th>
              <th className="py-[12px] px-[16px] whitespace-nowrap">حالة الاشتراك</th>
              <th className="py-[12px] px-[16px] whitespace-nowrap">حالة الحساب</th>
              <th className="py-[12px] px-[16px] text-center whitespace-nowrap">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0eeea] dark:divide-[#38271c]">
            {paginatedOffices.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-[48px] text-center text-[#837565] dark:text-[#8e8680] text-[14px]">
                  لا توجد مكاتب تطابق معايير البحث الحالية
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
                      <div
                        className={`size-[36px] rounded-[4px] flex items-center justify-center font-bold text-[14px] shrink-0 ${office.initialBg} ${office.initialText}`}
                      >
                        {office.initial}
                      </div>
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
                      {office.plan}
                    </span>
                  </td>

                  {/* 6. حالة الاشتراك */}
                  <td className="py-[16px] px-[16px]">
                    <span
                      className={`w-fit inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap border ${office.subscriptionStatus.bgClass} ${office.subscriptionStatus.textClass}`}
                    >
                      <span>{office.subscriptionStatus.label}</span>
                      {office.subscriptionStatus.note && (
                        <span className="font-medium text-[10px] opacity-90">
                          {office.subscriptionStatus.note}
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
                      <span>{office.accountStatus.label}</span>
                    </span>
                  </td>

                  {/* 8. الإجراءات */}
                  <td className="py-[16px] px-[16px] text-center relative">
                    <div className="flex items-center justify-center gap-[6px]">
                      {/* زر عرض التفاصيل (Eye) */}
                      <button
                        type="button"
                        aria-label="عرض التفاصيل"
                        onClick={() => onViewOfficeDetails(office)}
                        className="p-[6px] rounded-[4px] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] transition-colors cursor-pointer"
                        title="عرض التفاصيل"
                      >
                        <Eye className="size-[15px]" />
                      </button>

                      {/* زر القائمة المنسدلة (3 dots) */}
                      <div className="relative">
                        <button
                          type="button"
                          aria-label="خيارات إضافية"
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
                          onEdit={() => onEditOffice(office)}
                          onManageSubscriptions={() => {
                            toast.info(`إدارة اشتراكات وفواتير مكتب ${office.name}`);
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
            <span>عرض </span>
            <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{startItem}</span>
            <span> إلى </span>
            <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{endItem}</span>
            <span> من أصل </span>
            <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{totalItems}</span>
            <span> مكتب محاماة مسجل</span>
          </div>

          <div className="flex items-center gap-2 border-s border-[#eae8e4] dark:border-[#38271c] ps-3">
            <span className="text-[11px] text-[#837565] dark:text-[#8e8680]">صفوف بالصفحة:</span>
            <PageSizeDropdown
              value={pageSize}
              onChange={(newSize) => {
                setPageSize(newSize);
                setPageIndex(0);
              }}
              options={[5, 6, 8, 10, 12, 20, 50, 9999]}
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
            title="الصفحة الأولى"
            className="size-[30px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center cursor-pointer"
          >
            <ChevronsRight className="size-[14px]" />
          </button>

          <button
            type="button"
            disabled={safePageIndex === 0 || totalItems === 0}
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            title="الصفحة السابقة"
            className="px-[10px] py-[6px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-[4px] cursor-pointer"
          >
            <ChevronRight className="size-[13px]" />
            <span>السابق</span>
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
            title="الصفحة التالية"
            className="px-[10px] py-[6px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#1b1c1a] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-[4px] cursor-pointer"
          >
            <span>التالي</span>
            <ChevronLeft className="size-[13px]" />
          </button>

          <button
            type="button"
            disabled={safePageIndex >= totalPages - 1 || totalItems === 0}
            onClick={() => setPageIndex(totalPages - 1)}
            title="الصفحة الأخيرة"
            className="size-[30px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center cursor-pointer"
          >
            <ChevronsLeft className="size-[14px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
