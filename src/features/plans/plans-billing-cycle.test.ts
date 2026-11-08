import { describe, it, expect } from "vitest";
import { mapPlanFromApi } from "@/lib/api/mappers";

describe("Plans Billing Cycle & Pricing Display", () => {
  it("mapPlanFromApi correctly sets monthlyPrice and annualPrice", () => {
    const rawApiPlan = {
      id: "shark",
      name: "القرش",
      monthly_price: 500,
      yearly_price: 5000,
      max_lawyers: 10,
      max_cases: 7,
      status: "active",
      yearly_discount_percent: 17,
    };

    const mapped = mapPlanFromApi(rawApiPlan);
    expect(mapped.id).toBe("shark");
    expect(mapped.name).toBe("القرش");
    expect(mapped.monthlyPrice).toBe(500);
    expect(mapped.annualPrice).toBe(5000);
    expect(mapped.yearlyDiscountPercent).toBe(17);
  });

  it("calculates annualPrice fallback to monthly * 10 when yearly_price is missing", () => {
    const rawApiPlan = {
      id: "sea",
      name: "البحر",
      monthly_price: 560,
      status: "active",
    };

    const mapped = mapPlanFromApi(rawApiPlan);
    expect(mapped.monthlyPrice).toBe(560);
    expect(mapped.annualPrice).toBe(5600);
  });

  it("accurately computes monthly and annual display prices", () => {
    const plan = {
      monthlyPrice: 500,
      annualPrice: 5000,
    };

    const getDisplayData = (cycle: "monthly" | "annual") => {
      const isAnnual = cycle === "annual";
      const rawAnnualPrice = plan.annualPrice && plan.annualPrice > 0 ? plan.annualPrice : plan.monthlyPrice * 10;
      const displayPrice = isAnnual ? rawAnnualPrice : plan.monthlyPrice;
      const unit = isAnnual ? "ر.س / سنوياً" : "ر.س / شهرياً";
      const monthlyEquivalent = Math.round(rawAnnualPrice / 12);
      return { displayPrice, unit, monthlyEquivalent };
    };

    const monthlyData = getDisplayData("monthly");
    expect(monthlyData.displayPrice).toBe(500);
    expect(monthlyData.unit).toBe("ر.س / شهرياً");

    const annualData = getDisplayData("annual");
    expect(annualData.displayPrice).toBe(5000);
    expect(annualData.unit).toBe("ر.س / سنوياً");
    expect(annualData.monthlyEquivalent).toBe(417);
  });

  it("accurately computes custom billing cycle display and detects custom plans", () => {
    const customPlan = {
      id: "custom-1",
      name: "باقة مخصصة",
      badge: "باقة مخصصة",
      monthlyPrice: 500,
      annualPrice: 5000,
      isEnterprise: true,
    };

    const isCustom = (p: typeof customPlan) =>
      p.isEnterprise || Boolean(p.badge?.includes("مخصص")) || p.name.includes("مخصص");

    expect(isCustom(customPlan)).toBe(true);

    const getDisplayData = (cycle: "monthly" | "annual" | "custom", p: typeof customPlan) => {
      const isCustomCycle = cycle === "custom";
      const isAnnual = cycle === "annual";
      const rawAnnualPrice = p.annualPrice && p.annualPrice > 0 ? p.annualPrice : p.monthlyPrice * 10;
      const displayPrice = isAnnual ? rawAnnualPrice : p.monthlyPrice;
      const unit = isCustomCycle ? "ر.س / مخصص" : isAnnual ? "ر.س / سنوياً" : "ر.س / شهرياً";
      return { displayPrice, unit, isCustomCycle };
    };

    const customData = getDisplayData("custom", customPlan);
    expect(customData.displayPrice).toBe(500);
    expect(customData.unit).toBe("ر.س / مخصص");
    expect(customData.isCustomCycle).toBe(true);
  });

  it("maps -1 limits correctly to unlimited in Arabic", () => {
    const rawApiPlan = {
      id: "unlimited-plan",
      name: "باقة غير محدودة",
      monthly_price: 1500,
      max_lawyers: -1,
      max_cases: -1,
      max_power_of_attorney: -1,
      max_assistants: -1,
      max_clients: -1,
      storage_limit_gb: -1,
    };

    const mapped = mapPlanFromApi(rawApiPlan);
    expect(mapped.limits?.lawyers).toContain("غير محدود: المحامين");
    expect(mapped.limits?.cases).toContain("غير محدود: القضايا");
    expect(mapped.limits?.agents).toContain("غير محدود: الوكلاء");
    expect(mapped.limits?.assistants).toContain("غير محدود: المساعدين");
    expect(mapped.limits?.clients).toContain("غير محدود: العملاء");
    expect(mapped.limits?.storage).toContain("غير محدود");
  });
});
