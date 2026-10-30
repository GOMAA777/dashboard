"use client";

import React from "react";
import { PaymentGatewayItem } from "../types/payment-gateways.types";

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
    <div className="bg-white rounded-[16px] p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] border border-[#eae8e4]/80 flex flex-col justify-between h-full transition-all hover:shadow-md">
      {/* Top Section */}
      <div className="flex flex-col gap-4">
        {/* Header: Brand Icon & Toggle */}
        <div className="flex items-start justify-between w-full">
          {/* Custom Switch on Left */}
          <button
            type="button"
            role="switch"
            aria-checked={isEnabled}
            onClick={() => onToggle(gateway)}
            className={`relative w-[44px] h-[24px] rounded-[12px] p-0.5 transition-colors cursor-pointer shrink-0 focus:outline-none ${
              isEnabled ? "bg-[#9c6402]" : "bg-[#e8e4de]"
            }`}
          >
            <span
              className={`block size-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                isEnabled ? "translate-x-0" : "-translate-x-5"
              }`}
            />
          </button>

          {/* Brand Info on Right */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end text-right">
              <div className="flex items-center gap-2">
                <span
                  style={{ backgroundColor: badgeBg, color: badgeText }}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-[2px]"
                >
                  {badgeLabel}
                </span>
                <h3 className="text-[#1c140f] text-[18px] font-bold leading-[26px]">
                  {name}
                </h3>
              </div>
              <p className="text-[#837565] text-[10px] font-bold leading-[14px] mt-0.5">
                {providerSubtitle}
              </p>
            </div>

            {/* Official Brand Badge */}
            {brandType === "bank" && (
              <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-[16px] size-14 flex items-center justify-center shrink-0">
                <img
                  alt="Bank"
                  className="size-[25px]"
                  src="/figma/payment-gateways/bank-icon.svg"
                />
              </div>
            )}

            {brandType === "paypal" && (
              <div className="bg-[rgba(0,48,135,0.05)] rounded-[16px] size-14 flex items-center justify-center shrink-0">
                <span className="font-bold text-[22px] tracking-[-1.1px]">
                  <span className="text-[#003087]">P</span>
                  <span className="text-[#0079c1]">P</span>
                </span>
              </div>
            )}

            {brandType === "stripe" && (
              <div className="bg-[rgba(99,91,255,0.1)] rounded-[16px] size-14 flex items-center justify-center shrink-0">
                <span className="font-bold text-[22px] tracking-[-0.55px] text-[#635bff]">
                  S\
                </span>
              </div>
            )}

            {brandType === "paddle" && (
              <div className="bg-[rgba(13,31,45,0.05)] border border-[rgba(13,31,45,0.1)] rounded-[16px] size-14 flex items-center justify-center shrink-0">
                <img
                  alt="Paddle"
                  className="w-[26px] h-[19px]"
                  src="/figma/payment-gateways/paddle-icon.svg"
                />
              </div>
            )}

            {brandType === "razorpay" && (
              <div className="bg-[rgba(12,35,64,0.05)] border border-[rgba(12,35,64,0.15)] rounded-[16px] size-14 flex items-center justify-center shrink-0">
                <img
                  alt="Razorpay"
                  className="size-[26px]"
                  src="/figma/payment-gateways/razorpay-icon.svg"
                />
              </div>
            )}

            {brandType === "custom" && (
              <div className="bg-[#f0eeea] rounded-[16px] size-14 flex items-center justify-center shrink-0">
                <img
                  alt="Custom"
                  className="size-[22px]"
                  src="/figma/payment-gateways/coin-icon.svg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 justify-end w-full">
          {statusSubText && (
            <span className="text-[#837565] text-[10px] font-bold leading-[14px]">
              {statusSubText}
            </span>
          )}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] ${
              isEnabled ? "bg-[#e8f5e9]" : "bg-[#f5f5f4]"
            }`}
          >
            <span
              className={`text-[10px] font-bold leading-[14px] ${
                isEnabled ? "text-[#1b7340]" : "text-[#555151]"
              }`}
            >
              {statusText}
            </span>
            <span
              className={`size-1.5 rounded-full ${
                isEnabled ? "bg-[#1b7340]" : "bg-[#b9b9b9]"
              }`}
            />
          </div>
        </div>

        {/* Description */}
        <p className="text-[#514537] text-[14px] leading-[22.75px] text-right font-normal">
          {description}
        </p>

        {/* Feature Meta List */}
        <div className="border-t border-[#e8e4de]/60 pt-4 space-y-2.5 w-full">
          {metaItems.map((meta, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              {/* Value on Left */}
              <div className="flex items-center gap-1.5">
                {meta.hasDot && (
                  <span className="size-1.5 rounded-full bg-[#059669]" />
                )}
                {meta.iconSrc && (
                  <img alt="" className="size-3" src={meta.iconSrc} />
                )}
                <span
                  className={`font-semibold ${
                    meta.isSuccess
                      ? "text-[#047857]"
                      : meta.isWarning
                      ? "text-[#b76e00]"
                      : "text-[#1c140f]"
                  }`}
                >
                  {meta.value}
                </span>
              </div>

              {/* Label on Right */}
              <span className="text-[#837565] text-right font-normal">
                {meta.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Action Button */}
      <div className="border-t border-[#e8e4de] pt-4 mt-5 w-full">
        <button
          type="button"
          onClick={() => onOpenSettings(gateway)}
          className="bg-[#f5f3ef] hover:bg-[#eae8e4] text-[#1c140f] rounded-[8px] py-2 px-3 text-xs font-semibold w-full flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <span>إعدادات البوابة</span>
          <img
            alt=""
            className="size-[15px]"
            src="/figma/payment-gateways/settings-icon.svg"
          />
        </button>
      </div>
    </div>
  );
}
