import type { ClientOffice } from "@/features/clients/types/client.types";
import type { PricingPlanItem } from "@/features/plans/types/plan.types";
import type { SubscriptionRecord } from "@/features/subscriptions/types/subscription.types";
import type { Employee } from "@/features/staff/types/staff.types";
import type { RoleItem } from "@/features/permissions/types/roles.types";
import type {
  Ticket,
  TicketDepartment,
  TicketPriority,
  TicketStatus,
} from "@/features/tickets/types/tickets.types";
import type { InvoiceItem, InvoiceStatus, PaymentMethodType } from "@/features/invoices/types/invoices.types";
import type { NotificationItem } from "@/features/notifications/types/notifications.types";
import type { CurrencyItem } from "@/features/settings/types/currency-settings.types";
import type { LanguageItem } from "@/features/settings/types/language-settings.types";
import type { GeneralSettings } from "@/features/settings/types/general-settings.types";
import type {
  HeroSectionData,
  SeoData,
  FeatureItem,
} from "@/features/website-settings/types/website-settings.types";
import type { FirmListItem } from "./types";
import { asNumber, asString, unwrapData, unwrapList } from "./helpers";

function statusBadge(status?: string) {
  const normalized = (status || "active").toLowerCase();
  if (normalized.includes("suspend") || normalized.includes("تعطيل")) {
    return {
      label: "معطل",
      type: "suspended" as const,
      bgClass: "bg-[#fef2f2]",
      textClass: "text-[#dc2626]",
      dotClass: "bg-[#dc2626]",
    };
  }
  if (normalized.includes("trial") || normalized.includes("تجريب")) {
    return {
      label: "تجريبي",
      type: "trial" as const,
      bgClass: "bg-[#eff6ff]",
      textClass: "text-[#1d4ed8]",
      dotClass: "bg-[#1d4ed8]",
    };
  }
  return {
    label: "نشط",
    type: "active" as const,
    bgClass: "bg-[#e8f5e9]",
    textClass: "text-[#1b7340]",
    dotClass: "bg-[#1b7340]",
  };
}

function subscriptionBadge(status?: string) {
  const normalized = (status || "active").toLowerCase();
  if (normalized.includes("expir") || normalized.includes("منته")) {
    return {
      label: "منتهي",
      type: "expired" as const,
      bgClass: "bg-[#fef2f2]",
      textClass: "text-[#dc2626]",
    };
  }
  if (normalized.includes("overdue") || normalized.includes("متأخر")) {
    return {
      label: "متأخر",
      type: "overdue" as const,
      bgClass: "bg-[#fff7ed]",
      textClass: "text-[#c2410c]",
    };
  }
  if (normalized.includes("trial") || normalized.includes("تجريب")) {
    return {
      label: "تجريبي",
      type: "trial" as const,
      bgClass: "bg-[#eff6ff]",
      textClass: "text-[#1d4ed8]",
    };
  }
  return {
    label: "نشط",
    type: "active" as const,
    bgClass: "bg-[#e8f5e9]",
    textClass: "text-[#1b7340]",
  };
}

export function normalizeLogoUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  const str = String(url).trim();
  if (!str || str === "null" || str === "undefined") return undefined;
  // If already absolute or base64/blob, keep as is
  if (
    str.startsWith("http://") ||
    str.startsWith("https://") ||
    str.startsWith("data:") ||
    str.startsWith("blob:")
  ) {
    return str;
  }
  // If relative path from backend storage (e.g. /storage/... or storage/...)
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://law.elmoroj.com/api";
  try {
    const origin = new URL(apiBase).origin;
    const cleanPath = str.startsWith("/") ? str : `/${str}`;
    return `${origin}${cleanPath}`;
  } catch {
    return str;
  }
}

export function getLocalCustomLogo(id: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem("aljudy_firm_logos");
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    return normalizeLogoUrl(parsed[id]) || undefined;
  } catch {
    return undefined;
  }
}

export function saveLocalCustomLogo(id: string, logoUrl: string) {
  if (typeof window === "undefined" || !id || !logoUrl) return;
  try {
    const raw = localStorage.getItem("aljudy_firm_logos");
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[id] = logoUrl;
    localStorage.setItem("aljudy_firm_logos", JSON.stringify(parsed));
  } catch {
    // ignore
  }
}

export function removeLocalCustomLogo(id: string) {
  if (typeof window === "undefined" || !id) return;
  try {
    const raw = localStorage.getItem("aljudy_firm_logos");
    if (!raw) return;
    const parsed = JSON.parse(raw);
    delete parsed[id];
    localStorage.setItem("aljudy_firm_logos", JSON.stringify(parsed));
  } catch {
    // ignore
  }
}

