"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell, Sun, Moon, ArrowLeftRight, Languages } from "lucide-react";
import userAvatarImg from "../../../../public/figma/user-avatar.png";
import { NotificationsFlyout } from "@/features/notifications/components/NotificationsFlyout";
import { DashboardBreadcrumb, type BreadcrumbSegment } from "@/components/shared/DashboardBreadcrumb";
import { NavbarDatePicker } from "./NavbarDatePicker";
import { useUIStore } from "@/stores/use-ui-store";
import { cn } from "@/lib/utils";

interface DashboardTopNavbarProps {
  customBreadcrumbs?: BreadcrumbSegment[];
}

export function DashboardTopNavbar({ customBreadcrumbs }: DashboardTopNavbarProps = {}) {
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
      <div className="h-[64px] px-4 sm:px-6 flex items-center justify-between">
        {/* Right / Start Side (in RTL): User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/profile"
            title={currentLanguage === "en" ? "View Profile" : "عرض الملف الشخصي"}
            className="flex items-center gap-2.5 ps-1 group cursor-pointer"
            data-node-id="1:643"
          >
            <div
              className="size-[36px] rounded-full overflow-hidden shrink-0 border border-[#9c6402] dark:border-[#f59e0b] ring-2 ring-transparent group-hover:ring-[#9c6402]/30 transition-all shadow-2xs"
              data-node-id="1:644"
            >
              <Image
                src={userAvatarImg}
                alt={currentLanguage === "en" ? "Eng. Abdulaziz Bin Fahad" : "م. عبد العزيز بن فهد"}
                width={36}
                height={36}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                priority
              />
            </div>

            <div className="flex flex-col text-start">
              <span className="text-[13px] sm:text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[18px] group-hover:text-[#9c6402] dark:group-hover:text-[#f59e0b] transition-colors">
                {currentLanguage === "en" ? "Eng. Abdulaziz Bin Fahad" : "م. عبد العزيز بن فهد"}
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#837565] dark:text-[#8e8680] leading-[14px]">
                {currentLanguage === "en" ? "System Super Admin" : "مشرف النظام العام"}
              </span>
            </div>
          </Link>
        </div>

        {/* Left / End Side (in RTL): Date Picker Button + White Divider Line + 4 Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Interactive Date & Time Picker Popover */}
          <NavbarDatePicker language={currentLanguage} />

          {/* Small White Line Divider (same height as buttons: 36px) */}
          <div
            className="w-[1.5px] h-[36px] bg-white border-s border-[#eae8e4] dark:border-white/10 dark:bg-white/20 rounded-full shrink-0 shadow-2xs"
            aria-hidden="true"
          />

          {/* The 4 Action Icons Group */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* 1. Language Toggle Button (AR / EN) */}
            <button
              type="button"
              onClick={toggleLanguage}
              title={currentLanguage === "ar" ? "English" : "العربية"}
              aria-label={currentLanguage === "ar" ? "English" : "العربية"}
              className="size-[36px] rounded-[6px] hover:bg-[#f5f3ef] dark:hover:bg-[#251b14] text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] border border-transparent hover:border-[#eae8e4] dark:hover:border-[#38271c] transition-colors flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Languages className="size-[16px]" />
            </button>

            {/* 2. Direction Toggle Button (LTR / RTL) */}
            <button
              type="button"
              onClick={toggleDirection}
              title={currentDirection === "rtl" ? "Switch to LTR" : "التبديل إلى RTL"}
              aria-label={currentDirection === "rtl" ? "Switch to LTR" : "التبديل إلى RTL"}
              className="size-[36px] rounded-[6px] hover:bg-[#f5f3ef] dark:hover:bg-[#251b14] text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] border border-transparent hover:border-[#eae8e4] dark:hover:border-[#38271c] transition-colors flex items-center justify-center shrink-0 cursor-pointer"
            >
              <ArrowLeftRight className="size-[16px]" />
            </button>

            {/* 3. Theme Toggle Button (Dark / Light Mode) */}
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

            {/* 4. Notifications Bell with Badge */}
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
                  3
                </span>
              </button>

              <NotificationsFlyout
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sleek shadcn/ui Breadcrumb Bar (38px) */}
      <div className="h-[38px] px-4 sm:px-6 bg-[#fbfaf8]/95 dark:bg-[#17120e]/95 backdrop-blur-xs border-t border-[#f0ede8] dark:border-[#281f18] flex items-center justify-between">
        <DashboardBreadcrumb customItems={customBreadcrumbs} />

        {/* Subtle Platform Status indicator */}
        <div className="hidden md:flex items-center gap-2 text-[11px] text-[#8e8680] dark:text-[#a89f91]">
          <span className="size-1.5 rounded-full bg-[#10b981] animate-pulse" />
          <span>{currentLanguage === "en" ? "El-Joudy Cloud Platform" : "منصة الجودي السحابية"}</span>
        </div>
      </div>
    </header>
  );
}
