"use client";

import React, { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Bell, Calendar, Search, Sun, Moon, ArrowLeftRight } from "lucide-react";
import userAvatarImg from "../../../../public/figma/user-avatar.png";
import { NotificationsFlyout } from "@/features/notifications/components/NotificationsFlyout";
import { useUIStore } from "@/stores/use-ui-store";
import { cn } from "@/lib/utils";

export function DashboardTopNavbar() {
  const [searchValue, setSearchValue] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);
  const direction = useUIStore((state) => state.direction);
  const toggleDirection = useUIStore((state) => state.toggleDirection);

  const currentTheme = isMounted ? theme : "light";
  const currentDirection = isMounted ? direction : "rtl";

  return (
    <header
      className="h-[64px] bg-white dark:bg-[#1c140f] border-b border-[#eae8e4] dark:border-[#2c221c] drop-shadow-[0px_1px_4px_rgba(0,0,0,0.04)] px-[24px] flex items-center justify-between shrink-0 select-none z-20 transition-colors duration-200"
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
            className="w-full h-full bg-[#f5f3ef] dark:bg-[#251b14] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder-[#837565] dark:placeholder-[#8e8680] border border-transparent dark:border-[#38271c] text-[12px] rounded-[8px] pe-[38px] ps-[16px] focus:outline-none focus:ring-1 focus:ring-[#9c6402]/30 transition-all font-sans"
            data-node-id="1:662"
          />
          <div className="absolute top-1/2 -translate-y-1/2 end-[14px] pointer-events-none size-[13.5px] flex items-center justify-center">
            <Search className="size-[13.5px] block text-[#837565] dark:text-[#8e8680]" />
          </div>
        </div>

        {/* Calendar Date Display */}
        <div className="hidden lg:flex items-center gap-[6px] text-[#514537] dark:text-[#cdc5bd] shrink-0" data-node-id="1:656">
          <Calendar className="size-[14px] block shrink-0 text-[#837565] dark:text-[#8e8680]" />
          <span className="text-[12px] leading-[18px] font-normal text-[#514537] dark:text-[#cdc5bd]">
            الخميس، 24 أكتوبر 2024
          </span>
        </div>
      </div>

      {/* Left / End Side (in RTL): Controls, Notifications & User Profile */}
      <div className="flex items-center gap-[8px] sm:gap-[12px] shrink-0">
        {/* Direction Toggle Button (LTR / RTL) */}
        <button
          type="button"
          onClick={toggleDirection}
          title={
            currentDirection === "rtl"
              ? "الاتجاه الحالي: من اليمين لليسار (RTL) - اضغط للتحويل إلى LTR"
              : "Current Direction: LTR - Click to switch to RTL"
          }
          aria-label={currentDirection === "rtl" ? "التبديل إلى LTR" : "التبديل إلى RTL"}
          className="h-[36px] px-[8px] rounded-[6px] hover:bg-[#f5f3ef] dark:hover:bg-[#251b14] text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] border border-transparent hover:border-[#eae8e4] dark:hover:border-[#38271c] transition-colors flex items-center gap-[6px] shrink-0 cursor-pointer"
        >
          <ArrowLeftRight className="size-[15px]" />
          <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-[#f5f3ef] dark:bg-[#2c221c] text-[#514537] dark:text-[#cdc5bd] border border-[#eae8e4] dark:border-[#38271c]">
            {currentDirection.toUpperCase()}
          </span>
        </button>

        {/* Theme Toggle Button (Dark / Light Mode) */}
        <button
          type="button"
          onClick={toggleTheme}
          title={currentTheme === "dark" ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن"}
          aria-label={currentTheme === "dark" ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن"}
          className="size-[36px] rounded-[6px] hover:bg-[#f5f3ef] dark:hover:bg-[#251b14] text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] border border-transparent hover:border-[#eae8e4] dark:hover:border-[#38271c] transition-colors flex items-center justify-center shrink-0 cursor-pointer"
        >
          {currentTheme === "dark" ? (
            <Sun className="size-[17px] text-[#e29d38]" />
          ) : (
            <Moon className="size-[17px] text-[#514537] dark:text-[#cdc5bd]" />
          )}
        </button>

        {/* Notifications Bell with Badge */}
        <div className="relative">
          <button
            type="button"
            aria-label="الإشعارات"
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            className={cn(
              "relative size-[36px] rounded-[6px] hover:bg-[#f5f3ef] dark:hover:bg-[#251b14] text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] border border-transparent hover:border-[#eae8e4] dark:hover:border-[#38271c] transition-colors flex items-center justify-center shrink-0 cursor-pointer",
              isNotificationsOpen && "bg-[#f5f3ef] dark:bg-[#251b14] border-[#eae8e4] dark:border-[#38271c]"
            )}
            data-node-id="1:650"
          >
            <Bell className="w-[15px] h-[18px] block text-current" />
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

        {/* Vertical Divider */}
        <div className="hidden sm:block w-px h-[20px] bg-[#eae8e4] dark:bg-[#2c221c]" data-node-id="1:655" />

        {/* Profile Card */}
        <div className="flex items-center gap-[8px] ps-[4px]" data-node-id="1:643">
          <div className="flex flex-col text-start">
            <span className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[17.5px] font-sans">
              م. عبد العزيز بن فهد
            </span>
            <span className="text-[10px] font-semibold text-[#514537] dark:text-[#8e8680] leading-[12.5px]">
              مشرف النظام العام
            </span>
          </div>

          <div
            className="size-[32px] rounded-full overflow-hidden shrink-0 border border-[#eae8e4] dark:border-[#38271c]"
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
