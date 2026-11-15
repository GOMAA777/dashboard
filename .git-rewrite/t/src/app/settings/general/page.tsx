import React, { Suspense } from "react";
import type { Metadata } from "next";
import { GeneralSettingsView } from "@/features/settings/components/GeneralSettingsView";

export const metadata: Metadata = {
  title: "الإعدادات العامة | منصة الجودي لإدارة مكاتب وشركات المحاماة",
  description: "إدارة بيانات المنصة وهويتها المؤسسية وإعداداتها التشغيلية الأساسية - الجودي",
};

export default function GeneralSettingsPage() {
  return (
    <Suspense fallback={null}>
      <GeneralSettingsView />
    </Suspense>
  );
}
