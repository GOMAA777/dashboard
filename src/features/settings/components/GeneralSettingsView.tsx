"use client";

import React, { useState } from "react";
import Image from "next/image";
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
  ChevronDown,
  Trash2,
  Upload,
} from "lucide-react";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { DashboardStickyActionBar } from "@/components/shared/DashboardStickyActionBar";
import { initialGeneralSettings } from "../data/initialGeneralSettings";
import { GeneralSettings } from "../types/general-settings.types";
import { cn } from "@/lib/utils";

export function GeneralSettingsView() {
  const [formData, setFormData] = useState<GeneralSettings>(initialGeneralSettings);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Available royal swatches from Figma 1:17097
  const royalSwatches = [
    { label: "عنابي", hex: "#881337" },
    { label: "فيروزي داكن", hex: "#0f766e" },
    { label: "رمادي أردوازي", hex: "#1e293b" },
    { label: "ذهبي ملكي", hex: "#9c6402" },
  ];

  const handleCopyLicense = () => {
    navigator.clipboard.writeText(formData.licenseCode);
    setCopiedCode(true);
    toast.success("تم نسخ كود التفعيل إلى الحافظة");
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("تم حفظ الإعدادات العامة بنجاح وتحديث الهوية البصرية للنظام.");
    }, 600);
  };

  const handleSaveDraft = () => {
    toast.info("تم حفظ الإعدادات كمسودة");
  };

  const handleCancel = () => {
    setFormData(initialGeneralSettings);
    toast.info("تم التراجع عن التعديلات غير المحفوظة");
  };

  return (
    <div className="flex h-screen h-dvh bg-[#f5f3ef] dark:bg-[#17120e] text-[#1b1c1a] dark:text-[#fdfbf7] font-sans antialiased overflow-hidden selection:bg-[#ffddb6]/30 selection:text-[#643f00] transition-colors duration-200">
      {/* 1. Global Navigation Sidebar with activeNav='system-settings' and activeSubNav='general' */}
      <DashboardSidebar activeNav="system-settings" activeSubNav="general" />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <DashboardTopNavbar />

        {/* Scrollable Form Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 py-6 max-w-[1360px] w-full mx-auto pb-28 sm:pb-32 space-y-6 scrollbar-thin">
          <DashboardPageTransition>
            <div className="space-y-6 w-full">
              {/* Main Identity & Command Banner (Figma 1:16870) */}
              <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Title & Description (Right in RTL) */}
            <div className="flex flex-col gap-[4px] text-start">
              <h1 className="text-[28px] leading-[38px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                الإعدادات العامة
              </h1>
              <p className="text-[14px] leading-[22px] font-normal text-[#514537] dark:text-[#a89f91]">
                إدارة بيانات المنصة وهويتها المؤسسية وإعداداتها التشغيلية الأساسية.
              </p>
            </div>
          </div>

          {/* Main Container Card (Figma 1:16894) */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-[24px] sm:p-[40px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col gap-[36px]">
            {/* ========================================================
                SECTION 1: بيانات النظام والمنشأة (System Data)
               ======================================================== */}
            <section className="flex flex-col gap-[20px]">
              {/* Section Header */}
              <div className="flex items-center gap-[16px] justify-start">
                <div className="size-[40px] rounded-[8px] bg-[rgba(156,100,2,0.1)] dark:bg-[rgba(226,157,56,0.15)] flex items-center justify-center shrink-0 text-[#9c6402] dark:text-[#f59e0b]">
                  <Building2 className="size-[20px]" />
                </div>
                <h2 className="text-[18px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[26px]">
                  بيانات النظام والمنشأة
                </h2>
              </div>

              {/* Grid 2 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[24px] gap-y-[20px] pt-[8px]">
                {/* 1.1 عنوان النظام (System Title) */}
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start flex items-center gap-[2px]">
                    <span>عنوان النظام</span>
                    <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.systemTitle}
                    onChange={(e) => setFormData({ ...formData, systemTitle: e.target.value })}
                    className="w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[14px] font-normal rounded-[4px] px-[16px] py-[10px] border border-transparent dark:border-[#38271c] focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] focus:outline-none transition-all"
                  />
                  <p className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] text-start leading-[14px]">
                    يظهر في شريط العنوان أعلى صفحات المتصفح وكعنوان رئيسي للمنصة.
                  </p>
                </div>

                {/* 1.2 اسم الشركة أو المنشأة (Company / Firm Name) */}
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start flex items-center gap-[2px]">
                    <span>اسم الشركة أو المنشأة</span>
                    <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[14px] font-normal rounded-[4px] px-[16px] py-[10px] border border-transparent dark:border-[#38271c] focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] focus:outline-none transition-all"
                  />
                  <p className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] text-start leading-[14px]">
                    الاسم القانوني المعتمد في إصدار الفواتير والعقود الرسمية.
                  </p>
                </div>

                {/* 1.3 العبارة التعريفية (Slogan) - Col span 2 */}
                <div className="flex flex-col gap-[6px] md:col-span-2">
                  <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start">
                    العبارة التعريفية (Slogan)
                  </label>
                  <input
                    type="text"
                    value={formData.slogan}
                    onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                    className="w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[14px] font-normal rounded-[4px] px-[16px] py-[10px] border border-transparent dark:border-[#38271c] focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] focus:outline-none transition-all"
                  />
                </div>

                {/* 1.4 رقم الهاتف المعتمد (Phone Number) */}
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start flex items-center gap-[2px]">
                    <span>رقم الهاتف المعتمد</span>
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
                    يُستخدم للتواصل الرسمي وإرسال تنبيهات الأمان الحرجة.
                  </p>
                </div>

                {/* 1.5 البريد الإلكتروني الرسمي (Official Email) */}
                <div className="flex flex-col gap-[6px]">
                  <div className="flex items-center justify-between">
                    <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start flex items-center gap-[2px]">
                      <span>البريد الإلكتروني الرسمي</span>
                      <span className="text-[#ba1a1a]">*</span>
                    </label>
                    {/* Verified Badge */}
                    <div className="flex items-center gap-[4px] text-[#047857] dark:text-[#6ee7b7]">
                      <span className="text-[10px] font-bold">مُتحقق منه</span>
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
                    صندوق الوارد للإشعارات الآلية وإدارة المستخدمين.
                  </p>
                </div>

                {/* 1.6 كود التفعيل ورخصة النظام (License Code) - Col span 2 */}
                <div className="flex flex-col gap-[6px] md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start">
                      كود التفعيل ورخصة النظام
                    </label>
                    {/* License Active Badge */}
                    <div className="bg-[#ecfdf5] dark:bg-[#132c21] border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-[6px] px-[8px] py-[2px] rounded-[4px]">
                      <span className="text-[10px] font-bold text-[#065f46] dark:text-[#6ee7b7]">
                        مرخّص ومفعّل لمؤسسة كبرى
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
                      <span>{copiedCode ? "تم النسخ" : "نسخ الكود"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Divider */}
            <div className="h-px bg-[#eae8e4] dark:bg-[#38271c] w-full" />

            {/* ========================================================
                SECTION 2: الإعدادات الإقليمية والمحلية (Regional Settings)
               ======================================================== */}
            <section className="flex flex-col gap-[20px]">
              {/* Section Header */}
              <div className="flex items-center gap-[16px] justify-start">
                <div className="size-[40px] rounded-[8px] bg-[rgba(156,100,2,0.1)] dark:bg-[rgba(226,157,56,0.15)] flex items-center justify-center shrink-0 text-[#9c6402] dark:text-[#f59e0b]">
                  <Globe className="size-[20px]" />
                </div>
                <h2 className="text-[18px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[26px]">
                  الإعدادات الإقليمية والمحلية
                </h2>
              </div>

              {/* Grid 2 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[24px] gap-y-[20px] pt-[8px]">
                {/* 2.1 المنطقة الزمنية (Timezone) */}
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start flex items-center gap-[2px]">
                    <span>المنطقة الزمنية (Timezone)</span>
                    <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.timezone}
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                      className="w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[14px] font-normal rounded-[4px] px-[16px] py-[10px] border border-transparent dark:border-[#38271c] focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] focus:outline-none appearance-none cursor-pointer transition-all"
                    >
                      <option value="(GMT+03:00) توقيت الرياض - المملكة العربية السعودية (AST)" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                        (GMT+03:00) توقيت الرياض - المملكة العربية السعودية (AST)
                      </option>
                      <option value="(GMT+04:00) توقيت دبي - الإمارات العربية المتحدة (GST)" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                        (GMT+04:00) توقيت دبي - الإمارات العربية المتحدة (GST)
                      </option>
                      <option value="(GMT+03:00) توقيت الكويت - دولة الكويت (AST)" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                        (GMT+03:00) توقيت الكويت - دولة الكويت (AST)
                      </option>
                      <option value="(GMT+02:00) توقيت القاهرة - جمهورية مصر العربية (EET)" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                        (GMT+02:00) توقيت القاهرة - جمهورية مصر العربية (EET)
                      </option>
                    </select>
                    <ChevronDown className="absolute top-1/2 -translate-y-1/2 start-[16px] size-[16px] text-[#837565] dark:text-[#a89f91] pointer-events-none" />
                  </div>
                  <p className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] text-start leading-[14px]">
                    تعتمد عليها جدولة الجلسات القضائية وتواريخ انتهاء المهام.
                  </p>
                </div>

                {/* 2.2 اللغة الافتراضية للواجهة (Default Language) */}
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start flex items-center gap-[2px]">
                    <span>اللغة الافتراضية للواجهة</span>
                    <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.defaultLanguage}
                      onChange={(e) => setFormData({ ...formData, defaultLanguage: e.target.value })}
                      className="w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[14px] font-normal rounded-[4px] px-[16px] py-[10px] border border-transparent dark:border-[#38271c] focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] focus:outline-none appearance-none cursor-pointer transition-all"
                    >
                      <option value="العربية (المملكة العربية السعودية) - AR (افتراضي)" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                        العربية (المملكة العربية السعودية) - AR (افتراضي)
                      </option>
                      <option value="English (United States) - EN" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                        English (United States) - EN
                      </option>
                      <option value="Français (France) - FR" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                        Français (France) - FR
                      </option>
                    </select>
                    <ChevronDown className="absolute top-1/2 -translate-y-1/2 start-[16px] size-[16px] text-[#837565] dark:text-[#a89f91] pointer-events-none" />
                  </div>
                  <p className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] text-start leading-[14px]">
                    يمكن لكل مستخدم تخصيص لغته الشخصية من حسابه الفردي لاحقاً.
                  </p>
                </div>

                {/* 2.3 الدولة والمقر الرئيسي (Country) */}
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start flex items-center gap-[2px]">
                    <span>الدولة والمقر الرئيسي</span>
                    <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[14px] font-normal rounded-[4px] px-[16px] py-[10px] border border-transparent dark:border-[#38271c] focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] focus:outline-none appearance-none cursor-pointer transition-all"
                    >
                      <option value="المملكة العربية السعودية (KSA) 🇸🇦" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                        المملكة العربية السعودية (KSA) 🇸🇦
                      </option>
                      <option value="الإمارات العربية المتحدة (UAE) 🇦🇪" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                        الإمارات العربية المتحدة (UAE) 🇦🇪
                      </option>
                      <option value="دولة الكويت (KWT) 🇰🇼" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                        دولة الكويت (KWT) 🇰🇼
                      </option>
                      <option value="مملكة البحرين (BHR) 🇧🇭" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                        مملكة البحرين (BHR) 🇧🇭
                      </option>
                      <option value="سلطنة عمان (OMN) 🇴🇲" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                        سلطنة عمان (OMN) 🇴🇲
                      </option>
                      <option value="دولة قطر (QAT) 🇶🇦" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">
                        دولة قطر (QAT) 🇶🇦
                      </option>
                    </select>
                    <ChevronDown className="absolute top-1/2 -translate-y-1/2 start-[16px] size-[16px] text-[#837565] dark:text-[#a89f91] pointer-events-none" />
                  </div>
                </div>

                {/* 2.4 العملة الافتراضية (Default Currency) */}
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start flex items-center gap-[2px]">
                    <span>العملة الافتراضية</span>
                    <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.defaultCurrency}
                      onChange={(e) => setFormData({ ...formData, defaultCurrency: e.target.value })}
                      className="w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[14px] font-normal rounded-[4px] px-[16px] py-[10px] border border-transparent dark:border-[#38271c] focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:bg-white dark:focus:bg-[#1a120d] focus:outline-none appearance-none cursor-pointer transition-all"
                    >
                      <option value="ريال سعودي (SAR - ر.س)" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">ريال سعودي (SAR - ر.س)</option>
                      <option value="درهم إماراتي (AED - د.إ)" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">درهم إماراتي (AED - د.إ)</option>
                      <option value="دينار كويتي (KWD - د.ك)" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">دينار كويتي (KWD - د.ك)</option>
                      <option value="دولار أمريكي (USD - $)" className="bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7]">دولار أمريكي (USD - $)</option>
                    </select>
                    <ChevronDown className="absolute top-1/2 -translate-y-1/2 start-[16px] size-[16px] text-[#837565] dark:text-[#a89f91] pointer-events-none" />
                  </div>
                  <p className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] text-start leading-[14px]">
                    تُطبق على فواتير الأتعاب، السندات، وتقارير العوائد.
                  </p>
                </div>
              </div>
            </section>

            {/* Divider */}
            <div className="h-px bg-[#eae8e4] dark:bg-[#38271c] w-full" />

            {/* ========================================================
                SECTION 3: الهوية البصرية وتخصيص الواجهة (Visual Branding)
               ======================================================== */}
            <section className="flex flex-col gap-[20px]">
              {/* Section Header */}
              <div className="flex items-center justify-between">
                {/* Right Title + Icon */}
                <div className="flex items-center gap-[16px]">
                  <div className="size-[40px] rounded-[8px] bg-[rgba(156,100,2,0.1)] dark:bg-[rgba(226,157,56,0.15)] flex items-center justify-center shrink-0 text-[#9c6402] dark:text-[#f59e0b]">
                    <Palette className="size-[20px]" />
                  </div>
                  <h2 className="text-[18px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[26px]">
                    الهوية البصرية وتخصيص الواجهة
                  </h2>
                </div>

                {/* Left Badge */}
                <div className="bg-[rgba(255,221,182,0.3)] dark:bg-[#38271c] text-[#643f00] dark:text-[#ffddb6] text-[10px] font-bold px-[12px] py-[4px] rounded-[2px] hidden sm:block">
                  تخصيص الهوية البصرية الخاصة بالمنشأة المشتركة
                </div>
              </div>

              {/* Grid: 7 cols Logo / 5 cols Brand Color */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px] pt-[8px]">
                {/* 3.1 شعار المنصة والشركة (Logo Customization) - 7 cols */}
                <div className="lg:col-span-7 flex flex-col gap-[8px]">
                  <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start">
                    شعار المنصة والشركة
                  </label>
                  <div className="bg-[#f5f3ef] dark:bg-[#281c15] rounded-[8px] p-[20px] flex items-center gap-[24px] border border-transparent dark:border-[#38271c]">
                    {/* Logo Dark Preview Box (Figma 1:17075) */}
                    <div className="size-[112px] rounded-[8px] bg-[#1c140f] flex items-center justify-center shrink-0 p-[12px] shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.1)] relative border border-white/5">
                      <Image
                        src="/logo.png"
                        alt="شعار المنصة"
                        width={64}
                        height={64}
                        className="object-contain max-h-[64px]"
                      />
                    </div>

                    {/* Actions & Specs */}
                    <div className="flex-1 flex flex-col gap-[12px] text-start">
                      {/* Action Buttons */}
                      <div className="flex items-center gap-[8px]">
                        <button
                          type="button"
                          onClick={() => toast.info("اختر ملف الشعار الجديد بدقة 512×512")}
                          className="bg-white dark:bg-[#221812] hover:bg-[#faf9f6] dark:hover:bg-[#34241b] text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] font-semibold px-[16px] py-[8px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] flex items-center gap-[6px] transition-colors shadow-xs cursor-pointer"
                        >
                          <Upload className="size-[14px]" />
                          <span>تغيير الشعار</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => toast.error("لا يمكن حذف الشعار الرئيسي الافتراضي")}
                          className="bg-[rgba(186,26,26,0.1)] hover:bg-[rgba(186,26,26,0.18)] dark:bg-[rgba(248,113,113,0.15)] text-[#ba1a1a] dark:text-[#f87171] text-[12px] font-semibold px-[12px] py-[8px] rounded-[4px] flex items-center gap-[6px] transition-colors cursor-pointer"
                        >
                          <Trash2 className="size-[13px]" />
                          <span>حذف</span>
                        </button>
                      </div>

                      {/* Helper Specs */}
                      <p className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] leading-[16px]">
                        الصيغ المقبولة: PNG أو SVG أو JPG بخلفية شفافة بدقة لا تقل عن 512×512 بكسل وحجم أقصى 2 ميجابايت.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3.2 اللون الأساسي للعلامة التجارية (Primary Brand Color) - 5 cols */}
                <div className="lg:col-span-5 flex flex-col gap-[8px]">
                  <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start">
                    اللون الأساسي للعلامة التجارية
                  </label>
                  <div className="bg-[#f5f3ef] dark:bg-[#281c15] rounded-[8px] p-[20px] flex flex-col gap-[16px] border border-transparent dark:border-[#38271c]">
                    {/* Top Hex Input & Live Circle */}
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

                      {/* Live Circle Preview */}
                      <div
                        className="size-[48px] rounded-[12px] flex items-center justify-center shrink-0 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] transition-colors text-white"
                        style={{ backgroundColor: formData.primaryColor }}
                      >
                        <Check className="size-[16px] stroke-[2.5]" />
                      </div>
                    </div>

                    {/* Quick Swatches Row */}
                    <div className="flex flex-col gap-[8px] text-start">
                      <span className="text-[10px] font-semibold text-[#514537] dark:text-[#cdc5bd]">
                        الألوان الملكية المعتمدة:
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

            {/* Divider */}
            <div className="h-px bg-[#eae8e4] dark:bg-[#38271c] w-full" />

            {/* ========================================================
                SECTION 4: روابط التكاملات والمساعدة (Integrations & Help Links)
               ======================================================== */}
            <section className="flex flex-col gap-[20px]">
              {/* Section Header */}
              <div className="flex items-center gap-[16px] justify-start">
                <div className="size-[40px] rounded-[8px] bg-[rgba(156,100,2,0.1)] dark:bg-[rgba(226,157,56,0.15)] flex items-center justify-center shrink-0 text-[#9c6402] dark:text-[#f59e0b]">
                  <Share2 className="size-[20px]" />
                </div>
                <h2 className="text-[18px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[26px]">
                  روابط التكاملات والمساعدة
                </h2>
              </div>

              {/* 3 Columns Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] pt-[8px]">
                {/* 4.1 فيديو دليل إعداد Telegram */}
                <div className="flex flex-col gap-[6px]">
                  <div className="flex items-center gap-[6px] text-start">
                    <span className="size-[8px] rounded-full bg-[#0ea5e9]" />
                    <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      فيديو دليل إعداد Telegram
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
                      title="فتح الرابط"
                    >
                      <ExternalLink className="size-[13px]" />
                    </a>
                  </div>
                  <p className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] text-start leading-[14px]">
                    توجيه المحامين لربط البوت التفاعلي لملخصات القضايا اليومية.
                  </p>
                </div>

                {/* 4.2 فيديو دليل إعداد WhatsApp */}
                <div className="flex flex-col gap-[6px]">
                  <div className="flex items-center gap-[6px] text-start">
                    <span className="size-[8px] rounded-full bg-[#10b981]" />
                    <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      فيديو دليل إعداد WhatsApp
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
                      title="فتح الرابط"
                    >
                      <ExternalLink className="size-[13px]" />
                    </a>
                  </div>
                  <p className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] text-start leading-[14px]">
                    مرجع إعداد الحساب الرسمي للأعمال وإرسال إخطارات الجلسات.
                  </p>
                </div>

                {/* 4.3 رابط توثيق API للمطورين */}
                <div className="flex flex-col gap-[6px]">
                  <div className="flex items-center text-start">
                    <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      رابط توثيق API للمطورين
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
                      title="فتح الرابط"
                    >
                      <ExternalLink className="size-[13px]" />
                    </a>
                  </div>
                  <p className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] text-start leading-[14px]">
                    مستندات RESTful API لربط الأنظمة القضائية والمالية.
                  </p>
                </div>
              </div>
            </section>
          </div>

            {/* FLOATING STICKY ACTION BAR (Figma 1:17160) */}
            <DashboardStickyActionBar>
              {/* Text note on the Right (Start in RTL) */}
              <span className="text-[12px] font-normal text-[#837565] dark:text-[#cdc5bd] hidden sm:inline text-start">
                يتم حفظ جميع التعديلات وتطبيقها فوراً عبر خوادم المنصة
              </span>

              {/* Action Buttons on the Left (End in RTL) */}
              <div className="flex items-center gap-[10px] ms-auto sm:ms-0">
                {/* Primary Submit Button */}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-[#9c6402] hover:bg-[#835401] active:bg-[#6c4501] text-white px-[32px] py-[10px] rounded-[6px] font-semibold text-[14px] flex items-center gap-[8px] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.05)] cursor-pointer disabled:opacity-70"
                >
                  <Check className="size-[18px] stroke-[2.5]" />
                  <span>{isSaving ? "جارٍ الحفظ..." : "حفظ التغييرات"}</span>
                </button>

                {/* Save Draft */}
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="bg-[#f0eeea] dark:bg-[#2c2017] hover:bg-[#e4e1dc] dark:hover:bg-[#382a1f] text-[#1b1c1a] dark:text-[#fdfbf7] border border-transparent dark:border-[#3d2a1d] px-[24px] py-[10px] rounded-[6px] font-semibold text-[14px] transition-colors cursor-pointer"
                >
                  حفظ كمسودة
                </button>

                {/* Cancel */}
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-[#f0eeea] dark:bg-[#2c2017] hover:bg-[#e4e1dc] dark:hover:bg-[#382a1f] text-[#1b1c1a] dark:text-[#fdfbf7] border border-transparent dark:border-[#3d2a1d] px-[24px] py-[10px] rounded-[6px] font-semibold text-[14px] transition-colors cursor-pointer"
                >
                  إلغاء
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
