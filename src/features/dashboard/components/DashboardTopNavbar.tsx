"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Bell, Calendar, Search } from "lucide-react";
import userAvatarImg from "../../../../public/figma/user-avatar.png";
import { NotificationsFlyout } from "@/features/notifications/components/NotificationsFlyout";

export function DashboardTopNavbar() {
  const [searchValue, setSearchValue] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <header
      className="h-[64px] bg-white border-b border-[#eae8e4] drop-shadow-[0px_1px_4px_rgba(0,0,0,0.04)] px-[24px] flex items-center justify-between shrink-0 select-none z-20"
      data-node-id="1:641"
      data-name="Header"
    >
      {/* Right / Start Side (in RTL): Search, Calendar Date */}
      <div className="flex items-center gap-[24px] flex-1 max-w-[800px]">
        {/* Search Input Box */}
        <div className="relative w-full max-w-[505px] h-[41px]" data-node-id="1:661">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="البحث في النظام"
            className="w-full h-full bg-[#f5f3ef] text-[#1b1c1a] placeholder-[#837565] text-[12px] rounded-[8px] pe-[38px] ps-[16px] focus:outline-none focus:ring-1 focus:ring-[#9c6402]/30 transition-all font-sans"
            data-node-id="1:662"
          />
          <div className="absolute top-1/2 -translate-y-1/2 end-[14px] pointer-events-none size-[13.5px] flex items-center justify-center">
            <Search className="size-[13.5px] block text-[#837565]" />
          </div>
        </div>

        {/* Calendar Date Display */}
        <div className="hidden lg:flex items-center gap-[6px] text-[#514537] shrink-0" data-node-id="1:656">
          <Calendar className="size-[14px] block shrink-0 text-[#837565]" />
          <span className="text-[12px] leading-[18px] font-normal text-[#514537]">
            الخميس، 24 أكتوبر 2024
          </span>
        </div>
      </div>

      {/* Left / End Side (in RTL): Notifications & User Profile */}
      <div className="flex items-center gap-[16px] shrink-0">
        {/* Vertical Divider */}
        <div className="hidden sm:block w-px h-[16px] bg-[#eae8e4]" data-node-id="1:655" />

        {/* Notifications Bell with Badge */}
        <div className="relative">
          <button
            type="button"
            aria-label="الإشعارات"
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            className={`relative p-[8px] rounded-[4px] hover:bg-[#f5f3ef] transition-colors flex items-center justify-center shrink-0 cursor-pointer ${
              isNotificationsOpen ? "bg-[#f5f3ef]" : ""
            }`}
            data-node-id="1:650"
          >
            <Bell className="w-[15px] h-[18px] block text-[#514537]" />
            <span
              className="absolute top-[4px] start-[6px] size-[12px] rounded-full bg-[#9c6402] text-[#fff3e9] text-[9px] font-bold flex items-center justify-center"
              data-node-id="1:653"
            >
              4
            </span>
          </button>

          <NotificationsFlyout
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-[8px] ps-[4px]" data-node-id="1:643">
          <div className="flex flex-col text-start">
            <span className="text-[14px] font-semibold text-[#1b1c1a] leading-[17.5px] font-sans">
              م. عبد العزيز بن فهد
            </span>
            <span className="text-[10px] font-semibold text-[#514537] leading-[12.5px]">
              مشرف النظام العام
            </span>
          </div>

          <div
            className="size-[32px] rounded-full overflow-hidden shrink-0 border border-[#eae8e4]"
            data-node-id="1:644"
          >
            <Image
              src={userAvatarImg}
              alt="م. عبد العزيز بن فهد"
              width={32}
              height={32}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </header>
  );
}
