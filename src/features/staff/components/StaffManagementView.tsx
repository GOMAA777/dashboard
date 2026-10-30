"use client";

import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
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

export function StaffManagementView() {
  // Navigation & View States
  const [currentView, setCurrentView] = useState<
    "list" | "empty" | "add" | "details" | "preview"
  >("list");

  // Staff State
  const [employees, setEmployees] = useState<Employee[]>(initialStaffMembers);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    initialStaffMembers[1] // Default to Sarah Al-Qahtani
  );

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
  const [previewEmployee, setPreviewEmployee] = useState<Employee | null>(
    initialStaffMembers[1]
  );

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
        if (!emp.lastLogin.time.includes("اليوم")) return false;
      } else if (selectedLastLogin === "week") {
        if (emp.lastLogin.time.includes("يوماً") || emp.lastLogin.time.includes("لم يسجل")) return false;
      }

      return true;
    });
  }, [employees, searchQuery, selectedRole, selectedStatus, selectedLastLogin]);

  // Dynamic KPIs
  const currentKpis = useMemo(() => {
    const total = employees.length;
    const activeCount = employees.filter((e) => e.status === "active").length;
    const suspendedCount = total - activeCount;
    return {
      ...initialStaffKpis,
      totalStaff: total,
      activeStaff: activeCount,
      activePercentage: total > 0 ? Number(((activeCount / total) * 100).toFixed(1)) : 0,
      suspendedStaff: suspendedCount,
    };
  }, [employees]);

  // Handlers
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedRole("all");
    setSelectedStatus("all");
    setSelectedLastLogin("all");
    toast.info("تمت إعادة ضبط فلاتر البحث.");
  };

  const handleSaveNewEmployee = (newEmp: Employee) => {
    setEmployees((prev) => [newEmp, ...prev]);
    setSelectedEmployee(newEmp);
    setCurrentView("details");
  };

  const handleStartLoginAsEmployee = (emp: Employee) => {
    if (emp.status === "suspended") {
      // Open blocked preview modal per Gov-Sec 402 (Figma 1:10821)
      setErrorModalEmployee(emp);
    } else {
      // Open supervisor authorization confirmation (Figma 1:10312)
      setLoginModalEmployee(emp);
    }
  };

  const handleConfirmStartSimulation = () => {
    if (loginModalEmployee) {
      setPreviewEmployee(loginModalEmployee);
      setLoginModalEmployee(null);
      setCurrentView("preview");
      toast.success(
        `تم بدء وضع المعاينة بصفة الموظف "${loginModalEmployee.name}" بنجاح.`
      );
    }
  };

  const handleConfirmDeactivate = (reason: string) => {
    if (!deactivateModalEmployee) return;
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === deactivateModalEmployee.id
          ? {
              ...e,
              status: "suspended",
              lastLogin: {
                time: "اليوم",
                note: reason.trim() ? `سبب الإيقاف: ${reason}` : "تم إيقاف الجلسة بقرار رقابي",
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
          time: "اليوم",
          note: reason.trim() ? `سبب الإيقاف: ${reason}` : "تم إيقاف الجلسة بقرار رقابي",
        },
      });
    }
    toast.success(`تم إيقاف حساب الموظف "${deactivateModalEmployee.name}" فورياً.`);
    setDeactivateModalEmployee(null);
  };

  const handleConfirmActivate = () => {
    if (!activateModalEmployee) return;
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === activateModalEmployee.id
          ? {
              ...e,
              status: "active",
              lastLogin: {
                time: "اليوم",
                ip: "178.80.12.44",
                location: "الرياض",
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
          time: "اليوم",
          ip: "178.80.12.44",
          location: "الرياض",
        },
      });
    }
    toast.success(`تم استعادة وتفعيل حساب الموظف "${activateModalEmployee.name}".`);
    setActivateModalEmployee(null);
  };

  return (
    <div className="flex min-h-screen bg-[#f5f3ef] text-[#1b1c1a] font-sans antialiased" dir="rtl">
      {/* Sidebar */}
      <DashboardSidebar activeNav="staff" activeSubNav="staff" />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopNavbar />

        <main className="flex-1 p-6 md:p-8 max-w-[1360px] w-full mx-auto space-y-6">
          {/* Main Title Banner (For List and Empty Views) */}
          {(currentView === "list" || currentView === "empty") && (
            <div
              className="bg-white rounded-[8px] p-6 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center justify-between"
              data-node-id="1:8702"
            >
              <div>
                <h1
                  className="text-[26px] sm:text-[28px] font-bold text-[#1b1c1a] leading-[36px]"
                  data-node-id="1:8716"
                >
                  طاقم العمل
                </h1>
                <p className="text-[14px] text-[#514537] mt-1" data-node-id="1:8714">
                  إدارة الموظفين الذين لديهم صلاحية الدخول إلى لوحة الإدارة.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCurrentView("add")}
                className="bg-[#9c6402] hover:bg-[#855402] text-white px-5 py-2.5 rounded-[6px] font-semibold text-[14px] flex items-center gap-2 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors shrink-0"
                data-node-id="1:8705"
              >
                <Plus className="size-[16px]" />
                <span>إضافة موظف</span>
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
                  العودة للجدول المكتمل
                </button>
              </div>
              <StaffEmptyState onAddEmployee={() => setCurrentView("add")} />
            </div>
          )}

          {/* VIEW: Staff Table (Figma 1:8875) */}
          {currentView === "list" && (
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
                }}
                onLoginAsEmployee={handleStartLoginAsEmployee}
                onDeactivate={(emp) => setDeactivateModalEmployee(emp)}
                onActivate={(emp) => setActivateModalEmployee(emp)}
                onResetPassword={(emp) => setResetPasswordModalEmployee(emp)}
              />
            </div>
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
        employeeName={previewEmployee?.name || "الموظف"}
        onConfirmEnd={() => {
          setEndPreviewModalOpen(false);
          setCurrentView("details");
          toast.success("تم إنهاء جلسة المعاينة والعودة بنجاح إلى حساب المشرف العام.");
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
