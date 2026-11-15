import { actionClient } from "@/lib/safe-action";
import {
  sendNotificationSchema,
  deleteNotificationSchema,
} from "../schemas/notifications.schemas";

export const sendNotificationAction = actionClient
  .schema(sendNotificationSchema)
  .action(async ({ parsedInput }) => {
    // In production, this writes to database and dispatches via WebPush/Socket
    const notificationId = `NTF-${Math.floor(1000 + Math.random() * 9000)}`;
    const verificationCode = `NTF-${Math.floor(1000 + Math.random() * 9000)}-OK`;

    return {
      success: true,
      notificationId,
      verificationCode,
      dispatchedCount: parsedInput.audienceType === "all" ? 842 : 1,
      timestamp: new Date().toISOString(),
      formattedTimestamp: new Intl.DateTimeFormat("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()),
    };
  });

export const deleteNotificationAction = actionClient
  .schema(deleteNotificationSchema)
  .action(async ({ parsedInput }) => {
    const { notificationId } = parsedInput;

    return {
      success: true,
      notificationId,
      deletedAt: new Date().toISOString(),
    };
  });
