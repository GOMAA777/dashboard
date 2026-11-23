import { describe, it, expect } from "vitest";
import {
  isSaudiMobilePhone,
  isGeneralPhone,
  isValidEmail,
  isSeniorManagementDept,
  validateStaffForm,
} from "./staff.schema";

describe("Staff Validation & Business Rules", () => {
  const existingEmployees = [
    { id: "emp-1", name: "أحمد بن عبدالله الشمري", email: "ahmed@aljudy.sa" },
    { id: "emp-2", name: "سارة بنت خالد القحطاني", email: "sara@aljudy.sa" },
  ];

  describe("Saudi Mobile Phone Validation (الإدارة العليا)", () => {
    it("accepts valid Saudi mobile phone formats", () => {
      expect(isSaudiMobilePhone("0501234567")).toBe(true);
      expect(isSaudiMobilePhone("0559876543")).toBe(true);
      expect(isSaudiMobilePhone("501234567")).toBe(true);
      expect(isSaudiMobilePhone("+966501234567")).toBe(true);
      expect(isSaudiMobilePhone("966501234567")).toBe(true);
      expect(isSaudiMobilePhone("00966501234567")).toBe(true);
      expect(isSaudiMobilePhone("050 123 4567")).toBe(true);
      expect(isSaudiMobilePhone("+966 50 123 4567")).toBe(true);
    });

    it("rejects non-Saudi and invalid phone formats for Senior Management", () => {
      expect(isSaudiMobilePhone("")).toBe(false);
      expect(isSaudiMobilePhone("0112345678")).toBe(false); // landline
      expect(isSaudiMobilePhone("050123456")).toBe(false); // 9 digits total
      expect(isSaudiMobilePhone("05012345678")).toBe(false); // 11 digits
      expect(isSaudiMobilePhone("+201012345678")).toBe(false); // Egyptian number
      expect(isSaudiMobilePhone("abcdefghij")).toBe(false);
    });
  });

  describe("General Phone Validation (Other Departments)", () => {
    it("accepts valid international and standard phone numbers", () => {
      expect(isGeneralPhone("+966501234567")).toBe(true);
      expect(isGeneralPhone("0501234567")).toBe(true);
      expect(isGeneralPhone("+201012345678")).toBe(true);
      expect(isGeneralPhone("00971501234567")).toBe(true);
    });

    it("rejects invalid or too short general phone numbers", () => {
      expect(isGeneralPhone("")).toBe(false);
      expect(isGeneralPhone("12345")).toBe(false);
      expect(isGeneralPhone("phone123")).toBe(false);
    });
  });

  describe("Senior Management Department Detector", () => {
    it("detects senior management by Arabic and English names", () => {
      expect(isSeniorManagementDept("الإدارة العليا")).toBe(true);
      expect(isSeniorManagementDept("قسم الإدارة العليا")).toBe(true);
      expect(isSeniorManagementDept("Senior Management")).toBe(true);
      expect(isSeniorManagementDept("قسم القضايا العمالية")).toBe(false);
      expect(isSeniorManagementDept("قسم الدعم الفني")).toBe(false);
      expect(isSeniorManagementDept("")).toBe(false);
    });
  });

  describe("Form Validation with Duplicate Checks & Conditional Phone", () => {
    it("detects duplicate employee name", () => {
      const res = validateStaffForm(
        {
          name: "أحمد بن عبدالله الشمري", // exact duplicate
          email: "new.ahmed@aljudy.sa",
          phone: "0501234567",
          departmentId: "1",
          roleId: "1",
          password: "Password123!",
        },
        { existingEmployees, departmentName: "الإدارة العليا" }
      );

      expect(res.isValid).toBe(false);
      expect(res.errors.name).toBe("اسم الموظف مسجل مسبقاً، يرجى إدخال اسم مميز وغير مكرر");
    });

    it("detects duplicate employee name case-insensitively with spaces trimmed", () => {
      const res = validateStaffForm(
        {
          name: "  أحمد بن عبدالله الشمري  ",
          email: "unique@aljudy.sa",
          phone: "0501234567",
          departmentId: "1",
          roleId: "1",
          password: "Password123!",
        },
        { existingEmployees, departmentName: "الإدارة العليا" }
      );

      expect(res.isValid).toBe(false);
      expect(res.errors.name).toBe("اسم الموظف مسجل مسبقاً، يرجى إدخال اسم مميز وغير مكرر");
    });

    it("detects duplicate employee email", () => {
      const res = validateStaffForm(
        {
          name: "محمد الشمري",
          email: "ahmed@aljudy.sa", // duplicate email
          phone: "0501234567",
          departmentId: "1",
          roleId: "1",
          password: "Password123!",
        },
        { existingEmployees, departmentName: "الإدارة العليا" }
      );

      expect(res.isValid).toBe(false);
      expect(res.errors.email).toBe("البريد الإلكتروني مسجل مسبقاً لموظف آخر");
    });

    it("rejects invalid email formats", () => {
      const res = validateStaffForm(
        {
          name: "محمد الشمري",
          email: "notanemail",
          phone: "0501234567",
          departmentId: "1",
          roleId: "1",
          password: "Password123!",
        },
        { existingEmployees, departmentName: "الإدارة العليا" }
      );

      expect(res.isValid).toBe(false);
      expect(res.errors.email).toBe("صيغة البريد الإلكتروني غير صحيحة");
    });

    it("enforces Saudi phone for Senior Management department", () => {
      const res = validateStaffForm(
        {
          name: "فهد العتيبي",
          email: "fahad@aljudy.sa",
          phone: "+201012345678", // Egyptian number not allowed in Senior Management
          departmentId: "1",
          roleId: "1",
          password: "Password123!",
        },
        { existingEmployees, departmentName: "الإدارة العليا" }
      );

      expect(res.isValid).toBe(false);
      expect(res.errors.phone).toContain("الإدارة العليا يجب أن يكون رقماً سعودياً");
    });

    it("accepts foreign/general phone for non-Senior Management department", () => {
      const res = validateStaffForm(
        {
          name: "جون دو",
          email: "john@aljudy.sa",
          phone: "+201012345678", // allowed in technical support
          departmentId: "6",
          roleId: "2",
          password: "Password123!",
        },
        { existingEmployees, departmentName: "قسم الدعم الفني والربط التقني" }
      );

      expect(res.errors.phone).toBeUndefined();
      expect(res.isValid).toBe(true);
    });

    it("validates all valid fields and returns isValid: true", () => {
      const res = validateStaffForm(
        {
          name: "عبدالعزيز بن مساعد التميمي",
          email: "abdulaziz@aljudy.sa",
          phone: "0551234567",
          departmentId: "1",
          roleId: "1",
          password: "SecurePass@2025",
        },
        { existingEmployees, departmentName: "الإدارة العليا" }
      );

      expect(res.isValid).toBe(true);
      expect(Object.keys(res.errors).length).toBe(0);
    });

    it("allows existing employee to keep own name and email during edit", () => {
      const res = validateStaffForm(
        {
          name: "أحمد بن عبدالله الشمري", // same employee's name
          email: "ahmed@aljudy.sa", // same employee's email
          phone: "0501234567",
          departmentId: "1",
          roleId: "1",
          password: "", // empty password allowed on edit
        },
        {
          existingEmployees,
          currentEmployeeId: "emp-1", // current employee id matches
          departmentName: "الإدارة العليا",
          isEdit: true,
        }
      );

      expect(res.isValid).toBe(true);
      expect(res.errors.name).toBeUndefined();
      expect(res.errors.email).toBeUndefined();
      expect(res.errors.password).toBeUndefined();
    });

    it("still blocks duplicate name if edit matches ANOTHER employee", () => {
      const res = validateStaffForm(
        {
          name: "سارة بنت خالد القحطاني", // matches emp-2!
          email: "ahmed.new@aljudy.sa",
          phone: "0501234567",
          departmentId: "1",
          roleId: "1",
        },
        {
          existingEmployees,
          currentEmployeeId: "emp-1",
          departmentName: "الإدارة العليا",
          isEdit: true,
        }
      );

      expect(res.isValid).toBe(false);
      expect(res.errors.name).toBe("اسم الموظف مسجل مسبقاً، يرجى إدخال اسم مميز وغير مكرر");
    });
  });
});
