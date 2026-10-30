"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Building2,
  CreditCard,
  Gauge,
  Headphones,
  History,
  PauseCircle,
  Smile,
  Ticket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/use-ui-store";

interface ActivityItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  iconBg: string;
  titlePrefixAr: string;
  titlePrefixEn: string;
  titleBoldAr: string;
  titleBoldEn: string;
  titleSuffixAr?: string;
  titleSuffixEn?: string;
  isProfit?: boolean;
  metaAr: string;
  metaEn: string;
  timeAr: string;
  timeEn: string;
  isUrgent?: boolean;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    icon: Building2,
    iconClass: "w-[16px] h-[15px] text-[#047857] dark:text-[#6ee7b7]",
    iconBg: "bg-[#ecfdf5] dark:bg-[#12281a]",
    titlePrefixAr: "تم تسجيل مكتب محاماة جديد: ",
    titlePrefixEn: "New law office registered: ",
    titleBoldAr: "مكتب د. عبد العزيز العجلان",
    titleBoldEn: "Dr. Abdulaziz Al-Ajlan Law Firm",
    metaAr: "تم التحقق من بيانات وزارة العدل",
    metaEn: "Verified by Ministry of Justice",
    timeAr: "منذ 25 دقيقة",
    timeEn: "25 minutes ago",
  },
  {
    id: "2",
    icon: CreditCard,
    iconClass: "w-[15px] h-[15px] text-[#9c6402] dark:text-[#e29d38]",
    iconBg: "bg-[rgba(123,78,0,0.1)] dark:bg-[rgba(226,157,56,0.15)]",
    titlePrefixAr: "تم تفعيل اشتراك سنوي: ",
    titlePrefixEn: "Annual subscription activated: ",
    titleBoldAr: "الباقة الاحترافية",
    titleBoldEn: "Professional Plan",
    titleSuffixAr: " - الدفع عبر مدى",
    titleSuffixEn: " - Paid via Mada",
    metaAr: "فاتورة رقم #INV-4921",
    metaEn: "Invoice #INV-4921",
    timeAr: "منذ ساعة واحدة",
    timeEn: "1 hour ago",
  },
  {
    id: "3",
    icon: Banknote,
    iconClass: "w-[14px] h-[14px] text-[#047857] dark:text-[#6ee7b7]",
    iconBg: "bg-[#ecfdf5] dark:bg-[#12281a]",
    titlePrefixAr: "تم استلام دفعة بنجاح بقيمة ",
    titlePrefixEn: "Payment received successfully: ",
    titleBoldAr: "1,800 ر.س",
    titleBoldEn: "1,800 SAR",
    isProfit: true,
    metaAr: "مكتب التميمي للتوثيق",
    metaEn: "Al-Tamimi Legal Services",
    timeAr: "منذ 3 ساعات",
    timeEn: "3 hours ago",
  },
  {
    id: "4",
    icon: Ticket,
    iconClass: "w-[15px] h-[12px] text-[#b45309] dark:text-[#fbbf24]",
    iconBg: "bg-[#fffbeb] dark:bg-[#2b1f0c]",
    titlePrefixAr: "تم إنشاء تذكرة دعم جديدة: ",
    titlePrefixEn: "New support ticket created: ",
    titleBoldAr: "#TK-8422",
    titleBoldEn: "#TK-8422",
    titleSuffixAr: ' "استفسار بخصوص الربط"',
    titleSuffixEn: ' "API Integration Inquiry"',
    metaAr: "أولوية عاجلة",
    metaEn: "Urgent Priority",
    isUrgent: true,
    timeAr: "منذ 5 ساعات",
    timeEn: "5 hours ago",
  },
  {
    id: "5",
    icon: PauseCircle,
    iconClass: "w-[15px] h-[15px] text-[#625d5d] dark:text-[#a89f91]",
    iconBg: "bg-[#eae8e4] dark:bg-[#2d1f16]",
    titlePrefixAr: "تم تعديل حالة مكتب: ",
    titlePrefixEn: "Office status updated: ",
    titleBoldAr: "مكتب المحامي بندر السبيعي",
    titleBoldEn: "Bandar Al-Subaie Law Firm",
    titleSuffixAr: " إلى معلق مؤقتاً",
    titleSuffixEn: " to Temporarily Suspended",
    metaAr: "طلب من صاحب الحساب",
    metaEn: "Requested by account owner",
    timeAr: "أمس عند 04:30 م",
    timeEn: "Yesterday at 04:30 PM",
  },
];