export function mapFirmToClientOffice(raw: unknown): ClientOffice {
  const container = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const firm = (container.firm && typeof container.firm === "object" ? container.firm : container) as Record<string, unknown>;
  const usage = (container.resource_usage || firm.resource_usage || {}) as Record<string, unknown>;
  const notesRaw = (container.internal_notes || firm.internal_notes || []) as Array<Record<string, unknown>>;
  const invoicesRaw = (container.recent_invoices || firm.recent_invoices || []) as unknown[];
  const ticketsRaw = (container.recent_tickets || firm.recent_tickets || []) as unknown[];

  const id = String(firm.id ?? "");
  const name = String(firm.name || "مكتب محاماة");
  const initial = name.trim().charAt(0) || "م";

  let planName = "الباقة الاحترافية";
  if (firm.plan && typeof firm.plan === "object" && "name" in (firm.plan as Record<string, unknown>)) {
    planName = String((firm.plan as Record<string, unknown>).name);
  } else if (firm.plan_name) {
    planName = String(firm.plan_name);
  } else if (firm.subscription_plan) {
    const sp = String(firm.subscription_plan).toLowerCase();
    if (sp === "paid") planName = "باقة التميز العدلي";
    else if (sp === "trial") planName = "تجربة مجانية";
    else if (sp === "professional") planName = "الباقة الاحترافية";
    else if (sp === "enterprise") planName = "باقة الشركات";
    else if (sp === "basic") planName = "الباقة الأساسية";
    else planName = String(firm.subscription_plan);
  }

  const rawLicense = firm.license_number ? String(firm.license_number) : "—";
  const licenseNumber =
    rawLicense.startsWith("ترخيص عدلي:") || rawLicense === "—"
      ? rawLicense
      : `ترخيص عدلي: ${rawLicense}`;

  const internalNotes = notesRaw.map((n) => ({
    id: Number(n.id || 0),
    authorName: String(n.author_name || "مشرف النظام"),
    authorRole: String(n.author_role || "إشراف النظام"),
    note: String(n.note || ""),
    createdAt: String(n.created_at || ""),
  }));

  const lawyersUsed = Number(usage.lawyers_used ?? 1);
  const lawyersLimit = Number(
    usage.lawyers_limit ??
      (firm.plan && typeof firm.plan === "object"
        ? (firm.plan as Record<string, unknown>).max_lawyers
        : 8) ??
      8
  );
  const lawyersPercent = Number(
    usage.lawyers_percent ??
      (lawyersLimit > 0 ? Math.round((lawyersUsed / lawyersLimit) * 100) : 0)
  );

  const storageUsedGb = String(usage.storage_used_gb ?? firm.used_storage_gb ?? "0.00");
  const storageLimitGb = Number(
    usage.storage_limit_gb ??
      (firm.plan && typeof firm.plan === "object"
        ? (firm.plan as Record<string, unknown>).storage_limit_gb
        : 50) ??
      50
  );
  const storagePercent = Number(
    usage.storage_percent ??
      (storageLimitGb > 0
        ? Math.round((Number(storageUsedGb) / storageLimitGb) * 100)
        : 0)
  );

  const rawPlan = (firm.plan && typeof firm.plan === "object" ? firm.plan : null) as Record<string, unknown> | null;
  const rawSub = (firm.active_subscription && typeof firm.active_subscription === "object"
    ? firm.active_subscription
    : container.active_subscription && typeof container.active_subscription === "object"
    ? container.active_subscription
    : null) as Record<string, unknown> | null;

  const planDetails = rawPlan
    ? {
        id: rawPlan.id ? Number(rawPlan.id) : undefined,
        name: String(rawPlan.name || planName),
        badge: rawPlan.badge ? String(rawPlan.badge) : undefined,
        badgeColor: rawPlan.badge_color ? String(rawPlan.badge_color) : undefined,
        type: rawPlan.type ? String(rawPlan.type) : undefined,
        monthlyPrice: rawPlan.monthly_price ? String(rawPlan.monthly_price) : undefined,
        yearlyPrice: rawPlan.yearly_price ? String(rawPlan.yearly_price) : undefined,
        yearlyDiscountPercent: rawPlan.yearly_discount_percent
          ? Number(rawPlan.yearly_discount_percent)
          : undefined,
        maxLawyers: rawPlan.max_lawyers ? Number(rawPlan.max_lawyers) : undefined,
        maxCases: rawPlan.max_cases ? Number(rawPlan.max_cases) : undefined,
        maxPowerOfAttorney: rawPlan.max_power_of_attorney
          ? Number(rawPlan.max_power_of_attorney)
          : undefined,
        maxClients: rawPlan.max_clients ? Number(rawPlan.max_clients) : undefined,
        maxAssistants: rawPlan.max_assistants ? Number(rawPlan.max_assistants) : undefined,
        storageLimitGb: rawPlan.storage_limit_gb ? Number(rawPlan.storage_limit_gb) : undefined,
        supportLevel: rawPlan.support_level ? String(rawPlan.support_level) : undefined,
        features: Array.isArray(rawPlan.features) ? rawPlan.features.map(String) : [],
      }
    : undefined;

  const activeSubscriptionDetails = rawSub
    ? {
        id: rawSub.id ? Number(rawSub.id) : undefined,
        subscriptionCode: rawSub.subscription_code ? String(rawSub.subscription_code) : undefined,
        companyId: rawSub.company_id ? Number(rawSub.company_id) : undefined,
        planId: rawSub.plan_id ? Number(rawSub.plan_id) : undefined,
        billingCycle: rawSub.billing_cycle ? String(rawSub.billing_cycle) : undefined,
        amount: rawSub.amount ? String(rawSub.amount) : undefined,
        paymentMethod: rawSub.payment_method ? String(rawSub.payment_method) : undefined,
        autoRenew: rawSub.auto_renew !== undefined ? Boolean(rawSub.auto_renew) : undefined,
        startDate: rawSub.start_date ? String(rawSub.start_date) : undefined,
        renewalDate: rawSub.renewal_date ? String(rawSub.renewal_date) : undefined,
        status: rawSub.status ? String(rawSub.status) : undefined,
        notes: rawSub.notes ? String(rawSub.notes) : null,
      }
    : undefined;

  return {
    id,
    initial,
    initialBg: "bg-[#fff9ee]",
    initialText: "text-[#9c6402]",
    name,
    licenseNumber,
    city: String(firm.city || "الرياض"),
    country: String(firm.country || "المملكة العربية السعودية"),
    owner: String(firm.owner_name || firm.owner || "—"),
    email: String(firm.email || ""),
    phone: String(firm.phone || ""),
    landline: firm.landline ? String(firm.landline) : undefined,
    address: firm.address ? String(firm.address) : undefined,
    taxNumber: firm.tax_number ? String(firm.tax_number) : undefined,
    logo: normalizeLogoUrl(firm.logo ? String(firm.logo) : getLocalCustomLogo(id)),
    password: firm.password ? String(firm.password) : undefined,
    initialPassword: firm.password ? String(firm.password) : undefined,
    plan: planName,
    planId: firm.plan_id ? Number(firm.plan_id) : rawPlan?.id ? Number(rawPlan.id) : undefined,
    planType: String(firm.plan_type || (planName.includes("تجرب") ? "trial" : "paid")),
    subscriptionPlan: String(firm.subscription_plan || firm.plan_type || "paid"),
    planDetails,
    activeSubscriptionDetails,
    planBadgeClass:
      "bg-[#ffddb6]/40 text-[#7b4e00] border border-[#ffddb6] dark:bg-[rgba(226,157,56,0.18)] dark:text-[#f3c27e] dark:border-[#e29d38]/50",
    registrationDate: String(firm.registration_date || firm.created_at || "—"),
    billingCycle: firm.billing_cycle ? String(firm.billing_cycle) : undefined,
    subscriptionStart: firm.subscription_start ? String(firm.subscription_start) : undefined,
    subscriptionEnd: firm.subscription_end ? String(firm.subscription_end) : undefined,
    autoRenew: firm.auto_renew !== undefined ? Boolean(firm.auto_renew) : true,
    resourceUsage: {
      lawyersUsed,
      lawyersLimit,
      lawyersPercent,
      storageUsedGb,
      storageLimitGb,
      storagePercent,
      activeCases: Number(usage.active_cases ?? 0),
    },
    internalNotes,
    recentInvoices: invoicesRaw,
    recentTickets: ticketsRaw,
    accountStatus: statusBadge(
      String(firm.account_status || firm.status || "active")
    ),
    subscriptionStatus: subscriptionBadge(
      String(
        firm.subscription_status ||
          (firm.active_subscription && typeof firm.active_subscription === "object"
            ? (firm.active_subscription as Record<string, unknown>).status
            : undefined) ||
          firm.status ||
          "active"
      )
    ),
  };
}

