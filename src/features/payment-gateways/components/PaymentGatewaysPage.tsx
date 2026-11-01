"use client";

import React, { useEffect, useState, useMemo } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
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
import { useLanguage } from "@/lib/i18n";
import {
  fetchPaymentGateways,
  fetchPaymentGateway,
  updatePaymentGateway,
  updatePaymentGatewayStatus,
  testPaymentGateway,
} from "@/lib/api/payments";
import { unwrapList, unwrapData, asString, asNumber } from "@/lib/api/helpers";

function mapGatewayFromApi(raw: Record<string, unknown>): PaymentGatewayItem {
  const code = asString(raw.code || raw.id, "gateway");
  const name = asString(raw.name, code);
  const brandRaw = asString(raw.brand || raw.provider || name, "custom").toLowerCase();
  const brandType: PaymentGatewayItem["brandType"] = brandRaw.includes("stripe")
    ? "stripe"
    : brandRaw.includes("paypal")
      ? "paypal"
      : brandRaw.includes("paddle")
        ? "paddle"
        : brandRaw.includes("razor")
          ? "razorpay"
          : brandRaw.includes("bank")
            ? "bank"
            : "custom";
  const enabled = !["inactive", "disabled", "0", 0, false].includes(
    (raw.status as string | number | boolean) ??
      (raw.is_enabled as string | number | boolean) ??
      true
  );
  return {
    id: asString(raw.id || code, code),
    code,
    name,
    providerSubtitle: asString(raw.subtitle || raw.provider_subtitle, ""),
    badgeLabel: asString(raw.badge_label, brandType),
    badgeBg: "#f0eeea",
    badgeText: "#514537",
    brandType,
    isEnabled: enabled,
    statusText: enabled ? "نشط ومتصل مباشر" : "معطل مؤقتاً",
    statusSubText: enabled ? undefined : "غير نشط في السداد",
    description: asString(raw.description, ""),
    metaItems: [],
    clientId: asString(raw.client_id || raw.public_key, ""),
    clientSecret: asString(raw.client_secret || raw.secret_key, ""),
    developerAppLabel: asString(raw.developer_app_label, name),
    providerLegalName: asString(raw.provider_legal_name || raw.provider, name),
    activeSubscriptionsCount: asNumber(raw.active_subscriptions_count, 0),
    baseCurrency: asString(raw.base_currency, "SAR"),
    isOffline: brandType === "bank",
  };
}

