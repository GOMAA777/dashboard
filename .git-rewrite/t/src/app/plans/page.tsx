import React from "react";
import { Metadata } from "next";
import { PlansView } from "@/features/plans/components/PlansView";

export const metadata: Metadata = {
  title: "إدارة الباقات والأسعار والحدود | منصة الجودي لإدارة مكاتب المحاماة",
  description:
    "إدارة باقات الاشتراك لمكاتب المحاماة، ضبط الأسعار الشهرية والسنوية، تحديد الحدود التشغيلية (القضايا، المحامين، التخزين)، والمميزات الإضافية.",
};

export default function PlansPage() {
  return <PlansView />;
}
