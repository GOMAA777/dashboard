import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ClientManagementView } from "@/features/clients/components/ClientManagementView";

export const metadata: Metadata = {
  title: "دليل مكاتب المحاماة | منصة الجودي لإدارة مكاتب المحاماة",
  description:
    "إدارة مكاتب المحاماة المشتركة في المنصة، تفعيل وتعطيل الحسابات، الاطلاع على ملف المكتب الشامل، الباقات والفواتير وتذاكر الدعم وملاحظات الفريق.",
};

export default function LawFirmsPage() {
  return (
    <Suspense fallback={null}>
      <ClientManagementView />
    </Suspense>
  );
}
