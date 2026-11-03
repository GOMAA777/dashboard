"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  DoorOpen,
  Eye,
  Mail,
  MoreVertical,
  RotateCcw,
  SlidersHorizontal,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Calendar,
  ClipboardList,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";
import { PageSizeDropdown } from "@/components/shared/PageSizeDropdown";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { EnterOfficeConfirmModal } from "@/features/clients/components/EnterOfficeConfirmModal";
import type { ClientOffice } from "@/features/clients/types/client.types";
import type { FirmListItem } from "@/lib/api/types";
import { fetchFirms } from "@/lib/api/firms";
import {
  fetchImpersonationLogs,
  type ImpersonationLog,
} from "@/lib/api/impersonation";
import { enterOfficeAsAdmin } from "@/lib/api/enter-office";
import { ImpersonationLogDetailsModal } from "./ImpersonationLogDetailsModal";
import { ImpersonationRowActionMenu } from "./ImpersonationRowActionMenu";

export type ExtendedImpersonationLog = ImpersonationLog & {
  logo?: string | null;
  initial?: string;
  initialBg?: string;
  initialText?: string;
  licenseNumber?: string;
  city?: string;
  adminEmail?: string;
  adminRole?: string;
  phone?: string;
  plan?: string;
  autoRenew?: boolean;
};

function formatArabicDate(isoStr?: string | null) {
  if (!isoStr) return "—";
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    return d.toLocaleDateString("ar-SA-u-nu-latn", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return isoStr;
  }
}

