import React, { Suspense } from "react";
import type { Metadata } from "next";
import { GeneralSettingsDetailsView } from "@/features/settings/components/GeneralSettingsDetailsView";

export const metadata: Metadata = {
  title: "الإعدادات العامة | منصة الجودي لإدارة مكاتب وشركات المحاماة",
  description: "عرض بيانات المنصة وهويتها المؤسسية وإعداداتها التشغيلية الأساسية - الجودي",
};

export default function GeneralSettingsPage() {
  return (
    <Suspense fallback={null}>
      <GeneralSettingsDetailsView />
    </Suspense>
  );
}
