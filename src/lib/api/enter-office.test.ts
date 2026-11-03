import { afterEach, describe, expect, it, vi } from "vitest";
import { enterOfficeAsAdmin } from "./enter-office";

describe("enterOfficeAsAdmin", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    sessionStorage.clear();
  });

  it("falls back to an immediate handoff when login-as-firm fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Unauthenticated" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        })
      )
    );

    const url = await enterOfficeAsAdmin({
      id: 29,
      name: "مكتب الدوسري",
      owner: "مالك المكتب",
    });

    expect(url).toContain("/impersonate-handoff");
    expect(url).toContain("#s=");
    expect(sessionStorage.getItem("doussary_auth_session")).toContain(
      "مكتب الدوسري"
    );
  });
});
