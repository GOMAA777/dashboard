"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { DashboardAuthGate } from "@/components/shared/DashboardAuthGate";

const PUBLIC_PATH_MARKERS = [
  "/login",
  "/impersonate-handoff",
];

function isPublicPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return PUBLIC_PATH_MARKERS.some((marker) => pathname.includes(marker));
}

/**
 * Wraps the whole app so every dashboard route requires a session,
 * while login + impersonation handoff stay public.
 */
export function AppAuthShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isPublicPath(pathname)) {
    return <>{children}</>;
  }

  return <DashboardAuthGate>{children}</DashboardAuthGate>;
}
