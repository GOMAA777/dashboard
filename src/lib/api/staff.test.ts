import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchStaff,
  fetchStaffStats,
  fetchStaffById,
  createStaff,
  updateStaff,
  updateStaffStatus,
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

import { apiRequest } from "./http";

const mockApiRequest = vi.mocked(apiRequest);

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

    it("calls PUT /admin/staff/:id with update body", async () => {
      const updateData = {
        name: "راكان بن كمال",
        phone: "+966571129999",
        department_id: 6,
        role_id: 3,
        status: "active",
      };
      mockApiRequest.mockResolvedValueOnce({
        status: "success",
        message: "Staff updated",
        data: { id: 2, ...updateData },
      });
      const res = await updateStaff(2, updateData);
      expect(mockApiRequest).toHaveBeenCalledWith("/admin/staff/2", {
        method: "PUT",
        body: updateData,
      });
      expect(res).toBeDefined();
    });

    it("calls DELETE /admin/staff/:id", async () => {
      mockApiRequest.mockResolvedValueOnce({
        status: "success",
        message: "Staff deleted",
      });
      const res = await deleteStaff(2);
      expect(mockApiRequest).toHaveBeenCalledWith("/admin/staff/2", {
        method: "DELETE",
      });
      expect(res).toEqual({ status: "success", message: "Staff deleted" });
    });

    it("calls PATCH /admin/staff/:id/status", async () => {
      mockApiRequest.mockResolvedValueOnce({
        status: "success",
        message: "Status updated",
      });
      const res = await updateStaffStatus(2, "suspended");
      expect(mockApiRequest).toHaveBeenCalledWith("/admin/staff/2/status", {
        method: "PATCH",
        body: { status: "suspended" },
      });
      expect(res).toBeDefined();
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
