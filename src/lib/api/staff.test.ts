import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchStaff,
  fetchStaffStats,
  fetchStaffById,
  createStaff,
  updateStaff,
  updateStaffStatus,
  impersonateStaff,
  resetStaffPassword,
  deleteStaff,
} from "./staff";
import { isEmployeeAdmin, Employee } from "@/features/staff/types/staff.types";
import { editEmployeeSchema } from "@/features/staff/schemas/staff.schema";
import { mapStaffFromApi } from "./mappers";

vi.mock("./http", () => ({
  apiRequest: vi.fn(),
  ApiError: class ApiError extends Error {
    constructor(
      public status: number,
      public message: string,
      public body?: unknown
    ) {
      super(message);
    }
  },
}));

vi.mock("./config", () => ({ STAFF_LOGIN_COMPANY_ID: 146 }));

import { apiRequest } from "./http";

const mockApiRequest = vi.mocked(apiRequest);

type MockRoute = (options?: { method?: string; body?: unknown }) => unknown;

/** Routes `apiRequest` by "METHOD path" so login-user sync calls can be asserted. */
function routeApi(routes: Record<string, MockRoute>) {
  mockApiRequest.mockImplementation(async (path, options) => {
    const opts = options as { method?: string; body?: unknown } | undefined;
    const key = `${opts?.method ?? "GET"} ${path}`;
    const handler = routes[key];
    if (!handler) throw new Error(`unexpected request ${key}`);
    return handler(opts);
  });
}

const staffRow = {
  id: 2,
  name: "راكان",
  email: "rakan@aljudy.sa",
  phone: "+966571120049",
  status: "active",
};

