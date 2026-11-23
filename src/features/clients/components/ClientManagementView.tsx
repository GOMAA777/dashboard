"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { ClientManagementHeader } from "./ClientManagementHeader";
import { ClientKpiMetrics } from "./ClientKpiMetrics";
import { ClientManagementTable } from "./ClientManagementTable";
import { AddClientOfficeView, OfficeFormData } from "./AddClientOfficeView";
import { ClientOfficeDetailsView } from "./ClientOfficeDetailsView";
import { ClientSubscriptionsInvoicesView } from "./ClientSubscriptionsInvoicesView";
import { EnterOfficeConfirmModal, type OfficeEntryActivityPayload } from "./EnterOfficeConfirmModal";
import { DeactivateOfficeModal } from "./DeactivateOfficeModal";
import { DeleteOfficeModal } from "./DeleteOfficeModal";
import { OfficeCredentialsCreatedModal } from "./OfficeCredentialsCreatedModal";
import { ResetFirmPasswordModal } from "./ResetFirmPasswordModal";
import { syncFirmOwnerPassword, uploadCompanyBranding } from "@/lib/api/users";
import { usePermissions } from "@/lib/permissions";
import { ClientOffice, OfficeInternalNote } from "../types/client.types";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { ClientsPageSkeleton } from "./ClientsPageSkeleton";
import { useQueryClient } from "@tanstack/react-query";
import {
  useFirmsQuery,
  useFirmDetailQuery,
  invalidateClientsQueries,
} from "../hooks/useClientsQuery";
import { InvalidationGraph } from "@/lib/query-keys";
import { useLanguage } from "@/lib/i18n";
import {
  fetchFirms,
  fetchFirmById,
  createFirm,
  updateFirm,
  updateFirmStatus,
  deleteFirm,
  addFirmNote,
} from "@/lib/api/firms";
import { getLocalCustomPlans } from "@/lib/api/plans";
import {
  mapFirmToClientOffice,
  normalizeLogoUrl,
  isDummyLogo,
  resolveOfficeLogo,
  saveLocalCustomLogo,
  removeLocalCustomLogo,
  getLocalCustomLogo,
  saveLocalCustomTaxNumber,
  getLocalCustomTaxNumber,
  saveLocalCustomAutoRenew,
  getLocalCustomAutoRenew,
  saveLocalCustomStatus,
  getLocalCustomStatus,
  saveLocalCustomThemeColor,
  getLocalCustomThemeColor,
  saveLocalCustomBackgroundColor,
  getLocalCustomBackgroundColor,
  saveLocalCustomOfficeId,
  getLocalCustomOfficeId,
  saveLocalCustomSecondaryColor,
  getLocalCustomSecondaryColor,
  getLocalCustomFirmPlan,
  saveLocalCustomFirmPlan,
} from "@/lib/api/mappers";
import {
  upgradeSubscription,
  updateSubscriptionStatus,
} from "@/lib/api/subscriptions";
import { unwrapData } from "@/lib/api/helpers";
import { ApiError } from "@/lib/api/http";
import { enterOfficeAsAdmin } from "@/lib/api/enter-office";
import { buildInitialHandoffUrl, openInstantHandoffTab } from "@/lib/api/lawyer-session";

function dataUrlToFile(dataUrl: string, filename = "firm-logo.png"): File | null {
  try {
    const arr = dataUrl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  } catch {
    return null;
  }
}