export function mapPlanFromApi(raw: Record<string, unknown>): PricingPlanItem {
  const id = asString(raw.id || raw.slug || raw.code, cryptoRandomId());
  const name = asString(raw.name, "باقة");
  const monthly = asNumber(raw.monthly_price ?? raw.monthlyPrice, 0);
  const yearly = asNumber(raw.yearly_price ?? raw.annual_price ?? raw.annualPrice, monthly * 10);
  const maxLawyers = asNumber(raw.max_lawyers, 0);
  const maxCases = asNumber(raw.max_cases, 0);
  const maxAssistants = asNumber(raw.max_assistants, 0);
  const maxPowerOfAttorney = asNumber(raw.max_power_of_attorney, 0);
  const maxClients = asNumber(raw.max_clients, 0);
  const storage = asNumber(raw.storage_limit_gb, 0);
  const yearlyDiscount = asNumber(raw.yearly_discount_percent, 0);
  const badge = asString(raw.badge, "");
  const badgeColor = asString(raw.badge_color, "#d97706");
  const type = asString(raw.type, "paid");

  return {
    id,
    name,
    slug: raw.slug ? asString(raw.slug) : undefined,
    code: asString(raw.code, `PLAN-${id}`),
    description: asString(raw.description, ""),
    badge: badge || undefined,
    badgeColor: badgeColor || undefined,
    type,
    monthlyPrice: monthly,
    annualPrice: yearly,
    yearlyDiscountPercent: yearlyDiscount || undefined,
    annualNote: asString(raw.annual_note, "تدفع سنوياً أو شهرياً"),
    subscribedFirmsCount: asNumber(
      raw.active_companies_count ?? raw.subscribed_firms_count ?? raw.subscribers_count ?? raw.firms_count,
      0
    ),
    sharePercentage: asString(raw.share_percentage, ""),
    isActive: !["disabled", "inactive", "0", 0, false].includes(
      (raw.status as string | number | boolean) ?? true
    ),
    isPopular: Boolean(raw.is_popular || raw.isPopular),
    isEnterprise: Boolean(raw.is_enterprise || type === "enterprise" || raw.name?.toString().includes("شركات")),
    limits: {
      lawyers: maxLawyers ? `${maxLawyers} محامين ومستشارين` : asString(raw.lawyers_limit, "—"),
      cases: maxCases ? `${maxCases} قضية نشطة` : asString(raw.cases_limit, "—"),
      agents: maxPowerOfAttorney
        ? `${maxPowerOfAttorney} وكلاء شرعيين`
        : asString(raw.agents_limit, "—"),
      assistants: maxAssistants
        ? `${maxAssistants} مساعدين إداريين`
        : asString(raw.assistants_limit, "—"),
      clients: maxClients ? `${maxClients} عميل` : asString(raw.clients_limit, "—"),
      storage: storage ? `${storage} GB مساحة تخزين` : asString(raw.storage_limit, "—"),
      support: asString(raw.support_level, "دعم فني"),
    },
    features: Array.isArray(raw.features)
      ? raw.features.map((f, idx) => {
          if (typeof f === "string") {
            return {
              id: String(idx + 1),
              title: f,
              isIncluded: true,
            };
          }
          const obj = (f || {}) as Record<string, unknown>;
          return {
            id: asString(obj.id, String(idx + 1)),
            title: asString(obj.title || obj.name, ""),
            description: obj.description ? asString(obj.description) : undefined,
            isIncluded: obj.is_included !== false && obj.isIncluded !== false,
          };
        })
      : undefined,
    rawFeatures: Array.isArray(raw.features)
      ? raw.features.map((f) => (typeof f === "string" ? f : asString((f as any)?.title || (f as any)?.name, "")))
      : [],
  };
}

