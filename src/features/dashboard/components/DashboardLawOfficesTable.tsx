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
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ClientRowActionMenu } from "@/features/clients/components/ClientRowActionMenu";
import { useUIStore } from "@/stores/use-ui-store";
import { PageSizeDropdown } from "@/components/shared/PageSizeDropdown";

interface LawOfficeRow {
  id: string;
  initialAr: string;
  initialEn: string;
  initialBg: string;
  initialText: string;
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

const officesData: LawOfficeRow[] = [
  {
    id: "1",
    initialAr: "ع",
    initialEn: "A",
    initialBg: "bg-[#ffddb6] dark:bg-[#3d2716]",
    initialText: "text-[#9c6402] dark:text-[#e29d38]",
    nameAr: "مكتب د. عبد العزيز بن فهد العجلان",
    nameEn: "Dr. Abdulaziz Al-Ajlan Law Firm",
    licenseAr: "ترخيص عدلي: 38/194",
    licenseEn: "MoJ License: 38/194",
    code: "JUD-8902",
    ownerAr: "عبد العزيز العجلان",
    ownerEn: "Abdulaziz Al-Ajlan",
    planAr: "الاحترافية",
    planEn: "Professional",
    planBadgeClass: "bg-[#9c6402]/10 border border-[#9c6402]/30 text-[#9c6402] dark:bg-[rgba(226,157,56,0.18)] dark:border-[#e29d38]/40 dark:text-[#f3c27e]",
    registrationDateAr: "22 أكتوبر 2024",
    registrationDateEn: "22 Oct 2024",
    accountStatus: {
      labelAr: "نشط",
      labelEn: "Active",
      bgClass: "bg-[#ecfdf5] border border-emerald-200 dark:bg-[#132c1c] dark:border-emerald-500/40 dark:shadow-[0_0_10px_rgba(16,185,129,0.15)]",
      textClass: "text-[#065f46] dark:text-[#6ee7b7]",
      dotClass: "bg-[#10b981] shadow-[0_0_8px_#10b981] ring-1 ring-emerald-400/60",
    },
    subscriptionStatus: {
      labelAr: "ساري",
      labelEn: "Valid",
      bgClass: "bg-[#ecfdf5] border border-emerald-200 dark:bg-[#132c1c] dark:border-emerald-500/40",
      textClass: "text-[#065f46] dark:text-[#6ee7b7]",
      icon: CheckCircle2,
    },
  },
  {
    id: "2",
    initialAr: "ش",
    initialEn: "S",
    initialBg: "bg-[#1c140f] dark:bg-[#2d1f16]",
    initialText: "text-[#ffddb6] dark:text-[#e29d38]",
    nameAr: "شركة الشريف وشركاؤه للمحاماة والاستشارات",
    nameEn: "Al-Sharif & Partners Legal Firm",
    licenseAr: "ترخيص عدلي: 41/502",
    licenseEn: "MoJ License: 41/502",
    code: "JUD-8895",
    ownerAr: "تركي الشريف",
    ownerEn: "Turki Al-Sharif",
    planAr: "شركات",
    planEn: "Enterprise",
    planBadgeClass: "bg-[#1c140f] border border-[#1c140f] text-white dark:bg-[#38261b] dark:border-[#e29d38]/40 dark:text-[#ffddb6]",
    registrationDateAr: "20 أكتوبر 2024",
    registrationDateEn: "20 Oct 2024",
    accountStatus: {
      labelAr: "نشط",
      labelEn: "Active",
      bgClass: "bg-[#ecfdf5] border border-emerald-200 dark:bg-[#132c1c] dark:border-emerald-500/40 dark:shadow-[0_0_10px_rgba(16,185,129,0.15)]",
      textClass: "text-[#065f46] dark:text-[#6ee7b7]",
      dotClass: "bg-[#10b981] shadow-[0_0_8px_#10b981] ring-1 ring-emerald-400/60",
    },
    subscriptionStatus: {
      labelAr: "ساري",
      labelEn: "Valid",
      bgClass: "bg-[#ecfdf5] border border-emerald-200 dark:bg-[#132c1c] dark:border-emerald-500/40",
      textClass: "text-[#065f46] dark:text-[#6ee7b7]",
      icon: CheckCircle2,
    },
  },
  {
    id: "3",
    initialAr: "ت",
    initialEn: "T",
    initialBg: "bg-[#eae8e4] dark:bg-[#2a1d15]",
    initialText: "text-[#514537] dark:text-[#cdc5bd]",
    nameAr: "مكتب المستشار فهد التميمي للتوثيق والقانون",
    nameEn: "Fahad Al-Tamimi Legal Services",
    licenseAr: "ترخيص عدلي: 36/902",
    licenseEn: "MoJ License: 36/902",
    code: "JUD-8861",
    ownerAr: "فهد التميمي",
    ownerEn: "Fahad Al-Tamimi",
    planAr: "الاحترافية",
    planEn: "Professional",
    planBadgeClass: "bg-[#9c6402]/10 border border-[#9c6402]/30 text-[#9c6402] dark:bg-[rgba(226,157,56,0.18)] dark:border-[#e29d38]/40 dark:text-[#f3c27e]",
    registrationDateAr: "18 أكتوبر 2024",
    registrationDateEn: "18 Oct 2024",
    accountStatus: {
      labelAr: "نشط",
      labelEn: "Active",
      bgClass: "bg-[#ecfdf5] border border-emerald-200 dark:bg-[#132c1c] dark:border-emerald-500/40 dark:shadow-[0_0_10px_rgba(16,185,129,0.15)]",
      textClass: "text-[#065f46] dark:text-[#6ee7b7]",
      dotClass: "bg-[#10b981] shadow-[0_0_8px_#10b981] ring-1 ring-emerald-400/60",
    },
    subscriptionStatus: {
      labelAr: "ينتهي قريباً",
      labelEn: "Expiring Soon",
      bgClass: "bg-[#fffbeb] border border-amber-200 dark:bg-[#2e1d0f] dark:border-amber-500/40 dark:shadow-[0_0_10px_rgba(245,158,11,0.15)]",
      textClass: "text-[#92400e] dark:text-[#fbbf24]",
      dotColor: "bg-[#f59e0b] shadow-[0_0_8px_#f59e0b] ring-1 ring-amber-400/60",
    },
  },
  {
    id: "4",
    initialAr: "م",
    initialEn: "M",
    initialBg: "bg-[#eae8e4] dark:bg-[#2a1d15]",
    initialText: "text-[#514537] dark:text-[#cdc5bd]",
    nameAr: "مجموعة الميزان القضائي للاستشارات",
    nameEn: "Al-Mizan Judicial Consulting Group",
    licenseAr: "ترخيص عدلي: 44/110",
    licenseEn: "MoJ License: 44/110",
    code: "JUD-8840",
    ownerAr: "عبد الله السبيعي",
    ownerEn: "Abdullah Al-Subaie",
    planAr: "الأساسية",
    planEn: "Basic",
    planBadgeClass: "bg-[#f5f3ef] border border-[#eae8e4] text-[#514537] dark:bg-[#281c15] dark:border-[#4d3627] dark:text-[#cdc5bd]",
    registrationDateAr: "15 أكتوبر 2024",
    registrationDateEn: "15 Oct 2024",
    accountStatus: {
      labelAr: "قيد التحقق",
      labelEn: "Under Review",
      bgClass: "bg-[#fffbeb] border border-amber-200 dark:bg-[#2e1d0f] dark:border-amber-500/40 dark:shadow-[0_0_10px_rgba(245,158,11,0.15)]",
      textClass: "text-[#92400e] dark:text-[#fbbf24]",
      dotClass: "bg-[#f59e0b] shadow-[0_0_8px_#f59e0b] ring-1 ring-amber-400/60",
    },
    subscriptionStatus: {
      labelAr: "تجريبي (14 يوم)",
      labelEn: "Trial (14 Days)",
      bgClass: "bg-[#eff6ff] border border-blue-200 dark:bg-[#162233] dark:border-blue-500/40",
      textClass: "text-[#1d4ed8] dark:text-[#93c5fd]",
      icon: Timer,
    },
  },
  {
    id: "5",
    initialAr: "ن",
    initialEn: "N",
    initialBg: "bg-[#1c140f] dark:bg-[#2d1f16]",
    initialText: "text-[#ffddb6] dark:text-[#e29d38]",
    nameAr: "مكتب المحامي ناصر بن فهد الدوسري",
    nameEn: "Nasser Al-Dossari Law Firm",
    licenseAr: "ترخيص عدلي: 39/781",
    licenseEn: "MoJ License: 39/781",
    code: "JUD-8812",
    ownerAr: "ناصر الدوسري",
    ownerEn: "Nasser Al-Dossari",
    planAr: "الاحترافية",
    planEn: "Professional",
    planBadgeClass: "bg-[#9c6402]/10 border border-[#9c6402]/30 text-[#9c6402] dark:bg-[rgba(226,157,56,0.18)] dark:border-[#e29d38]/40 dark:text-[#f3c27e]",
    registrationDateAr: "12 أكتوبر 2024",
    registrationDateEn: "12 Oct 2024",
    accountStatus: {
      labelAr: "نشط",
      labelEn: "Active",
      bgClass: "bg-[#ecfdf5] border border-emerald-200 dark:bg-[#132c1c] dark:border-emerald-500/40 dark:shadow-[0_0_10px_rgba(16,185,129,0.15)]",
      textClass: "text-[#065f46] dark:text-[#6ee7b7]",
      dotClass: "bg-[#10b981] shadow-[0_0_8px_#10b981] ring-1 ring-emerald-400/60",
    },
    subscriptionStatus: {
      labelAr: "ساري",
      labelEn: "Valid",
      bgClass: "bg-[#ecfdf5] border border-emerald-200 dark:bg-[#132c1c] dark:border-emerald-500/40",
      textClass: "text-[#065f46] dark:text-[#6ee7b7]",
      icon: CheckCircle2,
    },
  },
];

export function DashboardLawOfficesTable() {
  const router = useRouter();
  const [openMenuRowId, setOpenMenuRowId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);

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

  const totalItems = officesData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePageIndex = Math.min(pageIndex, totalPages - 1);
  const paginatedOffices = officesData.slice(
    safePageIndex * pageSize,
    (safePageIndex + 1) * pageSize
  );
  const startItem = totalItems === 0 ? 0 : safePageIndex * pageSize + 1;
  const endItem = Math.min((safePageIndex + 1) * pageSize, totalItems);

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

        {/* View All Link */}
        <Link
          href="/law-firms"
          className="flex items-center gap-[6px] text-[#9c6402] dark:text-[#e29d38] hover:text-[#b47818] transition-colors group cursor-pointer"
          data-node-id="1:233"
        >
          <div className="size-[11px] flex items-center justify-center shrink-0">
            <LinkIcon className="size-[11px] block text-[#9c6402] dark:text-[#e29d38] transition-transform group-hover:scale-110" />
          </div>
          <span className="text-[12px] leading-[16px] font-bold">
            {currentLang === "en" ? "View All Offices (128)" : "عرض كل المكاتب (128)"}
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
            {paginatedOffices.map((row, index) => (
              <tr
                key={row.id}
                className="hover:bg-[#fcfbfa] dark:hover:bg-[#2a1d15] transition-colors duration-150"
              >
                {/* 0. Sequence Number */}
                <td className="py-[16px] px-[12px] text-center">
                  <span className="inline-flex items-center justify-center size-[24px] rounded-[4px] font-mono text-[11px] font-bold text-[#837565] dark:text-[#cdc5bd] bg-[#f5f3ef] dark:bg-[#1a120d] border border-transparent dark:border-[#38271c]">
                    {safePageIndex * pageSize + index + 1}
                  </span>
                </td>
                {/* 1. Office Name */}
                <td className="py-[16px] px-[20px]">
                  <div className="flex items-center gap-[12px]">
                    {/* Initials Avatar Box */}
                    <div
                      className={cn(
                        "size-[32px] rounded-[4px] flex items-center justify-center font-bold text-[10px] shrink-0",
                        row.initialBg,
                        row.initialText
                      )}
                    >
                      {currentLang === "en" ? row.initialEn : row.initialAr}
                    </div>

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
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="bg-[#fcfaf7] dark:bg-[#1a120d] p-[16px] border-t border-[#f0eeea] dark:border-[#38271c] rounded-b-[8px] -mx-[24px] -mb-[24px] mt-[16px] flex flex-col sm:flex-row items-center justify-between gap-[12px] text-[12px] text-[#514537] dark:text-[#cdc5bd] font-['Cairo']">
        {/* Right in RTL: Count Summary & Rows per page */}
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <span>{currentLang === "en" ? "Showing " : "عرض "}</span>
            <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {totalItems === 0 ? 0 : safePageIndex * pageSize + 1}
            </span>
            <span>{currentLang === "en" ? " to " : " إلى "}</span>
            <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{endItem}</span>
            <span>{currentLang === "en" ? " of " : " من أصل "}</span>
            <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{totalItems}</span>
            <span>{currentLang === "en" ? " law offices" : " مكتب محاماة مسجل"}</span>
          </div>

          <div className="flex items-center gap-2 border-s border-[#eae8e4] dark:border-[#38271c] ps-3">
            <span className="text-[11px] text-[#837565] dark:text-[#8e8680]">
              {currentLang === "en" ? "Rows per page:" : "صفوف بالصفحة:"}
            </span>
            <PageSizeDropdown
              value={pageSize}
              onChange={(newSize) => {
                setPageSize(newSize);
                setPageIndex(0);
              }}
              options={[5, 10, 20]}
            />
          </div>
        </div>

        {/* Left in RTL: Page Controls */}
        <div className="flex items-center gap-[4px]">
          <button
            type="button"
            disabled={safePageIndex === 0 || totalItems === 0}
            onClick={() => setPageIndex(0)}
            title={currentLang === "en" ? "First page" : "الصفحة الأولى"}
            className="size-[30px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center cursor-pointer"
          >
            <ChevronsRight className="size-[14px]" />
          </button>

          <button
            type="button"
            disabled={safePageIndex === 0 || totalItems === 0}
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            title={currentLang === "en" ? "Previous page" : "الصفحة السابقة"}
            className="px-[10px] py-[6px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-[4px] cursor-pointer"
          >
            <ChevronRight className="size-[13px]" />
            <span>{currentLang === "en" ? "Previous" : "السابق"}</span>
          </button>

          {totalItems === 0 ? (
            <button
              type="button"
              disabled
              className="size-[30px] rounded-[4px] font-semibold text-[12px] flex items-center justify-center border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#8e8680] opacity-40 cursor-not-allowed"
            >
              1
            </button>
          ) : (
            Array.from({ length: totalPages }, (_, i) => i).map((p) => {
              const isActive = safePageIndex === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPageIndex(p)}
                  className={`size-[30px] rounded-[4px] font-semibold text-[12px] flex items-center justify-center cursor-pointer transition-colors ${
                    isActive
                      ? "bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] font-bold shadow-sm"
                      : "border border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15]"
                  }`}
                >
                  {p + 1}
                </button>
              );
            })
          )}

          <button
            type="button"
            disabled={safePageIndex >= totalPages - 1 || totalItems === 0}
            onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
            title={currentLang === "en" ? "Next page" : "الصفحة التالية"}
            className="px-[10px] py-[6px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#1b1c1a] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-[4px] cursor-pointer"
          >
            <span>{currentLang === "en" ? "Next" : "التالي"}</span>
            <ChevronLeft className="size-[13px]" />
          </button>

          <button
            type="button"
            disabled={safePageIndex >= totalPages - 1 || totalItems === 0}
            onClick={() => setPageIndex(totalPages - 1)}
            title={currentLang === "en" ? "Last page" : "الصفحة الأخيرة"}
            className="size-[30px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#cdc5bd] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center cursor-pointer"
          >
            <ChevronsLeft className="size-[14px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
