"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  icon: string;
  iconBg: string;
  titlePrefix: string;
  titleBold: string;
  titleSuffix?: string;
  isProfit?: boolean;
  meta: string;
  time: string;
  isUrgent?: boolean;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    icon: "/figma/activity-firm.svg",
    iconBg: "bg-[#ecfdf5]",
    titlePrefix: "تم تسجيل مكتب محاماة جديد: ",
    titleBold: "مكتب د. عبد العزيز العجلان",
    meta: "تم التحقق من بيانات وزارة العدل",
    time: "منذ 25 دقيقة",
  },
  {
    id: "2",
    icon: "/figma/activity-card.svg",
    iconBg: "bg-[rgba(123,78,0,0.1)]",
    titlePrefix: "تم تفعيل اشتراك سنوي: ",
    titleBold: "الباقة الاحترافية",
    titleSuffix: " - الدفع عبر مدى",
    meta: "فاتورة رقم #INV-4921",
    time: "منذ ساعة واحدة",
  },
  {
    id: "3",
    icon: "/figma/activity-cash.svg",
    iconBg: "bg-[#ecfdf5]",
    titlePrefix: "تم استلام دفعة بنجاح بقيمة ",
    titleBold: "1,800 ر.س",
    isProfit: true,
    meta: "مكتب التميمي للتوثيق",
    time: "منذ 3 ساعات",
  },
  {
    id: "4",
    icon: "/figma/activity-ticket.svg",
    iconBg: "bg-[#fffbeb]",
    titlePrefix: "تم إنشاء تذكرة دعم جديدة: ",
    titleBold: "#TK-8422",
    titleSuffix: ' "استفسار بخصوص الربط "',
    meta: "أولوية عاجلة",
    isUrgent: true,
    time: "منذ 5 ساعات",
  },
  {
    id: "5",
    icon: "/figma/activity-pause.svg",
    iconBg: "bg-[#eae8e4]",
    titlePrefix: "تم تعديل حالة مكتب: ",
    titleBold: "مكتب المحامي بندر السبيعي",
    titleSuffix: " إلى معلق مؤقتاً",
    meta: "طلب من صاحب الحساب",
    time: "أمس عند 04:30 م",
  },
];

