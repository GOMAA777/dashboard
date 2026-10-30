"use client";

import React, { useState } from "react";
import { X, Search, UserCheck } from "lucide-react";
import { Ticket, TicketAssignee } from "../types/tickets.types";

interface ChangeAssigneeModalProps {
  ticket: Ticket;
  assignees: TicketAssignee[];
  onClose: () => void;
  onConfirm: (newAssignee: TicketAssignee, reason: string) => void;
}

export function ChangeAssigneeModal({
  ticket,
  assignees,
  onClose,
  onConfirm,
}: ChangeAssigneeModalProps) {
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string>(
    assignees.find((a) => a.id !== ticket.assignee.id)?.id || assignees[0]?.id || ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [reason, setReason] = useState("");

  const filteredAssignees = assignees.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.role.toLowerCase().includes(q);
  });

  const handleConfirm = () => {
    const newAssignee = assignees.find((a) => a.id === selectedAssigneeId);
    if (!newAssignee) return;
    onConfirm(newAssignee, reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs antialiased">
      <div
        className="bg-white rounded-[16px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] w-full max-w-[540px] overflow-hidden flex flex-col relative text-start animate-in fade-in zoom-in-95 duration-150"
        data-node-id="1:15321"
        data-name="إسناد التذكرة لموظف"
      >
        {/* Top Subtle Gold Accent Line */}
        <div className="h-[6px] w-full bg-gradient-to-r from-[#9c6402] via-[#e5b352] to-[#9c6402]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute start-[16px] top-[16px] bg-[#f0eeea] hover:bg-[#eae8e4] text-[#514537] size-[32px] rounded-[12px] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="size-[14px]" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-[16px] px-[24px] pt-[24px] pb-[16px]">
          <div className="bg-[rgba(255,221,182,0.4)] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] size-[48px] rounded-[8px] flex items-center justify-center shrink-0">
            <UserCheck className="size-[22px] text-[#9c6402]" />
          </div>
          <div className="flex flex-col gap-[2px]">
            <h2 className="text-[#1b1c1a] font-bold text-[20px] sm:text-[22px] leading-[26px]">
              تغيير الموظف
            </h2>
            <p className="text-[#514537] text-[12px] leading-[18px]">
              تحديد موظف جديد لمتابعة التذكرة وإشعار أطراف البلاغ فورياً
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex flex-col gap-[16px] px-[24px] py-[8px] max-h-[70vh] overflow-y-auto">
          {/* 1. Current Ticket Summary Card */}
          <div className="bg-[#f5f3ef] rounded-[8px] p-[16px] flex flex-col gap-[8px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-[#625d5d]">
                {ticket.ticketNumber}
              </span>
              <div className="flex items-center gap-[6px]">
                <span className="text-[11px] font-bold text-[#514537]">
                  {ticket.department.name}
                </span>
                <div className="bg-[#ffdad6] text-[#93000a] text-[10px] font-bold px-[6px] py-[1px] rounded-[2px] flex items-center gap-[4px]">
                  <span>عاجل</span>
                  <div className="size-[5px] rounded-full bg-[#ba1a1a]" />
                </div>
              </div>
            </div>

            <div className="font-semibold text-[#1b1c1a] text-[13px] leading-[20px] text-start">
              {ticket.title}
            </div>

            {/* Current Assignee Bar */}
            <div className="bg-[rgba(240,238,234,0.7)] rounded-[6px] px-[12px] py-[6px] flex items-center justify-between">
              <span className="bg-[#e4e2de] text-[#514537] text-[10px] font-medium px-[6px] py-[2px] rounded-[2px]">
                المسؤول الحالي
              </span>
              <span className="text-[12px] font-semibold text-[#1b1c1a]">
                {ticket.assignee.name}
              </span>
            </div>
          </div>

          {/* 2. Search & Select New Assignee */}
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#625d5d]">
                {ticket.department.name}
              </span>
              <label className="text-[13px] font-semibold text-[#1b1c1a] flex items-center gap-[4px]">
                <span>الموظف الجديد المكلّف</span>
                <span className="text-[#ba1a1a]">*</span>
              </label>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم أو التخصص داخل القسم..."
                className="w-full bg-white border border-[#eae8e4] rounded-[8px] h-[38px] px-[12px] pe-[36px] text-[12px] text-[#1b1c1a] placeholder:text-[#837565] focus:outline-none focus:border-[#9c6402] text-start"
              />
              <Search className="absolute end-[12px] top-[11px] size-[15px] text-[#837565] pointer-events-none" />
            </div>

            {/* Selectable Staff List */}
            <div className="flex flex-col gap-[6px] max-h-[190px] overflow-y-auto pt-[4px]">
              {filteredAssignees.map((emp) => {
                const isSelected = selectedAssigneeId === emp.id;

                return (
                  <button
                    key={emp.id}
                    type="button"
                    onClick={() => setSelectedAssigneeId(emp.id)}
                    className={`flex items-center justify-between p-[10px] rounded-[8px] border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[rgba(255,221,182,0.25)] border-[#9c6402] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
                        : "bg-white border-[#eae8e4] hover:bg-[#faf9f6]"
                    }`}
                  >
                    {/* Status & Workload */}
                    <div className="flex flex-col items-start gap-[2px]">
                      <div className="flex items-center gap-[4px]">
                        <span
                          className={`text-[10px] font-bold ${
                            emp.isAvailable ? "text-[#7b4e00]" : "text-[#625d5d]"
                          }`}
                        >
                          {emp.isAvailable ? "متاح الآن" : "مشغول جزئياً"}
                        </span>
                        <div
                          className={`size-[7px] rounded-full ${
                            emp.isAvailable ? "bg-[#7b4e00]" : "bg-[#625d5d]"
                          }`}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[#625d5d]">
                        {emp.activeTicketsCount} تذاكر نشطة
                      </span>
                    </div>

                    {/* Employee Identity */}
                    <div className="flex items-center gap-[8px]">
                      <div className="flex flex-col text-start">
                        <div className="flex items-center gap-[6px]">
                          {emp.isRecommended && (
                            <span className="bg-[rgba(123,78,0,0.1)] text-[#7b4e00] text-[9px] font-semibold px-[5px] py-[1px] rounded-[2px]">
                              الأكثر ملاءمة
                            </span>
                          )}
                          <span className="font-bold text-[#1b1c1a] text-[13px] leading-[18px]">
                            {emp.name}
                          </span>
                        </div>
                        <span className="text-[#514537] text-[11px] leading-[16px]">
                          {emp.role}
                        </span>
                      </div>

                      {/* Initials Avatar */}
                      <div className="bg-[#9c6402] text-white font-bold text-[11px] size-[34px] rounded-[10px] flex items-center justify-center shrink-0">
                        {emp.initials}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reason Input */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-semibold text-[#1b1c1a]">
              سبب إعادة التعيين (اختياري)
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="اكتب ملاحظة أو توجيه للموظف الجديد المكلف..."
              className="w-full bg-[#faf9f6] border border-[#eae8e4] rounded-[6px] p-[10px] text-[12px] text-[#1b1c1a] placeholder:text-[#837565] focus:outline-none focus:border-[#9c6402] text-start"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-[#eae8e4] px-[24px] py-[16px] flex items-center justify-end gap-[10px]">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#f0eeea] hover:bg-[#eae8e4] text-[#1b1c1a] px-[18px] py-[9px] rounded-[4px] font-semibold text-[13px] transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="bg-[#9c6402] hover:bg-[#855402] text-white px-[22px] py-[9px] rounded-[4px] font-semibold text-[13px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-all cursor-pointer"
          >
            تأكيد إعادة التعيين
          </button>
        </div>
      </div>
    </div>
  );
}
