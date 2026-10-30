"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  Construction,
  ArrowRight,
  Sparkles,
  Lock,
} from "lucide-react";
import userAvatarImg from "../../../../public/figma/user-avatar.png";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { ScalesOfJusticeWatermark } from "@/components/shared/ScalesOfJusticeWatermark";

export function ProfileView() {
  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200 relative font-sans">
      {/* 1. Main Navigation Sidebar */}
      <DashboardSidebar />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <DashboardTopNavbar />

        <main className="flex-1 w-full relative p-4 sm:p-6 lg:p-8">
          {/* Ambient Scales of Justice Emblems */}
          <div
            className="fixed top-28 -left-28 size-[380px] opacity-[0.035] text-[#c29547] pointer-events-none select-none z-0"
            aria-hidden="true"
          >
            <ScalesOfJusticeWatermark className="w-full h-full" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto space-y-6 text-right">
            {/* Breadcrumb Header */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8c8279]">
              <Link href="/" className="hover:text-[#c29547] transition-colors">
                الرئيسية
              </Link>
              <span>/</span>
              <span className="text-[#c29547]">الملف الشخصي</span>
            </div>

            {/* Under Construction Notice Banner */}
            <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-[16px] p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 text-right w-full sm:w-auto">
                <div className="size-12 rounded-[12px] bg-[#fef3c7] text-[#b45309] flex items-center justify-center shrink-0 shadow-2xs">
                  <Construction className="size-6 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[#92400e] text-base font-bold">
                      صفحة الملف الشخصي قيد الإنشاء والتجهيز
                    </h2>
                    <span className="bg-[#fef3c7] text-[#92400e] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      تحت التطوير
                    </span>
                  </div>
                  <p className="text-[#b45309] text-xs mt-0.5">
                    جاري العمل على تجهيز أدوات تعديل البيانات الشخصية، تفضيلات الإشعارات، وتخصيص كلمة المرور المتقدمة.
                  </p>
                </div>
              </div>

              <Link
                href="/"
                className="bg-[#9c6402] hover:bg-[#855401] text-white text-xs font-semibold px-4 py-2 rounded-[8px] flex items-center gap-1.5 transition-colors shrink-0 self-end sm:self-auto cursor-pointer"
              >
                <span>العودة للوحة التحكم</span>
                <ArrowRight className="size-4 rotate-180" />
              </Link>
            </div>

            {/* Profile Overview Card */}
            <div className="bg-white rounded-[16px] p-6 sm:p-8 shadow-sm border border-[#eae8e4] relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Avatar with Ring */}
                <div className="relative size-24 rounded-full overflow-hidden border-2 border-[#9c6402] shadow-md shrink-0">
                  <Image
                    src={userAvatarImg}
                    alt="م. عبد العزيز بن فهد"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 end-1 size-4 rounded-full bg-[#10b981] border-2 border-white shadow-xs" />
                </div>

                {/* Identity Info */}
                <div className="flex-1 text-center sm:text-right space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h1 className="text-2xl font-bold text-[#1c140f]">
                        م. عبد العزيز بن فهد
                      </h1>
                      <p className="text-xs font-semibold text-[#837565] mt-0.5">
                        مشرف النظام العام • الإدارة العليا لمنصة الجودي
                      </p>
                    </div>

                    <span className="bg-[#ecfdf5] text-[#047857] text-xs font-bold px-3 py-1 rounded-full border border-[#a7f3d0] flex items-center gap-1.5 self-center sm:self-auto">
                      <span className="size-2 rounded-full bg-[#10b981] animate-pulse" />
                      الحساب نشط ومعتمد
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                    <span className="bg-[#f5f3ef] text-[#514537] text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5 text-[#9c6402]" />
                      صلاحيات المشرف العام الكاملة (Super Admin)
                    </span>
                    <span className="bg-[#f5f3ef] text-[#514537] text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Lock className="size-3.5 text-[#10b981]" />
                      المصادقة الثنائية 2FA مفعّلة
                    </span>
                  </div>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-[#eae8e4]">
                <div className="bg-[#faf8f5] rounded-[10px] p-4 border border-[#ede8e1] flex items-center gap-3">
                  <div className="size-10 rounded-[8px] bg-white border border-[#eae8e4] flex items-center justify-center text-[#9c6402] shrink-0">
                    <Mail className="size-5" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#837565] font-bold block">
                      البريد الإلكتروني المعتمد
                    </span>
                    <span className="text-xs font-semibold text-[#1c140f] font-mono">
                      admin@aljoody-law.sa
                    </span>
                  </div>
                </div>

                <div className="bg-[#faf8f5] rounded-[10px] p-4 border border-[#ede8e1] flex items-center gap-3">
                  <div className="size-10 rounded-[8px] bg-white border border-[#eae8e4] flex items-center justify-center text-[#9c6402] shrink-0">
                    <Phone className="size-5" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#837565] font-bold block">
                      رقم الهاتف المسجل
                    </span>
                    <span className="text-xs font-semibold text-[#1c140f] font-mono" dir="ltr">
                      +966 50 123 4567
                    </span>
                  </div>
                </div>

                <div className="bg-[#faf8f5] rounded-[10px] p-4 border border-[#ede8e1] flex items-center gap-3">
                  <div className="size-10 rounded-[8px] bg-white border border-[#eae8e4] flex items-center justify-center text-[#9c6402] shrink-0">
                    <Calendar className="size-5" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#837565] font-bold block">
                      تاريخ بدء الإشراف
                    </span>
                    <span className="text-xs font-semibold text-[#1c140f]">
                      15 أكتوبر 2023 (منذ عام)
                    </span>
                  </div>
                </div>

                <div className="bg-[#faf8f5] rounded-[10px] p-4 border border-[#ede8e1] flex items-center gap-3">
                  <div className="size-10 rounded-[8px] bg-white border border-[#eae8e4] flex items-center justify-center text-[#9c6402] shrink-0">
                    <Sparkles className="size-5" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#837565] font-bold block">
                      مستوى الوصول والتصريح
                    </span>
                    <span className="text-xs font-semibold text-[#1c140f]">
                      المستوى 1 (صلاحية النفاذ السيادية)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
