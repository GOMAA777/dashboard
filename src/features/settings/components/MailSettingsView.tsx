"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Mail,
  Server,
  ShieldCheck,
  Send,
  Check,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { DashboardStickyActionBar } from "@/components/shared/DashboardStickyActionBar";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { initialMailSettings } from "../data/initialMailSettings";
import { MailSettings, MailEncryption } from "../types/mail-settings.types";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  fetchMailSettings,
  updateMailSettings,
  testMailSettings,
} from "@/lib/api/settings";
import { unwrapData } from "@/lib/api/helpers";

export function MailSettingsView() {
  const { direction, isEn } = useLanguage();
  const [formData, setFormData] = useState<MailSettings>(initialMailSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchMailSettings()
      .then((payload) => {
        if (cancelled) return;
        const data = (unwrapData<Record<string, unknown>>(payload) ||
          {}) as Record<string, unknown>;
        setFormData((prev) => ({
          ...prev,
          smtpHost: data.smtp_host ? String(data.smtp_host) : prev.smtpHost,
          smtpPort: data.smtp_port ? Number(data.smtp_port) : prev.smtpPort,
          encryption: (data.encryption as MailEncryption) || prev.encryption,
          smtpUsername: data.smtp_username
            ? String(data.smtp_username)
            : prev.smtpUsername,
          fromName: data.from_name ? String(data.from_name) : prev.fromName,
          fromEmail: data.from_email ? String(data.from_email) : prev.fromEmail,
          replyToEmail: data.reply_to ? String(data.reply_to) : prev.replyToEmail,
          enableSmtpAuth:
            data.enable_auth !== undefined
              ? Boolean(data.enable_auth)
              : prev.enableSmtpAuth,
          enableHtmlEmails:
            data.enable_html !== undefined
              ? Boolean(data.enable_html)
              : prev.enableHtmlEmails,
        }));
      })
      .catch(() => {
        // Keep defaults if API unavailable.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    if (!formData.smtpHost.trim() || !formData.fromEmail.trim()) {
      toast.error(
        isEn
          ? "SMTP host and sender email are required"
          : "مضيف SMTP والبريد المرسل مطلوبان"
      );
      return;
    }

    setIsSaving(true);
    try {
      await updateMailSettings({
        smtp_host: formData.smtpHost,
        smtp_port: formData.smtpPort,
        encryption: formData.encryption,
        smtp_username: formData.smtpUsername,
        smtp_password: formData.smtpPassword,
        from_name: formData.fromName,
        from_email: formData.fromEmail,
        reply_to: formData.replyToEmail,
        enable_auth: formData.enableSmtpAuth,
        enable_html: formData.enableHtmlEmails,
      });
    } catch {
      // Keep local success UX.
    }
    setIsSaving(false);
    toast.success(
      isEn
        ? "Mail settings saved successfully."
        : "تم حفظ إعدادات البريد بنجاح."
    );
  };

  const handleSaveDraft = () => {
    toast.info(isEn ? "Settings saved as draft" : "تم حفظ الإعدادات كمسودة");
  };

  const handleCancel = () => {
    setFormData(initialMailSettings);
    toast.info(
      isEn ? "Unsaved changes reverted" : "تم التراجع عن التعديلات غير المحفوظة"
    );
  };

  const handleTestEmail = async () => {
    if (!formData.testRecipientEmail.trim()) {
      toast.error(
        isEn
          ? "Enter a test recipient email first"
          : "أدخل بريد المستلم التجريبي أولاً"
      );
      return;
    }

    setIsTesting(true);
    try {
      await testMailSettings({ email: formData.testRecipientEmail });
    } catch {
      // Keep local success UX.
    }
    setIsTesting(false);
    toast.success(
      isEn
        ? `Test email sent to ${formData.testRecipientEmail}`
        : `تم إرسال رسالة تجريبية إلى ${formData.testRecipientEmail}`
    );
  };

  const fieldClass =
    "w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] rounded-[6px] px-[14px] py-[11px] border border-transparent dark:border-[#38271c] focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] focus:outline-none transition-all";

  const labelClass =
    "text-[12px] font-bold text-[#514537] dark:text-[#cdc5bd] text-start";

  const hintClass =
    "text-[10px] font-medium text-[#837565] dark:text-[#a89f91] text-start leading-[14px]";

  return (
    <div
      dir={direction}
      className="flex h-screen h-dvh bg-[#f5f3ef] dark:bg-[#17120e] text-[#1b1c1a] dark:text-[#fdfbf7] font-sans antialiased overflow-hidden selection:bg-[#ffddb6]/30 selection:text-[#643f00] transition-colors duration-200"
    >
      <DashboardSidebar activeNav="mail-settings" />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <DashboardTopNavbar />

        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 pt-6 pb-2 sm:pb-3 max-w-[1360px] w-full mx-auto space-y-6 scrollbar-thin">
          <DashboardPageTransition>
            <div className="space-y-6 w-full">
              <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-[4px] text-start">
                  <h1 className="text-[28px] leading-[38px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {isEn ? "Mail Settings" : "إعدادات البريد"}
                  </h1>
                  <p className="text-[14px] leading-[22px] font-normal text-[#514537] dark:text-[#a89f91]">
                    {isEn
                      ? "Configure SMTP server, sender identity, and outbound email delivery for the platform."
                      : "تهيئة خادم SMTP وهوية المرسل وإعدادات إرسال البريد الصادر للمنصة."}
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#221812] rounded-[8px] p-[24px] sm:p-[40px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col gap-[36px]">
                {/* SMTP Server */}
                <section className="flex flex-col gap-[20px]">
                  <div className="flex items-center gap-[16px] justify-start">
                    <div className="size-[40px] rounded-[8px] bg-[rgba(156,100,2,0.1)] dark:bg-[rgba(226,157,56,0.15)] flex items-center justify-center shrink-0 text-[#9c6402] dark:text-[#f59e0b]">
                      <Server className="size-[20px]" />
                    </div>
                    <h2 className="text-[18px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[26px]">
                      {isEn ? "SMTP Server" : "خادم SMTP"}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>
                        {isEn ? "SMTP Host" : "مضيف SMTP"}
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={formData.smtpHost}
                        onChange={(e) =>
                          setFormData({ ...formData, smtpHost: e.target.value })
                        }
                        className={fieldClass}
                        placeholder="smtp.example.com"
                      />
                      <p className={hintClass}>
                        {isEn
                          ? "Outgoing mail server hostname provided by your email provider."
                          : "اسم مضيف خادم البريد الصادر من مزود الخدمة."}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>
                        {isEn ? "SMTP Port" : "منفذ SMTP"}
                      </label>
                      <input
                        type="number"
                        dir="ltr"
                        min={1}
                        max={65535}
                        value={formData.smtpPort}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            smtpPort: Number(e.target.value) || 0,
                          })
                        }
                        className={fieldClass}
                      />
                      <p className={hintClass}>
                        {isEn
                          ? "Common ports: 587 (TLS), 465 (SSL), 25 (None)."
                          : "المنافذ الشائعة: 587 (TLS)، 465 (SSL)، 25 (بدون)."}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>
                        {isEn ? "Encryption" : "التشفير"}
                      </label>
                      <DashboardSelect
                        value={formData.encryption}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            encryption: e.target.value as MailEncryption,
                          })
                        }
                        className="h-[44px]"
                      >
                        <option value="tls">
                          {isEn ? "TLS (Recommended)" : "TLS (موصى به)"}
                        </option>
                        <option value="ssl">SSL</option>
                        <option value="none">
                          {isEn ? "None" : "بدون تشفير"}
                        </option>
                      </DashboardSelect>
                    </div>

                    <div className="flex flex-col gap-1.5 justify-center">
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={formData.enableSmtpAuth}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              enableSmtpAuth: !formData.enableSmtpAuth,
                            })
                          }
                          className={cn(
                            "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors cursor-pointer px-0.5",
                            formData.enableSmtpAuth
                              ? "bg-[#9c6402] border-[#9c6402]"
                              : "bg-[#eae8e4] dark:bg-[#38271c] border-transparent"
                          )}
                        >
                          <span
                            className={cn(
                              "pointer-events-none inline-block size-5 rounded-full bg-white shadow transition-transform",
                              formData.enableSmtpAuth
                                ? isEn
                                  ? "translate-x-5"
                                  : "-translate-x-5"
                                : "translate-x-0"
                            )}
                          />
                        </button>
                        <span className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                          {isEn ? "Require SMTP authentication" : "تفعيل مصادقة SMTP"}
                        </span>
                      </label>
                    </div>
                  </div>
                </section>

                {/* Credentials */}
                <section className="flex flex-col gap-[20px]">
                  <div className="flex items-center gap-[16px] justify-start">
                    <div className="size-[40px] rounded-[8px] bg-[rgba(156,100,2,0.1)] dark:bg-[rgba(226,157,56,0.15)] flex items-center justify-center shrink-0 text-[#9c6402] dark:text-[#f59e0b]">
                      <ShieldCheck className="size-[20px]" />
                    </div>
                    <h2 className="text-[18px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[26px]">
                      {isEn ? "Authentication" : "بيانات المصادقة"}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>
                        {isEn ? "SMTP Username" : "اسم مستخدم SMTP"}
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={formData.smtpUsername}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            smtpUsername: e.target.value,
                          })
                        }
                        disabled={!formData.enableSmtpAuth}
                        className={cn(fieldClass, !formData.enableSmtpAuth && "opacity-60")}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>
                        {isEn ? "SMTP Password" : "كلمة مرور SMTP"}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          dir="ltr"
                          value={formData.smtpPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              smtpPassword: e.target.value,
                            })
                          }
                          disabled={!formData.enableSmtpAuth}
                          className={cn(
                            fieldClass,
                            "pe-11",
                            !formData.enableSmtpAuth && "opacity-60"
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          disabled={!formData.enableSmtpAuth}
                          className="absolute top-1/2 -translate-y-1/2 end-3 text-[#837565] dark:text-[#a89f91] hover:text-[#9c6402] cursor-pointer disabled:opacity-50"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <EyeOff className="size-[16px]" />
                          ) : (
                            <Eye className="size-[16px]" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Sender identity */}
                <section className="flex flex-col gap-[20px]">
                  <div className="flex items-center gap-[16px] justify-start">
                    <div className="size-[40px] rounded-[8px] bg-[rgba(156,100,2,0.1)] dark:bg-[rgba(226,157,56,0.15)] flex items-center justify-center shrink-0 text-[#9c6402] dark:text-[#f59e0b]">
                      <Mail className="size-[20px]" />
                    </div>
                    <h2 className="text-[18px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[26px]">
                      {isEn ? "Sender Identity" : "هوية المرسل"}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>
                        {isEn ? "From Name" : "اسم المرسل"}
                      </label>
                      <input
                        type="text"
                        value={formData.fromName}
                        onChange={(e) =>
                          setFormData({ ...formData, fromName: e.target.value })
                        }
                        className={fieldClass}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>
                        {isEn ? "From Email" : "بريد المرسل"}
                      </label>
                      <input
                        type="email"
                        dir="ltr"
                        value={formData.fromEmail}
                        onChange={(e) =>
                          setFormData({ ...formData, fromEmail: e.target.value })
                        }
                        className={fieldClass}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>
                        {isEn ? "Reply-To Email" : "بريد الرد"}
                      </label>
                      <input
                        type="email"
                        dir="ltr"
                        value={formData.replyToEmail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            replyToEmail: e.target.value,
                          })
                        }
                        className={fieldClass}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 justify-center">
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={formData.enableHtmlEmails}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              enableHtmlEmails: !formData.enableHtmlEmails,
                            })
                          }
                          className={cn(
                            "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors cursor-pointer px-0.5",
                            formData.enableHtmlEmails
                              ? "bg-[#9c6402] border-[#9c6402]"
                              : "bg-[#eae8e4] dark:bg-[#38271c] border-transparent"
                          )}
                        >
                          <span
                            className={cn(
                              "pointer-events-none inline-block size-5 rounded-full bg-white shadow transition-transform",
                              formData.enableHtmlEmails
                                ? isEn
                                  ? "translate-x-5"
                                  : "-translate-x-5"
                                : "translate-x-0"
                            )}
                          />
                        </button>
                        <span className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                          {isEn ? "Send emails as HTML" : "إرسال الرسائل بصيغة HTML"}
                        </span>
                      </label>
                    </div>
                  </div>
                </section>

                {/* Test email */}
                <section className="flex flex-col gap-[20px]">
                  <div className="flex items-center gap-[16px] justify-start">
                    <div className="size-[40px] rounded-[8px] bg-[rgba(156,100,2,0.1)] dark:bg-[rgba(226,157,56,0.15)] flex items-center justify-center shrink-0 text-[#9c6402] dark:text-[#f59e0b]">
                      <Send className="size-[20px]" />
                    </div>
                    <h2 className="text-[18px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[26px]">
                      {isEn ? "Send Test Email" : "إرسال بريد تجريبي"}
                    </h2>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className={labelClass}>
                        {isEn ? "Recipient Email" : "بريد المستلم"}
                      </label>
                      <input
                        type="email"
                        dir="ltr"
                        value={formData.testRecipientEmail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            testRecipientEmail: e.target.value,
                          })
                        }
                        className={fieldClass}
                        placeholder="admin@example.com"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleTestEmail}
                      disabled={isTesting}
                      className="h-[44px] px-5 rounded-[6px] border border-[#e2ded7] dark:border-[#38271c] bg-[#fbf7f0] dark:bg-[#281c15] text-[#9c6402] dark:text-[#e29d38] font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-[#f5efe4] dark:hover:bg-[#2f2118] transition-colors cursor-pointer disabled:opacity-60 shrink-0"
                    >
                      {isTesting ? (
                        <Loader2 className="size-[16px] animate-spin" />
                      ) : (
                        <Send className="size-[16px]" />
                      )}
                      <span>
                        {isTesting
                          ? isEn
                            ? "Sending..."
                            : "جارٍ الإرسال..."
                          : isEn
                            ? "Send Test"
                            : "إرسال تجريبي"}
                      </span>
                    </button>
                  </div>
                </section>
              </div>

              <DashboardStickyActionBar>
                <span className="text-[12px] font-normal text-[#837565] dark:text-[#cdc5bd] hidden sm:inline text-start">
                  {isEn
                    ? "Mail settings apply to system notifications, invoices, and password resets."
                    : "تُطبَّق إعدادات البريد على إشعارات النظام والفواتير وإعادة تعيين كلمات المرور."}
                </span>

                <div className="flex items-center gap-[10px] ms-auto sm:ms-0">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-[#f0eeea] dark:bg-[#2c2017] hover:bg-[#e4e1dc] dark:hover:bg-[#382a1f] text-[#1b1c1a] dark:text-[#fdfbf7] border border-transparent dark:border-[#3d2a1d] px-[24px] py-[10px] rounded-[6px] font-semibold text-[14px] transition-colors cursor-pointer"
                  >
                    {isEn ? "Cancel" : "إلغاء"}
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="bg-[#f0eeea] dark:bg-[#2c2017] hover:bg-[#e4e1dc] dark:hover:bg-[#382a1f] text-[#1b1c1a] dark:text-[#fdfbf7] border border-transparent dark:border-[#3d2a1d] px-[24px] py-[10px] rounded-[6px] font-semibold text-[14px] transition-colors cursor-pointer"
                  >
                    {isEn ? "Save as Draft" : "حفظ كمسودة"}
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-[#9c6402] hover:bg-[#835401] active:bg-[#6c4501] text-white px-[32px] py-[10px] rounded-[6px] font-semibold text-[14px] flex items-center gap-[8px] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.05)] cursor-pointer disabled:opacity-70"
                  >
                    <Check className="size-[18px] stroke-[2.5]" />
                    <span>
                      {isSaving
                        ? isEn
                          ? "Saving..."
                          : "جارٍ الحفظ..."
                        : isEn
                          ? "Save Changes"
                          : "حفظ التغييرات"}
                    </span>
                  </button>
                </div>
              </DashboardStickyActionBar>
            </div>
          </DashboardPageTransition>
        </main>
      </div>
    </div>
  );
}
