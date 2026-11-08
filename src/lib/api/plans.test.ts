import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchPlansStats,
  fetchPlans,
  createPlan,
  fetchPlanById,
  updatePlan,
  updatePlanStatus,
  fetchPlanSubscribers,
  deletePlan,
  getLocalCustomPlans,
  saveLocalCustomPlan,
  removeLocalCustomPlan,
} from "./plans";
import { ApiError } from "./http";

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("Plans & Pricing API Module (03. Plans & Pricing)", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  // 01. GET /admin/plans/stats
  describe("01. fetchPlansStats", () => {
    it("successfully fetches plans stats and MRR", async () => {
      const mockPayload = {
        status: true,
        data: {
          total_plans: 6,
          active_plans: 5,
          subscribed_firms: 184,
          mrr: 125400,
          growth_percentage: 14.2,
        },
      };
      const fetchMock = vi.fn().mockResolvedValue(jsonResponse(mockPayload));
      vi.stubGlobal("fetch", fetchMock);

      const res = await fetchPlansStats();
      expect(res).toEqual(mockPayload);
      const url = String(fetchMock.mock.calls[0][0]);
      expect(url).toContain("/admin/plans/stats");
      expect(fetchMock.mock.calls[0][1]?.method).toBe("GET");
    });

    it("throws error when server fails with 500", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          jsonResponse({ message: "Internal Server Error" }, 500)
        )
      );

      await expect(fetchPlansStats()).rejects.toThrow();
    });
  });

  // 02. GET /admin/plans
  describe("02. fetchPlans", () => {
    it("successfully fetches list of plans", async () => {
      const mockList = {
        status: true,
        data: [
          {
            id: 1,
            name: "الباقة الفضية",
            monthly_price: 399,
            yearly_price: 3990,
            status: "active",
            max_lawyers: 5,
          },
          {
            id: 2,
            name: "الباقة الذهبية",
            monthly_price: 799,
            yearly_price: 7990,
            status: "active",
            max_lawyers: 15,
          },
        ],
      };
      const fetchMock = vi.fn().mockResolvedValue(jsonResponse(mockList));
      vi.stubGlobal("fetch", fetchMock);

      const res = await fetchPlans();
      expect(res).toEqual(mockList);
      const url = String(fetchMock.mock.calls[0][0]);
      expect(url).toContain("/admin/plans");
      expect(fetchMock.mock.calls[0][1]?.method).toBe("GET");
    });

    it("handles empty plans data successfully", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(jsonResponse({ status: true, data: [] }))
      );

      const res = await fetchPlans();
      expect(res).toEqual({ status: true, data: [] });
    });

    it("throws ApiError on 401 unauthorized", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          jsonResponse({ message: "Unauthenticated." }, 401)
        )
      );

      await expect(fetchPlans()).rejects.toThrow("Unauthenticated.");
    });
  });

  // 03. POST /admin/plans
  describe("03. createPlan", () => {
    it("successfully creates a new subscription plan", async () => {
      const newPlanPayload = {
        name: "باقة النخبة القانونية",
        description: "باقة مخصصة لمكاتب المحاماة الكبرى",
        type: "paid",
        monthly_price: 1200,
        yearly_price: 12000,
        yearly_discount_percent: 15,
        max_lawyers: 25,
        max_cases: 1000,
        status: "active",
      };
      const createdResponse = {
        status: true,
        data: {
          id: 42,
          ...newPlanPayload,
        },
      };
      const fetchMock = vi.fn().mockResolvedValue(jsonResponse(createdResponse, 201));
      vi.stubGlobal("fetch", fetchMock);

      const res = await createPlan(newPlanPayload);
      expect(res).toEqual(createdResponse);
      const [url, init] = fetchMock.mock.calls[0];
      expect(String(url)).toContain("/admin/plans");
      expect(init?.method).toBe("POST");
      expect(JSON.parse(String(init?.body))).toMatchObject({
        name: "باقة النخبة القانونية",
        monthly_price: 1200,
      });
    });

    it("handles 422 validation errors with field errors", async () => {
      const validationError = {
        message: "The given data was invalid.",
        errors: {
          name: ["اسم الباقة مستخدم مسبقاً."],
          monthly_price: ["السعر الشهري مطلوب."],
        },
      };
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(jsonResponse(validationError, 422))
      );

      try {
        await createPlan({ name: "" });
        expect.fail("Should have thrown ApiError");
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).status).toBe(422);
        expect((err as ApiError).body).toEqual(validationError);
      }
    });
  });

  // 04. GET /admin/plans/{{plan_id}}
  describe("04. fetchPlanById", () => {
    it("successfully fetches plan details by id", async () => {
      const planDetail = {
        status: true,
        data: {
          id: 5,
          name: "باقة الشركات المتقدمة",
          monthly_price: 999,
          yearly_price: 9990,
          max_lawyers: 20,
          storage_limit_gb: 50,
          status: "active",
        },
      };
      const fetchMock = vi.fn().mockResolvedValue(jsonResponse(planDetail));
      vi.stubGlobal("fetch", fetchMock);

      const res = await fetchPlanById(5);
      expect(res).toEqual(planDetail);
      expect(String(fetchMock.mock.calls[0][0])).toContain("/admin/plans/5");
      expect(fetchMock.mock.calls[0][1]?.method).toBe("GET");
    });

    it("handles 404 not found when plan does not exist", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          jsonResponse({ message: "الباقة غير موجودة" }, 404)
        )
      );

      try {
        await fetchPlanById("non-existent");
        expect.fail("Should have thrown ApiError");
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).status).toBe(404);
      }
    });
  });

  // 05. PUT /admin/plans/{{plan_id}}
  describe("05. updatePlan", () => {
    it("successfully updates plan pricing and data", async () => {
      const updatePayload = {
        monthly_price: 450,
        yearly_price: 4500,
        storage_limit_gb: 30,
      };
      const updatedResponse = {
        status: true,
        data: {
          id: 5,
          name: "باقة الشركات المتقدمة",
          ...updatePayload,
        },
      };
      const fetchMock = vi.fn().mockResolvedValue(jsonResponse(updatedResponse));
      vi.stubGlobal("fetch", fetchMock);

      const res = await updatePlan(5, updatePayload);
      expect(res).toEqual(updatedResponse);
      const [url, init] = fetchMock.mock.calls[0];
      expect(String(url)).toContain("/admin/plans/5");
      expect(init?.method).toBe("PUT");
      expect(JSON.parse(String(init?.body))).toMatchObject({
        monthly_price: 450,
      });
    });

    it("handles 422 validation error during update", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          jsonResponse(
            {
              message: "بيانات غير صالحة",
              errors: { monthly_price: ["يجب أن يكون السعر رقماً موجباً."] },
            },
            422
          )
        )
      );

      await expect(updatePlan(5, { monthly_price: -100 })).rejects.toThrow();
    });
  });

  // 06. PATCH /admin/plans/{{plan_id}}/status
  describe("06. updatePlanStatus", () => {
    it("successfully toggles plan status to active or disabled", async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        jsonResponse({ status: true, message: "تم تغيير حالة الباقة بنجاح" })
      );
      vi.stubGlobal("fetch", fetchMock);

      const res = await updatePlanStatus(7, "disabled");
      expect(res).toBeDefined();
      const [url, init] = fetchMock.mock.calls[0];
      expect(String(url)).toContain("/admin/plans/7/status");
      expect(init?.method).toBe("PATCH");
      expect(JSON.parse(String(init?.body))).toEqual({ status: "disabled" });
    });

    it("throws error on server failure", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          jsonResponse({ message: "تعذر تحديث الحالة" }, 500)
        )
      );

      await expect(updatePlanStatus(7, "active")).rejects.toThrow();
    });
  });

  // 07. GET /admin/plans/{{plan_id}}/subscribers
  describe("07. fetchPlanSubscribers", () => {
    it("successfully retrieves firms subscribed to the plan", async () => {
      const subscribersResponse = {
        status: true,
        data: [
          {
            id: 101,
            name: "مكتب المحامي خالد الدوسري",
            license_number: "441029",
            city: "الرياض",
            active_subscription: {
              status: "active",
              billing_cycle: "yearly",
              start_date: "2025-01-15",
              renewal_date: "2026-01-15",
            },
          },
        ],
      };
      const fetchMock = vi.fn().mockResolvedValue(jsonResponse(subscribersResponse));
      vi.stubGlobal("fetch", fetchMock);

      const res = await fetchPlanSubscribers(2);
      expect(res).toEqual(subscribersResponse);
      expect(String(fetchMock.mock.calls[0][0])).toContain("/admin/plans/2/subscribers");
      expect(fetchMock.mock.calls[0][1]?.method).toBe("GET");
    });

    it("returns empty array when plan has no subscribers", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(jsonResponse({ status: true, data: [] }))
      );

      const res = await fetchPlanSubscribers(999);
      expect(res).toEqual({ status: true, data: [] });
    });
  });

  // 08. DELETE /admin/plans/{{plan_id}}
  describe("08. deletePlan", () => {
    it("successfully deletes plan with 0 subscribers", async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        jsonResponse({ status: true, message: "تم حذف الباقة بنجاح" })
      );
      vi.stubGlobal("fetch", fetchMock);

      const res = await deletePlan(8);
      expect(res).toBeDefined();
      expect(String(fetchMock.mock.calls[0][0])).toContain("/admin/plans/8");
      expect(fetchMock.mock.calls[0][1]?.method).toBe("DELETE");
    });

    it("rejects deletion with 400/409 when active subscribers exist", async () => {
      const errorResponse = {
        status: false,
        message: "لا يمكن حذف هذه الباقة لوجود مكاتب مشتركة فيها حالياً.",
      };
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(jsonResponse(errorResponse, 400))
      );

      try {
        await deletePlan(2);
        expect.fail("Should have thrown ApiError");
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).status).toBe(400);
        expect((err as ApiError).message).toContain("لا يمكن حذف هذه الباقة");
      }
    });
  });

  // Local Custom Plans helpers
  describe("Local Custom Plans Storage", () => {
    it("saves and retrieves custom plans locally", () => {
      const plan = {
        id: "custom-1",
        name: "باقة مخصصة",
        code: "CUSTOM-01",
        description: "وصف",
        type: "paid" as const,
        monthlyPrice: 500,
        subscribedFirmsCount: 0,
        sharePercentage: "0%",
        isActive: true,
        limits: {
          lawyers: "5",
          cases: "100",
          agents: "2",
          clients: "50",
          storage: "10 GB",
          support: "standard",
        },
      };

      saveLocalCustomPlan(plan);
      const retrieved = getLocalCustomPlans();
      expect(retrieved).toHaveLength(1);
      expect(retrieved[0].name).toBe("باقة مخصصة");

      removeLocalCustomPlan("custom-1");
      expect(getLocalCustomPlans()).toHaveLength(0);
    });
  });
});
