export type MailEncryption = "none" | "ssl" | "tls";

export interface MailSettings {
  smtpHost: string;
  smtpPort: number;
  encryption: MailEncryption;
  smtpUsername: string;
  smtpPassword: string;
  fromName: string;
  fromEmail: string;
  replyToEmail: string;
  enableSmtpAuth: boolean;
  enableHtmlEmails: boolean;
  testRecipientEmail: string;
}
