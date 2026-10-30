"use client";

import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  Plus,
  Building2,
  ShieldCheck,
  Hourglass,
  BellRing,
  MoreVertical,
  ArrowUp,
  Ban,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { DetailedSubscribedFirm } from "../types/plan.types";
import { detailedSilverSubscribedFirms } from "../data/initialPlans";
import { UpgradeSubscriptionDialog } from "./UpgradeSubscriptionDialog";
import { DeactivateSubscriptionDialog } from "./DeactivateSubscriptionDialog";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";

interface SubscribedFirmsViewProps {
  onBack: () => void;
  onAddNewFirm?: () => void;
}

export function SubscribedFirmsView({
  onBack,
  onAddNewFirm,
}: SubscribedFirmsViewProps) {
  const [firms, setFirms] = useState<DetailedSubscribedFirm[]>(
    detailedSilverSubscribedFirms
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "active" | "trial" | "near_limit" | "overdue"
  >("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [renewalFilter, setRenewalFilter] = useState("all");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Active Menu Dropdown state (rendered via createPortal to prevent table scrollbars)
  const [openMenuFirm, setOpenMenuFirm] = useState<{
    firm: DetailedSubscribedFirm;
    coords: { left: number; top?: number; bottom?: number };
  } | null>(null);

  useEffect(() => {
    if (!openMenuFirm) return;
    const handleClose = () => setOpenMenuFirm(null);
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-actions-menu]") && !target.closest("[data-actions-popover]")) {
        setOpenMenuFirm(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenuFirm(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleClose, true);
    window.addEventListener("resize", handleClose);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleClose, true);
      window.removeEventListener("resize", handleClose);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openMenuFirm]);

  const toggleFirmMenu = (e: React.MouseEvent<HTMLButtonElement>, firm: DetailedSubscribedFirm) => {
    e.stopPropagation();
    if (openMenuFirm?.firm.id === firm.id) {
      setOpenMenuFirm(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const menuEstimatedHeight = 150;
    const menuWidth = 190;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUp = spaceBelow < menuEstimatedHeight + 12 && spaceAbove > spaceBelow;

    let left = rect.left;
    if (left + menuWidth > window.innerWidth - 8) {
      left = window.innerWidth - menuWidth - 8;
    }
    if (left < 8) {
      left = 8;
    }

    setOpenMenuFirm({
      firm,
      coords: {
        left,
        top: openUp ? undefined : rect.bottom + 4,
        bottom: openUp ? window.innerHeight - rect.top + 4 : undefined,
      },
    });
  };

  // Dialog states
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [selectedFirm, setSelectedFirm] =
    useState<DetailedSubscribedFirm | null>(null);

  const handleOpenUpgrade = (firm: DetailedSubscribedFirm) => {
    setSelectedFirm(firm);
    setOpenMenuFirm(null);
    setUpgradeDialogOpen(true);
  };

  const handleOpenDeactivate = (firm: DetailedSubscribedFirm) => {
    setSelectedFirm(firm);
    setOpenMenuFirm(null);
    setDeactivateDialogOpen(true);
  };

  const handleConfirmUpgrade = (firmId: string, targetPlan: string) => {
    toast.success(`تمت ترقية اشتراك المكتب إلى "${targetPlan}" بنجاح.`);
  };

  const handleConfirmDeactivate = (
    firmId: string,
    reason: string,
    notes: string,
    mode: "immediate" | "end_of_cycle"
  ) => {
    setFirms((prev) =>
      prev.map((f) =>
        f.id === firmId ? { ...f, status: "suspended" as const } : f
      )
    );
    toast.success(
      mode === "immediate"
        ? "تم تعطيل اشتراك المكتب فورياً بنجاح."
        : "تمت جدولة تعطيل اشتراك المكتب بنهاية الدورة الحالية."
    );
  };

  // Filtered firms
  const filteredFirms = useMemo(() => {
    return firms.filter((firm) => {
      // Tab filter
      if (activeTab === "active" && firm.status !== "active") return false;
      if (activeTab === "trial" && firm.status !== "trial") return false;
      if (
        activeTab === "near_limit" &&
        !firm.casesCritical &&
        firm.lawyersUsed < firm.lawyersLimit
      ) {
        return false;
      }
      if (
        activeTab === "overdue" &&
        firm.status !== "pending_payment" &&
        !firm.isOverdue
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = firm.name.toLowerCase().includes(q);
        const matchOwner = firm.owner.toLowerCase().includes(q);
        const matchLicense = firm.licenseNumber.includes(q);
        const matchCity = firm.city.toLowerCase().includes(q);
        if (!matchName && !matchOwner && !matchLicense && !matchCity) {
          return false;
        }
      }

      return true;
    });
  }, [firms, activeTab, searchQuery]);

  const totalItems = filteredFirms.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const paginatedFirms = useMemo(() => {
    if (pageSize >= 9999) return filteredFirms;
    const start = (currentPage - 1) * pageSize;
    return filteredFirms.slice(start, start + pageSize);
  }, [filteredFirms, currentPage, pageSize]);

  return (
    <div className="w-full space-y-[20px] font-['Cairo',sans-serif]" dir="rtl">
      {/* 1. Top Identity & Action Header */}
      <div className="bg-white rounded-[8px] p-[20px] md:p-[24px] shadow-2xs border border-[#f0eeea] flex flex-col md:flex-row md:items-center justify-between gap-[16px]">
        {/* Right: Title & Badge */}
        <div>
          <div className="flex items-center gap-[12px] mb-[6px]">
            <button
              type="button"
              onClick={onBack}
              className="p-[6px] rounded-[6px] hover:bg-[#eae8e4] text-[#737067] hover:text-[#1b1c1a] transition-colors cursor-pointer"
              title="العودة لتفاصيل الباقة"
            >
              <ArrowRight className="size-[20px]" />
            </button>
            <h1 className="text-[24px] md:text-[26px] font-extrabold text-[#1b1c1a] leading-tight">
              المكاتب المشتركة في الباقة
            </h1>
            <span className="font-bold text-[11px] text-[#514537] bg-[#f5f3ef] border border-[#e2ded7] px-[10px] py-[3px] rounded">
              الباقة الفضية | 399 ر.س / شهرياً
            </span>
          </div>

          <p className="text-[13px] text-[#737067] max-w-[650px] leading-relaxed">
            متابعة المكاتب المسجلة على هذه الباقة وإدارة اشتراكاتها ومراقبة حدود
            استهلاك الموارد.
          </p>
        </div>

        {/* Left: Add Firm CTA */}
        <div className="shrink-0 flex items-center gap-[10px]">
          <button
            type="button"
            onClick={
              onAddNewFirm || (() => toast.info("فتح نموذج إضافة اشتراك مكتب جديد"))
            }
            className="bg-[#9c6402] hover:bg-[#855402] text-white font-bold text-[13px] px-[18px] py-[9px] rounded-[6px] shadow-xs flex items-center gap-[8px] transition-colors cursor-pointer"
          >
            <Plus className="size-[16px] stroke-[2.5]" />
            <span>إضافة اشتراك مكتب</span>
          </button>
        </div>
      </div>

      {/* 2. Four KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
        {/* Card 1: Total */}
        <div className="bg-white rounded-[8px] border border-[#e2ded7] p-[18px] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-[10px]">
            <span className="text-[12px] font-semibold text-[#737067]">
              إجمالي المكاتب المشتركة
            </span>
            <div className="p-[8px] rounded-[6px] bg-[#fbf6ee] text-[#9c6402]">
              <Building2 className="size-[18px]" />
            </div>
          </div>
          <div className="flex items-baseline gap-[6px] mb-[6px]">
            <span className="text-[28px] font-black text-[#1b1c1a]">52</span>
            <span className="text-[13px] font-bold text-[#737067]">مكتباً</span>
          </div>
          <div>
            <span className="text-[10px] font-bold bg-[#fbf6ee] text-[#9c6402] px-[8px] py-[2px] rounded border border-[#f5e3c8]">
              54% من إجمالي المنصة
            </span>
          </div>
        </div>

        {/* Card 2: Active */}
        <div className="bg-white rounded-[8px] border border-[#e2ded7] p-[18px] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-[10px]">
            <span className="text-[12px] font-semibold text-[#737067]">
              اشتراكات نشطة
            </span>
            <div className="p-[8px] rounded-[6px] bg-[#e8f5e9] text-[#15803d]">
              <ShieldCheck className="size-[18px]" />
            </div>
          </div>
          <div className="flex items-baseline gap-[6px] mb-[6px]">
            <span className="text-[28px] font-black text-[#1b1c1a]">48</span>
            <span className="text-[13px] font-bold text-[#737067]">مكتباً</span>
          </div>
          <div>
            <span className="text-[10px] font-bold bg-[#e8f5e9] text-[#15803d] px-[8px] py-[2px] rounded border border-[#c8e6c9]">
              • 92.3% نشط
            </span>
          </div>
        </div>

        {/* Card 3: Trial */}
        <div className="bg-white rounded-[8px] border border-[#e2ded7] p-[18px] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-[10px]">
            <span className="text-[12px] font-semibold text-[#737067]">
              اشتراكات قيد التجربة
            </span>
            <div className="p-[8px] rounded-[6px] bg-[#e0f2fe] text-[#0369a1]">
              <Hourglass className="size-[18px]" />
            </div>
          </div>
          <div className="flex items-baseline gap-[6px] mb-[6px]">
            <span className="text-[28px] font-black text-[#1b1c1a]">3</span>
            <span className="text-[13px] font-bold text-[#737067]">مكاتب</span>
          </div>
          <div>
            <span className="text-[10px] font-bold bg-[#e0f2fe] text-[#0369a1] px-[8px] py-[2px] rounded border border-[#bae6fd]">
              فترة تجريبية سارية
            </span>
          </div>
        </div>

        {/* Card 4: Overdue/Expiring */}
        <div className="bg-white rounded-[8px] border border-[#e2ded7] p-[18px] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-[10px]">
            <span className="text-[12px] font-semibold text-[#737067]">
              اشتراكات منتهية أو متأخرة
            </span>
            <div className="p-[8px] rounded-[6px] bg-[#fee2e2] text-[#b91c1c]">
              <BellRing className="size-[18px]" />
            </div>
          </div>
          <div className="flex items-baseline gap-[6px] mb-[6px]">
            <span className="text-[28px] font-black text-[#b91c1c]">1</span>
            <span className="text-[13px] font-bold text-[#737067]">مكتب واحد</span>
          </div>
          <div>
            <span className="text-[10px] font-bold bg-[#fee2e2] text-[#b91c1c] px-[8px] py-[2px] rounded border border-[#fecaca]">
              • يتطلب متابعة مالية
            </span>
          </div>
        </div>
      </div>

      {/* 3. Unified Filter Bar */}
      <UnifiedFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="ابحث باسم المكتب، المالك، رقم الترخيص، أو السجل..."
        primaryFilterValue={activeTab}
        onPrimaryFilterChange={(v) =>
          setActiveTab(
            v as "all" | "active" | "trial" | "near_limit" | "overdue"
          )
        }
        primaryFilterOptions={[
          { label: "الكل (128)", value: "all" },
          { label: "النشطة (96)", value: "active" },
          { label: "تحت التجربة (18)", value: "trial" },
          { label: "اقترب من الحد (14)", value: "near_limit" },
          { label: "متعثر الدفع (14)", value: "overdue" },
        ]}
        hasActiveFilters={
          activeTab !== "all" ||
          statusFilter !== "all" ||
          renewalFilter !== "all" ||
          resourceFilter !== "all" ||
          Boolean(searchQuery)
        }
        onReset={() => {
          setSearchQuery("");
          setActiveTab("all");
          setStatusFilter("all");
          setRenewalFilter("all");
          setResourceFilter("all");
        }}
        drawerTitle="تصفية المشتركين في الباقة"
        drawerContent={
          <div className="space-y-4 text-start font-['Cairo',sans-serif]">
            {/* Status Filter */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#1b1c1a] block">
                حالة الاشتراك
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-[40px] bg-[#f5f3ef] text-[#1b1c1a] text-[13px] font-semibold rounded-[4px] px-[12px] border border-transparent focus:outline-none focus:ring-1 focus:ring-[#9c6402]/30 cursor-pointer"
              >
                <option value="all">الكل</option>
                <option value="active">نشط</option>
                <option value="trial">قيد التجربة</option>
                <option value="pending">بانتظار السداد</option>
              </select>
            </div>

            {/* Renewal Filter */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#1b1c1a] block">
                موعد التجديد
              </label>
              <select
                value={renewalFilter}
                onChange={(e) => setRenewalFilter(e.target.value)}
                className="w-full h-[40px] bg-[#f5f3ef] text-[#1b1c1a] text-[13px] font-semibold rounded-[4px] px-[12px] border border-transparent focus:outline-none focus:ring-1 focus:ring-[#9c6402]/30 cursor-pointer"
              >
                <option value="all">الكل</option>
                <option value="annual">سنوي</option>
                <option value="monthly">شهري</option>
              </select>
            </div>

            {/* Resource Filter */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#1b1c1a] block">
                استهلاك الموارد
              </label>
              <select
                value={resourceFilter}
                onChange={(e) => setResourceFilter(e.target.value)}
                className="w-full h-[40px] bg-[#f5f3ef] text-[#1b1c1a] text-[13px] font-semibold rounded-[4px] px-[12px] border border-transparent focus:outline-none focus:ring-1 focus:ring-[#9c6402]/30 cursor-pointer"
              >
                <option value="all">الكل</option>
                <option value="high">استهلاك مرتفع (&gt;80%)</option>
                <option value="full">بلغ الحد الأقصى</option>
              </select>
            </div>

            {/* Page Size in Drawer */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#1b1c1a] block">
                عدد الصفوف بالصفحة
              </label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full h-[40px] bg-[#f5f3ef] text-[#1b1c1a] text-[13px] font-semibold rounded-[4px] px-[12px] border border-transparent focus:outline-none focus:ring-1 focus:ring-[#9c6402]/30 cursor-pointer"
              >
                <option value={10}>10 مكاتب</option>
                <option value={25}>25 مكتباً</option>
                <option value={50}>50 مكتباً</option>
              </select>
            </div>
          </div>
        }
      />

      {/* 4. Comprehensive Data Table */}
      <div className="bg-white rounded-[8px] border border-[#e2ded7] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full text-right text-[12px]">
            <thead>
              <tr className="bg-[#faf8f5] border-b border-[#f0eeea] text-[#737067] font-semibold">
                <th className="py-[12px] px-[14px]">اسم المنشأة والمكتب</th>
                <th className="py-[12px] px-[14px]">المالك والمسؤول</th>
                <th className="py-[12px] px-[14px]">المحامين (حد 4)</th>
                <th className="py-[12px] px-[14px]">القضايا (حد 200)</th>
                <th className="py-[12px] px-[14px]">الوكلاء (حد 5)</th>
                <th className="py-[12px] px-[14px]">التجديد الدوري</th>
                <th className="py-[12px] px-[14px]">حالة الاشتراك</th>
                <th className="py-[12px] px-[14px] text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0eeea]">
              {paginatedFirms.map((firm) => (
                <tr
                  key={firm.id}
                  className="hover:bg-[#faf8f5] transition-colors"
                >
                  {/* Firm name & details */}
                  <td className="py-[14px] px-[14px]">
                    <div className="flex items-center gap-[10px]">
                      <div className="size-[34px] rounded-[6px] bg-[#f5f3ef] border border-[#e2ded7] flex items-center justify-center font-bold text-[#9c6402] shrink-0">
                        {firm.initial}
                      </div>
                      <div>
                        <div className="font-bold text-[#1b1c1a]">
                          {firm.name}
                        </div>
                        <div className="text-[11px] text-[#737067]">
                          {firm.licenseNumber} • {firm.city}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Owner & contact */}
                  <td className="py-[14px] px-[14px]">
                    <div className="font-bold text-[#1b1c1a]">{firm.owner}</div>
                    <div className="text-[11px] text-[#737067]">
                      {firm.contact}
                    </div>
                  </td>

                  {/* Lawyers limit progress */}
                  <td className="py-[14px] px-[14px] min-w-[120px]">
                    <div className="space-y-[4px]">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#1b1c1a]">
                          {firm.lawyersUsed} / {firm.lawyersLimit}
                        </span>
                        {firm.lawyersUsed >= firm.lawyersLimit ? (
                          <span className="text-[10px] font-bold text-[#b91c1c] bg-[#fee2e2] px-[4px] py-[1px] rounded">
                            بلغ الحد
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#15803d]">
                            متبقي {firm.lawyersLimit - firm.lawyersUsed}
                          </span>
                        )}
                      </div>
                      <div className="h-[4px] w-full bg-[#eeebe5] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            firm.lawyersUsed >= firm.lawyersLimit
                              ? "bg-[#b91c1c]"
                              : "bg-[#15803d]"
                          }`}
                          style={{
                            width: `${(firm.lawyersUsed / firm.lawyersLimit) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Cases limit progress */}
                  <td className="py-[14px] px-[14px] min-w-[130px]">
                    <div className="space-y-[4px]">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#1b1c1a]">
                          {firm.casesUsed} / {firm.casesLimit}
                        </span>
                        {firm.casesCritical ? (
                          <span className="text-[10px] font-bold text-[#b91c1c] bg-[#fee2e2] px-[4px] py-[1px] rounded">
                            {Math.round((firm.casesUsed / firm.casesLimit) * 100)}% (حرج)
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#737067]">
                            {Math.round((firm.casesUsed / firm.casesLimit) * 100)}%
                          </span>
                        )}
                      </div>
                      <div className="h-[4px] w-full bg-[#eeebe5] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            firm.casesCritical
                              ? "bg-[#b91c1c]"
                              : firm.casesUsed / firm.casesLimit > 0.7
                              ? "bg-[#d97706]"
                              : "bg-[#15803d]"
                          }`}
                          style={{
                            width: `${(firm.casesUsed / firm.casesLimit) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Agents limit progress */}
                  <td className="py-[14px] px-[14px] min-w-[110px]">
                    <div className="space-y-[4px]">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#1b1c1a]">
                          {firm.agentsUsed} / {firm.agentsLimit}
                        </span>
                        {firm.agentsUsed >= firm.agentsLimit ? (
                          <span className="text-[10px] font-bold text-[#b91c1c]">
                            مكتمل
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#737067]">
                            {Math.round((firm.agentsUsed / firm.agentsLimit) * 100)}%
                          </span>
                        )}
                      </div>
                      <div className="h-[4px] w-full bg-[#eeebe5] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            firm.agentsUsed >= firm.agentsLimit
                              ? "bg-[#b91c1c]"
                              : "bg-[#15803d]"
                          }`}
                          style={{
                            width: `${(firm.agentsUsed / firm.agentsLimit) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Renewal Date & Cycle */}
                  <td className="py-[14px] px-[14px]">
                    <div className="flex items-center gap-[6px]">
                      <span
                        className={`font-bold ${
                          firm.isOverdue ? "text-[#b91c1c]" : "text-[#1b1c1a]"
                        }`}
                      >
                        {firm.renewalDate}
                      </span>
                      <span className="text-[10px] font-bold bg-[#f5f3ef] text-[#514537] px-[6px] py-[1px] rounded border border-[#e2ded7]">
                        {firm.renewalCycle}
                      </span>
                    </div>
                    <div
                      className={`text-[11px] mt-[2px] ${
                        firm.isOverdue ? "text-[#b91c1c] font-bold" : "text-[#737067]"
                      }`}
                    >
                      {firm.remainingDaysText}
                    </div>
                  </td>

                  {/* Subscription status badge */}
                  <td className="py-[14px] px-[14px]">
                    {firm.status === "active" && (
                      <span className="inline-flex items-center gap-[4px] text-[11px] font-bold text-[#15803d] bg-[#e8f5e9] px-[8px] py-[3px] rounded-full border border-[#c8e6c9]">
                        <span className="size-[6px] rounded-full bg-[#15803d]" />
                        <span>نشط</span>
                      </span>
                    )}

                    {firm.status === "expiring_soon" && (
                      <span className="inline-flex items-center gap-[4px] text-[11px] font-bold text-[#92400e] bg-[#fef3c7] px-[8px] py-[3px] rounded-full border border-[#fde68a]">
                        <span className="size-[6px] rounded-full bg-[#f59e0b]" />
                        <span>ينتهي قريباً</span>
                      </span>
                    )}

                    {firm.status === "trial" && (
                      <span className="inline-flex items-center gap-[4px] text-[11px] font-bold text-[#0369a1] bg-[#e0f2fe] px-[8px] py-[3px] rounded-full border border-[#bae6fd]">
                        <span className="size-[6px] rounded-full bg-[#0284c7]" />
                        <span>قيد التجربة</span>
                      </span>
                    )}

                    {firm.status === "pending_payment" && (
                      <span className="inline-flex items-center gap-[4px] text-[11px] font-bold text-[#b91c1c] bg-[#fee2e2] px-[8px] py-[3px] rounded-full border border-[#fecaca]">
                        <span className="size-[6px] rounded-full bg-[#b91c1c]" />
                        <span>بانتظار السداد</span>
                      </span>
                    )}

                    {firm.status === "suspended" && (
                      <span className="inline-flex items-center gap-[4px] text-[11px] font-bold text-[#737067] bg-[#f5f3ef] px-[8px] py-[3px] rounded-full border border-[#e2ded7]">
                        <span className="size-[6px] rounded-full bg-[#737067]" />
                        <span>معطل</span>
                      </span>
                    )}
                  </td>

                  {/* Actions dropdown */}
                  <td className="py-[14px] px-[14px] text-center" data-actions-menu>
                    <button
                      type="button"
                      onClick={(e) => toggleFirmMenu(e, firm)}
                      className={`p-[6px] rounded-[4px] transition-colors cursor-pointer ${
                        openMenuFirm?.firm.id === firm.id
                          ? "bg-[#eae8e4] text-[#1b1c1a]"
                          : "text-[#737067] hover:bg-[#eae8e4] hover:text-[#1b1c1a]"
                      }`}
                      title="خيارات إضافية"
                    >
                      <MoreVertical className="size-[16px]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="p-[14px] border-t border-[#f0eeea] flex flex-col sm:flex-row sm:items-center justify-between gap-[12px] text-[12px] text-[#737067] font-['Cairo']">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <span>عرض </span>
              <span className="font-bold text-[#1b1c1a]">{startItem}</span>
              <span> إلى </span>
              <span className="font-bold text-[#1b1c1a]">{endItem}</span>
              <span> من أصل </span>
              <span className="font-bold text-[#1b1c1a]">{totalItems}</span>
              <span> مكتباً مسجلاً في الباقة</span>
            </div>

            <div className="flex items-center gap-1.5 border-s border-[#e2ded7] ps-3">
              <span className="text-[11px] text-[#737067]">صفوف بالصفحة:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-[#f5f3ef] text-[#1b1c1a] text-[11px] font-bold py-1 px-2 rounded-[4px] border border-[#e2ded7] focus:outline-none cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={9999}>الكل</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-[4px]">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-[10px] py-[4px] rounded border border-[#e2ded7] bg-white text-[#737067] hover:bg-[#f5f3ef] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-[4px]"
            >
              <ChevronRight className="size-[14px]" />
              <span>السابق</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              if (totalPages > 5 && Math.abs(p - currentPage) > 2 && p !== 1 && p !== totalPages) {
                if (p === 2 || p === totalPages - 1) {
                  return (
                    <span key={p} className="px-[2px] text-[#737067]">
                      ...
                    </span>
                  );
                }
                return null;
              }
              const isActive = currentPage === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentPage(p)}
                  className={`size-[28px] rounded font-bold text-[12px] flex items-center justify-center cursor-pointer transition-colors ${
                    isActive
                      ? "bg-[#9c6402] text-white"
                      : "border border-[#e2ded7] bg-white text-[#1b1c1a] hover:bg-[#f5f3ef]"
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-[10px] py-[4px] rounded border border-[#e2ded7] bg-white text-[#737067] hover:bg-[#f5f3ef] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-[4px]"
            >
              <span>التالي</span>
              <ChevronLeft className="size-[14px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Menu Popover (Rendered in document.body via Portal to prevent table scrollbars) */}
      {typeof document !== "undefined" && openMenuFirm && createPortal(
        <div
          data-actions-popover
          style={{
            position: "fixed",
            left: `${openMenuFirm.coords.left}px`,
            ...(openMenuFirm.coords.top !== undefined ? { top: `${openMenuFirm.coords.top}px` } : {}),
            ...(openMenuFirm.coords.bottom !== undefined ? { bottom: `${openMenuFirm.coords.bottom}px` } : {}),
            zIndex: 9999,
          }}
          className="w-[190px] bg-white rounded-[6px] shadow-[0px_8px_24px_rgba(0,0,0,0.14)] border border-[#e2ded7] p-[4px] text-right animate-in fade-in-50 zoom-in-95 select-none font-['Cairo',sans-serif]"
          dir="rtl"
        >
          <button
            type="button"
            onClick={() => handleOpenUpgrade(openMenuFirm.firm)}
            className="w-full flex items-center gap-[8px] px-[10px] py-[7px] text-[12px] font-semibold text-[#1b1c1a] hover:bg-[#faf8f5] rounded-[4px] cursor-pointer"
          >
            <ArrowUp className="size-[14px] text-[#9c6402]" />
            <span>ترقية اشتراك المكتب</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenDeactivate(openMenuFirm.firm)}
            className="w-full flex items-center gap-[8px] px-[10px] py-[7px] text-[12px] font-semibold text-[#b91c1c] hover:bg-[#fee2e2]/40 rounded-[4px] cursor-pointer"
          >
            <Ban className="size-[14px] text-[#b91c1c]" />
            <span>تعطيل اشتراك المكتب</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const firmName = openMenuFirm.firm.name;
              setOpenMenuFirm(null);
              toast.info(`عرض تفاصيل ${firmName}`);
            }}
            className="w-full flex items-center gap-[8px] px-[10px] py-[7px] text-[12px] font-semibold text-[#514537] hover:bg-[#faf8f5] rounded-[4px] cursor-pointer"
          >
            <Eye className="size-[14px]" />
            <span>عرض تفاصيل المكتب</span>
          </button>
        </div>,
        document.body
      )}

      {/* Upgrade Subscription Dialog */}
      <UpgradeSubscriptionDialog
        isOpen={upgradeDialogOpen}
        onClose={() => setUpgradeDialogOpen(false)}
        firm={selectedFirm}
        onConfirmUpgrade={handleConfirmUpgrade}
      />

      {/* Deactivate Subscription Dialog */}
      <DeactivateSubscriptionDialog
        isOpen={deactivateDialogOpen}
        onClose={() => setDeactivateDialogOpen(false)}
        firm={selectedFirm}
        onConfirmDeactivate={handleConfirmDeactivate}
      />
    </div>
  );
}
