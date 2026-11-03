import { afterEach, describe, expect, it, vi } from "vitest";
import {
  issueFirmImpersonation,
  endFirmImpersonation,
  fetchImpersonationLogs,
  fetchImpersonationLogDetails,
  endImpersonationSession,
  fetchImpersonationSessionReport,
} from "./impersonation";

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("impersonation API module", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("issueFirmImpersonation", () => {
    it("POSTs login-as-firm and extracts the session token", async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        jsonResponse({
          status: true,
          message: "تم بدء جلسة المعاينة بنجاح لمكتب: اختبار",
          data: {
            token: "firm-session-token",
            user: { id: 1, company_id: 29, full_name: "مالك", role: "owner" },
            firm: { id: 29, name: "مكتب اختبار" },
            preview_banner: { active: true, message: "معاينة" },
          },
        })
      );
      vi.stubGlobal("fetch", fetchMock);

      const result = await issueFirmImpersonation(29);

      expect(result.token).toBe("firm-session-token");
      expect(result.firm?.name).toBe("مكتب اختبار");
      expect(result.previewBanner?.active).toBe(true);

      const url = String(fetchMock.mock.calls[0][0]);
      expect(url).toContain("/admin/utility/login-as-firm/29");
      expect(fetchMock.mock.calls[0][1]?.method).toBe("POST");
    });

    it("fails closed when the API omits a token", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          jsonResponse({ status: true, data: { firm: { id: 1 } } })
        )
      );

      await expect(issueFirmImpersonation(1)).rejects.toThrow(
        "لم يُرجع الخادم رمز دخول للمكتب"
      );
    });
  });

  describe("endFirmImpersonation & endImpersonationSession", () => {
    it("POSTs /admin/utility/end-preview", async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        jsonResponse({ status: true, message: "تم إنهاء وضع المعاينة" })
      );
      vi.stubGlobal("fetch", fetchMock);

      const res = await endFirmImpersonation();
      expect(res).toBeDefined();
      const url = String(fetchMock.mock.calls[0][0]);
      expect(url).toContain("/admin/utility/end-preview");
      expect(fetchMock.mock.calls[0][1]?.method).toBe("POST");
    });

    it("POSTs /admin/impersonation-logs/{id}/end", async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        jsonResponse({ status: true, message: "تم إنهاء الجلسة الإشرافية" })
      );
      vi.stubGlobal("fetch", fetchMock);

      const res = await endImpersonationSession(42);
      expect(res).toBeDefined();
      const url = String(fetchMock.mock.calls[0][0]);
      expect(url).toContain("/admin/impersonation-logs/42/end");
      expect(fetchMock.mock.calls[0][1]?.method).toBe("POST");
    });
  });

  describe("fetchImpersonationLogs with search & filters", () => {
    it("passes search, status, and date filters in query parameters", async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        jsonResponse({
          status: true,
          data: {
            current_page: 1,
            per_page: 10,
            total: 1,
            data: [
              {
                id: 101,
                admin_id: 1,
                admin_name: "مشرف النظام",
                company_id: 29,
                company_name: "مكتب الرواد",
                started_at: "2026-11-03T10:00:00Z",
                ended_at: null,
                ip: "192.168.1.1",
              },
            ],
          },
        })
      );
      vi.stubGlobal("fetch", fetchMock);

      const result = await fetchImpersonationLogs({
        search: "الرواد",
        status: "active",
        from_date: "2026-11-01",
        to_date: "2026-11-03",
        page: 1,
        per_page: 10,
      });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe(101);

      const url = String(fetchMock.mock.calls[0][0]);
      expect(url).toContain("/admin/impersonation-logs");
      expect(url).toContain("search=%D8%A7%D9%84%D8%B1%D9%88%D8%A7%D8%AF");
      expect(url).toContain("status=active");
      expect(url).toContain("from=2026-11-01");
      expect(url).toContain("to=2026-11-03");
    });
    it("falls back to /admin/audit-logs?module=utility when /admin/impersonation-logs returns 404", async () => {
      const fetchMock = vi.fn().mockImplementation((url: string) => {
        if (url.includes("/admin/impersonation-logs")) {
          return Promise.resolve(
            jsonResponse(
              {
                message: "The route api/admin/impersonation-logs could not be found.",
              },
              404
            )
          );
        }
        if (url.includes("/admin/audit-logs")) {
          return Promise.resolve(
            jsonResponse({
              status: true,
              data: {
                current_page: 1,
                per_page: 10,
                total: 1,
                data: [
                  {
                    id: 230,
                    staff_id: 1,
                    staff_name: "م. عبد العزيز بن فهد",
                    action: "بدء جلسة معاينة لمكتب المحاماة: Lacey Stout",
                    module: "utility",
                    ip_address: "154.183.141.231",
                    details: { company_id: 50, user_id: 208 },
                    created_at: "2026-11-03T07:19:57.000000Z",
                    updated_at: "2026-11-03T07:19:57.000000Z",
                  },
                ],
              },
            })
          );
        }
        return Promise.reject(new Error("Unexpected URL"));
      });
      vi.stubGlobal("fetch", fetchMock);

      const result = await fetchImpersonationLogs({ page: 1, per_page: 10 });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe(230);
      expect(result.items[0].firm_name).toBe("Lacey Stout");
      expect(result.items[0].admin_name).toBe("م. عبد العزيز بن فهد");
      expect(result.items[0].ip).toBe("154.183.141.231");

      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(String(fetchMock.mock.calls[0][0])).toContain("/admin/impersonation-logs");
      expect(String(fetchMock.mock.calls[1][0])).toContain("/admin/audit-logs");
    });
  });

  describe("fetchImpersonationLogDetails & fetchImpersonationSessionReport", () => {
    it("GETs /admin/impersonation-logs/{id}", async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        jsonResponse({
          status: true,
          data: {
            id: 88,
            admin_id: 2,
            company_id: 15,
            started_at: "2026-11-03T11:00:00Z",
          },
        })
      );
      vi.stubGlobal("fetch", fetchMock);

      const res = await fetchImpersonationLogDetails(88);
      expect(res).toBeDefined();
      const url = String(fetchMock.mock.calls[0][0]);
      expect(url).toContain("/admin/impersonation-logs/88");
      expect(fetchMock.mock.calls[0][1]?.method).toBe("GET");
    });

    it("GETs /admin/impersonation-logs/{id}/report", async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        jsonResponse({
          status: true,
          data: {
            session_id: 88,
            actions_count: 5,
            audit_hash: "sha256-abcdef",
          },
        })
      );
      vi.stubGlobal("fetch", fetchMock);

      const res = await fetchImpersonationSessionReport(88);
      expect(res).toBeDefined();
      const url = String(fetchMock.mock.calls[0][0]);
      expect(url).toContain("/admin/impersonation-logs/88/report");
      expect(fetchMock.mock.calls[0][1]?.method).toBe("GET");
    });
  });
});
