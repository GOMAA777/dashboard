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
  Sparkles,
  Clock,
  Languages,
  MapPin,
  Coins,
  Shield,
  Layers,
  FileCode,
} from "lucide-react";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { initialGeneralSettings } from "../data/initialGeneralSettings";
import { GeneralSettings } from "../types/general-settings.types";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { mapGeneralSettingsFromApi } from "@/lib/api/mappers";
import { useGeneralSettingsQuery } from "@/features/settings/hooks/useSettingsQuery";

type LoadStatus = "loading" | "ready" | "error";

const EDIT_HREF = "/settings/general/edit";

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  badge,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#eae8e4] dark:border-[#38271c]">
      <div className="flex items-center gap-3 min-w-0">
        <div className="size-9 rounded-[8px] bg-[rgba(156,100,2,0.1)] dark:bg-[rgba(226,157,56,0.15)] flex items-center justify-center shrink-0 text-[#9c6402] dark:text-[#f59e0b] shadow-sm">
          <Icon className="size-4.5" />
        </div>
        <div className="flex flex-col text-start min-w-0">
          <h2 className="text-[15px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-5 truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[11px] text-[#837565] dark:text-[#a89f91] mt-0.5 leading-normal">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {badge && (
        <span className="shrink-0 bg-[#f5f3ef] dark:bg-[#281c15] text-[#9c6402] dark:text-[#f59e0b] border border-[#eae8e4] dark:border-[#38271c] text-[10px] font-bold px-2 py-0.5 rounded-[4px] hidden sm:inline-block">
          {badge}
        </span>
      )}
    </div>
  );
}

