import { z } from "zod";
import { SAUDI_CITIES, normalizeArabicDigits } from "../constants/saudi-cities";

// Regex for Arabic & English letters and spaces only (NO numbers, NO punctuation)
// Note: \u0621-\u064A covers Arabic alphabet without Arabic numerals \u0660-\u0669
export const LETTERS_AND_SPACES_REGEX = /^[\u0621-\u064Aa-zA-Z ]+$/;

// License: digits and / only, 1-15 chars, must contain at least one digit
export const LICENSE_REGEX = /^[\d/]{1,15}$/;

// Saudi mobile: 05 followed by 8 digits (total 10 digits)
export const SAUDI_PHONE_REGEX = /^05\d{8}$/;

// Saudi landline: 01 + [1,2,3,4,6,7] + 6 or 7 digits (total 9 or 10 digits)
export const SAUDI_LANDLINE_REGEX = /^01[123467]\d{6,7}$/;


// Has at least one letter (Arabic or English)
export const CONTAINS_LETTER_REGEX = /[a-zA-Z\u0621-\u064A]/;

// Has at least one digit
export const CONTAINS_DIGIT_REGEX = /\d/;

// Has at least one symbol (non-alphanumeric, non-space)
export const CONTAINS_SYMBOL_REGEX = /[^a-zA-Z0-9\u0621-\u064A\s]/;