export function mapSubscriptionFromApi(raw: Record<string, unknown>): SubscriptionRecord {
  const firmObj =
    (raw.firm as Record<string, unknown> | undefined) ||
    (raw.company as Record<string, unknown> | undefined) ||
    {};
  const statusRaw = asString(raw.status, "active").toLowerCase();
  const status =
    statusRaw.includes("pend")
      ? "pending"
      : statusRaw.includes("cancel")
        ? "cancelled"
        : statusRaw.includes("reject")
          ? "rejected"
          : statusRaw.includes("expir")
            ? "expired"
            : "active";

  return {
    id: asString(raw.id || raw.code, cryptoRandomId()),
    firm: {
      id: asString(firmObj.id || raw.firm_id || raw.company_id, "0"),
      name: asString(firmObj.name || raw.firm_name, "مكتب"),
      licenseNumber: asString(firmObj.license_number || firmObj.licenseNumber, "—"),
      city: asString(firmObj.city, "—"),
      address: asString(firmObj.address, "—"),
      directorName: asString(firmObj.owner_name || firmObj.director_name || firmObj.owner, "—"),
      email: asString(firmObj.email, ""),
      phone: asString(firmObj.phone, ""),
    },
    planName: asString(raw.plan_name || raw.planName || (raw.plan as Record<string, unknown> | undefined)?.name, "باقة"),
    planPrice: asString(raw.plan_price || raw.amount || raw.price, "0"),
    billingCycle: asString(raw.billing_cycle, "yearly").includes("month") ? "شهرية" : "سنوية",
    startDate: asString(raw.start_date || raw.started_at, "—"),
    renewalDate: asString(raw.renewal_date || raw.ends_at || raw.end_date, "—"),
    remainingDaysText: asString(raw.remaining_days_text || raw.remaining_days, "—"),
    daysUrgency: status === "expired" ? "expired" : status === "cancelled" ? "cancelled" : "normal",
    status,
    statusLabel:
      status === "active"
        ? "نشط"
        : status === "pending"
          ? "قيد الانتظار"
          : status === "cancelled"
            ? "ملغي"
            : status === "rejected"
              ? "مرفوض"
              : "منتهي",
    paymentMethod: {
      type: "mada",
      badgeLabel: asString(raw.payment_method || "مدى", "مدى"),
      statusText: asString(raw.payment_status, "مدفوع"),
      isAutoPaid: Boolean(raw.auto_renew ?? true),
    },
  };
}