export function DashboardBottomSection() {
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

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-12 gap-[16px] w-full"
      data-node-id="1:454"
      data-name="Section 5: Bottom Grid (Recent Activity & Support Summary)"
    >
      {/* Recent Activity Feed (7 cols) */}
      <div
        className="lg:col-span-7 bg-white dark:bg-[#221812] rounded-[8px] p-[24px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] border border-[#f0eeea]/70 dark:border-[#38271c] flex flex-col justify-between"
        data-node-id="1:455"
        data-name="Recent Activity Feed (7 of 12 columns)"
      >
        <div className="flex flex-col gap-[16px] w-full" data-node-id="1:456">
          {/* Header */}
          <div
            className="border-b border-[#f0eeea] dark:border-[#38271c] pb-[13px] flex items-center justify-between w-full"
            data-node-id="1:457"
          >
            {/* Title & Icon */}
            <div className="flex items-center gap-[8px]" data-node-id="1:460">
              <div className="size-[17px] flex items-center justify-center shrink-0">
                <History className="size-[16.5px] block text-[#9c6402] dark:text-[#e29d38]" />
              </div>
              <h2
                className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[18px] leading-[26px] font-bold font-sans"
                data-node-id="1:461"
              >
                {currentLang === "en" ? "Recent Activity" : "آخر النشاطات"}
              </h2>
            </div>

            {/* Instant update indicator */}
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-emerald-200 dark:border-emerald-500/40 bg-[#ecfdf5] dark:bg-[#132c1c] text-[#065f46] dark:text-[#6ee7b7] shadow-xs"
              data-node-id="1:459"
            >
              <span className="size-[7px] rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981] ring-1 ring-emerald-400/60 animate-pulse shrink-0" />
              <span>{currentLang === "en" ? "Live Feed" : "تحديث فوري"}</span>
            </div>
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
                    "size-[32px] rounded-[4px] flex items-center justify-center shrink-0",
                    item.iconBg
                  )}
                >
                  <item.icon className={cn("block shrink-0", item.iconClass)} />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 min-w-0">
                  <p className="text-[12px] leading-[18px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                    <span className="text-[#514537] dark:text-[#cdc5bd]">
                      {currentLang === "en" ? item.titlePrefixEn : item.titlePrefixAr}
                    </span>
                    <strong
                      className={cn(
                        "font-bold font-sans",
                        item.isProfit ? "text-[#047857] dark:text-[#6ee7b7]" : "text-[#1b1c1a] dark:text-[#fdfbf7]"
                      )}
                    >
                      {currentLang === "en" ? item.titleBoldEn : item.titleBoldAr}
                    </strong>
                    {(item.titleSuffixAr || item.titleSuffixEn) && (
                      <span className="text-[#514537] dark:text-[#cdc5bd]">
                        {currentLang === "en" ? item.titleSuffixEn : item.titleSuffixAr}
                      </span>
                    )}
                  </p>

                  <div className="flex items-center gap-[8px] mt-[2px] text-[10px] leading-[14px]">
                    <span
                      className={cn(
                        "font-medium",
                        item.isUrgent
                          ? "text-[#ba1a1a] dark:text-[#f87171] font-bold"
                          : "text-[#625d5d] dark:text-[#a89f91]"
                      )}
                    >
                      {currentLang === "en" ? item.metaEn : item.metaAr}
                    </span>
                    <span className="text-[#837565] dark:text-[#8e8680]">•</span>
                    <span className="text-[#837565] dark:text-[#8e8680]">
                      {currentLang === "en" ? item.timeEn : item.timeAr}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Logs Link */}
        <div className="border-t border-[#f0eeea] dark:border-[#38271c] pt-[12px] mt-[16px] w-full" data-node-id="1:550">
          <Link
            href="/notifications"
            className="flex items-center gap-[4px] text-[#9c6402] dark:text-[#e29d38] hover:text-[#b47818] transition-colors group cursor-pointer"
            data-node-id="1:551"
          >
            <div className="size-[11px] flex items-center justify-center shrink-0">
              <LinkIcon className="size-[11px] block text-[#9c6402] dark:text-[#e29d38] transition-transform group-hover:scale-110" />
            </div>
            <span className="text-[12px] leading-[16px] font-bold">
              {currentLang === "en" ? "View Full Platform Activity Log" : "عرض سجل النشاط الكامل للمنصة"}
            </span>
          </Link>
        </div>
      </div>

      {/* Support Overview & SLAs (5 cols) */}
      <div
        className="lg:col-span-5 bg-white dark:bg-[#221812] rounded-[8px] p-[24px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] border border-[#f0eeea]/70 dark:border-[#38271c] flex flex-col justify-between"
        data-node-id="1:556"
        data-name="Support Overview & SLAs (5 of 12 columns)"
      >
        <div className="flex flex-col gap-[16px] w-full" data-node-id="1:557">
          {/* Header */}
          <div
            className="border-b border-[#f0eeea] dark:border-[#38271c] pb-[13px] flex items-center justify-between w-full"
            data-node-id="1:558"
          >
            {/* Title & Icon */}
            <div className="flex items-center gap-[8px]" data-node-id="1:564">
              <div className="size-[18px] flex items-center justify-center shrink-0">
                <Headphones className="w-[16px] h-[18px] block text-[#9c6402] dark:text-[#e29d38]" />
              </div>
              <h2
                className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[18px] leading-[26px] font-bold font-sans"
                data-node-id="1:565"
              >
                {currentLang === "en" ? "Support Summary" : "ملخص الدعم الفني"}
              </h2>
            </div>

            {/* Manage Tickets Link */}
            <Link
              href="/tickets"
              className="flex items-center gap-[4px] text-[#9c6402] dark:text-[#e29d38] hover:text-[#b47818] transition-colors group cursor-pointer"
              data-node-id="1:559"
            >
              <div className="size-[10px] flex items-center justify-center shrink-0">
                <LinkIcon className="size-[10px] block text-[#9c6402] dark:text-[#e29d38] transition-transform group-hover:scale-110" />
              </div>
              <span className="text-[12px] leading-[16px] font-bold">
                {currentLang === "en" ? "Manage Tickets" : "إدارة التذاكر"}
              </span>
            </Link>
          </div>

          {/* Support Status 4-Card Mini Grid (2x2) */}
          <div
            className="grid grid-cols-2 gap-[8px] w-full"
            data-node-id="1:569"
            data-name="Support Status 4-Card Mini Grid"
          >
            {/* 1. Open Tickets */}
            <div
              className="bg-[rgba(254,242,242,0.6)] dark:bg-[#341818] rounded-[4px] p-[12px] flex flex-col justify-between border border-transparent dark:border-[#521b1b]"
              data-node-id="1:570"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[#7f1d1d] dark:text-[#fca5a5] text-[10px] font-semibold leading-[14px]">
                  {currentLang === "en" ? "Open Tickets" : "تذاكر مفتوحة"}
                </span>
                <span className="size-[8px] rounded-full bg-[#dc2626] shrink-0" />
              </div>
              <span className="text-[#7f1d1d] dark:text-[#fdfbf7] text-[22px] font-bold font-sans leading-[32px] my-[2px]">
                12
              </span>
              <span className="text-[#b91c1c] dark:text-[#f87171] text-[10px] font-bold leading-[14px]">
                {currentLang === "en" ? "4 Critical / Urgent" : "4 تذاكر حرجة / ذات أولوية"}
              </span>
            </div>

            {/* 2. In Progress */}
            <div
              className="bg-[rgba(255,251,235,0.7)] dark:bg-[#2e1d0f] rounded-[4px] p-[12px] flex flex-col justify-between border border-transparent dark:border-[#4a2e16]"
              data-node-id="1:581"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[#78350f] dark:text-[#fbbf24] text-[10px] font-semibold leading-[14px]">
                  {currentLang === "en" ? "In Progress" : "قيد المعالجة"}
                </span>
                <span className="size-[8px] rounded-full bg-[#d97706] shrink-0" />
              </div>
              <span className="text-[#78350f] dark:text-[#fdfbf7] text-[22px] font-bold font-sans leading-[32px] my-[2px]">
                8
              </span>
              <span className="text-[#b45309] dark:text-[#fbbf24] text-[10px] font-bold leading-[14px]">
                {currentLang === "en" ? "With Tech Team" : "مع فريق التقنية والربط"}
              </span>
            </div>

            {/* 3. Awaiting Client */}
            <div
              className="bg-[#f5f3ef] dark:bg-[#251b14] rounded-[4px] p-[12px] flex flex-col justify-between border border-transparent dark:border-[#38271c]"
              data-node-id="1:592"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[#625d5d] dark:text-[#cdc5bd] text-[10px] font-semibold leading-[14px]">
                  {currentLang === "en" ? "Awaiting Client" : "بانتظار العميل"}
                </span>
                <span className="size-[8px] rounded-full bg-[#837565] shrink-0" />
              </div>
              <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[22px] font-bold font-sans leading-[32px] my-[2px]">
                5
              </span>
              <span className="text-[#514537] dark:text-[#a89f91] text-[10px] font-bold leading-[14px]">
                {currentLang === "en" ? "Pending Documents" : "بانتظار تزويد وثائق"}
              </span>
            </div>

            {/* 4. Resolved This Week */}
            <div
              className="bg-[rgba(236,253,245,0.6)] dark:bg-[#12281a] rounded-[4px] p-[12px] flex flex-col justify-between border border-transparent dark:border-[#1d402b]"
              data-node-id="1:603"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[#064e3b] dark:text-[#6ee7b7] text-[10px] font-semibold leading-[14px]">
                  {currentLang === "en" ? "Resolved This Week" : "مغلقة هذا الأسبوع"}
                </span>
                <span className="size-[8px] rounded-full bg-[#059669] shrink-0" />
              </div>
              <span className="text-[#064e3b] dark:text-[#fdfbf7] text-[22px] font-bold font-sans leading-[32px] my-[2px]">
                43
              </span>
              <span className="text-[#047857] dark:text-[#6ee7b7] text-[10px] font-bold leading-[14px]">
                {currentLang === "en" ? "Successfully Resolved" : "تم حلها بنجاح"}
              </span>
            </div>
          </div>

          {/* Performance / SLA Indicators */}
          <div
            className="border-t border-[#f0eeea] dark:border-[#38271c] pt-[13px] flex flex-col gap-[12px] w-full"
            data-node-id="1:614"
          >
            {/* Response Time */}
            <div className="flex flex-col gap-[8px] w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-[6px]">
                  <Gauge className="w-[15px] h-[12px] block text-[#9c6402] dark:text-[#e29d38]" />
                  <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] font-medium leading-[16px]">
                    {currentLang === "en" ? "Avg. First Response Time" : "متوسط وقت الاستجابة الأولى"}
                  </span>
                </div>
                <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[14px] font-bold font-sans leading-[20px]">
                  {currentLang === "en" ? "18 minutes" : "18 دقيقة"}
                </span>
              </div>

              {/* Progress bar */}
              <div
                className="w-full h-[8px] rounded-full bg-[#eae8e4] dark:bg-[#342419] overflow-hidden"
                data-node-id="1:623"
              >
                <div
                  className="h-full bg-[#9c6402] dark:bg-[#e29d38] rounded-full w-[88%]"
                  data-node-id="1:624"
                />
              </div>
            </div>

            {/* Satisfaction Rate */}
            <div className="flex items-center justify-between w-full pt-[2px]" data-node-id="1:625">
              <div className="flex items-center gap-[6px]">
                <Smile className="size-[15px] block text-[#047857] dark:text-[#6ee7b7]" />
                <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] font-medium leading-[16px]">
                  {currentLang === "en" ? "Customer Satisfaction Rate" : "معدل رضا المكاتب والعملاء"}
                </span>
              </div>
              <span className="text-[#065f46] dark:text-[#6ee7b7] text-[14px] font-bold font-sans leading-[20px]">
                98.2%
              </span>
            </div>
          </div>
        </div>

        {/* Live Team Presence Indicator */}
        <div
          className="bg-[#f5f3ef] dark:bg-[#251b14] border border-transparent dark:border-[#38271c] rounded-[4px] px-[12px] py-[10px] mt-[16px] flex items-center justify-between w-full"
          data-node-id="1:634"
        >
          <div className="flex items-center gap-[8px]">
            <span className="size-[8px] rounded-full bg-[#10b981] animate-pulse shrink-0" />
            <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[10px] font-semibold leading-[14px]">
              {currentLang === "en" ? "Active Support On-Call:" : "مناوبي الدعم القانوني والتقني الآن:"}
            </span>
          </div>
          <span className="text-[#9c6402] dark:text-[#e29d38] text-[10px] font-bold font-sans leading-[14px]">
            {currentLang === "en" ? "4 Engineers Online" : "4 مهندسين متصلين"}
          </span>
        </div>
      </div>
    </div>
  );
}