export const officeSchema = z.object({
  ownerName: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, {
      message: "اسم صاحب المكتب مطلوب",
    })
    .refine((val) => val.length >= 5 && val.length <= 30, {
      message: "اسم صاحب المكتب يجب أن يكون من 5 إلى 30 حرفاً",
    })
    .refine((val) => LETTERS_AND_SPACES_REGEX.test(val), {
      message: "اسم صاحب المكتب يقبل حروفاً ومسافات فقط، بدون أرقام أو رموز",
    }),

  firmName: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, {
      message: "اسم المكتب مطلوب",
    })
    .refine((val) => val.length >= 5 && val.length <= 40, {
      message: "اسم المكتب يجب أن يكون من 5 إلى 40 حرفاً",
    })
    .refine((val) => LETTERS_AND_SPACES_REGEX.test(val), {
      message: "اسم المكتب يقبل حروفاً ومسافات فقط، بدون أرقام أو رموز",
    }),

  licenseNumber: z
    .string()
    .transform((val) => normalizeArabicDigits(val.trim()))
    .refine((val) => val.length > 0, {
      message: "رقم الترخيص مطلوب",
    })
    .refine((val) => LICENSE_REGEX.test(val), {
      message: "رقم الترخيص يقبل أرقاماً ورمز / فقط بحد أقصى 15 خانة",
    })
    .refine((val) => CONTAINS_DIGIT_REGEX.test(val), {
      message: "رقم الترخيص يجب أن يحتوي على رقم واحد على الأقل",
    }),

  taxNumber: z
    .string()
    .transform((val) => normalizeArabicDigits(val.trim()))
    .refine((val) => val.length > 0, {
      message: "الرقم الضريبي مطلوب",
    })
    .refine((val) => /^\d+$/.test(val), {
      message: "الرقم الضريبي يجب أن يتكون من أرقام فقط",
    })
    .refine((val) => val.length === 15, {
      message: "الرقم الضريبي يجب أن يكون 15 رقماً بالضبط",
    }),

  email: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, {
      message: "البريد الإلكتروني مطلوب",
    })
    .refine((val) => !/\s/.test(val), {
      message: "البريد الإلكتروني لا يمكن أن يحتوي على مسافات",
    })
    .refine((val) => val.length <= 254, {
      message: "البريد الإلكتروني لا يجب أن يتجاوز 254 حرفاً",
    })
    .refine((val) => {
      const parts = val.split("@");
      return parts.length === 2 && parts[0].length >= 1 && parts[0].length <= 64;
    }, {
      message: "الجزء قبل @ يجب أن يكون بين 1 و 64 حرفاً وبدون تكرار @",
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
      message: "الدومين غير صالح؛ يجب أن يحتوي على نقطة وامتداد بحرفين أو أكثر بدون نقاط متتالية",
    }),

  phone: z
    .string()
    .transform((val) => {
      let norm = normalizeArabicDigits(val.trim()).replace(/\s+/g, "");
      if (norm.startsWith("+966")) norm = norm.slice(4);
      if (/^5\d{8}$/.test(norm)) norm = `0${norm}`;
      return norm;
    })
    .refine((val) => val.length > 0, {
      message: "رقم الجوال مطلوب",
    })
    .refine((val) => val.startsWith("05"), {
      message: "رقم الجوال يجب أن يبدأ بـ 05",
    })
    .refine((val) => SAUDI_PHONE_REGEX.test(val), {
      message: "رقم الجوال يجب أن يكون 10 أرقام بالضبط ويبدأ بـ 05 (مثال: 0512345678)",
    }),

  landline: z
    .string()
    .transform((val) => normalizeArabicDigits(val.trim()))
    .refine((val) => val.length > 0, {
      message: "الهاتف المكتبي المباشر مطلوب",
    })
    .refine((val) => /^01[123467]/.test(val), {
      message: "الهاتف المكتبي يجب أن يبدأ برمز منطقة سعودي (011، 012، 013، 014، 016، 017)",
    })
    .refine((val) => SAUDI_LANDLINE_REGEX.test(val), {
      message: "الهاتف المكتبي يجب أن يكون 9 أو 10 أرقام (مثال: 011482990 أو 0114829900)",
    }),

  city: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, {
      message: "يرجى اختيار المدينة",
    })
    .refine((val) => SAUDI_CITIES.includes(val.replace("المملكة العربية السعودية - ", "").trim()), {
      message: "يرجى اختيار مدينة صحيحة من قائمة المدن المتاحة",
    }),

  address: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, {
      message: "العنوان مطلوب",
    })
    .refine((val) => val.length >= 5 && val.length <= 30, {
      message: "العنوان يجب أن يكون من 5 إلى 30 حرفاً",
    })
    .refine((val) => CONTAINS_LETTER_REGEX.test(val), {
      message: "العنوان يجب أن يحتوي على حرف واحد على الأقل (عربي أو إنجليزي)",
    }),

  password: z
    .string()
    .refine((val) => val.length > 0, {
      message: "كلمة المرور مطلوبة",
    })
    .refine((val) => !/\s/.test(val), {
      message: "كلمة المرور يجب ألا تحتوي على مسافات",
    })
    .refine((val) => val.length >= 9 && val.length <= 20, {
      message: "كلمة المرور يجب أن تكون بين 9 و 20 خانة",
    })
    .refine((val) => CONTAINS_LETTER_REGEX.test(val), {
      message: "كلمة المرور يجب أن تحتوي على حرف واحد على الأقل",
    })
    .refine((val) => CONTAINS_DIGIT_REGEX.test(val), {
      message: "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل",
    })
    .refine((val) => CONTAINS_SYMBOL_REGEX.test(val), {
      message: "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل (مثل: !@#$%^&*)",
    }),
});

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
  value: string
): FieldValidationStatus {
  const norm = typeof value === "string" ? normalizeArabicDigits(value.trim()) : "";
  const raw = typeof value === "string" ? value : "";
  const isFilled = raw.trim().length > 0;

  switch (fieldName) {
    case "ownerName": {
      const len = raw.trim().length;
      const r1 = len >= 5 && len <= 30;
      const r2 = LETTERS_AND_SPACES_REGEX.test(raw.trim());
      const r3 = !/\d/.test(raw) && !CONTAINS_SYMBOL_REGEX.test(raw);
      const isValid = isFilled && r1 && r2;
      let errorMessage: string | undefined;
      if (isFilled && !r1) errorMessage = "يجب أن يكون الاسم من 5 إلى 30 حرفاً";
      else if (isFilled && !r2) errorMessage = "حروف عربي وإنجليزي ومسافات فقط بدون أرقام أو رموز";
      
      const detailHeader = !isFilled
        ? "صاحب المكتب: بانتظار الإدخال"
        : isValid
        ? `صاحب المكتب: مكتمل (${formatArabicCount(len, "حرف")})`
        : `صاحب المكتب: أدخلت ${formatArabicCount(len, "حرف")}`;

      return {
        name: "ownerName",
        title: "اسم صاحب المكتب",
        shortTitle: "صاحب المكتب",
        detailHeader,
        iconName: "User",
        isFilled,
        isValid,
        errorMessage,
        rules: [
          { id: "char", label: "حروف ومسافات فقط", isValid: isFilled && r2 },
          {
            id: "len",
            label: `يجب أن يكون بين 5 و 30 حرفًا${len < 5 ? formatArabicDiff(5, len, "حرف") : len > 30 ? formatArabicDiff(30, len, "حرف") : ""}`,
            isValid: isFilled && r1,
          },
          { id: "no_symbols", label: "بدون أرقام أو رموز", isValid: isFilled && r3 },
        ],
      };
    }

    case "firmName": {
      const len = raw.trim().length;
      const r1 = len >= 5 && len <= 40;
      const r2 = LETTERS_AND_SPACES_REGEX.test(raw.trim());
      const r3 = !CONTAINS_SYMBOL_REGEX.test(raw);
      const isValid = isFilled && r1 && r2;
      let errorMessage: string | undefined;
      if (isFilled && !r1) errorMessage = "يجب أن يكون اسم المكتب من 5 إلى 40 حرفاً";
      else if (isFilled && !r2) errorMessage = "حروف ومسافات فقط بدون أرقام أو رموز";

      const detailHeader = !isFilled
        ? "اسم المكتب: بانتظار الإدخال"
        : isValid
        ? `اسم المكتب: مكتمل (${formatArabicCount(len, "حرف")})`
        : `اسم المكتب: أدخلت ${formatArabicCount(len, "حرف")}`;

      return {
        name: "firmName",
        title: "اسم المكتب أو المنشأة",
        shortTitle: "اسم المكتب",
        detailHeader,
        iconName: "Building2",
        isFilled,
        isValid,
        errorMessage,
        rules: [
          { id: "char", label: "حروف ومسافات فقط", isValid: isFilled && r2 },
          {
            id: "len",
            label: `يجب أن يكون بين 5 و 40 حرفًا${len < 5 ? formatArabicDiff(5, len, "حرف") : len > 40 ? formatArabicDiff(40, len, "حرف") : ""}`,
            isValid: isFilled && r1,
          },
          { id: "no_symbols", label: "بدون رموز خاصة", isValid: isFilled && r3 },
        ],
      };
    }

    case "licenseNumber": {
      const r1 = LICENSE_REGEX.test(norm);
      const r2 = CONTAINS_DIGIT_REGEX.test(norm);
      const r3 = norm.length <= 15 && norm.length >= 1;
      const isValid = isFilled && r1 && r2 && r3;
      let errorMessage: string | undefined;
      if (isFilled && !r1) errorMessage = "أرقام ورمز / فقط بحد أقصى 15 خانة";
      else if (isFilled && !r2) errorMessage = "يجب أن يحتوي على رقم واحد على الأقل";

      const detailHeader = !isFilled
        ? "رقم الترخيص: بانتظار الإدخال"
        : isValid
        ? `رقم الترخيص: صيغة معتمدة (${formatArabicCount(norm.length, "خانة")})`
        : `رقم الترخيص: أدخلت ${formatArabicCount(norm.length, "خانة")}`;

      return {
        name: "licenseNumber",
        title: "رقم الترخيص العدلي",
        shortTitle: "رقم الترخيص",
        detailHeader,
        iconName: "Scale",
        isFilled,
        isValid,
        errorMessage,
        rules: [
          { id: "char", label: "أرقام ورمز / فقط", isValid: isFilled && r1 },
          { id: "digit", label: "يحتوي على رقم واحد على الأقل", isValid: isFilled && r2 },
          { id: "len", label: "بحد أقصى 15 خانة", isValid: isFilled && r3 },
        ],
      };
    }

    case "taxNumber": {
      const isDigitsOnly = /^\d+$/.test(norm);
      const isExact15 = norm.length === 15;
      const noSpacesOrSymbols = !/\s/.test(raw) && !/[^\d\u0660-\u0669]/.test(raw);
      const isValid = isFilled && isDigitsOnly && isExact15;
      let errorMessage: string | undefined;
      if (isFilled && !isDigitsOnly) errorMessage = "أرقام فقط بدون حروف أو رموز";
      else if (isFilled && norm.length !== 15) errorMessage = `15 رقماً بالضبط (المكتوب: ${norm.length})`;

      const detailHeader = !isFilled
        ? "الرقم الضريبي: بانتظار الإدخال"
        : isValid
        ? "الرقم الضريبي: مكتمل (15 رقمًا)"
        : `الرقم الضريبي: أدخلت ${formatArabicCount(norm.length, "رقم")}`;

      return {
        name: "taxNumber",
        title: "الرقم الضريبي للمنشأة",
        shortTitle: "الرقم الضريبي",
        detailHeader,
        iconName: "Hash",
        isFilled,
        isValid,
        errorMessage,
        rules: [
          { id: "digits", label: "أرقام فقط", isValid: isFilled && isDigitsOnly },
          {
            id: "len",
            label: `يجب أن تتكوّن من 15 رقمًا بالضبط${formatArabicDiff(15, norm.length, "رقم")}`,
            isValid: isFilled && isExact15,
          },
          { id: "no_symbols", label: "بدون مسافات أو رموز", isValid: isFilled && noSpacesOrSymbols },
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
      if (isFilled && !noSpaces) errorMessage = "البريد الإلكتروني لا يمكن أن يحتوي على مسافات";
      else if (isFilled && !raw.includes("@")) errorMessage = "صيغة غير مكتملة (ناقص @)";
      else if (isFilled && !localValid) errorMessage = "اسم المستخدم قبل @ غير صالح (بين 1 و 64 حرفاً)";
      else if (isFilled && !domainValid) errorMessage = "امتداد الدومين يجب أن يكون بحرفين أو أكثر بنقطة صحيحة";

      const detailHeader = !isFilled
        ? "البريد الإلكتروني: بانتظار الإدخال"
        : isValid
        ? "البريد الإلكتروني: بريد رسمي معتمد"
        : "البريد الإلكتروني: صيغة غير مكتملة";

      return {
        name: "email",
        title: "البريد الإلكتروني الرسمي",
        shortTitle: "البريد الإلكتروني",
        detailHeader,
        iconName: "Mail",
        isFilled,
        isValid,
        errorMessage,
        rules: [
          { id: "at", label: "صيغة بريد صحيحة تحتوي على @", isValid: isFilled && raw.includes("@") && localValid },
          { id: "domain", label: "دومين مع امتداد بحرفين أو أكثر", isValid: isFilled && domainValid },
          { id: "no_spaces", label: "بدون مسافات", isValid: isFilled && noSpaces },
        ],
      };
    }

    case "phone": {
      let normDigits = norm.replace(/\s+/g, "");
      if (normDigits.startsWith("+966")) normDigits = normDigits.slice(4);
      if (/^5\d{8}$/.test(normDigits)) normDigits = `0${normDigits}`;

      const starts05 = normDigits.startsWith("05");
      const isExact10 = normDigits.length === 10 && /^\d+$/.test(normDigits);
      const noSpacesOrSymbols = !/[^\d\u0660-\u0669\s+]/.test(raw);
      const isValid = isFilled && starts05 && isExact10;
      let errorMessage: string | undefined;
      if (isFilled && !starts05) errorMessage = "رقم الجوال يجب أن يبدأ بـ 05";
      else if (isFilled && normDigits.length !== 10) errorMessage = `10 أرقام بالضبط (المكتوب: ${normDigits.length})`;

      const detailHeader = !isFilled
        ? "رقم الجوال: بانتظار الإدخال"
        : isValid
        ? "رقم الجوال: رقم جوال معتمد"
        : `رقم الجوال: أدخلت ${formatArabicCount(normDigits.length, "رقم")}`;

      return {
        name: "phone",
        title: "رقم الجوال للتواصل",
        shortTitle: "رقم الجوال",
        detailHeader,
        iconName: "Phone",
        isFilled,
        isValid,
        errorMessage,
        rules: [
          { id: "prefix", label: "يبدأ بـ 05", isValid: isFilled && starts05 },
          {
            id: "len",
            label: `يجب أن يتكوّن من 10 أرقام بالضبط${formatArabicDiff(10, normDigits.length, "رقم")}`,
            isValid: isFilled && isExact10,
          },
          { id: "no_symbols", label: "أرقام فقط بدون رموز خاصة", isValid: isFilled && noSpacesOrSymbols },
        ],
      };
    }

    case "landline": {
      const startsCode = /^01[123467]/.test(norm);
      const isCorrectLength = (norm.length === 9 || norm.length === 10) && /^\d+$/.test(norm);
      const noSpacesOrSymbols = !/\s/.test(raw) && !/[^\d\u0660-\u0669]/.test(raw);
      const isValid = isFilled && startsCode && isCorrectLength;
      let errorMessage: string | undefined;
      if (isFilled && !startsCode) errorMessage = "يجب أن يبدأ برمز منطقة سعودي (011، 012، 013، 014، 016، 017)";
      else if (isFilled && !isCorrectLength) errorMessage = `9 أو 10 أرقام (المكتوب: ${norm.length})`;

      const detailHeader = !isFilled
        ? "الهاتف المكتبي: بانتظار الإدخال"
        : isValid
        ? `الهاتف المكتبي: هاتف مكتبي معتمد (${norm.length} أرقام)`
        : `الهاتف المكتبي: أدخلت ${formatArabicCount(norm.length, "رقم")}`;

      return {
        name: "landline",
        title: "الهاتف المكتبي المباشر",
        shortTitle: "الهاتف المكتبي",
        detailHeader,
        iconName: "PhoneCall",
        isFilled,
        isValid,
        errorMessage,
        rules: [
          { id: "code", label: "يبدأ برمز منطقة سعودي (011، 012، 013، ...)", isValid: isFilled && startsCode },
          {
            id: "len",
            label: isCorrectLength
              ? `يتكوّن من ${norm.length} أرقام (مكتمل)`
              : `يجب أن يتكوّن من 9 أو 10 أرقام${norm.length < 9 ? formatArabicDiff(9, norm.length, "رقم") : formatArabicDiff(10, norm.length, "رقم")}`,
            isValid: isFilled && isCorrectLength,
          },
          { id: "no_symbols", label: "أرقام فقط بدون مسافات أو رموز", isValid: isFilled && noSpacesOrSymbols },
        ],
      };
    }

    case "city": {
      const cleanCity = raw.replace("المملكة العربية السعودية - ", "").trim();
      const inList = SAUDI_CITIES.includes(cleanCity);
      const isValid = isFilled && inList;
      let errorMessage: string | undefined;
      if (isFilled && !inList) errorMessage = "يرجى اختيار مدينة صحيحة من القائمة";

      const detailHeader = !isFilled
        ? "المدينة: بانتظار الاختيار"
        : isValid
        ? `المدينة: تم اختيار ${cleanCity}`
        : "المدينة: مدينة غير مدرجة";

      return {
        name: "city",
        title: "المدينة / المقر الرئيسي",
        shortTitle: "المدينة",
        detailHeader,
        iconName: "MapPin",
        isFilled,
        isValid,
        errorMessage,
        rules: [
          { id: "select", label: "اختيار مدينة معتمدة من القائمة", isValid: isFilled && inList },
          { id: "saudi", label: "تابعة لمناطق ومحافظات المملكة العربية السعودية", isValid: isFilled && inList },
        ],
      };
    }

    case "address": {
      const len = raw.trim().length;
      const rLen = len >= 5 && len <= 30;
      const rLetter = CONTAINS_LETTER_REGEX.test(raw);
      const isValid = isFilled && rLen && rLetter;
      let errorMessage: string | undefined;
      if (isFilled && !rLen) errorMessage = "العنوان يجب أن يكون من 5 إلى 30 حرفاً";
      else if (isFilled && !rLetter) errorMessage = "يجب أن يحتوي على حرف واحد على الأقل (عربي أو إنجليزي)";

      const detailHeader = !isFilled
        ? "العنوان: بانتظار الإدخال"
        : isValid
        ? `العنوان: مقر موثق (${formatArabicCount(len, "حرف")})`
        : `العنوان: أدخلت ${formatArabicCount(len, "حرف")}`;

      return {
        name: "address",
        title: "العنوان الوطني ومقر المكتب",
        shortTitle: "العنوان",
        detailHeader,
        iconName: "MapPin",
        isFilled,
        isValid,
        errorMessage,
        rules: [
          {
            id: "len",
            label: `يجب أن يكون من 5 إلى 30 حرفًا${len < 5 ? formatArabicDiff(5, len, "حرف") : len > 30 ? formatArabicDiff(30, len, "حرف") : ""}`,
            isValid: isFilled && rLen,
          },
          { id: "letter", label: "يحتوي على حرف واحد على الأقل", isValid: isFilled && rLetter },
          { id: "desc", label: "وصف دقيق للمقر أو العنوان الوطني", isValid: isFilled && rLen && rLetter },
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
      if (isFilled && !noSpaces) errorMessage = "لا يسمح بوجود مسافات في كلمة المرور";
      else if (isFilled && !rLen) errorMessage = `بين 9 و 20 خانة (المكتوب: ${raw.length})`;
      else if (isFilled && (!rLetter || !rDigit || !rSymbol)) errorMessage = "يجب أن تتضمن حرفاً ورقماً ورمزاً خاصاً";

      const detailHeader = !isFilled
        ? "كلمة المرور: بانتظار الإدخال"
        : isValid
        ? "كلمة المرور: كلمة مرور قوية وآمنة"
        : "كلمة المرور: متطلبات الأمان غير مكتملة";

      return {
        name: "password",
        title: "كلمة المرور الأولية",
        shortTitle: "كلمة المرور",
        detailHeader,
        iconName: "Hash",
        isFilled,
        isValid,
        errorMessage,
        rules: [
          { id: "len", label: "من 9 إلى 20 خانة بدون مسافات", isValid: isFilled && noSpaces && rLen },
          { id: "char_digit", label: "تحتوي على حروف وأرقام", isValid: isFilled && rLetter && rDigit },
          { id: "symbol", label: "تحتوي على رمز خاص واحد على الأقل (@$!%*?&)", isValid: isFilled && rSymbol },
        ],
      };
    }
  }
}
