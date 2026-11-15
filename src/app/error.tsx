"use client";

import React, { useEffect } from "react";
import { AppStatusScreen } from "@/components/shared/AppStatusScreen";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Application Error:", error);
  }, [error]);

  return (
    <AppStatusScreen
      kind="error"
      title="حدث خلل مؤقت"
      titleEn="Temporary Error"
      description="واجهت المنظومة صعوبة بسيطة أثناء تحميل الصفحة. يمكنك إعادة المحاولة أو العودة للرئيسية."
      descriptionEn="The system encountered a temporary issue while loading the page. You can retry or return to the dashboard."
      digest={error?.digest}
      onRetry={() => reset()}
      autoRedirectMs={4500}
    />
  );
}
