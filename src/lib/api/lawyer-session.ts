import { LAWYER_APP_URL, SUPER_ADMIN_APP_URL } from "./config";
import type { LoginAsFirmResult } from "./impersonation";

/** Lawyer SPA session key (same-origin with /lawyer on law.elmoroj.com). */
export const LAWYER_AUTH_SESSION_KEY = "doussary_auth_session";
export const LAWYER_AUTH_USER_KEY = "doussary_auth";

export type LawyerAuthSession = {
  token: string;
  id: number | string;
  name: string;
  email: string;
  phone: string;
  role: string;
  roleId: string;
  assignedRole: string;
  company_id: number | string | null;
  permissions: Record<string, unknown>;
  impersonated_by?: number | string | boolean;
  firm_name?: string;
  preview_banner?: { active?: boolean; message?: string };
};

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asId(value: unknown): number | string | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

/** Map login-as-firm API payload to the lawyer SPA session shape. */
export function buildLawyerAuthSession(
  result: LoginAsFirmResult
): LawyerAuthSession {
  const user = result.user || {};
  const firm = result.firm || {};
  const role = asString(user.role, "owner");
  const isAdminLike = ["admin", "owner", "consultant"].includes(
    role.toLowerCase()
  );
  const companyId =
    asId(user.company_id) ?? asId(firm.id) ?? asId(firm.company_id);

  return {
    token: result.token,
    id: asId(user.id) ?? "0",
    name: asString(user.full_name || user.name, asString(firm.name, "مكتب")),
    email: asString(user.email),
    phone: asString(user.phone),
    role,
    roleId: isAdminLike ? "admin" : role,
    assignedRole: isAdminLike ? "المستشار" : role,
    company_id: companyId,
    permissions: { all: true },
    impersonated_by: result.impersonatedBy ?? true,
    firm_name: asString(firm.name),
    preview_banner: result.previewBanner,
  };
}

function encodeSession(session: LawyerAuthSession): string {
  const json = JSON.stringify(session);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeSessionParam(raw: string): LawyerAuthSession | null {
  try {
    const padded = raw.replace(/-/g, "+").replace(/_/g, "/");
    const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
    const binary = atob(padded + pad);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as LawyerAuthSession;
    if (!parsed?.token) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Target contract once lawyer `/impersonate` ships:
 * `${LAWYER_APP_URL}/impersonate?token=…`
 */
export function buildLawyerImpersonateUrl(token: string): string {
  const url = new URL(`${LAWYER_APP_URL}/impersonate`);
  url.searchParams.set("token", token);
  return url.toString();
}

/**
 * Production bridge while lawyer `/impersonate` is missing.
 * Same origin as /lawyer on law.elmoroj.com → sessionStorage is shared after redirect.
 * Encoded payload is stripped from the URL immediately on the handoff page.
 */
export function buildImpersonationHandoffUrl(session: LawyerAuthSession): string {
  const url = new URL(`${SUPER_ADMIN_APP_URL}/impersonate-handoff/`);
  url.searchParams.set("s", encodeSession(session));
  url.searchParams.set("next", `${LAWYER_APP_URL}/`);
  return url.toString();
}
