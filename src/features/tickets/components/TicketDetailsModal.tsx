"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  UserCheck,
  RefreshCw,
  Clock,
  Send,
  Paperclip,
  FileText,
  Download,
  Eye,
  Mail,
  Phone,
  ShieldCheck,
  AlertTriangle,
  History,
} from "lucide-react";
import { toast } from "sonner";
import { Ticket } from "../types/tickets.types";
import { useLanguage } from "@/lib/i18n";

interface TicketDetailsModalProps {
  ticket: Ticket;
  onBack: () => void;
  onOpenAssigneeModal: () => void;
  onOpenStatusModal: () => void;
  onCloseTicketSuccess: () => void;
  onSendMessage: (ticketId: string, content: string) => void;
}

export function TicketDetailsModal({
  ticket,
  onBack,
  onOpenAssigneeModal,
  onOpenStatusModal,
  onCloseTicketSuccess,
  onSendMessage,
}: TicketDetailsModalProps) {
  const { direction, isEn } = useLanguage();
  const [replyText, setReplyText] = useState("");

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSendMessage(ticket.id, replyText.trim());
    setReplyText("");
    toast.success(
      isEn
        ? "Reply sent and client notified successfully"
        : "تم إرسال الرد وإشعار العميل بنجاح"
    );
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "urgent":
        return isEn ? "Urgent" : "عاجلة";
      case "medium":
        return isEn ? "Medium" : "متوسطة";
      case "low":
        return isEn ? "Low" : "منخفضة";
      default:
        return priority;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return isEn ? "Open" : "مفتوحة";
      case "in_progress":
        return isEn ? "In Progress" : "جاري العمل عليها";
      case "pending":
        return isEn ? "Pending" : "معلقة";
      case "closed":
        return isEn ? "Closed" : "مغلقة";
      default:
        return status;
    }
  };

  return (
    <div
      dir={direction}
      className="flex flex-col gap-[20px] w-full pb-[40px]"
    >
      {/* Primary Header & Key Actions Section */}
      <div
        className="bg-white rounded-[8px] p-[24px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-[16px]"
      >
        {/* Ticket Title & Metadata */}
        <div className="flex flex-col gap-[6px] text-start">
          <div className="flex items-center gap-[8px] flex-wrap">
            <span className="font-mono font-bold text-[#625d5d] text-[12px] bg-[#f0eeea] px-[8px] py-[2px] rounded-[3px]">
              {ticket.ticketNumber}
            </span>
            <div className="bg-[#ffdad6] text-[#93000a] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px] flex items-center gap-[4px]">
              <span>{getPriorityLabel(ticket.priority)}</span>
              <div className="size-[5px] rounded-full bg-[#ba1a1a]" />
            </div>
            <div className="bg-[rgba(255,221,182,0.4)] text-[#9c6402] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px]">
              {getStatusLabel(ticket.status)}
            </div>
          </div>

          <h1 className="text-[#1b1c1a] font-bold text-[22px] sm:text-[26px] leading-[34px]">
            {ticket.title}
          </h1>

          <div className="flex items-center gap-[12px] text-[#837565] text-[12px] flex-wrap pt-[2px]">
            <div className="flex items-center gap-[4px]">
              <Clock className="size-[13px]" />
              <span>
                {isEn ? `Created: ${ticket.createdAt}` : `تاريخ الإنشاء: ${ticket.createdAt}`}
              </span>
            </div>
            <span>•</span>
            <div>
              {isEn
                ? `Last activity: ${ticket.updatedAt} (by ${ticket.assignee.name})`
                : `آخر نشاط: ${ticket.updatedAt} (بواسطة ${ticket.assignee.name})`}
            </div>
            {ticket.judicialReference && (
              <>
                <span>•</span>
                <span className="font-mono text-[#514537]">
                  {isEn
                    ? `Judicial Ref: ${ticket.judicialReference}`
                    : `المعرف العدلي: ${ticket.judicialReference}`}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Header Interactive Actions */}
        <div className="flex flex-wrap items-center gap-[8px] shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="bg-white border border-[#eae8e4] hover:bg-[#f5f3ef] text-[#1b1c1a] flex items-center gap-[6px] px-[14px] py-[8px] rounded-[4px] font-semibold text-[13px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors cursor-pointer"
          >
            <ArrowRight className={`size-[13px] ${isEn ? "rotate-180" : ""}`} />
            <span>{isEn ? "Back to Tickets" : "العودة للتذاكر"}</span>
          </button>

          <button
            type="button"
            onClick={onOpenStatusModal}
            className="bg-[#f0eeea] hover:bg-[#eae8e4] text-[#1b1c1a] flex items-center gap-[6px] px-[16px] py-[8px] rounded-[4px] font-semibold text-[13px] transition-colors cursor-pointer"
          >
            <RefreshCw className="size-[14px] text-[#514537]" />
            <span>{isEn ? "Change Status" : "تغيير الحالة"}</span>
          </button>

          <button
            type="button"
            onClick={onOpenAssigneeModal}
            className="bg-[#f0eeea] hover:bg-[#eae8e4] text-[#1b1c1a] flex items-center gap-[6px] px-[16px] py-[8px] rounded-[4px] font-semibold text-[13px] transition-colors cursor-pointer"
          >
            <UserCheck className="size-[14px] text-[#514537]" />
            <span>{isEn ? "Reassign Staff" : "إسناد لموظف"}</span>
          </button>

          {ticket.status !== "closed" && (
            <button
              type="button"
              onClick={onCloseTicketSuccess}
              className="bg-[#9c6402] hover:bg-[#855402] text-white flex items-center gap-[6px] px-[20px] py-[8px] rounded-[4px] font-semibold text-[13px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-all cursor-pointer"
            >
              <CheckCircle2 className="size-[15px]" />
              <span>{isEn ? "Close Ticket Successfully" : "إغلاق التذكرة بنجاح"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Workstation Layout (Split 2-Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px] w-full">
        {/* Main Content Column (8 cols on desktop) */}
        <div className="lg:col-span-8 flex flex-col gap-[20px]">
          {/* Card 1: Problem Detailed Overview */}
          <div
            className="bg-white rounded-[8px] p-[24px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 flex flex-col gap-[16px]"
          >
            <div className="border-b border-[#eae8e4] pb-[14px] flex items-center justify-between">
              <span className="bg-[#f0eeea] text-[#514537] text-[10px] font-bold px-[10px] py-[4px] rounded-[4px]">
                {isEn
                  ? `Category: ${ticket.category || "API Integration"}`
                  : `تصنيف العطل: ${ticket.category || "تكامل API"}`}
              </span>
              <div className="flex items-center gap-[8px]">
                <h2 className="text-[#1b1c1a] font-bold text-[18px] leading-[26px]">
                  {isEn ? "Technical Issue Details & Overview" : "بيانات ووصف المشكلة التقنية"}
                </h2>
                <div className="bg-[rgba(123,78,0,0.1)] size-[36px] rounded-[4px] flex items-center justify-center shrink-0">
                  <AlertTriangle className="size-[18px] text-[#9c6402]" />
                </div>
              </div>
            </div>

            <p className="text-[#1b1c1a] font-normal text-[14px] leading-[26px] text-start whitespace-pre-line">
              {ticket.description}
            </p>
          </div>

          {/* Card 2: Attached Technical Files */}
          <div
            className="bg-white rounded-[8px] p-[24px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 flex flex-col gap-[16px]"
          >
            <div className="border-b border-[#eae8e4] pb-[12px]">
              <h3 className="text-[#1b1c1a] font-bold text-[16px] leading-[24px] text-start">
                {isEn
                  ? `Attached Files & Technical Artifacts (${ticket.attachments.length})`
                  : `المرفقات والملفات الفنية المرفوعة (${ticket.attachments.length})`}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[14px]">
              {ticket.attachments.map((file) => (
                <div
                  key={file.id}
                  className="bg-[#f5f3ef] rounded-[8px] p-[14px] flex flex-col justify-between border border-[#eae8e4]/60"
                >
                  <div className="flex items-start justify-between gap-[8px]">
                    <div className="bg-[#fef3c7] size-[38px] rounded-[4px] flex items-center justify-center shrink-0">
                      <FileText className="size-[18px] text-[#b45309]" />
                    </div>
                    <div className="flex flex-col text-start overflow-hidden">
                      <span
                        className="font-bold text-[#1b1c1a] text-[12px] leading-[18px] truncate"
                        title={file.name}
                      >
                        {file.name}
                      </span>
                      <span className="text-[#837565] text-[10px] leading-[14px]">
                        {file.size} • {file.typeLabel}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-[#eae8e4] pt-[8px] mt-[12px] flex items-center justify-between">
                    <div className="flex items-center gap-[4px]">
                      <button
                        type="button"
                        onClick={() =>
                          toast.info(isEn ? `Opening: ${file.name}` : `فتح الملف: ${file.name}`)
                        }
                        className="size-[24px] rounded-[2px] hover:bg-[#eae8e4] flex items-center justify-center text-[#514537] cursor-pointer"
                        title={isEn ? "Preview" : "معاينة"}
                      >
                        <Eye className="size-[13px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          toast.success(
                            isEn ? `Downloading: ${file.name}` : `جاري تنزيل: ${file.name}`
                          )
                        }
                        className="size-[24px] rounded-[2px] hover:bg-[#eae8e4] flex items-center justify-center text-[#514537] cursor-pointer"
                        title={isEn ? "Download" : "تحميل"}
                      >
                        <Download className="size-[13px]" />
                      </button>
                    </div>

                    <div className="flex items-center gap-[4px] text-[#047857] text-[10px] font-bold">
                      <ShieldCheck className="size-[12px]" />
                      <span>{file.verifiedStatus}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Conversation / Messages Thread */}
          <div className="bg-white rounded-[8px] p-[24px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 flex flex-col gap-[20px]">
            <div className="border-b border-[#eae8e4] pb-[12px] flex items-center justify-between">
              <span className="text-[#837565] text-[11px]">
                {isEn
                  ? `${ticket.messages.length} messages exchanged`
                  : `${ticket.messages.length} رسائل متبادلة`}
              </span>
              <h3 className="text-[#1b1c1a] font-bold text-[16px] leading-[24px]">
                {isEn ? "Conversation & Response Log" : "سجل المراسلات والاستجابة"}
              </h3>
            </div>

            {/* Messages List */}
            <div className="flex flex-col gap-[16px]">
              {ticket.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-[16px] rounded-[8px] flex flex-col gap-[8px] text-start ${
                    msg.isStaff
                      ? "bg-[rgba(255,221,182,0.15)] border border-[#9c6402]/20 me-[24px]"
                      : "bg-[#f5f3ef] border border-[#eae8e4] ms-[24px]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[#837565] text-[10px]">{msg.timestamp}</span>
                    <div className="flex items-center gap-[8px]">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1b1c1a] text-[13px]">
                          {msg.senderName}
                        </span>
                        <span className="text-[#837565] text-[10px]">
                          {msg.senderRole}
                        </span>
                      </div>
                      <div
                        className={`size-[32px] rounded-[8px] flex items-center justify-center font-bold text-[11px] shrink-0 ${
                          msg.isStaff
                            ? "bg-[#9c6402] text-white"
                            : "bg-[#eae8e4] text-[#1b1c1a]"
                        }`}
                      >
                        {msg.senderInitials}
                      </div>
                    </div>
                  </div>

                  <p className="text-[#1b1c1a] text-[13px] leading-[22px] whitespace-pre-line">
                    {msg.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Reply Form */}
            <form onSubmit={handleSendReply} className="flex flex-col gap-[10px] pt-[8px]">
              <div className="relative">
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={
                    isEn
                      ? "Type your reply here to immediately notify the client via authorized channels..."
                      : "اكتب ردك هنا لإرساله فورياً إلى العميل عبر قنوات التنبيه المعتمدة..."
                  }
                  className="w-full bg-[#faf9f6] border border-[#eae8e4] rounded-[6px] p-[12px] text-[13px] text-[#1b1c1a] placeholder:text-[#837565] focus:outline-none focus:border-[#9c6402] text-start"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[8px]">
                  <button
                    type="button"
                    onClick={() =>
                      toast.info(isEn ? "Attach file feature" : "ميزة إرفاق ملف بالرد")
                    }
                    className="flex items-center gap-[4px] text-[#837565] hover:text-[#1b1c1a] text-[12px] px-[8px] py-[4px] rounded hover:bg-[#f0eeea] cursor-pointer"
                  >
                    <Paperclip className="size-[13px]" />
                    <span>{isEn ? "Attach file" : "إرفاق ملف"}</span>
                  </button>
                </div>

                <button
                  type="submit"
                  className="bg-[#9c6402] hover:bg-[#855402] text-white flex items-center gap-[6px] px-[20px] py-[8px] rounded-[4px] font-semibold text-[13px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-all cursor-pointer"
                >
                  <Send className="size-[13px]" />
                  <span>{isEn ? "Send Reply" : "إرسال الرد"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Card 4: Activity Log / Audit Trail */}
          <div className="bg-white rounded-[8px] p-[24px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 flex flex-col gap-[16px]">
            <div className="border-b border-[#eae8e4] pb-[12px] flex items-center justify-between">
              <History className="size-[16px] text-[#837565]" />
              <h3 className="text-[#1b1c1a] font-bold text-[16px] leading-[24px]">
                {isEn ? "Activity Log & Audit Trail" : "سجل النشاط والتدقيق الإداري"}
              </h3>
            </div>

            <div className="flex flex-col gap-[12px]">
              {ticket.auditEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="flex items-start justify-between text-start border-b border-[#eae8e4]/40 pb-[8px] last:border-0"
                >
                  <span className="text-[#837565] text-[11px] font-mono shrink-0">
                    {evt.timestamp}
                  </span>
                  <div className="flex items-center gap-[8px]">
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#1b1c1a] text-[12px]">
                        {evt.action}
                      </span>
                      <span className="text-[#837565] text-[10px]">
                        {isEn ? `By: ${evt.performer}` : `بواسطة: ${evt.performer}`}
                      </span>
                    </div>
                    <div className="size-[8px] rounded-full bg-[#9c6402]/60 mt-[4px]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Column (4 cols on desktop) */}
        <div className="lg:col-span-4 flex flex-col gap-[20px]">
          {/* Card 1: Client Details Card */}
          <div className="bg-white rounded-[8px] p-[20px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 flex flex-col gap-[14px]">
            <div className="border-b border-[#eae8e4] pb-[10px] flex items-center justify-between">
              <span className="bg-[#e4e2de] text-[#1b1c1a] text-[10px] font-mono font-bold px-[6px] py-[2px] rounded-[2px]">
                CR: {ticket.client.crNumber}
              </span>
              <h3 className="text-[#1b1c1a] font-bold text-[15px]">
                {isEn ? "Client Firm Details" : "بيانات المكتب المشترك"}
              </h3>
            </div>

            <div className="flex flex-col gap-[10px] text-start">
              <div>
                <span className="font-bold text-[#1b1c1a] text-[14px] block">
                  {ticket.client.firm}
                </span>
                <span className="text-[#514537] text-[12px]">
                  {isEn ? `Contact: ${ticket.client.name}` : `المسؤول: ${ticket.client.name}`}
                </span>
              </div>

              <div className="flex flex-col gap-[6px] pt-[4px] border-t border-[#eae8e4]/60 text-[12px] text-[#514537]">
                <div className="flex items-center gap-[6px]">
                  <Mail className="size-[13px] text-[#837565]" />
                  <span>{ticket.client.email}</span>
                </div>
                <div className="flex items-center gap-[6px]">
                  <Phone className="size-[13px] text-[#837565]" />
                  <span dir="ltr">{ticket.client.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Assigned Staff Card */}
          <div className="bg-white rounded-[8px] p-[20px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 flex flex-col gap-[14px]">
            <div className="border-b border-[#eae8e4] pb-[10px] flex items-center justify-between">
              <button
                type="button"
                onClick={onOpenAssigneeModal}
                className="text-[#9c6402] text-[11px] font-bold hover:underline cursor-pointer"
              >
                {isEn ? "Change" : "تغيير"}
              </button>
              <h3 className="text-[#1b1c1a] font-bold text-[15px]">
                {isEn ? "Assigned Employee" : "الموظف المكلف"}
              </h3>
            </div>

            <div className="flex items-center gap-[12px] text-start">
              <div className="bg-[#9c6402] text-white font-bold text-[12px] size-[40px] rounded-[10px] flex items-center justify-center shrink-0">
                {ticket.assignee.initials}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#1b1c1a] text-[13px]">
                  {ticket.assignee.name}
                </span>
                <span className="text-[#514537] text-[11px]">
                  {ticket.assignee.role}
                </span>
                <span className="text-[#837565] text-[10px] pt-[2px]">
                  {ticket.assignee.department}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Ticket Info & SLA Matrix */}
          <div className="bg-white rounded-[8px] p-[20px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 flex flex-col gap-[14px]">
            <div className="border-b border-[#eae8e4] pb-[10px] text-start">
              <h3 className="text-[#1b1c1a] font-bold text-[15px]">
                {isEn ? "Service Level Agreement (SLA)" : "اتفاقية مستوى الخدمة (SLA)"}
              </h3>
            </div>

            <div className="flex flex-col gap-[10px] text-start text-[12px]">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#1b1c1a]">{ticket.channelLabel}</span>
                <span className="text-[#514537]">
                  {isEn ? "Ticket Channel:" : "قناة البلاغ:"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-[#ba1a1a]">
                  {isEn ? "4 Hours Maximum" : "4 ساعات كحد أقصى"}
                </span>
                <span className="text-[#514537]">
                  {isEn ? "Resolution Target:" : "الهدف الزمني للحل:"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#047857]">
                  {isEn ? "2h 15m remaining" : "متبقي ساعتان و 15 دقيقة"}
                </span>
                <span className="text-[#514537]">
                  {isEn ? "Timer Status:" : "حالة المؤقت:"}
                </span>
              </div>

              <div className="h-[4px] bg-[#eae8e4] rounded-full overflow-hidden w-full mt-[4px]">
                <div className="h-full bg-[#047857] w-[45%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
