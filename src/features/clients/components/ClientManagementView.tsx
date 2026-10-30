"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { ClientManagementHeader } from "./ClientManagementHeader";
import { ClientKpiMetrics } from "./ClientKpiMetrics";
import { ClientManagementTable } from "./ClientManagementTable";
import { AddClientOfficeView, OfficeFormData } from "./AddClientOfficeView";
import { ClientOfficeDetailsView } from "./ClientOfficeDetailsView";
import { DeactivateOfficeModal } from "./DeactivateOfficeModal";
import { DeleteOfficeModal } from "./DeleteOfficeModal";
import { ClientOffice } from "../types/client.types";
import { initialOffices } from "../data/initialOffices";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";

export function ClientManagementView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const officeIdParam = searchParams?.get("officeId");
  const actionParam = searchParams?.get("action");

  const [offices, setOffices] = useState<ClientOffice[]>(initialOffices);
  const [activeOfficeId, setActiveOfficeId] = useState<string | null>(officeIdParam || null);
  const [editingOfficeId, setEditingOfficeId] = useState<string | null>(
    actionParam === "edit" ? officeIdParam || null : null
  );
  const [isAddingNew, setIsAddingNew] = useState<boolean>(actionParam === "add");

  // Adjust state during render when URL search params change
  const [prevOfficeIdParam, setPrevOfficeIdParam] = useState(officeIdParam);
  const [prevActionParam, setPrevActionParam] = useState(actionParam);

  if (officeIdParam !== prevOfficeIdParam || actionParam !== prevActionParam) {
    setPrevOfficeIdParam(officeIdParam);
    setPrevActionParam(actionParam);
    setActiveOfficeId(officeIdParam || null);
    setEditingOfficeId(actionParam === "edit" ? officeIdParam || null : null);
    setIsAddingNew(actionParam === "add");
  }

  const selectedOffice = activeOfficeId
    ? offices.find((o) => o.id === activeOfficeId) || null
    : null;

  const officeToEdit = editingOfficeId
    ? offices.find((o) => o.id === editingOfficeId) || null
    : null;

  const currentView: "list" | "add" | "details" = isAddingNew || officeToEdit
    ? "add"
    : selectedOffice
    ? "details"
    : "list";

  // Modals state
  const [officeToDeactivate, setOfficeToDeactivate] = useState<ClientOffice | null>(null);
  const [officeToDelete, setOfficeToDelete] = useState<ClientOffice | null>(null);

  // Handlers
  const handleBackToList = () => {
    setActiveOfficeId(null);
    setEditingOfficeId(null);
    setIsAddingNew(false);
    router.replace("/accounts");
  };

  const handleStartAddOffice = () => {
    setActiveOfficeId(null);
    setEditingOfficeId(null);
    setIsAddingNew(true);
  };

  const handleStartEditOffice = (office: ClientOffice) => {
    setActiveOfficeId(null);
    setEditingOfficeId(office.id);
    setIsAddingNew(false);
  };

  const handleSaveOffice = (data: OfficeFormData, isEdit: boolean) => {
    if (isEdit && officeToEdit) {
      setOffices((prev) =>
        prev.map((o) => {
          if (o.id === officeToEdit.id) {
            const updated: ClientOffice = {
              ...o,
              name: data.name,
              owner: data.owner,
              licenseNumber: data.licenseNumber,
              email: data.email,
              phone: data.phone,
              city: data.city,
              plan: data.plan,
              planBadgeClass: data.plan.includes("احترافية")
                ? "bg-[#ffddb6]/40 text-[#7b4e00] border border-[#ffddb6] dark:bg-[rgba(226,157,56,0.18)] dark:text-[#f3c27e] dark:border-[#e29d38]/50"
                : data.plan.includes("شركات")
                ? "bg-[#f5f3ef] text-[#1b1c1a] border border-[#eae8e4] dark:bg-[#38261b] dark:text-[#ffddb6] dark:border-[#e29d38]/40"
                : data.plan.includes("أساسية")
                ? "bg-[#f5f3ef] text-[#514537] border border-[#eae8e4] dark:bg-[#281c15] dark:text-[#cdc5bd] dark:border-[#4d3627]"
                : "bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe] dark:bg-[#172554] dark:text-[#93c5fd] dark:border-blue-500/40",
            };
            return updated;
          }
          return o;
        })
      );
      setEditingOfficeId(null);
      setIsAddingNew(false);
    } else {
      const newOffice: ClientOffice = {
        id: Date.now().toString(),
        initial: data.name.trim()[0] || "م",
        initialBg: "bg-[#ffddb6] dark:bg-[#2d1f16] border border-transparent dark:border-[#4d3627]/60",
        initialText: "text-[#7b4e00] dark:text-[#f3c27e]",
        name: data.name,
        licenseNumber: data.licenseNumber,
        city: data.city,
        owner: data.owner,
        email: data.email,
        phone: data.phone,
        plan: data.plan,
        planBadgeClass: data.plan.includes("احترافية")
          ? "bg-[#ffddb6]/40 text-[#7b4e00] border border-[#ffddb6] dark:bg-[rgba(226,157,56,0.18)] dark:text-[#f3c27e] dark:border-[#e29d38]/50"
          : data.plan.includes("شركات")
          ? "bg-[#f5f3ef] text-[#1b1c1a] border border-[#eae8e4] dark:bg-[#38261b] dark:text-[#ffddb6] dark:border-[#e29d38]/40"
          : data.plan.includes("أساسية")
          ? "bg-[#f5f3ef] text-[#514537] border border-[#eae8e4] dark:bg-[#281c15] dark:text-[#cdc5bd] dark:border-[#4d3627]"
          : "bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe] dark:bg-[#172554] dark:text-[#93c5fd] dark:border-blue-500/40",
        registrationDate: "اليوم",
        accountStatus: {
          label: "نشط",
          type: "active",
          bgClass: "bg-[#e8f5e9] border border-[#c8e6c9] dark:bg-[#132c1c] dark:border-emerald-500/40",
          textClass: "text-[#1b7340] dark:text-[#6ee7b7]",
          dotClass: "bg-[#1b7340] dark:bg-[#10b981]",
        },
        subscriptionStatus: {
          label: "نشط",
          type: "active",
          bgClass: "bg-[#e8f5e9] border border-[#c8e6c9] dark:bg-[#132c1c] dark:border-emerald-500/40",
          textClass: "text-[#1b7340] dark:text-[#6ee7b7]",
        },
      };

      setOffices((prev) => [newOffice, ...prev]);
      setEditingOfficeId(null);
      setIsAddingNew(false);
    }
  };

  const handleConfirmDeactivate = () => {
    if (!officeToDeactivate) return;
    const targetId = officeToDeactivate.id;
    const targetName = officeToDeactivate.name;

    setOffices((prev) =>
      prev.map((o) => {
        if (o.id === targetId) {
          const updated: ClientOffice = {
            ...o,
            accountStatus: {
              label: "معطل",
              type: "suspended",
              bgClass: "bg-[#fef2f2]",
              textClass: "text-[#dc2626]",
              dotClass: "bg-[#dc2626]",
            },
          };
          return updated;
        }
        return o;
      })
    );

    toast.success(`تم تعطيل حساب ${targetName} مؤقتاً بنجاح.`);
    setOfficeToDeactivate(null);
  };

  const handleConfirmDelete = () => {
    if (!officeToDelete) return;
    const targetId = officeToDelete.id;
    const targetName = officeToDelete.name;

    setOffices((prev) => prev.filter((o) => o.id !== targetId));

    if (activeOfficeId === targetId) {
      setActiveOfficeId(null);
      setEditingOfficeId(null);
      setIsAddingNew(false);
    }

    toast.error(`تم حذف مكتب "${targetName}" نهائياً من النظام.`);
    setOfficeToDelete(null);
  };

  const handleReactivate = (office: ClientOffice) => {
    setOffices((prev) =>
      prev.map((o) => {
        if (o.id === office.id) {
          const updated: ClientOffice = {
            ...o,
            accountStatus: {
              label: "نشط",
              type: "active",
              bgClass: "bg-[#e8f5e9]",
              textClass: "text-[#1b7340]",
              dotClass: "bg-[#1b7340]",
            },
          };
          return updated;
        }
        return o;
      })
    );
  };

  const breadcrumbs =
    currentView === "details"
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
              <>
                {/* Header with Title & Add Office Button */}
                <ClientManagementHeader onAddOffice={handleStartAddOffice} />

                {/* 4 KPI Metrics Cards */}
                <ClientKpiMetrics />

                {/* Main Client Offices Data Table */}
                <ClientManagementTable
                  offices={offices}
                  onViewOfficeDetails={(office) => {
                    setActiveOfficeId(office.id);
                    setEditingOfficeId(null);
                    setIsAddingNew(false);
                  }}
                  onEditOffice={handleStartEditOffice}
                  onOpenDeactivateModal={(office) => setOfficeToDeactivate(office)}
                  onOpenDeleteModal={(office) => setOfficeToDelete(office)}
                />
              </>
            )}

            {currentView === "add" && (
              <AddClientOfficeView
                key={officeToEdit ? officeToEdit.id : "new-office"}
                officeToEdit={officeToEdit}
                onBack={handleBackToList}
                onSuccess={handleSaveOffice}
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
                onOpenDeactivateModal={(office) => setOfficeToDeactivate(office)}
                onReactivate={handleReactivate}
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
    </div>
  );
}
