"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, LogOut, ShieldAlert } from "lucide-react";
import userAvatarImg from "../../../../public/figma/user-avatar.png";
import { useUIStore } from "@/stores/use-ui-store";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
  userRole?: string;
}

export function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  userName = "م. عبد العزيز بن فهد",
  userRole = "مشرف النظام العام",
}: LogoutConfirmModalProps) {
  const language = useUIStore((state) => state.language);
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const currentLang = isMounted ? language : "ar";

  const displayName = currentLang === "en" ? "Eng. Abdulaziz Bin Fahad" : userName;
  const displayRole = currentLang === "en" ? "General System Admin" : userRole;

  // Prevent background scrolling and movement while modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isMounted || !isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white dark:bg-[#221812] rounded-[16px] border border-[#e6e2dc] dark:border-[#3d2a1d] shadow-2xl max-w-[460px] w-full overflow-hidden animate-in zoom-in-95 duration-150 relative text-start"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between border-b border-[#f0ede6] dark:border-[#352419]">
          <div className="flex items-start gap-3 text-start">
            <div className="size-[42px] rounded-[10px] bg-[#fef2f2] dark:bg-[#351a1a] border border-[#fee2e2] dark:border-[#4d2424] flex items-center justify-center shrink-0">
              <LogOut className="size-[20px] text-[#dc2626]" />
            </div>

            <div>
              <h2
                id="logout-modal-title"
                className="text-[18px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]"
              >
                {currentLang === "en" ? "Confirm Logout" : "هل تريد الخروج؟"}
              </h2>
              <p className="text-[12px] text-[#79716b] dark:text-[#a89f91] mt-0.5">
                {currentLang === "en" ? "Al Joudy Law Practice Management Dashboard" : "لوحة تحكم الجودي لإدارة مكاتب وشركات المحاماة"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-[32px] rounded-[6px] hover:bg-[#f5f3ef] dark:hover:bg-[#2c1f17] text-[#79716b] dark:text-[#cdc5bd] flex items-center justify-center transition-colors cursor-pointer"
            aria-label={currentLang === "en" ? "Close window" : "إلغاء وإغلاق النافذة"}
          >
            <X className="size-[18px]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <p className="text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] font-medium leading-[22px] text-start">
            {currentLang === "en" ? "Are you sure you want to log out of the dashboard?" : "هل أنت متأكد من رغبتك في تسجيل الخروج من لوحة التحكم؟"}
          </p>
          <p className="text-[12px] text-[#79716b] dark:text-[#a89f91] leading-[20px] text-start">
            {currentLang === "en" ? "Your current session will end and you will be returned to the login screen. You will need to re-enter your credentials to continue." : "سيتم إنهاء الجلسة الحالية وإعادتك إلى صفحة تسجيل الدخول. ستحتاج إلى إدخال بيانات الاعتماد للمتابعة مجدداً."}
          </p>

          {/* User Preview Card */}
          <div className="bg-[#faf8f5] dark:bg-[#1a120d] rounded-[10px] p-3 border border-[#ede8e1] dark:border-[#352419] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative size-[36px] rounded-full overflow-hidden border border-[#9c6402]/30 shrink-0">
                <Image
                  src={userAvatarImg}
                  alt={displayName}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-start">
                <div className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {displayName}
                </div>
                <div className="text-[11px] text-[#79716b] dark:text-[#a89f91]">
                  {displayRole}
                </div>
              </div>
            </div>

            <span className="text-[10px] font-bold text-[#10b981] bg-[#ecfdf5] dark:bg-[#102a1c] border border-[#a7f3d0] dark:border-[#1a4d33] px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="size-[6px] rounded-full bg-[#10b981] inline-block animate-pulse" />
              {currentLang === "en" ? "Active Session" : "جلسة نشطة"}
            </span>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-[8px] bg-[#fffbeb] dark:bg-[#2e2013] border border-[#fef3c7] dark:border-[#4d361f] text-[#92400e] dark:text-[#fcd34d] text-[11px] text-start">
            <ShieldAlert className="size-[16px] shrink-0 text-[#d97706]" />
            <span>
              {currentLang === "en" ? "Re-entering requires administrator credentials verification." : "يتطلب الدخول مجدداً مصادقة بيانات المرور المسجلة الخاصة بالمشرف."}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-[#fcfbf9] dark:bg-[#1a120d] border-t border-[#f0ede6] dark:border-[#352419] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-[8px] border border-[#d6cfc5] dark:border-[#3d2a1d] hover:bg-[#ede8e1] dark:hover:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            {currentLang === "en" ? "Cancel" : "إلغاء"}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-[8px] bg-[#dc2626] hover:bg-[#b91c1c] text-white text-[13px] font-semibold shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="size-[15px]" />
            <span>{currentLang === "en" ? "Log Out" : "تأكيد الخروج"}</span>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
