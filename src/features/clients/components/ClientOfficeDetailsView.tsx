"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Scale,
  Calendar,
  Lock,
  Receipt,
  PenSquare,
  Mail,
  Phone,
  PhoneCall,
  Building2,
  Users,
  Eye,
  EyeOff,
  Download,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  Check,
  DoorOpen,
  Hash,
  MapPin,
  User,
  KeyRound,
  ShieldCheck,
  Copy,
  Globe,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { ClientOffice, OfficeInternalNote } from "../types/client.types";
import { useLanguage } from "@/lib/i18n";
import { addFirmNote } from "@/lib/api/firms";
import { unwrapData } from "@/lib/api/helpers";
import { UpgradeClientOfficePlanModal } from "./UpgradeClientOfficePlanModal";
import { InvoiceDetailsModal } from "@/features/invoices/components/InvoiceDetailsModal";
import { InvoiceItem } from "@/features/invoices/types/invoices.types";
import {
  TicketQuickViewModal,
  TicketQuickViewData,
} from "@/features/tickets/components/TicketQuickViewModal";

function formatArabicDate(isoOrStr?: string, fallback = "—"): string {
  if (!isoOrStr) return fallback;
  try {
    const d = new Date(isoOrStr);
    if (isNaN(d.getTime())) return isoOrStr;
    return d.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return isoOrStr;
  }
}

