"use client";

import { apiRequest } from "./http";
import { unwrapData } from "./helpers";
import type { PermissionModule } from "@/features/permissions/types/roles.types";

export type CreateRoleBody = {
  name: string;
  slug: string;
  description?: string;
  permissions: string[];
};

export type UpdateRoleBody = {
  name?: string;
  slug?: string;
  description?: string;
  permissions?: string[];
};

export type ReassignRoleStaffBody = {
  target_role_id: number | string;
};

const MODULE_META: Record<
  string,
  { name: string; description: string; iconType: PermissionModule["iconType"] }
> = {
  dashboard: {
    name: "الرئيسية (لوحة التحكم)",
    description: "إحصاءات النظام وتدفق العمليات اليومية.",
    iconType: "home",
  },
  firms: {
    name: "إدارة العملاء ومكاتب المحاماة",
    description: "سجلات المكاتب والشركات المشتركة.",
    iconType: "users",
  },
  plans: {
    name: "الباقات والأسعار",
    description: "هياكل التسعير وباقات المكاتب.",
    iconType: "tag",
  },
  subscriptions: {
    name: "الاشتراكات والاتفاقيات",
    description: "الموافقة والتجديد والترقية والإلغاء.",
    iconType: "credit-card",
  },
  staff: {
    name: "طاقم العمل والمشرفون",
    description: "حسابات منسوبي المنصة وصلاحياتهم.",
    iconType: "user-check",
  },
  roles: {
    name: "الأدوار والصلاحيات",
    description: "بناء أدوار الوصول وحماية أدوار النظام.",
    iconType: "key",
  },
  departments: {
    name: "الأقسام",
    description: "هيكل الأقسام التنظيمية للمنصة.",
    iconType: "settings",
  },
  tickets: {
    name: "الدعم الفني والتذاكر",
    description: "إنشاء التذاكر والرد والتعيين والإغلاق.",
    iconType: "headphones",
  },
  finance: {
    name: "المالية والبوابات",
    description: "الفواتير وبوابات الدفع.",
    iconType: "wallet",
  },
  announcements: {
    name: "الإعلانات والتنبيهات",
    description: "إرسال وحذف الإعلانات العامة.",
    iconType: "bell",
  },
  settings: {
    name: "إعدادات النظام",
    description: "الإعدادات العامة والعملات واللغات والموقع.",
    iconType: "settings",
  },
};

const PERMISSION_LABELS_AR: Record<string, string> = {
  "dashboard.view": "عرض الرئيسية",
  "dashboard.statistics": "عرض الإحصائيات",
  "firms.view": "عرض المكاتب",
  "firms.create": "إضافة مكتب",
  "firms.edit": "تعديل مكتب",
  "firms.delete": "حذف مكتب",
  "firms.status_change": "تغيير حالة المكتب",
  "firms.notes": "إدارة ملاحظات المكتب",
  "plans.view": "عرض الباقات",
  "plans.create": "إضافة باقة",
  "plans.edit": "تعديل باقة",
  "plans.delete": "حذف باقة",
  "plans.status_change": "تفعيل وتعطيل الباقات",
  "subscriptions.view": "عرض الاشتراكات",
  "subscriptions.approve": "الموافقة على الاشتراك",
  "subscriptions.reject": "رفض الاشتراك",
  "subscriptions.renew": "تجديد الاشتراك",
  "subscriptions.upgrade": "ترقية الاشتراك",
  "subscriptions.cancel": "إلغاء الاشتراك",
  "staff.view": "عرض الموظفين",
  "staff.create": "إضافة موظف",
  "staff.edit": "تعديل موظف",
  "staff.delete": "حذف موظف",
  "staff.suspend": "إيقاف حساب موظف",
  "staff.reset_password": "إعادة تعيين كلمة المرور",
  "staff.impersonate": "الدخول كموظف",
  "roles.view": "عرض الأدوار",
  "roles.create": "إضافة دور",
  "roles.edit": "تعديل دور",
  "roles.delete": "حذف دور",
  "departments.view": "عرض الأقسام",
  "departments.create": "إضافة قسم",
  "departments.edit": "تعديل قسم",
  "departments.delete": "حذف قسم",
  "tickets.view": "عرض التذاكر",
  "tickets.create": "إنشاء تذكرة",
  "tickets.reply": "الرد على التذاكر",
  "tickets.assign": "تعيين التذاكر",
  "tickets.status_change": "تغيير حالة التذكرة",
  "tickets.close": "إغلاق التذكرة",
  "gateways.view": "عرض بوابات الدفع",
  "gateways.manage": "إدارة بوابات الدفع",
  "invoices.view": "عرض الفواتير",
  "invoices.export": "تصدير الفواتير",
  "announcements.view": "عرض الإعلانات",
  "announcements.send": "إرسال إعلان",
  "announcements.delete": "حذف إعلان",
  "settings.general": "الإعدادات العامة",
  "settings.currencies": "إدارة العملات",
  "settings.languages": "إدارة اللغات",
  "settings.system_update": "تحديث النظام",
  "settings.website_cms": "إدارة محتوى الموقع",
};

