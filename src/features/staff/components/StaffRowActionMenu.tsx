"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Eye, LogIn, KeyRound, UserX, UserCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface StaffRowActionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: () => void;
  onLoginAsEmployee: () => void;
  onResetPassword: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
  isSuspended?: boolean;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export function StaffRowActionMenu({
  isOpen,
  onClose,
  onViewDetails,
  onLoginAsEmployee,
  onResetPassword,
  onActivate,
  onDeactivate,
  isSuspended,
  triggerRef,
}: StaffRowActionMenuProps) {
  const { t } = useLanguage();
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
      const triggerEl = triggerRef?.current || anchorRef.current?.parentElement;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        (!triggerEl || !triggerEl.contains(target))
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
            className="w-[210px] bg-white dark:bg-[#221812] rounded-[8px] p-[6px] shadow-[0px_8px_24px_rgba(0,0,0,0.14)] border border-[#eae8e4] dark:border-[#38271c] flex flex-col gap-[2px] text-start font-['Cairo',sans-serif] animate-in fade-in-50 zoom-in-95 select-none"
          >
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewDetails();
              }}
              className="w-full flex items-center gap-[10px] px-[12px] py-[8px] rounded-[4px] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold transition-colors cursor-pointer group"
            >
              <Eye className="size-[15px] text-[#514537] dark:text-[#a89f91] group-hover:text-[#1b1c1a] dark:group-hover:text-[#fdfbf7] shrink-0" />
              <span className="leading-[18px]">{t("عرض تفاصيل الموظف", "View Employee Details")}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onLoginAsEmployee();
              }}
              className="w-full flex items-center gap-[10px] px-[12px] py-[8px] rounded-[4px] hover:bg-[#fff9ee] dark:hover:bg-[#342711] text-[#9c6402] dark:text-[#e29d38] text-[13px] font-semibold transition-colors cursor-pointer group"
            >
              <LogIn className="size-[15px] text-[#9c6402] dark:text-[#e29d38] shrink-0" />
              <span className="leading-[18px]">{t("الدخول كالموظف", "Login as Employee")}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onResetPassword();
              }}
              className="w-full flex items-center gap-[10px] px-[12px] py-[8px] rounded-[4px] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold transition-colors cursor-pointer group"
            >
              <KeyRound className="size-[15px] text-[#514537] dark:text-[#a89f91] group-hover:text-[#1b1c1a] dark:group-hover:text-[#fdfbf7] shrink-0" />
              <span className="leading-[18px]">{t("إعادة تعيين كلمة المرور", "Reset Password")}</span>
            </button>

            <div className="h-px bg-[#f0eeea] dark:bg-[#38271c] my-[4px]" />

            {isSuspended ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onActivate();
                }}
                className="w-full flex items-center gap-[10px] px-[12px] py-[8px] rounded-[4px] hover:bg-[#e8f5e9] dark:hover:bg-[#132c1c] text-[#1b7340] dark:text-[#6ee7b7] text-[13px] font-semibold transition-colors cursor-pointer group"
              >
                <UserCheck className="size-[15px] text-[#1b7340] dark:text-[#6ee7b7] shrink-0" />
                <span className="leading-[18px]">{t("تفعيل حساب الموظف", "Activate Account")}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDeactivate();
                }}
                className={cn(
                  "w-full flex items-center gap-[10px] px-[12px] py-[8px] rounded-[4px] text-[13px] font-semibold transition-colors cursor-pointer group",
                  "hover:bg-[#fffbeb] dark:hover:bg-[#342711] text-[#b45309] dark:text-[#fbbf24]"
                )}
              >
                <UserX className="size-[15px] text-[#b45309] dark:text-[#fbbf24] shrink-0" />
                <span className="leading-[18px]">{t("إيقاف حساب الموظف", "Suspend Account")}</span>
              </button>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