export function mapStaffFromApi(raw: Record<string, unknown>): Employee {
  const name = asString(raw.name, "موظف");
  const statusRaw = asString(raw.status, "active").toLowerCase();
  const roleObj = (raw.role as Record<string, unknown> | undefined) || {};
  return {
    id: asString(raw.id, cryptoRandomId()),
    empCode: asString(raw.emp_code || raw.code, "EMP"),
    name,
    initials: name.trim().slice(0, 2),
    avatarBg: "bg-[#fff9ee]",
    avatarText: "text-[#9c6402]",
    avatarImage: normalizeLogoUrl(asString(raw.avatar_url || raw.avatar || raw.image, "")) || undefined,
    jobTitle: asString(raw.job_title || raw.title || roleObj.name, "موظف"),
    department: asString(
      raw.department_name ||
        (raw.department as Record<string, unknown> | undefined)?.name ||
        raw.department,
      "—"
    ),
    email: asString(raw.email, ""),
    phone: asString(raw.phone, ""),
    role: {
      id: asString(roleObj.id || raw.role_id, "role"),
      name: asString(roleObj.name || raw.role_name, "دور"),
      category: asString(roleObj.category, "إدارة"),
      badgeClass: "bg-[#fff9ee] text-[#9c6402]",
      iconType: "briefcase",
    },
    status: statusRaw.includes("suspend") || statusRaw.includes("inactive") ? "suspended" : "active",
    lastLogin: {
      time: asString(raw.last_login_at || raw.last_login, "—"),
      ip: raw.last_login_ip ? asString(raw.last_login_ip) : undefined,
    },
  };
}

export function mapRoleFromApi(raw: Record<string, unknown>): RoleItem {
  const name = asString(raw.name, "دور");
  const isSystem = Boolean(raw.is_system || raw.is_protected || raw.type === "system");
  const perms = Array.isArray(raw.permissions) ? raw.permissions.length : asNumber(raw.permissions_count, 0);
  return {
    id: asString(raw.id, cryptoRandomId()),
    slug: asString(raw.slug || raw.code, name.toLowerCase().replace(/\s+/g, "_")),
    name,
    subtitle: asString(raw.subtitle || raw.description, ""),
    description: asString(raw.description, ""),
    permissionsCount: perms,
    permissionsLabel: `${perms} صلاحية`,
    hasFullPermissionsBadge: perms >= 50,
    assignedEmployeesCount: asNumber(raw.staff_count ?? raw.assigned_count ?? raw.users_count, 0),
    type: isSystem ? "system" : "custom",
    typeBadge: isSystem
      ? {
          label: "نظامي",
          sublabel: "محمي",
          badgeClass: "bg-[#eff6ff] text-[#1d4ed8]",
          dotClass: "bg-[#1d4ed8]",
        }
      : {
          label: "مخصص",
          badgeClass: "bg-[#fff9ee] text-[#9c6402]",
          dotClass: "bg-[#9c6402]",
        },
    isProtected: isSystem,
    iconType: "briefcase",
    iconBg: "bg-[#fff9ee]",
    createdAt: raw.created_at ? asString(raw.created_at) : undefined,
    permissions: Array.isArray(raw.permissions)
      ? (raw.permissions as unknown[]).map((p) =>
          typeof p === "string" ? p : asString((p as Record<string, unknown>).name || (p as Record<string, unknown>).id)
        )
      : undefined,
  };
}

export function mapTicketFromApi(raw: Record<string, unknown>): Ticket {
  const clientObj = (raw.client as Record<string, unknown> | undefined) ||
    (raw.firm as Record<string, unknown> | undefined) ||
    {};
  const deptObj = (raw.department as Record<string, unknown> | undefined) || {};
  const assigneeObj = (raw.assignee as Record<string, unknown> | undefined) ||
    (raw.assigned_to as Record<string, unknown> | undefined) ||
    {};
  const statusRaw = asString(raw.status, "open").toLowerCase();
  const status: TicketStatus = statusRaw.includes("close")
    ? "closed"
    : statusRaw.includes("progress")
      ? "in_progress"
      : statusRaw.includes("pend")
        ? "pending"
        : "open";
  const priorityRaw = asString(raw.priority, "medium").toLowerCase();
  const priority: TicketPriority = priorityRaw.includes("urg") || priorityRaw.includes("high")
    ? "urgent"
    : priorityRaw.includes("low")
      ? "low"
      : "medium";
  const assigneeName = asString(assigneeObj.name || raw.assignee_name, "غير مسند");

  return {
    id: asString(raw.id, cryptoRandomId()),
    ticketNumber: asString(raw.ticket_number || raw.code || raw.number, `#TCK-${raw.id}`),
    title: asString(raw.title || raw.subject, "تذكرة دعم"),
    description: asString(raw.description || raw.body, ""),
    client: {
      id: asString(clientObj.id || raw.client_id || raw.firm_id, "0"),
      name: asString(clientObj.name || raw.client_name, "عميل"),
      firm: asString(clientObj.firm_name || clientObj.name || raw.firm_name, "مكتب"),
      email: asString(clientObj.email, ""),
      phone: asString(clientObj.phone, ""),
      crNumber: asString(clientObj.cr_number || clientObj.license_number, "—"),
    },
    department: {
      id: asString(deptObj.id || raw.department_id, "0"),
      name: asString(deptObj.name || raw.department_name, "الدعم الفني"),
      code: asString(deptObj.code, "SUP"),
    },
    assignee: {
      id: asString(assigneeObj.id || raw.assignee_id || raw.staff_id, "0"),
      name: assigneeName,
      initials: assigneeName.trim().slice(0, 2) || "—",
      role: asString(assigneeObj.role || assigneeObj.job_title, "موظف"),
      department: asString(assigneeObj.department || deptObj.name, "—"),
      activeTicketsCount: asNumber(assigneeObj.active_tickets, 0),
      isAvailable: true,
    },
    priority,
    status,
    channel: "portal",
    channelLabel: asString(raw.channel, "بوابة العملاء"),
    category: asString(raw.category, "عام"),
    createdAt: asString(raw.created_at || raw.createdAt, "—"),
    updatedAt: asString(raw.updated_at || raw.updatedAt, "—"),
    attachments: [],
    messages: [],
    auditEvents: [],
  };
}

