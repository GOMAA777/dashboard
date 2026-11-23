"use client";

import React, { useEffect } from "react";
import { AppStatusScreen } from "@/components/shared/AppStatusScreen";

function isDevtoolsNoise(error: Error | null | undefined) {
  return String(error?.message || "").includes("NEXT_DEVTOOLS_SIMULATED_ERROR");
}

/**
 * Visible branded error page for everyone (guest + logged-in).
 * No silent redirect / reset loops.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (isDevtoolsNoise(error)) return;
    console.error("Dashboard Application Error:", error);
  }, [error]);

  if (isDevtoolsNoise(error)) {
    return <div className="min-h-screen w-full bg-background" aria-hidden />;
  }

  return (
    <AppStatusScreen
      kind="error"
      title="حدث خلل مؤقت"
      titleEn="Temporary Error"
      description="واجهت المنظومة صعوبة بسيطة أثناء تحميل الصفحة. يمكنك إعادة المحاولة أو العودة للرئيسية."
      descriptionEn="The system encountered a temporary issue while loading the page. You can retry or return to the dashboard."
      digest={error?.digest}
      onRetry={() => reset()}
    />
  );
}
