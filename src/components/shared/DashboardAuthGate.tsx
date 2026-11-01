"use client";

import React, { useEffect, useState } from "react";
import { getAuthSession } from "@/lib/auth-client";
import { AuthSplitCard } from "@/features/auth/components/AuthSplitCard";

export function DashboardAuthGate({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    setIsAuthenticated(getAuthSession());
  }, []);

  // Avoid flashing the login form before we read localStorage/cookies.
  if (isAuthenticated === null) {
    return (
      <main className="min-h-screen w-full bg-[#0d0c0b] flex items-center justify-center">
        <div className="size-10 rounded-full border-2 border-[#c29547]/30 border-t-[#c29547] animate-spin" />
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen w-full bg-[#0d0c0b] text-[#1c1917] dark:text-[#f5f4f0] flex items-center justify-center p-3 sm:p-6 lg:p-10 relative overflow-hidden">
        {/* Ambient Luxury Gold Background Glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#c29547]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#c29547]/8 rounded-full blur-[140px] pointer-events-none" />

        {/* Main Split-Screen Auth Card — hard-nav on success remounts this gate */}
        <AuthSplitCard onLoginSuccess={() => setIsAuthenticated(true)} />
      </main>
    );
  }

  return <>{children}</>;
}