export function ClientManagementView() {
  const { t, isEn } = useLanguage();
  const { hasPermission } = usePermissions();
  const searchParams = useSearchParams();
  const router = useRouter();
  const officeIdParam = searchParams?.get("officeId");
  const actionParam = searchParams?.get("action");

  const [offices, setOffices] = useState<ClientOffice[]>([]);
  const queryClient = useQueryClient();
  const firmsQuery = useFirmsQuery({ status: "all", page: 1, per_page: 100 });
  const [officesRetryKey, setOfficesRetryKey] = useState(0);
  const [activeOfficeId, setActiveOfficeId] = useState<string | null>(
    actionParam === "add" || actionParam === "enter" ? null : officeIdParam || null
  );
  const firmDetailQuery = useFirmDetailQuery(activeOfficeId);
  const [editingOfficeId, setEditingOfficeId] = useState<string | null>(
    actionParam === "edit" ? officeIdParam || null : null
  );
  const [isAddingNew, setIsAddingNew] = useState<boolean>(actionParam === "add");
  const [billingOfficeId, setBillingOfficeId] = useState<string | null>(
    actionParam === "billing" ? officeIdParam || null : null
  );
  const [officeToEnter, setOfficeToEnter] = useState<ClientOffice | null>(null);
  const [isEnteringOffice, setIsEnteringOffice] = useState(false);

  // Sync view state when URL search params change
  useEffect(() => {
    setActiveOfficeId(
      actionParam === "add" || actionParam === "enter" || actionParam === "billing"
        ? null
        : officeIdParam || null
    );
    setEditingOfficeId(actionParam === "edit" ? officeIdParam || null : null);
    setIsAddingNew(actionParam === "add");
    setBillingOfficeId(actionParam === "billing" ? officeIdParam || null : null);
  }, [officeIdParam, actionParam]);

  const effectiveOffices: ClientOffice[] = useMemo(() => {
    const list = offices.length > 0 ? offices : (firmsQuery.data?.items?.map(mapFirmToClientOffice) || []);
    return list.filter((f) => {
      const idStr = String(f.id);
      const nameStr = String(f.name || "");
      if (idStr === "146" || nameStr.includes("طاقم العمل")) return false;
      if (idStr === "129") return false;
      return true;
    });
  }, [offices, firmsQuery.data]);

  const selectedOffice = activeOfficeId
    ? effectiveOffices.find((o) => String(o.id) === String(activeOfficeId)) || null
    : null;

  const billingOffice = billingOfficeId
    ? effectiveOffices.find((o) => String(o.id) === String(billingOfficeId)) || null
    : null;

  const officeToEdit = editingOfficeId
    ? effectiveOffices.find((o) => String(o.id) === String(editingOfficeId)) || null
    : null;

  const currentView: "list" | "add" | "details" | "billing" =
    billingOffice
        ? "billing"
        : isAddingNew || officeToEdit
          ? "add"
          : selectedOffice
            ? "details"
            : "list";

  // Modals state
  const [officeToDeactivate, setOfficeToDeactivate] = useState<ClientOffice | null>(null);
  const [officeToDelete, setOfficeToDelete] = useState<ClientOffice | null>(null);
  const [officeToResetPassword, setOfficeToResetPassword] = useState<ClientOffice | null>(null);
  const [createdCredentials, setCreatedCredentials] = useState<{
    officeName: string;
    ownerName: string;
    email: string;
    password: string;
  } | null>(null);

  useEffect(() => {
    if (firmsQuery.data?.items) {
      const visibleFirms = firmsQuery.data.items.filter((item) => {
        const idStr = String(item.id);
        const nameStr = String(item.name || "");
        if (idStr === "146" || nameStr.includes("طاقم العمل")) return false;
        if (idStr === "129") return false;
        return true;
      });
      const fresh = visibleFirms.map(mapFirmToClientOffice);
      setOffices((prev) => {
        if (!prev || prev.length === 0) return fresh;
        return fresh.map((f) => {
          const existing = prev.find((p) => String(p.id) === String(f.id));
          if (!existing) return f;
          return {
            ...f,
            internalNotes: (existing.internalNotes && existing.internalNotes.length > 0)
              ? existing.internalNotes
              : f.internalNotes,
            resourceUsage: existing.resourceUsage || f.resourceUsage,
            activeSubscriptionDetails: existing.activeSubscriptionDetails || f.activeSubscriptionDetails,
            recentInvoices: existing.recentInvoices || f.recentInvoices,
            recentTickets: existing.recentTickets || f.recentTickets,
          };
        });
      });
    }
  }, [firmsQuery.data]);

  useEffect(() => {
    if (!firmDetailQuery.data) return;
    const rawData = (unwrapData<Record<string, unknown>>(firmDetailQuery.data) || firmDetailQuery.data) as Record<string, unknown>;
    const firm = (rawData.firm || rawData) as Record<string, unknown>;
    if (!firm?.id) return;
    const mapped = mapFirmToClientOffice(rawData);
    setOffices((prev) => {
      const exists = prev.some((o) => String(o.id) === String(mapped.id));
      if (!exists) return [mapped, ...prev];
      return prev.map((o) => {
        if (String(o.id) !== String(mapped.id)) return o;
        const localRenew = getLocalCustomAutoRenew(String(o.id));
        const effectiveRenew = localRenew !== undefined ? localRenew : (o.autoRenew !== undefined ? o.autoRenew : mapped.autoRenew);
        const effectiveNotes = (mapped.internalNotes && mapped.internalNotes.length > 0)
          ? mapped.internalNotes
          : o.internalNotes;
        return {
          ...o,
          ...mapped,
          internalNotes: effectiveNotes,
          autoRenew: effectiveRenew,
          activeSubscriptionDetails: mapped.activeSubscriptionDetails
            ? { ...mapped.activeSubscriptionDetails, autoRenew: effectiveRenew }
            : o.activeSubscriptionDetails
            ? { ...o.activeSubscriptionDetails, autoRenew: effectiveRenew }
            : undefined,
          taxNumber: mapped.taxNumber || o.taxNumber || getLocalCustomTaxNumber(String(o.id)),
          logo: mapped.logo || resolveOfficeLogo(o.logo, o.id),
        };
      });
    });
  }, [firmDetailQuery.data]);

  const isLoadingOffices = firmsQuery.isLoading && effectiveOffices.length === 0;
  const officesError = firmsQuery.error
    ? (firmsQuery.error instanceof Error ? firmsQuery.error.message : "تعذر تحميل قائمة المكاتب.")
    : null;

  // Handlers
  const handleBackToList = () => {
    setActiveOfficeId(null);
    setEditingOfficeId(null);
    setIsAddingNew(false);
    setBillingOfficeId(null);
    router.push("/accounts");
  };

  const handleEnterOfficeAsAdmin = (office: ClientOffice) => {
    setOfficeToEnter(office);
  };

  const handleConfirmEnterOffice = async (activityData?: OfficeEntryActivityPayload) => {
    if (!officeToEnter || isEnteringOffice) return;
    setIsEnteringOffice(true);
    const office = officeToEnter;

    // Open handoff tab synchronously in a new tab (_blank) on user click to prevent popup blockers
    const handoff = openInstantHandoffTab({
      id: office.id,
      firm_name: office.name,
      name: office.owner,
    });

    try {
      const handoffUrl = await enterOfficeAsAdmin(
        {
          id: office.id,
          companyId: office.companyId,
          name: office.name,
          owner: office.owner,
          email: office.email,
          phone: office.phone,
          primaryColor: office.primaryColor || office.themeColor,
          secondaryColor: office.secondaryColor,
          logo: office.logo,
          officeId: office.officeId,
        },
        activityData
      );
      toast.success(
        t(
          `جاري الربط وفتح لوحة مكتب «${office.name}» في تبويب جديد...`,
          `Connecting and opening "${office.name}" dashboard in a new tab...`
        )
      );
      setOfficeToEnter(null);

      // Commit handoff url directly to the opened new tab
      handoff.commit(handoffUrl);
    } catch (err: unknown) {
      handoff.abort();
      console.warn("Failed to enter office as admin:", err);
      let message = t("تعذر فتح بوابة الدخول للمكتب. حاول مرة أخرى.", "Unable to open office portal. Please try again.");
      if (err instanceof ApiError) {
        if (err.status === 401) {
          message = t("انتهت صلاحية جلسة الأدمن (401). يرجى تسجيل الدخول بحساب أدمن مصرح.", "Admin session expired (401). Please sign in with an authorized admin account.");
        } else if (err.status === 404) {
          message = t(`المكتب المطلوب غير موجود على الخادم (404: مكتب #${office.companyId || office.id}).`, `Office not found on server (404: Office #${office.companyId || office.id}).`);
        } else if (err.status === 0) {
          message = t("تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت أو إعدادات CORS.", "Unable to connect to server. Please check internet connection or CORS settings.");
        } else if (String(err.message || "").includes("SaasImpersonationLog")) {
          message = t("تعذر الدخول للمكتب: خطأ في خادم الـ API (الموديل SaasImpersonationLog غير معرف في الـ Backend على السيرفر).", "Unable to enter office: API Server error (SaasImpersonationLog model undefined on backend).");
        } else if (err.message) {
          message = err.message;
        }
      } else if (err instanceof Error && err.message) {
        if (err.message.includes("SaasImpersonationLog")) {
          message = t("تعذر الدخول للمكتب: خطأ في خادم الـ API (الموديل SaasImpersonationLog غير معرف في الـ Backend على السيرفر).", "Unable to enter office: API Server error (SaasImpersonationLog model undefined on backend).");
        } else {
          message = err.message;
        }
      }
      toast.error(message);
      setIsEnteringOffice(false);
    }
  };

  const handleStartAddOffice = () => {
    setActiveOfficeId(null);
    setEditingOfficeId(null);
    setIsAddingNew(true);
    setBillingOfficeId(null);
    router.push("/accounts?action=add");
  };

  const handleStartEditOffice = (office: ClientOffice) => {
    setActiveOfficeId(null);
    setEditingOfficeId(office.id);
    setIsAddingNew(false);
    setBillingOfficeId(null);
    router.push(`/accounts?officeId=${office.id}&action=edit`);
  };

  const handleSaveOffice = async (data: OfficeFormData, isEdit: boolean) => {
    const cleanLicense = data.licenseNumber
      ? data.licenseNumber.replace("ترخيص عدلي: ", "").trim()
      : "";
    const rawPhoneClean = (data.phone || "").replace(/^\+966\s*0?/, "").replace(/^0/, "").trim();
    const cleanPhone = rawPhoneClean ? `+966 ${rawPhoneClean}` : "";
    const isUnlimited =
      data.planType === "unlimited" ||
      data.planType === "special" ||
      data.plan === "غير محدود" ||
      data.plan === "خطة مميزة" ||
      String(data.plan || "").includes("غير محدود") ||
      String(data.plan || "").includes("خطة مميزة");
    const isTrial =
      !isUnlimited &&
      (data.planType === "trial" ||
      data.planType === "free_trial" ||
      String(data.plan || "").includes("تجرب"));
    const cleanPlan = isUnlimited
      ? "غير محدود"
      : data.plan
      ? data.plan.replace(/\s*-\s*تجربة\s*مجانية/gi, "").replace(/\s*\(تجربة\s*مجانية\)/gi, "").trim()
      : (data.plan || "باقة المحاماة");
    const trialDays = Number((data as any).trialDays) || 14;

    const targetPlanType = isUnlimited ? "special" : isTrial ? "trial" : "paid";
    const safePlanType = isUnlimited ? "special" : isTrial ? "trial" : "paid";
    const targetSubscriptionPlan = isUnlimited ? "special" : isTrial ? "trial" : "paid";
    const isCycleAnnual = !data.billingCycle || Boolean(
      data.billingCycle?.includes("سنو") ||
      data.billingCycle?.includes("year") ||
      data.billingCycle?.includes("annu")
    );
    const cleanBilling = isCycleAnnual ? "yearly" : "monthly";
    const isAutoRenew = data.autoRenew !== false;
    const cleanTaxNumber = data.taxNumber || (officeToEdit?.taxNumber) || "";
    const extraLawyers = Number(data.extraLawyers ?? 0);
    const extraStorageGb = Number(data.extraStorageGb ?? 0);
    const extraCases = Number(data.extraCases ?? 0);
    const usedStorageGb = String(data.usedStorageGb || "0.00");
    const initialPassword =
      data.password && data.password !== "••••••••••••"
        ? data.password
        : `LawPass#${Math.floor(100000 + Math.random() * 900000)}`;

    const rawStatus = String(data.status || "");
    const isOfficeInactive = rawStatus === "inactive" || rawStatus === "suspended";
    const targetApiStatus: "active" | "inactive" = isOfficeInactive ? "inactive" : "active";
    const firmDbStatus = targetApiStatus;
    const resolvedPlanId = (() => {
      if (isUnlimited) return undefined;
      const raw = data.planId;
      if (raw !== undefined && raw !== null && raw !== "" && raw !== "unlimited" && raw !== "custom" && raw !== -1) {
        const asStr = String(raw).trim();
        if (/^\d+$/.test(asStr)) {
          const n = Number(asStr);
          if (n > 0) return n;
        }
      }
      try {
        const localCustomPlans = getLocalCustomPlans();
        const matched = localCustomPlans.find((p) => p.name === cleanPlan || (cleanPlan && cleanPlan.includes(p.name)));
        if (matched && /^\d+$/.test(String(matched.id))) {
          return Number(matched.id);
        }
      } catch {}
      if (officeToEdit?.planId && /^\d+$/.test(String(officeToEdit.planId))) {
        return Number(officeToEdit.planId);
      }
      return undefined;
    })();
    const targetAccountStatus: ClientOffice["accountStatus"] = isOfficeInactive
      ? {
          label: "غير نشط",
          type: "suspended",
          bgClass: "bg-[#fef2f2] dark:bg-[#2c1313]",
          textClass: "text-[#dc2626] dark:text-[#f87171]",
          dotClass: "bg-[#dc2626] dark:bg-[#ef4444]",
        }
      : {
          label: "نشط",
          type: "active",
          bgClass: "bg-[#e8f5e9] dark:bg-[#132c1c]",
          textClass: "text-[#1b7340] dark:text-[#6ee7b7]",
          dotClass: "bg-[#1b7340] dark:bg-[#10b981]",
        };

    if (!isTrial && !isUnlimited && !cleanPlan && resolvedPlanId == null) {
      toast.error(t("يلزم اختيار باقة اشتراك صالحة قبل الحفظ", "A valid subscription plan must be selected before saving"));
      return;
    }

    let payload: Record<string, unknown> | FormData;

    const isFileObject = (obj: unknown): obj is File => {
      if (!obj) return false;
      if (typeof File !== "undefined" && obj instanceof File) return true;
      if (typeof Blob !== "undefined" && obj instanceof Blob && typeof (obj as { name?: unknown }).name === "string") return true;
      return Boolean(
        typeof obj === "object" &&
        typeof (obj as File).name === "string" &&
        typeof (obj as File).size === "number" &&
        typeof (obj as File).slice === "function"
      );
    };

    const effectiveLogoFile: File | null = isFileObject(data.logoFile) ? data.logoFile : null;

    const finalColor = data.accentColor || data.themeColor || data.primaryColor || "#d5a058";
    const finalFontColor = data.fontColor || data.secondaryColor || "#FFFFFF";
    const finalBgColor = data.backgroundColor || "#203b3c";

    if (effectiveLogoFile) {
      const fd = new FormData();
      fd.append("name", data.name);
      fd.append("owner_name", data.owner);
      if (cleanLicense) fd.append("license_number", cleanLicense);
      fd.append("email", data.email);
      fd.append("phone", cleanPhone);
      if (data.landline) fd.append("landline", data.landline);
      fd.append("city", data.city);
      if (data.address) fd.append("address", data.address);
      if (cleanTaxNumber) fd.append("tax_number", cleanTaxNumber);
      fd.append("plan_name", isUnlimited ? "خطة مميزة" : cleanPlan);
      fd.append("plan", isUnlimited ? "خطة مميزة" : cleanPlan);
      fd.append("plan_type", safePlanType);
      fd.append("subscription_plan", targetSubscriptionPlan);
      fd.append("status", firmDbStatus);
      if (resolvedPlanId != null && !isUnlimited) {
        fd.append("plan_id", String(resolvedPlanId));
      }
      fd.append("billing_cycle", cleanBilling);
      fd.append("auto_renew", isAutoRenew ? "1" : "0");
      fd.append("used_storage_gb", usedStorageGb);
      fd.append("extra_lawyers", String(extraLawyers));
      fd.append("extra_storage_gb", String(extraStorageGb));
      fd.append("extra_cases", String(extraCases));
      if (!isEdit || (data.password && data.password !== "••••••••••••")) {
        fd.append("password", data.password || initialPassword);
      }

      fd.append("color", finalColor);
      fd.append("theme_color", finalColor);
      fd.append("primary_color", finalColor);
      fd.append("font_color", finalFontColor);
      fd.append("secondary_color", finalFontColor);
      fd.append("background_color", finalBgColor);
      if (data.officeId) {
        fd.append("office_id", data.officeId);
        fd.append("slug", data.officeId);
      }
      fd.append("logo", effectiveLogoFile, effectiveLogoFile.name || "logo.png");
      payload = fd;
    } else {
      payload = {
        name: data.name,
        owner_name: data.owner,
        license_number: cleanLicense,
        email: data.email,
        phone: cleanPhone,
        landline: data.landline || null,
        city: data.city,
        address: data.address || (data.city ? `المملكة العربية السعودية - ${data.city}` : null),
        tax_number: cleanTaxNumber || null,
        office_id: data.officeId || null,
        slug: data.officeId || null,
        color: finalColor,
        theme_color: finalColor,
        primary_color: finalColor,
        secondary_color: finalFontColor,
        font_color: finalFontColor,
        background_color: finalBgColor,
        plan_name: isUnlimited ? "خطة مميزة" : cleanPlan,
        plan: isUnlimited ? "خطة مميزة" : cleanPlan,
        plan_type: safePlanType,
        subscription_plan: targetSubscriptionPlan,
        status: firmDbStatus,
        plan_id: isUnlimited ? null : (resolvedPlanId ?? null),
        billing_cycle: cleanBilling,
        auto_renew: isAutoRenew,
        used_storage_gb: usedStorageGb,
        extra_lawyers: extraLawyers,
        extra_storage_gb: extraStorageGb,
        extra_cases: extraCases,
        password: isEdit
          ? (data.password && data.password !== "••••••••••••" ? data.password : undefined)
          : initialPassword,
      };
    }

    if (isEdit && officeToEdit) {
      saveLocalCustomAutoRenew(officeToEdit.id, isAutoRenew);
      if (officeToEdit.companyId) {
        saveLocalCustomAutoRenew(officeToEdit.companyId, isAutoRenew);
      }
      if (data.backgroundColor) {
        saveLocalCustomBackgroundColor(officeToEdit.id, data.backgroundColor);
        if (officeToEdit.companyId) {
          saveLocalCustomBackgroundColor(officeToEdit.companyId, data.backgroundColor);
        }
      }
      if (data.themeColor) {
        saveLocalCustomThemeColor(officeToEdit.id, data.themeColor);
        if (officeToEdit.companyId) {
          saveLocalCustomThemeColor(officeToEdit.companyId, data.themeColor);
        }
      }
      if (data.logoFile === null && !data.logoUrl) {
        removeLocalCustomLogo(officeToEdit.id);
      }
      if (data.taxNumber) {
        saveLocalCustomTaxNumber(officeToEdit.id, data.taxNumber);
      }
      if (data.officeId) {
        saveLocalCustomOfficeId(officeToEdit.id, data.officeId);
        if (officeToEdit.companyId) {
          saveLocalCustomOfficeId(officeToEdit.companyId, data.officeId);
        }
      }
      if (data.secondaryColor) {
        saveLocalCustomSecondaryColor(officeToEdit.id, data.secondaryColor);
        if (officeToEdit.companyId) {
          saveLocalCustomSecondaryColor(officeToEdit.companyId, data.secondaryColor);
        }
      }
      if (effectiveLogoFile && typeof FileReader !== "undefined") {
        try {
          const reader = new FileReader();
          reader.onload = () => {
            const res = reader.result;
            if (typeof res === "string" && res.startsWith("data:image/")) {
              saveLocalCustomLogo(officeToEdit.id, res);
              if (officeToEdit.companyId) {
                saveLocalCustomLogo(officeToEdit.companyId, res);
              }
            }
          };
          reader.readAsDataURL(effectiveLogoFile);
        } catch {}
      }
      saveLocalCustomFirmPlan(officeToEdit.id, {
        plan: isUnlimited ? "غير محدود" : isTrial ? `${cleanPlan} (تجربة مجانية)` : cleanPlan,
        planId: isUnlimited ? undefined : resolvedPlanId ? Number(resolvedPlanId) : undefined,
        planType: targetPlanType,
        billingCycle: cleanBilling,
      });
      if (officeToEdit.companyId) {
        saveLocalCustomFirmPlan(officeToEdit.companyId, {
          plan: isUnlimited ? "غير محدود" : isTrial ? `${cleanPlan} (تجربة مجانية)` : cleanPlan,
          planId: isUnlimited ? undefined : resolvedPlanId ? Number(resolvedPlanId) : undefined,
          planType: targetPlanType,
          billingCycle: cleanBilling,
        });
      }
      let returnedEditLogo = officeToEdit.logo;
      try {
        const updateRes = await updateFirm(officeToEdit.id, payload);
        const unwrapped = (unwrapData<Record<string, unknown>>(updateRes) || updateRes) as Record<string, unknown>;
        const updatedFirm = (unwrapped?.firm || unwrapped?.data || unwrapped) as Record<string, unknown>;
        if (updatedFirm?.logo && typeof updatedFirm.logo === "string" && !isDummyLogo(updatedFirm.logo)) {
          const normLogo = normalizeLogoUrl(updatedFirm.logo);
          if (normLogo) {
            returnedEditLogo = normLogo;
            saveLocalCustomLogo(officeToEdit.id, normLogo);
            if (officeToEdit.companyId) {
              saveLocalCustomLogo(officeToEdit.companyId, normLogo);
            }
          }
        }
        // Always synchronize status endpoint so API reflects whether active or inactive
        try {
          await updateFirmStatus(
            officeToEdit.id,
            targetApiStatus,
            isOfficeInactive ? "تعطيل الحساب من نموذج تعديل المكتب" : "تنشيط الحساب من نموذج تعديل المكتب"
          );
        } catch {
          // Status endpoint error handled gracefully
        }

        // Synchronize subscription if firm has an active subscription and not unlimited
        if (officeToEdit.activeSubscriptionDetails?.id && !isUnlimited && resolvedPlanId) {
          try {
            await upgradeSubscription(officeToEdit.activeSubscriptionDetails.id, {
              new_plan_id: Number(resolvedPlanId),
              billing_cycle: cleanBilling,
            });
            if (!isTrial) {
              await updateSubscriptionStatus(officeToEdit.activeSubscriptionDetails.id, "active");
            }
          } catch (subErr) {
            console.warn("Could not sync subscription details:", subErr);
          }
        }

        // Synchronize password if updated
        if (data.password && data.password !== "••••••••••••") {
          const pwdSync = await syncFirmOwnerPassword(officeToEdit.id, data.password);
          if (!pwdSync.success) {
            toast.error(pwdSync.error);
          }
        }

        // Synchronize branding (logo file + color) via company endpoint
        if (effectiveLogoFile || data.themeColor) {
          try {
            const brandRes = await uploadCompanyBranding(officeToEdit.id, {
              color: data.themeColor,
              logoFile: effectiveLogoFile,
            });
            if (brandRes?.logo) {
              const normLogo = normalizeLogoUrl(brandRes.logo);
              if (normLogo) {
                returnedEditLogo = normLogo;
                saveLocalCustomLogo(officeToEdit.id, normLogo);
                if (officeToEdit.companyId) {
                  saveLocalCustomLogo(officeToEdit.companyId, normLogo);
                }
              }
            }
          } catch (brandErr) {
            console.warn("Could not sync branding for office:", brandErr);
          }
        }

        saveLocalCustomStatus(officeToEdit.id, isOfficeInactive ? "suspended" : "active");
        const statusLabel = isOfficeInactive ? t("غير نشط", "Inactive") : t("نشط", "Active");
        toast.success(t(`تم حفظ تعديلات مكتب "${data.name}" بنجاح (${statusLabel})`, `Saved updates for "${data.name}" (${statusLabel})`));

        if (data.logoUrl?.startsWith("blob:")) {
          try {
            URL.revokeObjectURL(data.logoUrl);
          } catch {}
        }
      } catch (err: unknown) {
        const msg = (err as { message?: string })?.message || t("فشل تحديث بيانات المكتب", "Failed to update office data");
        toast.error(msg);
        throw err;
      }

      setOffices((prev) =>
        prev.map((o) => {
          if (String(o.id) !== String(officeToEdit.id)) return o;
          return {
            ...o,
            name: data.name,
            owner: data.owner,
            licenseNumber: cleanLicense
              ? cleanLicense.startsWith("ترخيص عدلي: ")
                ? cleanLicense
                : `ترخيص عدلي: ${cleanLicense}`
              : o.licenseNumber,
            email: data.email,
            phone: cleanPhone || (data.phone.startsWith("+966") ? data.phone : `+966 ${data.phone}`),
            landline: data.landline || o.landline,
            address: data.address || o.address,
            taxNumber: cleanTaxNumber || o.taxNumber || getLocalCustomTaxNumber(o.id),
            city: data.city || o.city,
            country: "المملكة العربية السعودية",
            plan: isUnlimited ? "غير محدود" : isTrial ? `${cleanPlan} (تجربة مجانية)` : cleanPlan,
            planId: isUnlimited ? undefined : resolvedPlanId != null ? resolvedPlanId : o.planId,
            planType: targetPlanType,
            subscriptionPlan: targetSubscriptionPlan,
            billingCycle: cleanBilling === "yearly" ? "سنوي" : "شهري",
            autoRenew: isAutoRenew,
            usedStorageGb,
            extraLawyers,
            extraStorageGb,
            extraCases,
            planDetails: isUnlimited
              ? {
                  id: 0,
                  name: "خطة مميزة",
                  badge: "خطة مميزة (صلاحيات كاملة)",
                  badgeColor: "gold",
                  type: "special",
                  monthlyPrice: "0",
                  yearlyPrice: "0",
                  maxLawyers: 999999,
                  storageLimitGb: 999999,
                  maxCases: 999999,
                  supportLevel: "دعم مباشر VIP شامل",
                  features: [
                    "صلاحيات كاملة وغير محدودة للنظام",
                    "ربط مباشر مع منصة ناجز ووزارة العدل",
                    "الفوترة الإلكترونية ZATCA المرحلة 2",
                    "تقارير مؤشرات الأداء والتحليلات القضائية",
                    "مدير حساب استشاري مخصص VIP",
                    "تكامل API خاص لأنظمة ERP",
                    "دعم فني فوري مخصص 24/7",
                  ],
                }
              : data.planDetails || o.planDetails,
            activeSubscriptionDetails: o.activeSubscriptionDetails
              ? {
                  ...o.activeSubscriptionDetails,
                  planId: isUnlimited ? undefined : resolvedPlanId,
                  billingCycle: cleanBilling === "yearly" ? "سنوي" : "شهري",
                  autoRenew: isAutoRenew,
                  taxNumber: cleanTaxNumber || o.taxNumber,
                  usedStorageGb,
                  extraLawyers,
                  extraStorageGb,
                  extraCases,
                  status: isOfficeInactive ? "inactive" : isUnlimited ? "unlimited" : isTrial ? "trial" : "active",
                }
              : undefined,
            logo: returnedEditLogo || (o.logo && !o.logo.startsWith("blob:") ? o.logo : undefined) || resolveOfficeLogo(o.logo, o.id),
            officeId: data.officeId || o.officeId,
            slug: data.officeId || o.slug,
            backgroundColor: finalBgColor,
            fontColor: finalFontColor,
            themeColor: finalColor,
            color: finalColor,
            primaryColor: finalColor,
            secondaryColor: finalFontColor,
            initialPassword: data.password || o.initialPassword,
            accountStatus: targetAccountStatus,
            subscriptionStatus: isOfficeInactive
              ? o.subscriptionStatus
              : isUnlimited
              ? {
                  label: "غير محدود",
                  type: "unlimited",
                  bgClass: "bg-[#f5f3ef] dark:bg-[#281c15] border border-[#d8c29d] dark:border-[#5a4321]",
                  textClass: "text-[#9c6402] dark:text-[#e29d38]",
                }
              : {
                  label: isTrial ? "تجربة مجانية" : "اشتراك نشط",
                  type: isTrial ? "trial" : "active",
                  bgClass: isTrial ? "bg-[#fffbeb] dark:bg-[rgba(226,157,56,0.18)]" : "bg-[#ecfdf5] dark:bg-[#132c1c]",
                  textClass: isTrial ? "text-[#92400e] dark:text-[#f3c27e]" : "text-[#10b981] dark:text-[#6ee7b7]",
                },
          };
        })
      );
    } else {
      let createdOfficeId = `firm-${Date.now()}`;
      let returnedLogo: string | undefined = undefined;
      try {
        const res = await createFirm(payload);
        const unwrapped = (unwrapData<Record<string, unknown>>(res) || res) as Record<string, unknown>;
        const createdFirm = (unwrapped?.firm || unwrapped?.data || unwrapped) as Record<string, unknown>;
        const newId = String(createdFirm?.id || "");
        if (newId) createdOfficeId = newId;

        if (createdFirm?.logo && typeof createdFirm.logo === "string" && !isDummyLogo(createdFirm.logo)) {
          const normLogo = normalizeLogoUrl(createdFirm.logo);
          if (normLogo) {
            returnedLogo = normLogo;
            saveLocalCustomLogo(newId, normLogo);
          }
        }

        if (data.logoUrl?.startsWith("blob:")) {
          try {
            URL.revokeObjectURL(data.logoUrl);
          } catch {}
        }

        const effectivePassword =
          data.password && data.password !== "••••••••••••"
            ? data.password
            : initialPassword;

        // 1. Sync tax number, color, status, and subscription details via PUT immediately
        if (newId) {
          const secondaryPayload: Record<string, unknown> = {
            subscription_plan: targetSubscriptionPlan,
            plan_type: safePlanType,
            plan_name: isUnlimited ? "خطة مميزة" : cleanPlan,
            plan: isUnlimited ? "خطة مميزة" : cleanPlan,
            plan_id: isUnlimited ? null : (resolvedPlanId ?? null),
            billing_cycle: cleanBilling,
            auto_renew: isAutoRenew,
            used_storage_gb: usedStorageGb,
            extra_lawyers: extraLawyers,
            extra_storage_gb: extraStorageGb,
            extra_cases: extraCases,
          };
          if (data.taxNumber) {
            saveLocalCustomTaxNumber(newId, data.taxNumber);
            secondaryPayload.tax_number = data.taxNumber;
          }
          if (data.themeColor) {
            saveLocalCustomThemeColor(newId, data.themeColor);
            secondaryPayload.color = data.themeColor;
            secondaryPayload.theme_color = data.themeColor;
            secondaryPayload.primary_color = data.themeColor;
          }
          if (data.secondaryColor) {
            saveLocalCustomSecondaryColor(newId, data.secondaryColor);
            secondaryPayload.secondary_color = data.secondaryColor;
          }
          if (data.officeId) {
            saveLocalCustomOfficeId(newId, data.officeId);
            secondaryPayload.office_id = data.officeId;
            secondaryPayload.slug = data.officeId;
          }
          if (Object.keys(secondaryPayload).length > 0) {
            try {
              await updateFirm(newId, secondaryPayload);
            } catch (syncErr) {
              console.warn("Secondary firm sync via PUT:", syncErr);
            }
          }

          try {
            await updateFirmStatus(
              newId,
              targetApiStatus,
              isOfficeInactive
                ? "إضافة مكتب بحالة غير نشطة"
                : "إضافة وتفعيل حساب المكتب"
            );
          } catch (statusErr) {
            console.warn("Secondary updateFirmStatus failed:", statusErr);
          }

          // POST /admin/firms stores an owner password that never verifies on /login.
          const pwdSync = await syncFirmOwnerPassword(newId, effectivePassword);
          if (!pwdSync.success) {
            toast.error(pwdSync.error);
          }

          // Upload company branding (logo file + color)
          if (effectiveLogoFile || data.themeColor) {
            try {
              const brandRes = await uploadCompanyBranding(newId, {
                color: data.themeColor,
                logoFile: effectiveLogoFile,
              });
              if (brandRes?.logo) {
                const normLogo = normalizeLogoUrl(brandRes.logo);
                if (normLogo) {
                  returnedLogo = normLogo;
                  saveLocalCustomLogo(newId, normLogo);
                }
              }
            } catch (brandErr) {
              console.warn("uploadCompanyBranding on create:", brandErr);
            }
          }
        }

        // Display credentials modal once
        setCreatedCredentials({
          officeName: data.name,
          ownerName: data.owner,
          email: data.email,
          password: effectivePassword,
        });

        if (createdFirm?.logo && !isDummyLogo(String(createdFirm.logo))) {
          const normLogo = normalizeLogoUrl(String(createdFirm.logo));
          if (normLogo) {
            returnedLogo = normLogo;
            saveLocalCustomLogo(newId, normLogo);
          }
        }

        if (newId) {
          if (data.backgroundColor) {
            saveLocalCustomBackgroundColor(newId, data.backgroundColor);
            if (createdFirm?.company_id) {
              saveLocalCustomBackgroundColor(String(createdFirm.company_id), data.backgroundColor);
            }
          }
          if (data.themeColor) {
            saveLocalCustomThemeColor(newId, data.themeColor);
            if (createdFirm?.company_id) {
              saveLocalCustomThemeColor(String(createdFirm.company_id), data.themeColor);
            }
          }
          saveLocalCustomAutoRenew(newId, isAutoRenew);
          if (createdFirm?.company_id) {
            saveLocalCustomAutoRenew(String(createdFirm.company_id), isAutoRenew);
          }
          saveLocalCustomFirmPlan(newId, {
            plan: isUnlimited ? "غير محدود" : isTrial ? `${cleanPlan} (تجربة مجانية)` : cleanPlan,
            planId: isUnlimited ? undefined : resolvedPlanId ? Number(resolvedPlanId) : undefined,
            planType: targetPlanType,
            billingCycle: cleanBilling,
          });
          if (createdFirm?.company_id) {
            saveLocalCustomFirmPlan(String(createdFirm.company_id), {
              plan: isUnlimited ? "غير محدود" : isTrial ? `${cleanPlan} (تجربة مجانية)` : cleanPlan,
              planId: isUnlimited ? undefined : resolvedPlanId ? Number(resolvedPlanId) : undefined,
              planType: targetPlanType,
              billingCycle: cleanBilling,
            });
          }
          saveLocalCustomStatus(newId, isOfficeInactive ? "suspended" : "active");
        }
        if (data.backgroundColor) {
          saveLocalCustomBackgroundColor(createdOfficeId, data.backgroundColor);
        }
        if (data.themeColor) {
          saveLocalCustomThemeColor(createdOfficeId, data.themeColor);
        }
        if (data.secondaryColor) {
          saveLocalCustomSecondaryColor(createdOfficeId, data.secondaryColor);
        }
        if (data.officeId) {
          saveLocalCustomOfficeId(createdOfficeId, data.officeId);
        }
        saveLocalCustomAutoRenew(createdOfficeId, isAutoRenew);
        saveLocalCustomFirmPlan(createdOfficeId, {
          plan: isUnlimited ? "غير محدود" : isTrial ? `${cleanPlan} (تجربة مجانية)` : cleanPlan,
          planId: isUnlimited ? undefined : resolvedPlanId ? Number(resolvedPlanId) : undefined,
          planType: targetPlanType,
          billingCycle: cleanBilling,
        });
        saveLocalCustomStatus(createdOfficeId, isOfficeInactive ? "suspended" : "active");
        const statusLabel = isOfficeInactive ? t("حساب غير نشط", "Inactive") : t("حساب نشط", "Active");
        toast.success(t(`تمت إضافة مكتب "${data.name}" بنجاح (${statusLabel})`, `Office "${data.name}" added successfully (${statusLabel})`));
      } catch (err: unknown) {
        let msg = (err as { message?: string })?.message || t("فشل إضافة مكتب المحاماة", "Failed to add law office");
        if (
          (err as { status?: number })?.status === 422 ||
          msg.includes("validation") ||
          msg.includes("required") ||
          msg.includes("بيانات")
        ) {
          msg = t("يرجى إكمال البيانات لمواصلة التسجيل", "Please complete required fields to proceed");
        }
        toast.error(msg);
        throw err;
      }

      const newlyCreatedOffice: ClientOffice = {
        id: createdOfficeId,
        officeId: data.officeId || createdOfficeId,
        slug: data.officeId || createdOfficeId,
        initial: (data.name.trim().charAt(0) || "م").toUpperCase(),
        initialBg: "bg-[#fff9ee] dark:bg-[#2d1f16]",
        initialText: "text-[#9c6402] dark:text-[#e29d38]",
        backgroundColor: data.backgroundColor || "#203b3c",
        fontColor: data.fontColor || data.secondaryColor || "#ffffff",
        themeColor: data.accentColor || data.themeColor || "#d5a058",
        color: data.accentColor || data.themeColor || "#d5a058",
        primaryColor: data.accentColor || data.themeColor || "#d5a058",
        secondaryColor: data.fontColor || data.secondaryColor,
        name: data.name,
        owner: data.owner,
        licenseNumber: cleanLicense
          ? cleanLicense.startsWith("ترخيص عدلي: ")
            ? cleanLicense
            : `ترخيص عدلي: ${cleanLicense}`
          : "قيد المراجعة والتحقق",
        email: data.email,
        phone: cleanPhone || (data.phone.startsWith("+966") ? data.phone : `+966 ${data.phone}`),
        landline: data.landline || undefined,
        address: data.address || (data.city ? `المملكة العربية السعودية - ${data.city}` : undefined),
        taxNumber: cleanTaxNumber || undefined,
        city: data.city || "الرياض",
        country: "المملكة العربية السعودية",
        password: initialPassword,
        initialPassword: initialPassword,
        plan: isUnlimited ? "غير محدود" : isTrial ? `${cleanPlan} (تجربة مجانية)` : cleanPlan,
        planId: isUnlimited ? undefined : resolvedPlanId,
        planType: targetPlanType,
        subscriptionPlan: targetSubscriptionPlan,
        billingCycle: cleanBilling === "yearly" ? "سنوي" : "شهري",
        autoRenew: isAutoRenew,
        usedStorageGb,
        extraLawyers,
        extraStorageGb,
        extraCases,
        planDetails: data.planDetails,
        activeSubscriptionDetails: {
          billingCycle: cleanBilling === "yearly" ? "سنوي" : "شهري",
          autoRenew: isAutoRenew,
          taxNumber: cleanTaxNumber || undefined,
          usedStorageGb,
          extraLawyers,
          extraStorageGb,
          extraCases,
          startDate: new Date().toISOString().split("T")[0],
          renewalDate: isUnlimited ? "" : new Date(Date.now() + (isTrial ? trialDays : cleanBilling === "yearly" ? 365 : 30) * 86400000).toISOString().split("T")[0],
          status: isOfficeInactive ? "inactive" : isUnlimited ? "unlimited" : isTrial ? "trial" : "active",
        },
        registrationDate: new Date().toISOString().split("T")[0],
        subscriptionStart: new Date().toISOString().split("T")[0],
        subscriptionEnd: isUnlimited ? undefined : new Date(Date.now() + (isTrial ? trialDays : cleanBilling === "yearly" ? 365 : 30) * 86400000).toISOString().split("T")[0],
        logo: returnedLogo || resolveOfficeLogo(undefined, createdOfficeId),
        planBadgeClass:
          "bg-[#ffddb6]/40 text-[#7b4e00] border border-[#ffddb6] dark:bg-[rgba(226,157,56,0.18)] dark:text-[#f3c27e] dark:border-[#e29d38]/50",
        accountStatus: targetAccountStatus,
        subscriptionStatus: isOfficeInactive
          ? {
              label: "غير نشط",
              type: "expired",
              bgClass: "bg-[#fef2f2] dark:bg-[#2c1313]",
              textClass: "text-[#dc2626] dark:text-[#f87171]",
            }
          : isUnlimited
          ? {
              label: "غير محدود",
              type: "unlimited",
              bgClass: "bg-[#f5f3ef] dark:bg-[#281c15] border border-[#d8c29d] dark:border-[#5a4321]",
              textClass: "text-[#9c6402] dark:text-[#e29d38]",
            }
          : isTrial
          ? {
              label: "تجربة مجانية",
              type: "trial",
              bgClass: "bg-[#fffbeb] dark:bg-[rgba(226,157,56,0.18)]",
              textClass: "text-[#92400e] dark:text-[#f3c27e]",
            }
          : {
              label: "اشتراك نشط",
              type: "active",
              bgClass: "bg-[#ecfdf5] dark:bg-[#132c1c]",
              textClass: "text-[#10b981] dark:text-[#6ee7b7]",
            },
        resourceUsage: {
          lawyersUsed: 0,
          lawyersLimit: 0,
          lawyersPercent: 0,
          storageUsedGb: "0.00",
          storageLimitGb: 0,
          storagePercent: 0,
          activeCases: 0,
        },
        internalNotes: [],
      };

      setOffices((prev) => [newlyCreatedOffice, ...prev.filter((o) => String(o.id) !== String(newlyCreatedOffice.id))]);
    }

    try {
      const result = await fetchFirms({ status: "all", page: 1, per_page: 100 });
      if (result.items.length > 0) {
        const fetchedOffices = result.items.map(mapFirmToClientOffice);
        setOffices((prev) => {
          // Merge to preserve local initialPassword or details
          return fetchedOffices.map((fetched) => {
            const local = prev.find((p) => String(p.id) === String(fetched.id));
            const localRenew =
              getLocalCustomAutoRenew(String(fetched.id)) ??
              (fetched.companyId ? getLocalCustomAutoRenew(String(fetched.companyId)) : undefined);
            const localPlan =
              getLocalCustomFirmPlan(String(fetched.id)) ||
              (fetched.companyId ? getLocalCustomFirmPlan(String(fetched.companyId)) : undefined);
            const effectiveRenew =
              localRenew !== undefined
                ? localRenew
                : local?.autoRenew !== undefined
                ? local.autoRenew
                : fetched.autoRenew;
            const effectivePlan = localPlan?.plan || local?.plan || fetched.plan;
            const effectivePlanId = localPlan?.planId ?? local?.planId ?? fetched.planId;
            const effectivePlanType = localPlan?.planType || local?.planType || fetched.planType;
            const effectiveBillingCycle =
              localPlan?.billingCycle
                ? (localPlan.billingCycle === "yearly" || localPlan.billingCycle === "سنوي" ? "سنوي" : "شهري")
                : local?.billingCycle || fetched.billingCycle;
            if (!local) {
              const fetchedBgColor =
                getLocalCustomBackgroundColor(String(fetched.id)) ||
                fetched.backgroundColor ||
                "#203b3c";
              const fetchedThemeColor =
                getLocalCustomThemeColor(String(fetched.id)) ||
                fetched.themeColor ||
                "#d5a058";
              const fetchedSecondaryColor =
                getLocalCustomSecondaryColor(String(fetched.id)) ||
                fetched.secondaryColor ||
                "#ffffff";
              return {
                ...fetched,
                backgroundColor: fetchedBgColor,
                fontColor: fetchedSecondaryColor,
                themeColor: fetchedThemeColor,
                color: fetchedThemeColor,
                primaryColor: fetchedThemeColor,
                secondaryColor: fetchedSecondaryColor,
                autoRenew: effectiveRenew,
                plan: effectivePlan,
                planId: effectivePlanId,
                planType: effectivePlanType,
                subscriptionPlan: effectivePlanType,
                billingCycle: effectiveBillingCycle,
                activeSubscriptionDetails: fetched.activeSubscriptionDetails
                  ? {
                      ...fetched.activeSubscriptionDetails,
                      planId: effectivePlanId,
                      billingCycle: effectiveBillingCycle,
                      autoRenew: effectiveRenew,
                    }
                  : undefined,
                subscriptionStatus:
                  effectivePlanType === "unlimited"
                    ? {
                        label: "غير محدود",
                        type: "unlimited" as const,
                        bgClass: "bg-[#f5f3ef] dark:bg-[#281c15] border border-[#d8c29d] dark:border-[#5a4321]",
                        textClass: "text-[#9c6402] dark:text-[#e29d38]",
                      }
                    : effectivePlanType === "trial"
                    ? {
                        label: "تجربة مجانية",
                        type: "trial" as const,
                        bgClass: "bg-[#fffbeb] dark:bg-[rgba(226,157,56,0.18)]",
                        textClass: "text-[#92400e] dark:text-[#f3c27e]",
                      }
                    : {
                        label: "اشتراك نشط",
                        type: "active" as const,
                        bgClass: "bg-[#ecfdf5] dark:bg-[#132c1c]",
                        textClass: "text-[#10b981] dark:text-[#6ee7b7]",
                      },
              };
            }
            const mergedBgColor =
              (local?.backgroundColor ? local.backgroundColor : undefined) ||
              (local?.id ? getLocalCustomBackgroundColor(local.id) : undefined) ||
              (fetched.id ? getLocalCustomBackgroundColor(fetched.id) : undefined) ||
              fetched.backgroundColor ||
              "#203b3c";
            const mergedThemeColor =
              (local.themeColor && local.themeColor !== "#9c6402" ? local.themeColor : undefined) ||
              (fetched.color ? String(fetched.color) : undefined) ||
              (local.id ? getLocalCustomThemeColor(local.id) : undefined) ||
              local.themeColor ||
              (fetched.id ? getLocalCustomThemeColor(fetched.id) : undefined) ||
              fetched.themeColor ||
              "#d5a058";
            const mergedSecondaryColor =
              (local.secondaryColor && local.secondaryColor !== "#ffffff" ? local.secondaryColor : undefined) ||
              (fetched.secondaryColor ? String(fetched.secondaryColor) : undefined) ||
              (local.id ? getLocalCustomSecondaryColor(local.id) : undefined) ||
              local.secondaryColor ||
              (fetched.id ? getLocalCustomSecondaryColor(fetched.id) : undefined) ||
              "#ffffff";
            return {
              ...local,
              ...fetched,
              backgroundColor: mergedBgColor,
              fontColor: mergedSecondaryColor,
              themeColor: mergedThemeColor,
              color: mergedThemeColor,
              primaryColor: mergedThemeColor,
              secondaryColor: mergedSecondaryColor,
              autoRenew: effectiveRenew,
              plan: effectivePlan,
              planId: effectivePlanId,
              planType: effectivePlanType,
              subscriptionPlan: effectivePlanType,
              billingCycle: effectiveBillingCycle,
              activeSubscriptionDetails: fetched.activeSubscriptionDetails
                ? {
                    ...fetched.activeSubscriptionDetails,
                    planId: effectivePlanId,
                    billingCycle: effectiveBillingCycle,
                    autoRenew: effectiveRenew,
                  }
                : local.activeSubscriptionDetails,
              subscriptionStatus:
                effectivePlanType === "unlimited"
                  ? {
                      label: "غير محدود",
                      type: "unlimited" as const,
                      bgClass: "bg-[#f5f3ef] dark:bg-[#281c15] border border-[#d8c29d] dark:border-[#5a4321]",
                      textClass: "text-[#9c6402] dark:text-[#e29d38]",
                    }
                  : effectivePlanType === "trial"
                  ? {
                      label: "تجربة مجانية",
                      type: "trial" as const,
                      bgClass: "bg-[#fffbeb] dark:bg-[rgba(226,157,56,0.18)]",
                      textClass: "text-[#92400e] dark:text-[#f3c27e]",
                    }
                  : {
                      label: "اشتراك نشط",
                      type: "active" as const,
                      bgClass: "bg-[#ecfdf5] dark:bg-[#132c1c]",
                      textClass: "text-[#10b981] dark:text-[#6ee7b7]",
                    },
              accountStatus: fetched.accountStatus,
              planDetails: fetched.planDetails || local.planDetails,
              initialPassword: local.initialPassword || fetched.initialPassword,
              password: local.password || fetched.password,
              landline: fetched.landline || local.landline,
              address: fetched.address || local.address,
              taxNumber: fetched.taxNumber || local.taxNumber || getLocalCustomTaxNumber(local.id),
              owner: fetched.owner && fetched.owner !== "—" ? fetched.owner : local.owner,
              city: fetched.city || local.city,
              logo: fetched.logo || getLocalCustomLogo(fetched.id) || (local?.logo && !local.logo.startsWith("blob:") ? local.logo : undefined) || resolveOfficeLogo(undefined, fetched.id),
            };
          });
        });
      }
    } catch (err) {
      console.warn("Failed to reload firms:", err);
    }

    setOfficesRetryKey((value) => value + 1);
    void InvalidationGraph.onFirmMutation(queryClient);
    setEditingOfficeId(null);
    setIsAddingNew(false);
    router.push("/accounts");
  };

  const handleConfirmDeactivate = async (reason?: string) => {
    if (!officeToDeactivate) return;
    const targetId = officeToDeactivate.id;
    const targetName = officeToDeactivate.name;

    try {
      await updateFirmStatus(
        targetId,
        "inactive",
        reason && reason.trim() ? reason.trim() : "تعطيل مؤقت من لوحة الإدارة"
      );
      saveLocalCustomStatus(targetId, "suspended");
      toast.success(t(`تم تعطيل حساب ${targetName} مؤقتاً بنجاح.`, `Temporarily deactivated ${targetName}.`));
      setOfficesRetryKey((value) => value + 1);
      void InvalidationGraph.onFirmMutation(queryClient);
    } catch {
      saveLocalCustomStatus(targetId, "suspended");
      toast.error(t(`تعذر تعطيل حساب ${targetName}`, `Failed to deactivate ${targetName}`));
    }

    setOffices((prev) =>
      prev.map((o) =>
        String(o.id) === String(targetId)
          ? {
              ...o,
              accountStatus: {
                label: "غير نشط",
                type: "suspended",
                bgClass: "bg-[#fef2f2] dark:bg-[#2c1313]",
                textClass: "text-[#dc2626] dark:text-[#f87171]",
                dotClass: "bg-[#dc2626] dark:bg-[#ef4444]",
              },
            }
          : o
      )
    );

    setOfficeToDeactivate(null);
  };

  const handleConfirmDelete = async () => {
    if (!officeToDelete) return;
    const targetId = officeToDelete.id;
    const targetName = officeToDelete.name;

    try {
      await deleteFirm(targetId);
      toast.success(t(`تم حذف مكتب "${targetName}" نهائياً من النظام.`, `Permanently deleted "${targetName}".`));
      setOffices((prev) => prev.filter((o) => String(o.id) !== String(targetId)));
      setOfficesRetryKey((value) => value + 1);
      void invalidateClientsQueries(queryClient);

      if (String(activeOfficeId) === String(targetId)) {
        setActiveOfficeId(null);
        setEditingOfficeId(null);
        setIsAddingNew(false);
        router.push("/accounts");
      }
    } catch (err: unknown) {
      const isConstraint =
        err instanceof ApiError &&
        (err.message?.includes("constraint") ||
          err.message?.includes("foreign key") ||
          err.message?.includes("1451") ||
          err.status === 500);

      if (isConstraint) {
        toast.error(
          t(
            `لا يمكن حذف مكتب "${targetName}" نهائياً لوجود قضايا أو اشتراكات مسجلة عليه في النظام. يمكنك استخدام خيار "تعطيل الحساب" بدلاً من الحذف.`,
            `Cannot permanently delete "${targetName}" because it has linked cases or subscriptions. You can deactivate it instead.`
          )
        );
      } else {
        toast.error(t(`تعذر حذف مكتب "${targetName}"`, `Failed to delete "${targetName}"`));
      }
    }

    setOfficeToDelete(null);
  };

  const handleReactivate = async (office: ClientOffice) => {
    try {
      await updateFirmStatus(office.id, "active");
      saveLocalCustomStatus(office.id, "active");
      toast.success(t(`تم تنشيط حساب ${office.name} بنجاح`, `Activated ${office.name} successfully`));
      setOfficesRetryKey((value) => value + 1);
      void InvalidationGraph.onFirmMutation(queryClient);
    } catch {
      saveLocalCustomStatus(office.id, "active");
      toast.error(t(`تعذر تنشيط حساب ${office.name}`, `Failed to activate ${office.name}`));
    }

    setOffices((prev) =>
      prev.map((o) =>
        String(o.id) === String(office.id)
          ? {
              ...o,
              accountStatus: {
                label: "نشط",
                type: "active",
                bgClass: "bg-[#e8f5e9] dark:bg-[#132c1c]",
                textClass: "text-[#1b7340] dark:text-[#6ee7b7]",
                dotClass: "bg-[#1b7340] dark:bg-[#10b981]",
              },
            }
          : o
      )
    );
  };

  const handleNoteAdded = (officeId: string, newNote: OfficeInternalNote) => {
    setOffices((prev) =>
      prev.map((o) => {
        if (String(o.id) !== String(officeId)) return o;
        const currentNotes = o.internalNotes || [];
        const exists = currentNotes.some((n) => n.id === newNote.id);
        const updatedNotes = exists ? currentNotes : [newNote, ...currentNotes];
        return {
          ...o,
          internalNotes: updatedNotes,
        };
      })
    );
  };

  const breadcrumbs =
    currentView === "billing"
      ? [
          { label: t("إدارة العملاء", "Client Management"), href: "/accounts" },
          { label: billingOffice?.name || t("المكتب", "Office"), href: billingOffice ? `/accounts?officeId=${billingOffice.id}` : undefined },
          { label: t("الاشتراكات والفواتير", "Subscriptions & Invoices") },
        ]
      : currentView === "details"
      ? [
          { label: t("إدارة العملاء", "Client Management"), href: "/accounts" },
          { label: selectedOffice?.name || t("تفاصيل المكتب", "Office Details") },
        ]
      : currentView === "add"
      ? [
          { label: t("إدارة العملاء", "Client Management"), href: "/accounts" },
          { label: officeToEdit ? t("تعديل بيانات المكتب", "Edit Office Details") : t("إضافة مكتب محاماة جديد", "Add New Law Office") },
        ]
      : undefined;

  return (
    <div className="flex h-screen h-dvh overflow-hidden w-full bg-background text-foreground transition-colors duration-200 font-['Cairo',sans-serif]">
      {/* 1. Global Navigation Sidebar */}
      <DashboardSidebar activeNav="clients" activeSubNav="offices" />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 min-h-0 overflow-hidden">
        {/* Top Navbar */}
        <DashboardTopNavbar customBreadcrumbs={breadcrumbs} />

        {/* Dynamic Page Content (Scroll Y only, zero horizontal overflow) */}
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 flex flex-col gap-6 w-full max-w-full scrollbar-thin">
          <DashboardPageTransition>
            {currentView === "list" && (
              isLoadingOffices && effectiveOffices.length === 0 && !officesError ? (
                <ClientsPageSkeleton />
              ) : officesError ? (
                <section
                  role="alert"
                  className="bg-white dark:bg-[#221812] rounded-[8px] border border-red-200 dark:border-red-900/50 p-10 text-center"
                >
                  <h2 className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("تعذر تحميل المكاتب", "Unable to Load Offices")}
                  </h2>
                  <p className="mt-2 text-[13px] text-[#737067] dark:text-[#a89f91]">
                    {officesError}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setOfficesRetryKey((value) => value + 1);
                      void firmsQuery.refetch();
                    }}
                    className="mt-5 px-4 py-2 rounded-[6px] bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] text-[13px] font-bold"
                  >
                    {t("إعادة المحاولة", "Retry")}
                  </button>
                </section>
              ) : (
              <>
                {/* Header with Title & Add Office Button */}
                <ClientManagementHeader onAddOffice={hasPermission("clients.create") ? handleStartAddOffice : undefined} />

                {/* 4 KPI Metrics Cards */}
                <ClientKpiMetrics
                  offices={effectiveOffices}
                  isLoading={isLoadingOffices}
                  refreshTrigger={officesRetryKey}
                />

                {/* Main Client Offices Data Table */}
                <ClientManagementTable
                  offices={effectiveOffices}
                  isLoading={isLoadingOffices}
                  isEnteringOffice={isEnteringOffice}
                  enteringOfficeId={officeToEnter?.id}
                  onViewOfficeDetails={(office) => {
                    setActiveOfficeId(office.id);
                    setEditingOfficeId(null);
                    setIsAddingNew(false);
                    setBillingOfficeId(null);
                    router.push(`/accounts?officeId=${office.id}`);
                  }}
                  onEditOffice={hasPermission("clients.edit") ? handleStartEditOffice : undefined}
                  onEnterOfficeAsAdmin={hasPermission("clients.impersonate") ? handleEnterOfficeAsAdmin : undefined}
                  onManageSubscriptions={(office) => {
                    setBillingOfficeId(office.id);
                    setActiveOfficeId(null);
                    setEditingOfficeId(null);
                    setIsAddingNew(false);
                    router.push(`/accounts?officeId=${office.id}&action=billing`);
                  }}
                  onOpenDeactivateModal={hasPermission("clients.edit") ? (office) => setOfficeToDeactivate(office) : undefined}
                  onOpenDeleteModal={hasPermission("clients.delete") ? (office) => setOfficeToDelete(office) : undefined}
                  onResetPassword={hasPermission("clients.edit") ? (office) => setOfficeToResetPassword(office) : undefined}
                  onReactivate={hasPermission("clients.edit") ? handleReactivate : undefined}
                  canEditStatus={hasPermission("clients.edit")}
                />
              </>
              )
            )}

            {currentView === "add" && (
              <AddClientOfficeView
                key={officeToEdit ? officeToEdit.id : "new-office"}
                officeToEdit={officeToEdit}
                existingOffices={offices}
                onBack={handleBackToList}
                onSuccess={handleSaveOffice}
              />
            )}

            {currentView === "billing" && (
              <ClientSubscriptionsInvoicesView
                office={billingOffice}
                onBack={handleBackToList}
              />
            )}

            {currentView === "details" && (
              <ClientOfficeDetailsView
                office={selectedOffice}
                onBack={handleBackToList}
                onEdit={hasPermission("clients.edit") ? () => {
                  if (selectedOffice) {
                    handleStartEditOffice(selectedOffice);
                  }
                } : undefined}
                onResetPassword={hasPermission("clients.edit") ? () => {
                  if (selectedOffice) {
                    setOfficeToResetPassword(selectedOffice);
                  }
                } : undefined}
                onEnterOfficeAsAdmin={
                  hasPermission("clients.impersonate") && selectedOffice
                    ? () => handleEnterOfficeAsAdmin(selectedOffice)
                    : undefined
                }
                onOpenDeactivateModal={hasPermission("clients.edit") ? (office) => setOfficeToDeactivate(office) : undefined}
                onReactivate={hasPermission("clients.edit") ? handleReactivate : undefined}
                onUpgradePlan={(office, newPlan) => {
                  const isUnlim = newPlan === "غير محدود" || newPlan.includes("غير محدود");
                  const targetPlanType = isUnlim ? "unlimited" : "paid";
                  saveLocalCustomFirmPlan(office.id, {
                    plan: newPlan,
                    planType: targetPlanType,
                    billingCycle: isUnlim ? "غير محدود" : "yearly",
                  });
                  if (office.companyId) {
                    saveLocalCustomFirmPlan(office.companyId, {
                      plan: newPlan,
                      planType: targetPlanType,
                      billingCycle: isUnlim ? "غير محدود" : "yearly",
                    });
                  }
                  setOffices((prev) =>
                    prev.map((o) =>
                      String(o.id) === String(office.id)
                        ? {
                            ...o,
                            plan: newPlan,
                            planType: targetPlanType,
                            subscriptionPlan: isUnlim ? "unlimited" : newPlan,
                            billingCycle: isUnlim ? "غير محدود" : o.billingCycle,
                            subscriptionStatus: isUnlim
                              ? {
                                  label: "غير محدود",
                                  type: "unlimited" as const,
                                  bgClass: "bg-[#f5f3ef] dark:bg-[#281c15] border border-[#d8c29d] dark:border-[#5a4321]",
                                  textClass: "text-[#9c6402] dark:text-[#e29d38]",
                                }
                              : o.subscriptionStatus,
                          }
                        : o
                    )
                  );
                }}
                onNoteAdded={handleNoteAdded}
              />
            )}
          </DashboardPageTransition>
        </main>
      </div>

      {/* 3. Deactivate Office Modal (Figma 1:2299) */}
      <DeactivateOfficeModal
        isOpen={!!officeToDeactivate}
        office={officeToDeactivate}
        onClose={() => setOfficeToDeactivate(null)}
        onConfirm={handleConfirmDeactivate}
      />

      {/* 4. Delete Office Modal (Figma 1:2377) */}
      <DeleteOfficeModal
        isOpen={!!officeToDelete}
        office={officeToDelete}
        onClose={() => setOfficeToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      <EnterOfficeConfirmModal
        isOpen={!!officeToEnter}
        office={officeToEnter}
        isLoading={isEnteringOffice}
        onClose={() => setOfficeToEnter(null)}
        onConfirm={handleConfirmEnterOffice}
      />

      {/* 5. Show Password / Credentials Once Modal */}
      {createdCredentials && (
        <OfficeCredentialsCreatedModal
          isOpen={!!createdCredentials}
          officeName={createdCredentials.officeName}
          ownerName={createdCredentials.ownerName}
          email={createdCredentials.email}
          password={createdCredentials.password}
          onClose={() => setCreatedCredentials(null)}
        />
      )}

      {/* 6. Reset Office Password Modal */}
      <ResetFirmPasswordModal
        isOpen={!!officeToResetPassword}
        office={officeToResetPassword}
        onClose={() => setOfficeToResetPassword(null)}
        onSuccess={() => {
          if (officeToResetPassword) {
            toast.success(
              t(
                `تم تغيير كلمة مرور «${officeToResetPassword.name}» بنجاح وتفعيلها فوراً`,
                `Password updated for "${officeToResetPassword.name}" successfully`
              )
            );
          }
        }}
      />
    </div>
  );
}
