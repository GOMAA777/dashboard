import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchImpersonationLogs } from "./impersonation";

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("fetchImpersonationLogs", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends office and date filters as query params", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        status: true,
        data: {
          current_page: 2,
          per_page: 10,
          total: 1,
          data: [
            {
              id: 1,
              admin_name: "مشرف",
              company_name: "مكتب",
              started_at: "2026-11-01T12:00:00.000000Z",
              ended_at: null,
              ip: "1.1.1.1",
            },
          ],
        },
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchImpersonationLogs({
      firm_id: 29,
      from: "2026-11-01",
      to: "2026-11-30",
      page: 2,
      per_page: 10,
    });

    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.page).toBe(2);

    const url = new URL(fetchMock.mock.calls[0][0] as string);
    expect(url.pathname).toBe("/api/admin/impersonation-logs");
    expect(url.searchParams.get("firm_id")).toBe("29");
    expect(url.searchParams.get("from")).toBe("2026-11-01");
    expect(url.searchParams.get("to")).toBe("2026-11-30");
    expect(url.searchParams.get("page")).toBe("2");
  });

  it("surfaces API failures without inventing rows", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse(
          { message: "The route api/admin/impersonation-logs could not be found." },
          404
        )
      )
    );

    await expect(fetchImpersonationLogs()).rejects.toThrow();
  });
});