export function mapDepartmentFromApi(raw: Record<string, unknown>): TicketDepartment {
  return {
    id: asString(raw.id, cryptoRandomId()),
    code: asString(raw.code, "DEP"),
    name: asString(raw.name, "قسم"),
    description: asString(raw.description, ""),
    status: ["inactive", "disabled", "0", 0, false].includes(
      (raw.status as string | number | boolean) ?? "active"
    )
      ? "inactive"
      : "active",
    activeTicketsCount: asNumber(raw.active_tickets_count ?? raw.tickets_count, 0),
    consultantsCount: asNumber(raw.consultants_count ?? raw.staff_count, 0),
  };
}

export function mapInvoiceFromApi(raw: Record<string, unknown>): InvoiceItem {
  const firmObj = (raw.firm as Record<string, unknown> | undefined) || {};
  const statusRaw = asString(raw.status, "pending").toLowerCase();
  const status: InvoiceStatus = statusRaw.includes("paid")
    ? "paid"
    : statusRaw.includes("overdue")
      ? "overdue"
      : statusRaw.includes("refund")
        ? "refunded"
        : "pending";
  const methodRaw = asString(raw.payment_method || raw.gateway, "mada").toLowerCase();
  const paymentMethod: PaymentMethodType = methodRaw.includes("visa")
    ? "visa"
    : methodRaw.includes("master")
      ? "mastercard"
      : methodRaw.includes("apple")
        ? "apple_pay"
        : methodRaw.includes("bank")
          ? "bank_transfer"
          : methodRaw.includes("stripe")
            ? "stripe"
            : "mada";
  const total = asNumber(raw.total_amount ?? raw.total ?? raw.amount, 0);
  const taxAmount = asNumber(raw.tax_amount, Math.round(total * 0.15));
  const subtotal = asNumber(raw.subtotal, total - taxAmount);

  return {
    id: asString(raw.id, cryptoRandomId()),
    invoiceNumber: asString(raw.invoice_number || raw.number || raw.code, `INV-${raw.id}`),
    orderNumber: asString(raw.order_number, "01"),
    lawFirmId: asString(firmObj.id || raw.firm_id, "0"),
    lawFirmName: asString(firmObj.name || raw.firm_name, "مكتب محاماة"),
    lawFirmNameEn: asString(firmObj.name_en || firmObj.name || raw.firm_name, "Law Firm"),
    clientContact: asString(raw.client_contact || firmObj.owner_name, "—"),
    clientEmail: asString(raw.client_email || firmObj.email, ""),
    clientPhone: asString(raw.client_phone || firmObj.phone, ""),
    taxNumber: asString(raw.tax_number || raw.vat_number, "—"),
    commercialReg: asString(raw.commercial_reg || firmObj.license_number, "—"),
    city: asString(raw.city || firmObj.city, "—"),
    planName: asString(raw.plan_name, "باقة"),
    planNameEn: asString(raw.plan_name_en || raw.plan_name, "Plan"),
    billingPeriod: asString(raw.billing_period || raw.billing_cycle, "annual").includes("month")
      ? "monthly"
      : "annual",
    issueDate: asString(raw.issue_date || raw.created_at, "—"),
    dueDate: asString(raw.due_date, "—"),
    paidAt: raw.paid_at ? asString(raw.paid_at) : undefined,
    subtotal,
    taxRate: asNumber(raw.tax_rate, 15),
    taxAmount,
    discountAmount: asNumber(raw.discount_amount, 0),
    totalAmount: total,
    currency: asString(raw.currency, "SAR").toUpperCase() === "USD" ? "USD" : "SAR",
    status,
    paymentMethod,
    transactionReference: asString(raw.transaction_reference || raw.reference, "—"),
    zatcaComplianceStatus: "compliant",
    items: Array.isArray(raw.items)
      ? (raw.items as Array<Record<string, unknown>>).map((item, idx) => ({
          id: asString(item.id, String(idx + 1)),
          description: asString(item.description || item.name, ""),
          descriptionEn: asString(item.description_en || item.description || item.name, ""),
          quantity: asNumber(item.quantity, 1),
          unitPrice: asNumber(item.unit_price, 0),
          total: asNumber(item.total, 0),
        }))
      : [],
    notes: raw.notes ? asString(raw.notes) : undefined,
  };
}

