"use client";

import { apiRequest, ApiError } from "./http";
import type { ApiEnvelope, LoginResponseData, AdminUser } from "./types";
import {
  ADMIN_LOGIN_ROLE,
  getAccessToken,
  getAuthUser,
  isPlatformAdminUser,
  setAuthSession,
} from "@/lib/auth-client";
import { STAFF_LOGIN_COMPANY_ID } from "./config";
import { cacheRolesPermissions, getCachedRolePermissions } from "@/lib/permissions";
import { unwrapData, unwrapList, asString } from "./helpers";

const FORCE_CHANGE_CTX_KEY = "aljudy_force_pwd_ctx";
const ADMIN_SESSION_BACKUP_KEY = "aljudy_admin_session_backup";

export const OFFICE_ACCOUNT_REJECTED_MESSAGE =
  "هذا الحساب مخصص لمكاتب المحاماة ولا يمكنه تسجيل الدخول إلى لوحة إدارة النظام. يرجى استخدام بوابة دخول المكاتب.";

/** Session-only context for forced change validation (cleared after success). */
export function setForceChangePasswordContext(currentPassword: string) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      FORCE_CHANGE_CTX_KEY,
      JSON.stringify({ currentPassword })
    );
  } catch {}
}

export function getForceChangeCurrentPassword(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(FORCE_CHANGE_CTX_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { currentPassword?: string };
    return parsed.currentPassword || null;
  } catch {
    return null;
  }
}

export function clearForceChangePasswordContext() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(FORCE_CHANGE_CTX_KEY);
  } catch {}
}

function readMustChangeFlag(user: AdminUser): boolean {
  const raw =
    user.mustChangePassword ??
    user.must_change_password ??
    user.force_password_change ??
    user.password_must_change;
  return raw === true || raw === 1 || raw === "1" || raw === "true";
}

function pickLoginData(
  response: ApiEnvelope<LoginResponseData> | LoginResponseData
): LoginResponseData {
  const envelope = response as ApiEnvelope<LoginResponseData>;
  if (envelope?.data && typeof envelope.data === "object") return envelope.data;
  return response as LoginResponseData;
}

/** Pull Sanctum/Bearer token from common Laravel login response shapes. */
function extractLoginToken(
  response: ApiEnvelope<LoginResponseData> | LoginResponseData,
  data: LoginResponseData
): string | undefined {
  const candidates: unknown[] = [
    data.token,
    data.access_token,
    data.admin_token,
    (data as { plainTextToken?: unknown }).plainTextToken,
    (data as { accessToken?: unknown }).accessToken,
    (data as { api_token?: unknown }).api_token,
    (response as LoginResponseData).token,
    (response as LoginResponseData).access_token,
    (response as LoginResponseData).admin_token,
    (response as { plainTextToken?: unknown }).plainTextToken,
  ];

  const nestedUser = (data.user || data.admin) as Record<string, unknown> | null | undefined;
  if (nestedUser) {
    candidates.push(
      nestedUser.token,
      nestedUser.access_token,
      nestedUser.api_token,
      nestedUser.plainTextToken
    );
  }

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

type StaffRosterRow = Record<string, unknown>;

function readStaffRows(payload: unknown): StaffRosterRow[] {
  return unwrapList<StaffRosterRow>(payload);
}

function normalizePermissionList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") {
        const row = item as Record<string, unknown>;
        return asString(row.name || row.slug || row.key || row.id);
      }
      return "";
    })
    .filter(Boolean);
}

async function ensureRolesCached(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const existing = localStorage.getItem("aljudy_cached_roles_perms");
    if (existing) return;
  } catch {}
  try {
    const response = await apiRequest<unknown>("/admin/roles", {
      method: "GET",
      auth: false,
    });
    const roles = unwrapList<Record<string, unknown>>(response).map((raw) => ({
      id: typeof raw.id === "string" || typeof raw.id === "number" ? raw.id : String(raw.id ?? ""),
      name: asString(raw.name),
      slug: asString(raw.slug),
      permissions: normalizePermissionList(raw.permissions),
    }));
    cacheRolesPermissions(roles);
  } catch {
    // cache stays empty; staff permissions may still come from the staff row
  }
}

export type StaffAccessProfile = {
  staffId: string;
  email: string;
  roleId: string;
  roleName: string;
  roleSlug: string;
  permissions: string[];
};

async function resolveStaffAccessByEmail(email: string): Promise<StaffAccessProfile | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;

  try {
    await ensureRolesCached();
    const response = await apiRequest<unknown>("/admin/staff", {
      method: "GET",
      auth: false,
      query: { page: 1, per_page: 100 },
    });
    const row = readStaffRows(response).find((item) => {
      const rowEmail = String(item.email || "").trim().toLowerCase();
      const suspended = String(item.status || "").toLowerCase() === "suspended";
      return rowEmail === normalized && !suspended;
    });
    if (!row) return null;

    const roleObj = (row.role as Record<string, unknown> | undefined) || {};
    const roleId = asString(roleObj.id || row.role_id);
    const roleName = asString(roleObj.name || row.role_name, "موظف");
    const roleSlug = asString(roleObj.slug || row.role_slug);
    let permissions = normalizePermissionList(roleObj.permissions || row.permissions);

    if (permissions.length === 0 && roleId) {
      const cached = getCachedRolePermissions(roleId);
      if (cached.length > 0) {
        permissions = cached;
      } else {
        try {
          const roleRes = await apiRequest<unknown>(`/admin/roles/${roleId}`, {
            method: "GET",
            auth: false,
          });
          const roleData =
            (unwrapData<Record<string, unknown>>(roleRes) || roleRes) as Record<string, unknown>;
          permissions = normalizePermissionList(roleData.permissions);
          cacheRolesPermissions([
            {
              id: roleId,
              name: asString(roleData.name, roleName),
              slug: asString(roleData.slug, roleSlug),
              permissions,
            },
          ]);
        } catch {
          // keep empty — UI will deny privileged actions
        }
      }
    }

    return {
      staffId: asString(row.id),
      email: normalized,
      roleId,
      roleName,
      roleSlug,
      permissions,
    };
  } catch {
    return null;
  }
}

