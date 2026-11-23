"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Building2,
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
  Ticket,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";
import { UnifiedPagination } from "@/components/shared/UnifiedPagination";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import {
  EnterOfficeConfirmModal,
  type OfficeEntryActivityPayload,
} from "@/features/clients/components/EnterOfficeConfirmModal";
import type { ClientOffice } from "@/features/clients/types/client.types";
import type { FirmListItem } from "@/lib/api/types";
import { fetchFirms } from "@/lib/api/firms";
import {
  fetchImpersonationLogs,
  type ImpersonationLog,
} from "@/lib/api/impersonation";
import {
  OFFICE_ACTIVITY_CATEGORIES,
  getActivityCategoryMeta,
} from "@/lib/constants/office-activities";
import { enterOfficeAsAdmin } from "@/lib/api/enter-office";
import { buildInitialHandoffUrl, openInstantHandoffTab } from "@/lib/api/lawyer-session";
import { useLanguage } from "@/lib/i18n";
import { localizePlanName, getLocalizedCityName, localizeRoleOrTitle } from "@/lib/localize";
import { ImpersonationLogDetailsModal, calculateDurationText } from "./ImpersonationLogDetailsModal";
import { ImpersonationRowActionMenu } from "./ImpersonationRowActionMenu";
import { useImpersonationLogsQuery } from "@/features/impersonation-logs/hooks/useImpersonationLogsQuery";
import { useFirmsQuery } from "@/features/clients/hooks/useClientsQuery";
import { cn } from "@/lib/utils";

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

function formatArabicDate(isoStr?: string | null, isEn = false) {
  if (!isoStr) return "—";
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    return d.toLocaleDateString(isEn ? "en-US" : "ar-SA-u-nu-latn", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return isoStr;
  }
}

