import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchSubscriptionsStats,
  fetchSubscriptions,
  fetchSubscriptionById,
  applyCustomOffer,
  fetchSubscriptionLimitsBreakdown,
  removeCustomOffer,
  renewSubscription,
  upgradeSubscription,
  cancelSubscription,
  updateSubscriptionStatus,
} from "./subscriptions";

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("subscriptions API module", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetchSubscriptionsStats GETs /admin/subscriptions/stats", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        status: true,
        data: {
          total: 128,
          active: 86,
          expiring: 12,
          cancelled: 18,
        },
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const res = await fetchSubscriptionsStats();
    expect(res).toBeDefined();

    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("/admin/subscriptions/stats");
    expect(fetchMock.mock.calls[0][1]?.method).toBe("GET");
  });

  it("fetchSubscriptions includes query parameters correctly", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        status: true,
        data: [{ id: 38, subscription_code: "SUB-2026-8061", is_custom_offer: 1 }],
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const res = await fetchSubscriptions({
      tab: "active",
      page: 2,
      per_page: 15,
      search: "العجلان",
      plan: "gold",
      status: "active",
      is_custom_offer: true,
    });
    expect(res).toBeDefined();

    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("/admin/subscriptions");
    expect(url).toContain("tab=active");
    expect(url).toContain("page=2");
    expect(url).toContain("per_page=15");
    expect(url).toContain("plan=gold");
    expect(url).toContain("status=active");
    expect(url).toContain("is_custom_offer=1");
    expect(fetchMock.mock.calls[0][1]?.method).toBe("GET");
  });

  it("fetchSubscriptionById GETs /admin/subscriptions/:id", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        status: true,
        data: {
          id: 38,
          subscription_code: "SUB-2026-8061",
          company_name: "مكتب العجلان للمحاماة",
          status: "active",
        },
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const res = await fetchSubscriptionById(38);
    expect(res).toBeDefined();

    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("/admin/subscriptions/38");
    expect(fetchMock.mock.calls[0][1]?.method).toBe("GET");
  });

  it("applyCustomOffer POSTs /admin/subscriptions/{id}/custom-offer with body payload", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        status: true,
        message: "تم تطبيق العرض المخصص على الاشتراك بنجاح",
        data: { id: 38, is_custom_offer: 1, extra_lawyers: 5 },
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const payload = {
      offer_name: "عرض خاص VIP",
      extra_lawyers: 5,
      extra_storage_gb: 50,
      custom_price: 3500,
    };

    const res = await applyCustomOffer(38, payload);
    expect(res).toBeDefined();

    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("/admin/subscriptions/38/custom-offer");
    expect(fetchMock.mock.calls[0][1]?.method).toBe("POST");

    const sentBody = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    expect(sentBody.is_custom_offer).toBe(1);
    expect(sentBody.extra_lawyers).toBe(5);
    expect(sentBody.offer_name).toBe("عرض خاص VIP");
  });

  it("fetchSubscriptionLimitsBreakdown GETs /admin/subscriptions/{id}/limits-breakdown", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        status: true,
        data: {
          subscription_id: 38,
          base_lawyers: 10,
          extra_lawyers: 5,
          total_effective_lawyers: 15,
          used_lawyers: 4,
        },
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const res = await fetchSubscriptionLimitsBreakdown(38);
    expect(res).toBeDefined();

    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("/admin/subscriptions/38/limits-breakdown");
    expect(fetchMock.mock.calls[0][1]?.method).toBe("GET");
  });

  it("removeCustomOffer DELETEs /admin/subscriptions/{id}/custom-offer", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        status: true,
        message: "تم إلغاء العرض المخصص والعودة للباقة القياسية",
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const res = await removeCustomOffer(38);
    expect(res).toBeDefined();

    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("/admin/subscriptions/38/custom-offer");
    expect(fetchMock.mock.calls[0][1]?.method).toBe("DELETE");
  });

  it("renewSubscription POSTs /admin/subscriptions/:id/renew with period & payment_method", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        status: true,
        message: "تم تجديد الاشتراك بنجاح",
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const res = await renewSubscription(38, { period: "year", payment_method: "bank_transfer" });
    expect(res).toBeDefined();

    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("/admin/subscriptions/38/renew");
    expect(fetchMock.mock.calls[0][1]?.method).toBe("POST");

    const sentBody = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    expect(sentBody.period).toBe("year");
    expect(sentBody.payment_method).toBe("bank_transfer");
  });

  it("upgradeSubscription POSTs /admin/subscriptions/:id/upgrade", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        status: true,
        message: "تمت ترقية الاشتراك بنجاح",
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const res = await upgradeSubscription(38, { new_plan_id: 3, billing_cycle: "yearly" });
    expect(res).toBeDefined();

    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("/admin/subscriptions/38/upgrade");
    expect(fetchMock.mock.calls[0][1]?.method).toBe("POST");

    const sentBody = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    expect(sentBody.new_plan_id).toBe(3);
    expect(sentBody.billing_cycle).toBe("yearly");
  });

  it("cancelSubscription POSTs /admin/subscriptions/:id/cancel with reason", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        status: true,
        message: "تم إلغاء الاشتراك بنجاح",
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const res = await cancelSubscription(38, "طلب العميل التوقف عن الخدمة");
    expect(res).toBeDefined();

    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("/admin/subscriptions/38/cancel");
    expect(fetchMock.mock.calls[0][1]?.method).toBe("POST");

    const sentBody = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    expect(sentBody.reason).toBe("طلب العميل التوقف عن الخدمة");
  });

  it("updateSubscriptionStatus PATCHes /admin/subscriptions/:id/status", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        status: true,
        message: "تم تحديث حالة الاشتراك بنجاح",
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const res = await updateSubscriptionStatus(38, "suspended");
    expect(res).toBeDefined();

    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("/admin/subscriptions/38/status");
    expect(fetchMock.mock.calls[0][1]?.method).toBe("PATCH");

    const sentBody = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    expect(sentBody.status).toBe("suspended");
  });

  it("handles 422 validation errors with ApiError body", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(
        {
          status: false,
          message: "بيانات غير صالحة",
          errors: { reason: ["سبب الإلغاء مطلوب."] },
        },
        422
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(cancelSubscription(38, "")).rejects.toThrow();
  });

  it("handles 500 server error", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(
        {
          status: false,
          message: "خطأ داخلي في الخادم",
        },
        500
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchSubscriptionById(999)).rejects.toThrow();
  });

  it("handles empty data gracefully", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        status: true,
        data: [],
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const res = await fetchSubscriptions({ tab: "all" });
    expect(res.data).toEqual([]);
  });
});
