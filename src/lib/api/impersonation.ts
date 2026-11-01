"use client";

import { apiRequest } from "./http";
import type { ApiEnvelope, Paginated } from "./types";
import { unwrapData } from "./helpers";

export type ImpersonationLog = {
  id: number | string;
  admin_id?: number | string;
  admin_name?: string;
  company_id?: number | string;
  firm_id?: number | string;
  company_name?: string;
  firm_name?: string;
  started_at?: string;
  ended_at?: string | null;
  ip?: string | null;
  user_agent?: string | null;
};

export type ImpersonationLogsParams = {
  company_id?: string | number;
  firm_id?: string | number;
  from?: string;
  to?: string;
  page?: number;
  per_page?: number;
};

export type LoginAsFirmResult = {
  token: string;
  expiresIn?: number;
  user?: Record<string, unknown>;
  firm?: Record<string, unknown>;
  previewBanner?: { active?: boolean; message?: string };
  impersonatedBy?: number | string;
  logId?: number | string;
  raw: unknown;
};

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
  firmId: string | number
): Promise<LoginAsFirmResult> {
  const response = await apiRequest<
    ApiEnvelope<Record<string, unknown>> | Record<string, unknown>
  >(`/admin/utility/login-as-firm/${firmId}`, { method: "POST" });

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
  const response = await apiRequest<
    | ApiEnvelope<Paginated<ImpersonationLog> | ImpersonationLog[]>
    | Paginated<ImpersonationLog>
    | ImpersonationLog[]
  >("/admin/impersonation-logs", {
    method: "GET",
    query: {
      company_id: params.company_id,
      firm_id: params.firm_id,
      from: params.from,
      to: params.to,
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

  return { items, total, page, perPage, raw: response };
}
