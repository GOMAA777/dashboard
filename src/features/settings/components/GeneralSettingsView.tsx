"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logoImg from "../../../../public/logo.png";
import { toast } from "sonner";
import {
  Building2,
  Globe,
  Palette,
  Share2,
  Phone,
  Mail,
  ShieldCheck,
  Check,
  Copy,
  ExternalLink,
  Trash2,
  Upload,
  ArrowRight,
  Loader2,
  Pencil,
} from "lucide-react";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { DashboardStickyActionBar } from "@/components/shared/DashboardStickyActionBar";
import { initialGeneralSettings } from "../data/initialGeneralSettings";
import { GeneralSettings } from "../types/general-settings.types";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { saveUnifiedDraft } from "@/stores/use-drafts-store";
import { updateGeneralSettings } from "@/lib/api/settings";
import { mapGeneralSettingsFromApi } from "@/lib/api/mappers";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGeneralSettingsQuery,
  invalidateSettingsQueries,
} from "@/features/settings/hooks/useSettingsQuery";

const fieldInputClass =
  "w-full h-[40px] bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-normal rounded-[4px] px-3 border border-transparent dark:border-[#38271c] focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] focus:outline-none transition-all";

const fieldLabelClass =
  "text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start flex items-center gap-0.5";

function SectionHeader({
  icon: Icon,
  title,
  badge,
}: {
  icon: React.ElementType;
  title: string;
  badge?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="size-8 rounded-[6px] bg-[rgba(156,100,2,0.1)] dark:bg-[rgba(226,157,56,0.15)] flex items-center justify-center shrink-0 text-[#9c6402] dark:text-[#f59e0b]">
          <Icon className="size-4" />
        </div>
        <h2 className="text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-5 truncate">
          {title}
        </h2>
      </div>
      {badge ? (
        <span className="shrink-0 bg-[rgba(255,221,182,0.35)] dark:bg-[#38271c] text-[#643f00] dark:text-[#ffddb6] text-[10px] font-bold px-2 py-0.5 rounded-[2px] hidden sm:inline">
          {badge}
        </span>
      ) : null}
    </div>
  );
}

