"use client";

import { BASE_PATH, withBasePath } from "@/lib/base-path";
import type { QueryClient } from "@tanstack/react-query";

let activeQueryClient: QueryClient | null = null;

export function registerQueryClient(client: QueryClient | null) {
  activeQueryClient = client;
}

export function getActiveQueryClient(): QueryClient | null {
  return activeQueryClient;
}

/** The only role this dashboard authenticates against `POST /login`. */
export const ADMIN_LOGIN_ROLE = "admin";

/**
 * Platform admin = `role: "admin"` with no company. Any account tied to a
 * company belongs to the office system and must never open this dashboard.
 */
export function isPlatformAdminUser(
  user: { role?: unknown; company_id?: unknown } | null | undefined
): boolean {
  if (!user) return false;
  const companyId = user.company_id;
  const hasCompany =
    companyId !== null && companyId !== undefined && companyId !== "" && Number(companyId) !== 0;
  return String(user.role || "").toLowerCase() === ADMIN_LOGIN_ROLE && !hasCompany;
}

const AUTH_FLAG_KEY = "aljudy_auth";
const AUTH_TOKEN_KEY = "aljudy_admin_token";
const AUTH_USER_KEY = "aljudy_admin_user";
const AUTH_FLAG_VALUE = "1";
/** Keep the browser cookie aligned with localStorage — no short weekly expiry. */
const SESSION_SECONDS = 60 * 60 * 24 * 365;

function writeCookie(name: string, value: string, maxAge: number) {
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=${BASE_PATH}; max-age=${maxAge}; SameSite=Lax${secure}`;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const parts = document.cookie.split("; ");
  for (const part of parts) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq) === name) {
      try {
        return decodeURIComponent(part.slice(eq + 1));
      } catch {
        return part.slice(eq + 1);
      }
    }
  }
  return null;
}

function hasCompanyId(user: { company_id?: unknown } | null | undefined): boolean {
  if (!user) return false;
  const companyId = user.company_id;
  return (
    companyId !== null &&
    companyId !== undefined &&
    companyId !== "" &&
    Number(companyId) !== 0
  );
}

/**
 * Valid dashboard sessions: any stored `role: "admin"` user that passed login.
 * Office roles (owner/lawyer/…) are never valid here.
 * company_id alone must not kill the session — staff login users may still
 * carry a host company id from older builds.
 */
export function isDashboardSessionUser(
  user: unknown
): boolean {
  if (!user || typeof user !== "object") return false;
  const rec = user as { role?: unknown; company_id?: unknown; userType?: unknown };
  if (rec.userType === "office") return false;
  const role = String(rec.role || "").toLowerCase().trim();
  return role === ADMIN_LOGIN_ROLE;
}

function isOfficeAccountUser(
  user: unknown
): boolean {
  if (!user || typeof user !== "object") return false;
  const rec = user as { role?: unknown; company_id?: unknown; userType?: unknown };
  if (rec.userType === "office") return true;
  const role = String(rec.role || "").toLowerCase().trim();
  if (role === ADMIN_LOGIN_ROLE) return false;
  if (role === "owner" || role === "lawyer" || role === "accountant") return true;
  return hasCompanyId(rec);
}

export function setAuthSession(token?: string, user?: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUTH_FLAG_KEY, AUTH_FLAG_VALUE);
    sessionStorage.setItem(AUTH_FLAG_KEY, AUTH_FLAG_VALUE);
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
    }
    if (user !== undefined) {
      const serialized = JSON.stringify(user);
      localStorage.setItem(AUTH_USER_KEY, serialized);
      sessionStorage.setItem(AUTH_USER_KEY, serialized);
    }
  } catch {
    // storage may be blocked
  }
  try {
    writeCookie(AUTH_FLAG_KEY, AUTH_FLAG_VALUE, SESSION_SECONDS);
    writeCookie(AUTH_TOKEN_KEY, token ?? "", token ? SESSION_SECONDS : 0);
  } catch {}
}

/** Refresh cookie/local flag lifetime while the tab stays active. */
export function touchAuthSession() {
  if (typeof window === "undefined") return;
  const user = getAuthUser();
  if (!isDashboardSessionUser(user)) return;
  setAuthSession(getAccessToken() || undefined, user);
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  try {
    if (activeQueryClient) {
      activeQueryClient.clear();
    }
  } catch {}
  try {
    localStorage.removeItem(AUTH_FLAG_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    sessionStorage.removeItem(AUTH_FLAG_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_USER_KEY);
  } catch {}
  try {
    writeCookie(AUTH_FLAG_KEY, "", 0);
    writeCookie(AUTH_TOKEN_KEY, "", 0);
  } catch {}
}

function isAuthFlag(value: string | null): boolean {
  return value === AUTH_FLAG_VALUE || value === "true";
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return (
      localStorage.getItem(AUTH_TOKEN_KEY) ||
      sessionStorage.getItem(AUTH_TOKEN_KEY) ||
      readCookie(AUTH_TOKEN_KEY)
    );
  } catch {
    return readCookie(AUTH_TOKEN_KEY);
  }
}

export function getAuthUser<T = unknown>(): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw =
      localStorage.getItem(AUTH_USER_KEY) || sessionStorage.getItem(AUTH_USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function updateAuthUser<T extends Record<string, unknown>>(patch: Partial<T>) {
  if (typeof window === "undefined") return;
  try {
    const current = getAuthUser<T>() || ({} as T);
    const updated = { ...current, ...patch };
    const serialized = JSON.stringify(updated);
    localStorage.setItem(AUTH_USER_KEY, serialized);
    sessionStorage.setItem(AUTH_USER_KEY, serialized);
  } catch {}
}

/**
 * Session is the stored dashboard user (live API often returns no token).
 * Stays valid across deploys and reloads until the user explicitly logs out.
 * Only known office leftovers are cleared — never drop a valid admin session.
 */
export function getAuthSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const user = getAuthUser<{
      role?: unknown;
      company_id?: unknown;
      userType?: unknown;
      staffId?: unknown;
      enforceRolePermissions?: unknown;
    }>();
    const flag =
      localStorage.getItem(AUTH_FLAG_KEY) ||
      sessionStorage.getItem(AUTH_FLAG_KEY) ||
      readCookie(AUTH_FLAG_KEY);

    if (isDashboardSessionUser(user)) {
      // Heal missing flag after cookie/path mismatches without forcing re-login.
      if (!isAuthFlag(flag)) {
        try {
          localStorage.setItem(AUTH_FLAG_KEY, AUTH_FLAG_VALUE);
          sessionStorage.setItem(AUTH_FLAG_KEY, AUTH_FLAG_VALUE);
          writeCookie(AUTH_FLAG_KEY, AUTH_FLAG_VALUE, SESSION_SECONDS);
        } catch {}
      }
      return true;
    }

    // Clear only clearly foreign/office sessions left by older builds.
    if (user && isOfficeAccountUser(user)) {
      clearAuthSession();
      return false;
    }

    // Auth flag alone without a recoverable user is not enough.
    if (isAuthFlag(flag) && !user && !getAccessToken()) {
      return false;
    }

    return false;
  } catch {
    return false;
  }
}

export function redirectToLogin() {
  if (typeof window === "undefined") return;
  if (window.location.pathname.includes("/login")) return;
  const target = withBasePath("/login");
  window.location.replace(target.endsWith("/") ? target : `${target}/`);
}
