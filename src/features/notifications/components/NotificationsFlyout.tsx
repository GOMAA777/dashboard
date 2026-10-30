"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  CheckCheck,
  CreditCard,
  Headphones,
  ArrowUpCircle,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  badgeLabel: string;
  badgeSub?: string;
  badgeType: "success" | "warning" | "gold" | "neutral";
  time: string;
  isUnread: boolean;
  type: "payment" | "ticket" | "upgrade" | "security";
}

const initialNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "تجديد اشتراك مكتب د. خالد العجلان",
    description:
      "تم تجديد باقة المؤسسات بنجاح عبر بطاقة مدى بقيمة 7,500 ر.س. صدرت الفاتورة الضريبية المعتمدة رقم INV-8821#.",
    badgeLabel: "سداد إلكتروني ناجح",
    badgeSub: "مدى Mada",
    badgeType: "success",
    time: "منذ 5 د",
    isUnread: true,
    type: "payment",
  },
  {
    id: "2",
    title: "تذكرة دعم فني جديدة #TCK-1049",
    description:
      "استفسار فني عاجل بشأن ربط التوقيع الرقمي في العقود من مكتب الريادة للمحاماة - بانتظار الإسناد لممثل الدعم.",
    badgeLabel: "أولوية مرتفعة",
    badgeSub: "قسم العقود الرقمية",
    badgeType: "warning",
    time: "منذ 25 د",
    isUnread: true,
    type: "ticket",
  },
  {
    id: "3",
    title: "طلب ترقية إلى باقة الشركات والنخبة",
    description:
      "قدم مكتب النخبة للاستشارات الشرعية طلباً لتوسيع المقاعد المرخصة لـ 25 محامياً ومستشاراً.",
    badgeLabel: "بانتظار الموافقة",
    badgeType: "gold",
    time: "منذ 4 س",
    isUnread: true,
    type: "upgrade",
  },
  {
    id: "4",
    title: "تسجيل دخول جديد لحساب المشرف العام",
    description:
      "تمت المصادقة الثنائية بنجاح من عنوان IP موثق (الرياض، المملكة العربية السعودية).",
    badgeLabel: "سجل الحماية والأمان",
    badgeType: "neutral",
    time: "منذ يوم",
    isUnread: false,
    type: "security",
  },
];

interface NotificationsFlyoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsFlyout({ isOpen, onClose }: NotificationsFlyoutProps) {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [items, setItems] = useState<NotificationItem[]>(initialNotifications);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = items.filter((n) => n.isUnread).length;
  const filteredItems =
    filter === "unread" ? items.filter((n) => n.isUnread) : items;

