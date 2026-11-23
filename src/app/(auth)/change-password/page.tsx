import React from "react";
import type { Metadata } from "next";
import { AuthSideVisual } from "@/features/auth/components/AuthSideVisual";
import { ForceChangePasswordForm } from "@/features/auth/components/ForceChangePasswordForm";

export const metadata: Metadata = {
  title: "تغيير كلمة المرور | الجودي",
  description: "تغيير كلمة المرور الإجباري قبل الدخول إلى لوحة التحكم",
};

export default function ChangePasswordPage() {
  return (
    <main className="min-h-screen w-full bg-[#0d0c0b] text-[#1c1917] dark:text-[#fdfbf7] flex items-center justify-center p-3 sm:p-6 lg:p-10 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#c29547]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#c29547]/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl min-h-[660px] lg:h-[730px] rounded-[36px] sm:rounded-[44px] overflow-hidden flex flex-col lg:flex-row shadow-[0_30px_90px_rgba(0,0,0,0.85)] border border-[#2f2a24] bg-[#151311]">
        <div className="h-full hidden lg:block overflow-hidden lg:w-5/12">
          <AuthSideVisual />
        </div>
        <div className="h-full overflow-hidden lg:w-7/12 lg:rounded-s-[44px] shadow-[-10px_0_30px_rgba(0,0,0,0.3)]">
          <ForceChangePasswordForm />
        </div>
      </div>
    </main>
  );
}
