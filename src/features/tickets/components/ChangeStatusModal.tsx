"use client";

import React, { useState } from "react";
import { X, Check, RefreshCw, AlertCircle, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { Ticket, TicketStatus } from "../types/tickets.types";
import { useLanguage } from "@/lib/i18n";

interface ChangeStatusModalProps {
  ticket: Ticket;
  onClose: () => void;
  onConfirm: (newStatus: TicketStatus, notes: string) => Promise<boolean | void> | void;
  isSubmitting?: boolean;
}

export function ChangeStatusModal({
  ticket,
  onClose,
  onConfirm,
  isSubmitting = false,
}: ChangeStatusModalProps) {
  const { direction, isEn } = useLanguage();
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>(ticket.status);
  const [resolutionNotes, setResolutionNotes] = useState("");

  const handleConfirm = () => {
    onConfirm(selectedStatus, resolutionNotes);
  };

  const statusOptions = [
    {
      value: "open" as TicketStatus,
      label: isEn ? "Open" : "مفتوحة",
      description: isEn
        ? "Ticket received and awaiting technical assignment"
        : "التذكرة مستلمة وبانتظار البدء في المعالجة الفنية",
      icon: AlertCircle,
      iconBg: "bg-[#e0ecf8]",
      iconColor: "text-[#1e3a8a]",
    },
    {
      value: "in_progress" as TicketStatus,
      label: isEn ? "In Progress" : "جاري العمل عليها",
      description: isEn
        ? "Technical team is investigating and troubleshooting"
        : "الفريق الفني يباشر فحص ومعالجة الخلل حالياً",
      icon: RefreshCw,
      iconBg: "bg-[rgba(255,221,182,0.5)]",
      iconColor: "text-[#9c6402]",
    },
    {
      value: "pending" as TicketStatus,
      label: isEn ? "Pending" : "معلقة",
      description: isEn
        ? "Awaiting feedback or supporting documents from the client"
        : "بانتظار إفادة أو وثائق إضافية من مكتب المحاماة",
      icon: Clock,
      iconBg: "bg-[#fff4e5]",
      iconColor: "text-[#b45309]",
    },
    {
      value: "closed" as TicketStatus,
      label: isEn ? "Closed" : "مغلقة",
      description: isEn
        ? "The issue has been resolved and verified successfully"
        : "تم حل المشكلة واعتماد استقرار المزامنة بنجاح",
      badge: isEn ? "Recommended" : "موصى به",
      icon: CheckCircle2,
      iconBg: "bg-[#ffddb6]",
      iconColor: "text-[#7b4e00]",
    },
  ];

  const getStatusLabel = (status: TicketStatus) => {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs antialiased"
    >
      <div
        className="bg-white rounded-[12px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] w-full max-w-[520px] overflow-hidden flex flex-col relative text-start animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Top Subtle Gold Accent Line */}
        <div className="h-[6px] w-full bg-gradient-to-r from-[#9c6402] via-[#e5b352] to-[#9c6402]" />

        {/* Modal Header */}
        <div className="flex items-start justify-between px-[20px] pt-[20px] pb-[16px] border-b border-[#eae8e4]/60">
          <div className="flex items-center gap-[12px]">
            <div className="bg-[#eae8e4] size-[40px] rounded-[6px] flex items-center justify-center shrink-0">
              <RefreshCw className="size-[18px] text-[#9c6402]" />
            </div>
            <div className="flex flex-col gap-[2px]">
              <h2 className="text-[#1b1c1a] font-semibold text-[20px] leading-[24px]">
                {isEn ? "Change Ticket Status" : "تغيير حالة التذكرة"}
              </h2>
              <p className="text-[#514537] text-[12px] leading-[18px]">
                {isEn
                  ? "Update ticket handling stage and log action in audit trail"
                  : "تحديث مرحلة معالجة التذكرة وتوثيق الإجراء في سجل نشاط البلاغ"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="bg-[#f0eeea] hover:bg-[#eae8e4] text-[#514537] size-[32px] rounded-[6px] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="size-[14px]" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex flex-col gap-[16px] px-[20px] py-[16px] max-h-[70vh] overflow-y-auto">
          {/* Current Ticket Summary Card */}
          <div className="bg-[#f5f3ef] rounded-[6px] p-[14px] flex flex-col gap-[8px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-[#1b1c1a]">
                {ticket.ticketNumber}
              </span>
              <div className="flex items-center gap-[6px]">
                <span className="text-[11px] font-bold text-[#514537]">
                  {ticket.client.firm}
                </span>
                <div className="bg-[#ffdad6] text-[#93000a] text-[10px] font-bold px-[6px] py-[1px] rounded-[2px] flex items-center gap-[4px]">
                  <span>{isEn ? "Urgent" : "عاجل"}</span>
                  <div className="size-[5px] rounded-full bg-[#ba1a1a]" />
                </div>
              </div>
            </div>

            <div className="font-semibold text-[#1b1c1a] text-[12px] leading-[18px] text-start">
              {ticket.title}
            </div>

            <div className="bg-white/80 rounded-[4px] px-[12px] py-[6px] flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#514537]">
                {isEn ? "Current Recorded Status:" : "الحالة المسجلة حالياً:"}
              </span>
              <span className="text-[11px] font-bold text-[#9c6402]">
                {getStatusLabel(ticket.status)}
              </span>
            </div>
          </div>

          {/* Status Selection Cards */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[12px] font-semibold text-[#1b1c1a]">
              {isEn ? "Select New Ticket Status" : "اختر الحالة الجديدة للتذكرة"}
            </label>

            <div className="flex flex-col gap-[8px]">
              {statusOptions.map((opt) => {
                const isSelected = selectedStatus === opt.value;
                const IconComponent = opt.icon;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedStatus(opt.value)}
                    className={`flex items-center justify-between p-[12px] rounded-[6px] border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[rgba(255,221,182,0.25)] border-[#9c6402] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
                        : "bg-white border-[#eae8e4] hover:bg-[#faf9f6]"
                    }`}
                  >
                    {/* Content & Icon */}
                    <div className="flex items-center gap-[12px]">
                      <div
                        className={`size-[32px] rounded-[6px] flex items-center justify-center shrink-0 ${opt.iconBg}`}
                      >
                        <IconComponent className={`size-[16px] ${opt.iconColor}`} />
                      </div>

                      <div className="flex flex-col text-start">
                        <div className="flex items-center gap-[6px]">
                          <span className="font-semibold text-[#1b1c1a] text-[13px] leading-[18px]">
                            {opt.label}
                          </span>
                          {opt.badge && (
                            <span className="bg-[#eae8e4] text-[#1b1c1a] text-[9px] font-bold px-[6px] py-[1px] rounded-[2px]">
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[#514537] text-[11px] leading-[16px]">
                          {opt.description}
                        </span>
                      </div>
                    </div>

                    {/* Radio Indicator */}
                    <div
                      className={`size-[18px] rounded-full flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? "border-[#9c6402] bg-[#9c6402]"
                          : "border-[#eae8e4] bg-[#f5f3ef]"
                      }`}
                    >
                      {isSelected && <div className="size-[6px] rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resolution Notes Input */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-semibold text-[#1b1c1a]">
              {isEn ? "Update Notes or Resolution Summary" : "ملاحظات التحديث أو سبب الإغلاق"}
            </label>
            <textarea
              rows={2}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder={
                isEn
                  ? "Write notes on the action taken or agreement reached..."
                  : "اكتب توضيحاً للإجراء المتخذ أو ما تم الاتفاق عليه مع المشترك..."
              }
              className="w-full bg-[#faf9f6] border border-[#eae8e4] rounded-[6px] p-[10px] text-[12px] text-[#1b1c1a] placeholder:text-[#837565] focus:outline-none focus:border-[#9c6402] text-start"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-[#eae8e4] px-[20px] py-[14px] flex items-center justify-end gap-[10px]">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="bg-[#f0eeea] hover:bg-[#eae8e4] text-[#1b1c1a] px-[16px] py-[8px] rounded-[4px] font-semibold text-[12px] transition-colors cursor-pointer disabled:opacity-50"
          >
            {isEn ? "Cancel" : "الغاء"}
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirm}
            className="bg-[#9c6403] hover:bg-[#855402] text-white flex items-center gap-[6px] px-[20px] py-[8px] rounded-[4px] font-bold text-[12px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-[14px] animate-spin" />
                <span>{isEn ? "Saving..." : "جاري الحفظ..."}</span>
              </>
            ) : (
              <>
                <Check className="size-[14px]" />
                <span>{isEn ? "Save Status" : "حفظ الحالة"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
