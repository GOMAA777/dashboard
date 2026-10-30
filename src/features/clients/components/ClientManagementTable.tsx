"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ToggleLeft,
  CreditCard,
  Building2,
  ChevronDown,
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
      {/* Toolbar Row 1: Tabs & Page Size */}
      <div className="p-[16px] border-b border-[#f0eeea] flex flex-col md:flex-row md:items-center justify-between gap-[16px]">
        {/* Right: Tabs */}
        <div className="flex items-center gap-[6px] overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-[12px] py-[6px] rounded-[4px] text-[13px] font-semibold transition-colors flex items-center gap-[6px] cursor-pointer whitespace-nowrap ${
              activeTab === "all"
                ? "bg-[#f5f3ef] text-[#1b1c1a]"
                : "text-[#514537] hover:bg-[#faf9f7]"
            }`}
          >
            <span>الكل</span>
            <span
              className={`px-[6px] py-[1px] rounded-full text-[11px] font-bold ${
                activeTab === "all"
                  ? "bg-[#ffddb6] text-[#7b4e00]"
                  : "bg-[#eae8e4] text-[#514537]"
              }`}
            >
              128
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`px-[12px] py-[6px] rounded-[4px] text-[13px] font-semibold transition-colors flex items-center gap-[6px] cursor-pointer whitespace-nowrap ${
              activeTab === "active"
                ? "bg-[#f5f3ef] text-[#1b1c1a]"
                : "text-[#514537] hover:bg-[#faf9f7]"
            }`}
          >
            <span>النشطة</span>
            <span
              className={`px-[6px] py-[1px] rounded-full text-[11px] font-bold ${
                activeTab === "active"
                  ? "bg-[#ffddb6] text-[#7b4e00]"
                  : "bg-[#eae8e4] text-[#514537]"
              }`}
            >
              96
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("trial")}
            className={`px-[12px] py-[6px] rounded-[4px] text-[13px] font-semibold transition-colors flex items-center gap-[6px] cursor-pointer whitespace-nowrap ${
              activeTab === "trial"
                ? "bg-[#f5f3ef] text-[#1b1c1a]"
                : "text-[#514537] hover:bg-[#faf9f7]"
            }`}
          >
            <span>تحت التجربة</span>
            <span
              className={`px-[6px] py-[1px] rounded-full text-[11px] font-bold ${
                activeTab === "trial"
                  ? "bg-[#ffddb6] text-[#7b4e00]"
                  : "bg-[#eae8e4] text-[#514537]"
              }`}
            >
              18
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("suspended")}
            className={`px-[12px] py-[6px] rounded-[4px] text-[13px] font-semibold transition-colors flex items-center gap-[6px] cursor-pointer whitespace-nowrap ${
              activeTab === "suspended"
                ? "bg-[#f5f3ef] text-[#1b1c1a]"
                : "text-[#514537] hover:bg-[#faf9f7]"
            }`}
          >
            <span>المعطلة</span>
            <span
              className={`px-[6px] py-[1px] rounded-full text-[11px] font-bold ${
                activeTab === "suspended"
                  ? "bg-[#ffddb6] text-[#7b4e00]"
                  : "bg-[#eae8e4] text-[#514537]"
              }`}
            >
              14
            </span>
          </button>
        </div>

        {/* Left: Page Size Selector */}
        <div className="flex items-center gap-[8px] text-[12px] text-[#514537]">
          <span className="text-[#837565]">عرض الصفحة:</span>
          <div className="relative">
            <select
              aria-label="عرض الصفحة"
              className="appearance-none bg-[#f5f3ef] border border-[#eae8e4] rounded-[4px] px-[12px] py-[6px] pe-[28px] text-[12px] font-semibold text-[#1b1c1a] focus:outline-none cursor-pointer"
              defaultValue="10"
            >
              <option value="10">10 مكاتب</option>
              <option value="25">25 مكتب</option>
              <option value="50">50 مكتب</option>
            </select>
            <ChevronDown className="size-[12px] text-[#514537] absolute start-[10px] top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Toolbar Row 2: Search & Filter dropdowns */}
      <div className="p-[16px] bg-[#faf9f7] border-b border-[#f0eeea] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-[12px]">
        {/* Search Input */}
        <div className="relative flex-1 max-w-[420px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم المكتب، المالك، رقم الجوال..."
            className="w-full h-[40px] bg-white border border-[#eae8e4] rounded-[4px] ps-[14px] pe-[36px] text-[13px] text-[#1b1c1a] placeholder:text-[#837565] focus:outline-none focus:border-[#9c6402]"
          />
          <Search className="size-[16px] text-[#837565] absolute end-[12px] top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-[8px]">
          {/* Plan Filter */}
          <div className="relative">
            <select
              aria-label="جميع الباقات"
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="appearance-none bg-white border border-[#eae8e4] rounded-[4px] px-[12px] py-[7px] pe-[28px] ps-[30px] text-[12px] font-medium text-[#1b1c1a] focus:outline-none cursor-pointer"
            >
              <option value="all">جميع الباقات</option>
              <option value="الاحترافية">الباقة الاحترافية</option>
              <option value="الشركات">باقة الشركات</option>
              <option value="الأساسية">الباقة الأساسية</option>
              <option value="مجانية">تجربة مجانية</option>
            </select>
            <Filter className="size-[13px] text-[#514537] absolute start-[10px] top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="size-[11px] text-[#514537] absolute end-[10px] top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Account Status Filter */}
          <div className="relative">
            <select
              aria-label="حالة الحساب"
              onChange={(e) => {
                const val = e.target.value;
                if (val === "all") setActiveTab("all");
                else if (val === "active") setActiveTab("active");
                else if (val === "suspended") setActiveTab("suspended");
              }}
              className="appearance-none bg-white border border-[#eae8e4] rounded-[4px] px-[12px] py-[7px] pe-[28px] ps-[30px] text-[12px] font-medium text-[#1b1c1a] focus:outline-none cursor-pointer"
            >
              <option value="all">حالة الحساب (الكل)</option>
              <option value="active">نشط</option>
              <option value="suspended">معطل</option>
            </select>
            <ToggleLeft className="size-[13px] text-[#514537] absolute start-[10px] top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="size-[11px] text-[#514537] absolute end-[10px] top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Subscription Status Filter */}
          <div className="relative">
            <select
              aria-label="حالة الاشتراك"
              onChange={(e) => {
                const val = e.target.value;
                if (val === "trial") setActiveTab("trial");
                else if (val === "active") setActiveTab("active");
                else setActiveTab("all");
              }}
              className="appearance-none bg-white border border-[#eae8e4] rounded-[4px] px-[12px] py-[7px] pe-[28px] ps-[30px] text-[12px] font-medium text-[#1b1c1a] focus:outline-none cursor-pointer"
            >
              <option value="all">حالة الاشتراك (الكل)</option>
              <option value="active">ساري ونشط</option>
              <option value="trial">تحت التجربة</option>
              <option value="overdue">متأخر بالسداد</option>
            </select>
            <CreditCard className="size-[13px] text-[#514537] absolute start-[10px] top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="size-[11px] text-[#514537] absolute end-[10px] top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* City Filter */}
          <div className="relative">
            <select
              aria-label="كافة المدن"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="appearance-none bg-white border border-[#eae8e4] rounded-[4px] px-[12px] py-[7px] pe-[28px] ps-[30px] text-[12px] font-medium text-[#1b1c1a] focus:outline-none cursor-pointer"
            >
              <option value="all">كافة المدن</option>
              <option value="الرياض">الرياض</option>
              <option value="جدة">جدة</option>
              <option value="الدمام">الدمام</option>
              <option value="الخبر">الخبر</option>
              <option value="مكة المكرمة">مكة المكرمة</option>
              <option value="المدينة المنورة">المدينة المنورة</option>
            </select>
            <Building2 className="size-[13px] text-[#514537] absolute start-[10px] top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="size-[11px] text-[#514537] absolute end-[10px] top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto scrollbar-none w-full min-h-[350px]">
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
            {filteredOffices.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-[48px] text-center text-[#837565] text-[14px]">
                  لا توجد مكاتب تطابق معايير البحث الحالية
                </td>
              </tr>
            ) : (
              filteredOffices.map((office, idx) => (
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
                          positionClass={
                            idx >= filteredOffices.length - 2
                              ? "left-0 bottom-full mb-1"
                              : "left-0 top-full mt-1"
                          }
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
      <div className="p-[16px] border-t border-[#f0eeea] flex flex-col sm:flex-row items-center justify-between gap-[12px] text-[12px] text-[#514537]">
        <div>
          <span>عرض 1 إلى 8 من أصل 128 مكتب محاماة مسجل</span>
        </div>

        <div className="flex items-center gap-[4px]">
          <button
            type="button"
            className="px-[12px] py-[6px] rounded-[4px] border border-[#eae8e4] text-[#837565] hover:bg-[#f5f3ef] transition-colors flex items-center gap-[4px] cursor-pointer"
          >
            <ChevronRight className="size-[13px]" />
            <span>السابق</span>
          </button>

          <button
            type="button"
            className="size-[30px] rounded-[4px] bg-[#9c6402] text-white font-bold flex items-center justify-center cursor-pointer shadow-sm"
          >
            1
          </button>

          <button
            type="button"
            className="size-[30px] rounded-[4px] border border-[#eae8e4] text-[#514537] hover:bg-[#f5f3ef] font-semibold flex items-center justify-center cursor-pointer"
          >
            2
          </button>

          <button
            type="button"
            className="size-[30px] rounded-[4px] border border-[#eae8e4] text-[#514537] hover:bg-[#f5f3ef] font-semibold flex items-center justify-center cursor-pointer"
          >
            3
          </button>

          <span className="px-[4px] text-[#837565]">...</span>

          <button
            type="button"
            className="size-[30px] rounded-[4px] border border-[#eae8e4] text-[#514537] hover:bg-[#f5f3ef] font-semibold flex items-center justify-center cursor-pointer"
          >
            16
          </button>

          <button
            type="button"
            className="px-[12px] py-[6px] rounded-[4px] border border-[#eae8e4] text-[#1b1c1a] hover:bg-[#f5f3ef] transition-colors flex items-center gap-[4px] cursor-pointer"
          >
            <span>التالي</span>
            <ChevronLeft className="size-[13px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
