import { describe, expect, it } from "vitest";
import {
  buildImpersonationHandoffUrl,
  buildLawyerAuthSession,
  buildLawyerImpersonateUrl,
  decodeSessionParam,
  type LawyerAuthSession,
} from "./lawyer-session";

describe("lawyer-session", () => {
  it("builds the lawyer impersonate token URL", () => {
    const url = new URL(buildLawyerImpersonateUrl("abc.token"));
    expect(url.pathname).toBe("/lawyer/impersonate");
    expect(url.searchParams.get("token")).toBe("abc.token");
  });

  it("maps login-as-firm payload into the lawyer session shape", () => {
    const session = buildLawyerAuthSession({
      token: "sanctum-token",
      user: {
        id: 186,
        company_id: 29,
        full_name: "مالك المكتب",
        email: "owner@example.com",
        phone: "0500000000",
        role: "owner",
      },
      firm: { id: 29, name: "مكتب الدوسري" },
      previewBanner: { active: true, message: "معاينة" },
      impersonatedBy: 1,
      raw: {},
    });

    expect(session.token).toBe("sanctum-token");
    expect(session.company_id).toBe(29);
    expect(session.firm_name).toBe("مكتب الدوسري");
    expect(session.impersonated_by).toBe(1);
    expect(session.roleId).toBe("admin");
  });

  it("round-trips the handoff session payload without exposing plain JSON", () => {
    const original: LawyerAuthSession = {
      token: "round-trip-token",
      id: 10,
      name: "مشرف",
      email: "a@b.c",
      phone: "",
      role: "owner",
      roleId: "admin",
      assignedRole: "المستشار",
      company_id: 29,
      permissions: { all: true },
      impersonated_by: true,
      firm_name: "مكتب",
    };

    const handoff = new URL(buildImpersonationHandoffUrl(original));
    expect(handoff.pathname).toContain("/impersonate-handoff");
    expect(handoff.searchParams.get("s")).toBeTruthy();
    expect(handoff.searchParams.get("s")).not.toContain("round-trip-token");

    const decoded = decodeSessionParam(handoff.searchParams.get("s") || "");
    expect(decoded?.token).toBe("round-trip-token");
    expect(decoded?.company_id).toBe(29);
  });
});
