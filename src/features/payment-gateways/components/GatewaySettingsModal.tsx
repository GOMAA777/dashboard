"use client";

import React, { useState } from "react";
import { Coins, X, Copy, Eye, EyeOff, Lock, Send } from "lucide-react";
import { toast } from "sonner";
import { PaymentGatewayItem } from "../types/payment-gateways.types";
import { useLanguage } from "@/lib/i18n";

interface GatewaySettingsModalProps {
  gateway: PaymentGatewayItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (gatewayId: string, clientId: string, clientSecret: string) => void;
}

function GatewaySettingsDialogBody({
  gateway,
  onClose,
  onSave,
}: {
  gateway: PaymentGatewayItem;
  onClose: () => void;
  onSave: (gatewayId: string, clientId: string, clientSecret: string) => void;
}) {
  const { t, isEn, direction } = useLanguage();
  const [clientId, setClientId] = useState(gateway.clientId);
  const [clientSecret, setClientSecret] = useState(gateway.clientSecret);
  const [showSecret, setShowSecret] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(
      isEn ? `${label} copied to clipboard` : `تم نسخ ${label} بنجاح إلى الحافظة`
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(gateway.id, clientId, clientSecret);
    toast.success(
      isEn
        ? `Settings for "${gateway.name}" updated successfully!`
        : `تم تحديث إعدادات بوابة "${gateway.name}" بنجاح!`
    );
    onClose();
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
          {/* Title and Icon on Start */}
          <div className="flex items-center gap-3">
            <div className="bg-[rgba(255,221,182,0.5)] rounded-[4px] size-9 flex items-center justify-center shrink-0">
              <Coins className="size-[18.3px] text-[#9c6403]" />
            </div>
            <h2 className="text-[#1b1c1a] text-[22px] font-bold leading-[22.5px]">
              {t("إعدادات البوابة", "Gateway Settings")}
            </h2>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-[4px] flex items-center justify-center text-[#514537] hover:bg-[#f0eeea] transition-colors cursor-pointer shrink-0"
            aria-label={t("إغلاق النافذة", "Close window")}
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Subtle Separator */}
        <div className="h-px bg-[#eae8e4] w-full" />

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-8 space-y-6">
          {/* Field 1: Client ID */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1 text-start">
                <span className="text-[#ba1a1a] text-[14px] font-bold">*</span>
                <span className="text-[#1b1c1a] text-[14px] font-semibold">
                  {t("معرّف العميل (Client ID)", "Client ID")}
                </span>
              </div>
              <span className="text-[#837565] text-[10px] font-bold">
                {gateway.developerAppLabel}
              </span>
            </div>

            <div className="relative flex items-center w-full">
              <input
                type="text"
                dir="ltr"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                required
                className="w-full bg-white border border-[#eae8e4] rounded-[4px] ps-16 pe-3.5 py-2.5 font-mono text-[12px] tracking-tight text-[#1b1c1a] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] focus:ring-1 focus:ring-[#9c6403] focus:border-[#9c6403] outline-none text-left"
              />
              <button
                type="button"
                onClick={() => handleCopy(clientId, t("معرّف العميل", "Client ID"))}
                className="absolute start-2 top-2 bg-[#f0eeea] hover:bg-[#eae8e4] text-[#514537] text-[10px] font-bold px-2 py-1 rounded-[2px] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>{t("نسخ", "Copy")}</span>
                <Copy className="size-3" />
              </button>
            </div>

            <p className="text-[#514537] text-[12px] leading-[18px] text-start font-normal">
              {t(
                `مفتاح الوصول العام الصادر من لوحة تحكم ${gateway.name} REST API.`,
                `Public access key issued from ${gateway.name} REST API console.`
              )}
            </p>
          </div>

          {/* Field 2: Client Secret */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1 text-start">
                <span className="text-[#ba1a1a] text-[14px] font-bold">*</span>
                <span className="text-[#1b1c1a] text-[14px] font-semibold">
                  {t("المفتاح السري (Client Secret)", "Client Secret")}
                </span>
              </div>
              <span className="text-[#837565] text-[10px] font-bold">
                {t("مشفّر وآمن", "Encrypted & Secure")}
              </span>
            </div>

            <div className="relative flex items-center w-full">
              <input
                type={showSecret ? "text" : "password"}
                dir="ltr"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                required
                className="w-full bg-white border border-[#eae8e4] rounded-[4px] ps-24 pe-3.5 py-2.5 font-mono text-[12px] tracking-tight text-[#1b1c1a] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] focus:ring-1 focus:ring-[#9c6403] focus:border-[#9c6403] outline-none text-left"
              />
              <div className="flex items-center gap-1 absolute start-2 top-2">
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="size-6 flex items-center justify-center text-[#514537] hover:bg-[#eae8e4] rounded-[2px] transition-colors cursor-pointer"
                  title={showSecret ? t("إخفاء المفتاح", "Hide key") : t("إظهار المفتاح", "Show key")}
                >
                  {showSecret ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(clientSecret, t("المفتاح السري", "Client Secret"))}
                  className="bg-[#f0eeea] hover:bg-[#eae8e4] text-[#514537] text-[10px] font-bold px-2 py-1 rounded-[2px] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>{t("نسخ", "Copy")}</span>
                  <Copy className="size-3" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-start gap-1.5 text-start pt-0.5">
              <Lock className="size-3 shrink-0 text-[#9c6403]" />
              <span className="text-[#514537] text-[10px] font-bold">
                {t(
                  "يتم حفظ المفتاح مشفراً وفق معايير الحماية البنكية الفيدرالية AES-256.",
                  "Key is securely stored using federal banking encryption standard AES-256."
                )}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-[#eae8e4] pt-6 flex items-center justify-end gap-2 -mx-8 -mb-2 px-8">
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
              <span>{t("حفظ الاعدادات", "Save Settings")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function GatewaySettingsModal({
  gateway,
  isOpen,
  onClose,
  onSave,
}: GatewaySettingsModalProps) {
  if (!isOpen || !gateway) return null;

  return (
    <GatewaySettingsDialogBody
      key={gateway.id}
      gateway={gateway}
      onClose={onClose}
      onSave={onSave}
    />
  );
}