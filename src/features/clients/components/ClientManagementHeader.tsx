"use client";

import React from "react";
import { Plus } from "lucide-react";

interface ClientManagementHeaderProps {
  onAddOffice: () => void;
}

export function ClientManagementHeader({ onAddOffice }: ClientManagementHeaderProps) {
  return (
    <div
      className="bg-white rounded-[8px] p-[24px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] flex flex-col sm:flex-row sm:items-center justify-between gap-[16px] w-full"
      data-node-id="1:754"
    >
      {/* Right Column: Title, Badge, Subtitle */}
      <div className="flex flex-col items-start text-start">
        <div className="flex items-center gap-[10px]">
          <h1 className="text-[26px] leading-[36px] font-bold text-[#1b1c1a]">
            إدارة العملاء
          </h1>
          <span className="bg-[#eae8e4] text-[#514537] text-[11px] leading-[16px] font-bold px-[10px] py-[3px] rounded-full">
            مكاتب المحاماة
          </span>
        </div>
        <p className="text-[#514537] text-[13px] leading-[20px] font-normal mt-[4px]">
          إدارة وتدقيق مكاتب المحاماة المسجلة ومتابعة بيانات التراخيص العدلية وحالة الاشتراكات الفعالة
        </p>
      </div>

      {/* Left Column: + إضافة مكتب جديد button */}
      <button
        type="button"
        onClick={onAddOffice}
        className="bg-[#9c6402] hover:bg-[#855402] text-white px-[20px] py-[10px] rounded-[4px] text-[14px] font-semibold leading-[20px] flex items-center justify-center gap-[8px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
      >
        <Plus className="size-[16px] shrink-0 stroke-[2.5]" />
        <span>إضافة مكتب جديد</span>
      </button>
    </div>
  );
}
