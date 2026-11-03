import React from "react";
import type { Metadata } from "next";
import { DashboardRouteLoading } from "@/components/shared/DashboardRouteLoading";

export const metadata: Metadata = {
  title: "معاينة شاشة التحميل | منصة الجودي",
  description: "معاينة تجربة التحميل الموحدة لمنصة الجودي",
};

export default function LoadingDemoPage() {
  return (
    <DashboardRouteLoading
      title="جاري التحميل"
      statusText="معاينة شاشة التحميل الموحدة..."
    />
  );
}
