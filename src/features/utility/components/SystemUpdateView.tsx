"use client";

import React, { useState } from "react";
import {
  Download,
  Info,
  Calendar,
  ShieldCheck,
  Package,
  HardDrive,
  Clock,
  Server,
  CloudDownload,
  Monitor,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { initialUpdateStats, initialVersionInfo } from "../data/initialUpdateData";

export function SystemUpdateView() {
  const [stats] = useState(initialUpdateStats);
  const [versionInfo] = useState(initialVersionInfo);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState<number | null>(null);

  const handleStartUpdate = () => {
    setIsUpdating(true);
    setUpdateProgress(15);
    toast.info("بدء تنزيل الحزمة البرمجية v4.5.0 ومطابقة توقيع SHA-256...");

    setTimeout(() => {
      setUpdateProgress(55);
      toast.info("ترحيل هياكل قواعد البيانات والتوافق مع القضايا...");
    }, 1200);

    setTimeout(() => {
      setUpdateProgress(90);
      toast.info("إعادة تشغيل الخدمات المركزية وتحديث التخزين المؤقت...");
    }, 2400);

    setTimeout(() => {
      setIsUpdating(false);
      setUpdateProgress(null);
      toast.success("تم تحديث النظام بنجاح إلى الإصدار v4.5.0!");
    }, 3600);
  };

  return (
    <div
      className="flex h-screen bg-[#f5f3ef] font-sans antialiased overflow-hidden selection:bg-[#ffddb6]/30 selection:text-[#643f00]"
    >
      {/* 1. Global Navigation Sidebar */}
      <DashboardSidebar activeNav="utility" activeSubNav="update" />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <DashboardTopNavbar />

        <main className="flex-1 overflow-y-auto px-[24px] sm:px-[32px] py-[24px] max-w-[1360px] w-full mx-auto pb-[80px] scrollbar-thin">
          {/* Main Identity & Command Banner (Figma 1:18816) */}
          <div className="bg-white rounded-[8px] p-[24px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] relative mb-[24px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px]">
            <div className="flex flex-col gap-[4px] text-start">
              <h1 className="text-[28px] leading-[38px] font-bold text-[#1b1c1a]">
                تحديث النظام
              </h1>
              <p className="text-[14px] leading-[22px] font-normal text-[#514537]">
                فحص وإدارة تحديثات النواة المركزية للمنظومة القانونية، ومطابقة التوافق البرمجي وترحيل قواعد البيانات القضائية.
              </p>
            </div>
          </div>

          {/* Quick Stats Grid - Enterprise Context (Figma 1:18826) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] mb-[24px]">
            {/* Stat 1: حالة النسخة الاحتياطية */}
            <div className="bg-white rounded-[8px] p-[16px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#eae8e4] flex flex-col gap-[4px] text-start">
              <div className="flex items-center justify-between mb-[4px]">
                <HardDrive className="size-[16px] text-[#837565]" />
                <span className="text-[10px] font-bold text-[#837565]">
                  حالة النسخة الاحتياطية
                </span>
              </div>
              <h3 className="text-[18px] font-semibold text-[#1b1c1a] leading-[26px]">
                {stats.backupStatus}
              </h3>
              <p className="text-[12px] text-[#514537] leading-[18px]">
                {stats.backupTime}
              </p>
            </div>

            {/* Stat 2: آخر فحص تلقائي */}
            <div className="bg-white rounded-[8px] p-[16px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#eae8e4] flex flex-col gap-[4px] text-start">
              <div className="flex items-center justify-between mb-[4px]">
                <Clock className="size-[16px] text-[#837565]" />
                <span className="text-[10px] font-bold text-[#837565]">
                  آخر فحص تلقائي
                </span>
              </div>
              <h3 className="text-[18px] font-semibold text-[#1b1c1a] leading-[26px]">
                {stats.lastScanTime}
              </h3>
              <p className="text-[12px] text-[#514537] leading-[18px]">
                {stats.lastScanStatus}
              </p>
            </div>

            {/* Stat 3: بيئة التشغيل */}
            <div className="bg-white rounded-[8px] p-[16px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#eae8e4] flex flex-col gap-[4px] text-start">
              <div className="flex items-center justify-between mb-[4px]">
                <Server className="size-[16px] text-[#837565]" />
                <span className="text-[10px] font-bold text-[#837565]">
                  بيئة التشغيل
                </span>
              </div>
              <h3 className="text-[18px] font-semibold text-[#1b1c1a] leading-[26px]">
                {stats.environment}
              </h3>
              <p className="text-[12px] text-[#514537] leading-[18px]">
                {stats.serverLocation}
              </p>
            </div>
          </div>

          {/* Interactive Workspace State Container (Figma 1:18857) */}
          <div className="bg-white rounded-[8px] p-[24px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] flex flex-col gap-[24px]">
            {/* Dual Version Cards (Figma 1:18859) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              {/* Right Card (In RTL context): Current Version (Figma 1:18887) */}
              <div className="bg-[#f5f3ef] rounded-[8px] p-[24px] pt-[32px] flex flex-col gap-[16px] relative overflow-hidden border border-[#eae8e4]">
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  {/* Left Label in RTL */}
                  <div className="size-[40px] rounded-[4px] bg-[#f0eeea] flex items-center justify-center text-[#514537]">
                    <Monitor className="size-[20px]" />
                  </div>
                  {/* Right Titles in RTL */}
                  <div className="flex flex-col text-start">
                    <span className="text-[10px] font-bold text-[#837565]">
                      النسخة المشغّلة بالنظام
                    </span>
                    <h2 className="text-[22px] font-semibold text-[#1b1c1a] leading-[32px]">
                      الإصدار الحالي
                    </h2>
                  </div>
                </div>

                {/* Big Version Tag Row */}
                <div className="flex items-center justify-between py-[4px]">
                  <span className="bg-[#e8f5e9] text-[#1b7340] text-[10px] font-bold px-[10px] py-[4px] rounded-[2px] flex items-center gap-[4px]">
                    <span className="size-[6px] rounded-full bg-[#1b7340]" />
                    <span>{versionInfo.installedStatus}</span>
                  </span>
                  <span className="text-[36px] font-bold font-mono text-[#1b1c1a] tracking-tight">
                    {versionInfo.installedVersion}
                  </span>
                </div>

                {/* Details Footer */}
                <div className="flex flex-col gap-[6px] text-start text-[12px] text-[#514537] border-t border-[#eae8e4] pt-[12px]">
                  <div className="flex items-center gap-[6px] justify-start">
                    <Calendar className="size-[13px] text-[#837565]" />
                    <span>تاريخ التثبيت: {versionInfo.installedDate}</span>
                  </div>
                  <div className="flex items-center gap-[6px] justify-start">
                    <ShieldCheck className="size-[14px] text-[#059669]" />
                    <span>{versionInfo.coreKernelStatus}</span>
                  </div>
                </div>

                {/* Decorative watermark corner */}
                <div className="absolute -bottom-6 -start-6 size-[110px] rounded-[12px] bg-[#f0eeea] opacity-40 pointer-events-none" />
              </div>

              {/* Left Card (In RTL context): Latest Available Version (Figma 1:18860) */}
              <div className="bg-[#fffdf9] border border-[#ffddb6] rounded-[8px] p-[24px] pt-[32px] flex flex-col gap-[16px] relative overflow-hidden shadow-xs">
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  {/* Left Icon in RTL */}
                  <div className="size-[40px] rounded-[4px] bg-[#ffddb6] flex items-center justify-center text-[#7b4e00]">
                    <CloudDownload className="size-[22px]" />
                  </div>
                  {/* Right Titles in RTL */}
                  <div className="flex flex-col text-start">
                    <span className="text-[10px] font-bold text-[#7b4e00]">
                      الحزمة السحابية الصادرة
                    </span>
                    <h2 className="text-[22px] font-semibold text-[#1b1c1a] leading-[32px]">
                      أحدث إصدار متاح
                    </h2>
                  </div>
                </div>

                {/* Big Version Tag Row */}
                <div className="flex items-center justify-between py-[4px]">
                  <span className="bg-[#fff8e1] text-[#b76e00] text-[10px] font-bold px-[10px] py-[4px] rounded-[2px] flex items-center gap-[4px]">
                    <span className="size-[6px] rounded-full bg-[#b76e00]" />
                    <span>تحديث رئيسي متاح</span>
                  </span>
                  <span className="text-[36px] font-bold font-mono text-[#7b4e00] tracking-tight">
                    {versionInfo.latestVersion}
                  </span>
                </div>

                {/* Details Footer */}
                <div className="flex flex-col gap-[6px] text-start text-[12px] text-[#514537] border-t border-[#fce9d3] pt-[12px]">
                  <div className="flex items-center gap-[6px] justify-start">
                    <Calendar className="size-[13px] text-[#837565]" />
                    <span>تاريخ الإصدار: {versionInfo.latestReleaseDate}</span>
                  </div>
                  <div className="flex items-center gap-[6px] justify-start">
                    <Package className="size-[14px] text-[#7b4e00]" />
                    <span>حجم الحزمة البرمجية: {versionInfo.packageSize}</span>
                  </div>
                </div>

                {/* Decorative watermark corner */}
                <div className="absolute -bottom-6 -start-6 size-[110px] rounded-[12px] bg-[rgba(123,78,0,0.08)] pointer-events-none" />
              </div>
            </div>

            {/* Pre-Update Guidance Banner (Figma 1:18914) */}
            <div className="bg-[#f5f3ef] rounded-[8px] p-[16px] border border-[#eae8e4] flex flex-col gap-[8px] text-start">
              <div className="flex items-center gap-[8px]">
                <ShieldCheck className="size-[18px] text-[#9c6402]" />
                <h4 className="text-[16px] font-semibold text-[#1b1c1a]">
                  إرشادات هامة قبل البدء في عملية التحديث:
                </h4>
              </div>
              <div className="pe-[26px]">
                <p className="text-[13px] leading-[22px]">
                  <span className="font-semibold text-[#1b1c1a]">إنشاء نسخة احتياطية كاملة: </span>
                  <span className="text-[#514537]">
                    التأكد من حفظ لقطة متزامنة لملفات القضايا وقواعد بيانات SQL والتخزين السحابي (Database & Storage Backup).
                  </span>
                </p>
              </div>
            </div>

            {/* Primary Action Area (Figma 1:18925) */}
            <div className="flex flex-col items-center justify-center pt-[12px] gap-[12px]">
              {/* Progress bar if updating */}
              {isUpdating && updateProgress !== null && (
                <div className="w-full max-w-[620px] bg-[#f0eeea] rounded-full h-[8px] overflow-hidden">
                  <div
                    className="bg-[#9c6402] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${updateProgress}%` }}
                  />
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                disabled={isUpdating}
                onClick={handleStartUpdate}
                className="bg-[#9c6402] hover:bg-[#835401] active:bg-[#6c4501] text-white w-full max-w-[620px] h-[48px] rounded-[4px] font-semibold text-[17px] flex items-center justify-center gap-[8px] transition-all shadow-sm cursor-pointer disabled:opacity-75"
              >
                <Download className="size-[18px]" />
                <span>{isUpdating ? "جارٍ تحديث النظام..." : "تحديث النظام الآن"}</span>
              </button>

              {/* Warning note */}
              <div className="flex items-center gap-[6px] text-[#837565] text-[12px]">
                <span>
                  ملاحظة: قد تستغرق عملية التحديث من 3 إلى 5 دقائق وتتطلب إعادة تشغيل هادئة للخدمات المركزية.
                </span>
                <Info className="size-[14px]" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
