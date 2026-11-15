"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/stores/use-ui-store";
import { DashboardPageSkeleton } from "./DashboardPageSkeleton";

interface DashboardPageTransitionProps {
  children: React.ReactNode;
}

export function DashboardPageTransition({ children }: DashboardPageTransitionProps) {
  const pathname = usePathname();
  const isPageNavigating = useUIStore((state) => state.isPageNavigating);
  const setPageNavigating = useUIStore((state) => state.setPageNavigating);

  // When navigating, smoothly clear the skeleton loading state after transition
  useEffect(() => {
    if (isPageNavigating) {
      const timer = setTimeout(() => {
        setPageNavigating(false);
      }, 280);
      return () => clearTimeout(timer);
    }
  }, [pathname, isPageNavigating, setPageNavigating]);

  if (isPageNavigating) {
    return <DashboardPageSkeleton />;
  }

  return <>{children}</>;
}
