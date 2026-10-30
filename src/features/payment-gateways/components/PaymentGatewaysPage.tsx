"use client";

import React, { useState, useMemo, useSyncExternalStore } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useUIStore } from "@/stores/use-ui-store";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { PaymentGatewayItem, GatewayFilterStatus } from "../types/payment-gateways.types";
import { initialPaymentGateways } from "../data/payment-gateways.data";
import { TelemetryCards } from "./TelemetryCards";
import { GatewaysFilterBar } from "./GatewaysFilterBar";
import { GatewayCard } from "./GatewayCard";
import { AddCustomGatewayCard } from "./AddCustomGatewayCard";
import { DisableGatewayModal } from "./DisableGatewayModal";
import { GatewaySettingsModal } from "./GatewaySettingsModal";
import { AddCustomGatewayModal } from "./AddCustomGatewayModal";

export function PaymentGatewaysPage() {
  const [gateways, setGateways] = useState<PaymentGatewayItem[]>(initialPaymentGateways);
  const [filter, setFilter] = useState<GatewayFilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCheckingPing, setIsCheckingPing] = useState(false);

  // Modal states
  const [disablingGateway, setDisablingGateway] = useState<PaymentGatewayItem | null>(null);
  const [activeSettingsGateway, setActiveSettingsGateway] = useState<PaymentGatewayItem | null>(null);
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);

  // Counts
  const totalCount = gateways.length;
  const activeCount = gateways.filter((g) => g.isEnabled).length;
  const disabledCount = gateways.filter((g) => !g.isEnabled).length;

  // Filtered gateways
  const filteredGateways = useMemo(() => {
    return gateways.filter((gw) => {
      // Status filter
      if (filter === "active" && !gw.isEnabled) return false;
      if (filter === "disabled" && gw.isEnabled) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = gw.name.toLowerCase().includes(query);
        const matchesSubtitle = gw.providerSubtitle.toLowerCase().includes(query);
        const matchesCode = gw.code.toLowerCase().includes(query);
        const matchesDesc = gw.description.toLowerCase().includes(query);
        return matchesName || matchesSubtitle || matchesCode || matchesDesc;
      }

      return true;
    });
  }, [gateways, filter, searchQuery]);

  // Handler: Connection Test Ping
  const handlePingTest = () => {
    setIsCheckingPing(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1200)),
      {
        loading: "جارٍ فحص استجابة وحالة اتصال جميع بوابات الدفع الإلكتروني...",
        success: "تم فحص حالة الاتصال بنجاح: جميع البوابات النشطة مستقرة ومتصلة (100% Operational)",
        error: "حدث خطأ أثناء فحص حالة الاتصال",
      }
    );
    setTimeout(() => {
      setIsCheckingPing(false);
    }, 1300);
  };

  // Handler: Toggle Gateway Status
  const handleToggleGateway = (gateway: PaymentGatewayItem) => {
    if (gateway.isEnabled) {
      setDisablingGateway(gateway);
    } else {
      setGateways((prev) =>
        prev.map((g) =>
          g.id === gateway.id
            ? {
                ...g,
                isEnabled: true,
                statusText: g.brandType === "stripe" ? "نشط (الفوترة التلقائية)" : "نشط ومتصل مباشر",
                statusSubText: undefined,
              }
            : g
        )
      );
      toast.success(`تمت إعادة تفعيل بوابة "${gateway.name}" بنجاح!`, {
        description: "أصبحت البوابة متاحة الآن لخيارات السداد والاشتراكات الجديدة.",
      });
    }
  };

  // Handler: Confirm Disable
  const handleConfirmDisable = (gatewayId: string, reason: string) => {
    setGateways((prev) =>
      prev.map((g) =>
        g.id === gatewayId
          ? {
              ...g,
              isEnabled: false,
              statusText: "معطل مؤقتاً",
              statusSubText: "غير نشط في السداد",
            }
          : g
      )
    );
    toast.error(`تم تعطيل البوابة بنجاح`, {
      description: `تم تسجيل سبب التعطيل: ${reason}`,
    });
  };

  // Handler: Save Settings
  const handleSaveSettings = (gatewayId: string, clientId: string, clientSecret: string) => {
    setGateways((prev) =>
      prev.map((g) =>
        g.id === gatewayId
          ? {
              ...g,
              clientId,
              clientSecret,
            }
          : g
      )
    );
  };

  // Handler: Add Custom Gateway
  const handleAddCustomGateway = (newGateway: PaymentGatewayItem) => {
    setGateways((prev) => [...prev, newGateway]);
  };

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const language = useUIStore((state) => state.language);
  const currentLang = isMounted ? language : "ar";

  const breadcrumbs = [
    { label: currentLang === "en" ? "Dashboard" : "الرئيسية", href: "/" },
    { label: currentLang === "en" ? "Financial Transactions" : "المعاملات المالية", href: "/payment-gateways" },
    { label: currentLang === "en" ? "Payment Gateways" : "طرق الدفع" },
  ];

  return (
    <div className="flex h-screen h-dvh overflow-hidden bg-background text-foreground transition-colors duration-200 antialiased select-none">
      {/* Sidebar with activeNav="finance" */}
      <DashboardSidebar activeNav="finance" />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <DashboardTopNavbar customBreadcrumbs={breadcrumbs} />

        {/* Main Content Area matching Figma 1:13869 */}
        <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-8 max-w-[1360px] mx-auto space-y-6 scrollbar-thin">
          <DashboardPageTransition>
            <>
              {/* 1. Main Identity & Command Banner (Figma 1:13872) */}
          <div className="bg-white dark:bg-[#221812] rounded-[8px] p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 dark:border-[#38271c] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Titles */}
            <div className="flex flex-col items-start text-start">
              <h1 className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[28px] font-bold leading-[38px]">
                {currentLang === "en" ? "Payment Gateways" : "طرق الدفع"}
              </h1>
              <p className="text-[#514537] dark:text-[#cdc5bd] text-[14px] leading-[22.75px] mt-0.5 font-normal">
                {currentLang === "en"
                  ? "Manage and configure authorized online payment gateways for law firm subscription fees and Al-Joudi billing."
                  : "إدارة وتكوين بوابات الدفع الإلكتروني المعتمدة لتحصيل رسوم اشتراكات مكاتب المحاماة وفواتير منصة الجودي."}
              </p>
            </div>

            {/* Test Connection Button */}
            <button
              type="button"
              onClick={handlePingTest}
              disabled={isCheckingPing}
              className="bg-[#9c6402] hover:bg-[#855401] active:scale-[0.98] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] text-white text-[14px] font-semibold rounded-[4px] px-4 py-2 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-70 self-start sm:self-auto shrink-0"
            >
              <RefreshCw
                className={`size-3.5 ${isCheckingPing ? "animate-spin" : ""}`}
              />
              <span>{currentLang === "en" ? "Test Connection" : "فحص حالة الاتصال"}</span>
            </button>
          </div>

          {/* 2. Metric Telemetry Cards & Compliance Bar (Figma 1:13887) */}
          <TelemetryCards
            totalCount={totalCount}
            activeCount={activeCount}
          />

          {/* 3. Alert / Advisory Notice (Figma 1:13938) */}
          <div className="bg-[#fff8e1] dark:bg-[#2b1f0c] border border-[#b76e00] dark:border-[#9c6402] border-s-4 border-solid rounded-[16px] p-4 flex items-start gap-3 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] text-start">
            <AlertTriangle
              className="size-5 text-[#b76e00] dark:text-[#e29d38] shrink-0 mt-0.5"
            />
            <div className="flex flex-col items-start flex-1 text-start">
              <h4 className="text-[#1c140f] dark:text-[#fdfbf7] text-[14px] font-bold leading-[20px]">
                {currentLang === "en" ? "Recurring Subscriptions Advisory" : "تنبيه متعلق بالاشتراكات الدورية"}
              </h4>
              <p className="text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[18px] mt-0.5 font-normal">
                {currentLang === "en"
                  ? "Disabling any gateway currently active for recurring billing will immediately notify subscribed law firms via SMS and email to update their payment method."
                  : "تعطيل أي بوابة دفع مستخدمة حالياً في الفوترة المجدولة والخصم التلقائي سينبه المشتركين من مكاتب المحاماة فوراً عبر البريد والرسائل النصية لتحويل وسيلة الدفع قبل موعد الاستحقاق القادم."}
              </p>
            </div>
          </div>

          {/* 4. Filter & Search Toolbar (Figma 1:13946) */}
          <GatewaysFilterBar
            filter={filter}
            onFilterChange={setFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalCount={totalCount}
            activeCount={activeCount}
            disabledCount={disabledCount}
          />

          {/* 5. Responsive Cards Grid (3 Columns) (Figma 1:13960) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredGateways.map((gw) => (
              <GatewayCard
                key={gw.id}
                gateway={gw}
                onToggle={handleToggleGateway}
                onOpenSettings={setActiveSettingsGateway}
              />
            ))}

            {/* Add New Custom Gateway Placeholder Card */}
            {filter !== "disabled" && (
              <AddCustomGatewayCard onAdd={() => setIsAddCustomOpen(true)} />
            )}
          </div>
            </>
          </DashboardPageTransition>
        </main>
      </div>

      {/* Disable Confirmation Modal */}
      <DisableGatewayModal
        gateway={disablingGateway}
        isOpen={Boolean(disablingGateway)}
        onClose={() => setDisablingGateway(null)}
        onConfirm={handleConfirmDisable}
      />

      {/* Gateway Settings Modal */}
      <GatewaySettingsModal
        gateway={activeSettingsGateway}
        isOpen={Boolean(activeSettingsGateway)}
        onClose={() => setActiveSettingsGateway(null)}
        onSave={handleSaveSettings}
      />

      {/* Add Custom Gateway Modal */}
      <AddCustomGatewayModal
        isOpen={isAddCustomOpen}
        onClose={() => setIsAddCustomOpen(false)}
        onAdd={handleAddCustomGateway}
      />
    </div>
  );
}
