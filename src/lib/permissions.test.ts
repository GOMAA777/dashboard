import { describe, it, expect, beforeEach } from "vitest";
import {
  PERMISSIONS,
  hasPermission,
  canAccessRoute,
  isSuperAdminRole,
  hasFullPlatformAccess,
  cacheRolesPermissions,
  getCachedRolePermissions,
} from "./permissions";
import type { AdminUser } from "./api/types";

describe("Permissions System & Route Guard", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Super Admin Bypass", () => {
    it("recognizes all variations of Super Admin / Owner role", () => {
      expect(isSuperAdminRole("admin")).toBe(true);
      expect(isSuperAdminRole("Admin")).toBe(true);
      expect(isSuperAdminRole("Super Admin")).toBe(true);
      expect(isSuperAdminRole("super_admin")).toBe(true);
      expect(isSuperAdminRole("owner")).toBe(true);
      expect(isSuperAdminRole("مشرف عام")).toBe(true);
      expect(isSuperAdminRole("مشرف نظام")).toBe(true);
      expect(isSuperAdminRole("super-admin")).toBe(true);
    });

    it("rejects non-admin roles", () => {
      expect(isSuperAdminRole("موظف")).toBe(false);
      expect(isSuperAdminRole("محامي")).toBe(false);
      expect(isSuperAdminRole("accountant")).toBe(false);
      expect(isSuperAdminRole("staff")).toBe(false);
      expect(isSuperAdminRole("الإدارة العليا")).toBe(false);
      expect(isSuperAdminRole(undefined)).toBe(false);
      expect(isSuperAdminRole(null)).toBe(false);
    });

    it("gives Super Admin universal permission for any action", () => {
      const superAdminUser: AdminUser = {
        id: "1",
        name: "Admin",
        email: "admin@aljudy.sa",
        role: "Super Admin",
      };

      expect(hasPermission(PERMISSIONS.CLIENTS_DELETE, superAdminUser)).toBe(true);
      expect(hasPermission(PERMISSIONS.STAFF_DELETE, superAdminUser)).toBe(true);
      expect(hasPermission(PERMISSIONS.ROLES_CREATE, superAdminUser)).toBe(true);
      expect(hasPermission("custom.future.permission", superAdminUser)).toBe(true);
    });

    it("allows Super Admin to access any route", () => {
      const superAdminUser: AdminUser = {
        id: "1",
        name: "Admin",
        email: "admin@aljudy.sa",
        role: "Super Admin",
      };

      expect(canAccessRoute("/", superAdminUser)).toBe(true);
      expect(canAccessRoute("/accounts", superAdminUser)).toBe(true);
      expect(canAccessRoute("/staff", superAdminUser)).toBe(true);
      expect(canAccessRoute("/roles", superAdminUser)).toBe(true);
      expect(canAccessRoute("/plans", superAdminUser)).toBe(true);
      expect(canAccessRoute("/subscriptions", superAdminUser)).toBe(true);
    });
  });

  describe("Role-Based Permissions & Aliases", () => {
    it("matches direct user permissions and wildcards", () => {
      const limitedUser: AdminUser = {
        id: "2",
        name: "Employee",
        email: "emp@aljudy.sa",
        role: "admin",
        roleId: "3",
        roleName: "موظف",
        roleSlug: "employee",
        enforceRolePermissions: true,
        permissions: ["staff.view", "clients.view"],
      };

      expect(hasFullPlatformAccess(limitedUser)).toBe(false);
      expect(hasPermission("staff.view", limitedUser)).toBe(true);
      expect(hasPermission("clients.view", limitedUser)).toBe(true);
      expect(hasPermission("staff.delete", limitedUser)).toBe(false);
      expect(hasPermission("roles.delete", limitedUser)).toBe(false);
      expect(hasPermission("plans.create", limitedUser)).toBe(false);
    });

    it("does not grant full access to login role=admin when staff role is limited", () => {
      const staffLogin: AdminUser = {
        id: "9",
        name: "Staff Preview",
        email: "staff@aljudy.sa",
        role: "admin",
        roleId: 3,
        roleName: "موظف",
        roleSlug: "employee",
        enforceRolePermissions: true,
        permissions: ["dashboard.view", "tickets.view"],
      };
      expect(isSuperAdminRole(staffLogin.role)).toBe(true);
      expect(hasFullPlatformAccess(staffLogin)).toBe(false);
      expect(hasPermission("tickets.view", staffLogin)).toBe(true);
      expect(hasPermission("staff.create", staffLogin)).toBe(false);
      expect(canAccessRoute("/tickets", staffLogin)).toBe(true);
      expect(canAccessRoute("/plans", staffLogin)).toBe(false);
    });

    it("matches permission aliases (e.g. firms.* covers clients.*)", () => {
      const userWithFirmsAlias: AdminUser = {
        id: "3",
        name: "Clerk",
        email: "clerk@aljudy.sa",
        role: "موظف مبيعات",
        permissions: ["firms.view", "firms.create"],
      };

      expect(hasPermission("clients.view", userWithFirmsAlias)).toBe(true);
      expect(hasPermission("clients.create", userWithFirmsAlias)).toBe(true);
      expect(hasPermission("clients.delete", userWithFirmsAlias)).toBe(false);
    });

    it("reads permissions from cached roles", () => {
      cacheRolesPermissions([
        {
          id: 5,
          name: "محامي استشارات",
          permissions: ["clients.view", "tickets.view", "tickets.create"],
        },
      ]);

      const userWithRoleId: AdminUser = {
        id: "4",
        name: "Lawyer",
        email: "lawyer@aljudy.sa",
        role: "محامي استشارات",
        roleId: 5,
      };

      expect(hasPermission("clients.view", userWithRoleId)).toBe(true);
      expect(hasPermission("tickets.create", userWithRoleId)).toBe(true);
      expect(hasPermission("staff.create", userWithRoleId)).toBe(false);
      expect(hasPermission("roles.view", userWithRoleId)).toBe(false);
    });
  });

  describe("Route Guard (canAccessRoute)", () => {
    it("blocks access to unauthorized routes for limited users", () => {
      const staffOnlyUser: AdminUser = {
        id: "5",
        name: "HR Specialist",
        email: "hr@aljudy.sa",
        role: "أخصائي موارد بشرية",
        permissions: ["staff.view", "staff.create"],
      };

      // Can access staff
      expect(canAccessRoute("/staff", staffOnlyUser)).toBe(true);
      expect(canAccessRoute("/permissions", staffOnlyUser, new URLSearchParams("tab=staff"))).toBe(true);

      // Blocked from roles
      expect(canAccessRoute("/roles", staffOnlyUser)).toBe(false);
      expect(canAccessRoute("/permissions", staffOnlyUser, new URLSearchParams("tab=roles"))).toBe(false);

      // Blocked from clients/accounts
      expect(canAccessRoute("/accounts", staffOnlyUser)).toBe(false);

      // Blocked from plans & subscriptions
      expect(canAccessRoute("/plans", staffOnlyUser)).toBe(false);
      expect(canAccessRoute("/subscriptions", staffOnlyUser)).toBe(false);
    });

    it("allows universal routes for any logged-in user", () => {
      const limitedUser: AdminUser = {
        id: "6",
        name: "Limited",
        email: "limited@aljudy.sa",
        role: "موظف",
        permissions: [],
      };

      expect(canAccessRoute("/login", limitedUser)).toBe(true);
      expect(canAccessRoute("/change-password", limitedUser)).toBe(true);
      expect(canAccessRoute("/unauthorized", limitedUser)).toBe(true);
      expect(canAccessRoute("/profile", limitedUser)).toBe(true);
    });
  });
});
