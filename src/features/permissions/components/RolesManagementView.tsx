"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { RoleItem } from "../types/roles.types";
import { initialRolesList } from "../data/initialRoles";
import { RolesKpiMetrics } from "./RolesKpiMetrics";
import { RolesToolbar } from "./RolesToolbar";
import { RolesTable } from "./RolesTable";
import { RolesEmptyState } from "./RolesEmptyState";
import { AddRoleView } from "./AddRoleView";
import { DeleteRoleBlockedModal } from "./DeleteRoleBlockedModal";
import { ReassignEmployeesModal } from "./ReassignEmployeesModal";
import { DeleteRoleConfirmModal } from "./DeleteRoleConfirmModal";
import { useLanguage } from "@/lib/i18n";
import {
  fetchRoles,
  fetchRolesStats,
  createRole,
  updateRole,
  deleteRole,
  reassignRoleStaff,
} from "@/lib/api/roles";
import { mapRolesResponse } from "@/lib/api/mappers";
import { readStats } from "@/lib/api/helpers";

export function RolesManagementView() {
  const { t, direction } = useLanguage();

  // Navigation & View States
  const [currentView, setCurrentView] = useState<"list" | "empty" | "add" | "edit">("list");

  // Roles State
  const [roles, setRoles] = useState<RoleItem[]>(initialRolesList);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [apiRoleStats, setApiRoleStats] = useState<{
    totalPermissions?: number;
    totalAssignedStaff?: number;
    systemProtectedRoles?: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    Promise.all([fetchRoles(), fetchRolesStats()])
      .then(([payload, statsPayload]) => {
        if (cancelled) return;
        const mapped = mapRolesResponse(payload);
        if (mapped.length > 0) setRoles(mapped);
        setApiRoleStats({
          totalPermissions: readStats(statsPayload, ["total_permissions", "permissions"], 64),
          totalAssignedStaff: readStats(
            statsPayload,
            ["assigned_staff", "total_assigned_staff", "staff_count"],
            0
          ),
          systemProtectedRoles: readStats(
            statsPayload,
            ["system_roles", "protected_roles", "system_protected_roles"],
            0
          ),
        });
      })
      .catch(() => {
        // Keep mock roles if API unavailable.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  // Modals State
  const [deleteBlockedRole, setDeleteBlockedRole] = useState<RoleItem | null>(null);
  const [reassignSourceRole, setReassignSourceRole] = useState<RoleItem | null>(null);
  const [deleteConfirmRole, setDeleteConfirmRole] = useState<RoleItem | null>(null);

  // Filtered Roles
  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      // Search by name or slug
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = role.name.toLowerCase().includes(q);
        const matchesSlug = role.slug.toLowerCase().includes(q);
        if (!matchesName && !matchesSlug) return false;
      }

      // Filter by type
      if (selectedType !== "all") {
        if (role.type !== selectedType) return false;
      }

      return true;
    });
  }, [roles, searchQuery, selectedType]);

  // Dynamic KPI Stats
  const currentKpis = useMemo(() => {
    const activeRoles = roles.length;
    const totalAssignedStaff =
      apiRoleStats?.totalAssignedStaff ??
      roles.reduce((acc, r) => acc + r.assignedEmployeesCount, 0);
    const systemProtectedRoles =
      apiRoleStats?.systemProtectedRoles ??
      roles.filter((r) => r.isProtected).length;

    return {
      totalActiveRoles: activeRoles,
      totalPermissions: apiRoleStats?.totalPermissions ?? 64,
      totalAssignedStaff,
      systemProtectedRoles,
      systemSecurityPct: 100,
    };
  }, [roles, apiRoleStats]);

  // Handle Delete Click
  const handleInitiateDeleteRole = (role: RoleItem) => {
    if (role.isProtected) {
      toast.error(t("هذا الدور محمي من قبل النظام ولا يمكن حذفه", "This role is protected by system policy and cannot be deleted"));
      return;
    }

    if (role.assignedEmployeesCount > 0) {
      setDeleteBlockedRole(role);
    } else {
      setDeleteConfirmRole(role);
    }
  };

  // Transition from Blocked to Reassign
  const handleOpenReassignFromBlocked = (role: RoleItem) => {
    setDeleteBlockedRole(null);
    setReassignSourceRole(role);
  };

  // Execute Reassignment of Employees
  const handleConfirmReassign = async (sourceRoleId: string, targetRoleId: string) => {
    const source = roles.find((r) => r.id === sourceRoleId);
    const target = roles.find((r) => r.id === targetRoleId);
    if (!source || !target) return;

    const count = source.assignedEmployeesCount;

    try {
      await reassignRoleStaff(sourceRoleId, targetRoleId);
    } catch {
      // Keep local reassignment.
    }

    setRoles((prev) =>
      prev.map((r) => {
        if (r.id === sourceRoleId) {
          return { ...r, assignedEmployeesCount: 0 };
        }
        if (r.id === targetRoleId) {
          return {
            ...r,
            assignedEmployeesCount: r.assignedEmployeesCount + count,
          };
        }
        return r;
      })
    );

    setReassignSourceRole(null);
    toast.success(
      t(
        `تم نقل (${count}) موظفاً بنجاح من "${source.name}" إلى "${target.name}". الدور الآن متاح للحذف بأمان.`,
        `Successfully transferred (${count}) employees from "${source.name}" to "${target.name}". Role is now safe to delete.`
      )
    );

    const updatedSource = { ...source, assignedEmployeesCount: 0 };
    setDeleteConfirmRole(updatedSource);
  };

  // Confirm Final Deletion
  const handleExecuteDeleteRole = async (roleId: string) => {
    const targetRole = roles.find((r) => r.id === roleId);
    try {
      await deleteRole(roleId);
    } catch {
      // Keep local delete.
    }
    setRoles((prev) => prev.filter((r) => r.id !== roleId));
    setDeleteConfirmRole(null);
    toast.success(
      t(
        `تم حذف الدور الوظيفي "${targetRole?.name || ""}" نهائياً من النظام.`,
        `Role "${targetRole?.name || ""}" deleted permanently from system.`
      )
    );
  };

  // Save or Update Role
  const handleSaveRole = async (roleToSave: RoleItem) => {
    const payload = {
      name: roleToSave.name,
      slug: roleToSave.slug,
      description: roleToSave.description || roleToSave.subtitle,
      permissions: roleToSave.permissions || [],
    };
    try {
      const exists = roles.some((r) => r.id === roleToSave.id);
      if (exists) {
        await updateRole(roleToSave.id, payload);
      } else {
        await createRole(payload);
      }
    } catch {
      // Keep local save.
    }
    setRoles((prev) => {
      const exists = prev.some((r) => r.id === roleToSave.id);
      if (exists) {
        return prev.map((r) => (r.id === roleToSave.id ? roleToSave : r));
      }
      return [roleToSave, ...prev];
    });
    setEditingRole(null);
  };

  return (
    <div dir={direction} className="flex h-screen h-dvh overflow-hidden bg-background text-foreground transition-colors duration-200 font-['Cairo',sans-serif] antialiased">
      {/* Sidebar with active sub-nav for Roles & Permissions */}
      <DashboardSidebar activeNav="staff" activeSubNav="roles" />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <DashboardTopNavbar />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 w-full space-y-6 scrollbar-thin">
          <DashboardPageTransition>
            {/* Main Title & Command Banner */}
            {(currentView === "list" || currentView === "empty") && (
              <div
                className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                data-node-id="1:11533"
              >
                <div className="text-start">
                  <h1
                    className="text-[26px] sm:text-[28px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[38px]"
                    data-node-id="1:11547"
                  >
                    {t("الأدوار والصلاحيات", "Roles & Permissions")}
                  </h1>
                  <p className="text-[14px] text-[#514537] dark:text-[#cdc5bd] mt-1" data-node-id="1:11545">
                    {t(
                      "إدارة الأدوار وتحديد صلاحيات الوصول إلى أقسام النظام والهيكل الإداري للمنصة.",
                      "Manage roles, configure access permissions, and govern platform administration."
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingRole(null);
                    setCurrentView("add");
                  }}
                  className="bg-[#9c6402] hover:bg-[#855402] dark:bg-[#e29d38] dark:hover:bg-[#d08c2a] text-white dark:text-[#1c140f] px-5 py-2.5 rounded-[6px] font-bold text-[14px] flex items-center gap-2 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors shrink-0 cursor-pointer"
                  data-node-id="1:11536"
                >
                  <Plus className="size-[15px]" />
                  <span>{t("إضافة دور جديد", "Add New Role")}</span>
                </button>
              </div>
            )}

            {/* VIEW: Empty State */}
            {currentView === "empty" && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentView("list")}
                    className="text-[12px] text-[#9c6402] hover:underline font-semibold cursor-pointer"
                  >
                    {t("العودة للجدول المكتمل", "Back to Full Table")}
                  </button>
                </div>

                <RolesKpiMetrics kpis={currentKpis} isEmpty />

                <RolesEmptyState
                  onAddRole={() => {
                    setEditingRole(null);
                    setCurrentView("add");
                  }}
                />
              </div>
            )}

            {/* VIEW: Main List & Table */}
            {currentView === "list" && (
              isLoading && roles.length === 0 ? (
                <DashboardPageSkeleton />
              ) : (
                <div className="space-y-6">
                  <RolesKpiMetrics kpis={currentKpis} />

                  <div className="space-y-0">
                    <RolesToolbar
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      selectedType={selectedType}
                      onTypeChange={setSelectedType}
                      onReset={() => {
                        setSearchQuery("");
                        setSelectedType("all");
                      }}
                      isEmptyView={false}
                      onToggleEmptyView={() => setCurrentView("empty")}
                    />

                    <RolesTable
                      roles={filteredRoles}
                      onEditRole={(role) => {
                        setEditingRole(role);
                        setCurrentView("edit");
                      }}
                      onDeleteRole={handleInitiateDeleteRole}
                    />
                  </div>
                </div>
              )
            )}

            {/* VIEW: Add / Edit Role */}
            {(currentView === "add" || currentView === "edit") && (
              <AddRoleView
                onBack={() => {
                  setEditingRole(null);
                  setCurrentView("list");
                }}
                onSaveRole={handleSaveRole}
                initialRole={editingRole}
              />
            )}
          </DashboardPageTransition>
        </main>
      </div>

      {/* DIALOG 1: Delete Role Blocked */}
      <DeleteRoleBlockedModal
        isOpen={!!deleteBlockedRole}
        onClose={() => setDeleteBlockedRole(null)}
        role={deleteBlockedRole}
        onGoToReassign={handleOpenReassignFromBlocked}
      />

      {/* DIALOG 2: Reassign Employees */}
      <ReassignEmployeesModal
        isOpen={!!reassignSourceRole}
        onClose={() => setReassignSourceRole(null)}
        sourceRole={reassignSourceRole}
        availableRoles={roles}
        onConfirmReassign={handleConfirmReassign}
      />

      {/* DIALOG 3: Delete Role Confirmed */}
      <DeleteRoleConfirmModal
        isOpen={!!deleteConfirmRole}
        onClose={() => setDeleteConfirmRole(null)}
        role={deleteConfirmRole}
        onConfirmDelete={handleExecuteDeleteRole}
      />
    </div>
  );
}