"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Eye,
  PenSquare,
  Receipt,
  Ban,
  Trash2,
} from "lucide-react";

interface ClientRowActionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: () => void;
  onEdit: () => void;
  onManageSubscriptions: () => void;
  onDeactivate: () => void;
  onDelete: () => void;
  positionClass?: string;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export function ClientRowActionMenu({
  isOpen,
  onClose,
  onViewDetails,
  onEdit,
  onManageSubscriptions,
  onDeactivate,
  onDelete,
  triggerRef,
}: ClientRowActionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [coords, setCoords] = useState<{
    left: number;
    top?: number;
    bottom?: number;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const el = triggerRef?.current || anchorRef.current?.parentElement;
    if (el) {
      const rect = el.getBoundingClientRect();
      const menuEstimatedHeight = 220;
      const menuWidth = 210;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
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
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const el = triggerRef?.current || anchorRef.current?.parentElement;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        (!el || !el.contains(target))
      ) {
        onClose();
      }
    }

    function handleScrollOrResize() {
      onClose();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
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
  }, [isOpen, onClose, triggerRef]);

  return (
    <>
      <span ref={anchorRef} className="hidden" aria-hidden="true" />
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
            className="w-[210px] bg-white dark:bg-[#1e1c1a] rounded-[8px] p-[6px] shadow-[0px_8px_24px_rgba(0,0,0,0.14)] border border-[#eae8e4] dark:border-[#2f2a24] flex flex-col gap-[2px] text-start font-['Cairo',sans-serif] animate-in fade-in-50 zoom-in-95 select-none"
            data-node-id="1:1399"
          >
            {/* 1. عرض التفاصيل */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewDetails();
              }}
              className="w-full flex items-center gap-[10px] px-[12px] py-[8px] rounded-[4px] hover:bg-[#f5f3ef] dark:hover:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold transition-colors cursor-pointer group"
            >
              <Eye className="size-[15px] text-[#514537] dark:text-[#a89f91] group-hover:text-[#1b1c1a] dark:group-hover:text-[#fdfbf7] shrink-0" />
              <span className="leading-[18px]">عرض التفاصيل</span>
            </button>

            {/* 2. تعديل بيانات الحساب */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit();
              }}
              className="w-full flex items-center gap-[10px] px-[12px] py-[8px] rounded-[4px] hover:bg-[#f5f3ef] dark:hover:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold transition-colors cursor-pointer group"
            >
              <PenSquare className="size-[15px] text-[#514537] dark:text-[#a89f91] group-hover:text-[#1b1c1a] dark:group-hover:text-[#fdfbf7] shrink-0" />
              <span className="leading-[18px]">تعديل بيانات الحساب</span>
            </button>

            {/* 3. إدارة الاشتراكات والفواتير */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onManageSubscriptions();
              }}
              className="w-full flex items-center gap-[10px] px-[12px] py-[8px] rounded-[4px] hover:bg-[#f5f3ef] dark:hover:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold transition-colors cursor-pointer group"
            >
              <Receipt className="size-[15px] text-[#514537] dark:text-[#a89f91] group-hover:text-[#1b1c1a] dark:group-hover:text-[#fdfbf7] shrink-0" />
              <span className="leading-[18px]">إدارة الاشتراكات والفواتير</span>
            </button>

            {/* Divider */}
            <div className="h-px bg-[#f0eeea] dark:bg-[#2f2a24] my-[4px]" />

            {/* 4. تعطيل الحساب مؤقتاً */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onDeactivate();
              }}
              className="w-full flex items-center gap-[10px] px-[12px] py-[8px] rounded-[4px] hover:bg-[#fffbeb] dark:hover:bg-[#342711] text-[#b45309] dark:text-[#fbbf24] text-[13px] font-semibold transition-colors cursor-pointer group"
            >
              <Ban className="size-[15px] text-[#b45309] dark:text-[#fbbf24] shrink-0" />
              <span className="leading-[18px]">تعطيل الحساب مؤقتاً</span>
            </button>

            {/* 5. حذف المكتب نهائياً */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onDelete();
              }}
              className="w-full flex items-center gap-[10px] px-[12px] py-[8px] rounded-[4px] hover:bg-[#fef2f2] dark:hover:bg-[#311616] text-[#dc2626] dark:text-[#f87171] text-[13px] font-semibold transition-colors cursor-pointer group"
            >
              <Trash2 className="size-[15px] text-[#dc2626] dark:text-[#f87171] shrink-0" />
              <span className="leading-[18px]">حذف المكتب نهائياً</span>
            </button>
          </div>,
          document.body
        )}
    </>
  );
}
