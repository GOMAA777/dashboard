"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import logoMarkImg from "../../../../public/figma/logo-mark.png";
import userAvatarImg from "../../../../public/figma/user-avatar.png";
import {
  AppWindow,
  Bell,
  CreditCard,
  Globe,
  Headphones,
  LayoutGrid,
  Mail,
  Receipt,
  Settings,
  Tag,
  UserCheck,
  Users,
  Key,
  ChevronLeft,
  LogIn,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/use-ui-store";
import { LogoutConfirmModal } from "./LogoutConfirmModal";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  sizeClass: string;
}

const navItems: NavItem[] = [
  { id: "home", label: "الرئيسية", href: "/", icon: LayoutGrid, sizeClass: "size-[16px]" },
  { id: "clients", label: "إدارة العملاء", href: "/accounts", icon: Users, sizeClass: "size-[18px]" },
  { id: "plans", label: "الباقات والأسعار", href: "/plans", icon: Tag, sizeClass: "size-[17px]" },
  { id: "subscriptions", label: "الاشتراكات", href: "/subscriptions", icon: CreditCard, sizeClass: "size-[17px]" },
  { id: "staff", label: "طاقم العمل", href: "/permissions", icon: UserCheck, sizeClass: "size-[19px]" },
  { id: "notifications", label: "الإشعارات", href: "/notifications", icon: Bell, sizeClass: "size-[16px]" },
  { id: "finance", label: "المعاملات المالية", href: "/invoices", icon: Receipt, sizeClass: "size-[16px]" },
  { id: "support", label: "الدعم الفني", href: "/tickets", icon: Headphones, sizeClass: "size-[17px]" },
  { id: "site-settings", label: "إعدادات الموقع", href: "/integrations", icon: Globe, sizeClass: "size-[17px]" },
  { id: "mail-settings", label: "إعدادات البريد", href: "/payment-gateways", icon: Mail, sizeClass: "size-[17px]" },
  { id: "system-settings", label: "إعدادات النظام", href: "/menus", icon: Settings, sizeClass: "size-[17px]" },
  { id: "utility", label: "utility", href: "/trials", icon: AppWindow, sizeClass: "size-[19px]" },
];

interface DashboardSidebarProps {
  activeNav?: string;
  activeSubNav?: "staff" | "roles";
}

