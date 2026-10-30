import React, { Suspense } from "react";
import type { Metadata } from "next";
import { LanguageSettingsView } from "@/features/settings/components/LanguageSettingsView";

export const metadata: Metadata = {
  title: "إعدادات اللغة | منصة الجودي لإدارة مكاتب وشركات المحاماة",
  description: "إدارة وتفعيل حزم اللغات المعتمدة لدعم الترجمة المؤسسية وسير العمل القضائي والقانوني - الجودي",
};

export default function LanguageSettingsPage() {
  return (
    <Suspense fallback={null}>
      <LanguageSettingsView />
    </Suspense>
  );
}