function formatArabicTime(isoStr?: string | null) {
  if (!isoStr) return "";
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("ar-SA-u-nu-latn", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
}

type TabFilter = "all" | "active" | "suspended";

export function ImpersonationLogsView() {
  const [logs, setLogs] = useState<ExtendedImpersonationLog[]>([]);
  const [firmsList, setFirmsList] = useState<FirmListItem[]>([]);
  const [offices, setOffices] = useState<Array<{ label: string; value: string }>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [officeFilter, setOfficeFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "name">("newest");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [logsError, setLogsError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | number | null>(null);

  // Modals state
  const [selectedLogForDetails, setSelectedLogForDetails] = useState<ImpersonationLog | null>(null);
  const [officeToEnter, setOfficeToEnter] = useState<ClientOffice | null>(null);
  const [isEnteringOffice, setIsEnteringOffice] = useState(false);
  const [failedLogos, setFailedLogos] = useState<Record<string | number, boolean>>({});

  // Close row action menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-row-menu-container]")) {
        setOpenActionMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch offices list for drawer dropdown
  useEffect(() => {
    let cancelled = false;
    fetchFirms({ status: "all", page: 1, per_page: 100 })
      .then(({ items }) => {
        if (cancelled) return;
        setFirmsList(items);
        setOffices(
          items.map((firm) => ({
            value: String(firm.id),
            label: firm.name || `مكتب #${firm.id}`,
          }))
        );
      })
      .catch(() => {
        if (!cancelled) {
          setFirmsList([]);
          setOffices([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch impersonation logs
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLogsError(null);

    fetchImpersonationLogs({
      firm_id: officeFilter === "all" ? undefined : officeFilter,
      from: dateFrom || undefined,
      to: dateTo || undefined,
      page: 1,
      per_page: 100,
    })
      .then((result) => {
        if (cancelled) return;
        const enriched = (result.items || []).map((item, idx) => {
          const fid = item.company_id || item.firm_id;
          const matchedFirm = firmsList.find(
            (f) =>
              (fid && String(f.id) === String(fid)) ||
              (item.company_name && f.name?.includes(item.company_name)) ||
              (item.firm_name && f.name?.includes(item.firm_name))
          );
          const firmName = item.company_name || item.firm_name || matchedFirm?.name || `مكتب #${fid ?? item.id}`;

          return {
            ...item,
            company_name: firmName,
            firm_name: firmName,
            logo: (item as ExtendedImpersonationLog).logo || matchedFirm?.logo || undefined,
            initial: (firmName || "م").trim().charAt(0),
            initialBg: idx % 2 === 0 ? "bg-white dark:bg-[#1a120d]" : "bg-[#fff6e8] dark:bg-[#342711]",
            initialText: "text-[#9c6402] dark:text-[#e29d38]",
            licenseNumber: (item as ExtendedImpersonationLog).licenseNumber || matchedFirm?.license_number || "ترخيص معتمد",
            city: (item as ExtendedImpersonationLog).city || matchedFirm?.city || "الرياض",
            adminEmail: (item as ExtendedImpersonationLog).adminEmail || matchedFirm?.email || "admin@aljoudi.sa",
            adminRole: (item as ExtendedImpersonationLog).adminRole || "مشرف عام للنظام",
            phone: (item as ExtendedImpersonationLog).phone || matchedFirm?.phone,
            plan: (item as ExtendedImpersonationLog).plan || matchedFirm?.subscription_plan || "باقة التميز العدلي",
            autoRenew: (item as ExtendedImpersonationLog).autoRenew ?? matchedFirm?.auto_renew ?? true,
          };
        });
        setLogs(enriched);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLogs([]);
        const raw =
          err && typeof err === "object" && "message" in err
            ? String((err as { message: unknown }).message)
            : "";
        const isMissingRoute =
          /impersonation-logs|could not be found|not found|404/i.test(raw);
        setLogsError(
          isMissingRoute
            ? "تعذر تحميل سجل الدخول. المسار غير متاح حالياً على الخادم، جرّب مرة أخرى لاحقاً."
            : raw || "تعذر تحميل سجل الدخول. تحقق من الاتصال ثم أعد المحاولة."
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [officeFilter, dateFrom, dateTo, activeTab, searchQuery, firmsList, reloadKey]);

  // Handle entering office as admin
  const handleConfirmEnterOffice = async () => {
    if (!officeToEnter || isEnteringOffice) return;
    setIsEnteringOffice(true);
    const office = officeToEnter;
    try {
      const handoffUrl = await enterOfficeAsAdmin({
        id: office.id,
        name: office.name,
        owner: office.owner,
        email: office.email,
        phone: office.phone,
      });
      toast.success(`جاري الربط والانتقال إلى لوحة مكتب «${office.name}»...`);
      setOfficeToEnter(null);
      window.location.assign(handoffUrl);
    } catch {
      toast.error(`تعذر الدخول إلى مكتب «${office.name}»`);
      setIsEnteringOffice(false);
    }
  };

  const handleEnterOfficeFromRow = (log: ExtendedImpersonationLog) => {
    const firmId = log.company_id || log.firm_id || log.id;
    const firmName = log.company_name || log.firm_name || `مكتب #${firmId}`;
    setOfficeToEnter({
      id: String(firmId),
      name: firmName,
      initial: (firmName || "م").charAt(0),
      initialBg: "bg-white dark:bg-[#1a120d]",
      initialText: "text-[#9c6402] dark:text-[#e29d38]",
      planBadgeClass: "bg-[#fff6e8] dark:bg-[rgba(226,157,56,0.12)] text-[#9c6402] dark:text-[#e29d38] border-[#ffddb6] dark:border-[#e29d38]/40",
      registrationDate: "2026-01-15",
      owner: log.admin_name || "مشرف النظام",
      licenseNumber: log.licenseNumber || "911",
      email: log.adminEmail || "office@test.com",
      phone: log.phone || "+966 0500000000",
      city: log.city || "الرياض",
      plan: log.plan || "باقة التميز العدلي",
      accountStatus: {
        label: !log.ended_at ? "نشط" : "غير نشط",
        type: !log.ended_at ? "active" : "suspended",
        bgClass: !log.ended_at ? "bg-[#e8f5e9] dark:bg-[#132c1c]" : "bg-black/5 dark:bg-white/5",
        textClass: !log.ended_at ? "text-[#1b7340] dark:text-[#6ee7b7]" : "text-[#837565] dark:text-[#cdc5bd]",
        dotClass: !log.ended_at ? "bg-[#1b7340] dark:bg-[#10b981]" : "bg-[#837565] dark:bg-[#a89f91]",
      },
      subscriptionStatus: {
        label: "نشط",
        type: "active",
        bgClass: "bg-[#e8f5e9] dark:bg-[#132c1c]",
        textClass: "text-[#1b7340] dark:text-[#6ee7b7]",
      },
    });
  };

  // Tab counts
  const totalAllCount = logs.length;
  const activeCount = logs.filter((l) => !l.ended_at).length;
  const suspendedCount = logs.filter((l) => Boolean(l.ended_at)).length;

  const uniqueFirmsCount = useMemo(() => {
    const set = new Set<string | number>();
    logs.forEach((l) => {
      const fid = l.company_id || l.firm_id || l.id;
      if (fid) set.add(fid);
    });
    return set.size;
  }, [logs]);

  const uniqueAdminsCount = useMemo(() => {
    const set = new Set<string | number>();
    logs.forEach((l) => {
      const aid = l.admin_id || l.admin_name;
      if (aid) set.add(aid);
    });
    return set.size;
  }, [logs]);

  const activePct = totalAllCount > 0 ? Math.round((activeCount / totalAllCount) * 100) : 0;

  const [isQuickEnterModalOpen, setIsQuickEnterModalOpen] = useState(false);
  const [selectedQuickEnterOfficeId, setSelectedQuickEnterOfficeId] = useState("");

  const handleQuickEnterSubmit = async () => {
    if (!selectedQuickEnterOfficeId || isEnteringOffice) return;
    const targetOffice = offices.find((o) => o.value === selectedQuickEnterOfficeId);
    const officeName = targetOffice?.label || `مكتب #${selectedQuickEnterOfficeId}`;
    setIsEnteringOffice(true);
    try {
      const handoffUrl = await enterOfficeAsAdmin({
        id: selectedQuickEnterOfficeId,
        name: officeName,
      });
      toast.success(`جاري الربط والانتقال إلى لوحة مكتب «${officeName}»...`);
      setIsQuickEnterModalOpen(false);
      setSelectedQuickEnterOfficeId("");
      window.location.assign(handoffUrl);
    } catch {
      toast.error(`تعذر الدخول إلى مكتب «${officeName}»`);
      setIsEnteringOffice(false);
    }
  };

  // Filtered and sorted data
  const filteredLogs = useMemo(() => {
    let result = [...logs];

    // Filter by tab
    if (activeTab === "active") {
      result = result.filter((l) => !l.ended_at);
    } else if (activeTab === "suspended") {
      result = result.filter((l) => Boolean(l.ended_at));
    }

    // Filter by city
    if (cityFilter !== "all") {
      result = result.filter((l) => l.city === cityFilter);
    }

    // Filter by search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((l) => {
        const firm = String(l.company_name || l.firm_name || "").toLowerCase();
        const admin = String(l.admin_name || "").toLowerCase();
        const phone = String(l.phone || "").toLowerCase();
        const email = String(l.adminEmail || "").toLowerCase();
        const license = String(l.licenseNumber || "").toLowerCase();
        const role = String(l.adminRole || "").toLowerCase();
        const compId = String(l.company_id || l.firm_id || l.id || "").toLowerCase();
        const ip = String(l.ip || "").toLowerCase();
        return (
          firm.includes(q) ||
          admin.includes(q) ||
          role.includes(q) ||
          phone.includes(q) ||
          email.includes(q) ||
          license.includes(q) ||
          compId.includes(q.replace(/^#/, "")) ||
          `id: ${compId}`.includes(q) ||
          ip.includes(q)
        );
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortOrder === "name") {
        const nameA = a.company_name || a.firm_name || "";
        const nameB = b.company_name || b.firm_name || "";
        return nameA.localeCompare(nameB, "ar");
      }
      if (sortOrder === "oldest") {
        return new Date(a.started_at || 0).getTime() - new Date(b.started_at || 0).getTime();
      }
      return new Date(b.started_at || 0).getTime() - new Date(a.started_at || 0).getTime();
    });

    return result;
  }, [logs, activeTab, cityFilter, searchQuery, sortOrder]);

  const totalItems = filteredLogs.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePageIndex = Math.min(pageIndex, totalPages - 1);
  const startItem = totalItems === 0 ? 0 : safePageIndex * pageSize + 1;
  const endItem = Math.min((safePageIndex + 1) * pageSize, totalItems);

  const paginatedLogs = useMemo(() => {
    return filteredLogs.slice(safePageIndex * pageSize, safePageIndex * pageSize + pageSize);
  }, [filteredLogs, safePageIndex, pageSize]);

  const hasActiveFilters =
    activeTab !== "all" ||
    searchQuery.trim().length > 0 ||
    officeFilter !== "all" ||
    cityFilter !== "all" ||
    dateFrom !== "" ||
    dateTo !== "" ||
    sortOrder !== "newest";

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveTab("all");
    setOfficeFilter("all");
    setCityFilter("all");
    setSortOrder("newest");
    setDateFrom("");
    setDateTo("");
    setPageIndex(0);
  };

  return (
    <div
      dir="rtl"
      className="flex h-screen h-dvh overflow-hidden w-full bg-background text-foreground transition-colors duration-200 font-['Cairo',sans-serif]"
    >
      {/* 1. Global Navigation Sidebar */}
      <DashboardSidebar activeNav="impersonation-logs" />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 min-h-0 overflow-hidden">
        {/* Top Navbar */}
        <DashboardTopNavbar
          customBreadcrumbs={[
            { label: "إدارة العملاء", href: "/accounts" },
            { label: "سجل الدخول إلى المكاتب" },
          ]}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 flex flex-col gap-6 w-full max-w-full scrollbar-thin">
          <DashboardPageTransition>
            {isLoading && logs.length === 0 ? (
              <DashboardPageSkeleton cardsCount={4} tableRowsCount={6} />
            ) : (
              <div className="flex flex-col gap-6 w-full">
                {/* 1. Top Header (Identical design to Client Management Header) */}
                <div
                  className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full shrink-0"
                >
                  {/* Right Column: Title, Badge, Subtitle */}
                  <div className="flex items-start gap-3 text-start">
                    <div className="size-[40px] rounded-[8px] bg-[#fff9ee] dark:bg-[#2d1f16] border border-[#ffddb6] dark:border-[#423122] flex items-center justify-center shrink-0">
                      <ClipboardList className="size-[18px] text-[#9c6402] dark:text-[#e29d38]" />
                    </div>
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-[10px] flex-wrap">
                        <h1 className="text-[26px] leading-[36px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                          سجل الدخول إلى المكاتب
                        </h1>
                        <span className="bg-[#eae8e4] dark:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] text-[11px] leading-[16px] font-bold px-[10px] py-[3px] rounded-full">
                          جلسات المشرفين
                        </span>
                      </div>
                      <p className="text-[#514537] dark:text-[#a89f91] text-[13px] leading-[20px] font-normal mt-[4px]">
                        متابعة جلسات دخول مشرفي النظام إلى حسابات مكاتب المحاماة
                      </p>
                    </div>
                  </div>

                  {/* Left Column: Action Button */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setIsQuickEnterModalOpen(true)}
                      className="bg-[#9c6402] dark:bg-[#e29d38] hover:bg-[#855402] dark:hover:bg-[#d4922f] text-white dark:text-[#1c140f] px-[20px] py-[10px] rounded-[4px] text-[14px] font-semibold leading-[20px] flex items-center justify-center gap-[8px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors cursor-pointer shrink-0"
                    >
                      <DoorOpen className="size-[16px] shrink-0 stroke-[2.5]" />
                      <span>دخول لمكتب محاماة</span>
                    </button>
                  </div>
                </div>

                {logsError ? (
                  <div
                    role="alert"
                    className="rounded-[8px] border border-red-200 dark:border-red-900/50 bg-white dark:bg-[#221812] px-6 py-10 flex flex-col items-center text-center gap-3"
                  >
                    <div className="size-[48px] rounded-full bg-red-50 dark:bg-[#2c1313] flex items-center justify-center">
                      <AlertCircle className="size-[24px] text-[#dc2626] dark:text-[#f87171]" />
                    </div>
                    <h2 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      تعذر تحميل سجل الدخول
                    </h2>
                    <p className="text-[13px] text-[#737067] dark:text-[#a89f91] max-w-md">
                      {logsError}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setLogsError(null);
                        setIsLoading(true);
                        setReloadKey((k) => k + 1);
                      }}
                      className="mt-2 px-5 py-2.5 rounded-[6px] bg-[#9c6402] dark:bg-[#e29d38] hover:bg-[#855402] dark:hover:bg-[#d4922f] text-white dark:text-[#1c140f] text-[13px] font-bold transition-colors cursor-pointer"
                    >
                      إعادة المحاولة
                    </button>
                  </div>
                ) : null}

                {/* 2. 4 KPI Metrics Cards (Identical design to Client KPI Metrics) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 w-full shrink-0">
                  {/* 1. إجمالي الجلسات */}
                  <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex items-center justify-between">
                    <div className="flex flex-col items-start text-start">
                      <span className="text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[18px] font-normal">
                        إجمالي الجلسات
                      </span>
                      <div className="flex items-baseline gap-[6px] mt-[4px]">
                        <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[28px] leading-[34px] font-bold">
                          {totalAllCount}
                        </span>
                      </div>
                      <span className="text-[#837565] dark:text-[#8e8680] text-[11px] leading-[16px] mt-[2px]">
                        جلسة دخول مسجلة
                      </span>
                    </div>
                    <div className="bg-[#f5f3ef] dark:bg-[#2d1f16] text-[#9c6402] dark:text-[#e29d38] border border-transparent dark:border-[#4d3627]/60 size-[44px] rounded-[6px] flex items-center justify-center shrink-0">
                      <DoorOpen className="size-[22px]" />
                    </div>
                  </div>

                  {/* 2. الجلسات النشطة */}
                  <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex items-center justify-between">
                    <div className="flex flex-col items-start text-start">
                      <span className="text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[18px] font-normal">
                        الجلسات النشطة
                      </span>
                      <div className="flex items-baseline gap-[8px] mt-[4px]">
                        <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[28px] leading-[34px] font-bold">
                          {activeCount}
                        </span>
                        <span className="bg-[#ecfdf5] border border-emerald-200 dark:bg-[#132c1c] dark:border-emerald-500/40 text-[#065f46] dark:text-[#6ee7b7] text-[10px] leading-[14px] font-bold px-2.5 py-0.5 rounded-full">
                          {activePct}% من الإجمالي
                        </span>
                      </div>
                      <span className="text-[#837565] dark:text-[#8e8680] text-[11px] leading-[16px] mt-[2px]">
                        كافة الجلسات الحية الآن
                      </span>
                    </div>
                    <div className="bg-[#f5f3ef] dark:bg-[#2d1f16] text-[#9c6402] dark:text-[#e29d38] border border-transparent dark:border-[#4d3627]/60 size-[44px] rounded-[6px] flex items-center justify-center shrink-0">
                      <Clock className="size-[22px]" />
                    </div>
                  </div>

                  {/* 3. المكاتب المستهدفة */}
                  <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex items-center justify-between">
                    <div className="flex flex-col items-start text-start">
                      <span className="text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[18px] font-normal">
                        المكاتب المستهدفة
                      </span>
                      <div className="flex items-baseline gap-[6px] mt-[4px]">
                        <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[28px] leading-[34px] font-bold">
                          {uniqueFirmsCount}
                        </span>
                      </div>
                      <span className="text-[#837565] dark:text-[#8e8680] text-[11px] leading-[16px] mt-[2px]">
                        منشأة تم الوصول لها
                      </span>
                    </div>
                    <div className="bg-[#f5f3ef] dark:bg-[#2d1f16] text-[#9c6402] dark:text-[#e29d38] border border-transparent dark:border-[#4d3627]/60 size-[44px] rounded-[6px] flex items-center justify-center shrink-0">
                      <Building2 className="size-[22px]" />
                    </div>
                  </div>

                  {/* 4. المشرفون المنفذون */}
                  <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex items-center justify-between">
                    <div className="flex flex-col items-start text-start">
                      <span className="text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[18px] font-normal">
                        المشرفون المنفذون
                      </span>
                      <div className="flex items-baseline gap-[8px] mt-[4px]">
                        <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[28px] leading-[34px] font-bold">
                          {uniqueAdminsCount}
                        </span>
                        <span className="bg-[#fff6e8] border border-[#ffddb6] dark:bg-[rgba(226,157,56,0.12)] dark:border-[#e29d38]/30 text-[#9c6402] dark:text-[#e29d38] text-[10px] leading-[14px] font-bold px-2.5 py-0.5 rounded-full">
                          جلسات معتمدة
                        </span>
                      </div>
                      <span className="text-[#837565] dark:text-[#8e8680] text-[11px] leading-[16px] mt-[2px]">
                        مشرف نظام مصرح له
                      </span>
                    </div>
                    <div className="bg-[#f5f3ef] dark:bg-[#2d1f16] text-[#9c6402] dark:text-[#e29d38] border border-transparent dark:border-[#4d3627]/60 size-[44px] rounded-[6px] flex items-center justify-center shrink-0">
                      <ShieldCheck className="size-[22px]" />
                    </div>
                  </div>
                </div>

                {/* 3. Table Container */}
                <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#eae8e4] dark:border-[#38271c] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] overflow-hidden w-full shrink-0">
                {/* 1. Unified Filter Bar with 3 Pills + Comprehensive Drawer (EXACT MATCH TO SCREENSHOT) */}
                <UnifiedFilterBar
                  searchQuery={searchQuery}
                  onSearchChange={(val) => {
                    setSearchQuery(val);
                    setPageIndex(0);
                  }}
                  searchPlaceholder="ابحث باسم المكتب، المالك، رقم الجوال..."
                  primaryFilterValue={activeTab}
                  onPrimaryFilterChange={(v) => {
                    setActiveTab(v as TabFilter);
                    setPageIndex(0);
                  }}
                  primaryFilterMode="pills"
                  primaryFilterOptions={[
                    { label: `الكل (${totalAllCount})`, value: "all" },
                    { label: `النشطة (${activeCount})`, value: "active" },
                    { label: `المعطلة (${suspendedCount})`, value: "suspended" },
                  ]}
                  hasActiveFilters={hasActiveFilters}
                  onReset={handleResetFilters}
                  drawerTitle="تصفية شاملة لسجل الدخول"
                  drawerDescription="خيارات تصفية متقدمة لفرز وتدقيق جلسات دخول مشرفي النظام لمكاتب المحاماة بدقة."
                  drawerContent={
                    <div className="space-y-6 text-start font-['Cairo',sans-serif]">
                      {/* 1. Session Status */}
                      <div className="space-y-2">
                        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                          حالة الجلسة
                        </label>
                        <DashboardSelect
                          value={activeTab}
                          onChange={(e) => {
                            setActiveTab(e.target.value as TabFilter);
                            setPageIndex(0);
                          }}
                        >
                          <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                            كافة الجلسات (الكل)
                          </option>
                          <option value="active" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                            الجلسات النشطة الآن فقط
                          </option>
                          <option value="suspended" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                            الجلسات المكتملة / السابقة فقط
                          </option>
                        </DashboardSelect>
                      </div>

                      {/* 2. Office Filter */}
                      <div className="space-y-2">
                        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                          مكتب المحاماة المستهدف
                        </label>
                        <DashboardSelect
                          value={officeFilter}
                          onChange={(e) => {
                            setOfficeFilter(e.target.value);
                            setPageIndex(0);
                          }}
                        >
                          <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                            كافة مكاتب المحاماة
                          </option>
                          {offices.map((off) => (
                            <option key={off.value} value={off.value} className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                              {off.label}
                            </option>
                          ))}
                        </DashboardSelect>
                      </div>

                      {/* 3. City Filter */}
                      <div className="space-y-2">
                        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                          المدينة / المنطقة
                        </label>
                        <DashboardSelect
                          value={cityFilter}
                          onChange={(e) => {
                            setCityFilter(e.target.value);
                            setPageIndex(0);
                          }}
                        >
                          <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">كافة المدن والمناطق</option>
                          <option value="الرياض" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">مدينة الرياض</option>
                          <option value="جدة" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">مدينة جدة</option>
                          <option value="أبها" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">أبها وعسير</option>
                          <option value="الدمام" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">الدمام والمنطقة الشرقية</option>
                        </DashboardSelect>
                      </div>

                      {/* 4. Date Range */}
                      <div className="space-y-2">
                        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                          النطاق الزمني
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[11px] text-[#837565] block mb-1">من تاريخ</span>
                            <input
                              type="date"
                              value={dateFrom}
                              onChange={(e) => {
                                setDateFrom(e.target.value);
                                setPageIndex(0);
                              }}
                              className="w-full h-9 bg-[#f5f3ef] dark:bg-[#160e0a] rounded-[4px] px-2 text-[12px] border border-[#ded5c6] dark:border-[#422e20] text-[#1b1c1a] dark:text-[#fdfbf7]"
                            />
                          </div>
                          <div>
                            <span className="text-[11px] text-[#837565] block mb-1">إلى تاريخ</span>
                            <input
                              type="date"
                              value={dateTo}
                              min={dateFrom || undefined}
                              onChange={(e) => {
                                setDateTo(e.target.value);
                                setPageIndex(0);
                              }}
                              className="w-full h-9 bg-[#f5f3ef] dark:bg-[#160e0a] rounded-[4px] px-2 text-[12px] border border-[#ded5c6] dark:border-[#422e20] text-[#1b1c1a] dark:text-[#fdfbf7]"
                            />
                          </div>
                        </div>
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
                          عدد الصفوف بالصفحة
                        </label>
                        <DashboardSelect
                          value={pageSize}
                          onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPageIndex(0);
                          }}
                        >
                          <option value={5} className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">5 صفوف بالصفحة</option>
                          <option value={10} className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">10 صفوف بالصفحة</option>
                          <option value={20} className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">20 صف بالصفحة</option>
                          <option value={50} className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">50 صف بالصفحة</option>
                        </DashboardSelect>
                      </div>
                    </div>
                  }
                  className="rounded-b-none border-b-0"
                />

                {/* 2. Main Data Table (EXACT MATCH TO SCREENSHOT COLUMNS & STYLING) */}
                <div className="overflow-x-auto scrollbar-none w-full">
                  <table className="w-full text-start border-collapse">
                    <thead>
                      <tr className="bg-[#f5f3ef] dark:bg-[#281c15] border-b border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[18px] font-semibold">
                        <th className="py-[12px] px-[12px] w-[50px] text-center font-bold">#</th>
                        <th className="py-[12px] px-[16px] whitespace-nowrap">اسم المكتب والترخيص</th>
                        <th className="py-[12px] px-[16px] whitespace-nowrap">المسؤول المنفذ (المسمى)</th>
                        <th className="py-[12px] px-[16px] whitespace-nowrap">عنوان IP</th>
                        <th className="py-[12px] px-[16px] whitespace-nowrap">توقيت وتاريخ الدخول</th>
                        <th className="py-[12px] px-[16px] whitespace-nowrap">باقة العميل</th>
                        <th className="py-[12px] px-[16px] text-center whitespace-nowrap">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0eeea] dark:divide-[#38271c]">
                      {paginatedLogs.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-[48px] text-center text-[#837565] dark:text-[#8e8680] text-[14px]">
                            {logsError
                              ? "تعذر عرض السجلات بسبب خطأ في التحميل"
                              : "لا توجد سجلات تطابق معايير البحث الحالية"}
                          </td>
                        </tr>
                      ) : (
                        paginatedLogs.map((log, index) => {
                          const isLive = !log.ended_at;
                          const firmName = log.company_name || log.firm_name || `مكتب #${log.firm_id ?? log.id}`;
                          const ownerName = log.admin_name || "Cameron Fox";

                          return (
                            <tr
                              key={log.id}
                              className="hover:bg-[#faf9f7] dark:hover:bg-[#281c15]/60 transition-colors group"
                            >
                              {/* 0. ترقيم السجل (#) */}
                              <td className="py-[16px] px-[12px] text-center">
                                <span className="inline-flex items-center justify-center size-[24px] rounded-[4px] font-mono text-[11px] font-bold text-[#837565] dark:text-[#cdc5bd] bg-[#f5f3ef] dark:bg-[#1a120d] border border-transparent dark:border-[#38271c]">
                                  {safePageIndex * pageSize + index + 1}
                                </span>
                              </td>

                              {/* 1. اسم المكتب والترخيص */}
                              <td className="py-[16px] px-[16px]">
                                <div className="flex items-center gap-[12px]">
                                  {log.logo && !failedLogos[log.id] ? (
                                    <div className="size-[36px] rounded-[4px] bg-white dark:bg-[#1a120d] border border-[#eae8e4] dark:border-[#422e20] p-0.5 flex items-center justify-center shrink-0 overflow-hidden relative">
                                      <span className="text-[12px] font-bold text-[#9c6402] dark:text-[#e29d38] absolute pointer-events-none select-none">
                                        {log.initial || "L"}
                                      </span>
                                      <img
                                        src={log.logo}
                                        alt=""
                                        className="max-h-full max-w-full object-contain relative z-10 bg-white dark:bg-[#1a120d]"
                                        onError={(e) => {
                                          e.currentTarget.style.display = "none";
                                          setFailedLogos((prev) => ({ ...prev, [log.id]: true }));
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    <div
                                      className={`size-[36px] rounded-[4px] border border-[#ded5c6] dark:border-[#422e20] flex items-center justify-center font-bold text-[14px] shrink-0 ${
                                        log.initialBg || "bg-white dark:bg-[#1a120d]"
                                      } ${log.initialText || "text-[#9c6402] dark:text-[#e29d38]"}`}
                                    >
                                      {log.initial || firmName.charAt(0)}
                                    </div>
                                  )}
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-bold leading-[19px]">
                                        {firmName}
                                      </span>
                                      <span
                                        className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#f4efe6] dark:bg-[#271d15] text-[#78644f] dark:text-[#c4b3a3] border border-[#dfd7cc] dark:border-[#423122]"
                                        title={`معرف المنشأة (Company ID): #${log.company_id || log.firm_id || log.id}`}
                                      >
                                        ID: #{log.company_id || log.firm_id || log.id}
                                      </span>
                                    </div>
                                    <span className="text-[#837565] dark:text-[#8e8680] text-[11px] leading-[16px]">
                                      {log.licenseNumber} • {log.city}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* 2. المسؤول الذي دخل المكتب والمسمى (TITLE) */}
                              <td className="py-[16px] px-[16px]">
                                <div className="flex flex-col items-start gap-1">
                                  <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-bold leading-[19px]">
                                    {ownerName}
                                  </span>
                                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold text-[#7a4c00] dark:text-[#f3c27e] bg-[#fff6e8] dark:bg-[#342711] border border-[#ffddb6] dark:border-[#e29d38]/30">
                                    {log.adminRole || "مشرف عام للنظام"}
                                  </span>
                                </div>
                              </td>

                              {/* 3. عنوان IP */}
                              <td className="py-[16px] px-[16px]">
                                <div className="flex items-center gap-1.5 font-mono text-[12px] direction-ltr">
                                  <span className="px-2 py-0.5 rounded bg-[#f5f3ef] dark:bg-[#20150e] border border-[#e4ded5] dark:border-[#38271c] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                                    {log.ip || "—"}
                                  </span>
                                  {log.ip && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(log.ip || "");
                                        toast.success(`تم نسخ عنوان IP (${log.ip})`);
                                      }}
                                      className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 text-[#837565] dark:text-[#8e8680] transition-colors cursor-pointer"
                                      title="نسخ عنوان IP"
                                    >
                                      <Copy className="size-3" />
                                    </button>
                                  )}
                                </div>
                              </td>

                              {/* 4. توقيت وتاريخ الدخول */}
                              <td className="py-[16px] px-[16px]">
                                <div className="flex flex-col items-start gap-1">
                                  <div className="flex items-center gap-1.5 text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] font-semibold">
                                    <Calendar className="size-3.5 text-[#837565] dark:text-[#8e8680] shrink-0" />
                                    <span>{formatArabicDate(log.started_at)}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[#837565] dark:text-[#8e8680] text-[11px]">
                                    <Clock className="size-3 text-[#837565] dark:text-[#8e8680] shrink-0" />
                                    <span dir="ltr">{formatArabicTime(log.started_at)}</span>
                                    {isLive ? (
                                      <span className="inline-flex items-center gap-1 text-[10px] text-[#10b981] font-bold ms-1 bg-[#ecfdf5] dark:bg-[#132c1c] border border-emerald-200 dark:border-emerald-500/30 px-1.5 py-0.2 rounded-full">
                                        <span className="size-1.5 rounded-full bg-[#10b981] animate-pulse" />
                                        نشط الآن
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center text-[10px] text-[#837565] dark:text-[#8e8680] ms-1">
                                        مكتمل
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* 5. باقة العميل */}
                              <td className="py-[16px] px-[16px]">
                                <div className="flex flex-col gap-1 items-start">
                                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap border bg-[#fff6e8] dark:bg-[rgba(226,157,56,0.12)] text-[#9c6402] dark:text-[#e29d38] border-[#ffddb6] dark:border-[#e29d38]/40">
                                    {log.plan || "باقة التميز العدلي"}
                                  </span>
                                  <span className="text-[10px] font-semibold inline-flex items-center gap-1 text-[#065f46] dark:text-[#6ee7b7]">
                                    <span className="size-1.5 rounded-full bg-[#10b981]" />
                                    {log.autoRenew ? "تجديد تلقائي" : "اشتراك معتمد"}
                                  </span>
                                </div>
                              </td>

                              {/* 6. الإجراءات (عين , باب) */}
                              <td className="py-[16px] px-[16px] text-center">
                                <div className="flex items-center justify-center gap-2">
                                  {/* 1. دخول المكتب كمسؤول (باب) */}
                                  <button
                                    type="button"
                                    aria-label="دخول المكتب كمسؤول"
                                    onClick={() => handleEnterOfficeFromRow(log)}
                                    className="p-1.5 rounded-[4px] border border-[#ffddb6] dark:border-[#e29d38]/40 bg-[#fff9ee] dark:bg-[#342711] text-[#9c6402] dark:text-[#e29d38] hover:bg-[#9c6402] hover:text-white dark:hover:bg-[#e29d38] dark:hover:text-[#1a120d] transition-all cursor-pointer shadow-sm"
                                    title="دخول المكتب كمسؤول (باب)"
                                  >
                                    <DoorOpen className="size-[15px]" />
                                  </button>

                                  {/* 2. عرض تفاصيل الجلسة (عين) */}
                                  <button
                                    type="button"
                                    aria-label="عرض تفاصيل الجلسة"
                                    onClick={() => setSelectedLogForDetails(log)}
                                    className="p-1.5 rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] bg-white dark:bg-[#221812] text-[#514537] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] transition-all cursor-pointer shadow-sm"
                                    title="عرض تفاصيل الجلسة (عين)"
                                  >
                                    <Eye className="size-[15px]" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 3. Pagination Footer (EXACT MATCH TO SCREENSHOT) */}
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
                      <span> جلسة مسجلة</span>
                    </div>

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

                  {/* Left in RTL: Page Controls (Matching Screenshot: >>, السابق, 1, التالي, >>) */}
                  <div className="flex items-center gap-[4px]">
                    <button
                      type="button"
                      disabled={safePageIndex === 0 || totalItems === 0}
                      onClick={() => setPageIndex(0)}
                      title="الصفحة الأولى"
                      className="size-[30px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <ChevronsRight className="size-[14px] rtl:rotate-0 rotate-180" />
                    </button>

                    <button
                      type="button"
                      disabled={safePageIndex === 0 || totalItems === 0}
                      onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                      title="الصفحة السابقة"
                      className="px-[10px] py-[6px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-[4px] cursor-pointer"
                    >
                      <ChevronRight className="size-[13px] rtl:rotate-0 rotate-180" />
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
                                ? "bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] shadow-xs"
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
                      className="px-[10px] py-[6px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-[4px] cursor-pointer"
                    >
                      <span>التالي</span>
                      <ChevronLeft className="size-[13px] rtl:rotate-0 rotate-180" />
                    </button>

                    <button
                      type="button"
                      disabled={safePageIndex >= totalPages - 1 || totalItems === 0}
                      onClick={() => setPageIndex(totalPages - 1)}
                      title="الصفحة الأخيرة"
                      className="size-[30px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <ChevronsLeft className="size-[14px] rtl:rotate-0 rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            )}
          </DashboardPageTransition>
        </main>
      </div>

      {/* 3. Modals */}
      <ImpersonationLogDetailsModal
        isOpen={Boolean(selectedLogForDetails)}
        log={selectedLogForDetails}
        onClose={() => setSelectedLogForDetails(null)}
      />

      <EnterOfficeConfirmModal
        isOpen={Boolean(officeToEnter)}
        office={officeToEnter}
        isLoading={isEnteringOffice}
        onClose={() => setOfficeToEnter(null)}
        onConfirm={handleConfirmEnterOffice}
      />

      {/* 4. Quick Enter Office Modal */}
      {isQuickEnterModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-['Cairo',sans-serif]"
          onClick={() => setIsQuickEnterModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-[#221812] rounded-[8px] border border-[#f0eeea] dark:border-[#38271c] shadow-xl p-6 flex flex-col gap-5 text-start"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-[#fff6e8] dark:bg-[rgba(226,157,56,0.12)] text-[#9c6402] dark:text-[#e29d38] flex items-center justify-center shrink-0">
                <DoorOpen className="size-5" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  دخول لمكتب محاماة كمسؤول
                </h3>
                <p className="text-[12px] text-[#837565] dark:text-[#8e8680]">
                  اختر مكتب المحاماة للدخول إلى لوحة تحكمه بصلاحيات المسؤول
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                مكتب المحاماة المطلوب
              </label>
              <DashboardSelect
                value={selectedQuickEnterOfficeId}
                onChange={(e) => setSelectedQuickEnterOfficeId(e.target.value)}
              >
                <option value="" disabled className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  اختر مكتب المحاماة...
                </option>
                {offices.map((off) => (
                  <option key={off.value} value={off.value} className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {off.label}
                  </option>
                ))}
              </DashboardSelect>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#f0eeea] dark:border-[#38271c]">
              <button
                type="button"
                onClick={() => setIsQuickEnterModalOpen(false)}
                className="px-4 py-2 text-[13px] font-semibold text-[#837565] dark:text-[#8e8680] hover:bg-black/5 dark:hover:bg-white/5 rounded-[4px] transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={!selectedQuickEnterOfficeId || isEnteringOffice}
                onClick={handleQuickEnterSubmit}
                className="bg-[#9c6402] hover:bg-[#855402] disabled:opacity-50 text-white px-5 py-2 rounded-[4px] text-[13px] font-bold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <DoorOpen className="size-4" />
                <span>{isEnteringOffice ? "جارٍ تسجيل الدخول..." : "دخول فوري كمسؤول"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
