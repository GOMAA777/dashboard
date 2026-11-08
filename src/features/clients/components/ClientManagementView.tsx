"use client";

import React, { useEffect, useState } from "react";
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
import { EnterOfficeConfirmModal } from "./EnterOfficeConfirmModal";
import { DeactivateOfficeModal } from "./DeactivateOfficeModal";
import { DeleteOfficeModal } from "./DeleteOfficeModal";
import { ClientOffice, OfficeInternalNote } from "../types/client.types";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";
import {
  fetchFirms,
  fetchFirmById,
  createFirm,
  updateFirm,
  updateFirmStatus,
  deleteFirm,
  addFirmNote,
} from "@/lib/api/firms";
import {
  mapFirmToClientOffice,
  normalizeLogoUrl,
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
  saveLocalCustomOfficeId,
  getLocalCustomOfficeId,
  saveLocalCustomSecondaryColor,
  getLocalCustomSecondaryColor,
} from "@/lib/api/mappers";
import { unwrapData } from "@/lib/api/helpers";
import { ApiError } from "@/lib/api/http";
import { enterOfficeAsAdmin } from "@/lib/api/enter-office";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const officeIdParam = searchParams?.get("officeId");
  const actionParam = searchParams?.get("action");

  const [offices, setOffices] = useState<ClientOffice[]>([]);
  const [isLoadingOffices, setIsLoadingOffices] = useState<boolean>(true);
  const [officesError, setOfficesError] = useState<string | null>(null);
  const [officesRetryKey, setOfficesRetryKey] = useState(0);
  const [activeOfficeId, setActiveOfficeId] = useState<string | null>(
    actionParam === "add" || actionParam === "enter" ? null : officeIdParam || null
  );
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

  const selectedOffice = activeOfficeId
    ? offices.find((o) => String(o.id) === String(activeOfficeId)) || null
    : null;

  const billingOffice = billingOfficeId
    ? offices.find((o) => String(o.id) === String(billingOfficeId)) || null
    : null;

  const officeToEdit = editingOfficeId
    ? offices.find((o) => String(o.id) === String(editingOfficeId)) || null
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

  useEffect(() => {
    let cancelled = false;

    async function loadFirms() {
      setIsLoadingOffices(true);
      setOfficesError(null);
      try {
        const result = await fetchFirms({ status: "all", page: 1, per_page: 100 });
        if (cancelled) return;
        setOffices((prev) => {
          const fresh = result.items.map(mapFirmToClientOffice);
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
      } catch (err: unknown) {
        if (cancelled) return;
        setOffices([]);
        setOfficesError(
          err && typeof err === "object" && "message" in err
            ? String((err as { message: unknown }).message)
            : "تعذر تحميل قائمة المكاتب."
        );
      } finally {
        if (!cancelled) setIsLoadingOffices(false);
      }
    }

    void loadFirms();
    return () => {
      cancelled = true;
    };
  }, [officesRetryKey]);

  useEffect(() => {
    if (!activeOfficeId) return;
    let cancelled = false;
    fetchFirmById(activeOfficeId)
      .then((payload) => {
        if (cancelled) return;
        const rawData = (unwrapData<Record<string, unknown>>(payload) || payload) as Record<string, unknown>;
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
              logo: mapped.logo || o.logo || getLocalCustomLogo(String(o.id)),
            };
          });
        });
      })
      .catch((err) => {
        console.error("Failed to fetch firm details:", err);
      });
    return () => {
      cancelled = true;
    };
  }, [activeOfficeId]);

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

  const handleConfirmEnterOffice = async () => {
    if (!officeToEnter || isEnteringOffice) return;
    setIsEnteringOffice(true);
    const office = officeToEnter;
    try {
      const handoffUrl = await enterOfficeAsAdmin({
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
      });
      toast.success(`جاري الربط والانتقال إلى لوحة مكتب «${office.name}»...`);
      setOfficeToEnter(null);
      window.location.assign(handoffUrl);
    } catch (err: unknown) {
      console.error("Failed to enter office as admin:", err);
      let message = "تعذر فتح بوابة الدخول للمكتب. حاول مرة أخرى.";
      if (err instanceof ApiError) {
        if (err.status === 401) {
          message = "انتهت صلاحية جلسة الأدمن (401). يرجى تسجيل الدخول بحساب أدمن مصرح.";
        } else if (err.status === 404) {
          message = `المكتب المطلوب غير موجود على الخادم (404: مكتب #${office.companyId || office.id}).`;
        } else if (String(err.message || "").includes("SaasImpersonationLog")) {
          message = "تعذر الدخول للمكتب: خطأ في خادم الـ API (الموديل SaasImpersonationLog غير معرف في الـ Backend على السيرفر).";
        } else if (err.message) {
          message = err.message;
        }
      } else if (err instanceof Error && err.message) {
        if (err.message.includes("SaasImpersonationLog")) {
          message = "تعذر الدخول للمكتب: خطأ في خادم الـ API (الموديل SaasImpersonationLog غير معرف في الـ Backend على السيرفر).";
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
    const isTrial =
      data.planType === "trial" ||
      data.planType === "free_trial" ||
      Boolean(data.plan?.includes("تجرب"));
    const trialDays = Number((data as any).trialDays) || 14;

    const targetPlanType = isTrial ? "trial" : (data.planType || "paid");
    // Trial has no priced plan. Never fall back to plan_id=1 — the API rejects missing/stale ids
    // with "The selected plan id is invalid". Send plan_type=trial and omit plan_id instead.
    // companies.status is ENUM('active','inactive'), so always send an allowed status in the body.
    const safePlanType = isTrial ? "trial" : "paid";
    const targetSubscriptionPlan = isTrial ? "trial" : (data.planType || "paid");
    const isCycleAnnual = Boolean(
      data.billingCycle?.includes("سنو") ||
      data.billingCycle?.includes("year") ||
      data.billingCycle?.includes("annu")
    );
    const cleanBilling = isTrial ? "monthly" : isCycleAnnual ? "yearly" : "monthly";
    const initialPassword =
      data.password && data.password !== "••••••••••••"
        ? data.password
        : `LawPass#${Math.floor(100000 + Math.random() * 900000)}`;

    const rawStatus = String(data.status || "");
    const isOfficeInactive = rawStatus === "inactive" || rawStatus === "suspended";
    const targetApiStatus: "active" | "inactive" = isOfficeInactive ? "inactive" : "active";
    const firmDbStatus = targetApiStatus;
    const resolvedPlanId = (() => {
      const candidates = [data.planId, officeToEdit?.planId];
      for (const raw of candidates) {
        if (raw === undefined || raw === null || raw === "") continue;
        const asStr = String(raw).trim();
        if (/^\d+$/.test(asStr)) {
          const n = Number(asStr);
          if (n > 0) return n;
        }
      }
      return isTrial ? null : 1;
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

    if (!isTrial && resolvedPlanId == null) {
      toast.error("يلزم اختيار باقة اشتراك صالحة قبل الحفظ");
      return;
    }

    let payload: Record<string, unknown> | FormData;

    const effectiveLogoFile: File | null =
      data.logoFile instanceof File
        ? data.logoFile
        : data.logoUrl?.startsWith("data:")
        ? dataUrlToFile(data.logoUrl)
        : null;

    if (effectiveLogoFile) {
      const fd = new FormData();
      fd.append("name", data.name);
      fd.append("owner_name", data.owner);
      if (cleanLicense) fd.append("license_number", cleanLicense);
      fd.append("email", data.email);
      fd.append("phone", data.phone);
      if (data.landline) fd.append("landline", data.landline);
      fd.append("city", data.city);
      if (data.address) fd.append("address", data.address);
      if (data.taxNumber) fd.append("tax_number", data.taxNumber);
      fd.append("plan_type", safePlanType);
      fd.append("subscription_plan", targetSubscriptionPlan);
      fd.append("status", firmDbStatus);
      if (resolvedPlanId != null) {
        fd.append("plan_id", String(resolvedPlanId));
      }
      fd.append("billing_cycle", cleanBilling || "yearly");
      fd.append("auto_renew", isTrial ? "0" : (data.autoRenew !== false ? "1" : "0"));
      if (!isEdit || (data.password && data.password !== "••••••••••••")) {
        fd.append("password", data.password || initialPassword);
      }
      if (data.themeColor) {
        fd.append("color", data.themeColor);
        fd.append("theme_color", data.themeColor);
        fd.append("primary_color", data.themeColor);
      }
      if (data.secondaryColor) {
        fd.append("secondary_color", data.secondaryColor);
      }
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
        phone: data.phone,
        landline: data.landline || null,
        city: data.city,
        address: data.address || (data.city ? `المملكة العربية السعودية - ${data.city}` : null),
        tax_number: data.taxNumber || null,
        office_id: data.officeId || null,
        slug: data.officeId || null,
        color: data.themeColor || "#9c6402",
        theme_color: data.themeColor || "#9c6402",
        primary_color: data.themeColor || "#9c6402",
        secondary_color: data.secondaryColor || undefined,
        plan_type: safePlanType,
        subscription_plan: targetSubscriptionPlan,
        status: firmDbStatus,
        plan_id: isTrial ? null : (resolvedPlanId ?? 1),
        billing_cycle: cleanBilling,
        auto_renew: isTrial ? false : (data.autoRenew !== false),
        password: isEdit
          ? (data.password && data.password !== "••••••••••••" ? data.password : undefined)
          : initialPassword,
      };
    }

    if (isEdit && officeToEdit) {
      const isAutoRenew = isTrial ? false : (data.autoRenew !== false);
      saveLocalCustomAutoRenew(officeToEdit.id, isAutoRenew);
      if (data.themeColor) {
        saveLocalCustomThemeColor(officeToEdit.id, data.themeColor);
        if (officeToEdit.companyId) {
          saveLocalCustomThemeColor(officeToEdit.companyId, data.themeColor);
        }
      }
      if (data.logoUrl) {
        saveLocalCustomLogo(officeToEdit.id, data.logoUrl);
      } else if (data.logoFile === null && !data.logoUrl) {
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
      try {
        await updateFirm(officeToEdit.id, payload);
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
        saveLocalCustomStatus(officeToEdit.id, isOfficeInactive ? "suspended" : "active");
        const statusLabel = isOfficeInactive ? "غير نشط" : "نشط";
        toast.success(`تم حفظ تعديلات مكتب "${data.name}" بنجاح (${statusLabel})`);
      } catch (err: unknown) {
        const msg = (err as { message?: string })?.message || "فشل تحديث بيانات المكتب";
        toast.error(msg);
        return;
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
            phone: data.phone.startsWith("+966") ? data.phone : `+966 ${data.phone}`,
            landline: data.landline || o.landline,
            address: data.address || o.address,
            taxNumber: data.taxNumber || o.taxNumber || getLocalCustomTaxNumber(o.id),
            city: data.city || o.city,
            country: "المملكة العربية السعودية",
            plan: data.plan,
            planId: isTrial
              ? undefined
              : resolvedPlanId != null
              ? resolvedPlanId
              : o.planId,
            planType: targetPlanType,
            subscriptionPlan: targetSubscriptionPlan,
            billingCycle: isTrial ? (data.billingCycle || `فترة تجريبية (${trialDays} يوماً)`) : cleanBilling === "yearly" ? "سنوي" : "شهري",
            autoRenew: isAutoRenew,
            planDetails: data.planDetails || o.planDetails,
            activeSubscriptionDetails: o.activeSubscriptionDetails
              ? { ...o.activeSubscriptionDetails, autoRenew: isAutoRenew }
              : undefined,
            logo: data.logoUrl || o.logo || getLocalCustomLogo(o.id),
            officeId: data.officeId || o.officeId,
            slug: data.officeId || o.slug,
            themeColor: data.themeColor || o.themeColor || "#9c6402",
            color: data.themeColor || o.themeColor || "#9c6402",
            primaryColor: data.themeColor || o.primaryColor || o.themeColor || "#9c6402",
            secondaryColor: data.secondaryColor || o.secondaryColor,
            initialPassword: data.password || o.initialPassword,
            accountStatus: targetAccountStatus,
            subscriptionStatus: isOfficeInactive
              ? o.subscriptionStatus
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
      let returnedLogo = data.logoUrl;
      try {
        const res = await createFirm(payload);
        const unwrapped = (unwrapData<Record<string, unknown>>(res) || res) as Record<string, unknown>;
        const createdFirm = (unwrapped?.firm || unwrapped?.data || unwrapped) as Record<string, unknown>;
        const newId = String(createdFirm?.id || "");
        if (newId) createdOfficeId = newId;

        // 1. Sync tax number, color, and status via PUT immediately because backend POST ignores tax_number and creation status/color
        if (newId) {
          const secondaryPayload: Record<string, unknown> = {};
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
        }

        // 2. Cache local custom logo so it's always available even if backend storage returns 403
        if (createdFirm?.logo) {
          returnedLogo = normalizeLogoUrl(String(createdFirm.logo)) || data.logoUrl;
          if (returnedLogo) saveLocalCustomLogo(newId, returnedLogo);
        } else if (data.logoUrl && newId) {
          saveLocalCustomLogo(newId, data.logoUrl);
          returnedLogo = data.logoUrl;
        }

        if (newId) {
          if (data.themeColor) {
            saveLocalCustomThemeColor(newId, data.themeColor);
            if (createdFirm?.company_id) {
              saveLocalCustomThemeColor(String(createdFirm.company_id), data.themeColor);
            }
          }
          saveLocalCustomAutoRenew(newId, isTrial ? false : (data.autoRenew !== false));
          saveLocalCustomStatus(newId, isOfficeInactive ? "suspended" : "active");
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
        saveLocalCustomStatus(createdOfficeId, isOfficeInactive ? "suspended" : "active");
        const statusLabel = isOfficeInactive ? "حساب غير نشط" : "حساب نشط";
        toast.success(`تمت إضافة مكتب "${data.name}" بنجاح (${statusLabel})`);
      } catch (err: unknown) {
        let msg = (err as { message?: string })?.message || "فشل إضافة مكتب المحاماة";
        if (
          (err as { status?: number })?.status === 422 ||
          msg.includes("validation") ||
          msg.includes("required") ||
          msg.includes("بيانات")
        ) {
          msg = "يرجى إكمال البيانات لمواصلة التسجيل";
        }
        toast.error(msg);
        return;
      }

      const newlyCreatedOffice: ClientOffice = {
        id: createdOfficeId,
        officeId: data.officeId || createdOfficeId,
        slug: data.officeId || createdOfficeId,
        initial: (data.name.trim().charAt(0) || "م").toUpperCase(),
        initialBg: "bg-[#fff9ee] dark:bg-[#2d1f16]",
        initialText: "text-[#9c6402] dark:text-[#e29d38]",
        themeColor: data.themeColor || "#9c6402",
        color: data.themeColor || "#9c6402",
        primaryColor: data.themeColor || "#9c6402",
        secondaryColor: data.secondaryColor,
        name: data.name,
        owner: data.owner,
        licenseNumber: cleanLicense
          ? cleanLicense.startsWith("ترخيص عدلي: ")
            ? cleanLicense
            : `ترخيص عدلي: ${cleanLicense}`
          : "قيد المراجعة والتحقق",
        email: data.email,
        phone: data.phone.startsWith("+966") ? data.phone : `+966 ${data.phone}`,
        landline: data.landline || undefined,
        address: data.address || (data.city ? `المملكة العربية السعودية - ${data.city}` : undefined),
        taxNumber: data.taxNumber || undefined,
        city: data.city || "الرياض",
        country: "المملكة العربية السعودية",
        password: initialPassword,
        initialPassword: initialPassword,
        plan: isTrial ? (data.plan ? (data.plan.includes("تجرب") ? data.plan : `${data.plan} (تجربة مجانية)`) : "الباقة الفضية (تجربة مجانية)") : data.plan,
        planId:
          typeof data.planId === "number"
            ? data.planId
            : typeof data.planId === "string" && /^\d+$/.test(data.planId)
              ? Number(data.planId)
              : isTrial
                ? undefined
                : (resolvedPlanId ?? undefined),
        planType: targetPlanType,
        subscriptionPlan: targetSubscriptionPlan,
        billingCycle: isTrial ? (data.billingCycle || `فترة تجريبية (${trialDays} يوماً)`) : cleanBilling === "yearly" ? "سنوي" : "شهري",
        autoRenew: isTrial ? false : (data.autoRenew !== false),
        planDetails: data.planDetails,
        activeSubscriptionDetails: {
          billingCycle: isTrial ? (data.billingCycle || `فترة تجريبية (${trialDays} يوماً)`) : cleanBilling === "yearly" ? "سنوي" : "شهري",
          autoRenew: isTrial ? false : (data.autoRenew !== false),
          startDate: new Date().toISOString().split("T")[0],
          renewalDate: new Date(Date.now() + (isTrial ? trialDays : cleanBilling === "yearly" ? 365 : 30) * 86400000).toISOString().split("T")[0],
          status: isOfficeInactive ? "inactive" : isTrial ? "trial" : "active",
        },
        registrationDate: new Date().toISOString().split("T")[0],
        subscriptionStart: new Date().toISOString().split("T")[0],
        subscriptionEnd: new Date(Date.now() + (isTrial ? trialDays : cleanBilling === "yearly" ? 365 : 30) * 86400000).toISOString().split("T")[0],
        logo: returnedLogo,
        planBadgeClass:
          "bg-[#ffddb6]/40 text-[#7b4e00] border border-[#ffddb6] dark:bg-[rgba(226,157,56,0.18)] dark:text-[#f3c27e] dark:border-[#e29d38]/50",
        accountStatus: targetAccountStatus,
        subscriptionStatus: {
          label: isOfficeInactive ? "غير نشط" : isTrial ? "تجربة مجانية" : "اشتراك نشط",
          type: isOfficeInactive ? "expired" : isTrial ? "trial" : "active",
          bgClass: isOfficeInactive
            ? "bg-[#fef2f2] dark:bg-[#2c1313]"
            : isTrial
            ? "bg-[#fffbeb] dark:bg-[rgba(226,157,56,0.18)]"
            : "bg-[#ecfdf5] dark:bg-[#132c1c]",
          textClass: isOfficeInactive
            ? "text-[#dc2626] dark:text-[#f87171]"
            : isTrial
            ? "text-[#92400e] dark:text-[#f3c27e]"
            : "text-[#10b981] dark:text-[#6ee7b7]",
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
            const localRenew = getLocalCustomAutoRenew(String(fetched.id));
            const effectiveRenew =
              localRenew !== undefined
                ? localRenew
                : local?.autoRenew !== undefined
                ? local.autoRenew
                : fetched.autoRenew;
            if (!local) {
              const fetchedThemeColor =
                getLocalCustomThemeColor(String(fetched.id)) ||
                fetched.themeColor ||
                "#9c6402";
              return {
                ...fetched,
                themeColor: fetchedThemeColor,
                autoRenew: effectiveRenew,
                activeSubscriptionDetails: fetched.activeSubscriptionDetails
                  ? { ...fetched.activeSubscriptionDetails, autoRenew: effectiveRenew }
                  : undefined,
              };
            }
            const mergedThemeColor =
              (fetched.color ? String(fetched.color) : undefined) ||
              (local.id ? getLocalCustomThemeColor(local.id) : undefined) ||
              local.themeColor ||
              (fetched.id ? getLocalCustomThemeColor(fetched.id) : undefined) ||
              fetched.themeColor ||
              "#9c6402";
            return {
              ...local,
              ...fetched,
              themeColor: mergedThemeColor,
              autoRenew: effectiveRenew,
              activeSubscriptionDetails: fetched.activeSubscriptionDetails || local.activeSubscriptionDetails,
              plan: fetched.plan,
              planType: fetched.planType,
              subscriptionPlan: fetched.subscriptionPlan,
              subscriptionStatus: fetched.subscriptionStatus,
              accountStatus: fetched.accountStatus,
              billingCycle: fetched.billingCycle || local.billingCycle,
              planDetails: fetched.planDetails || local.planDetails,
              initialPassword: local.initialPassword || fetched.initialPassword,
              password: local.password || fetched.password,
              landline: fetched.landline || local.landline,
              address: fetched.address || local.address,
              taxNumber: fetched.taxNumber || local.taxNumber || getLocalCustomTaxNumber(local.id),
              owner: fetched.owner && fetched.owner !== "—" ? fetched.owner : local.owner,
              city: fetched.city || local.city,
              logo: fetched.logo || local.logo || getLocalCustomLogo(local.id),
            };
          });
        });
      }
    } catch (err) {
      console.error("Failed to reload firms:", err);
    }

    setOfficesRetryKey((value) => value + 1);
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
      toast.success(`تم تعطيل حساب ${targetName} مؤقتاً بنجاح.`);
      setOfficesRetryKey((value) => value + 1);
    } catch {
      saveLocalCustomStatus(targetId, "suspended");
      toast.error(`تعذر تعطيل حساب ${targetName}`);
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
      toast.success(`تم حذف مكتب "${targetName}" نهائياً من النظام.`);
      setOffices((prev) => prev.filter((o) => String(o.id) !== String(targetId)));
      setOfficesRetryKey((value) => value + 1);

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
          `لا يمكن حذف مكتب "${targetName}" نهائياً لوجود قضايا أو اشتراكات مسجلة عليه في النظام. يمكنك استخدام خيار "تعطيل الحساب" بدلاً من الحذف.`
        );
      } else {
        toast.error(`تعذر حذف مكتب "${targetName}"`);
      }
    }

    setOfficeToDelete(null);
  };

  const handleReactivate = async (office: ClientOffice) => {
    try {
      await updateFirmStatus(office.id, "active");
      saveLocalCustomStatus(office.id, "active");
      toast.success(`تم تنشيط حساب ${office.name} بنجاح`);
      setOfficesRetryKey((value) => value + 1);
    } catch {
      saveLocalCustomStatus(office.id, "active");
      toast.error(`تعذر تنشيط حساب ${office.name}`);
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
          { label: "إدارة العملاء", href: "/accounts" },
          { label: billingOffice?.name || "المكتب", href: billingOffice ? `/accounts?officeId=${billingOffice.id}` : undefined },
          { label: "الاشتراكات والفواتير" },
        ]
      : currentView === "details"
      ? [
          { label: "إدارة العملاء", href: "/accounts" },
          { label: selectedOffice?.name || "تفاصيل المكتب" },
        ]
      : currentView === "add"
      ? [
          { label: "إدارة العملاء", href: "/accounts" },
          { label: officeToEdit ? "تعديل بيانات المكتب" : "إضافة مكتب محاماة جديد" },
        ]
      : undefined;

  return (
    <div className="flex h-screen h-dvh overflow-hidden w-full bg-background text-foreground transition-colors duration-200 font-['Cairo',sans-serif]">
      {/* 1. Global Navigation Sidebar */}
      <DashboardSidebar activeNav="clients" />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 min-h-0 overflow-hidden">
        {/* Top Navbar */}
        <DashboardTopNavbar customBreadcrumbs={breadcrumbs} />

        {/* Dynamic Page Content (Scroll Y only, zero horizontal overflow) */}
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 flex flex-col gap-6 w-full max-w-full scrollbar-thin">
          <DashboardPageTransition>
            {currentView === "list" && (
              isLoadingOffices && offices.length === 0 && !officesError ? (
                <DashboardPageSkeleton />
              ) : officesError ? (
                <section
                  role="alert"
                  className="bg-white dark:bg-[#221812] rounded-[8px] border border-red-200 dark:border-red-900/50 p-10 text-center"
                >
                  <h2 className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    تعذر تحميل المكاتب
                  </h2>
                  <p className="mt-2 text-[13px] text-[#737067] dark:text-[#a89f91]">
                    {officesError}
                  </p>
                  <button
                    type="button"
                    onClick={() => setOfficesRetryKey((value) => value + 1)}
                    className="mt-5 px-4 py-2 rounded-[6px] bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] text-[13px] font-bold"
                  >
                    إعادة المحاولة
                  </button>
                </section>
              ) : (
              <>
                {/* Header with Title & Add Office Button */}
                <ClientManagementHeader onAddOffice={handleStartAddOffice} />

                {/* 4 KPI Metrics Cards */}
                <ClientKpiMetrics
                  offices={offices}
                  isLoading={isLoadingOffices}
                  refreshTrigger={officesRetryKey}
                />

                {/* Main Client Offices Data Table */}
                <ClientManagementTable
                  offices={offices}
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
                  onEditOffice={handleStartEditOffice}
                  onEnterOfficeAsAdmin={handleEnterOfficeAsAdmin}
                  onManageSubscriptions={(office) => {
                    setBillingOfficeId(office.id);
                    setActiveOfficeId(null);
                    setEditingOfficeId(null);
                    setIsAddingNew(false);
                    router.push(`/accounts?officeId=${office.id}&action=billing`);
                  }}
                  onOpenDeactivateModal={(office) => setOfficeToDeactivate(office)}
                  onOpenDeleteModal={(office) => setOfficeToDelete(office)}
                  onReactivate={handleReactivate}
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
                onEdit={() => {
                  if (selectedOffice) {
                    handleStartEditOffice(selectedOffice);
                  }
                }}
                onEnterOfficeAsAdmin={
                  selectedOffice
                    ? () => handleEnterOfficeAsAdmin(selectedOffice)
                    : undefined
                }
                onOpenDeactivateModal={(office) => setOfficeToDeactivate(office)}
                onReactivate={handleReactivate}
                onUpgradePlan={(office, newPlan) => {
                  setOffices((prev) =>
                    prev.map((o) => (String(o.id) === String(office.id) ? { ...o, plan: newPlan } : o))
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
    </div>
  );
}
