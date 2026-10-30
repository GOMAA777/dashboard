"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

import { useUIStore } from "@/stores/use-ui-store";

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface DashboardBreadcrumbProps {
  customItems?: BreadcrumbSegment[];
  className?: string;
}

// Known route translations for the platform
const ROUTE_LABELS: Record<string, { ar: string; en: string }> = {
  "": { ar: "الرئيسية", en: "Dashboard" },
  "law-firms": { ar: "مكاتب المحاماة", en: "Law Firms" },
  "subscriptions": { ar: "إدارة الاشتراكات", en: "Subscriptions" },
  "plans": { ar: "باقات الاشتراك", en: "Plans & Pricing" },
  "invoices": { ar: "المعاملات المالية", en: "Invoices & Finance" },
  "roles": { ar: "الأدوار والصلاحيات", en: "Roles & Permissions" },
  "permissions": { ar: "طاقم العمل والصلاحيات", en: "Staff & Permissions" },
  "tickets": { ar: "الدعم الفني والتذاكر", en: "Technical Support" },
  "accounts": { ar: "إدارة العملاء", en: "Client Management" },
  "staff": { ar: "طاقم العمل", en: "Staff" },
  "profile": { ar: "الملف الشخصي", en: "Profile" },
  "notifications": { ar: "مركز الإشعارات", en: "Notifications" },
  "settings": { ar: "إعدادات النظام", en: "System Settings" },
  "general": { ar: "الإعدادات العامة", en: "General Settings" },
  "currency": { ar: "إعدادات العملة", en: "Currency Settings" },
  "language": { ar: "إعدادات اللغة", en: "Language Settings" },
  "website-settings": { ar: "إعدادات الموقع", en: "Site Settings" },
  "website": { ar: "إعدادات الموقع", en: "Site Settings" },
  "utility": { ar: "تحديث النظام", en: "System Update" },
  "update": { ar: "تحديث النظام", en: "System Update" },
  "server-info": { ar: "معلومات السيرفر", en: "Server Information" },
  "seo": { ar: "تهيئة محركات البحث (SEO)", en: "Search Engine Optimization (SEO)" },
};

export function DashboardBreadcrumb({ customItems, className }: DashboardBreadcrumbProps) {
  const pathname = usePathname();
  const language = useUIStore((state) => state.language);
  const isEn = language === "en";

  // If custom items are provided, render them directly
  if (customItems && customItems.length > 0) {
    return (
      <Breadcrumb className={cn("select-none", className)}>
        <BreadcrumbList className="flex items-center gap-1.5 text-xs text-[#78716c] dark:text-[#a8a29e]">
          {customItems.map((item, index) => {
            const isLast = index === customItems.length - 1;
            return (
              <React.Fragment key={item.label + index}>
                {index > 0 && (
                  <BreadcrumbSeparator className="text-[#a8a29e] dark:text-[#645e57]">
                    <ChevronLeft className="size-3 rtl:rotate-0 ltr:rotate-180" />
                  </BreadcrumbSeparator>
                )}
                <BreadcrumbItem>
                  {isLast || !item.href ? (
                    <BreadcrumbPage className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1.5">
                      {index === 0 && <Home className="size-3.5 text-[#9c6402]" />}
                      <span>{item.label}</span>
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      render={<Link href={item.href} />}
                      className="hover:text-[#9c6402] dark:hover:text-[#d4a759] transition-colors flex items-center gap-1.5"
                    >
                      {index === 0 && <Home className="size-3.5 text-[#9c6402]" />}
                      <span>{item.label}</span>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Otherwise, automatically derive from current pathname
  const segments = (pathname || "").split("/").filter(Boolean);
  const homeLabel = isEn ? "Dashboard" : "الرئيسية";

  // If on root dashboard page
  if (segments.length === 0) {
    return (
      <Breadcrumb className={cn("select-none", className)}>
        <BreadcrumbList className="flex items-center gap-1.5 text-xs text-[#78716c] dark:text-[#a8a29e]">
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1.5">
              <Home className="size-3.5 text-[#9c6402]" />
              <span>{homeLabel}</span>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  const breadcrumbs: { label: string; href?: string }[] = [
    { label: homeLabel, href: "/" },
  ];

  let accumulatedPath = "";
  segments.forEach((seg, idx) => {
    accumulatedPath += `/${seg}`;
    const route = ROUTE_LABELS[seg];
    const label = route ? (isEn ? route.en : route.ar) : decodeURIComponent(seg);
    const isLast = idx === segments.length - 1;
    breadcrumbs.push({
      label,
      href: isLast ? undefined : accumulatedPath,
    });
  });

  return (
    <Breadcrumb className={cn("select-none", className)}>
      <BreadcrumbList className="flex items-center gap-1.5 text-xs text-[#78716c] dark:text-[#a8a29e]">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <React.Fragment key={item.label + index}>
              {index > 0 && (
                <BreadcrumbSeparator className="text-[#a8a29e] dark:text-[#645e57]">
                  <ChevronLeft className="size-3 rtl:rotate-0 ltr:rotate-180" />
                </BreadcrumbSeparator>
              )}
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1.5">
                    {index === 0 && <Home className="size-3.5 text-[#9c6402]" />}
                    <span>{item.label}</span>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={<Link href={item.href} />}
                    className="hover:text-[#9c6402] dark:hover:text-[#d4a759] transition-colors flex items-center gap-1.5"
                  >
                    {index === 0 && <Home className="size-3.5 text-[#9c6402]" />}
                    <span>{item.label}</span>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
