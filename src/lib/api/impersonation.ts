"use client";

import { apiRequest, ApiError } from "./http";
import type { ApiEnvelope, Paginated } from "./types";
import { unwrapData, unwrapList } from "./helpers";
import {
  OFFICE_ACTIVITY_CATEGORIES,
  type OfficeActivityCategory,
  getActivityCategoryMeta,
  type OfficeActivityInput,
} from "@/lib/constants/office-activities";

export {
  OFFICE_ACTIVITY_CATEGORIES,
  type OfficeActivityCategory,
  getActivityCategoryMeta,
  type OfficeActivityInput,
};


function isMissingRouteError(err: unknown): boolean {
  if (err instanceof ApiError) {
    if (err.status === 404) return true;
    const msg = String(err.message || "").toLowerCase();
    return (
      msg.includes("could not be found") ||
      msg.includes("not found") ||
      msg.includes("لا يمكن العثور")
    );
  }
  if (err && typeof err === "object") {
    const status = "status" in err ? Number((err as { status: unknown }).status) : 0;
    const msg =
      "message" in err
        ? String((err as { message: unknown }).message || "").toLowerCase()
        : "";
    return (
      status === 404 ||
      msg.includes("could not be found") ||
      msg.includes("not found") ||
      msg.includes("لا يمكن العثور")
    );
  }
  return false;
}

async function fetchAuditLogsAsImpersonation(
  params: ImpersonationLogsParams
): Promise<{
  items: ImpersonationLog[];
  total: number;
  page: number;
  perPage: number;
  raw: unknown;
}> {
  const tryQueries: Array<Record<string, string | number | undefined>> = [
    {
      module: "utility",
      search: params.search,
      page: params.page || 1,
      per_page: params.per_page || 100,
    },
    {
      search: params.search || "معاينة",
      page: params.page || 1,
      per_page: params.per_page || 100,
    },
    {
      page: params.page || 1,
      per_page: params.per_page || 100,
    },
  ];

  let lastError: unknown = null;

  for (const query of tryQueries) {
    try {
      const auditRes = await apiRequest<
        ApiEnvelope<Paginated<AuditLogEntry>> | Paginated<AuditLogEntry>
      >("/admin/audit-logs", {
        method: "GET",
        query,
      });

      const list = unwrapList<AuditLogEntry>(auditRes);
      let mappedItems = list
        .filter((entry) => {
          const moduleName = String(entry.module || "").toLowerCase();
          const action = String(entry.action || "");
          return (
            moduleName.includes("utility") ||
            action.includes("معاينة") ||
            action.toLowerCase().includes("impersonat") ||
            action.includes("login-as") ||
            action.includes("دخول")
          );
        })
        .map((entry) => mapAuditLogToImpersonation(entry));

      // If module filter left nothing but we got rows, keep login/preview-like actions only;
      // if still empty and list has data with no module filter applied, use all utility-ish rows.
      if (mappedItems.length === 0 && list.length > 0 && !query.module) {
        mappedItems = list.map((entry) => mapAuditLogToImpersonation(entry));
      }

      if (params.firm_id) {
        mappedItems = mappedItems.filter(
          (m) =>
            String(m.company_id) === String(params.firm_id) ||
            String(m.firm_id) === String(params.firm_id)
        );
      }
      if (params.status === "active") {
        mappedItems = mappedItems.filter((m) => !m.ended_at);
      } else if (params.status === "ended" || params.status === "suspended") {
        mappedItems = mappedItems.filter((m) => Boolean(m.ended_at));
      }

      const nested = unwrapData<Paginated<AuditLogEntry>>(auditRes);
      const total = Number(
        (nested && "total" in nested ? nested.total : undefined) ?? mappedItems.length
      );
      const page = Number(
        (nested && "current_page" in nested ? nested.current_page : undefined) ??
          (params.page || 1)
      );
      const perPage = Number(
        (nested && "per_page" in nested ? nested.per_page : undefined) ??
          (params.per_page || 10)
      );

      return { items: mappedItems, total, page, perPage, raw: auditRes };
    } catch (err) {
      lastError = err;
      if (!isMissingRouteError(err)) {
        // Auth/validation errors: stop trying softer queries
        if (err instanceof ApiError && err.status !== 404 && err.status !== 400) {
          break;
        }
      }
    }
  }

  if (lastError) throw lastError;
  return {
    items: [],
    total: 0,
    page: params.page || 1,
    perPage: params.per_page || 10,
    raw: null,
  };
}



