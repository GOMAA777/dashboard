"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  Clock,
  User,
  Building2,
  ExternalLink,
  Copy,
  Send,
  MessageSquare,
  Paperclip,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n";

export interface TicketQuickViewData {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "pending" | "closed";
  statusLabel: string;
  priority: "low" | "medium" | "urgent";
  priorityLabel: string;
  assignee: {
    name: string;
    role: string;
  };
  clientName: string;
  department: string;
  createdAt: string;
}

interface TicketQuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketQuickViewData | null;
}

export function TicketQuickViewModal({
  isOpen,
  onClose,
  ticket,
}: TicketQuickViewModalProps) {
  const { isEn, direction, t } = useLanguage();
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<Array<{ sender: string; time: string; text: string; isStaff: boolean }>>([
    {
      sender: "م. عبد العزيز فهد (الدعم الفني)",
      time: "منذ يوم (23 أكتوبر 2024)",
      text: "أهلاً بك، تم استلام الطلب وتوجيهه لفريق البنية التحتية لمراجعة تخصيص المساحة الإضافية والربط مع بوابة ناجز. سيتم التفعيل والإشعار فور الاكتمال.",
      isStaff: true,
    },
  ]);

  if (!isOpen || !ticket) return null;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(ticket.ticketNumber);
    toast.success(isEn ? "Ticket number copied!" : "تم نسخ رقم التذكرة!");
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setReplies((prev) => [
      ...prev,
      {
        sender: isEn ? "Support Admin" : "فريق الدعم الفني",
        time: isEn ? "Just now" : "الآن",
        text: replyText.trim(),
        isStaff: true,
      },
    ]);
    setReplyText("");
    toast.success(isEn ? "Reply sent successfully" : "تم إرسال الرد وتحديث التذكرة بنجاح");
  };

  return (
    <div
      dir={direction}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto"
    >
      <div className="bg-white dark:bg-[#1a120d] rounded-[16px] shadow-[0px_20px_50px_0px_rgba(28,20,15,0.35)] w-full max-w-[720px] max-h-[90vh] overflow-hidden flex flex-col border border-[#eae8e4] dark:border-[#38271c] animate-in zoom-in-95 duration-200 my-auto text-start font-['Cairo',sans-serif]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#eae8e4] dark:border-[#38271c] bg-[#faf8f5] dark:bg-[#221812] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="size-8 rounded-[6px] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#837565] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] flex items-center justify-center transition-colors cursor-pointer"
              aria-label={isEn ? "Close dialog" : "إغلاق النافذة"}
            >
              <X className="size-4" />
            </button>
            <div>
              <h2 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {t("تفاصيل تذكرة الدعم الفني", "Technical Support Ticket Details")}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-[12px] font-bold text-[#9c6402] dark:text-[#e29d38]">
                  {ticket.ticketNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="text-[#837565] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] cursor-pointer"
                  title={isEn ? "Copy number" : "نسخ الرقم"}
                >
                  <Copy className="size-3" />
                </button>
              </div>
            </div>
          </div>

          <Link
            href="/tickets"
            onClick={onClose}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-[#ffddb6] dark:border-[#e29d38]/40 bg-[#fff6e8] dark:bg-[rgba(226,157,56,0.15)] text-[#9c6402] dark:text-[#e29d38] hover:bg-[#ffddb6]/50 text-[12px] font-bold transition-colors cursor-pointer"
          >
            <span>{t("فتح في صفحة التذاكر", "Open in Tickets Page")}</span>
            <ExternalLink className="size-3.5" />
          </Link>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Title & Status Badges */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h3 className="text-[19px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-snug">
                {ticket.title}
              </h3>
              <p className="text-[12px] text-[#837565] dark:text-[#8e8680] mt-1 flex items-center gap-2">
                <Clock className="size-3.5" />
                <span>{ticket.createdAt}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="bg-[#fffbeb] border border-amber-200 dark:bg-[#2e1d0f] dark:border-amber-500/40 text-[#b45309] dark:text-[#fbbf24] text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="size-1.5 bg-[#b45309] dark:bg-[#f59e0b] rounded-full" />
                <span>{ticket.statusLabel}</span>
              </span>
              <span className="bg-[#f5f3ef] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] border border-[#eae8e4] dark:border-[#38271c] text-[11px] font-bold px-2.5 py-1 rounded-full">
                {t("أولوية:", "Priority:")} {ticket.priorityLabel}
              </span>
            </div>
          </div>

          {/* Metadata Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#fcfaf7] dark:bg-[#221812] border border-[#f0eeea] dark:border-[#38271c] p-4 rounded-[10px]">
            <div className="space-y-1">
              <span className="text-[11px] text-[#837565] dark:text-[#8e8680] block">
                {t("الجهة / العميل", "Client / Firm")}
              </span>
              <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1.5">
                <Building2 className="size-3.5 text-[#9c6402] dark:text-[#e29d38]" />
                <span className="truncate">{ticket.clientName}</span>
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-[#837565] dark:text-[#8e8680] block">
                {t("الموظف المسؤول", "Assignee")}
              </span>
              <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1.5">
                <User className="size-3.5 text-[#9c6402] dark:text-[#e29d38]" />
                <span>{ticket.assignee.name}</span>
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-[#837565] dark:text-[#8e8680] block">
                {t("القسم المعني", "Department")}
              </span>
              <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {ticket.department}
              </span>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <h4 className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {t("نص وتفاصيل الطلب", "Ticket Request Details")}
            </h4>
            <div className="p-4 bg-[#f8f6f2] dark:bg-[#281c15] rounded-[8px] border border-[#edeae4] dark:border-[#38271c] text-[13px] text-[#44382c] dark:text-[#cdc5bd] leading-relaxed">
              {ticket.description}
            </div>
          </div>

          {/* Activity / Conversation Thread */}
          <div className="space-y-3">
            <h4 className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-2">
              <MessageSquare className="size-4 text-[#9c6402] dark:text-[#e29d38]" />
              <span>{t("سجل الردود والمتابعة", "Response & Follow-up Log")}</span>
            </h4>

            <div className="space-y-3">
              {replies.map((r, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-[8px] bg-white dark:bg-[#20150e] border border-[#eae8e4] dark:border-[#38271c] text-start shadow-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#9c6402] dark:text-[#e29d38] flex items-center gap-1">
                      <CheckCircle2 className="size-3" />
                      {r.sender}
                    </span>
                    <span className="text-[#837565] dark:text-[#8e8680]">{r.time}</span>
                  </div>
                  <p className="text-[12px] text-[#514537] dark:text-[#cdc5bd] leading-relaxed">
                    {r.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Reply Form */}
          <form onSubmit={handleSendReply} className="space-y-2 pt-2 border-t border-[#f0eeea] dark:border-[#38271c]">
            <label className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
              {t("إضافة رد سريع على التذكرة", "Add quick reply")}
            </label>
            <div className="relative">
              <textarea
                rows={2}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={t("اكتب ردك أو التحديث الإداري هنا...", "Type your response or update here...")}
                className="w-full bg-[#fcfaf7] dark:bg-[#221812] border border-[#e4e2de] dark:border-[#38271c] rounded-[8px] p-3 text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] transition-colors resize-none"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#837565] dark:text-[#8e8680]">
                {t("سيتم إرسال إشعار فوري لجهة الاتصال بالمكتب", "An immediate notification will be sent to the office contact")}
              </span>
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="px-4 py-2 rounded-[6px] bg-[#9c6402] hover:bg-[#835401] dark:bg-[#e29d38] dark:hover:bg-[#c28328] text-white dark:text-[#1c140f] text-[12px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="size-3.5 rtl:rotate-180" />
                <span>{t("إرسال الرد", "Send Reply")}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#eae8e4] dark:border-[#38271c] bg-[#faf8f5] dark:bg-[#221812] flex items-center justify-between gap-3 shrink-0">
          <Link
            href="/tickets"
            onClick={onClose}
            className="text-[12px] font-bold text-[#9c6402] dark:text-[#e29d38] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{t("الانتقال لجميع تذاكر النظام", "Go to all system tickets")}</span>
            <ExternalLink className="size-3" />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-[6px] bg-[#f0eeea] hover:bg-[#eae8e4] dark:bg-[#281c15] dark:hover:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] text-[12px] font-bold transition-colors cursor-pointer"
          >
            {t("إغلاق", "Close")}
          </button>
        </div>
      </div>
    </div>
  );
}
