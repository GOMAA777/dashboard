import React, { Suspense } from "react";
import type { Metadata } from "next";
import { StaffManagementView } from "@/features/staff/components/StaffManagementView";

export const metadata: Metadata = {
  title: "طاقم العمل | منصة الجودي لإدارة مكاتب وشركات المحاماة",
  description:
    "إدارة الموظفين الذين لديهم صلاحية الدخول إلى لوحة الإدارة ومحاكاة الجلسات الرقابية",
};

export default function PermissionsPage() {
  return (
    <Suspense fallback={null}>
      <StaffManagementView />
    </Suspense>
  );
}
