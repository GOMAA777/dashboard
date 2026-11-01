import React, { Suspense } from "react";
import { Metadata } from "next";
import { PaymentGatewaysPage } from "@/features/payment-gateways/components/PaymentGatewaysPage";

export const metadata: Metadata = {
  title: "بوابات الدفع الإلكتروني | لوحة تحكم منصة الجودي",
  description:
    "إدارة وتكوين بوابات الدفع الإلكتروني المعتمدة لتحصيل رسوم اشتراكات مكاتب المحاماة وفواتير منصة الجودي.",
};

export default function GatewaysPage() {
  return (
    <Suspense fallback={null}>
      <PaymentGatewaysPage />
    </Suspense>
  );
}
