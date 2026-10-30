"use client";

import React from "react";
import Image from "next/image";
import { X, LogOut, ShieldAlert } from "lucide-react";
import userAvatarImg from "../../../../public/figma/user-avatar.png";

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
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      dir="rtl"
    >
      <div
        className="bg-white rounded-[14px] border border-[#e6e2dc] shadow-2xl max-w-[480px] w-full overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
      >
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between border-b border-[#f0ede6]">
          <button
            type="button"
            onClick={onClose}
            className="size-[32px] rounded-[6px] hover:bg-[#f5f3ef] text-[#79716b] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="size-[18px]" />
          </button>

          <div className="flex items-start gap-3 text-right">
            <div>
              <h2
                id="logout-modal-title"
                className="text-[18px] font-bold text-[#1b1c1a]"
              >
                تسجيل الخروج من المنصة
              </h2>
              <p className="text-[12px] text-[#79716b] mt-0.5">
                لوحة تحكم الجودي لإدارة مكاتب وشركات المحاماة
              </p>
            </div>

            <div className="size-[42px] rounded-[10px] bg-[#fef2f2] border border-[#fee2e2] flex items-center justify-center shrink-0">
              <LogOut className="size-[20px] text-[#dc2626]" />
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <p className="text-[14px] text-[#1b1c1a] font-medium leading-[22px] text-right">
            هل أنت متأكد من رغبتك في تسجيل الخروج من لوحة التحكم؟
          </p>
          <p className="text-[12px] text-[#79716b] leading-[20px] text-right">
            سيتم إنهاء الجلسة الحالية وإعادتك إلى صفحة تسجيل الدخول. ستحتاج إلى إدخال بيانات الاعتماد للمتابعة مجدداً.
          </p>

          {/* User Preview Card */}
          <div className="bg-[#faf8f5] rounded-[10px] p-3 border border-[#ede8e1] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative size-[36px] rounded-full overflow-hidden border border-[#9c6402]/30 shrink-0">
                <Image
                  src={userAvatarImg}
                  alt={userName}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-right">
                <div className="text-[13px] font-bold text-[#1b1c1a]">
                  {userName}
                </div>
                <div className="text-[11px] text-[#79716b]">
                  {userRole}
                </div>
              </div>
            </div>

            <span className="text-[10px] font-bold text-[#10b981] bg-[#ecfdf5] border border-[#a7f3d0] px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="size-[6px] rounded-full bg-[#10b981] inline-block animate-pulse" />
              جلسة نشطة
            </span>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-[8px] bg-[#fffbeb] border border-[#fef3c7] text-[#92400e] text-[11px] text-right">
            <ShieldAlert className="size-[16px] shrink-0 text-[#d97706]" />
            <span>
              يتطلب الدخول مجدداً مصادقة بيانات المرور المسجلة الخاصة بالمشرف.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-[#fcfbf9] border-t border-[#f0ede6] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-[8px] border border-[#d6cfc5] hover:bg-[#ede8e1] text-[#514537] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            إلغاء التراجع
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-[8px] bg-[#dc2626] hover:bg-[#b91c1c] text-white text-[13px] font-semibold shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="size-[15px]" />
            تأكيد تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );
}
