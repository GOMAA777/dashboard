"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, Eye, Edit3, RefreshCw, XCircle } from "lucide-react";
import { SubscriptionRecord } from "../types/subscription.types";
import { useLanguage } from "@/lib/i18n";

interface SubscriptionRowActionMenuProps {
  subscription: SubscriptionRecord;
  onViewDetails: (sub: SubscriptionRecord) => void;
  onEdit?: (sub: SubscriptionRecord) => void;
  onRenew?: (sub: SubscriptionRecord) => void;
  onCancel?: (sub: SubscriptionRecord) => void;
}

export function SubscriptionRowActionMenu({
  subscription,
  onViewDetails,
  onEdit,
  onRenew,
  onCancel,
}: SubscriptionRowActionMenuProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{
    left: number;
    top?: number;
    bottom?: number;
  } | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const updateCoords = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuEstimatedHeight = 175;
    const menuWidth = 176; // w-44
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Prefer opening upward if space below is limited and space above is greater
    const openUp = spaceBelow < menuEstimatedHeight + 12 && spaceAbove > spaceBelow;

    let left = rect.left;
    if (left + menuWidth > window.innerWidth - 8) {
      left = window.innerWidth - menuWidth - 8;
    }
    if (left < 8) {
      left = 8;
    }

    setCoords({
      left,
      top: openUp ? undefined : rect.bottom + 4,
      bottom: openUp ? window.innerHeight - rect.top + 4 : undefined,
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    function handleScrollOrResize() {
      setIsOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpen) {
      setIsOpen(false);
    } else {
      updateCoords();
      setIsOpen(true);
    }
  };

  return (
    <div className="relative inline-block text-start">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={`p-1.5 rounded-[4px] transition-colors cursor-pointer ${
          isOpen
            ? "bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7]"
            : "hover:bg-[#f5f3ef] dark:hover:bg-[#2c2621] text-[#514537] dark:text-[#a89f91]"
        }`}
        aria-label={t("خيارات الاشتراك", "Subscription options")}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {typeof document !== "undefined" && isOpen && coords &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              left: `${coords.left}px`,
              ...(coords.top !== undefined ? { top: `${coords.top}px` } : {}),
              ...(coords.bottom !== undefined ? { bottom: `${coords.bottom}px` } : {}),
              zIndex: 9999,
            }}
            className="w-44 bg-white dark:bg-[#1e1c1a] rounded-[6px] shadow-[0px_8px_24px_rgba(0,0,0,0.14)] border border-[#f0eeea] dark:border-[#2f2a24] py-1 text-[12px] font-['Cairo'] animate-in fade-in-50 zoom-in-95 select-none"
          >
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onViewDetails(subscription);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#2c2621] transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#9c6402] shrink-0" />
              <span>{t("عرض التفاصيل", "View Details")}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onEdit?.(subscription);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#2c2621] transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#514537] dark:text-[#a89f91] shrink-0" />
              <span>{t("تعديل الباقة", "Change Plan")}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onRenew?.(subscription);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#2c2621] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#059669] shrink-0" />
              <span>{t("تجديد فوري", "Renew Now")}</span>
            </button>

            <div className="h-px bg-[#f0eeea] dark:bg-[#2f2a24] my-1" />

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onCancel?.(subscription);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[#dc2626] dark:text-[#f87171] hover:bg-[#fef2f2] dark:hover:bg-[#311616] transition-colors cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5 text-[#dc2626] dark:text-[#f87171] shrink-0" />
              <span>{t("إلغاء الاشتراك", "Cancel Subscription")}</span>
            </button>
          </div>,
          document.body
        )}
    </div>
  );
}
