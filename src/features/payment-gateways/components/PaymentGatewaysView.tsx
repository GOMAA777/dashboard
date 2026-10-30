"use client";

import React, { useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  Key,
  Copy,
  Eye,
  EyeOff,
  Check,
  X,
  Zap,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { ScalesOfJusticeWatermark } from "@/components/shared/ScalesOfJusticeWatermark";
import { useUIStore } from "@/stores/use-ui-store";

export interface PaymentGateway {
  id: string;
  name: string;
  nameEn: string;
  category: "cards" | "wallets" | "bnpl" | "bank";
  description: string;
  feePercentage: number;
  fixedFee: number;
  isEnabled: boolean;
  environment: "live" | "sandbox";
  merchantId: string;
  publicKey: string;
  secretKey: string;
  webhookSecret: string;
  webhookUrl: string;
  status: "connected" | "degraded" | "disconnected";
  supportedCurrencies: string[];
  latencyMs: number;
}

const initialGateways: PaymentGateway[] = [
  {
    id: "gw-mada",
    name: "شبكة مدى للمدفوعات (Mada)",
    nameEn: "Mada Debit Cards Network",
    category: "cards",
    description: "البوابة الوطنية للمدفوعات السعودية لبطاقات الخصم المباشر البنكية.",
    feePercentage: 1.0,
    fixedFee: 1.0,
    isEnabled: true,
    environment: "live",
    merchantId: "MID_MADA_9921048",
    publicKey: "pk_live_mada_8293749281740192",
    secretKey: "sk_live_mada_9918274635241098734",
    webhookSecret: "whsec_mada_live_38291048",
    webhookUrl: "https://api.aljoody-law.sa/webhooks/mada",
    status: "connected",
    supportedCurrencies: ["SAR"],
    latencyMs: 124,
  },
  {
    id: "gw-visa-mastercard",
    name: "فيزا وماستركارد (Visa / Mastercard)",
    nameEn: "Visa & Mastercard International",
    category: "cards",
    description: "معالجة البطاقات الائتمانية العالمية الصادرة محلياً ودولياً.",
    feePercentage: 2.5,
    fixedFee: 1.0,
    isEnabled: true,
    environment: "live",
    merchantId: "MID_VISA_8849201",
    publicKey: "pk_live_vm_7392018471928491",
    secretKey: "sk_live_vm_8830192847192847193",
    webhookSecret: "whsec_vm_live_99281047",
    webhookUrl: "https://api.aljoody-law.sa/webhooks/cards",
    status: "connected",
    supportedCurrencies: ["SAR", "USD", "AED"],
    latencyMs: 148,
  },
  {
    id: "gw-apple-pay",
    name: "آبل باي (Apple Pay)",
    nameEn: "Apple Pay Instant Checkout",
    category: "wallets",
    description: "سداد فوري بنقرة واحدة عبر أجهزة iPhone و Mac وساعة آبل.",
    feePercentage: 1.8,
    fixedFee: 1.0,
    isEnabled: true,
    environment: "live",
    merchantId: "merchant.sa.aljoody.applepay",
    publicKey: "pk_live_ap_1928374650192847",
    secretKey: "sk_live_ap_9920184756201948572",
    webhookSecret: "whsec_ap_live_77281940",
    webhookUrl: "https://api.aljoody-law.sa/webhooks/applepay",
    status: "connected",
    supportedCurrencies: ["SAR", "USD"],
    latencyMs: 98,
  },
  {
    id: "gw-sadad",
    name: "نظام سداد للمدفوعات (SADAD Payment)",
    nameEn: "SADAD Bills & Direct Debit",
    category: "bank",
    description: "توليد رقم فاتورة سداد للتحصيل المباشر عبر الحسابات البنكية للمكاتب.",
    feePercentage: 1.5,
    fixedFee: 0.0,
    isEnabled: true,
    environment: "live",
    merchantId: "SADAD_MERCHANT_4401",
    publicKey: "sadad_pk_live_661928472910",
    secretKey: "sadad_sk_live_88392018471928",
    webhookSecret: "whsec_sadad_live_5519284",
    webhookUrl: "https://api.aljoody-law.sa/webhooks/sadad",
    status: "connected",
    supportedCurrencies: ["SAR"],
    latencyMs: 180,
  },
  {
    id: "gw-tabby",
    name: "تابي - قسّمها على 4 دفعات (Tabby)",
    nameEn: "Tabby Buy Now Pay Later",
    category: "bnpl",
    description: "تقسيط رسوم الاشتراكات السنوية للمكاتب على 4 دفعات بدون فوائد.",
    feePercentage: 4.5,
    fixedFee: 1.5,
    isEnabled: true,
    environment: "sandbox",
    merchantId: "tabby_client_330192",
    publicKey: "pk_test_tabby_482910482910",
    secretKey: "sk_test_tabby_992810482910",
    webhookSecret: "whsec_tabby_test_881920",
    webhookUrl: "https://api.aljoody-law.sa/webhooks/tabby",
    status: "connected",
    supportedCurrencies: ["SAR", "AED"],
    latencyMs: 210,
  },
  {
    id: "gw-tamara",
    name: "تمارا - الدفع الآجل والتقسيط (Tamara)",
    nameEn: "Tamara Pay in Installments",
    category: "bnpl",
    description: "حلول الدفع بالتقسيط لتمكين مكاتب المحاماة من تمويل الاشتراكات السنوية.",
    feePercentage: 4.5,
    fixedFee: 1.5,
    isEnabled: false,
    environment: "sandbox",
    merchantId: "tamara_mid_771928",
    publicKey: "pk_test_tamara_1928374619",
    secretKey: "sk_test_tamara_8839201847",
    webhookSecret: "whsec_tamara_test_4410",
    webhookUrl: "https://api.aljoody-law.sa/webhooks/tamara",
    status: "disconnected",
    supportedCurrencies: ["SAR"],
    latencyMs: 0,
  },
];

export function PaymentGatewaysView() {
  const { language } = useUIStore();
  const isAr = language === "ar";

  const [gateways, setGateways] = useState<PaymentGateway[]>(initialGateways);
  const [testingGatewayId, setTestingGatewayId] = useState<string | null>(null);

  // Edit / Config Modal
  const [activeConfigGateway, setActiveConfigGateway] = useState<PaymentGateway | null>(null);
  const [modalEnv, setModalEnv] = useState<"live" | "sandbox">("live");
  const [modalMerchantId, setModalMerchantId] = useState("");
  const [modalPublicKey, setModalPublicKey] = useState("");
  const [modalSecretKey, setModalSecretKey] = useState("");
  const [modalWebhookSecret, setModalWebhookSecret] = useState("");
  const [showSecretKey, setShowSecretKey] = useState(false);

  // KPIs
  const totalGatewaysCount = gateways.length;
  const activeGatewaysCount = gateways.filter((g) => g.isEnabled).length;
  const liveGatewaysCount = gateways.filter((g) => g.isEnabled && g.environment === "live").length;
  const sandboxGatewaysCount = gateways.filter((g) => g.isEnabled && g.environment === "sandbox").length;

  // Toggle Live/Disabled Switch
  const handleToggleGateway = (gatewayId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    setGateways((prev) =>
      prev.map((g) => (g.id === gatewayId ? { ...g, isEnabled: nextStatus } : g))
    );
    const gw = gateways.find((g) => g.id === gatewayId);
    toast.success(
      nextStatus ? "تم تفعيل بوابة الدفع بنجاح" : "تم تعطيل بوابة الدفع مؤقتاً",
      {
        description: `${gw?.name} - سيتم ${nextStatus ? "إتاحتها" : "إخفاؤها"} في صفحة السداد`,
      }
    );
  };

  // Toggle Live/Sandbox Quick Toggle
  const handleToggleEnvironment = (gatewayId: string, currentEnv: "live" | "sandbox") => {
    const nextEnv = currentEnv === "live" ? "sandbox" : "live";
    setGateways((prev) =>
      prev.map((g) => (g.id === gatewayId ? { ...g, environment: nextEnv } : g))
    );
    const gw = gateways.find((g) => g.id === gatewayId);
    toast.info(
      nextEnv === "live"
        ? "تم تحويل البوابة إلى وضع الإنتاج الحي (Live Mode)"
        : "تم تحويل البوابة إلى الوضع التجريبي (Sandbox / Test Mode)",
      {
        description: `${gw?.name}`,
      }
    );
  };

  // Ping API Test
  const handleTestPing = (gateway: PaymentGateway) => {
    setTestingGatewayId(gateway.id);
    setTimeout(() => {
      setTestingGatewayId(null);
      const simulatedLatency = Math.floor(90 + Math.random() * 80);
      setGateways((prev) =>
        prev.map((g) =>
          g.id === gateway.id
            ? { ...g, status: "connected", latencyMs: simulatedLatency }
            : g
        )
      );
      toast.success(
        isAr ? "تم الاتصال بنجاح مع بوابة الدفع (Ping OK)" : "Gateway ping successful",
        {
          description: `${gateway.name} | زمن الاستجابة: ${simulatedLatency}ms | الحالة: 200 OK`,
        }
      );
    }, 1200);
  };

  // Open Config Modal
  const handleOpenConfigModal = (gateway: PaymentGateway) => {
    setActiveConfigGateway(gateway);
    setModalEnv(gateway.environment);
    setModalMerchantId(gateway.merchantId);
    setModalPublicKey(gateway.publicKey);
    setModalSecretKey(gateway.secretKey);
    setModalWebhookSecret(gateway.webhookSecret);
    setShowSecretKey(false);
  };

  // Save Modal
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConfigGateway) return;

    setGateways((prev) =>
      prev.map((g) =>
        g.id === activeConfigGateway.id
          ? {
              ...g,
              environment: modalEnv,
              merchantId: modalMerchantId,
              publicKey: modalPublicKey,
              secretKey: modalSecretKey,
              webhookSecret: modalWebhookSecret,
            }
          : g
      )
    );

    toast.success(
      isAr ? "تم حفظ إعدادات ومفاتيح الربط بنجاح" : "API credentials updated successfully",
      {
        description: `${activeConfigGateway.name} (${modalEnv === "live" ? "Live" : "Sandbox"})`,
      }
    );
    setActiveConfigGateway(null);
  };

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(isAr ? `تم نسخ ${label}` : `Copied ${label}`);
  };

  return (
    <div className="flex min-h-screen bg-[#fcfbfa] dark:bg-[#121110] text-[#1c1917] dark:text-[#f5f4f0] transition-colors duration-200 relative">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <DashboardTopNavbar />

        <main className="flex-1 w-full relative p-4 sm:p-6 lg:p-8">
          {/* Ambient Scales of Justice Emblems */}
          <div
            className="fixed top-28 -left-28 w-[380px] h-[380px] opacity-[0.035] dark:opacity-[0.045] text-[#c29547] pointer-events-none select-none z-0"
            aria-hidden="true"
          >
            <ScalesOfJusticeWatermark className="w-full h-full" />
          </div>

          <div
            className="fixed bottom-10 -right-28 w-[420px] h-[420px] opacity-[0.035] dark:opacity-[0.045] text-[#c29547] pointer-events-none select-none z-0"
            aria-hidden="true"
          >
            <ScalesOfJusticeWatermark className="w-full h-full" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto space-y-6 text-start">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#8c8279] dark:text-[#9e968a] mb-1">
                  <span>{isAr ? "الرئيسية" : "Dashboard"}</span>
                  <span>/</span>
                  <span>{isAr ? "المالية" : "Finance"}</span>
                  <span>/</span>
                  <span className="text-[#c29547] dark:text-[#d4a759]">
                    {isAr ? "بوابات الدفع الإلكتروني" : "Payment Gateways"}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2c2825] dark:text-[#f5f4f0] flex items-center gap-2.5">
                  <CreditCard className="w-7 h-7 text-[#c29547] dark:text-[#d4a759]" />
                  <span>{isAr ? "بوابات الدفع الإلكتروني والربط المالي" : "Payment Gateways & APIs"}</span>
                </h1>
                <p className="text-xs sm:text-sm text-[#736b63] dark:text-[#a8a196] mt-1 max-w-3xl">
                  {isAr
                    ? "إدارة قنوات التحصيل الإلكتروني (مدى، فيزا، ماستركارد، سداد، تابي، تمارا)، تبديل بيئة العمل (حي / تجريبي)، وتكوين مفاتيح الـ API وإشعارات الويب هوك."
                    : "Configure online payment providers, switch between Live and Sandbox environments, manage API keys, and monitor gateway health."}
                </p>
              </div>

              {/* Status Indicator */}
              <div className="p-2.5 rounded-2xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] flex items-center gap-2.5 shadow-2xs">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <div className="text-xs">
                  <p className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                    {isAr ? "النظام المالي جاهز للتحصيل" : "Payment Engine Ready"}
                  </p>
                  <p className="text-[10px] text-[#8c8279]">
                    {isAr ? "تشفير TLS 1.3 معتمد من ساما (SAMA)" : "PCI-DSS Level 1 Compliant"}
                  </p>
                </div>
              </div>
            </div>

            {/* Top 4 KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Gateways */}
              <div className="p-4 rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#8c8279] dark:text-[#9e968a]">
                    {isAr ? "إجمالي البوابات المتاحة" : "Available Gateways"}
                  </p>
                  <h3 className="text-2xl font-black text-[#2c2825] dark:text-[#f5f4f0] mt-1 font-mono">
                    {totalGatewaysCount}
                  </h3>
                  <p className="text-[11px] text-[#736b63] dark:text-[#a8a196] mt-0.5">
                    {isAr ? "قنوات السداد المحلية والدولية" : "Local & global methods"}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#fff7e6] dark:bg-[#2b2014] border border-[#eeddbb] dark:border-[#604218] flex items-center justify-center text-[#c29547]">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>

              {/* Active Gateways */}
              <div className="p-4 rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#8c8279] dark:text-[#9e968a]">
                    {isAr ? "البوابات المفعّلة حالياً" : "Enabled Gateways"}
                  </p>
                  <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                    {activeGatewaysCount}
                  </h3>
                  <p className="text-[11px] text-[#736b63] dark:text-[#a8a196] mt-0.5">
                    {isAr ? "تظهر للمكاتب في شاشة السداد" : "Active on checkout"}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              {/* Live Production Gateways */}
              <div className="p-4 rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#8c8279] dark:text-[#9e968a]">
                    {isAr ? "وضع الإنتاج الحي (Live)" : "Live Production"}
                  </p>
                  <h3 className="text-2xl font-black text-[#c29547] dark:text-[#d4a759] mt-1 font-mono">
                    {liveGatewaysCount}
                  </h3>
                  <p className="text-[11px] text-[#736b63] dark:text-[#a8a196] mt-0.5">
                    {isAr ? "تحصيل مالي فعلي وحسابات حقيقية" : "Real card processing"}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#fff7e6] dark:bg-[#2b2014] border border-[#eeddbb] dark:border-[#604218] flex items-center justify-center text-[#c29547]">
                  <Zap className="w-6 h-6" />
                </div>
              </div>

              {/* Sandbox Gateways */}
              <div className="p-4 rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#8c8279] dark:text-[#9e968a]">
                    {isAr ? "الوضع التجريبي (Sandbox)" : "Test / Sandbox"}
                  </p>
                  <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 font-mono">
                    {sandboxGatewaysCount}
                  </h3>
                  <p className="text-[11px] text-[#736b63] dark:text-[#a8a196] mt-0.5">
                    {isAr ? "بطاقات وهمية للاختبار والتدقيق" : "Mock payment testing"}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Activity className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Gateway Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gateways.map((gw) => {
                const isTesting = testingGatewayId === gw.id;

                return (
                  <div
                    key={gw.id}
                    className={`rounded-3xl bg-white dark:bg-[#1a1714] border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between ${
                      gw.isEnabled
                        ? "border-[#ded5c6] dark:border-[#2f2a24]"
                        : "border-[#ded5c6]/60 dark:border-[#2f2a24]/60 opacity-70 bg-[#faf5eb]/20"
                    }`}
                  >
                    {/* Card Top */}
                    <div className="p-6">
                      {/* Brand Header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-[#fff7e6] dark:bg-[#2b2014] border border-[#eeddbb] dark:border-[#604218] flex items-center justify-center text-[#c29547]">
                            <CreditCard className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-base font-extrabold text-[#2c2825] dark:text-[#f5f4f0]">
                              {gw.name}
                            </h3>
                            <p className="text-[11px] font-mono text-[#8c8279]">
                              {gw.nameEn}
                            </p>
                          </div>
                        </div>

                        {/* Live Toggle */}
                        <div className="flex flex-col items-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleToggleGateway(gw.id, gw.isEnabled)}
                            className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer relative ${
                              gw.isEnabled ? "bg-[#c29547]" : "bg-stone-300 dark:bg-stone-700"
                            }`}
                            title={gw.isEnabled ? "تعطيل البوابة" : "تفعيل البوابة"}
                          >
                            <div
                              className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                                gw.isEnabled ? (isAr ? "-translate-x-5" : "translate-x-5") : "translate-x-0"
                              }`}
                            />
                          </button>
                          <span className="text-[10px] font-bold text-[#8c8279]">
                            {gw.isEnabled ? (isAr ? "مفعّلة" : "Active") : (isAr ? "معطلة" : "Inactive")}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-[#736b63] dark:text-[#a8a196] leading-relaxed min-h-[36px]">
                        {gw.description}
                      </p>

                      {/* Status Badges & Environment */}
                      <div className="mt-4 pt-4 border-t border-[#ded5c6]/60 dark:border-[#2f2a24] space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#8c8279]">{isAr ? "بيئة العمل الحالية:" : "Environment:"}</span>
                          <button
                            type="button"
                            onClick={() => handleToggleEnvironment(gw.id, gw.environment)}
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                              gw.environment === "live"
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40"
                                : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40"
                            }`}
                            title={isAr ? "انقر للتبديل بين الحي والتجريبي" : "Click to toggle mode"}
                          >
                            {gw.environment === "live" ? (isAr ? "🟢 إنتاج حي (Live)" : "Live") : (isAr ? "🟡 تجريبي (Sandbox)" : "Sandbox")}
                          </button>
                        </div>

                        {/* Fee Rate */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#8c8279]">{isAr ? "رسوم وعمولة المعاملة:" : "Transaction Fee:"}</span>
                          <span className="font-mono font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                            {gw.feePercentage}% + {gw.fixedFee.toFixed(2)} ر.س
                          </span>
                        </div>

                        {/* API Latency */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#8c8279]">{isAr ? "حالة الربط والاتصال:" : "API Health:"}</span>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                gw.status === "connected" ? "bg-emerald-500" : "bg-stone-400"
                              }`}
                            />
                            <span className="font-mono text-[11px] text-[#8c8279]">
                              {gw.latencyMs > 0 ? `${gw.latencyMs}ms` : "-"}
                            </span>
                          </div>
                        </div>

                        {/* Merchant ID Preview */}
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-[#8c8279]">{isAr ? "معرف التاجر:" : "Merchant ID:"}</span>
                          <span className="text-[#2c2825] dark:text-[#f5f4f0] bg-[#faf5eb] dark:bg-[#201c17] px-2 py-0.5 rounded-lg border border-[#ded5c6]/60 dark:border-[#2f2a24] truncate max-w-[150px]">
                            {gw.merchantId}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-4 bg-[#fbf9f5] dark:bg-[#1a1714]/80 border-t border-[#ded5c6]/60 dark:border-[#2f2a24] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenConfigModal(gw)}
                        className="flex-1 py-2 px-3 rounded-xl bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] text-xs font-bold text-[#2c2825] dark:text-[#f5f4f0] hover:border-[#c29547] hover:text-[#c29547] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Key className="w-3.5 h-3.5 text-[#c29547]" />
                        <span>{isAr ? "إعدادات الربط والـ API" : "API Credentials"}</span>
                      </button>

                      <button
                        type="button"
                        disabled={isTesting}
                        onClick={() => handleTestPing(gw)}
                        className="p-2 rounded-xl bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] text-[#8c8279] hover:text-[#c29547] hover:border-[#c29547] transition-all cursor-pointer disabled:opacity-50"
                        title={isAr ? "اختبار الاتصال (Ping API)" : "Ping Gateway"}
                      >
                        <Zap className={`w-4 h-4 ${isTesting ? "animate-spin text-[#c29547]" : ""}`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* Modal: API Credentials & Webhook Settings */}
      {activeConfigGateway && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden text-start max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#ded5c6]/60 dark:border-[#2f2a24] bg-[#faf5eb] dark:bg-[#201c17]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#fff7e6] dark:bg-[#2b2014] border border-[#eeddbb] dark:border-[#604218] flex items-center justify-center text-[#c29547]">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#2c2825] dark:text-[#f5f4f0]">
                    {isAr ? `إعدادات الربط: ${activeConfigGateway.name}` : `Configure ${activeConfigGateway.name}`}
                  </h3>
                  <p className="text-xs text-[#8c8279]">
                    {isAr ? "مفاتيح الـ API، بيئة التشغيل، ورابط استلام إشعارات الدفع" : "API Keys & Webhook endpoints"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveConfigGateway(null)}
                className="p-1.5 rounded-full text-[#8c8279] hover:text-[#2c2825] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveConfig} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Environment Switcher */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                  {isAr ? "بيئة التشغيل المحددة (Environment Mode)" : "Environment Mode"}
                </label>
                <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-[#faf5eb] dark:bg-[#201c17] border border-[#ded5c6] dark:border-[#2f2a24]">
                  <button
                    type="button"
                    onClick={() => setModalEnv("live")}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      modalEnv === "live"
                        ? "bg-gradient-to-r from-[#d4a759] to-[#c29547] text-white shadow-xs"
                        : "text-[#8c8279] hover:text-[#2c2825]"
                    }`}
                  >
                    <span>🟢 {isAr ? "الإنتاج الحي (Live Mode)" : "Live Production"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalEnv("sandbox")}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      modalEnv === "sandbox"
                        ? "bg-amber-600 text-white shadow-xs"
                        : "text-[#8c8279] hover:text-[#2c2825]"
                    }`}
                  >
                    <span>🟡 {isAr ? "الوضع التجريبي (Sandbox / Test)" : "Sandbox / Test"}</span>
                  </button>
                </div>
              </div>

              {/* Merchant ID */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                  {isAr ? "معرف التاجر الرسمي (Merchant ID)" : "Merchant ID"} *
                </label>
                <input
                  type="text"
                  required
                  value={modalMerchantId}
                  onChange={(e) => setModalMerchantId(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl text-xs font-mono bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0]"
                />
              </div>

              {/* Public Key */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                  {isAr ? "المفتاح العام (Publishable Key / Public API Key)" : "Public Key"} *
                </label>
                <input
                  type="text"
                  required
                  value={modalPublicKey}
                  onChange={(e) => setModalPublicKey(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl text-xs font-mono bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0]"
                />
              </div>

              {/* Secret Key */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#2c2825] dark:text-[#f5f4f0] flex items-center justify-between">
                  <span>{isAr ? "المفتاح السري (Secret Key)" : "Secret Key"} *</span>
                  <button
                    type="button"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="text-[#c29547] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {showSecretKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showSecretKey ? (isAr ? "إخفاء" : "Hide") : (isAr ? "إظهار" : "Show")}</span>
                  </button>
                </label>
                <input
                  type={showSecretKey ? "text" : "password"}
                  required
                  value={modalSecretKey}
                  onChange={(e) => setModalSecretKey(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl text-xs font-mono bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0]"
                />
              </div>

              {/* Webhook Secret */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#2c2825] dark:text-[#f5f4f0]">
                  {isAr ? "مفتاح توقيع الإشعارات (Webhook Secret Signature)" : "Webhook Secret"}
                </label>
                <input
                  type="text"
                  value={modalWebhookSecret}
                  onChange={(e) => setModalWebhookSecret(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl text-xs font-mono bg-white dark:bg-[#201d1a] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] text-[#1c1917] dark:text-[#f5f4f0]"
                />
              </div>

              {/* Webhook Endpoint URL */}
              <div className="p-3.5 rounded-2xl bg-[#faf5eb] dark:bg-[#201c17] border border-[#ded5c6] dark:border-[#2f2a24] space-y-1">
                <label className="font-bold text-[#8c8279] text-[11px]">
                  {isAr ? "رابط استلام إشعارات السداد الآلية (Webhook URL)" : "Webhook Endpoint URL"}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={activeConfigGateway.webhookUrl}
                    className="flex-1 h-9 px-3 rounded-xl text-[11px] font-mono bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] text-[#2c2825] dark:text-[#f5f4f0]"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(activeConfigGateway.webhookUrl, "رابط الويب هوك")}
                    className="p-2 rounded-xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] text-[#8c8279] hover:text-[#c29547] cursor-pointer"
                    title={isAr ? "نسخ الرابط" : "Copy URL"}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-[#ded5c6]/60 dark:border-[#2f2a24] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveConfigGateway(null)}
                  className="px-4 py-2 rounded-xl border border-[#ded5c6] dark:border-[#2f2a24] text-xs font-bold text-[#736b63] cursor-pointer"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4a759] to-[#c29547] text-white text-xs font-bold hover:opacity-95 cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{isAr ? "حفظ التغييرات" : "Save Credentials"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
