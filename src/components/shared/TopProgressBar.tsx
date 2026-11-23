"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Instant Top Progress Bar (Brand Gold #9c6402)
 * -------------------------------------------------------------
 * Provides 0ms immediate visual feedback on any link click,
 * eliminating the perceived "freeze" while Next.js loads page chunks.
 * Smoothly completes when the new route / searchParams arrive.
 */
export function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Complete progress smoothly whenever pathname or searchParams change
  useEffect(() => {
    if (isVisible) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 220);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept clicks on internal links for 0ms instantaneous feedback
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target || target.target === "_blank") return;

      const rawHref = target.getAttribute("href");
      if (
        !rawHref ||
        rawHref.startsWith("#") ||
        rawHref.startsWith("javascript:") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:")
      ) {
        return;
      }

      try {
        const currentUrl = new URL(window.location.href);
        const targetUrl = new URL(target.href, window.location.href);

        if (targetUrl.origin !== currentUrl.origin) return;

        // Skip if exact same URL and query
        if (
          targetUrl.pathname === currentUrl.pathname &&
          targetUrl.search === currentUrl.search
        ) {
          return;
        }

        // Trigger progress bar immediately (0ms feedback)
        setIsVisible(true);
        setProgress(30);

        // Progressively advance to 75% while chunk loads
        setTimeout(() => {
          setProgress((prev) => (prev >= 30 && prev < 75 ? 75 : prev));
        }, 120);
      } catch {}
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
    };
  }, []);

  // Safety fallback: auto-clear after 4 seconds if navigation is aborted
  useEffect(() => {
    if (isVisible && progress < 100) {
      const fallbackTimer = setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 4000);
      return () => clearTimeout(fallbackTimer);
    }
  }, [isVisible, progress]);

  if (!isVisible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-[3px] overflow-hidden"
    >
      <div
        className="h-full bg-gradient-to-r from-[#9c6402] via-[#d97706] to-[#f59e0b] shadow-[0_0_12px_rgba(156,100,2,0.85)] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: isVisible ? 1 : 0,
        }}
      />
    </div>
  );
}