const SENSITIVE_PERMISSIONS = new Set([
  "staff.impersonate",
  "staff.delete",
  "firms.delete",
  "roles.delete",
  "settings.system_update",
]);

function humanizePermissionKey(key: string): string {
  if (PERMISSION_LABELS_AR[key]) return PERMISSION_LABELS_AR[key];
  const parts = key.split(".");
  return parts[parts.length - 1]?.replace(/_/g, " ") || key;
}

/** Convert `/admin/roles/permissions` grouped object into UI modules. */
export function mapSystemPermissionsCatalog(payload: unknown): PermissionModule[] {
  const data = unwrapData<Record<string, unknown>>(payload) || {};
  const modules: PermissionModule[] = [];

  for (const [moduleId, value] of Object.entries(data)) {
    if (!Array.isArray(value)) continue;
    const meta = MODULE_META[moduleId] || {
      name: moduleId,
      description: "",
      iconType: "settings" as const,
    };
    const permissions = value
      .map((item) => {
        if (typeof item === "string") {
          return {
            id: item,
            label: humanizePermissionKey(item),
            isSensitive: SENSITIVE_PERMISSIONS.has(item),
            sensitivityBadge: SENSITIVE_PERMISSIONS.has(item)
              ? ("مقيد أمنياً" as const)
              : undefined,
          };
        }
        if (item && typeof item === "object") {
          const row = item as Record<string, unknown>;
          const id = String(row.id || row.key || row.name || "");
          if (!id) return null;
          return {
            id,
            label: String(row.label || row.name || humanizePermissionKey(id)),
            isSensitive: Boolean(row.is_sensitive) || SENSITIVE_PERMISSIONS.has(id),
            sensitivityBadge:
              Boolean(row.is_sensitive) || SENSITIVE_PERMISSIONS.has(id)
                ? ("مقيد أمنياً" as const)
                : undefined,
          };
        }
        return null;
      })
      .filter((p): p is NonNullable<typeof p> => Boolean(p));

    if (permissions.length === 0) continue;
    modules.push({
      id: moduleId,
      name: meta.name,
      description: meta.description,
      iconType: meta.iconType,
      permissions,
    });
  }

  return modules;
}

export async function fetchRolesStats() {
  return apiRequest("/admin/roles/stats", { method: "GET" });
}

export async function fetchSystemPermissions() {
  return apiRequest("/admin/roles/permissions", { method: "GET" });
}

export async function fetchRoles() {
  return apiRequest("/admin/roles", { method: "GET" });
}

export async function createRole(body: CreateRoleBody) {
  return apiRequest("/admin/roles", { method: "POST", body });
}

export async function fetchRoleById(roleId: string | number) {
  return apiRequest(`/admin/roles/${roleId}`, { method: "GET" });
}

export async function updateRole(roleId: string | number, body: UpdateRoleBody) {
  return apiRequest(`/admin/roles/${roleId}`, { method: "PUT", body });
}

export async function reassignRoleStaff(
  roleId: string | number,
  targetRoleId: string | number
) {
  const body: ReassignRoleStaffBody = { target_role_id: targetRoleId };
  return apiRequest(`/admin/roles/${roleId}/reassign-staff`, {
    method: "POST",
    body,
  });
}

export async function deleteRole(roleId: string | number) {
  return apiRequest(`/admin/roles/${roleId}`, { method: "DELETE" });
}
