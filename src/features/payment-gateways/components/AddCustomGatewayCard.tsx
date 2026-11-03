"use client";

import React from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface AddCustomGatewayCardProps {
  onAdd: () => void;
}

export function AddCustomGatewayCard({ onAdd }: AddCustomGatewayCardProps) {
  const { t, isEn } = useLanguage();

  return (
    <div
      onClick={onAdd}
      className="border-2 border-dashed border-[#e8e4de] dark:border-[#38271c] hover:border-[#9c6402] dark:hover:border-[#e29d38] transition-all duration-200 rounded-[16px] p-6 flex flex-col items-center justify-center text-center min-h-[380px] h-full cursor-pointer group bg-white/40 dark:bg-[#221812]/40 hover:bg-[#fffdf9] dark:hover:bg-[#281c15] shadow-2xs hover:shadow-md select-none"
    >
      {/* Plus Icon Container */}
      <div className="bg-[#f0eeea] dark:bg-[#281c15] group-hover:bg-[#fceccf] dark:group-hover:bg-[#9c6402]/25 group-hover:scale-105 border border-transparent group-hover:border-[#9c6402]/30 dark:group-hover:border-[#e29d38]/30 transition-all rounded-[16px] size-14 flex items-center justify-center mb-4 shadow-2xs">
        <Plus className="size-5 text-[#9c6402] dark:text-[#f59e0b] transition-transform group-hover:rotate-90 duration-300" />
      </div>

      {/* Heading */}
      <h3 className="text-[#1c140f] dark:text-[#fdfbf7] group-hover:text-[#9c6402] dark:group-hover:text-[#e29d38] text-[18px] font-bold leading-[26px] mb-1 transition-colors">
        {t("إضافة بوابة مخصصة", "Add Custom Gateway")}
      </h3>

      {/* Description */}
      <p className="text-[#514537] dark:text-[#a89f91] text-[12px] leading-[18px] max-w-[280px] mb-4">
        {t(
          "ربط محفظة إلكترونية محلية جديدة أو بوابة دفع مخصصة مثل Urpay أو STC Pay.",
          "Connect a new digital wallet or custom payment gateway like Urpay or STC Pay."
        )}
      </p>

      {/* Action link */}
      <div className="flex items-center gap-1.5 text-[#7b4e00] dark:text-[#e29d38] text-[12px] font-bold group-hover:gap-2.5 transition-all">
        <ArrowLeft className={cn("size-3.5 transition-transform", isEn && "rotate-180")} />
        <span>{t("بدء التكوين والربط", "Configure & Connect")}</span>
      </div>
    </div>
  );
}