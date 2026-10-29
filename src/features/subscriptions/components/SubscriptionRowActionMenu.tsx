"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Eye, Edit3, RefreshCw, XCircle } from "lucide-react";
import { SubscriptionRecord } from "../types/subscription.types";

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
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-right" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-[4px] hover:bg-[#f5f3ef] dark:hover:bg-[#2c2621] text-[#514537] dark:text-[#a89f91] transition-colors cursor-pointer"
        aria-label="خيارات الاشتراك"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-44 bg-white dark:bg-[#1e1c1a] rounded-[6px] shadow-lg border border-[#f0eeea] dark:border-[#2f2a24] py-1 z-50 text-[12px] font-['Cairo'] animate-in fade-in-50 zoom-in-95">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onViewDetails(subscription);
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#2c2621] transition-colors cursor-pointer"
          >
            <span>عرض التفاصيل</span>
            <Eye className="w-3.5 h-3.5 text-[#9c6402]" />
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onEdit?.(subscription);
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#2c2621] transition-colors cursor-pointer"
          >
            <span>تعديل الباقة</span>
            <Edit3 className="w-3.5 h-3.5 text-[#514537] dark:text-[#a89f91]" />
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onRenew?.(subscription);
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#2c2621] transition-colors cursor-pointer"
          >
            <span>تجديد فوري</span>
            <RefreshCw className="w-3.5 h-3.5 text-[#059669]" />
          </button>

          <div className="h-px bg-[#f0eeea] dark:bg-[#2f2a24] my-1" />

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onCancel?.(subscription);
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-[#dc2626] dark:text-[#f87171] hover:bg-[#fef2f2] dark:hover:bg-[#311616] transition-colors cursor-pointer"
          >
            <span>إلغاء الاشتراك</span>
            <XCircle className="w-3.5 h-3.5 text-[#dc2626] dark:text-[#f87171]" />
          </button>
        </div>
      )}
    </div>
  );
}
