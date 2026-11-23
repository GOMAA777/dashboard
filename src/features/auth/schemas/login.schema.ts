import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "البريد الإلكتروني أو اسم المستخدم مطلوب")
    .refine(
      (value) => !value.includes("@") || z.email().safeParse(value).success,
      "صيغة البريد الإلكتروني غير صحيحة"
    ),
  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة"),
});

export type LoginInput = z.infer<typeof loginSchema>;
