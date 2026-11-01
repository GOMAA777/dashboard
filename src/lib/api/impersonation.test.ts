import { afterEach, describe, expect, it, vi } from "vitest";
import { issueFirmImpersonation } from "./impersonation";

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("issueFirmImpersonation", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

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
