"use client";

import React from "react";
import { Settings, Repeat } from "lucide-react";
import {
  PaypalBrandIcon,
  StripeBrandIcon,
  PaddleBrandIcon,
  RazorpayBrandIcon,
  BankTransferBrandIcon,
  CustomGatewayBrandIcon,
} from "@/components/shared/BrandLogos";
import { PaymentGatewayItem } from "../types/payment-gateways.types";
import { useLanguage } from "@/lib/i18n";

interface GatewayCardProps {
  gateway: PaymentGatewayItem;
  onToggle: (gateway: PaymentGatewayItem) => void;
  onOpenSettings: (gateway: PaymentGatewayItem) => void;
}

export function GatewayCard({
  gateway,
  onToggle,
  onOpenSettings,
}: GatewayCardProps) {
  const { t, isEn } = useLanguage();
  const {
    name,
    providerSubtitle,
    badgeLabel,
    badgeBg,
    badgeText,
    brandType,
    isEnabled,
    statusText,
    statusSubText,
    description,
    metaItems,
  } = gateway;

  return (
    <div className="bg-white dark:bg-[#221812] rounded-[16px] p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] border border-[#eae8e4]/80 dark:border-[#38271c] flex flex-col justify-between h-full transition-all hover:shadow-md dark:hover:border-[#9c6402]/40">
      {/* Top Section */}
      <div className="flex flex-col gap-4">
        {/* Header: Brand Icon on Right, Toggle Switch on Left */}
        <div className="flex items-start justify-between w-full">
          {/* Brand Info on Start */}
          <div className="flex items-center gap-3">
            {/* Official Brand Badge */}
            {brandType === "bank" && (
              <div className="bg-[#fffbeb] border border-[#fef3c7] dark:bg-[#9c6402]/15 dark:border-[#9c6402]/30 rounded-[16px] size-14 flex items-center justify-center shrink-0">
                <BankTransferBrandIcon className="size-7" />
              </div>
            )}

            {brandType === "paypal" && (
              <div className="bg-[rgba(0,48,135,0.06)] border border-[#003087]/15 dark:bg-[rgba(0,121,193,0.15)] dark:border-[#0079c1]/30 rounded-[16px] size-14 flex items-center justify-center shrink-0">
                <PaypalBrandIcon className="size-8" />
              </div>
            )}

            {brandType === "stripe" && (
              <div className="bg-[rgba(99,91,255,0.08)] border border-[#635bff]/15 dark:bg-[rgba(99,91,255,0.15)] dark:border-[#635bff]/30 rounded-[16px] size-14 flex items-center justify-center shrink-0">
                <StripeBrandIcon className="size-9 rounded-md" />
              </div>
            )}

            {brandType === "paddle" && (
              <div className="bg-[rgba(13,31,45,0.05)] border border-[rgba(13,31,45,0.1)] dark:bg-white/10 dark:border-white/20 rounded-[16px] size-14 flex items-center justify-center shrink-0">
                <PaddleBrandIcon className="size-7" />
              </div>
            )}

            {brandType === "razorpay" && (
              <div className="bg-[rgba(12,35,64,0.06)] border border-[rgba(12,35,64,0.15)] dark:bg-[rgba(56,189,248,0.12)] dark:border-[#38bdf8]/35 rounded-[16px] size-14 flex items-center justify-center shrink-0 shadow-2xs">
                <RazorpayBrandIcon className="size-7" />
              </div>
            )}

            {brandType === "custom" && (
              <div className="bg-[#f0eeea] border border-[#ded5c6] dark:bg-[#281c15] dark:border-[#38271c] rounded-[16px] size-14 flex items-center justify-center shrink-0">
                <CustomGatewayBrandIcon className="size-7" />
              </div>
            )}

            <div className="flex flex-col items-start text-start">
              <div className="flex items-center gap-2">
                <h3 className="text-[#1c140f] dark:text-[#fdfbf7] text-[18px] font-bold leading-[26px]">
                  {name}
                </h3>
                <span
                  style={{ backgroundColor: badgeBg, color: badgeText }}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-[4px] leading-tight"
                >
                  {badgeLabel}
                </span>
              </div>
              <span className="text-[#837565] dark:text-[#a89f91] text-[12px] leading-[18px]">
                {providerSubtitle}
              </span>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={isEnabled}
            onClick={() => onToggle(gateway)}
            className={`relative inline-flex h-[28px] w-[50px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#9c6402] focus:ring-offset-2 ${
              isEnabled ? "bg-[#059669]" : "bg-[#d6cfc7]"
            }`}
          >
            <span
              className={`pointer-events-none inline-block size-[24px] transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                isEnabled
                  ? isEn
                    ? "translate-x-[22px]"
                    : "-translate-x-[22px]"
                  : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Status Line */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex items-center gap-1.5">
            <span
              className={`size-2 rounded-full ${
                isEnabled ? "bg-[#059669]" : "bg-[#ba1a1a]"
              }`}
            />
            <span
              className={`text-[12px] font-bold leading-[18px] ${
                isEnabled ? "text-[#047857]" : "text-[#ba1a1a]"
              }`}
            >
              {statusText}
            </span>
          </div>
          {statusSubText && (
            <span className="text-[#837565] dark:text-[#a89f91] text-[10px] font-bold leading-[14px]">
              {statusSubText}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-[#514537] dark:text-[#cdc5bd] text-[14px] leading-[22.75px] text-start font-normal">
          {description}
        </p>

        {/* Feature Meta List */}
        <div className="border-t border-[#e8e4de]/60 dark:border-[#38271c] pt-4 space-y-2.5 w-full">
          {metaItems.map((meta, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              {/* Label */}
              <span className="text-[#837565] dark:text-[#a89f91] text-start font-normal">
                {meta.label}
              </span>

              {/* Value */}
              <div className="flex items-center gap-1.5">
                {meta.isRecurring && (
                  <Repeat className="size-3 text-[#047857] dark:text-[#34d399]" />
                )}
                {meta.hasDot && (
                  <span className="size-1.5 rounded-full bg-[#059669] dark:bg-[#10b981]" />
                )}
                <span
                  className={`font-semibold ${
                    meta.isSuccess
                      ? "text-[#047857] dark:text-[#34d399]"
                      : meta.isWarning
                      ? "text-[#b76e00] dark:text-[#fbbf24]"
                      : "text-[#1c140f] dark:text-[#fdfbf7]"
                  }`}
                >
                  {meta.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Action Button */}
      <div className="border-t border-[#e8e4de] dark:border-[#38271c] pt-4 mt-5 w-full">
        <button
          type="button"
          onClick={() => onOpenSettings(gateway)}
          className="bg-[#f5f3ef] dark:bg-[#281c15] hover:bg-[#eae8e4] dark:hover:bg-[#34241b] text-[#1c140f] dark:text-[#fdfbf7] border border-transparent dark:border-[#38271c] rounded-[8px] py-2 px-3 text-xs font-semibold w-full flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Settings className="size-[15px] text-[#514537] dark:text-[#a89f91]" />
          <span>{t("إعدادات البوابة", "Gateway Settings")}</span>
        </button>
      </div>
    </div>
  );
}