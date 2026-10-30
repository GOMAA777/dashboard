import { z } from "zod";

export const languageSchema = z.object({
  name: z.string().min(2, "اسم اللغة مطلوب"),
  code: z.string().min(2, "كود اللغة مطلوب").max(10, "كود اللغة يجب ألا يتجاوز 10 أحرف"),
  status: z.enum(["active", "inactive"]),
  direction: z.enum(["rtl", "ltr"]).default("ltr"),
});

export type LanguageFormData = z.infer<typeof languageSchema>;
