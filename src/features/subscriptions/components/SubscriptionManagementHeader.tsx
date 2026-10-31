"use client";

import React from "react";
import { Plus } from "lucide-react";

interface SubscriptionManagementHeaderProps {
  onAddSubscription: () => void;
}

export function SubscriptionManagementHeader({
  onAddSubscription,
}: SubscriptionManagementHeaderProps) {
  return (
    <div
      className="bg-white dark:bg-[#1e1c1a] flex flex-col md:flex-row items-start md:items-center justify-between p-5 sm:p-6 rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full gap-4"
      data-node-id="1:5241"
      data-name="Main Identity & Command Banner"
    >
      {/* Right in RTL: Title & Subtitle */}
      <div className="flex flex-col items-start text-start">
        <h1 className="font-['Cairo'] font-bold text-[28px] text-[#1b1c1a] dark:text-[#fdfbf7] leading-[38px]">
          إدارة الاشتراكات
        </h1>
        <p className="font-['Cairo'] font-normal text-[14px] text-[#514537] dark:text-[#a89f91] mt-0.5 leading-[22px]">
          متابعة اشتراكات مكاتب المحاماة، دورات الفوترة، وحالات التجديد والتحصيل التلقائي.
        </p>
      </div>

      {/* Left in RTL: Add Subscription Button */}
      <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
        <button
          type="button"
          onClick={onAddSubscription}
          className="bg-[#9c6402] hover:bg-[#825200] text-white px-4 py-2 rounded-[4px] font-['Cairo'] font-semibold text-[14px] flex items-center justify-center gap-1.5 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors cursor-pointer w-full md:w-auto"
          data-node-id="1:5244"
          data-name="Button"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>إضافة اشتراك </span>
        </button>
      </div>
    </div>
  );
}
