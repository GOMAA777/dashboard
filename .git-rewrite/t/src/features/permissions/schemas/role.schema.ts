import { z } from "zod";

export const roleFormSchema = z.object({
  name: z
    .string()
    .min(3, "يجب أن يكون اسم الدور 3 أحرف على الأقل")
    .max(100, "اسم الدور طويل جداً"),
  slug: z
    .string()
    .min(3, "المعرف البرمجي يجب أن يكون 3 أحرف على الأقل")
    .regex(/^[a-z0-9_-]+$/, "المعرف البرمجي يجب أن يحتوي فقط على أحرف إنجليزية صغيرة، أرقام، أو شرطات (- _)"),
  description: z.string().optional(),
  permissions: z
    .array(z.string())
    .min(1, "يرجى تحديد صلاحية واحدة على الأقل لهذا الدور"),
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;
