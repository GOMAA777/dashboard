"use client";

import React, { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { StaffKpiMetrics } from "./StaffKpiMetrics";
import { StaffToolbar } from "./StaffToolbar";
import { StaffTable } from "./StaffTable";
import { StaffEmptyState } from "./StaffEmptyState";
import { AddEmployeeView } from "./AddEmployeeView";
import { EmployeeDetailsView } from "./EmployeeDetailsView";
import { LoginAsEmployeeModal } from "./LoginAsEmployeeModal";
import { PreviewErrorModal } from "./PreviewErrorModal";
import { EndPreviewModal } from "./EndPreviewModal";
import { DeactivateEmployeeModal } from "./DeactivateEmployeeModal";
import { ActivateEmployeeModal } from "./ActivateEmployeeModal";
import { ResetPasswordModal } from "./ResetPasswordModal";
import { EmployeePreviewModeView } from "./EmployeePreviewModeView";
import { Employee } from "../types/staff.types";
import { initialStaffMembers, initialStaffKpis } from "../data/initialStaff";
import { Plus } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import {
  fetchStaff,
  fetchStaffStats,
  fetchStaffById,
  updateStaff,
  updateStaffStatus,
  impersonateStaff,
  createStaff,
} from "@/lib/api/staff";
import { mapStaffResponse, mapStaffFromApi } from "@/lib/api/mappers";
import { readStats, unwrapData } from "@/lib/api/helpers";

export function StaffManagementView() {
  const { t, isEn, direction } = useLanguage();

  // Navigation & View States
  const [currentView, setCurrentView] = useState<
    "list" | "empty" | "add" | "details" | "preview"
  >("list");

  // Staff State
  const [employees, setEmployees] = useState<Employee[]>(initialStaffMembers);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [apiStaffStats, setApiStaffStats] = useState<{
    total?: number;
    active?: number;
    suspended?: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    Promise.all([fetchStaff(), fetchStaffStats()])
      .then(([payload, statsPayload]) => {
        if (cancelled) return;
        const mapped = mapStaffResponse(payload);
        if (mapped.length > 0) {
          setEmployees(mapped);
          setSelectedEmployee(mapped[0] || null);
        }
        setApiStaffStats({
          total: readStats(statsPayload, ["total", "total_staff", "staff_count"], 0),
          active: readStats(statsPayload, ["active", "active_staff"], 0),
          suspended: readStats(statsPayload, ["suspended", "inactive_staff"], 0),
        });
      })
      .catch(() => {
        // Keep empty staff if API unavailable.
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
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLastLogin, setSelectedLastLogin] = useState("all");

  // Modals State
  const [loginModalEmployee, setLoginModalEmployee] = useState<Employee | null>(null);
  const [errorModalEmployee, setErrorModalEmployee] = useState<Employee | null>(null);
  const [deactivateModalEmployee, setDeactivateModalEmployee] = useState<Employee | null>(null);
  const [activateModalEmployee, setActivateModalEmployee] = useState<Employee | null>(null);
  const [resetPasswordModalEmployee, setResetPasswordModalEmployee] = useState<Employee | null>(null);
  const [endPreviewModalOpen, setEndPreviewModalOpen] = useState(false);

  // Active Simulated Employee
  const [previewEmployee, setPreviewEmployee] = useState<Employee | null>(null);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = emp.name.toLowerCase().includes(q);
        const matchesEmail = emp.email.toLowerCase().includes(q);
        const matchesCode = emp.empCode.toLowerCase().includes(q);
        const matchesDept = emp.department.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesCode && !matchesDept) {
          return false;
        }
      }

      // Role
      if (selectedRole !== "all" && emp.role.id !== selectedRole) {
        return false;
      }

      // Status
      if (selectedStatus !== "all" && emp.status !== selectedStatus) {
        return false;
      }

      // Last Login
      if (selectedLastLogin === "today") {
        if (!emp.lastLogin.time.includes("اليوم") && !emp.lastLogin.time.includes("Today")) return false;
      } else if (selectedLastLogin === "week") {
        if (emp.lastLogin.time.includes("يوماً") || emp.lastLogin.time.includes("days") || emp.lastLogin.time.includes("لم يسجل") || emp.lastLogin.time.includes("Never")) return false;
      }

      return true;
    });
  }, [employees, searchQuery, selectedRole, selectedStatus, selectedLastLogin]);

  // Dynamic KPIs
  const currentKpis = useMemo(() => {
    const total = apiStaffStats?.total || employees.length;
    const activeCount =
      apiStaffStats?.active ?? employees.filter((e) => e.status === "active").length;
    const suspendedCount =
      apiStaffStats?.suspended ?? total - activeCount;
    return {
      ...initialStaffKpis,
      totalStaff: total,
      activeStaff: activeCount,
      activePercentage: total > 0 ? Number(((activeCount / total) * 100).toFixed(1)) : 0,
      suspendedStaff: suspendedCount,
    };
  }, [employees, apiStaffStats]);

  // Handlers
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedRole("all");
    setSelectedStatus("all");
    setSelectedLastLogin("all");
    toast.info(t("تمت إعادة ضبط فلاتر البحث.", "Search filters have been reset."));
  };

  const handleSaveNewEmployee = async (newEmp: Employee) => {
    const payload = {
      name: newEmp.name,
      email: newEmp.email,
      phone: newEmp.phone,
      job_title: newEmp.jobTitle,
      role_id: newEmp.role.id,
      department: newEmp.department,
    };
    try {
      if (selectedEmployee && currentView === "add" && selectedEmployee.id === newEmp.id) {
        await updateStaff(newEmp.id, payload);
      } else if (employees.some((e) => e.id === newEmp.id)) {
        await updateStaff(newEmp.id, payload);
      } else {
        await createStaff(payload);
      }
    } catch {
      // Keep local create/update.
    }
    setEmployees((prev) => {
      const exists = prev.some((e) => e.id === newEmp.id);
      return exists
        ? prev.map((e) => (e.id === newEmp.id ? newEmp : e))
        : [newEmp, ...prev];
    });
    setSelectedEmployee(newEmp);
    setCurrentView("details");
  };

  const handleStartLoginAsEmployee = (emp: Employee) => {
    if (emp.status === "suspended") {
      setErrorModalEmployee(emp);
    } else {
      setLoginModalEmployee(emp);
    }
  };

  const handleConfirmStartSimulation = async () => {
    if (loginModalEmployee) {
      try {
        await impersonateStaff(loginModalEmployee.id);
      } catch {
        // Continue local preview mode.
      }
      setPreviewEmployee(loginModalEmployee);
      setLoginModalEmployee(null);
      setCurrentView("preview");
      toast.success(
        isEn
          ? `Preview mode as employee "${loginModalEmployee.name}" started successfully.`
          : `تم بدء وضع المعاينة بصفة الموظف "${loginModalEmployee.name}" بنجاح.`
      );
    }
  };

  const handleConfirmDeactivate = async (reason: string) => {
    if (!deactivateModalEmployee) return;
    try {
      await updateStaffStatus(deactivateModalEmployee.id, "suspended");
    } catch {
      // Keep local update.
    }
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === deactivateModalEmployee.id
          ? {
              ...e,
              status: "suspended",
              lastLogin: {
                time: isEn ? "Today" : "اليوم",
                note: reason.trim()
                  ? (isEn ? `Suspension reason: ${reason}` : `سبب الإيقاف: ${reason}`)
                  : (isEn ? "Session suspended by supervisor" : "تم إيقاف الجلسة بقرار رقابي"),
              },
            }
          : e
      )
    );
    if (selectedEmployee?.id === deactivateModalEmployee.id) {
      setSelectedEmployee({
        ...selectedEmployee,
        status: "suspended",
        lastLogin: {
          time: isEn ? "Today" : "اليوم",
          note: reason.trim()
            ? (isEn ? `Suspension reason: ${reason}` : `سبب الإيقاف: ${reason}`)
            : (isEn ? "Session suspended by supervisor" : "تم إيقاف الجلسة بقرار رقابي"),
        },
      });
    }
    toast.success(
      isEn
        ? `Employee account "${deactivateModalEmployee.name}" suspended immediately.`
        : `تم إيقاف حساب الموظف "${deactivateModalEmployee.name}" فورياً.`
    );
    setDeactivateModalEmployee(null);
  };

  const handleConfirmActivate = async () => {
    if (!activateModalEmployee) return;
    try {
      await updateStaffStatus(activateModalEmployee.id, "active");
    } catch {
      // Keep local update.
    }
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === activateModalEmployee.id
          ? {
              ...e,
              status: "active",
              lastLogin: {
                time: isEn ? "Today" : "اليوم",
                ip: "178.80.12.44",
                location: isEn ? "Riyadh" : "الرياض",
              },
            }
          : e
      )
    );
    if (selectedEmployee?.id === activateModalEmployee.id) {
      setSelectedEmployee({
        ...selectedEmployee,
        status: "active",
        lastLogin: {
          time: isEn ? "Today" : "اليوم",
          ip: "178.80.12.44",
          location: isEn ? "Riyadh" : "الرياض",
        },
      });
    }
    toast.success(
      isEn
        ? `Employee account "${activateModalEmployee.name}" restored and activated.`
        : `تم استعادة وتفعيل حساب الموظف "${activateModalEmployee.name}".`
    );
    setActivateModalEmployee(null);
  };

  return (
    <div dir={direction} className="flex h-screen h-dvh overflow-hidden bg-background text-foreground transition-colors duration-200 font-sans antialiased">
      {/* Sidebar */}
      <DashboardSidebar activeNav="staff" activeSubNav="staff" />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <DashboardTopNavbar />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 w-full space-y-6 scrollbar-thin">
          <DashboardPageTransition>
          {/* Main Title Banner (For List and Empty Views) */}
          {(currentView === "list" || currentView === "empty") && (
            <div
              className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              data-node-id="1:8702"
            >
              <div>
                <h1
                  className="text-[26px] sm:text-[28px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[36px]"
                  data-node-id="1:8716"
                >
                  {t("طاقم العمل", "Staff Members")}
                </h1>
                <p className="text-[14px] text-[#514537] dark:text-[#a89f91] mt-1" data-node-id="1:8714">
                  {t(
                    "إدارة الموظفين الذين لديهم صلاحية الدخول إلى لوحة الإدارة.",
                    "Manage staff members who have access permissions to the admin dashboard."
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCurrentView("add")}
                className="bg-[#9c6402] hover:bg-[#855402] text-white px-5 py-2.5 rounded-[6px] font-semibold text-[14px] flex items-center gap-2 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors shrink-0"
                data-node-id="1:8705"
              >
                <Plus className="size-[16px]" />
                <span>{t("إضافة موظف", "Add Employee")}</span>
              </button>
            </div>
          )}

          {/* VIEW: Empty State (Figma 1:8699) */}
          {currentView === "empty" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentView("list")}
                  className="text-[12px] text-[#9c6402] hover:underline"
                >
                  {t("العودة للجدول المكتمل", "Back to Full Table")}
                </button>
              </div>
              <StaffEmptyState onAddEmployee={() => setCurrentView("add")} />
            </div>
          )}

          {/* VIEW: Staff Table (Figma 1:8875) */}
          {currentView === "list" && (
            isLoading && employees.length === 0 ? (
              <DashboardPageSkeleton />
            ) : (
            <div className="space-y-6">
              {/* 4 KPI Metrics */}
              <StaffKpiMetrics kpis={currentKpis} />

              {/* Toolbar */}
              <StaffToolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedRole={selectedRole}
                onRoleChange={setSelectedRole}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                selectedLastLogin={selectedLastLogin}
                onLastLoginChange={setSelectedLastLogin}
                onResetFilters={handleResetFilters}
                isEmptyView={false}
                onToggleEmptyView={() => setCurrentView("empty")}
              />

              {/* Data Table */}
              <StaffTable
                employees={filteredEmployees}
                onViewDetails={(emp) => {
                  setSelectedEmployee(emp);
                  setCurrentView("details");
                  void fetchStaffById(emp.id)
                    .then((payload) => {
                      const raw = (unwrapData<Record<string, unknown>>(payload) ||
                        payload) as Record<string, unknown>;
                      if (raw?.id || raw?.name) {
                        setSelectedEmployee(mapStaffFromApi(raw));
                      }
                    })
                    .catch(() => {
                      // Keep list employee.
                    });
                }}
                onLoginAsEmployee={handleStartLoginAsEmployee}
                onDeactivate={(emp) => setDeactivateModalEmployee(emp)}
                onActivate={(emp) => setActivateModalEmployee(emp)}
                onResetPassword={(emp) => setResetPasswordModalEmployee(emp)}
              />
            </div>
            )
          )}

          {/* VIEW: Add Employee (Figma 1:9529) */}
          {currentView === "add" && (
            <AddEmployeeView
              onBack={() => setCurrentView("list")}
              onSave={handleSaveNewEmployee}
            />
          )}

          {/* VIEW: Employee Details (Figma 1:9815) */}
          {currentView === "details" && selectedEmployee && (
            <EmployeeDetailsView
              employee={selectedEmployee}
              onBack={() => setCurrentView("list")}
              onEdit={() => setCurrentView("add")}
              onLoginAsEmployee={() => handleStartLoginAsEmployee(selectedEmployee)}
              onDeactivate={() => setDeactivateModalEmployee(selectedEmployee)}
              onActivate={() => setActivateModalEmployee(selectedEmployee)}
              onResetPassword={() => setResetPasswordModalEmployee(selectedEmployee)}
            />
          )}

          {/* VIEW: Preview / Simulation Mode (Figma 1:10398) */}
          {currentView === "preview" && previewEmployee && (
            <EmployeePreviewModeView
              employee={previewEmployee}
              onEndPreview={() => setEndPreviewModalOpen(true)}
            />
          )}
          </DashboardPageTransition>
        </main>
      </div>

      {/* DIALOG 1: Login as Employee Confirmation (Figma 1:10312) */}
      <LoginAsEmployeeModal
        isOpen={!!loginModalEmployee}
        onClose={() => setLoginModalEmployee(null)}
        employee={loginModalEmployee}
        onConfirm={handleConfirmStartSimulation}
      />

      {/* DIALOG 2: Preview Blocked Error (Figma 1:10821) */}
      <PreviewErrorModal
        isOpen={!!errorModalEmployee}
        onClose={() => setErrorModalEmployee(null)}
        employee={errorModalEmployee}
        onViewEmployee={() => {
          if (errorModalEmployee) {
            setSelectedEmployee(errorModalEmployee);
            setCurrentView("details");
            setErrorModalEmployee(null);
          }
        }}
      />

      {/* DIALOG 3: End Preview Confirmation (Figma 1:10899) */}
      <EndPreviewModal
        isOpen={endPreviewModalOpen}
        onClose={() => setEndPreviewModalOpen(false)}
        employeeName={previewEmployee?.name || (isEn ? "Employee" : "الموظف")}
        onConfirmEnd={() => {
          setEndPreviewModalOpen(false);
          setCurrentView("details");
          toast.success(
            t(
              "تم إنهاء جلسة المعاينة والعودة بنجاح إلى حساب المشرف العام.",
              "Preview session ended and returned successfully to administrator account."
            )
          );
        }}
      />

      {/* DIALOG 4: Deactivate Employee (Figma 1:10949) */}
      <DeactivateEmployeeModal
        isOpen={!!deactivateModalEmployee}
        onClose={() => setDeactivateModalEmployee(null)}
        employee={deactivateModalEmployee}
        onConfirm={handleConfirmDeactivate}
      />

      {/* DIALOG 5: Activate Employee (Figma 1:11022) */}
      <ActivateEmployeeModal
        isOpen={!!activateModalEmployee}
        onClose={() => setActivateModalEmployee(null)}
        employee={activateModalEmployee}
        onConfirm={handleConfirmActivate}
      />

      {/* DIALOG 6: Reset Password (Figma 1:11114 & 1:11216) */}
      <ResetPasswordModal
        isOpen={!!resetPasswordModalEmployee}
        onClose={() => setResetPasswordModalEmployee(null)}
        employee={resetPasswordModalEmployee}
      />
    </div>
  );
}