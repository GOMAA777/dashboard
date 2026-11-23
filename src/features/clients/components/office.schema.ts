import { z } from "zod";
import { SAUDI_CITIES, normalizeArabicDigits, getLocalizedCityName } from "../constants/saudi-cities";

// Regex for Arabic & English letters, spaces, and dots (allows abbreviations like د.محمد or د. خالد)
// Note: \u0621-\u064A covers Arabic alphabet without Arabic numerals \u0660-\u0669
export const LETTERS_AND_SPACES_REGEX = /^[\u0621-\u064Aa-zA-Z .]+$/;

// License: digits and / only, 1-15 chars, must contain at least one digit
export const LICENSE_REGEX = /^[\d/]{1,15}$/;

// Saudi mobile: 9 digits starting with 5 (without leading zero)
export const SAUDI_PHONE_REGEX = /^5\d{8}$/;

// Saudi landline: 01 + [1,2,3,4,6,7] + 6 or 7 digits (total 9 or 10 digits)
export const SAUDI_LANDLINE_REGEX = /^01[123467]\d{6,7}$/;


// Has at least one letter (Arabic or English)
export const CONTAINS_LETTER_REGEX = /[a-zA-Z\u0621-\u064A]/;

// Has at least one digit
export const CONTAINS_DIGIT_REGEX = /\d/;

// Has at least one symbol (non-alphanumeric, non-space, non-dot)
export const CONTAINS_SYMBOL_REGEX = /[^a-zA-Z0-9\u0621-\u064A\s.]/;

// Office ID / Slug: alphanumeric and hyphens only (e.g. alajlan-law-101)
export const OFFICE_ID_REGEX = /^[a-zA-Z0-9-]+$/;

