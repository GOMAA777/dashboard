import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ServerInfoView } from "@/features/utility/components/ServerInfoView";

export const metadata: Metadata = {
  title: "معلومات السيرفر | منصة الجودي لإدارة مكاتب وشركات المحاماة",
  description:
    "فحص ومراقبة البيئة التقنية وإعدادات خادم التطبيق وتوافقها مع متطلبات النظام - الجودي",
};

export default function ServerInfoPage() {
  return (
    <Suspense fallback={null}>
      <ServerInfoView />
    </Suspense>
  );
}
