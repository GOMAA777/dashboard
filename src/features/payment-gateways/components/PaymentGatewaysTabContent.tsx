"use client";

import React, { useState, useMemo } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { PaymentGatewayItem, GatewayFilterStatus } from "../types/payment-gateways.types";
import { initialPaymentGateways } from "../data/payment-gateways.data";
import { TelemetryCards } from "./TelemetryCards";
import { GatewaysFilterBar } from "./GatewaysFilterBar";
import { GatewayCard } from "./GatewayCard";
import { AddCustomGatewayCard } from "./AddCustomGatewayCard";
import { DisableGatewayModal } from "./DisableGatewayModal";
import { GatewaySettingsModal } from "./GatewaySettingsModal";
import { AddCustomGatewayModal } from "./AddCustomGatewayModal";
import { useLanguage } from "@/lib/i18n";

export function PaymentGatewaysTabContent() {
  const { t, isEn } = useLanguage();
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
        loading: t(
          "جارٍ فحص استجابة وحالة اتصال جميع بوابات الدفع الإلكتروني...",
          "Checking response & connectivity of all payment gateways..."
        ),
        success: t(
          "تم فحص حالة الاتصال بنجاح: جميع البوابات النشطة مستقرة ومتصلة (100% Operational)",
          "Connection test succeeded: All active gateways are stable (100% Operational)"
        ),
        error: t("حدث خطأ أثناء فحص حالة الاتصال", "An error occurred during connection test"),
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
                statusText:
                  g.brandType === "stripe"
                    ? isEn
                      ? "Active (Auto-billing)"
                      : "نشط (الفوترة التلقائية)"
                    : isEn
                    ? "Active & Connected"
                    : "نشط ومتصل مباشر",
                statusSubText: undefined,
              }
            : g
        )
      );
      toast.success(
        isEn
          ? `Gateway "${gateway.name}" reactivated successfully!`
          : `تمت إعادة تفعيل بوابة "${gateway.name}" بنجاح!`,
        {
          description: t(
            "أصبحت البوابة متاحة الآن لخيارات السداد والاشتراكات الجديدة.",
            "The gateway is now available for new payments and subscriptions."
          ),
        }
      );
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
              statusText: isEn ? "Temporarily Disabled" : "معطل مؤقتاً",
              statusSubText: isEn ? "Inactive for billing" : "غير نشط في السداد",
            }
          : g
      )
    );
    toast.error(t("تم تعطيل البوابة بنجاح", "Gateway disabled successfully"), {
      description: isEn ? `Disable reason: ${reason}` : `تم تسجيل سبب التعطيل: ${reason}`,
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
    setActiveSettingsGateway(null);
    toast.success(
      isEn
        ? "Payment gateway configuration updated successfully"
        : "تم حفظ وتحديث إعدادات بوابة الدفع بنجاح"
    );
  };

  // Handler: Add Custom Gateway
  const handleAddCustomGateway = (newGateway: PaymentGatewayItem) => {
    setGateways((prev) => [...prev, newGateway]);
    setIsAddCustomOpen(false);
    toast.success(
      isEn
        ? `Custom gateway "${newGateway.name}" created successfully!`
        : `تمت إضافة بوابة الدفع المخصصة "${newGateway.name}" بنجاح!`
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Metric Telemetry Cards & Test Connection Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-[#221812] p-4 sm:p-5 rounded-[8px] border border-[#eae8e4] dark:border-[#38271c] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col text-start">
          <span className="text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
            {isEn ? "Payment Gateways & Processing Status" : "حالة بوابات الدفع والمعالجة البنكية"}
          </span>
          <span className="text-[12px] text-[#514537] dark:text-[#a89f91] mt-0.5">
            {isEn
              ? "All live gateways comply with Saudi Central Bank (SAMA) & PCI DSS Tier 1 security standards."
              : "كافة بوابات الدفع المعتمدة متوافقة مع اشتراطات البنك المركزي السعودي (ساما) ومعيار الأمان PCI DSS."}
          </span>
        </div>

        <button
          type="button"
          onClick={handlePingTest}
          disabled={isCheckingPing}
          className="bg-[#9c6402] hover:bg-[#855401] active:scale-[0.98] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] text-white text-[13px] font-semibold rounded-[6px] px-4 py-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-70 shrink-0 self-start sm:self-auto"
        >
          <RefreshCw className={`size-3.5 ${isCheckingPing ? "animate-spin" : ""}`} />
          <span>{isEn ? "Test Connectivity" : "فحص حالة الاتصال"}</span>
        </button>
      </div>

      {/* 2. Metric Telemetry Cards */}
      <TelemetryCards totalCount={totalCount} activeCount={activeCount} />

      {/* 3. Advisory Notice */}
      <div className="bg-[#fff8e1] dark:bg-[#2b1f0c] border border-[#b76e00] dark:border-[#9c6402] border-s-4 border-solid rounded-[8px] p-4 flex items-start gap-3 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] text-start">
        <AlertTriangle className="size-5 text-[#b76e00] dark:text-[#e29d38] shrink-0 mt-0.5" />
        <div className="flex flex-col items-start flex-1 text-start">
          <h4 className="text-[#1c140f] dark:text-[#fdfbf7] text-[13px] font-bold">
            {t("تنبيه متعلق بالاشتراكات الدورية", "Recurring Subscriptions Advisory")}
          </h4>
          <p className="text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-relaxed mt-0.5">
            {t(
              "تعطيل أي بوابة دفع مستخدمة حالياً في الفوترة المجدولة والخصم التلقائي سينبه المشتركين من مكاتب المحاماة فوراً عبر البريد والرسائل النصية لتحويل وسيلة الدفع قبل موعد الاستحقاق القادم.",
              "Disabling any gateway currently active for recurring billing will immediately notify subscribed law firms via SMS and email to update their payment method."
            )}
          </p>
        </div>
      </div>

      {/* 4. Filter & Search Toolbar */}
      <GatewaysFilterBar
        filter={filter}
        onFilterChange={setFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={totalCount}
        activeCount={activeCount}
        disabledCount={disabledCount}
      />

      {/* 5. Responsive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {filteredGateways.map((gw) => (
          <GatewayCard
            key={gw.id}
            gateway={gw}
            onToggle={handleToggleGateway}
            onOpenSettings={setActiveSettingsGateway}
          />
        ))}

        {filter !== "disabled" && (
          <AddCustomGatewayCard onAdd={() => setIsAddCustomOpen(true)} />
        )}
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
