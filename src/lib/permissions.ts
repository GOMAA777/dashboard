"use client";

import { useState, useEffect, useCallback } from "react";
import { getAuthUser } from "@/lib/auth-client";
import type { AdminUser } from "@/lib/api/types";

/** Canonical permission keys from GET /admin/roles/permissions */
export const PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard.view",
  DASHBOARD_STATISTICS: "dashboard.statistics",

  FIRMS_VIEW: "firms.view",
  FIRMS_CREATE: "firms.create",
  FIRMS_EDIT: "firms.edit",
  FIRMS_DELETE: "firms.delete",
  FIRMS_STATUS_CHANGE: "firms.status_change",
  FIRMS_NOTES: "firms.notes",

  // Legacy aliases kept for existing UI calls
  CLIENTS_VIEW: "clients.view",
  CLIENTS_CREATE: "clients.create",
  CLIENTS_EDIT: "clients.edit",
  CLIENTS_DELETE: "clients.delete",
  CLIENTS_IMPERSONATE: "clients.impersonate",
  CLIENTS_IMPERSONATE_BYPASS_REASON: "clients.impersonate_bypass_reason",

  PLANS_VIEW: "plans.view",
  PLANS_CREATE: "plans.create",
  PLANS_EDIT: "plans.edit",
  PLANS_DELETE: "plans.delete",
  PLANS_STATUS_CHANGE: "plans.status_change",

  SUBSCRIPTIONS_VIEW: "subscriptions.view",
  SUBSCRIPTIONS_APPROVE: "subscriptions.approve",
  SUBSCRIPTIONS_REJECT: "subscriptions.reject",
  SUBSCRIPTIONS_RENEW: "subscriptions.renew",
  SUBSCRIPTIONS_UPGRADE: "subscriptions.upgrade",
  SUBSCRIPTIONS_CANCEL: "subscriptions.cancel",

  STAFF_VIEW: "staff.view",
  STAFF_CREATE: "staff.create",
  STAFF_EDIT: "staff.edit",
  STAFF_DELETE: "staff.delete",
  STAFF_SUSPEND: "staff.suspend",
  STAFF_RESET_PASSWORD: "staff.reset_password",
  STAFF_IMPERSONATE: "staff.impersonate",

  ROLES_VIEW: "roles.view",
  ROLES_CREATE: "roles.create",
  ROLES_EDIT: "roles.edit",
  ROLES_DELETE: "roles.delete",

  DEPARTMENTS_VIEW: "departments.view",
  DEPARTMENTS_CREATE: "departments.create",
  DEPARTMENTS_EDIT: "departments.edit",
  DEPARTMENTS_DELETE: "departments.delete",

  TICKETS_VIEW: "tickets.view",
  TICKETS_CREATE: "tickets.create",
  TICKETS_REPLY: "tickets.reply",
  TICKETS_ASSIGN: "tickets.assign",
  TICKETS_STATUS_CHANGE: "tickets.status_change",
  TICKETS_CLOSE: "tickets.close",

  GATEWAYS_VIEW: "gateways.view",
  GATEWAYS_MANAGE: "gateways.manage",
  INVOICES_VIEW: "invoices.view",
  INVOICES_EXPORT: "invoices.export",

  ANNOUNCEMENTS_VIEW: "announcements.view",
  ANNOUNCEMENTS_SEND: "announcements.send",
  ANNOUNCEMENTS_DELETE: "announcements.delete",

  SETTINGS_GENERAL: "settings.general",
  SETTINGS_CURRENCIES: "settings.currencies",
  SETTINGS_LANGUAGES: "settings.languages",
  SETTINGS_SYSTEM_UPDATE: "settings.system_update",
  SETTINGS_WEBSITE_CMS: "settings.website_cms",
} as const;

/**
 * Map UI/legacy permission checks → accepted API keys on the user/role.
 * First match wins in hasPermission().
 */
