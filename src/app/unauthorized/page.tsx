import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, ArrowRight, LogOut, Home } from "lucide-react";
import { AlJoudyLogo } from "@/components/shared/BrandLogos";

export const metadata: Metadata = {
  title: "غير مصرح بالدخول | منصة الجودي",
  description: "عذراً، لا تمتلك الصلاحيات الكافية للوصول إلى هذه الصفحة",
};

export default function UnauthorizedPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen w-full bg-[#0d0c0b] text-[#fdfbf7] flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden font-['Cairo',sans-serif]"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#c29547]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl rounded-[28px] sm:rounded-[36px] overflow-hidden p-8 sm:p-12 border border-[#2f2a24] bg-[#151311] shadow-[0_30px_90px_rgba(0,0,0,0.85)] text-center space-y-6">
        <div className="flex justify-center">
          <AlJoudyLogo className="h-10 w-auto" />
        </div>

        <div className="size-20 mx-auto rounded-full bg-gradient-to-b from-[#2e1c12] to-[#1e130d] border border-[#e29d38]/30 flex items-center justify-center shadow-inner">
          <ShieldAlert className="size-10 text-[#e29d38]" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-red-950/60 border border-red-800/40 text-red-400">
            خطأ 403 - صلاحيات غير كافية
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#fdfbf7]">
            غير مصرح بالدخول
          </h1>
          <p className="text-sm text-[#a89f91] max-w-md mx-auto leading-relaxed">
            عذراً، لا يمتلك حسابك الصلاحيات اللازمة للوصول إلى هذه الصفحة وفقاً للدور الوظيفي المعتمد من قبل الإدارة العليا.
          </p>
        </div>

        <div className="p-4 rounded-[16px] bg-[#1d1611] border border-[#38271c] text-start text-xs text-[#d5cec5] space-y-1.5">
          <div className="font-bold text-[#e29d38] flex items-center gap-1.5">
            <span>💡</span>
            <span>ماذا يمكنك أن تفعل؟</span>
          </div>
          <p className="text-[#a89f91] leading-relaxed">
            إذا كنت بحاجة إلى الوصول إلى هذا القسم لأداء مهامك اليومية، يرجى التواصل مع المشرف العام أو مسؤول النظام لتعديل مصفوفة الصلاحيات الممنوحة لدورك.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#9c6402] to-[#b37402] hover:from-[#855402] hover:to-[#9c6402] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="size-4" />
            <span>العودة إلى الصفحة الرئيسية</span>
          </Link>
          <Link
            href="/login/"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#241a14] hover:bg-[#2e2019] border border-[#38271c] text-[#d5cec5] hover:text-[#fdfbf7] font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="size-4" />
            <span>تسجيل الخروج أو تبديل الحساب</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