function withStaffPermissions(user: AdminUser, profile: StaffAccessProfile | null): AdminUser {
  if (!profile) return user;
  return {
    ...user,
    staffId: profile.staffId,
    roleId: profile.roleId,
    role_id: profile.roleId,
    roleName: profile.roleName,
    staffRole: profile.roleName,
    roleSlug: profile.roleSlug,
    role_slug: profile.roleSlug,
    permissions: profile.permissions,
    enforceRolePermissions: true,
  };
}

/**
 * Apply an employee's role permissions to the live session so the whole
 * dashboard UI (sidebar + actions) matches that role. Backs up the admin
 * session for later restore.
 */
export function applyEmployeePermissionSession(input: {
  staffId?: string | number;
  email?: string;
  name?: string;
  roleId?: string | number;
  roleName?: string;
  roleSlug?: string;
  permissions?: string[];
}) {
  if (typeof window === "undefined") return;
  const current = getAuthUser<AdminUser>();
  const token = getAccessToken() || undefined;
  try {
    sessionStorage.setItem(
      ADMIN_SESSION_BACKUP_KEY,
      JSON.stringify({ user: current, token: token || null })
    );
  } catch {}

  const permissions = Array.isArray(input.permissions) ? input.permissions : [];
  const roleId = input.roleId !== undefined ? String(input.roleId) : "";
  const sessionUser: AdminUser = {
    ...(current || { id: input.staffId || "staff-preview", role: ADMIN_LOGIN_ROLE }),
    id: current?.id ?? input.staffId ?? "staff-preview",
    email: input.email || current?.email,
    name: input.name || current?.name,
    role: ADMIN_LOGIN_ROLE,
    company_id: null,
    userType: "admin",
    staffId: input.staffId !== undefined ? String(input.staffId) : undefined,
    roleId,
    role_id: roleId,
    roleName: input.roleName || "",
    staffRole: input.roleName || "",
    roleSlug: input.roleSlug || "",
    role_slug: input.roleSlug || "",
    permissions,
    enforceRolePermissions: true,
    isPermissionPreview: true,
  };
  setAuthSession(token, sessionUser);
  window.dispatchEvent(new Event("aljudy-auth-changed"));
}

export function restoreAdminPermissionSession() {
  if (typeof window === "undefined") return;
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_BACKUP_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as { user?: AdminUser | null; token?: string | null };
    sessionStorage.removeItem(ADMIN_SESSION_BACKUP_KEY);
    setAuthSession(parsed.token || undefined, parsed.user || undefined);
    window.dispatchEvent(new Event("aljudy-auth-changed"));
  } catch {}
}

/**
 * Super Admin login: `POST /login` with `role: "admin"`.
 * Tickets (and other guarded routes) need a Bearer token — request a Sanctum
 * personal-access token via `device_name` and persist whatever the API returns.
 */
export async function loginAdmin(identifier: string, password: string) {
  const response = await apiRequest<
    ApiEnvelope<LoginResponseData> | LoginResponseData
  >("/login", {
    method: "POST",
    auth: false,
    body: {
      login: identifier.trim(),
      password,
      role: ADMIN_LOGIN_ROLE,
      // Sanctum PAT style — many Laravel apps only mint a token when this is set.
      device_name: "aljudy-dashboard",
    },
  });

  const data = pickLoginData(response);
  const user = data.user || data.admin || null;
  if (!user) {
    throw new ApiError("تعذر قراءة بيانات المستخدم من الخادم", 500, response);
  }
  const email = String(user.email || identifier);
  const platformAdmin = isPlatformAdminUser(user);
  const isStaffCompanyLogin =
    Boolean(STAFF_LOGIN_COMPANY_ID) &&
    Number(user.company_id) === STAFF_LOGIN_COMPANY_ID;

  // Bind UI permissions from the staff row that shares this login email.
  // Platform admins without a staff row keep full access; staff logins must match.
  let staffProfile: StaffAccessProfile | null = null;
  if (platformAdmin || isStaffCompanyLogin) {
    staffProfile = await resolveStaffAccessByEmail(email);
  }
  if (!platformAdmin && (!isStaffCompanyLogin || !staffProfile)) {
    throw new ApiError(OFFICE_ACCOUNT_REJECTED_MESSAGE, 403, response);
  }

  const token = extractLoginToken(response, data);
  const mustChangePassword = readMustChangeFlag(user);
  const sessionUser: AdminUser = withStaffPermissions(
    {
      ...user,
      ...(staffProfile ? { company_id: null, company: null } : {}),
      name: user.name || (typeof user.full_name === "string" ? user.full_name : undefined),
      email,
      userType: "admin",
      mustChangePassword,
    },
    staffProfile
  );

  setAuthSession(token, sessionUser);
  if (mustChangePassword) {
    setForceChangePasswordContext(password);
  }

  return { token: token ?? null, user: sessionUser };
}
