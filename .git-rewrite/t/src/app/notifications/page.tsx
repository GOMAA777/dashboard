import React, { Suspense } from "react";
import { Metadata } from "next";
import { NotificationsManagementView } from "@/features/notifications/components/NotificationsManagementView";

export const metadata: Metadata = {
  title: "قائمة الإشعارات وإدارة التنبيهات المركزية | منصة الجودي لإدارة مكاتب المحاماة",
  description:
    "إدارة الإشعارات المركزية المرسلة إلى مكاتب المحاماة، إنشاء تحديثات المنظومة، إرسال إشعار جديد، وتتبع معدلات الوصول والتسليم الفوري.",
};

export default function NotificationsPage() {
  return (
    <Suspense fallback={null}>
      <NotificationsManagementView />
    </Suspense>
  );
}
