import { API_BASE_URL, LAWYER_APP_URL, SUPER_ADMIN_APP_URL } from "./config";
import type { LoginAsFirmResult } from "./impersonation";

/** Lawyer SPA session key — must match live /lawyer bundle (`Xs = doussary_auth_session`). */
export const LAWYER_AUTH_SESSION_KEY = "doussary_auth_session";
export const LAWYER_AUTH_USER_KEY = "doussary_auth";
/** Short-lived bridge written by Super Admin before opening the handoff tab. */
export const LAWYER_HANDOFF_BRIDGE_KEY = "__aljudy_impersonation_bridge";

/**
 * Exact shape written by the live lawyer login success path
 * (`jc({...user, token, company_id, permissions})` → sessionStorage).
 */
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
  company_name?: string;
  status?: string;
  permissions: Record<string, unknown>;
  customMenu?: unknown;
  raw?: Record<string, unknown>;
  impersonated_by?: number | string | boolean;
  firm_name?: string;
  preview_banner?: { active?: boolean; message?: string };
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
  office_id?: string;
};

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asId(value: unknown): number | string | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

function isAdminLikeRole(role: string, assignedRole: string): boolean {
  const r = role.toLowerCase();
  const a = assignedRole.toLowerCase();
  return (
    r === "admin" ||
    r === "owner" ||
    r.includes("مالك") ||
    r.includes("ادمن") ||
    a.includes("مالك") ||
    a.includes("مستشار") ||
    a.includes("consultant") ||
    a.includes("ادمن")
  );
}

/** Map login-as-firm API payload to the lawyer SPA session shape. */
export function buildLawyerAuthSession(
  result: LoginAsFirmResult
): LawyerAuthSession {
  const user = result.user || {};
  const firm = result.firm || {};
  const role = asString(user.role, "owner");
  const assignedRole = asString(
    user.assignedRole || user.assigned_role,
    isAdminLikeRole(role, "") ? "المستشار العام" : ""
  );
  const adminLike = isAdminLikeRole(role, assignedRole);
  const companyId =
    asId(user.company_id) ?? asId(firm.id) ?? asId(firm.company_id);
  const firmName = asString(firm.name, asString(user.company_name));

  return {
    token: result.token,
    id: asId(user.id) ?? "0",
    name: asString(user.full_name || user.name, firmName || "مكتب"),
    email: asString(user.email),
    phone: asString(user.phone),
    role,
    roleId: adminLike ? "admin" : role,
    assignedRole: assignedRole || (adminLike ? "المستشار العام" : role),
    company_id: companyId,
    company_name: firmName || "Law Office",
    status: asString(user.status, "نشط"),
    permissions: { all: true },
    customMenu: null,
    raw: user,
    impersonated_by: result.impersonatedBy ?? true,
    firm_name: firmName,
    preview_banner: result.previewBanner,
  };
}

/**
 * Enrich session via GET /me using the issued Sanctum token —
 * matches what normal lawyer login stores after a successful POST /login.
 */
