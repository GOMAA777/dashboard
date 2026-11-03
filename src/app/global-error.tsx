"use client";

import React, { useEffect, useState } from "react";
import { withBasePath } from "@/lib/base-path";

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void _error;
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    const started = Date.now();
    const total = 4000;
    const tick = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((total - (Date.now() - started)) / 1000));
      setCountdown(left);
      if (left <= 0) {
        window.clearInterval(tick);
        window.location.href = withBasePath("/");
      }
    }, 250);
    return () => window.clearInterval(tick);
  }, []);

  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#150f0b",
          color: "#fdfbf7",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "420px",
            width: "100%",
            background: "#221812",
            padding: "40px 28px",
            borderRadius: "16px",
            border: "1px solid #38271c",
            boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "#2d1f16",
              border: "1px solid #4d3627",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 18px auto",
              fontSize: "26px",
            }}
          >
            ⚖️
          </div>
          <h1 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 10px 0" }}>
            حدث خلل مؤقت
          </h1>
          <p style={{ fontSize: "13px", color: "#a89f91", lineHeight: 1.6, margin: "0 0 12px 0" }}>
            نعيد تهيئة الصفحة الآن. سيتم التوجيه خلال {countdown} ث...
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: "11px 22px",
                borderRadius: "10px",
                backgroundColor: "#e29d38",
                color: "#1c140f",
                border: "none",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              إعادة المحاولة
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.href = withBasePath("/");
              }}
              style={{
                padding: "11px 22px",
                borderRadius: "10px",
                backgroundColor: "#281c15",
                color: "#fdfbf7",
                border: "1px solid #38271c",
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
