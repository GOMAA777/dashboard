import { z } from "zod";

export const generalSettingsSchema = z.object({
  systemTitle: z.string().min(2, "عنوان النظام مطلوب"),
  companyName: z.string().min(2, "اسم الشركة أو المنشأة مطلوب"),
  slogan: z.string().optional().default(""),
  phone: z.string().min(5, "رقم الهاتف المعتمد مطلوب"),
  email: z.string().email("البريد الإلكتروني الرسمي غير صالح"),
  licenseCode: z.string().min(1, "كود التفعيل ورخصة النظام مطلوب"),
  timezone: z.string().min(1, "المنطقة الزمنية مطلوبة"),
  defaultLanguage: z.string().min(1, "اللغة الافتراضية للواجهة مطلوبة"),
  country: z.string().min(1, "الدولة والمقر الرئيسي مطلوب"),
  defaultCurrency: z.string().min(1, "العملة الافتراضية مطلوبة"),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "صيغة لون Hex غير صالحة"),
  telegramGuideUrl: z.string().url("رابط غير صالح").or(z.literal("")),
  whatsappGuideUrl: z.string().url("رابط غير صالح").or(z.literal("")),
  apiDocsUrl: z.string().url("رابط غير صالح").or(z.literal("")),
});

export type GeneralSettingsFormData = z.infer<typeof generalSettingsSchema>;