export async function enrichLawyerSessionFromMe(
  session: LawyerAuthSession
): Promise<LawyerAuthSession> {
  if (!session.token) return session;

  const paths = ["/me", "/auth/me"];
  for (const path of paths) {
    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${session.token}`,
        },
      });
      if (!response.ok) continue;
      const payload = (await response.json()) as Record<string, unknown>;
      const data =
        (payload.data as Record<string, unknown> | undefined) || payload;
      const user =
        (data.user as Record<string, unknown> | undefined) ||
        (payload.user as Record<string, unknown> | undefined) ||
        data;
      if (!user || typeof user !== "object") continue;

      const role = asString(user.role, session.role);
      const assignedRole = asString(
        user.assignedRole || user.assigned_role,
        session.assignedRole
      );
      const adminLike = isAdminLikeRole(role, assignedRole);
      const companyId =
        asId(user.company_id) ??
        asId((user.company as Record<string, unknown> | undefined)?.id) ??
        session.company_id;
      const companyName = asString(
        (user.company as Record<string, unknown> | undefined)?.name ||
          user.company_name,
        session.company_name || session.firm_name || "Law Office"
      );

      return {
        ...session,
        id: asId(user.id) ?? session.id,
        name: asString(user.full_name || user.name, session.name),
        email: asString(user.email, session.email),
        phone: asString(user.phone, session.phone),
        role,
        roleId: adminLike ? "admin" : role,
        assignedRole: assignedRole || (adminLike ? "المستشار العام" : role),
        company_id: companyId,
        company_name: companyName,
        firm_name: companyName,
        status: asString(user.status, session.status || "نشط"),
        permissions:
          (user.permissions as Record<string, unknown> | undefined) ||
          session.permissions ||
          { all: true },
        raw: user,
        token: session.token,
      };
    } catch {
      /* try next path */
    }
  }

  return session;
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
    const pad =
      padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
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

/** Write the exact session object the lawyer AuthProvider hydrates via Ac()/lc(). */
export function persistLawyerSession(session: LawyerAuthSession) {
  // Lawyer `jc` stores the user object WITH token/company_id/permissions flattened.
  const payload: LawyerAuthSession = {
    ...session,
    token: session.token,
    company_id:
      session.company_id == null ? null : Number(session.company_id) || session.company_id,
    permissions: session.permissions || { all: true },
  };
  const json = JSON.stringify(payload);
  const userJson = JSON.stringify({
    id: payload.id,
    user: {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      phone: payload.phone,
      company_id: payload.company_id,
    },
  });

  try {
    sessionStorage.setItem(LAWYER_AUTH_SESSION_KEY, json);
  } catch {
    /* private mode / quota */
  }
  try {
    localStorage.setItem(LAWYER_AUTH_SESSION_KEY, json);
    localStorage.setItem(LAWYER_AUTH_USER_KEY, userJson);
    localStorage.setItem("token", payload.token);
    localStorage.setItem("access_token", payload.token);
  } catch {
    /* ignore */
  }
}

export function stashLawyerHandoffSession(session: LawyerAuthSession) {
  const json = JSON.stringify(session);
  localStorage.setItem(LAWYER_HANDOFF_BRIDGE_KEY, json);
  localStorage.setItem(LAWYER_AUTH_SESSION_KEY, json);
  localStorage.setItem(
    LAWYER_AUTH_USER_KEY,
    JSON.stringify({
      id: session.id,
      user: {
        id: session.id,
        name: session.name,
        email: session.email,
        role: session.role,
        company_id: session.company_id,
      },
    })
  );
}

export function consumeLawyerHandoffBridge(): LawyerAuthSession | null {
  try {
    const raw =
      localStorage.getItem(LAWYER_HANDOFF_BRIDGE_KEY) ||
      localStorage.getItem(LAWYER_AUTH_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LawyerAuthSession;
    if (!parsed?.token) return null;
    localStorage.removeItem(LAWYER_HANDOFF_BRIDGE_KEY);
    return parsed;
  } catch {
    return null;
  }
}

export function buildLawyerImpersonateUrl(token: string): string {
  const url = new URL(`${LAWYER_APP_URL}/impersonate`);
  url.searchParams.set("token", token);
  return url.toString();
}

/**
 * Opens the loading bridge page.
 * Session travels primarily via URL hash (`#s=`) so it survives even when
 * Super Admin is opened on localhost and the lawyer app is on production.
 * Handoff page MUST share the lawyer app origin — otherwise sessionStorage
 * written during the bridge is invisible to `/lawyer/` (cross-origin).
 * Target is always the lawyer dashboard root — never /login.
 */
export function buildImpersonationHandoffUrl(session: LawyerAuthSession): string {
  if (typeof window !== "undefined") {
    try {
      stashLawyerHandoffSession(session);
    } catch {
      /* fall through — hash backup remains */
    }
  }

  // Same origin as the lawyer SPA so sessionStorage persists after redirect.
  let handoffOrigin = SUPER_ADMIN_APP_URL;
  try {
    const lawyerOrigin = new URL(LAWYER_APP_URL).origin;
    handoffOrigin = `${lawyerOrigin}/dashboard`;
  } catch {
    handoffOrigin = SUPER_ADMIN_APP_URL;
  }

  const normalized = handoffOrigin.replace(/\/$/, "");
  const url = new URL(`${normalized}/impersonate-handoff/`);
  url.searchParams.set("next", `${LAWYER_APP_URL}/`);
  if (session.firm_name) url.searchParams.set("firm", session.firm_name);
  if (session.name) url.searchParams.set("owner", session.name);
  // Hash is the reliable carrier across localhost → production origin hops.
  url.hash = `s=${encodeSession(session)}`;
  return url.toString();
}
