"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  MoreVertical,
  Scale,
  Timer,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ClientRowActionMenu } from "@/features/clients/components/ClientRowActionMenu";

interface LawOfficeRow {
  id: string;
  initial: string;
  initialBg: string;
  initialText: string;
  name: string;
  license: string;
  code: string;
  owner: string;
  plan: string;
  planBadgeClass: string;
  registrationDate: string;
  accountStatus: {
    label: string;
    bgClass: string;
    textClass: string;
    dotClass: string;
  };
  subscriptionStatus: {
    label: string;
    bgClass: string;
    textClass: string;
    icon?: React.ComponentType<{ className?: string }>;
    dotColor?: string;
  };
}

const officesData: LawOfficeRow[] = [
  {
    id: "1",
    initial: "ع",
    initialBg: "bg-[#ffddb6]",
    initialText: "text-[#9c6402]",
    name: "مكتب د. عبد العزيز بن فهد العجلان",
    license: "ترخيص عدلي: 38/194",
    code: "كود: JUD-8902",
    owner: "عبد العزيز العجلان",
    plan: "الاحترافية",
    planBadgeClass: "bg-[rgba(123,78,0,0.1)] text-[#9c6402]",
    registrationDate: "22 أكتوبر 2024",
    accountStatus: {
      label: "نشط",
      bgClass: "bg-[#ecfdf5]",
      textClass: "text-[#065f46]",
      dotClass: "bg-[#059669]",
    },
    subscriptionStatus: {
      label: "ساري",
      bgClass: "bg-[#ecfdf5]",
      textClass: "text-[#065f46]",
      icon: CheckCircle2,
    },
  },
  {
    id: "2",
    initial: "ش",
    initialBg: "bg-[#1c140f]",
    initialText: "text-[#ffddb6]",
    name: "شركة الشريف وشركاؤه للمحاماة والاستشارات",
    license: "ترخيص عدلي: 41/502",
    code: "كود: JUD-8895",
    owner: "تركي الشريف",
    plan: "شركات",
    planBadgeClass: "bg-[#1c140f] text-[#ffddb6]",
    registrationDate: "20 أكتوبر 2024",
    accountStatus: {
      label: "نشط",
      bgClass: "bg-[#ecfdf5]",
      textClass: "text-[#065f46]",
      dotClass: "bg-[#059669]",
    },
    subscriptionStatus: {
      label: "ساري",
      bgClass: "bg-[#ecfdf5]",
      textClass: "text-[#065f46]",
      icon: CheckCircle2,
    },
  },
  {
    id: "3",
    initial: "ت",
    initialBg: "bg-[#eae8e4]",
    initialText: "text-[#514537]",
    name: "مكتب المستشار فهد التميمي للتوثيق والقانون",
    license: "ترخيص عدلي: 36/902",
    code: "كود: JUD-8861",
    owner: "فهد التميمي",
    plan: "الاحترافية",
    planBadgeClass: "bg-[rgba(123,78,0,0.1)] text-[#9c6402]",
    registrationDate: "18 أكتوبر 2024",
    accountStatus: {
      label: "نشط",
      bgClass: "bg-[#ecfdf5]",
      textClass: "text-[#065f46]",
      dotClass: "bg-[#059669]",
    },
    subscriptionStatus: {
      label: "ينتهي قريباً",
      bgClass: "bg-[#fffbeb]",
      textClass: "text-[#92400e]",
      dotColor: "bg-[#d97706]",
    },
  },
  {
    id: "4",
    initial: "م",
    initialBg: "bg-[#eae8e4]",
    initialText: "text-[#514537]",
    name: "مجموعة الميزان القضائي للاستشارات",
    license: "ترخيص عدلي: 44/110",
    code: "كود: JUD-8840",
    owner: "عبد الله السبيعي",
    plan: "الأساسية",
    planBadgeClass: "bg-[#eae8e4] text-[#514537]",
    registrationDate: "15 أكتوبر 2024",
    accountStatus: {
      label: "قيد التحقق",
      bgClass: "bg-[#fffbeb]",
      textClass: "text-[#92400e]",
      dotClass: "bg-[#d97706]",
    },
    subscriptionStatus: {
      label: "تجريبي (14 يوم)",
      bgClass: "bg-[#eff6ff]",
      textClass: "text-[#1d4ed8]",
      icon: Timer,
    },
  },
  {
    id: "5",
    initial: "ن",
    initialBg: "bg-[#1c140f]",
    initialText: "text-[#ffddb6]",
    name: "شركة نخبة الرياض للمحاماة والتحكيم",
    license: "ترخيص عدلي: 39/760",
    code: "كود: JUD-8819",
    owner: "سلطان الهذلي",
    plan: "شركات",
    planBadgeClass: "bg-[#1c140f] text-[#ffddb6]",
    registrationDate: "12 أكتوبر 2024",
    accountStatus: {
      label: "نشط",
      bgClass: "bg-[#ecfdf5]",
      textClass: "text-[#065f46]",
      dotClass: "bg-[#059669]",
    },
    subscriptionStatus: {
      label: "متأخر عن السداد",
      bgClass: "bg-[#fef2f2]",
      textClass: "text-[#991b1b]",
      icon: AlertCircle,
    },
  },
];