// Valid hex color (e.g. #9c6402 or #fff)
export const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function createOfficeSchema(isEn = false) {
  const m = (ar: string, en: string) => (isEn ? en : ar);
  return z.object({
    officeId: z
      .string()
      .transform((val) => (val || "").trim())
      .refine((val) => val.length === 0 || (val.length >= 3 && val.length <= 40), {
        message: m("معرّف المكتب يجب أن يكون من 3 إلى 40 خانة", "Office ID must be between 3 and 40 characters"),
      })
      .refine((val) => val.length === 0 || OFFICE_ID_REGEX.test(val), {
        message: m("معرّف المكتب يقبل حروفاً إنجليزية وأرقاماً وشرطة (-) فقط بدون مسافات أو رموز خاصة", "Office ID accepts English letters, numbers, and hyphens (-) only"),
      }),

    ownerName: z
      .string()
      .transform((val) => val.trim())
      .refine((val) => val.length > 0, {
        message: m("اسم صاحب المكتب مطلوب", "Owner name is required"),
      })
      .refine((val) => val.length >= 4 && val.length <= 40, {
        message: m("اسم صاحب المكتب يجب أن يكون من 4 إلى 40 حرفاً", "Owner name must be between 4 and 40 characters"),
      })
      .refine((val) => CONTAINS_LETTER_REGEX.test(val), {
        message: m("اسم صاحب المكتب يجب أن يحتوي على حروف", "Owner name must contain letters"),
      })
      .refine((val) => LETTERS_AND_SPACES_REGEX.test(val), {
        message: m("اسم صاحب المكتب يقبل حروفاً ومسافات ونقاط فقط، بدون أرقام أو رموز خاصة", "Owner name accepts letters, spaces, and dots only"),
      }),

    firmName: z
      .string()
      .transform((val) => val.trim())
      .refine((val) => val.length > 0, {
        message: m("اسم المكتب مطلوب", "Law office name is required"),
      })
      .refine((val) => val.length >= 4 && val.length <= 40, {
        message: m("اسم المكتب يجب أن يكون من 4 إلى 40 حرفاً", "Law office name must be between 4 and 40 characters"),
      })
      .refine((val) => CONTAINS_LETTER_REGEX.test(val), {
        message: m("اسم المكتب يجب أن يحتوي على حروف", "Law office name must contain letters"),
      })
      .refine((val) => LETTERS_AND_SPACES_REGEX.test(val), {
        message: m("اسم المكتب يقبل حروفاً ومسافات ونقاط فقط، بدون أرقام أو رموز خاصة", "Law office name accepts letters, spaces, and dots only"),
      }),

    licenseNumber: z
      .string()
      .transform((val) => normalizeArabicDigits(val.trim()))
      .refine((val) => val.length > 0, {
        message: m("رقم الترخيص مطلوب", "License number is required"),
      })
      .refine((val) => LICENSE_REGEX.test(val), {
        message: m("رقم الترخيص يقبل أرقاماً ورمز / فقط بحد أقصى 15 خانة", "License number accepts digits and / only (max 15 chars)"),
      })
      .refine((val) => CONTAINS_DIGIT_REGEX.test(val), {
        message: m("رقم الترخيص يجب أن يحتوي على رقم واحد على الأقل", "License number must contain at least one digit"),
      }),

    taxNumber: z
      .string()
      .transform((val) => normalizeArabicDigits(val.trim()))
      .refine((val) => val.length > 0, {
        message: m("الرقم الضريبي مطلوب", "Tax number is required"),
      })
      .refine((val) => /^\d+$/.test(val), {
        message: m("الرقم الضريبي يجب أن يتكون من أرقام فقط", "Tax number must consist of digits only"),
      })
      .refine((val) => val.length === 15, {
        message: m("الرقم الضريبي يجب أن يكون 15 رقماً بالضبط", "Tax number must be exactly 15 digits"),
      }),

    email: z
      .string()
      .transform((val) => val.trim())
      .refine((val) => val.length > 0, {
        message: m("البريد الإلكتروني مطلوب", "Email address is required"),
      })
      .refine((val) => !/\s/.test(val), {
        message: m("البريد الإلكتروني لا يمكن أن يحتوي على مسافات", "Email address cannot contain spaces"),
      })
      .refine((val) => val.length <= 254, {
        message: m("البريد الإلكتروني لا يجب أن يتجاوز 254 حرفاً", "Email address must not exceed 254 characters"),
      })
      .refine((val) => {
        const parts = val.split("@");
        return parts.length === 2 && parts[0].length >= 1 && parts[0].length <= 64;
      }, {
        message: m("الجزء قبل @ يجب أن يكون بين 1 و 64 حرفاً وبدون تكرار @", "Username before @ must be 1 to 64 characters"),
      })
      .refine((val) => {
        const parts = val.split("@");
        if (parts.length !== 2) return false;
        const [local, domain] = parts;
        if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;
        if (domain.startsWith(".") || domain.endsWith(".") || domain.includes("..")) return false;
        const domainParts = domain.split(".");
        if (domainParts.length < 2) return false;
        const tld = domainParts[domainParts.length - 1];
        return /^[a-zA-Z]{2,}$/.test(tld);
      }, {
        message: m("الدومين غير صالح؛ يجب أن يحتوي على نقطة وامتداد بحرفين أو أكثر بدون نقاط متتالية", "Invalid email domain format"),
      }),

    phone: z
      .string()
      .transform((val) => {
        let norm = normalizeArabicDigits(val.trim()).replace(/\s+/g, "");
        if (norm.startsWith("+966")) norm = norm.slice(4);
        if (norm.startsWith("00966")) norm = norm.slice(5);
        if (norm.startsWith("966")) norm = norm.slice(3);
        if (norm.startsWith("0")) norm = norm.slice(1);
        return norm;
      })
      .refine((val) => val.length > 0, {
        message: m("رقم الجوال مطلوب", "Mobile phone is required"),
      })
      .refine((val) => val.startsWith("5"), {
        message: m("رقم الجوال يجب أن يبدأ بـ 5 (بدون الصفر)", "Mobile phone must start with 5 (without zero)"),
      })
      .refine((val) => SAUDI_PHONE_REGEX.test(val), {
        message: m("رقم الجوال يجب أن يتكون من 9 أرقام ويبدأ بـ 5 بدون الصفر (مثال: 512345678)", "Mobile phone must be 9 digits starting with 5 without zero (e.g. 512345678)"),
      }),

    landline: z
      .string()
      .transform((val) => normalizeArabicDigits(val.trim()))
      .refine((val) => val.length > 0, {
        message: m("الهاتف المكتبي المباشر مطلوب", "Direct office landline is required"),
      })
      .refine((val) => /^01[123467]/.test(val), {
        message: m("الهاتف المكتبي يجب أن يبدأ برمز منطقة سعودي (011، 012، 013، 014، 016، 017)", "Landline must start with Saudi area code (011, 012, 013, 014, 016, 017)"),
      })
      .refine((val) => SAUDI_LANDLINE_REGEX.test(val), {
        message: m("الهاتف المكتبي يجب أن يكون 9 أو 10 أرقام (مثال: 011482990 أو 0114829900)", "Landline must be 9 or 10 digits"),
      }),

    city: z
      .string()
      .transform((val) => val.trim())
      .refine((val) => val.length > 0, {
        message: m("يرجى اختيار المدينة", "Please select a city"),
      })
      .refine((val) => SAUDI_CITIES.includes(val.replace("المملكة العربية السعودية - ", "").trim()), {
        message: m("يرجى اختيار مدينة صحيحة من قائمة المدن المتاحة", "Please select a valid city from the list"),
      }),

    address: z
      .string()
      .transform((val) => val.trim())
      .refine((val) => val.length > 0, {
        message: m("العنوان مطلوب", "National address is required"),
      })
      .refine((val) => val.length >= 5 && val.length <= 30, {
        message: m("العنوان يجب أن يكون من 5 إلى 30 حرفاً", "Address must be between 5 and 30 characters"),
      })
      .refine((val) => CONTAINS_LETTER_REGEX.test(val), {
        message: m("العنوان يجب أن يحتوي على حرف واحد على الأقل (عربي أو إنجليزي)", "Address must contain at least one letter (Arabic or English)"),
      }),

    password: z
      .string()
      .refine((val) => val.length > 0, {
        message: m("كلمة المرور مطلوبة", "Password is required"),
      })
      .refine((val) => !/\s/.test(val), {
        message: m("كلمة المرور يجب ألا تحتوي على مسافات", "Password cannot contain spaces"),
      })
      .refine((val) => val.length >= 9 && val.length <= 20, {
        message: m("كلمة المرور يجب أن تكون بين 9 و 20 خانة", "Password must be between 9 and 20 characters"),
      })
      .refine((val) => CONTAINS_LETTER_REGEX.test(val), {
        message: m("كلمة المرور يجب أن تحتوي على حرف واحد على الأقل", "Password must contain at least one letter"),
      })
      .refine((val) => CONTAINS_DIGIT_REGEX.test(val), {
        message: m("كلمة المرور يجب أن تحتوي على رقم واحد على الأقل", "Password must contain at least one digit"),
      })
      .refine((val) => CONTAINS_SYMBOL_REGEX.test(val), {
        message: m("كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل (مثل: !@#$%^&*)", "Password must contain at least one special symbol (e.g. !@#$%^&*)"),
      }),

    primaryColor: z
      .string()
      .optional()
      .refine((val) => !val || HEX_COLOR_REGEX.test(val), {
        message: m("اللون الأساسي يجب أن يكون كود HEX صالح (مثال: #9c6402)", "Primary color must be a valid HEX code (e.g. #9c6402)"),
      }),

    secondaryColor: z
      .string()
      .optional()
      .refine((val) => !val || HEX_COLOR_REGEX.test(val), {
        message: m("اللون الثانوي يجب أن يكون كود HEX صالح (مثال: #d97706)", "Secondary color must be a valid HEX code (e.g. #d97706)"),
      }),
  });
}

