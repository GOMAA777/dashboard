"use client";

import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
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

  return (
    <div className="flex min-h-screen bg-[#f5f3ef] text-[#1c140f] antialiased select-none" dir="rtl">
      {/* Sidebar with activeNav="finance" */}
      <DashboardSidebar activeNav="finance" />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <DashboardTopNavbar />

        {/* Main Content Area matching Figma 1:13869 */}
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-[1360px] mx-auto space-y-6">
          {/* 1. Main Identity & Command Banner (Figma 1:13872) */}
          <div className="bg-white rounded-[8px] p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Right Titles in RTL */}
            <div className="flex flex-col items-start text-start">
              <h1 className="text-[#1b1c1a] text-[28px] font-bold leading-[38px]">
                طرق الدفع
              </h1>
              <p className="text-[#514537] text-[14px] leading-[22.75px] mt-0.5 font-normal">
                إدارة وتكوين بوابات الدفع الإلكتروني المعتمدة لتحصيل رسوم اشتراكات مكاتب المحاماة وفواتير منصة الجودي.
              </p>
            </div>

            {/* Left Button in RTL */}
            <button
              type="button"
              onClick={handlePingTest}
              disabled={isCheckingPing}
              className="bg-[#9c6402] hover:bg-[#855401] active:scale-[0.98] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] text-white text-[14px] font-semibold rounded-[4px] px-4 py-2 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-70 self-start sm:self-auto shrink-0"
            >
              <img
                alt=""
                className={`size-3 ${isCheckingPing ? "animate-spin" : ""}`}
                src="/figma/payment-gateways/refresh-icon.svg"
              />
              <span>فحص حالة الاتصال</span>
            </button>
          </div>

          {/* 2. Metric Telemetry Cards & Compliance Bar (Figma 1:13887) */}
          <TelemetryCards
            totalCount={totalCount}
            activeCount={activeCount}
          />

          {/* 3. Alert / Advisory Notice (Figma 1:13938) */}
          <div className="bg-[#fff8e1] border border-[#b76e00] border-s-4 border-solid rounded-[16px] p-4 flex items-start gap-3 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] text-start">
            <img
              alt=""
              className="w-[18.3px] h-[20.3px] shrink-0 mt-0.5"
              src="/figma/payment-gateways/alert-icon.svg"
            />
            <div className="flex flex-col items-start flex-1 text-start">
              <h4 className="text-[#1c140f] text-[14px] font-bold leading-[20px]">
                تنبيه متعلق بالاشتراكات الدورية
              </h4>
              <p className="text-[#514537] text-[12px] leading-[18px] mt-0.5 font-normal">
                تعطيل أي بوابة دفع مستخدمة حالياً في الفوترة المجدولة والخصم التلقائي سينبه المشتركين من مكاتب المحاماة فوراً عبر البريد والرسائل النصية لتحويل وسيلة الدفع قبل موعد الاستحقاق القادم.
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
