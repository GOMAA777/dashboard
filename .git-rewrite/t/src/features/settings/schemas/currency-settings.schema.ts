import { z } from "zod";

export const currencySchema = z.object({
  name: z.string().min(2, "اسم العملة مطلوب"),
  exchangeRate: z.string().min(1, "سعر الصرف مقابل الدولار مطلوب"),
  code: z.string().min(2, "كود العملة مطلوب").max(5, "كود العملة يجب ألا يتجاوز 5 أحرف"),
  symbol: z.string().min(1, "رمز العملة مطلوب"),
  status: z.enum(["active", "inactive"]),
});

export type CurrencyFormData = z.infer<typeof currencySchema>;
