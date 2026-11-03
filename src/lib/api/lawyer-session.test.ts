import { beforeEach, describe, expect, it } from "vitest";
import {
  LAWYER_HANDOFF_BRIDGE_KEY,
  buildImpersonationHandoffUrl,
  buildLawyerAuthSession,
  buildLawyerImpersonateUrl,
  consumeLawyerHandoffBridge,
  decodeSessionParam,
  persistLawyerSession,
  stashLawyerHandoffSession,
  type LawyerAuthSession,
} from "./lawyer-session";

describe("lawyer-session", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

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
    expect(session.company_name).toBe("مكتب الدوسري");
    expect(session.impersonated_by).toBe(1);
    expect(session.roleId).toBe("admin");
    expect(session.assignedRole).toBe("المستشار العام");
    expect(session.permissions).toEqual({ all: true });
  });

  it("persists the flattened login shape into sessionStorage only key the lawyer reads", () => {
    const session = buildLawyerAuthSession({
      token: "persist-token",
      user: { id: 7, company_id: 3, full_name: "مالك", role: "owner" },
      firm: { id: 3, name: "مكتب" },
      raw: {},
    });
    persistLawyerSession(session);
    const raw = sessionStorage.getItem("doussary_auth_session");
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw || "{}");
    expect(parsed.token).toBe("persist-token");
    expect(parsed.company_id).toBe(3);
    expect(parsed.permissions.all).toBe(true);
  });

  it("stashes a bridge payload in localStorage for the handoff tab", () => {
    const session: LawyerAuthSession = {
      token: "bridge-token",
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

    stashLawyerHandoffSession(session);
    expect(localStorage.getItem(LAWYER_HANDOFF_BRIDGE_KEY)).toContain(
      "bridge-token"
    );

    const consumed = consumeLawyerHandoffBridge();
    expect(consumed?.token).toBe("bridge-token");
    expect(localStorage.getItem(LAWYER_HANDOFF_BRIDGE_KEY)).toBeNull();
  });

  it("builds a short handoff URL with hash backup (no long query token)", () => {
    const session: LawyerAuthSession = {
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

    const handoff = new URL(buildImpersonationHandoffUrl(session));
    expect(handoff.pathname).toContain("/impersonate-handoff");
    expect(handoff.origin).toBe(new URL("https://law.elmoroj.com/lawyer").origin);
    expect(handoff.searchParams.get("s")).toBeNull();
    expect(handoff.hash).toContain("s=");
    expect(handoff.hash).not.toContain("round-trip-token");

    const encoded = new URLSearchParams(handoff.hash.slice(1)).get("s");
    expect(encoded).toBeTruthy();
    const decoded = decodeSessionParam(encoded || "");
    expect(decoded?.token).toBe("round-trip-token");
  });
});