describe("Staff API & Permissions Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("isEmployeeAdmin role identification", () => {
    it("identifies Super Admin by role name", () => {
      const admin: Employee = {
        id: "1",
        empCode: "EMP-ADMIN-01",
        name: "مشرف لوحة التحكم",
        initials: "مش",
        avatarBg: "bg-amber-100",
        avatarText: "text-amber-800",
        jobTitle: "Super Admin",
        department: "الإدارة العليا",
        email: "dashboard.admin@aljudy.sa",
        phone: "+966500000001",
        role: {
          id: "1",
          name: "Super Admin",
          category: "الإدارة العليا",
          badgeClass: "",
          iconType: "shield",
        },
        status: "active",
        lastLogin: { time: "اليوم" },
      };

      expect(isEmployeeAdmin(admin)).toBe(true);
    });

    it("identifies regular employee as non-admin", () => {
      const employee: Employee = {
        id: "2",
        empCode: "EMP-279406",
        name: "Et voluptatem iusto",
        initials: "Et",
        avatarBg: "bg-amber-100",
        avatarText: "text-amber-800",
        jobTitle: "موظف",
        department: "الإدارة العليا",
        email: "cifuquf@mailinator.com",
        phone: "+96655556456465",
        role: {
          id: "3",
          name: "موظف",
          category: "فريق العمل",
          badgeClass: "",
          iconType: "briefcase",
        },
        status: "active",
        lastLogin: { time: "اليوم" },
      };

      expect(isEmployeeAdmin(employee)).toBe(false);
    });

    it("handles null or undefined safely", () => {
      expect(isEmployeeAdmin(null)).toBe(false);
      expect(isEmployeeAdmin(undefined)).toBe(false);
    });
  });

  describe("API Client functions", () => {
    it("calls GET /admin/staff", async () => {
      mockApiRequest.mockResolvedValueOnce({ status: "success", data: [] });
      const res = await fetchStaff();
      expect(mockApiRequest).toHaveBeenCalledWith("/admin/staff", {
        method: "GET",
        query: { page: 1, per_page: 100 },
      });
      expect(res).toEqual({ status: "success", data: [] });
    });

    it("calls GET /admin/staff/stats", async () => {
      mockApiRequest.mockResolvedValueOnce({
        status: "success",
        data: { total_staff: 5, active_staff: 5, suspended_staff: 0 },
      });
      const res = await fetchStaffStats();
      expect(mockApiRequest).toHaveBeenCalledWith("/admin/staff/stats", {
        method: "GET",
      });
      expect(res).toBeDefined();
    });

    it("calls GET /admin/staff/:id", async () => {
      mockApiRequest.mockResolvedValueOnce({
        status: "success",
        data: { id: 2, name: "Emp" },
      });
      const res = await fetchStaffById(2);
      expect(mockApiRequest).toHaveBeenCalledWith("/admin/staff/2", {
        method: "GET",
      });
      expect(res).toBeDefined();
    });

    it("PUT /admin/staff/:id also updates the login user found by the old email", async () => {
      const updateData = {
        name: "راكان بن كمال",
        email: "rakan.new@aljudy.sa",
        phone: "+966571129999",
        department_id: 6,
        role_id: 3,
        status: "active",
      };
      routeApi({
        "GET /admin/staff/2": () => ({ status: true, data: staffRow }),
        "PUT /admin/staff/2": () => ({ status: true, data: { id: 2, ...updateData } }),
        "GET /users": () => ({ data: [{ id: 316, email: "rakan@aljudy.sa" }] }),
        "PUT /users/316": () => ({ status: true }),
      });

      const res = await updateStaff(2, updateData);

      expect(mockApiRequest).toHaveBeenCalledWith("/admin/staff/2", {
        method: "PUT",
        body: updateData,
      });
      expect(mockApiRequest).toHaveBeenCalledWith("/users", {
        method: "GET",
        query: { company_id: 146 },
      });
      expect(mockApiRequest).toHaveBeenCalledWith("/users/316", {
        method: "PUT",
        body: {
          company_id: 146,
          full_name: "راكان بن كمال",
          email: "rakan.new@aljudy.sa",
          phone: "+966571129999",
          status: "active",
        },
      });
      expect(res).toEqual({ status: true, data: { id: 2, ...updateData } });
    });

    it("DELETE /admin/staff/:id also deletes the login user", async () => {
      routeApi({
        "GET /admin/staff/2": () => ({ status: true, data: staffRow }),
        "DELETE /admin/staff/2": () => ({ status: "success", message: "Staff deleted" }),
        "GET /users": () => ({ data: [{ id: 316, email: "RAKAN@aljudy.sa" }] }),
        "DELETE /users/316": () => ({ status: true }),
      });

      const res = await deleteStaff(2);

      expect(mockApiRequest).toHaveBeenCalledWith("/admin/staff/2", { method: "DELETE" });
      expect(mockApiRequest).toHaveBeenCalledWith("/users/316", { method: "DELETE" });
      expect(res).toEqual({ status: "success", message: "Staff deleted" });
    });

    it("PATCH /admin/staff/:id/status suspends the login user as inactive", async () => {
      routeApi({
        "PATCH /admin/staff/2/status": () => ({ status: true, message: "Status updated" }),
        "GET /admin/staff/2": () => ({ status: true, data: staffRow }),
        "GET /users": () => ({ data: [{ id: 316, email: "rakan@aljudy.sa" }] }),
        "PUT /users/316": () => ({ status: true }),
      });

      await updateStaffStatus(2, "suspended");

      expect(mockApiRequest).toHaveBeenCalledWith("/admin/staff/2/status", {
        method: "PATCH",
        body: { status: "suspended" },
      });
      expect(mockApiRequest).toHaveBeenCalledWith("/users/316", {
        method: "PUT",
        body: { company_id: 146, email: "rakan@aljudy.sa", status: "inactive" },
      });
    });

    it("POST /admin/staff also creates an admin login user with the same password", async () => {
      const newStaffBody = {
        name: "عبدالله الشمري",
        emp_code: "EMP-999",
        email: "abdullah@aljudy.sa",
        phone: "+966500000999",
        password: "SecurePassword123",
        department_id: 1,
        role_id: 3,
        status: "active" as const,
      };
      routeApi({
        "POST /admin/staff": () => ({ status: true, data: { id: 99, ...newStaffBody } }),
        "GET /users": () => ({ data: [] }),
        "POST /users": () => ({ status: true, data: { id: 400 } }),
      });

      const res = await createStaff(newStaffBody);

      expect(mockApiRequest).toHaveBeenCalledWith("/admin/staff", {
        method: "POST",
        body: newStaffBody,
      });
      expect(mockApiRequest).toHaveBeenCalledWith("/users", {
        method: "POST",
        body: {
          company_id: 146,
          full_name: "عبدالله الشمري",
          email: "abdullah@aljudy.sa",
          phone: "+966500000999",
          password: "SecurePassword123",
          role: "admin",
          status: "active",
        },
      });
      expect(res).toBeDefined();
    });

    it("rolls back the staff row when the login user cannot be created", async () => {
      routeApi({
        "POST /admin/staff": () => ({ status: true, data: { id: 99 } }),
        "GET /users": () => ({ data: [] }),
        "POST /users": () => {
          throw new Error("The email has already been taken.");
        },
        "DELETE /admin/staff/99": () => ({ status: true }),
      });

      await expect(
        createStaff({
          name: "x",
          emp_code: "EMP-1",
          email: "taken@aljudy.sa",
          phone: "+966500000001",
          password: "Secret#2026",
          department_id: 1,
          role_id: 3,
          status: "active",
        })
      ).rejects.toBeDefined();
      expect(mockApiRequest).toHaveBeenCalledWith("/admin/staff/99", { method: "DELETE" });
    });

    it("calls POST /admin/staff/:id/impersonate", async () => {
      mockApiRequest.mockResolvedValueOnce({
        status: "success",
        data: { token: "fake-sanctum-token", staff: { id: 2, name: "Emp" } },
      });
      const res = await impersonateStaff(2);
      expect(mockApiRequest).toHaveBeenCalledWith("/admin/staff/2/impersonate", {
        method: "POST",
      });
      expect(res).toBeDefined();
    });

    it("reset-password creates the login user when an old staff row has none", async () => {
      routeApi({
        "POST /admin/staff/2/reset-password": () => ({ status: true, message: "ok" }),
        "GET /admin/staff/2": () => ({ status: true, data: staffRow }),
        "GET /users": () => ({ data: [] }),
        "POST /users": () => ({ status: true, data: { id: 401 } }),
      });

      const res = await resetStaffPassword(2, "NewTempSecret123");

      expect(mockApiRequest).toHaveBeenCalledWith("/admin/staff/2/reset-password", {
        method: "POST",
        body: { password: "NewTempSecret123" },
      });
      expect(mockApiRequest).toHaveBeenCalledWith("/users", {
        method: "POST",
        body: {
          company_id: 146,
          full_name: "راكان",
          email: "rakan@aljudy.sa",
          phone: "+966571120049",
          password: "NewTempSecret123",
          role: "admin",
          status: "active",
        },
      });
      expect(res).toEqual({ status: true, message: "ok" });
    });

    it("reset-password updates the existing login user's password", async () => {
      routeApi({
        "POST /admin/staff/2/reset-password": () => ({ status: true }),
        "GET /admin/staff/2": () => ({ status: true, data: staffRow }),
        "GET /users": () => ({ data: [{ id: 316, email: "rakan@aljudy.sa" }] }),
        "PUT /users/316": () => ({ status: true }),
      });

      await resetStaffPassword(2, "NewTempSecret123");

      expect(mockApiRequest).toHaveBeenCalledWith("/users/316", {
        method: "PUT",
        body: {
          company_id: 146,
          full_name: "راكان",
          email: "rakan@aljudy.sa",
          phone: "+966571120049",
          password: "NewTempSecret123",
          status: "active",
        },
      });
    });
  });

  describe("Mandatory 4 Test Cases (AGENTS.md Rule 6)", () => {
    it("Case 1: Success - handles successful response with data", async () => {
      const mockSuccessData = {
        status: "success",
        data: [
          {
            id: 1,
            name: "سارة المهندس",
            emp_code: "EMP-001",
            email: "sara@aljudy.sa",
            status: "active",
          },
        ],
      };
      mockApiRequest.mockResolvedValueOnce(mockSuccessData);
      const res = await fetchStaff();
      expect(res).toEqual(mockSuccessData);
    });

    it("Case 2: Validation Error (422) - rejects with validation error message and field errors", async () => {
      const validationError = new (class extends Error {
        status = 422;
        body = {
          message: "The email has already been taken.",
          errors: { email: ["The email has already been taken."] },
        };
      })("The email has already been taken.");
      mockApiRequest.mockRejectedValueOnce(validationError);

      await expect(
        createStaff({
          name: "سارة",
          email: "existing@aljudy.sa",
          phone: "+966500000000",
          password: "password123",
          department_id: 1,
          role_id: 1,
        })
      ).rejects.toThrow("The email has already been taken.");
    });

    it("Case 3: Server Error (500) - rejects cleanly when server encounters an error", async () => {
      const serverError = new (class extends Error {
        status = 500;
        body = { message: "Internal Server Error" };
      })("Internal Server Error");
      mockApiRequest.mockRejectedValueOnce(serverError);

      await expect(fetchStaffStats()).rejects.toThrow("Internal Server Error");
    });

    it("Case 4: Empty Data - handles empty staff list gracefully", async () => {
      mockApiRequest.mockResolvedValueOnce({
        status: "success",
        data: [],
      });
      const res = await fetchStaff();
      expect(res).toEqual({ status: "success", data: [] });
    });
  });

  describe("editEmployeeSchema validation", () => {
    it("accepts valid edit data without new password", () => {
      const valid = {
        name: "راكان بن كمال الحارثي",
        email: "rakan@aljudy.sa",
        phone: "571120049",
        departmentId: "6",
        roleId: "3",
        status: "active" as const,
        password: "",
      };
      const result = editEmployeeSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("accepts valid edit data with 8+ character password", () => {
      const valid = {
        name: "راكان بن كمال الحارثي",
        email: "rakan@aljudy.sa",
        phone: "571120049",
        departmentId: "6",
        roleId: "3",
        status: "active" as const,
        password: "NewSecretPassword123",
      };
      const result = editEmployeeSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects password shorter than 8 characters when entered", () => {
      const invalid = {
        name: "راكان بن كمال الحارثي",
        email: "rakan@aljudy.sa",
        phone: "571120049",
        departmentId: "6",
        roleId: "3",
        status: "active" as const,
        password: "123",
      };
      const result = editEmployeeSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("rejects invalid email address", () => {
      const invalid = {
        name: "راكان بن كمال",
        email: "not-an-email",
        phone: "571120049",
        departmentId: "6",
        roleId: "3",
        status: "active" as const,
      };
      const result = editEmployeeSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("mapStaffFromApi data mapping & null safety", () => {
    it("safely handles null last_login_at, last_login_ip, and last_login_city", () => {
      const raw = {
        id: 15,
        name: "أحمد العتيبي",
        emp_code: "EMP-015",
        email: "ahmed@aljudy.sa",
        phone: "+966500000015",
        last_login_at: null,
        last_login_ip: null,
        last_login_city: null,
        created_at: "2024-11-10T12:00:00Z",
        role: { id: 2, name: "مسؤول عمليات" },
        status: "active",
      };

      const mapped = mapStaffFromApi(raw);
      expect(mapped.id).toBe("15");
      expect(mapped.lastLogin.time).toBeNull();
      expect(mapped.lastLogin.ip).toBeNull();
      expect(mapped.lastLogin.city).toBeNull();
      expect(mapped.lastLogin.location).toBeUndefined();
      expect(mapped.createdAt).toBe("2024-11-10T12:00:00Z");
    });

    it("correctly maps valid last login timestamps, IP and City", () => {
      const raw = {
        id: 16,
        name: "سارة المهندس",
        emp_code: "EMP-016",
        email: "sara@aljudy.sa",
        phone: "+966500000016",
        last_login_at: "2024-11-11 10:30:00",
        last_login_ip: "192.168.1.100",
        last_login_city: "الرياض",
        created_at: "2024-01-15T08:00:00Z",
        permissions_count: 24,
        tickets_count: 5,
        role: { id: 3, name: "دعم فني" },
        status: "active",
      };

      const mapped = mapStaffFromApi(raw);
      expect(mapped.lastLogin.time).toBe("2024-11-11 10:30:00");
      expect(mapped.lastLogin.ip).toBe("192.168.1.100");
      expect(mapped.lastLogin.city).toBe("الرياض");
      expect(mapped.permissionsCount).toBe(24);
      expect(mapped.assignedTicketsCount).toBe(5);
    });
  });
});
