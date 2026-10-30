"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { PaymentGatewayItem } from "../types/payment-gateways.types";

interface GatewaySettingsModalProps {
  gateway: PaymentGatewayItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (gatewayId: string, clientId: string, clientSecret: string) => void;
}

interface GatewaySettingsDialogBodyProps {
  gateway: PaymentGatewayItem;
  onClose: () => void;
  onSave: (gatewayId: string, clientId: string, clientSecret: string) => void;
}

function GatewaySettingsDialogBody({
  gateway,
  onClose,
  onSave,
}: GatewaySettingsDialogBodyProps) {
  const [clientId, setClientId] = useState(gateway.clientId || "");
  const [clientSecret, setClientSecret] = useState(gateway.clientSecret || "");
  const [showSecret, setShowSecret] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`تم نسخ ${label} إلى الحافظة بنجاح`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(gateway.id, clientId, clientSecret);
    toast.success("تم حفظ إعدادات البوابة ومفاتيح الربط بنجاح", {
      description: `${gateway.name} - تم تشفير وتأمين المفاتيح`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-[512px] bg-white rounded-[8px] overflow-hidden shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col animate-in zoom-in-95 duration-150 text-right"
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-white flex items-center justify-between pb-4 pt-6 px-8 w-full">
          {/* Close button on left */}
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

          {/* Title and Icon on right */}
          <div className="flex items-center gap-3">
            <h2 className="text-[#1b1c1a] text-[22px] font-bold leading-[22.5px]">
              إعدادات البوابة
            </h2>
            <div className="bg-[rgba(255,221,182,0.5)] rounded-[4px] size-9 flex items-center justify-center shrink-0">
              <img
                alt=""
                className="size-[18.3px]"
                src="/figma/payment-gateways/coin-icon.svg"
              />
            </div>
          </div>
        </div>

        {/* Subtle Hairline Separator */}
        <div className="h-px bg-[#eae8e4] w-full" />

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-8 space-y-6">
          {/* Field 1: Client ID */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1 text-right">
                <span className="text-[#ba1a1a] text-[14px] font-bold">*</span>
                <span className="text-[#1b1c1a] text-[14px] font-semibold">
                  معرّف العميل (Client ID)
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
                className="w-full bg-white border border-[#eae8e4] rounded-[4px] pl-20 pr-3.5 py-2.5 font-mono text-[12px] tracking-tight text-[#1b1c1a] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] focus:ring-1 focus:ring-[#9c6403] focus:border-[#9c6403] outline-none text-left"
              />
              <button
                type="button"
                onClick={() => handleCopy(clientId, "معرّف العميل")}
                className="bg-[#f0eeea] hover:bg-[#eae8e4] text-[#514537] text-[10px] font-bold px-2 py-1 rounded-[2px] flex items-center gap-1 transition-colors cursor-pointer absolute left-2 top-2"
              >
                <span>نسخ</span>
                <img
                  alt=""
                  className="w-[10px] h-[11.6px]"
                  src="/figma/payment-gateways/copy-icon.svg"
                />
              </button>
            </div>

            <p className="text-[#514537] text-[12px] leading-[18px] text-right font-normal">
              مفتاح الوصول العام الصادر من لوحة تحكم {gateway.name} REST API.
            </p>
          </div>

          {/* Field 2: Client Secret */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1 text-right">
                <span className="text-[#ba1a1a] text-[14px] font-bold">*</span>
                <span className="text-[#1b1c1a] text-[14px] font-semibold">
                  المفتاح السري (Client Secret)
                </span>
              </div>
              <span className="text-[#837565] text-[10px] font-bold">
                مشفّر وآمن
              </span>
            </div>

            <div className="relative flex items-center w-full">
              <input
                type={showSecret ? "text" : "password"}
                dir="ltr"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                required
                className="w-full bg-white border border-[#eae8e4] rounded-[4px] pl-24 pr-3.5 py-2.5 font-mono text-[12px] tracking-tight text-[#1b1c1a] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] focus:ring-1 focus:ring-[#9c6403] focus:border-[#9c6403] outline-none text-left"
              />
              <div className="flex items-center gap-1 absolute left-2 top-2">
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="size-6 flex items-center justify-center text-[#514537] hover:bg-[#eae8e4] rounded-[2px] transition-colors cursor-pointer"
                  title={showSecret ? "إخفاء المفتاح" : "إظهار المفتاح"}
                >
                  <img
                    alt=""
                    className="w-4 h-[11px]"
                    src="/figma/payment-gateways/eye-icon.svg"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(clientSecret, "المفتاح السري")}
                  className="bg-[#f0eeea] hover:bg-[#eae8e4] text-[#514537] text-[10px] font-bold px-2 py-1 rounded-[2px] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>نسخ</span>
                  <img
                    alt=""
                    className="w-[10px] h-[11.6px]"
                    src="/figma/payment-gateways/copy-icon.svg"
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-1.5 text-right pt-0.5">
              <span className="text-[#514537] text-[10px] font-bold">
                يتم حفظ المفتاح مشفراً وفق معايير الحماية البنكية الفيدرالية AES-256.
              </span>
              <img
                alt=""
                className="w-[9.3px] h-[12.2px] shrink-0"
                src="/figma/payment-gateways/lock-icon.svg"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-[#eae8e4] pt-6 flex items-center justify-start gap-2 -mx-8 -mb-2 px-8">
            <button
              type="submit"
              className="bg-[#9c6403] hover:bg-[#835402] text-[#fff3e9] text-xs font-bold rounded-[4px] h-10 px-6 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>حفظ الاعدادات</span>
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