function formatArabicTime(isoStr?: string | null, isEn = false) {
  if (!isoStr) return "";
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString(isEn ? "en-US" : "ar-SA-u-nu-latn", {
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
  const { t, isEn } = useLanguage();
  const [logs, setLogs] = useState<ExtendedImpersonationLog[]>([]);
  const [firmsList, setFirmsList] = useState<FirmListItem[]>([]);
  const [offices, setOffices] = useState<Array<{ label: string; value: string }>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [officeFilter, setOfficeFilter] = useState("all");
  const [activityFilter, setActivityFilter] = useState("all");
  const [staffFilter, setStaffFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "name">("newest");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
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

  const firmsQuery = useFirmsQuery({ status: "all", page: 1, per_page: 100 });
  const impersonationQuery = useImpersonationLogsQuery({
    firm_id: officeFilter === "all" ? undefined : officeFilter,
    activity_type: activityFilter === "all" ? undefined : activityFilter,
    admin_id: staffFilter === "all" ? undefined : staffFilter,
    from: dateFrom || undefined,
    to: dateTo || undefined,
    page: 1,
    per_page: 100,
  });

  useEffect(() => {
    if (firmsQuery.data?.items) {
      const items = firmsQuery.data.items;
      setFirmsList(items);
      setOffices(
        items.map((firm) => ({
          value: String(firm.id),
          label: firm.name || `مكتب #${firm.id}`,
        }))
      );
    }
  }, [firmsQuery.data]);

  useEffect(() => {
    if (impersonationQuery.data) {
      const enriched = (impersonationQuery.data.items || []).map((item, idx) => {
        const fid = item.company_id || item.firm_id;
        const matchedFirm = firmsList.find(
          (f) =>
            (fid && String(f.id) === String(fid)) ||
            (item.company_name && f.name?.includes(item.company_name)) ||
            (item.firm_name && f.name?.includes(item.firm_name))
        );
        const firmName =
          item.company_name ||
          item.firm_name ||
          matchedFirm?.name ||
          `مكتب #${fid ?? item.id}`;

        return {
          ...item,
          company_name: firmName,
          firm_name: firmName,
          logo: (item as ExtendedImpersonationLog).logo || matchedFirm?.logo || undefined,
          initial: (firmName || "م").trim().charAt(0),
          initialBg:
            idx % 2 === 0
              ? "bg-white dark:bg-[#1a120d]"
              : "bg-[#fff6e8] dark:bg-[#342711]",
          initialText: "text-[#9c6402] dark:text-[#e29d38]",
          licenseNumber:
            (item as ExtendedImpersonationLog).licenseNumber ||
            matchedFirm?.license_number ||
            "ترخيص معتمد",
          city:
            (item as ExtendedImpersonationLog).city ||
            matchedFirm?.city ||
            "الرياض",
          adminEmail:
            (item as ExtendedImpersonationLog).adminEmail ||
            matchedFirm?.email ||
            "admin@aljoudi.sa",
          adminRole:
            (item as ExtendedImpersonationLog).adminRole || "مشرف عام للنظام",
          phone:
            (item as ExtendedImpersonationLog).phone || matchedFirm?.phone,
          plan:
            (item as ExtendedImpersonationLog).plan ||
            matchedFirm?.subscription_plan ||
            "باقة التميز العدلي",
          autoRenew:
            (item as ExtendedImpersonationLog).autoRenew ??
            matchedFirm?.auto_renew ??
            true,
        };
      });
      setLogs(enriched);
    }
  }, [impersonationQuery.data, firmsList]);

  const isLoading = impersonationQuery.isLoading && logs.length === 0;
  const logsError = impersonationQuery.error instanceof Error ? impersonationQuery.error.message : null;

  // Handle entering office as admin
  const handleConfirmEnterOffice = async (activityData?: OfficeEntryActivityPayload) => {
    if (!officeToEnter || isEnteringOffice) return;
    setIsEnteringOffice(true);
    const office = officeToEnter;

    // Open handoff tab synchronously in a new tab (_blank) on user click to prevent popup blockers
    const handoff = openInstantHandoffTab({
      id: office.id,
      firm_name: office.name,
      name: office.owner,
    });

    try {
      const handoffUrl = await enterOfficeAsAdmin(
        {
          id: office.id,
          name: office.name,
          owner: office.owner,
          email: office.email,
          phone: office.phone,
        },
        activityData
      );
      toast.success(
        t(
          `جاري الربط وفتح لوحة مكتب «${office.name}» في تبويب جديد...`,
          `Connecting and opening "${office.name}" dashboard in a new tab...`
        )
      );
      setOfficeToEnter(null);
      // Commit handoff url directly to the opened new tab
      handoff.commit(handoffUrl);
    } catch {
      handoff.abort();
      toast.error(
        t(`تعذر الدخول إلى مكتب «${office.name}»`, `Could not access office "${office.name}"`)
      );
    } finally {
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

  const handleQuickEnterSubmit = () => {
    if (!selectedQuickEnterOfficeId || isEnteringOffice) return;
    const targetOffice = offices.find((o) => o.value === selectedQuickEnterOfficeId);
    const matchedFirm = firmsList.find((f) => String(f.id) === selectedQuickEnterOfficeId);
    const officeName = targetOffice?.label || matchedFirm?.name || (isEn ? `Firm #${selectedQuickEnterOfficeId}` : `مكتب #${selectedQuickEnterOfficeId}`);

    setIsQuickEnterModalOpen(false);
    setSelectedQuickEnterOfficeId("");

    // Open EnterOfficeConfirmModal to enforce activity logging
    setOfficeToEnter({
      id: selectedQuickEnterOfficeId,
      name: officeName,
      initial: (officeName || "م").charAt(0),
      initialBg: "bg-white dark:bg-[#1a120d]",
      initialText: "text-[#9c6402] dark:text-[#e29d38]",
      planBadgeClass: "bg-[#fff6e8] dark:bg-[rgba(226,157,56,0.12)] text-[#9c6402] dark:text-[#e29d38] border-[#ffddb6] dark:border-[#e29d38]/40",
      registrationDate: "2026-01-15",
      owner: matchedFirm?.owner_name || "رئيس المكتب",
      licenseNumber: matchedFirm?.license_number || "911",
      email: matchedFirm?.email || "office@test.com",
      phone: matchedFirm?.phone || "+966 0500000000",
      city: matchedFirm?.city || "الرياض",
      plan: matchedFirm?.subscription_plan || "باقة التميز العدلي",
      accountStatus: {
        label: "نشط",
        type: "active",
        bgClass: "bg-[#e8f5e9] dark:bg-[#132c1c]",
        textClass: "text-[#1b7340] dark:text-[#6ee7b7]",
      },
    } as ClientOffice);
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

    // Filter by activity type
    if (activityFilter !== "all") {
      result = result.filter((l) => (l.activity_type || "tech_support") === activityFilter);
    }

    // Filter by executing staff
    if (staffFilter !== "all") {
      result = result.filter(
        (l) =>
          String(l.admin_id) === staffFilter ||
          String(l.admin_name).toLowerCase() === staffFilter.toLowerCase()
      );
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
        const reason = String(l.reason || "").toLowerCase();
        const ticket = String(l.ticket_id || "").toLowerCase();
        return (
          firm.includes(q) ||
          admin.includes(q) ||
          role.includes(q) ||
          reason.includes(q) ||
          ticket.includes(q) ||
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

  const paginatedLogs = useMemo(() => {
    return filteredLogs.slice(safePageIndex * pageSize, safePageIndex * pageSize + pageSize);
  }, [filteredLogs, safePageIndex, pageSize]);

  const staffOptions = useMemo(() => {
    const map = new Map<string, string>();
    logs.forEach((l) => {
      if (l.admin_name) {
        map.set(String(l.admin_id || l.admin_name), l.admin_name);
      }
    });
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [logs]);

  const hasActiveFilters =
    activeTab !== "all" ||
    searchQuery.trim().length > 0 ||
    officeFilter !== "all" ||
    activityFilter !== "all" ||
    staffFilter !== "all" ||
    cityFilter !== "all" ||
    dateFrom !== "" ||
    dateTo !== "" ||
    sortOrder !== "newest";

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveTab("all");
    setOfficeFilter("all");
    setActivityFilter("all");
    setStaffFilter("all");
    setCityFilter("all");
    setSortOrder("newest");
    setDateFrom("");
    setDateTo("");
    setPageIndex(0);
  };

  return (
    <div
      dir={isEn ? "ltr" : "rtl"}
      className="flex h-screen h-dvh overflow-hidden w-full bg-background text-foreground transition-colors duration-200 font-['Cairo',sans-serif]"
    >
      {/* 1. Global Navigation Sidebar */}
      <DashboardSidebar activeNav="impersonation-logs" />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 min-h-0 overflow-hidden">
        {/* Top Navbar */}
        <DashboardTopNavbar
          customBreadcrumbs={[
            { label: t("إدارة العملاء", "Client Management"), href: "/accounts" },
            { label: t("النشاطات", "Activities") },
          ]}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 flex flex-col gap-6 w-full max-w-full scrollbar-thin">
          <DashboardPageTransition>
            {isLoading && logs.length === 0 ? (
              <DashboardPageSkeleton cardsCount={4} tableRowsCount={6} />
            ) : (
              <div className="flex flex-col gap-6 w-full">
                {/* 1. Top Header */}
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
                          {t("نشاطات ودخول المكاتب", "Office Activities & Entry")}
                        </h1>
                        <span className="bg-[#fff6e8] dark:bg-[#342711] text-[#9c6402] dark:text-[#e29d38] border border-[#ffddb6] dark:border-[#e29d38]/40 text-[11px] leading-[16px] font-bold px-[10px] py-[3px] rounded-full">
                          {t("سجل النشاطات والتدقيق الأمني", "Activity Logs & Audit Trail")}
                        </span>
                      </div>
                      <p className="text-[#514537] dark:text-[#a89f91] text-[13px] leading-[20px] font-normal mt-[4px]">
                        {t(
                          "سجل متابعة وتدقيق أنشطة دخول الموظفين والمشرفين إلى مكاتب المحاماة لأغراض الدعم الفني والصيانة وحل المشكلات",
                          "Track and audit staff and supervisor entry activities and sessions into law firm accounts"
                        )}
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
                      <span>{t("دخول لمكتب محاماة", "Enter Law Firm")}</span>
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
                      {t("تعذر تحميل سجل الدخول", "Failed to Load Impersonation Logs")}
                    </h2>
                    <p className="text-[13px] text-[#737067] dark:text-[#a89f91] max-w-md">
                      {logsError}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        void impersonationQuery.refetch();
                      }}
                      className="mt-2 px-5 py-2.5 rounded-[6px] bg-[#9c6402] dark:bg-[#e29d38] hover:bg-[#855402] dark:hover:bg-[#d4922f] text-white dark:text-[#1c140f] text-[13px] font-bold transition-colors cursor-pointer"
                    >
                      {t("إعادة المحاولة", "Retry")}
                    </button>
                  </div>
                ) : null}

                {/* 2. 4 KPI Metrics Cards (Identical design to Client KPI Metrics) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 w-full shrink-0">
                  {/* 1. إجمالي الجلسات */}
                  <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex items-center justify-between">
                    <div className="flex flex-col items-start text-start">
                      <span className="text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[18px] font-normal">
                        {t("إجمالي الجلسات", "Total Sessions")}
                      </span>
                      <div className="flex items-baseline gap-[6px] mt-[4px]">
                        <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[28px] leading-[34px] font-bold">
                          {totalAllCount}
                        </span>
                      </div>
                      <span className="text-[#837565] dark:text-[#8e8680] text-[11px] leading-[16px] mt-[2px]">
                        {t("جلسة دخول مسجلة", "Recorded login sessions")}
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
                        {t("الجلسات النشطة", "Active Sessions")}
                      </span>
                      <div className="flex items-baseline gap-[8px] mt-[4px]">
                        <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[28px] leading-[34px] font-bold">
                          {activeCount}
                        </span>
                        <span className="bg-[#ecfdf5] border border-emerald-200 dark:bg-[#132c1c] dark:border-emerald-500/40 text-[#065f46] dark:text-[#6ee7b7] text-[10px] leading-[14px] font-bold px-2.5 py-0.5 rounded-full">
                          {activePct}% {t("من الإجمالي", "of total")}
                        </span>
                      </div>
                      <span className="text-[#837565] dark:text-[#8e8680] text-[11px] leading-[16px] mt-[2px]">
                        {t("كافة الجلسات الحية الآن", "All live sessions currently active")}
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
                        {t("المكاتب المستهدفة", "Target Firms")}
                      </span>
                      <div className="flex items-baseline gap-[6px] mt-[4px]">
                        <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[28px] leading-[34px] font-bold">
                          {uniqueFirmsCount}
                        </span>
                      </div>
                      <span className="text-[#837565] dark:text-[#8e8680] text-[11px] leading-[16px] mt-[2px]">
                        {t("منشأة تم الوصول لها", "Firms accessed")}
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
                        {t("المشرفون المنفذون", "Executing Admins")}
                      </span>
                      <div className="flex items-baseline gap-[8px] mt-[4px]">
                        <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[28px] leading-[34px] font-bold">
                          {uniqueAdminsCount}
                        </span>
                        <span className="bg-[#fff6e8] border border-[#ffddb6] dark:bg-[rgba(226,157,56,0.12)] dark:border-[#e29d38]/30 text-[#9c6402] dark:text-[#e29d38] text-[10px] leading-[14px] font-bold px-2.5 py-0.5 rounded-full">
                          {t("جلسات معتمدة", "Authorized Sessions")}
                        </span>
                      </div>
                      <span className="text-[#837565] dark:text-[#8e8680] text-[11px] leading-[16px] mt-[2px]">
                        {t("مشرف نظام مصرح له", "Authorized system administrators")}
                      </span>
                    </div>
                    <div className="bg-[#f5f3ef] dark:bg-[#2d1f16] text-[#9c6402] dark:text-[#e29d38] border border-transparent dark:border-[#4d3627]/60 size-[44px] rounded-[6px] flex items-center justify-center shrink-0">
                      <ShieldCheck className="size-[22px]" />
                    </div>
                  </div>
                </div>

                {/* Standalone Filter Bar — separate from KPIs and from the table card */}
                <UnifiedFilterBar
                  searchQuery={searchQuery}
                  onSearchChange={(val) => {
                    setSearchQuery(val);
                    setPageIndex(0);
                  }}
                  searchPlaceholder={t("ابحث باسم المكتب، المالك، رقم الجوال...", "Search by firm name, owner, phone...")}
                  primaryFilterValue={activeTab}
                  onPrimaryFilterChange={(v) => {
                    setActiveTab(v as TabFilter);
                    setPageIndex(0);
                  }}
                  primaryFilterMode="pills"
                  primaryFilterOptions={[
                    { label: `${t("الكل", "All")} (${totalAllCount})`, value: "all" },
                    { label: `${t("النشطة", "Active")} (${activeCount})`, value: "active" },
                    { label: `${t("المعطلة", "Completed")} (${suspendedCount})`, value: "suspended" },
                  ]}
                  hasActiveFilters={hasActiveFilters}
                  onReset={handleResetFilters}
                  drawerTitle={t("تصفية شاملة لسجل الدخول", "Comprehensive Filter for Logs")}
                  drawerDescription={t(
                    "خيارات تصفية متقدمة لفرز وتدقيق جلسات دخول مشرفي النظام لمكاتب المحاماة بدقة.",
                    "Advanced filtering options to sort and audit admin sessions into law firms."
                  )}
                  drawerContent={
                    <div className="space-y-6 text-start font-['Cairo',sans-serif]">
                      {/* 1. Session Status */}
                      <div className="space-y-2">
                        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                          {t("حالة الجلسة", "Session Status")}
                        </label>
                        <DashboardSelect
                          value={activeTab}
                          onChange={(e) => {
                            setActiveTab(e.target.value as TabFilter);
                            setPageIndex(0);
                          }}
                        >
                          <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {t("كافة الجلسات (الكل)", "All Sessions (All)")}
                          </option>
                          <option value="active" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {t("الجلسات النشطة الآن فقط", "Active Sessions Only")}
                          </option>
                          <option value="suspended" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {t("الجلسات المكتملة / السابقة فقط", "Completed / Previous Sessions Only")}
                          </option>
                        </DashboardSelect>
                      </div>

                      {/* 2. Office Filter */}
                      <div className="space-y-2">
                        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                          {t("مكتب المحاماة المستهدف", "Target Law Firm")}
                        </label>
                        <DashboardSelect
                          value={officeFilter}
                          onChange={(e) => {
                            setOfficeFilter(e.target.value);
                            setPageIndex(0);
                          }}
                        >
                          <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {t("كافة مكاتب المحاماة", "All Law Firms")}
                          </option>
                          {offices.map((off) => (
                            <option key={off.value} value={off.value} className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                              {off.label}
                            </option>
                          ))}
                        </DashboardSelect>
                      </div>

                      {/* 3. Activity Type Filter */}
                      <div className="space-y-2">
                        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                          {t("نوع النشاط / التصنيف", "Activity Type / Category")}
                        </label>
                        <DashboardSelect
                          value={activityFilter}
                          onChange={(e) => {
                            setActivityFilter(e.target.value);
                            setPageIndex(0);
                          }}
                        >
                          <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {t("كافة أنواع الأنشطة (الكل)", "All Activity Types (All)")}
                          </option>
                          {(OFFICE_ACTIVITY_CATEGORIES || []).map((cat) => (
                            <option key={cat.id} value={cat.id} className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                              {isEn ? cat.labelEn : cat.labelAr}
                            </option>
                          ))}
                        </DashboardSelect>
                      </div>

                      {/* 4. Executing Staff Filter */}
                      <div className="space-y-2">
                        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                          {t("الموظف / المشرف المنفذ", "Executing Staff / Supervisor")}
                        </label>
                        <DashboardSelect
                          value={staffFilter}
                          onChange={(e) => {
                            setStaffFilter(e.target.value);
                            setPageIndex(0);
                          }}
                        >
                          <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {t("كافة المشرفين والموظفين", "All Staff & Supervisors")}
                          </option>
                          {staffOptions.map((st) => (
                            <option key={st.value} value={st.value} className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                              {st.label}
                            </option>
                          ))}
                        </DashboardSelect>
                      </div>

                      {/* 3. City Filter */}
                      <div className="space-y-2">
                        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                          {t("المدينة / المنطقة", "City / Region")}
                        </label>
                        <DashboardSelect
                          value={cityFilter}
                          onChange={(e) => {
                            setCityFilter(e.target.value);
                            setPageIndex(0);
                          }}
                        >
                          <option value="all" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {t("كافة المدن والمناطق", "All Cities & Regions")}
                          </option>
                          <option value="الرياض" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {getLocalizedCityName("الرياض", isEn)}
                          </option>
                          <option value="جدة" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {getLocalizedCityName("جدة", isEn)}
                          </option>
                          <option value="أبها" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {getLocalizedCityName("أبها", isEn)}
                          </option>
                          <option value="الدمام" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {getLocalizedCityName("الدمام", isEn)}
                          </option>
                        </DashboardSelect>
                      </div>

                      {/* 4. Date Range */}
                      <div className="space-y-2">
                        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                          {t("النطاق الزمني", "Date Range")}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[11px] text-[#837565] block mb-1">{t("من تاريخ", "From Date")}</span>
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
                            <span className="text-[11px] text-[#837565] block mb-1">{t("إلى تاريخ", "To Date")}</span>
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
                          {t("ترتيب النتائج", "Sort Results")}
                        </label>
                        <DashboardSelect
                          value={sortOrder}
                          onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest" | "name")}
                        >
                          <option value="newest" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {t("الأحدث تسجيلاً أولاً", "Newest First")}
                          </option>
                          <option value="oldest" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {t("الأقدم تسجيلاً أولاً", "Oldest First")}
                          </option>
                          <option value="name" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {t("أبجدياً حسب اسم المنشأة (أ - ي)", "Alphabetically (A - Z)")}
                          </option>
                        </DashboardSelect>
                      </div>

                      {/* 6. Page Size Control */}
                      <div className="space-y-2">
                        <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                          {t("عدد الصفوف بالصفحة", "Rows per page")}
                        </label>
                        <DashboardSelect
                          value={pageSize}
                          onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPageIndex(0);
                          }}
                        >
                          <option value={5} className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {t("5 صفوف بالصفحة", "5 rows per page")}
                          </option>
                          <option value={10} className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {t("10 صفوف بالصفحة", "10 rows per page")}
                          </option>
                          <option value={20} className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {t("20 صف بالصفحة", "20 rows per page")}
                          </option>
                          <option value={50} className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {t("50 صف بالصفحة", "50 rows per page")}
                          </option>
                        </DashboardSelect>
                      </div>
                    </div>
                  }
                />

                {/* Separate Data Table & Pagination Card */}
                <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#f0eeea] dark:border-[#38271c] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] overflow-hidden w-full shrink-0">
                <div className="overflow-x-auto scrollbar-none w-full">
                  <table className="w-full text-start border-collapse">
                    <thead>
                      <tr className="bg-[#f5f3ef] dark:bg-[#281c15] border-b border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[18px] font-semibold">
                        <th className="py-[12px] px-[12px] w-[50px] text-center font-bold">#</th>
                        <th className="py-[12px] px-[16px] whitespace-nowrap">{t("اسم المكتب والترخيص", "Firm Name & License")}</th>
                        <th className="py-[12px] px-[16px] whitespace-nowrap">{t("المسؤول المنفذ (المسمى)", "Executing Staff (Title)")}</th>
                        <th className="py-[12px] px-[16px] whitespace-nowrap">{t("نوع النشاط", "Activity Type")}</th>
                        <th className="py-[12px] px-[16px] whitespace-nowrap">{t("مبرر الدخول والتذكرة", "Reason & Ticket #")}</th>
                        <th className="py-[12px] px-[16px] whitespace-nowrap">{t("توقيت وتاريخ الدخول", "Entry Time & Date")}</th>
                        <th className="py-[12px] px-[16px] whitespace-nowrap">{t("حالة الجلسة والمدة", "Session Status & Duration")}</th>
                        <th className="py-[12px] px-[16px] text-center whitespace-nowrap">{t("الإجراءات", "Actions")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0eeea] dark:divide-[#38271c]">
                      {paginatedLogs.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-[48px] text-center text-[#837565] dark:text-[#8e8680] text-[14px]">
                            {logsError
                              ? t("تعذر عرض السجلات بسبب خطأ في التحميل", "Could not display logs due to a loading error")
                              : t("لا توجد سجلات تطابق معايير البحث الحالية", "No logs matching current search criteria")}
                          </td>
                        </tr>
                      ) : (
                        paginatedLogs.map((log, index) => {
                          const isLive = !log.ended_at;
                          const firmName = log.company_name || log.firm_name || (isEn ? `Firm #${log.firm_id ?? log.id}` : `مكتب #${log.firm_id ?? log.id}`);
                          const ownerName = log.admin_name || "مشرف النظام";
                          const actCat = getActivityCategoryMeta(log.activity_type);

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
                                        title={`${t("معرف المنشأة (Company ID):", "Company ID:")} #${log.company_id || log.firm_id || log.id}`}
                                      >
                                        ID: #{log.company_id || log.firm_id || log.id}
                                      </span>
                                    </div>
                                    <span className="text-[#837565] dark:text-[#8e8680] text-[11px] leading-[16px]">
                                      {log.licenseNumber} • {getLocalizedCityName(log.city || "", isEn)}
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
                                    {localizeRoleOrTitle(log.adminRole || "مشرف عام للنظام", isEn)}
                                  </span>
                                </div>
                              </td>

                              {/* 3. نوع النشاط */}
                              <td className="py-[16px] px-[16px] whitespace-nowrap">
                                <span
                                  className={cn(
                                    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs",
                                    actCat.badgeClass
                                  )}
                                >
                                  <Activity className="size-3" />
                                  <span>{isEn ? actCat.labelEn : actCat.labelAr}</span>
                                </span>
                              </td>

                              {/* 4. مبرر الدخول والتذكرة */}
                              <td className="py-[16px] px-[16px] max-w-[260px]">
                                <div className="flex flex-col items-start gap-1">
                                  {log.ticket_id && (
                                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#f5f3ef] dark:bg-[#1f1610] text-[#9c6402] dark:text-[#e29d38] border border-[#e4ded5] dark:border-[#38271c] inline-flex items-center gap-1">
                                      <Ticket className="size-2.5" />
                                      {log.ticket_id}
                                    </span>
                                  )}
                                  <p
                                    className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] font-medium line-clamp-2 leading-[18px] text-start"
                                    title={log.reason || ""}
                                  >
                                    {log.reason || t("دخول مباشر للمدير العام", "Direct Super Admin Access")}
                                  </p>
                                </div>
                              </td>

                              {/* 5. توقيت وتاريخ الدخول */}
                              <td className="py-[16px] px-[16px] whitespace-nowrap">
                                <div className="flex flex-col items-start gap-1">
                                  <div className="flex items-center gap-1.5 text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] font-semibold">
                                    <Calendar className="size-3.5 text-[#837565] dark:text-[#8e8680] shrink-0" />
                                    <span>{formatArabicDate(log.started_at, isEn)}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[#837565] dark:text-[#8e8680] text-[11px]">
                                    <Clock className="size-3 text-[#837565] dark:text-[#8e8680] shrink-0" />
                                    <span dir="ltr">{formatArabicTime(log.started_at, isEn)}</span>
                                  </div>
                                </div>
                              </td>

                              {/* 6. حالة الجلسة والمدة */}
                              <td className="py-[16px] px-[16px] whitespace-nowrap">
                                <div className="flex flex-col items-start gap-1">
                                  {isLive ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] text-[#10b981] font-bold bg-[#ecfdf5] dark:bg-[#132c1c] border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded-full">
                                      <span className="size-1.5 rounded-full bg-[#10b981] animate-pulse" />
                                      {t("نشطة الآن", "Active Now")}
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f5f3ef] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] border border-[#eae8e4] dark:border-[#38271c]">
                                      {t("مكتملة", "Completed")}
                                    </span>
                                  )}
                                  <span className="text-[11px] font-mono text-[#837565] dark:text-[#a89f91]">
                                    {calculateDurationText(log.started_at, log.ended_at, isEn)}
                                  </span>
                                </div>
                              </td>

                              {/* 7. الإجراءات (عين , باب) */}
                              <td className="py-[16px] px-[16px] text-center">
                                <div className="flex items-center justify-center gap-2">
                                  {/* 1. دخول المكتب كمسؤول (باب) */}
                                  <button
                                    type="button"
                                    aria-label={t("دخول المكتب كمسؤول", "Enter Office as Admin")}
                                    onClick={() => handleEnterOfficeFromRow(log)}
                                    className="p-1.5 rounded-[4px] border border-[#ffddb6] dark:border-[#e29d38]/40 bg-[#fff9ee] dark:bg-[#342711] text-[#9c6402] dark:text-[#e29d38] hover:bg-[#9c6402] hover:text-white dark:hover:bg-[#e29d38] dark:hover:text-[#1a120d] transition-all cursor-pointer shadow-sm"
                                    title={t("دخول المكتب كمسؤول (باب)", "Enter Office as Admin")}
                                  >
                                    <DoorOpen className="size-[15px]" />
                                  </button>

                                  {/* 2. عرض تفاصيل الجلسة (عين) */}
                                  <button
                                    type="button"
                                    aria-label={t("عرض تفاصيل الجلسة", "View Session Details")}
                                    onClick={() => setSelectedLogForDetails(log)}
                                    className="p-1.5 rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] bg-white dark:bg-[#221812] text-[#514537] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] transition-all cursor-pointer shadow-sm"
                                    title={t("عرض تفاصيل الجلسة (عين)", "View Session Details")}
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

                <UnifiedPagination
                  pageIndex={safePageIndex}
                  pageSize={pageSize}
                  totalItems={totalItems}
                  onPageChange={setPageIndex}
                  onPageSizeChange={setPageSize}
                  itemLabel={t("جلسة مسجلة", "recorded sessions")}
                />
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
                  {t("دخول لمكتب محاماة كمسؤول", "Enter Law Firm as Admin")}
                </h3>
                <p className="text-[12px] text-[#837565] dark:text-[#8e8680]">
                  {t("اختر مكتب المحاماة للدخول إلى لوحة تحكمه بصلاحيات المسؤول", "Choose the law firm to access its portal with admin privileges")}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                {t("مكتب المحاماة المطلوب", "Target Law Firm")}
              </label>
              <DashboardSelect
                value={selectedQuickEnterOfficeId}
                onChange={(e) => setSelectedQuickEnterOfficeId(e.target.value)}
              >
                <option value="" disabled className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("اختر مكتب المحاماة...", "Select law firm...")}
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
                {t("إلغاء", "Cancel")}
              </button>
              <button
                type="button"
                disabled={!selectedQuickEnterOfficeId || isEnteringOffice}
                onClick={handleQuickEnterSubmit}
                className="bg-[#9c6402] hover:bg-[#855402] disabled:opacity-50 text-white px-5 py-2 rounded-[4px] text-[13px] font-bold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <DoorOpen className="size-4" />
                <span>{t("دخول فوري كمسؤول", "Instant Admin Login")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
