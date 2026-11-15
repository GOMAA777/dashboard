import React, { Suspense } from "react";
import type { Metadata } from "next";
import { SystemUpdateView } from "@/features/utility/components/SystemUpdateView";

export const metadata: Metadata = {
  title: "تحديث النظام | منصة الجودي لإدارة مكاتب وشركات المحاماة",
  description:
    "فحص وإدارة تحديثات النواة المركزية للمنظومة القانونية ومطابقة التوافق البرمجي - الجودي",
};

export default function SystemUpdatePage() {
  return (
    <Suspense fallback={null}>
      <SystemUpdateView />
    </Suspense>
  );
}