const PERMISSION_ALIASES: Record<string, string[]> = {
  "dashboard.view": ["dashboard.view", "dashboard.*"],
  "dashboard.statistics": ["dashboard.statistics", "dashboard.analytics", "dashboard.*"],
  "dashboard.analytics": ["dashboard.statistics", "dashboard.analytics", "dashboard.*"],

  "clients.view": ["firms.view", "clients.view", "firms.*", "clients.*"],
  "clients.create": ["firms.create", "clients.create", "firms.*", "clients.*"],
  "clients.edit": ["firms.edit", "firms.status_change", "firms.notes", "clients.edit", "firms.*", "clients.*"],
  "clients.delete": ["firms.delete", "clients.delete", "firms.*", "clients.*"],
  "clients.impersonate": ["utility.impersonate", "firms.impersonate", "clients.impersonate"],
  "clients.impersonate_bypass_reason": [
    "clients.impersonate_bypass_reason",
    "firms.impersonate_bypass_reason",
    "utility.impersonate_bypass_reason",
    "clients.*",
    "firms.*",
  ],

  "firms.view": ["firms.view", "clients.view", "firms.*"],
  "firms.create": ["firms.create", "clients.create", "firms.*"],
  "firms.edit": ["firms.edit", "clients.edit", "firms.*"],
  "firms.delete": ["firms.delete", "clients.delete", "firms.*"],
  "firms.status_change": ["firms.status_change", "firms.edit", "firms.*"],
  "firms.notes": ["firms.notes", "firms.edit", "firms.*"],

  "plans.view": ["plans.view", "plans.*"],
  "plans.create": ["plans.create", "plans.*"],
  "plans.edit": ["plans.edit", "plans.*"],
  "plans.delete": ["plans.delete", "plans.*"],
  "plans.status_change": ["plans.status_change", "plans.edit", "plans.*"],

  "subscriptions.view": ["subscriptions.view", "subscriptions.*"],
  "subscriptions.approve": ["subscriptions.approve", "subscriptions.*"],
  "subscriptions.reject": ["subscriptions.reject", "subscriptions.*"],
  "subscriptions.renew": ["subscriptions.renew", "subscriptions.*"],
  "subscriptions.upgrade": ["subscriptions.upgrade", "subscriptions.*"],
  "subscriptions.cancel": ["subscriptions.cancel", "subscriptions.*"],
  "subscriptions.create": ["subscriptions.approve", "subscriptions.create", "subscriptions.*"],
  "subscriptions.edit": [
    "subscriptions.approve",
    "subscriptions.renew",
    "subscriptions.upgrade",
    "subscriptions.edit",
    "subscriptions.*",
  ],

  "staff.view": ["staff.view", "staff.*"],
  "staff.create": ["staff.create", "staff.*"],
  "staff.edit": ["staff.edit", "staff.suspend", "staff.reset_password", "staff.*"],
  "staff.delete": ["staff.delete", "staff.*"],
  "staff.suspend": ["staff.suspend", "staff.edit", "staff.*"],
  "staff.reset_password": ["staff.reset_password", "staff.edit", "staff.*"],
  "staff.impersonate": ["staff.impersonate", "staff.*"],

  "roles.view": ["roles.view", "roles.*"],
  "roles.create": ["roles.create", "roles.*"],
  "roles.edit": ["roles.edit", "roles.*"],
  "roles.delete": ["roles.delete", "roles.*"],

  "departments.view": ["departments.view", "departments.*", "tickets.view"],
  "departments.create": ["departments.create", "departments.*"],
  "departments.edit": ["departments.edit", "departments.*"],
  "departments.delete": ["departments.delete", "departments.*"],

  "tickets.view": ["tickets.view", "tickets.*"],
  "tickets.create": ["tickets.create", "tickets.*"],
  "tickets.edit": ["tickets.reply", "tickets.status_change", "tickets.edit", "tickets.*"],
  "tickets.reply": ["tickets.reply", "tickets.*"],
  "tickets.assign": ["tickets.assign", "tickets.*"],
  "tickets.status_change": ["tickets.status_change", "tickets.*"],
  "tickets.close": ["tickets.close", "tickets.*"],

  "gateways.view": ["gateways.view", "payments.methods.view", "gateways.*", "payments.*"],
  "gateways.manage": ["gateways.manage", "gateways.*", "payments.*"],
  "payments.methods.view": ["gateways.view", "payments.methods.view", "gateways.*", "payments.*"],

  "invoices.view": ["invoices.view", "finance.view", "finance.*"],
  "invoices.export": ["invoices.export", "invoices.view", "finance.*"],

  "announcements.view": ["announcements.view", "notifications.view", "announcements.*", "notifications.*"],
  "announcements.send": ["announcements.send", "notifications.create", "announcements.*", "notifications.*"],
  "announcements.delete": ["announcements.delete", "announcements.*", "notifications.*"],
  "notifications.view": ["announcements.view", "notifications.view", "announcements.*", "notifications.*"],
  "notifications.create": ["announcements.send", "notifications.create", "announcements.*", "notifications.*"],

  "settings.general": ["settings.general", "system.settings.view", "settings.*", "system.*"],
  "settings.currencies": ["settings.currencies", "settings.*", "system.*"],
  "settings.languages": ["settings.languages", "settings.*", "system.*"],
  "settings.system_update": ["settings.system_update", "settings.*", "system.*"],
  "settings.website_cms": ["settings.website_cms", "settings.*", "system.*"],
  "system.settings.view": [
    "settings.general",
    "settings.currencies",
    "settings.languages",
    "settings.system_update",
    "settings.website_cms",
    "system.settings.view",
    "settings.*",
    "system.*",
  ],
};