export function DashboardSidebar({ activeNav, activeSubNav }: DashboardSidebarProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const toggleSidebarCollapsed = useUIStore((state) => state.toggleSidebarCollapsed);

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const isCollapsed = isMounted ? sidebarCollapsed : false;

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    toast.success("تم تسجيل الخروج بنجاح");
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "relative shrink-0 h-screen h-dvh sticky top-0 bg-[#1c140f] flex flex-col justify-between border-s border-[#2c221c] drop-shadow-[0px_1px_4px_rgba(0,0,0,0.04)] select-none z-30 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[72px]" : "w-[240px]"
      )}
      data-node-id="1:667"
      data-name="Aside"
    >
      {/* Sidebar Collapse/Expand Toggle Button on the boundary */}
      <button
        type="button"
        onClick={toggleSidebarCollapsed}
        aria-label={isCollapsed ? "توسيع القائمة الجانبية" : "تصغير القائمة الجانبية"}
        title={isCollapsed ? "توسيع القائمة الجانبية" : "تصغير القائمة الجانبية"}
        className="absolute top-[20px] left-0 -translate-x-1/2 z-40 size-[26px] bg-white hover:bg-[#f5f3ef] text-[#514537] hover:text-[#1b1c1a] border border-[#ded5c6] rounded-full shadow-[0px_2px_5px_rgba(0,0,0,0.15)] flex items-center justify-center transition-all cursor-pointer focus:outline-none"
      >
        <ChevronLeft
          className={cn(
            "size-[14px] text-[#514537] transition-transform duration-300",
            isCollapsed && "rotate-180"
          )}
        />
      </button>

      {/* Top Section: Logo & Nav List */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Brand Header */}
        <div
          className={cn(
            "h-[64px] border-b border-[#2c221c] flex items-center shrink-0 transition-all duration-300",
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
              className="size-[34px] flex items-center justify-center shrink-0"
              title={isCollapsed ? "الجودي - لوحة الإدارة العليا" : undefined}
            >
              <Image
                src={logoMarkImg}
                alt="الجودي"
                width={34}
                height={34}
                className="w-full h-full object-contain"
                priority
              />
            </div>

            {/* Logo Word / Titles (hidden when collapsed) */}
            {!isCollapsed && (
              <div className="flex flex-col items-start text-right overflow-hidden whitespace-nowrap gap-[4px]">
                <span className="font-bold text-[#fdfbf7] text-[18px] leading-[22px] font-sans">
                  الجودي
                </span>
                <span className="font-bold text-[#b9b3ae] text-[10px] leading-[14px]">
                  لوحة الإدارة العليا
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
            const isActive = activeNav
              ? item.id === activeNav
              : item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            if (isCollapsed) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  title={item.label}
                  className={cn(
                    "size-[44px] rounded-[12px] flex items-center justify-center transition-all duration-200 group relative",
                    isActive
                      ? "bg-[#9c6402] text-[#1c140f] shadow-sm"
                      : "text-[#cdc5bd] hover:bg-[#2c221c]/80 hover:text-[#fdfbf7]"
                  )}
                  data-node-id={isActive ? "1:679" : undefined}
                >
                  <item.icon
                    className={cn(
                      "size-[18px] transition-colors shrink-0",
                      isActive
                        ? "text-[#1c140f]"
                        : "text-[#cdc5bd] group-hover:text-[#fdfbf7]"
                    )}
                  />
                </Link>
              );
            }

            return (
              <React.Fragment key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-[12px] py-[8px] rounded-[12px] transition-colors duration-150 group text-right",
                    isActive
                      ? "bg-[#9c6402] text-[#1c140f]"
                      : "text-[#cdc5bd] hover:bg-[#2c221c]/60 hover:text-[#fdfbf7]"
                  )}
                  data-node-id={isActive ? "1:679" : undefined}
                >
                  {/* Label on start (right in RTL) */}
                  <span
                    className={cn(
                      "text-[14px] leading-[20px] font-semibold flex-1 text-right truncate",
                      isActive ? "text-[#1c140f] font-bold" : "text-[#cdc5bd] group-hover:text-[#fdfbf7]"
                    )}
                  >
                    {item.label}
                  </span>

                  {/* Icon on end */}
                  <div className="size-[22px] flex items-center justify-center shrink-0 ms-2">
                    <item.icon
                      className={cn(
                        "shrink-0 transition-colors",
                        item.sizeClass,
                        isActive
                          ? "text-[#1c140f]"
                          : "text-[#cdc5bd] group-hover:text-[#fdfbf7]"
                      )}
                    />
                  </div>
                </Link>

                {/* Sub-items for Staff (فريق العمل والأدوار والصلاحيات) matching Figma 1:8875 and 1:11530 */}
                {item.id === "staff" && isActive && (
                  <div className="flex flex-col gap-1 pr-3 pl-1 py-1">
                    <Link
                      href="/permissions?tab=staff"
                      className={cn(
                        "flex items-center justify-between px-[12px] py-[6px] rounded-[8px] text-[13px] font-semibold transition-colors text-right",
                        activeSubNav === "roles"
                          ? "text-[#cdc5bd] hover:text-[#fdfbf7]"
                          : "text-[#e29d38] font-bold"
                      )}
                    >
                      <span className="flex-1 text-right">فريق العمل</span>
                      <Users className="size-[15px] ms-2 shrink-0" />
                    </Link>
                    <Link
                      href="/permissions?tab=roles"
                      className={cn(
                        "flex items-center justify-between px-[12px] py-[6px] rounded-[8px] text-[13px] font-semibold transition-colors text-right",
                        activeSubNav === "roles"
                          ? "text-[#e29d38] font-bold"
                          : "text-[#cdc5bd] hover:text-[#fdfbf7]"
                      )}
                    >
                      <span className="flex-1 text-right">الأدوار والصلاحيات</span>
                      <Key className="size-[15px] ms-2 shrink-0" />
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
          "border-t border-[#2c221c] bg-[#16100c] shrink-0 transition-all duration-300",
          isCollapsed ? "p-2 flex flex-col items-center gap-2" : "p-2 flex items-center justify-between gap-1.5"
        )}
        data-node-id="1:744-user-profile"
      >
        {isCollapsed ? (
          <>
            {/* Collapsed Mode: User Avatar Link to Login Page */}
            <Link
              href="/login"
              title="فتح صفحة تسجيل الدخول (/login) - م. عبد العزيز بن فهد"
              className="size-[38px] rounded-full overflow-hidden border border-[#9c6402]/40 hover:border-[#9c6402] transition-colors flex items-center justify-center shrink-0 relative group"
            >
              <Image
                src={userAvatarImg}
                alt="م. عبد العزيز بن فهد"
                width={38}
                height={38}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute bottom-0 end-0 size-[8px] rounded-full bg-[#10b981] border border-[#16100c]" />
            </Link>

            {/* Collapsed Mode: Logout Icon Button (Click opens question popup) */}
            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(true)}
              title="تسجيل الخروج"
              aria-label="تسجيل الخروج"
              className="size-[34px] rounded-[8px] flex items-center justify-center text-[#8e8680] hover:text-[#f87171] hover:bg-[#2c221c] transition-colors cursor-pointer"
            >
              <LogOut className="size-[16px]" />
            </button>
          </>
        ) : (
          <>
            {/* Expanded Mode: Integrated User Profile Card (Click opens /login) */}
            <Link
              href="/login"
              title="فتح صفحة تسجيل الدخول (/login)"
              className="flex items-center gap-2.5 p-1.5 rounded-[8px] hover:bg-[#2c221c]/70 transition-colors flex-1 min-w-0 text-right group cursor-pointer"
            >
              <div className="relative size-[34px] rounded-full overflow-hidden border border-[#9c6402]/40 shrink-0">
                <Image
                  src={userAvatarImg}
                  alt="م. عبد العزيز بن فهد"
                  width={34}
                  height={34}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-0 end-0 size-[7px] rounded-full bg-[#10b981] border border-[#16100c]" />
              </div>
              <div className="flex flex-col min-w-0 text-right">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-semibold text-[#fdfbf7] truncate group-hover:text-[#e29d38] transition-colors">
                    م. عبد العزيز بن فهد
                  </span>
                  <LogIn className="size-[12px] text-[#8e8680] group-hover:text-[#e29d38] transition-colors shrink-0" />
                </div>
                <span className="text-[10px] text-[#8e8680] truncate">
                  مشرف النظام العام
                </span>
              </div>
            </Link>

            {/* Expanded Mode: Logout Icon Button (Click opens question popup modal) */}
            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(true)}
              title="تسجيل الخروج"
              aria-label="تسجيل الخروج"
              className="size-[32px] rounded-[8px] flex items-center justify-center text-[#8e8680] hover:text-[#f87171] hover:bg-[#2c221c] transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="size-[16px]" />
            </button>
          </>
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
