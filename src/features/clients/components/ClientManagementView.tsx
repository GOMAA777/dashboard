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
import { ClientOffice } from "../types/client.types";
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
  saveLocalCustomLogo,
  removeLocalCustomLogo,
} from "@/lib/api/mappers";
import { unwrapData } from "@/lib/api/helpers";
import { issueFirmImpersonation } from "@/lib/api/impersonation";
import {
  buildImpersonationHandoffUrl,
  buildLawyerAuthSession,
} from "@/lib/api/lawyer-session";

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

  // Adjust state during render when URL search params change
  const [prevOfficeIdParam, setPrevOfficeIdParam] = useState(officeIdParam);
  const [prevActionParam, setPrevActionParam] = useState(actionParam);

  if (officeIdParam !== prevOfficeIdParam || actionParam !== prevActionParam) {
    setPrevOfficeIdParam(officeIdParam);
    setPrevActionParam(actionParam);
    setActiveOfficeId(
      actionParam === "add" || actionParam === "enter" || actionParam === "billing"
        ? null
        : officeIdParam || null
    );
    setEditingOfficeId(actionParam === "edit" ? officeIdParam || null : null);
    setIsAddingNew(actionParam === "add");
    setBillingOfficeId(actionParam === "billing" ? officeIdParam || null : null);
  }

  const selectedOffice = activeOfficeId
    ? offices.find((o) => o.id === activeOfficeId) || null
    : null;

  const billingOffice = billingOfficeId
    ? offices.find((o) => o.id === billingOfficeId) || null
    : null;

  const officeToEdit = editingOfficeId
    ? offices.find((o) => o.id === editingOfficeId) || null
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
        setOffices(result.items.map(mapFirmToClientOffice));
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
          const exists = prev.some((o) => o.id === mapped.id);
          if (!exists) return [mapped, ...prev];
          return prev.map((o) => (o.id === mapped.id ? { ...o, ...mapped } : o));
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
    try {
      const issued = await issueFirmImpersonation(officeToEnter.id);
      // Lawyer /impersonate is not deployed yet. Same-origin handoff writes
      // doussary_auth_session then redirects into /lawyer/ (never log the token).
      const session = buildLawyerAuthSession(issued);
      window.open(
        buildImpersonationHandoffUrl(session),
        "_blank",
        "noopener,noreferrer"
      );
      toast.success(`تم فتح لوحة مكتب «${officeToEnter.name}»`);
      setOfficeToEnter(null);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "تعذر الدخول إلى المكتب. يرجى المحاولة مرة أخرى.";
      toast.error(message);
    } finally {
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
    const cleanPlanType = data.planType || (data.plan.includes("تجرب") ? "trial" : "paid");
    const safePlanType = cleanPlanType === "trial" ? "paid" : cleanPlanType;
    const cleanBilling = data.billingCycle?.includes("شهر") ? "monthly" : "yearly";
    const initialPassword =
      data.password && data.password !== "••••••••••••" ? data.password : "AlJudy#Law2025";

    let payload: Record<string, unknown> | FormData;

    if (data.logoFile) {
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
      fd.append("subscription_plan", cleanPlanType);
      fd.append("status", "active");
      fd.append("plan_id", String(data.planId || 1));
      fd.append("billing_cycle", cleanBilling);
      fd.append("auto_renew", data.autoRenew !== false ? "1" : "0");
      if (!isEdit) fd.append("password", initialPassword);
      fd.append("logo", data.logoFile);
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
        plan_type: safePlanType,
        subscription_plan: cleanPlanType,
        status: "active",
        plan_id: data.planId || 1,
        billing_cycle: cleanBilling,
        auto_renew: data.autoRenew !== false,
        password: isEdit ? undefined : initialPassword,
      };
    }

    if (isEdit && officeToEdit) {
      if (data.logoUrl) {
        saveLocalCustomLogo(officeToEdit.id, data.logoUrl);
      } else if (data.logoFile === null && !data.logoUrl) {
        removeLocalCustomLogo(officeToEdit.id);
      }
      try {
        await updateFirm(officeToEdit.id, payload);
        toast.success("تم تحديث بيانات المكتب بنجاح");
      } catch (err: unknown) {
        const msg = (err as { message?: string })?.message || "فشل تحديث بيانات المكتب";
        toast.error(msg);
      }

      setOffices((prev) =>
        prev.map((o) => {
          if (o.id !== officeToEdit.id) return o;
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
            taxNumber: data.taxNumber || o.taxNumber,
            city: data.city || o.city,
            country: "المملكة العربية السعودية",
            plan: data.plan,
            planId: data.planId,
            planType: cleanPlanType,
            billingCycle: cleanBilling === "yearly" ? "سنوي" : "شهري",
            autoRenew: data.autoRenew !== false,
            logo: data.logoUrl || o.logo,
            initialPassword: data.password || o.initialPassword,
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
        if (createdFirm?.logo) returnedLogo = String(createdFirm.logo);
        if (newId && returnedLogo) {
          saveLocalCustomLogo(newId, returnedLogo);
        }
        toast.success("تمت إضافة مكتب المحاماة بنجاح");
      } catch (err: unknown) {
        const msg = (err as { message?: string })?.message || "فشل إضافة مكتب المحاماة";
        toast.error(msg);
      }

      const newlyCreatedOffice: ClientOffice = {
        id: createdOfficeId,
        initial: (data.name.trim().charAt(0) || "م").toUpperCase(),
        initialBg: "bg-[#fff9ee]",
        initialText: "text-[#9c6402]",
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
        plan: data.plan,
        planId: data.planId,
        planType: cleanPlanType,
        billingCycle: cleanBilling === "yearly" ? "سنوي" : "شهري",
        autoRenew: data.autoRenew !== false,
        registrationDate: new Date().toISOString().split("T")[0],
        subscriptionStart: new Date().toISOString().split("T")[0],
        subscriptionEnd: new Date(Date.now() + (cleanBilling === "yearly" ? 365 : 30) * 86400000).toISOString().split("T")[0],
        logo: returnedLogo,
        planBadgeClass:
          "bg-[#ffddb6]/40 text-[#7b4e00] border border-[#ffddb6] dark:bg-[rgba(226,157,56,0.18)] dark:text-[#f3c27e] dark:border-[#e29d38]/50",
        accountStatus: {
          label: "حساب نشط",
          type: "active",
          bgClass: "bg-[#e8f5e9] dark:bg-[#132c1c]",
          textClass: "text-[#1b7340] dark:text-[#6ee7b7]",
          dotClass: "bg-[#1b7340] dark:bg-[#10b981]",
        },
        subscriptionStatus: {
          label: cleanPlanType === "trial" ? "تجربة مجانية" : "اشتراك نشط",
          type: cleanPlanType === "trial" ? "trial" : "active",
          bgClass: "bg-[#fffbeb] dark:bg-[rgba(226,157,56,0.18)]",
          textClass: "text-[#92400e] dark:text-[#f3c27e]",
        },
        resourceUsage: {
          lawyersUsed: 1,
          lawyersLimit: data.plan.includes("النخبة") || data.plan.includes("شركات") ? 25 : data.plan.includes("متقدم") ? 10 : 5,
          lawyersPercent: 10,
          storageUsedGb: "0.00",
          storageLimitGb: data.plan.includes("النخبة") ? 200 : 50,
          storagePercent: 0,
          activeCases: 0,
        },
        internalNotes: [
          {
            id: Date.now(),
            authorName: "مشرف النظام",
            authorRole: "إدارة النظام",
            note: "تم إنشاء حساب المكتب وتفعيل الاشتراك بنجاح وفق الإعدادات المعتمدة.",
            createdAt: new Date().toISOString(),
          },
        ],
      };

      setOffices((prev) => [newlyCreatedOffice, ...prev.filter((o) => o.id !== newlyCreatedOffice.id)]);
    }

    try {
      const result = await fetchFirms({ status: "all", page: 1, per_page: 100 });
      if (result.items.length > 0) {
        const fetchedOffices = result.items.map(mapFirmToClientOffice);
        setOffices((prev) => {
          // Merge to preserve local initialPassword or details
          return fetchedOffices.map((fetched) => {
            const local = prev.find((p) => p.id === fetched.id);
            if (!local) return fetched;
            return {
              ...fetched,
              initialPassword: local.initialPassword || fetched.initialPassword,
              password: local.password || fetched.password,
              landline: fetched.landline || local.landline,
              address: fetched.address || local.address,
              taxNumber: fetched.taxNumber || local.taxNumber,
              owner: fetched.owner !== "—" ? fetched.owner : local.owner,
            };
          });
        });
      }
    } catch (err) {
      console.error("Failed to reload firms:", err);
    }

    setEditingOfficeId(null);
    setIsAddingNew(false);
    router.push("/accounts");
  };

  const handleConfirmDeactivate = async () => {
    if (!officeToDeactivate) return;
    const targetId = officeToDeactivate.id;
    const targetName = officeToDeactivate.name;

    try {
      await updateFirmStatus(targetId, "suspended", "تعطيل مؤقت من لوحة الإدارة");
      toast.success(`تم تعطيل حساب ${targetName} مؤقتاً بنجاح.`);
    } catch {
      toast.error(`تعذر تعطيل حساب ${targetName}`);
    }

    try {
      const result = await fetchFirms({ status: "all", page: 1, per_page: 100 });
      if (result.items.length > 0) {
        setOffices(result.items.map(mapFirmToClientOffice));
      }
    } catch {}

    setOfficeToDeactivate(null);
  };

  const handleConfirmDelete = async () => {
    if (!officeToDelete) return;
    const targetId = officeToDelete.id;
    const targetName = officeToDelete.name;

    try {
      await deleteFirm(targetId);
      toast.success(`تم حذف مكتب "${targetName}" نهائياً من النظام.`);
    } catch {
      toast.error(`تعذر حذف مكتب "${targetName}"`);
    }

    setOffices((prev) => prev.filter((o) => o.id !== targetId));

    if (activeOfficeId === targetId) {
      setActiveOfficeId(null);
      setEditingOfficeId(null);
      setIsAddingNew(false);
      router.push("/accounts");
    }

    setOfficeToDelete(null);
  };

  const handleReactivate = async (office: ClientOffice) => {
    try {
      await updateFirmStatus(office.id, "active");
      toast.success(`تم تنشيط حساب ${office.name} بنجاح`);
    } catch {
      toast.error(`تعذر تنشيط حساب ${office.name}`);
    }

    try {
      const result = await fetchFirms({ status: "all", page: 1, per_page: 100 });
      if (result.items.length > 0) {
        setOffices(result.items.map(mapFirmToClientOffice));
      }
    } catch {}
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
                <ClientKpiMetrics />

                {/* Main Client Offices Data Table */}
                <ClientManagementTable
                  offices={offices}
                  isLoading={isLoadingOffices}
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
                />
              </>
              )
            )}

            {currentView === "add" && (
              <AddClientOfficeView
                key={officeToEdit ? officeToEdit.id : "new-office"}
                officeToEdit={officeToEdit}
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
                    prev.map((o) => (o.id === office.id ? { ...o, plan: newPlan } : o))
                  );
                }}
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
