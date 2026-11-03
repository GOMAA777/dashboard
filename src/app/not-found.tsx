"use client";

import React from "react";
import { AppStatusScreen } from "@/components/shared/AppStatusScreen";

export default function NotFound() {
  return (
    <AppStatusScreen
      kind="not-found"
      title="الصفحة غير موجودة"
      description="الرابط غير صحيح أو الصفحة لم تعد متاحة. سيتم توجيهك للرئيسية تلقائياً."
      autoRedirectMs={3500}
    />
  );
}
