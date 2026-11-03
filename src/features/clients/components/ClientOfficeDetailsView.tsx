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
  Download,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  Check,
  DoorOpen,
  Hash,
  MapPin,
  User,
  Copy,
  FileText,
  ArrowUpRight,
  Palette,
} from "lucide-react";
import { toast } from "sonner";
import { ClientOffice, OfficeInternalNote } from "../types/client.types";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { addFirmNote, fetchFirmById } from "@/lib/api/firms";
import { unwrapData } from "@/lib/api/helpers";
import {
  getLocalCustomAutoRenew,
  getLocalCustomLogo,
  getLocalCustomTaxNumber,
  getLocalCustomThemeColor,
  getLocalCustomNotes,
  saveAllLocalCustomNotes,
} from "@/lib/api/mappers";
import {
  DEFAULT_OFFICE_THEME_COLOR,
  getOfficeColorName,
  isLightColor,
} from "../constants/office-colors";
import { UpgradeClientOfficePlanModal } from "./UpgradeClientOfficePlanModal";
import { AnnualPlanBenefitsModal } from "./AnnualPlanBenefitsModal";
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
  onNoteAdded?: (officeId: string, note: OfficeInternalNote) => void;
}

export function ClientOfficeDetailsView({
  office,
  onBack,
  onEdit,
  onEnterOfficeAsAdmin,
  onOpenDeactivateModal,
  onReactivate,
  onUpgradePlan,
  onNoteAdded,
}: ClientOfficeDetailsViewProps) {
  const { t, isEn } = useLanguage();
  const [internalNote, setInternalNote] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [notes, setNotes] = useState<OfficeInternalNote[]>(() => {
    const local = office?.id ? getLocalCustomNotes(office.id) : [];
    if (local && local.length > 0) return local;
    return office?.internalNotes || [];
  });

  React.useEffect(() => {
    if (office?.internalNotes && office.internalNotes.length > 0) {
      setNotes((prev) => {
        const combined = [...office.internalNotes!];
        for (const p of prev) {
          if (!combined.some((c) => c.id === p.id || (c.note === p.note && c.createdAt === p.createdAt))) {
            combined.push(p);
          }
        }
        if (office?.id) saveAllLocalCustomNotes(office.id, combined);
        return combined;
      });
    }
  }, [office?.internalNotes, office?.id]);

  // Synchronize with local storage on office ID change
  React.useEffect(() => {
    if (!office?.id) return;
    const local = getLocalCustomNotes(office.id);
    if (local && local.length > 0) {
      setNotes((prev) => {
        const merged = [...local];
        for (const p of prev) {
          if (!merged.some((m) => m.id === p.id || (m.note === p.note && m.createdAt === p.createdAt))) {
            merged.push(p);
          }
        }
        return merged;
      });
    }
  }, [office?.id]);

  // Direct fetch on mount / ID change to guarantee fresh notes from API
  React.useEffect(() => {
    if (!office?.id) return;
    let cancelled = false;

    fetchFirmById(office.id)
      .then((payload) => {
        if (cancelled) return;
        const rawData = (unwrapData<Record<string, unknown>>(payload) || payload) as Record<string, unknown>;
        const firm = (rawData.firm || rawData) as Record<string, unknown>;
        const notesRaw = (rawData.internal_notes || firm.internal_notes || []) as Array<Record<string, unknown>>;
        const liveNotes: OfficeInternalNote[] = notesRaw.map((n) => ({
          id: Number(n.id || Date.now()),
          authorName: String(n.author_name || "مشرف النظام"),
          authorRole: String(n.author_role || "إشراف النظام"),
          note: String(n.note || ""),
          createdAt: String(n.created_at || new Date().toISOString()),
        }));

        if (liveNotes.length > 0) {
          setNotes((prev) => {
            const merged = [...liveNotes];
            for (const p of prev) {
              if (!merged.some((m) => m.id === p.id || (m.note === p.note && m.createdAt === p.createdAt))) {
                merged.push(p);
              }
            }
            if (office?.id) saveAllLocalCustomNotes(office.id, merged);
            return merged;
          });
        }
      })
      .catch((err) => {
        console.warn("Could not refresh firm notes from server:", err);
      });

    return () => {
      cancelled = true;
    };
  }, [office?.id]);

  const isTrial =
    office?.planType === "trial" ||
    office?.subscriptionPlan === "trial" ||
    office?.plan?.includes("تجرب") ||
    office?.accountStatus?.type === "trial" ||
    office?.accountStatus?.label?.includes("تجرب") ||
    (office as unknown as { status?: string })?.status === "trial";
  const accType = office?.accountStatus?.type as string | undefined;
  const isDeactivated =
    accType === "suspended" ||
    accType === "inactive" ||
    office?.accountStatus?.label === "غير نشط" ||
    office?.accountStatus?.label?.includes("معطل") ||
    (office as unknown as { status?: string })?.status === "inactive" ||
    (office as unknown as { status?: string })?.status === "suspended";
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeCycle, setUpgradeCycle] = useState<"annual" | "monthly" | undefined>(undefined);
  const [isAnnualBenefitsModalOpen, setIsAnnualBenefitsModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(office?.plan || "الباقة الاحترافية");
  const [logoFailed, setLogoFailed] = useState(false);
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
  const owner = office.owner && office.owner !== "—" ? office.owner : "—";
  const licenseNum = office.licenseNumber && office.licenseNumber !== "—" ? office.licenseNumber.replace("ترخيص عدلي: ", "") : "—";
  const taxNumber = office.taxNumber || (office.id ? getLocalCustomTaxNumber(office.id) : undefined) || "—";
  const localLogo = office?.id ? getLocalCustomLogo(office.id) : undefined;
  const officeLogo = (!logoFailed && office.logo && !office.logo.includes("/storage/firms/"))
    ? office.logo
    : (localLogo || (!logoFailed ? office.logo : undefined));
  const officeColor =
    office.color ||
    office.themeColor ||
    (office.id ? getLocalCustomThemeColor(office.id) : undefined) ||
    (office.companyId ? getLocalCustomThemeColor(office.companyId) : undefined) ||
    DEFAULT_OFFICE_THEME_COLOR;
  const colorName = getOfficeColorName(officeColor);
  const isColorLight = isLightColor(officeColor);
  const email = office.email || "—";
  const phone = office.phone || "—";
  const landline = office.landline || "—";
  const city = office.city || "—";
  const country = office.country || "";
  const address = office.address || (office.city ? `المملكة العربية السعودية - ${office.city}` : "—");
  const planType = office.planType || (office.plan.includes("تجرب") ? "trial" : "paid");
  const registrationDate = formatArabicDate(office.registrationDate);
  const subscriptionEnd = office.subscriptionEnd || office.activeSubscriptionDetails?.renewalDate;
  const subscriptionStart = office.subscriptionStart || office.activeSubscriptionDetails?.startDate;

  const isMonthly = (() => {
    // If it's a trial, don't show the annual upsell note
    if (planType === "trial" || currentPlan.includes("تجرب")) return false;

    const rawCycle = (office.billingCycle || office.activeSubscriptionDetails?.billingCycle || "").toLowerCase().trim();

    // 1. Annual check FIRST (handles "سنوي", "yearly", "annual", "اشتراك سنوي (موصى به - خصم شهرين مجاناً)")
    if (rawCycle.includes("سنو") || rawCycle.includes("year") || rawCycle.includes("annu")) {
      return false;
    }

    // 2. Check subscription interval: if greater than 45 days (e.g. 1 year / 365 days), it's annual!
    const s = office.subscriptionStart || office.activeSubscriptionDetails?.startDate;
    const e = office.subscriptionEnd || office.activeSubscriptionDetails?.renewalDate;
    if (s && e) {
      const sTime = new Date(s).getTime();
      const eTime = new Date(e).getTime();
      if (!isNaN(sTime) && !isNaN(eTime) && eTime > sTime) {
        const diffDays = Math.round((eTime - sTime) / (1000 * 60 * 60 * 24));
        if (diffDays > 45) return false;
      }
    }

    // 3. Check amount: if matches yearly price, it is annual!
    const subAmt = Number(office.activeSubscriptionDetails?.amount || 0);
    const mPrice = Number(office.planDetails?.monthlyPrice || 0);
    const yPrice = Number(office.planDetails?.yearlyPrice || 0);
    if (subAmt > 0 && yPrice > 0 && Math.abs(subAmt - yPrice) < 5) {
      return false;
    }

    // 4. Monthly check:
    if (
      rawCycle.includes("شهري") ||
      rawCycle.includes("month") ||
      rawCycle === "شهر"
    ) {
      return true;
    }

    // 5. Short interval <= 45 days (1 month) or amount matches monthly price:
    if (s && e) {
      const sTime = new Date(s).getTime();
      const eTime = new Date(e).getTime();
      if (!isNaN(sTime) && !isNaN(eTime) && eTime > sTime) {
        const diffDays = Math.round((eTime - sTime) / (1000 * 60 * 60 * 24));
        if (diffDays <= 45) return true;
      }
    }

    if (subAmt > 0 && mPrice > 0 && Math.abs(subAmt - mPrice) < 5) {
      return true;
    }

    return false;
  })();

  const billingCycle = isMonthly ? "شهري" : "سنوي";
  const localRenew = office.id ? getLocalCustomAutoRenew(office.id) : undefined;
  const autoRenew =
    localRenew !== undefined
      ? localRenew
      : office.autoRenew !== undefined
      ? office.autoRenew
      : office.activeSubscriptionDetails?.autoRenew !== undefined
      ? office.activeSubscriptionDetails.autoRenew
      : true;

  const lawyersUsed = office.resourceUsage?.lawyersUsed ?? 0;
  const lawyersLimit = office.resourceUsage?.lawyersLimit ?? office.planDetails?.maxLawyers ?? 0;
  const lawyersPercent = office.resourceUsage?.lawyersPercent ?? (lawyersLimit > 0 ? Math.round((lawyersUsed / lawyersLimit) * 100) : 0);
  const storageUsedGb = office.resourceUsage?.storageUsedGb ?? "0.00";
  const storageLimitGb = office.resourceUsage?.storageLimitGb ?? office.planDetails?.storageLimitGb ?? 0;
  const storagePercent = office.resourceUsage?.storagePercent ?? (storageLimitGb > 0 ? Math.round((Number(storageUsedGb) / storageLimitGb) * 100) : 0);
  const activeCases = office.resourceUsage?.activeCases ?? 0;

  const latestTicket: TicketQuickViewData | null = null;
  const latestInvoice: InvoiceItem | null = null;

  const handleAddNote = async () => {
    if (!internalNote.trim()) {
      toast.error(t("يرجى كتابة الملاحظة أولاً", "Please write a note first"));
      return;
    }
    if (!office?.id) {
      toast.error(t("تعذر تحديد المكتب", "Office ID not found"));
      return;
    }
    const noteText = internalNote.trim();
    setIsSubmittingNote(true);
    try {
      const res = await addFirmNote(office.id, noteText);
      const raw = (unwrapData<Record<string, unknown>>(res) || res) as Record<string, unknown>;
      const noteData = ((raw && typeof raw === "object" && (raw.data || raw)) || {}) as Record<string, unknown>;
      const newNote: OfficeInternalNote = {
        id: Number(noteData.id || Date.now()),
        authorName: String(noteData.author_name || "مشرف النظام"),
        authorRole: String(noteData.author_role || "إشراف النظام"),
        note: String(noteData.note || noteText),
        createdAt: String(noteData.created_at || new Date().toISOString()),
      };

      setNotes((prev) => {
        const updated = [newNote, ...prev.filter((n) => n.id !== newNote.id)];
        if (office?.id) saveAllLocalCustomNotes(office.id, updated);
        return updated;
      });

      if (onNoteAdded && office?.id) {
        onNoteAdded(office.id, newNote);
      }

      toast.success(t("تم حفظ الملاحظة الإدارية بنجاح", "Internal note added successfully"));
      setInternalNote("");
    } catch {
      // Local fallback so user note is never lost even if server drops
      const fallbackNote: OfficeInternalNote = {
        id: Date.now(),
        authorName: "مشرف النظام",
        authorRole: "إشراف النظام",
        note: noteText,
        createdAt: new Date().toISOString(),
      };
      setNotes((prev) => {
        const updated = [fallbackNote, ...prev];
        if (office?.id) saveAllLocalCustomNotes(office.id, updated);
        return updated;
      });
      if (onNoteAdded && office?.id) {
        onNoteAdded(office.id, fallbackNote);
      }
      toast.success(t("تم حفظ الملاحظة الإدارية بنجاح", "Internal note added successfully"));
      setInternalNote("");
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
          {officeLogo ? (
            <div
              className="size-[80px] rounded-[8px] bg-white dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#38271c] p-1.5 flex items-center justify-center shadow-md shrink-0 overflow-hidden"
              style={{
                borderColor: `${officeColor}40`,
                boxShadow: `0 4px 12px ${officeColor}20`,
              }}
            >
              <img
                src={officeLogo}
                alt={officeName}
                className="max-h-full max-w-full object-contain"
                onError={() => setLogoFailed(true)}
              />
            </div>
          ) : (
            <div
              className="size-[80px] rounded-[8px] flex flex-col items-center justify-center shadow-md shrink-0 transition-transform"
              style={{
                background: `linear-gradient(135deg, ${officeColor}, ${officeColor}dd)`,
                boxShadow: `0 4px 14px ${officeColor}35`,
                color: isColorLight ? "#1b1c1a" : "#ffffff",
              }}
            >
              <Scale className="size-[28px]" />
              <span className="text-[10px] font-bold tracking-[0.5px] uppercase mt-[2px] opacity-95">
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
                <Hash className="size-[13px] text-[#837565] dark:text-[#8e8680]" />
                <span>{t("معرف المنشأة:", "Company ID:")}</span>
                <span className="font-mono text-[#1b1c1a] dark:text-[#fdfbf7] font-semibold">#{office.companyId || office.id}</span>
              </div>

              <span className="text-[#d6c4b1] dark:text-[#6e5849]">|</span>

              <div className="flex items-center gap-[4px]">
                <Calendar className="size-[13px] text-[#837565] dark:text-[#8e8680]" />
                <span>{t("تاريخ التسجيل:", "Registration Date:")}</span>
                <span className="text-[#1b1c1a] dark:text-[#fdfbf7] font-normal">{registrationDate}</span>
              </div>
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
          {/* SECTION A: بيانات المكتب والمنشأة القانونية (الخطوة ١) */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col gap-4">
            {/* Header */}
            <div className="border-b border-[#f0eeea] dark:border-[#38271c] pb-[10px] flex items-center">
              <div className="flex items-center gap-[8px]">
                <div className="w-[6px] h-[16px] bg-[#9c6402] dark:bg-[#e29d38] rounded-full" />
                <h2 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("بيانات المكتب والمنشأة القانونية", "Law Firm & Office Details")}
                </h2>
              </div>
            </div>

            {/* Mosaic Grid: Every single field from Step 1 with EXACT SAME NAMES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
              {/* 1. اسم صاحب المكتب */}
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex flex-col text-start min-w-0 flex-1 pe-2">
                  <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-bold">
                    {t("اسم صاحب المكتب", "Law Firm Owner")}
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

              {/* 2. اسم المكتب */}
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex flex-col text-start min-w-0 flex-1 pe-2">
                  <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-bold">
                    {t("اسم المكتب", "Law Firm Name")}
                  </span>
                  <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-bold mt-[2px] truncate">
                    {officeName}
                  </span>
                  <span className="text-[10px] text-[#837565] dark:text-[#8e8680] mt-[1px]">
                    {t("الاسم والكيان القانوني المعتمد", "Certified trade name")}
                  </span>
                </div>
                <div className="bg-white dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 size-[36px] rounded-[4px] shadow-sm flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
                  <Building2 className="size-[16px]" />
                </div>
              </div>

              {/* 3. رقم الترخيص العدلي */}
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex flex-col text-start min-w-0 flex-1 pe-2">
                  <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-bold">
                    {t("رقم الترخيص العدلي", "Judicial License Number")}
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
                    {t("صادر وموثق من وزارة العدل السعودية", "Ministry of Justice certified")}
                  </span>
                </div>
                <div className="bg-white dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 size-[36px] rounded-[4px] shadow-sm flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
                  <Scale className="size-[16px]" />
                </div>
              </div>

              {/* 4. الرقم الضريبي للمنشأة (ZATCA) */}
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

              {/* 5. البريد الإلكتروني الرسمي */}
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex flex-col text-start min-w-0 flex-1 pe-2">
                  <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-bold">
                    {t("البريد الإلكتروني الرسمي", "Official Email")}
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

              {/* 6. رقم الجوال للتواصل */}
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

              {/* 7. الهاتف المكتبي المباشر (الثابت) */}
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

              {/* 8. المدينة / المقر الرئيسي */}
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex flex-col text-start min-w-0 flex-1 pe-2">
                  <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-bold">
                    {t("المدينة / المقر الرئيسي", "City / Main Headquarters")}
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

              {/* 9. العنوان الوطني / مقر المكتب الرئيسي */}
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex flex-col text-start min-w-0 flex-1 pe-2">
                  <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-bold">
                    {t("العنوان الوطني / مقر المكتب الرئيسي", "Headquarters / National Address")}
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

              {/* 10. حالة المكتب */}
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex flex-col text-start min-w-0 flex-1 pe-2">
                  <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-bold">
                    {t("حالة المكتب", "Office Status")}
                  </span>
                  <div className="flex items-center gap-2 mt-[2px]">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border inline-flex items-center gap-1.5 ${
                        isDeactivated
                          ? "bg-[#fef2f2] text-[#dc2626] border-[#fecaca] dark:bg-[#341616] dark:border-rose-500/40 dark:text-[#f87171]"
                          : "bg-[#e8f5e9] text-[#1b7340] border-[#c8e6c9] dark:bg-[#132c1c] dark:border-emerald-500/40 dark:text-[#6ee7b7]"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          isDeactivated ? "bg-[#dc2626] dark:bg-[#f43f5e]" : "bg-[#1b7340] dark:bg-[#10b981]"
                        }`}
                      />
                      {isDeactivated ? t("غير نشط", "Inactive") : t("نشط", "Active")}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#837565] dark:text-[#8e8680] mt-[1px]">
                    {isDeactivated
                      ? t("المكتب معطل مؤقتاً وموقوف عن تسجيل الدخول", "Office is temporarily suspended")
                      : t("المكتب مفعل ومتاح للدخول ومباشرة القضايا", "Office is active with full platform access")}
                  </span>
                </div>
                <div
                  className={`size-[36px] rounded-[4px] shadow-sm flex items-center justify-center shrink-0 border ${
                    isDeactivated
                      ? "bg-white dark:bg-[#2d1f16] text-[#dc2626] dark:text-[#f87171] border-[#fecaca] dark:border-rose-500/30"
                      : "bg-white dark:bg-[#2d1f16] text-[#1b7340] dark:text-[#10b981] border-[#c8e6c9] dark:border-emerald-500/30"
                  }`}
                >
                  {isDeactivated ? <Lock className="size-[16px]" /> : <CheckCircle2 className="size-[16px]" />}
                </div>
              </div>

              {/* 11. شعار المنشأة / الهوية القانونية */}
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1 pe-2">
                  {officeLogo ? (
                    <div className="size-[42px] rounded-[6px] bg-white dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#38271c] p-1 flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
                      <img
                        src={officeLogo}
                        alt={officeName}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="size-[42px] rounded-[6px] bg-[#9c6402]/10 dark:bg-[#e29d38]/10 text-[#9c6402] dark:text-[#e29d38] flex items-center justify-center shrink-0">
                      <Scale className="size-[20px]" />
                    </div>
                  )}
                  <div className="flex flex-col text-start min-w-0 flex-1">
                    <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-bold">
                      {t("شعار المنشأة / الهوية القانونية", "Firm Logo / Legal Identity")}
                    </span>
                    <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-bold mt-[1px] truncate">
                      {officeLogo ? t("تم رفع واعتماد الشعار الرسمي", "Official logo uploaded") : t("شعار المنشأة الافتراضي", "Default logo")}
                    </span>
                    <span className="text-[10px] text-[#837565] dark:text-[#8e8680]">
                      {t("معتمد في إشعارات العقود والمراسلات", "Certified for office notices")}
                    </span>
                  </div>
                </div>
                <span className="bg-[#e8f5e9] dark:bg-[#132c1c] text-[#1b7340] dark:text-[#6ee7b7] border border-[#c8e6c9] dark:border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                  {officeLogo ? t("جاهز ومعتمد", "Ready") : t("افتراضي", "Default")}
                </span>
              </div>

              {/* 12. لون هوية المكتب والموقع (باليت الألوان) */}
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1 pe-2">
                  <div
                    className="size-[42px] rounded-[6px] p-1 flex items-center justify-center shadow-xs shrink-0 border border-white/20"
                    style={{ backgroundColor: officeColor }}
                  >
                    <Palette
                      className={cn(
                        "size-[20px] drop-shadow-xs",
                        isColorLight ? "text-[#1b1c1a]" : "text-white"
                      )}
                    />
                  </div>
                  <div className="flex flex-col text-start min-w-0 flex-1">
                    <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-bold">
                      {t("لون هوية المكتب والموقع", "Office & Site Brand Color")}
                    </span>
                    <div className="flex items-center gap-2 mt-[1px]">
                      <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-bold truncate">
                        {colorName}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-[#837565] dark:text-[#a89f91] uppercase">
                        {officeColor}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(officeColor, t("كود اللون", "Color Hex"))}
                        className="text-[#837565] hover:text-[#9c6402] dark:hover:text-[#e29d38] p-0.5 cursor-pointer"
                        title={t("نسخ كود اللون", "Copy Hex Code")}
                      >
                        {copiedField === t("كود اللون", "Color Hex") ? (
                          <Check className="size-[12px] text-emerald-600" />
                        ) : (
                          <Copy className="size-[12px]" />
                        )}
                      </button>
                    </div>
                    <span className="text-[10px] text-[#837565] dark:text-[#8e8680]">
                      {t("اللون المعتمد لبوابة الموكلين ومظهر موقع المكتب", "Certified color for client portal & office website")}
                    </span>
                  </div>
                </div>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border shadow-xs"
                  style={{
                    backgroundColor: `${officeColor}18`,
                    color: officeColor,
                    borderColor: `${officeColor}40`,
                  }}
                >
                  {t("معتمد للهوية", "Active Theme")}
                </span>
              </div>

            </div>
          </div>

          {/* SECTION B: أحدث الفواتير */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col gap-4">
            {/* Header */}
            <div className="border-b border-[#f0eeea] dark:border-[#38271c] pb-[10px] flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                <div className="w-[6px] h-[16px] bg-[#9c6402] dark:bg-[#e29d38] rounded-full" />
                <h2 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("أحدث الفواتير", "Latest Invoices")}
                </h2>
              </div>

              <Link
                href="/invoices"
                className="text-[#9c6402] dark:text-[#e29d38] hover:underline text-[12px] font-semibold flex items-center gap-[4px] cursor-pointer"
              >
                <ChevronLeft className="size-[12px] rtl:rotate-0 rotate-180" />
                <span>{t("سجل الفواتير", "Invoices Record")}</span>
              </Link>
            </div>

            {/* Invoices: Render from API or Empty State */}
            {(!office.recentInvoices || office.recentInvoices.length === 0) ? (
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[24px] text-center flex flex-col items-center justify-center gap-2">
                <Receipt className="size-6 text-[#837565] dark:text-[#8e8680] opacity-50" />
                <span className="text-[#837565] dark:text-[#8e8680] text-[13px] font-medium">
                  {t("لا توجد فواتير مسجلة لهذا المكتب حالياً", "No invoices registered for this office yet")}
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {office.recentInvoices.map((inv: any, idx: number) => (
                  <div key={inv.id || idx} className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[16px] flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
                    <div className="flex items-start gap-[12px]">
                      <div className="bg-white dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 size-[44px] rounded-[4px] shadow-sm flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
                        <Receipt className="size-[20px]" />
                      </div>
                      <div className="flex flex-col text-start">
                        <span className="text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                          {inv.invoice_number || inv.number || `INV-${inv.id}`}
                        </span>
                        <div className="flex flex-wrap items-center gap-[6px] text-[12px] text-[#514537] dark:text-[#cdc5bd] mt-[4px]">
                          <span>{inv.created_at ? formatArabicDate(inv.created_at) : "—"}</span>
                          {inv.payment_method && (
                            <>
                              <span className="text-[#d6c4b1] dark:text-[#6e5849]">•</span>
                              <span>{inv.payment_method}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[18px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                        {inv.amount || inv.total || "0"} {t("ر.س", "SAR")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION C: أحدث تذاكر الدعم الفني */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col gap-4">
            {/* Header */}
            <div className="border-b border-[#f0eeea] dark:border-[#38271c] pb-[10px] flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                <div className="w-[6px] h-[16px] bg-[#9c6402] dark:bg-[#e29d38] rounded-full" />
                <h2 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("أحدث تذاكر الدعم الفني", "Latest Support Tickets")}
                </h2>
              </div>

              <Link
                href="/tickets"
                className="text-[#9c6402] dark:text-[#e29d38] hover:underline text-[12px] font-semibold flex items-center gap-[4px] cursor-pointer"
              >
                <ChevronLeft className="size-[12px] rtl:rotate-0 rotate-180" />
                <span>{t("سجل التذاكر", "Tickets Record")}</span>
              </Link>
            </div>

            {/* Tickets: Render from API or Empty State */}
            {(!office.recentTickets || office.recentTickets.length === 0) ? (
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[24px] text-center flex flex-col items-center justify-center gap-2">
                <FileText className="size-6 text-[#837565] dark:text-[#8e8680] opacity-50" />
                <span className="text-[#837565] dark:text-[#8e8680] text-[13px] font-medium">
                  {t("لا توجد تذاكر دعم فني مفتوحة لهذا المكتب حالياً", "No open support tickets for this office currently")}
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {office.recentTickets.map((tk: any, idx: number) => (
                  <div key={tk.id || idx} className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[16px] flex flex-col gap-[10px]">
                    <div className="flex items-center justify-between">
                      <span className="bg-[#f0eeea] dark:bg-[#38271c] text-[#837565] dark:text-[#cdc5bd] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px]">
                        #{tk.ticket_number || tk.code || tk.id}
                      </span>
                      <h3 className="text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                        {tk.subject || tk.title}
                      </h3>
                      <span className="text-[10px] font-bold px-[8px] py-[2px] rounded-full bg-[#fffbeb] text-[#b45309]">
                        {tk.status || "مفتوحة"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* LEFT COLUMN (40% - 5 COLS IN RTL) */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* SECTION D: بيانات الاشتراك السحابي (الخطوة ٢) */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col gap-4">
            {/* Header */}
            <div className="border-b border-[#f0eeea] dark:border-[#38271c] pb-[10px] flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                <Sparkles className="size-[16px] text-[#9c6402] dark:text-[#e29d38]" />
                <h2 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("بيانات الاشتراك السحابي", "Cloud Subscription Details")}
                </h2>
              </div>

              <span className={`border text-[10px] font-bold px-[8px] py-[2px] rounded-full ${
                autoRenew
                  ? "bg-[#d1fae5] border-emerald-200 dark:bg-[#132c1c] dark:border-emerald-500/40 text-[#065f46] dark:text-[#6ee7b7]"
                  : "bg-[#fef2f2] border-rose-200 dark:bg-[#341616] dark:border-rose-500/40 text-[#dc2626] dark:text-[#f87171]"
              }`}>
                {autoRenew ? t("تجديد تلقائي مفعل", "Auto-renew ON") : t("تجديد يدوي", "Manual")}
              </span>
            </div>

            {/* Subscription Plan Meta Card */}
            <div className="bg-gradient-to-br from-[#1c140f] to-[#2e221b] dark:from-[#150e0a] dark:to-[#241710] border border-transparent dark:border-[#38271c] text-white rounded-[6px] p-[18px] flex flex-col gap-[14px] shadow-sm relative">
              <div className="flex flex-col items-start gap-1.5 text-start">
                <span className="bg-[#7b4e00]/40 text-[#ffddb6] border border-[#ffddb6]/30 text-[10px] font-semibold px-[10px] py-[3px] rounded-full w-fit">
                  {isMonthly
                    ? t("دورة شهرية", "Monthly Billing")
                    : t("دورة سنوية (موصى به)", "Annual Billing (Recommended)")}
                </span>

                <h3 className="text-[22px] font-bold leading-[28px] mt-[2px] text-white dark:text-[#fdfbf7]">
                  {currentPlan}
                </h3>
              </div>

              {/* Price & Small Annual Benefits Box */}
              <div className="flex items-center justify-between gap-3 text-start">
                <div className="flex items-baseline gap-[6px]">
                  <span className="text-[32px] font-bold leading-[34px] text-white dark:text-[#fdfbf7]">
                    {(() => {
                      const price =
                        office.activeSubscriptionDetails?.amount ||
                        (isMonthly
                          ? office.planDetails?.monthlyPrice
                          : office.planDetails?.yearlyPrice || office.planDetails?.monthlyPrice);
                      return price ? Number(price).toLocaleString("en-US") : "0";
                    })()}
                  </span>
                  <span className="text-[#cdc5bd] text-[13px]">
                    {t("ر.س", "SAR")} / {isMonthly ? t("شهرياً", "Monthly") : t("سنوياً", "Annually")}
                  </span>
                </div>

                {isMonthly && (
                  <button
                    type="button"
                    onClick={() => setIsAnnualBenefitsModalOpen(true)}
                    className="bg-[#9c6402] hover:bg-[#855402] text-[#ffddb6] hover:text-white border border-[#ffddb6]/30 px-2.5 py-1.5 rounded-[4px] text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
                  >
                    <Sparkles className="size-3 text-[#ffddb6]" />
                    <span>{t("عرض مميزات السنوي", "Annual Benefits")}</span>
                    <ArrowUpRight className="size-3 rtl:rotate-[-90deg]" />
                  </button>
                )}
              </div>

              {/* Renewal dates */}
              <div className="border-t border-white/10 pt-[8px] grid grid-cols-2 gap-[8px] text-[10px]">
                <div className="flex flex-col text-start">
                  <span className="text-[#cdc5bd]">{t("موعد التجديد القادم:", "Next Renewal Date:")}</span>
                  <span className="text-[#ffddb6] dark:text-[#f3c27e] font-bold text-[11px] mt-[1px]">
                    {subscriptionEnd ? formatArabicDate(subscriptionEnd) : "—"}
                  </span>
                </div>
                <div className="flex flex-col text-start">
                  <span className="text-[#cdc5bd]">{t("تاريخ بدء الاشتراك:", "Subscription Start:")}</span>
                  <span className="text-white font-bold text-[11px] mt-[1px]">
                    {subscriptionStart ? formatArabicDate(subscriptionStart) : registrationDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Custom / Approved Plan Limits & Specifications Box */}
            <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-3.5 flex flex-col gap-2.5 text-start">
              <span className="text-[11px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1.5">
                <Scale className="size-3.5 text-[#9c6402] dark:text-[#e29d38]" />
                <span>{t("تفاصيل ومواصفات الباقة المعتمدة", "Plan Specifications & Allowances")}</span>
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                <div className="bg-white dark:bg-[#1a120d] p-2 rounded border border-[#eae8e4] dark:border-[#38271c] flex flex-col">
                  <span className="text-[#837565] dark:text-[#8e8680]">{t("عدد رخص ومقاعد المحامين", "Lawyer Seats")}</span>
                  <span className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] mt-0.5">
                    {office.planDetails?.maxLawyers || lawyersLimit || 10} {t("محامين", "seats")}
                  </span>
                </div>
                <div className="bg-white dark:bg-[#1a120d] p-2 rounded border border-[#eae8e4] dark:border-[#38271c] flex flex-col">
                  <span className="text-[#837565] dark:text-[#8e8680]">{t("المساحة التخزينية السحابية", "Cloud Storage")}</span>
                  <span className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] mt-0.5">
                    {office.planDetails?.storageLimitGb || storageLimitGb || 10} GB
                  </span>
                </div>
                <div className="bg-white dark:bg-[#1a120d] p-2 rounded border border-[#eae8e4] dark:border-[#38271c] flex flex-col">
                  <span className="text-[#837565] dark:text-[#8e8680]">{t("سقف القضايا والملفات", "Cases Limit")}</span>
                  <span className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] mt-0.5">
                    {office.planDetails?.maxCases ? `${office.planDetails.maxCases} ${t("قضية", "cases")}` : t("غير محدود", "Unlimited")}
                  </span>
                </div>
                <div className="bg-white dark:bg-[#1a120d] p-2 rounded border border-[#eae8e4] dark:border-[#38271c] flex flex-col">
                  <span className="text-[#837565] dark:text-[#8e8680]">{t("مستوى الدعم الفني", "Technical Support")}</span>
                  <span className="font-bold text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] mt-0.5">
                    {office.planDetails?.supportLevel || t("دعم فني مدار الساعة", "24/7 Support")}
                  </span>
                </div>
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
                    style={{ width: `${Math.min(100, Math.max(0, Math.round((activeCases / Math.max(1, office.planDetails?.maxCases || 100)) * 100)))}%` }}
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
              <div className="flex items-center gap-[8px]">
                <PenSquare className="size-[15px] text-[#9c6402] dark:text-[#e29d38]" />
                <h2 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  ملاحظات وسجل نشاط الفريق
                </h2>
              </div>

              <span className="bg-[#f0eeea] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] text-[10px] font-bold px-[8px] py-[2px] rounded-full">
                خاص بالإدارة
              </span>
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
        onClose={() => {
          setIsUpgradeModalOpen(false);
          setUpgradeCycle(undefined);
        }}
        office={office ? { ...office, plan: currentPlan } : null}
        initialBillingCycle={upgradeCycle || (isMonthly ? "monthly" : "annual")}
        onConfirmUpgrade={(officeId, newPlanName) => {
          setCurrentPlan(newPlanName);
          if (office && onUpgradePlan) {
            onUpgradePlan(office, newPlanName);
          }
        }}
      />

      {/* Annual Subscription Benefits Modal / Popup */}
      <AnnualPlanBenefitsModal
        isOpen={isAnnualBenefitsModalOpen}
        onClose={() => setIsAnnualBenefitsModalOpen(false)}
        office={office ? { ...office, plan: currentPlan } : null}
        onUpgradeToAnnual={() => {
          setIsAnnualBenefitsModalOpen(false);
          setUpgradeCycle("annual");
          setIsUpgradeModalOpen(true);
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
