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
  "payment-gateways": { ar: "طرق الدفع", en: "Payment Gateways" },
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

  // Normalize custom items if passed:
  // If custom items begin with "/" (Home/الرئيسية) and contain sub-items,
  // drop the home segment so the parent section remains the sole root.
  const effectiveItems = React.useMemo(() => {
    if (!customItems || customItems.length === 0) return null;
    if (
      customItems.length > 1 &&
      (customItems[0].href === "/" ||
        customItems[0].label === "الرئيسية" ||
        customItems[0].label === "Dashboard")
    ) {
      return customItems.slice(1);
    }
    return customItems;
  }, [customItems]);

  const segments = (pathname || "").split("/").filter(Boolean);
  const homeLabel = isEn ? "Dashboard" : "الرئيسية";

  // Derive breadcrumb items hierarchy
  const breadcrumbs: { label: string; href?: string; isHome?: boolean }[] = React.useMemo(() => {
    if (effectiveItems && effectiveItems.length > 0) {
      return effectiveItems.map((item) => ({
        ...item,
        isHome: item.label === "الرئيسية" || item.label === "Dashboard",
      }));
    }

    // Root path "/"
    if (segments.length === 0) {
      return [{ label: homeLabel, isHome: true }];
    }

    // Main top-level routes (e.g. "/accounts", "/law-firms", "/tickets")
    // Each main route is treated as its own root/parent.
    const items: { label: string; href?: string; isHome?: boolean }[] = [];
    let accumulatedPath = "";

    segments.forEach((seg, idx) => {
      accumulatedPath += `/${seg}`;
      const route = ROUTE_LABELS[seg];
      const label = route ? (isEn ? route.en : route.ar) : decodeURIComponent(seg);
      const isLast = idx === segments.length - 1;

      items.push({
        label,
        href: isLast ? undefined : accumulatedPath,
        isHome: false,
      });
    });

    return items;
  }, [effectiveItems, segments, homeLabel, isEn]);

  return (
    <Breadcrumb className={cn("select-none", className)}>
      <BreadcrumbList className="flex items-center gap-1.5 text-xs text-[#78716c] dark:text-[#a8a29e]">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isHome = Boolean(item.isHome);

          return (
            <React.Fragment key={item.label + index}>
              {index > 0 && (
                <BreadcrumbSeparator className="text-[#a8a29e] dark:text-[#645e57]">
                  <ChevronLeft className="size-3.5 rtl:rotate-0 ltr:rotate-180" />
                </BreadcrumbSeparator>
              )}
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#9c6402]/10 text-[#9c6402] dark:text-[#f3c27e] dark:bg-[#9c6402]/20 border border-[#9c6402]/25 font-bold text-xs shadow-2xs">
                    {isHome && <Home className="size-3.5 text-[#9c6402] dark:text-[#f3c27e] shrink-0" />}
                    <span>{item.label}</span>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={<Link href={item.href} />}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[5px] text-xs font-semibold text-[#645e57] dark:text-[#a8a29e] hover:text-[#9c6402] dark:hover:text-[#f3c27e] hover:bg-[#9c6402]/8 dark:hover:bg-[#9c6402]/15 transition-all cursor-pointer"
                  >
                    {isHome && <Home className="size-3.5 text-[#9c6402] shrink-0" />}
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
