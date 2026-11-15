import React, { Suspense } from "react";
import type { Metadata } from "next";
import { RolesManagementView } from "@/features/permissions/components/RolesManagementView";

export const metadata: Metadata = {
  title: "الأدوار والصلاحيات | منصة الجودي لإدارة مكاتب وشركات المحاماة",
  description:
    "إدارة الأدوار وتحديد صلاحيات الوصول إلى أقسام النظام والهيكل الإداري للمنصة",
};

export default function RolesPage() {
  return (
    <Suspense fallback={null}>
      <RolesManagementView />
    </Suspense>
  );
}
