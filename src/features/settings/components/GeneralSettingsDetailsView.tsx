"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logoImg from "../../../../public/logo.png";
import { toast } from "sonner";
import {
  Building2,
  Globe,
  Palette,
  Share2,
  ShieldCheck,
  Phone,
  Mail,
  Check,
  Copy,
  ExternalLink,
  Pencil,
  RefreshCw,
  FileWarning,
} from "lucide-react";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { initialGeneralSettings } from "../data/initialGeneralSettings";
import { GeneralSettings } from "../types/general-settings.types";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { fetchGeneralSettings } from "@/lib/api/settings";
import { mapGeneralSettingsFromApi } from "@/lib/api/mappers";

type LoadStatus = "loading" | "ready" | "error";

const EDIT_HREF = "/settings/general/edit";

// Read-only value box — same field styling as the editable form, rendered as display.
function DetailField({
  label,
  value,
  isLtr,
  icon: Icon,
  isBold,
  colSpanFull,
}: {
  label: string;
  value: string;
  isLtr?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  isBold?: boolean;
  colSpanFull?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-[6px]", colSpanFull && "md:col-span-2")}>
      <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          dir={isLtr ? "ltr" : undefined}
          readOnly
          value={value}
          className={cn(
            "w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[14px] font-normal rounded-[4px] px-[16px] py-[10px] border border-transparent dark:border-[#38271c] cursor-default select-all",
            isLtr && "text-start",
            isBold && "text-[13px] font-bold font-mono"
          )}
        />
        {Icon && (
          <Icon className="absolute top-1/2 -translate-y-1/2 end-[14px] size-[15px] text-[#837565] dark:text-[#a89f91]" />
        )}
      </div>
    </div>
  );
}

function SkeletonField({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-[6px]", className)}>
      <div className="h-[20px] w-[120px] rounded-[4px] bg-[#eae8e4] dark:bg-[#38271c] animate-pulse" />
      <div className="h-[40px] w-full rounded-[4px] bg-[#eae8e4] dark:bg-[#38271c] animate-pulse" />
    </div>
  );
}

