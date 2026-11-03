import { afterEach, describe, expect, it, vi } from "vitest";
import {
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

  it("fetchSubscriptions includes is_custom_offer in query string when specified", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        status: true,
        data: [{ id: 38, subscription_code: "SUB-2026-8061", is_custom_offer: 1 }],
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const res = await fetchSubscriptions({ is_custom_offer: true, page: 2 });
    expect(res).toBeDefined();

    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("/admin/subscriptions");
    expect(url).toContain("is_custom_offer=1");
    expect(url).toContain("page=2");
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
});
