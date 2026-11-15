"use client";

import React, { useEffect } from "react";
import { Trash2, Lock, CheckCircle2, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LuxuryAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "success" | "info";
  itemDetails?: {
    name?: string;
    count?: number;
    email?: string;
  };
}

export function LuxuryAlertDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel = "إلغاء",
  variant = "danger",
  itemDetails,
}: LuxuryAlertDialogProps) {
  // ESC key to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const defaultConfirmLabel =
    variant === "danger"
      ? "تأكيد الحذف"
      : variant === "warning"
      ? "تأكيد التعليق"
      : "تأكيد التفعيل";

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 select-none"
    >
      {/* Dialog Card */}
      <div
        className={cn(
          "relative w-full max-w-md rounded-3xl bg-white dark:bg-[#1a1714] border border-[#ded5c6] dark:border-[#2f2a24] shadow-[0_24px_70px_rgba(0,0,0,0.35)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.7)] p-6 text-start overflow-hidden animate-in zoom-in-95 duration-150"
        )}
      >
        {/* Close Button (X) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4.5 end-4.5 p-1.5 rounded-full text-[#8c8279] hover:text-[#2c2825] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-start gap-3.5">
          {variant === "danger" && (
            <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 shadow-2xs">
              <Trash2 className="w-5 h-5" />
            </div>
          )}
          {variant === "warning" && (
            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 shadow-2xs">
              <Lock className="w-5 h-5" />
            </div>
          )}
          {variant === "success" && (
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-2xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}
          {variant === "info" && (
            <div className="w-11 h-11 rounded-2xl bg-[#faf5eb] dark:bg-[#282218] border border-[#eeddbb] dark:border-[#4d3a1f] flex items-center justify-center text-[#c29547] shrink-0 shadow-2xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}

          <div className="flex-1 min-w-0 pe-6">
            <h3 className="text-base font-extrabold text-[#2c2825] dark:text-[#f5f4f0] leading-snug">
              {title}
            </h3>
            <p className="text-xs leading-relaxed text-[#7c7366] dark:text-[#a8a196] mt-1.5">
              {description}
            </p>
          </div>
        </div>

        {/* Optional Item Details Pill */}
        {itemDetails && (itemDetails.name || itemDetails.count) && (
          <div className="mt-4 p-3 rounded-2xl bg-[#faf8f4] dark:bg-[#201d1a] border border-[#ded5c6]/70 dark:border-[#2f2a24] text-xs">
            {itemDetails.name && (
              <div className="flex items-center justify-between text-[#2c2825] dark:text-[#f5f4f0] font-bold">
                <span>المشرف المستهدف:</span>
                <span className="text-[#c29547]">{itemDetails.name}</span>
              </div>
            )}
            {itemDetails.email && (
              <div className="flex items-center justify-between text-[#8c8279] dark:text-[#9e968a] text-[11px] mt-1 font-mono">
                <span>البريد الإلكتروني:</span>
                <span>{itemDetails.email}</span>
              </div>
            )}
            {itemDetails.count !== undefined && itemDetails.count > 0 && (
              <div className="flex items-center justify-between text-[#2c2825] dark:text-[#f5f4f0] font-bold">
                <span>عدد الحسابات المحددة:</span>
                <span className="text-[#c29547] font-mono">{itemDetails.count} حسابات</span>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#ded5c6] dark:border-[#2f2a24] text-xs font-bold text-[#524b43] dark:text-[#c4bcb1] hover:bg-[#faf8f4] dark:hover:bg-[#201d1a] transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={cn(
              "px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow-xs flex items-center gap-1.5",
              variant === "danger" &&
                "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20",
              variant === "warning" &&
                "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20",
              variant === "success" &&
                "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20",
              variant === "info" &&
                "bg-[#c29547] hover:bg-[#ab8037] shadow-[#c29547]/20"
            )}
          >
            {variant === "danger" && <Trash2 className="w-3.5 h-3.5" />}
            {variant === "warning" && <Lock className="w-3.5 h-3.5" />}
            {variant === "success" && <CheckCircle2 className="w-3.5 h-3.5" />}
            <span>{confirmLabel || defaultConfirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
