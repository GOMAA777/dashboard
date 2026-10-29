"use client";

import React, { useState, useMemo } from "react";
import {
  ArrowRight,
  Plus,
  Building2,
  ShieldCheck,
  Hourglass,
  BellRing,
  Search,
  ChevronDown,
  RotateCcw,
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

  // Active Menu Dropdown state
  const [openMenuFirmId, setOpenMenuFirmId] = useState<string | null>(null);

  React.useEffect(() => {
    if (!openMenuFirmId) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-actions-menu]")) {
        setOpenMenuFirmId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuFirmId]);

  // Dialog states
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [selectedFirm, setSelectedFirm] =
    useState<DetailedSubscribedFirm | null>(null);

  const handleOpenUpgrade = (firm: DetailedSubscribedFirm) => {
    setSelectedFirm(firm);
    setOpenMenuFirmId(null);
    setUpgradeDialogOpen(true);
  };

  const handleOpenDeactivate = (firm: DetailedSubscribedFirm) => {
    setSelectedFirm(firm);
    setOpenMenuFirmId(null);
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

      {/* 3. Toolbar: Tabs & Search Filters */}
      <div className="bg-white rounded-[8px] border border-[#e2ded7] p-[16px] shadow-2xs space-y-[14px]">
        {/* Row 1: Status Filter Tabs & Page Size */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[12px]">
          <div className="flex flex-wrap items-center gap-[6px] bg-[#f5f3ef] p-[3px] rounded-[6px]">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-[12px] py-[6px] rounded-[4px] text-[12px] font-bold transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-white text-[#9c6402] shadow-2xs"
                  : "text-[#514537] hover:text-[#1b1c1a]"
              }`}
            >
              الكل 128
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("active")}
              className={`px-[12px] py-[6px] rounded-[4px] text-[12px] font-bold transition-all cursor-pointer ${
                activeTab === "active"
                  ? "bg-white text-[#9c6402] shadow-2xs"
                  : "text-[#514537] hover:text-[#1b1c1a]"
              }`}
            >
              النشطة 96
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("trial")}
              className={`px-[12px] py-[6px] rounded-[4px] text-[12px] font-bold transition-all cursor-pointer ${
                activeTab === "trial"
                  ? "bg-white text-[#9c6402] shadow-2xs"
                  : "text-[#514537] hover:text-[#1b1c1a]"
              }`}
            >
              تحت التجربة 18
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("near_limit")}
              className={`px-[12px] py-[6px] rounded-[4px] text-[12px] font-bold transition-all cursor-pointer ${
                activeTab === "near_limit"
                  ? "bg-white text-[#9c6402] shadow-2xs"
                  : "text-[#514537] hover:text-[#1b1c1a]"
              }`}
            >
              اقترب من الحد 14
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("overdue")}
              className={`px-[12px] py-[6px] rounded-[4px] text-[12px] font-bold transition-all cursor-pointer ${
                activeTab === "overdue"
                  ? "bg-white text-[#9c6402] shadow-2xs"
                  : "text-[#514537] hover:text-[#1b1c1a]"
              }`}
            >
              متعثر الدفع 14
            </button>
          </div>

          <div className="flex items-center gap-[6px] text-[12px] text-[#737067]">
            <span>عرض الصفحة:</span>
            <div className="relative">
              <select className="appearance-none bg-[#f5f3ef] border border-[#e2ded7] rounded-[4px] py-[4px] pe-[24px] ps-[10px] text-[12px] font-bold text-[#1b1c1a] focus:outline-none cursor-pointer">
                <option value="10">10 مكاتب</option>
                <option value="25">25 مكتباً</option>
                <option value="50">50 مكتباً</option>
              </select>
              <ChevronDown className="size-[12px] absolute top-1/2 -translate-y-1/2 end-[6px] pointer-events-none text-[#737067]" />
            </div>
          </div>
        </div>

        {/* Row 2: Search input & Sub-filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-[12px]">
          {/* Search Input */}
          <div className="relative flex-1 max-w-[460px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم المكتب، المالك، رقم الترخيص، أو السجل المدني..."
              className="w-full h-[38px] bg-[#f5f3ef] text-[#1b1c1a] placeholder-[#837565] text-[12px] rounded-[6px] pe-[36px] ps-[14px] focus:outline-none focus:ring-1 focus:ring-[#9c6402]/30 transition-all"
            />
            <div className="absolute top-1/2 -translate-y-1/2 end-[12px] pointer-events-none text-[#837565]">
              <Search className="size-[15px]" />
            </div>
          </div>

          {/* Filters & Reset */}
          <div className="flex flex-wrap items-center gap-[8px]">
            {/* Filter 1: Status */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-[#f5f3ef] border border-[#e2ded7] rounded-[6px] h-[38px] pe-[28px] ps-[12px] text-[12px] font-semibold text-[#1b1c1a] focus:outline-none cursor-pointer"
              >
                <option value="all">حالة الاشتراك: الكل</option>
                <option value="active">نشط</option>
                <option value="trial">قيد التجربة</option>
                <option value="pending">بانتظار السداد</option>
              </select>
              <ChevronDown className="size-[14px] absolute top-1/2 -translate-y-1/2 end-[8px] pointer-events-none text-[#737067]" />
            </div>

            {/* Filter 2: Renewal */}
            <div className="relative">
              <select
                value={renewalFilter}
                onChange={(e) => setRenewalFilter(e.target.value)}
                className="appearance-none bg-[#f5f3ef] border border-[#e2ded7] rounded-[6px] h-[38px] pe-[28px] ps-[12px] text-[12px] font-semibold text-[#1b1c1a] focus:outline-none cursor-pointer"
              >
                <option value="all">موعد التجديد: الكل</option>
                <option value="annual">سنوي</option>
                <option value="monthly">شهري</option>
              </select>
              <ChevronDown className="size-[14px] absolute top-1/2 -translate-y-1/2 end-[8px] pointer-events-none text-[#737067]" />
            </div>

            {/* Filter 3: Resources */}
            <div className="relative">
              <select
                value={resourceFilter}
                onChange={(e) => setResourceFilter(e.target.value)}
                className="appearance-none bg-[#f5f3ef] border border-[#e2ded7] rounded-[6px] h-[38px] pe-[28px] ps-[12px] text-[12px] font-semibold text-[#1b1c1a] focus:outline-none cursor-pointer"
              >
                <option value="all">استهلاك الموارد: الكل</option>
                <option value="high">استهلاك مرتفع (&gt;80%)</option>
                <option value="full">بلغ الحد الأقصى</option>
              </select>
              <ChevronDown className="size-[14px] absolute top-1/2 -translate-y-1/2 end-[8px] pointer-events-none text-[#737067]" />
            </div>

            {/* Reset */}
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveTab("all");
                setStatusFilter("all");
                setRenewalFilter("all");
                setResourceFilter("all");
              }}
              className="size-[38px] rounded-[6px] bg-[#f5f3ef] hover:bg-[#eae8e4] text-[#737067] flex items-center justify-center transition-colors cursor-pointer"
              title="إعادة ضبط الفلاتر"
            >
              <RotateCcw className="size-[15px]" />
            </button>
          </div>
        </div>
      </div>

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
              {filteredFirms.map((firm, idx) => (
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
                  <td className="py-[14px] px-[14px] text-center relative" data-actions-menu>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenuFirmId(
                          openMenuFirmId === firm.id ? null : firm.id
                        )
                      }
                      className="p-[6px] rounded-[4px] text-[#737067] hover:bg-[#eae8e4] hover:text-[#1b1c1a] transition-colors cursor-pointer"
                      title="خيارات إضافية"
                    >
                      <MoreVertical className="size-[16px]" />
                    </button>

                    {/* Popover Menu */}
                    {openMenuFirmId === firm.id && (
                      <div
                        className={`absolute end-0 start-auto rtl:left-0 rtl:right-auto ${
                          idx >= filteredFirms.length - 2
                            ? "bottom-full mb-[4px]"
                            : "top-full mt-[4px]"
                        } w-[190px] bg-white rounded-[6px] shadow-lg border border-[#e2ded7] p-[4px] z-50 text-right animate-in fade-in duration-150`}
                      >
                        <button
                          type="button"
                          onClick={() => handleOpenUpgrade(firm)}
                          className="w-full flex items-center gap-[8px] px-[10px] py-[7px] text-[12px] font-semibold text-[#1b1c1a] hover:bg-[#faf8f5] rounded-[4px] cursor-pointer"
                        >
                          <ArrowUp className="size-[14px] text-[#9c6402]" />
                          <span>ترقية اشتراك المكتب</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenDeactivate(firm)}
                          className="w-full flex items-center gap-[8px] px-[10px] py-[7px] text-[12px] font-semibold text-[#b91c1c] hover:bg-[#fee2e2]/40 rounded-[4px] cursor-pointer"
                        >
                          <Ban className="size-[14px] text-[#b91c1c]" />
                          <span>تعطيل اشتراك المكتب</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuFirmId(null);
                            toast.info(`عرض تفاصيل ${firm.name}`);
                          }}
                          className="w-full flex items-center gap-[8px] px-[10px] py-[7px] text-[12px] font-semibold text-[#514537] hover:bg-[#faf8f5] rounded-[4px] cursor-pointer"
                        >
                          <Eye className="size-[14px]" />
                          <span>عرض تفاصيل المكتب</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="p-[14px] border-t border-[#f0eeea] flex flex-col sm:flex-row sm:items-center justify-between gap-[12px] text-[12px] text-[#737067]">
          <div>
            عرض 1 إلى {filteredFirms.length} من أصل 52 مكتباً مسجلاً في الباقة
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

            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className={`size-[28px] rounded font-bold text-[12px] flex items-center justify-center cursor-pointer ${
                currentPage === 1
                  ? "bg-[#9c6402] text-white"
                  : "border border-[#e2ded7] bg-white text-[#1b1c1a] hover:bg-[#f5f3ef]"
              }`}
            >
              1
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage(2)}
              className={`size-[28px] rounded font-bold text-[12px] flex items-center justify-center cursor-pointer ${
                currentPage === 2
                  ? "bg-[#9c6402] text-white"
                  : "border border-[#e2ded7] bg-white text-[#1b1c1a] hover:bg-[#f5f3ef]"
              }`}
            >
              2
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage(3)}
              className={`size-[28px] rounded font-bold text-[12px] flex items-center justify-center cursor-pointer ${
                currentPage === 3
                  ? "bg-[#9c6402] text-white"
                  : "border border-[#e2ded7] bg-white text-[#1b1c1a] hover:bg-[#f5f3ef]"
              }`}
            >
              3
            </button>

            <span className="px-[4px] text-[#737067]">...</span>

            <button
              type="button"
              onClick={() => setCurrentPage(16)}
              className={`size-[28px] rounded font-bold text-[12px] flex items-center justify-center cursor-pointer ${
                currentPage === 16
                  ? "bg-[#9c6402] text-white"
                  : "border border-[#e2ded7] bg-white text-[#1b1c1a] hover:bg-[#f5f3ef]"
              }`}
            >
              16
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(16, p + 1))}
              className="px-[10px] py-[4px] rounded border border-[#e2ded7] bg-white text-[#737067] hover:bg-[#f5f3ef] cursor-pointer flex items-center gap-[4px]"
            >
              <span>التالي</span>
              <ChevronLeft className="size-[14px]" />
            </button>
          </div>
        </div>
      </div>

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
