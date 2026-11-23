import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginAdmin, OFFICE_ACCOUNT_REJECTED_MESSAGE } from "./auth";
import * as httpModule from "./http";
import { ApiError } from "./http";
import { getAccessToken, getAuthSession, getAuthUser } from "@/lib/auth-client";

vi.mock("./config", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./config")>()),
  STAFF_LOGIN_COMPANY_ID: 146,
}));

const liveAdminUser = {
  id: 1,
  company_id: null,
  full_name: "Super Admin",
  email: "admin@aljudy.sa",
  role: "admin",
  status: "active",
};

describe("loginAdmin", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  const emptyStaffLookup = () => [
    { status: true, data: [] },
    { status: true, data: { data: [] } },
  ];

  it("posts login/password with role admin only", async () => {
    const spy = vi
      .spyOn(httpModule, "apiRequest")
      .mockResolvedValueOnce({ status: true, data: { user: liveAdminUser } })
      .mockResolvedValueOnce(emptyStaffLookup()[0])
      .mockResolvedValueOnce(emptyStaffLookup()[1]);

    await loginAdmin("  admin@aljudy.sa ", "Secret123!");

    expect(spy).toHaveBeenCalledWith("/login", {
      method: "POST",
      auth: false,
      body: {
        login: "admin@aljudy.sa",
        password: "Secret123!",
        role: "admin",
        device_name: "aljudy-dashboard",
      },
    });
  });

  it("stores the verified user without inventing a token (live API returns none)", async () => {
    vi.spyOn(httpModule, "apiRequest")
      .mockResolvedValueOnce({
        status: true,
        message: "مرحباً بعودتك",
        data: { user: liveAdminUser },
      })
      .mockResolvedValueOnce(emptyStaffLookup()[0])
      .mockResolvedValueOnce(emptyStaffLookup()[1]);

    const result = await loginAdmin("admin@aljudy.sa", "Secret123!");

    expect(result.token).toBeNull();
    expect(getAccessToken()).toBeNull();
    expect(result.user.name).toBe("Super Admin");
    expect(getAuthSession()).toBe(true);
  });

  it("keeps a server token when one is returned", async () => {
    vi.spyOn(httpModule, "apiRequest")
      .mockResolvedValueOnce({
        status: true,
        data: { token: "real_token_123", user: liveAdminUser },
      })
      .mockResolvedValueOnce(emptyStaffLookup()[0])
      .mockResolvedValueOnce(emptyStaffLookup()[1]);

    const result = await loginAdmin("admin@aljudy.sa", "Secret123!");
    expect(result.token).toBe("real_token_123");
    expect(getAccessToken()).toBe("real_token_123");
  });

  it("applies staff role permissions for the same login email", async () => {
    vi.spyOn(httpModule, "apiRequest")
      .mockResolvedValueOnce({
        status: true,
        data: { user: liveAdminUser },
      })
      .mockResolvedValueOnce({
        status: true,
        data: [
          {
            id: 3,
            name: "موظف دعم",
            slug: "support",
            permissions: ["tickets.view", "tickets.create"],
          },
        ],
      })
      .mockResolvedValueOnce({
        status: true,
        data: {
          data: [
            {
              id: 88,
              email: "admin@aljudy.sa",
              status: "active",
              role: {
                id: 3,
                name: "موظف دعم",
                slug: "support",
                permissions: ["tickets.view", "tickets.create"],
              },
            },
          ],
        },
      });

    const result = await loginAdmin("admin@aljudy.sa", "Secret123!");
    expect(result.user.enforceRolePermissions).toBe(true);
    expect(result.user.roleName).toBe("موظف دعم");
    expect(result.user.permissions).toEqual(["tickets.view", "tickets.create"]);
  });

  it("propagates the server 401 for wrong or unregistered credentials", async () => {
    const spy = vi
      .spyOn(httpModule, "apiRequest")
      .mockRejectedValue(new ApiError("بيانات تسجيل الدخول أو نوع الحساب غير صحيح", 401));

    await expect(loginAdmin("wrong@example.com", "wrongpass")).rejects.toMatchObject({
      status: 401,
      message: "بيانات تسجيل الدخول أو نوع الحساب غير صحيح",
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(getAuthSession()).toBe(false);
  });

  it("rejects accounts tied to a company (office accounts)", async () => {
    const spy = vi.spyOn(httpModule, "apiRequest").mockResolvedValueOnce({
      status: true,
      data: { user: { ...liveAdminUser, company_id: 141, email: "office@example.com" } },
    });

    await expect(loginAdmin("office@example.com", "x")).rejects.toMatchObject({
      status: 403,
      message: OFFICE_ACCOUNT_REJECTED_MESSAGE,
    });
    expect(getAuthSession()).toBe(false);
    expect(getAuthUser()).toBeNull();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("rejects a staff-company user whose staff row is suspended or missing", async () => {
    vi.spyOn(httpModule, "apiRequest")
      .mockResolvedValueOnce({
        status: true,
        data: { user: { ...liveAdminUser, company_id: 146, email: "gone@aljudy.sa" } },
      })
      .mockResolvedValueOnce({
        status: true,
        data: [{ id: 1, name: "موظف", slug: "employee", permissions: ["tickets.view"] }],
      })
      .mockResolvedValueOnce({
        status: true,
        data: { data: [{ email: "gone@aljudy.sa", status: "suspended" }] },
      });

    await expect(loginAdmin("gone@aljudy.sa", "x")).rejects.toMatchObject({ status: 403 });
    expect(getAuthSession()).toBe(false);
  });

  it("accepts any active staff member whose login user is in the staff company", async () => {
    vi.spyOn(httpModule, "apiRequest")
      .mockResolvedValueOnce({
        status: true,
        data: {
          user: {
            ...liveAdminUser,
            id: 316,
            email: "staff.login.1795080636403@aljudy.sa",
            company_id: 146,
            full_name: "حساب اختبار طاقم العمل",
          },
        },
      })
      .mockResolvedValueOnce({
        status: true,
        data: [
          {
            id: 3,
            name: "موظف",
            slug: "employee",
            permissions: ["dashboard.view", "tickets.view"],
          },
        ],
      })
      .mockResolvedValueOnce({
        status: true,
        data: {
          data: [
            {
              email: "staff.login.1795080636403@aljudy.sa",
              status: "active",
              role: {
                id: 3,
                name: "موظف",
                slug: "employee",
                permissions: ["dashboard.view", "tickets.view"],
              },
            },
          ],
        },
      });

    const result = await loginAdmin("staff.login.1795080636403@aljudy.sa", "StaffWork#2026");

    expect(result.user.company_id).toBeNull();
    expect(result.user.userType).toBe("admin");
    expect(result.user.enforceRolePermissions).toBe(true);
    expect(result.user.roleName).toBe("موظف");
    expect(result.user.permissions).toEqual(["dashboard.view", "tickets.view"]);
    expect(getAuthSession()).toBe(true);
  });

  it("rejects non-admin roles even without a company", async () => {
    vi.spyOn(httpModule, "apiRequest").mockResolvedValueOnce({
      status: true,
      data: { user: { ...liveAdminUser, role: "owner" } },
    });

    await expect(loginAdmin("owner@example.com", "x")).rejects.toMatchObject({ status: 403 });
  });

  it("reads must_change_password from the login response", async () => {
    vi.spyOn(httpModule, "apiRequest")
      .mockResolvedValueOnce({
        status: true,
        data: { user: { ...liveAdminUser, must_change_password: true } },
      })
      .mockResolvedValueOnce(emptyStaffLookup()[0])
      .mockResolvedValueOnce(emptyStaffLookup()[1]);

    const res = await loginAdmin("admin@aljudy.sa", "Temp@1234");
    expect(res.user.mustChangePassword).toBe(true);
  });
});

describe("getAuthSession", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("clears sessions left by office logins from older builds", () => {
    localStorage.setItem("aljudy_admin_token", "firm_token_139_1");
    localStorage.setItem(
      "aljudy_admin_user",
      JSON.stringify({ id: "139", role: "owner", company_id: 139 })
    );

    expect(getAuthSession()).toBe(false);
    expect(getAccessToken()).toBeNull();
    expect(getAuthUser()).toBeNull();
  });

  it("keeps dashboard admin sessions across reloads without a token", () => {
    localStorage.setItem("aljudy_auth", "1");
    localStorage.setItem(
      "aljudy_admin_user",
      JSON.stringify({
        id: 1,
        role: "admin",
        email: "admin@aljudy.sa",
        company_id: null,
        userType: "admin",
      })
    );

    expect(getAuthSession()).toBe(true);
    expect(getAuthUser()).not.toBeNull();
  });

  it("keeps staff admin sessions even if a host company_id remains", () => {
    localStorage.setItem("aljudy_auth", "1");
    localStorage.setItem(
      "aljudy_admin_user",
      JSON.stringify({
        id: 316,
        role: "admin",
        email: "staff@aljudy.sa",
        company_id: 146,
        userType: "admin",
        enforceRolePermissions: true,
      })
    );

    expect(getAuthSession()).toBe(true);
  });
});