export function GeneralSettingsView() {
  const { direction, isEn, setLanguage } = useLanguage();
  const router = useRouter();
  const [formData, setFormData] = useState<GeneralSettings>(initialGeneralSettings);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const queryClient = useQueryClient();
  const settingsQuery = useGeneralSettingsQuery();
  const isBootstrapping = settingsQuery.isLoading && !settingsQuery.data;

  useEffect(() => {
    if (settingsQuery.data) {
      const mapped = mapGeneralSettingsFromApi(settingsQuery.data);
      setFormData((prev) => ({ ...prev, ...mapped }));
    }
  }, [settingsQuery.data]);

  const royalSwatches = [
    { label: isEn ? "Burgundy" : "عنابي", hex: "#881337" },
    { label: isEn ? "Dark Teal" : "فيروزي داكن", hex: "#0f766e" },
    { label: isEn ? "Slate Gray" : "رمادي أردوازي", hex: "#1e293b" },
    { label: isEn ? "Royal Gold" : "ذهبي ملكي", hex: "#9c6402" },
  ];

  const handleCopyLicense = () => {
    navigator.clipboard.writeText(formData.licenseCode);
    setCopiedCode(true);
    toast.success(
      isEn ? "License code copied to clipboard" : "تم نسخ كود التفعيل إلى الحافظة"
    );
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateGeneralSettings({
        system_title: formData.systemTitle,
        company_name: formData.companyName,
        slogan: formData.slogan,
        phone: formData.phone,
        email: formData.email,
        timezone: formData.timezone,
        default_language: formData.defaultLanguage,
        country: formData.country,
        default_currency: formData.defaultCurrency,
        primary_color: formData.primaryColor,
        telegram_url: formData.telegramGuideUrl,
        whatsapp_url: formData.whatsappGuideUrl,
        api_docs_url: formData.apiDocsUrl,
      });
      invalidateSettingsQueries(queryClient, "general");
      setIsSaving(false);
      toast.success(
        isEn
          ? "General settings saved successfully and brand identity updated."
          : "تم حفظ الإعدادات العامة بنجاح وتحديث الهوية البصرية للنظام."
      );
      router.push("/settings/general");
    } catch {
      setIsSaving(false);
      toast.error(
        isEn
          ? "Failed to save general settings. Please try again."
          : "تعذر حفظ الإعدادات العامة، برجاء المحاولة مرة أخرى."
      );
    }
  };

  const handleSaveDraft = () => {
    const draftId = `draft_settings_${Date.now()}`;
    saveUnifiedDraft({
      id: draftId,
      type: "settings",
      typeLabelAr: "إعدادات النظام",
      typeLabelEn: "System Settings",
      title: formData.systemTitle
        ? `مسودة إعدادات ${formData.systemTitle}`
        : isEn
        ? "General Settings Draft"
        : "مسودة الإعدادات العامة",
      summary: `${formData.email || "البريد الرسمي"} • ${formData.phone || "هاتف الدعم"}`,
      targetUrl: `/settings/general/edit?draftId=${draftId}`,
      badge: isEn ? "Draft" : "مسودة",
      data: { ...formData },
    });
    toast.success(
      isEn
        ? "General settings saved to Drafts successfully"
        : "تم حفظ الإعدادات كمسودة بنجاح ونقلها إلى قسم المسودات"
    );
  };

  const handleCancel = () => {
    router.push("/settings/general");
  };

  return (
    <div
      dir={direction}
      className="flex h-screen h-dvh bg-[#f5f3ef] dark:bg-[#150f0b] text-[#1b1c1a] dark:text-[#fdfbf7] font-sans antialiased overflow-hidden selection:bg-[#ffddb6]/30 selection:text-[#643f00] transition-colors duration-200"
    >
      <DashboardSidebar activeNav="system-settings" activeSubNav="general" />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <DashboardTopNavbar />

        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 pt-5 pb-2 sm:pb-3 max-w-[1360px] w-full mx-auto space-y-4 scrollbar-thin">
          <DashboardPageTransition>
            <div className="space-y-4 w-full">
              {/* Compact edit command banner */}
              <div className="bg-white dark:bg-[#221812] rounded-[8px] px-4 py-3.5 sm:px-5 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <Link
                    href="/settings/general"
                    className="size-9 rounded-[6px] border border-[#eae8e4] dark:border-[#38271c] bg-[#f5f3ef] dark:bg-[#281c15] hover:bg-[#ebe8e2] dark:hover:bg-[#34241b] flex items-center justify-center shrink-0 transition-colors"
                    title={isEn ? "Back to details" : "العودة للعرض"}
                  >
                    <ArrowRight className={cn("size-4 text-[#514537] dark:text-[#cdc5bd]", isEn && "rotate-180")} />
                  </Link>
                  <div className="flex flex-col gap-1 text-start min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-[20px] sm:text-[22px] leading-7 font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                        {isEn ? "Edit General Settings" : "تعديل الإعدادات العامة"}
                      </h1>
                      <span className="inline-flex items-center gap-1 bg-[#9c6402]/12 dark:bg-[#e29d38]/15 text-[#9c6402] dark:text-[#e29d38] text-[10px] font-bold px-2 py-0.5 rounded-[2px]">
                        <Pencil className="size-3" />
                        {isEn ? "Edit mode" : "وضع التعديل"}
                      </span>
                    </div>
                    <p className="text-[12px] leading-[18px] text-[#514537] dark:text-[#a89f91]">
                      {isEn
                        ? "Update platform identity and operational defaults in a compact form."
                        : "حدّث هوية المنصة والإعدادات التشغيلية من نموذج مدمج جنب بعض."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Main form card */}
              <div className="relative bg-white dark:bg-[#221812] rounded-[8px] p-4 sm:p-5 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col gap-4">
                {isBootstrapping && (
                  <div className="absolute inset-0 z-10 rounded-[8px] bg-white/70 dark:bg-[#221812]/75 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="flex items-center gap-2 text-[#9c6402] dark:text-[#e29d38] text-[13px] font-semibold">
                      <Loader2 className="size-4 animate-spin" />
                      <span>{isEn ? "Loading settings..." : "جاري تحميل الإعدادات..."}</span>
                    </div>
                  </div>
                )}

                {/* SECTION 1 */}
                <section>
                  <SectionHeader
                    icon={Building2}
                    title={isEn ? "System & Entity Data" : "بيانات النظام والمنشأة"}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-3 gap-y-3">
                    <div className="flex flex-col gap-1.5">
                      <label className={fieldLabelClass}>
                        <span>{isEn ? "System Title" : "عنوان النظام"}</span>
                        <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.systemTitle}
                        onChange={(e) => setFormData({ ...formData, systemTitle: e.target.value })}
                        className={fieldInputClass}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className={fieldLabelClass}>
                        <span>{isEn ? "Company / Firm Name" : "اسم الشركة أو المنشأة"}</span>
                        <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className={fieldInputClass}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 sm:col-span-2 xl:col-span-1">
                      <label className={fieldLabelClass}>
                        {isEn ? "Slogan" : "العبارة التعريفية"}
                      </label>
                      <input
                        type="text"
                        value={formData.slogan}
                        onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                        className={fieldInputClass}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className={fieldLabelClass}>
                        <span>{isEn ? "Official Phone" : "رقم الهاتف المعتمد"}</span>
                        <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          dir="ltr"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={cn(fieldInputClass, "ps-3 pe-9 text-start")}
                        />
                        <Phone className="absolute top-1/2 -translate-y-1/2 end-3 size-[14px] text-[#837565] dark:text-[#a89f91]" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <label className={fieldLabelClass}>
                          <span>{isEn ? "Official Email" : "البريد الإلكتروني الرسمي"}</span>
                          <span className="text-[#ba1a1a]">*</span>
                        </label>
                        {formData.isEmailVerified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#047857] dark:text-[#6ee7b7]">
                            <ShieldCheck className="size-3" />
                            {isEn ? "Verified" : "مُتحقق"}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="email"
                          dir="ltr"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={cn(fieldInputClass, "ps-3 pe-9 text-start")}
                        />
                        <Mail className="absolute top-1/2 -translate-y-1/2 end-3 size-[14px] text-[#837565] dark:text-[#a89f91]" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <label className={fieldLabelClass}>
                          {isEn ? "License Key" : "كود التفعيل"}
                        </label>
                        <span className="inline-flex items-center gap-1 bg-[#ecfdf5] dark:bg-[#132c21] border border-emerald-200 dark:border-emerald-500/30 px-1.5 py-0.5 rounded-[3px] text-[9px] font-bold text-[#065f46] dark:text-[#6ee7b7]">
                          <span className="size-1.5 rounded-full bg-[#059669]" />
                          {isEn ? "Active" : "مفعّل"}
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          dir="ltr"
                          readOnly
                          value={formData.licenseCode}
                          className={cn(
                            fieldInputClass,
                            "ps-[72px] pe-9 font-mono text-[12px] font-bold bg-[#f0eeea] dark:bg-[#281c15] cursor-default"
                          )}
                        />
                        <ShieldCheck className="absolute top-1/2 -translate-y-1/2 end-3 size-[15px] text-[#837565] dark:text-[#a89f91]" />
                        <button
                          type="button"
                          onClick={handleCopyLicense}
                          className="absolute top-1/2 -translate-y-1/2 start-1.5 bg-white dark:bg-[#221812] hover:bg-[#f5f3ef] dark:hover:bg-[#34241b] border border-[#ded5c6] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] rounded-[3px] px-2 py-1 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Copy className="size-3" />
                          <span>{copiedCode ? (isEn ? "Copied" : "تم") : isEn ? "Copy" : "نسخ"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="h-px bg-[#eae8e4] dark:bg-[#38271c] w-full" />

                {/* SECTION 2 */}
                <section>
                  <SectionHeader
                    icon={Globe}
                    title={isEn ? "Regional & Localization" : "الإعدادات الإقليمية"}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-3 gap-y-3">
                    <div className="flex flex-col gap-1.5">
                      <label className={fieldLabelClass}>
                        <span>{isEn ? "Timezone" : "المنطقة الزمنية"}</span>
                        <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <DashboardSelect
                        value={formData.timezone}
                        onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                        className="h-[40px] text-[13px]"
                      >
                        <option value="(GMT+03:00) توقيت الرياض - المملكة العربية السعودية (AST)">
                          {isEn ? "(GMT+03:00) Riyadh (AST)" : "(GMT+03:00) الرياض (AST)"}
                        </option>
                        <option value="(GMT+04:00) توقيت دبي - الإمارات العربية المتحدة (GST)">
                          {isEn ? "(GMT+04:00) Dubai (GST)" : "(GMT+04:00) دبي (GST)"}
                        </option>
                        <option value="(GMT+03:00) توقيت الكويت - دولة الكويت (AST)">
                          {isEn ? "(GMT+03:00) Kuwait (AST)" : "(GMT+03:00) الكويت (AST)"}
                        </option>
                        <option value="(GMT+02:00) توقيت القاهرة - جمهورية مصر العربية (EET)">
                          {isEn ? "(GMT+02:00) Cairo (EET)" : "(GMT+02:00) القاهرة (EET)"}
                        </option>
                      </DashboardSelect>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className={fieldLabelClass}>
                        <span>{isEn ? "Default Language" : "لغة الواجهة"}</span>
                        <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <DashboardSelect
                        value={formData.defaultLanguage}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({ ...formData, defaultLanguage: val });
                          if (val.includes("English") || val.includes("EN")) setLanguage("en");
                          else if (val.includes("العربية") || val.includes("AR")) setLanguage("ar");
                        }}
                        className="h-[40px] text-[13px]"
                      >
                        <option value="العربية (المملكة العربية السعودية) - AR (افتراضي)">
                          {isEn ? "Arabic (AR)" : "العربية (AR)"}
                        </option>
                        <option value="English (United States) - EN">English (EN)</option>
                        <option value="Français (France) - FR">Français (FR)</option>
                      </DashboardSelect>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className={fieldLabelClass}>
                        <span>{isEn ? "Country" : "الدولة والمقر"}</span>
                        <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <DashboardSelect
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="h-[40px] text-[13px]"
                      >
                        <option value="المملكة العربية السعودية (KSA) 🇸🇦">
                          {isEn ? "Saudi Arabia 🇸🇦" : "السعودية 🇸🇦"}
                        </option>
                        <option value="الإمارات العربية المتحدة (UAE) 🇦🇪">
                          {isEn ? "UAE 🇦🇪" : "الإمارات 🇦🇪"}
                        </option>
                        <option value="دولة الكويت (KWT) 🇰🇼">
                          {isEn ? "Kuwait 🇰🇼" : "الكويت 🇰🇼"}
                        </option>
                        <option value="مملكة البحرين (BHR) 🇧🇭">
                          {isEn ? "Bahrain 🇧🇭" : "البحرين 🇧🇭"}
                        </option>
                        <option value="سلطنة عمان (OMN) 🇴🇲">
                          {isEn ? "Oman 🇴🇲" : "عمان 🇴🇲"}
                        </option>
                        <option value="دولة قطر (QAT) 🇶🇦">
                          {isEn ? "Qatar 🇶🇦" : "قطر 🇶🇦"}
                        </option>
                      </DashboardSelect>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className={fieldLabelClass}>
                        <span>{isEn ? "Default Currency" : "العملة الافتراضية"}</span>
                        <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <DashboardSelect
                        value={formData.defaultCurrency}
                        onChange={(e) => setFormData({ ...formData, defaultCurrency: e.target.value })}
                        className="h-[40px] text-[13px]"
                      >
                        <option value="ريال سعودي (SAR - ر.س)">
                          {isEn ? "SAR" : "ريال سعودي (SAR)"}
                        </option>
                        <option value="درهم إماراتي (AED - د.إ)">
                          {isEn ? "AED" : "درهم إماراتي (AED)"}
                        </option>
                        <option value="دينار كويتي (KWD - د.ك)">
                          {isEn ? "KWD" : "دينار كويتي (KWD)"}
                        </option>
                        <option value="دولار أمريكي (USD - $)">
                          {isEn ? "USD" : "دولار أمريكي (USD)"}
                        </option>
                      </DashboardSelect>
                    </div>
                  </div>
                </section>

                <div className="h-px bg-[#eae8e4] dark:bg-[#38271c] w-full" />

                {/* SECTION 3 */}
                <section>
                  <SectionHeader
                    icon={Palette}
                    title={isEn ? "Visual Branding" : "الهوية البصرية"}
                    badge={isEn ? "Brand kit" : "هوية المنشأة"}
                  />
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                    <div className="lg:col-span-7 flex flex-col gap-1.5">
                      <label className={fieldLabelClass}>
                        {isEn ? "Platform Logo" : "شعار المنصة"}
                      </label>
                      <div className="bg-[#f5f3ef] dark:bg-[#281c15] rounded-[6px] p-3 flex items-center gap-3 border border-transparent dark:border-[#38271c]">
                        <div className="size-16 rounded-[6px] bg-[#1c140f] flex items-center justify-center shrink-0 p-2 border border-white/5">
                          <Image
                            src={logoImg}
                            alt="Logo"
                            width={40}
                            height={40}
                            className="object-contain max-h-10"
                          />
                        </div>
                        <div className="flex-1 flex flex-col gap-2 text-start min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() =>
                                toast.info(
                                  isEn
                                    ? "Select new logo image (min 512×512 px)"
                                    : "اختر ملف الشعار الجديد بدقة 512×512"
                                )
                              }
                              className="bg-white dark:bg-[#221812] hover:bg-[#faf9f6] dark:hover:bg-[#34241b] text-[#1b1c1a] dark:text-[#fdfbf7] text-[11px] font-semibold px-3 py-1.5 rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Upload className="size-3.5" />
                              <span>{isEn ? "Change" : "تغيير"}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                toast.error(
                                  isEn
                                    ? "Cannot delete primary default logo"
                                    : "لا يمكن حذف الشعار الرئيسي الافتراضي"
                                )
                              }
                              className="bg-[rgba(186,26,26,0.1)] hover:bg-[rgba(186,26,26,0.18)] dark:bg-[rgba(248,113,113,0.15)] text-[#ba1a1a] dark:text-[#f87171] text-[11px] font-semibold px-2.5 py-1.5 rounded-[4px] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Trash2 className="size-3.5" />
                              <span>{isEn ? "Delete" : "حذف"}</span>
                            </button>
                          </div>
                          <p className="text-[10px] font-medium text-[#837565] dark:text-[#a89f91] leading-4 truncate">
                            {isEn
                              ? "PNG / SVG / JPG · 512×512 · max 2MB"
                              : "PNG / SVG / JPG · 512×512 · بحد أقصى 2MB"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col gap-1.5">
                      <label className={fieldLabelClass}>
                        {isEn ? "Primary Brand Color" : "اللون الأساسي"}
                      </label>
                      <div className="bg-[#f5f3ef] dark:bg-[#281c15] rounded-[6px] p-3 flex flex-col gap-3 border border-transparent dark:border-[#38271c]">
                        <div className="flex items-center gap-2.5">
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              dir="ltr"
                              value={formData.primaryColor}
                              onChange={(e) =>
                                setFormData({ ...formData, primaryColor: e.target.value })
                              }
                              className="w-full h-[40px] bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-bold uppercase rounded-[4px] ps-9 pe-3 border border-[#eae8e4] dark:border-[#38271c] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38]"
                            />
                            <Palette className="absolute top-1/2 -translate-y-1/2 start-3 size-[14px] text-[#837565] dark:text-[#a89f91]" />
                          </div>
                          <div
                            className="size-10 rounded-[8px] flex items-center justify-center shrink-0 text-white shadow-sm"
                            style={{ backgroundColor: formData.primaryColor }}
                          >
                            <Check className="size-3.5 stroke-[2.5]" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {royalSwatches.map((swatch) => {
                            const isSelected =
                              formData.primaryColor.toLowerCase() === swatch.hex.toLowerCase();
                            return (
                              <button
                                key={swatch.hex}
                                type="button"
                                onClick={() =>
                                  setFormData({ ...formData, primaryColor: swatch.hex })
                                }
                                title={swatch.label}
                                className={cn(
                                  "size-7 rounded-[4px] flex items-center justify-center transition-all cursor-pointer",
                                  isSelected
                                    ? "ring-2 ring-offset-1 ring-[#7b4e00] dark:ring-[#e29d38] scale-105"
                                    : "opacity-90 hover:opacity-100 hover:scale-105"
                                )}
                                style={{ backgroundColor: swatch.hex }}
                              >
                                {isSelected && (
                                  <Check className="size-3 text-white stroke-[3]" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="h-px bg-[#eae8e4] dark:bg-[#38271c] w-full" />

                {/* SECTION 4 */}
                <section>
                  <SectionHeader
                    icon={Share2}
                    title={isEn ? "Integrations & Help Links" : "روابط التكاملات والمساعدة"}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        key: "telegramGuideUrl" as const,
                        label: isEn ? "Telegram Guide" : "دليل Telegram",
                        dot: "bg-[#0ea5e9]",
                        value: formData.telegramGuideUrl,
                      },
                      {
                        key: "whatsappGuideUrl" as const,
                        label: isEn ? "WhatsApp Guide" : "دليل WhatsApp",
                        dot: "bg-[#10b981]",
                        value: formData.whatsappGuideUrl,
                      },
                      {
                        key: "apiDocsUrl" as const,
                        label: isEn ? "API Docs" : "توثيق API",
                        dot: "bg-[#9c6402]",
                        value: formData.apiDocsUrl,
                      },
                    ].map((item) => (
                      <div key={item.key} className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-start">
                          <span className={cn("size-2 rounded-full", item.dot)} />
                          <label className={fieldLabelClass}>{item.label}</label>
                        </div>
                        <div className="relative">
                          <input
                            type="url"
                            dir="ltr"
                            value={item.value ?? ""}
                            onChange={(e) =>
                              setFormData({ ...formData, [item.key]: e.target.value })
                            }
                            className={cn(fieldInputClass, "ps-8 pe-3 text-[12px] text-start")}
                          />
                          <a
                            href={item.value || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute top-1/2 -translate-y-1/2 start-2 size-5 rounded flex items-center justify-center text-[#837565] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7]"
                            title={isEn ? "Open link" : "فتح الرابط"}
                          >
                            <ExternalLink className="size-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <DashboardStickyActionBar>
                <span className="text-[11px] font-normal text-[#837565] dark:text-[#cdc5bd] hidden sm:inline text-start">
                  {isEn
                    ? "Changes apply immediately after save."
                    : "تُطبَّق التعديلات فور الحفظ عبر خوادم المنصة."}
                </span>

                <div className="flex items-center gap-2 ms-auto sm:ms-0">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-[#f0eeea] dark:bg-[#2d1f16] hover:bg-[#e4e1dc] dark:hover:bg-[#382a1f] text-[#1b1c1a] dark:text-[#fdfbf7] border border-transparent dark:border-[#3d2a1d] px-4 py-2 rounded-[6px] font-semibold text-[13px] transition-colors cursor-pointer"
                  >
                    {isEn ? "Cancel" : "إلغاء"}
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="bg-[#f0eeea] dark:bg-[#2d1f16] hover:bg-[#e4e1dc] dark:hover:bg-[#382a1f] text-[#1b1c1a] dark:text-[#fdfbf7] border border-transparent dark:border-[#3d2a1d] px-4 py-2 rounded-[6px] font-semibold text-[13px] transition-colors cursor-pointer"
                  >
                    {isEn ? "Draft" : "مسودة"}
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving || isBootstrapping}
                    className="bg-[#9c6402] hover:bg-[#835401] active:bg-[#6c4501] text-white px-5 py-2 rounded-[6px] font-semibold text-[13px] inline-flex items-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-70"
                  >
                    {isSaving ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Check className="size-4 stroke-[2.5]" />
                    )}
                    <span>{isEn ? "Save Changes" : "حفظ التغييرات"}</span>
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
