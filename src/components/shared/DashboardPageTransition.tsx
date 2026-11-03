"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/stores/use-ui-store";
import { cn } from "@/lib/utils";

interface DashboardPageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardPageTransition({ children, className }: DashboardPageTransitionProps) {
  const pathname = usePathname();
  const isPageNavigating = useUIStore((state) => state.isPageNavigating);
  const setPageNavigating = useUIStore((state) => state.setPageNavigating);

  // Turn off route navigation indicator immediately when pathname changes
  useEffect(() => {
    if (isPageNavigating) {
      setPageNavigating(false);
    }
  }, [pathname, isPageNavigating, setPageNavigating]);

  // Safety fallback: if navigation takes longer than 2.5s, auto-clear
  useEffect(() => {
    if (isPageNavigating) {
      const timer = setTimeout(() => {
        setPageNavigating(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isPageNavigating, setPageNavigating]);

  return (
    <div
      className={cn(
        "w-full flex-1 flex flex-col gap-6 min-w-0 transition-opacity duration-150 animate-in fade-in",
        className
      )}
    >
      {children}
    </div>
  );
}
