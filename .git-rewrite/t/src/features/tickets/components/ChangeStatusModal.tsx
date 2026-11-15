"use client";

import React, { useState } from "react";
import { X, Check, RefreshCw, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { Ticket, TicketStatus } from "../types/tickets.types";

interface ChangeStatusModalProps {
  ticket: Ticket;
  onClose: () => void;
  onConfirm: (newStatus: TicketStatus, notes: string) => void;
}

export function ChangeStatusModal({
  ticket,
  onClose,
  onConfirm,
}: ChangeStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>(ticket.status);
  const [resolutionNotes, setResolutionNotes] = useState("");

  const handleConfirm = () => {
    onConfirm(selectedStatus, resolutionNotes);
  };

  const statusOptions = [
    {
      value: "open" as TicketStatus,
      label: "مفتوحة",
      description: "التذكرة مستلمة وبانتظار البدء في المعالجة الفنية",
      icon: AlertCircle,
      iconBg: "bg-[#e0ecf8]",
      iconColor: "text-[#1e3a8a]",
    },
    {
      value: "in_progress" as TicketStatus,
      label: "جاري العمل عليها",
      description: "الفريق الفني يباشر فحص ومعالجة الخلل حالياً",
      icon: RefreshCw,
      iconBg: "bg-[rgba(255,221,182,0.5)]",
      iconColor: "text-[#9c6402]",
    },
    {
      value: "pending" as TicketStatus,
      label: "معلقة",
      description: "بانتظار إفادة أو وثائق إضافية من مكتب المحاماة",
      icon: Clock,
      iconBg: "bg-[#fff4e5]",
      iconColor: "text-[#b45309]",
    },
    {
      value: "closed" as TicketStatus,
      label: "مغلقة",
      description: "تم حل المشكلة واعتماد استقرار المزامنة بنجاح",
      badge: "موصى به",
      icon: CheckCircle2,
      iconBg: "bg-[#ffddb6]",
      iconColor: "text-[#7b4e00]",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs antialiased">
      <div
        className="bg-white rounded-[12px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] w-full max-w-[520px] overflow-hidden flex flex-col relative text-right animate-in fade-in zoom-in-95 duration-150"
        data-node-id="1:15432"
        data-name="تغيير حالة التذكرة"
      >
        {/* Top Subtle Gold Accent Line */}
        <div className="h-[6px] w-full bg-gradient-to-r from-[#9c6402] via-[#e5b352] to-[#9c6402]" />

        {/* Modal Header */}
        <div className="flex items-start justify-between px-[20px] pt-[20px] pb-[16px] border-b border-[#eae8e4]/60">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#f0eeea] hover:bg-[#eae8e4] text-[#514537] size-[32px] rounded-[6px] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="size-[14px]" />
          </button>

          <div className="flex items-center gap-[12px]">
            <div className="flex flex-col gap-[2px]">
              <h2 className="text-[#1b1c1a] font-semibold text-[20px] leading-[24px]">
                تغيير حالة التذكرة
              </h2>
              <p className="text-[#514537] text-[12px] leading-[18px]">
                تحديث مرحلة معالجة التذكرة وتوثيق الإجراء في سجل نشاط البلاغ
              </p>
            </div>
            <div className="bg-[#eae8e4] size-[40px] rounded-[6px] flex items-center justify-center shrink-0">
              <RefreshCw className="size-[18px] text-[#9c6402]" />
            </div>
          </div>
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
                  <span>عاجل</span>
                  <div className="size-[5px] rounded-full bg-[#ba1a1a]" />
                </div>
              </div>
            </div>

            <div className="font-semibold text-[#1b1c1a] text-[12px] leading-[18px] text-start">
              {ticket.title}
            </div>

            <div className="bg-white/80 rounded-[4px] px-[12px] py-[6px] flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#514537]">
                الحالة المسجلة حالياً:
              </span>
              <span className="text-[11px] font-bold text-[#9c6402]">
                {ticket.status === "open"
                  ? "مفتوحة"
                  : ticket.status === "in_progress"
                  ? "جاري العمل عليها"
                  : ticket.status === "pending"
                  ? "معلقة"
                  : "مغلقة"}
              </span>
            </div>
          </div>

          {/* Status Selection Cards */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[12px] font-semibold text-[#1b1c1a]">
              اختر الحالة الجديدة للتذكرة
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

                    {/* Content & Icon */}
                    <div className="flex items-center gap-[12px]">
                      <div className="flex flex-col text-start">
                        <div className="flex items-center gap-[6px]">
                          {opt.badge && (
                            <span className="bg-[#eae8e4] text-[#1b1c1a] text-[9px] font-bold px-[6px] py-[1px] rounded-[2px]">
                              {opt.badge}
                            </span>
                          )}
                          <span className="font-semibold text-[#1b1c1a] text-[13px] leading-[18px]">
                            {opt.label}
                          </span>
                        </div>
                        <span className="text-[#514537] text-[11px] leading-[16px]">
                          {opt.description}
                        </span>
                      </div>

                      <div
                        className={`size-[32px] rounded-[6px] flex items-center justify-center shrink-0 ${opt.iconBg}`}
                      >
                        <IconComponent className={`size-[16px] ${opt.iconColor}`} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resolution Notes Input */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-semibold text-[#1b1c1a]">
              ملاحظات التحديث أو سبب الإغلاق
            </label>
            <textarea
              rows={2}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="اكتب توضيحاً للإجراء المتخذ أو ما تم الاتفاق عليه مع المشترك..."
              className="w-full bg-[#faf9f6] border border-[#eae8e4] rounded-[6px] p-[10px] text-[12px] text-[#1b1c1a] placeholder:text-[#837565] focus:outline-none focus:border-[#9c6402] text-start"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-[#eae8e4] px-[20px] py-[14px] flex items-center justify-end gap-[10px]">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#f0eeea] hover:bg-[#eae8e4] text-[#1b1c1a] px-[16px] py-[8px] rounded-[4px] font-semibold text-[12px] transition-colors cursor-pointer"
          >
            الغاء
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="bg-[#9c6403] hover:bg-[#855402] text-white flex items-center gap-[6px] px-[20px] py-[8px] rounded-[4px] font-bold text-[12px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-all cursor-pointer"
          >
            <Check className="size-[14px]" />
            <span>حفظ الحالة</span>
          </button>
        </div>
      </div>
    </div>
  );
}
