"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  Eye,
  DoorOpen,
  Copy,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import type { ExtendedImpersonationLog } from "./ImpersonationLogsView";

interface ImpersonationRowActionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  log: ExtendedImpersonationLog;
  triggerRef?: React.RefObject<HTMLElement | null>;
  onViewDetails: () => void;
  onEnterOfficeAsAdmin: () => void;
}

export function ImpersonationRowActionMenu({
  isOpen,
  onClose,
  log,
  triggerRef,
  onViewDetails,
  onEnterOfficeAsAdmin,
}: ImpersonationRowActionMenuProps) {
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
      const menuEstimatedHeight = 190;
      const menuWidth = 210;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const openUp = spaceBelow < menuEstimatedHeight + 12 && spaceAbove > spaceBelow;

      // In RTL, the button is near the left edge of the table.
      // Default RTL align: rect.right - menuWidth.
      // If that causes it to overflow the left screen boundary (left < 16),
      // anchor at button's left or 16px so it opens inward into the viewport.
      let left = rect.right - menuWidth;
      if (left < 16) {
        left = Math.max(16, rect.left);
      }
      if (left + menuWidth > window.innerWidth - 16) {
        left = Math.max(16, window.innerWidth - menuWidth - 16);
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

  const officeId = log.company_id || log.firm_id || log.id;

  return (
    <>
      <span ref={anchorRef} className="hidden" aria-hidden="true" />
      {typeof document !== "undefined" &&
        isOpen &&
        coords &&
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
            className="w-[210px] bg-white dark:bg-[#1f1610] border border-[#eae8e4] dark:border-[#38271c] rounded-[6px] shadow-xl py-1.5 z-50 font-['Cairo',sans-serif] text-start animate-in fade-in zoom-in-95 duration-150 select-none"
          >
            {/* 1. عرض تفاصيل الجلسة */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewDetails();
              }}
              className="w-full px-3 py-2 text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#faf8f5] dark:hover:bg-[#281c15] flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Eye className="size-4 text-[#9c6402] dark:text-[#e29d38]" />
              <span>عرض تفاصيل الجلسة</span>
            </button>

            {/* 2. دخول المكتب كمسؤول */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onEnterOfficeAsAdmin();
              }}
              className="w-full px-3 py-2 text-[12px] font-bold text-[#9c6402] dark:text-[#e29d38] hover:bg-[#fff9ee] dark:hover:bg-[#342711] flex items-center gap-2 cursor-pointer transition-colors"
            >
              <DoorOpen className="size-4" />
              <span>دخول المكتب كمسؤول</span>
            </button>

            {/* 3. نسخ عنوان IP */}
            {log.ip && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigator.clipboard.writeText(log.ip || "");
                  toast.success(`تم نسخ عنوان IP (${log.ip})`);
                }}
                className="w-full px-3 py-2 text-[12px] font-semibold text-[#514537] dark:text-[#cdc5bd] hover:bg-[#faf8f5] dark:hover:bg-[#281c15] flex items-center gap-2 cursor-pointer transition-colors border-t border-[#f0eeea] dark:border-[#38271c]"
              >
                <Copy className="size-3.5 text-[#837565] dark:text-[#a89f91]" />
                <span>نسخ عنوان IP</span>
              </button>
            )}

            {/* 4. الانتقال لملف المكتب */}
            <Link
              href={`/accounts?officeId=${officeId}`}
              onClick={onClose}
              className="w-full px-3 py-2 text-[12px] font-semibold text-[#514537] dark:text-[#cdc5bd] hover:bg-[#faf8f5] dark:hover:bg-[#281c15] flex items-center gap-2 transition-colors border-t border-[#f0eeea] dark:border-[#38271c]"
            >
              <ExternalLink className="size-3.5 text-[#837565] dark:text-[#a89f91]" />
              <span>الانتقال لملف المكتب</span>
            </Link>
          </div>,
          document.body
        )}
    </>
  );
}
