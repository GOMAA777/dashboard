"use client";

import { apiRequest } from "./http";
import type { ApiEnvelope, LoginResponseData, AdminUser } from "./types";
import { setAuthSession } from "@/lib/auth-client";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function pickToken(source: unknown): string | null {
  const obj = asRecord(source);
  if (!obj) return null;
  const direct =
    obj.token || obj.access_token || obj.admin_token || obj.bearer_token;
  if (typeof direct === "string" && direct.trim()) return direct.trim();

  const nested = asRecord(obj.data);
  if (!nested) return null;
  const nestedToken =
    nested.token || nested.access_token || nested.admin_token || nested.bearer_token;
  return typeof nestedToken === "string" && nestedToken.trim()
    ? nestedToken.trim()
    : null;
}

function pickUser(source: unknown): AdminUser | null {
  const obj = asRecord(source);
  if (!obj) return null;
  if (obj.user && typeof obj.user === "object") return obj.user as AdminUser;
  if (obj.admin && typeof obj.admin === "object") return obj.admin as AdminUser;
  const nested = asRecord(obj.data);
  if (!nested) return null;
  if (nested.user && typeof nested.user === "object") return nested.user as AdminUser;
  if (nested.admin && typeof nested.admin === "object") return nested.admin as AdminUser;
  return null;
}

/**
 * Live API login (verified): POST /login
 * Body: { login, password, role } — Super Admin uses role "admin".
 * Collection documents Bearer {{admin_token}} for subsequent /admin/* calls.
 */
export async function loginAdmin(identifier: string, password: string) {
  const response = await apiRequest<
    ApiEnvelope<LoginResponseData> | LoginResponseData
  >("/login", {
    method: "POST",
    auth: false,
    body: {
      login: identifier,
      password,
      role: "admin",
    },
  });

  const token = pickToken(response);
  if (!token) {
    throw new Error("Login succeeded but no access token was returned");
  }

  const user = pickUser(response);
  setAuthSession(token, user);

  return {
    token,
    user,
    raw: response,
  };
}