export function mapNotificationFromApi(raw: Record<string, unknown>): NotificationItem {
  const statusRaw = asString(raw.status, "sent").toLowerCase();
  const status =
    statusRaw.includes("draft")
      ? "draft"
      : statusRaw.includes("schedul")
        ? "scheduled"
        : statusRaw.includes("active")
          ? "active"
          : "sent";
  return {
    id: asString(raw.id, cryptoRandomId()),
    code: asString(raw.code || raw.reference, `NTF-${raw.id}`),
    title: asString(raw.title, "إشعار"),
    description: asString(raw.description || raw.body || raw.message, ""),
    status,
    statusLabel:
      status === "draft"
        ? "مسودة"
        : status === "scheduled"
          ? "مجدول"
          : status === "active"
            ? "نشط"
            : "تم الإرسال",
    sentAt: asString(raw.sent_at || raw.created_at, "—"),
    scheduledFor: raw.scheduled_for ? asString(raw.scheduled_for) : undefined,
    audienceType: asString(raw.audience_type, "all") === "specific" ? "specific" : "all",
    targetAudienceLabel: asString(raw.target_audience_label, "جميع المكاتب"),
    targetCount: asNumber(raw.target_count, 0),
    actionUrl: asString(raw.action_url || raw.url, ""),
    imageUrl: raw.image_url ? asString(raw.image_url) : undefined,
  };
}

export function mapCurrencyFromApi(raw: Record<string, unknown>, index = 0): CurrencyItem {
  return {
    id: asString(raw.id, cryptoRandomId()),
    orderNumber: String(index + 1).padStart(2, "0"),
    name: asString(raw.name, "عملة"),
    code: asString(raw.code, "SAR"),
    symbol: asString(raw.symbol, "ر.س"),
    exchangeRate: asString(raw.exchange_rate || raw.rate_label, "1.0000"),
    isBaseCurrency: Boolean(raw.is_default || raw.is_base || raw.isBaseCurrency),
    status: ["inactive", "disabled", "0", 0, false].includes(
      (raw.status as string | number | boolean) ?? "active"
    )
      ? "inactive"
      : "active",
  };
}

export function mapLanguageFromApi(raw: Record<string, unknown>, index = 0): LanguageItem {
  const code = asString(raw.code, "ar");
  const dirRaw = asString(raw.direction || raw.dir, code === "ar" ? "rtl" : "ltr").toLowerCase();
  return {
    id: asString(raw.id, cryptoRandomId()),
    orderNumber: String(index + 1).padStart(2, "0"),
    name: asString(raw.name, "لغة"),
    nativeName: raw.native_name ? asString(raw.native_name) : undefined,
    code,
    direction: dirRaw === "ltr" ? "ltr" : "rtl",
    isDefault: Boolean(raw.is_default || raw.isDefault),
    status: ["inactive", "disabled", "0", 0, false].includes(
      (raw.status as string | number | boolean) ?? "active"
    )
      ? "inactive"
      : "active",
  };
}

export function mapGeneralSettingsFromApi(payload: unknown): Partial<GeneralSettings> {
  const data = (unwrapData<Record<string, unknown>>(payload) || {}) as Record<string, unknown>;
  return {
    systemTitle: data.system_title || data.app_name ? asString(data.system_title || data.app_name) : undefined,
    companyName: data.company_name ? asString(data.company_name) : undefined,
    slogan: data.slogan ? asString(data.slogan) : undefined,
    phone: data.phone ? asString(data.phone) : undefined,
    email: data.email ? asString(data.email) : undefined,
    licenseCode: data.license_code ? asString(data.license_code) : undefined,
    licenseStatus: data.license_status ? asString(data.license_status) : undefined,
    timezone: data.timezone ? asString(data.timezone) : undefined,
    defaultLanguage: data.default_language ? asString(data.default_language) : undefined,
    country: data.country ? asString(data.country) : undefined,
    defaultCurrency: data.default_currency ? asString(data.default_currency) : undefined,
    primaryColor: data.primary_color ? asString(data.primary_color) : undefined,
    telegramGuideUrl: data.telegram_url ? asString(data.telegram_url) : undefined,
    whatsappGuideUrl: data.whatsapp_url ? asString(data.whatsapp_url) : undefined,
    apiDocsUrl: data.api_docs_url ? asString(data.api_docs_url) : undefined,
  };
}

