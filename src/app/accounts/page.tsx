import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ClientManagementView } from "@/features/clients/components/ClientManagementView";

export const metadata: Metadata = {
  title: "إدارة العملاء ومكاتب المحاماة | منصة الجودي",
  description:
    "إدارة وتدقيق مكاتب المحاماة المسجلة ومتابعة بيانات التراخيص العدلية وحالة الاشتراكات الفعالة",
};

export default function AccountsPage() {
  return (
    <Suspense fallback={null}>
      <ClientManagementView />
    </Suspense>
  );
}
