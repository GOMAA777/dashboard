import { describe, it, expect } from "vitest";
import { officeSchema, evaluateFieldRules } from "./office.schema";
import {
  SAUDI_CITIES,
  normalizeArabicDigits,
  getEmailDomainSuggestion,
} from "../constants/saudi-cities";

describe("Validation Rules & Edge Cases for Add Law Office", () => {
  const validBaseOffice = {
    ownerName: "عبد العزيز فهد", // 14 chars, arabic letters and spaces
    firmName: "شركة العجلان للمحاماة", // 21 chars, letters and spaces
    licenseNumber: "38/412", // digits and slash, <= 15 chars, contains digit
    taxNumber: "301298457200003", // 15 digits exactly
    email: "info@lawfirm.sa", // valid format
    phone: "0512345678", // 10 digits starting with 05
    landline: "011482990", // 9 digits starting with 011
    city: "الرياض", // in SAUDI_CITIES
    address: "طريق الملك فهد حي الصحافة", // >= 5 chars, has letter
    password: "Password123!", // >= 9 chars, letter + number + symbol
  };

  it("should pass with fully valid data", () => {
    const parsed = officeSchema.safeParse(validBaseOffice);
    expect(parsed.success).toBe(true);
  });

  describe("1. ownerName (5-30 chars, letters & spaces only)", () => {
    it("fails when shorter than 5 chars", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, ownerName: "أحمد" });
      expect(res.success).toBe(false);
    });

    it("passes with exactly 5 chars", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, ownerName: "محمدع" });
      expect(res.success).toBe(true);
    });

    it("passes with exactly 30 chars", () => {
      const name30 = "عبد العزيز فهد بن تركي الدوسري"; // 30 chars
      const res = officeSchema.safeParse({ ...validBaseOffice, ownerName: name30.slice(0, 30) });
      expect(res.success).toBe(true);
    });

    it("fails when longer than 30 chars", () => {
      const res = officeSchema.safeParse({
        ...validBaseOffice,
        ownerName: "عبد العزيز فهد بن تركي الدوسري التميمي الأول",
      });
      expect(res.success).toBe(false);
    });

    it("fails when containing numbers", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, ownerName: "محمد فهد 123" });
      expect(res.success).toBe(false);
    });

    it("fails when containing symbols", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, ownerName: "محمد فهد @" });
      expect(res.success).toBe(false);
    });
  });

  describe("2. firmName (5-40 chars, letters & spaces only)", () => {
    it("fails when shorter than 5 chars", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, firmName: "مكتب" });
      expect(res.success).toBe(false);
    });

    it("fails when longer than 40 chars", () => {
      const longName = "أ".repeat(41);
      const res = officeSchema.safeParse({ ...validBaseOffice, firmName: longName });
      expect(res.success).toBe(false);
    });

    it("fails when containing numbers", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, firmName: "شركة الهدى 2026" });
      expect(res.success).toBe(false);
    });
  });

  describe("3. licenseNumber (digits and / only, <=15 chars, contains digit)", () => {
    it("fails if empty", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, licenseNumber: "" });
      expect(res.success).toBe(false);
    });

    it("fails if only slashes without digits", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, licenseNumber: "///" });
      expect(res.success).toBe(false);
    });

    it("fails if containing letters", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, licenseNumber: "38/ABC" });
      expect(res.success).toBe(false);
    });

    it("fails if longer than 15 chars", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, licenseNumber: "1234567890/123456" });
      expect(res.success).toBe(false);
    });

    it("passes with Eastern Arabic numerals converted", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, licenseNumber: "٣٨/٤١٢" });
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.licenseNumber).toBe("38/412");
      }
    });
  });

  describe("4. taxNumber (exactly 15 digits, numbers only)", () => {
    it("fails with 14 digits", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, taxNumber: "30129845720000" });
      expect(res.success).toBe(false);
    });

    it("fails with 16 digits", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, taxNumber: "3012984572000033" });
      expect(res.success).toBe(false);
    });

    it("fails with non-numeric characters", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, taxNumber: "30129845720000A" });
      expect(res.success).toBe(false);
    });

    it("passes with Eastern Arabic numerals converted to 15 Western digits", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, taxNumber: "٣٠١٢٩٨٤٥٧٢٠٠٠٠٣" });
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.taxNumber).toBe("301298457200003");
      }
    });
  });

  describe("5. email (custom validation & typo suggestion)", () => {
    it("fails with spaces", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, email: "info @law.sa" });
      expect(res.success).toBe(false);
    });

    it("fails with consecutive dots", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, email: "info@law..sa" });
      expect(res.success).toBe(false);
    });

    it("suggests correction for typo domains", () => {
      expect(getEmailDomainSuggestion("lawyer@gmial.com")).toBe("lawyer@gmail.com");
      expect(getEmailDomainSuggestion("lawyer@gamil.com")).toBe("lawyer@gmail.com");
      expect(getEmailDomainSuggestion("lawyer@hotmial.com")).toBe("lawyer@hotmail.com");
      expect(getEmailDomainSuggestion("lawyer@yahooo.com")).toBe("lawyer@yahoo.com");
      expect(getEmailDomainSuggestion("lawyer@gmail.com")).toBe(null);
    });
  });

  describe("6. phone (Saudi mobile, exactly 10 digits starting with 05)", () => {
    it("fails with 9 digits", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, phone: "051234567" });
      expect(res.success).toBe(false);
    });

    it("fails with 11 digits", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, phone: "05123456789" });
      expect(res.success).toBe(false);
    });

    it("fails if not starting with 05", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, phone: "0612345678" });
      expect(res.success).toBe(false);
    });

    it("converts Eastern Arabic numerals", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, phone: "٠٥١٢٣٤٥٦٧٨" });
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.phone).toBe("0512345678");
      }
    });
  });

  describe("7. landline (Saudi landline, 9 or 10 digits starting with 011/012/013/014/016/017)", () => {
    it("fails with invalid area code", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, landline: "015482990" });
      expect(res.success).toBe(false);
    });

    it("fails with 8 digits", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, landline: "01148299" });
      expect(res.success).toBe(false);
    });

    it("fails with 11 digits", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, landline: "01148299001" });
      expect(res.success).toBe(false);
    });

    it("passes with 9 digits and 10 digits", () => {
      expect(officeSchema.safeParse({ ...validBaseOffice, landline: "017254564" }).success).toBe(true);
      expect(officeSchema.safeParse({ ...validBaseOffice, landline: "0114829900" }).success).toBe(true);
    });

    it("passes with valid codes: 011, 012, 013, 014, 016, 017", () => {
      const codes = ["011", "012", "013", "014", "016", "017"];
      for (const code of codes) {
        const res = officeSchema.safeParse({ ...validBaseOffice, landline: `${code}482990` });
        expect(res.success).toBe(true);
      }
    });

    it("passes with exact 9-digit landline 017254564 from screenshot", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, landline: "017254564" });
      expect(res.success).toBe(true);
      const evalStatus = evaluateFieldRules("landline", "017254564");
      expect(evalStatus.isValid).toBe(true);
      expect(evalStatus.errorMessage).toBeUndefined();
    });
  });

  describe("8. city (Mandatory from Saudi cities list)", () => {
    it("fails if not in list", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, city: "مدينة مجهولة" });
      expect(res.success).toBe(false);
    });

    it("passes for valid cities in list", () => {
      expect(SAUDI_CITIES).toContain("الرياض");
      expect(SAUDI_CITIES).toContain("جدة");
      expect(SAUDI_CITIES).toContain("الدمام");
      const res = officeSchema.safeParse({ ...validBaseOffice, city: "جدة" });
      expect(res.success).toBe(true);
    });
  });

  describe("9. address (5-30 chars, letters, numbers, symbols, contains at least one letter)", () => {
    it("fails if only numbers and symbols", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, address: "12345#$%" });
      expect(res.success).toBe(false);
    });

    it("fails if shorter than 5 chars", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, address: "برج" });
      expect(res.success).toBe(false);
    });

    it("fails if longer than 30 chars", () => {
      const res = officeSchema.safeParse({
        ...validBaseOffice,
        address: "طريق الملك فهد، حي الصحافة، برج النخبة التجاري - الطابق 14",
      });
      expect(res.success).toBe(false);
    });

    it("passes with letters and numbers within 5-30 chars", () => {
      const res = officeSchema.safeParse({
        ...validBaseOffice,
        address: "برج النخبة ط 14",
      });
      expect(res.success).toBe(true);
    });
  });

  describe("10. password (9-20 chars, letter, number, symbol, no spaces)", () => {
    it("fails if 8 chars", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, password: "Pass123!" });
      expect(res.success).toBe(false);
    });

    it("fails if longer than 20 chars", () => {
      const res = officeSchema.safeParse({
        ...validBaseOffice,
        password: "Pass123!Pass123!Pass12",
      });
      expect(res.success).toBe(false);
    });

    it("fails if missing symbol", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, password: "Password123" });
      expect(res.success).toBe(false);
    });

    it("fails if missing number", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, password: "Password!@#" });
      expect(res.success).toBe(false);
    });

    it("fails if containing space", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, password: "Pass 123!#" });
      expect(res.success).toBe(false);
    });

    it("passes with valid 9-20 char password containing letter, number, and symbol", () => {
      const res = officeSchema.safeParse({ ...validBaseOffice, password: "Pass#2026@" });
      expect(res.success).toBe(true);
    });
  });

  describe("Real-Time Validation Box Rules & Formats", () => {
    it("evaluates taxNumber with 12 digits matching user screenshot exactly", () => {
      const status = evaluateFieldRules("taxNumber", "123456789012");
      expect(status.shortTitle).toBe("الرقم الضريبي");
      expect(status.detailHeader).toBe("الرقم الضريبي: أدخلت 12 رقمًا");
      expect(status.isFilled).toBe(true);
      expect(status.isValid).toBe(false);

      // Rule 1: أرقام فقط -> valid
      expect(status.rules[0].label).toBe("أرقام فقط");
      expect(status.rules[0].isValid).toBe(true);

      // Rule 2: يجب أن تتكوّن من 15 رقمًا بالضبط (ناقص 3 أرقام) -> invalid
      expect(status.rules[1].label).toBe("يجب أن تتكوّن من 15 رقمًا بالضبط (ناقص 3 أرقام)");
      expect(status.rules[1].isValid).toBe(false);

      // Rule 3: بدون مسافات أو رموز -> valid
      expect(status.rules[2].label).toBe("بدون مسافات أو رموز");
      expect(status.rules[2].isValid).toBe(true);
    });

    it("evaluates taxNumber when fully valid (15 digits)", () => {
      const status = evaluateFieldRules("taxNumber", "301298457200003");
      expect(status.shortTitle).toBe("الرقم الضريبي");
      expect(status.detailHeader).toBe("الرقم الضريبي: مكتمل (15 رقمًا)");
      expect(status.isValid).toBe(true);
      expect(status.rules.every((r) => r.isValid)).toBe(true);
    });

    it("evaluates all 10 fields shortTitles matching UI cards", () => {
      expect(evaluateFieldRules("ownerName", "").shortTitle).toBe("صاحب المكتب");
      expect(evaluateFieldRules("firmName", "").shortTitle).toBe("اسم المكتب");
      expect(evaluateFieldRules("licenseNumber", "").shortTitle).toBe("رقم الترخيص");
      expect(evaluateFieldRules("taxNumber", "").shortTitle).toBe("الرقم الضريبي");
      expect(evaluateFieldRules("email", "").shortTitle).toBe("البريد الإلكتروني");
      expect(evaluateFieldRules("phone", "").shortTitle).toBe("رقم الجوال");
      expect(evaluateFieldRules("landline", "").shortTitle).toBe("الهاتف المكتبي");
      expect(evaluateFieldRules("city", "").shortTitle).toBe("المدينة");
      expect(evaluateFieldRules("address", "").shortTitle).toBe("العنوان");
      expect(evaluateFieldRules("password", "").shortTitle).toBe("كلمة المرور");
    });
  });
});