export function isSuperAdminRole(role?: string | null): boolean {
  if (!role) return false;
  const clean = role.toLowerCase().trim();
  return (
    clean === "admin" ||
    clean === "super admin" ||
    clean === "super_admin" ||
    clean === "super-admin" ||
    clean === "owner" ||
    role.includes("مشرف عام") ||
    role.includes("مشرف نظام")
  );
}

function isStaffSuperAdminRole(user: AdminUser): boolean {
  const slug = String(user.roleSlug || user.role_slug || "").toLowerCase().trim();
  const name = String(user.roleName || user.staffRole || "").toLowerCase().trim();
  const roleId = String(user.roleId ?? user.role_id ?? "");
  return (
    slug === "super-admin" ||
    slug === "super_admin" ||
    name === "super admin" ||
    (roleId === "1" && (name.includes("super") || slug.includes("super")))
  );
}

/**
 * Full UI bypass only for the true platform owner, or a staff member whose
 * assigned job role is Super Admin. Limited staff roles must never inherit
 * access just because `POST /login` used `role: "admin"`.
 */
export function hasFullPlatformAccess(user?: AdminUser | null): boolean {
  if (!user) return false;
  if (user.enforceRolePermissions === true) {
    return isStaffSuperAdminRole(user);
  }
  const hasStaffRoleBinding =
    user.roleId !== undefined &&
    user.roleId !== null &&
    String(user.roleId) !== "";
  if (hasStaffRoleBinding || Array.isArray(user.permissions)) {
    return isStaffSuperAdminRole(user);
  }
  return isSuperAdminRole(user.role);
}

const ROLES_CACHE_KEY = "aljudy_cached_roles_perms";

export function cacheRolesPermissions(
  roles: Array<{ id?: string | number; name?: string; slug?: string; permissions?: string[] }>
) {
  if (typeof window === "undefined" || !Array.isArray(roles)) return;
  try {
    const map: Record<string, string[]> = {};
    for (const r of roles) {
      const perms = Array.isArray(r.permissions) ? r.permissions : [];
      if (r.id !== undefined) map[String(r.id)] = perms;
      if (r.name) map[r.name.trim().toLowerCase()] = perms;
      if (r.slug) map[String(r.slug).trim().toLowerCase()] = perms;
    }
    localStorage.setItem(ROLES_CACHE_KEY, JSON.stringify(map));
  } catch {
    // ignore storage failures
  }
}

export function getCachedRolePermissions(roleIdOrName?: string | number): string[] {
  if (typeof window === "undefined" || roleIdOrName === undefined || roleIdOrName === null) return [];
  try {
    const raw = localStorage.getItem(ROLES_CACHE_KEY);
    if (!raw) return [];
    const map: Record<string, string[]> = JSON.parse(raw);
    const key = String(roleIdOrName).trim().toLowerCase();
    return map[key] || map[String(roleIdOrName)] || [];
  } catch {
    return [];
  }
}

export function getUserPermissions(user?: AdminUser | null): string[] {
  if (!user) return [];
  if (hasFullPlatformAccess(user)) return ["*"];

  if (Array.isArray(user.permissions)) {
    return user.permissions as string[];
  }

  const roleId = user.roleId ?? user.role_id;
  if (roleId !== undefined && roleId !== null) {
    const cached = getCachedRolePermissions(String(roleId));
    if (cached.length > 0) return cached;
  }
  if (user.roleName || user.staffRole) {
    const cached = getCachedRolePermissions(String(user.roleName || user.staffRole));
    if (cached.length > 0) return cached;
  }
  if (user.roleSlug) {
    const cached = getCachedRolePermissions(String(user.roleSlug));
    if (cached.length > 0) return cached;
  }

  return [];
}

function matchesWildcard(userPerm: string, required: string): boolean {
  if (!userPerm.endsWith(".*")) return false;
  const prefix = userPerm.slice(0, -1); // keep trailing dot semantics: "firms."
  return required.startsWith(prefix) || required === userPerm.slice(0, -2);
}

