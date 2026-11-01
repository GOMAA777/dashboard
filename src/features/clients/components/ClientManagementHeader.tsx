"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface ClientManagementHeaderProps {
  onAddOffice: () => void;
}

export function ClientManagementHeader({ onAddOffice }: ClientManagementHeaderProps) {
  const { t } = useLanguage();

  return (
    <div
      className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full shrink-0"
      data-node-id="1:754"
    >
      {/* Right Column: Title, Badge, Subtitle */}
      <div className="flex flex-col items-start text-start">
        <div className="flex items-center gap-[10px]">
          <h1 className="text-[26px] leading-[36px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
            {t("إدارة العملاء", "Client Management")}
          </h1>
          <span className="bg-[#eae8e4] dark:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] text-[11px] leading-[16px] font-bold px-[10px] py-[3px] rounded-full">
            {t("مكاتب المحاماة", "Law Firms")}
          </span>
        </div>
        <p className="text-[#514537] dark:text-[#8e8680] text-[13px] leading-[20px] font-normal mt-[4px]">
          {t(
            "إدارة وتدقيق مكاتب المحاماة المسجلة ومتابعة بيانات التراخيص العدلية وحالة الاشتراكات الفعالة",
            "Manage and audit registered law firms, track judicial licenses, and monitor active subscriptions"
          )}
        </p>
      </div>

      {/* Left Column: + إضافة مكتب جديد button */}
      <button
        type="button"
        onClick={onAddOffice}
        className="bg-[#9c6402] hover:bg-[#855402] text-white px-[20px] py-[10px] rounded-[4px] text-[14px] font-semibold leading-[20px] flex items-center justify-center gap-[8px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
      >
        <Plus className="size-[16px] shrink-0 stroke-[2.5]" />
        <span>{t("إضافة مكتب جديد", "Add New Office")}</span>
      </button>
    </div>
  );
}
