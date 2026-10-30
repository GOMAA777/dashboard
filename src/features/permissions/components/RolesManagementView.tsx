"use client";

import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
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

export function RolesManagementView() {
  // Navigation & View States
  const [currentView, setCurrentView] = useState<"list" | "empty" | "add" | "edit">("list");

  // Roles State
  const [roles, setRoles] = useState<RoleItem[]>(initialRolesList);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);

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
    const totalAssignedStaff = roles.reduce(
      (acc, r) => acc + r.assignedEmployeesCount,
      0
    );
    const systemProtectedRoles = roles.filter((r) => r.isProtected).length;

    return {
      totalActiveRoles: activeRoles,
      totalPermissions: 64,
      totalAssignedStaff,
      systemProtectedRoles,
      systemSecurityPct: 100,
    };
  }, [roles]);

  // Handle Delete Click
  const handleInitiateDeleteRole = (role: RoleItem) => {
    if (role.isProtected) {
      toast.error("هذا الدور محمي من قبل النظام ولا يمكن حذفه");
      return;
    }

    if (role.assignedEmployeesCount > 0) {
      // Open blocked modal (Figma 1:11997)
      setDeleteBlockedRole(role);
    } else {
      // Open confirmed deletion modal (Figma 1:12141)
      setDeleteConfirmRole(role);
    }
  };

  // Transition from Blocked to Reassign
  const handleOpenReassignFromBlocked = (role: RoleItem) => {
    setDeleteBlockedRole(null);
    setReassignSourceRole(role);
  };

  // Execute Reassignment of Employees
  const handleConfirmReassign = (sourceRoleId: string, targetRoleId: string) => {
    const source = roles.find((r) => r.id === sourceRoleId);
    const target = roles.find((r) => r.id === targetRoleId);
    if (!source || !target) return;

    const count = source.assignedEmployeesCount;

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
      `تم نقل (${count}) موظفاً بنجاح من "${source.name}" إلى "${target.name}". الدور الآن متاح للحذف بأمان.`
    );

    // Open confirmed delete modal for the now empty source role
    const updatedSource = { ...source, assignedEmployeesCount: 0 };
    setDeleteConfirmRole(updatedSource);
  };

  // Confirm Final Deletion
  const handleExecuteDeleteRole = (roleId: string) => {
    const targetRole = roles.find((r) => r.id === roleId);
    setRoles((prev) => prev.filter((r) => r.id !== roleId));
    setDeleteConfirmRole(null);
    toast.success(`تم حذف الدور الوظيفي "${targetRole?.name || ""}" نهائياً من النظام.`);
  };

  // Save or Update Role
  const handleSaveRole = (roleToSave: RoleItem) => {
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
    <div className="flex h-screen h-dvh overflow-hidden bg-background text-foreground transition-colors duration-200 font-sans antialiased">
      {/* Sidebar with active sub-nav for Roles & Permissions */}
      <DashboardSidebar activeNav="staff" activeSubNav="roles" />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <DashboardTopNavbar />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 w-full space-y-6 scrollbar-thin">
          <DashboardPageTransition>
            {/* Main Title & Command Banner (Figma 1:11533 / 1:11321) */}
          {(currentView === "list" || currentView === "empty") && (
            <div
              className="bg-white rounded-[8px] p-6 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center justify-between"
              data-node-id="1:11533"
            >
              <div>
                <h1
                  className="text-[26px] sm:text-[28px] font-bold text-[#1b1c1a] leading-[38px]"
                  data-node-id="1:11547"
                >
                  الأدوار والصلاحيات
                </h1>
                <p className="text-[14px] text-[#514537] mt-1" data-node-id="1:11545">
                  إدارة الأدوار وتحديد صلاحيات الوصول إلى أقسام النظام والهيكل الإداري للمنصة.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingRole(null);
                  setCurrentView("add");
                }}
                className="bg-[#9c6402] hover:bg-[#855402] text-white px-5 py-2.5 rounded-[4px] font-semibold text-[14px] flex items-center gap-2 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors shrink-0 cursor-pointer"
                data-node-id="1:11536"
              >
                <Plus className="size-[15px]" />
                <span>إضافة دور جديد</span>
              </button>
            </div>
          )}

          {/* VIEW: Empty State (Figma 1:11321) */}
          {currentView === "empty" && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentView("list")}
                  className="text-[12px] text-[#9c6402] hover:underline font-semibold cursor-pointer"
                >
                  العودة للجدول المكتمل
                </button>
              </div>

              {/* 3 KPI Cards for empty state */}
              <RolesKpiMetrics kpis={currentKpis} isEmpty />

              {/* Central Empty State Widget */}
              <RolesEmptyState
                onAddRole={() => {
                  setEditingRole(null);
                  setCurrentView("add");
                }}
              />
            </div>
          )}

          {/* VIEW: Main List & Table (Figma 1:11530) */}
          {currentView === "list" && (
            <div className="space-y-6">
              {/* 4 KPI Cards */}
              <RolesKpiMetrics kpis={currentKpis} />

              {/* Content Card: Toolbar + Table */}
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
          )}

          {/* VIEW: Add / Edit Role (Figma 1:12201) */}
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

      {/* DIALOG 1: Delete Role Blocked with Active Employees (Figma 1:11997) */}
      <DeleteRoleBlockedModal
        isOpen={!!deleteBlockedRole}
        onClose={() => setDeleteBlockedRole(null)}
        role={deleteBlockedRole}
        onGoToReassign={handleOpenReassignFromBlocked}
      />

      {/* DIALOG 2: Reassign Employees (Figma 1:12092) */}
      <ReassignEmployeesModal
        isOpen={!!reassignSourceRole}
        onClose={() => setReassignSourceRole(null)}
        sourceRole={reassignSourceRole}
        availableRoles={roles}
        onConfirmReassign={handleConfirmReassign}
      />

      {/* DIALOG 3: Delete Role Confirmed (Figma 1:12141) */}
      <DeleteRoleConfirmModal
        isOpen={!!deleteConfirmRole}
        onClose={() => setDeleteConfirmRole(null)}
        role={deleteConfirmRole}
        onConfirmDelete={handleExecuteDeleteRole}
      />
    </div>
  );
}
