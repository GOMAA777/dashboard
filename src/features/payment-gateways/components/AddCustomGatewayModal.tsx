"use client";

import React, { useState } from "react";
import { Coins, X, Send } from "lucide-react";
import { toast } from "sonner";
import { PaymentGatewayItem } from "../types/payment-gateways.types";
import { useLanguage } from "@/lib/i18n";

interface AddCustomGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newGateway: PaymentGatewayItem) => void;
}

export function AddCustomGatewayModal({
  isOpen,
  onClose,
  onAdd,
}: AddCustomGatewayModalProps) {
  const { t, isEn, direction } = useLanguage();
  const [name, setName] = useState("");
  const [providerSubtitle, setProviderSubtitle] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [baseCurrency, setBaseCurrency] = useState("SAR");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newGw: PaymentGatewayItem = {
      id: `gw-custom-${Date.now()}`,
      code: `gw_${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}_custom`,
      name: name.trim(),
      providerSubtitle: providerSubtitle.trim() || (isEn ? "Custom local payment gateway" : "بوابة دفع مخصصة ومحلية"),
      badgeLabel: "Local",
      badgeBg: "#f0eeea",
      badgeText: "#514537",
      brandType: "custom",
      isEnabled: true,
      statusText: isEn ? "Active & Connected" : "نشط ومتصل مباشر",
      description: isEn
        ? `Custom integrated payment gateway for processing subscription fees via ${name.trim()}.`
        : `بوابة مخصصة ومدمجة لمعالجة عمليات الدفع والاشتراكات عبر ${name.trim()}.`,
      metaItems: [
        {
          label: t("الربط التقني:", "Technical Integration:"),
          value: "Webhooks & REST API",
          isSuccess: true,
          hasDot: true,
        },
        {
          label: t("العملة الأساسية:", "Base Currency:"),
          value: baseCurrency,
        },
      ],
      clientId: clientId.trim() || `pk_custom_${Date.now()}`,
      clientSecret: clientSecret.trim() || `sk_custom_${Date.now()}`,
      developerAppLabel: isEn ? `${name.trim()} Dashboard` : `لوحة تحكم ${name.trim()}`,
      providerLegalName: `${name.trim()} Provider • ${isEn ? "Custom Gateway" : "بوابة مخصصة"}`,
      activeSubscriptionsCount: 0,
      baseCurrency: `${baseCurrency} (${isEn ? "Billing Currency" : "عملة التحصيل"})`,
    };

    onAdd(newGw);
    toast.success(
      isEn
        ? `Payment gateway "${name}" added successfully!`
        : `تمت إضافة بوابة الدفع "${name}" بنجاح!`
    );
    onClose();
    setName("");
    setProviderSubtitle("");
    setClientId("");
    setClientSecret("");
  };

  return (
    <div
      dir={direction}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-[512px] bg-white rounded-[8px] overflow-hidden shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col animate-in zoom-in-95 duration-150 text-start"
      >
        {/* Header */}
        <div className="bg-white flex items-center justify-between pb-4 pt-6 px-8 w-full">
          <div className="flex items-center gap-3">
            <div className="bg-[rgba(255,221,182,0.5)] rounded-[4px] size-9 flex items-center justify-center shrink-0">
              <Coins className="size-[18.3px] text-[#9c6403]" />
            </div>
            <h2 className="text-[#1b1c1a] text-[22px] font-bold leading-[22.5px]">
              {t("إضافة بوابة مخصصة", "Add Custom Gateway")}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-[4px] flex items-center justify-center text-[#514537] hover:bg-[#f0eeea] transition-colors cursor-pointer shrink-0"
            aria-label={t("إغلاق النافذة", "Close window")}
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="h-px bg-[#eae8e4] w-full" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[#1b1c1a] text-sm font-semibold">
              {t("اسم البوابة أو المحفظة", "Gateway or Wallet Name")} <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder={t("مثال: Urpay أو STC Pay أو Moyasar", "e.g. Urpay, STC Pay, or Moyasar")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-[#eae8e4] rounded-[4px] px-3.5 py-2.5 text-xs text-[#1b1c1a] shadow-xs focus:ring-1 focus:ring-[#9c6403] focus:border-[#9c6403] outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[#1b1c1a] text-sm font-semibold">
              {t("وصف مختصر للخدمة", "Short Service Description")}
            </label>
            <input
              type="text"
              placeholder={t("مثال: محفظة رقمية للمدفوعات السريعة", "e.g. Digital wallet for fast payments")}
              value={providerSubtitle}
              onChange={(e) => setProviderSubtitle(e.target.value)}
              className="w-full bg-white border border-[#eae8e4] rounded-[4px] px-3.5 py-2.5 text-xs text-[#1b1c1a] shadow-xs focus:ring-1 focus:ring-[#9c6403] focus:border-[#9c6403] outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[#1b1c1a] text-sm font-semibold">
              {t("معرّف العميل (Client ID / Merchant Key)", "Client ID / Merchant Key")}
            </label>
            <input
              type="text"
              dir="ltr"
              placeholder="pk_live_..."
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full bg-white border border-[#eae8e4] rounded-[4px] px-3.5 py-2.5 text-xs font-mono text-[#1b1c1a] shadow-xs focus:ring-1 focus:ring-[#9c6403] focus:border-[#9c6403] outline-none text-left"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[#1b1c1a] text-sm font-semibold">
              {t("المفتاح السري (Client Secret)", "Client Secret")}
            </label>
            <input
              type="password"
              dir="ltr"
              placeholder="sk_live_..."
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              className="w-full bg-white border border-[#eae8e4] rounded-[4px] px-3.5 py-2.5 text-xs font-mono text-[#1b1c1a] shadow-xs focus:ring-1 focus:ring-[#9c6403] focus:border-[#9c6403] outline-none text-left"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[#1b1c1a] text-sm font-semibold">
              {t("عملة التحصيل", "Collection Currency")}
            </label>
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="w-full bg-white border border-[#eae8e4] rounded-[4px] px-3.5 py-2.5 text-xs text-[#1b1c1a] shadow-xs focus:ring-1 focus:ring-[#9c6403] focus:border-[#9c6403] outline-none"
            >
              <option value="SAR">{t("SAR (ريال سعودي)", "SAR (Saudi Riyal)")}</option>
              <option value="USD">{t("USD (دولار أمريكي)", "USD (US Dollar)")}</option>
              <option value="AED">{t("AED (درهم إماراتي)", "AED (UAE Dirham)")}</option>
            </select>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-[#eae8e4] pt-6 flex items-center justify-end gap-2 -mx-8 -mb-4 px-8">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#f0eeea] hover:bg-[#e4e1dc] text-[#1b1c1a] text-xs font-semibold rounded-[4px] h-10 px-4 flex items-center justify-center transition-colors cursor-pointer"
            >
              {t("إلغاء", "Cancel")}
            </button>
            <button
              type="submit"
              className="bg-[#9c6403] hover:bg-[#835402] text-[#fff3e9] text-xs font-bold rounded-[4px] h-10 px-6 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="size-3.5" />
              <span>{t("إضافة وتفعيل", "Add & Activate")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}