function formatShortDate(isoOrStr?: string, fallback = "—"): string {
  if (!isoOrStr) return fallback;
  try {
    const d = new Date(isoOrStr);
    if (isNaN(d.getTime())) return isoOrStr;
    return d.toLocaleDateString("ar-SA", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return isoOrStr;
  }
}

function formatNoteDate(isoOrStr?: string): string {
  if (!isoOrStr) return "اليوم";
  try {
    const d = new Date(isoOrStr);
    if (isNaN(d.getTime())) return isoOrStr;
    return d.toLocaleDateString("ar-SA", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoOrStr;
  }
}

interface ClientOfficeDetailsViewProps {
  office: ClientOffice | null;
  onBack: () => void;
  onEdit: () => void;
  onEnterOfficeAsAdmin?: () => void;
  onOpenDeactivateModal?: (office: ClientOffice) => void;
  onReactivate?: (office: ClientOffice) => void;
  onUpgradePlan?: (office: ClientOffice, newPlan: string) => void;
}

export function ClientOfficeDetailsView({
  office,
  onBack,
  onEdit,
  onEnterOfficeAsAdmin,
  onOpenDeactivateModal,
  onReactivate,
  onUpgradePlan,
}: ClientOfficeDetailsViewProps) {
  const { t, isEn } = useLanguage();
  const [internalNote, setInternalNote] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [notes, setNotes] = useState<OfficeInternalNote[]>(office?.internalNotes || []);

  React.useEffect(() => {
    if (office?.internalNotes) {
      setNotes(office.internalNotes);
    }
  }, [office?.internalNotes]);

  const isDeactivated = office?.accountStatus?.type === "suspended";
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(office?.plan || "الباقة الاحترافية");
  const [logoFailed, setLogoFailed] = useState(false);
  const [showCredentialsPassword, setShowCredentialsPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    if (!text || text === "—") return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(t(`تم نسخ ${fieldName} إلى الحافظة`, `${fieldName} copied to clipboard`));
    setTimeout(() => setCopiedField(null), 2000);
  };

  React.useEffect(() => {
    setLogoFailed(false);
  }, [office?.id, office?.logo]);

  React.useEffect(() => {
    if (office?.plan) {
      setCurrentPlan(office.plan);
    }
  }, [office?.plan]);

  if (!office) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-16 bg-white dark:bg-[#221812] rounded-[8px] border border-[#f0eeea] dark:border-[#38271c]">
        <div className="size-10 border-4 border-[#9c6402] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-[#837565] dark:text-[#cdc5bd] text-sm">
          {t("جارٍ تحميل تفاصيل مكتب المحاماة...", "Loading law office details...")}
        </span>
      </div>
    );
  }

  const officeName = office.name;
  const owner = office.owner && office.owner !== "—" ? office.owner : "د. عبد العزيز بن فهد العجلان";
  const licenseNum = office.licenseNumber ? office.licenseNumber.replace("ترخيص عدلي: ", "") : "—";
  const taxNumber = office.taxNumber || "—";
  const email = office.email || "—";
  const phone = office.phone || "—";
  const landline = office.landline || "011 482 9900";
  const city = office.city || "الرياض";
  const country = office.country || "المملكة العربية السعودية";
  const address = office.address || (office.city ? `المملكة العربية السعودية - ${office.city}` : "طريق الملك فهد، حي الصحافة، برج النخبة - الطابق 14");
  const password = office.password || office.initialPassword || "AlJudy#Law2025";
  const planType = office.planType || (office.plan.includes("تجرب") ? "trial" : "paid");
  const billingCycle = office.billingCycle || "سنوي";
  const registrationDate = formatArabicDate(office.registrationDate);
  const subscriptionEnd = office.subscriptionEnd;
  const subscriptionStart = office.subscriptionStart;
  const autoRenew = office.autoRenew !== false;

  const lawyersUsed = office.resourceUsage?.lawyersUsed ?? 1;
  const lawyersLimit = office.resourceUsage?.lawyersLimit ?? 8;
  const lawyersPercent = office.resourceUsage?.lawyersPercent ?? Math.round((lawyersUsed / Math.max(1, lawyersLimit)) * 100);
  const storageUsedGb = office.resourceUsage?.storageUsedGb ?? "0.00";
  const storageLimitGb = office.resourceUsage?.storageLimitGb ?? 50;
  const storagePercent = office.resourceUsage?.storagePercent ?? Math.round((Number(storageUsedGb) / Math.max(1, storageLimitGb)) * 100);
  const activeCases = office.resourceUsage?.activeCases ?? 0;

  const latestTicket: TicketQuickViewData | null = null;
  const latestInvoice: InvoiceItem | null = null;

  const handleAddNote = async () => {
    if (!internalNote.trim()) {
      toast.error(t("يرجى كتابة الملاحظة أولاً", "Please write a note first"));
      return;
    }
    setIsSubmittingNote(true);
    try {
      const res = await addFirmNote(office.id, internalNote.trim());
      const raw = (unwrapData<any>(res) || res) as any;
      const noteData = raw.data || raw;
      const newNote: OfficeInternalNote = {
        id: Number(noteData.id || Date.now()),
        authorName: String(noteData.author_name || "مشرف النظام"),
        authorRole: String(noteData.author_role || "إشراف النظام"),
        note: internalNote.trim(),
        createdAt: String(noteData.created_at || new Date().toISOString()),
      };
      setNotes((prev) => [newNote, ...prev]);
      toast.success(t("تم حفظ الملاحظة الإدارية بنجاح", "Internal note added successfully"));
      setInternalNote("");
    } catch {
      toast.error(t("تعذر إضافة الملاحظة", "Failed to add internal note"));
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleToggleDeactivate = () => {
    if (!isDeactivated && onOpenDeactivateModal) {
      onOpenDeactivateModal(office);
      return;
    }

    if (isDeactivated && onReactivate) {
      onReactivate(office);
      toast.success(`تم تنشيط حساب ${officeName} بنجاح`);
    }
  };

  return (
    <div
      className="w-full flex flex-col gap-6 font-['Cairo',sans-serif]"
      data-node-id="1:1778"
    >
      {/* 1. TOP PROFILE HEADER & SUMMARY CARD */}
      <div
        className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative overflow-hidden"
        data-node-id="1:1781"
      >
        {/* Subtle decorative gold ambient glow */}
        <div className="absolute -top-[48px] -start-[48px] size-[180px] bg-gradient-to-br from-[#ffddb6]/20 to-transparent blur-[25px] rounded-full pointer-events-none" />

        {/* Right: Monogram & Identity Info */}
        <div className="flex items-center gap-[16px] z-10">
          {/* Monogram / Seal Avatar or Real Logo */}
          {office.logo && !logoFailed ? (
            <div className="size-[80px] rounded-[8px] bg-white dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#38271c] p-1.5 flex items-center justify-center shadow-md shrink-0 overflow-hidden">
              <img
                src={office.logo}
                alt={officeName}
                className="max-h-full max-w-full object-contain"
                onError={() => setLogoFailed(true)}
              />
            </div>
          ) : (
            <div className="size-[80px] rounded-[8px] bg-gradient-to-br from-[#9c6402] to-[#623e00] flex flex-col items-center justify-center text-white shadow-md shrink-0">
              <Scale className="size-[28px] text-[#ffddb6]" />
              <span className="text-[#ffddb6] text-[10px] font-bold tracking-[0.5px] uppercase mt-[2px]">
                {officeName.split(" ")[1] || officeName.slice(0, 8)}
              </span>
            </div>
          )}

          {/* Details & Status Badges */}
          <div className="flex flex-col items-start text-start">
            <h1 className="text-[26px] leading-[36px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {officeName}
            </h1>

            {/* Subtitle Metadata */}
            <div className="flex flex-wrap items-center gap-[8px] text-[12px] text-[#514537] dark:text-[#cdc5bd] mt-[4px]">
              <div className="flex items-center gap-[4px]">
                <User className="size-[13px] text-[#837565] dark:text-[#8e8680]" />
                <span>{t("المحامي المسؤول:", "Managing Lawyer:")}</span>
                <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{owner}</span>
              </div>

              <span className="text-[#d6c4b1] dark:text-[#6e5849]">|</span>

              <div className="flex items-center gap-[4px]">
                <Scale className="size-[13px] text-[#837565] dark:text-[#8e8680]" />
                <span>{t("رقم الترخيص العدلي:", "License Number:")}</span>
                <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{licenseNum}</span>
                <span className="text-[10px] text-[#837565] dark:text-[#8e8680] font-bold">({t("وزارة العدل", "Ministry of Justice")})</span>
              </div>

              <span className="text-[#d6c4b1] dark:text-[#6e5849]">|</span>

              <div className="flex items-center gap-[4px]">
                <Hash className="size-[13px] text-[#837565] dark:text-[#8e8680]" />
                <span>{t("الرقم الضريبي:", "Tax Number:")}</span>
                <span className="font-mono text-[#1b1c1a] dark:text-[#fdfbf7] font-semibold">{taxNumber}</span>
              </div>

              <span className="text-[#d6c4b1] dark:text-[#6e5849]">|</span>

              <div className="flex items-center gap-[4px]">
                <MapPin className="size-[13px] text-[#837565] dark:text-[#8e8680]" />
                <span>{t("المقر والاختصاص:", "Location:")}</span>
                <span className="text-[#1b1c1a] dark:text-[#fdfbf7] font-semibold">{city}</span>
              </div>

              <span className="text-[#d6c4b1] dark:text-[#6e5849]">|</span>

              <div className="flex items-center gap-[4px]">
                <Calendar className="size-[13px] text-[#837565] dark:text-[#8e8680]" />
                <span>{t("تاريخ التسجيل:", "Registration Date:")}</span>
                <span className="text-[#1b1c1a] dark:text-[#fdfbf7] font-normal">{registrationDate}</span>
              </div>
            </div>

            {/* Distinct Status Pills (Account vs Subscription) */}
            <div className="flex flex-wrap items-center gap-[8px] mt-[8px]">
              {/* Account Status Badge */}
              <div
                className={`flex items-center gap-[6px] px-[10px] py-[3px] rounded-full text-[11px] font-bold border ${
                  isDeactivated
                    ? "bg-[#fef2f2] text-[#dc2626] border-[#fecaca] dark:bg-[#341616] dark:border-rose-500/40 dark:text-[#f87171]"
                    : "bg-[#e8f5e9] text-[#1b7340] border-[#c8e6c9] dark:bg-[#132c1c] dark:border-emerald-500/40 dark:text-[#6ee7b7]"
                }`}
              >
                <span
                  className={`size-[7px] rounded-full ${
                    isDeactivated ? "bg-[#dc2626] dark:bg-[#f43f5e]" : "bg-[#1b7340] dark:bg-[#10b981]"
                  }`}
                />
                <span>{t("حالة الحساب:", "Account Status:")} {isDeactivated ? t("معطل", "Suspended") : t("نشط", "Active")}</span>
              </div>

              {/* Subscription Status Badge */}
              <button
                type="button"
                onClick={() => setIsUpgradeModalOpen(true)}
                className="bg-[#fffbeb] border border-[#fde68a] text-[#92400e] dark:bg-[rgba(226,157,56,0.18)] dark:border-[#e29d38]/50 dark:text-[#f3c27e] flex items-center gap-[8px] px-[12px] py-[4px] rounded-full text-[11px] font-bold shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Sparkles className="size-[12px] text-[#b45309] dark:text-[#e29d38]" />
                <span>{t("الباقة الحالية:", "Current Plan:")} {currentPlan}</span>
                <span className="text-[#fde68a] dark:text-[#6e5849]">|</span>
                <span className="text-[#b45309] dark:text-[#fcd34d] text-[10px]">
                  {subscriptionEnd ? `${t("تجديد", "Renews")} ${formatShortDate(subscriptionEnd)}` : t("اشتراك سنوي", "Annual Plan")}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Left: Action Toolbar */}
        <div className="flex flex-wrap items-center gap-[8px] z-10 self-start lg:self-center">
          {/* Back button */}
          <button
            type="button"
            onClick={onBack}
            className="bg-white dark:bg-[#281c15] hover:bg-[#f5f3ef] dark:hover:bg-[#38271c] border border-[#eae8e4] dark:border-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] px-[12px] py-[8px] rounded-[4px] text-[13px] font-semibold flex items-center gap-[6px] shadow-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-[14px] rtl:rotate-180" />
            <span>{t("العودة للقائمة", "Back to List")}</span>
          </button>

          {/* Enter Office as Admin */}
          {onEnterOfficeAsAdmin && (
            <button
              type="button"
              onClick={onEnterOfficeAsAdmin}
              className="bg-[#1b1c1a] hover:bg-[#333] text-white px-[14px] py-[8px] rounded-[4px] text-[13px] font-semibold flex items-center gap-[6px] shadow-sm transition-colors cursor-pointer"
              title={t("دخول المكتب بصلاحيات Admin كاملة", "Enter office with full Admin permissions")}
            >
              <DoorOpen className="size-[14px]" />
              <span>{t("دخول المكتب", "Enter Office")}</span>
            </button>
          )}

          {/* Edit Office Button */}
          <button
            type="button"
            onClick={onEdit}
            className="bg-[#9c6402] hover:bg-[#855402] text-white px-[16px] py-[8px] rounded-[4px] text-[13px] font-semibold flex items-center gap-[6px] shadow-sm transition-colors cursor-pointer"
          >
            <PenSquare className="size-[14px]" />
            <span>{t("تعديل بيانات المكتب", "Edit Office")}</span>
          </button>

          {/* Manage Subscription Button */}
          <button
            type="button"
            onClick={() => setIsUpgradeModalOpen(true)}
            className="bg-white dark:bg-[#281c15] hover:bg-[#f5f3ef] dark:hover:bg-[#38271c] border border-[#eae8e4] dark:border-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] px-[14px] py-[8px] rounded-[4px] text-[13px] font-semibold flex items-center gap-[6px] shadow-sm transition-colors cursor-pointer"
          >
            <Receipt className="size-[14px]" />
            <span>{t("إدارة الاشتراك", "Manage Subscription")}</span>
          </button>

          {/* Deactivate Account Toggle Button */}
          <button
            type="button"
            onClick={handleToggleDeactivate}
            className={`px-[12px] py-[8px] rounded-[4px] text-[12px] font-semibold flex items-center gap-[6px] transition-colors cursor-pointer ${
              isDeactivated
                ? "bg-[#e8f5e9] dark:bg-[#132c1c] text-[#1b7340] dark:text-[#6ee7b7] hover:bg-[#c8e6c9]"
                : "bg-[#f5f3ef] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] hover:bg-[#eae8e4]"
            }`}
          >
            <Lock className="size-[13px]" />
            <span>{isDeactivated ? t("تفعيل الحساب", "Activate Account") : t("تعطيل مؤقت", "Suspend")}</span>
          </button>
        </div>
      </div>

      {/* 2. OVERVIEW CONTENT GRID (2 COLUMNS: 60% / 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* ======================================================== */}
        {/* RIGHT COLUMN (60% - 7 COLS IN RTL) */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* SECTION A: معلومات المنشأة والتواصل والترخيص */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col gap-4">
            {/* Header */}
            <div className="border-b border-[#f0eeea] dark:border-[#38271c] pb-[10px] flex items-center justify-between">
              <button
                type="button"
                onClick={onEdit}
                className="text-[#9c6402] dark:text-[#e29d38] hover:underline text-[12px] font-semibold flex items-center gap-[4px] cursor-pointer"
              >
                <PenSquare className="size-[12px]" />
                <span>{t("تحديث البيانات", "Edit Details")}</span>
              </button>

              <div className="flex items-center gap-[8px]">
                <h2 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("معلومات المنشأة والتواصل", "Firm & Contact Information")}
                </h2>
                <div className="w-[6px] h-[16px] bg-[#9c6402] dark:bg-[#e29d38] rounded-full" />
              </div>
            </div>

            {/* Mosaic Grid (8 Cards: Owner, License, Tax, Email, Phone, Landline, City/Country, Address) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
              {/* 1. Managing Lawyer / Owner */}
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex flex-col text-start min-w-0 flex-1 pe-2">
                  <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-bold">
                    {t("المحامي المسؤول / صاحب المنشأة", "Managing Lawyer / Owner")}
                  </span>
                  <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-bold mt-[2px] truncate">
                    {owner}
                  </span>
                  <span className="text-[10px] text-[#837565] dark:text-[#8e8680] mt-[1px]">
                    {t("المخول بالتوقيع والتمثيل القانوني", "Authorized signatory")}
                  </span>
                </div>
                <div className="bg-white dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 size-[36px] rounded-[4px] shadow-sm flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
                  <User className="size-[16px]" />
                </div>
              </div>

              {/* 2. Official Email */}
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex flex-col text-start min-w-0 flex-1 pe-2">
                  <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-bold">
                    {t("البريد الإلكتروني الرسمي للمكتب", "Official Email")}
                  </span>
                  <div className="flex items-center gap-1.5 mt-[2px]">
                    <a
                      href={`mailto:${email}`}
                      className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold hover:underline direction-ltr text-start truncate font-mono"
                    >
                      {email}
                    </a>
                    {email !== "—" && (
                      <button
                        type="button"
                        onClick={() => handleCopy(email, t("البريد الإلكتروني", "Email"))}
                        className="text-[#837565] hover:text-[#9c6402] dark:hover:text-[#e29d38] p-0.5 cursor-pointer"
                        title={t("نسخ البريد", "Copy Email")}
                      >
                        {copiedField === t("البريد الإلكتروني", "Email") ? (
                          <Check className="size-[12px] text-emerald-600" />
                        ) : (
                          <Copy className="size-[12px]" />
                        )}
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-[#837565] dark:text-[#8e8680] mt-[1px]">
                    {t("معتمد للإشعارات والتواصل الرسمي", "Certified for official notices")}
                  </span>
                </div>
                <div className="bg-white dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 size-[36px] rounded-[4px] shadow-sm flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
                  <Mail className="size-[16px]" />
                </div>
              </div>

              {/* 3. Mobile Phone */}
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex flex-col text-start min-w-0 flex-1 pe-2">
                  <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-bold">
                    {t("رقم الجوال للتواصل", "Mobile Phone")}
                  </span>
                  <div className="flex items-center gap-1.5 mt-[2px]">
                    <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold direction-ltr text-start font-mono">
                      {phone}
                    </span>
                    {phone !== "—" && (
                      <button
                        type="button"
                        onClick={() => handleCopy(phone, t("رقم الجوال", "Phone"))}
                        className="text-[#837565] hover:text-[#9c6402] dark:hover:text-[#e29d38] p-0.5 cursor-pointer"
                        title={t("نسخ رقم الجوال", "Copy Phone")}
                      >
                        {copiedField === t("رقم الجوال", "Phone") ? (
                          <Check className="size-[12px] text-emerald-600" />
                        ) : (
                          <Copy className="size-[12px]" />
                        )}
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-[#837565] dark:text-[#8e8680] mt-[1px]">
                    {t("المصادقة الثنائية وتنبيهات الجلسات", "2FA & court session alerts")}
                  </span>
                </div>
                <div className="bg-white dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 size-[36px] rounded-[4px] shadow-sm flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
                  <Phone className="size-[16px]" />
                </div>
              </div>

              {/* 4. Direct Landline */}
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex flex-col text-start min-w-0 flex-1 pe-2">
                  <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-bold">
                    {t("الهاتف المكتبي المباشر (الثابت)", "Direct Landline Phone")}
                  </span>
                  <div className="flex items-center gap-1.5 mt-[2px]">
                    <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold direction-ltr text-start font-mono">
                      {landline}
                    </span>
                    {landline !== "—" && (
                      <button
                        type="button"
                        onClick={() => handleCopy(landline, t("الهاتف المكتبي", "Landline"))}
                        className="text-[#837565] hover:text-[#9c6402] dark:hover:text-[#e29d38] p-0.5 cursor-pointer"
                        title={t("نسخ الهاتف المكتبي", "Copy Landline")}
                      >
                        {copiedField === t("الهاتف المكتبي", "Landline") ? (
                          <Check className="size-[12px] text-emerald-600" />
                        ) : (
                          <Copy className="size-[12px]" />
                        )}
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-[#837565] dark:text-[#8e8680] mt-[1px]">
                    {t("خط السنترال والاتصال المكتبي المباشر", "Switchboard & direct desk phone")}
                  </span>
                </div>
                <div className="bg-white dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 size-[36px] rounded-[4px] shadow-sm flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
                  <PhoneCall className="size-[16px]" />
                </div>
              </div>

              {/* 5. ZATCA Tax Number */}
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex flex-col text-start min-w-0 flex-1 pe-2">
                  <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-bold">
                    {t("الرقم الضريبي للمنشأة (ZATCA)", "Tax Number (ZATCA)")}
                  </span>
                  <div className="flex items-center gap-1.5 mt-[2px]">
                    <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold font-mono direction-ltr text-start">
                      {taxNumber}
                    </span>
                    {taxNumber !== "—" && (
                      <button
                        type="button"
                        onClick={() => handleCopy(taxNumber, t("الرقم الضريبي", "Tax Number"))}
                        className="text-[#837565] hover:text-[#9c6402] dark:hover:text-[#e29d38] p-0.5 cursor-pointer"
                        title={t("نسخ الرقم الضريبي", "Copy Tax Number")}
                      >
                        {copiedField === t("الرقم الضريبي", "Tax Number") ? (
                          <Check className="size-[12px] text-emerald-600" />
                        ) : (
                          <Copy className="size-[12px]" />
                        )}
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-[#837565] dark:text-[#8e8680] mt-[1px]">
                    {t("معتمد بهيئة الزكاة والضريبة والجمارك (15 رقماً)", "Certified by ZATCA for e-invoicing")}
                  </span>
                </div>
                <div className="bg-white dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 size-[36px] rounded-[4px] shadow-sm flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
                  <Hash className="size-[16px]" />
                </div>
              </div>

              {/* 6. Ministry of Justice License */}
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex flex-col text-start min-w-0 flex-1 pe-2">
                  <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-bold">
                    {t("رقم الترخيص المهني العدلي", "Ministry of Justice License")}
                  </span>
                  <div className="flex items-center gap-1.5 mt-[2px]">
                    <span className="text-[#9c6402] dark:text-[#f3c27e] text-[13px] font-bold font-mono">
                      {licenseNum}
                    </span>
                    {licenseNum !== "—" && (
                      <button
                        type="button"
                        onClick={() => handleCopy(licenseNum, t("رقم الترخيص", "License Number"))}
                        className="text-[#837565] hover:text-[#9c6402] dark:hover:text-[#e29d38] p-0.5 cursor-pointer"
                        title={t("نسخ رقم الترخيص", "Copy License")}
                      >
                        {copiedField === t("رقم الترخيص", "License Number") ? (
                          <Check className="size-[12px] text-emerald-600" />
                        ) : (
                          <Copy className="size-[12px]" />
                        )}
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-[#837565] dark:text-[#8e8680] mt-[1px]">
                    {t("صادر وموثق من وزارة العدل السعودية", "Ministry of Justice & Bar certified")}
                  </span>
                </div>
                <div className="bg-white dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 size-[36px] rounded-[4px] shadow-sm flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
                  <Scale className="size-[16px]" />
                </div>
              </div>

              {/* 7. City / Country */}
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex flex-col text-start min-w-0 flex-1 pe-2">
                  <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-bold">
                    {t("المدينة / نطاق الاختصاص المكاني", "City / Jurisdiction")}
                  </span>
                  <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold mt-[2px]">
                    {city} • {country}
                  </span>
                  <span className="text-[10px] text-[#837565] dark:text-[#8e8680] mt-[1px]">
                    {t("المحاكم الابتدائية والتجارية والاستئناف", "First instance & appeal jurisdiction")}
                  </span>
                </div>
                <div className="bg-white dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 size-[36px] rounded-[4px] shadow-sm flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
                  <MapPin className="size-[16px]" />
                </div>
              </div>

              {/* 8. Physical Headquarters Address */}
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex flex-col text-start min-w-0 flex-1 pe-2">
                  <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-bold">
                    {t("المقر الرئيسي / العنوان الوطني", "Headquarters / National Address")}
                  </span>
                  <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] font-medium leading-[18px] mt-[2px] line-clamp-2">
                    {address}
                  </span>
                  <span className="text-[10px] text-[#837565] dark:text-[#8e8680] mt-[1px]">
                    {t("العنوان المسجل للتبليغات والمراسلات القضائية", "Registered judicial service address")}
                  </span>
                </div>
                <div className="bg-white dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 size-[36px] rounded-[4px] shadow-sm flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
                  <Building2 className="size-[16px]" />
                </div>
              </div>
            </div>

            {/* Quick Capacity Indicators inside Section A */}
            <div className="bg-[#f0eeea] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[16px] flex flex-col gap-[8px]">
              <div className="flex items-center justify-between">
                <span className="text-[#514537] dark:text-[#cdc5bd] text-[12px] font-semibold">
                  {t("المحامون والمستشارون النشطون", "Active Lawyers & Advisors")}
                </span>
                <Users className="size-[16px] text-[#837565] dark:text-[#e29d38]" />
              </div>

              <div className="flex items-baseline gap-[6px]">
                <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[28px] font-bold leading-[34px]">
                  {lawyersUsed}
                </span>
                <span className="text-[#837565] dark:text-[#8e8680] text-[12px]">
                  / {lawyersLimit} {t("مقعد مستخدم متاح", "available user seats")}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#e4e2de] dark:bg-[#38271c] h-[8px] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#9c6402] dark:bg-[#e29d38] rounded-full transition-all"
                  style={{ width: `${Math.min(100, lawyersPercent)}%` }}
                />
              </div>

              <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-bold text-start">
                {lawyersLimit > lawyersUsed
                  ? t(`متبقي إضافة ${lawyersLimit - lawyersUsed} محامين شاغرة`, `${lawyersLimit - lawyersUsed} lawyer seats remaining`)
                  : t("تم استيفاء كامل مقاعد الخطة", "All plan seats are occupied")}
              </span>
            </div>
          </div>

          {/* SECTION A2: بيانات حساب المشرف الإداري والأمان (من إضافة مكتب) */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col gap-4">
            {/* Header */}
            <div className="border-b border-[#f0eeea] dark:border-[#38271c] pb-[10px] flex items-center justify-between">
              <span className="bg-[#ffddb6]/30 text-[#7b4e00] dark:bg-[rgba(226,157,56,0.18)] dark:text-[#f3c27e] border border-[#ffddb6] dark:border-[#e29d38]/50 text-[10px] font-bold px-[8px] py-[2px] rounded-full flex items-center gap-1.5">
                <ShieldCheck className="size-3" />
                <span>{t("خاص بالإدارة والأمان", "Admin & Security")}</span>
              </span>

              <div className="flex items-center gap-[8px]">
                <h2 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("بيانات حساب الإدارة والأمان", "Admin Account Credentials & Security")}
                </h2>
                <KeyRound className="size-[16px] text-[#9c6402] dark:text-[#e29d38]" />
              </div>
            </div>

            <p className="text-[12px] text-[#514537] dark:text-[#cdc5bd] leading-[18px] text-start">
              {t(
                "بيانات الاعتماد المسجلة للمكتب عند إنشائه في المنصة (Step 1 + Step 2)، والمخصصة لصاحب المكتب أو الدخول الإداري.",
                "Provisioned credentials registered during office setup (Step 1 + Step 2), dedicated to the firm owner or administrative login."
              )}
            </p>

            {/* Credential Boxes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
              {/* Admin Email / Username */}
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[14px] flex flex-col gap-2 text-start">
                <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-bold">
                  {t("اسم مستخدم الدخول (البريد الإداري)", "Admin Login Username (Email)")}
                </span>
                <div className="flex items-center justify-between bg-white dark:bg-[#1a120d] border border-[#eae8e4] dark:border-[#422e20] rounded-[6px] px-3 py-2">
                  <span className="font-mono text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] truncate direction-ltr">
                    {email}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(email, t("اسم مستخدم الدخول", "Username"))}
                    className="p-1 hover:bg-[#f0eeea] dark:hover:bg-[#281c15] rounded text-[#837565] hover:text-[#9c6402] transition-colors cursor-pointer"
                    title={t("نسخ البريد", "Copy")}
                  >
                    {copiedField === t("اسم مستخدم الدخول", "Username") ? (
                      <Check className="size-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>
                <span className="text-[10px] text-[#837565] dark:text-[#8e8680]">
                  {t("البريد الأساسي المعتمد للمصادقة", "Certified primary authentication email")}
                </span>
              </div>

              {/* Initial Password Box */}
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[14px] flex flex-col gap-2 text-start">
                <div className="flex items-center justify-between">
                  <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-bold">
                    {t("كلمة المرور الأولية للمكتب", "Initial Registered Password")}
                  </span>
                  <span className="bg-[#e8f5e9] dark:bg-[#132c1c] text-[#1b7340] dark:text-[#6ee7b7] border border-[#c8e6c9] dark:border-emerald-500/40 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {t("مشفرة ومؤمنة", "Encrypted")}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-white dark:bg-[#1a120d] border border-[#eae8e4] dark:border-[#422e20] rounded-[6px] px-3 py-2">
                  <span className="font-mono text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] truncate direction-ltr">
                    {showCredentialsPassword ? password : "••••••••••••"}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowCredentialsPassword(!showCredentialsPassword)}
                      className="p-1 hover:bg-[#f0eeea] dark:hover:bg-[#281c15] rounded text-[#837565] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] transition-colors cursor-pointer"
                      title={showCredentialsPassword ? t("إخفاء", "Hide") : t("إظهار", "Show")}
                    >
                      {showCredentialsPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(password, t("كلمة المرور", "Password"))}
                      className="p-1 hover:bg-[#f0eeea] dark:hover:bg-[#281c15] rounded text-[#837565] hover:text-[#9c6402] transition-colors cursor-pointer"
                      title={t("نسخ كلمة المرور", "Copy Password")}
                    >
                      {copiedField === t("كلمة المرور", "Password") ? (
                        <Check className="size-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <span className="text-[10px] text-[#837565] dark:text-[#8e8680]">
                  {t("المعينة عند تسجيل المنشأة (Postman / AlJudy#Law2025)", "Set during initial provisioning")}
                </span>
              </div>
            </div>

            {/* Quick Enter Action Banner */}
            {onEnterOfficeAsAdmin && (
              <div className="bg-[#faf8f4] dark:bg-[#1a120d] border border-[#eeddbb]/70 dark:border-[#4d3627] rounded-[6px] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-start">
                  <div className="size-8 rounded-[4px] bg-[#9c6402]/10 dark:bg-[#e29d38]/10 text-[#9c6402] dark:text-[#e29d38] flex items-center justify-center shrink-0">
                    <DoorOpen className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {t("تسجيل الدخول المباشر إلى المنظومة", "Direct System Impersonation")}
                    </h4>
                    <p className="text-[10px] text-[#837565] dark:text-[#8e8680]">
                      {t("الدخول الفوري إلى لوحة تحكم المكتب بصلاحيات الإشراف الإداري الكاملة", "Enter firm workspace with full administrative privileges")}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onEnterOfficeAsAdmin}
                  className="bg-[#1b1c1a] hover:bg-[#333] text-white px-3.5 py-1.5 rounded-[4px] text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <DoorOpen className="size-3.5" />
                  <span>{t("دخول المكتب كمدير", "Enter as Admin")}</span>
                </button>
              </div>
            )}
          </div>

          {/* SECTION B: أحدث الفواتير */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col gap-4">
            {/* Header */}
            <div className="border-b border-[#f0eeea] dark:border-[#38271c] pb-[10px] flex items-center justify-between">
              <Link
                href="/invoices"
                className="text-[#9c6402] dark:text-[#e29d38] hover:underline text-[12px] font-semibold flex items-center gap-[4px] cursor-pointer"
              >
                <ChevronLeft className="size-[12px] rtl:rotate-0 rotate-180" />
                <span>{t("عرض كل الفواتير (4)", "View all invoices (4)")}</span>
              </Link>

              <div className="flex items-center gap-[8px]">
                <h2 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("أحدث الفواتير", "Latest Invoices")}
                </h2>
                <div className="w-[6px] h-[16px] bg-[#9c6402] dark:bg-[#e29d38] rounded-full" />
              </div>
            </div>

            {/* Featured Latest Invoice Card */}
            <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[16px] flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
              {/* Right: Invoice metadata */}
              <div className="flex items-start gap-[12px]">
                <div className="bg-white dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 size-[44px] rounded-[4px] shadow-sm flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
                  <Receipt className="size-[20px]" />
                </div>

                <div className="flex flex-col text-start">
                  <div className="flex items-center gap-[8px]">
                    <span className="text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      INV-2024-0891
                    </span>
                    <span className="bg-[#e8f5e9] border border-[#c8e6c9] dark:bg-[#132c1c] dark:border-emerald-500/40 text-[#1b7340] dark:text-[#6ee7b7] text-[10px] font-bold px-[8px] py-[2px] rounded-full flex items-center gap-[4px]">
                      <span className="size-[5px] bg-[#1b7340] dark:bg-[#10b981] rounded-full" />
                      <span>{t("مدفوعة بالكامل", "Fully Paid")}</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-[6px] text-[12px] text-[#514537] dark:text-[#cdc5bd] mt-[4px]">
                    <span>{t("تاريخ الإصدار: 15 أكتوبر 2024", "Issue date: 15 Oct 2024")}</span>
                    <span className="text-[#d6c4b1] dark:text-[#6e5849]">•</span>
                    <span>{t("طريقة السداد: بطاقة مدى (•••• 4012)", "Payment method: Mada (•••• 4012)")}</span>
                  </div>
                </div>
              </div>

              {/* Left: Amount & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-[16px]">
                <div className="flex flex-col text-left">
                  <span className="text-[18px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    750 {t("ر.س", "SAR")}
                  </span>
                  <span className="text-[10px] text-[#837565] dark:text-[#8e8680] font-bold">
                    {t("شامل ضريبة القيمة المضافة 15%", "Inclusive of 15% VAT")}
                  </span>
                </div>

                <div className="flex items-center gap-[6px]">
                  <button
                    type="button"
                    onClick={() => setIsInvoiceModalOpen(true)}
                    className="bg-white dark:bg-[#221812] hover:bg-[#faf9f7] dark:hover:bg-[#281c15] border border-[#eae8e4] dark:border-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] px-[12px] py-[6px] rounded-[4px] text-[12px] font-semibold shadow-sm transition-colors cursor-pointer"
                  >
                    {t("معاينة", "Preview")}
                  </button>
                  <button
                    type="button"
                    aria-label={t("تحميل الفاتورة", "Download Invoice")}
                    onClick={() => {
                      toast.promise(new Promise((resolve) => setTimeout(resolve, 800)), {
                        loading: t("جارٍ تجهيز ملف PDF للفاتورة INV-2024-0891...", "Generating PDF for INV-2024-0891..."),
                        success: t("تم تحميل الفاتورة الضريبية INV-2024-0891 بنجاح!", "Invoice INV-2024-0891 downloaded successfully!"),
                        error: t("فشل تحميل الفاتورة", "Failed to download PDF"),
                      });
                    }}
                    className="bg-[#f0eeea] dark:bg-[#221812] hover:bg-[#eae8e4] dark:hover:bg-[#281c15] border border-transparent dark:border-[#38271c] size-[28px] rounded-[4px] flex items-center justify-center text-[#514537] dark:text-[#cdc5bd] cursor-pointer"
                  >
                    <Download className="size-[13px]" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION C: أحدث تذاكر الدعم الفني */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col gap-4">
            {/* Header */}
            <div className="border-b border-[#f0eeea] dark:border-[#38271c] pb-[10px] flex items-center justify-between">
              <Link
                href="/tickets"
                className="text-[#9c6402] dark:text-[#e29d38] hover:underline text-[12px] font-semibold flex items-center gap-[4px] cursor-pointer"
              >
                <ChevronLeft className="size-[12px] rtl:rotate-0 rotate-180" />
                <span>{t("عرض كل التذاكر (2)", "View all tickets (2)")}</span>
              </Link>

              <div className="flex items-center gap-[8px]">
                <h2 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  أحدث تذاكر الدعم الفني
                </h2>
                <div className="w-[6px] h-[16px] bg-[#9c6402] dark:bg-[#e29d38] rounded-full" />
              </div>
            </div>

            {/* Featured Ticket Card */}
            <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[16px] flex flex-col gap-[10px]">
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center gap-[8px] cursor-pointer group"
                  onClick={() => setIsTicketModalOpen(true)}
                >
                  <span className="bg-[#f0eeea] dark:bg-[#38271c] text-[#837565] dark:text-[#cdc5bd] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px]">
                    #TK-8422
                  </span>
                  <h3 className="text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] group-hover:text-[#9c6402] dark:group-hover:text-[#e29d38] transition-colors">
                    {t("طلب زيادة سعة المستندات", "Request to increase document capacity")}
                  </h3>
                </div>

                <span className="bg-[#fffbeb] border border-amber-200 dark:bg-[#2e1d0f] dark:border-amber-500/40 text-[#b45309] dark:text-[#fbbf24] text-[10px] font-bold px-[8px] py-[2px] rounded-full flex items-center gap-[4px]">
                  <span className="size-[5px] bg-[#b45309] dark:bg-[#f59e0b] rounded-full" />
                  <span>{t("قيد المعالجة", "In Progress")}</span>
                </span>
              </div>

              <p className="text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[18px] text-start">
                يرغب المكتب بتمكين خيار السحب التلقائي للضبوط والمذكرات القضائية عبر الربط المباشر مع API ناجز، بالإضافة لرفع المساحة لـ 200 GB.
              </p>

              <div className="border-t border-[#f0eeea] dark:border-[#38271c] pt-[8px] flex flex-col sm:flex-row sm:items-center justify-between gap-[8px] text-[12px] text-[#837565] dark:text-[#8e8680]">
                <div className="flex flex-wrap items-center gap-[8px]">
                  <div className="flex items-center gap-[4px]">
                    <span>المسؤول:</span>
                    <strong className="text-[#837565] dark:text-[#cdc5bd] font-bold">م. عبد العزيز فهد</strong>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-[4px]">
                    <span>الأولوية:</span>
                    <strong className="text-[#837565] dark:text-[#cdc5bd] font-bold">متوسطة</strong>
                  </div>
                  <span>•</span>
                  <span>منذ يومين (22 أكتوبر 2024)</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(true)}
                  className="text-[#9c6402] dark:text-[#e29d38] hover:underline text-[12px] font-semibold flex items-center gap-[2px] cursor-pointer self-start sm:self-auto"
                >
                  <span>{t("عرض تفاصيل التذكرة", "View Ticket Details")}</span>
                  <ChevronLeft className="size-[12px] rtl:rotate-0 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* LEFT COLUMN (40% - 5 COLS IN RTL) */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* SECTION D: تفاصيل الاشتراك الساري */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col gap-4">
            {/* Header */}
            <div className="border-b border-[#f0eeea] dark:border-[#38271c] pb-[10px] flex items-center justify-between">
              <span className="bg-[#e8f5e9] border border-[#c8e6c9] dark:bg-[#132c1c] dark:border-emerald-500/40 text-[#1b7340] dark:text-[#6ee7b7] text-[10px] font-bold px-[8px] py-[2px] rounded-full">
                نشط
              </span>

              <div className="flex items-center gap-[8px]">
                <h2 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  تفاصيل الاشتراك الساري
                </h2>
                <Sparkles className="size-[16px] text-[#9c6402] dark:text-[#e29d38]" />
              </div>
            </div>

            {/* Subscription Plan Meta Card */}
            <div className="bg-gradient-to-br from-[#1c140f] to-[#2e221b] dark:from-[#150e0a] dark:to-[#241710] border border-transparent dark:border-[#38271c] text-white rounded-[6px] p-[18px] flex flex-col gap-[14px] shadow-sm relative">
              <div className="flex items-start justify-between">
                <span className="bg-[#7b4e00]/40 text-[#ffddb6] border border-[#ffddb6]/30 text-[10px] font-semibold px-[10px] py-[3px] rounded-full">
                  {billingCycle.includes("شهر")
                    ? t("دورة شهرية", "Monthly Billing")
                    : t("خصم سنوي 15% • دورة سنوية", "Annual 15% Off")}
                </span>

                <div className="flex flex-col text-start">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-white/10 text-[#ffddb6] text-[9px] font-bold px-1.5 py-0.5 rounded">
                      {planType === "trial" || currentPlan.includes("تجرب")
                        ? t("تجربة مجانية", "Free Trial")
                        : t("باقة مدفوعة", "Paid Plan")}
                    </span>
                    <span className="text-[#ffddb6] dark:text-[#f3c27e] text-[10px] font-bold tracking-[0.5px] uppercase">
                      {t("الخطة المعتمدة", "Approved Plan")}
                    </span>
                  </div>
                  <h3 className="text-[22px] font-bold leading-[28px] mt-[2px] text-white dark:text-[#fdfbf7]">
                    {currentPlan}
                  </h3>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-[6px] text-start">
                <span className="text-[32px] font-bold leading-[34px] text-white dark:text-[#fdfbf7]">
                  {currentPlan.includes("التميز")
                    ? "2,222"
                    : currentPlan.includes("أساسية")
                    ? "199"
                    : currentPlan.includes("فضية")
                    ? "399"
                    : currentPlan.includes("شركات")
                    ? "1,450"
                    : currentPlan.includes("مخصصة")
                    ? "2,200"
                    : "750"}
                </span>
                <span className="text-[#cdc5bd] text-[13px]">
                  ر.س / شهرياً (تدفع سنوياً)
                </span>
              </div>

              {/* Renewal dates */}
              <div className="border-t border-white/10 pt-[8px] grid grid-cols-2 gap-[8px] text-[10px]">
                <div className="flex flex-col text-start">
                  <span className="text-[#cdc5bd]">{t("موعد التجديد:", "Renewal Date:")}</span>
                  <span className="text-[#ffddb6] dark:text-[#f3c27e] font-bold text-[11px] mt-[1px]">
                    {subscriptionEnd ? formatArabicDate(subscriptionEnd) : "—"}
                  </span>
                </div>
                <div className="flex flex-col text-start">
                  <span className="text-[#cdc5bd]">{t("تاريخ البدء:", "Start Date:")}</span>
                  <span className="text-white font-bold text-[11px] mt-[1px]">
                    {subscriptionStart ? formatArabicDate(subscriptionStart) : registrationDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Auto-renew & Najiz Live Sync Status */}
            <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[10px] flex items-center justify-between">
              <span className={`border text-[10px] font-bold px-[8px] py-[2px] rounded-full ${
                autoRenew
                  ? "bg-[#d1fae5] border-emerald-200 dark:bg-[#132c1c] dark:border-emerald-500/40 text-[#065f46] dark:text-[#6ee7b7]"
                  : "bg-[#fef2f2] border-rose-200 dark:bg-[#341616] dark:border-rose-500/40 text-[#dc2626] dark:text-[#f87171]"
              }`}>
                {autoRenew ? t("مفعّل (Auto-renew ON)", "Enabled (Auto-renew ON)") : t("معطّل", "Disabled")}
              </span>

              <div className="flex items-center gap-[6px] text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                <CheckCircle2 className="size-[14px] text-[#065f46] dark:text-[#10b981]" />
                <span>{t("التجديد التلقائي عبر البطاقة:", "Auto-renewal via card:")}</span>
              </div>
            </div>

            {/* Resource Consumption Progress Rings / Bars */}
            <div className="flex flex-col gap-[10px] pt-[4px]">
              <h4 className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] text-start">
                {t("استهلاك موارد المنشأة الحالية", "Current Resource Usage")}
              </h4>

              {/* Active Users Bar */}
              <div className="flex flex-col gap-[4px]">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[#1b1c1a] dark:text-[#fdfbf7]">{lawyersPercent}%</span>
                  <span className="text-[#514537] dark:text-[#cdc5bd]">
                    {t(`مقاعد المحامين (${lawyersUsed} من ${lawyersLimit} مستخدم)`, `Lawyers (${lawyersUsed} of ${lawyersLimit})`)}
                  </span>
                </div>
                <div className="w-full bg-[#f0eeea] dark:bg-[#38271c] h-[7px] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#9c6402] dark:bg-[#e29d38] rounded-full transition-all"
                    style={{ width: `${Math.min(100, lawyersPercent)}%` }}
                  />
                </div>
              </div>

              {/* Storage Bar */}
              <div className="flex flex-col gap-[4px]">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[#1b1c1a] dark:text-[#fdfbf7]">{storagePercent}%</span>
                  <span className="text-[#514537] dark:text-[#cdc5bd]">
                    {t(`التخزين السحابي (${storageUsedGb} GB من ${storageLimitGb} GB)`, `Cloud Storage (${storageUsedGb} of ${storageLimitGb} GB)`)}
                  </span>
                </div>
                <div className="w-full bg-[#f0eeea] dark:bg-[#38271c] h-[7px] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#9c6402] dark:bg-[#e29d38] rounded-full transition-all"
                    style={{ width: `${Math.min(100, storagePercent)}%` }}
                  />
                </div>
              </div>

              {/* Active Court Cases */}
              <div className="flex flex-col gap-[4px]">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t(`${activeCases} قضية مفتوحة`, `${activeCases} Open Cases`)}
                  </span>
                  <span className="text-[#514537] dark:text-[#cdc5bd]">
                    {t("القضايا والجلسات النشطة بالنظام", "Active cases & sessions in system")}
                  </span>
                </div>
                <div className="w-full bg-[#f0eeea] dark:bg-[#38271c] h-[7px] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#059669] dark:bg-[#10b981] rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.max(10, Math.round((activeCases / 350) * 100)))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Upgrade Plan Button */}
            <button
              type="button"
              onClick={() => setIsUpgradeModalOpen(true)}
              className="w-full bg-[#f0eeea] dark:bg-[#281c15] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] border border-transparent dark:border-[#38271c] py-[8px] rounded-[4px] text-[12px] font-semibold transition-colors cursor-pointer mt-[4px] flex items-center justify-center gap-1.5"
            >
              <Sparkles className="size-3.5 text-[#9c6402] dark:text-[#e29d38]" />
              <span>{t("ترقية الباقة", "Upgrade Plan")}</span>
            </button>
          </div>

          {/* SECTION E: ملاحظات وسجل نشاط الفريق */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col gap-4">
            {/* Header */}
            <div className="border-b border-[#f0eeea] dark:border-[#38271c] pb-[10px] flex items-center justify-between">
              <span className="bg-[#f0eeea] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] text-[10px] font-bold px-[8px] py-[2px] rounded-full">
                خاص بالإدارة
              </span>

              <div className="flex items-center gap-[8px]">
                <h2 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  ملاحظات وسجل نشاط الفريق
                </h2>
                <PenSquare className="size-[15px] text-[#9c6402] dark:text-[#e29d38]" />
              </div>
            </div>

            {/* Quick Internal Note Box */}
            <div className="flex flex-col gap-[8px]">
              <textarea
                rows={3}
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="أضف ملاحظة إدارية داخلية خاصة بفريق الجودي..."
                className="w-full bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] focus:border-[#9c6402] dark:focus:border-[#e29d38] rounded-[4px] p-[12px] text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#8e8680] focus:outline-none resize-none"
              />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleAddNote}
                  disabled={isSubmittingNote}
                  className="bg-[#9c6402] dark:bg-[#e29d38] hover:bg-[#855402] text-white dark:text-[#1c140f] font-bold px-[12px] py-[6px] rounded-[4px] text-[10px] transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSubmittingNote ? t("جارٍ الحفظ...", "Saving...") : t("إضافة ملاحظة", "Add Note")}
                </button>

                <div className="flex items-center gap-[4px] text-[10px] text-[#837565] dark:text-[#8e8680] font-bold">
                  <Eye className="size-[12px]" />
                  <span>{t("مرئية لمشرفي النظام فقط", "Visible to system admins only")}</span>
                </div>
              </div>
            </div>

            {/* Activity & Notes Timeline */}
            <div className="flex flex-col gap-[8px] pt-[4px]">
              {notes.length === 0 ? (
                <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[14px] text-center text-[#837565] dark:text-[#8e8680] text-[12px]">
                  {t(
                    "لا توجد ملاحظات إدارية مضافة بعد. يمكنك إضافة أول ملاحظة أعلاه.",
                    "No internal notes recorded yet. You can add the first note above."
                  )}
                </div>
              ) : (
                notes.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[10px] flex items-start gap-[10px]"
                  >
                    <div className="size-[32px] rounded-full bg-[#ffddb6] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 text-[#7b4e00] dark:text-[#f3c27e] font-bold text-[12px] flex items-center justify-center shrink-0">
                      {item.authorName.trim().charAt(0) || "م"}
                    </div>

                    <div className="flex-1 flex flex-col gap-[2px] text-start">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#837565] dark:text-[#8e8680]">
                          {formatNoteDate(item.createdAt)}
                        </span>
                        <div className="flex items-center gap-[4px]">
                          <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {item.authorName}
                          </span>
                          <span className="text-[#837565] dark:text-[#8e8680] font-normal">
                            ({item.authorRole})
                          </span>
                        </div>
                      </div>
                      <p className="text-[12px] text-[#514537] dark:text-[#cdc5bd] leading-[18px]">
                        {item.note}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Upgrade Plan Modal */}
      <UpgradeClientOfficePlanModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        office={office ? { ...office, plan: currentPlan } : null}
        onConfirmUpgrade={(officeId, newPlanName) => {
          setCurrentPlan(newPlanName);
          if (office && onUpgradePlan) {
            onUpgradePlan(office, newPlanName);
          }
        }}
      />

      {/* Full Certified Tax Invoice Details Modal */}
      <InvoiceDetailsModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        invoice={latestInvoice}
      />

      {/* Support Ticket Quick View Modal / Pop-up */}
      <TicketQuickViewModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        ticket={latestTicket}
      />
    </div>
  );
}
