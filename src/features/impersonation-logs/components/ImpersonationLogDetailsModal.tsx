"use client";

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  User,
  Building2,
  Clock,
  Globe,
  Laptop,
  Check,
  Copy,
  ExternalLink,
  Activity,
  AlertCircle,
} from "lucide-react";
import { ModalPortal } from "@/components/shared/ModalPortal";
import { fetchImpersonationSessionReport, endImpersonationSession, type ImpersonationLog } from "@/lib/api/impersonation";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface ImpersonationLogDetailsModalProps {
  isOpen: boolean;
  log: ImpersonationLog | null;
  onClose: () => void;
}

function formatFullArabicDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return new Intl.DateTimeFormat("ar-SA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(d);
}

function calculateDurationText(started?: string | null, ended?: string | null): string {
  if (!started) return "—";
  const start = new Date(started).getTime();
  const end = ended ? new Date(ended).getTime() : Date.now();
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return "—";

  const diffSec = Math.floor((end - start) / 1000);
  const hours = Math.floor(diffSec / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;

  if (hours > 0) {
    return `${hours} ساعة و ${minutes} دقيقة`;
  }
  if (minutes > 0) {
    return `${minutes} دقيقة و ${seconds} ثانية`;
  }
  return `${seconds} ثانية`;
}

export function ImpersonationLogDetailsModal({
  isOpen,
  log,
  onClose,
}: ImpersonationLogDetailsModalProps) {
  const [copiedIp, setCopiedIp] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!isOpen || !log) return null;

  const isActive = !log.ended_at;
  const adminName = log.admin_name || `مشرف #${log.admin_id ?? "—"}`;
  const firmName = log.company_name || log.firm_name || `مكتب #${log.company_id ?? log.firm_id ?? "—"}`;
  const firmId = log.company_id || log.firm_id;

  const handleCopyIp = () => {
    if (!log.ip) return;
    navigator.clipboard.writeText(log.ip);
    setCopiedIp(true);
    toast.success("تم نسخ عنوان IP");
    setTimeout(() => setCopiedIp(false), 2000);
  };

  const [isEnding, setIsEnding] = useState(false);
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);

  const handleEndSession = async () => {
    setIsEnding(true);
    try {
      await endImpersonationSession(log.id);
      toast.success("تم إنهاء الجلسة الإشرافية فوراً بنجاح");
      setShowConfirmEnd(false);
      onClose();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "فشل إنهاء الجلسة";
      toast.error(msg);
    } finally {
      setIsEnding(false);
    }
  };

  const handleCopySummary = async () => {
    try {
      const apiRes = await fetchImpersonationSessionReport(log.id);
      const dataStr = typeof apiRes === "string" ? apiRes : JSON.stringify(apiRes, null, 2);
      if (dataStr && dataStr !== "{}" && !dataStr.includes("<!DOCTYPE")) {
        navigator.clipboard.writeText(dataStr);
        setCopiedSummary(true);
        toast.success("تم نسخ تقرير تدقيق الجلسة الأمني بنجاح");
        setTimeout(() => setCopiedSummary(false), 2000);
        return;
      }
    } catch {
      // Fallback to formatted client summary
    }

    const summary = `[سجل دخول إشرافي]
المشرف: ${adminName} (#${log.admin_id ?? "—"})
المكتب: ${firmName} (#${firmId ?? "—"})
الحالة: ${isActive ? "جلسة نشطة الآن" : "مكتملة"}
وقت البدء: ${formatFullArabicDate(log.started_at)}
وقت الانتهاء: ${isActive ? "مستمرة حتى الآن" : formatFullArabicDate(log.ended_at)}
المدة: ${calculateDurationText(log.started_at, log.ended_at)}
عنوان IP: ${log.ip || "غير محدد"}
المتصفح: ${log.user_agent || "غير محدد"}`;

    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    toast.success("تم نسخ ملخص تفاصيل الجلسة");
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <ModalPortal isOpen={isOpen}>
      <div
        dir="rtl"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-['Cairo',sans-serif] animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="bg-white dark:bg-[#1f1610] border border-[#ded5c6] dark:border-[#3d2a1d] rounded-[10px] w-full max-w-[620px] shadow-[0_12px_40px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#f0eeea] dark:border-[#2f2015] bg-[#faf8f5] dark:bg-[#1a120d]">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-[8px] bg-[#fff6e8] dark:bg-[rgba(226,157,56,0.15)] text-[#9c6402] dark:text-[#e29d38] flex items-center justify-center border border-[#e8dccb] dark:border-[#4d3725]">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    تفاصيل جلسة الدخول الإشرافية
                  </h3>
                  {isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#e8f5e9] dark:bg-[#132c1c] text-[#15803d] dark:text-[#6ee7b7] border border-[#a3e635]/30">
                      <span className="size-1.5 rounded-full bg-[#15803d] dark:bg-[#6ee7b7] animate-pulse" />
                      نشطة الآن
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#f5f3ef] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] border border-[#eae8e4] dark:border-[#38271c]">
                      مكتملة
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-[#737067] dark:text-[#a89f91] mt-0.5">
                  المعرف المرجعي للجلسة: <span className="font-mono text-[#9c6402] dark:text-[#e29d38]">#{log.id}</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="size-8 rounded-[6px] hover:bg-[#eae8e4] dark:hover:bg-[#2c1f17] text-[#737067] dark:text-[#a89f91] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 overflow-y-auto space-y-4 scrollbar-thin">
            {/* 1. Parties Card (Admin & Office) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Admin */}
              <div className="bg-[#faf8f5] dark:bg-[#150f0b] border border-[#f0eeea] dark:border-[#2f2015] rounded-[8px] p-3.5 flex items-start gap-3">
                <div className="size-9 rounded-full bg-[#9c6402]/10 dark:bg-[#e29d38]/15 text-[#9c6402] dark:text-[#e29d38] flex items-center justify-center shrink-0 border border-[#9c6402]/20">
                  <User className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold text-[#837565] dark:text-[#9e9286] block">
                    مشرف النظام المنفذ
                  </span>
                  <p className="text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] truncate mt-0.5">
                    {adminName}
                  </p>
                  <span className="inline-block text-[11px] font-mono text-[#514537] dark:text-[#a89f91] mt-0.5">
                    المعرف: #{log.admin_id ?? "—"}
                  </span>
                </div>
              </div>

              {/* Office */}
              <div className="bg-[#faf8f5] dark:bg-[#150f0b] border border-[#f0eeea] dark:border-[#2f2015] rounded-[8px] p-3.5 flex items-start gap-3">
                <div className="size-9 rounded-full bg-[#1b7340]/10 dark:bg-[#10b981]/15 text-[#1b7340] dark:text-[#6ee7b7] flex items-center justify-center shrink-0 border border-[#1b7340]/20">
                  <Building2 className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold text-[#837565] dark:text-[#9e9286] block">
                    مكتب المحاماة المستهدف
                  </span>
                  <p className="text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] truncate mt-0.5">
                    {firmName}
                  </p>
                  {firmId && (
                    <Link
                      href={`/accounts?officeId=${firmId}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#9c6402] dark:text-[#e29d38] hover:underline mt-0.5"
                    >
                      <span>عرض ملف المكتب (#{firmId})</span>
                      <ExternalLink className="size-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Timeline and Timestamps */}
            <div className="bg-white dark:bg-[#150f0b] border border-[#f0eeea] dark:border-[#2f2015] rounded-[8px] p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#f5f3ef] dark:border-[#261910] pb-2">
                <div className="flex items-center gap-2 text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  <Clock className="size-4 text-[#9c6402] dark:text-[#e29d38]" />
                  <span>الجدول الزمني للجلسة</span>
                </div>
                <div className="text-[12px] font-bold text-[#9c6402] dark:text-[#e29d38] bg-[#fff6e8] dark:bg-[rgba(226,157,56,0.15)] px-2.5 py-0.5 rounded-[4px]">
                  المدة: {calculateDurationText(log.started_at, log.ended_at)}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[11px] text-[#837565] dark:text-[#9e9286] block mb-1">
                    توقيت بدء الجلسة
                  </span>
                  <div className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {formatFullArabicDate(log.started_at)}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-[#837565] dark:text-[#9e9286] block mb-1">
                    توقيت إنهاء الجلسة
                  </span>
                  <div className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {isActive ? (
                      <span className="text-[#15803d] dark:text-[#6ee7b7] font-semibold">
                        الجلسة لا تزال جارية ومفتوحة
                      </span>
                    ) : (
                      formatFullArabicDate(log.ended_at)
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Security and Network Info */}
            <div className="bg-[#faf8f5] dark:bg-[#150f0b] border border-[#f0eeea] dark:border-[#2f2015] rounded-[8px] p-4 space-y-3">
              <div className="flex items-center gap-2 text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                <Globe className="size-4 text-[#9c6402] dark:text-[#e29d38]" />
                <span>بيانات الشبكة والأمان</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* IP Address */}
                <div>
                  <span className="text-[11px] text-[#837565] dark:text-[#9e9286] block mb-1">
                    عنوان بروتوكول الإنترنت (IP)
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      dir="ltr"
                      className="font-mono text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] bg-white dark:bg-[#1f1610] px-2.5 py-1 rounded-[4px] border border-[#ded5c6] dark:border-[#38271c]"
                    >
                      {log.ip || "—"}
                    </span>
                    {log.ip && (
                      <button
                        type="button"
                        onClick={handleCopyIp}
                        title="نسخ عنوان IP"
                        className="size-7 rounded-[4px] border border-[#ded5c6] dark:border-[#38271c] hover:bg-white dark:hover:bg-[#1f1610] flex items-center justify-center text-[#737067] dark:text-[#a89f91] transition-colors cursor-pointer"
                      >
                        {copiedIp ? <Check className="size-3.5 text-green-600" /> : <Copy className="size-3.5" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Device / Client Info */}
                <div>
                  <span className="text-[11px] text-[#837565] dark:text-[#9e9286] block mb-1">
                    بيئة العميل / المتصفح
                  </span>
                  <div className="text-[12px] font-medium text-[#1b1c1a] dark:text-[#fdfbf7] truncate" title={log.user_agent || ""}>
                    {log.user_agent || "غير متوفر"}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Compliance Notice */}
            <div className="bg-[#fff9ee] dark:bg-[#2b1f13] border border-[#f0debe] dark:border-[#4d3725] rounded-[8px] p-3 flex items-start gap-2.5">
              <AlertCircle className="size-4 text-[#9c6402] dark:text-[#e29d38] shrink-0 mt-0.5" />
              <p className="text-[11px] leading-[18px] text-[#6b4703] dark:text-[#f5d496]">
                تخضع كافة جلسات دخول المشرفين لمكاتب المحاماة للتوثيق والتدقيق التلقائي التام بموجب معايير الأمان والامتثال والخصوصية.
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-[#f0eeea] dark:border-[#2f2015] bg-[#faf8f5] dark:bg-[#1a120d] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopySummary}
                className="px-3.5 py-2 rounded-[6px] border border-[#ded5c6] dark:border-[#38271c] bg-white dark:bg-[#221812] text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] font-bold hover:bg-[#eae8e4] dark:hover:bg-[#2c1f17] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedSummary ? (
                  <>
                    <Check className="size-3.5 text-green-600" />
                    <span>تم نسخ التقرير</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5 text-[#837565] dark:text-[#a89f91]" />
                    <span>نسخ تقرير الجلسة</span>
                  </>
                )}
              </button>

              {isActive && (
                showConfirmEnd ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={isEnding}
                      onClick={handleEndSession}
                      className="px-3 py-1.5 rounded-[6px] bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isEnding ? "جارٍ الإنهاء..." : "تأكيد إنهاء الجلسة"}
                    </button>
                    <button
                      type="button"
                      disabled={isEnding}
                      onClick={() => setShowConfirmEnd(false)}
                      className="px-2.5 py-1.5 rounded-[6px] border border-[#ded5c6] dark:border-[#38271c] text-[11px] font-bold text-[#737067] dark:text-[#a89f91] hover:bg-[#eae8e4] dark:hover:bg-[#2c1f17] transition-colors cursor-pointer"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowConfirmEnd(true)}
                    className="px-3.5 py-2 rounded-[6px] border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-[12px] font-bold hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="size-3.5" />
                    <span>إنهاء الجلسة فوراً</span>
                  </button>
                )
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-[6px] bg-[#9c6402] hover:bg-[#855402] text-white text-[13px] font-bold transition-colors cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
