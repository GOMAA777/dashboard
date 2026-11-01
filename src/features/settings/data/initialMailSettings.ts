import { MailSettings } from "../types/mail-settings.types";

export const initialMailSettings: MailSettings = {
  smtpHost: "smtp.aljudy.sa",
  smtpPort: 587,
  encryption: "tls",
  smtpUsername: "noreply@aljudy.sa",
  smtpPassword: "••••••••••••",
  fromName: "منصة الجودي",
  fromEmail: "noreply@aljudy.sa",
  replyToEmail: "support@aljudy.sa",
  enableSmtpAuth: true,
  enableHtmlEmails: true,
  testRecipientEmail: "admin@aljudy.sa",
};
