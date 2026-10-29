"use client";

import React, { useEffect, useRef } from "react";
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
}

export function ClientRowActionMenu({
  isOpen,
  onClose,
  onViewDetails,
  onEdit,
  onManageSubscriptions,
  onDeactivate,
  onDelete,
  positionClass = "left-0 top-full mt-1",
}: ClientRowActionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  return (
    <div
      ref={menuRef}
      className={`absolute z-50 w-[210px] bg-white rounded-[8px] p-[6px] shadow-[0px_8px_24px_rgba(0,0,0,0.12)] border border-[#eae8e4] flex flex-col gap-[2px] text-right font-['Cairo',sans-serif] ${positionClass}`}
      data-node-id="1:1399"
      dir="rtl"
    >
      {/* 1. عرض التفاصيل */}
      <button
        type="button"
        onClick={() => {
          onClose();
          onViewDetails();
        }}
        className="w-full flex items-center justify-between px-[12px] py-[8px] rounded-[4px] hover:bg-[#f5f3ef] text-[#1b1c1a] text-[13px] font-semibold transition-colors cursor-pointer group"
      >
        <span className="leading-[18px]">عرض التفاصيل</span>
        <Eye className="size-[15px] text-[#514537] group-hover:text-[#1b1c1a] shrink-0" />
      </button>

      {/* 2. تعديل بيانات الحساب */}
      <button
        type="button"
        onClick={() => {
          onClose();
          onEdit();
        }}
        className="w-full flex items-center justify-between px-[12px] py-[8px] rounded-[4px] hover:bg-[#f5f3ef] text-[#1b1c1a] text-[13px] font-semibold transition-colors cursor-pointer group"
      >
        <span className="leading-[18px]">تعديل بيانات الحساب</span>
        <PenSquare className="size-[15px] text-[#514537] group-hover:text-[#1b1c1a] shrink-0" />
      </button>

      {/* 3. إدارة الاشتراكات والفواتير */}
      <button
        type="button"
        onClick={() => {
          onClose();
          onManageSubscriptions();
        }}
        className="w-full flex items-center justify-between px-[12px] py-[8px] rounded-[4px] hover:bg-[#f5f3ef] text-[#1b1c1a] text-[13px] font-semibold transition-colors cursor-pointer group"
      >
        <span className="leading-[18px]">إدارة الاشتراكات والفواتير</span>
        <Receipt className="size-[15px] text-[#514537] group-hover:text-[#1b1c1a] shrink-0" />
      </button>

      {/* Divider */}
      <div className="h-px bg-[#f0eeea] my-[4px]" />

      {/* 4. تعطيل الحساب مؤقتاً */}
      <button
        type="button"
        onClick={() => {
          onClose();
          onDeactivate();
        }}
        className="w-full flex items-center justify-between px-[12px] py-[8px] rounded-[4px] hover:bg-[#fffbeb] text-[#b45309] text-[13px] font-semibold transition-colors cursor-pointer group"
      >
        <span className="leading-[18px]">تعطيل الحساب مؤقتاً</span>
        <Ban className="size-[15px] text-[#b45309] shrink-0" />
      </button>

      {/* 5. حذف المكتب نهائياً */}
      <button
        type="button"
        onClick={() => {
          onClose();
          onDelete();
        }}
        className="w-full flex items-center justify-between px-[12px] py-[8px] rounded-[4px] hover:bg-[#fef2f2] text-[#dc2626] text-[13px] font-semibold transition-colors cursor-pointer group"
      >
        <span className="leading-[18px]">حذف المكتب نهائياً</span>
        <Trash2 className="size-[15px] text-[#dc2626] shrink-0" />
      </button>
    </div>
  );
}
