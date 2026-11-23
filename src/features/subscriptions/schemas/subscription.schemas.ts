import { z } from "zod";
import { normalizeArabicDigits } from "@/features/clients/constants/saudi-cities";

const SAUDI_MOBILE = /^05\d{8}$/;
const SAUDI_LANDLINE = /^01[123467]\d{6,7}$/;

function localMobile(value: string) {
  let phone = normalizeArabicDigits(value).replace(/[\s()-]/g, "");
  if (phone.startsWith("+966")) phone = phone.slice(4);
  else if (phone.startsWith("00966")) phone = phone.slice(5);
  else if (phone.startsWith("966")) phone = phone.slice(3);
  if (/^5\d{8}$/.test(phone)) phone = `0${phone}`;
  return phone;
}

export function toApiMobile(value: string) {
  const local = localMobile(value);
  return local.startsWith("0") ? `+966${local.slice(1)}` : local;
}

export function toApiLandline(value: string) {
  return normalizeArabicDigits(value).replace(/\s+/g, "");
}

export const subscriptionFilterSchema = z.object({
  tab: z.enum(["all", "active", "pending", "cancelled_expired"]).default("all"),
  search: z.string().optional().default(""),
  plan: z.string().optional().default("all"),
  status: z.string().optional().default("all"),
  paymentMethod: z.string().optional().default("all"),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).default(10),
});

export const updateSubscriptionStatusSchema = z.object({
  subscriptionId: z.string().min(1),
  action: z.enum(["approve", "reject", "reactivate", "cancel", "renew"]),
  reason: z.string().optional(),
});

export function getCreateSubscriptionSchema(isEn = false) {
  const m = (ar: string, en: string) => (isEn ? en : ar);
  return z.object({
    firmName: z
      .string()
      .trim()
      .min(3, m("اسم المكتب يجب أن يكون 3 أحرف على الأقل", "Firm name must be at least 3 characters"))
      .max(255, m("اسم المكتب طويل جداً", "Firm name is too long")),
    licenseNumber: z
      .string()
      .trim()
      .min(2, m("رقم الترخيص مطلوب", "License number is required"))
      .max(30, m("رقم الترخيص طويل جداً", "License number is too long")),
    city: z
      .string()
      .trim()
      .min(2, m("المدينة مطلوبة", "City is required"))
      .max(100, m("اسم المدينة طويل جداً", "City name is too long")),
    ownerName: z
      .string()
      .trim()
      .min(3, m("اسم المالك / المدير مطلوب", "Owner/Director name is required"))
      .max(255, m("اسم المدير طويل جداً", "Owner name is too long")),
    email: z
      .string()
      .trim()
      .email(m("البريد الإلكتروني غير صالح", "Invalid email address"))
      .max(254, m("البريد الإلكتروني طويل جداً", "Email is too long")),
    phone: z.string().trim().refine((value) => SAUDI_MOBILE.test(localMobile(value)), {
      message: m(
        "رقم الجوال يجب أن يكون سعودياً ويبدأ بـ 05 أو +966",
        "Mobile must be a Saudi number starting with 05 or +966"
      ),
    }),
    landline: z.string().trim().refine((value) => SAUDI_LANDLINE.test(toApiLandline(value)), {
      message: m(
        "الهاتف الأرضي يجب أن يبدأ برمز منطقة سعودي (011، 012، 013، 014، 016، 017) ويكون 9 أو 10 أرقام",
        "Landline must start with a Saudi area code and be 9 or 10 digits"
      ),
    }),
    address: z
      .string()
      .trim()
      .min(5, m("العنوان مطلوب", "Address is required"))
      .max(255, m("العنوان يجب ألا يتجاوز 255 حرفاً", "Address must be at most 255 characters")),
    password: z
      .string()
      .min(9, m("كلمة المرور يجب أن تكون بين 9 و 20 خانة", "Password must be between 9 and 20 characters"))
      .max(20, m("كلمة المرور يجب أن تكون بين 9 و 20 خانة", "Password must be between 9 and 20 characters"))
      .refine((value) => !/\s/.test(value), {
        message: m("كلمة المرور يجب ألا تحتوي على مسافات", "Password cannot contain spaces"),
      })
      .refine((value) => /[A-Za-z\u0621-\u064A]/.test(value), {
        message: m("كلمة المرور يجب أن تحتوي على حرف واحد على الأقل", "Password must contain at least one letter"),
      })
      .refine((value) => /\d/.test(value), {
        message: m("كلمة المرور يجب أن تحتوي على رقم واحد على الأقل", "Password must contain at least one digit"),
      })
      .refine((value) => /[^A-Za-z0-9\u0621-\u064A\s]/.test(value), {
        message: m("كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل", "Password must contain at least one symbol"),
      }),
    planId: z.string().min(1, m("الباقة مطلوبة", "Plan is required")),
    billingCycle: z.enum(["yearly", "monthly"]),
    taxNumber: z.string().refine((value) => {
      const digits = normalizeArabicDigits(value.trim());
      return digits.length === 0 || /^\d{15}$/.test(digits);
    }, m("الرقم الضريبي يجب أن يكون 15 رقماً", "Tax number must be 15 digits")),
  });
}

export const createSubscriptionSchema = getCreateSubscriptionSchema(false);

export type SubscriptionFilterInput = z.infer<typeof subscriptionFilterSchema>;
export type UpdateSubscriptionStatusInput = z.infer<typeof updateSubscriptionStatusSchema>;
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