  const handleMarkAllAsRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, isUnread: false })));
    toast.success("تم تحديد جميع الإشعارات كمقروءة بنجاح");
  };

  const handleItemClick = (id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: false } : n))
    );
  };

  return (
    <div
      ref={containerRef}
      className="absolute end-0 start-auto rtl:left-0 rtl:right-auto ltr:right-0 ltr:left-auto top-full mt-2 w-[420px] max-w-[calc(100vw-32px)] bg-white rounded-[8px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] border border-[#eae8e4] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 font-['Cairo',sans-serif]"
      data-node-id="1:24656"
    >
      {/* 1. Dropdown Header (Figma 1:24657) */}
      <div className="bg-white border-b border-[#f0eeea] p-[16px] flex flex-col gap-[10px]">
        <div className="flex items-center justify-between w-full">
          {/* Right: Icon + Title + Unread Badge */}
          <div className="flex items-center gap-[6px]">
            <Bell className="size-[18px] text-[#9c6402]" />
            <h2 className="text-[18px] font-bold text-[#1b1c1a] leading-[26px]">
              الإشعارات
            </h2>
            {unreadCount > 0 && (
              <span className="bg-[#ffddb6] text-[#2a1800] text-[10px] font-bold px-[8px] py-[2px] rounded-full ms-[4px]">
                {unreadCount} جديدة
              </span>
            )}
          </div>

          {/* Left: Mark All Read Button */}
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[4px] text-[#7b4e00] hover:bg-[#ffddb6]/30 text-[12px] font-semibold transition-colors cursor-pointer"
          >
            <CheckCheck className="size-[14px]" />
            <span>تحديد الكل كمقروء</span>
          </button>
        </div>

        {/* 2. Segmented Category Filters (Figma 1:24672) */}
        <div className="bg-[#f5f3ef] rounded-[6px] p-[3px] flex items-center gap-[4px]">
          {/* الكل */}
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`flex-1 py-[6px] px-[8px] rounded-[4px] text-[12px] font-bold flex items-center justify-center gap-[6px] transition-all cursor-pointer ${
              filter === "all"
                ? "bg-white text-[#7b4e00] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                : "text-[#514537] hover:text-[#1b1c1a]"
            }`}
          >
            <span>الكل</span>
            <span
              className={`text-[10px] px-[6px] py-[1px] rounded-full font-bold ${
                filter === "all"
                  ? "bg-[#f0eeea] text-[#514537]"
                  : "bg-transparent text-[#837565]"
              }`}
            >
              12
            </span>
          </button>

          {/* غير مقروءة */}
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`flex-1 py-[6px] px-[8px] rounded-[4px] text-[12px] font-bold flex items-center justify-center gap-[6px] transition-all cursor-pointer ${
              filter === "unread"
                ? "bg-white text-[#7b4e00] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                : "text-[#514537] hover:text-[#1b1c1a]"
            }`}
          >
            <span>غير مقروءة</span>
            <span
              className={`text-[10px] px-[6px] py-[1px] rounded-full font-bold ${
                filter === "unread"
                  ? "bg-[#ffddb6] text-[#7b4e00]"
                  : "bg-[rgba(123,78,0,0.1)] text-[#7b4e00]"
              }`}
            >
              {unreadCount}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Notification Feed Items (Figma 1:24683) */}
      <div className="max-h-[460px] overflow-y-auto divide-y divide-[#f0eeea]">
        {filteredItems.length === 0 ? (
          <div className="p-[32px] text-center text-[#837565] text-[13px]">
            لا توجد إشعارات حالياً
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`p-[16px] flex items-start gap-[12px] relative transition-colors cursor-pointer group ${
                item.isUnread
                  ? "bg-white hover:bg-[#faf9f7]"
                  : "bg-[#f5f3ef]/30 hover:bg-[#f5f3ef]/60 opacity-90"
              }`}
            >
              {/* Unread Indicator Dot */}
              {item.isUnread && (
                <div className="absolute top-[24px] start-[6px] size-[8px] rounded-full bg-[#9c6402] ring-4 ring-[#ffddb6]/40" />
              )}

              {/* Type Icon Box */}
              <div
                className={`size-[40px] rounded-[8px] flex items-center justify-center shrink-0 shadow-2xs ${
                  item.type === "payment"
                    ? "bg-[#e8f5e9] text-[#1b7340]"
                    : item.type === "ticket"
                    ? "bg-[#ffdad6] text-[#ba1a1a]"
                    : item.type === "upgrade"
                    ? "bg-[#fff8e1] text-[#9c6402]"
                    : "bg-[#f5f3ef] text-[#514537]"
                }`}
              >
                {item.type === "payment" && <CreditCard className="size-[18px]" />}
                {item.type === "ticket" && <Headphones className="size-[18px]" />}
                {item.type === "upgrade" && <ArrowUpCircle className="size-[18px]" />}
                {item.type === "security" && <ShieldCheck className="size-[18px]" />}
              </div>

              {/* Content Body */}
              <div className="flex-1 flex flex-col gap-[3px] text-start">
                {/* Title & Timestamp Row */}
                <div className="flex items-center justify-between gap-[8px]">
                  <h3 className="text-[13px] font-bold text-[#1b1c1a] leading-[18px] group-hover:text-[#9c6402] transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-[10px] font-bold text-[#837565] whitespace-nowrap">
                    {item.time}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[12px] text-[#514537] leading-[19px]">
                  {item.description}
                </p>

                {/* Badges Row */}
                <div className="flex items-center gap-[6px] pt-[4px]">
                  {item.badgeSub && (
                    <span className="text-[10px] font-bold text-[#837565]">
                      {item.badgeSub}
                    </span>
                  )}

                  <span
                    className={`inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-[2px] text-[10px] font-bold ${
                      item.badgeType === "success"
                        ? "bg-[#e8f5e9] text-[#1b7340]"
                        : item.badgeType === "warning"
                        ? "bg-[#fff8e1] text-[#b76e00]"
                        : item.badgeType === "gold"
                        ? "bg-[#ffddb6]/40 text-[#9c6402]"
                        : "bg-[#eae8e4] text-[#514537]"
                    }`}
                  >
                    <span
                      className={`size-[5px] rounded-full ${
                        item.badgeType === "success"
                          ? "bg-[#1b7340]"
                          : item.badgeType === "warning"
                          ? "bg-[#b76e00]"
                          : item.badgeType === "gold"
                          ? "bg-[#9c6402]"
                          : "bg-[#837565]"
                      }`}
                    />
                    <span>{item.badgeLabel}</span>
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
