"use client";

import React, { useState } from "react";
import {
  Mail,
  Send,
  Eye,
  CheckCircle2,
  RotateCcw,
  Save,
  X,
  Code,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { ScalesOfJusticeWatermark } from "@/components/shared/ScalesOfJusticeWatermark";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { useUIStore } from "@/stores/use-ui-store";

export interface EmailTemplate {
  id: string;
  name: string;
  nameEn: string;
  triggerEvent: string;
  subject: string;
  body: string;
  isEnabled: boolean;
  sentCountThisMonth: number;
  availableVariables: string[];
}

const initialTemplates: EmailTemplate[] = [
  {
    id: "tmpl-welcome",
    name: "إيميل الترحيب وبدء التجربة المجانية",
    nameEn: "Welcome & Free Trial Started",
    triggerEvent: "فور تسجيل مكتب المحاماة وبدء التجربة المجانية (14 يوماً)",
    subject: "مرحباً بكم في منصة الجودي - تم تفعيل تجربتكم المجانية بنجاح 🎉",
    body: `أهلاً وسهلاً بك سعادة المحامي {owner_name}،

يسعدنا في منصة الجودي لإدارة مكاتب وشركات المحاماة انضمام {law_firm_name} إلى نخبة المكاتب القانونية الرائدة في المملكة.

تم تفعيل فترتكم التجريبية المجانية بنجاح على باقة ({plan_name}) لمدة 14 يوماً، حيث يمكنكم الاستفادة من:
• إدارة القضايا والموكلين وجلسات المحاكم غير المحدودة.
• مساعد الذكاء الاصطناعي لصياغة اللوائح القانونية.
• الفوترة الإلكترونية المعتمدة من هيئة الزكاة (زاتكا).

رابط الدخول المباشر إلى لوحة تحكم مكتبكم:
{login_link}

في حال احتجتم لأي مساعدة أو جلسة تدريب لفريق العمل، يسعدنا تواصلكم المباشر عبر هذا البريد أو عبر الواتساب.

مع أطيب التحيات،
فريق نجاح العملاء - منصة الجودي`,
    isEnabled: true,
    sentCountThisMonth: 142,
    availableVariables: [
      "{owner_name}",
      "{law_firm_name}",
      "{plan_name}",
      "{login_link}",
      "{days_left}",
    ],
  },
  {
    id: "tmpl-trial-ending",
    name: "إيميل تنبيه قبل انتهاء التجربة المجانية بـ 3 أيام",
    nameEn: "Trial Ending in 3 Days Alert",
    triggerEvent: "تلقائياً عندما يتبقى 3 أيام فقط على انتهاء التجربة المجانية",
    subject: "تنبيه هام: متبقي {days_left} أيام على انتهاء تجربتك المجانية في منصة الجودي",
    body: `سعادة {owner_name} المحترم،
تحية طيبة وبعد،،

نود إحاطتكم بأنه لم يتبقَّ سوى ({days_left}) أيام على انتهاء الفترة التجريبية لمكتبكم ({law_firm_name}) في منصة الجودي.

لتجنب انقطاع الخدمة وضمان استمرار مزامنة الجلسات والوصول إلى ملفات القضايا والفواتير بدون توقف، يرجى ترقية الاشتراك وتأكيد الباقة عبر الرابط التالي:
{payment_link}

🎁 عرض خاص لمكتبكم: احصل على خصم 20% عند اختيار الاشتراك السنوي.

شاكرين لكم ثقتكم،
فريق المبيعات والاشتراكات - منصة الجودي`,
    isEnabled: true,
    sentCountThisMonth: 86,
    availableVariables: [
      "{owner_name}",
      "{law_firm_name}",
      "{days_left}",
      "{payment_link}",
      "{plan_name}",
    ],
  },
  {
    id: "tmpl-invoice-due",
    name: "إيميل إصدار وتذكير الفاتورة الضريبية",
    nameEn: "Invoice Due Reminder",
    triggerEvent: "عند إصدار فاتورة جديدة أو اقتراب موعد استحقاق السداد",
    subject: "فاتورة ضريبية جديدة مستحقة السداد رقم {invoice_number} - منصة الجودي",
    body: `سعادة المحامي {owner_name} المحترم،

نحيطكم علماً بصدور الفاتورة الضريبية رقم ({invoice_number}) الخاصة باشتراك ({law_firm_name}) في ({plan_name}).

بيانات الفاتورة:
• رقم الفاتورة: {invoice_number}
• تاريخ الاستحقاق: {due_date}
• المبلغ الإجمالي شامل ضريبة القيمة المضافة 15%: {invoice_amount} ر.س

يمكنكم السداد الفوري عبر بوابة الدفع الآمنة (مدى، فيزا، ماستركارد، سداد):
{payment_link}

نسخة الفاتورة الإلكترونية المعتمدة من هيئة الزكاة والضريبة والجمارك (ZATCA) متوفرة للتحميل في الرابط أعلاه.

شاكرين ومقدرين تعاونكم،
الإدارة المالية - منصة الجودي`,
    isEnabled: true,
    sentCountThisMonth: 310,
    availableVariables: [
      "{owner_name}",
      "{law_firm_name}",
      "{invoice_number}",
      "{invoice_amount}",
      "{due_date}",
      "{payment_link}",
      "{plan_name}",
    ],
  },
  {
    id: "tmpl-payment-success",
    name: "إيميل تأكيد السداد وتجديد الاشتراك بنجاح",
    nameEn: "Payment Success & Renewal Confirmed",
    triggerEvent: "فور نجاح عملية الدفع الإلكتروني وتأكيد المعاملة المالية",
    subject: "تم استلام سداد الفاتورة {invoice_number} وتجديد اشتراككم بنجاح ✅",
    body: `سعادة {owner_name}،

شكراً لكم! تم بنجاح استلام سداد الفاتورة رقم ({invoice_number}) بمبلغ ({invoice_amount} ر.س).

تم تمديد اشتراك مكتبكم ({law_firm_name}) في ({plan_name}) بصورة تلقائية حتى {new_expiry_date}.

يمكنكم دائماً تحميل إيصال السداد والفاتورة الضريبية المختومة من لوحة التحكم.

نسعد بخدمتكم دائماً،
منصة الجودي للحلول القانونية`,
    isEnabled: true,
    sentCountThisMonth: 295,
    availableVariables: [
      "{owner_name}",
      "{law_firm_name}",
      "{invoice_number}",
      "{invoice_amount}",
      "{new_expiry_date}",
      "{plan_name}",
    ],
  },
  {
    id: "tmpl-suspension-warning",
    name: "إيميل إشعار تعليق الحساب بسبب تأخر السداد",
    nameEn: "Account Suspension Warning",
    triggerEvent: "عند تأخر سداد الفاتورة لأكثر من 14 يوماً عن تاريخ الاستحقاق",
    subject: "تنبيه نهائي: تعليق حساب مكتب المحاماة {law_firm_name} لتأخر السداد",
    body: `سعادة المحامي {owner_name} المحترم،

يؤسفنا إبلاغكم بأنه نظراً لعدم تسوية الفاتورة رقم ({invoice_number}) بمبلغ ({invoice_amount} ر.س) بعد انقضاء مهلة السداد، فقد تم تعليق صلاحيات الدخول إلى النظام مؤقتاً لمكتبكم ({law_firm_name}).

لإلغاء التعليق واستعادة وصول المحامين والموكلين فورياً، يرجى سداد الفاتورة عبر الرابط التالي:
{payment_link}

بمجرد إتمام الدفع سيتم إعادة تفعيل الحساب وكافة الخدمات خلال دقيقة واحدة آلياً.

الإدارة القانونية والمالية - منصة الجودي`,
    isEnabled: true,
    sentCountThisMonth: 12,
    availableVariables: [
      "{owner_name}",
      "{law_firm_name}",
      "{invoice_number}",
      "{invoice_amount}",
      "{payment_link}",
    ],
  },
];

export function NotificationsTemplatesView() {
  const { language } = useUIStore();
  const isAr = language === "ar";

  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(initialTemplates[0]);

  // Editor State
  const [editSubject, setEditSubject] = useState(initialTemplates[0].subject);
  const [editBody, setEditBody] = useState(initialTemplates[0].body);
  const [editIsEnabled, setEditIsEnabled] = useState(initialTemplates[0].isEnabled);

  // Test Email Modal State
  const [isTestEmailOpen, setIsTestEmailOpen] = useState(false);
  const [testEmailRecipient, setTestEmailRecipient] = useState("lawyer.demo@aljoody.sa");
  const [isSendingTest, setIsSendingTest] = useState(false);

  // Switch Selected Template
  const handleSelectTemplate = (tmpl: EmailTemplate) => {
    setSelectedTemplate(tmpl);
    setEditSubject(tmpl.subject);
    setEditBody(tmpl.body);
    setEditIsEnabled(tmpl.isEnabled);
  };

  // Toggle Template Enabled
  const handleToggleEnable = (tmplId: string, current: boolean) => {
    const nextVal = !current;
    setTemplates((prev) =>
      prev.map((t) => (t.id === tmplId ? { ...t, isEnabled: nextVal } : t))
    );
    if (selectedTemplate.id === tmplId) {
      setEditIsEnabled(nextVal);
    }
    toast.success(
      nextVal
        ? "تم تفعيل القالب للإرسال التلقائي"
        : "تم تعطيل الإرسال التلقائي لهذا القالب"
    );
  };

  // Insert Variable Chip into Body
  const handleInsertVariable = (variable: string) => {
    setEditBody((prev) => prev + " " + variable + " ");
    toast.info(`تم إدراج المتغير: ${variable}`);
  };

  // Save Template Changes
  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === selectedTemplate.id
          ? {
              ...t,
              subject: editSubject,
              body: editBody,
              isEnabled: editIsEnabled,
            }
          : t
      )
    );
    setSelectedTemplate((prev) => ({
      ...prev,
      subject: editSubject,
      body: editBody,
      isEnabled: editIsEnabled,
    }));
    toast.success(isAr ? "تم حفظ تعديلات القالب بنجاح" : "Template saved successfully");
  };

  // Send Test Email Dispatch
  const handleSendTestEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailRecipient.trim()) return;

    setIsSendingTest(true);
    setTimeout(() => {
      setIsSendingTest(false);
      setIsTestEmailOpen(false);
      toast.success(
        isAr ? `تم إرسال الإيميل التجريبي إلى: ${testEmailRecipient}` : "Test email sent successfully",
        {
          description: `تم استبدال المتغيرات بقيم تجريبية واقعية لمعاينة التنسيق`,
        }
      );
    }, 1200);
  };

  // Render Simulated Live Preview replacing variables
  const getRenderedBodyPreview = (rawBody: string) => {
    return rawBody
      .replace(/{owner_name}/g, "د. عبد العزيز العثمان")
      .replace(/{law_firm_name}/g, "شركة العثمان للمحاماة")
      .replace(/{plan_name}/g, "باقة المكاتب المتقدمة (Professional)")
      .replace(/{days_left}/g, "3")
      .replace(/{invoice_number}/g, "INV-2026-0891")
      .replace(/{invoice_amount}/g, "8,038.5")
      .replace(/{due_date}/g, "2026-10-25")
      .replace(/{new_expiry_date}/g, "2027-10-25")
      .replace(/{login_link}/g, "https://app.aljoody-law.sa/login")
      .replace(/{payment_link}/g, "https://pay.aljoody-law.sa/inv/INV-2026-0891");
  };

  const getRenderedSubjectPreview = (rawSubject: string) => {
    return rawSubject
      .replace(/{owner_name}/g, "د. عبد العزيز العثمان")
      .replace(/{law_firm_name}/g, "شركة العثمان للمحاماة")
      .replace(/{days_left}/g, "3")
      .replace(/{invoice_number}/g, "INV-2026-0891");
  };

  // KPIs
  const totalTemplates = templates.length;
  const activeTemplates = templates.filter((t) => t.isEnabled).length;
  const totalSentMonth = templates.reduce((acc, t) => acc + t.sentCountThisMonth, 0);

  return (
    <div className="flex h-screen h-dvh overflow-hidden bg-[#fcfbfa] dark:bg-[#121110] text-[#1c1917] dark:text-[#f5f4f0] transition-colors duration-200 relative">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        <DashboardTopNavbar />

        <main className="flex-1 overflow-y-auto w-full relative p-4 sm:p-6 lg:p-8 scrollbar-thin">
          <DashboardPageTransition>
          {/* Ambient Scales of Justice Emblems */}
          <div
            className="fixed top-28 -left-28 w-[380px] h-[380px] opacity-[0.035] dark:opacity-[0.045] text-[#c29547] pointer-events-none select-none z-0"
            aria-hidden="true"
          >
            <ScalesOfJusticeWatermark className="w-full h-full" />
          </div>

          <div
            className="fixed bottom-10 -right-28 w-[420px] h-[420px] opacity-[0.035] dark:opacity-[0.045] text-[#c29547] pointer-events-none select-none z-0"
            aria-hidden="true"
          >
            <ScalesOfJusticeWatermark className="w-full h-full" />
          </div>

          <div className="relative z-10 w-full space-y-6 text-start">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2c2825] dark:text-[#f5f4f0] flex items-center gap-2.5">
                  <Mail className="w-7 h-7 text-[#c29547] dark:text-[#d4a759]" />
                  <span>{isAr ? "قوالب الإيميلات الآلية وإشعارات المكاتب" : "Automated Email Templates"}</span>
                </h1>
                <p className="text-xs sm:text-sm text-[#736b63] dark:text-[#a8a196] mt-1 max-w-3xl">
                  {isAr
                    ? "تخصيص محتوى ونصوص الإيميلات التلقائية (الترحيب، تذكير انتهاء التجربة، الفواتير، تأكيد الدفع، والتعليق)، وإدراج المتغيرات الذكية."
                    : "Manage automated email dispatch templates, dynamic merge variables, and test email sending."}
                </p>
              </div>

              {/* Action: Send Test Email */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsTestEmailOpen(true)}
                  className="px-4 py-2.5 rounded-2xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] text-xs font-bold text-[#2c2825] dark:text-[#f5f4f0] hover:border-[#c29547] hover:text-[#c29547] transition-all cursor-pointer flex items-center gap-2 shadow-2xs"
                >
                  <Send className="w-4 h-4 text-[#c29547]" />
                  <span>{isAr ? "إرسال إيميل تجريبي" : "Send Test Email"}</span>
                </button>
              </div>
            </div>

            {/* Top 4 KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Templates */}
              <div className="p-4 rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#8c8279] dark:text-[#9e968a]">
                    {isAr ? "إجمالي القوالب المعرفة" : "Total Templates"}
                  </p>
                  <h3 className="text-2xl font-black text-[#2c2825] dark:text-[#f5f4f0] mt-1 font-mono">
                    {totalTemplates}
                  </h3>
                  <p className="text-[11px] text-[#736b63] dark:text-[#a8a196] mt-0.5">
                    {isAr ? "قوالب مسارات الأحداث الآلية" : "Automated event triggers"}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#fff7e6] dark:bg-[#2b2014] border border-[#eeddbb] dark:border-[#604218] flex items-center justify-center text-[#c29547]">
                  <Mail className="w-6 h-6" />
                </div>
              </div>

              {/* Active Templates */}
              <div className="p-4 rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#8c8279] dark:text-[#9e968a]">
                    {isAr ? "القوالب المفعّلة حالياً" : "Active Templates"}
                  </p>
                  <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                    {activeTemplates}
                  </h3>
                  <p className="text-[11px] text-[#736b63] dark:text-[#a8a196] mt-0.5">
                    {isAr ? "تعمل وتُرسل تلقائياً للمكاتب" : "Active and sending"}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              {/* Sent this month */}
              <div className="p-4 rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#8c8279] dark:text-[#9e968a]">
                    {isAr ? "إيميلات أرسلت هذا الشهر" : "Dispatched This Month"}
                  </p>
                  <h3 className="text-2xl font-black text-[#c29547] dark:text-[#d4a759] mt-1 font-mono">
                    {totalSentMonth.toLocaleString()}
                  </h3>
                  <p className="text-[11px] text-[#736b63] dark:text-[#a8a196] mt-0.5">
                    {isAr ? "رسائل ترحيب، فواتير وتنبيهات" : "Auto-dispatched emails"}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#fff7e6] dark:bg-[#2b2014] border border-[#eeddbb] dark:border-[#604218] flex items-center justify-center text-[#c29547]">
                  <Send className="w-6 h-6" />
                </div>
              </div>

              {/* Delivery Rate */}
              <div className="p-4 rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#8c8279] dark:text-[#9e968a]">
                    {isAr ? "معدل التسليم والوصول" : "Delivery Rate"}
                  </p>
                  <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                    99.4%
                  </h3>
                  <p className="text-[11px] text-[#736b63] dark:text-[#a8a196] mt-0.5">
                    {isAr ? "موثوقية خوادم SMTP والـ SPF" : "High inbox placement"}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Split Master-Detail Layout: Left/Sidebar list of templates, Right/Main editor & preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: List of Templates */}
              <div className="lg:col-span-4 space-y-3">
                <div className="p-4 rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs">
                  <h3 className="text-xs font-bold text-[#c29547] uppercase tracking-wider mb-3">
                    {isAr ? "قائمة مسارات الإيميلات الآلية" : "Email Templates List"}
                  </h3>

                  <div className="space-y-2">
                    {templates.map((tmpl) => {
                      const isSelected = tmpl.id === selectedTemplate.id;

                      return (
                        <div
                          key={tmpl.id}
                          onClick={() => handleSelectTemplate(tmpl)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? "bg-[#faf5eb] dark:bg-[#201c17] border-[#c29547] ring-1 ring-[#c29547]/30 shadow-xs"
                              : "bg-white dark:bg-[#1e1b18] border-[#ded5c6]/60 dark:border-[#2f2a24] hover:border-[#c29547]/50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="text-xs font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                                {tmpl.name}
                              </h4>
                              <p className="text-[10px] text-[#8c8279] mt-0.5 line-clamp-1">
                                {tmpl.triggerEvent}
                              </p>
                            </div>

                            <span
                              className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 ${
                                tmpl.isEnabled ? "bg-emerald-500" : "bg-stone-300 dark:bg-stone-700"
                              }`}
                              title={tmpl.isEnabled ? "مفعّل" : "معطل"}
                            />
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-[#ded5c6]/40 dark:border-[#2f2a24] flex items-center justify-between text-[10px] text-[#8c8279]">
                            <span>{tmpl.sentCountThisMonth} إيميل هذا الشهر</span>
                            <span className="font-bold text-[#c29547]">
                              {isSelected ? (isAr ? "قيد التعديل ✏️" : "Editing") : (isAr ? "تعديل" : "Edit")}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Template Editor & Live Preview */}
              <div className="lg:col-span-8 space-y-6">
                {/* Editor Box */}
                <form
                  onSubmit={handleSaveTemplate}
                  className="p-6 rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs space-y-5"
                >
                  {/* Top Bar inside Editor */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ded5c6]/60 dark:border-[#2f2a24]">
                    <div>
                      <h2 className="text-base font-extrabold text-[#2c2825] dark:text-[#f5f4f0]">
                        {selectedTemplate.name}
                      </h2>
                      <p className="text-xs text-[#8c8279] mt-0.5">
                        {selectedTemplate.triggerEvent}
                      </p>
                    </div>

                    {/* Enable Toggle Switch */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                        {editIsEnabled ? "الإرسال التلقائي مفعّل" : "معطل مؤقتاً"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleEnable(selectedTemplate.id, editIsEnabled)}
                        className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer relative ${
                          editIsEnabled ? "bg-[#c29547]" : "bg-stone-300 dark:bg-stone-700"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                            editIsEnabled ? (isAr ? "-translate-x-5" : "translate-x-5") : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Email Subject Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                      عنوان الإيميل (Subject Line) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl text-xs bg-[#fbf9f5] dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0]"
                    />
                  </div>

                  {/* Variable Chips Bar */}
                  <div className="space-y-2 p-3.5 rounded-2xl bg-[#faf5eb]/60 dark:bg-[#201c17]/60 border border-[#ded5c6]/60 dark:border-[#2f2a24]">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#8c8279]">
                      <span className="flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-[#c29547]" />
                        <span>المتغيرات الديناميكية المتاحة (انقر للإدراج في النص):</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {selectedTemplate.availableVariables.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => handleInsertVariable(v)}
                          className="px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] text-[#c29547] hover:border-[#c29547] hover:bg-[#fff7e6] transition-all cursor-pointer shadow-2xs"
                        >
                          + {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Email Body Textarea */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                      محتوى الإيميل (Email Body) *
                    </label>
                    <textarea
                      rows={12}
                      required
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      className="w-full p-4 rounded-2xl text-xs font-sans leading-relaxed bg-[#fbf9f5] dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0] resize-y"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const original = initialTemplates.find((t) => t.id === selectedTemplate.id);
                        if (original) {
                          setEditSubject(original.subject);
                          setEditBody(original.body);
                          toast.info("تمت استعادة النص الافتراضي للقالب");
                        }
                      }}
                      className="px-4 py-2 rounded-xl border border-[#ded5c6] dark:border-[#2f2a24] text-xs font-bold text-[#8c8279] hover:text-[#2c2825] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>استعادة النص الأصلي</span>
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4a759] to-[#c29547] text-white text-xs font-bold hover:opacity-95 transition-all cursor-pointer shadow-sm flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ تعديلات القالب</span>
                    </button>
                  </div>
                </form>

                {/* Simulated Real Email Preview */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#ded5c6]/60 dark:border-[#2f2a24]">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#c29547]">
                      <Eye className="w-4 h-4" />
                      <span>معاينة حية للإيميل كما سيصل للمحامي (Live Rendered Preview)</span>
                    </div>

                    <span className="text-[10px] text-[#8c8279] bg-[#faf5eb] dark:bg-[#201c17] px-2 py-0.5 rounded-md border border-[#ded5c6]/60 dark:border-[#2f2a24]">
                      قيم تجريبية واقعية
                    </span>
                  </div>

                  {/* Simulated Mail Client Window */}
                  <div className="rounded-2xl border border-[#ded5c6]/80 dark:border-[#2f2a24] overflow-hidden bg-[#faf8f5] dark:bg-[#161412] text-xs">
                    {/* Fake Mail Client Header */}
                    <div className="p-4 bg-white dark:bg-[#1e1b18] border-b border-[#ded5c6]/60 dark:border-[#2f2a24] space-y-1.5">
                      <div className="flex items-center justify-between text-[#8c8279]">
                        <span>من: <strong className="text-[#2c2825] dark:text-[#f5f4f0]">منصة الجودي &lt;notifications@aljoody-law.sa&gt;</strong></span>
                        <span className="font-mono text-[10px]">الآن</span>
                      </div>
                      <div className="text-[#8c8279]">
                        إلى: <strong className="text-[#2c2825] dark:text-[#f5f4f0]">د. عبد العزيز العثمان &lt;contact@alothman-law.com&gt;</strong>
                      </div>
                      <div className="text-[#8c8279] pt-1">
                        الموضوع: <strong className="text-[#c29547]">{getRenderedSubjectPreview(editSubject)}</strong>
                      </div>
                    </div>

                    {/* Email Body Card */}
                    <div className="p-6 max-w-xl mx-auto my-4 rounded-2xl bg-white dark:bg-[#1f1c19] border border-[#eeddbb]/80 dark:border-[#403423] shadow-xs space-y-4">
                      {/* Brand Logo in Email */}
                      <div className="flex items-center justify-between pb-3 border-b border-[#ded5c6]/40 dark:border-[#2f2a24]">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#fff7e6] dark:bg-[#2b2014] text-[#c29547] flex items-center justify-center font-bold">
                            ⚖️
                          </div>
                          <span className="font-bold text-[#c29547]">منصة الجودي لإدارة مكاتب المحاماة</span>
                        </div>
                        <span className="text-[10px] text-[#8c8279]">المملكة العربية السعودية</span>
                      </div>

                      {/* Content */}
                      <div className="text-[#2c2825] dark:text-[#f5f4f0] leading-relaxed whitespace-pre-line text-xs font-sans">
                        {getRenderedBodyPreview(editBody)}
                      </div>

                      {/* Email Footer */}
                      <div className="pt-4 border-t border-[#ded5c6]/40 dark:border-[#2f2a24] text-[10px] text-center text-[#8c8279] space-y-1">
                        <p>© 2026 منصة الجودي للحلول القانونية وتقنية المعلومات. جميع الحقوق محفوظة.</p>
                        <p>الرياض - طريق الملك فهد | هاتف الدعم الموحد: 920008899</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </DashboardPageTransition>
        </main>
      </div>

      {/* Send Test Email Modal */}
      {isTestEmailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] p-6 shadow-2xl text-start space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#ded5c6]/60 dark:border-[#2f2a24]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#fff7e6] dark:bg-[#2b2014] text-[#c29547] flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                    إرسال إيميل تجريبي (Test Dispatch)
                  </h3>
                  <p className="text-[11px] text-[#8c8279]">
                    تأكد من شكل وتنسيق القالب في صندوق الوارد
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTestEmailOpen(false)}
                className="p-1 rounded-full text-[#8c8279] hover:text-[#2c2825] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendTestEmail} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                  البريد الإلكتروني المستلم *
                </label>
                <input
                  type="email"
                  required
                  value={testEmailRecipient}
                  onChange={(e) => setTestEmailRecipient(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full h-11 px-4 rounded-xl text-xs font-mono bg-[#fbf9f5] dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0]"
                />
              </div>

              <div className="p-3 rounded-2xl bg-[#faf5eb] dark:bg-[#201c17] border border-[#ded5c6]/60 dark:border-[#2f2a24] space-y-1">
                <p className="font-bold text-[#c29547]">القالب الذي سيتم إرساله:</p>
                <p className="text-[#2c2825] dark:text-[#f5f4f0] font-semibold">{selectedTemplate.name}</p>
                <p className="text-[#8c8279] text-[11px] truncate">الموضوع: {getRenderedSubjectPreview(editSubject)}</p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsTestEmailOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#ded5c6] dark:border-[#2f2a24] font-bold text-[#736b63] cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSendingTest}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4a759] to-[#c29547] text-white font-bold hover:opacity-95 cursor-pointer shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className={`w-3.5 h-3.5 ${isSendingTest ? "animate-pulse" : ""}`} />
                  <span>{isSendingTest ? "جاري الإرسال..." : "إرسال الآن"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
