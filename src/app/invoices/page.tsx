import React, { Suspense } from "react";
import { Metadata } from "next";
import { InvoicesView } from "@/features/invoices/components/InvoicesView";

export const metadata: Metadata = {
  title: "الفواتير والمالية | لوحة تحكم منصة الجودي",
  description:
    "إدارة الفواتير الضريبية الإلكترونية المعتمدة (ZATCA)، سندات القبض لاشتراكات مكاتب المحاماة، ومطابقة ضريبة القيمة المضافة 15% وتكاملات بوابات الدفع.",
};

export default function InvoicesPage() {
  return (
    <Suspense fallback={null}>
      <InvoicesView />
    </Suspense>
  );
}
