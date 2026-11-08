import React, { Suspense } from "react";
import type { Metadata } from "next";
import { CurrencySettingsView } from "@/features/settings/components/CurrencySettingsView";

export const metadata: Metadata = {
  title: "إعدادات العملة | منصة الجودي لإدارة مكاتب وشركات المحاماة",
  description: "إدارة العملات المعتمدة، أسعار التحويل، ومعدلات الدقة المحاسبية - الجودي",
};

export default function CurrencySettingsPage() {
  return (
    <Suspense fallback={null}>
      <CurrencySettingsView />
    </Suspense>
  );
}
