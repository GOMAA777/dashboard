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
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  Check,
  DoorOpen,
  KeyRound,
  Hash,
  MapPin,
  User,
  Copy,
  FileText,
  ArrowUpRight,
  Palette,
  CreditCard,
  HardDrive,
  Headphones,
  RefreshCw,
  Briefcase,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { ClientOffice, OfficeInternalNote } from "../types/client.types";
import { useLanguage } from "@/lib/i18n";
import {
  getLocalizedCityName,
  localizeLicense,
  localizePlanFeature,
  localizePlanName,
  localizeRoleOrTitle,
  localizeStatus,
} from "@/lib/localize";
import { cn } from "@/lib/utils";
import { addFirmNote, fetchFirmById } from "@/lib/api/firms";
import { unwrapData } from "@/lib/api/helpers";
import {
  getLocalCustomAutoRenew,
  getLocalCustomLogo,
  getLocalCustomTaxNumber,
  getLocalCustomThemeColor,
  getLocalCustomBackgroundColor,
  getLocalCustomSecondaryColor,
  getLocalCustomNotes,
  saveAllLocalCustomNotes,
  mapFirmToClientOffice,
  normalizeLogoUrl,
  resolveOfficeLogo,
  DEFAULT_OFFICE_LOGO,
  withCacheBust,
} from "@/lib/api/mappers";
import {
  DEFAULT_OFFICE_THEME_COLOR,
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

function formatArabicDate(isoOrStr?: string, isEn = false, fallback = "—"): string {
  if (!isoOrStr) return fallback;
  try {
    const d = new Date(isoOrStr);
    if (isNaN(d.getTime())) return isoOrStr;
    return d.toLocaleDateString(isEn ? "en-US" : "ar-SA-u-nu-latn", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return isoOrStr;
  }
}

function formatShortDate(isoOrStr?: string, isEn = false, fallback = "—"): string {
  if (!isoOrStr) return fallback;
  try {
    const d = new Date(isoOrStr);
    if (isNaN(d.getTime())) return isoOrStr;
    return d.toLocaleDateString(isEn ? "en-US" : "ar-SA-u-nu-latn", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return isoOrStr;
  }
}

function formatNoteDate(isoOrStr?: string, isEn = false): string {
  if (!isoOrStr) return isEn ? "Today" : "اليوم";
  try {
    const d = new Date(isoOrStr);
    if (isNaN(d.getTime())) return isoOrStr;
    return d.toLocaleDateString(isEn ? "en-US" : "ar-SA-u-nu-latn", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoOrStr;
  }
}

/** Maximum number of notes rendered per page inside the notes card. */
export const NOTES_PER_PAGE = 5;

/** Slice a notes array to a bounded 5-item page and return clamped page metadata. */
export function paginateNotes<T>(items: T[], requestedPage: number, perPage = NOTES_PER_PAGE) {
  const safePerPage = Math.max(1, Math.min(perPage, NOTES_PER_PAGE));
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePerPage));
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
  const startIndex = (currentPage - 1) * safePerPage;
  const endIndex = Math.min(startIndex + safePerPage, totalItems);
  return {
    items: items.slice(startIndex, endIndex),
    currentPage,
    totalPages,
    startItem: totalItems === 0 ? 0 : startIndex + 1,
    endItem: endIndex,
    totalItems,
  };
}

/** Build compact page numbers with ellipsis tokens when totalPages exceeds 5. */
export function getVisibleNotePages(
  current: number,
  total: number
): Array<number | "ellipsis-start" | "ellipsis-end"> {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: Array<number | "ellipsis-start" | "ellipsis-end"> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("ellipsis-start");
  for (let p = start; p <= end; p++) {
    pages.push(p);
  }
  if (end < total - 1) pages.push("ellipsis-end");
  pages.push(total);
  return pages;
}

/** Merge two note lists while preserving order and deduplicating by id or content+timestamp. */
function mergeUniqueNotes(
  primary: OfficeInternalNote[],
  secondary: OfficeInternalNote[]
): OfficeInternalNote[] {
  const merged = [...primary];
  for (const item of secondary) {
    if (
      !merged.some(
        (m) =>
          m.id === item.id ||
          (m.note === item.note && m.createdAt === item.createdAt)
      )
    ) {
      merged.push(item);
    }
  }
  return merged;
}

/** Format raw gateway/payment method identifier into a short human-readable label. */
function formatPaymentMethod(method?: string, isEn = false): string {
  const m = String(method || "").toLowerCase().trim();
  if (!m) return "—";
  if (m.includes("mada")) return isEn ? "Mada" : "مدى";
  if (m.includes("visa")) return "Visa";
  if (m.includes("master")) return "Mastercard";
  if (m.includes("apple")) return "Apple Pay";
  if (m.includes("bank")) return isEn ? "Bank Transfer" : "تحويل بنكي";
  if (m.includes("stripe")) return "Stripe";
  return method || "—";
}

interface ClientOfficeDetailsViewProps {
  office: ClientOffice | null;
  onBack: () => void;
  onEdit: () => void;
  onResetPassword?: () => void;
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
  onResetPassword,
  onEnterOfficeAsAdmin,
  onOpenDeactivateModal,
  onReactivate,
  onUpgradePlan,
  onNoteAdded,
}: ClientOfficeDetailsViewProps) {
  const { t, isEn } = useLanguage();
  const [internalNote, setInternalNote] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [liveOfficesById, setLiveOfficesById] = useState<Record<string, ClientOffice>>({});
  const [showPlanFeatures, setShowPlanFeatures] = useState(false);
  const [upgradedPlanByOffice, setUpgradedPlanByOffice] = useState<Record<string, string>>({});
  const [notesPageState, setNotesPageState] = useState<{ officeId?: string; page: number }>({
    officeId: office?.id,
    page: 1,
  });
  const notesPage = notesPageState.officeId === office?.id ? notesPageState.page : 1;
  const setNotesPage = React.useCallback(
    (next: number | ((prev: number) => number)) => {
      setNotesPageState((prev) => {
        const current = prev.officeId === office?.id ? prev.page : 1;
        const page = typeof next === "function" ? next(current) : next;
        return { officeId: office?.id, page };
      });
    },
    [office?.id]
  );

  const [notesByOffice, setNotesByOffice] = useState<Record<string, OfficeInternalNote[]>>({});

  const notes = React.useMemo(() => {
    if (!office?.id) return [];
    const override = notesByOffice[office.id] || [];
    const fromProps = office.internalNotes || [];
    const fromLocal = typeof window !== "undefined" ? getLocalCustomNotes(office.id) : [];
    return mergeUniqueNotes(mergeUniqueNotes(override, fromProps), fromLocal);
  }, [office, notesByOffice]);

  // Direct fetch on mount / ID change to guarantee fresh office & subscription details from API
  React.useEffect(() => {
    const firmId = office?.id;
    if (!firmId) return;
    let cancelled = false;

    fetchFirmById(firmId)
      .then((payload) => {
        if (cancelled) return;
        const rawData = (unwrapData<Record<string, unknown>>(payload) || payload) as Record<string, unknown>;
        const firm = (rawData.firm || rawData) as Record<string, unknown>;

        if (rawData.firm || firm.id) {
          const mappedLive = mapFirmToClientOffice(rawData);
          if (mappedLive.id) {
            setLiveOfficesById((prev) => ({ ...prev, [firmId]: mappedLive }));
          }
        }

        const notesRaw = (rawData.internal_notes || firm.internal_notes || []) as Array<Record<string, unknown>>;
        const liveNotes: OfficeInternalNote[] = notesRaw.map((n) => ({
          id: Number(n.id || Date.now()),
          authorName: String(n.author_name || "مشرف النظام"),
          authorRole: String(n.author_role || "إشراف النظام"),
          note: String(n.note || ""),
          createdAt: String(n.created_at || new Date().toISOString()),
        }));

        if (liveNotes.length > 0) {
          setNotesByOffice((prev) => {
            const merged = mergeUniqueNotes(liveNotes, prev[firmId] || []);
            saveAllLocalCustomNotes(firmId, merged);
            return { ...prev, [firmId]: merged };
          });
        }
      })
      .catch((err) => {
        console.warn("Could not refresh firm details from server:", err);
      });

    return () => {
      cancelled = true;
    };
  }, [office?.id]);

  const displayOffice =
    office?.id && liveOfficesById[office.id]
      ? { ...office, ...liveOfficesById[office.id] }
      : office;

  const isUnlimited =
    displayOffice?.planType === "unlimited" ||
    displayOffice?.subscriptionPlan === "unlimited" ||
    displayOffice?.plan?.includes("غير محدود") ||
    displayOffice?.subscriptionStatus?.type === "unlimited" ||
    displayOffice?.subscriptionStatus?.label === "غير محدود";

  const isExplicitlyPaid =
    !isUnlimited &&
    (displayOffice?.planType === "paid" ||
      displayOffice?.subscriptionPlan === "paid" ||
      displayOffice?.subscriptionStatus?.type === "active");
  const isTrial =
    !isUnlimited &&
    !isExplicitlyPaid &&
    (displayOffice?.planType === "trial" ||
      displayOffice?.subscriptionPlan === "trial" ||
      displayOffice?.plan?.includes("تجرب") ||
      displayOffice?.accountStatus?.type === "trial" ||
      displayOffice?.accountStatus?.label?.includes("تجرب") ||
      (displayOffice as unknown as { status?: string })?.status === "trial");
  const accType = displayOffice?.accountStatus?.type as string | undefined;
  const isDeactivated =
    accType === "suspended" ||
    accType === "inactive" ||
    displayOffice?.accountStatus?.label === "غير نشط" ||
    displayOffice?.accountStatus?.label?.includes("معطل") ||
    (displayOffice as unknown as { status?: string })?.status === "inactive" ||
    (displayOffice as unknown as { status?: string })?.status === "suspended";
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeCycle, setUpgradeCycle] = useState<"annual" | "monthly" | undefined>(undefined);
  const [isAnnualBenefitsModalOpen, setIsAnnualBenefitsModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const rawPlanTitle =
    (displayOffice?.id ? upgradedPlanByOffice[displayOffice.id] : undefined) ||
    displayOffice?.planDetails?.name ||
    displayOffice?.plan ||
    "الباقة المعتمدة";
  const currentPlan = isUnlimited
    ? "غير محدود"
    : isExplicitlyPaid
    ? rawPlanTitle.replace(/\s*-\s*تجربة\s*مجانية/gi, "").replace(/\s*\(تجربة\s*مجانية\)/gi, "").trim()
    : rawPlanTitle;
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

  if (!displayOffice || !office) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-16 bg-white dark:bg-[#221812] rounded-[8px] border border-[#f0eeea] dark:border-[#38271c]">
        <div className="size-10 border-4 border-[#9c6402] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-[#837565] dark:text-[#cdc5bd] text-sm">
          {t("جارٍ تحميل تفاصيل مكتب المحاماة...", "Loading law office details...")}
        </span>
      </div>
    );
  }

  const officeName = displayOffice.name;
  const owner = displayOffice.owner && displayOffice.owner !== "—" ? displayOffice.owner : "—";
  const licenseNum =
    displayOffice.licenseNumber && displayOffice.licenseNumber !== "—"
      ? localizeLicense(displayOffice.licenseNumber, isEn)
          .replace(/^ترخيص عدلي:\s*/g, "")
          .replace(/^License:\s*/gi, "")
      : "—";
  const taxNumber = displayOffice.taxNumber || (displayOffice.id ? getLocalCustomTaxNumber(displayOffice.id) : undefined) || "—";
  const officeLogo = !logoFailed ? resolveOfficeLogo(displayOffice.logo, displayOffice.id) : DEFAULT_OFFICE_LOGO;
  const officeBgColor =
    displayOffice.backgroundColor ||
    (displayOffice.id ? getLocalCustomBackgroundColor(displayOffice.id) : undefined) ||
    (displayOffice.companyId ? getLocalCustomBackgroundColor(displayOffice.companyId) : undefined) ||
    displayOffice.color ||
    displayOffice.themeColor ||
    DEFAULT_OFFICE_THEME_COLOR;
  const officeColor =
    displayOffice.color ||
    displayOffice.themeColor ||
    (displayOffice.id ? getLocalCustomThemeColor(displayOffice.id) : undefined) ||
    (displayOffice.companyId ? getLocalCustomThemeColor(displayOffice.companyId) : undefined) ||
    DEFAULT_OFFICE_THEME_COLOR;
  const isColorLight = isLightColor(officeBgColor);
  const officeFontColor =
    displayOffice.fontColor ||
    displayOffice.secondaryColor ||
    (displayOffice.id ? getLocalCustomSecondaryColor(displayOffice.id) : undefined) ||
    (displayOffice.companyId ? getLocalCustomSecondaryColor(displayOffice.companyId) : undefined) ||
    (isColorLight ? "#1b1c1a" : "#ffffff");
  const email = displayOffice.email || "—";
  const phone = displayOffice.phone || "—";
  const landline = displayOffice.landline || "—";
  const rawCity = displayOffice.city || "";
  const city = rawCity ? getLocalizedCityName(rawCity, isEn) : "—";
  const country = displayOffice.country
    ? isEn && displayOffice.country === "المملكة العربية السعودية"
      ? "Saudi Arabia"
      : displayOffice.country
    : "";
  const address =
    displayOffice.address ||
    (rawCity
      ? isEn
        ? `Saudi Arabia - ${getLocalizedCityName(rawCity, true)}`
        : `المملكة العربية السعودية - ${rawCity}`
      : "—");
  const registrationDate = formatArabicDate(displayOffice.registrationDate, isEn);
  const subscriptionEnd = displayOffice.subscriptionEnd || displayOffice.activeSubscriptionDetails?.renewalDate;
  const subscriptionStart = displayOffice.subscriptionStart || displayOffice.activeSubscriptionDetails?.startDate;

  const isMonthly = (() => {
    const rawCycle = (
      displayOffice.activeSubscriptionDetails?.billingCycle ||
      displayOffice.billingCycle ||
      ""
    ).toLowerCase().trim();

    if (rawCycle.includes("سنو") || rawCycle.includes("year") || rawCycle.includes("annu")) {
      return false;
    }

    if (
      rawCycle.includes("شهري") ||
      rawCycle.includes("month") ||
      rawCycle === "شهر"
    ) {
      return true;
    }

    const s = subscriptionStart;
    const e = subscriptionEnd;
    if (s && e) {
      const sTime = new Date(s).getTime();
      const eTime = new Date(e).getTime();
      if (!isNaN(sTime) && !isNaN(eTime) && eTime > sTime) {
        const diffDays = Math.round((eTime - sTime) / (1000 * 60 * 60 * 24));
        return diffDays <= 45;
      }
    }

    const subAmt = Number(displayOffice.activeSubscriptionDetails?.amount || 0);
    const mPrice = Number(displayOffice.planDetails?.monthlyPrice || 0);
    const yPrice = Number(displayOffice.planDetails?.yearlyPrice || 0);
    if (subAmt > 0 && yPrice > 0 && Math.abs(subAmt - yPrice) < 5) return false;
    if (subAmt > 0 && mPrice > 0 && Math.abs(subAmt - mPrice) < 5) return true;

    return false;
  })();

  const localRenew = displayOffice.id ? getLocalCustomAutoRenew(displayOffice.id) : undefined;
  const autoRenew =
    displayOffice.activeSubscriptionDetails?.autoRenew !== undefined
      ? displayOffice.activeSubscriptionDetails.autoRenew
      : displayOffice.autoRenew !== undefined
      ? displayOffice.autoRenew
      : localRenew !== undefined
      ? localRenew
      : true;

  const lawyersUsed = displayOffice.resourceUsage?.lawyersUsed ?? 0;
  const lawyersLimit = displayOffice.resourceUsage?.lawyersLimit ?? displayOffice.planDetails?.maxLawyers ?? 0;
  const lawyersPercent = displayOffice.resourceUsage?.lawyersPercent ?? (lawyersLimit > 0 ? Math.round((lawyersUsed / lawyersLimit) * 100) : 0);
  const storageUsedGb = displayOffice.resourceUsage?.storageUsedGb ?? "0.00";
  const storageLimitGb = displayOffice.resourceUsage?.storageLimitGb ?? displayOffice.planDetails?.storageLimitGb ?? 0;
  const storagePercent = displayOffice.resourceUsage?.storagePercent ?? (storageLimitGb > 0 ? Math.round((Number(storageUsedGb) / storageLimitGb) * 100) : 0);
  const activeCases = displayOffice.resourceUsage?.activeCases ?? 0;
  const maxCasesLimit = displayOffice.resourceUsage?.maxCasesLimit ?? displayOffice.planDetails?.maxCases ?? 0;
  const casesPercent = maxCasesLimit > 0 ? Math.round((activeCases / maxCasesLimit) * 100) : 0;
  const casesExceeded = maxCasesLimit > 0 && activeCases > maxCasesLimit;
  const paymentMethodLabel = formatPaymentMethod(displayOffice.activeSubscriptionDetails?.paymentMethod, isEn);
  const yearlyDiscount = displayOffice.planDetails?.yearlyDiscountPercent;
  const rawSubPrice =
    displayOffice.activeSubscriptionDetails?.amount ||
    (isMonthly
      ? displayOffice.planDetails?.monthlyPrice
      : displayOffice.planDetails?.yearlyPrice || displayOffice.planDetails?.monthlyPrice);
  const resolvedSubPrice = rawSubPrice ? Number(rawSubPrice).toLocaleString("en-US") : "0";
  const formatQuota = (val?: number, unit = "") => {
    if (isUnlimited) return t("غير محدود (∞)", "Unlimited (∞)");
    if (val === undefined || val === null) return "—";
    if (val === -1 || val >= 99999) return t("غير محدود (∞)", "Unlimited (∞)");
    return `${val}${unit}`;
  };
  const planQuotaItems = [
    {
      key: "lawyers",
      label: t("المحامين", "Lawyers"),
      value: formatQuota(lawyersLimit > 0 ? lawyersLimit : displayOffice.planDetails?.maxLawyers),
      icon: <Users aria-hidden="true" className="size-3 text-[#9c6402] dark:text-[#e29d38] shrink-0" />,
      visible: (lawyersLimit > 0 ? lawyersLimit : displayOffice.planDetails?.maxLawyers) !== undefined,
    },
    {
      key: "cases",
      label: t("القضايا", "Cases"),
      value: formatQuota(maxCasesLimit !== 0 ? maxCasesLimit : displayOffice.planDetails?.maxCases),
      icon: <Briefcase aria-hidden="true" className="size-3 text-[#9c6402] dark:text-[#e29d38] shrink-0" />,
      visible: (maxCasesLimit !== 0 ? maxCasesLimit : displayOffice.planDetails?.maxCases) !== undefined,
    },
    {
      key: "storage",
      label: t("التخزين", "Storage"),
      value: formatQuota(
        storageLimitGb > 0 ? storageLimitGb : displayOffice.planDetails?.storageLimitGb,
        " GB"
      ),
      icon: <HardDrive aria-hidden="true" className="size-3 text-[#9c6402] dark:text-[#e29d38] shrink-0" />,
      visible:
        (storageLimitGb > 0 ? storageLimitGb : displayOffice.planDetails?.storageLimitGb) !== undefined,
    },
    {
      key: "clients",
      label: t("العملاء", "Clients"),
      value: formatQuota(displayOffice.planDetails?.maxClients),
      icon: <UserCheck aria-hidden="true" className="size-3 text-[#9c6402] dark:text-[#e29d38] shrink-0" />,
      visible: displayOffice.planDetails?.maxClients !== undefined,
    },
    {
      key: "agents",
      label: t("الوكلاء", "Agents"),
      value: formatQuota(displayOffice.planDetails?.maxPowerOfAttorney),
      icon: <Scale aria-hidden="true" className="size-3 text-[#9c6402] dark:text-[#e29d38] shrink-0" />,
      visible: displayOffice.planDetails?.maxPowerOfAttorney !== undefined,
    },
    {
      key: "assistants",
      label: t("المساعدين", "Assistants"),
      value: formatQuota(displayOffice.planDetails?.maxAssistants),
      icon: <User aria-hidden="true" className="size-3 text-[#9c6402] dark:text-[#e29d38] shrink-0" />,
      visible: displayOffice.planDetails?.maxAssistants !== undefined,
    },
  ].filter((q) => q.visible);
  const planFeatures = (displayOffice.planDetails?.features || []).map((feat) =>
    localizePlanFeature(feat, isEn)
  );

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
    const firmId = office.id;
    const persistNewNote = (noteItem: OfficeInternalNote) => {
      const updated = mergeUniqueNotes([noteItem], notes);
      saveAllLocalCustomNotes(firmId, updated);
      setNotesByOffice((prev) => ({
        ...prev,
        [firmId]: mergeUniqueNotes([noteItem], prev[firmId] || []),
      }));
      setNotesPage(1);
      if (onNoteAdded) {
        onNoteAdded(firmId, noteItem);
      }
      toast.success(t("تم حفظ الملاحظة الإدارية بنجاح", "Internal note added successfully"));
      setInternalNote("");
    };

    setIsSubmittingNote(true);
    try {
      const res = await addFirmNote(firmId, noteText);
      const raw = (unwrapData<Record<string, unknown>>(res) || res) as Record<string, unknown>;
      const noteData = ((raw && typeof raw === "object" && (raw.data || raw)) || {}) as Record<string, unknown>;
      const newNote: OfficeInternalNote = {
        id: Number(noteData.id || Date.now()),
        authorName: String(noteData.author_name || "مشرف النظام"),
        authorRole: String(noteData.author_role || "إشراف النظام"),
        note: String(noteData.note || noteText),
        createdAt: String(noteData.created_at || new Date().toISOString()),
      };
      persistNewNote(newNote);
    } catch {
      // Local fallback so user note is never lost even if server drops
      const fallbackNote: OfficeInternalNote = {
        id: Date.now(),
        authorName: "مشرف النظام",
        authorRole: "إشراف النظام",
        note: noteText,
        createdAt: new Date().toISOString(),
      };
      persistNewNote(fallbackNote);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const notesPagination = paginateNotes(notes, notesPage);
  const visibleNotePages = getVisibleNotePages(
    notesPagination.currentPage,
    notesPagination.totalPages
  );

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
        className="rounded-[8px] p-5 sm:p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.08)] border flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative overflow-hidden transition-colors"
        style={{
          backgroundColor: officeBgColor,
          backgroundImage: isColorLight
            ? "linear-gradient(135deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 60%, rgba(0,0,0,0.05) 100%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 55%, rgba(0,0,0,0.22) 100%)",
          borderColor: isColorLight ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.16)",
          color: officeFontColor,
        }}
        data-node-id="1:1781"
      >
        {/* Subtle decorative ambient highlight */}
        <div
          className="absolute -top-[56px] -start-[56px] size-[200px] blur-[30px] rounded-full pointer-events-none"
          style={{
            backgroundColor: isColorLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.14)",
          }}
        />

        {/* Right: Monogram & Identity Info */}
        <div className="flex items-center gap-[16px] z-10">
          {/* Monogram / Seal Avatar or Real Logo */}
          {officeLogo ? (
            <div
              className="size-[80px] rounded-[8px] bg-white/95 dark:bg-[#1f150f]/95 border p-1.5 flex items-center justify-center shadow-md shrink-0 overflow-hidden"
              style={{
                borderColor: isColorLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.28)",
              }}
            >
              <img
                src={withCacheBust(officeLogo, office.updatedAt || office.id)}
                alt={officeName}
                className="max-h-full max-w-full object-contain"
                onError={() => setLogoFailed(true)}
              />
            </div>
          ) : (
            <div
              className="size-[80px] rounded-[8px] flex flex-col items-center justify-center shadow-md shrink-0 transition-transform border"
              style={{
                backgroundColor: isColorLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.14)",
                borderColor: isColorLight ? "rgba(0,0,0,0.14)" : "rgba(255,255,255,0.25)",
                color: officeFontColor,
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
            <h1
              className="text-[26px] leading-[36px] font-bold"
              style={{ color: officeFontColor }}
            >
              {officeName}
            </h1>

            {/* Subtitle Metadata */}
            <div
              className="flex flex-wrap items-center gap-[8px] text-[12px] mt-[4px]"
              style={{ color: officeFontColor }}
            >
              <div className="flex items-center gap-[4px]">
                <Hash className="size-[13px] opacity-80" />
                <span className="opacity-85">{t("معرف المنشأة:", "Company ID:")}</span>
                <span className="font-mono font-semibold">#{office.companyId || office.id}</span>
              </div>

              <span className="opacity-45">|</span>

              <div className="flex items-center gap-[4px]">
                <Calendar className="size-[13px] opacity-80" />
                <span className="opacity-85">{t("تاريخ التسجيل:", "Registration Date:")}</span>
                <span className="font-medium">{registrationDate}</span>
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
            className="bg-white/95 dark:bg-[#1f150f]/90 hover:bg-white dark:hover:bg-[#1f150f] border border-black/10 dark:border-white/15 text-[#1b1c1a] dark:text-[#fdfbf7] px-[12px] py-[8px] rounded-[4px] text-[13px] font-semibold flex items-center gap-[6px] shadow-sm transition-colors cursor-pointer backdrop-blur-sm"
          >
            <ArrowLeft className="size-[14px] rtl:rotate-180" />
            <span>{t("العودة للقائمة", "Back to List")}</span>
          </button>

          {/* Enter Office as Admin */}
          {onEnterOfficeAsAdmin && (
            <button
              type="button"
              onClick={onEnterOfficeAsAdmin}
              className="bg-[#1b1c1a] hover:bg-[#2a2b28] border border-white/20 text-white px-[14px] py-[8px] rounded-[4px] text-[13px] font-semibold flex items-center gap-[6px] shadow-sm transition-colors cursor-pointer"
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
            className={`px-[16px] py-[8px] rounded-[4px] text-[13px] font-semibold flex items-center gap-[6px] shadow-sm transition-colors cursor-pointer ${
              officeColor.toLowerCase().trim() === "#9c6402"
                ? "bg-white hover:bg-[#fff9ee] text-[#7b4e00] border border-black/10"
                : "bg-[#9c6402] hover:bg-[#855402] text-white border border-white/25"
            }`}
          >
            <PenSquare className="size-[14px]" />
            <span>{t("تعديل بيانات المكتب", "Edit Office")}</span>
          </button>

          {/* Reset Password Button */}
          {onResetPassword && (
            <button
              type="button"
              onClick={onResetPassword}
              className="bg-white/95 dark:bg-[#1f150f]/90 hover:bg-white dark:hover:bg-[#1f150f] border border-black/10 dark:border-white/15 text-[#1b1c1a] dark:text-[#fdfbf7] px-[14px] py-[8px] rounded-[4px] text-[13px] font-semibold flex items-center gap-[6px] shadow-sm transition-colors cursor-pointer backdrop-blur-sm"
              title={t("إعادة تعيين كلمة المرور", "Reset Password")}
            >
              <KeyRound className="size-[14px] text-[#9c6402] dark:text-[#e29d38]" />
              <span>{t("إعادة تعيين كلمة المرور", "Reset Password")}</span>
            </button>
          )}

          {/* Manage Subscription Button */}
          <button
            type="button"
            onClick={() => setIsUpgradeModalOpen(true)}
            className="bg-white/95 dark:bg-[#1f150f]/90 hover:bg-white dark:hover:bg-[#1f150f] border border-black/10 dark:border-white/15 text-[#1b1c1a] dark:text-[#fdfbf7] px-[14px] py-[8px] rounded-[4px] text-[13px] font-semibold flex items-center gap-[6px] shadow-sm transition-colors cursor-pointer backdrop-blur-sm"
          >
            <Receipt className="size-[14px]" />
            <span>{t("إدارة الاشتراك", "Manage Subscription")}</span>
          </button>

          {/* Deactivate Account Toggle Button */}
          <button
            type="button"
            onClick={handleToggleDeactivate}
            className={`px-[12px] py-[8px] rounded-[4px] text-[12px] font-semibold flex items-center gap-[6px] transition-colors cursor-pointer backdrop-blur-sm ${
              isDeactivated
                ? "bg-[#e8f5e9] dark:bg-[#132c1c] border border-[#a5d6a7] dark:border-emerald-500/40 text-[#1b7340] dark:text-[#6ee7b7] hover:bg-[#c8e6c9]"
                : "bg-white/90 dark:bg-[#1f150f]/90 border border-black/10 dark:border-white/15 text-[#514537] dark:text-[#cdc5bd] hover:bg-white dark:hover:bg-[#1f150f]"
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
                    <span
                      dir="ltr"
                      className="inline-block text-[#9c6402] dark:text-[#f3c27e] text-[13px] font-bold font-mono"
                    >
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
                </div>
                <div className="bg-white dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 size-[36px] rounded-[4px] shadow-sm flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
                  <Scale className="size-[16px]" />
                </div>
              </div>

              {/* 4. الرقم الضريبي */}
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex flex-col text-start min-w-0 flex-1 pe-2">
                  <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-bold">
                    {t("الرقم الضريبي", "Tax Number")}
                  </span>
                  <div className="flex items-center gap-1.5 mt-[2px]">
                    <span
                      dir="ltr"
                      className="inline-block text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold font-mono"
                    >
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
                </div>
                <div className="bg-white dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 size-[36px] rounded-[4px] shadow-sm flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
                  <Hash className="size-[16px]" />
                </div>
              </div>

              {/* 5. البريد الإلكتروني */}
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex flex-col text-start min-w-0 flex-1 pe-2">
                  <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-bold">
                    {t("البريد الإلكتروني", "Email")}
                  </span>
                  <div className="flex items-center gap-1.5 mt-[2px]">
                    <a
                      href={`mailto:${email}`}
                      dir="ltr"
                      className="inline-block text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold hover:underline truncate font-mono"
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
                </div>
                <div className="bg-white dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 size-[36px] rounded-[4px] shadow-sm flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
                  <Mail className="size-[16px]" />
                </div>
              </div>

              {/* 6. رقم الجوال */}
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex flex-col text-start min-w-0 flex-1 pe-2">
                  <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-bold">
                    {t("رقم الجوال", "Mobile Phone")}
                  </span>
                  <div className="flex items-center gap-1.5 mt-[2px]">
                    <span
                      dir="ltr"
                      className="inline-block text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold font-mono whitespace-nowrap"
                    >
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
                </div>
                <div className="bg-white dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 size-[36px] rounded-[4px] shadow-sm flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
                  <Phone className="size-[16px]" />
                </div>
              </div>

              {/* 7. الهاتف المكتبي */}
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex flex-col text-start min-w-0 flex-1 pe-2">
                  <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-bold">
                    {t("الهاتف المكتبي", "Landline Phone")}
                  </span>
                  <div className="flex items-center gap-1.5 mt-[2px]">
                    <span
                      dir="ltr"
                      className="inline-block text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold font-mono whitespace-nowrap"
                    >
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
                </div>
                <div className="bg-white dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 size-[36px] rounded-[4px] shadow-sm flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
                  <PhoneCall className="size-[16px]" />
                </div>
              </div>

              {/* 8. المدينة */}
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex flex-col text-start min-w-0 flex-1 pe-2">
                  <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-bold">
                    {t("المدينة", "City")}
                  </span>
                  <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold mt-[2px]">
                    {country ? `${city} • ${country}` : city}
                  </span>
                </div>
                <div className="bg-white dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 size-[36px] rounded-[4px] shadow-sm flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
                  <MapPin className="size-[16px]" />
                </div>
              </div>

              {/* 9. مقر المكتب الرئيسي */}
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[12px] flex items-center justify-between">
                <div className="flex flex-col text-start min-w-0 flex-1 pe-2">
                  <span className="text-[#837565] dark:text-[#8e8680] text-[10px] font-bold">
                    {t("مقر المكتب الرئيسي", "Headquarters")}
                  </span>
                  <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] font-medium leading-[18px] mt-[2px] line-clamp-2">
                    {address}
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
                  <span
                    className={`text-[13px] font-bold mt-[2px] ${
                      isDeactivated
                        ? "text-[#dc2626] dark:text-[#f87171]"
                        : "text-[#1b7340] dark:text-[#6ee7b7]"
                    }`}
                  >
                    {isDeactivated ? t("غير نشط", "Inactive") : t("نشط", "Active")}
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
                          <span>{inv.created_at ? formatArabicDate(inv.created_at, isEn) : "—"}</span>
                          {inv.payment_method && (
                            <>
                              <span className="text-[#d6c4b1] dark:text-[#6e5849]">•</span>
                              <span>{formatPaymentMethod(inv.payment_method, isEn)}</span>
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
                        {localizeStatus(tk.status || "مفتوحة", isEn)}
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
          {/* SECTION D: بيانات الاشتراك السحابي */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col gap-4">
            {/* Header */}
            <div className="border-b border-[#f0eeea] dark:border-[#38271c] pb-[10px] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-[8px]">
                <Sparkles aria-hidden="true" className="size-[16px] text-[#9c6402] dark:text-[#e29d38]" />
                <h2 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("بيانات الاشتراك السحابي", "Cloud Subscription Details")}
                </h2>
              </div>

              <div className="flex items-center gap-1.5">
                {displayOffice.subscriptionStatus?.label && (
                  <span
                    className={cn(
                      "border text-[10px] font-bold px-[8px] py-[2px] rounded-full flex items-center gap-1.5",
                      displayOffice.subscriptionStatus.type === "active"
                        ? "bg-[#ecfdf5] border-emerald-200 dark:bg-[#132c1c] dark:border-emerald-500/40 text-[#059669] dark:text-[#6ee7b7]"
                        : "bg-[#fffbeb] border-amber-200 dark:bg-[rgba(226,157,56,0.18)] dark:border-[#e29d38]/40 text-[#92400e] dark:text-[#f3c27e]"
                    )}
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        displayOffice.subscriptionStatus.type === "active" ? "bg-emerald-500" : "bg-amber-500"
                      )}
                    />
                    <span>{localizeStatus(displayOffice.subscriptionStatus.label, isEn)}</span>
                  </span>
                )}
                <span
                  className={cn(
                    "border text-[10px] font-bold px-[8px] py-[2px] rounded-full flex items-center gap-1",
                    autoRenew
                      ? "bg-[#d1fae5] border-emerald-200 dark:bg-[#132c1c] dark:border-emerald-500/40 text-[#065f46] dark:text-[#6ee7b7]"
                      : "bg-[#fef2f2] border-rose-200 dark:bg-[#341616] dark:border-rose-500/40 text-[#dc2626] dark:text-[#f87171]"
                  )}
                >
                  <RefreshCw aria-hidden="true" className="size-2.5" />
                  <span>{autoRenew ? t("تجديد تلقائي", "Auto-renew") : t("تجديد يدوي", "Manual")}</span>
                </span>
              </div>
            </div>

            {/* Hero Plan Summary Card */}
            <div className="bg-gradient-to-br from-[#1c140f] to-[#2e221b] dark:from-[#150e0a] dark:to-[#241710] border border-[#38271c] text-white rounded-[8px] p-[16px] flex flex-col gap-[12px] shadow-sm">
              {/* Cycle + Badge + Subscription Code */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="bg-[#7b4e00]/45 text-[#ffddb6] border border-[#ffddb6]/30 text-[10px] font-semibold px-[9px] py-[2px] rounded-full">
                    {isMonthly ? t("دورة شهرية", "Monthly") : t("دورة سنوية", "Annual")}
                  </span>
                  {displayOffice.planDetails?.badge && (
                    <span className="bg-white/10 text-[#ffddb6] border border-white/15 text-[10px] font-semibold px-[9px] py-[2px] rounded-full">
                      {localizeRoleOrTitle(displayOffice.planDetails.badge, isEn)}
                    </span>
                  )}
                </div>
                {displayOffice.activeSubscriptionDetails?.subscriptionCode && (
                  <span
                    dir="ltr"
                    className="text-[10px] font-mono text-[#cdc5bd] bg-white/5 border border-white/10 px-2 py-0.5 rounded"
                  >
                    {displayOffice.activeSubscriptionDetails.subscriptionCode}
                  </span>
                )}
              </div>

              {/* Plan Name + Price + Annual Switch CTA */}
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex flex-col items-start gap-1 text-start">
                  <h3 className="text-[20px] font-bold leading-[26px] text-white dark:text-[#fdfbf7]">
                    {isUnlimited
                      ? t("غير محدود (صلاحيات كاملة)", "Unlimited (Full Access)")
                      : currentPlan === "الباقة المعتمدة"
                      ? t("الباقة المعتمدة", "Approved Plan")
                      : localizePlanName(currentPlan, isEn)}
                  </h3>
                  <div className="flex items-baseline gap-[6px]">
                    <span className="text-[30px] font-bold leading-[32px] tabular-nums text-[#ffddb6] dark:text-[#e29d38]">
                      {isUnlimited ? t("بدون سعر", "Free") : resolvedSubPrice}
                    </span>
                    <span className="text-[#cdc5bd] text-[12px]">
                      {isUnlimited
                        ? `(${t("صلاحيات كاملة", "Full Access")})`
                        : `${t("ر.س", "SAR")} / ${isMonthly ? t("شهرياً", "Monthly") : t("سنوياً", "Annually")}`}
                    </span>
                  </div>
                </div>

                {!isUnlimited && isMonthly && (
                  <button
                    type="button"
                    onClick={() => setIsAnnualBenefitsModalOpen(true)}
                    className="bg-[#9c6402] hover:bg-[#855402] text-[#ffddb6] hover:text-white border border-[#ffddb6]/30 px-2.5 py-1.5 rounded-[5px] text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 min-h-[30px]"
                  >
                    <Sparkles aria-hidden="true" className="size-3 text-[#ffddb6]" />
                    <span>
                      {yearlyDiscount && yearlyDiscount > 0
                        ? t(`السنوي (${yearlyDiscount}% خصم)`, `Annual (-${yearlyDiscount}%)`)
                        : t("مميزات السنوي", "Annual Plan")}
                    </span>
                    <ArrowUpRight aria-hidden="true" className="size-3 rtl:rotate-[-90deg]" />
                  </button>
                )}
              </div>

              {/* Dates & Payment Method Footer */}
              <div className="border-t border-white/10 pt-[10px] grid grid-cols-3 gap-2 text-[10px]">
                <div className="flex flex-col text-start">
                  <span className="text-[#cdc5bd]">{t("بدء الاشتراك", "Started")}</span>
                  <span className="text-white font-bold text-[11px] mt-[2px]">
                    {subscriptionStart ? formatArabicDate(subscriptionStart, isEn) : registrationDate}
                  </span>
                </div>
                <div className="flex flex-col text-start">
                  <span className="text-[#cdc5bd]">{t("التجديد القادم", "Next Renewal")}</span>
                  <span className="text-[#ffddb6] dark:text-[#f3c27e] font-bold text-[11px] mt-[2px]">
                    {isUnlimited ? t("دائم (∞)", "Permanent (∞)") : subscriptionEnd ? formatArabicDate(subscriptionEnd, isEn) : "—"}
                  </span>
                </div>
                <div className="flex flex-col text-start">
                  <span className="text-[#cdc5bd]">{t("وسيلة الدفع", "Payment")}</span>
                  <span className="text-white font-bold text-[11px] mt-[2px] flex items-center gap-1">
                    <CreditCard aria-hidden="true" className="size-3 text-[#e29d38] shrink-0" />
                    <span>{isUnlimited ? t("اشتراك دائم", "Lifetime") : paymentMethodLabel}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Plan Quotas Grid */}
            {planQuotaItems.length > 0 && (
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[6px] p-3 flex flex-col gap-2.5 text-start">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1.5">
                    <Scale aria-hidden="true" className="size-3.5 text-[#9c6402] dark:text-[#e29d38]" />
                    <span>{t("حدود الباقة", "Plan Quotas")}</span>
                  </span>
                  {displayOffice.planDetails?.supportLevel && (
                    <span className="bg-white dark:bg-[#1a120d] border border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Headphones aria-hidden="true" className="size-2.5 text-[#9c6402] dark:text-[#e29d38]" />
                      <span>{localizePlanFeature(displayOffice.planDetails.supportLevel, isEn)}</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {planQuotaItems.map((quota) => (
                    <div
                      key={quota.key}
                      className="bg-white dark:bg-[#1a120d] px-2.5 py-2 rounded-[5px] border border-[#eae8e4] dark:border-[#38271c] flex flex-col gap-0.5"
                    >
                      <div className="flex items-center gap-1 text-[10px] text-[#837565] dark:text-[#8e8680]">
                        {quota.icon}
                        <span className="truncate">{quota.label}</span>
                      </div>
                      <span className="font-bold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] tabular-nums">
                        {quota.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resource Usage Bars */}
            <div className="flex flex-col gap-2.5 pt-0.5">
              <h4 className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] text-start">
                {t("استهلاك الموارد", "Resource Usage")}
              </h4>

              {/* Lawyers */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#514537] dark:text-[#cdc5bd]">
                    {t("المحامين", "Lawyers")}
                  </span>
                  <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7] tabular-nums">
                    {lawyersUsed} / {lawyersLimit || "—"} ({lawyersPercent}%)
                  </span>
                </div>
                <div className="w-full bg-[#f0eeea] dark:bg-[#38271c] h-[6px] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#9c6402] dark:bg-[#e29d38] rounded-full transition-all"
                    style={{ width: `${Math.min(100, lawyersPercent)}%` }}
                  />
                </div>
              </div>

              {/* Cloud Storage */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#514537] dark:text-[#cdc5bd]">
                    {t("التخزين السحابي", "Cloud Storage")}
                  </span>
                  <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7] tabular-nums">
                    {storageUsedGb} / {storageLimitGb || 0} GB ({storagePercent}%)
                  </span>
                </div>
                <div className="w-full bg-[#f0eeea] dark:bg-[#38271c] h-[6px] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#9c6402] dark:bg-[#e29d38] rounded-full transition-all"
                    style={{ width: `${Math.min(100, storagePercent)}%` }}
                  />
                </div>
              </div>

              {/* Active Cases */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#514537] dark:text-[#cdc5bd]">
                    {t("القضايا النشطة", "Active Cases")}
                  </span>
                  <span
                    className={cn(
                      "font-bold tabular-nums",
                      casesExceeded
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-[#1b1c1a] dark:text-[#fdfbf7]"
                    )}
                  >
                    {maxCasesLimit > 0
                      ? `${activeCases} / ${maxCasesLimit} (${casesPercent}%)`
                      : `${activeCases} ${t("قضية", "cases")}`}
                  </span>
                </div>
                <div className="w-full bg-[#f0eeea] dark:bg-[#38271c] h-[6px] rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      casesExceeded
                        ? "bg-amber-500 dark:bg-amber-400"
                        : "bg-[#059669] dark:bg-[#10b981]"
                    )}
                    style={{ width: `${Math.min(100, Math.max(0, casesPercent))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Compact Collapsible Included Features */}
            {planFeatures.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  aria-expanded={showPlanFeatures}
                  onClick={() => setShowPlanFeatures((prev) => !prev)}
                  className="w-full bg-[#f5f3ef] dark:bg-[#281c15] hover:bg-[#eae8e4] dark:hover:bg-[#38271c]/80 border border-transparent dark:border-[#38271c] rounded-[5px] px-3 py-1.5 flex items-center justify-between text-[11px] font-semibold text-[#514537] dark:text-[#cdc5bd] transition-colors cursor-pointer min-h-[30px]"
                >
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 aria-hidden="true" className="size-3.5 text-[#9c6402] dark:text-[#e29d38]" />
                    <span>{t(`مزايا الباقة (${planFeatures.length})`, `Plan Features (${planFeatures.length})`)}</span>
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      "size-3.5 transition-transform",
                      showPlanFeatures && "rotate-180"
                    )}
                  />
                </button>

                {showPlanFeatures && (
                  <ul
                    role="list"
                    className="bg-[#f5f3ef] dark:bg-[#1a120d] border border-[#eae8e4] dark:border-[#38271c] rounded-[5px] p-2.5 flex flex-col gap-1.5 list-none m-0"
                  >
                    {planFeatures.map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-1.5 text-[11px] text-[#514537] dark:text-[#cdc5bd] text-start"
                      >
                        <Check aria-hidden="true" className="size-3 text-[#059669] dark:text-[#10b981] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Upgrade Plan Button */}
            {!isUnlimited ? (
              <button
                type="button"
                onClick={() => setIsUpgradeModalOpen(true)}
                className="w-full bg-[#f0eeea] dark:bg-[#281c15] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] border border-transparent dark:border-[#38271c] py-[8px] rounded-[5px] text-[12px] font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 min-h-[34px]"
              >
                <Sparkles aria-hidden="true" className="size-3.5 text-[#9c6402] dark:text-[#e29d38]" />
                <span>{t("ترقية الباقة", "Upgrade Plan")}</span>
              </button>
            ) : (
              <div className="w-full bg-[#f5f3ef] dark:bg-[#281c15] text-[#9c6402] dark:text-[#e29d38] border border-[#d8c29d] dark:border-[#5a4321] py-[8px] rounded-[5px] text-[12px] font-bold flex items-center justify-center gap-1.5 min-h-[34px]">
                <ShieldCheck aria-hidden="true" className="size-4 text-[#9c6402] dark:text-[#e29d38]" />
                <span>{t("باقة غير محدودة (كامل الصلاحيات)", "Unlimited Plan (Full Privileges)")}</span>
              </div>
            )}
          </div>

          {/* SECTION E: ملاحظات وسجل نشاط الفريق */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col gap-4">
            {/* Header */}
            <div className="border-b border-[#f0eeea] dark:border-[#38271c] pb-[10px] flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                <PenSquare className="size-[15px] text-[#9c6402] dark:text-[#e29d38]" />
                <h2 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("ملاحظات وسجل نشاط الفريق", "Team Notes & Activity Log")}
                </h2>
              </div>

              <span className="bg-[#f0eeea] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] text-[10px] font-bold px-[8px] py-[2px] rounded-full">
                {t("خاص بالإدارة", "Admin Only")}
              </span>
            </div>

            {/* Quick Internal Note Box */}
            <div className="flex flex-col gap-[8px]">
              <textarea
                rows={3}
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder={t(
                  "أضف ملاحظة إدارية داخلية خاصة بفريق الجودي...",
                  "Add an internal admin note for the Al-Joudi team..."
                )}
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

            {/* Activity & Notes Timeline (max 5 notes per page) */}
            <div className="flex flex-col gap-[8px] pt-[4px]">
              {notes.length === 0 ? (
                <div className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[14px] text-center text-[#837565] dark:text-[#8e8680] text-[12px]">
                  {t(
                    "لا توجد ملاحظات إدارية مضافة بعد. يمكنك إضافة أول ملاحظة أعلاه.",
                    "No internal notes recorded yet. You can add the first note above."
                  )}
                </div>
              ) : (
                <>
                  <ul
                    role="list"
                    aria-label={t("قائمة الملاحظات الإدارية", "Internal notes")}
                    className="flex flex-col gap-[8px] list-none m-0 p-0"
                  >
                    {notesPagination.items.map((item) => (
                      <li
                        key={item.id}
                        className="bg-[#f5f3ef] dark:bg-[#281c15] border border-transparent dark:border-[#38271c] rounded-[4px] p-[10px] flex items-start gap-[10px]"
                      >
                        <div className="size-[32px] rounded-full bg-[#ffddb6] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60 text-[#7b4e00] dark:text-[#f3c27e] font-bold text-[12px] flex items-center justify-center shrink-0">
                          {localizeRoleOrTitle(item.authorName, isEn).trim().charAt(0) || (isEn ? "A" : "م")}
                        </div>

                        <div className="flex-1 flex flex-col gap-[2px] text-start min-w-0">
                          <div className="flex items-center justify-between gap-2 text-[11px]">
                            <span className="text-[#837565] dark:text-[#8e8680] shrink-0">
                              {formatNoteDate(item.createdAt, isEn)}
                            </span>
                            <div className="flex items-center gap-[4px] min-w-0 truncate">
                              <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] truncate">
                                {localizeRoleOrTitle(item.authorName, isEn)}
                              </span>
                              <span className="text-[#837565] dark:text-[#8e8680] font-normal shrink-0">
                                ({localizeRoleOrTitle(item.authorRole, isEn)})
                              </span>
                            </div>
                          </div>
                          <p className="text-[12px] text-[#514537] dark:text-[#cdc5bd] leading-[18px] break-words">
                            {item.note}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {notesPagination.totalPages > 1 && (
                    <div className="mt-[4px] pt-[12px] border-t border-[#f0eeea] dark:border-[#38271c] flex flex-wrap items-center justify-between gap-[10px] text-[11px] text-[#837565] dark:text-[#cdc5bd]">
                      <div className="flex items-center gap-1 tabular-nums">
                        <span>{t("عرض", "Showing")}</span>
                        <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                          {notesPagination.startItem}–{notesPagination.endItem}
                        </span>
                        <span>{t("من أصل", "of")}</span>
                        <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                          {notesPagination.totalItems}
                        </span>
                        <span>{t("ملاحظات", "notes")}</span>
                      </div>

                      <nav
                        aria-label={t("صفحات الملاحظات", "Notes pages")}
                        className="flex items-center gap-[4px]"
                      >
                        <button
                          type="button"
                          disabled={notesPagination.currentPage === 1}
                          onClick={() => setNotesPage(1)}
                          aria-label={t("الصفحة الأولى", "First page")}
                          className="size-[28px] rounded-[4px] bg-[#f5f3ef] dark:bg-[#281c15] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:border-[#9c6402]/50 dark:hover:border-[#e29d38]/50 hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <ChevronsRight
                            aria-hidden="true"
                            className={cn("size-[13px]", isEn && "rotate-180")}
                          />
                        </button>

                        <button
                          type="button"
                          disabled={notesPagination.currentPage === 1}
                          onClick={() => setNotesPage((p) => Math.max(1, p - 1))}
                          className="h-[28px] px-[8px] rounded-[4px] bg-[#f5f3ef] dark:bg-[#281c15] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:border-[#9c6402]/50 dark:hover:border-[#e29d38]/50 hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-[3px] font-semibold transition-colors cursor-pointer"
                        >
                          <ChevronRight
                            aria-hidden="true"
                            className={cn("size-[13px]", isEn && "rotate-180")}
                          />
                          <span>{t("السابق", "Prev")}</span>
                        </button>

                        <div className="flex items-center gap-[4px] px-[2px]">
                          {visibleNotePages.map((pageItem) => {
                            if (typeof pageItem === "string") {
                              return (
                                <span
                                  key={pageItem}
                                  aria-hidden="true"
                                  className="px-[4px] text-[#837565] dark:text-[#8e8680] font-bold select-none"
                                >
                                  ...
                                </span>
                              );
                            }
                            const isActive = pageItem === notesPagination.currentPage;
                            return (
                              <button
                                key={pageItem}
                                type="button"
                                onClick={() => setNotesPage(pageItem)}
                                aria-label={t(`صفحة ${pageItem}`, `Page ${pageItem}`)}
                                aria-current={isActive ? "page" : undefined}
                                className={cn(
                                  "min-w-[28px] h-[28px] px-[6px] rounded-[4px] text-[11px] font-bold tabular-nums flex items-center justify-center transition-all cursor-pointer",
                                  isActive
                                    ? "bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] shadow-sm"
                                    : "bg-[#f5f3ef] dark:bg-[#281c15] border border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:border-[#9c6402]/50 dark:hover:border-[#e29d38]/50 hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7]"
                                )}
                              >
                                {pageItem}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          type="button"
                          disabled={notesPagination.currentPage >= notesPagination.totalPages}
                          onClick={() =>
                            setNotesPage((p) =>
                              Math.min(notesPagination.totalPages, p + 1)
                            )
                          }
                          className="h-[28px] px-[8px] rounded-[4px] bg-[#f5f3ef] dark:bg-[#281c15] border border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:border-[#9c6402]/50 dark:hover:border-[#e29d38]/50 hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-[3px] font-semibold transition-colors cursor-pointer"
                        >
                          <span>{t("التالي", "Next")}</span>
                          <ChevronLeft
                            aria-hidden="true"
                            className={cn("size-[13px]", isEn && "rotate-180")}
                          />
                        </button>

                        <button
                          type="button"
                          disabled={notesPagination.currentPage >= notesPagination.totalPages}
                          onClick={() => setNotesPage(notesPagination.totalPages)}
                          aria-label={t("الصفحة الأخيرة", "Last page")}
                          className="size-[28px] rounded-[4px] bg-[#f5f3ef] dark:bg-[#281c15] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:border-[#9c6402]/50 dark:hover:border-[#e29d38]/50 hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <ChevronsLeft
                            aria-hidden="true"
                            className={cn("size-[13px]", isEn && "rotate-180")}
                          />
                        </button>
                      </nav>
                    </div>
                  )}
                </>
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
        office={displayOffice ? { ...displayOffice, plan: currentPlan } : null}
        initialBillingCycle={upgradeCycle || (isMonthly ? "monthly" : "annual")}
        onConfirmUpgrade={(officeId, newPlanName) => {
          setUpgradedPlanByOffice((prev) => ({
            ...prev,
            [String(officeId || displayOffice.id)]: newPlanName,
          }));
          if (displayOffice && onUpgradePlan) {
            onUpgradePlan(displayOffice, newPlanName);
          }
        }}
      />

      {/* Annual Subscription Benefits Modal / Popup */}
      <AnnualPlanBenefitsModal
        isOpen={isAnnualBenefitsModalOpen}
        onClose={() => setIsAnnualBenefitsModalOpen(false)}
        office={displayOffice ? { ...displayOffice, plan: currentPlan } : null}
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
