import React from "react";
import type { Metadata } from "next";
import { AuthSplitCard } from "@/features/auth/components/AuthSplitCard";

export const metadata: Metadata = {
  title: "تسجيل الدخول | الجودي لإدارة مكاتب وشركات المحاماة",
  description: "تسجيل الدخول إلى لوحة التحكم - منظومة الجودي السحابية لإدارة القضايا، الجلسات، والموكلين القانونيين",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full bg-[#0d0c0b] text-[#1c1917] dark:text-[#f5f4f0] flex items-center justify-center p-3 sm:p-6 lg:p-10 relative overflow-hidden">
      {/* Ambient Luxury Gold Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#c29547]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#c29547]/8 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Split-Screen Auth Card with Smooth Layout & Direction Transitions */}
      <AuthSplitCard />
    </main>
  );
}
