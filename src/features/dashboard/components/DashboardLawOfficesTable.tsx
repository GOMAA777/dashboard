"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MoreVertical,
  Scale,
  Timer,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ClientRowActionMenu } from "@/features/clients/components/ClientRowActionMenu";
import { useUIStore } from "@/stores/use-ui-store";

export interface LawOfficeRow {
  id: string;
  initialAr: string;
  initialEn: string;
  initialBg: string;
  initialText: string;
  logo?: string;
  nameAr: string;
  nameEn: string;
  licenseAr: string;
  licenseEn: string;
  code: string;
  ownerAr: string;
  ownerEn: string;
  planAr: string;
  planEn: string;
  planBadgeClass: string;
  registrationDateAr: string;
  registrationDateEn: string;
  accountStatus: {
    labelAr: string;
    labelEn: string;
    bgClass: string;
    textClass: string;
    dotClass: string;
  };
  subscriptionStatus: {
    labelAr: string;
    labelEn: string;
    bgClass: string;
    textClass: string;
    icon?: React.ComponentType<{ className?: string }>;
    dotColor?: string;
  };
}

const officesData: LawOfficeRow[] = [];


interface DashboardLawOfficesTableProps {
  offices?: LawOfficeRow[];
}

export function DashboardLawOfficesTable({ offices: externalOffices }: DashboardLawOfficesTableProps = {}) {
  const router = useRouter();
  const [openMenuRowId, setOpenMenuRowId] = useState<string | null>(null);

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const language = useUIStore((state) => state.language);
  const direction = useUIStore((state) => state.direction);
  const currentLang = isMounted ? language : "ar";
  const isRTL = isMounted ? direction === "rtl" : true;

  const LinkIcon = isRTL ? ArrowLeft : ArrowRight;
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});

  // Display top 5 recently registered law offices
  const displayedOffices = (externalOffices || officesData).slice(0, 5);

  return (
    <div
      className="bg-white dark:bg-[#221812] rounded-[8px] p-[24px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] border border-[#f0eeea]/70 dark:border-[#38271c] flex flex-col justify-between w-full"
      data-node-id="1:230"
      data-name="Section 4: Recently Registered Law Offices Table"
    >
      {/* Header Bar */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-[20px]"
        data-node-id="1:231"
      >
        {/* Title & Subtitle with Icon in the front */}
        <div className="flex items-center gap-[12px]" data-node-id="1:234">
          <div className="size-[38px] rounded-[8px] bg-[#fbf6ee] dark:bg-[#2d1f16] border border-[#f5e3c8] dark:border-[#4d3627]/60 flex items-center justify-center shrink-0 shadow-2xs">
            <Scale className="size-[19px] block text-[#9c6402] dark:text-[#e29d38]" />
          </div>

          <div className="flex flex-col text-start">
            <h2
              className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[18px] leading-[26px] font-bold font-sans"
              data-node-id="1:236"
            >
              {currentLang === "en" ? "Recently Registered Law Offices" : "المكاتب المسجلة حديثاً"}
            </h2>
            <p
              className="text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[18px] font-normal"
              data-node-id="1:238"
            >
              {currentLang === "en"
                ? "Latest law firms and legal entities joining Al-Joudi platform"
                : "آخر مكاتب وشركات المحاماة المنضمة لمنصة الجودي القضائية"}
            </p>
          </div>
        </div>

        {/* View All Link (Navigates to Client Management) */}
        <Link
          href="/accounts"
          className="flex items-center gap-[6px] text-[#9c6402] dark:text-[#e29d38] hover:text-[#b47818] transition-colors group cursor-pointer"
          data-node-id="1:233"
        >
          <div className="size-[11px] flex items-center justify-center shrink-0">
            <LinkIcon className="size-[11px] block text-[#9c6402] dark:text-[#e29d38] transition-transform group-hover:scale-110" />
          </div>
          <span className="text-[12px] leading-[16px] font-bold">
            {currentLang === "en" ? "View All Offices" : "عرض كل المكاتب"}
          </span>
        </Link>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto scrollbar-thin w-full max-w-full" data-node-id="1:246">
        <table className="w-full text-start border-collapse min-w-[880px]">
          {/* Header Row */}
          <thead>
            <tr
              className="bg-[#f5f3ef] dark:bg-[#1a120d] text-[#625d5d] dark:text-[#a89f91] text-[12px] leading-[16px] font-bold border-b border-[#f0eeea] dark:border-[#38271c]"
              data-node-id="1:247"
            >
              <th className="py-[16px] px-[12px] text-center font-bold w-[46px]">#</th>
              <th className="py-[16px] px-[20px] text-start font-bold w-[320px]">
                {currentLang === "en" ? "Law Office / Legal Entity" : "اسم المكتب / المنشأة العدلية"}
              </th>
              <th className="py-[16px] px-[16px] text-start font-bold">
                {currentLang === "en" ? "Owner" : "المالك"}
              </th>
              <th className="py-[16px] px-[16px] text-start font-bold">
                {currentLang === "en" ? "Current Plan" : "الباقة الحالية"}
              </th>
              <th className="py-[16px] px-[16px] text-start font-bold">
                {currentLang === "en" ? "Registration Date" : "تاريخ التسجيل"}
              </th>
              <th className="py-[16px] px-[16px] text-start font-bold">
                {currentLang === "en" ? "Account Status" : "حالة الحساب"}
              </th>
              <th className="py-[16px] px-[16px] text-start font-bold">
                {currentLang === "en" ? "Subscription Status" : "حالة الاشتراك"}
              </th>
              <th className="py-[16px] px-[16px] text-center font-bold w-[72px]">
                {currentLang === "en" ? "Actions" : "إجراءات"}
              </th>
            </tr>
          </thead>

          {/* Body Rows */}
          <tbody className="divide-y divide-[#f0eeea] dark:divide-[#38271c]" data-node-id="1:262">
            {displayedOffices.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-[36px] text-center text-[#837565] dark:text-[#a89f91] text-[13px]">
                  {currentLang === "en" ? "No registered law offices found" : "لا توجد مكاتب مسجلة حتى الآن"}
                </td>
              </tr>
            ) : (
              displayedOffices.map((row, index) => (
              <tr
                key={row.id}
                onClick={() => router.push(`/accounts?officeId=${row.id}`)}
                className="hover:bg-[#fcfbfa] dark:hover:bg-[#2a1d15] transition-colors duration-150 cursor-pointer"
              >
                {/* 0. Sequence Number */}
                <td className="py-[16px] px-[12px] text-center">
                  <span className="inline-flex items-center justify-center size-[24px] rounded-[4px] font-mono text-[11px] font-bold text-[#837565] dark:text-[#cdc5bd] bg-[#f5f3ef] dark:bg-[#1a120d] border border-transparent dark:border-[#38271c]">
                    {index + 1}
                  </span>
                </td>
                {/* 1. Office Name */}
                <td className="py-[16px] px-[20px]">
                  <div className="flex items-center gap-[12px]">
                    {/* Initials Avatar Box or Logo */}
                    {row.logo && !failedLogos[row.id] ? (
                      <div className="size-[32px] rounded-[4px] bg-white dark:bg-[#1a120d] border border-[#eae8e4] dark:border-[#422e20] p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={row.logo}
                          alt={row.nameAr}
                          className="max-h-full max-w-full object-contain"
                          onError={() => setFailedLogos((prev) => ({ ...prev, [row.id]: true }))}
                        />
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "size-[32px] rounded-[4px] flex items-center justify-center font-bold text-[10px] shrink-0",
                          row.initialBg,
                          row.initialText
                        )}
                      >
                        {currentLang === "en" ? row.initialEn : row.initialAr}
                      </div>
                    )}

                    {/* Name + License & Code */}
                    <div className="flex flex-col text-start">
                      <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[14px] leading-[20px] font-bold font-sans">
                        {currentLang === "en" ? row.nameEn : row.nameAr}
                      </span>
                      <div className="flex items-center gap-[8px] mt-[2px] text-[10px] leading-[14px]">
                        <span className="font-bold text-[#837565] dark:text-[#a89f91]">
                          {currentLang === "en" ? row.licenseEn : row.licenseAr}
                        </span>
                        <span className="text-[#625d5d] dark:text-[#8e8680]">•</span>
                        <span className="font-bold text-[#625d5d] dark:text-[#8e8680]">
                          {row.code}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* 2. Owner */}
                <td className="py-[16px] px-[16px]">
                  <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[14px] leading-[22px] font-semibold">
                    {currentLang === "en" ? row.ownerEn : row.ownerAr}
                  </span>
                </td>

                {/* 3. Current Plan */}
                <td className="py-[16px] px-[16px]">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
                      row.planBadgeClass
                    )}
                  >
                    {currentLang === "en" ? row.planEn : row.planAr}
                  </span>
                </td>

                {/* 4. Registration Date */}
                <td className="py-[16px] px-[16px]">
                  <span className="text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[18px] font-normal whitespace-nowrap">
                    {currentLang === "en" ? row.registrationDateEn : row.registrationDateAr}
                  </span>
                </td>

                {/* 5. Account Status */}
                <td className="py-[16px] px-[16px]">
                  <span
                    className={cn(
                      "w-fit inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors",
                      row.accountStatus.bgClass,
                      row.accountStatus.textClass
                    )}
                  >
                    <span
                      className={cn(
                        "size-[7px] rounded-full shrink-0",
                        row.accountStatus.dotClass
                      )}
                    />
                    <span>{currentLang === "en" ? row.accountStatus.labelEn : row.accountStatus.labelAr}</span>
                  </span>
                </td>

                {/* 6. Subscription Status */}
                <td className="py-[16px] px-[16px]">
                  <span
                    className={cn(
                      "w-fit inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors",
                      row.subscriptionStatus.bgClass,
                      row.subscriptionStatus.textClass
                    )}
                  >
                    {row.subscriptionStatus.icon ? (
                      <row.subscriptionStatus.icon className="size-[13px] block shrink-0" />
                    ) : row.subscriptionStatus.dotColor ? (
                      <span
                        className={cn(
                          "size-[7px] rounded-full shrink-0",
                          row.subscriptionStatus.dotColor
                        )}
                      />
                    ) : null}
                    <span>
                      {currentLang === "en"
                        ? row.subscriptionStatus.labelEn
                        : row.subscriptionStatus.labelAr}
                    </span>
                  </span>
                </td>

                {/* 7. Actions */}
                <td className="py-[16px] px-[16px] text-center">
                  <div className="relative inline-block">
                    <button
                      type="button"
                      aria-label={currentLang === "en" ? "Options" : "خيارات"}
                      onClick={() =>
                        setOpenMenuRowId(openMenuRowId === row.id ? null : row.id)
                      }
                      className="size-[34px] rounded-[6px] hover:bg-[#eae8e4] dark:hover:bg-[#2d1f16] text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] transition-all inline-flex items-center justify-center cursor-pointer border border-transparent hover:border-[#ded5c6] dark:hover:border-[#4d3627]"
                    >
                      <MoreVertical className="size-[18px] block" />
                    </button>

                    <ClientRowActionMenu
                      isOpen={openMenuRowId === row.id}
                      onClose={() => setOpenMenuRowId(null)}
                      onViewDetails={() => {
                        router.push("/law-firms");
                        toast.info(
                          currentLang === "en"
                            ? `Viewing details for ${row.nameEn}`
                            : `عرض تفاصيل ${row.nameAr}`
                        );
                      }}
                      onEdit={() => {
                        router.push("/law-firms");
                        toast.info(
                          currentLang === "en"
                            ? `Editing ${row.nameEn}`
                            : `تعديل بيانات ${row.nameAr}`
                        );
                      }}
                      onManageSubscriptions={() => {
                        toast.info(
                          currentLang === "en"
                            ? `Managing subscriptions for ${row.nameEn}`
                            : `إدارة اشتراكات وفواتير ${row.nameAr}`
                        );
                      }}
                      onDeactivate={() => {
                        toast.info(
                          currentLang === "en"
                            ? `Updated status for ${row.nameEn}`
                            : `تم تغيير حالة حساب ${row.nameAr}`
                        );
                      }}
                      onDelete={() => {
                        toast.error(
                          currentLang === "en"
                            ? `Deleted office ${row.nameEn}`
                            : `تم حذف مكتب ${row.nameAr}`
                        );
                      }}
                    />
                  </div>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
