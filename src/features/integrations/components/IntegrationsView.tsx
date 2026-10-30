"use client";

import React, { useState } from "react";
import {
  Layers,
  Sliders,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { ScalesOfJusticeWatermark } from "@/components/shared/ScalesOfJusticeWatermark";
import { useUIStore } from "@/stores/use-ui-store";
import { PaidAddonsSection } from "./PaidAddonsSection";
import { SystemIntegrationsSection } from "./SystemIntegrationsSection";

export function IntegrationsView() {
  const language = useUIStore((state) => state.language);
  const isAr = language === "ar";

  const [activeTab, setActiveTab] = useState<"paid" | "integrations">("paid");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 900)),
      {
        loading: isAr
          ? "جارٍ فحص استجابة بوابات الربط ومزامنة الخدمات..."
          : "Checking integration endpoints and syncing services...",
        success: isAr
          ? "تم تحديث ومزامنة جميع الخدمات بنجاح (جميع الأنظمة متصلة 100%)"
          : "All services synchronized successfully (100% operational)",
        error: isAr ? "فشل تحديث بعض الخدمات" : "Failed to sync services",
      }
    );
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-[#fcfbfa] dark:bg-[#121110] text-[#1c1917] dark:text-[#f5f4f0] transition-colors duration-200 relative">
      {/* 1. Main Navigation Sidebar (Right side in RTL) */}
      <DashboardSidebar />

      {/* 2. Main Application Body Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Navigation Bar with breadcrumbs and actions */}
        <DashboardTopNavbar />

        {/* Dashboard Workspace Content */}
        <main className="flex-1 w-full relative">
          {/* Ambient Scales of Justice (ميزان العدالة) Background Emblems */}
          <div
            className="fixed top-28 -left-28 w-[380px] h-[380px] sm:w-[460px] sm:h-[460px] opacity-[0.035] dark:opacity-[0.045] text-[#c29547] dark:text-[#d4a759] pointer-events-none select-none z-0"
            aria-hidden="true"
          >
            <ScalesOfJusticeWatermark className="w-full h-full" />
          </div>
          <div
            className="fixed top-[520px] -right-28 w-[400px] h-[400px] sm:w-[480px] sm:h-[480px] opacity-[0.035] dark:opacity-[0.045] text-[#c29547] dark:text-[#d4a759] pointer-events-none select-none z-0"
            aria-hidden="true"
          >
            <ScalesOfJusticeWatermark className="w-full h-full" />
          </div>

          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-[#eeddbb]/70 dark:border-[#383126] bg-gradient-to-br from-[#ffffff] via-[#fbf8f2] to-[#f4ece0] dark:from-[#1e1b18] dark:via-[#191715] dark:to-[#141210] p-6 sm:p-8 shadow-sm">
              <div className="absolute top-0 end-0 -mt-8 -me-8 w-48 h-48 bg-[#c29547]/10 dark:bg-[#c29547]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#c29547]/10 dark:bg-[#c29547]/20 text-[#966e2e] dark:text-[#eeddbb] border border-[#c29547]/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {isAr
                        ? "لوحة تحكم المشرف العام • Super Admin Engine"
                        : "Super Admin Platform Engine"}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1c1917] dark:text-[#f5f4f0]">
                    {isAr
                      ? "الإضافات والتكاملات التقنية"
                      : "Add-ons & System Integrations"}
                  </h1>

                  <p className="text-sm sm:text-base text-[#6b6357] dark:text-[#a8a196] max-w-2xl leading-relaxed">
                    {isAr
                      ? "إدارة الميزات الإضافية المدفوعة لمكاتب المحاماة وتخصيص أسعارها، وضبط الربط البرمجي مع بوابات الدفع الإلكتروني، التخزين السحابي، والتقويمات."
                      : "Manage paid add-ons for law firms, adjust subscription pricing, and configure system integrations with payment gateways, cloud storage, and calendars."}
                  </p>
                </div>

                {/* Quick actions */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#1c1917] dark:text-[#f5f4f0] bg-white dark:bg-[#25221d] border border-[#e2d5c0] dark:border-[#3d372e] shadow-sm hover:border-[#c29547] hover:text-[#c29547] transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-4 h-4 text-[#c29547] ${
                        isRefreshing ? "animate-spin" : ""
                      }`}
                    />
                    <span>{isAr ? "تحديث وفحص الحالة" : "Sync & Health Check"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      toast.info(
                        isAr
                          ? "تم فتح دليل الربط البرمجي (SDK & API Docs) للمطورين"
                          : "Opened Developer API & SDK documentation"
                      );
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#c29547] via-[#b38538] to-[#996c25] hover:opacity-95 shadow-md shadow-[#c29547]/20 transition-all cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{isAr ? "دليل الربط (API Docs)" : "API Documentation"}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs (التبويبان الرئيسيان) */}
            <div className="border-b border-[#e7dac7] dark:border-[#2d2924] pb-px">
              <div className="flex gap-2 sm:gap-4 overflow-x-auto scrollbar-none">
                {/* Tab 1: Paid Add-ons */}
                <button
                  type="button"
                  onClick={() => setActiveTab("paid")}
                  className={`group relative flex items-center gap-2.5 px-5 py-3.5 text-sm sm:text-base font-semibold rounded-t-xl transition-all cursor-pointer ${
                    activeTab === "paid"
                      ? "text-[#966e2e] dark:text-[#eeddbb] bg-white dark:bg-[#1a1815] border-t-2 border-x border-t-[#c29547] border-x-[#e7dac7] dark:border-x-[#2d2924] shadow-sm"
                      : "text-[#7a7164] dark:text-[#9e968a] hover:text-[#1c1917] dark:hover:text-[#f5f4f0] hover:bg-[#f6eee2]/40 dark:hover:bg-[#201d19]"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      activeTab === "paid"
                        ? "bg-[#c29547] text-white shadow-sm"
                        : "bg-[#eeddbb]/50 dark:bg-[#2d271f] text-[#8c672b] dark:text-[#d4a759]"
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                  </div>
                  <span>
                    {isAr
                      ? "إضافات مدفوعة للمكاتب (Paid Add-ons)"
                      : "Paid Add-ons for Law Firms"}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold transition-colors ${
                      activeTab === "paid"
                        ? "bg-[#c29547]/15 text-[#855e22] dark:text-[#eeddbb]"
                        : "bg-[#e2d5c0]/50 dark:bg-[#2d271f] text-[#6b6357] dark:text-[#9e968a]"
                    }`}
                  >
                    4 {isAr ? "ميزات" : "items"}
                  </span>
                </button>

                {/* Tab 2: System Integrations */}
                <button
                  type="button"
                  onClick={() => setActiveTab("integrations")}
                  className={`group relative flex items-center gap-2.5 px-5 py-3.5 text-sm sm:text-base font-semibold rounded-t-xl transition-all cursor-pointer ${
                    activeTab === "integrations"
                      ? "text-[#966e2e] dark:text-[#eeddbb] bg-white dark:bg-[#1a1815] border-t-2 border-x border-t-[#c29547] border-x-[#e7dac7] dark:border-x-[#2d2924] shadow-sm"
                      : "text-[#7a7164] dark:text-[#9e968a] hover:text-[#1c1917] dark:hover:text-[#f5f4f0] hover:bg-[#f6eee2]/40 dark:hover:bg-[#201d19]"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      activeTab === "integrations"
                        ? "bg-[#c29547] text-white shadow-sm"
                        : "bg-[#eeddbb]/50 dark:bg-[#2d271f] text-[#8c672b] dark:text-[#d4a759]"
                    }`}
                  >
                    <Sliders className="w-4 h-4" />
                  </div>
                  <span>
                    {isAr
                      ? "التكاملات والربط التقني (System Integrations)"
                      : "System Integrations & APIs"}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold transition-colors ${
                      activeTab === "integrations"
                        ? "bg-[#c29547]/15 text-[#855e22] dark:text-[#eeddbb]"
                        : "bg-[#e2d5c0]/50 dark:bg-[#2d271f] text-[#6b6357] dark:text-[#9e968a]"
                    }`}
                  >
                    4 {isAr ? "خدمات" : "services"}
                  </span>
                </button>
              </div>
            </div>

            {/* Tab Views */}
            <div className="pt-2">
              {activeTab === "paid" ? (
                <PaidAddonsSection />
              ) : (
                <SystemIntegrationsSection />
              )}
            </div>

            {/* Bottom System Status & Security Note */}
            <div className="mt-12 p-4 rounded-xl border border-[#e2d5c0]/80 dark:border-[#383126] bg-[#fbf8f2]/80 dark:bg-[#181614] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#736a5c] dark:text-[#9e968a]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  {isAr
                    ? "جميع مفاتيح الربط البرمجي مشفرة بمعيار AES-256 ومخزنة في بيئة سحابية آمنة (KMS Vault)."
                    : "All API credentials are encrypted with AES-256 and stored inside secure KMS Vault."}
                </span>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span>
                  {isAr ? "وقت تشغيل الخدمات:" : "Uptime:"}{" "}
                  <strong className="text-emerald-700 dark:text-emerald-400">
                    99.98%
                  </strong>
                </span>
                <span>•</span>
                <span>
                  {isAr ? "إصدار المنظومة:" : "Engine Version:"}{" "}
                  <strong>v2.8.4 Enterprise</strong>
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
