"use client";

import React from "react";

interface AddCustomGatewayCardProps {
  onAdd: () => void;
}

export function AddCustomGatewayCard({ onAdd }: AddCustomGatewayCardProps) {
  return (
    <div
      onClick={onAdd}
      className="border-2 border-dashed border-[#e8e4de] hover:border-[#9c6402] transition-all rounded-[16px] p-6 flex flex-col items-center justify-center text-center min-h-[380px] h-full cursor-pointer group bg-transparent hover:bg-[#fffdf9]/60"
    >
      {/* Plus Icon Container */}
      <div className="bg-[#f0eeea] group-hover:bg-[#fceccf] transition-colors rounded-[16px] size-14 flex items-center justify-center mb-4 shadow-2xs">
        <img
          alt="Add"
          className="size-[16.5px]"
          src="/figma/payment-gateways/add-custom-icon.svg"
        />
      </div>

      {/* Heading */}
      <h3 className="text-[#1c140f] text-[18px] font-bold leading-[26px] mb-1">
        إضافة بوابة مخصصة
      </h3>

      {/* Description */}
      <p className="text-[#514537] text-[12px] leading-[18px] max-w-[280px] mb-4">
        ربط محفظة إلكترونية محلية جديدة أو بوابة دفع مخصصة مثل Urpay أو STC Pay.
      </p>

      {/* Action link */}
      <div className="flex items-center gap-1.5 text-[#7b4e00] text-[12px] font-bold group-hover:gap-2.5 transition-all">
        <img
          alt=""
          className="size-[11px]"
          src="/figma/payment-gateways/arrow-left-icon.svg"
        />
        <span>بدء التكوين والربط</span>
      </div>
    </div>
  );
}
