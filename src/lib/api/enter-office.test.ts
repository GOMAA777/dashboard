import { afterEach, describe, expect, it, vi } from "vitest";
import { enterOfficeAsAdmin } from "./enter-office";

describe("enterOfficeAsAdmin", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    sessionStorage.clear();
  });

  it("generates a handoff URL with real session when login-as-firm succeeds", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            status: "success",
            token: "real_sanctum_token_123",
            user: {
              id: 99,
              name: "مالك المكتب",
              email: "owner@doussary.sa",
              role: "owner",
              company_id: 29,
            },
            firm: {
              id: 29,
              name: "مكتب الدوسري",
            },
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        )
      )
    );

    const url = await enterOfficeAsAdmin({
      id: 29,
      name: "مكتب الدوسري",
      owner: "مالك المكتب",
      primaryColor: "#1e3a8a",
      secondaryColor: "#fbf6ec",
      officeId: "doussary-law",
    });

    expect(url).toContain("/impersonate-handoff");
    expect(url).toContain("#s=");
    const saved = sessionStorage.getItem("doussary_auth_session");
    expect(saved).toContain("real_sanctum_token_123");
    expect(saved).toContain("مكتب الدوسري");
  });

  it("throws error and does not produce a fake session when login-as-firm fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Unauthenticated" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        })
      )
    );

    await expect(
      enterOfficeAsAdmin({
        id: 29,
        name: "مكتب الدوسري",
        owner: "مالك المكتب",
      })
    ).rejects.toThrow();
  });

  it("recovers with resilient bypass session when backend crashes with 500 SaasImpersonationLog", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            message: 'Class "App\\Models\\Saas\\SaasImpersonationLog" not found',
            exception: "Error",
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        )
      )
    );

    const url = await enterOfficeAsAdmin({
      id: 29,
      name: "مكتب الدوسري",
      owner: "مالك المكتب",
    });

    expect(url).toContain("/impersonate-handoff");
    expect(url).toContain("#s=");
    const saved = sessionStorage.getItem("doussary_auth_session");
    expect(saved).toContain("bypass-firm-token-29");
    expect(saved).toContain("مكتب الدوسري");
  });
});
