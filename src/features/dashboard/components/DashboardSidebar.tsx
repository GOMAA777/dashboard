"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import userAvatarImg from "../../../../public/figma/user-avatar.png";
import {
  Bell,
  CreditCard,
  Headphones,
  LayoutGrid,
  Receipt,
  Settings,
  Tag,
  UserCheck,
  Users,
  Building2,
  Key,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Ticket,
  FileText,
  RefreshCw,
  SlidersHorizontal,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/use-ui-store";
import { useDraftsStore } from "@/stores/use-drafts-store";
import { LogoutConfirmModal } from "./LogoutConfirmModal";
import { AlJoudyLogo } from "@/components/shared/BrandLogos";
import { clearAuthSession } from "@/lib/auth-client";
import { withBasePath } from "@/lib/base-path";

interface NavItem {
  id: string;
  labelAr: string;
  labelEn: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  sizeClass: string;
  isUnderConstruction?: boolean;
}

const navItems: NavItem[] = [
  { id: "home", labelAr: "الرئيسية", labelEn: "Dashboard", href: "/", icon: LayoutGrid, sizeClass: "size-[16px]" },
  { id: "clients", labelAr: "مكاتب المحاماة", labelEn: "Law Firms", href: "/accounts", icon: Users, sizeClass: "size-[18px]" },
  { id: "notifications", labelAr: "الإشعارات", labelEn: "Notifications", href: "/notifications", icon: Bell, sizeClass: "size-[16px]" },
  { id: "drafts", labelAr: "المسودات", labelEn: "Drafts", href: "/drafts", icon: FileText, sizeClass: "size-[16px]" },
  { id: "staff", labelAr: "طاقم العمل", labelEn: "Staff", href: "/permissions", icon: UserCheck, sizeClass: "size-[19px]" },
  { id: "finance", labelAr: "الفواتير والمالية", labelEn: "Invoices & Finance", href: "/invoices", icon: Receipt, sizeClass: "size-[16px]" },
  { id: "support", labelAr: "الدعم الفني", labelEn: "Technical Support", href: "/tickets", icon: Headphones, sizeClass: "size-[17px]" },
  { id: "system-settings", labelAr: "إعدادات النظام", labelEn: "System Settings", href: "/settings/general", icon: Settings, sizeClass: "size-[17px]" },
];

interface DashboardSidebarProps {
  activeNav?: string;
  activeSubNav?: string;
}

export function DashboardSidebar({ activeNav, activeSubNav }: DashboardSidebarProps = {}) {
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const toggleSidebarCollapsed = useUIStore((state) => state.toggleSidebarCollapsed);
  const setPageNavigating = useUIStore((state) => state.setPageNavigating);
  const drafts = useDraftsStore((state) => state.drafts);
  const initDrafts = useDraftsStore((state) => state.init);

  useEffect(() => {
    initDrafts();
  }, [initDrafts]);

  const draftCount = drafts.length;

  const handleNavClick = (href: string) => {
    if (href && href !== "#" && href !== pathname) {
      setPageNavigating(true);
    }
  };

  const isFinanceActive =
    activeNav === "finance" ||
    (pathname?.startsWith("/plans") ?? false) ||
    (pathname?.startsWith("/subscriptions") ?? false) ||
    (pathname?.startsWith("/invoices") ?? false) ||
    (pathname?.startsWith("/payment-gateways") ?? false);
  const isPlansActive = isFinanceActive && (activeSubNav === "plans" || (pathname?.startsWith("/plans") ?? false));
  const isSubscriptionsActive = isFinanceActive && (activeSubNav === "subscriptions" || (pathname?.startsWith("/subscriptions") ?? false));
  const isInvoicesActive = isFinanceActive && (activeSubNav === "invoices" || pathname === "/invoices");
  const isGatewaysActive = isFinanceActive && (activeSubNav === "gateways" || pathname === "/payment-gateways");

  const isSupportActive = activeNav === "support" || (pathname?.startsWith("/tickets") ?? false);
  const isSupportTicketsActive = isSupportActive && (activeSubNav === "tickets" || (!activeSubNav && pathname?.startsWith("/tickets")));
  const isSupportDepartmentsActive = isSupportActive && activeSubNav === "departments";

  const isStaffActive =
    activeNav === "staff" ||
    (pathname?.startsWith("/permissions") ?? false) ||
    (pathname?.startsWith("/staff") ?? false) ||
    (pathname?.startsWith("/roles") ?? false);
  const isStaffTeamActive = isStaffActive && (activeSubNav === "staff" || pathname === "/staff");
  const isStaffRolesActive = isStaffActive && (activeSubNav === "roles" || (!activeSubNav && (pathname === "/permissions" || pathname === "/roles")));

  const isMailSettingsActive =
    activeNav === "mail-settings" ||
    (pathname?.startsWith("/settings/mail") ?? false);
  const isWebsiteSettingsPath =
    (pathname?.startsWith("/website-settings") ?? false) || pathname === "/settings/website";
  const isSystemSettingsActive =
    activeNav === "system-settings" ||
    isWebsiteSettingsPath ||
    ((pathname?.startsWith("/settings") ?? false) && !isMailSettingsActive);
  const isGeneralActive = isSystemSettingsActive && (activeSubNav === "general" || pathname === "/settings/general");
  const isWebsiteActive =
    isSystemSettingsActive && (activeSubNav === "website" || isWebsiteSettingsPath);

  const direction = useUIStore((state) => state.direction);
  const language = useUIStore((state) => state.language);

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const isCollapsed = isMounted ? sidebarCollapsed : false;
  const currentLang = isMounted ? language : "ar";
  const isRTL = isMounted ? direction === "rtl" : true;

  const CollapseIcon = isCollapsed
    ? (isRTL ? ChevronLeft : ChevronRight)
    : (isRTL ? ChevronRight : ChevronLeft);

  const handleConfirmLogout = () => {
    clearAuthSession();
    setIsLogoutModalOpen(false);
    toast.success(currentLang === "en" ? "Logged out successfully" : "تم تسجيل الخروج بنجاح");
    window.location.reload();
  };

  return (
    <aside
      className={cn(
        "relative shrink-0 h-screen h-dvh sticky top-0 bg-white dark:bg-[#1c140f] flex flex-col justify-between border-e border-[#eae8e4] dark:border-[#2c221c] drop-shadow-[0px_1px_4px_rgba(0,0,0,0.04)] select-none z-30 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[72px]" : "w-[240px]"
      )}
      data-node-id="1:667"
      data-name="Aside"
    >
      {/* Sidebar Collapse/Expand Toggle Button permanently anchored on the inner boundary */}
      <button
        type="button"
        onClick={toggleSidebarCollapsed}
        aria-label={isCollapsed ? (currentLang === "en" ? "Expand sidebar" : "توسيع القائمة الجانبية") : (currentLang === "en" ? "Collapse sidebar" : "تصغير القائمة الجانبية")}
        title={isCollapsed ? (currentLang === "en" ? "Expand sidebar" : "توسيع القائمة الجانبية") : (currentLang === "en" ? "Collapse sidebar" : "تصغير القائمة الجانبية")}
        className="absolute top-[20px] -end-[13px] z-40 size-[26px] bg-white hover:bg-[#fbf7f0] text-[#514537] hover:text-[#9c6402] border border-[#eae8e4] dark:bg-[#221812] dark:hover:bg-[#2c1f17] dark:text-[#cdc5bd] dark:hover:text-[#fdfbf7] dark:border-[#3d2a1d] rounded-full shadow-[0px_2px_5px_rgba(0,0,0,0.12)] flex items-center justify-center transition-colors cursor-pointer focus:outline-none"
      >
        <CollapseIcon className="size-[14px]" />
      </button>

      {/* Top Section: Logo & Nav List */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Brand Header */}
        <div
          className={cn(
            "h-[64px] border-b border-[#eae8e4] dark:border-[#2c221c] flex items-center shrink-0 transition-all duration-300",
            isCollapsed ? "justify-center px-2" : "justify-start px-4"
          )}
          data-node-id="1:669"
        >
          {/* Logo Mark + Titles */}
          <div
            className={cn(
              "flex items-center",
              isCollapsed ? "justify-center w-full" : "justify-start gap-[12px]"
            )}
          >
            {/* Brand Logo Icon */}
            <div
              className="size-[34px] rounded-[8px] overflow-hidden flex items-center justify-center shrink-0"
              title={isCollapsed ? (currentLang === "en" ? "Al Joudy - Executive Admin Dashboard" : "الجودي - لوحة الإدارة العليا") : undefined}
            >
              <AlJoudyLogo className="size-[34px]" priority />
            </div>

            {/* Logo Word / Titles (hidden when collapsed) */}
            {!isCollapsed && (
              <div className="flex flex-col items-start text-start overflow-hidden whitespace-nowrap gap-[4px]">
                <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7] text-[18px] leading-[22px] font-sans">
                  {currentLang === "en" ? "Al Joudy" : "الجودي"}
                </span>
                <span className="font-bold text-[#9c6402] dark:text-[#b9b3ae] text-[10px] leading-[14px]">
                  {currentLang === "en" ? "Executive Admin Dashboard" : "لوحة الإدارة العليا"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav
          className={cn(
            "flex-1 overflow-y-auto py-[8px] flex flex-col gap-[4px] scrollbar-thin transition-all duration-300",
            isCollapsed ? "px-[10px] items-center" : "px-[8px]"
          )}
          data-node-id="1:678"
        >
          {navItems.map((item) => {
            const itemLabel = currentLang === "en" ? item.labelEn : item.labelAr;
            if (item.isUnderConstruction) {
              if (isCollapsed) {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toast.info(currentLang === "en" ? "This section is under construction" : "هذا القسم قيد الإنشاء")}
                    title={itemLabel}
                    className="size-[44px] rounded-[12px] flex items-center justify-center transition-all duration-200 group text-[#514537] hover:bg-[#fbf7f0] hover:text-[#9c6402] dark:text-[#cdc5bd] dark:hover:bg-[#2c221c]/80 dark:hover:text-[#fdfbf7] cursor-pointer"
                  >
                    <item.icon
                      className={cn(
                        "size-[18px] transition-colors shrink-0 text-[#837565] group-hover:text-[#9c6402] dark:text-[#cdc5bd] dark:group-hover:text-[#fdfbf7]",
                        item.sizeClass
                      )}
                    />
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toast.info(currentLang === "en" ? "This section is under construction" : "هذا القسم قيد الإنشاء")}
                  className="w-full flex items-center gap-[12px] px-[12px] py-[8px] rounded-[12px] transition-colors duration-150 group text-start text-[#514537] hover:bg-[#fbf7f0] hover:text-[#9c6402] dark:text-[#cdc5bd] dark:hover:bg-[#2c221c]/60 dark:hover:text-[#fdfbf7] cursor-pointer"
                >
                  {/* Icon first (Right in RTL, Left in LTR) */}
                  <div className="size-[20px] flex items-center justify-center shrink-0">
                    <item.icon
                      className={cn(
                        "shrink-0 transition-colors text-[#837565] group-hover:text-[#9c6402] dark:text-[#cdc5bd] dark:group-hover:text-[#fdfbf7]",
                        item.sizeClass
                      )}
                    />
                  </div>

                  {/* Word next */}
                  <span className="text-[14px] leading-[20px] font-semibold flex-1 text-start truncate text-[#514537] group-hover:text-[#9c6402] dark:text-[#cdc5bd] dark:group-hover:text-[#fdfbf7]">
                    {itemLabel}
                  </span>
                </button>
              );
            }

            const isActive = activeNav
              ? item.id === activeNav
              : item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            const hasChildren =
              item.id === "staff" ||
              item.id === "finance" ||
              item.id === "support" ||
              item.id === "system-settings";

            if (isCollapsed) {
              const targetHref =
                item.id === "staff"
                  ? "/permissions?tab=staff"
                  : item.id === "finance"
                    ? "/invoices"
                    : item.id === "support"
                      ? "/tickets?tab=tickets"
                      : item.id === "system-settings"
                        ? "/settings/general"
                        : item.href;

              return (
                <Link
                  key={item.id}
                  href={targetHref}
                  prefetch={true}
                  onClick={() => handleNavClick(targetHref)}
                  title={itemLabel}
                  className={cn(
                    "size-[44px] rounded-[12px] flex items-center justify-center transition-all duration-200 group relative",
                    isActive
                      ? "bg-[#9c6402] text-white dark:text-[#1c140f] shadow-[0px_2px_4px_rgba(156,100,2,0.25)] dark:shadow-none font-bold"
                      : "text-[#514537] hover:bg-[#fbf7f0] hover:text-[#9c6402] dark:text-[#cdc5bd] dark:hover:bg-[#2c221c]/80 dark:hover:text-[#fdfbf7]"
                  )}
                  data-node-id={isActive ? "1:679" : undefined}
                >
                  <item.icon
                    className={cn(
                      "size-[18px] transition-colors shrink-0",
                      isActive
                        ? "text-white dark:text-[#1c140f]"
                        : "text-[#837565] group-hover:text-[#9c6402] dark:text-[#cdc5bd] dark:group-hover:text-[#fdfbf7]"
                    )}
                  />
                  {item.id === "drafts" && draftCount > 0 && (
                    <span className="absolute -top-1 -end-1 size-4 bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] text-[10px] font-bold rounded-full flex items-center justify-center font-mono leading-none shadow-xs">
                      {draftCount > 9 ? "9+" : draftCount}
                    </span>
                  )}
                </Link>
              );
            }

            return (
              <React.Fragment key={item.id}>
                {hasChildren ? (
                  <div
                    className="flex items-center gap-[12px] px-[12px] py-[8px] rounded-[12px] text-start select-none cursor-default text-[#514537] dark:text-[#cdc5bd]"
                    data-name="nav-parent-header"
                  >
                    {/* Icon first (Right in RTL) */}
                    <div className="size-[20px] flex items-center justify-center shrink-0">
                      <item.icon
                        className={cn(
                          "shrink-0 text-[#837565] dark:text-[#a89f91]",
                          item.sizeClass
                        )}
                      />
                    </div>

                    {/* Word next */}
                    <span className="text-[14px] leading-[20px] font-semibold flex-1 text-start truncate text-[#514537] dark:text-[#cdc5bd]">
                      {itemLabel}
                    </span>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    prefetch={true}
                    onClick={() => handleNavClick(item.href)}
                    className={cn(
                      "flex items-center gap-[12px] px-[12px] py-[8px] rounded-[12px] transition-colors duration-150 group text-start",
                      isActive
                        ? "bg-[#9c6402] text-white dark:text-[#1c140f] shadow-[0px_2px_4px_rgba(156,100,2,0.25)] dark:shadow-none font-bold"
                        : "text-[#514537] hover:bg-[#fbf7f0] hover:text-[#9c6402] dark:text-[#cdc5bd] dark:hover:bg-[#2c221c]/60 dark:hover:text-[#fdfbf7]"
                    )}
                    data-node-id={isActive ? "1:679" : undefined}
                  >
                    {/* Icon first (Right in RTL) */}
                    <div className="size-[20px] flex items-center justify-center shrink-0">
                      <item.icon
                        className={cn(
                          "shrink-0 transition-colors",
                          item.sizeClass,
                          isActive
                            ? "text-white dark:text-[#1c140f]"
                            : "text-[#837565] group-hover:text-[#9c6402] dark:text-[#cdc5bd] dark:group-hover:text-[#fdfbf7]"
                        )}
                      />
                    </div>

                    {/* Word next */}
                    <span
                      className={cn(
                        "text-[14px] leading-[20px] font-semibold flex-1 text-start truncate",
                        isActive ? "text-white dark:text-[#1c140f] font-bold" : "text-[#514537] group-hover:text-[#9c6402] dark:text-[#cdc5bd] dark:group-hover:text-[#fdfbf7]"
                      )}
                    >
                      {itemLabel}
                    </span>

                    {item.id === "drafts" && draftCount > 0 && (
                      <span
                        className={cn(
                          "text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 font-mono transition-colors",
                          isActive
                            ? "bg-white/20 text-white dark:bg-black/20 dark:text-[#1c140f]"
                            : "bg-[#9c6402]/10 text-[#9c6402] dark:bg-[#e29d38]/20 dark:text-[#e29d38]"
                        )}
                      >
                        {draftCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* Sub-items for Staff (فريق العمل والأدوار والصلاحيات) */}
                {item.id === "staff" && (
                  <div className="flex flex-col gap-1 ms-[20px] ps-[12px] border-s-2 border-[#eae8e4] dark:border-[#38271c] my-1">
                    <Link
                      href="/permissions?tab=staff"
                      prefetch={true}
                      onClick={() => handleNavClick("/permissions?tab=staff")}
                      className={cn(
                        "flex items-center gap-[10px] px-[10px] py-[6px] rounded-[8px] text-[13px] font-semibold transition-colors text-start group",
                        isStaffTeamActive
                          ? "text-[#9c6402] font-bold bg-[#fbf7f0] border border-[#ffddb6]/50 dark:text-[#e29d38] dark:bg-[#2c221c]/60 dark:border-transparent"
                          : "text-[#625d5d] hover:bg-[#fbf7f0] hover:text-[#9c6402] dark:text-[#cdc5bd] dark:hover:bg-[#2c221c]/40 dark:hover:text-[#fdfbf7]"
                      )}
                    >
                      {/* Connecting dot */}
                      <span
                        className={cn(
                          "size-[6px] rounded-full shrink-0 transition-all",
                          isStaffTeamActive
                            ? "bg-[#9c6402] shadow-[0_0_6px_#9c6402] dark:bg-[#e29d38] dark:shadow-[0_0_6px_#e29d38]"
                            : "bg-[#c2b8ad] group-hover:bg-[#9c6402] dark:bg-[#625d5d] dark:group-hover:bg-[#a89f91]"
                        )}
                      />
                      <Users
                        className={cn(
                          "size-[15px] shrink-0",
                          isStaffTeamActive
                            ? "text-[#9c6402] dark:text-[#e29d38]"
                            : "text-[#837565] group-hover:text-[#9c6402] dark:text-[#cdc5bd] dark:group-hover:text-[#fdfbf7]"
                        )}
                      />
                      <span className="truncate">{currentLang === "en" ? "Team Members" : "فريق العمل"}</span>
                    </Link>
                    <Link
                      href="/permissions?tab=roles"
                      prefetch={true}
                      onClick={() => handleNavClick("/permissions?tab=roles")}
                      className={cn(
                        "flex items-center gap-[10px] px-[10px] py-[6px] rounded-[8px] text-[13px] font-semibold transition-colors text-start group",
                        isStaffRolesActive
                          ? "text-[#9c6402] font-bold bg-[#fbf7f0] border border-[#ffddb6]/50 dark:text-[#e29d38] dark:bg-[#2c221c]/60 dark:border-transparent"
                          : "text-[#625d5d] hover:bg-[#fbf7f0] hover:text-[#9c6402] dark:text-[#cdc5bd] dark:hover:bg-[#2c221c]/40 dark:hover:text-[#fdfbf7]"
                      )}
                    >
                      {/* Connecting dot */}
                      <span
                        className={cn(
                          "size-[6px] rounded-full shrink-0 transition-all",
                          isStaffRolesActive
                            ? "bg-[#9c6402] shadow-[0_0_6px_#9c6402] dark:bg-[#e29d38] dark:shadow-[0_0_6px_#e29d38]"
                            : "bg-[#c2b8ad] group-hover:bg-[#9c6402] dark:bg-[#625d5d] dark:group-hover:bg-[#a89f91]"
                        )}
                      />
                      <Key
                        className={cn(
                          "size-[15px] shrink-0",
                          isStaffRolesActive
                            ? "text-[#9c6402] dark:text-[#e29d38]"
                            : "text-[#837565] group-hover:text-[#9c6402] dark:text-[#cdc5bd] dark:group-hover:text-[#fdfbf7]"
                        )}
                      />
                      <span className="truncate">{currentLang === "en" ? "Roles & Permissions" : "الأدوار والصلاحيات"}</span>
                    </Link>
                  </div>
                )}

                {/* Sub-items for Finance & Invoices (الباقات والأسعار، الاشتراكات، سجل الفواتير، بوابات الدفع) */}
                {item.id === "finance" && (
                  <div className="flex flex-col gap-1 ms-[20px] ps-[12px] border-s-2 border-[#eae8e4] dark:border-[#38271c] my-1">
                    <Link
                      href="/plans"
                      prefetch={true}
                      onClick={() => handleNavClick("/plans")}
                      className={cn(
                        "flex items-center gap-[10px] px-[10px] py-[6px] rounded-[8px] text-[13px] font-semibold transition-colors text-start group",
                        isPlansActive
                          ? "text-[#9c6402] font-bold bg-[#fbf7f0] border border-[#ffddb6]/50 dark:text-[#e29d38] dark:bg-[#2c221c]/60 dark:border-transparent"
                          : "text-[#625d5d] hover:bg-[#fbf7f0] hover:text-[#9c6402] dark:text-[#cdc5bd] dark:hover:bg-[#2c221c]/40 dark:hover:text-[#fdfbf7]"
                      )}
                    >
                      {/* Connecting dot */}
                      <span
                        className={cn(
                          "size-[6px] rounded-full shrink-0 transition-all",
                          isPlansActive
                            ? "bg-[#9c6402] shadow-[0_0_6px_#9c6402] dark:bg-[#e29d38] dark:shadow-[0_0_6px_#e29d38]"
                            : "bg-[#c2b8ad] group-hover:bg-[#9c6402] dark:bg-[#625d5d] dark:group-hover:bg-[#a89f91]"
                        )}
                      />
                      <Tag
                        className={cn(
                          "size-[15px] shrink-0",
                          isPlansActive
                            ? "text-[#9c6402] dark:text-[#e29d38]"
                            : "text-[#837565] group-hover:text-[#9c6402] dark:text-[#cdc5bd] dark:group-hover:text-[#fdfbf7]"
                        )}
                      />
                      <span className="truncate">{currentLang === "en" ? "Plans & Pricing" : "الباقات والأسعار"}</span>
                    </Link>
                    <Link
                      href="/subscriptions"
                      prefetch={true}
                      onClick={() => handleNavClick("/subscriptions")}
                      className={cn(
                        "flex items-center gap-[10px] px-[10px] py-[6px] rounded-[8px] text-[13px] font-semibold transition-colors text-start group",
                        isSubscriptionsActive
                          ? "text-[#9c6402] font-bold bg-[#fbf7f0] border border-[#ffddb6]/50 dark:text-[#e29d38] dark:bg-[#2c221c]/60 dark:border-transparent"
                          : "text-[#625d5d] hover:bg-[#fbf7f0] hover:text-[#9c6402] dark:text-[#cdc5bd] dark:hover:bg-[#2c221c]/40 dark:hover:text-[#fdfbf7]"
                      )}
                    >
                      {/* Connecting dot */}
                      <span
                        className={cn(
                          "size-[6px] rounded-full shrink-0 transition-all",
                          isSubscriptionsActive
                            ? "bg-[#9c6402] shadow-[0_0_6px_#9c6402] dark:bg-[#e29d38] dark:shadow-[0_0_6px_#e29d38]"
                            : "bg-[#c2b8ad] group-hover:bg-[#9c6402] dark:bg-[#625d5d] dark:group-hover:bg-[#a89f91]"
                        )}
                      />
                      <RefreshCw
                        className={cn(
                          "size-[15px] shrink-0",
                          isSubscriptionsActive
                            ? "text-[#9c6402] dark:text-[#e29d38]"
                            : "text-[#837565] group-hover:text-[#9c6402] dark:text-[#cdc5bd] dark:group-hover:text-[#fdfbf7]"
                        )}
                      />
                      <span className="truncate">{currentLang === "en" ? "Subscriptions" : "الاشتراكات"}</span>
                    </Link>
                    <Link
                      href="/invoices"
                      prefetch={true}
                      onClick={() => handleNavClick("/invoices")}
                      className={cn(
                        "flex items-center gap-[10px] px-[10px] py-[6px] rounded-[8px] text-[13px] font-semibold transition-colors text-start group",
                        isInvoicesActive
                          ? "text-[#9c6402] font-bold bg-[#fbf7f0] border border-[#ffddb6]/50 dark:text-[#e29d38] dark:bg-[#2c221c]/60 dark:border-transparent"
                          : "text-[#625d5d] hover:bg-[#fbf7f0] hover:text-[#9c6402] dark:text-[#cdc5bd] dark:hover:bg-[#2c221c]/40 dark:hover:text-[#fdfbf7]"
                      )}
                    >
                      {/* Connecting dot */}
                      <span
                        className={cn(
                          "size-[6px] rounded-full shrink-0 transition-all",
                          isInvoicesActive
                            ? "bg-[#9c6402] shadow-[0_0_6px_#9c6402] dark:bg-[#e29d38] dark:shadow-[0_0_6px_#e29d38]"
                            : "bg-[#c2b8ad] group-hover:bg-[#9c6402] dark:bg-[#625d5d] dark:group-hover:bg-[#a89f91]"
                        )}
                      />
                      <FileText
                        className={cn(
                          "size-[15px] shrink-0",
                          isInvoicesActive
                            ? "text-[#9c6402] dark:text-[#e29d38]"
                            : "text-[#837565] group-hover:text-[#9c6402] dark:text-[#cdc5bd] dark:group-hover:text-[#fdfbf7]"
                        )}
                      />
                      <span className="truncate">{currentLang === "en" ? "Invoices List" : "سجل الفواتير"}</span>
                    </Link>
                    <Link
                      href="/payment-gateways"
                      prefetch={true}
                      onClick={() => handleNavClick("/payment-gateways")}
                      className={cn(
                        "flex items-center gap-[10px] px-[10px] py-[6px] rounded-[8px] text-[13px] font-semibold transition-colors text-start group",
                        isGatewaysActive
                          ? "text-[#9c6402] font-bold bg-[#fbf7f0] border border-[#ffddb6]/50 dark:text-[#e29d38] dark:bg-[#2c221c]/60 dark:border-transparent"
                          : "text-[#625d5d] hover:bg-[#fbf7f0] hover:text-[#9c6402] dark:text-[#cdc5bd] dark:hover:bg-[#2c221c]/40 dark:hover:text-[#fdfbf7]"
                      )}
                    >
                      {/* Connecting dot */}
                      <span
                        className={cn(
                          "size-[6px] rounded-full shrink-0 transition-all",
                          isGatewaysActive
                            ? "bg-[#9c6402] shadow-[0_0_6px_#9c6402] dark:bg-[#e29d38] dark:shadow-[0_0_6px_#e29d38]"
                            : "bg-[#c2b8ad] group-hover:bg-[#9c6402] dark:bg-[#625d5d] dark:group-hover:bg-[#a89f91]"
                        )}
                      />
                      <CreditCard
                        className={cn(
                          "size-[15px] shrink-0",
                          isGatewaysActive
                            ? "text-[#9c6402] dark:text-[#e29d38]"
                            : "text-[#837565] group-hover:text-[#9c6402] dark:text-[#cdc5bd] dark:group-hover:text-[#fdfbf7]"
                        )}
                      />
                      <span className="truncate">{currentLang === "en" ? "Payment Gateways" : "بوابات الدفع"}</span>
                    </Link>
                  </div>
                )}

                {/* Sub-items for Support (تذاكر الدعم الفني والأقسام) */}
                {item.id === "support" && (
                  <div className="flex flex-col gap-1 ms-[20px] ps-[12px] border-s-2 border-[#eae8e4] dark:border-[#38271c] my-1">
                    <Link
                      href="/tickets?tab=tickets"
                      prefetch={true}
                      onClick={() => handleNavClick("/tickets?tab=tickets")}
                      className={cn(
                        "flex items-center gap-[10px] px-[10px] py-[6px] rounded-[8px] text-[13px] font-semibold transition-colors text-start group",
                        isSupportTicketsActive
                          ? "text-[#9c6402] font-bold bg-[#fbf7f0] border border-[#ffddb6]/50 dark:text-[#e29d38] dark:bg-[#2c221c]/60 dark:border-transparent"
                          : "text-[#625d5d] hover:bg-[#fbf7f0] hover:text-[#9c6402] dark:text-[#cdc5bd] dark:hover:bg-[#2c221c]/40 dark:hover:text-[#fdfbf7]"
                      )}
                    >
                      {/* Connecting dot */}
                      <span
                        className={cn(
                          "size-[6px] rounded-full shrink-0 transition-all",
                          isSupportTicketsActive
                            ? "bg-[#9c6402] shadow-[0_0_6px_#9c6402] dark:bg-[#e29d38] dark:shadow-[0_0_6px_#e29d38]"
                            : "bg-[#c2b8ad] group-hover:bg-[#9c6402] dark:bg-[#625d5d] dark:group-hover:bg-[#a89f91]"
                        )}
                      />
                      <Ticket
                        className={cn(
                          "size-[15px] shrink-0",
                          isSupportTicketsActive
                            ? "text-[#9c6402] dark:text-[#e29d38]"
                            : "text-[#837565] group-hover:text-[#9c6402] dark:text-[#cdc5bd] dark:group-hover:text-[#fdfbf7]"
                        )}
                      />
                      <span className="truncate">{currentLang === "en" ? "Support Tickets" : "تذاكر الدعم الفني"}</span>
                    </Link>
                    <Link
                      href="/tickets?tab=departments"
                      prefetch={true}
                      onClick={() => handleNavClick("/tickets?tab=departments")}
                      className={cn(
                        "flex items-center gap-[10px] px-[10px] py-[6px] rounded-[8px] text-[13px] font-semibold transition-colors text-start group",
                        isSupportDepartmentsActive
                          ? "text-[#9c6402] font-bold bg-[#fbf7f0] border border-[#ffddb6]/50 dark:text-[#e29d38] dark:bg-[#2c221c]/60 dark:border-transparent"
                          : "text-[#625d5d] hover:bg-[#fbf7f0] hover:text-[#9c6402] dark:text-[#cdc5bd] dark:hover:bg-[#2c221c]/40 dark:hover:text-[#fdfbf7]"
                      )}
                    >
                      {/* Connecting dot */}
                      <span
                        className={cn(
                          "size-[6px] rounded-full shrink-0 transition-all",
                          isSupportDepartmentsActive
                            ? "bg-[#9c6402] shadow-[0_0_6px_#9c6402] dark:bg-[#e29d38] dark:shadow-[0_0_6px_#e29d38]"
                            : "bg-[#c2b8ad] group-hover:bg-[#9c6402] dark:bg-[#625d5d] dark:group-hover:bg-[#a89f91]"
                        )}
                      />
                      <Building2
                        className={cn(
                          "size-[15px] shrink-0",
                          isSupportDepartmentsActive
                            ? "text-[#9c6402] dark:text-[#e29d38]"
                            : "text-[#837565] group-hover:text-[#9c6402] dark:text-[#cdc5bd] dark:group-hover:text-[#fdfbf7]"
                        )}
                      />
                      <span className="truncate">{currentLang === "en" ? "Departments" : "الأقسام"}</span>
                    </Link>
                  </div>
                )}

                {/* Sub-items for System Settings (اعدادت عامة، إعدادات الموقع) */}
                {item.id === "system-settings" && (
                  <div className="flex flex-col gap-1 ms-[20px] ps-[12px] border-s-2 border-[#eae8e4] dark:border-[#38271c] my-1">
                    <Link
                      href="/settings/general"
                      prefetch={true}
                      onClick={() => handleNavClick("/settings/general")}
                      className={cn(
                        "flex items-center gap-[10px] px-[10px] py-[6px] rounded-[8px] text-[13px] font-semibold transition-colors text-start group",
                        isGeneralActive
                          ? "text-[#9c6402] font-bold bg-[#fbf7f0] border border-[#ffddb6]/50 dark:text-[#e29d38] dark:bg-[#2c221c]/60 dark:border-transparent"
                          : "text-[#625d5d] hover:bg-[#fbf7f0] hover:text-[#9c6402] dark:text-[#cdc5bd] dark:hover:bg-[#2c221c]/40 dark:hover:text-[#fdfbf7]"
                      )}
                    >
                      <span
                        className={cn(
                          "size-[6px] rounded-full shrink-0 transition-all",
                          isGeneralActive
                            ? "bg-[#9c6402] shadow-[0_0_6px_#9c6402] dark:bg-[#e29d38] dark:shadow-[0_0_6px_#e29d38]"
                            : "bg-[#c2b8ad] group-hover:bg-[#9c6402] dark:bg-[#625d5d] dark:group-hover:bg-[#a89f91]"
                        )}
                      />
                      <SlidersHorizontal
                        className={cn(
                          "size-[15px] shrink-0",
                          isGeneralActive
                            ? "text-[#9c6402] dark:text-[#e29d38]"
                            : "text-[#837565] group-hover:text-[#9c6402] dark:text-[#cdc5bd] dark:group-hover:text-[#fdfbf7]"
                        )}
                      />
                      <span className="truncate">{currentLang === "en" ? "General Settings" : "اعدادات عامة"}</span>
                    </Link>

                    <Link
                      href="/website-settings"
                      prefetch={true}
                      onClick={() => handleNavClick("/website-settings")}
                      className={cn(
                        "flex items-center gap-[10px] px-[10px] py-[6px] rounded-[8px] text-[13px] font-semibold transition-colors text-start group",
                        isWebsiteActive
                          ? "text-[#9c6402] font-bold bg-[#fbf7f0] border border-[#ffddb6]/50 dark:text-[#e29d38] dark:bg-[#2c221c]/60 dark:border-transparent"
                          : "text-[#625d5d] hover:bg-[#fbf7f0] hover:text-[#9c6402] dark:text-[#cdc5bd] dark:hover:bg-[#2c221c]/40 dark:hover:text-[#fdfbf7]"
                      )}
                    >
                      <span
                        className={cn(
                          "size-[6px] rounded-full shrink-0 transition-all",
                          isWebsiteActive
                            ? "bg-[#9c6402] shadow-[0_0_6px_#9c6402] dark:bg-[#e29d38] dark:shadow-[0_0_6px_#e29d38]"
                            : "bg-[#c2b8ad] group-hover:bg-[#9c6402] dark:bg-[#625d5d] dark:group-hover:bg-[#a89f91]"
                        )}
                      />
                      <Globe
                        className={cn(
                          "size-[15px] shrink-0",
                          isWebsiteActive
                            ? "text-[#9c6402] dark:text-[#e29d38]"
                            : "text-[#837565] group-hover:text-[#9c6402] dark:text-[#cdc5bd] dark:group-hover:text-[#fdfbf7]"
                        )}
                      />
                      <span className="truncate">{currentLang === "en" ? "Site Settings" : "إعدادات الموقع"}</span>
                    </Link>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Profile Section with Logout Icon */}
      <div
        className={cn(
          "border-t border-[#eae8e4] dark:border-[#2c221c] bg-[#faf8f5] dark:bg-[#16100c] shrink-0 transition-all duration-300",
          isCollapsed ? "p-2 flex flex-col items-center gap-2" : "p-2 flex items-center justify-between gap-1.5"
        )}
        data-node-id="1:744-user-profile"
      >
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2">
            {/* Collapsed Mode: User Avatar Link to Profile */}
            <Link
              href="/profile"
              prefetch={true}
              onClick={() => handleNavClick("/profile")}
              title={currentLang === "en" ? "Profile - Eng. Abdulaziz Bin Fahad" : "الملف الشخصي - م. عبد العزيز بن فهد"}
              className="size-[38px] rounded-full overflow-hidden border border-[#9c6402] hover:border-[#b47818] hover:ring-2 hover:ring-[#9c6402]/40 dark:hover:ring-[#e29d38]/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center shrink-0 relative group shadow-2xs cursor-pointer"
            >
              <Image
                src={userAvatarImg}
                alt={currentLang === "en" ? "Eng. Abdulaziz Bin Fahad" : "م. عبد العزيز بن فهد"}
                width={38}
                height={38}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
              />
              <span className="absolute bottom-0 end-0 size-[8px] rounded-full bg-[#10b981] border border-white dark:border-[#16100c]" />
            </Link>

            {/* Collapsed Mode: Circular Logout Button */}
            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(true)}
              title={currentLang === "en" ? "Logout" : "تسجيل الخروج"}
              aria-label={currentLang === "en" ? "Logout" : "تسجيل الخروج"}
              className="size-[34px] rounded-full bg-white dark:bg-[#281c15] border border-[#eae8e4] dark:border-[#3b2a1f] hover:border-[#ba1a1a] hover:bg-[#ba1a1a]/15 dark:hover:bg-[#ba1a1a]/25 text-[#837565] dark:text-[#8e8680] hover:text-[#dc2626] dark:hover:text-[#f87171] hover:ring-2 hover:ring-[#ba1a1a]/20 dark:hover:ring-[#ba1a1a]/30 hover:scale-105 active:scale-95 flex items-center justify-center transition-all cursor-pointer shadow-2xs group/logout"
            >
              <LogOut className="size-[15px] transition-transform duration-200 group-hover/logout:-translate-x-0.5 rtl:group-hover/logout:translate-x-0.5" />
            </button>
          </div>
        ) : (
          /* Expanded Mode: Large Oval / Pill Box Container */
          <div className="w-full bg-white dark:bg-[#221812] border border-[#eae8e4] dark:border-[#38271c] rounded-full p-1.5 ps-2 pe-1.5 flex items-center justify-between gap-1.5 shadow-xs transition-colors">
            {/* User Info Link (Avatar + Name + Role) leading to /profile */}
            <Link
              href="/profile"
              prefetch={true}
              onClick={() => handleNavClick("/profile")}
              title={currentLang === "en" ? "View Profile" : "فتح الملف الشخصي"}
              className="flex items-center gap-2.5 flex-1 min-w-0 text-start group/user cursor-pointer px-2 py-1 -ms-0.5 rounded-full hover:bg-[#f5f3ef]/80 dark:hover:bg-[#2d1f17] active:scale-[0.98] transition-all duration-200"
            >
              <div className="relative size-[34px] rounded-full overflow-hidden border border-[#9c6402] shrink-0 transition-all duration-200 group-hover/user:border-[#b47818] group-hover/user:ring-2 group-hover/user:ring-[#9c6402]/50 dark:group-hover/user:ring-[#e29d38]/50 group-hover/user:scale-105 shadow-2xs">
                <Image
                  src={userAvatarImg}
                  alt={currentLang === "en" ? "Eng. Abdulaziz Bin Fahad" : "م. عبد العزيز بن فهد"}
                  width={34}
                  height={34}
                  className="w-full h-full object-cover group-hover/user:scale-110 transition-transform duration-200"
                />
                <span className="absolute bottom-0 end-0 size-[7px] rounded-full bg-[#10b981] border border-white dark:border-[#16100c]" />
              </div>
              <div className="flex flex-col min-w-0 text-start">
                <span className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] truncate group-hover/user:text-[#9c6402] dark:group-hover/user:text-[#e29d38] transition-colors leading-[18px]">
                  {currentLang === "en" ? "Eng. Abdulaziz Bin Fahad" : "م. عبد العزيز بن فهد"}
                </span>
                <span className="text-[10px] text-[#837565] dark:text-[#8e8680] truncate leading-[14px]">
                  {currentLang === "en" ? "General System Admin" : "مشرف النظام العام"}
                </span>
              </div>
            </Link>

            {/* Single Circular Logout Button */}
            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(true)}
              title={currentLang === "en" ? "Logout" : "تسجيل الخروج"}
              aria-label={currentLang === "en" ? "Logout" : "تسجيل الخروج"}
              className="size-[32px] rounded-full bg-[#f5f3ef] dark:bg-[#2d1f17] border border-[#eae8e4] dark:border-[#443023] hover:border-[#ba1a1a] hover:bg-[#ba1a1a]/15 dark:hover:bg-[#ba1a1a]/25 text-[#837565] dark:text-[#a89f91] hover:text-[#dc2626] dark:hover:text-[#f87171] hover:ring-2 hover:ring-[#ba1a1a]/25 dark:hover:ring-[#ba1a1a]/35 hover:scale-110 active:scale-95 flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 shadow-2xs group/logout"
            >
              <LogOut className="size-[15px] transition-transform duration-200 group-hover/logout:-translate-x-0.5 rtl:group-hover/logout:translate-x-0.5" />
            </button>
          </div>
        )}
      </div>

      {/* Logout Question Confirmation Popup Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </aside>
  );
}