function DisplayCard({
  label,
  value,
  subValue,
  isLtr,
  icon: Icon,
  badge,
  action,
  className,
  isMonospace,
}: {
  label: string;
  value?: string | null;
  subValue?: string;
  isLtr?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  isMonospace?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-[#faf8f5] dark:bg-[#281c15] hover:bg-[#f4efe9] dark:hover:bg-[#2e2018] rounded-[8px] p-3.5 border border-[#eae8e4] dark:border-[#38271c] transition-all duration-150 flex items-center justify-between gap-3 min-w-0 shadow-[0_1px_2px_rgba(0,0,0,0.02)]",
        className
      )}
    >
      {/* Right side (start in RTL): Label, Badge, and Value */}
      <div className="flex flex-col gap-1 min-w-0 flex-1 text-start">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-[#837565] dark:text-[#a89f91] leading-tight">
            {label}
          </span>
          {badge}
        </div>
        <div
          dir={isLtr ? "ltr" : undefined}
          className={cn(
            "text-[13px] sm:text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] truncate",
            isMonospace && "font-mono tracking-tight",
            isLtr && "text-start"
          )}
          title={value ?? ""}
        >
          {value || "—"}
        </div>
        {subValue && (
          <span className="text-[10px] text-[#837565] dark:text-[#a89f91]">
            {subValue}
          </span>
        )}
      </div>

      {/* Left side (end in RTL): Icon or Action */}
      <div className="shrink-0 flex items-center justify-center">
        {action ? (
          action
        ) : Icon ? (
          <div className="size-9 rounded-[7px] bg-white dark:bg-[#1a120d] border border-[#eae8e4] dark:border-[#38271c] flex items-center justify-center text-[#9c6402] dark:text-[#f59e0b] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <Icon className="size-4" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-[#faf8f5] dark:bg-[#281c15] rounded-[8px] p-3.5 border border-[#eae8e4] dark:border-[#38271c] flex items-center justify-between gap-3">
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-3 w-20 rounded bg-[#eae8e4] dark:bg-[#38271c] animate-pulse" />
        <div className="h-5 w-3/4 rounded bg-[#eae8e4] dark:bg-[#38271c] animate-pulse" />
      </div>
      <div className="size-9 rounded-[7px] bg-[#eae8e4] dark:bg-[#38271c] animate-pulse shrink-0" />
    </div>
  );
}

function SkeletonSection() {
  return (
    <div className="bg-white dark:bg-[#201711] rounded-[10px] p-4 sm:p-5 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] space-y-4">
      <div className="flex items-center gap-3 pb-3 border-b border-[#eae8e4] dark:border-[#38271c]">
        <div className="size-9 rounded-[8px] bg-[#eae8e4] dark:bg-[#38271c] animate-pulse" />
        <div className="h-4 w-32 rounded bg-[#eae8e4] dark:bg-[#38271c] animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

export function GeneralSettingsDetailsView() {
  const { direction, isEn } = useLanguage();
  const [settings, setSettings] = useState<GeneralSettings>(initialGeneralSettings);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedColor, setCopiedColor] = useState(false);

  const settingsQuery = useGeneralSettingsQuery();

  useEffect(() => {
    if (settingsQuery.data) {
      setSettings((prev) => ({ ...prev, ...mapGeneralSettingsFromApi(settingsQuery.data) }));
    }
  }, [settingsQuery.data]);

  const status: LoadStatus =
    settingsQuery.isLoading && !settingsQuery.data
      ? "loading"
      : settingsQuery.error && !settingsQuery.data
      ? "error"
      : "ready";

  const handleRetry = () => {
    settingsQuery.refetch();
  };

  const handleCopyLicense = () => {
    navigator.clipboard.writeText(settings.licenseCode);
    setCopiedCode(true);
    toast.success(
      isEn ? "License code copied to clipboard" : "تم نسخ كود التفعيل إلى الحافظة"
    );
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyColor = () => {
    navigator.clipboard.writeText(settings.primaryColor);
    setCopiedColor(true);
    toast.success(
      isEn ? "Color hex copied to clipboard" : "تم نسخ كود اللون إلى الحافظة"
    );
    setTimeout(() => setCopiedColor(false), 2500);
  };

  return (
    <div
      dir={direction}
      className="flex h-screen h-dvh bg-[#f5f3ef] dark:bg-[#150f0b] text-[#1b1c1a] dark:text-[#fdfbf7] font-sans antialiased overflow-hidden selection:bg-[#ffddb6]/30 selection:text-[#643f00] transition-colors duration-200"
    >
      <DashboardSidebar activeNav="system-settings" activeSubNav="general" />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <DashboardTopNavbar />

        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 pt-5 pb-6 max-w-[1360px] w-full mx-auto space-y-4 scrollbar-thin">
          <DashboardPageTransition>
            <div className="space-y-4 w-full">
              {/* Top Banner Header Card */}
              <div className="bg-white dark:bg-[#201711] rounded-[10px] px-4 py-3.5 sm:px-5 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex flex-col gap-1 text-start min-w-0">
                  <h1 className="text-[20px] sm:text-[22px] leading-7 font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {isEn ? "General Settings" : "الإعدادات العامة"}
                  </h1>
                  <p className="text-[12px] leading-[18px] text-[#514537] dark:text-[#a89f91]">
                    {isEn
                      ? "Review platform configuration in an organized view, then edit when needed."
                      : "راجع بيانات المنصة بشكل مدمج ومنظم، ثم عدّلها عند الحاجة."}
                  </p>
                </div>
                {status === "ready" && (
                  <Link
                    href={EDIT_HREF}
                    className="bg-[#9c6402] hover:bg-[#835401] text-white text-[12px] font-semibold px-4 py-2 rounded-[6px] inline-flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer shrink-0"
                  >
                    <Pencil className="size-3.5" />
                    <span>{isEn ? "Edit Settings" : "تعديل الإعدادات"}</span>
                  </Link>
                )}
              </div>

              {/* Loading State */}
              {status === "loading" && (
                <div className="space-y-4">
                  <SkeletonSection />
                  <SkeletonSection />
                  <SkeletonSection />
                  <SkeletonSection />
                </div>
              )}

              {/* Error State */}
              {status === "error" && (
                <div className="bg-white dark:bg-[#201711] rounded-[10px] p-8 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col items-center gap-3 text-center">
                  <div className="size-11 rounded-[8px] bg-[rgba(186,26,26,0.08)] dark:bg-[rgba(248,113,113,0.12)] flex items-center justify-center text-[#ba1a1a] dark:text-[#f87171]">
                    <FileWarning className="size-5" />
                  </div>
                  <p className="text-[13px] font-semibold text-[#514537] dark:text-[#a89f91]">
                    {isEn
                      ? "Failed to load general settings data."
                      : "تعذر تحميل بيانات الإعدادات العامة."}
                  </p>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="bg-[#9c6402] hover:bg-[#835401] text-white px-5 py-2 rounded-[6px] font-semibold text-[13px] inline-flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="size-3.5" />
                    <span>{isEn ? "Retry" : "إعادة المحاولة"}</span>
                  </button>
                </div>
              )}

              {/* Ready State: 4 Distinct Section Cards */}
              {status === "ready" && (
                <div className="space-y-4">
                  {/* Section 1: بيانات النظام والمنشأة */}
                  <section className="bg-white dark:bg-[#201711] rounded-[10px] p-4 sm:p-5 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] space-y-4">
                    <SectionHeader
                      icon={Building2}
                      title={isEn ? "System & Entity Data" : "بيانات النظام والمنشأة"}
                      subtitle={
                        isEn
                          ? "Basic information about the platform and legal entity"
                          : "المعلومات الأساسية الخاصة بالمنصة والمنشأة القانونية"
                      }
                      badge={isEn ? "Core Info" : "البيانات الأساسية"}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                      <DisplayCard
                        label={isEn ? "System Title" : "عنوان النظام"}
                        value={settings.systemTitle}
                        icon={Layers}
                      />
                      <DisplayCard
                        label={isEn ? "Company / Firm Name" : "اسم الشركة أو المنشأة"}
                        value={settings.companyName}
                        icon={Building2}
                      />
                      <DisplayCard
                        label={isEn ? "Slogan" : "العبارة التعريفية"}
                        value={settings.slogan}
                        icon={Sparkles}
                        className="sm:col-span-2 xl:col-span-1"
                      />
                      <DisplayCard
                        label={isEn ? "Official Phone" : "رقم الهاتف المعتمد"}
                        value={settings.phone}
                        isLtr
                        action={
                          <a
                            href={`tel:${settings.phone}`}
                            title={isEn ? "Call" : "اتصال"}
                            className="size-9 rounded-[7px] bg-white dark:bg-[#1a120d] hover:bg-[#f5f3ef] dark:hover:bg-[#34241b] border border-[#eae8e4] dark:border-[#38271c] flex items-center justify-center text-[#9c6402] dark:text-[#f59e0b] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors cursor-pointer"
                          >
                            <Phone className="size-4" />
                          </a>
                        }
                      />
                      <DisplayCard
                        label={isEn ? "Official Email" : "البريد الإلكتروني الرسمي"}
                        value={settings.email}
                        isLtr
                        badge={
                          settings.isEmailVerified ? (
                            <span className="inline-flex items-center gap-1 bg-[#ecfdf5] dark:bg-[#132c21] border border-emerald-200 dark:border-emerald-500/30 px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold text-[#065f46] dark:text-[#6ee7b7]">
                              <ShieldCheck className="size-3" />
                              {isEn ? "Verified" : "مُتحقق"}
                            </span>
                          ) : null
                        }
                        action={
                          <a
                            href={`mailto:${settings.email}`}
                            title={isEn ? "Send Email" : "إرسال بريد"}
                            className="size-9 rounded-[7px] bg-white dark:bg-[#1a120d] hover:bg-[#f5f3ef] dark:hover:bg-[#34241b] border border-[#eae8e4] dark:border-[#38271c] flex items-center justify-center text-[#9c6402] dark:text-[#f59e0b] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors cursor-pointer"
                          >
                            <Mail className="size-4" />
                          </a>
                        }
                      />
                      <DisplayCard
                        label={isEn ? "License Key" : "كود التفعيل"}
                        value={settings.licenseCode}
                        isMonospace
                        badge={
                          <span className="inline-flex items-center gap-1 bg-[#ecfdf5] dark:bg-[#132c21] border border-emerald-200 dark:border-emerald-500/30 px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold text-[#065f46] dark:text-[#6ee7b7]">
                            <span className="size-1.5 rounded-full bg-[#059669]" />
                            {isEn ? "Active" : "مفعّل"}
                          </span>
                        }
                        action={
                          <button
                            type="button"
                            onClick={handleCopyLicense}
                            title={isEn ? "Copy License Code" : "نسخ كود التفعيل"}
                            className="h-9 px-3 rounded-[7px] bg-white dark:bg-[#1a120d] hover:bg-[#f5f3ef] dark:hover:bg-[#34241b] border border-[#ded5c6] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] text-[11px] font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                          >
                            {copiedCode ? (
                              <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Copy className="size-3.5 text-[#9c6402] dark:text-[#f59e0b]" />
                            )}
                            <span>
                              {copiedCode
                                ? isEn
                                  ? "Copied"
                                  : "تم النسخ"
                                : isEn
                                ? "Copy"
                                : "نسخ"}
                            </span>
                          </button>
                        }
                      />
                    </div>
                  </section>

                  {/* Section 2: الإعدادات الإقليمية */}
                  <section className="bg-white dark:bg-[#201711] rounded-[10px] p-4 sm:p-5 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] space-y-4">
                    <SectionHeader
                      icon={Globe}
                      title={isEn ? "Regional & Localization" : "الإعدادات الإقليمية"}
                      subtitle={
                        isEn
                          ? "Timezone, locale, currency and geographical parameters"
                          : "المنطقة الزمنية واللغة والعملة والمعايير الجغرافية"
                      }
                      badge={isEn ? "Localization" : "التعريب والإقليم"}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                      <DisplayCard
                        label={isEn ? "Timezone" : "المنطقة الزمنية"}
                        value={settings.timezone}
                        icon={Clock}
                      />
                      <DisplayCard
                        label={isEn ? "Default Language" : "لغة الواجهة"}
                        value={
                          settings.defaultLanguage === "ar"
                            ? isEn
                              ? "Arabic (ar)"
                              : "العربية (ar)"
                            : settings.defaultLanguage
                        }
                        icon={Languages}
                      />
                      <DisplayCard
                        label={isEn ? "Country / Headquarters" : "الدولة والمقر"}
                        value={
                          settings.country === "SA"
                            ? isEn
                              ? "Saudi Arabia (SA)"
                              : "المملكة العربية السعودية (SA)"
                            : settings.country
                        }
                        icon={MapPin}
                      />
                      <DisplayCard
                        label={isEn ? "Default Currency" : "العملة الافتراضية"}
                        value={
                          settings.defaultCurrency === "SAR"
                            ? isEn
                              ? "Saudi Riyal (SAR)"
                              : "ريال سعودي (SAR)"
                            : settings.defaultCurrency
                        }
                        icon={Coins}
                      />
                    </div>
                  </section>

                  {/* Section 3: الهوية البصرية */}
                  <section className="bg-white dark:bg-[#201711] rounded-[10px] p-4 sm:p-5 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] space-y-4">
                    <SectionHeader
                      icon={Palette}
                      title={isEn ? "Visual Branding" : "الهوية البصرية"}
                      subtitle={
                        isEn
                          ? "Logo and primary theme color defining the platform aesthetic"
                          : "الشعار واللون الأساسي المعتمدين لمظهر المنصة"
                      }
                      badge={isEn ? "Branding" : "المظهر والشعار"}
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Logo Card: Info right, Preview left */}
                      <div className="bg-[#faf8f5] dark:bg-[#281c15] hover:bg-[#f4efe9] dark:hover:bg-[#2e2018] rounded-[8px] p-4 border border-[#eae8e4] dark:border-[#38271c] transition-all duration-150 flex items-center justify-between gap-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                        <div className="flex flex-col gap-1 text-start min-w-0">
                          <span className="text-[11px] font-semibold text-[#837565] dark:text-[#a89f91]">
                            {isEn ? "Platform Logo" : "شعار المنصة"}
                          </span>
                          <span className="text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {isEn ? "Official Brand Icon" : "الأيقونة الرسمية المعتمدة"}
                          </span>
                          <p className="text-[11px] text-[#837565] dark:text-[#a89f91] mt-0.5">
                            {isEn
                              ? "PNG / SVG / JPG · 512×512 · max 2MB"
                              : "PNG / SVG / JPG · 512×512 · بحد أقصى 2MB"}
                          </p>
                        </div>
                        <div className="size-16 sm:size-18 rounded-[8px] bg-[#140e0a] border border-[#38271c] dark:border-[#483325] flex items-center justify-center p-2 shrink-0 shadow-inner">
                          <Image
                            src={logoImg}
                            alt="Logo"
                            width={44}
                            height={44}
                            className="object-contain max-h-11"
                          />
                        </div>
                      </div>

                      {/* Primary Color Card: Info right, Swatch & Copy left */}
                      <div className="bg-[#faf8f5] dark:bg-[#281c15] hover:bg-[#f4efe9] dark:hover:bg-[#2e2018] rounded-[8px] p-4 border border-[#eae8e4] dark:border-[#38271c] transition-all duration-150 flex items-center justify-between gap-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                        <div className="flex flex-col gap-1 text-start min-w-0">
                          <span className="text-[11px] font-semibold text-[#837565] dark:text-[#a89f91]">
                            {isEn ? "Primary Brand Color" : "اللون الأساسي للعلامة"}
                          </span>
                          <span className="text-[15px] font-mono font-bold uppercase text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {settings.primaryColor}
                          </span>
                          <span className="text-[11px] text-[#837565] dark:text-[#a89f91] mt-0.5">
                            {isEn ? "Royal Gold" : "ذهبي ملكي"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                          <button
                            type="button"
                            onClick={handleCopyColor}
                            title={isEn ? "Copy Hex Code" : "نسخ كود اللون"}
                            className="h-9 px-2.5 rounded-[7px] bg-white dark:bg-[#1a120d] hover:bg-[#f5f3ef] dark:hover:bg-[#34241b] border border-[#ded5c6] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] text-[11px] font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                          >
                            {copiedColor ? (
                              <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Copy className="size-3.5 text-[#9c6402] dark:text-[#f59e0b]" />
                            )}
                            <span className="hidden sm:inline">
                              {copiedColor ? (isEn ? "Copied" : "تم") : isEn ? "Copy" : "نسخ"}
                            </span>
                          </button>
                          <div
                            className="size-11 rounded-[8px] flex items-center justify-center shrink-0 text-white shadow-sm border border-black/10 dark:border-white/10"
                            style={{ backgroundColor: settings.primaryColor }}
                            title={settings.primaryColor}
                          >
                            <Check className="size-4 stroke-[2.5]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Section 4: روابط التكاملات والمساعدة */}
                  <section className="bg-white dark:bg-[#201711] rounded-[10px] p-4 sm:p-5 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] space-y-4">
                    <SectionHeader
                      icon={Share2}
                      title={isEn ? "Integrations & Help Links" : "روابط التكاملات والمساعدة"}
                      subtitle={
                        isEn
                          ? "Direct access to technical guides, API documentation and webhooks"
                          : "روابط سريعة لأدلة التكامل التقني والتوثيقات الرسمية"
                      }
                      badge={isEn ? "Developer" : "المطورين والدعم"}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          label: isEn ? "Telegram Guide" : "دليل Telegram",
                          value: settings.telegramGuideUrl,
                          dot: "bg-[#0ea5e9]",
                          badgeLabel: "Bot API",
                        },
                        {
                          label: isEn ? "WhatsApp Guide" : "دليل WhatsApp",
                          value: settings.whatsappGuideUrl,
                          dot: "bg-[#10b981]",
                          badgeLabel: "Cloud API",
                        },
                        {
                          label: isEn ? "API Documentation" : "توثيق API",
                          value: settings.apiDocsUrl,
                          dot: "bg-[#9c6402] dark:bg-[#f59e0b]",
                          badgeLabel: "REST v2",
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="bg-[#faf8f5] dark:bg-[#281c15] hover:bg-[#f4efe9] dark:hover:bg-[#2e2018] rounded-[8px] p-3.5 border border-[#eae8e4] dark:border-[#38271c] transition-all duration-150 flex items-center justify-between gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] group"
                        >
                          {/* Right side: Label with status dot and URL */}
                          <div className="flex flex-col gap-1 min-w-0 flex-1 text-start">
                            <div className="flex items-center gap-1.5">
                              <span className={cn("size-2 rounded-full shrink-0", item.dot)} />
                              <span className="text-[11px] font-semibold text-[#837565] dark:text-[#a89f91]">
                                {item.label}
                              </span>
                            </div>
                            <div
                              dir="ltr"
                              className="text-[12px] font-mono text-[#1b1c1a] dark:text-[#fdfbf7] truncate text-start font-medium"
                              title={item.value ?? ""}
                            >
                              {item.value || "—"}
                            </div>
                          </div>

                          {/* Left side: External Link Button */}
                          <div className="shrink-0">
                            <a
                              href={item.value || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="size-9 rounded-[7px] bg-white dark:bg-[#1a120d] hover:bg-[#f5f3ef] dark:hover:bg-[#34241b] border border-[#eae8e4] dark:border-[#38271c] flex items-center justify-center text-[#9c6402] dark:text-[#f59e0b] group-hover:text-[#643f00] dark:group-hover:text-[#ffddb6] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors cursor-pointer"
                              title={isEn ? "Open link in new tab" : "فتح الرابط في نافذة جديدة"}
                            >
                              <ExternalLink className="size-4 transition-transform group-hover:scale-110" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </div>
          </DashboardPageTransition>
        </main>
      </div>
    </div>
  );
}
