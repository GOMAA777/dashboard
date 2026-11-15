"use client";

import React, { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Bell, Calendar, Search, Sun, Moon, ArrowLeftRight, Languages } from "lucide-react";
import userAvatarImg from "../../../../public/figma/user-avatar.png";
import { NotificationsFlyout } from "@/features/notifications/components/NotificationsFlyout";
import { DashboardBreadcrumb, type BreadcrumbSegment } from "@/components/shared/DashboardBreadcrumb";
import { useUIStore } from "@/stores/use-ui-store";
import { cn } from "@/lib/utils";

interface DashboardTopNavbarProps {
  customBreadcrumbs?: BreadcrumbSegment[];
}

export function DashboardTopNavbar({ customBreadcrumbs }: DashboardTopNavbarProps = {}) {
  const [searchValue, setSearchValue] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const language = useUIStore((state) => state.language);
  const toggleLanguage = useUIStore((state) => state.toggleLanguage);
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);
  const direction = useUIStore((state) => state.direction);
  const toggleDirection = useUIStore((state) => state.toggleDirection);
  const isPageNavigating = useUIStore((state) => state.isPageNavigating);

  const currentLanguage = isMounted ? language : "ar";
  const currentTheme = isMounted ? theme : "light";
  const currentDirection = isMounted ? direction : "rtl";

  return (
    <header
      className="sticky top-0 z-20 shrink-0 bg-white dark:bg-[#1c140f] border-b border-[#eae8e4] dark:border-[#2c221c] drop-shadow-[0px_1px_4px_rgba(0,0,0,0.04)] select-none transition-colors duration-200 w-full relative"
      data-node-id="1:641"
      data-name="Header"
    >
      {/* Dynamic Route Transition Shimmer Bar */}
      {isPageNavigating && (
        <div className="absolute top-0 inset-x-0 h-[2.5px] bg-[#9c6402]/20 overflow-hidden z-50">
          <div className="h-full bg-gradient-to-r from-[#c29547] via-[#e29d38] to-[#9c6402] animate-pulse w-full" />
        </div>
      )}
      {/* 1. Primary Actions Bar (64px) */}
      <div className="h-[64px] px-[24px] flex items-center justify-between">
        {/* Right / Start Side (in RTL): Search, Calendar Date */}
        <div className="flex items-center gap-[24px] flex-1 max-w-[800px]">
          {/* Search Input Box */}
          <div className="relative w-full max-w-[505px] h-[41px]" data-node-id="1:661">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={currentLanguage === "en" ? "Search system..." : "البحث في النظام"}
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
              {currentLanguage === "en" ? "Thursday, 24 October 2024" : "الخميس، 24 أكتوبر 2024"}
            </span>
          </div>
        </div>

        {/* Left / End Side (in RTL): Controls, Notifications & User Profile */}
        <div className="flex items-center gap-[8px] sm:gap-[12px] shrink-0">
          {/* Language Toggle Button (AR / EN) - Icon only */}
          <button
            type="button"
            onClick={toggleLanguage}
            title={currentLanguage === "ar" ? "English" : "العربية"}
            aria-label={currentLanguage === "ar" ? "English" : "العربية"}
            className="size-[36px] rounded-[6px] hover:bg-[#f5f3ef] dark:hover:bg-[#251b14] text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] border border-transparent hover:border-[#eae8e4] dark:hover:border-[#38271c] transition-colors flex items-center justify-center shrink-0 cursor-pointer"
          >
            <Languages className="size-[16px]" />
          </button>

          {/* Direction Toggle Button (LTR / RTL) - Icon only */}
          <button
            type="button"
            onClick={toggleDirection}
            title={
              currentDirection === "rtl"
                ? "Switch to LTR"
                : "التبديل إلى RTL"
            }
            aria-label={currentDirection === "rtl" ? "Switch to LTR" : "التبديل إلى RTL"}
            className="size-[36px] rounded-[6px] hover:bg-[#f5f3ef] dark:hover:bg-[#251b14] text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] border border-transparent hover:border-[#eae8e4] dark:hover:border-[#38271c] transition-colors flex items-center justify-center shrink-0 cursor-pointer"
          >
            <ArrowLeftRight className="size-[16px]" />
          </button>

          {/* Theme Toggle Button (Dark / Light Mode) - Icon only */}
          <button
            type="button"
            onClick={toggleTheme}
            title={currentTheme === "dark" ? "Light Mode" : "Dark Mode"}
            aria-label={currentTheme === "dark" ? "Light Mode" : "Dark Mode"}
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
      </div>

      {/* 2. Sleek shadcn/ui Breadcrumb Bar (38px) */}
      <div className="h-[38px] px-[24px] bg-[#fbfaf8]/95 dark:bg-[#17120e]/95 backdrop-blur-xs border-t border-[#f0ede8] dark:border-[#281f18] flex items-center justify-between">
        <DashboardBreadcrumb customItems={customBreadcrumbs} />

        {/* Subtle Platform Status indicator */}
        <div className="hidden md:flex items-center gap-2 text-[11px] text-[#8e8680] dark:text-[#a89f91]">
          <span className="size-1.5 rounded-full bg-[#10b981] animate-pulse" />
          <span>منصة الجودي السحابية</span>
        </div>
      </div>
    </header>
  );
}
