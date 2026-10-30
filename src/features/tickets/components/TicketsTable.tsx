"use client";

import React, { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  UserCheck,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Building2,
} from "lucide-react";
import { Ticket } from "../types/tickets.types";

interface TicketsTableProps {
  tickets: Ticket[];
  onViewDetails: (ticket: Ticket) => void;
  onChangeAssignee: (ticket: Ticket) => void;
  onChangeStatus: (ticket: Ticket) => void;
}

export function TicketsTable({
  tickets,
  onViewDetails,
  onChangeAssignee,
  onChangeStatus,
}: TicketsTableProps) {
  const [activeMenuTicketId, setActiveMenuTicketId] = useState<string | null>(null);

  const getPriorityBadge = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "urgent":
        return (
          <div className="bg-[#ffdad6] flex items-center gap-[4px] px-[8px] py-[3px] rounded-[2px] shrink-0">
            <span className="font-bold text-[#93000a] text-[10px] leading-[14px]">عاجلة</span>
            <div className="bg-[#ba1a1a] rounded-[12px] size-[6px] shrink-0" />
          </div>
        );
      case "medium":
        return (
          <div className="bg-[#fff8e1] flex items-center gap-[4px] px-[8px] py-[3px] rounded-[2px] shrink-0">
            <span className="font-bold text-[#b76e00] text-[10px] leading-[14px]">متوسطة</span>
            <div className="bg-[#b76e00] rounded-[12px] size-[6px] shrink-0" />
          </div>
        );
      case "low":
      default:
        return (
          <div className="bg-[#f0eeea] flex items-center gap-[4px] px-[8px] py-[3px] rounded-[2px] shrink-0">
            <span className="font-bold text-[#61564f] text-[10px] leading-[14px]">منخفضة</span>
            <div className="bg-[#61564f] rounded-[12px] size-[6px] shrink-0" />
          </div>
        );
    }
  };

  const getStatusBadge = (status: Ticket["status"]) => {
    switch (status) {
      case "in_progress":
        return (
          <div className="bg-[rgba(255,221,182,0.4)] flex items-center gap-[6px] px-[8px] py-[3px] rounded-[2px] shrink-0">
            <span className="font-bold text-[#9c6402] text-[10px] leading-[14px]">
              جاري العمل عليها
            </span>
            <div className="bg-[#9c6402] rounded-[12px] size-[6px] shrink-0" />
          </div>
        );
      case "open":
        return (
          <div className="bg-[#e0ecf8] flex items-center gap-[6px] px-[8px] py-[3px] rounded-[2px] shrink-0">
            <span className="font-bold text-[#1e3a8a] text-[10px] leading-[14px]">مفتوحة</span>
            <div className="bg-[#1e3a8a] rounded-[12px] size-[6px] shrink-0" />
          </div>
        );
      case "pending":
        return (
          <div className="bg-[#fff4e5] flex items-center gap-[6px] px-[8px] py-[3px] rounded-[2px] shrink-0">
            <span className="font-bold text-[#b45309] text-[10px] leading-[14px]">معلقة</span>
            <div className="bg-[#b45309] rounded-[12px] size-[6px] shrink-0" />
          </div>
        );
      case "closed":
      default:
        return (
          <div className="bg-[#e6f4ea] flex items-center gap-[6px] px-[8px] py-[3px] rounded-[2px] shrink-0">
            <span className="font-bold text-[#137333] text-[10px] leading-[14px]">مغلقة</span>
            <div className="bg-[#137333] rounded-[12px] size-[6px] shrink-0" />
          </div>
        );
    }
  };

  const getStatusBorderColor = (status: Ticket["status"]) => {
    switch (status) {
      case "in_progress":
        return "bg-[#9c6402]";
      case "open":
        return "bg-[#1e3a8a]";
      case "pending":
        return "bg-[#b45309]";
      case "closed":
      default:
        return "bg-[#137333]";
    }
  };

  return (
    <div
      className="bg-white rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 overflow-hidden w-full"
      data-node-id="1:14462"
      data-name="Main Content Envelope"
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-right">
          {/* Header Row */}
          <thead>
            <tr className="bg-[#f0eeea] h-[54px] border-b border-[#eae8e4] text-[#514537] text-[11px] font-bold tracking-[0.5px]">
              <th className="px-[16px] py-[10px] font-bold text-start whitespace-nowrap">
                رقم التذكرة
              </th>
              <th className="px-[16px] py-[10px] font-bold text-start whitespace-nowrap min-w-[240px]">
                الموضوع والمشكلة
              </th>
              <th className="px-[16px] py-[10px] font-bold text-start whitespace-nowrap min-w-[170px]">
                المكتب / المشترك
              </th>
              <th className="px-[16px] py-[10px] font-bold text-start whitespace-nowrap min-w-[150px]">
                القسم المسؤول
              </th>
              <th className="px-[16px] py-[10px] font-bold text-start whitespace-nowrap min-w-[150px]">
                الموظف المسؤول
              </th>
              <th className="px-[12px] py-[10px] font-bold text-center whitespace-nowrap">
                الأولوية
              </th>
              <th className="px-[12px] py-[10px] font-bold text-center whitespace-nowrap">
                الحالة
              </th>
              <th className="px-[16px] py-[10px] font-bold text-center whitespace-nowrap">
                الإجراءات
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#eae8e4]/70">
            {tickets.map((ticket, idx) => {
              const isEven = idx % 2 === 1;
              const isMenuOpen = activeMenuTicketId === ticket.id;

              return (
                <tr
                  key={ticket.id}
                  className={`transition-colors hover:bg-[#faf9f6] ${
                    isEven ? "bg-[rgba(245,243,239,0.3)]" : "bg-white"
                  }`}
                >
                  {/* Column 1: Ticket Number */}
                  <td className="px-[16px] py-[14px] whitespace-nowrap">
                    <div className="flex items-center gap-[8px]">
                      <div
                        className={`h-[28px] w-[3px] rounded-[12px] shrink-0 ${getStatusBorderColor(
                          ticket.status
                        )}`}
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1b1c1a] text-[12px] leading-[16px] font-mono">
                          {ticket.ticketNumber}
                        </span>
                        <span className="text-[#837565] text-[10px] leading-[14px]">
                          {ticket.updatedAt}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Subject & Issue */}
                  <td className="px-[16px] py-[14px]">
                    <div className="flex flex-col gap-[2px] max-w-[340px]">
                      <button
                        type="button"
                        onClick={() => onViewDetails(ticket)}
                        className="font-semibold text-[#1b1c1a] text-[13px] leading-[18px] text-start hover:text-[#9c6402] transition-colors cursor-pointer truncate"
                        title={ticket.title}
                      >
                        {ticket.title}
                      </button>
                      <p className="text-[#514537] text-[11px] leading-[16px] text-start line-clamp-1">
                        {ticket.description}
                      </p>
                    </div>
                  </td>

                  {/* Column 3: Client Firm */}
                  <td className="px-[16px] py-[14px] whitespace-nowrap">
                    <div className="flex flex-col text-start">
                      <span className="font-semibold text-[#1b1c1a] text-[12px] leading-[16px]">
                        {ticket.client.firm}
                      </span>
                      <span className="text-[#837565] text-[10px] leading-[14px]">
                        {ticket.client.name}
                      </span>
                    </div>
                  </td>

                  {/* Column 4: Department */}
                  <td className="px-[16px] py-[14px] whitespace-nowrap">
                    <div className="flex items-center gap-[6px] text-start">
                      <Building2 className="size-[13px] text-[#837565] shrink-0" />
                      <span className="text-[#1b1c1a] text-[12px] leading-[16px] font-medium">
                        {ticket.department.name}
                      </span>
                    </div>
                  </td>

                  {/* Column 5: Assignee */}
                  <td className="px-[16px] py-[14px] whitespace-nowrap">
                    <div className="flex items-center gap-[8px] text-start">
                      <div className="bg-[#9c6402] text-[#fff3e9] font-bold text-[10px] size-[26px] rounded-[10px] flex items-center justify-center shrink-0">
                        {ticket.assignee.initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#1b1c1a] text-[12px] leading-[16px]">
                          {ticket.assignee.name}
                        </span>
                        <span className="text-[#837565] text-[10px] leading-[14px]">
                          {ticket.assignee.role}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Column 6: Priority */}
                  <td className="px-[12px] py-[14px] text-center whitespace-nowrap">
                    <div className="flex justify-center">
                      {getPriorityBadge(ticket.priority)}
                    </div>
                  </td>

                  {/* Column 7: Status */}
                  <td className="px-[12px] py-[14px] text-center whitespace-nowrap">
                    <div className="flex justify-center">
                      {getStatusBadge(ticket.status)}
                    </div>
                  </td>

                  {/* Column 8: Actions */}
                  <td className="px-[16px] py-[14px] text-center whitespace-nowrap relative">
                    <div className="flex items-center justify-center gap-[4px]">
                      {/* View Details Icon Button */}
                      <button
                        type="button"
                        onClick={() => onViewDetails(ticket)}
                        title="تفاصيل التذكرة"
                        className="size-[28px] rounded-[4px] hover:bg-[#f0eeea] flex items-center justify-center text-[#514537] hover:text-[#9c6402] transition-colors cursor-pointer"
                      >
                        <Eye className="size-[14px]" />
                      </button>

                      {/* Dropdown Menu Trigger */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenuTicketId(isMenuOpen ? null : ticket.id)
                          }
                          title="خيارات إضافية"
                          className="size-[28px] rounded-[4px] hover:bg-[#f0eeea] flex items-center justify-center text-[#514537] hover:text-[#1b1c1a] transition-colors cursor-pointer"
                        >
                          <MoreHorizontal className="size-[15px]" />
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                          <div className="absolute start-0 sm:end-0 mt-[4px] w-[180px] bg-white rounded-[8px] shadow-[0px_8px_24px_rgba(0,0,0,0.12)] border border-[#eae8e4] py-[4px] z-50 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuTicketId(null);
                                onViewDetails(ticket);
                              }}
                              className="w-full flex items-center gap-[8px] px-[12px] py-[8px] text-[12px] text-[#1b1c1a] hover:bg-[#f5f3ef] transition-colors cursor-pointer"
                            >
                              <Eye className="size-[13px] text-[#9c6402]" />
                              <span>تفاصيل التذكرة</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuTicketId(null);
                                onChangeAssignee(ticket);
                              }}
                              className="w-full flex items-center gap-[8px] px-[12px] py-[8px] text-[12px] text-[#1b1c1a] hover:bg-[#f5f3ef] transition-colors cursor-pointer"
                            >
                              <UserCheck className="size-[13px] text-[#514537]" />
                              <span>تغيير الموظف المسؤول</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuTicketId(null);
                                onChangeStatus(ticket);
                              }}
                              className="w-full flex items-center gap-[8px] px-[12px] py-[8px] text-[12px] text-[#1b1c1a] hover:bg-[#f5f3ef] transition-colors cursor-pointer"
                            >
                              <RefreshCw className="size-[13px] text-[#514537]" />
                              <span>تغيير حالة التذكرة</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div
        className="bg-white flex flex-col sm:flex-row items-center justify-between p-[16px] border-t border-[#eae8e4] gap-[12px]"
        data-node-id="1:14764"
        data-name="Pagination Footer"
      >
        <div className="flex items-center gap-[6px] order-2 sm:order-1">
          <button
            type="button"
            className="bg-[#f5f3ef] flex items-center gap-[4px] px-[12px] py-[6px] rounded-[4px] text-[12px] font-semibold text-[#837565] hover:text-[#1b1c1a] transition-colors cursor-pointer"
          >
            <ChevronRight className="size-[12px]" />
            <span>السابق</span>
          </button>
          <div className="bg-[#9c6402] text-white font-bold text-[12px] size-[32px] rounded-[4px] flex items-center justify-center shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
            1
          </div>
          <button
            type="button"
            className="bg-[#f5f3ef] text-[#1b1c1a] font-semibold text-[12px] size-[32px] rounded-[4px] flex items-center justify-center hover:bg-[#eae8e4] transition-colors cursor-pointer"
          >
            2
          </button>
          <button
            type="button"
            className="bg-[#f5f3ef] text-[#1b1c1a] font-semibold text-[12px] size-[32px] rounded-[4px] flex items-center justify-center hover:bg-[#eae8e4] transition-colors cursor-pointer"
          >
            3
          </button>
          <span className="text-[#837565] px-[4px] text-[12px]">...</span>
          <button
            type="button"
            className="bg-[#f5f3ef] text-[#1b1c1a] font-semibold text-[12px] size-[32px] rounded-[4px] flex items-center justify-center hover:bg-[#eae8e4] transition-colors cursor-pointer"
          >
            16
          </button>
          <button
            type="button"
            className="bg-[#f5f3ef] flex items-center gap-[4px] px-[12px] py-[6px] rounded-[4px] text-[12px] font-semibold text-[#1b1c1a] hover:bg-[#eae8e4] transition-colors cursor-pointer"
          >
            <span>التالي</span>
            <ChevronLeft className="size-[12px]" />
          </button>
        </div>

        <div className="text-[12px] text-[#514537] order-1 sm:order-2">
          عرض <span className="font-bold text-[#1b1c1a]">1</span> إلى{" "}
          <span className="font-bold text-[#1b1c1a]">{tickets.length}</span> من أصل{" "}
          <span className="font-bold text-[#1b1c1a]">24</span> تذكرة
        </div>
      </div>
    </div>
  );
}
