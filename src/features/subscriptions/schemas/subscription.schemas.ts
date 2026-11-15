import { z } from "zod";

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
  return z.object({
    firmName: z.string().min(3, isEn ? "Firm name must be at least 3 characters" : "اسم المكتب يجب أن يكون 3 أحرف على الأقل"),
    licenseNumber: z.string().min(2, isEn ? "License number is required" : "رقم الترخيص مطلوب"),
    city: z.string().min(2, isEn ? "City is required" : "المدينة مطلوبة"),
    ownerName: z.string().min(3, isEn ? "Owner/Director name is required" : "اسم المالك / المدير مطلوب"),
    email: z.string().email(isEn ? "Invalid email address" : "البريد الإلكتروني غير صالح"),
    phone: z.string().min(9, isEn ? "Invalid phone number" : "رقم الهاتف غير صالح"),
    planName: z.string().min(1, isEn ? "Plan is required" : "الباقة مطلوبة"),
    billingCycle: z.enum(["سنوية", "شهرية"]),
    paymentMethod: z.enum(["mada", "visa", "sadad", "transfer"]),
    taxNumber: z.string().optional(),
  });
}

export const createSubscriptionSchema = getCreateSubscriptionSchema(false);

export type SubscriptionFilterInput = z.infer<typeof subscriptionFilterSchema>;
export type UpdateSubscriptionStatusInput = z.infer<typeof updateSubscriptionStatusSchema>;
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
