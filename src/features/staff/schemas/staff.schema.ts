import { z } from "zod";

/**
 * Checks if a phone number matches Saudi mobile phone format:
 * - 05XXXXXXXX (10 digits starting with 05)
 * - 5XXXXXXXX (9 digits starting with 5, matching +966 prefix)
 * - +9665XXXXXXXX, 9665XXXXXXXX, 009665XXXXXXXX
 */
export function isSaudiMobilePhone(phone: string): boolean {
  if (!phone) return false;
  const clean = phone.replace(/[\s\-\(\)]/g, "");
  return /^(?:05\d{8}|5\d{8}|\+9665\d{8}|9665\d{8}|009665\d{8})$/.test(clean);
}

/**
 * Normal phone validation for other departments:
 * Accepts numbers with optional leading +, between 9 and 15 digits.
 */
export function isGeneralPhone(phone: string): boolean {
  if (!phone) return false;
  const clean = phone.replace(/[\s\-\(\)]/g, "");
  return /^\+?[0-9]{9,15}$/.test(clean);
}

export function isValidEmail(email: string): boolean {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isSeniorManagementDept(departmentName?: string): boolean {
  if (!departmentName) return false;
  const clean = departmentName.trim().toLowerCase();
  return clean.includes("الإدارة العليا") || clean.includes("senior");
}

export interface ValidateStaffFormOptions {
  existingEmployees?: Array<{ id?: string | number; name?: string; email?: string }>;
  currentEmployeeId?: string | number;
  departmentName?: string;
  isEdit?: boolean;
}

export interface StaffFormValidationResult {
  isValid: boolean;
  errors: {
    name?: string;
    email?: string;
    phone?: string;
    roleId?: string;
    departmentId?: string;
    password?: string;
  };
}

export function validateStaffForm(
  data: {
    name?: string;
    email?: string;
    phone?: string;
    roleId?: string;
    departmentId?: string;
    password?: string;
  },
  options: ValidateStaffFormOptions = {}
): StaffFormValidationResult {
  const errors: StaffFormValidationResult["errors"] = {};

  // 1. Name validation: required, >= 3 chars, unique
  const trimmedName = data.name?.trim() || "";
  if (!trimmedName || trimmedName.length < 3) {
    errors.name = "الاسم الكامل مطلوب ويجب أن يحتوي على 3 أحرف على الأقل";
  } else if (
    options.existingEmployees?.some(
      (e) =>
        String(e.id) !== String(options.currentEmployeeId) &&
        e.name?.trim().toLowerCase() === trimmedName.toLowerCase()
    )
  ) {
    errors.name = "اسم الموظف مسجل مسبقاً، يرجى إدخال اسم مميز وغير مكرر";
  }

  // 2. Email validation: required, valid format, unique
  const trimmedEmail = data.email?.trim() || "";
  if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
    errors.email = "صيغة البريد الإلكتروني غير صحيحة";
  } else if (
    options.existingEmployees?.some(
      (e) =>
        String(e.id) !== String(options.currentEmployeeId) &&
        e.email?.trim().toLowerCase() === trimmedEmail.toLowerCase()
    )
  ) {
    errors.email = "البريد الإلكتروني مسجل مسبقاً لموظف آخر";
  }

  // 3. Department validation
  if (!data.departmentId || !data.departmentId.trim()) {
    errors.departmentId = "يرجى اختيار القسم";
  }

  // 4. Role validation
  if (!data.roleId || !data.roleId.trim()) {
    errors.roleId = "يرجى اختيار الدور الوظيفي للموظف";
  }

  // 5. Phone validation: conditional based on department
  const phoneVal = data.phone?.trim() || "";
  const isSenior = isSeniorManagementDept(options.departmentName);
  if (!phoneVal) {
    errors.phone = isSenior
      ? "رقم الجوال لقسم الإدارة العليا مطلوب ويجب أن يكون رقماً سعودياً (يبدأ بـ 05 ويكون 10 أرقام، أو بصيغة +9665XXXXXXXX)"
      : "رقم الجوال مطلوب ويجب أن يحتوي على 9 إلى 15 رقماً";
  } else if (isSenior) {
    if (!isSaudiMobilePhone(phoneVal)) {
      errors.phone =
        "رقم الجوال لقسم الإدارة العليا يجب أن يكون رقماً سعودياً (يبدأ بـ 05 ويكون 10 أرقام، أو بصيغة +9665XXXXXXXX)";
    }
  } else {
    if (!isGeneralPhone(phoneVal)) {
      errors.phone = "رقم الجوال غير صالح، يجب أن يحتوي على 9 إلى 15 رقماً";
    }
  }

  // 6. Password validation
  if (!options.isEdit) {
    if (!data.password || data.password.length < 8) {
      errors.password = "كلمة المرور يجب أن تحتوي على 8 خانات على الأقل";
    }
  } else {
    if (data.password && data.password.length > 0 && data.password.length < 8) {
      errors.password = "كلمة المرور يجب أن تحتوي على 8 خانات على الأقل في حال إدخالها";
    }
  }

  const isValid = Object.keys(errors).length === 0;
  return { isValid, errors };
}

export const addEmployeeSchema = z.object({
  name: z.string().min(3, "الاسم الكامل مطلوب ويجب أن يحتوي على 3 أحرف على الأقل"),
  email: z
    .string()
    .email("يرجى إدخال بريد إلكتروني صالح")
    .refine((val) => val.includes("@"), "صيغة البريد الإلكتروني غير صحيحة"),
  phone: z
    .string()
    .min(9, "رقم الجوال مطلوب ويجب أن يحتوي على 9 أرقام على الأقل")
    .regex(/^[0-9\s+]+$/, "رقم الجوال يجب أن يحتوي على أرقام فقط"),
  roleId: z.string().min(1, "يرجى اختيار الدور الوظيفي للموظف"),
  departmentId: z.string().min(1, "يرجى اختيار القسم"),
  password: z.string().min(8, "كلمة المرور يجب أن تحتوي على 8 خانات على الأقل"),
});

export type AddEmployeeFormData = z.infer<typeof addEmployeeSchema>;

export const resetPasswordSchema = z.object({
  method: z.enum(["email_link", "manual_password"]),
  sendSms: z.boolean().default(true),
  newPassword: z.string().optional(),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const editEmployeeSchema = z.object({
  name: z.string().min(3, "الاسم الكامل مطلوب ويجب أن يحتوي على 3 أحرف على الأقل"),
  email: z
    .string()
    .email("يرجى إدخال بريد إلكتروني صالح")
    .refine((val) => val.includes("@"), "صيغة البريد الإلكتروني غير صحيحة"),
  phone: z
    .string()
    .min(9, "رقم الجوال مطلوب ويجب أن يحتوي على 9 أرقام على الأقل")
    .regex(/^[0-9\s+]+$/, "رقم الجوال يجب أن يحتوي على أرقام فقط"),
  roleId: z.string().min(1, "يرجى اختيار الدور الوظيفي للموظف"),
  departmentId: z.string().min(1, "يرجى اختيار القسم"),
  status: z.enum(["active", "suspended"]),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: "كلمة المرور يجب أن تحتوي على 8 خانات على الأقل في حال إدخالها",
    }),
});

export type EditEmployeeFormData = z.infer<typeof editEmployeeSchema>;
