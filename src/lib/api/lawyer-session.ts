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
  if (!session.token || session.token.startsWith("bypass-")) return session;

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

function sanitizeSessionForStorage(session: LawyerAuthSession): LawyerAuthSession {
  const clone = { ...session };
  if (clone.logo_url && clone.logo_url.startsWith("data:") && clone.logo_url.length > 500) {
    delete clone.logo_url;
  }
  if (clone.raw) {
    try {
      if (JSON.stringify(clone.raw).length > 2000) {
        delete clone.raw;
      }
    } catch {
      delete clone.raw;
    }
  }
  return clone;
}

function safeSetStorageItem(storage: Storage, key: string, value: string): boolean {
  try {
    storage.setItem(key, value);
    return true;
  } catch {
    try {
      storage.removeItem(LAWYER_HANDOFF_BRIDGE_KEY);
      storage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }
}

/** Write the exact session object the lawyer AuthProvider hydrates via Ac()/lc(). */
export function persistLawyerSession(session: LawyerAuthSession) {
  if (typeof window === "undefined") return;
  const sanitized = sanitizeSessionForStorage(session);
  // Lawyer `jc` stores the user object WITH token/company_id/permissions flattened.
  const payload: LawyerAuthSession = {
    ...sanitized,
    token: sanitized.token,
    company_id:
      sanitized.company_id == null ? null : Number(sanitized.company_id) || sanitized.company_id,
    permissions: sanitized.permissions || { all: true },
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
    safeSetStorageItem(sessionStorage, LAWYER_AUTH_SESSION_KEY, json);
  } catch {
    /* private mode / quota */
  }
  try {
    safeSetStorageItem(localStorage, LAWYER_AUTH_SESSION_KEY, json);
    safeSetStorageItem(localStorage, LAWYER_AUTH_USER_KEY, userJson);
    safeSetStorageItem(localStorage, "token", payload.token);
    safeSetStorageItem(localStorage, "access_token", payload.token);
  } catch {
    /* ignore */
  }
}

export function stashLawyerHandoffSession(session: LawyerAuthSession) {
  if (typeof window === "undefined") return;
  const sanitized = sanitizeSessionForStorage(session);
  const json = JSON.stringify(sanitized);
  const userJson = JSON.stringify({
    id: sanitized.id,
    user: {
      id: sanitized.id,
      name: sanitized.name,
      email: sanitized.email,
      role: sanitized.role,
      company_id: sanitized.company_id,
    },
  });

  try {
    safeSetStorageItem(sessionStorage, LAWYER_AUTH_SESSION_KEY, json);
    safeSetStorageItem(sessionStorage, LAWYER_AUTH_USER_KEY, userJson);
    if (sanitized.token) {
      safeSetStorageItem(sessionStorage, "token", sanitized.token);
      safeSetStorageItem(sessionStorage, "access_token", sanitized.token);
    }
  } catch {
    /* ignore */
  }

  try {
    safeSetStorageItem(localStorage, LAWYER_HANDOFF_BRIDGE_KEY, json);
    safeSetStorageItem(localStorage, LAWYER_AUTH_SESSION_KEY, json);
    safeSetStorageItem(localStorage, LAWYER_AUTH_USER_KEY, userJson);
    if (sanitized.token) {
      safeSetStorageItem(localStorage, "token", sanitized.token);
      safeSetStorageItem(localStorage, "access_token", sanitized.token);
    }
  } catch {
    /* ignore quota */
  }
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
 * Builds the initial loading URL to open in a new tab immediately on user click,
 * preventing any white flash or about:blank state while async auth completes.
 */
export function buildInitialHandoffUrl(params: {
  firm_name?: string;
  name?: string;
  id?: string | number;
}): string {
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
  url.searchParams.set("pending", "1");
  if (params.firm_name) url.searchParams.set("firm", params.firm_name);
  if (params.name) url.searchParams.set("owner", params.name);
  return url.toString();
}

/**
 * Generates the unified, single loading design HTML (Image 1).
 * Matches the live luxury theme: dark #140d09 background, Super Admin shield emblem,
 * target firm card, connecting beam, 3-step checklist, and NO manual "الانتقال المباشر" button.
 */
export function buildHandoffHtml(params: {
  firm_name?: string;
  name?: string;
  id?: string | number;
  nextUrl?: string;
}): string {
  const safeFirm = (params.firm_name || "مكتب المحاماة")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const safeOwner = (params.name || "المستشار / المحامي المسؤول")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const firmInitial = safeFirm.trim().charAt(0) || "م";
  const safeNextUrl = (params.nextUrl || `${LAWYER_APP_URL}/`)
    .replace(/"/g, "&quot;");

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl" style="background-color: #140d09 !important; color-scheme: dark;">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="dark" />
    <meta name="theme-color" content="#140d09" />
    <title>بوابة الربط والتحويل الإشرافي المباشر | منصة الجودي</title>
    <style>
      html, body {
        background-color: #140d09 !important;
        background: #140d09 !important;
        color-scheme: dark;
        color: #fdfbf7;
        margin: 0;
        padding: 0;
      }
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #140d09;
        color: #fdfbf7;
        font-family: 'Cairo', system-ui, -apple-system, 'Segoe UI', Tahoma, sans-serif;
        padding: 16px;
        position: relative;
        overflow-x: hidden;
        user-select: none;
      }
      .ambient-glow {
        position: absolute;
        width: 450px;
        height: 450px;
        background: rgba(156, 100, 2, 0.12);
        border-radius: 999px;
        filter: blur(120px);
        top: 20%;
        left: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
      }
      .wrapper {
        width: 100%;
        max-width: 620px;
        position: relative;
        z-index: 10;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .top-brand {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 4px;
      }
      .brand-title {
        font-size: 14px;
        font-weight: 700;
        color: #fdfbf7;
      }
      .brand-sub {
        font-size: 11px;
        color: #a89f91;
      }
      .security-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        border-radius: 999px;
        background: rgba(27, 115, 64, 0.15);
        border: 1px solid rgba(27, 115, 64, 0.3);
        color: #6ee7b7;
        font-size: 11px;
        font-weight: 600;
      }
      .ping-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
        box-shadow: 0 0 8px #10b981;
      }
      .card {
        background: #1c130d;
        border: 1px solid #38271c;
        border-radius: 16px;
        padding: 28px 24px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        gap: 24px;
        position: relative;
      }
      .card-glow-bar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, #9c6402, transparent);
      }
      .bridge-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 4px 0;
      }
      .node-card {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 16px 12px;
        border-radius: 12px;
        background: rgba(38, 25, 17, 0.85);
        border: 1px solid #422e20;
      }
      .node-card.target {
        border-color: rgba(156, 100, 2, 0.45);
      }
      .node-icon-wrap {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        background: linear-gradient(135deg, #9c6402, #603b00);
        padding: 2px;
        margin-bottom: 10px;
        box-shadow: 0 0 15px rgba(156, 100, 2, 0.35);
      }
      .node-icon-inner {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #1c130d;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #e29d38;
        font-weight: 800;
        font-size: 17px;
      }
      .node-title {
        font-size: 13px;
        font-weight: 700;
        color: #fdfbf7;
        margin-bottom: 2px;
      }
      .node-desc {
        font-size: 11px;
        color: #a89f91;
      }
      .node-tag {
        margin-top: 8px;
        font-size: 10px;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 999px;
      }
      .tag-green {
        background: rgba(27, 115, 64, 0.2);
        color: #6ee7b7;
        border: 1px solid rgba(27, 115, 64, 0.4);
      }
      .tag-amber {
        background: rgba(156, 100, 2, 0.2);
        color: #e29d38;
        border: 1px solid rgba(156, 100, 2, 0.4);
      }
      .bridge-center {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 110px;
        position: relative;
      }
      .bridge-circle {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #38271c;
        border: 1px solid #9c6402;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #e29d38;
        box-shadow: 0 0 18px rgba(156, 100, 2, 0.5);
        z-index: 2;
      }
      .bridge-line {
        width: 100%;
        height: 3px;
        background: #38271c;
        margin-top: -18px;
        position: relative;
        overflow: hidden;
        border-radius: 999px;
      }
      .bridge-beam {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 40px;
        background: linear-gradient(270deg, transparent, #e29d38, transparent);
        animation: beamFlow 1.4s infinite linear;
      }
      @keyframes beamFlow {
        from { transform: translateX(110px); }
        to { transform: translateX(-110px); }
      }
      .bridge-label {
        font-size: 10px;
        font-weight: 600;
        color: #e29d38;
        margin-top: 10px;
        white-space: nowrap;
      }
      .progress-area {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .progress-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
      }
      .progress-status {
        color: #cdc5bd;
        font-weight: 600;
      }
      .progress-pct {
        font-family: monospace;
        font-weight: 700;
        color: #e29d38;
      }
      .progress-track {
        height: 8px;
        width: 100%;
        background: #261911;
        border: 1px solid #38271c;
        border-radius: 999px;
        overflow: hidden;
        padding: 1px;
      }
      .progress-bar {
        height: 100%;
        background: linear-gradient(270deg, #e29d38, #9c6402);
        border-radius: 999px;
        width: 25%;
        transition: width 0.4s ease-out;
        box-shadow: 0 0 10px rgba(226, 157, 56, 0.5);
      }
      .steps-box {
        background: rgba(22, 14, 10, 0.9);
        border: 1px solid #2d1e15;
        border-radius: 10px;
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .step-item {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 12px;
      }
      .step-icon {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 700;
        flex-shrink: 0;
      }
      .step-done {
        background: rgba(27, 115, 64, 0.2);
        color: #6ee7b7;
        border: 1px solid rgba(27, 115, 64, 0.5);
      }
      .step-pending {
        background: #261911;
        color: #a89f91;
        border: 1px solid #38271c;
      }
      .step-active {
        background: rgba(156, 100, 2, 0.2);
        color: #e29d38;
        border: 1px solid rgba(156, 100, 2, 0.5);
      }
      .actions-row {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 12px;
        border-top: 1px solid #38271c;
        padding-top: 14px;
      }
      .btn-cancel {
        padding: 8px 16px;
        border-radius: 6px;
        background: transparent;
        border: 1px solid #38271c;
        color: #a89f91;
        font-family: inherit;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .btn-cancel:hover {
        color: #fdfbf7;
        background: #261911;
        border-color: #553b2a;
      }
      .footer-note {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-size: 11px;
        color: #8e8680;
        text-align: center;
      }
    </style>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet" media="print" onload="this.media='all'" />
    <noscript>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet" />
    </noscript>
  </head>
  <body>
    <div class="ambient-glow"></div>
    <div class="wrapper">
      <div class="top-brand">
        <div>
          <div class="brand-title">منظومة الجودي الرقمية للمحاماة</div>
          <div class="brand-sub">بوابة الربط والتحويل الإشرافي المباشر</div>
        </div>
        <div class="security-badge">
          <span class="ping-dot"></span>
          <span>جلسة إشراف مشفرة ومؤمنة</span>
        </div>
      </div>

      <div class="card">
        <div class="card-glow-bar"></div>

        <div class="bridge-container">
          <!-- Super Admin -->
          <div class="node-card">
            <div class="node-icon-wrap" style="background: linear-gradient(135deg, #991b1b, #7f1d1d);">
              <div class="node-icon-inner">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" fill="#991b1b"/>
                  <path d="M12 4.18l6 2.25v4.66c0 4.09-2.6 7.9-6 8.91-3.4-1.01-6-4.82-6-8.91V6.43l6-2.25z" fill="#b91c1c"/>
                  <path d="M12 7l3 3-1.2 1.2L12 9.4l-1.8 1.8L9 10l3-3z" fill="#ffffff"/>
                </svg>
              </div>
            </div>
            <div class="node-title">لوحة الإدارة المركزية</div>
            <div class="node-desc">المشرف العام (Super Admin)</div>
            <span class="node-tag tag-green">مفوّض ومعتمد</span>
          </div>

          <!-- Connecting Beam -->
          <div class="bridge-center">
            <div class="bridge-circle">⇄</div>
            <div class="bridge-line">
              <div class="bridge-beam"></div>
            </div>
            <div class="bridge-label">ربط إشرافي مباشر</div>
          </div>

          <!-- Target Firm -->
          <div class="node-card target">
            <div class="node-icon-wrap" style="background: linear-gradient(135deg, #e29d38, #9c6402);">
              <div class="node-icon-inner" id="firmInitial">${firmInitial}</div>
            </div>
            <div class="node-title" id="firmName">${safeFirm}</div>
            <div class="node-desc" id="firmOwner">${safeOwner}</div>
            <span class="node-tag tag-amber" id="targetBadge">جاري فتح الجلسة...</span>
          </div>
        </div>

        <div class="progress-area">
          <div class="progress-header">
            <span class="progress-status" id="statusText">جاري التحقق من هوية المشرف واعتماد الجلسة...</span>
            <span class="progress-pct" id="pctText">25%</span>
          </div>
          <div class="progress-track">
            <div class="progress-bar" id="progressBar" style="width: 25%;"></div>
          </div>
        </div>

        <div class="steps-box">
          <div class="step-item">
            <div class="step-icon step-done">✓</div>
            <span>التحقق من تصريح المشرف العام وصلاحيات الدخول الإشرافي</span>
          </div>
          <div class="step-item" id="step2Item">
            <div class="step-icon step-pending" id="step2Icon">•</div>
            <span id="step2Text" style="color: #a89f91;">إنشاء توكن أمني مشفر وحفظ جلسة العمل القانونية للمكتب</span>
          </div>
          <div class="step-item" id="step3Item">
            <div class="step-icon step-pending" id="step3Icon">•</div>
            <span id="step3Text" style="color: #a89f91;">نقل التوجيه إلى واجهة المحامي بدون طلب كلمة مرور</span>
          </div>
        </div>

        <div class="actions-row">
          <button type="button" class="btn-cancel" onclick="handleCancel()">إلغاء والعودة</button>
        </div>
      </div>

      <div class="footer-note">
        🔒 هذه الجلسة مسجلة وموثقة في سجلات الإشراف (Audit Logs) بدقة للحفاظ على سرية البيانات.
      </div>
    </div>

    <script>
      (function () {
        var SESSION_KEY = "doussary_auth_session";
        var USER_KEY = "doussary_auth";
        var BRIDGE_KEY = "__aljudy_impersonation_bridge";
        var defaultNext = "${safeNextUrl}";
        var targetUrl = defaultNext.charAt(defaultNext.length - 1) === "/" ? defaultNext : defaultNext + "/";
        var activated = false;
        var redirected = false;

        var firmNameEl = document.getElementById("firmName");
        var firmOwnerEl = document.getElementById("firmOwner");
        var firmInitialEl = document.getElementById("firmInitial");
        var progressBar = document.getElementById("progressBar");
        var pctText = document.getElementById("pctText");
        var statusText = document.getElementById("statusText");
        var step2Icon = document.getElementById("step2Icon");
        var step2Text = document.getElementById("step2Text");
        var step3Icon = document.getElementById("step3Icon");
        var step3Text = document.getElementById("step3Text");

        function persist(session) {
          if (!session || !session.token) return;
          var payload = Object.assign({}, session, {
            token: session.token,
            permissions: session.permissions || { all: true },
            company_id: session.company_id == null ? null : session.company_id,
          });
          var json = JSON.stringify(payload);
          var userJson = JSON.stringify({
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
          try { sessionStorage.setItem(SESSION_KEY, json); } catch (e) {}
          try {
            localStorage.setItem(SESSION_KEY, json);
            localStorage.setItem(USER_KEY, userJson);
            localStorage.setItem("token", payload.token);
            localStorage.setItem("access_token", payload.token);
          } catch (e) {}
        }

        function goToOffice(session, destination) {
          if (redirected) return;
          redirected = true;
          persist(session);
          var finalTarget = destination || targetUrl;
          if (!finalTarget || finalTarget.indexOf("/login") !== -1) {
            finalTarget = "https://law.elmoroj.com/lawyer/";
          }
          finalTarget = finalTarget.charAt(finalTarget.length - 1) === "/" ? finalTarget : finalTarget + "/";
          try { window.location.replace(finalTarget); } catch (e) { window.location.href = finalTarget; }
        }

        function activate(session, destination) {
          if (activated || !session || !session.token) return;
          activated = true;
          persist(session);

          var firm = session.firm_name || "${safeFirm}";
          var owner = session.name || "${safeOwner}";
          if (firmNameEl) firmNameEl.textContent = firm;
          if (firmOwnerEl) firmOwnerEl.textContent = owner;
          if (firmInitialEl) firmInitialEl.textContent = firm.trim().charAt(0) || "م";

          setTimeout(function () {
            if (progressBar) progressBar.style.width = "50%";
            if (pctText) pctText.textContent = "50%";
            if (statusText) statusText.textContent = "جاري توليد مفتاح المصادقة ومطابقة صلاحيات الإدارة...";
            if (step2Icon) {
              step2Icon.className = "step-icon step-done";
              step2Icon.textContent = "✓";
            }
            if (step2Text) {
              step2Text.style.color = "#fdfbf7";
              step2Text.style.fontWeight = "600";
            }
          }, 300);

          setTimeout(function () {
            if (progressBar) progressBar.style.width = "85%";
            if (pctText) pctText.textContent = "85%";
            if (statusText) statusText.textContent = "اكتمل الربط! جاري فتح لوحة تحكم المكتب الآن...";
            if (step3Icon) {
              step3Icon.className = "step-icon step-active";
              step3Icon.textContent = "⏳";
            }
            if (step3Text) {
              step3Text.style.color = "#e29d38";
              step3Text.style.fontWeight = "700";
            }
            persist(session);
          }, 700);

          setTimeout(function () {
            if (progressBar) progressBar.style.width = "100%";
            if (pctText) pctText.textContent = "100%";
          }, 1100);

          setTimeout(function () {
            goToOffice(session, destination);
          }, 1400);
        }

        window.__activateHandoff = activate;

        window.addEventListener("message", function (e) {
          if (!e || !e.data) return;
          if (e.data.type === "ALJUDY_IMPERSONATION_SESSION" && e.data.session) {
            activate(e.data.session, e.data.targetUrl);
          } else if (e.data.type === "ALJUDY_IMPERSONATION_ERROR") {
            if (statusText) {
              statusText.textContent = e.data.message || "تعذر إكمال عملية الدخول";
              statusText.style.color = "#f87171";
            }
          }
        });

        try {
          var bridgeRaw = localStorage.getItem(BRIDGE_KEY);
          if (bridgeRaw) {
            var bSession = JSON.parse(bridgeRaw);
            if (bSession && bSession.token) {
              activate(bSession);
            }
          }
        } catch (e) {}

        window.handleCancel = function () {
          try { window.close(); } catch (e) { window.history.back(); }
        };
      })();
    </script>
  </body>
</html>`;
}

/**
 * Opens the handoff loading tab synchronously upon user click directly on the
 * official same-origin handoff URL.
 * Strictly uses the SINGLE unified loading design (Image 1):
 * - URL is https://law.elmoroj.com/dashboard/impersonate-handoff/ (NEVER about:blank).
 * - Writing sessionStorage on this same origin ensures the lawyer SPA at /lawyer/
 *   retains doussary_auth_session and enters the office dashboard immediately without
 *   ever redirecting to the login page.
 * - ZERO white flash, ZERO second template mismatch.
 */
export function openInstantHandoffTab(params: {
  firm_name?: string;
  name?: string;
  id?: string | number;
}): {
  tab: Window | null;
  commit: (handoffUrl: string) => void;
  abort: (errorMessage?: string) => void;
} {
  if (typeof window === "undefined") {
    return { tab: null, commit: () => {}, abort: () => {} };
  }

  const initialUrl = buildInitialHandoffUrl(params);
  let tab: Window | null = null;

  try {
    tab = window.open(initialUrl, "_blank");
  } catch {
    tab = null;
  }

  return {
    tab,
    commit: (handoffUrl: string) => {
      let session: LawyerAuthSession | null = null;
      try {
        const hashIndex = handoffUrl.indexOf("#s=");
        if (hashIndex !== -1) {
          const raw = handoffUrl.slice(hashIndex + 3);
          session = decodeSessionParam(raw);
        }
        if (!session) {
          session = consumeLawyerHandoffBridge();
        }
      } catch {}

      if (tab && !tab.closed) {
        // 1. PostMessage to tab on same-origin
        try {
          tab.postMessage(
            {
              type: "ALJUDY_IMPERSONATION_SESSION",
              session,
              targetUrl: `${LAWYER_APP_URL}/`,
              handoffUrl,
            },
            "*"
          );
        } catch {}

        // 2. Direct in-memory activation if available
        try {
          const anyTab = tab as unknown as {
            __activateHandoff?: (s: LawyerAuthSession | null, target?: string) => void;
          };
          if (typeof anyTab.__activateHandoff === "function" && session) {
            anyTab.__activateHandoff(session, `${LAWYER_APP_URL}/`);
            return;
          }
        } catch {}

        // 3. Navigate/update hash with session data
        try {
          tab.location.replace(handoffUrl);
        } catch {
          try {
            tab.location.href = handoffUrl;
          } catch {
            window.open(handoffUrl, "_blank", "noopener,noreferrer");
          }
        }
      } else {
        window.open(handoffUrl, "_blank", "noopener,noreferrer");
      }
    },
    abort: (errorMessage?: string) => {
      if (tab && !tab.closed) {
        try {
          tab.postMessage(
            {
              type: "ALJUDY_IMPERSONATION_ERROR",
              message: errorMessage || "تعذر إكمال عملية الدخول",
            },
            "*"
          );
          setTimeout(() => {
            try {
              tab?.close();
            } catch {}
          }, 1800);
        } catch {
          try {
            tab.close();
          } catch {}
        }
      }
    },
  };
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
  const sanitized = sanitizeSessionForStorage(session);
  if (typeof window !== "undefined") {
    try {
      stashLawyerHandoffSession(sanitized);
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
  url.searchParams.set("pending", "1");
  if (sanitized.firm_name) url.searchParams.set("firm", sanitized.firm_name);
  if (sanitized.name) url.searchParams.set("owner", sanitized.name);
  // Hash is the reliable carrier across localhost → production origin hops.
  url.hash = `s=${encodeSession(sanitized)}`;
  return url.toString();
}
