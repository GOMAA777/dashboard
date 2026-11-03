import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchFirmsStats, updateFirmStatus, createFirm, addFirmNote } from "./firms";
import { mapFirmToClientOffice, saveAllLocalCustomNotes, getLocalCustomNotes } from "./mappers";
import * as http from "./http";

vi.mock("./http", () => ({
  apiRequest: vi.fn(),
  ApiError: class ApiError extends Error {
    status?: number;
    data?: unknown;
    constructor(message: string, status?: number, data?: unknown) {
      super(message);
      this.name = "ApiError";
      this.status = status;
      this.data = data;
    }
  },
}));

describe("Firms API & Stats bidirectional sync", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchFirmsStats correctly fetches from /admin/firms/stats", async () => {
    const mockEnvelope = {
      status: true,
      data: {
        total_firms: 4,
        active_firms: 2,
        active_percentage: 50,
        trial_firms: 2,
        trial_avg_days_left: 14,
        suspended_firms: 1,
        suspended_awaiting_payment: 0,
      },
    };

    vi.mocked(http.apiRequest).mockResolvedValueOnce(mockEnvelope);

    const result = await fetchFirmsStats();
    expect(http.apiRequest).toHaveBeenCalledWith("/admin/firms/stats", {
      method: "GET",
    });
    expect(result).toEqual(mockEnvelope);
  });

  it("mapFirmToClientOffice accurately maps trial office from live API shape", () => {
    const rawApiFirm = {
      id: 58,
      name: "مكتب المحامي للاختبار",
      owner_name: "سعود القحطاني",
      license_number: "456",
      email: "lawyer@example.com",
      phone: "+966501234567",
      city: "الرياض",
      subscription_plan: "trial",
      plan_type: "trial",
      billing_cycle: "monthly",
      status: "trial",
      active_subscription: {
        id: 35,
        status: "trial",
        amount: "0.00",
        billing_cycle: "monthly",
        start_date: "2026-11-03T00:00:00.000000Z",
        renewal_date: "2026-11-17T00:00:00.000000Z",
      },
    };

    const mapped = mapFirmToClientOffice(rawApiFirm);
    expect(mapped.accountStatus.type).toBe("active");
    expect(mapped.accountStatus.label).toBe("نشط");
    expect(mapped.subscriptionStatus.type).toBe("trial");
    expect(mapped.subscriptionStatus.label).toBe("تجريبي");
    expect(mapped.planType).toBe("trial");
    expect(mapped.subscriptionPlan).toBe("trial");
  });

  it("mapFirmToClientOffice accurately maps an inactive/suspended trial office", () => {
    const rawInactiveTrial = {
      id: 59,
      name: "مكتب تجريبي معطل",
      owner_name: "سعود القحطاني",
      license_number: "789",
      email: "suspended-trial@example.com",
      phone: "+966501234568",
      city: "الرياض",
      subscription_plan: "trial",
      plan_type: "trial",
      billing_cycle: "monthly",
      status: "inactive",
    };

    const mapped = mapFirmToClientOffice(rawInactiveTrial);
    expect(mapped.accountStatus.type).toBe("suspended");
    expect(mapped.accountStatus.label).toBe("غير نشط");
    expect(mapped.subscriptionStatus.type).toBe("trial");
    expect(mapped.planType).toBe("trial");
  });

  it("updateFirmStatus normalizes suspended to inactive for database enum compatibility", async () => {
    vi.mocked(http.apiRequest).mockResolvedValueOnce({ status: true });

    await updateFirmStatus(58, "suspended", "تعطيل مؤقت");
    expect(http.apiRequest).toHaveBeenCalledWith("/admin/firms/58/status", {
      method: "PATCH",
      body: { status: "inactive", reason: "تعطيل مؤقت" },
    });
  });

  it("createFirm sends payload to POST /admin/firms", async () => {
    const payload = {
      name: "مكتب جديد",
      subscription_plan: "trial",
      plan_type: "trial",
      status: "trial",
    };

    vi.mocked(http.apiRequest).mockResolvedValueOnce({ status: true, data: { id: 99 } });

    await createFirm(payload);
    expect(http.apiRequest).toHaveBeenCalledWith("/admin/firms", {
      method: "POST",
      body: payload,
    });
  });

  it("addFirmNote calls POST /admin/firms/:id/notes with note payload", async () => {
    const mockResponse = {
      status: true,
      message: "تمت إضافة الملاحظة بنجاح",
      data: {
        id: 10,
        company_id: 62,
        author_name: "مشرف النظام",
        author_role: "إشراف النظام",
        note: "ملاحظة متابعة إدارية",
        created_at: "2026-11-03T11:00:00.000000Z",
      },
    };
    vi.mocked(http.apiRequest).mockResolvedValueOnce(mockResponse);

    const res = await addFirmNote(62, "ملاحظة متابعة إدارية");
    expect(http.apiRequest).toHaveBeenCalledWith("/admin/firms/62/notes", {
      method: "POST",
      body: { note: "ملاحظة متابعة إدارية" },
    });
    expect(res).toEqual(mockResponse);
  });

  it("mapFirmToClientOffice preserves internal_notes from API and integrates with local notes cache", () => {
    const rawOfficeWithNotes = {
      firm: {
        id: 62,
        name: "مكتب المحامي محمد",
        license_number: "12345",
      },
      internal_notes: [
        {
          id: 1,
          author_name: "فريق الدعم",
          author_role: "إشراف",
          note: "ملاحظة مسجلة في قاعدة البيانات",
          created_at: "2026-11-03T10:00:00.000000Z",
        },
      ],
    };

    const mapped = mapFirmToClientOffice(rawOfficeWithNotes);
    expect(mapped.internalNotes).toBeDefined();
    expect(mapped.internalNotes?.length).toBe(1);
    expect(mapped.internalNotes?.[0].note).toBe("ملاحظة مسجلة في قاعدة البيانات");
    expect(mapped.internalNotes?.[0].authorName).toBe("فريق الدعم");
  });
});
