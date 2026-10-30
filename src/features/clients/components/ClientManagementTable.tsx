"use client";

import React, { useState, useMemo } from "react";
import {
  Eye,
  MoreVertical,
  Mail,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { ClientOffice, TabFilter } from "../types/client.types";
import { initialOffices } from "../data/initialOffices";
import { ClientRowActionMenu } from "./ClientRowActionMenu";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";

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

  // Pagination
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const filteredOffices = useMemo(() => {
    return offices.filter((item) => {
      // Tab filter
      if (activeTab === "active" && item.accountStatus.type !== "active") return false;
      if (activeTab === "trial" && item.subscriptionStatus.type !== "trial") return false;
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

      // Plan filter
      if (planFilter !== "all" && !item.plan.includes(planFilter)) return false;

      // City filter
      if (cityFilter !== "all" && item.city !== cityFilter) return false;

      return true;
    });
  }, [offices, activeTab, searchQuery, planFilter, cityFilter]);

  const totalItems = filteredOffices.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalItems);

  const paginatedOffices = useMemo(() => {
    if (pageSize >= 9999) return filteredOffices;
    const start = pageIndex * pageSize;
    return filteredOffices.slice(start, start + pageSize);
  }, [filteredOffices, pageIndex, pageSize]);

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
      className="bg-white rounded-[8px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] overflow-hidden w-full font-['Cairo',sans-serif]"
      data-node-id="1:770"
    >
      {/* Unified Filter Bar */}
      <UnifiedFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="ابحث باسم المكتب، المالك، رقم الجوال..."
        primaryFilterValue={activeTab}
        onPrimaryFilterChange={(v) => setActiveTab(v as TabFilter)}
        primaryFilterOptions={[
          { label: "الكل (128)", value: "all" },
          { label: "النشطة (96)", value: "active" },
          { label: "تحت التجربة (18)", value: "trial" },
          { label: "المعطلة (14)", value: "suspended" },
        ]}
        hasActiveFilters={
          activeTab !== "all" ||
          planFilter !== "all" ||
          cityFilter !== "all" ||
          Boolean(searchQuery)
        }
        onReset={() => {
          setSearchQuery("");
          setActiveTab("all");
          setPlanFilter("all");
          setCityFilter("all");
        }}
        drawerTitle="تصفية مكاتب المحاماة"
        drawerContent={
          <div className="space-y-4 text-start font-['Cairo',sans-serif]">
            {/* Plan Filter */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#1b1c1a] block">
                باقة الاشتراك
              </label>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="w-full h-[40px] bg-[#f5f3ef] text-[#1b1c1a] text-[13px] font-semibold rounded-[4px] px-[12px] border border-transparent focus:outline-none focus:ring-1 focus:ring-[#9c6402] cursor-pointer"
              >
                <option value="all">جميع الباقات</option>
                <option value="الاحترافية">الباقة الاحترافية</option>
                <option value="الشركات">باقة الشركات</option>
                <option value="الأساسية">الباقة الأساسية</option>
                <option value="مجانية">تجربة مجانية</option>
              </select>
            </div>

            {/* City Filter */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#1b1c1a] block">
                المدينة
              </label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full h-[40px] bg-[#f5f3ef] text-[#1b1c1a] text-[13px] font-semibold rounded-[4px] px-[12px] border border-transparent focus:outline-none focus:ring-1 focus:ring-[#9c6402] cursor-pointer"
              >
                <option value="all">كافة المدن</option>
                <option value="الرياض">الرياض</option>
                <option value="جدة">جدة</option>
                <option value="الدمام">الدمام</option>
                <option value="الخبر">الخبر</option>
                <option value="مكة المكرمة">مكة المكرمة</option>
                <option value="المدينة المنورة">المدينة المنورة</option>
              </select>
            </div>

            {/* Page Size in Drawer */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#1b1c1a] block">
                عدد المكاتب بالصفحة
              </label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPageIndex(0);
                }}
                className="w-full h-[40px] bg-[#f5f3ef] text-[#1b1c1a] text-[13px] font-semibold rounded-[4px] px-[12px] border border-transparent focus:outline-none focus:ring-1 focus:ring-[#9c6402] cursor-pointer"
              >
                <option value={10}>10 مكاتب</option>
                <option value={25}>25 مكتباً</option>
                <option value={50}>50 مكتباً</option>
              </select>
            </div>
          </div>
        }
        className="rounded-b-none border-b-0"
      />

      {/* Table Data */}
      <div className="overflow-x-auto scrollbar-none w-full">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-[#f5f3ef] border-b border-[#eae8e4] text-[#514537] text-[12px] leading-[18px] font-semibold">
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
          <tbody className="divide-y divide-[#f0eeea]">
            {paginatedOffices.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-[48px] text-center text-[#837565] text-[14px]">
                  لا توجد مكاتب تطابق معايير البحث الحالية
                </td>
              </tr>
            ) : (
              paginatedOffices.map((office) => (
                <tr
                  key={office.id}
                  className="hover:bg-[#faf9f7] transition-colors group"
                >
                  {/* 1. اسم المكتب والترخيص */}
                  <td className="py-[16px] px-[16px]">
                    <div className="flex items-center gap-[12px]">
                      <div
                        className={`size-[36px] rounded-[4px] flex items-center justify-center font-bold text-[14px] shrink-0 ${office.initialBg} ${office.initialText}`}
                      >
                        {office.initial}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[#1b1c1a] text-[13px] font-bold leading-[19px]">
                          {office.name}
                        </span>
                        <span className="text-[#837565] text-[11px] leading-[16px]">
                          {office.licenseNumber} • {office.city}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 2. المالك */}
                  <td className="py-[16px] px-[16px]">
                    <span className="text-[#1b1c1a] text-[13px] font-medium leading-[18px]">
                      {office.owner}
                    </span>
                  </td>

                  {/* 3. البريد الإلكتروني */}
                  <td className="py-[16px] px-[16px]">
                    <div className="flex items-center gap-[6px] text-[#514537] text-[12px] font-normal direction-ltr">
                      <Mail className="size-[13px] text-[#837565] shrink-0" />
                      <span>{office.email}</span>
                    </div>
                  </td>

                  {/* 4. رقم التواصل */}
                  <td className="py-[16px] px-[16px]">
                    <span className="text-[#1b1c1a] text-[12px] font-normal direction-ltr block">
                      {office.phone}
                    </span>
                  </td>

                  {/* 5. الباقة الحالية */}
                  <td className="py-[16px] px-[16px]">
                    <span
                      className={`inline-block px-[8px] py-[3px] rounded-[4px] text-[11px] font-bold whitespace-nowrap ${office.planBadgeClass}`}
                    >
                      {office.plan}
                    </span>
                  </td>

                  {/* 6. حالة الاشتراك */}
                  <td className="py-[16px] px-[16px]">
                    <span
                      className={`inline-flex items-center gap-[4px] px-[8px] py-[3px] rounded-[4px] text-[11px] font-bold whitespace-nowrap ${office.subscriptionStatus.bgClass} ${office.subscriptionStatus.textClass}`}
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
                      className={`inline-flex items-center gap-[6px] px-[8px] py-[3px] rounded-[4px] text-[11px] font-bold whitespace-nowrap ${office.accountStatus.bgClass} ${office.accountStatus.textClass}`}
                    >
                      <span className={`size-[6px] rounded-full shrink-0 ${office.accountStatus.dotClass}`} />
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
                        className="p-[6px] rounded-[4px] hover:bg-[#eae8e4] text-[#514537] hover:text-[#1b1c1a] transition-colors cursor-pointer"
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
                          className="p-[6px] rounded-[4px] hover:bg-[#eae8e4] text-[#514537] hover:text-[#1b1c1a] transition-colors cursor-pointer"
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
        <div className="p-[16px] border-t border-[#f0eeea] flex flex-col sm:flex-row items-center justify-between gap-[12px] text-[12px] text-[#514537] font-['Cairo']">
          {/* Right in RTL: Count Summary & Rows per page */}
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <span>عرض </span>
            <span className="font-bold text-[#1b1c1a]">{startItem}</span>
            <span> إلى </span>
            <span className="font-bold text-[#1b1c1a]">{endItem}</span>
            <span> من أصل </span>
            <span className="font-bold text-[#1b1c1a]">{totalItems}</span>
            <span> مكتب محاماة مسجل</span>
          </div>

          <div className="flex items-center gap-1.5 border-s border-[#eae8e4] ps-3">
            <span className="text-[11px] text-[#837565]">صفوف بالصفحة:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPageIndex(0);
              }}
              className="bg-[#f5f3ef] text-[#1b1c1a] text-[11px] font-bold py-1 px-2 rounded-[4px] border border-[#eae8e4] focus:outline-none cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={9999}>الكل</option>
            </select>
          </div>
        </div>

        {/* Left in RTL: Page Controls */}
        <div className="flex items-center gap-[4px]">
          <button
            type="button"
            disabled={pageIndex === 0}
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            className="px-[12px] py-[6px] rounded-[4px] border border-[#eae8e4] text-[#837565] hover:bg-[#f5f3ef] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-[4px] cursor-pointer"
          >
            <ChevronRight className="size-[13px]" />
            <span>السابق</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i).map((p) => {
            if (totalPages > 5 && Math.abs(p - pageIndex) > 2 && p !== 0 && p !== totalPages - 1) {
              if (p === 1 || p === totalPages - 2) {
                return (
                  <span key={p} className="px-[2px] text-[#837565]">
                    ...
                  </span>
                );
              }
              return null;
            }
            const isActive = pageIndex === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPageIndex(p)}
                className={`size-[30px] rounded-[4px] font-semibold text-[12px] flex items-center justify-center cursor-pointer transition-colors ${
                  isActive
                    ? "bg-[#9c6402] text-white font-bold shadow-sm"
                    : "border border-[#eae8e4] text-[#514537] hover:bg-[#f5f3ef]"
                }`}
              >
                {p + 1}
              </button>
            );
          })}

          <button
            type="button"
            disabled={pageIndex >= totalPages - 1}
            onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
            className="px-[12px] py-[6px] rounded-[4px] border border-[#eae8e4] text-[#1b1c1a] hover:bg-[#f5f3ef] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-[4px] cursor-pointer"
          >
            <span>التالي</span>
            <ChevronLeft className="size-[13px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