export function DashboardBottomSection() {
  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-12 gap-[16px] w-full"
      data-node-id="1:454"
      data-name="Section 5: Bottom Grid (Recent Activity & Support Summary)"
    >
      {/* Right (in RTL): Recent Activity Feed (7 cols) */}
      <div
        className="lg:col-span-7 bg-white rounded-[8px] p-[24px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] border border-[#f0eeea]/70 flex flex-col justify-between"
        data-node-id="1:455"
        data-name="Recent Activity Feed (7 of 12 columns)"
      >
        <div className="flex flex-col gap-[16px] w-full" data-node-id="1:456">
          {/* Header */}
          <div
            className="border-b border-[#f0eeea] pb-[13px] flex items-center justify-between w-full"
            data-node-id="1:457"
          >
            {/* Title & Icon */}
            <div className="flex items-center gap-[8px]" data-node-id="1:460">
              <div className="size-[17px] flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/figma/activity-clock.svg"
                  alt=""
                  className="size-[16.5px] block"
                />
              </div>
              <h2
                className="text-[#1b1c1a] text-[18px] leading-[26px] font-bold font-sans"
                data-node-id="1:461"
              >
                آخر النشاطات
              </h2>
            </div>

            {/* Instant update indicator */}
            <span
              className="text-[#625d5d] text-[10px] leading-[14px] font-bold"
              data-node-id="1:459"
            >
              تحديث فوري
            </span>
          </div>

          {/* Activity Timeline List */}
          <div className="flex flex-col gap-[16px] w-full pt-[2px]" data-node-id="1:465">
            {activities.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-[12px] w-full text-start"
                data-node-id={`1:activity-${item.id}`}
              >
                {/* Icon Box */}
                <div
                  className={cn(
                    "size-[32px] rounded-[12px] flex items-center justify-center shrink-0 mt-[2px]",
                    item.iconBg
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.icon}
                    alt=""
                    className="w-[16px] h-[15px] block object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col flex-1 min-w-0">
                  {/* Main sentence */}
                  <p className="text-[14px] leading-[22px] text-[#1b1c1a] truncate">
                    <span className="font-normal text-[#1b1c1a]">
                      {item.titlePrefix}
                    </span>
                    <span
                      className={cn(
                        "font-bold font-sans",
                        item.isProfit ? "text-[#065f46]" : "text-[#1b1c1a]"
                      )}
                    >
                      {item.titleBold}
                    </span>
                    {item.titleSuffix && (
                      <span className="font-normal text-[#1b1c1a]">
                        {item.titleSuffix}
                      </span>
                    )}
                  </p>

                  {/* Subtitle / Timestamp */}
                  <div className="flex items-center gap-[8px] text-[10px] leading-[14px] mt-[1px]">
                    <span
                      className={cn(
                        "font-bold",
                        item.isUrgent ? "text-[#92400e]" : "text-[#837565]"
                      )}
                    >
                      {item.meta}
                    </span>
                    <span className="text-[#625d5d]">•</span>
                    <span className="font-bold text-[#625d5d]">
                      {item.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Link */}
        <div
          className="border-t border-[#f0eeea] pt-[16px] mt-[16px] flex items-center justify-end w-full"
          data-node-id="1:550"
        >
          <Link
            href="/notifications"
            className="flex items-center gap-[4px] text-[#9c6402] hover:text-[#b47818] transition-colors group cursor-pointer"
            data-node-id="1:551"
          >
            <div className="size-[11px] flex items-center justify-center shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/table-arrow-left.svg"
                alt=""
                className="size-[11px] block transition-transform group-hover:-translate-x-0.5"
              />
            </div>
            <span className="text-[12px] leading-[16px] font-bold">
              عرض سجل النشاط الكامل للمنصة
            </span>
          </Link>
        </div>
      </div>

      {/* Left (in RTL): Support Overview & SLAs (5 cols) */}
      <div
        className="lg:col-span-5 bg-white rounded-[8px] p-[24px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] border border-[#f0eeea]/70 flex flex-col justify-between"
        data-node-id="1:556"
        data-name="Support Overview & SLAs (5 of 12 columns)"
      >
        <div className="flex flex-col gap-[16px] w-full" data-node-id="1:557">
          {/* Header */}
          <div
            className="border-b border-[#f0eeea] pb-[13px] flex items-center justify-between w-full"
            data-node-id="1:558"
          >
            {/* Title & Icon */}
            <div className="flex items-center gap-[8px]" data-node-id="1:564">
              <div className="size-[18px] flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/figma/support-headset.svg"
                  alt=""
                  className="w-[16px] h-[18px] block"
                />
              </div>
              <h2
                className="text-[#1b1c1a] text-[18px] leading-[26px] font-bold font-sans"
                data-node-id="1:565"
              >
                ملخص الدعم الفني
              </h2>
            </div>

            {/* Manage Tickets Link */}
            <Link
              href="/tickets"
              className="flex items-center gap-[4px] text-[#9c6402] hover:text-[#b47818] transition-colors group cursor-pointer"
              data-node-id="1:559"
            >
              <div className="size-[10px] flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/figma/table-arrow-left.svg"
                  alt=""
                  className="size-[10px] block transition-transform group-hover:-translate-x-0.5"
                />
              </div>
              <span className="text-[12px] leading-[16px] font-bold">
                إدارة التذاكر
              </span>
            </Link>
          </div>

          {/* Support Status 4-Card Mini Grid (2x2) */}
          <div
            className="grid grid-cols-2 gap-[8px] w-full"
            data-node-id="1:569"
            data-name="Support Status 4-Card Mini Grid"
          >
            {/* 1. تذاكر مفتوحة */}
            <div
              className="bg-[rgba(254,242,242,0.6)] rounded-[4px] p-[12px] flex flex-col justify-between"
              data-node-id="1:570"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[#7f1d1d] text-[10px] font-semibold leading-[14px]">
                  تذاكر مفتوحة
                </span>
                <span className="size-[8px] rounded-full bg-[#dc2626] shrink-0" />
              </div>
              <span className="text-[#7f1d1d] text-[22px] font-bold font-sans leading-[32px] my-[2px]">
                12
              </span>
              <span className="text-[#b91c1c] text-[10px] font-bold leading-[14px]">
                4 تذاكر حرجة / ذات أولوية
              </span>
            </div>

            {/* 2. قيد المعالجة */}
            <div
              className="bg-[rgba(255,251,235,0.7)] rounded-[4px] p-[12px] flex flex-col justify-between"
              data-node-id="1:581"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[#78350f] text-[10px] font-semibold leading-[14px]">
                  قيد المعالجة
                </span>
                <span className="size-[8px] rounded-full bg-[#d97706] shrink-0" />
              </div>
              <span className="text-[#78350f] text-[22px] font-bold font-sans leading-[32px] my-[2px]">
                8
              </span>
              <span className="text-[#b45309] text-[10px] font-bold leading-[14px]">
                مع فريق التقنية والربط
              </span>
            </div>

            {/* 3. بانتظار العميل */}
            <div
              className="bg-[#f5f3ef] rounded-[4px] p-[12px] flex flex-col justify-between"
              data-node-id="1:592"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[#625d5d] text-[10px] font-semibold leading-[14px]">
                  بانتظار العميل
                </span>
                <span className="size-[8px] rounded-full bg-[#837565] shrink-0" />
              </div>
              <span className="text-[#1b1c1a] text-[22px] font-bold font-sans leading-[32px] my-[2px]">
                5
              </span>
              <span className="text-[#514537] text-[10px] font-bold leading-[14px]">
                بانتظار تزويد وثائق
              </span>
            </div>

            {/* 4. مغلقة هذا الأسبوع */}
            <div
              className="bg-[rgba(236,253,245,0.6)] rounded-[4px] p-[12px] flex flex-col justify-between"
              data-node-id="1:603"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[#064e3b] text-[10px] font-semibold leading-[14px]">
                  مغلقة هذا الأسبوع
                </span>
                <span className="size-[8px] rounded-full bg-[#059669] shrink-0" />
              </div>
              <span className="text-[#064e3b] text-[22px] font-bold font-sans leading-[32px] my-[2px]">
                43
              </span>
              <span className="text-[#047857] text-[10px] font-bold leading-[14px]">
                تم حلها بنجاح
              </span>
            </div>
          </div>

          {/* Performance / SLA Indicators */}
          <div
            className="border-t border-[#f0eeea] pt-[13px] flex flex-col gap-[12px] w-full"
            data-node-id="1:614"
          >
            {/* Response Time */}
            <div className="flex flex-col gap-[8px] w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-[6px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/figma/support-speed.svg"
                    alt=""
                    className="w-[15px] h-[12px] block"
                  />
                  <span className="text-[#1b1c1a] text-[12px] font-medium leading-[16px]">
                    متوسط وقت الاستجابة الأولى
                  </span>
                </div>
                <span className="text-[#1b1c1a] text-[14px] font-bold font-sans leading-[20px]">
                  18 دقيقة
                </span>
              </div>

              {/* Progress bar (88% filled in gold) */}
              <div
                className="w-full h-[8px] rounded-full bg-[#eae8e4] overflow-hidden"
                data-node-id="1:623"
              >
                <div
                  className="h-full bg-[#9c6402] rounded-full w-[88%]"
                  data-node-id="1:624"
                />
              </div>
            </div>

            {/* Satisfaction Rate */}
            <div className="flex items-center justify-between w-full pt-[2px]" data-node-id="1:625">
              <div className="flex items-center gap-[6px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/figma/support-smile.svg"
                  alt=""
                  className="size-[15px] block"
                />
                <span className="text-[#1b1c1a] text-[12px] font-medium leading-[16px]">
                  معدل رضا المكاتب والعملاء
                </span>
              </div>
              <span className="text-[#065f46] text-[14px] font-bold font-sans leading-[20px]">
                98.2%
              </span>
            </div>
          </div>
        </div>

        {/* Live Team Presence Indicator */}
        <div
          className="bg-[#f5f3ef] rounded-[4px] px-[12px] py-[10px] mt-[16px] flex items-center justify-between w-full"
          data-node-id="1:634"
        >
          <div className="flex items-center gap-[8px]">
            <span className="size-[8px] rounded-full bg-[#10b981] animate-pulse shrink-0" />
            <span className="text-[#1b1c1a] text-[10px] font-semibold leading-[14px]">
              مناوبي الدعم القانوني والتقني الآن:
            </span>
          </div>
          <span className="text-[#9c6402] text-[10px] font-bold font-sans leading-[14px]">
            4 مهندسين متصلين
          </span>
        </div>
      </div>
    </div>
  );
}
