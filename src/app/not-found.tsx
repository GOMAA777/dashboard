"use client";

import React from "react";
import { AppStatusScreen } from "@/components/shared/AppStatusScreen";

export default function NotFound() {
  return (
    <AppStatusScreen
      kind="not-found"
      title="الصفحة غير موجودة"
      titleEn="Page Not Found"
      description="الرابط غير صحيح أو الصفحة لم تعد متاحة. سيتم توجيهك للرئيسية تلقائياً."
      descriptionEn="The link is invalid or the page is no longer available. Redirecting to home automatically."
      autoRedirectMs={3500}
    />
  );
}
