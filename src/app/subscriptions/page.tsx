import React from "react";
import type { Metadata } from "next";
import { SubscriptionManagementView } from "@/features/subscriptions/components/SubscriptionManagementView";

export const metadata: Metadata = {
  title: "إدارة الاشتراكات | الجودي لإدارة مكاتب وشركات المحاماة",
  description:
    "متابعة اشتراكات مكاتب المحاماة، دورات الفوترة، وحالات التجديد والتحصيل التلقائي - منصة الجودي",
};

export default function SubscriptionsPage() {
  return <SubscriptionManagementView />;
}
