"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { getAuthSession } from "@/lib/auth-client";

export function DashboardAuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const isAuth = useSyncExternalStore(
    () => () => {},
    () => getAuthSession(),
    () => null
  );

  useEffect(() => {
    if (isAuth === false) {
      router.replace("/login");
    }
  }, [isAuth, router]);

  if (isAuth !== true) {
    return (
      <div
        className="min-h-screen w-full bg-[#fcfbfa] flex items-center justify-center p-6 select-none"
        dir="rtl"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="size-10 border-3 border-[#c29547] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#837565]">
            جاري التحقق من تسجيل الدخول...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
