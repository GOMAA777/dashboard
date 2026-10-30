import React from "react";
import { Metadata } from "next";
import { PaymentGatewaysPage } from "@/features/payment-gateways/components/PaymentGatewaysPage";

export const metadata: Metadata = {
  title: "طرق الدفع | لوحة تحكم منصة الجودي",
  description:
    "إدارة وتكوين بوابات الدفع الإلكتروني المعتمدة لتحصيل رسوم اشتراكات مكاتب المحاماة وفواتير منصة الجودي.",
};

export default function InvoicesPage() {
  return <PaymentGatewaysPage />;
}
