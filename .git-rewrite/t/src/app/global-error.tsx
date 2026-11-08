"use client";

import React from "react";

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void _error;
  const handleHomeClick = () => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/";
    }
  };

  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
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
            maxWidth: "480px",
            background: "#ffffff",
            padding: "40px 32px",
            borderRadius: "24px",
            border: "1px solid #eeddbb",
            boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "#faf5eb",
              border: "1px solid #eeddbb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px auto",
              fontSize: "24px",
              color: "#c29547",
            }}
          >
            ⚖️
          </div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "#1c1917",
              margin: "0 0 12px 0",
            }}
          >
            حدث خطأ غير متوقع
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#6b6357",
              lineHeight: 1.6,
              margin: "0 0 24px 0",
            }}
          >
            واجهت المنظومة صعوبة مؤقتة في تهيئة الصفحة الرئيسية. يمكنك الضغط أدناه
            لإعادة المحاولة أو العودة للرئيسية.
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: "12px 24px",
                borderRadius: "9999px",
                backgroundColor: "#c29547",
                color: "#ffffff",
                border: "none",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(194, 149, 71, 0.35)",
              }}
            >
              إعادة المحاولة
            </button>
            <button
              type="button"
              onClick={handleHomeClick}
              style={{
                padding: "12px 24px",
                borderRadius: "9999px",
                backgroundColor: "#ffffff",
                color: "#1c1917",
                border: "1px solid #ded5c6",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              الرئيسية
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