export function hasPermission(required: string, user?: AdminUser | null): boolean {
  if (!user) return false;
  if (hasFullPlatformAccess(user)) return true;

  const userPerms = getUserPermissions(user);
  if (userPerms.includes("*")) return true;
  if (userPerms.includes(required)) return true;

  for (const p of userPerms) {
    if (matchesWildcard(p, required)) return true;
  }

  const aliases = PERMISSION_ALIASES[required] || [required];
  for (const alias of aliases) {
    if (userPerms.includes(alias)) return true;
    for (const p of userPerms) {
      if (matchesWildcard(p, alias)) return true;
    }
  }

  for (const p of userPerms) {
    const mapped = PERMISSION_ALIASES[p];
    if (mapped?.includes(required)) return true;
  }

  return false;
}

export function canBypassOfficeEntryReason(user?: AdminUser | null): boolean {
  if (!user) return false;
  if (hasFullPlatformAccess(user)) return true;
  return hasPermission("clients.impersonate_bypass_reason", user);
}

export function canAccessRoute(
  pathname: string,
  user?: AdminUser | null,
  searchParams?: URLSearchParams | null
): boolean {
  if (!user) return false;
  if (hasFullPlatformAccess(user)) return true;

  const path = pathname.toLowerCase();
  if (
    path.includes("/login") ||
    path.includes("/change-password") ||
    path.includes("/unauthorized") ||
    path.includes("/profile")
  ) {
    return true;
  }

  if (path === "/" || path === "/dashboard" || path === "") {
    return hasPermission("dashboard.view", user);
  }

  if (path.startsWith("/accounts") || path.startsWith("/law-firms")) {
    return hasPermission("firms.view", user) || hasPermission("clients.view", user);
  }

  if (path.startsWith("/permissions")) {
    const tab = searchParams?.get("tab");
    if (tab === "staff") return hasPermission("staff.view", user);
    if (tab === "roles") return hasPermission("roles.view", user);
    return hasPermission("staff.view", user) || hasPermission("roles.view", user);
  }
  if (path.startsWith("/staff")) return hasPermission("staff.view", user);
  if (path.startsWith("/roles")) return hasPermission("roles.view", user);

  if (path.startsWith("/plans")) return hasPermission("plans.view", user);
  if (path.startsWith("/subscriptions")) return hasPermission("subscriptions.view", user);
  if (path.startsWith("/invoices")) return hasPermission("invoices.view", user);
  if (path.startsWith("/payment-gateways")) {
    return hasPermission("gateways.view", user) || hasPermission("payments.methods.view", user);
  }

  if (path.startsWith("/tickets")) {
    const tab = searchParams?.get("tab");
    if (tab === "departments") {
      return (
        hasPermission("departments.view", user) || hasPermission("tickets.view", user)
      );
    }
    return hasPermission("tickets.view", user);
  }

  if (path.startsWith("/notifications")) {
    return hasPermission("announcements.view", user) || hasPermission("notifications.view", user);
  }

  if (path.startsWith("/impersonation-logs")) {
    return hasPermission("clients.impersonate", user) || hasPermission("staff.impersonate", user);
  }

  if (path.startsWith("/drafts")) {
    return (
      hasPermission("firms.create", user) ||
      hasPermission("clients.create", user) ||
      hasPermission("staff.create", user) ||
      hasPermission("roles.create", user) ||
      hasPermission("plans.create", user) ||
      hasPermission("tickets.create", user) ||
      hasPermission("announcements.send", user)
    );
  }

  if (path.startsWith("/website-settings") || path.startsWith("/seo")) {
    return hasPermission("settings.website_cms", user) || hasPermission("system.settings.view", user);
  }
  if (path.startsWith("/utility")) {
    return hasPermission("settings.system_update", user) || hasPermission("system.settings.view", user);
  }
  if (path.startsWith("/settings")) {
    return hasPermission("settings.general", user) || hasPermission("system.settings.view", user);
  }

  return false;
}

export function usePermissions() {
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const sync = () => {
      setUser(getAuthUser<AdminUser>());
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    window.addEventListener("aljudy-auth-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
      window.removeEventListener("aljudy-auth-changed", sync);
    };
  }, []);

  const checkPerm = useCallback((perm: string) => hasPermission(perm, user), [user]);

  const checkRoute = useCallback(
    (path: string, params?: URLSearchParams | null) => canAccessRoute(path, user, params),
    [user]
  );

  const isSuperAdmin = hasFullPlatformAccess(user);
  const permissions = getUserPermissions(user);

  return {
    user,
    hasPermission: checkPerm,
    canAccessRoute: checkRoute,
    canBypassOfficeEntryReason: useCallback(() => canBypassOfficeEntryReason(user), [user]),
    isSuperAdmin,
    permissions,
  };
}
