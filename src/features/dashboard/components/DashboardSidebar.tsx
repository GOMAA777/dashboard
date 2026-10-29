"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logoMarkImg from "../../../../public/figma/logo-mark.png";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-[240px] shrink-0 h-screen bg-[#1c140f] flex flex-col justify-between border-s border-[#2c221c] drop-shadow-[0px_1px_4px_rgba(0,0,0,0.04)] select-none z-30"
      data-node-id="1:667"
      data-name="Aside"
    >
      {/* Top Section: Logo & Nav List */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Brand Header */}
        <div
          className="h-[64px] border-b border-[#2c221c] px-4 flex items-center justify-between shrink-0"
          data-node-id="1:669"
        >
          {/* Logo Mark + Titles */}
          <div className="flex items-center gap-3 w-full justify-between">
            {/* Titles */}
            <div className="flex flex-col items-start text-right">
              <span className="font-bold text-[#fdfbf7] text-[18px] leading-[22.5px] font-sans">
                الجودي
              </span>
              <span className="font-bold text-[#b9b3ae] text-[10px] leading-[14px]">
                لوحة الإدارة العليا
              </span>
            </div>

            {/* Logo Badge */}
            <div className="size-[32px] rounded-[4px] bg-[rgba(156,100,2,0.5)] flex items-center justify-center overflow-hidden shrink-0">
              <Image
                src={logoMarkImg}
                alt="الجودي"
                width={32}
                height={32}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav
          className="flex-1 overflow-y-auto px-[4px] py-[8px] flex flex-col gap-[2px] scrollbar-thin"
          data-node-id="1:678"
        >
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.id}
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
                    "text-[14px] leading-[20px] font-semibold flex-1 text-right",
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
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer: Server Status & Version */}
      <div
        className="h-[35px] bg-[#16100c] border-t border-[#2c221c] px-[12px] flex items-center justify-between shrink-0"
        data-node-id="1:744"
      >
        <span className="font-bold text-[#8e8680] text-[10px] leading-[14px]">
          v2.4.0
        </span>
        <div className="flex items-center gap-[6px]">
          <span className="font-bold text-[#cdc5bd] text-[10px] leading-[14px]">
            الخوادم: مستقرة 99.9%
          </span>
          <span className="size-[8px] rounded-full bg-[#10b981] inline-block animate-pulse shrink-0" />
        </div>
      </div>
    </aside>
  );
}
