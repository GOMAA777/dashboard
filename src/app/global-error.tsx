"use client";

import React, { useEffect, useState } from "react";
import { withBasePath } from "@/lib/base-path";

function isDevtoolsNoise(error: Error | null | undefined) {
  return String(error?.message || "").includes("NEXT_DEVTOOLS_SIMULATED_ERROR");
}

/**
 * Root-level error UI (must include html/body). Shown to everyone.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isEn, setIsEn] = useState(false);

  useEffect(() => {
    try {
      setIsEn(localStorage.getItem("app-language") === "en");
    } catch {
      // ignore
    }
    if (!isDevtoolsNoise(error)) {
      console.error("Dashboard Global Error:", error);
    }
  }, [error]);

  if (isDevtoolsNoise(error)) {
    return (
      <html lang="ar" dir="rtl">
        <body style={{ margin: 0, minHeight: "100vh", backgroundColor: "#fcfbfa" }} />
      </html>
    );
  }

  return (
    <html lang={isEn ? "en" : "ar"} dir={isEn ? "ltr" : "rtl"}>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fcfbfa",
          color: "#1c1917",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "440px",
            width: "100%",
            background: "#ffffff",
            padding: "40px 28px",
            borderRadius: "16px",
            border: "1px solid #eae8e4",
            boxShadow: "0 12px 36px rgba(0,0,0,0.08)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              insetInline: 0,
              top: 0,
              height: 3,
              background:
                "linear-gradient(to left, transparent, #c29547, transparent)",
              opacity: 0.8,
            }}
          />
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
              background: "#f5f3ef",
              color: "#9c6402",
              border: "1px solid #eae8e4",
              marginBottom: 12,
            }}
          >
            {isEn ? "Temporary Error" : "تعذر إتمام العملية مؤقتاً"}
          </div>
          <h1 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 10px 0" }}>
            {isEn ? "Temporary Error" : "حدث خلل مؤقت"}
          </h1>
          <p style={{ fontSize: "13px", color: "#837565", lineHeight: 1.6, margin: "0 0 20px 0" }}>
            {isEn
              ? "Something went wrong while loading the page. You can retry or return home."
              : "واجهت المنظومة صعوبة أثناء تحميل الصفحة. يمكنك إعادة المحاولة أو العودة للرئيسية."}
          </p>
          {error?.digest ? (
            <p style={{ fontSize: 10, fontFamily: "monospace", color: "#8e8680", marginBottom: 16 }}>
              ID: {error.digest}
            </p>
          ) : null}
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: "11px 22px",
                borderRadius: "10px",
                backgroundColor: "#9c6402",
                color: "#ffffff",
                border: "none",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              {isEn ? "Retry" : "إعادة المحاولة"}
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.href = withBasePath("/");
              }}
              style={{
                padding: "11px 22px",
                borderRadius: "10px",
                backgroundColor: "#f5f3ef",
                color: "#1b1c1a",
                border: "1px solid #eae8e4",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              {isEn ? "Home" : "الرئيسية"}
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