export const officeSchema = createOfficeSchema(false);

export type OfficeFormValues = z.infer<typeof officeSchema>;

/**
 * Detailed checklist rules for real-time validation tracking in the UI box
 */
export interface FieldRuleCheck {
  id: string;
  label: string;
  isValid: boolean;
}

export function formatArabicCount(count: number, unit: "رقم" | "حرف" | "خانة"): string {
  if (unit === "رقم") {
    if (count === 1) return "رقمًا واحدًا";
    if (count === 2) return "رقمين";
    if (count >= 3 && count <= 10) return `${count} أرقام`;
    return `${count} رقمًا`;
  }
  if (unit === "حرف") {
    if (count === 1) return "حرفًا واحدًا";
    if (count === 2) return "حرفين";
    if (count >= 3 && count <= 10) return `${count} أحرف`;
    return `${count} حرفًا`;
  }
  // unit === "خانة"
  if (count === 1) return "خانة واحدة";
  if (count === 2) return "خانتين";
  if (count >= 3 && count <= 10) return `${count} خانات`;
  return `${count} خانة`;
}

export function formatArabicDiff(target: number, current: number, unit: "رقم" | "حرف" | "خانة"): string {
  if (target === current) return "";
  const diff = target - current;
  if (diff > 0) {
    if (unit === "رقم") {
      if (diff === 1) return " (ناقص رقم واحد)";
      if (diff === 2) return " (ناقص رقمين)";
      if (diff >= 3 && diff <= 10) return ` (ناقص ${diff} أرقام)`;
      return ` (ناقص ${diff} رقمًا)`;
    }
    if (unit === "حرف") {
      if (diff === 1) return " (ناقص حرف واحد)";
      if (diff === 2) return " (ناقص حرفين)";
      if (diff >= 3 && diff <= 10) return ` (ناقص ${diff} أحرف)`;
      return ` (ناقص ${diff} حرفًا)`;
    }
    if (diff === 1) return " (ناقص خانة واحدة)";
    if (diff === 2) return " (ناقص خانتين)";
    if (diff >= 3 && diff <= 10) return ` (ناقص ${diff} خانات)`;
    return ` (ناقص ${diff} خانة)`;
  } else {
    const extra = Math.abs(diff);
    if (unit === "رقم") {
      if (extra === 1) return " (زيادة رقم واحد)";
      if (extra === 2) return " (زيادة رقمين)";
      if (extra >= 3 && extra <= 10) return ` (زيادة ${extra} أرقام)`;
      return ` (زيادة ${extra} رقمًا)`;
    }
    if (unit === "حرف") {
      if (extra === 1) return " (زيادة حرف واحد)";
      if (extra === 2) return " (زيادة حرفين)";
      if (extra >= 3 && extra <= 10) return ` (زيادة ${extra} أحرف)`;
      return ` (زيادة ${extra} حرفًا)`;
    }
    if (extra === 1) return " (زيادة خانة واحدة)";
    if (extra === 2) return " (زيادة خانتين)";
    if (extra >= 3 && extra <= 10) return ` (زيادة ${extra} خانات)`;
    return ` (زيادة ${extra} خانة)`;
  }
}

export interface FieldValidationStatus {
  name: keyof OfficeFormValues;
  title: string;
  shortTitle: string;
  detailHeader: string;
  iconName: string;
  isFilled: boolean;
  isValid: boolean;
  errorMessage?: string;
  rules: FieldRuleCheck[];
}

