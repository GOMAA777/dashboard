"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getAuthSession, getAuthUser, touchAuthSession } from "@/lib/auth-client";
import { AuthSplitCard } from "@/features/auth/components/AuthSplitCard";
import { withBasePath } from "@/lib/base-path";
import { canAccessRoute } from "@/lib/permissions";
import type { AdminUser } from "@/lib/api/types";

type GateStatus = "pending" | "guest" | "authed" | "must-change" | "unauthorized";

function resolveGateStatus(
  pathname: string | null,
  isUnauthorizedRoute: boolean
): GateStatus {
  const authed = getAuthSession();
  const user = getAuthUser<AdminUser>();
  const needsChange = !!user?.mustChangePassword;

  if (!authed || !user) return "guest";

  if (
    needsChange &&
    typeof window !== "undefined" &&
    !window.location.pathname.includes("/change-password")
  ) {
    return "must-change";
  }

  const currentPath =
    pathname ||
    (typeof window !== "undefined" ? window.location.pathname : "/");
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;

  if (
    !isUnauthorizedRoute &&
    !canAccessRoute(currentPath, user, searchParams)
  ) {
    return "unauthorized";
  }

  return "authed";
}

/** Neutral first paint — never the black session splash. */
function SoftBootFrame() {
  return <div className="min-h-screen w-full bg-background" aria-hidden />;
}

export function DashboardAuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChangePasswordRoute =
    typeof pathname === "string" && pathname.includes("/change-password");
  const isUnauthorizedRoute =
    typeof pathname === "string" && pathname.includes("/unauthorized");

  // Match SSR + first client paint (no localStorage) to avoid hydration mismatch,
  // then resolve session in useLayoutEffect before the browser paints.
  const [status, setStatus] = useState<GateStatus>("pending");
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const next = resolveGateStatus(pathname, isUnauthorizedRoute);
    setStatus(next);
    setReady(true);

    if (next === "guest") {
      const current = window.location.pathname;
      if (
        !current.includes("/login") &&
        !current.includes("/impersonate-handoff")
      ) {
        const target = withBasePath("/login");
        window.location.replace(target.endsWith("/") ? target : `${target}/`);
      }
      return;
    }

    // Keep the stored session alive across deploys/reloads while the tab is open.
    touchAuthSession();

    if (next === "must-change" && !window.location.pathname.includes("/change-password")) {
      const target = withBasePath("/change-password");
      window.location.replace(target.endsWith("/") ? target : `${target}/`);
      return;
    }

    if (next === "unauthorized" && !isUnauthorizedRoute) {
      const target = withBasePath("/unauthorized");
      window.location.replace(target.endsWith("/") ? target : `${target}/`);
    }
  }, [pathname, isUnauthorizedRoute]);

  useEffect(() => {
    const sync = () => {
      const next = resolveGateStatus(pathname, isUnauthorizedRoute);
      setStatus(next);
      if (next === "authed" || next === "must-change" || next === "unauthorized") {
        touchAuthSession();
      }
    };
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    window.addEventListener("aljudy-auth-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
      window.removeEventListener("aljudy-auth-changed", sync);
    };
  }, [pathname, isUnauthorizedRoute]);

  if (!ready || status === "pending") {
    return <SoftBootFrame />;
  }

  if (status === "guest") {
    return (
      <main className="min-h-screen w-full bg-[#fcfbfa] dark:bg-[#150f0b] text-[#1c1917] dark:text-[#fdfbf7] flex items-center justify-center p-3 sm:p-6 lg:p-10 relative overflow-hidden font-['Cairo']">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#c29547]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#c29547]/8 rounded-full blur-[140px] pointer-events-none" />

        <AuthSplitCard
          onLoginSuccess={() => {
            const user = getAuthUser<AdminUser>();
            if (user?.mustChangePassword) {
              setStatus("must-change");
              const target = withBasePath("/change-password");
              window.location.assign(
                target.endsWith("/") ? target : `${target}/`
              );
              return;
            }
            setStatus("authed");
          }}
        />
      </main>
    );
  }

  if (status === "must-change" && !isChangePasswordRoute) {
    return <SoftBootFrame />;
  }

  if (status === "unauthorized" && !isUnauthorizedRoute) {
    return <SoftBootFrame />;
  }

  return <>{children}</>;
}
