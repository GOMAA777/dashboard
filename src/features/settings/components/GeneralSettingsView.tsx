"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
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
import { fetchGeneralSettings, updateGeneralSettings } from "@/lib/api/settings";
import { mapGeneralSettingsFromApi } from "@/lib/api/mappers";

export function GeneralSettingsView() {
  const { direction, isEn, setLanguage } = useLanguage();
  const router = useRouter();
  const [formData, setFormData] = useState<GeneralSettings>(initialGeneralSettings);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchGeneralSettings()
      .then((payload) => {
        if (cancelled) return;
        const mapped = mapGeneralSettingsFromApi(payload);
        setFormData((prev) => ({ ...prev, ...mapped }));
      })
      .catch(() => {
        // Keep defaults if API unavailable.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Available royal swatches
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
      isEn
        ? "License code copied to clipboard"
        : "تم نسخ كود التفعيل إلى الحافظة"
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
    toast.info(isEn ? "Settings saved as draft" : "تم حفظ الإعدادات كمسودة");
  };

  const handleCancel = () => {
    router.push("/settings/general");
  };

  return (
    <div
      dir={direction}
      className="flex h-screen h-dvh bg-[#f5f3ef] dark:bg-[#150f0b] text-[#1b1c1a] dark:text-[#fdfbf7] font-sans antialiased overflow-hidden selection:bg-[#ffddb6]/30 selection:text-[#643f00] transition-colors duration-200"
    >
      {/* 1. Global Navigation Sidebar */}
      <DashboardSidebar activeNav="system-settings" activeSubNav="general" />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <DashboardTopNavbar />

        {/* Scrollable Form Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 pt-6 pb-2 sm:pb-3 max-w-[1360px] w-full mx-auto space-y-6 scrollbar-thin">
          <DashboardPageTransition>
            <div className="space-y-6 w-full">
              {/* Main Identity & Command Banner */}
              <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-[4px] text-start">
                  <h1 className="text-[28px] leading-[38px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {isEn ? "Edit General Settings" : "تعديل الإعدادات العامة"}
                  </h1>
                  <p className="text-[14px] leading-[22px] font-normal text-[#514537] dark:text-[#a89f91]">
                    {isEn
                      ? "Manage platform configuration, corporate identity, and core operational parameters."
                      : "تعديل بيانات المنصة وهويتها المؤسسية وإعداداتها التشغيلية الأساسية."}
                  </p>
                </div>
              </div>

              {/* Main Container Card */}
              <div className="bg-white dark:bg-[#221812] rounded-[8px] p-[24px] sm:p-[40px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col gap-[36px]">
                {/* SECTION 1: System Data */}
                <section className="flex flex-col gap-[20px]">
                  <div className="flex items-center gap-[16px] justify-start">
                    <div className="size-[40px] rounded-[8px] bg-[rgba(156,100,2,0.1)] dark:bg-[rgba(226,157,56,0.15)] flex items-center justify-center shrink-0 text-[#9c6402] dark:text-[#f59e0b]">
                      <Building2 className="size-[20px]" />
                    </div>
                    <h2 className="text-[18px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[26px]">
                      {isEn ? "System & Entity Data" : "بيانات النظام والمنشأة"}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[24px] gap-y-[20px] pt-[8px]">
                    {/* 1.1 System Title */}
                    <div className="flex flex-col gap-[6px]">
                      <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start flex items-center gap-[2px]">
                        <span>{isEn ? "System Title" : "عنوان النظام"}</span>
                        <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.systemTitle}
                        onChange={(e) => setFormData({ ...formData, systemTitle: e.target.value })}
                        className="w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[14px] font-normal rounded-[4px] px-[16px] py-[10px] border border-transparent dark:border-[#38271c] focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] focus:outline-none transition-all"
                      />
                      <p className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] text-start leading-[14px]">
                        {isEn
                          ? "Appears in browser title bar and main platform header."
                          : "يظهر في شريط العنوان أعلى صفحات المتصفح وكعنوان رئيسي للمنصة."}
                      </p>
                    </div>

                    {/* 1.2 Company / Firm Name */}
                    <div className="flex flex-col gap-[6px]">
                      <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start flex items-center gap-[2px]">
                        <span>{isEn ? "Company / Firm Name" : "اسم الشركة أو المنشأة"}</span>
                        <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[14px] font-normal rounded-[4px] px-[16px] py-[10px] border border-transparent dark:border-[#38271c] focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] focus:outline-none transition-all"
                      />
                      <p className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] text-start leading-[14px]">
                        {isEn
                          ? "Official legal name used on invoices and contracts."
                          : "الاسم القانوني المعتمد في إصدار الفواتير والعقود الرسمية."}
                      </p>
                    </div>

                    {/* 1.3 Slogan */}
                    <div className="flex flex-col gap-[6px] md:col-span-2">
                      <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start">
                        {isEn ? "Slogan" : "العبارة التعريفية (Slogan)"}
                      </label>
                      <input
                        type="text"
                        value={formData.slogan}
                        onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                        className="w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[14px] font-normal rounded-[4px] px-[16px] py-[10px] border border-transparent dark:border-[#38271c] focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] focus:outline-none transition-all"
                      />
                    </div>

                    {/* 1.4 Phone Number */}
                    <div className="flex flex-col gap-[6px]">
                      <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start flex items-center gap-[2px]">
                        <span>{isEn ? "Official Phone Number" : "رقم الهاتف المعتمد"}</span>
                        <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          dir="ltr"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[14px] font-normal rounded-[4px] ps-[16px] pe-[40px] py-[10px] text-start border border-transparent dark:border-[#38271c] focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] focus:outline-none transition-all"
                        />
                        <Phone className="absolute top-1/2 -translate-y-1/2 end-[14px] size-[15px] text-[#837565] dark:text-[#a89f91]" />
                      </div>
                      <p className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] text-start leading-[14px]">
                        {isEn
                          ? "Used for official communications and critical security alerts."
                          : "يُستخدم للتواصل الرسمي وإرسال تنبيهات الأمان الحرجة."}
                      </p>
                    </div>

                    {/* 1.5 Official Email */}
                    <div className="flex flex-col gap-[6px]">
                      <div className="flex items-center justify-between">
                        <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start flex items-center gap-[2px]">
                          <span>{isEn ? "Official Email Address" : "البريد الإلكتروني الرسمي"}</span>
                          <span className="text-[#ba1a1a]">*</span>
                        </label>
                        <div className="flex items-center gap-[4px] text-[#047857] dark:text-[#6ee7b7]">
                          <span className="text-[10px] font-bold">
                            {isEn ? "Verified" : "مُتحقق منه"}
                          </span>
                          <ShieldCheck className="size-[13px] text-[#047857] dark:text-[#6ee7b7]" />
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="email"
                          dir="ltr"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[14px] font-normal rounded-[4px] ps-[16px] pe-[40px] py-[10px] text-start border border-transparent dark:border-[#38271c] focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] focus:outline-none transition-all"
                        />
                        <Mail className="absolute top-1/2 -translate-y-1/2 end-[14px] size-[16px] text-[#837565] dark:text-[#a89f91]" />
                      </div>
                      <p className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] text-start leading-[14px]">
                        {isEn
                          ? "Inbox for automated notifications and user administration."
                          : "صندوق الوارد للإشعارات الآلية وإدارة المستخدمين."}
                      </p>
                    </div>

                    {/* 1.6 License Code */}
                    <div className="flex flex-col gap-[6px] md:col-span-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start">
                          {isEn ? "License Key & System Activation" : "كود التفعيل ورخصة النظام"}
                        </label>
                        <div className="bg-[#ecfdf5] dark:bg-[#132c21] border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-[6px] px-[8px] py-[2px] rounded-[4px]">
                          <span className="text-[10px] font-bold text-[#065f46] dark:text-[#6ee7b7]">
                            {isEn ? "Licensed & Active for Enterprise" : "مرخّص ومفعّل لمؤسسة كبرى"}
                          </span>
                          <span className="size-[6px] rounded-full bg-[#059669] dark:bg-[#10b981]" />
                        </div>
                      </div>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          dir="ltr"
                          readOnly
                          value={formData.licenseCode}
                          className="w-full bg-[#f0eeea] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-bold rounded-[4px] ps-[90px] pe-[44px] py-[10px] border border-transparent dark:border-[#38271c] font-mono select-all"
                        />
                        <ShieldCheck className="absolute top-1/2 -translate-y-1/2 end-[14px] size-[18px] text-[#837565] dark:text-[#a89f91]" />
                        <button
                          type="button"
                          onClick={handleCopyLicense}
                          className="absolute top-1/2 -translate-y-1/2 start-[10px] bg-white dark:bg-[#221812] hover:bg-[#f5f3ef] dark:hover:bg-[#34241b] border border-[#ded5c6] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] rounded-[4px] px-[10px] py-[4px] text-[10px] font-bold flex items-center gap-[4px] transition-colors shadow-xs cursor-pointer"
                        >
                          <Copy className="size-[12px]" />
                          <span>
                            {copiedCode
                              ? isEn
                                ? "Copied"
                                : "تم النسخ"
                              : isEn
                              ? "Copy Code"
                              : "نسخ الكود"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="h-px bg-[#eae8e4] dark:bg-[#38271c] w-full" />

                {/* SECTION 2: Regional Settings */}
                <section className="flex flex-col gap-[20px]">
                  <div className="flex items-center gap-[16px] justify-start">
                    <div className="size-[40px] rounded-[8px] bg-[rgba(156,100,2,0.1)] dark:bg-[rgba(226,157,56,0.15)] flex items-center justify-center shrink-0 text-[#9c6402] dark:text-[#f59e0b]">
                      <Globe className="size-[20px]" />
                    </div>
                    <h2 className="text-[18px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[26px]">
                      {isEn ? "Regional & Localization Settings" : "الإعدادات الإقليمية والمحلية"}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[24px] gap-y-[20px] pt-[8px]">
                    {/* 2.1 Timezone */}
                    <div className="flex flex-col gap-[6px]">
                      <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start flex items-center gap-[2px]">
                        <span>{isEn ? "Timezone" : "المنطقة الزمنية (Timezone)"}</span>
                        <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <DashboardSelect
                        value={formData.timezone}
                        onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                        className="h-[44px]"
                      >
                        <option value="(GMT+03:00) توقيت الرياض - المملكة العربية السعودية (AST)">
                          {isEn
                            ? "(GMT+03:00) Riyadh Time - Saudi Arabia (AST)"
                            : "(GMT+03:00) توقيت الرياض - المملكة العربية السعودية (AST)"}
                        </option>
                        <option value="(GMT+04:00) توقيت دبي - الإمارات العربية المتحدة (GST)">
                          {isEn
                            ? "(GMT+04:00) Dubai Time - UAE (GST)"
                            : "(GMT+04:00) توقيت دبي - الإمارات العربية المتحدة (GST)"}
                        </option>
                        <option value="(GMT+03:00) توقيت الكويت - دولة الكويت (AST)">
                          {isEn
                            ? "(GMT+03:00) Kuwait Time - Kuwait (AST)"
                            : "(GMT+03:00) توقيت الكويت - دولة الكويت (AST)"}
                        </option>
                        <option value="(GMT+02:00) توقيت القاهرة - جمهورية مصر العربية (EET)">
                          {isEn
                            ? "(GMT+02:00) Cairo Time - Egypt (EET)"
                            : "(GMT+02:00) توقيت القاهرة - جمهورية مصر العربية (EET)"}
                        </option>
                      </DashboardSelect>
                      <p className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] text-start leading-[14px]">
                        {isEn
                          ? "Governs court session schedules and task deadlines."
                          : "تعتمد عليها جدولة الجلسات القضائية وتواريخ انتهاء المهام."}
                      </p>
                    </div>

                    {/* 2.2 Default Language */}
                    <div className="flex flex-col gap-[6px]">
                      <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start flex items-center gap-[2px]">
                        <span>{isEn ? "Default Interface Language" : "اللغة الافتراضية للواجهة"}</span>
                        <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <DashboardSelect
                        value={formData.defaultLanguage}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({ ...formData, defaultLanguage: val });
                          if (val.includes("English") || val.includes("EN")) {
                            setLanguage("en");
                          } else if (val.includes("العربية") || val.includes("AR")) {
                            setLanguage("ar");
                          }
                        }}
                        className="h-[44px]"
                      >
                        <option value="العربية (المملكة العربية السعودية) - AR (افتراضي)">
                          {isEn
                            ? "Arabic (Saudi Arabia) - AR (Default)"
                            : "العربية (المملكة العربية السعودية) - AR (افتراضي)"}
                        </option>
                        <option value="English (United States) - EN">
                          English (United States) - EN
                        </option>
                        <option value="Français (France) - FR">
                          Français (France) - FR
                        </option>
                      </DashboardSelect>
                      <p className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] text-start leading-[14px]">
                        {isEn
                          ? "Each user can customize personal language from their profile settings."
                          : "يمكن لكل مستخدم تخصيص لغته الشخصية من حسابه الفردي لاحقاً."}
                      </p>
                    </div>

                    {/* 2.3 Country */}
                    <div className="flex flex-col gap-[6px]">
                      <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start flex items-center gap-[2px]">
                        <span>{isEn ? "Country & Headquarters" : "الدولة والمقر الرئيسي"}</span>
                        <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <DashboardSelect
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="h-[44px]"
                      >
                        <option value="المملكة العربية السعودية (KSA) 🇸🇦">
                          {isEn ? "Saudi Arabia (KSA) 🇸🇦" : "المملكة العربية السعودية (KSA) 🇸🇦"}
                        </option>
                        <option value="الإمارات العربية المتحدة (UAE) 🇦🇪">
                          {isEn ? "United Arab Emirates (UAE) 🇦🇪" : "الإمارات العربية المتحدة (UAE) 🇦🇪"}
                        </option>
                        <option value="دولة الكويت (KWT) 🇰🇼">
                          {isEn ? "Kuwait (KWT) 🇰🇼" : "دولة الكويت (KWT) 🇰🇼"}
                        </option>
                        <option value="مملكة البحرين (BHR) 🇧🇭">
                          {isEn ? "Bahrain (BHR) 🇧🇭" : "مملكة البحرين (BHR) 🇧🇭"}
                        </option>
                        <option value="سلطنة عمان (OMN) 🇴🇲">
                          {isEn ? "Oman (OMN) 🇴🇲" : "سلطنة عمان (OMN) 🇴🇲"}
                        </option>
                        <option value="دولة قطر (QAT) 🇶🇦">
                          {isEn ? "Qatar (QAT) 🇶🇦" : "دولة قطر (QAT) 🇶🇦"}
                        </option>
                      </DashboardSelect>
                    </div>

                    {/* 2.4 Default Currency */}
                    <div className="flex flex-col gap-[6px]">
                      <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start flex items-center gap-[2px]">
                        <span>{isEn ? "Default Currency" : "العملة الافتراضية"}</span>
                        <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <DashboardSelect
                        value={formData.defaultCurrency}
                        onChange={(e) => setFormData({ ...formData, defaultCurrency: e.target.value })}
                        className="h-[44px]"
                      >
                        <option value="ريال سعودي (SAR - ر.س)">
                          {isEn ? "Saudi Riyal (SAR - ر.س)" : "ريال سعودي (SAR - ر.س)"}
                        </option>
                        <option value="درهم إماراتي (AED - د.إ)">
                          {isEn ? "UAE Dirham (AED - د.إ)" : "درهم إماراتي (AED - د.إ)"}
                        </option>
                        <option value="دينار كويتي (KWD - د.ك)">
                          {isEn ? "Kuwaiti Dinar (KWD - د.ك)" : "دينار كويتي (KWD - د.ك)"}
                        </option>
                        <option value="دولار أمريكي (USD - $)">
                          {isEn ? "US Dollar (USD - $)" : "دولار أمريكي (USD - $)"}
                        </option>
                      </DashboardSelect>
                      <p className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] text-start leading-[14px]">
                        {isEn
                          ? "Applies to fee invoices, receipts, and revenue reports."
                          : "تُطبق على فواتير الأتعاب، السندات، وتقارير العوائد."}
                      </p>
                    </div>
                  </div>
                </section>

                <div className="h-px bg-[#eae8e4] dark:bg-[#38271c] w-full" />

                {/* SECTION 3: Visual Branding */}
                <section className="flex flex-col gap-[20px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[16px]">
                      <div className="size-[40px] rounded-[8px] bg-[rgba(156,100,2,0.1)] dark:bg-[rgba(226,157,56,0.15)] flex items-center justify-center shrink-0 text-[#9c6402] dark:text-[#f59e0b]">
                        <Palette className="size-[20px]" />
                      </div>
                      <h2 className="text-[18px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[26px]">
                        {isEn ? "Visual Branding & UI Customization" : "الهوية البصرية وتخصيص الواجهة"}
                      </h2>
                    </div>

                    <div className="bg-[rgba(255,221,182,0.3)] dark:bg-[#38271c] text-[#643f00] dark:text-[#ffddb6] text-[10px] font-bold px-[12px] py-[4px] rounded-[2px] hidden sm:block">
                      {isEn
                        ? "Customize corporate branding for subscribed practice"
                        : "تخصيص الهوية البصرية الخاصة بالمنشأة المشتركة"}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px] pt-[8px]">
                    {/* Logo Customization - 7 cols */}
                    <div className="lg:col-span-7 flex flex-col gap-[8px]">
                      <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start">
                        {isEn ? "Platform & Entity Logo" : "شعار المنصة والشركة"}
                      </label>
                      <div className="bg-[#f5f3ef] dark:bg-[#281c15] rounded-[8px] p-[20px] flex items-center gap-[24px] border border-transparent dark:border-[#38271c]">
                        <div className="size-[112px] rounded-[8px] bg-[#1c140f] flex items-center justify-center shrink-0 p-[12px] shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.1)] relative border border-white/5">
                          <Image
                            src={logoImg}
                            alt="Logo"
                            width={64}
                            height={64}
                            className="object-contain max-h-[64px]"
                          />
                        </div>

                        <div className="flex-1 flex flex-col gap-[12px] text-start">
                          <div className="flex items-center gap-[8px]">
                            <button
                              type="button"
                              onClick={() =>
                                toast.info(
                                  isEn
                                    ? "Select new logo image (min 512×512 px)"
                                    : "اختر ملف الشعار الجديد بدقة 512×512"
                                )
                              }
                              className="bg-white dark:bg-[#221812] hover:bg-[#faf9f6] dark:hover:bg-[#34241b] text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] font-semibold px-[16px] py-[8px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] flex items-center gap-[6px] transition-colors shadow-xs cursor-pointer"
                            >
                              <Upload className="size-[14px]" />
                              <span>{isEn ? "Change Logo" : "تغيير الشعار"}</span>
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
                              className="bg-[rgba(186,26,26,0.1)] hover:bg-[rgba(186,26,26,0.18)] dark:bg-[rgba(248,113,113,0.15)] text-[#ba1a1a] dark:text-[#f87171] text-[12px] font-semibold px-[12px] py-[8px] rounded-[4px] flex items-center gap-[6px] transition-colors cursor-pointer"
                            >
                              <Trash2 className="size-[13px]" />
                              <span>{isEn ? "Delete" : "حذف"}</span>
                            </button>
                          </div>

                          <p className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] leading-[16px]">
                            {isEn
                              ? "Accepted formats: PNG, SVG, or JPG with transparent background, min 512×512 px, max 2MB."
                              : "الصيغ المقبولة: PNG أو SVG أو JPG بخلفية شفافة بدقة لا تقل عن 512×512 بكسل وحجم أقصى 2 ميجابايت."}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Brand Color - 5 cols */}
                    <div className="lg:col-span-5 flex flex-col gap-[8px]">
                      <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start">
                        {isEn ? "Primary Brand Color" : "اللون الأساسي للعلامة التجارية"}
                      </label>
                      <div className="bg-[#f5f3ef] dark:bg-[#281c15] rounded-[8px] p-[20px] flex flex-col gap-[16px] border border-transparent dark:border-[#38271c]">
                        <div className="flex items-center gap-[16px]">
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              dir="ltr"
                              value={formData.primaryColor}
                              onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                              className="w-full bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7] text-[14px] font-bold uppercase rounded-[4px] ps-[40px] pe-[16px] py-[8px] border border-[#eae8e4] dark:border-[#38271c] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] transition-colors"
                            />
                            <Palette className="absolute top-1/2 -translate-y-1/2 start-[12px] size-[15px] text-[#837565] dark:text-[#a89f91]" />
                          </div>

                          <div
                            className="size-[48px] rounded-[12px] flex items-center justify-center shrink-0 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] transition-colors text-white"
                            style={{ backgroundColor: formData.primaryColor }}
                          >
                            <Check className="size-[16px] stroke-[2.5]" />
                          </div>
                        </div>

                        <div className="flex flex-col gap-[8px] text-start">
                          <span className="text-[10px] font-semibold text-[#514537] dark:text-[#cdc5bd]">
                            {isEn ? "Approved Royal Swatches:" : "الألوان الملكية المعتمدة:"}
                          </span>
                          <div className="flex items-center gap-[10px]">
                            {royalSwatches.map((swatch) => {
                              const isSelected = formData.primaryColor.toLowerCase() === swatch.hex.toLowerCase();
                              return (
                                <button
                                  key={swatch.hex}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, primaryColor: swatch.hex })}
                                  title={swatch.label}
                                  className={cn(
                                    "size-[32px] rounded-[4px] flex items-center justify-center transition-all cursor-pointer relative",
                                    isSelected
                                      ? "ring-2 ring-offset-2 ring-[#7b4e00] dark:ring-[#e29d38] shadow-md scale-105"
                                      : "hover:scale-105 opacity-90 hover:opacity-100"
                                  )}
                                  style={{ backgroundColor: swatch.hex }}
                                >
                                  {isSelected && <Check className="size-[12px] text-white stroke-[3]" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="h-px bg-[#eae8e4] dark:bg-[#38271c] w-full" />

                {/* SECTION 4: Integrations & Help Links */}
                <section className="flex flex-col gap-[20px]">
                  <div className="flex items-center gap-[16px] justify-start">
                    <div className="size-[40px] rounded-[8px] bg-[rgba(156,100,2,0.1)] dark:bg-[rgba(226,157,56,0.15)] flex items-center justify-center shrink-0 text-[#9c6402] dark:text-[#f59e0b]">
                      <Share2 className="size-[20px]" />
                    </div>
                    <h2 className="text-[18px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[26px]">
                      {isEn ? "Integrations & Help Resources" : "روابط التكاملات والمساعدة"}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] pt-[8px]">
                    {/* 4.1 Telegram */}
                    <div className="flex flex-col gap-[6px]">
                      <div className="flex items-center gap-[6px] text-start">
                        <span className="size-[8px] rounded-full bg-[#0ea5e9]" />
                        <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                          {isEn ? "Telegram Setup Video Guide" : "فيديو دليل إعداد Telegram"}
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type="url"
                          dir="ltr"
                          value={formData.telegramGuideUrl}
                          onChange={(e) => setFormData({ ...formData, telegramGuideUrl: e.target.value })}
                          className="w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] rounded-[4px] ps-[36px] pe-[16px] py-[10px] border border-transparent dark:border-[#38271c] focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] focus:outline-none transition-all"
                        />
                        <a
                          href={formData.telegramGuideUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-1/2 -translate-y-1/2 start-[10px] size-[20px] rounded hover:bg-[#eae8e4] dark:hover:bg-[#38271c] flex items-center justify-center text-[#837565] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7]"
                          title={isEn ? "Open link" : "فتح الرابط"}
                        >
                          <ExternalLink className="size-[13px]" />
                        </a>
                      </div>
                      <p className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] text-start leading-[14px]">
                        {isEn
                          ? "Guides lawyers to connect the interactive bot for daily case digests."
                          : "توجيه المحامين لربط البوت التفاعلي لملخصات القضايا اليومية."}
                      </p>
                    </div>

                    {/* 4.2 WhatsApp */}
                    <div className="flex flex-col gap-[6px]">
                      <div className="flex items-center gap-[6px] text-start">
                        <span className="size-[8px] rounded-full bg-[#10b981]" />
                        <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                          {isEn ? "WhatsApp Setup Video Guide" : "فيديو دليل إعداد WhatsApp"}
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type="url"
                          dir="ltr"
                          value={formData.whatsappGuideUrl}
                          onChange={(e) => setFormData({ ...formData, whatsappGuideUrl: e.target.value })}
                          className="w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] rounded-[4px] ps-[36px] pe-[16px] py-[10px] border border-transparent dark:border-[#38271c] focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] focus:outline-none transition-all"
                        />
                        <a
                          href={formData.whatsappGuideUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-1/2 -translate-y-1/2 start-[10px] size-[20px] rounded hover:bg-[#eae8e4] dark:hover:bg-[#38271c] flex items-center justify-center text-[#837565] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7]"
                          title={isEn ? "Open link" : "فتح الرابط"}
                        >
                          <ExternalLink className="size-[13px]" />
                        </a>
                      </div>
                      <p className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] text-start leading-[14px]">
                        {isEn
                          ? "Official WhatsApp Business setup reference for session notices."
                          : "مرجع إعداد الحساب الرسمي للأعمال وإرسال إخطارات الجلسات."}
                      </p>
                    </div>

                    {/* 4.3 API Docs */}
                    <div className="flex flex-col gap-[6px]">
                      <div className="flex items-center text-start">
                        <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                          {isEn ? "Developer API Documentation" : "رابط توثيق API للمطورين"}
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type="url"
                          dir="ltr"
                          value={formData.apiDocsUrl}
                          onChange={(e) => setFormData({ ...formData, apiDocsUrl: e.target.value })}
                          className="w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] rounded-[4px] ps-[36px] pe-[16px] py-[10px] border border-transparent dark:border-[#38271c] focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] focus:outline-none transition-all"
                        />
                        <a
                          href={formData.apiDocsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-1/2 -translate-y-1/2 start-[10px] size-[20px] rounded hover:bg-[#eae8e4] dark:hover:bg-[#38271c] flex items-center justify-center text-[#837565] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7]"
                          title={isEn ? "Open link" : "فتح الرابط"}
                        >
                          <ExternalLink className="size-[13px]" />
                        </a>
                      </div>
                      <p className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] text-start leading-[14px]">
                        {isEn
                          ? "RESTful API documentation for judicial and financial system integration."
                          : "مستندات RESTful API لربط الأنظمة القضائية والمالية."}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* FLOATING STICKY ACTION BAR */}
              <DashboardStickyActionBar>
                <span className="text-[12px] font-normal text-[#837565] dark:text-[#cdc5bd] hidden sm:inline text-start">
                  {isEn
                    ? "All modifications are saved and applied immediately across platform servers."
                    : "يتم حفظ جميع التعديلات وتطبيقها فوراً عبر خوادم المنصة"}
                </span>

                <div className="flex items-center gap-[10px] ms-auto sm:ms-0">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-[#f0eeea] dark:bg-[#2d1f16] hover:bg-[#e4e1dc] dark:hover:bg-[#382a1f] text-[#1b1c1a] dark:text-[#fdfbf7] border border-transparent dark:border-[#3d2a1d] px-[24px] py-[10px] rounded-[6px] font-semibold text-[14px] transition-colors cursor-pointer"
                  >
                    {isEn ? "Cancel" : "إلغاء"}
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="bg-[#f0eeea] dark:bg-[#2d1f16] hover:bg-[#e4e1dc] dark:hover:bg-[#382a1f] text-[#1b1c1a] dark:text-[#fdfbf7] border border-transparent dark:border-[#3d2a1d] px-[24px] py-[10px] rounded-[6px] font-semibold text-[14px] transition-colors cursor-pointer"
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
