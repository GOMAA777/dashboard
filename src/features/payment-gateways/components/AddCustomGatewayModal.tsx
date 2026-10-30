"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { PaymentGatewayItem } from "../types/payment-gateways.types";

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
      providerSubtitle: providerSubtitle.trim() || "بوابة دفع مخصصة ومحلية",
      badgeLabel: "Local",
      badgeBg: "#f0eeea",
      badgeText: "#514537",
      brandType: "custom",
      isEnabled: true,
      statusText: "نشط ومتصل مباشر",
      description: `بوابة مخصصة ومدمجة لمعالجة عمليات الدفع والاشتراكات عبر ${name.trim()}.`,
      metaItems: [
        {
          label: "الربط التقني:",
          value: "Webhooks & REST API",
          isSuccess: true,
          hasDot: true,
        },
        {
          label: "العملة الأساسية:",
          value: baseCurrency,
        },
      ],
      clientId: clientId.trim() || `pk_custom_${Date.now()}`,
      clientSecret: clientSecret.trim() || `sk_custom_${Date.now()}`,
      developerAppLabel: `لوحة تحكم ${name.trim()}`,
      providerLegalName: `${name.trim()} Provider • بوابة مخصصة`,
      activeSubscriptionsCount: 0,
      baseCurrency: `${baseCurrency} (عملة التحصيل)`,
    };

    onAdd(newGw);
    toast.success(`تمت إضافة بوابة الدفع "${name}" بنجاح!`);
    onClose();
    setName("");
    setProviderSubtitle("");
    setClientId("");
    setClientSecret("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-[512px] bg-white rounded-[8px] overflow-hidden shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col animate-in zoom-in-95 duration-150 text-right"
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-white flex items-center justify-between pb-4 pt-6 px-8 w-full">
          {/* Title and Icon on Start (Right in RTL) */}
          <div className="flex items-center gap-3">
            <div className="bg-[rgba(255,221,182,0.5)] rounded-[4px] size-9 flex items-center justify-center shrink-0">
              <img
                alt=""
                className="size-[18.3px]"
                src="/figma/payment-gateways/coin-icon.svg"
              />
            </div>
            <h2 className="text-[#1b1c1a] text-[22px] font-bold leading-[22.5px]">
              إضافة بوابة مخصصة
            </h2>
          </div>

          {/* Close button on End (Left in RTL) */}
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-[4px] flex items-center justify-center text-[#514537] hover:bg-[#f0eeea] transition-colors cursor-pointer shrink-0"
            aria-label="إغلاق النافذة"
          >
            <img
              alt="Close"
              className="size-[11.6px]"
              src="/figma/payment-gateways/modal-close.svg"
            />
          </button>
        </div>

        <div className="h-px bg-[#eae8e4] w-full" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[#1b1c1a] text-sm font-semibold">
              اسم البوابة أو المحفظة <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="مثال: Urpay أو STC Pay أو Moyasar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-[#eae8e4] rounded-[4px] px-3.5 py-2.5 text-xs text-[#1b1c1a] shadow-xs focus:ring-1 focus:ring-[#9c6403] focus:border-[#9c6403] outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[#1b1c1a] text-sm font-semibold">
              وصف مختصر للخدمة
            </label>
            <input
              type="text"
              placeholder="مثال: محفظة رقمية للمدفوعات السريعة"
              value={providerSubtitle}
              onChange={(e) => setProviderSubtitle(e.target.value)}
              className="w-full bg-white border border-[#eae8e4] rounded-[4px] px-3.5 py-2.5 text-xs text-[#1b1c1a] shadow-xs focus:ring-1 focus:ring-[#9c6403] focus:border-[#9c6403] outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[#1b1c1a] text-sm font-semibold">
              معرّف العميل (Client ID / Merchant Key)
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
              المفتاح السري (Client Secret)
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
              عملة التحصيل
            </label>
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="w-full bg-white border border-[#eae8e4] rounded-[4px] px-3.5 py-2.5 text-xs text-[#1b1c1a] shadow-xs focus:ring-1 focus:ring-[#9c6403] focus:border-[#9c6403] outline-none"
            >
              <option value="SAR">SAR (ريال سعودي)</option>
              <option value="USD">USD (دولار أمريكي)</option>
              <option value="AED">AED (درهم إماراتي)</option>
            </select>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-[#eae8e4] pt-6 flex items-center justify-start gap-2 -mx-8 -mb-4 px-8">
            <button
              type="submit"
              className="bg-[#9c6403] hover:bg-[#835402] text-[#fff3e9] text-xs font-bold rounded-[4px] h-10 px-6 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>إضافة وتفعيل</span>
              <img
                alt=""
                className="w-[14px] h-[12px]"
                src="/figma/payment-gateways/send-icon.svg"
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-[#f0eeea] hover:bg-[#e4e1dc] text-[#1b1c1a] text-xs font-semibold rounded-[4px] h-10 px-4 flex items-center justify-center transition-colors cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
