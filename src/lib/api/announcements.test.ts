import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchAnnouncements,
  fetchAnnouncementById,
  fetchAnnouncementsStats,
  createAnnouncement,
  deleteAnnouncement,
} from "./announcements";
import { mapNotificationFromApi, mapNotificationsResponse } from "./mappers";
import { ApiError } from "./http";

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("Central Announcements & Notifications API (10. Central Announcements)", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // 01. GET /admin/announcements
  describe("01. fetchAnnouncements", () => {
    it("successfully fetches announcements list without query params", async () => {
      const mockPayload = {
        status: true,
        data: {
          current_page: 1,
          data: [
            {
              id: 2,
              title: "تحديث هام: إضافة خيار التحقق الثنائي (2FA)",
              content: "نود إحاطة جميع مكاتب المحاماة...",
              target_audience: "all",
              status: "sent",
              sent_at: "2026-11-16T11:26:03.000000Z",
              action_url: "https://aljudy.sa/updates/nafaz-2fa",
              action_label: "طريقة التفعيل",
            },
          ],
          total: 1,
          per_page: 10,
          last_page: 1,
        },
      };

      const fetchMock = vi.fn().mockResolvedValue(jsonResponse(mockPayload));
      vi.stubGlobal("fetch", fetchMock);

      const res = await fetchAnnouncements();
      expect(res).toEqual(mockPayload);
      const url = String(fetchMock.mock.calls[0][0]);
      expect(url).toContain("/admin/announcements");
      expect(fetchMock.mock.calls[0][1]?.method).toBe("GET");
    });

    it("appends query parameters: page, per_page, search, status, audience", async () => {
      const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ status: true, data: [] }));
      vi.stubGlobal("fetch", fetchMock);

      await fetchAnnouncements({
        page: 2,
        per_page: 15,
        search: "تحديث",
        status: "sent",
        audience: "selected_firms",
      });

      const url = new URL(String(fetchMock.mock.calls[0][0]));
      expect(url.pathname).toContain("/admin/announcements");
      expect(url.searchParams.get("page")).toBe("2");
      expect(url.searchParams.get("per_page")).toBe("15");
      expect(url.searchParams.get("search")).toBe("تحديث");
      expect(url.searchParams.get("status")).toBe("sent");
      expect(url.searchParams.get("audience")).toBe("selected_firms");
    });

    it("throws ApiError when server returns 500", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(jsonResponse({ message: "Server Error" }, 500))
      );

      await expect(fetchAnnouncements()).rejects.toThrow();
    });
  });

  // 02. POST /admin/announcements
  describe("02. createAnnouncement", () => {
    it("successfully creates a new announcement with JSON payload", async () => {
      const mockCreated = {
        status: true,
        message: "تم إرسال / جدولة الإشعار بنجاح",
        data: {
          id: 5,
          title: "إشعار تجريبي",
          content: "محتوى الإشعار",
          target_audience: "all",
          status: "sent",
        },
      };

      const fetchMock = vi.fn().mockResolvedValue(jsonResponse(mockCreated, 201));
      vi.stubGlobal("fetch", fetchMock);

      const payload = {
        title: "إشعار تجريبي",
        content: "محتوى الإشعار",
        target_audience: "all",
        action_url: "https://aljudy.sa",
        action_label: "رابط الإجراء",
        status: "sent",
      };

      const res = await createAnnouncement(payload);
      expect(res).toEqual(mockCreated);
      expect(fetchMock.mock.calls[0][1]?.method).toBe("POST");
      expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toEqual(payload);
    });

    it("supports FormData multipart body for image attachments", async () => {
      const mockCreated = {
        status: true,
        message: "تم إرسال / جدولة الإشعار بنجاح",
        data: {
          id: 6,
          title: "إشعار مع صورة",
          image: "https://law.elmoroj.com/storage/announcements/test.png",
        },
      };

      const fetchMock = vi.fn().mockResolvedValue(jsonResponse(mockCreated, 201));
      vi.stubGlobal("fetch", fetchMock);

      const formData = new FormData();
      formData.append("title", "إشعار مع صورة");
      formData.append("content", "محتوى الإشعار");
      formData.append("target_audience", "selected_firms");
      formData.append("target_company_ids[]", "96");

      const res = await createAnnouncement(formData);
      expect(res).toEqual(mockCreated);
      expect(fetchMock.mock.calls[0][1]?.method).toBe("POST");
    });

    it("throws ApiError with validation errors on 422", async () => {
      const validationError = {
        message: "The selected target audience is invalid.",
        errors: { target_audience: ["The selected target audience is invalid."] },
      };

      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(jsonResponse(validationError, 422))
      );

      await expect(
        createAnnouncement({
          title: "خطأ",
          content: "محتوى",
          target_audience: "invalid_audience",
        })
      ).rejects.toThrow(ApiError);
    });
  });

  // 03. GET /admin/announcements/{id}
  describe("03. fetchAnnouncementById", () => {
    it("successfully fetches announcement details by ID", async () => {
      const mockDetail = {
        status: true,
        data: {
          id: 2,
          title: "تحديث هام",
          content: "التفاصيل الكاملة",
          target_audience: "all",
          status: "sent",
          sent_at: "2026-11-16T11:26:03.000000Z",
        },
      };

      const fetchMock = vi.fn().mockResolvedValue(jsonResponse(mockDetail));
      vi.stubGlobal("fetch", fetchMock);

      const res = await fetchAnnouncementById(2);
      expect(res).toEqual(mockDetail);
      expect(String(fetchMock.mock.calls[0][0])).toContain("/admin/announcements/2");
    });
  });

  // 04. DELETE /admin/announcements/{id}
  describe("04. deleteAnnouncement", () => {
    it("successfully deletes announcement by ID", async () => {
      const mockDelete = {
        status: true,
        message: "تم حذف الإشعار بنجاح",
      };

      const fetchMock = vi.fn().mockResolvedValue(jsonResponse(mockDelete));
      vi.stubGlobal("fetch", fetchMock);

      const res = await deleteAnnouncement(2);
      expect(res).toEqual(mockDelete);
      expect(fetchMock.mock.calls[0][1]?.method).toBe("DELETE");
      expect(String(fetchMock.mock.calls[0][0])).toContain("/admin/announcements/2");
    });
  });

  // 05. fetchAnnouncementsStats
  describe("05. fetchAnnouncementsStats", () => {
    it("fetches tab counters for all, sent, scheduled, and draft in parallel", async () => {
      const fetchMock = vi.fn().mockImplementation((url: string) => {
        const u = String(url);
        if (u.includes("status=sent")) {
          return Promise.resolve(jsonResponse({ status: true, data: { total: 5 } }));
        }
        if (u.includes("status=scheduled")) {
          return Promise.resolve(jsonResponse({ status: true, data: { total: 2 } }));
        }
        if (u.includes("status=draft")) {
          return Promise.resolve(jsonResponse({ status: true, data: { total: 3 } }));
        }
        return Promise.resolve(jsonResponse({ status: true, data: { total: 10 } }));
      });

      vi.stubGlobal("fetch", fetchMock);

      const stats = await fetchAnnouncementsStats();
      expect(stats).toEqual({
        all: 10,
        activeAndReceived: 5,
        scheduled: 2,
        drafts: 3,
      });
    });
  });

  // 06. Mappers
  describe("06. Mappers: mapNotificationFromApi & mapNotificationsResponse", () => {
    it("maps raw API announcement object correctly", () => {
      const raw = {
        id: 2,
        title: "تحديث أمني",
        content: "نص الإشعار",
        target_audience: "all",
        status: "sent",
        sent_at: "2026-11-16T11:26:03.000000Z",
        action_url: "https://aljudy.sa/sec",
        action_label: "التفاصيل",
      };

      const mapped = mapNotificationFromApi(raw);
      expect(mapped.id).toBe("2");
      expect(mapped.title).toBe("تحديث أمني");
      expect(mapped.description).toBe("نص الإشعار");
      expect(mapped.audienceType).toBe("all");
      expect(mapped.targetAudienceLabel).toBe("جميع المكاتب");
      expect(mapped.status).toBe("sent");
      expect(mapped.statusLabel).toBe("تم الإرسال");
      expect(mapped.actionUrl).toBe("https://aljudy.sa/sec");
      expect(mapped.actionButtonText).toBe("التفاصيل");
    });

    it("maps selected_firms target audience to specific audienceType", () => {
      const raw = {
        id: 3,
        title: "إشعار لمكتب",
        content: "خاص",
        target_audience: "selected_firms",
        status: "draft",
      };

      const mapped = mapNotificationFromApi(raw);
      expect(mapped.audienceType).toBe("specific");
      expect(mapped.status).toBe("draft");
      expect(mapped.statusLabel).toBe("مسودة");
    });

    it("handles wrapped or unwrapped paginated response in mapNotificationsResponse", () => {
      const wrapped = {
        status: true,
        data: {
          data: [
            { id: 1, title: "الإشعار الأول", content: "1" },
            { id: 2, title: "الإشعار الثاني", content: "2" },
          ],
        },
      };

      const mapped = mapNotificationsResponse(wrapped);
      expect(mapped).toHaveLength(2);
      expect(mapped[0].title).toBe("الإشعار الأول");
      expect(mapped[1].title).toBe("الإشعار الثاني");
    });
  });
});
