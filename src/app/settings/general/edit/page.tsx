import React, { Suspense } from "react";
import type { Metadata } from "next";
import { GeneralSettingsView } from "@/features/settings/components/GeneralSettingsView";

export const metadata: Metadata = {
  title: "تعديل الإعدادات العامة | منصة الجودي لإدارة مكاتب وشركات المحاماة",
  description: "تعديل بيانات المنصة وهويتها المؤسسية وإعداداتها التشغيلية الأساسية - الجودي",
};

export default function GeneralSettingsEditPage() {
  return (
    <Suspense fallback={null}>
      <GeneralSettingsView />
    </Suspense>
  );
}