export function DashboardLawOfficesTable() {
  const router = useRouter();
  const [openMenuRowId, setOpenMenuRowId] = useState<string | null>(null);

  return (
    <div
      className="bg-white rounded-[8px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] border border-[#f0eeea]/70 overflow-hidden w-full"
      data-node-id="1:231"
      data-name="Section 4: Recently Registered Law Offices Table"
    >
      {/* Header */}
      <div
        className="border-b border-[#f0eeea] px-[24px] py-[20px] flex items-center justify-between"
        data-node-id="1:232"
      >
        {/* Right / Start (in RTL): Title, Subtitle, and Scales Icon */}
        <div className="flex items-center gap-[8px]">
          <div className="flex flex-col items-start text-start">
            <h2
              className="text-[#1b1c1a] text-[18px] leading-[26px] font-bold font-sans"
              data-node-id="1:241"
            >
              أحدث المكاتب المسجلة
            </h2>
            <p
              className="text-[#514537] text-[12px] leading-[18px] font-normal"
              data-node-id="1:243"
            >
              آخر مكاتب وشركات المحاماة المنضمة لمنصة الجودي القضائية
            </p>
          </div>

          <div className="size-[20px] flex items-center justify-center shrink-0 ms-1">
            <Scale className="w-[18px] h-[19px] block text-[#9c6402]" />
          </div>
        </div>

        {/* Left / End (in RTL): View All Link */}
        <Link
          href="/law-firms"
          className="flex items-center gap-[6px] text-[#9c6402] hover:text-[#b47818] transition-colors group cursor-pointer"
          data-node-id="1:233"
        >
          <div className="size-[11px] flex items-center justify-center shrink-0">
            <ArrowLeft className="size-[11px] block text-[#9c6402] transition-transform group-hover:-translate-x-0.5" />
          </div>
          <span className="text-[12px] leading-[16px] font-bold">
            عرض كل المكاتب (128)
          </span>
        </Link>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto scrollbar-none w-full" data-node-id="1:246">
        <table className="w-full text-start border-collapse min-w-[880px]">
          {/* Header Row */}
          <thead>
            <tr
              className="bg-[#f5f3ef] text-[#625d5d] text-[12px] leading-[16px] font-bold border-b border-[#f0eeea]"
              data-node-id="1:247"
            >
              <th className="py-[16px] px-[20px] text-start font-bold w-[320px]">
                اسم المكتب / المنشأة العدلية
              </th>
              <th className="py-[16px] px-[16px] text-start font-bold">المالك</th>
              <th className="py-[16px] px-[16px] text-start font-bold">الباقة الحالية</th>
              <th className="py-[16px] px-[16px] text-start font-bold">تاريخ التسجيل</th>
              <th className="py-[16px] px-[16px] text-start font-bold">حالة الحساب</th>
              <th className="py-[16px] px-[16px] text-start font-bold">حالة الاشتراك</th>
              <th className="py-[16px] px-[16px] text-center font-bold w-[72px]">
                إجراءات
              </th>
            </tr>
          </thead>

          {/* Body Rows */}
          <tbody className="divide-y divide-[#f0eeea]" data-node-id="1:262">
            {officesData.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-[#fcfbfa] transition-colors duration-150"
              >
                {/* 1. اسم المكتب / المنشأة العدلية */}
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
                      {row.initial}
                    </div>

                    {/* Name + License & Code */}
                    <div className="flex flex-col text-start">
                      <span className="text-[#1b1c1a] text-[14px] leading-[20px] font-bold font-sans">
                        {row.name}
                      </span>
                      <div className="flex items-center gap-[8px] mt-[2px] text-[10px] leading-[14px]">
                        <span className="font-bold text-[#837565]">
                          {row.license}
                        </span>
                        <span className="text-[#625d5d]">•</span>
                        <span className="font-bold text-[#625d5d]">
                          {row.code}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* 2. المالك */}
                <td className="py-[16px] px-[16px]">
                  <span className="text-[#1b1c1a] text-[14px] leading-[22px] font-semibold">
                    {row.owner}
                  </span>
                </td>

                {/* 3. الباقة الحالية */}
                <td className="py-[16px] px-[16px]">
                  <span
                    className={cn(
                      "inline-flex items-center px-[10px] py-[4px] rounded-[2px] text-[10px] leading-[14px] font-semibold",
                      row.planBadgeClass
                    )}
                  >
                    {row.plan}
                  </span>
                </td>

                {/* 4. تاريخ التسجيل */}
                <td className="py-[16px] px-[16px]">
                  <span className="text-[#514537] text-[12px] leading-[18px] font-normal whitespace-nowrap">
                    {row.registrationDate}
                  </span>
                </td>

                {/* 5. حالة الحساب */}
                <td className="py-[16px] px-[16px]">
                  <span
                    className={cn(
                      "inline-flex items-center gap-[6px] px-[8px] py-[2px] rounded-[2px] text-[10px] leading-[14px] font-bold",
                      row.accountStatus.bgClass,
                      row.accountStatus.textClass
                    )}
                  >
                    <span>{row.accountStatus.label}</span>
                    <span
                      className={cn(
                        "size-[6px] rounded-full shrink-0",
                        row.accountStatus.dotClass
                      )}
                    />
                  </span>
                </td>

                {/* 6. حالة الاشتراك */}
                <td className="py-[16px] px-[16px]">
                  <span
                    className={cn(
                      "inline-flex items-center gap-[6px] px-[8px] py-[2px] rounded-[2px] text-[10px] leading-[14px] font-semibold",
                      row.subscriptionStatus.bgClass,
                      row.subscriptionStatus.textClass
                    )}
                  >
                    <span>{row.subscriptionStatus.label}</span>
                    {row.subscriptionStatus.icon ? (
                      <row.subscriptionStatus.icon className="size-[11px] block shrink-0" />
                    ) : row.subscriptionStatus.dotColor ? (
                      <span
                        className={cn(
                          "size-[6px] rounded-full shrink-0",
                          row.subscriptionStatus.dotColor
                        )}
                      />
                    ) : null}
                  </span>
                </td>

                {/* 7. إجراءات */}
                <td className="py-[16px] px-[16px] text-center">
                  <div className="relative inline-block">
                    <button
                      type="button"
                      aria-label="خيارات"
                      onClick={() =>
                        setOpenMenuRowId(openMenuRowId === row.id ? null : row.id)
                      }
                      className="p-[6px] rounded-[4px] hover:bg-[#eae8e4] text-[#625d5d] transition-colors inline-flex items-center justify-center cursor-pointer"
                    >
                      <MoreVertical className="w-[4px] h-[14px] block opacity-70" />
                    </button>

                    <ClientRowActionMenu
                      isOpen={openMenuRowId === row.id}
                      onClose={() => setOpenMenuRowId(null)}
                      onViewDetails={() => {
                        router.push("/accounts");
                        toast.info(`عرض تفاصيل ${row.name}`);
                      }}
                      onEdit={() => {
                        router.push("/accounts");
                        toast.info(`تعديل بيانات ${row.name}`);
                      }}
                      onManageSubscriptions={() => {
                        toast.info(`إدارة اشتراكات وفواتير ${row.name}`);
                      }}
                      onDeactivate={() => {
                        toast.info(`تم تغيير حالة حساب ${row.name}`);
                      }}
                      onDelete={() => {
                        toast.error(`تم حذف مكتب ${row.name}`);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
