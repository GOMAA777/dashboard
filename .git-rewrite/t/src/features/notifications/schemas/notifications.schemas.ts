import { z } from "zod";

export const sendNotificationSchema = z.object({
  title: z
    .string()
    .min(3, { message: "عنوان الإشعار يجب أن لا يقل عن 3 أحرف" })
    .max(200, { message: "عنوان الإشعار طويل جداً" }),
  description: z
    .string()
    .min(5, { message: "وصف الإشعار يجب أن لا يقل عن 5 أحرف" })
    .max(2000, { message: "وصف الإشعار طويل جداً" }),
  actionUrl: z
    .string()
    .min(1, { message: "رابط الإجراء مطلوب" })
    .refine((val) => val.startsWith("http://") || val.startsWith("https://") || val.startsWith("/"), {
      message: "يرجى إدخال رابط إجراء صالح يبدأ بـ https:// أو مسار نسبي",
    }),
  audienceType: z.enum(["all", "specific"]),
  specificFirmId: z.string().optional(),
  imageUrl: z.string().optional(),
  imageFileName: z.string().optional(),
  imageFileSize: z.string().optional(),
  imageDimensions: z.string().optional(),
  categoryBadge: z.string().optional(),
  actionButtonText: z.string().optional(),
  isDraft: z.boolean().optional(),
});

export type SendNotificationFormValues = z.infer<typeof sendNotificationSchema>;

export const deleteNotificationSchema = z.object({
  notificationId: z.string().min(1, { message: "معرف الإشعار مطلوب" }),
});

export type DeleteNotificationInput = z.infer<typeof deleteNotificationSchema>;
