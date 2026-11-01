"use client";

import { BASE_PATH } from "@/lib/base-path";

const AUTH_FLAG_KEY = "aljudy_auth";
const AUTH_TOKEN_KEY = "aljudy_admin_token";
const AUTH_USER_KEY = "aljudy_admin_user";
const AUTH_FLAG_VALUE = "1";
const WEEK_SECONDS = 604800;

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

export function setAuthSession(token?: string, user?: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUTH_FLAG_KEY, AUTH_FLAG_VALUE);
    sessionStorage.setItem(AUTH_FLAG_KEY, AUTH_FLAG_VALUE);
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    }
    if (user !== undefined) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    }
  } catch {
    // storage may be blocked
  }
  try {
    writeCookie(AUTH_FLAG_KEY, AUTH_FLAG_VALUE, WEEK_SECONDS);
    if (token) writeCookie(AUTH_TOKEN_KEY, token, WEEK_SECONDS);
  } catch {}
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
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
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function getAuthSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (getAccessToken()) return true;
    if (isAuthFlag(localStorage.getItem(AUTH_FLAG_KEY))) return true;
    if (isAuthFlag(sessionStorage.getItem(AUTH_FLAG_KEY))) return true;
  } catch {}
  try {
    return isAuthFlag(readCookie(AUTH_FLAG_KEY));
  } catch {
    return false;
  }
}
