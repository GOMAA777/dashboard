import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchDashboardSaas, loadFullDashboardData } from "./dashboard";

vi.mock("@/lib/auth-client", () => ({
  getAccessToken: vi.fn(() => "mock-admin-token"),
}));

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("SaaS Dashboard API (Postman UID: 50014550-ef8b79ff-ceb5-4885-963d-8f0d0e4b7328)", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetchDashboardSaas calls GET /admin/dashboardSaas", async () => {
    const mockPayload = {
      status: true,
      message: "SaaS dashboard data retrieved successfully",
      data: {
        statistics: {
          total_firms: 2,
          active_firms: 2,
          trial_firms: 0,
          expired_firms: 0,
          inactive_firms: 0,
          total_lawyers: 1,
          total_clients: 0,
          total_cases: 0,
          total_appointments: 0,
          today_appointments: 0,
        },
        subscriptions: {
          active: 2,
          trial: 0,
          expired: 0,
          expiring_soon: 0,
        },
        latest_firms: [
          {
            id: 50,
            name: "Lacey Stout",
            owner_name: "Aretha Oneill",
            status: "active",
          },
        ],
        latest_activities: [
          {
            id: 532,
            company_id: 50,
            title: "تم إنشاء تصنيف قضية جديد",
            description: 'تم إنشاء تصنيف القضية "استشارة"',
            type: "case_category",
            reference_id: "82",
            created_at: "2026-11-02T14:16:18.000000Z",
          },
        ],
      },
    };

    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(mockPayload));
    vi.stubGlobal("fetch", fetchMock);

    const res = await fetchDashboardSaas();
    expect(res).toBeDefined();

    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("/admin/dashboardSaas");
    expect(fetchMock.mock.calls[0][1]?.method).toBe("GET");
  });

  it("loadFullDashboardData maps SaaS statistics, firms, activities, and revenue correctly", async () => {
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      const urlStr = String(url);
      if (urlStr.includes("/admin/dashboardSaas")) {
        return Promise.resolve(
          jsonResponse({
            status: true,
            data: {
              statistics: {
                total_firms: 2,
                active_firms: 2,
                total_lawyers: 1,
              },
              subscriptions: {
                active: 2,
              },
              latest_firms: [
                {
                  id: 50,
                  name: "Lacey Stout",
                  owner_name: "Aretha Oneill",
                  status: "active",
                  created_at: "2026-11-02T13:47:34.000000Z",
                },
                {
                  id: 49,
                  name: "شركة العجلان",
                  owner_name: "د. خالد العجلان",
                  status: "active",
                  created_at: "2026-11-02T13:18:55.000000Z",
                },
              ],
              latest_activities: [
                {
                  id: 532,
                  company_id: 50,
                  title: "تم إنشاء تصنيف قضية جديد",
                  description: 'تصنيف "استشارة"',
                  type: "case_category",
                  reference_id: "82",
                  created_at: "2026-11-02T14:16:18.000000Z",
                },
              ],
            },
          })
        );
      }
      if (urlStr.includes("/admin/firms/stats")) {
        return Promise.resolve(
          jsonResponse({
            status: true,
            data: { total_firms: 2, active_percentage: 100 },
          })
        );
      }
      if (urlStr.includes("/admin/subscriptions/stats")) {
        return Promise.resolve(
          jsonResponse({
            status: true,
            data: { total_subscriptions: 2, active_subscriptions: 2 },
          })
        );
      }
      if (urlStr.includes("/admin/plans/stats")) {
        return Promise.resolve(
          jsonResponse({
            status: true,
            data: { mrr: 1098, growth_percentage: 14.2 },
          })
        );
      }
      if (urlStr.includes("/admin/tickets/stats")) {
        return Promise.resolve(
          jsonResponse({
            status: true,
            data: { open_tickets: 18, closed_tickets: 342 },
          })
        );
      }
      if (urlStr.includes("/admin/firms")) {
        return Promise.resolve(
          jsonResponse({
            status: true,
            data: { data: [] },
          })
        );
      }
      if (urlStr.includes("/admin/plans")) {
        return Promise.resolve(
          jsonResponse({
            status: true,
            data: [
              {
                id: 3,
                name: "باقة التميز العدلي",
                badge_color: "#d97706",
                active_companies_count: 2,
              },
            ],
          })
        );
      }
      return Promise.reject(new Error(`Unhandled mock url: ${urlStr}`));
    });

    vi.stubGlobal("fetch", fetchMock);

    const fullData = await loadFullDashboardData();

    // KPIs
    expect(fullData.kpis.totalFirms).toBe(2);
    expect(fullData.kpis.activeSubscriptions).toBe(2);
    expect(fullData.kpis.monthlyRevenue).toBe(1098);
    expect(fullData.kpis.monthlyRevenueGrowth).toBe("+14.2%");
    expect(fullData.kpis.openTickets).toBe(18);

    // Offices (fallback from latest_firms)
    expect(fullData.recentOffices.length).toBe(2);
    expect(fullData.recentOffices[0].nameAr).toBe("Lacey Stout");
    expect(fullData.recentOffices[1].nameAr).toBe("شركة العجلان");

    // Activities
    expect(fullData.activities.length).toBe(1);
    expect(fullData.activities[0].titlePrefixAr).toContain("تم إنشاء تصنيف قضية جديد");

    // Revenue points
    expect(fullData.revenueData.length).toBe(6);
    expect(fullData.revenueData[5].isHighest).toBe(true);
    expect(fullData.revenueData[5].value).toBe(1098);

    // Plans distribution
    expect(fullData.planDistribution.length).toBe(1);
    expect(fullData.planDistribution[0].value).toBe(2);
    expect(fullData.planDistribution[0].percentage).toBe("100%");
  });
});
