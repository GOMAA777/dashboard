"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  CreditCard,
  Headphones,
  ArrowUpCircle,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useUIStore } from "@/stores/use-ui-store";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface FlyoutNotificationItem {
  id: string;
  titleAr: string;
  titleEn: string;
  previewAr: string;
  previewEn: string;
  timeAr: string;
  timeEn: string;
  isUnread: boolean;
  type: "payment" | "ticket" | "upgrade" | "security";
}

const initialNotifications: FlyoutNotificationItem[] = [];

interface NotificationsFlyoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsFlyout({ isOpen, onClose }: NotificationsFlyoutProps) {
  const router = useRouter();
  const setPageNavigating = useUIStore((state) => state.setPageNavigating);
  const { direction, isEn } = useLanguage();
  const [items, setItems] = useState<FlyoutNotificationItem[]>(initialNotifications);
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

  const handleMarkAllAsRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, isUnread: false })));
    toast.success(
      isEn
        ? "All notifications marked as read"
        : "تم تحديد جميع الإشعارات كمقروءة"
    );
  };

  const handleItemClick = (id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: false } : n))
    );
  };

  const handleViewAll = () => {
    onClose();
    setPageNavigating(true);
    router.push("/notifications");
  };

  return (
    <div
      ref={containerRef}
      dir={direction}
      className="absolute end-0 top-full mt-2 w-[360px] max-w-[calc(100vw-32px)] bg-white dark:bg-[#1a120d] rounded-[10px] shadow-[0px_20px_45px_-10px_rgba(0,0,0,0.22)] border border-[#eae8e4] dark:border-[#2e231b] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 select-none text-start"
    >
      {/* 1. Header Bar: Title + Unread Count + Mark All as Read */}
      <div className="bg-white dark:bg-[#1a120d] border-b border-[#f0eeea] dark:border-[#2a2018] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-md bg-[#faf5eb] dark:bg-[#281f17] flex items-center justify-center text-[#9c6402] dark:text-[#d4a759]">
            <Bell className="size-4" />
          </div>
          <h2 className="text-sm font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
            {isEn ? "Notifications" : "الإشعارات"}
          </h2>
          {unreadCount > 0 && (
            <span className="bg-[#ffddb6] dark:bg-[#382717] text-[#7b4e00] dark:text-[#e29d38] text-[10px] font-bold px-2 py-0.5 rounded-full">
              {isEn ? `${unreadCount} new` : `${unreadCount} جديدة`}
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-1 px-2 py-1 rounded text-[#7b4e00] dark:text-[#d4a759] hover:bg-[#ffddb6]/30 dark:hover:bg-[#382717]/60 text-[11px] font-semibold transition-colors cursor-pointer"
            title={isEn ? "Mark all as read" : "تحديد جميع الإشعارات كمقروءة"}
          >
            <CheckCheck className="size-3.5" />
            <span>{isEn ? "Mark as read" : "تحديد كمقروء"}</span>
          </button>
        )}
      </div>

      {/* 2. Notifications List */}
      <div className="divide-y divide-[#f2efe9] dark:divide-[#261d16] overflow-hidden">
        {items.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#837565] dark:text-[#a89f91]">
            {isEn ? "No notifications" : "لا توجد إشعارات"}
          </div>
        ) : (
          items.slice(0, 3).map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={cn(
              "px-4 py-3 flex items-center gap-3 relative transition-colors cursor-pointer group",
              item.isUnread
                ? "bg-white dark:bg-[#1a120d] hover:bg-[#faf9f7] dark:hover:bg-[#281c15]"
                : "bg-[#faf9f7]/60 dark:bg-[#1a120d]/60 hover:bg-[#faf9f7] dark:hover:bg-[#281c15] opacity-80"
            )}
          >
            {/* Unread Indicator Bar / Dot */}
            {item.isUnread && (
              <span className="absolute start-1.5 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-[#9c6402] dark:bg-[#d4a759]" />
            )}

            {/* Type Icon */}
            <div
              className={cn(
                "size-8 rounded-lg flex items-center justify-center shrink-0 shadow-2xs",
                item.type === "payment" && "bg-[#e8f5e9] dark:bg-[#132c1c] text-[#1b7340] dark:text-[#4ade80]",
                item.type === "ticket" && "bg-[#ffdad6] dark:bg-[#381a17] text-[#ba1a1a] dark:text-[#f87171]",
                item.type === "upgrade" && "bg-[#fff8e1] dark:bg-[#332512] text-[#9c6402] dark:text-[#fbbf24]",
                item.type === "security" && "bg-[#f5f3ef] dark:bg-[#281c15] text-[#514537] dark:text-[#d6cfc7]"
              )}
            >
              {item.type === "payment" && <CreditCard className="size-4" />}
              {item.type === "ticket" && <Headphones className="size-4" />}
              {item.type === "upgrade" && <ArrowUpCircle className="size-4" />}
              {item.type === "security" && <ShieldCheck className="size-4" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-start">
              <h3 className="text-xs font-bold text-[#1b1c1a] dark:text-[#fdfbf7] truncate group-hover:text-[#9c6402] dark:group-hover:text-[#d4a759] transition-colors leading-[18px]">
                {isEn ? item.titleEn : item.titleAr}
              </h3>
              <p className="text-[11px] text-[#78716c] dark:text-[#a8a29e] truncate leading-[16px] mt-0.5">
                {isEn ? item.previewEn : item.previewAr}
              </p>
            </div>

            {/* Timestamp */}
            <span className="text-[10px] font-semibold text-[#8c8279] dark:text-[#78716c] whitespace-nowrap shrink-0">
              {isEn ? item.timeEn : item.timeAr}
            </span>
          </div>
        ))
        )}
      </div>

      {/* 3. Footer Action */}
      <div className="p-2.5 bg-[#fbfaf8] dark:bg-[#16100c] border-t border-[#f0eeea] dark:border-[#281f18]">
        <button
          type="button"
          onClick={handleViewAll}
          className="w-full py-2 px-3 rounded-md bg-[#9c6402]/10 dark:bg-[#9c6402]/20 hover:bg-[#9c6402] text-[#9c6402] hover:text-white dark:hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2 cursor-pointer group shadow-2xs"
        >
          <span>{isEn ? "View all notifications" : "عرض كل الإشعارات"}</span>
          <ArrowLeft className={`size-3.5 ${isEn ? "rotate-180" : ""}`} />
        </button>
      </div>
    </div>
  );
}
