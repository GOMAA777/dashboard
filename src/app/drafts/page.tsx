import React, { Suspense } from "react";
import { Metadata } from "next";
import { DraftsManagementView } from "@/features/drafts/components/DraftsManagementView";

export const metadata: Metadata = {
  title: "المسودات المركزية | منصة الجودي لإدارة مكاتب المحاماة",
  description:
    "إدارة واستعراض كافة المسودات المحفوظة من نماذج الإشعارات، باقات التسعير، الصلاحيات، الموظفين، والاشتراكات لاستئناف العمل عليها وإكمالها.",
};

export default function DraftsPage() {
  return (
    <Suspense fallback={null}>
      <DraftsManagementView />
    </Suspense>
  );
}
