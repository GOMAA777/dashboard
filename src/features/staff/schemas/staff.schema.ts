import { z } from "zod";

export const addEmployeeSchema = z
  .object({
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
    confirmPassword: z.string().min(8, "يرجى تأكيد كلمة المرور"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export type AddEmployeeFormData = z.infer<typeof addEmployeeSchema>;

export const resetPasswordSchema = z.object({
  method: z.enum(["email_link", "manual_password"]),
  sendSms: z.boolean().default(true),
  newPassword: z.string().optional(),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
