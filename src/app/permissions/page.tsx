import React, { Suspense } from "react";
import type { Metadata } from "next";
import { PermissionsPageSwitcher } from "@/features/permissions/components/PermissionsPageSwitcher";

export const metadata: Metadata = {
  title: "الأدوار والصلاحيات | منصة الجودي لإدارة مكاتب وشركات المحاماة",
  description:
    "إدارة الأدوار وتحديد صلاحيات الوصول إلى أقسام النظام والهيكل الإداري للمنصة",
};

export default function PermissionsPage() {
  return (
    <Suspense fallback={null}>
      <PermissionsPageSwitcher />
    </Suspense>
  );
}