export function evaluateFieldRules(
  fieldName: keyof OfficeFormValues,
  value: string,
  isEn = false
): FieldValidationStatus {
  const m = (ar: string, en: string) => (isEn ? en : ar);
  const norm = typeof value === "string" ? normalizeArabicDigits(value.trim()) : "";
  const raw = typeof value === "string" ? value : "";
  const isFilled = raw.trim().length > 0;

  switch (fieldName) {
    case "ownerName": {
      const len = raw.trim().length;
      const r1 = len >= 4 && len <= 40;
      const r2 = LETTERS_AND_SPACES_REGEX.test(raw.trim()) && CONTAINS_LETTER_REGEX.test(raw.trim());
      const r3 = !/\d/.test(raw) && !CONTAINS_SYMBOL_REGEX.test(raw);
      const isValid = isFilled && r1 && r2 && r3;
      let errorMessage: string | undefined;
      if (isFilled && !r1) errorMessage = m("يجب أن يكون الاسم من 4 إلى 40 حرفاً", "Name must be between 4 and 40 characters");
      else if (isFilled && !r2) errorMessage = m("حروف عربي وإنجليزي ومسافات ونقاط فقط بدون أرقام أو رموز خاصة", "Letters, spaces and dots only, no digits or symbols");
      
      const detailHeader = !isFilled
        ? m("صاحب المكتب: بانتظار الإدخال", "Owner Name: Waiting for input")
        : isValid
        ? m(`صاحب المكتب: مكتمل (${formatArabicCount(len, "حرف")})`, `Owner Name: Valid (${len} chars)`)
        : m(`صاحب المكتب: أدخلت ${formatArabicCount(len, "حرف")}`, `Owner Name: Entered ${len} chars`);

      return {
        name: "ownerName",
        title: m("اسم صاحب المكتب", "Owner Name"),
        shortTitle: m("صاحب المكتب", "Owner"),
        detailHeader,
        iconName: "User",
        isFilled,
        isValid,
        errorMessage,
        rules: [
          { id: "char", label: m("حروف ومسافات ونقاط فقط", "Letters, spaces & dots only"), isValid: isFilled && r2 },
          {
            id: "len",
            label: isEn
              ? `Must be between 4 and 40 characters${len < 4 ? ` (${4 - len} more needed)` : len > 40 ? ` (${len - 40} extra)` : ""}`
              : `يجب أن يكون بين 4 و 40 حرفًا${len < 4 ? formatArabicDiff(4, len, "حرف") : len > 40 ? formatArabicDiff(40, len, "حرف") : ""}`,
            isValid: isFilled && r1,
          },
          { id: "no_symbols", label: m("بدون أرقام أو رموز", "No digits or symbols"), isValid: isFilled && r3 },
        ],
      };
    }

    case "firmName": {
      const len = raw.trim().length;
      const r1 = len >= 4 && len <= 40;
      const r2 = LETTERS_AND_SPACES_REGEX.test(raw.trim()) && CONTAINS_LETTER_REGEX.test(raw.trim());
      const r3 = !CONTAINS_SYMBOL_REGEX.test(raw);
      const isValid = isFilled && r1 && r2 && r3;
      let errorMessage: string | undefined;
      if (isFilled && !r1) errorMessage = m("يجب أن يكون اسم المكتب من 4 إلى 40 حرفاً", "Office name must be between 4 and 40 characters");
      else if (isFilled && !r2) errorMessage = m("حروف ومسافات ونقاط فقط بدون أرقام أو رموز خاصة", "Letters, spaces and dots only, no digits or special symbols");

      const detailHeader = !isFilled
        ? m("اسم المكتب: بانتظار الإدخال", "Office Name: Waiting for input")
        : isValid
        ? m(`اسم المكتب: مكتمل (${formatArabicCount(len, "حرف")})`, `Office Name: Valid (${len} chars)`)
        : m(`اسم المكتب: أدخلت ${formatArabicCount(len, "حرف")}`, `Office Name: Entered ${len} chars`);

      return {
        name: "firmName",
        title: m("اسم المكتب أو المنشأة", "Law Office Name"),
        shortTitle: m("اسم المكتب", "Office Name"),
        detailHeader,
        iconName: "Building2",
        isFilled,
        isValid,
        errorMessage,
        rules: [
          { id: "char", label: m("حروف ومسافات ونقاط فقط", "Letters, spaces & dots only"), isValid: isFilled && r2 },
          {
            id: "len",
            label: isEn
              ? `Must be between 4 and 40 characters${len < 4 ? ` (${4 - len} more needed)` : len > 40 ? ` (${len - 40} extra)` : ""}`
              : `يجب أن يكون بين 4 و 40 حرفًا${len < 4 ? formatArabicDiff(4, len, "حرف") : len > 40 ? formatArabicDiff(40, len, "حرف") : ""}`,
            isValid: isFilled && r1,
          },
          { id: "no_symbols", label: m("بدون رموز خاصة", "No special symbols"), isValid: isFilled && r3 },
        ],
      };
    }

    case "licenseNumber": {
      const r1 = LICENSE_REGEX.test(norm);
      const r2 = CONTAINS_DIGIT_REGEX.test(norm);
      const r3 = norm.length <= 15 && norm.length >= 1;
      const isValid = isFilled && r1 && r2 && r3;
      let errorMessage: string | undefined;
      if (isFilled && !r1) errorMessage = m("أرقام ورمز / فقط بحد أقصى 15 خانة", "Digits and / only (max 15 chars)");
      else if (isFilled && !r2) errorMessage = m("يجب أن يحتوي على رقم واحد على الأقل", "Must contain at least one digit");

      const detailHeader = !isFilled
        ? m("رقم الترخيص: بانتظار الإدخال", "License No.: Waiting for input")
        : isValid
        ? m(`رقم الترخيص: صيغة معتمدة (${formatArabicCount(norm.length, "خانة")})`, `License No.: Valid (${norm.length} chars)`)
        : m(`رقم الترخيص: أدخلت ${formatArabicCount(norm.length, "خانة")}`, `License No.: Entered ${norm.length} chars`);

      return {
        name: "licenseNumber",
        title: m("رقم الترخيص العدلي", "Legal License Number"),
        shortTitle: m("رقم الترخيص", "License No."),
        detailHeader,
        iconName: "Scale",
        isFilled,
        isValid,
        errorMessage,
        rules: [
          { id: "char", label: m("أرقام ورمز / فقط", "Digits and / only"), isValid: isFilled && r1 },
          { id: "digit", label: m("يحتوي على رقم واحد على الأقل", "Contains at least one digit"), isValid: isFilled && r2 },
          { id: "len", label: m("بحد أقصى 15 خانة", "Max 15 characters"), isValid: isFilled && r3 },
        ],
      };
    }

    case "taxNumber": {
      const isDigitsOnly = /^\d+$/.test(norm);
      const isExact15 = norm.length === 15;
      const noSpacesOrSymbols = !/\s/.test(raw) && !/[^\d\u0660-\u0669]/.test(raw);
      const isValid = isFilled && isDigitsOnly && isExact15;
      let errorMessage: string | undefined;
      if (isFilled && !isDigitsOnly) errorMessage = m("أرقام فقط بدون حروف أو رموز", "Digits only, no letters or symbols");
      else if (isFilled && norm.length !== 15) errorMessage = m(`15 رقماً بالضبط (المكتوب: ${norm.length})`, `Exactly 15 digits (entered: ${norm.length})`);

      const detailHeader = !isFilled
        ? m("الرقم الضريبي: بانتظار الإدخال", "Tax No.: Waiting for input")
        : isValid
        ? m("الرقم الضريبي: مكتمل (15 رقمًا)", "Tax No.: Complete (15 digits)")
        : m(`الرقم الضريبي: أدخلت ${formatArabicCount(norm.length, "رقم")}`, `Tax No.: Entered ${norm.length} digits`);

      return {
        name: "taxNumber",
        title: m("الرقم الضريبي للمنشأة", "Entity Tax Number"),
        shortTitle: m("الرقم الضريبي", "Tax Number"),
        detailHeader,
        iconName: "Hash",
        isFilled,
        isValid,
        errorMessage,
        rules: [
          { id: "digits", label: m("أرقام فقط", "Digits only"), isValid: isFilled && isDigitsOnly },
          {
            id: "len",
            label: isEn
              ? `Must be exactly 15 digits${norm.length < 15 ? ` (${15 - norm.length} left)` : norm.length > 15 ? ` (${norm.length - 15} extra)` : ""}`
              : `يجب أن تتكوّن من 15 رقمًا بالضبط${formatArabicDiff(15, norm.length, "رقم")}`,
            isValid: isFilled && isExact15,
          },
          { id: "no_symbols", label: m("بدون مسافات أو رموز", "No spaces or symbols"), isValid: isFilled && noSpacesOrSymbols },
        ],
      };
    }

    case "email": {
      const noSpaces = !/\s/.test(raw);
      const maxLen = raw.trim().length <= 254 && raw.trim().length > 0;
      const parts = raw.trim().split("@");
      const localValid =
        parts.length === 2 &&
        parts[0].length >= 1 &&
        parts[0].length <= 64 &&
        !parts[0].startsWith(".") &&
        !parts[0].endsWith(".") &&
        !parts[0].includes("..");
      let domainValid = false;
      if (parts.length === 2) {
        const domain = parts[1];
        if (!domain.startsWith(".") && !domain.endsWith(".") && !domain.includes("..")) {
          const domParts = domain.split(".");
          if (domParts.length >= 2) {
            const tld = domParts[domParts.length - 1];
            domainValid = /^[a-zA-Z]{2,}$/.test(tld);
          }
        }
      }
      const isValid = isFilled && noSpaces && maxLen && localValid && domainValid;
      let errorMessage: string | undefined;
      if (isFilled && !noSpaces) errorMessage = m("البريد الإلكتروني لا يمكن أن يحتوي على مسافات", "Email cannot contain spaces");
      else if (isFilled && !raw.includes("@")) errorMessage = m("صيغة غير مكتملة (ناقص @)", "Incomplete format (missing @)");
      else if (isFilled && !localValid) errorMessage = m("اسم المستخدم قبل @ غير صالح (بين 1 و 64 حرفاً)", "Invalid username before @ (1 to 64 chars)");
      else if (isFilled && !domainValid) errorMessage = m("امتداد الدومين يجب أن يكون بحرفين أو أكثر بنقطة صحيحة", "Domain extension must be 2+ letters with a dot");

      const detailHeader = !isFilled
        ? m("البريد الإلكتروني: بانتظار الإدخال", "Email: Waiting for input")
        : isValid
        ? m("البريد الإلكتروني: بريد رسمي معتمد", "Email: Verified format")
        : m("البريد الإلكتروني: صيغة غير مكتملة", "Email: Incomplete format");

      return {
        name: "email",
        title: m("البريد الإلكتروني الرسمي", "Official Email"),
        shortTitle: m("البريد الإلكتروني", "Email"),
        detailHeader,
        iconName: "Mail",
        isFilled,
        isValid,
        errorMessage,
        rules: [
          { id: "at", label: m("صيغة بريد صحيحة تحتوي على @", "Valid email containing @"), isValid: isFilled && raw.includes("@") && localValid },
          { id: "domain", label: m("دومين مع امتداد بحرفين أو أكثر", "Domain with 2+ letter extension"), isValid: isFilled && domainValid },
          { id: "no_spaces", label: m("بدون مسافات", "No spaces"), isValid: isFilled && noSpaces },
        ],
      };
    }

    case "phone": {
      let normDigits = norm.replace(/\s+/g, "");
      if (normDigits.startsWith("+966")) normDigits = normDigits.slice(4);
      if (normDigits.startsWith("00966")) normDigits = normDigits.slice(5);
      if (normDigits.startsWith("966")) normDigits = normDigits.slice(3);
      if (normDigits.startsWith("0")) normDigits = normDigits.slice(1);

      const starts5 = normDigits.startsWith("5");
      const isExact9 = normDigits.length === 9 && /^\d+$/.test(normDigits);
      const noSpacesOrSymbols = !/[^\d\u0660-\u0669\s+]/.test(raw);
      const isValid = isFilled && starts5 && isExact9;
      let errorMessage: string | undefined;
      if (isFilled && !starts5) errorMessage = m("رقم الجوال يجب أن يبدأ بـ 5 (بدون الصفر)", "Mobile number must start with 5 (without zero)");
      else if (isFilled && normDigits.length !== 9) errorMessage = m(`9 أرقام بالضبط بدون الصفر (المكتوب: ${normDigits.length})`, `Exactly 9 digits without zero (entered: ${normDigits.length})`);

      const detailHeader = !isFilled
        ? m("رقم الجوال: بانتظار الإدخال", "Mobile: Waiting for input")
        : isValid
        ? m("رقم الجوال: رقم جوال معتمد", "Mobile: Valid number")
        : m(`رقم الجوال: أدخلت ${formatArabicCount(normDigits.length, "رقم")}`, `Mobile: Entered ${normDigits.length} digits`);

      return {
        name: "phone",
        title: m("رقم الجوال للتواصل", "Contact Mobile Number"),
        shortTitle: m("رقم الجوال", "Mobile"),
        detailHeader,
        iconName: "Phone",
        isFilled,
        isValid,
        errorMessage,
        rules: [
          { id: "prefix", label: m("يبدأ بـ 5 (بدون 0)", "Starts with 5 (without 0)"), isValid: isFilled && starts5 },
          {
            id: "len",
            label: isEn
              ? `Must be exactly 9 digits${normDigits.length < 9 ? ` (${9 - normDigits.length} left)` : normDigits.length > 9 ? ` (${normDigits.length - 9} extra)` : ""}`
              : `يجب أن يتكوّن من 9 أرقام بالضبط${formatArabicDiff(9, normDigits.length, "رقم")}`,
            isValid: isFilled && isExact9,
          },
          { id: "no_symbols", label: m("أرقام فقط بدون رموز خاصة", "Digits only, no symbols"), isValid: isFilled && noSpacesOrSymbols },
        ],
      };
    }

    case "landline": {
      const startsCode = /^01[123467]/.test(norm);
      const isCorrectLength = (norm.length === 9 || norm.length === 10) && /^\d+$/.test(norm);
      const noSpacesOrSymbols = !/\s/.test(raw) && !/[^\d\u0660-\u0669]/.test(raw);
      const isValid = isFilled && startsCode && isCorrectLength;
      let errorMessage: string | undefined;
      if (isFilled && !startsCode) errorMessage = m("يجب أن يبدأ برمز منطقة سعودي (011، 012، 013، 014، 016، 017)", "Must start with Saudi area code (011, 012, 013, 014, 016, 017)");
      else if (isFilled && !isCorrectLength) errorMessage = m(`9 أو 10 أرقام (المكتوب: ${norm.length})`, `9 or 10 digits (entered: ${norm.length})`);

      const detailHeader = !isFilled
        ? m("الهاتف المكتبي: بانتظار الإدخال", "Landline: Waiting for input")
        : isValid
        ? m(`الهاتف المكتبي: هاتف مكتبي معتمد (${norm.length} أرقام)`, `Landline: Valid (${norm.length} digits)`)
        : m(`الهاتف المكتبي: أدخلت ${formatArabicCount(norm.length, "رقم")}`, `Landline: Entered ${norm.length} digits`);

      return {
        name: "landline",
        title: m("الهاتف المكتبي المباشر", "Direct Office Landline"),
        shortTitle: m("الهاتف المكتبي", "Landline"),
        detailHeader,
        iconName: "PhoneCall",
        isFilled,
        isValid,
        errorMessage,
        rules: [
          { id: "code", label: m("يبدأ برمز منطقة سعودي (011، 012، 013، ...)", "Starts with Saudi area code (011, 012, ...)"), isValid: isFilled && startsCode },
          {
            id: "len",
            label: isEn
              ? isCorrectLength
                ? `${norm.length} digits (valid)`
                : `Must be 9 or 10 digits`
              : isCorrectLength
              ? `يتكوّن من ${norm.length} أرقام (مكتمل)`
              : `يجب أن يتكوّن من 9 أو 10 أرقام${norm.length < 9 ? formatArabicDiff(9, norm.length, "رقم") : formatArabicDiff(10, norm.length, "رقم")}`,
            isValid: isFilled && isCorrectLength,
          },
          { id: "no_symbols", label: m("أرقام فقط بدون مسافات أو رموز", "Digits only, no spaces or symbols"), isValid: isFilled && noSpacesOrSymbols },
        ],
      };
    }

    case "city": {
      const cleanCity = raw.replace("المملكة العربية السعودية - ", "").trim();
      const inList = SAUDI_CITIES.includes(cleanCity);
      const isValid = isFilled && inList;
      const displayCity = getLocalizedCityName(cleanCity, isEn);
      let errorMessage: string | undefined;
      if (isFilled && !inList) errorMessage = m("يرجى اختيار مدينة صحيحة من القائمة", "Please select a valid city from the list");

      const detailHeader = !isFilled
        ? m("المدينة: بانتظار الاختيار", "City: Waiting for selection")
        : isValid
        ? m(`المدينة: تم اختيار ${displayCity}`, `City: Selected ${displayCity}`)
        : m("المدينة: مدينة غير مدرجة", "City: Unlisted city");

      return {
        name: "city",
        title: m("المدينة / المقر الرئيسي", "City / Headquarters"),
        shortTitle: m("المدينة", "City"),
        detailHeader,
        iconName: "MapPin",
        isFilled,
        isValid,
        errorMessage,
        rules: [
          { id: "select", label: m("اختيار مدينة معتمدة من القائمة", "Select a valid city from the list"), isValid: isFilled && inList },
          { id: "saudi", label: m("تابعة لمناطق ومحافظات المملكة العربية السعودية", "Located in Saudi Arabia regions"), isValid: isFilled && inList },
        ],
      };
    }

    case "address": {
      const len = raw.trim().length;
      const rLen = len >= 5 && len <= 30;
      const rLetter = CONTAINS_LETTER_REGEX.test(raw);
      const isValid = isFilled && rLen && rLetter;
      let errorMessage: string | undefined;
      if (isFilled && !rLen) errorMessage = m("العنوان يجب أن يكون من 5 إلى 30 حرفاً", "Address must be between 5 and 30 characters");
      else if (isFilled && !rLetter) errorMessage = m("يجب أن يحتوي على حرف واحد على الأقل (عربي أو إنجليزي)", "Must contain at least one letter");

      const detailHeader = !isFilled
        ? m("العنوان: بانتظار الإدخال", "Address: Waiting for input")
        : isValid
        ? m(`العنوان: مقر موثق (${formatArabicCount(len, "حرف")})`, `Address: Valid (${len} chars)`)
        : m(`العنوان: أدخلت ${formatArabicCount(len, "حرف")}`, `Address: Entered ${len} chars`);

      return {
        name: "address",
        title: m("العنوان الوطني ومقر المكتب", "National Address"),
        shortTitle: m("العنوان", "Address"),
        detailHeader,
        iconName: "MapPin",
        isFilled,
        isValid,
        errorMessage,
        rules: [
          {
            id: "len",
            label: isEn
              ? `Must be 5 to 30 characters${len < 5 ? ` (${5 - len} left)` : len > 30 ? ` (${len - 30} extra)` : ""}`
              : `يجب أن يكون من 5 إلى 30 حرفًا${len < 5 ? formatArabicDiff(5, len, "حرف") : len > 30 ? formatArabicDiff(30, len, "حرف") : ""}`,
            isValid: isFilled && rLen,
          },
          { id: "letter", label: m("يحتوي على حرف واحد على الأقل", "Contains at least one letter"), isValid: isFilled && rLetter },
          { id: "desc", label: m("وصف دقيق للمقر أو العنوان الوطني", "Clear office location description"), isValid: isFilled && rLen && rLetter },
        ],
      };
    }

    case "password": {
      const noSpaces = !/\s/.test(raw);
      const rLen = raw.length >= 9 && raw.length <= 20;
      const rLetter = CONTAINS_LETTER_REGEX.test(raw);
      const rDigit = CONTAINS_DIGIT_REGEX.test(raw);
      const rSymbol = CONTAINS_SYMBOL_REGEX.test(raw);
      const isValid = isFilled && noSpaces && rLen && rLetter && rDigit && rSymbol;
      let errorMessage: string | undefined;
      if (isFilled && !noSpaces) errorMessage = m("لا يسمح بوجود مسافات في كلمة المرور", "Spaces are not allowed in password");
      else if (isFilled && !rLen) errorMessage = m(`بين 9 و 20 خانة (المكتوب: ${raw.length})`, `Between 9 and 20 chars (entered: ${raw.length})`);
      else if (isFilled && (!rLetter || !rDigit || !rSymbol)) errorMessage = m("يجب أن تتضمن حرفاً ورقماً ورمزاً خاصاً", "Must include a letter, digit, and special symbol");

      const detailHeader = !isFilled
        ? m("كلمة المرور: بانتظار الإدخال", "Password: Waiting for input")
        : isValid
        ? m("كلمة المرور: كلمة مرور قوية وآمنة", "Password: Strong & secure")
        : m("كلمة المرور: متطلبات الأمان غير مكتملة", "Password: Security rules incomplete");

      return {
        name: "password",
        title: m("كلمة المرور الأولية", "Initial Password"),
        shortTitle: m("كلمة المرور", "Password"),
        detailHeader,
        iconName: "Hash",
        isFilled,
        isValid,
        errorMessage,
        rules: [
          { id: "len", label: m("من 9 إلى 20 خانة بدون مسافات", "9 to 20 chars without spaces"), isValid: isFilled && noSpaces && rLen },
          { id: "char_digit", label: m("تحتوي على حروف وأرقام", "Contains letters and digits"), isValid: isFilled && rLetter && rDigit },
          { id: "symbol", label: m("تحتوي على رمز خاص واحد على الأقل (@$!%*?&)", "Contains at least one special symbol (@$!%*?&)"), isValid: isFilled && rSymbol },
        ],
      };
    }

    case "officeId": {
      const len = raw.trim().length;
      const rLen = len >= 3 && len <= 40;
      const rChars = OFFICE_ID_REGEX.test(raw.trim());
      const isValid = isFilled && rLen && rChars;
      let errorMessage: string | undefined;
      if (isFilled && !rLen) errorMessage = m("يجب أن يكون معرّف المكتب من 3 إلى 40 خانة", "Office ID must be 3 to 40 chars");
      else if (isFilled && !rChars) errorMessage = m("حروف إنجليزية وأرقام وشرطة (-) فقط بدون مسافات", "English letters, digits, and hyphen (-) only");

      const detailHeader = !isFilled
        ? m("معرّف المكتب: بانتظار الإدخال", "Office ID: Waiting for input")
        : isValid
        ? m(`معرّف المكتب: مكتمل (${formatArabicCount(len, "خانة")})`, `Office ID: Valid (${len} chars)`)
        : m(`معرّف المكتب: أدخلت ${formatArabicCount(len, "خانة")}`, `Office ID: Entered ${len} chars`);

      return {
        name: "officeId",
        title: m("معرّف المكتب الفريد (Office ID / Slug)", "Unique Office ID / Slug"),
        shortTitle: m("المعرّف", "ID"),
        detailHeader,
        iconName: "Hash",
        isFilled,
        isValid,
        errorMessage,
        rules: [
          { id: "len", label: m("الطول بين 3 و 40 خانة", "Length 3 to 40 chars"), isValid: isFilled && rLen },
          { id: "chars", label: m("حروف إنجليزية وأرقام وشرطة (-) فقط", "English letters, digits, and hyphen (-) only"), isValid: isFilled && rChars },
        ],
      };
    }

    case "primaryColor":
    case "secondaryColor": {
      const isValid = !raw || HEX_COLOR_REGEX.test(raw.trim());
      return {
        name: fieldName,
        title: fieldName === "primaryColor" ? m("اللون الأساسي", "Primary Color") : m("اللون الثانوي", "Secondary Color"),
        shortTitle: fieldName === "primaryColor" ? m("الأساسي", "Primary") : m("الثانوي", "Secondary"),
        detailHeader: isValid ? m("كود لون معتمد", "Valid color code") : m("كود لون غير صالح", "Invalid color code"),
        iconName: "Palette",
        isFilled,
        isValid,
        errorMessage: isValid ? undefined : m("كود Hex غير صالح (مثال: #9c6402)", "Invalid Hex code (e.g. #9c6402)"),
        rules: [
          { id: "hex", label: m("كود HEX صالح (#RGB أو #RRGGBB)", "Valid HEX code (#RGB or #RRGGBB)"), isValid },
        ],
      };
    }
  }
}
