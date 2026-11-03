"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Home, LogIn, RotateCcw, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/base-path";

type StatusKind = "error" | "not-found";

interface AppStatusScreenProps {
  kind: StatusKind;
  title: string;
  description: string;
  digest?: string;
  onRetry?: () => void;
  /** Auto-navigate home after N ms (soft recovery so users don't stay stuck). */
  autoRedirectMs?: number;
}

/**
 * Soft branded status screen (error / 404) — same visual language as PageLoadingPanel.
 * Avoids the harsh full-page 500/404 flash on first entry.
 */
export function AppStatusScreen({
  kind,
  title,
  description,
  digest,
  onRetry,
  autoRedirectMs = 0,
}: AppStatusScreenProps) {
  const [countdown, setCountdown] = useState(
    autoRedirectMs > 0 ? Math.ceil(autoRedirectMs / 1000) : 0
  );

  useEffect(() => {
    if (!autoRedirectMs || autoRedirectMs <= 0) return;

    const started = Date.now();
    const tick = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((autoRedirectMs - (Date.now() - started)) / 1000));
      setCountdown(left);
      if (left <= 0) {
        window.clearInterval(tick);
        window.location.href = withBasePath("/");
      }
    }, 250);

    return () => window.clearInterval(tick);
  }, [autoRedirectMs]);

  const badge =
    kind === "not-found"
      ? "الصفحة غير موجودة"
      : "تعذر إتمام العملية مؤقتاً";

  return (
    <main className="min-h-screen w-full bg-[#fcfbfa] dark:bg-[#150f0b] text-[#1c1917] dark:text-[#fdfbf7] flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden select-none">
      <div className="absolute inset-0 bg-[radial-gradient(#ded5c6_1px,transparent_1px)] dark:bg-[radial-gradient(#38271c_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-[#c29547]/10 dark:bg-[#e29d38]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[440px]">
        <div className="bg-white dark:bg-[#221812] border border-[#eae8e4] dark:border-[#38271c] rounded-[16px] shadow-[0px_12px_36px_rgba(0,0,0,0.08)] dark:shadow-[0px_16px_40px_rgba(0,0,0,0.4)] px-8 py-10 flex flex-col items-center text-center overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-l from-transparent via-[#c29547] dark:via-[#e29d38] to-transparent opacity-80" />

          <div className="relative w-[96px] h-[96px] flex items-center justify-center mb-5">
            <div
              className="absolute inset-0 rounded-full border border-dashed border-[#c29547]/35 dark:border-[#e29d38]/35 animate-spin"
              style={{ animationDuration: "14s" }}
            />
            <div className="relative z-10 size-[64px] rounded-full bg-[#faf5eb] dark:bg-[#2d1f16] border border-[#eeddbb] dark:border-[#4d3627] flex items-center justify-center shadow-[0_6px_18px_-4px_rgba(194,149,71,0.28)]">
              <Scale className="size-[28px] text-[#9c6402] dark:text-[#e29d38]" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#f5f3ef] dark:bg-[#281c15] text-[#9c6402] dark:text-[#e29d38] border border-[#eae8e4] dark:border-[#38271c] mb-3">
            {badge}
          </div>

          <h1 className="text-[20px] font-extrabold text-[#1b1c1a] dark:text-[#fdfbf7] tracking-tight">
            {title}
          </h1>
          <p className="text-[13px] text-[#837565] dark:text-[#a89f91] mt-2 leading-relaxed">
            {description}
          </p>

          {countdown > 0 && (
            <p className="mt-3 text-[12px] font-medium text-[#c29547] dark:text-[#e29d38]">
              سيتم التوجيه خلال {countdown} ث...
            </p>
          )}

          {digest && (
            <p className="mt-2 text-[10px] font-mono text-[#8e8680] break-all">
              ID: {digest}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-stretch gap-2.5 w-full mt-6">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className={cn(
                  "flex-1 h-11 rounded-[10px] bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f]",
                  "text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer",
                  "hover:opacity-95 transition-opacity"
                )}
              >
                <RotateCcw className="size-4" />
                إعادة المحاولة
              </button>
            )}
            <Link
              href="/"
              className="flex-1 h-11 rounded-[10px] border border-[#eae8e4] dark:border-[#38271c] bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-bold flex items-center justify-center gap-2 hover:border-[#9c6402] dark:hover:border-[#e29d38] transition-colors"
            >
              <Home className="size-4" />
              الرئيسية
            </Link>
            <Link
              href="/login"
              className="flex-1 h-11 rounded-[10px] border border-[#eae8e4] dark:border-[#38271c] bg-white dark:bg-[#1a120d] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-bold flex items-center justify-center gap-2 hover:border-[#9c6402] dark:hover:border-[#e29d38] transition-colors"
            >
              <LogIn className="size-4" />
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
