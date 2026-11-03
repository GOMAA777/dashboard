"use client";

import React, { useCallback, useEffect, useState } from "react";
import { getAuthSession } from "@/lib/auth-client";
import { AuthSplitCard } from "@/features/auth/components/AuthSplitCard";

export function DashboardAuthGate({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const refresh = useCallback(() => {
    setIsAuthenticated(getAuthSession());
  }, []);

  useEffect(() => {
    refresh();

    const onStorage = () => refresh();
    const onFocus = () => refresh();
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  // Avoid flashing the login form before we read localStorage/cookies.
  if (isAuthenticated === null) {
    return (
      <main className="min-h-screen w-full bg-[#fcfbfa] dark:bg-[#150f0b] flex items-center justify-center p-4">
        <div className="size-10 rounded-full border-2 border-[#c29547]/30 border-t-[#c29547] dark:border-[#e29d38]/30 dark:border-t-[#e29d38] animate-spin" />
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen w-full bg-[#0d0c0b] text-[#1c1917] dark:text-[#fdfbf7] flex items-center justify-center p-3 sm:p-6 lg:p-10 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#c29547]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#c29547]/8 rounded-full blur-[140px] pointer-events-none" />

        <AuthSplitCard
          onLoginSuccess={() => {
            setIsAuthenticated(true);
          }}
        />
      </main>
    );
  }

  return <>{children}</>;
}