export function GeneralSettingsDetailsView() {
  const { direction, isEn } = useLanguage();
  const [settings, setSettings] = useState<GeneralSettings>(initialGeneralSettings);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [copiedCode, setCopiedCode] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Fetch on mount and on retry; setState is only called from async callbacks.
  useEffect(() => {
    let cancelled = false;
    fetchGeneralSettings()
      .then((payload) => {
        if (cancelled) return;
        setSettings((prev) => ({ ...prev, ...mapGeneralSettingsFromApi(payload) }));
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const handleRetry = () => {
    setStatus("loading");
    setReloadKey((k) => k + 1);
  };

  const handleCopyLicense = () => {
    navigator.clipboard.writeText(settings.licenseCode);
    setCopiedCode(true);
    toast.success(
      isEn ? "License code copied to clipboard" : "تم نسخ كود التفعيل إلى الحافظة"
    );
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const editButton = (
    <Link
      href={EDIT_HREF}
      className="bg-white dark:bg-[#221812] hover:bg-[#faf9f6] dark:hover:bg-[#34241b] text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] font-semibold px-[16px] py-[8px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] flex items-center gap-[6px] transition-colors shadow-xs cursor-pointer shrink-0"
    >
      <Pencil className="size-[14px]" />
      <span>{isEn ? "Edit" : "تعديل"}</span>
    </Link>
  );

  const sectionHeading = (Icon: React.ElementType, title: string) => (
    <div className="flex items-center gap-[16px] justify-start">
      <div className="size-[40px] rounded-[8px] bg-[rgba(156,100,2,0.1)] dark:bg-[rgba(226,157,56,0.15)] flex items-center justify-center shrink-0 text-[#9c6402] dark:text-[#f59e0b]">
        <Icon className="size-[20px]" />
      </div>
      <h2 className="text-[18px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[26px]">
        {title}
      </h2>
    </div>
  );

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

        {/* Scrollable Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 pt-6 pb-2 sm:pb-3 max-w-[1360px] w-full mx-auto space-y-6 scrollbar-thin">
          <DashboardPageTransition>
            <div className="space-y-6 w-full">
              {/* Main Identity & Command Banner */}
              <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-[4px] text-start">
                  <h1 className="text-[28px] leading-[38px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {isEn ? "General Settings" : "الإعدادات العامة"}
                  </h1>
                  <p className="text-[14px] leading-[22px] font-normal text-[#514537] dark:text-[#a89f91]">
                    {isEn
                      ? "Review platform configuration, corporate identity, and core operational parameters before editing."
                      : "عرض بيانات المنصة وهويتها المؤسسية وإعداداتها التشغيلية الأساسية قبل التعديل."}
                  </p>
                </div>
                {status === "ready" && editButton}
              </div>

              {/* Main Container Card */}
              <div className="bg-white dark:bg-[#221812] rounded-[8px] p-[24px] sm:p-[40px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col gap-[36px]">
                {/* Loading State */}
                {status === "loading" && (
                  <div className="flex flex-col gap-[24px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[24px] gap-y-[20px]">
                      <SkeletonField />
                      <SkeletonField />
                      <SkeletonField className="md:col-span-2" />
                      <SkeletonField />
                      <SkeletonField />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[24px] gap-y-[20px]">
                      <SkeletonField />
                      <SkeletonField />
                      <SkeletonField />
                      <SkeletonField />
                    </div>
                  </div>
                )}

                {/* Error State with Retry */}
                {status === "error" && (
                  <div className="py-[36px] flex flex-col items-center gap-[14px] text-center">
                    <div className="size-[48px] rounded-[8px] bg-[rgba(186,26,26,0.08)] dark:bg-[rgba(248,113,113,0.12)] flex items-center justify-center text-[#ba1a1a] dark:text-[#f87171]">
                      <FileWarning className="size-[22px]" />
                    </div>
                    <p className="text-[14px] font-semibold text-[#514537] dark:text-[#a89f91]">
                      {isEn
                        ? "Failed to load general settings data."
                        : "تعذر تحميل بيانات الإعدادات العامة."}
                    </p>
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="bg-[#9c6402] hover:bg-[#835401] text-white px-[24px] py-[10px] rounded-[6px] font-semibold text-[14px] flex items-center gap-[8px] transition-colors cursor-pointer"
                    >
                      <RefreshCw className="size-[15px]" />
                      <span>{isEn ? "Retry" : "إعادة المحاولة"}</span>
                    </button>
                  </div>
                )}

                {/* Ready State: Read-only Details */}
                {status === "ready" && (
                  <>
                    {/* SECTION 1: System Data */}
                    <section className="flex flex-col gap-[20px]">
                      {sectionHeading(
                        Building2,
                        isEn ? "System & Entity Data" : "بيانات النظام والمنشأة"
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[24px] gap-y-[20px] pt-[8px]">
                        <DetailField
                          label={isEn ? "System Title" : "عنوان النظام"}
                          value={settings.systemTitle}
                        />
                        <DetailField
                          label={isEn ? "Company / Firm Name" : "اسم الشركة أو المنشأة"}
                          value={settings.companyName}
                        />
                        <DetailField
                          label={isEn ? "Slogan" : "العبارة التعريفية (Slogan)"}
                          value={settings.slogan}
                          colSpanFull
                        />
                        <DetailField
                          label={isEn ? "Official Phone Number" : "رقم الهاتف المعتمد"}
                          value={settings.phone}
                          isLtr
                          icon={Phone}
                        />
                        <div className="flex flex-col gap-[6px]">
                          <div className="flex items-center justify-between">
                            <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start">
                              {isEn ? "Official Email Address" : "البريد الإلكتروني الرسمي"}
                            </label>
                            {settings.isEmailVerified && (
                              <div className="flex items-center gap-[4px] text-[#047857] dark:text-[#6ee7b7]">
                                <span className="text-[10px] font-bold">
                                  {isEn ? "Verified" : "مُتحقق منه"}
                                </span>
                                <ShieldCheck className="size-[13px] text-[#047857] dark:text-[#6ee7b7]" />
                              </div>
                            )}
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              dir="ltr"
                              readOnly
                              value={settings.email}
                              className="w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[14px] font-normal rounded-[4px] ps-[16px] pe-[40px] py-[10px] text-start border border-transparent dark:border-[#38271c] cursor-default select-all"
                            />
                            <Mail className="absolute top-1/2 -translate-y-1/2 end-[14px] size-[16px] text-[#837565] dark:text-[#a89f91]" />
                          </div>
                        </div>

                        {/* License Code */}
                        <div className="flex flex-col gap-[6px] md:col-span-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start">
                              {isEn
                                ? "License Key & System Activation"
                                : "كود التفعيل ورخصة النظام"}
                            </label>
                            <div className="bg-[#ecfdf5] dark:bg-[#132c21] border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-[6px] px-[8px] py-[2px] rounded-[4px]">
                              <span className="text-[10px] font-bold text-[#065f46] dark:text-[#6ee7b7]">
                                {settings.licenseStatus ||
                                  (isEn
                                    ? "Licensed & Active for Enterprise"
                                    : "مرخّص ومفعّل لمؤسسة كبرى")}
                              </span>
                              <span className="size-[6px] rounded-full bg-[#059669] dark:bg-[#10b981]" />
                            </div>
                          </div>
                          <div className="relative flex items-center">
                            <input
                              type="text"
                              dir="ltr"
                              readOnly
                              value={settings.licenseCode}
                              className="w-full bg-[#f0eeea] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-bold rounded-[4px] ps-[90px] pe-[44px] py-[10px] border border-transparent dark:border-[#38271c] font-mono select-all cursor-default"
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
                      {sectionHeading(
                        Globe,
                        isEn
                          ? "Regional & Localization Settings"
                          : "الإعدادات الإقليمية والمحلية"
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[24px] gap-y-[20px] pt-[8px]">
                        <DetailField
                          label={isEn ? "Timezone" : "المنطقة الزمنية (Timezone)"}
                          value={settings.timezone}
                        />
                        <DetailField
                          label={isEn ? "Default Interface Language" : "اللغة الافتراضية للواجهة"}
                          value={settings.defaultLanguage}
                        />
                        <DetailField
                          label={isEn ? "Country & Headquarters" : "الدولة والمقر الرئيسي"}
                          value={settings.country}
                        />
                        <DetailField
                          label={isEn ? "Default Currency" : "العملة الافتراضية"}
                          value={settings.defaultCurrency}
                        />
                      </div>
                    </section>

                    <div className="h-px bg-[#eae8e4] dark:bg-[#38271c] w-full" />

                    {/* SECTION 3: Visual Branding */}
                    <section className="flex flex-col gap-[20px]">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        {sectionHeading(
                          Palette,
                          isEn
                            ? "Visual Branding & UI Customization"
                            : "الهوية البصرية وتخصيص الواجهة"
                        )}
                        <div className="bg-[rgba(255,221,182,0.3)] dark:bg-[#38271c] text-[#643f00] dark:text-[#ffddb6] text-[10px] font-bold px-[12px] py-[4px] rounded-[2px] hidden sm:block">
                          {isEn
                            ? "Customize corporate branding for subscribed practice"
                            : "تخصيص الهوية البصرية الخاصة بالمنشأة المشتركة"}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px] pt-[8px]">
                        {/* Logo - 7 cols */}
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
                            <p className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] leading-[16px] flex-1">
                              {isEn
                                ? "Accepted formats: PNG, SVG, or JPG with transparent background, min 512×512 px, max 2MB."
                                : "الصيغ المقبولة: PNG أو SVG أو JPG بخلفية شفافة بدقة لا تقل عن 512×512 بكسل وحجم أقصى 2 ميجابايت."}
                            </p>
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
                                  readOnly
                                  value={settings.primaryColor}
                                  className="w-full bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7] text-[14px] font-bold uppercase rounded-[4px] ps-[40px] pe-[16px] py-[8px] border border-[#eae8e4] dark:border-[#38271c] cursor-default select-all"
                                />
                                <Palette className="absolute top-1/2 -translate-y-1/2 start-[12px] size-[15px] text-[#837565] dark:text-[#a89f91]" />
                              </div>
                              <div
                                className="size-[48px] rounded-[12px] flex items-center justify-center shrink-0 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] text-white"
                                style={{ backgroundColor: settings.primaryColor }}
                              >
                                <Check className="size-[16px] stroke-[2.5]" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <div className="h-px bg-[#eae8e4] dark:bg-[#38271c] w-full" />

                    {/* SECTION 4: Integrations & Help Links */}
                    <section className="flex flex-col gap-[20px]">
                      {sectionHeading(
                        Share2,
                        isEn ? "Integrations & Help Resources" : "روابط التكاملات والمساعدة"
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] pt-[8px]">
                        {/* Telegram */}
                        <div className="flex flex-col gap-[6px]">
                          <div className="flex items-center gap-[6px] text-start">
                            <span className="size-[8px] rounded-full bg-[#0ea5e9]" />
                            <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                              {isEn ? "Telegram Setup Video Guide" : "فيديو دليل إعداد Telegram"}
                            </label>
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              dir="ltr"
                              readOnly
                              value={settings.telegramGuideUrl}
                              className="w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] rounded-[4px] ps-[36px] pe-[16px] py-[10px] text-start border border-transparent dark:border-[#38271c] cursor-default select-all"
                            />
                            <a
                              href={settings.telegramGuideUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute top-1/2 -translate-y-1/2 start-[10px] size-[20px] rounded hover:bg-[#eae8e4] dark:hover:bg-[#38271c] flex items-center justify-center text-[#837565] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7]"
                              title={isEn ? "Open link" : "فتح الرابط"}
                            >
                              <ExternalLink className="size-[13px]" />
                            </a>
                          </div>
                        </div>

                        {/* WhatsApp */}
                        <div className="flex flex-col gap-[6px]">
                          <div className="flex items-center gap-[6px] text-start">
                            <span className="size-[8px] rounded-full bg-[#10b981]" />
                            <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                              {isEn ? "WhatsApp Setup Video Guide" : "فيديو دليل إعداد WhatsApp"}
                            </label>
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              dir="ltr"
                              readOnly
                              value={settings.whatsappGuideUrl}
                              className="w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] rounded-[4px] ps-[36px] pe-[16px] py-[10px] text-start border border-transparent dark:border-[#38271c] cursor-default select-all"
                            />
                            <a
                              href={settings.whatsappGuideUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute top-1/2 -translate-y-1/2 start-[10px] size-[20px] rounded hover:bg-[#eae8e4] dark:hover:bg-[#38271c] flex items-center justify-center text-[#837565] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7]"
                              title={isEn ? "Open link" : "فتح الرابط"}
                            >
                              <ExternalLink className="size-[13px]" />
                            </a>
                          </div>
                        </div>

                        {/* API Docs */}
                        <div className="flex flex-col gap-[6px]">
                          <div className="flex items-center text-start">
                            <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                              {isEn
                                ? "Developer API Documentation"
                                : "رابط توثيق API للمطورين"}
                            </label>
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              dir="ltr"
                              readOnly
                              value={settings.apiDocsUrl}
                              className="w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] rounded-[4px] ps-[36px] pe-[16px] py-[10px] text-start border border-transparent dark:border-[#38271c] cursor-default select-all"
                            />
                            <a
                              href={settings.apiDocsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute top-1/2 -translate-y-1/2 start-[10px] size-[20px] rounded hover:bg-[#eae8e4] dark:hover:bg-[#38271c] flex items-center justify-center text-[#837565] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7]"
                              title={isEn ? "Open link" : "فتح الرابط"}
                            >
                              <ExternalLink className="size-[13px]" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </section>
                  </>
                )}
              </div>
            </div>
          </DashboardPageTransition>
        </main>
      </div>
    </div>
  );
}
