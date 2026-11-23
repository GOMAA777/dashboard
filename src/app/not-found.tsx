"use client";

import React from "react";
import { AppStatusScreen } from "@/components/shared/AppStatusScreen";

/**
 * Visible branded 404 page for everyone (guest + logged-in).
 */
export default function NotFound() {
  return (
    <AppStatusScreen
      kind="not-found"
      title="الصفحة غير موجودة"
      titleEn="Page Not Found"
      description="الرابط غير صحيح أو الصفحة لم تعد متاحة. يمكنك العودة للرئيسية والمتابعة من هناك."
      descriptionEn="The link is invalid or the page is no longer available. You can return home and continue from there."
    />
  );
}
