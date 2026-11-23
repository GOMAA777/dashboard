"use client";

import React, { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { EmployeeDetailsView } from "@/features/staff/components/EmployeeDetailsView";
import {
  EditEmployeeView,
  type SaveEditEmployeePayload,
} from "@/features/staff/components/EditEmployeeView";
import { ResetPasswordModal } from "@/features/staff/components/ResetPasswordModal";
import { useLanguage } from "@/lib/i18n";
import { updateAuthUser } from "@/lib/auth-client";
import { updateStaff } from "@/lib/api/staff";
import { ApiError } from "@/lib/api/http";
import { InvalidationGraph } from "@/lib/query-keys";
import { withBasePath } from "@/lib/base-path";
import {
  invalidateProfileQueries,
  useProfileStaffQuery,
} from "../hooks/useProfileQuery";

type ProfileScreen = "details" | "edit";

export function ProfileView() {
  const { direction, t } = useLanguage();
  const queryClient = useQueryClient();
  const { employee, permissions, isLoading, error, refetch } = useProfileStaffQuery();
  const [screen, setScreen] = useState<ProfileScreen>("details");
  const [resetOpen, setResetOpen] = useState(false);

  const handleUpdate = async ({ id, payload }: SaveEditEmployeePayload) => {
    await updateStaff(id, payload);
    if (typeof payload.name === "string" || typeof payload.email === "string") {
      updateAuthUser({
        ...(typeof payload.name === "string"
          ? { name: payload.name, full_name: payload.name }
          : {}),
        ...(typeof payload.email === "string" ? { email: payload.email } : {}),
      });
    }
    await InvalidationGraph.onStaffMutation(queryClient);
    await invalidateProfileQueries(queryClient);
    await refetch();
    setScreen("details");
    toast.success(t("تم حفظ بيانات الملف الشخصي بنجاح", "Profile saved successfully"));
  };

  return (
    <div
      dir={direction}
      className="flex h-screen h-dvh overflow-hidden w-full bg-[#f5f3ef] dark:bg-[#150f0b] text-[#1b1c1a] dark:text-[#fdfbf7] transition-colors duration-200 font-['Cairo',sans-serif]"
    >
      <DashboardSidebar activeNav="profile" />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <DashboardTopNavbar />

        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 py-4 max-w-[1360px] w-full mx-auto">
          <DashboardPageTransition>
            {isLoading ? (
              <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#eae8e4] dark:border-[#38271c] p-16 flex flex-col items-center gap-3">
                <Loader2 className="size-8 animate-spin text-[#9c6402]" />
                <p className="text-sm text-[#837565]">
                  {t("جاري تحميل الملف الشخصي…", "Loading profile…")}
                </p>
              </div>
            ) : error ? (
              <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-red-200 dark:border-red-900/40 p-8 text-center space-y-3">
                <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
                <button
                  type="button"
                  onClick={() => void refetch()}
                  className="h-[38px] px-4 rounded-[6px] bg-[#9c6402] text-white text-[13px] font-bold inline-flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="size-4" />
                  {t("إعادة المحاولة", "Retry")}
                </button>
              </div>
            ) : !employee ? (
              <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#eae8e4] dark:border-[#38271c] p-8 text-center space-y-2">
                <p className="font-bold">
                  {t(
                    "لا يوجد سجل موظف مرتبط بهذا الحساب",
                    "No staff record is linked to this account"
                  )}
                </p>
              </div>
            ) : screen === "edit" ? (
              <EditEmployeeView
                employee={employee}
                onBack={() => setScreen("details")}
                onSave={handleUpdate}
              />
            ) : (
              <EmployeeDetailsView
                employee={employee}
                permissions={permissions}
                editLabel={t("تعديل البيانات", "Edit Profile")}
                backLabel={t("العودة للرئيسية", "Back to Home")}
                onBack={() => {
                  const home = withBasePath("/");
                  window.location.assign(home.endsWith("/") ? home : `${home}/`);
                }}
                onEdit={() => setScreen("edit")}
                onResetPassword={() => setResetOpen(true)}
              />
            )}
          </DashboardPageTransition>
        </main>
      </div>

      <ResetPasswordModal
        isOpen={resetOpen}
        onClose={() => setResetOpen(false)}
        employee={employee}
      />
    </div>
  );
}
