import { describe, expect, it } from "vitest";
import { mapSystemPermissionsCatalog } from "./roles";

describe("mapSystemPermissionsCatalog", () => {
  it("maps grouped /admin/roles/permissions object into modules", () => {
    const modules = mapSystemPermissionsCatalog({
      status: true,
      data: {
        dashboard: ["dashboard.view", "dashboard.statistics"],
        staff: ["staff.view", "staff.impersonate"],
        firms: ["firms.view"],
      },
    });

    expect(modules).toHaveLength(3);
    expect(modules[0]?.id).toBe("dashboard");
    expect(modules[0]?.permissions.map((p) => p.id)).toEqual([
      "dashboard.view",
      "dashboard.statistics",
    ]);
    expect(modules.find((m) => m.id === "staff")?.permissions[1]?.isSensitive).toBe(true);
    expect(modules.find((m) => m.id === "firms")?.permissions[0]?.label).toContain("عرض");
  });

  it("returns empty array for unexpected shapes", () => {
    expect(mapSystemPermissionsCatalog(null)).toEqual([]);
    expect(mapSystemPermissionsCatalog({ data: "x" })).toEqual([]);
  });
});
