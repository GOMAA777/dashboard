"use client";

import React, { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  UserCheck,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  Building2,
} from "lucide-react";
import { Ticket } from "../types/tickets.types";
import { PageSizeDropdown } from "@/components/shared/PageSizeDropdown";

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
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageIndex, setPageIndex] = useState<number>(0);

  const totalPages = Math.max(1, Math.ceil(tickets.length / pageSize));
  const safePageIndex = Math.min(pageIndex, totalPages - 1);
  const pagedTickets = tickets.slice(
    safePageIndex * pageSize,
    (safePageIndex + 1) * pageSize
  );
  const startItem = tickets.length === 0 ? 0 : safePageIndex * pageSize + 1;
  const endItem = Math.min((safePageIndex + 1) * pageSize, tickets.length);

  const getPriorityBadge = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "urgent":
        return (
          <div className="bg-[#fff1f2] border border-rose-200 text-[#9f1239] dark:bg-[#381616] dark:border-rose-500/40 dark:text-[#fca5a5] flex items-center gap-1.5 px-2.5 py-0.5 rounded-full w-fit shrink-0">
            <div className="bg-[#e11d48] shadow-[0_0_8px_#e11d48] ring-1 ring-rose-400/60 rounded-full size-[7px] shrink-0" />
            <span className="font-bold text-[11px]">عاجلة</span>
          </div>
        );
      case "medium":
        return (
          <div className="bg-[#fffbeb] border border-amber-200 text-[#92400e] dark:bg-[#2e1d0f] dark:border-amber-500/40 dark:text-[#fbbf24] flex items-center gap-1.5 px-2.5 py-0.5 rounded-full w-fit shrink-0">
            <div className="bg-[#f59e0b] shadow-[0_0_8px_#f59e0b] ring-1 ring-amber-400/60 rounded-full size-[7px] shrink-0" />
            <span className="font-bold text-[11px]">متوسطة</span>
          </div>
        );
      case "low":
      default:
        return (
          <div className="bg-[#f5f3ef] border border-[#eae8e4] text-[#514537] dark:bg-[#281c15] dark:border-[#4d3627] dark:text-[#cdc5bd] flex items-center gap-1.5 px-2.5 py-0.5 rounded-full w-fit shrink-0">
            <div className="bg-[#837565] rounded-full size-[7px] shrink-0" />
            <span className="font-bold text-[11px]">منخفضة</span>
          </div>
        );
    }
  };

  const getStatusBadge = (status: Ticket["status"]) => {
    switch (status) {
      case "in_progress":
        return (
          <div className="bg-[#9c6402]/10 border border-[#9c6402]/30 text-[#9c6402] dark:bg-[rgba(226,157,56,0.18)] dark:border-[#e29d38]/40 dark:text-[#f3c27e] flex items-center gap-1.5 px-2.5 py-0.5 rounded-full w-fit shrink-0">
            <div className="bg-[#9c6402] dark:bg-[#e29d38] shadow-[0_0_8px_#9c6402] ring-1 ring-amber-400/60 rounded-full size-[7px] shrink-0" />
            <span className="font-bold text-[11px]">
              جاري العمل عليها
            </span>
          </div>
        );
      case "open":
        return (
          <div className="bg-[#eff6ff] border border-blue-200 text-[#1d4ed8] dark:bg-[#162233] dark:border-blue-500/40 dark:text-[#93c5fd] flex items-center gap-1.5 px-2.5 py-0.5 rounded-full w-fit shrink-0">
            <div className="bg-[#2563eb] shadow-[0_0_8px_#2563eb] ring-1 ring-blue-400/60 rounded-full size-[7px] shrink-0" />
            <span className="font-bold text-[11px]">مفتوحة</span>
          </div>
        );
      case "pending":
        return (
          <div className="bg-[#fffbeb] border border-amber-200 text-[#92400e] dark:bg-[#2e1d0f] dark:border-amber-500/40 dark:text-[#fbbf24] flex items-center gap-1.5 px-2.5 py-0.5 rounded-full w-fit shrink-0">
            <div className="bg-[#f59e0b] shadow-[0_0_8px_#f59e0b] ring-1 ring-amber-400/60 rounded-full size-[7px] shrink-0" />
            <span className="font-bold text-[11px]">معلقة</span>
          </div>
        );
      case "closed":
      default:
        return (
          <div className="bg-[#ecfdf5] border border-emerald-200 text-[#065f46] dark:bg-[#132c1c] dark:border-emerald-500/40 dark:text-[#6ee7b7] flex items-center gap-1.5 px-2.5 py-0.5 rounded-full w-fit shrink-0">
            <div className="bg-[#10b981] shadow-[0_0_8px_#10b981] ring-1 ring-emerald-400/60 rounded-full size-[7px] shrink-0" />
            <span className="font-bold text-[11px]">مغلقة</span>
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
        <table className="w-full border-collapse text-start">
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
            {pagedTickets.map((ticket, idx) => {
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
                          <div className="absolute start-0 sm:end-0 mt-[4px] w-[180px] bg-white rounded-[8px] shadow-[0px_8px_24px_rgba(0,0,0,0.12)] border border-[#eae8e4] py-[4px] z-50 text-start">
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
        className="bg-white dark:bg-[#221812] flex flex-col sm:flex-row items-center justify-between p-4 border-t border-[#eae8e4] dark:border-[#38271c] gap-3"
        data-node-id="1:14764"
        data-name="Pagination Footer"
      >
        <div className="flex items-center gap-3 order-1 sm:order-2">
          <div className="text-[12px] text-[#514537] dark:text-[#cdc5bd]">
            عرض <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{startItem}</span> إلى{" "}
            <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{endItem}</span> من أصل{" "}
            <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{tickets.length}</span> تذكرة
          </div>

          <div className="flex items-center gap-2 border-s border-[#eae8e4] dark:border-[#38271c] ps-3">
            <span className="text-[11px] text-[#837565] dark:text-[#8e8680]">صفوف بالصفحة:</span>
            <PageSizeDropdown
              value={pageSize}
              onChange={(newSize) => {
                setPageSize(newSize);
                setPageIndex(0);
              }}
              options={[5, 10, 20, 50]}
            />
          </div>
        </div>

        {/* RTL: ChevronsRight is first page, ChevronRight is previous */}
        <div className="flex items-center gap-1.5 order-2 sm:order-1">
          <button
            type="button"
            disabled={safePageIndex === 0}
            onClick={() => setPageIndex(0)}
            title="الصفحة الأولى"
            className="size-[32px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#8e8680] hover:bg-[#eae8e4] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronsRight className="size-[14px]" />
          </button>

          <button
            type="button"
            disabled={safePageIndex === 0}
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            className="bg-[#f5f3ef] dark:bg-[#281c15] flex items-center gap-1 px-3 py-1.5 rounded-[4px] text-[12px] font-semibold text-[#837565] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight className="size-[12px]" />
            <span>السابق</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i).map((p) => {
            if (totalPages > 5 && Math.abs(p - safePageIndex) > 2 && p !== 0 && p !== totalPages - 1) {
              if (p === 1 || p === totalPages - 2) {
                return (
                  <span key={p} className="text-[#837565] dark:text-[#8e8680] px-1 text-[12px]">
                    ...
                  </span>
                );
              }
              return null;
            }
            const isActive = safePageIndex === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPageIndex(p)}
                className={`size-[32px] rounded-[4px] font-bold text-[12px] flex items-center justify-center transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#9c6402] text-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                    : "bg-[#f5f3ef] dark:bg-[#281c15] text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#eae8e4] dark:hover:bg-[#38271c]"
                }`}
              >
                {p + 1}
              </button>
            );
          })}

          <button
            type="button"
            disabled={safePageIndex >= totalPages - 1}
            onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
            className="bg-[#f5f3ef] dark:bg-[#281c15] flex items-center gap-1 px-3 py-1.5 rounded-[4px] text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <span>التالي</span>
            <ChevronLeft className="size-[12px]" />
          </button>

          <button
            type="button"
            disabled={safePageIndex >= totalPages - 1}
            onClick={() => setPageIndex(totalPages - 1)}
            title="الصفحة الأخيرة"
            className="size-[32px] rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] text-[#837565] dark:text-[#8e8680] hover:bg-[#eae8e4] dark:hover:bg-[#281c15] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronsLeft className="size-[14px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
