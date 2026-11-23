import { describe, it, expect } from "vitest";
import {
  formatCustomTime,
  getDefaultTimeFromNow,
  CustomTimeValue,
} from "./LuxuryTimePicker";

describe("LuxuryTimePicker Logic", () => {
  describe("formatCustomTime", () => {
    it("formats morning time with leading zeros in Arabic", () => {
      const time: CustomTimeValue = { hour: "8", minute: "5", period: "AM" };
      expect(formatCustomTime(time, false)).toBe("08:05 ص");
    });

    it("formats evening time with leading zeros in Arabic", () => {
      const time: CustomTimeValue = { hour: "4", minute: "30", period: "PM" };
      expect(formatCustomTime(time, false)).toBe("04:30 م");
    });

    it("formats time in English when requested", () => {
      const time: CustomTimeValue = { hour: "11", minute: "45", period: "AM" };
      expect(formatCustomTime(time, true)).toBe("11:45 AM");
      const timePm: CustomTimeValue = { hour: "02", minute: "15", period: "PM" };
      expect(formatCustomTime(timePm, true)).toBe("02:15 PM");
    });
  });

  describe("getDefaultTimeFromNow", () => {
    it("returns formatted two-digit hour and minute", () => {
      const time = getDefaultTimeFromNow(2);
      expect(time.hour).toMatch(/^(0[1-9]|1[0-2])$/);
      expect(time.minute).toMatch(/^[0-5][0-9]$/);
      expect(["AM", "PM"]).toContain(time.period);
    });

    it("handles zero offset correctly", () => {
      const time = getDefaultTimeFromNow(0);
      expect(time.hour).toBeDefined();
      expect(time.minute).toBeDefined();
      expect(Number(time.hour)).toBeGreaterThanOrEqual(1);
      expect(Number(time.hour)).toBeLessThanOrEqual(12);
    });
  });
});
