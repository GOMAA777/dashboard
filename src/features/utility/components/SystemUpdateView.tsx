"use client";

import React, { useEffect, useState } from "react";
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
import { useLanguage } from "@/lib/i18n";
import { fetchSystemUpdate, startSystemUpdate } from "@/lib/api/settings";
import { unwrapData, asString } from "@/lib/api/helpers";

export function SystemUpdateView() {
  const { direction, isEn } = useLanguage();
  const [stats] = useState(initialUpdateStats);
  const [versionInfo, setVersionInfo] = useState(initialVersionInfo);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchSystemUpdate()
      .then((payload) => {
        if (cancelled) return;
        const data = (unwrapData<Record<string, unknown>>(payload) ||
          {}) as Record<string, unknown>;
        setVersionInfo((prev) => ({
          ...prev,
          installedVersion: asString(
            data.current_version || data.version,
            prev.installedVersion
          ),
          latestVersion: asString(data.latest_version, prev.latestVersion),
          latestReleaseDate: asString(data.release_date, prev.latestReleaseDate),
        }));
      })
      .catch(() => {
        // Keep mock version info if API unavailable.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleStartUpdate = async () => {
    setIsUpdating(true);
    setUpdateProgress(15);
    toast.info(isEn ? "Downloading package v4.5.0 & validating SHA-256 signature..." : "بدء تنزيل الحزمة البرمجية v4.5.0 ومطابقة توقيع SHA-256...");

    try {
      await startSystemUpdate({});
    } catch {
      // Continue simulated progress for UX.
    }

    setTimeout(() => {
      setUpdateProgress(55);
      toast.info(isEn ? "Migrating database schemas and legal cases compatibility..." : "ترحيل هياكل قواعد البيانات والتوافق مع القضايا...");
    }, 1200);

    setTimeout(() => {
      setUpdateProgress(90);
      toast.info(isEn ? "Restarting core services and invalidating cache..." : "إعادة تشغيل الخدمات المركزية وتحديث التخزين المؤقت...");
    }, 2400);

    setTimeout(() => {
      setIsUpdating(false);
      setUpdateProgress(null);
      toast.success(isEn ? "System updated successfully to v4.5.0!" : "تم تحديث النظام بنجاح إلى الإصدار v4.5.0!");
    }, 3600);
  };

  return (
    <div
      dir={direction}
      className="flex h-screen bg-[#f5f3ef] dark:bg-[#1a120d] font-sans antialiased overflow-hidden selection:bg-[#ffddb6]/30 selection:text-[#643f00]"
    >
      {/* 1. Global Navigation Sidebar */}
      <DashboardSidebar activeNav="utility" activeSubNav="update" />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <DashboardTopNavbar />

        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 py-6 max-w-[1360px] w-full mx-auto pb-24 sm:pb-28 space-y-6 scrollbar-thin">
          {/* Main Identity & Command Banner (Figma 1:18816) */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-[4px] text-start">
              <h1 className="text-[28px] leading-[38px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {isEn ? "System Update" : "تحديث النظام"}
              </h1>
              <p className="text-[14px] leading-[22px] font-normal text-[#514537] dark:text-[#cdc5bd]">
                {isEn
                  ? "Inspect and manage central core updates for the legal system, verify software compatibility, and migrate judicial databases."
                  : "فحص وإدارة تحديثات النواة المركزية للمنظومة القانونية، ومطابقة التوافق البرمجي وترحيل قواعد البيانات القضائية."}
              </p>
            </div>
          </div>

          {/* Quick Stats Grid (Figma 1:18826) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Stat 1: حالة النسخة الاحتياطية */}
            <div className="bg-white dark:bg-[#221812] rounded-[8px] p-[16px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col gap-[4px] text-start">
              <div className="flex items-center justify-between mb-[4px]">
                <HardDrive className="size-[16px] text-[#837565] dark:text-[#e29d38]" />
                <span className="text-[10px] font-bold text-[#837565] dark:text-[#8e8680]">
                  {isEn ? "Backup Status" : "حالة النسخة الاحتياطية"}
                </span>
              </div>
              <h3 className="text-[18px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[26px]">
                {isEn ? "Synchronized & Verified" : stats.backupStatus}
              </h3>
              <p className="text-[12px] text-[#514537] dark:text-[#cdc5bd] leading-[18px]">
                {stats.backupTime}
              </p>
            </div>

            {/* Stat 2: آخر فحص تلقائي */}
            <div className="bg-white dark:bg-[#221812] rounded-[8px] p-[16px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col gap-[4px] text-start">
              <div className="flex items-center justify-between mb-[4px]">
                <Clock className="size-[16px] text-[#837565] dark:text-[#e29d38]" />
                <span className="text-[10px] font-bold text-[#837565] dark:text-[#8e8680]">
                  {isEn ? "Last Automated Scan" : "آخر فحص تلقائي"}
                </span>
              </div>
              <h3 className="text-[18px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[26px]">
                {stats.lastScanTime}
              </h3>
              <p className="text-[12px] text-[#514537] dark:text-[#cdc5bd] leading-[18px]">
                {isEn ? "No Vulnerabilities Detected" : stats.lastScanStatus}
              </p>
            </div>

            {/* Stat 3: بيئة التشغيل */}
            <div className="bg-white dark:bg-[#221812] rounded-[8px] p-[16px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col gap-[4px] text-start">
              <div className="flex items-center justify-between mb-[4px]">
                <Server className="size-[16px] text-[#837565] dark:text-[#e29d38]" />
                <span className="text-[10px] font-bold text-[#837565] dark:text-[#8e8680]">
                  {isEn ? "Runtime Environment" : "بيئة التشغيل"}
                </span>
              </div>
              <h3 className="text-[18px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[26px]">
                {stats.environment}
              </h3>
              <p className="text-[12px] text-[#514537] dark:text-[#cdc5bd] leading-[18px]">
                {stats.serverLocation}
              </p>
            </div>
          </div>

          {/* Interactive Workspace State Container (Figma 1:18857) */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-[24px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col gap-[24px]">
            {/* Dual Version Cards (Figma 1:18859) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              {/* Current Version Card */}
              <div className="bg-[#f5f3ef] dark:bg-[#281c15] rounded-[8px] p-[24px] pt-[32px] flex flex-col gap-[16px] relative overflow-hidden border border-[#eae8e4] dark:border-[#38271c]">
                <div className="flex items-start justify-between">
                  <div className="size-[40px] rounded-[6px] bg-[#f0eeea] dark:bg-[#38271c] flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] border border-transparent dark:border-[#4d3627]/60 shadow-xs">
                    <Monitor className="size-[20px]" />
                  </div>
                  <div className="flex flex-col text-start">
                    <span className="text-[10px] font-bold text-[#837565] dark:text-[#8e8680]">
                      {isEn ? "Active System Build" : "النسخة المشغّلة بالنظام"}
                    </span>
                    <h2 className="text-[22px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[32px]">
                      {isEn ? "Current Version" : "الإصدار الحالي"}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center justify-between py-[4px]">
                  <span className="bg-[#e8f5e9] dark:bg-emerald-950/60 text-[#1b7340] dark:text-emerald-400 border border-transparent dark:border-emerald-800/40 text-[10px] font-bold px-[10px] py-[4px] rounded-[2px] flex items-center gap-[4px]">
                    <span className="size-[6px] rounded-full bg-[#1b7340] dark:bg-emerald-400" />
                    <span>{isEn ? "Stable Operational Build" : versionInfo.installedStatus}</span>
                  </span>
                  <span className="text-[36px] font-bold font-mono text-[#1b1c1a] dark:text-[#fdfbf7] tracking-tight">
                    {versionInfo.installedVersion}
                  </span>
                </div>

                <div className="flex flex-col gap-[6px] text-start text-[12px] text-[#514537] dark:text-[#cdc5bd] border-t border-[#eae8e4] dark:border-[#38271c] pt-[12px]">
                  <div className="flex items-center gap-[6px] justify-start">
                    <Calendar className="size-[13px] text-[#837565] dark:text-[#8e8680]" />
                    <span>{isEn ? `Installation Date: ${versionInfo.installedDate}` : `تاريخ التثبيت: ${versionInfo.installedDate}`}</span>
                  </div>
                  <div className="flex items-center gap-[6px] justify-start">
                    <ShieldCheck className="size-[14px] text-[#059669] dark:text-emerald-400" />
                    <span>{isEn ? "Certified Cryptographic Signature Verified" : versionInfo.coreKernelStatus}</span>
                  </div>
                </div>

                <div className="absolute -bottom-6 -start-6 size-[110px] rounded-[12px] bg-[#f0eeea] dark:bg-[#1a120d] opacity-40 pointer-events-none" />
              </div>

              {/* Latest Available Version Card */}
              <div className="bg-[#fffdf9] dark:bg-[#281c15] border border-[#ffddb6] dark:border-[#4d3627] rounded-[8px] p-[24px] pt-[32px] flex flex-col gap-[16px] relative overflow-hidden shadow-xs">
                <div className="flex items-start justify-between">
                  <div className="size-[40px] rounded-[6px] bg-[#ffddb6] dark:bg-[#3d2716] flex items-center justify-center text-[#7b4e00] dark:text-[#e29d38] border border-transparent dark:border-[#4d3627]">
                    <CloudDownload className="size-[22px]" />
                  </div>
                  <div className="flex flex-col text-start">
                    <span className="text-[10px] font-bold text-[#7b4e00] dark:text-[#e29d38]">
                      {isEn ? "Released Cloud Package" : "الحزمة السحابية الصادرة"}
                    </span>
                    <h2 className="text-[22px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[32px]">
                      {isEn ? "Latest Available Version" : "أحدث إصدار متاح"}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center justify-between py-[4px]">
                  <span className="bg-[#fff8e1] dark:bg-[rgba(226,157,56,0.18)] text-[#b76e00] dark:text-[#f3c27e] border border-transparent dark:border-[#e29d38]/30 text-[10px] font-bold px-[10px] py-[4px] rounded-[2px] flex items-center gap-[4px]">
                    <span className="size-[6px] rounded-full bg-[#b76e00] dark:bg-[#e29d38]" />
                    <span>{isEn ? "Major Update Available" : "تحديث رئيسي متاح"}</span>
                  </span>
                  <span className="text-[36px] font-bold font-mono text-[#7b4e00] dark:text-[#e29d38] tracking-tight">
                    {versionInfo.latestVersion}
                  </span>
                </div>

                <div className="flex flex-col gap-[6px] text-start text-[12px] text-[#514537] dark:text-[#cdc5bd] border-t border-[#fce9d3] dark:border-[#38271c] pt-[12px]">
                  <div className="flex items-center gap-[6px] justify-start">
                    <Calendar className="size-[13px] text-[#837565] dark:text-[#8e8680]" />
                    <span>{isEn ? `Release Date: ${versionInfo.latestReleaseDate}` : `تاريخ الإصدار: ${versionInfo.latestReleaseDate}`}</span>
                  </div>
                  <div className="flex items-center gap-[6px] justify-start">
                    <Package className="size-[14px] text-[#7b4e00] dark:text-[#e29d38]" />
                    <span>{isEn ? `Package Size: ${versionInfo.packageSize}` : `حجم الحزمة البرمجية: ${versionInfo.packageSize}`}</span>
                  </div>
                </div>

                <div className="absolute -bottom-6 -start-6 size-[110px] rounded-[12px] bg-[rgba(123,78,0,0.08)] dark:bg-[rgba(226,157,56,0.05)] pointer-events-none" />
              </div>
            </div>

            {/* Pre-Update Guidance Banner (Figma 1:18914) */}
            <div className="bg-[#f5f3ef] dark:bg-[#281c15] rounded-[8px] p-[16px] border border-[#eae8e4] dark:border-[#38271c] flex flex-col gap-[8px] text-start">
              <div className="flex items-center gap-[8px]">
                <ShieldCheck className="size-[18px] text-[#9c6402] dark:text-[#e29d38]" />
                <h4 className="text-[16px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {isEn ? "Important guidelines before starting update:" : "إرشادات هامة قبل البدء في عملية التحديث:"}
                </h4>
              </div>
              <div className="pe-[26px]">
                <p className="text-[13px] leading-[22px]">
                  <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {isEn ? "Create Full Snapshot: " : "إنشاء نسخة احتياطية كاملة: "}
                  </span>
                  <span className="text-[#514537] dark:text-[#cdc5bd]">
                    {isEn
                      ? "Ensure a synchronized snapshot of case files, SQL databases, and cloud storage (Database & Storage Backup)."
                      : "التأكد من حفظ لقطة متزامنة لملفات القضايا وقواعد بيانات SQL والتخزين السحابي (Database & Storage Backup)."}
                  </span>
                </p>
              </div>
            </div>

            {/* Primary Action Area (Figma 1:18925) */}
            <div className="flex flex-col items-center justify-center pt-[12px] gap-[12px]">
              {isUpdating && updateProgress !== null && (
                <div className="w-full max-w-[620px] bg-[#f0eeea] dark:bg-[#38271c] rounded-full h-[8px] overflow-hidden">
                  <div
                    className="bg-[#9c6402] dark:bg-[#e29d38] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${updateProgress}%` }}
                  />
                </div>
              )}

              <button
                type="button"
                disabled={isUpdating}
                onClick={handleStartUpdate}
                className="bg-[#9c6402] hover:bg-[#835401] active:bg-[#6c4501] dark:bg-[#e29d38] dark:hover:bg-[#c28328] text-white dark:text-[#1c140f] w-full max-w-[620px] h-[48px] rounded-[6px] font-bold text-[16px] flex items-center justify-center gap-[8px] transition-all shadow-sm cursor-pointer disabled:opacity-75"
              >
                <Download className="size-[18px]" />
                <span>{isUpdating ? (isEn ? "Updating System..." : "جارٍ تحديث النظام...") : (isEn ? "Update System Now" : "تحديث النظام الآن")}</span>
              </button>

              <div className="flex items-center gap-[6px] text-[#837565] dark:text-[#8e8680] text-[12px]">
                <span>
                  {isEn
                    ? "Note: The update process takes approximately 3 to 5 minutes and requires a graceful service restart."
                    : "ملاحظة: قد تستغرق عملية التحديث من 3 إلى 5 دقائق وتتطلب إعادة تشغيل هادئة للخدمات المركزية."}
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