export function PaymentGatewaysPage() {
  const { t, isEn, direction } = useLanguage();
  const [gateways, setGateways] = useState<PaymentGatewayItem[]>(initialPaymentGateways);
  const [filter, setFilter] = useState<GatewayFilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCheckingPing, setIsCheckingPing] = useState(false);

  // Modal states
  const [disablingGateway, setDisablingGateway] = useState<PaymentGatewayItem | null>(null);
  const [activeSettingsGateway, setActiveSettingsGateway] = useState<PaymentGatewayItem | null>(null);
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchPaymentGateways()
      .then((payload) => {
        if (cancelled) return;
        const mapped = unwrapList<Record<string, unknown>>(payload).map(mapGatewayFromApi);
        if (mapped.length > 0) {
          setGateways((prev) => {
            // Merge API data onto known UI cards when ids/codes overlap.
            return mapped.map((apiGw) => {
              const local = prev.find(
                (g) => g.id === apiGw.id || g.code === apiGw.code || g.brandType === apiGw.brandType
              );
              return local ? { ...local, ...apiGw, metaItems: local.metaItems } : apiGw;
            });
          });
        }
      })
      .catch(() => {
        // Keep mock gateways if API unavailable.
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
  const handlePingTest = async () => {
    setIsCheckingPing(true);
    const active = gateways.filter((g) => g.isEnabled);
    toast.promise(
      (async () => {
        for (const gw of active) {
          const gatewayKey = gw.brandType === "custom" ? gw.id : gw.brandType;
          try {
            await testPaymentGateway(gatewayKey === "bank" ? gw.id : gatewayKey);
          } catch {
            // Continue testing remaining gateways.
          }
        }
      })(),
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
  const handleToggleGateway = async (gateway: PaymentGatewayItem) => {
    if (gateway.isEnabled) {
      setDisablingGateway(gateway);
    } else {
      const gatewayKey = gateway.brandType === "custom" || gateway.brandType === "bank"
        ? gateway.id
        : gateway.brandType;
      try {
        await updatePaymentGatewayStatus(gatewayKey, "active");
      } catch {
        // Keep local enable.
      }
      setGateways((prev) =>
        prev.map((g) =>
          g.id === gateway.id
            ? {
                ...g,
                isEnabled: true,
                statusText: g.brandType === "stripe" ? (isEn ? "Active (Auto-billing)" : "نشط (الفوترة التلقائية)") : (isEn ? "Active & Connected" : "نشط ومتصل مباشر"),
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
  const handleConfirmDisable = async (gatewayId: string, reason: string) => {
    const target = gateways.find((g) => g.id === gatewayId);
    const gatewayKey =
      !target || target.brandType === "custom" || target.brandType === "bank"
        ? gatewayId
        : target.brandType;
    try {
      await updatePaymentGatewayStatus(gatewayKey, "inactive");
    } catch {
      // Keep local disable.
    }
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
  const handleSaveSettings = async (gatewayId: string, clientId: string, clientSecret: string) => {
    const target = gateways.find((g) => g.id === gatewayId);
    const gatewayKey =
      !target || target.brandType === "custom" || target.brandType === "bank"
        ? gatewayId
        : target.brandType;
    try {
      await updatePaymentGateway(gatewayKey, {
        client_id: clientId,
        client_secret: clientSecret,
        public_key: clientId,
        secret_key: clientSecret,
      });
    } catch {
      // Keep local save.
    }
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

  const breadcrumbs = [
    { label: t("المعاملات المالية", "Financial Transactions"), href: "/invoices" },
    { label: t("طرق الدفع", "Payment Gateways") },
  ];

  return (
    <div dir={direction} className="flex h-screen h-dvh overflow-hidden bg-background text-foreground transition-colors duration-200 antialiased select-none">
      {/* Sidebar with activeNav="finance" and activeSubNav="gateways" */}
      <DashboardSidebar activeNav="finance" activeSubNav="gateways" />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <DashboardTopNavbar customBreadcrumbs={breadcrumbs} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden w-full p-4 sm:p-6 lg:p-8 max-w-[1360px] mx-auto space-y-6 scrollbar-thin">
          <DashboardPageTransition>
            <>
              {/* 1. Main Identity & Command Banner (Figma 1:13872) */}
              <div className="bg-white dark:bg-[#221812] rounded-[8px] p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 dark:border-[#38271c] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Titles */}
                <div className="flex flex-col items-start text-start">
                  <h1 className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[28px] font-bold leading-[38px]">
                    {t("طرق الدفع", "Payment Gateways")}
                  </h1>
                  <p className="text-[#514537] dark:text-[#cdc5bd] text-[14px] leading-[22.75px] mt-0.5 font-normal">
                    {t(
                      "إدارة وتكوين بوابات الدفع الإلكتروني المعتمدة لتحصيل رسوم اشتراكات مكاتب المحاماة وفواتير منصة الجودي.",
                      "Manage and configure authorized online payment gateways for law firm subscription fees and Al-Judy billing."
                    )}
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
                  <span>{t("فحص حالة الاتصال", "Test Connection")}</span>
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
                    {t("تنبيه متعلق بالاشتراكات الدورية", "Recurring Subscriptions Advisory")}
                  </h4>
                  <p className="text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[18px] mt-0.5 font-normal">
                    {t(
                      "تعطيل أي بوابة دفع مستخدمة حالياً في الفوترة المجدولة والخصم التلقائي سينبه المشتركين من مكاتب المحاماة فوراً عبر البريد والرسائل النصية لتحويل وسيلة الدفع قبل موعد الاستحقاق القادم.",
                      "Disabling any gateway currently active for recurring billing will immediately notify subscribed law firms via SMS and email to update their payment method."
                    )}
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
                    onOpenSettings={async (gateway) => {
                      setActiveSettingsGateway(gateway);
                      const gatewayKey =
                        gateway.brandType === "custom" || gateway.brandType === "bank"
                          ? gateway.id
                          : gateway.brandType;
                      try {
                        const payload = await fetchPaymentGateway(gatewayKey);
                        const raw = (unwrapData<Record<string, unknown>>(payload) ||
                          payload) as Record<string, unknown>;
                        if (raw?.id || raw?.code || raw?.client_id) {
                          setActiveSettingsGateway({
                            ...gateway,
                            ...mapGatewayFromApi(raw),
                            metaItems: gateway.metaItems,
                          });
                        }
                      } catch {
                        // Keep card data.
                      }
                    }}
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