export function mapHeroFromApi(payload: unknown): Partial<HeroSectionData> {
  const data = (unwrapData<Record<string, unknown>>(payload) || {}) as Record<string, unknown>;
  return {
    title: data.title ? asString(data.title) : undefined,
    subtitle: data.subtitle ? asString(data.subtitle) : undefined,
    description: data.description ? asString(data.description) : undefined,
    actionButtonEnabled:
      data.action_button_enabled !== undefined ? Boolean(data.action_button_enabled) : undefined,
    actionButtonLabel: data.action_button_label ? asString(data.action_button_label) : undefined,
    actionButtonUrl: data.action_button_url ? asString(data.action_button_url) : undefined,
    secondaryActionButtonEnabled:
      data.secondary_action_enabled !== undefined
        ? Boolean(data.secondary_action_enabled)
        : undefined,
    secondaryActionButtonLabel: data.secondary_action_label
      ? asString(data.secondary_action_label)
      : undefined,
    secondaryActionButtonUrl: data.secondary_action_url
      ? asString(data.secondary_action_url)
      : undefined,
    currentImageName: data.image_name ? asString(data.image_name) : undefined,
  };
}

export function mapSeoFromApi(payload: unknown): Partial<SeoData> {
  const data = (unwrapData<Record<string, unknown>>(payload) || {}) as Record<string, unknown>;
  return {
    language: data.language ? asString(data.language) : undefined,
    authorName: data.author_name ? asString(data.author_name) : undefined,
    metaTitle: data.meta_title ? asString(data.meta_title) : undefined,
    metaKeywords: data.meta_keywords ? asString(data.meta_keywords) : undefined,
    metaDescription: data.meta_description ? asString(data.meta_description) : undefined,
    ogTitle: data.og_title ? asString(data.og_title) : undefined,
    ogDescription: data.og_description ? asString(data.og_description) : undefined,
  };
}

export function mapWebsiteFeatureFromApi(raw: Record<string, unknown>, index = 0): FeatureItem {
  return {
    id: asString(raw.id, cryptoRandomId()),
    orderNumber: asNumber(raw.order || raw.sort_order, index + 1),
    titleAr: asString(raw.title_ar || raw.title, "ميزة"),
    titleEn: asString(raw.title_en || raw.title, "Feature"),
    platform: asString(raw.platform, "Web"),
    status: !["inactive", "disabled", "0", 0, false].includes(
      (raw.status as string | number | boolean) ?? true
    ),
  };
}

export function mapPlansResponse(payload: unknown): PricingPlanItem[] {
  return unwrapList<Record<string, unknown>>(payload).map(mapPlanFromApi);
}

export function mapSubscriptionsResponse(payload: unknown): SubscriptionRecord[] {
  return unwrapList<Record<string, unknown>>(payload).map(mapSubscriptionFromApi);
}

export function mapStaffResponse(payload: unknown): Employee[] {
  return unwrapList<Record<string, unknown>>(payload).map(mapStaffFromApi);
}

export function mapRolesResponse(payload: unknown): RoleItem[] {
  return unwrapList<Record<string, unknown>>(payload).map(mapRoleFromApi);
}

export function mapTicketsResponse(payload: unknown): Ticket[] {
  return unwrapList<Record<string, unknown>>(payload).map(mapTicketFromApi);
}

export function mapDepartmentsResponse(payload: unknown): TicketDepartment[] {
  return unwrapList<Record<string, unknown>>(payload).map(mapDepartmentFromApi);
}

export function mapInvoicesResponse(payload: unknown): InvoiceItem[] {
  return unwrapList<Record<string, unknown>>(payload).map(mapInvoiceFromApi);
}

export function mapNotificationsResponse(payload: unknown): NotificationItem[] {
  return unwrapList<Record<string, unknown>>(payload).map(mapNotificationFromApi);
}

export function mapCurrenciesResponse(payload: unknown): CurrencyItem[] {
  return unwrapList<Record<string, unknown>>(payload).map(mapCurrencyFromApi);
}

export function mapLanguagesResponse(payload: unknown): LanguageItem[] {
  return unwrapList<Record<string, unknown>>(payload).map(mapLanguageFromApi);
}

export function mapWebsiteFeaturesResponse(payload: unknown): FeatureItem[] {
  return unwrapList<Record<string, unknown>>(payload).map(mapWebsiteFeatureFromApi);
}

export function mapDashboardKpis(payload: unknown): {
  totalFirms: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  openTickets: number;
} {
  const data = (unwrapData<Record<string, unknown>>(payload) || {}) as Record<string, unknown>;
  const stats = (data.stats || data.kpis || data) as Record<string, unknown>;
  return {
    totalFirms: asNumber(
      stats.total_firms ?? stats.firms_count ?? stats.totalLawOffices ?? stats.total_offices,
      128
    ),
    activeSubscriptions: asNumber(
      stats.active_subscriptions ?? stats.subscriptions_active ?? stats.activeSubscriptions,
      96
    ),
    monthlyRevenue: asNumber(
      stats.monthly_revenue ?? stats.mrr ?? stats.revenue_monthly,
      48750
    ),
    openTickets: asNumber(
      stats.open_tickets ?? stats.tickets_open ?? stats.support_open,
      12
    ),
  };
}

function cryptoRandomId() {
  return `id-${Math.random().toString(36).slice(2, 10)}`;
}
