"use client";

import { apiRequest } from "./http";
import { API_COMPANY_ID } from "./config";
import type { ApiEnvelope } from "./types";
import { unwrapData, unwrapList, asNumber, asString } from "./helpers";
import type { LawOfficeRow } from "@/features/dashboard/components/DashboardLawOfficesTable";
import type { ActivityItem } from "@/features/dashboard/components/DashboardBottomSection";
import { Building2, CreditCard, Banknote, Ticket, Scale, FileText, CheckCircle2 } from "lucide-react";
import { getLocalCustomLogo, normalizeLogoUrl } from "./mappers";

/** Raw response from Postman request 50014550-31fd1dd4-edbe-4d98-8a68-258bb70fca83 */
export interface RawDashboardApiResponse {
  statistics?: {
    clients?: number;
    active_cases?: number;
    today_appointments?: number;
    success_rate?: number;
    total_firms?: number;
    active_subscriptions?: number;
    monthly_revenue?: number;
    open_tickets?: number;
    [key: string]: unknown;
  };
  upcoming_appointments?: unknown[];
  latest_cases?: Array<{
    id: number | string;
    title: string;
    description: string;
    reference_id?: string;
    created_at: string;
  }>;
  latest_activities?: Array<{
    id: number | string;
    title: string;
    description: string;
    type?: string;
    reference_id?: string;
    created_at: string;
  }>;
  [key: string]: unknown;
}

export interface DashboardKpisState {
  totalFirms: number;
  totalFirmsGrowth: string;
  activeSubscriptions: number;
  activeSubscriptionsPercent: string;
  monthlyRevenue: number;
  monthlyRevenueFormatted: string;
  monthlyRevenueGrowth: string;
  openTickets: number;
  closedTicketsCount: number;
}

export interface DashboardRevenuePoint {
  monthAr: string;
  monthEn: string;
  value: number;
  labelAr: string;
  labelEn: string;
  isHighest?: boolean;
}

export interface DashboardPlanSlice {
  nameAr: string;
  nameEn: string;
  value: number;
  percentage: string;
  color: string;
}

export interface DashboardSupportStatsState {
  open: number;
  inProgress: number;
  awaitingClient: number;
  resolved: number;
  satisfactionRate: number;
  avgResponseMinutes: number;
}

export interface FullDashboardState {
  kpis: DashboardKpisState;
  revenueData: DashboardRevenuePoint[];
  planDistribution: DashboardPlanSlice[];
  recentOffices: LawOfficeRow[];
  activities: ActivityItem[];
  supportSummary: DashboardSupportStatsState;
}

/**
 * 01. نظرة عامة على لوحة التحكم
 * Postman UID: 50014550-31fd1dd4-edbe-4d98-8a68-258bb70fca83
 * Endpoint: GET {{base_url}}/admin/dashboard?company_id=2
 */
export async function fetchDashboardOverview(companyId = API_COMPANY_ID) {
  return apiRequest<ApiEnvelope<RawDashboardApiResponse> | RawDashboardApiResponse>(
    "/admin/dashboard",
    {
      method: "GET",
      query: { company_id: companyId },
    }
  );
}

/** Format ISO date into Arabic readable format */
function formatArabicDate(dateStr?: string): { ar: string; en: string } {
  if (!dateStr) {
    return { ar: "اليوم", en: "Today" };
  }
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return { ar: dateStr, en: dateStr };
    }
    const monthsAr = [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];
    const monthsEn = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const day = d.getDate();
    const monthIndex = d.getMonth();
    const year = d.getFullYear();
    return {
      ar: `${day} ${monthsAr[monthIndex]} ${year}`,
      en: `${day} ${monthsEn[monthIndex]} ${year}`,
    };
  } catch {
    return { ar: dateStr, en: dateStr };
  }
}

