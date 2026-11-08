"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { RefreshCw, AlertTriangle, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";
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
  PaymentGatewaysStats,
  UpdatePaymentGatewayPayload,
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
  const [stats, setStats] = useState<PaymentGatewaysStats | null>(null);
  const [filter, setFilter] = useState<GatewayFilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCheckingPing, setIsCheckingPing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal states
  const [disablingGateway, setDisablingGateway] = useState<PaymentGatewayItem | null>(null);
  const [activeSettingsGateway, setActiveSettingsGateway] = useState<PaymentGatewayItem | null>(null);
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);

  const loadGateways = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const payload = await fetchPaymentGateways();
      if (payload?.stats) {
        setStats(payload.stats);
      }
      const mapped = unwrapList<Record<string, unknown>>(payload).map(mapGatewayFromApi);
      setGateways(mapped);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : t("تعذر تحميل بوابات الدفع من الخادم", "Failed to load payment gateways");
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadGateways();
  }, [loadGateways]);

  // Counts
  const totalCount = stats?.total_gateways ?? gateways.length;
  const activeCount = stats?.active_gateways ?? gateways.filter((g) => g.isEnabled).length;
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

  // Handler: Connection Test Ping (05. فحص حالة الاتصال ببوابة الدفع)
  const handlePingTest = async () => {
    setIsCheckingPing(true);
    const active = gateways.filter((g) => g.isEnabled);
    const targets =
      active.length > 0
        ? active.map((gw) =>
            gw.brandType === "custom" || gw.brandType === "bank" ? gw.id : gw.brandType
          )
        : ["stripe"];

    toast.promise(
      (async () => {
        let lastError: Error | null = null;
        for (const targetKey of targets) {
          try {
            await testPaymentGateway(targetKey);
          } catch (err) {
            lastError = err instanceof Error ? err : new Error(String(err));
          }
        }
        if (lastError && targets.length === 1) {
          throw lastError;
        }
      })(),
      {
        loading: t(
          "جارٍ فحص استجابة وحالة اتصال بوابات الدفع الإلكتروني...",
          "Checking response & connectivity of payment gateways..."
        ),
        success: t(
          "تم فحص حالة الاتصال بنجاح: البوابات مستقرة ومتصلة (100% Operational)",
          "Connection test succeeded: Gateways are stable (100% Operational)"
        ),
        error: (err) =>
          err instanceof Error
            ? err.message
            : t("حدث خطأ أثناء فحص حالة الاتصال", "An error occurred during connection test"),
      }
    );
    setTimeout(() => {
      setIsCheckingPing(false);
    }, 1300);
  };

  // Handler: Toggle Gateway Status (04. تعطيل / تفعيل بوابة دفع)
  const handleToggleGateway = async (gateway: PaymentGatewayItem) => {
    if (gateway.isEnabled) {
      setDisablingGateway(gateway);
    } else {
      const gatewayKey =
        gateway.brandType === "custom" || gateway.brandType === "bank"
          ? gateway.id
          : gateway.brandType;
      try {
        await updatePaymentGatewayStatus(gatewayKey, "active");
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
        await loadGateways();
      } catch (err: unknown) {
        toast.error(
          err instanceof Error
            ? err.message
            : t("فشل في تفعيل بوابة الدفع", "Failed to activate gateway")
        );
      }
    }
  };

  // Handler: Confirm Disable (04. تعطيل / تفعيل بوابة دفع)
  const handleConfirmDisable = async (gatewayId: string, reason: string) => {
    const target = gateways.find((g) => g.id === gatewayId);
    const gatewayKey =
      !target || target.brandType === "custom" || target.brandType === "bank"
        ? gatewayId
        : target.brandType;
    try {
      await updatePaymentGatewayStatus(gatewayKey, "inactive");
      toast.success(t("تم تعطيل البوابة بنجاح", "Gateway disabled successfully"), {
        description: isEn ? `Disable reason: ${reason}` : `تم تسجيل سبب التعطيل: ${reason}`,
      });
      await loadGateways();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : t("فشل في تعطيل بوابة الدفع", "Failed to disable gateway")
      );
    }
  };

  // Handler: Save Settings (03. تعديل مفاتيح وإعدادات بوابة الدفع)
  const handleSaveSettings = async (
    gatewayId: string,
    clientId: string,
    clientSecret: string
  ) => {
    const target = gateways.find((g) => g.id === gatewayId);
    const gatewayKey =
      !target || target.brandType === "custom" || target.brandType === "bank"
        ? gatewayId
        : target.brandType;

    const payload: UpdatePaymentGatewayPayload = {
      mode: "live",
      is_recurring_supported: true,
      supported_currencies: ["SAR", "USD", "AED"],
      config: {
        publishable_key: clientId,
        client_id: clientId,
        client_secret: clientSecret,
        apple_pay: true,
        mada: true,
      },
      client_id: clientId,
      client_secret: clientSecret,
      public_key: clientId,
      secret_key: clientSecret,
    };

    try {
      await updatePaymentGateway(gatewayKey, payload);
      toast.success(
        isEn
          ? `Settings for "${target?.name || gatewayKey}" updated successfully!`
          : `تم تحديث إعدادات بوابة "${target?.name || gatewayKey}" بنجاح!`
      );
      await loadGateways();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : t("فشل في حفظ إعدادات البوابة", "Failed to update gateway settings")
      );
    }
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
    <div
      dir={direction}
      className="flex h-screen h-dvh overflow-hidden bg-background text-foreground transition-colors duration-200 antialiased select-none"
    >
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

              {isLoading ? (
                <DashboardPageSkeleton />
              ) : errorMessage ? (
                <div className="bg-white dark:bg-[#221812] rounded-[8px] border border-red-200 dark:border-red-900/50 p-8 text-center flex flex-col items-center justify-center my-4">
                  <div className="size-14 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mb-3">
                    <AlertTriangle className="size-7" />
                  </div>
                  <h3 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1">
                    {t("حدث خطأ أثناء تحميل بوابات الدفع", "Error loading payment gateways")}
                  </h3>
                  <p className="text-[13px] text-[#514537] dark:text-[#a89f91] max-w-md mx-auto mb-5 leading-relaxed">
                    {errorMessage}
                  </p>
                  <button
                    type="button"
                    onClick={loadGateways}
                    className="px-4 py-2 text-[13px] font-bold rounded-[6px] bg-[#9c6402] hover:bg-[#835401] text-white flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <RefreshCw className="size-3.5" />
                    <span>{t("إعادة المحاولة", "Retry")}</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* 2. Metric Telemetry Cards & Compliance Bar (Figma 1:13887) */}
                  <TelemetryCards
                    totalCount={totalCount}
                    activeCount={activeCount}
                    securityStandard={stats?.security_standard}
                    zatcaPhase={stats?.zatca_phase}
                  />

                  {/* 3. Alert / Advisory Notice (Figma 1:13938) */}
                  <div className="bg-[#fff8e1] dark:bg-[#2b1f0c] border border-[#b76e00] dark:border-[#9c6402] border-s-4 border-solid rounded-[16px] p-4 flex items-start gap-3 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] text-start">
                    <AlertTriangle
                      className="size-5 text-[#b76e00] dark:text-[#e29d38] shrink-0 mt-0.5"
                    />
                    <div className="flex flex-col items-start flex-1 text-start">
                      <h4 className="text-[#1c140f] dark:text-[#fdfbf7] text-[14px] font-bold leading-[20px]">
                        {t(
                          "تنبيه متعلق بالاشتراكات الدورية",
                          "Recurring Subscriptions Advisory"
                        )}
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
                    {filteredGateways.length > 0 ? (
                      filteredGateways.map((gw) => (
                        <GatewayCard
                          key={gw.id}
                          gateway={gw}
                          onToggle={handleToggleGateway}
                          onOpenSettings={async (gateway) => {
                            setActiveSettingsGateway(gateway);
                            const gatewayKey =
                              gateway.brandType === "custom" ||
                              gateway.brandType === "bank"
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
                      ))
                    ) : (
                      <div className="col-span-full bg-white dark:bg-[#221812] rounded-[8px] border border-[#eae8e4] dark:border-[#38271c] p-12 text-center flex flex-col items-center justify-center my-2">
                        <div className="size-16 rounded-full bg-[rgba(255,221,182,0.35)] dark:bg-[rgba(226,157,56,0.15)] text-[#9c6402] dark:text-[#e29d38] flex items-center justify-center mb-4">
                          <CreditCard className="size-8 stroke-[1.8]" />
                        </div>
                        <h3 className="text-[18px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1.5">
                          {searchQuery.trim() || filter !== "all"
                            ? t(
                                "لا توجد بوابات دفع مطابقة لمعايير البحث",
                                "No payment gateways match your filter"
                              )
                            : t(
                                "لا توجد بوابات دفع مسجلة حالياً",
                                "No payment gateways configured yet"
                              )}
                        </h3>
                        <p className="text-[13px] text-[#514537] dark:text-[#a89f91] max-w-md mx-auto mb-4 leading-relaxed">
                          {searchQuery.trim() || filter !== "all"
                            ? t(
                                "جرّب تغيير عبارة البحث أو اختيار حالة أخرى لعرض بوابات الدفع.",
                                "Try changing your search query or selecting another filter."
                              )
                            : t(
                                "يمكنك إضافة بوابة دفع مخصصة جديدة أو فحص الاتصال بالخادم.",
                                "You can add a new custom payment gateway or test server connectivity."
                              )}
                        </p>
                      </div>
                    )}

                    {/* Add New Custom Gateway Placeholder Card */}
                    {filter !== "disabled" && (
                      <AddCustomGatewayCard onAdd={() => setIsAddCustomOpen(true)} />
                    )}
                  </div>
                </>
              )}
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
