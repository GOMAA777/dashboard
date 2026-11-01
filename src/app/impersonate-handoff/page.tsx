"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  LAWYER_AUTH_SESSION_KEY,
  LAWYER_AUTH_USER_KEY,
  decodeSessionParam,
} from "@/lib/api/lawyer-session";
import { LAWYER_APP_URL } from "@/lib/api/config";

function ImpersonateHandoffClient() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("جاري فتح لوحة المكتب…");

  useEffect(() => {
    const encoded = searchParams?.get("s") || "";
    const next =
      searchParams?.get("next") ||
      `${LAWYER_APP_URL}/`;
    const session = encoded ? decodeSessionParam(encoded) : null;

    if (!session?.token) {
      setMessage("رابط الدخول غير صالح أو منتهي. سيتم إعادتك لتسجيل الدخول.");
      const timer = window.setTimeout(() => {
        window.location.replace(`${LAWYER_APP_URL}/login`);
      }, 1200);
      return () => window.clearTimeout(timer);
    }

    try {
      sessionStorage.setItem(LAWYER_AUTH_SESSION_KEY, JSON.stringify(session));
      localStorage.setItem(
        LAWYER_AUTH_USER_KEY,
        JSON.stringify({
          id: session.id,
          user: {
            id: session.id,
            name: session.name,
            email: session.email,
            role: session.role,
          },
        })
      );
    } catch {
      setMessage("تعذر حفظ جلسة الدخول في المتصفح.");
      return;
    }

    // Strip token from history, then enter lawyer dashboard in this same tab.
    window.history.replaceState({}, "", window.location.pathname);
    window.location.replace(next.endsWith("/") ? next : `${next}/`);
  }, [searchParams]);

  return (
    <main
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-[#f7f4ef] text-[#1b1c1a] font-['Cairo',sans-serif] p-6"
    >
      <div className="max-w-md w-full rounded-[12px] border border-[#eae8e4] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 size-10 rounded-full border-2 border-[#9c6402]/30 border-t-[#9c6402] animate-spin" />
        <p className="text-[15px] font-bold">{message}</p>
        <p className="mt-2 text-[12px] text-[#737067]">
          لن يُطلب منك إدخال البريد أو كلمة المرور.
        </p>
      </div>
    </main>
  );
}

export default function ImpersonateHandoffPage() {
  return (
    <Suspense
      fallback={
        <main
          dir="rtl"
          className="min-h-screen flex items-center justify-center bg-[#f7f4ef] font-['Cairo',sans-serif]"
        >
          جاري التحضير…
        </main>
      }
    >
      <ImpersonateHandoffClient />
    </Suspense>
  );
}
