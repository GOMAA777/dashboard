import React, { Suspense } from "react";
import type { Metadata } from "next";
import { MailSettingsView } from "@/features/settings/components/MailSettingsView";

export const metadata: Metadata = {
  title: "إعدادات البريد | منصة الجودي لإدارة مكاتب وشركات المحاماة",
  description:
    "تهيئة خادم SMTP وهوية المرسل وإعدادات البريد الصادر للمنصة - الجودي",
};

export default function MailSettingsPage() {
  return (
    <Suspense fallback={null}>
      <MailSettingsView />
    </Suspense>
  );
}