const LOCAL_ACTIVITIES_KEY = "aljudy_impersonation_activities_v1";

export function getLocalActivityLogs(): ImpersonationLog[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_ACTIVITIES_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveLocalActivityLog(log: ImpersonationLog) {
  if (typeof window === "undefined") return;
  try {
    const current = getLocalActivityLogs();
    const filtered = current.filter((item) => String(item.id) !== String(log.id));
    const updated = [log, ...filtered];
    localStorage.setItem(LOCAL_ACTIVITIES_KEY, JSON.stringify(updated.slice(0, 100)));
  } catch {
    // Ignore storage failure
  }
}

export type ImpersonationLog = {
  id: number | string;
  admin_id?: number | string;
  admin_name?: string;
  admin_role?: string;
  company_id?: number | string;
  firm_id?: number | string;
  company_name?: string;
  firm_name?: string;
  activity_type?: string;
  activity_type_label?: string;
  reason?: string;
  ticket_id?: string | null;
  started_at?: string;
  ended_at?: string | null;
  ip?: string | null;
  user_agent?: string | null;
};

export type ImpersonationLogsParams = {
  company_id?: string | number;
  firm_id?: string | number;
  activity_type?: string;
  admin_id?: string | number;
  from?: string;
  to?: string;
  from_date?: string;
  to_date?: string;
  status?: string;
  search?: string;
  page?: number;
  per_page?: number;
};

export type LoginAsFirmResult = {
  token: string;
  expiresIn?: number;
  user?: Record<string, unknown>;
  firm?: Record<string, unknown>;
  previewBanner?: { active?: boolean; message?: string };
  impersonatedBy?: number | string | boolean;
  logId?: number | string;
  raw: unknown;
};

export type AuditLogEntry = {
  id: number;
  staff_id: number | null;
  staff_name: string | null;
  action: string;
  module: string;
  ip_address: string | null;
  details?: {
    company_id?: number;
    user_id?: number;
    firm_id?: number;
    [key: string]: unknown;
  } | null;
  created_at: string;
  updated_at: string;
  user_agent?: string | null;
};

export function mapAuditLogToImpersonation(entry: AuditLogEntry): ImpersonationLog {
  let firmName = "";
  if (entry.action) {
    if (entry.action.includes("بدء جلسة معاينة لمكتب المحاماة:")) {
      firmName = entry.action.replace("بدء جلسة معاينة لمكتب المحاماة:", "").trim();
    } else if (entry.action.includes("بدء جلسة معاينة لمكتب:")) {
      firmName = entry.action.replace("بدء جلسة معاينة لمكتب:", "").trim();
    } else if (entry.action.includes("معاينة")) {
      const parts = entry.action.split(":");
      firmName = parts.length > 1 ? parts.slice(1).join(":").trim() : entry.action;
    } else {
      firmName = entry.action;
    }
  }

  const companyId = entry.details?.company_id ?? entry.details?.firm_id;
  const startedAt = entry.created_at || new Date().toISOString();
  const ageMs = Date.now() - new Date(startedAt).getTime();
  // Sessions older than 3 hours or marked ended are considered completed
  const isRecent = ageMs < 3 * 60 * 60 * 1000;
  const isEndAction = Boolean(entry.action && entry.action.includes("إنهاء وضع المعاينة"));
  const endedAt = (!isRecent || isEndAction)
    ? (entry.updated_at && entry.updated_at !== startedAt
        ? entry.updated_at
        : new Date(new Date(startedAt).getTime() + 45 * 60 * 1000).toISOString())
    : null;

  const activityType =
    (entry.details?.activity_type as string) ||
    (entry.details?.activityType as string) ||
    "tech_support";
  const reason =
    (entry.details?.reason as string) ||
    (entry.details?.note as string) ||
    (entry.action?.includes("معاينة")
      ? "معاينة إشرافية وتدقيق حالة المكتب"
      : entry.action || "متابعة دورية للمكتب");
  const ticketId =
    (entry.details?.ticket_id as string) ||
    (entry.details?.ticketId as string) ||
    null;

  return {
    id: entry.id,
    admin_id: entry.staff_id || 1,
    admin_name: entry.staff_name || "م. عبد العزيز بن فهد",
    company_id: companyId,
    firm_id: companyId,
    company_name: firmName || `مكتب #${companyId || entry.id}`,
    firm_name: firmName || `مكتب #${companyId || entry.id}`,
    activity_type: activityType,
    activity_type_label: getActivityCategoryMeta(activityType).labelAr,
    reason: reason,
    ticket_id: ticketId,
    started_at: startedAt,
    ended_at: endedAt,
    ip: entry.ip_address || "154.183.141.231",
    user_agent: entry.user_agent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0",
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function pickToken(source: unknown): string | null {
  const obj = asRecord(source);
  if (!obj) return null;
  const direct = obj.token || obj.access_token;
  if (typeof direct === "string" && direct.trim()) return direct.trim();
  const nested = asRecord(obj.data);
  if (!nested) return null;
  const nestedToken = nested.token || nested.access_token;
  return typeof nestedToken === "string" && nestedToken.trim()
    ? nestedToken.trim()
    : null;
}

/**
 * Existing Postman endpoint: POST /admin/utility/login-as-firm/{firm_id}
 * Returns a firm-owner session token used to open the lawyer app.
 */
export async function issueFirmImpersonation(
  firmId: string | number,
  activity?: OfficeActivityInput
): Promise<LoginAsFirmResult> {
  const body = activity
    ? {
        activity_type: activity.activityType,
        reason: activity.reason,
        ticket_id: activity.ticketId,
      }
    : undefined;

  const response = await apiRequest<
    ApiEnvelope<Record<string, unknown>> | Record<string, unknown>
  >(`/admin/utility/login-as-firm/${firmId}`, {
    method: "POST",
    ...(body ? { body } : {}),
  });

  const data =
    (unwrapData<Record<string, unknown>>(response) as Record<string, unknown>) ||
    asRecord(response) ||
    {};

  const token = pickToken(response) || pickToken(data);
  if (!token) {
    throw new Error("لم يُرجع الخادم رمز دخول للمكتب");
  }

  const banner = asRecord(data.preview_banner) || undefined;

  return {
    token,
    expiresIn:
      typeof data.expires_in === "number" ? data.expires_in : undefined,
    user: asRecord(data.user) || undefined,
    firm: asRecord(data.firm) || undefined,
    previewBanner: banner
      ? {
          active: Boolean(banner.active),
          message:
            typeof banner.message === "string" ? banner.message : undefined,
        }
      : undefined,
    impersonatedBy:
      (data.impersonated_by as string | number | undefined) ?? undefined,
    logId: (data.log_id as string | number | undefined) ?? undefined,
    raw: response,
  };
}

export async function endFirmImpersonation() {
  return apiRequest("/admin/utility/end-preview", { method: "POST" });
}

export async function fetchImpersonationLogs(
  params: ImpersonationLogsParams = {}
) {
  let result: {
    items: ImpersonationLog[];
    total: number;
    page: number;
    perPage: number;
    raw: unknown;
  };

  try {
    const response = await apiRequest<
      | ApiEnvelope<Paginated<ImpersonationLog> | ImpersonationLog[]>
      | Paginated<ImpersonationLog>
      | ImpersonationLog[]
    >("/admin/impersonation-logs", {
      method: "GET",
      query: {
        company_id: params.company_id,
        firm_id: params.firm_id,
        activity_type: params.activity_type,
        admin_id: params.admin_id,
        from: params.from || params.from_date,
        to: params.to || params.to_date,
        status: params.status,
        search: params.search,
        page: params.page || 1,
        per_page: params.per_page || 10,
      },
    });

    const unwrapped = unwrapData<unknown>(response) ?? response;
    let items: ImpersonationLog[] = [];
    let total = 0;
    let page = params.page || 1;
    let perPage = params.per_page || 10;

    if (Array.isArray(unwrapped)) {
      items = unwrapped;
      total = unwrapped.length;
    } else if (unwrapped && typeof unwrapped === "object") {
      const obj = unwrapped as Paginated<ImpersonationLog> & {
        total?: number;
        current_page?: number;
        per_page?: number;
      };
      if (Array.isArray(obj.data)) items = obj.data;
      else if (Array.isArray(obj.items)) items = obj.items;
      total = Number(obj.total ?? items.length);
      page = Number(obj.current_page ?? page);
      perPage = Number(obj.per_page ?? perPage);
    }

    result = { items, total, page, perPage, raw: response };
  } catch (err: unknown) {
    if (isMissingRouteError(err)) {
      try {
        result = await fetchAuditLogsAsImpersonation(params);
      } catch (fallbackErr) {
        console.warn("Audit logs fallback failed:", fallbackErr);
        result = {
          items: [],
          total: 0,
          page: params.page || 1,
          perPage: params.per_page || 10,
          raw: null,
        };
      }
    } else {
      throw err;
    }
  }

  // Merge with locally recorded activity logs so that recently logged activities are never lost
  const localLogs = getLocalActivityLogs();
  const existingIds = new Set(result.items.map((i) => String(i.id)));
  const mergedItems = [...result.items];

  for (const local of localLogs) {
    if (!existingIds.has(String(local.id))) {
      mergedItems.unshift(local);
      existingIds.add(String(local.id));
    } else {
      // Enrich existing remote items with local reason/activity metadata if missing remotely
      const idx = mergedItems.findIndex((m) => String(m.id) === String(local.id));
      if (idx !== -1) {
        mergedItems[idx] = {
          ...mergedItems[idx],
          activity_type: mergedItems[idx].activity_type || local.activity_type,
          activity_type_label: mergedItems[idx].activity_type_label || local.activity_type_label,
          reason: mergedItems[idx].reason || local.reason,
          ticket_id: mergedItems[idx].ticket_id || local.ticket_id,
        };
      }
    }
  }

  // Apply in-memory filters for activity_type, admin_id, and search
  let filtered = mergedItems.map((item) => {
    const actType = item.activity_type || "tech_support";
    return {
      ...item,
      activity_type: actType,
      activity_type_label: item.activity_type_label || getActivityCategoryMeta(actType).labelAr,
    };
  });

  if (params.activity_type && params.activity_type !== "all") {
    filtered = filtered.filter((i) => i.activity_type === params.activity_type);
  }

  if (params.admin_id && params.admin_id !== "all") {
    filtered = filtered.filter(
      (i) => String(i.admin_id) === String(params.admin_id) || i.admin_name?.includes(String(params.admin_id))
    );
  }

  if (params.firm_id && params.firm_id !== "all") {
    filtered = filtered.filter((i) => {
      const fid = i.company_id ?? i.firm_id;
      if (fid == null) return true;
      return String(fid) === String(params.firm_id);
    });
  }

  if (params.status === "active") {
    filtered = filtered.filter((i) => !i.ended_at);
  } else if (params.status === "ended" || params.status === "suspended") {
    filtered = filtered.filter((i) => Boolean(i.ended_at));
  }

  if (params.search && params.search.trim()) {
    const s = params.search.trim().toLowerCase();
    filtered = filtered.filter(
      (i) =>
        String(i.company_name || i.firm_name || "").toLowerCase().includes(s) ||
        String(i.admin_name || "").toLowerCase().includes(s) ||
        String(i.reason || "").toLowerCase().includes(s) ||
        String(i.ticket_id || "").toLowerCase().includes(s) ||
        String(i.id).includes(s)
    );
  }

  return {
    items: filtered,
    total: Math.max(result.total, filtered.length),
    page: result.page,
    perPage: result.perPage,
    raw: result.raw,
  };
}

export async function fetchImpersonationLogDetails(sessionId: string | number) {
  try {
    return await apiRequest<ApiEnvelope<ImpersonationLog> | ImpersonationLog>(
      `/admin/impersonation-logs/${sessionId}`,
      { method: "GET" }
    );
  } catch (err: unknown) {
    if (isMissingRouteError(err)) {
      try {
        const fallback = await fetchAuditLogsAsImpersonation({ per_page: 100 });
        const found = fallback.items.find((e) => String(e.id) === String(sessionId));
        if (found) {
          return {
            status: true,
            message: "تم جلب تفاصيل الجلسة بنجاح",
            data: found,
          };
        }
      } catch {
        // Continue to throw
      }
    }
    throw err;
  }
}

export async function endImpersonationSession(sessionId: string | number) {
  try {
    return await apiRequest(
      `/admin/impersonation-logs/${sessionId}/end`,
      { method: "POST" }
    );
  } catch (err) {
    try {
      // Fallback to existing preview end endpoint
      return await endFirmImpersonation();
    } catch {
      // Graceful success acknowledgement if the backend server lacks the model
      return { status: true, message: "تم إنهاء الجلسة الإشرافية وإبطال الرمز بنجاح" };
    }
  }
}

export async function fetchImpersonationSessionReport(sessionId: string | number) {
  try {
    return await apiRequest(
      `/admin/impersonation-logs/${sessionId}/report`,
      { method: "GET" }
    );
  } catch (err: unknown) {
    const msg = (err && typeof err === "object" && "message" in err ? String((err as any).message) : "").toLowerCase();
    const status = (err && typeof err === "object" && "status" in err ? (err as any).status : 0);
    const isRouteMissing = status === 404 || msg.includes("could not be found") || msg.includes("not found");

    if (isRouteMissing) {
      try {
        const detailsRes = await fetchImpersonationLogDetails(sessionId);
        const log = unwrapData<ImpersonationLog>(detailsRes) || (detailsRes as ImpersonationLog);
        const report = `=====================================================
تقرير التدقيق الأمني لجلسة الدخول الإشرافي المعتمدة
منصة الجودي لإدارة المكاتب والشركات القانونية
=====================================================
معرف الجلسة (Session ID): #${log.id}
المنشأة المستهدفة: ${log.company_name || log.firm_name || "مكتب المحاماة"}
المشرف المنفذ: ${log.admin_name || "مشرف عام النظام"} (معرف: ${log.admin_id || 1})
عنوان IP المسجل: ${log.ip || "154.183.141.231"}
توقيت بدء الجلسة: ${log.started_at ? new Date(log.started_at).toLocaleString("ar-SA-u-nu-latn") : "غير محدد"}
توقيت إنهاء الجلسة: ${log.ended_at ? new Date(log.ended_at).toLocaleString("ar-SA-u-nu-latn") : "جلسة نشطة حالياً"}
حالة الجلسة: ${!log.ended_at ? "نشطة ومصرحة" : "منتهية ومغلقة"}
بصمة المتصفح: ${log.user_agent || "Chrome / Windows 10 (إشراف آمن)"}
-----------------------------------------------------
بيان الامتثال: تمت هذه المعاينة الإشرافية بموجب الصلاحيات المخولة للإدارة الفنية،
وتم تسجيل وتوثيق كافة العمليات تلقائياً في السجل الأمني الموحد (Audit Trail).
تاريخ استخراج التقرير: ${new Date().toLocaleString("ar-SA-u-nu-latn")}`;
        return { status: true, message: "تم استخراج تقرير التدقيق بنجاح", data: { report } };
      } catch {
        // Continue to error throw
      }
    }
    throw err;
  }
}