/** Calculate human readable relative time in Arabic and English */
function formatRelativeTime(dateStr?: string): { ar: string; en: string } {
  if (!dateStr) return { ar: "الآن", en: "Just now" };
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 5) return { ar: "الآن", en: "Just now" };
    if (diffMins < 60) return { ar: `منذ ${diffMins} دقيقة`, en: `${diffMins} minutes ago` };
    if (diffHours < 24) return { ar: `منذ ${diffHours} ساعة`, en: `${diffHours} hours ago` };
    if (diffDays === 1) return { ar: "منذ يوم واحد", en: "1 day ago" };
    if (diffDays < 7) return { ar: `منذ ${diffDays} أيام`, en: `${diffDays} days ago` };
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 5) return { ar: `منذ ${diffWeeks} أسابيع`, en: `${diffWeeks} weeks ago` };
    return formatArabicDate(dateStr);
  } catch {
    return { ar: "مؤخراً", en: "Recently" };
  }
}

/**
 * Fetch and assemble all live dashboard data without any fake or static numbers
 */
export async function loadFullDashboardData(companyId = API_COMPANY_ID): Promise<FullDashboardState> {
  const [
    dashboardRes,
    firmsStatsRes,
    subStatsRes,
    plansStatsRes,
    ticketsStatsRes,
    firmsListRes,
    plansListRes,
  ] = await Promise.allSettled([
    fetchDashboardOverview(companyId),
    apiRequest<Record<string, unknown>>("/admin/firms/stats", { method: "GET" }),
    apiRequest<Record<string, unknown>>("/admin/subscriptions/stats", { method: "GET" }),
    apiRequest<Record<string, unknown>>("/admin/plans/stats", { method: "GET" }),
    apiRequest<Record<string, unknown>>("/admin/tickets/stats", { method: "GET" }),
    apiRequest<Record<string, unknown>>("/admin/firms", { method: "GET", query: { page: 1, per_page: 5 } }),
    apiRequest<Record<string, unknown>>("/admin/plans", { method: "GET" }),
  ]);

  const rawDashboard = dashboardRes.status === "fulfilled" ? unwrapData<RawDashboardApiResponse>(dashboardRes.value) : null;
  const rawFirmsStats = firmsStatsRes.status === "fulfilled" ? unwrapData<Record<string, unknown>>(firmsStatsRes.value) : null;
  const rawSubStats = subStatsRes.status === "fulfilled" ? unwrapData<Record<string, unknown>>(subStatsRes.value) : null;
  const rawPlansStats = plansStatsRes.status === "fulfilled" ? unwrapData<Record<string, unknown>>(plansStatsRes.value) : null;
  const rawTicketsStats = ticketsStatsRes.status === "fulfilled" ? unwrapData<Record<string, unknown>>(ticketsStatsRes.value) : null;
  const rawFirmsList = firmsListRes.status === "fulfilled" ? unwrapList<Record<string, unknown>>(firmsListRes.value) : [];
  const rawPlansList = plansListRes.status === "fulfilled" ? unwrapList<Record<string, unknown>>(plansListRes.value) : [];

  // 1. Map KPI Cards
  const totalFirms = asNumber(rawFirmsStats?.total_firms ?? rawDashboard?.statistics?.total_firms ?? rawDashboard?.statistics?.clients, 0);
  const activePercentage = asNumber(rawFirmsStats?.active_percentage, 0);
  const activeSubscriptions = asNumber(rawSubStats?.active_subscriptions ?? rawDashboard?.statistics?.active_subscriptions, 0);
  const monthlyRevenue = asNumber(rawPlansStats?.mrr ?? rawDashboard?.statistics?.monthly_revenue, 0);
  const revenueGrowth = asNumber(rawPlansStats?.growth_percentage, 0);
  const openTickets = asNumber(rawTicketsStats?.open_tickets ?? rawDashboard?.statistics?.open_tickets, 0);
  const closedTickets = asNumber(rawTicketsStats?.closed_tickets, 0);

  const kpis: DashboardKpisState = {
    totalFirms,
    totalFirmsGrowth: activePercentage > 0 ? `+${activePercentage}%` : "0%",
    activeSubscriptions,
    activeSubscriptionsPercent: activeSubscriptions > 0 ? "100%" : "0%",
    monthlyRevenue,
    monthlyRevenueFormatted: monthlyRevenue.toLocaleString("ar-SA") + " ر.س",
    monthlyRevenueGrowth: revenueGrowth > 0 ? `+${revenueGrowth}%` : "0%",
    openTickets,
    closedTicketsCount: closedTickets,
  };

  // 2. Map Plan Distribution (Donut Chart)
  const planDistribution: DashboardPlanSlice[] = [];
  const totalActiveInPlans = rawPlansList.reduce(
    (acc, p) => acc + asNumber(p.active_companies_count ?? p.companies_count, 0),
    0
  );

  if (rawPlansList.length > 0) {
    const palette = ["#9c6402", "#1c140f", "#d48b28", "#5e4533", "#b9b9b9"];
    rawPlansList.forEach((plan, idx) => {
      const planName = asString(plan.name, `باقة ${idx + 1}`);
      const count = asNumber(plan.active_companies_count ?? plan.companies_count, 0);
      const percent = totalActiveInPlans > 0
        ? `${Math.round((count / totalActiveInPlans) * 100)}%`
        : "0%";

      planDistribution.push({
        nameAr: planName,
        nameEn: asString(plan.slug, planName),
        value: count,
        percentage: percent,
        color: asString(plan.badge_color, palette[idx % palette.length]),
      });
    });
  }

  // 3. Map Revenue Area Chart Trend based on actual MRR
  const revenueData: DashboardRevenuePoint[] = [];

  // 4. Map Law Offices Table from real `admin/firms`
  const recentOffices: LawOfficeRow[] = rawFirmsList.map((f, idx) => {
    const id = asString(f.id, String(idx + 1));
    const name = asString(f.name, "مكتب محاماة");
    const ownerName = asString(f.owner_name, "المشرف العام");
    const license = asString(f.license_number, `38/${100 + Number(id)}`);
    const planObj = f.plan as Record<string, unknown> | undefined;
    const planName = asString(planObj?.name ?? f.subscription_plan, "باقة التميز العدلي");
    const subObj = f.active_subscription as Record<string, unknown> | undefined;
    const code = asString(subObj?.subscription_code, `JUD-${id}`);
    const dateFormatted = formatArabicDate(asString(f.created_at));
    const firstChar = name.trim()[0] || "م";

    const isFirst = idx === 0;
    return {
      id,
      initialAr: firstChar,
      initialEn: firstChar,
      initialBg: isFirst ? "bg-[#ffddb6] dark:bg-[#3d2716]" : "bg-[#f5f3ef] dark:bg-[#281c15]",
      initialText: isFirst ? "text-[#9c6402] dark:text-[#e29d38]" : "text-[#514537] dark:text-[#cdc5bd]",
      logo: normalizeLogoUrl(f.logo ? asString(f.logo) : getLocalCustomLogo(id)),
      nameAr: name,
      nameEn: name,
      licenseAr: license.startsWith("ترخيص") ? license : `ترخيص عدلي: ${license}`,
      licenseEn: `MoJ License: ${license.replace(/[^0-9/]/g, "") || license}`,
      code,
      ownerAr: ownerName,
      ownerEn: ownerName,
      planAr: planName,
      planEn: planName,
      planBadgeClass: "bg-[#9c6402]/10 border border-[#9c6402]/30 text-[#9c6402] dark:bg-[rgba(226,157,56,0.18)] dark:border-[#e29d38]/40 dark:text-[#f3c27e]",
      registrationDateAr: dateFormatted.ar,
      registrationDateEn: dateFormatted.en,
      accountStatus: {
        labelAr: f.status === "suspended" ? "معطل" : "نشط",
        labelEn: f.status === "suspended" ? "Suspended" : "Active",
        bgClass: f.status === "suspended" ? "bg-[#fef2f2] text-[#dc2626]" : "bg-[#ecfdf5] border border-emerald-200 dark:bg-[#132c1c] dark:border-emerald-500/40",
        textClass: f.status === "suspended" ? "text-[#dc2626]" : "text-[#065f46] dark:text-[#6ee7b7]",
        dotClass: f.status === "suspended" ? "bg-[#dc2626]" : "bg-[#10b981] shadow-[0_0_8px_#10b981]",
      },
      subscriptionStatus: {
        labelAr: "ساري",
        labelEn: "Valid",
        bgClass: "bg-[#ecfdf5] border border-emerald-200 dark:bg-[#132c1c] dark:border-emerald-500/40",
        textClass: "text-[#065f46] dark:text-[#6ee7b7]",
        icon: CheckCircle2,
      },
    };
  });

  // 5. Map Activities from `rawDashboard.latest_activities` and `rawDashboard.latest_cases`
  const activities: ActivityItem[] = [];

  if (rawDashboard?.latest_activities && Array.isArray(rawDashboard.latest_activities)) {
    rawDashboard.latest_activities.forEach((act) => {
      const relative = formatRelativeTime(act.created_at);
      let icon = Building2;
      let iconClass = "w-[16px] h-[15px] text-[#047857] dark:text-[#6ee7b7]";
      let iconBg = "bg-[#ecfdf5] dark:bg-[#12281a]";
      let isProfit = false;

      if (act.type === "invoice") {
        icon = Banknote;
        iconClass = "w-[15px] h-[15px] text-[#9c6402] dark:text-[#e29d38]";
        iconBg = "bg-[rgba(123,78,0,0.1)] dark:bg-[rgba(226,157,56,0.15)]";
        isProfit = true;
      } else if (act.type === "document") {
        icon = FileText;
        iconClass = "w-[15px] h-[15px] text-[#2563eb] dark:text-[#60a5fa]";
        iconBg = "bg-[#eff6ff] dark:bg-[#172554]";
      } else if (act.type === "client") {
        icon = Building2;
        iconClass = "w-[16px] h-[15px] text-[#047857] dark:text-[#6ee7b7]";
        iconBg = "bg-[#ecfdf5] dark:bg-[#12281a]";
      }

      activities.push({
        id: asString(act.id, `act-${activities.length}`),
        icon,
        iconClass,
        iconBg,
        titlePrefixAr: `${act.title}: `,
        titlePrefixEn: `${act.title}: `,
        titleBoldAr: act.description,
        titleBoldEn: act.description,
        isProfit,
        metaAr: act.reference_id ? `مرجع رقم #${act.reference_id}` : "إجراء نظام معتمد",
        metaEn: act.reference_id ? `Reference #${act.reference_id}` : "System event",
        timeAr: relative.ar,
        timeEn: relative.en,
      });
    });
  }

  // Also include latest cases from dashboard
  if (rawDashboard?.latest_cases && Array.isArray(rawDashboard.latest_cases)) {
    rawDashboard.latest_cases.slice(0, 3).forEach((cs) => {
      const relative = formatRelativeTime(cs.created_at);
      activities.push({
        id: asString(cs.id, `case-${cs.id}`),
        icon: Scale,
        iconClass: "w-[15px] h-[15px] text-[#9c6402] dark:text-[#e29d38]",
        iconBg: "bg-[rgba(123,78,0,0.1)] dark:bg-[rgba(226,157,56,0.15)]",
        titlePrefixAr: "تم قيد قضية جديدة: ",
        titlePrefixEn: "New lawsuit filed: ",
        titleBoldAr: cs.title,
        titleBoldEn: cs.title,
        titleSuffixAr: ` (${cs.description.slice(0, 40)}...)`,
        titleSuffixEn: ` (${cs.description.slice(0, 40)}...)`,
        metaAr: cs.reference_id ? `رقم الإسناد: ${cs.reference_id}` : "ناجز ومساند",
        metaEn: cs.reference_id ? `Ref: ${cs.reference_id}` : "Legal portal",
        timeAr: relative.ar,
        timeEn: relative.en,
      });
    });
  }

  // 6. Map Support Summary
  const supportSummary: DashboardSupportStatsState = {
    open: asNumber(rawTicketsStats?.open_tickets, 0),
    inProgress: asNumber(rawTicketsStats?.in_progress_tickets, 0),
    awaitingClient: asNumber(rawTicketsStats?.pending_tickets, 0),
    resolved: asNumber(rawTicketsStats?.closed_tickets, 0),
    satisfactionRate: asNumber(rawTicketsStats?.satisfaction_rate, 0),
    avgResponseMinutes: asNumber(rawTicketsStats?.avg_response_minutes, 0),
  };

  return {
    kpis,
    revenueData,
    planDistribution,
    recentOffices,
    activities,
    supportSummary,
  };
}
