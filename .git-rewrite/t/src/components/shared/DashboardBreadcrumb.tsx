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

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface DashboardBreadcrumbProps {
  customItems?: BreadcrumbSegment[];
  className?: string;
}

// Known route translations for the platform
const ROUTE_LABELS: Record<string, string> = {
  "": "الرئيسية",
  "law-firms": "مكاتب المحاماة",
  "subscriptions": "إدارة الاشتراكات",
  "plans": "باقات الاشتراك",
  "invoices": "الفواتير وطرق الدفع",
  "roles": "الأدوار والصلاحيات",
  "permissions": "مصفوفة الصلاحيات",
  "tickets": "الدعم الفني والتذاكر",
  "accounts": "الحسابات المالية",
  "staff": "طاقم العمل",
  "profile": "الملف الشخصي",
  "notifications": "مركز الإشعارات",
  "settings": "إعدادات النظام",
  "general": "الإعدادات العامة",
};

export function DashboardBreadcrumb({ customItems, className }: DashboardBreadcrumbProps) {
  const pathname = usePathname();

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

  // If on root dashboard page
  if (segments.length === 0) {
    return (
      <Breadcrumb className={cn("select-none", className)}>
        <BreadcrumbList className="flex items-center gap-1.5 text-xs text-[#78716c] dark:text-[#a8a29e]">
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1.5">
              <Home className="size-3.5 text-[#9c6402]" />
              <span>الرئيسية</span>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  const breadcrumbs: { label: string; href?: string }[] = [
    { label: "الرئيسية", href: "/" },
  ];

  let accumulatedPath = "";
  segments.forEach((seg, idx) => {
    accumulatedPath += `/${seg}`;
    const label = ROUTE_LABELS[seg] || decodeURIComponent(seg);
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
