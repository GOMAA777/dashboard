"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  RotateCcw,
  Home,
  AlertTriangle,
  Headphones,
  LogIn,
  ChevronDown,
  Terminal,
  Scale,
} from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Log error to monitoring services if configured
    console.error("Dashboard Application Error:", error);
  }, [error]);

  return (
    <main className="min-h-screen w-full bg-[#fcfbfa] dark:bg-[#121110] text-[#1c1917] dark:text-[#f5f4f0] flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden select-none">
      {/* Ambient Luxury Gold Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-[#c29547]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#c29547]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header: Brand Logo & Title */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between py-3 border-b border-[#ded5c6]/60 dark:border-[#2f2a24]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-[#faf5eb] dark:bg-[#201c17] border border-[#eeddbb] dark:border-[#382b18] p-1.5 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <Scale className="w-6 h-6 text-[#c29547] dark:text-[#d4a759]" />
          </div>
          <div className="text-start">
            <span className="text-base font-extrabold text-[#c29547] dark:text-[#d4a759] tracking-tight block">
              الجودي للتسويق الإلكتروني
            </span>
            <span className="text-[10px] font-medium text-[#8c8279] dark:text-[#9e968a] block">
              منصة إدارة القضايا والمكاتب القانونية
            </span>
          </div>
        </Link>

        <Link
          href="/login"
          className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border border-[#ded5c6] dark:border-[#2f2a24] bg-white dark:bg-[#1a1816] text-[#4a443e] dark:text-[#e4ded5] hover:border-[#c29547] hover:text-[#c29547] shadow-2xs transition-all"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>تسجيل الدخول</span>
        </Link>
      </header>

      {/* Center Error Hero Section */}
      <div className="relative z-10 w-full max-w-3xl mx-auto my-auto py-10 text-center flex flex-col items-center">
        {/* Subtle Concentric Radar Rings Behind Number */}
        <div className="relative mb-2 flex items-center justify-center">
          <div className="absolute w-72 sm:w-80 h-72 sm:h-80 rounded-full border border-[#c29547]/15 pointer-events-none" />
          <div className="absolute w-56 sm:w-64 h-56 sm:h-64 rounded-full border border-[#c29547]/20 pointer-events-none" />

          {/* Huge Luxury Gold 500 Number */}
          <h1 className="text-8xl sm:text-9xl md:text-[11rem] font-black bg-gradient-to-b from-[#e8bf72] via-[#c29547] to-[#8c6220] bg-clip-text text-transparent tracking-tighter leading-none drop-shadow-xs">
            500
          </h1>
        </div>

        {/* Small Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#faf5eb] dark:bg-[#201c17] text-[#c29547] dark:text-[#d4a759] border border-[#eeddbb] dark:border-[#382b18] shadow-2xs mb-4">
          <AlertTriangle className="w-3.5 h-3.5 text-[#c29547]" />
          <span>خطأ في النظام - تعذر إتمام العملية</span>
        </div>

        {/* Heading & Subtitle */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1c1917] dark:text-[#f5f4f0] tracking-tight mb-3">
          عذراً، حدث خطأ غير متوقع في الصفحة!
        </h2>
        <p className="text-xs sm:text-sm text-[#7c7366] dark:text-[#9e968a] max-w-lg leading-relaxed mb-6">
          نعتذر عن هذا الخلل المؤقت أثناء محاولة معالجة بياناتك. تم تسجيل تفاصيل الخطأ في النظام تلقائياً لمراجعته وحله. يمكنك النقر على &quot;إعادة المحاولة&quot; أدناه لتحديث الصفحة فوراً.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 min-w-[180px] h-12 rounded-full bg-gradient-to-r from-[#d4a759] via-[#c29547] to-[#b38032] hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(194,149,71,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة المحاولة</span>
          </button>

          <Link
            href="/"
            className="flex-1 min-w-[160px] h-12 rounded-full border border-[#ded5c6] dark:border-[#2f2a24] bg-white dark:bg-[#1a1816] text-[#2c2825] dark:text-[#f5f4f0] hover:border-[#c29547] hover:text-[#c29547] dark:hover:text-[#d4a759] font-bold text-sm flex items-center justify-center gap-2 shadow-2xs hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </Link>
        </div>

        {/* Expandable Developer Error Details (if error digest exists) */}
        {error?.digest && (
          <div className="mt-5 w-full max-w-md">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8c8279] dark:text-[#787166] hover:text-[#c29547] transition-colors cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>معرف الخطأ المرجعي (ID: {error.digest})</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showDetails ? "rotate-180" : ""}`} />
            </button>

            {showDetails && (
              <div className="mt-2 p-3 rounded-xl bg-white dark:bg-[#1a1816] border border-[#ded5c6] dark:border-[#2f2a24] text-[11px] font-mono text-[#7c7366] dark:text-[#9e968a] text-start break-all shadow-2xs">
                <div>Digest: {error.digest}</div>
                {error.message && <div className="mt-1 text-red-500">Message: {error.message}</div>}
              </div>
            )}
          </div>
        )}

        {/* 3 Quick Direct Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl mt-8">
          <button
            type="button"
            onClick={() => reset()}
            className="bg-white dark:bg-[#1a1816] p-4 rounded-2xl border border-[#ded5c6] dark:border-[#2f2a24] hover:border-[#c29547] dark:hover:border-[#d4a759] shadow-2xs transition-all group flex items-center justify-between text-start cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#faf5eb] dark:bg-[#201c17] border border-[#eeddbb] dark:border-[#382b18] flex items-center justify-center text-[#c29547] dark:text-[#d4a759] shrink-0">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1c1917] dark:text-[#f5f4f0] block group-hover:text-[#c29547] transition-colors">
                  تحديث البيانات
                </span>
                <span className="text-[10px] text-[#8c8279] dark:text-[#787166]">
                  إعادة تشغيل الصفحة
                </span>
              </div>
            </div>
          </button>

          <Link
            href="/login"
            className="bg-white dark:bg-[#1a1816] p-4 rounded-2xl border border-[#ded5c6] dark:border-[#2f2a24] hover:border-[#c29547] dark:hover:border-[#d4a759] shadow-2xs transition-all group flex items-center justify-between text-start"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#faf5eb] dark:bg-[#201c17] border border-[#eeddbb] dark:border-[#382b18] flex items-center justify-center text-[#b87928] dark:text-[#e59a3c] shrink-0">
                <LogIn className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1c1917] dark:text-[#f5f4f0] block group-hover:text-[#c29547] transition-colors">
                  تسجيل الدخول
                </span>
                <span className="text-[10px] text-[#8c8279] dark:text-[#787166]">
                  تجديد الجلسة
                </span>
              </div>
            </div>
          </Link>

          <Link
            href="#"
            className="bg-white dark:bg-[#1a1816] p-4 rounded-2xl border border-[#ded5c6] dark:border-[#2f2a24] hover:border-[#c29547] dark:hover:border-[#d4a759] shadow-2xs transition-all group flex items-center justify-between text-start"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#faf5eb] dark:bg-[#201c17] border border-[#eeddbb] dark:border-[#382b18] flex items-center justify-center text-[#c29547] dark:text-[#d4a759] shrink-0">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1c1917] dark:text-[#f5f4f0] block group-hover:text-[#c29547] transition-colors">
                  الدعم الفني
                </span>
                <span className="text-[10px] text-[#8c8279] dark:text-[#787166]">
                  مساعدتك فورياً
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Bottom Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 py-4 border-t border-[#ded5c6]/60 dark:border-[#2f2a24] text-xs text-[#8c8279] dark:text-[#787166]">
        <span>© 2005-2026 شركة الجودي للتسويق الإلكتروني. جميع الحقوق محفوظة.</span>
        <div className="flex items-center gap-4 text-xs font-medium">
          <Link href="/" className="hover:text-[#c29547] transition-colors">
            الرئيسية
          </Link>
          <Link href="/login" className="hover:text-[#c29547] transition-colors">
            تسجيل الدخول
          </Link>
          <Link href="#" className="hover:text-[#c29547] transition-colors">
            مركز المساعدة
          </Link>
        </div>
      </footer>
    </main>
  );
}
