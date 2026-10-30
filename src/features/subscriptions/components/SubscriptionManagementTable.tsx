"use client";

import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  PaginationState,
} from "@tanstack/react-table";
import { SubscriptionRecord, SubscriptionStatus } from "../types/subscription.types";
import { SubscriptionRowActionMenu } from "./SubscriptionRowActionMenu";
import { PageSizeDropdown } from "@/components/shared/PageSizeDropdown";
import {
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
} from "lucide-react";

interface SubscriptionManagementTableProps {
  data: SubscriptionRecord[];
  onViewDetails: (sub: SubscriptionRecord) => void;
  onEdit?: (sub: SubscriptionRecord) => void;
  onRenew?: (sub: SubscriptionRecord) => void;
  onCancel?: (sub: SubscriptionRecord) => void;
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newSize: number) => void;
}

export function SubscriptionManagementTable({
  data,
  onViewDetails,
  onEdit,
  onRenew,
  onCancel,
  pageIndex,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: SubscriptionManagementTableProps) {
  const getStatusBadge = (status: SubscriptionStatus, label: string) => {
    switch (status) {
      case "active":
        return (
          <div className="bg-[#ecfdf5] border border-emerald-200 dark:bg-[#132c21] dark:border-emerald-500/40 dark:shadow-[0_0_10px_rgba(16,185,129,0.15)] flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit">
            <span className="font-['Cairo'] font-bold text-[11px] text-[#065f46] dark:text-[#6ee7b7]">
              {label}
            </span>
            <div className="bg-[#10b981] shadow-[0_0_8px_#10b981] ring-1 ring-emerald-400/60 rounded-full size-[7px] shrink-0" />
          </div>
        );
      case "pending":
        return (
          <div className="bg-[#fffbeb] border border-amber-200 dark:bg-[#342711] dark:border-amber-500/40 dark:shadow-[0_0_10px_rgba(245,158,11,0.15)] flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit">
            <span className="font-['Cairo'] font-bold text-[11px] text-[#78350f] dark:text-[#fbbf24]">
              {label}
            </span>
            <div className="bg-[#f59e0b] shadow-[0_0_8px_#f59e0b] ring-1 ring-amber-400/60 rounded-full size-[7px] shrink-0" />
          </div>
        );
      case "cancelled":
        return (
          <div className="bg-[#f0eeea] border border-[#e2ded8] dark:bg-[#2c2621] dark:border-[#4d3627] flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit">
            <span className="font-['Cairo'] font-bold text-[11px] text-[#514537] dark:text-[#cdc5bd]">
              {label}
            </span>
            <div className="bg-[#837565] rounded-full size-[7px] shrink-0" />
          </div>
        );
      case "expired":
        return (
          <div className="bg-[#fef2f2] border border-red-200 dark:bg-[#311616] dark:border-red-500/40 dark:shadow-[0_0_10px_rgba(239,68,68,0.15)] flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit">
            <span className="font-['Cairo'] font-bold text-[11px] text-[#991b1b] dark:text-[#f87171]">
              {label}
            </span>
            <div className="bg-[#ef4444] shadow-[0_0_8px_#ef4444] ring-1 ring-red-400/60 rounded-full size-[7px] shrink-0" />
          </div>
        );
      case "rejected":
        return (
          <div className="bg-[#fff1f2] border border-rose-200 dark:bg-[#38141b] dark:border-rose-500/40 dark:shadow-[0_0_10px_rgba(244,63,94,0.15)] flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit">
            <span className="font-['Cairo'] font-bold text-[11px] text-[#9f1239] dark:text-[#fb7185]">
              {label}
            </span>
            <div className="bg-[#e11d48] shadow-[0_0_8px_#e11d48] ring-1 ring-rose-400/60 rounded-full size-[7px] shrink-0" />
          </div>
        );
      default:
        return (
          <span className="font-['Cairo'] text-[12px] text-[#514537]">{label}</span>
        );
    }
  };

  const getSubIndicatorColor = (status: SubscriptionStatus, urgency: string) => {
    if (status === "active") {
      return urgency === "urgent" ? "bg-[#d97706]" : "bg-[#059669]";
    }
    if (status === "pending") return "bg-[#d97706]";
    if (status === "rejected") return "bg-[#be123c]";
    return "bg-[#837565]";
  };

  const columns = useMemo<ColumnDef<SubscriptionRecord>[]>(
    () => [
      {
        accessorKey: "id",
        header: () => (
          <div className="text-right font-['Cairo'] font-bold text-[12px] text-[#514537] dark:text-[#d1c9bd]">
            رقم الاشتراك
          </div>
        ),
        cell: ({ row }) => {
          const sub = row.original;
          const indicator = getSubIndicatorColor(sub.status, sub.daysUrgency);
          return (
            <div className="flex items-center gap-2">
              <div className={`w-1 h-7 rounded-[12px] shrink-0 ${indicator}`} />
              <button
                type="button"
                onClick={() => onViewDetails(sub)}
                className="font-['Cairo'] font-bold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] hover:text-[#9c6402] dark:hover:text-[#f59e0b] tracking-tight transition-colors text-right cursor-pointer"
              >
                {sub.id}
              </button>
            </div>
          );
        },
      },
      {
        accessorKey: "firm.name",
        header: () => (
          <div className="text-right font-['Cairo'] font-bold text-[12px] text-[#514537] dark:text-[#d1c9bd]">
            اسم المكتب والترخيص
          </div>
        ),
        cell: ({ row }) => {
          const { firm } = row.original;
          return (
            <div className="flex flex-col items-start text-right">
              <span className="font-['Cairo'] font-semibold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] leading-snug">
                {firm.name}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-[#514537] dark:text-[#a89f91] font-['Cairo'] pt-0.5">
                <span>{firm.city}</span>
                <span>•</span>
                <span>ترخيص: {firm.licenseNumber}</span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "planName",
        header: () => (
          <div className="text-right font-['Cairo'] font-bold text-[12px] text-[#514537] dark:text-[#d1c9bd]">
            الباقة والدورة
          </div>
        ),
        cell: ({ row }) => {
          const sub = row.original;
          return (
            <div className="flex flex-col items-start text-right">
              <span className="font-['Cairo'] font-semibold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7]">
                {sub.planName}
              </span>
              <span className="font-['Cairo'] font-bold text-[10px] text-[#837565] dark:text-[#a89f91] pt-0.5">
                {sub.planPrice}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "startDate",
        header: () => (
          <div className="text-right font-['Cairo'] font-bold text-[12px] text-[#514537] dark:text-[#d1c9bd]">
            تاريخ البداية
          </div>
        ),
        cell: ({ row }) => (
          <span className="font-['Cairo'] text-[13px] text-[#514537] dark:text-[#d1c9bd]">
            {row.original.startDate}
          </span>
        ),
      },
      {
        accessorKey: "renewalDate",
        header: () => (
          <div className="text-right font-['Cairo'] font-bold text-[12px] text-[#514537] dark:text-[#d1c9bd] leading-[16px]">
            <div>موعد التجديد</div>
            <div>القادم</div>
          </div>
        ),
        cell: ({ row }) => {
          const sub = row.original;
          const isUrgent = sub.daysUrgency === "urgent";
          return (
            <div className="flex flex-col items-start text-right">
              <span className="font-['Cairo'] text-[13px] text-[#514537] dark:text-[#d1c9bd]">
                {sub.renewalDate}
              </span>
              <span
                className={`font-['Cairo'] font-bold text-[10px] pt-0.5 ${
                  isUrgent
                    ? "text-[#b45309] dark:text-[#fbbf24]"
                    : sub.daysUrgency === "cancelled" || sub.daysUrgency === "expired"
                    ? "text-[#837565] dark:text-[#a89f91]"
                    : "text-[#514537] dark:text-[#a89f91]"
                }`}
              >
                {sub.remainingDaysText}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "paymentMethod",
        header: () => (
          <div className="text-right font-['Cairo'] font-bold text-[12px] text-[#514537] dark:text-[#d1c9bd]">
            طريقة الدفع
          </div>
        ),
        cell: ({ row }) => {
          const pm = row.original.paymentMethod;
          return (
            <div className="flex items-center gap-2">
              <div className="bg-[#f0eeea] dark:bg-[#2c2621] px-1.5 py-0.5 rounded-[2px] text-[#514537] dark:text-[#a89f91] font-['Cairo'] font-bold text-[9px] shrink-0">
                {pm.badgeLabel}
              </div>
              <div className="flex flex-col items-start text-right">
                <span className="font-['Cairo'] text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1">
                  {pm.cardNumber && <span dir="ltr">{pm.cardNumber}</span>}
                </span>
                <span className="font-['Cairo'] font-bold text-[10px] text-[#837565] dark:text-[#a89f91]">
                  {pm.statusText}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: () => (
          <div className="text-right font-['Cairo'] font-bold text-[12px] text-[#514537] dark:text-[#d1c9bd]">
            الحالة
          </div>
        ),
        cell: ({ row }) => {
          return getStatusBadge(row.original.status, row.original.statusLabel);
        },
      },
      {
        id: "actions",
        header: () => (
          <div className="text-center font-['Cairo'] font-bold text-[12px] text-[#514537] dark:text-[#d1c9bd]">
            الإجراءات
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <SubscriptionRowActionMenu
              subscription={row.original}
              onViewDetails={onViewDetails}
              onEdit={onEdit}
              onRenew={onRenew}
              onCancel={onCancel}
            />
          </div>
        ),
      },
    ],
    [onViewDetails, onEdit, onRenew, onCancel]
  );

  const paginationState = useMemo<PaginationState>(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      pagination: paginationState,
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalItems / pageSize),
  });

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalItems);

  return (
    <div
      className="bg-white dark:bg-[#1e1c1a] flex flex-col rounded-[8px] border border-[#f0eeea] dark:border-[#2f2a24] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full font-['Cairo',sans-serif]"
      data-node-id="1:5392"
      data-name="Main Table Container"
    >
      {/* Table Body Area - Clean responsive container without forced scrollbars */}
      <div className="overflow-x-auto w-full max-w-full">
        <table className="w-full border-collapse text-right">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-[#f0eeea] dark:bg-[#2c2621] border-b border-[#e5e2dc] dark:border-[#38332c] h-[52px]"
              >
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="py-2.5 px-3 font-normal">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-[#f0eeea] dark:divide-[#2f2a24]">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-[#837565] dark:text-[#a89f91] font-['Cairo'] text-[14px]"
                >
                  لا توجد اشتراكات مطابقة للفلاتر المحددة.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => {
                const sub = row.original;
                const isInactive =
                  sub.status === "cancelled" || sub.status === "expired" || sub.status === "rejected";
                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-[#faf9f7] dark:hover:bg-[#25221e] transition-colors ${
                      isInactive ? "opacity-75" : ""
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-3 px-3 align-middle">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div
        className="bg-white dark:bg-[#1e1c1a] flex flex-col sm:flex-row items-center justify-between p-4 border-t border-[#f0eeea] dark:border-[#2f2a24] gap-4"
        data-node-id="1:5737"
        data-name="Pagination Footer"
      >
        {/* Right in RTL: Count Summary and Custom Rows Per Page Dropdown */}
        <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#514537] dark:text-[#a89f91] font-['Cairo']">
          <div>
            <span>عرض </span>
            <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{startItem}</span>
            <span> إلى </span>
            <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{endItem}</span>
            <span> من أصل </span>
            <span className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">{totalItems}</span>
            <span> مكتب محاماة</span>
          </div>

          {onPageSizeChange && (
            <div className="flex items-center gap-2 border-s border-[#eae8e4] dark:border-[#2f2a24] ps-3">
              <span className="text-[11px] text-[#837565] dark:text-[#a89f91]">صفوف بالصفحة:</span>
              <PageSizeDropdown
                value={pageSize}
                onChange={onPageSizeChange}
                options={[5, 10, 20, 50]}
              />
            </div>
          )}
        </div>

        {/* Left in RTL: Page Navigation Controls */}
        <div className="flex items-center gap-1.5" data-node-id="1:5738">
          <button
            type="button"
            disabled={pageIndex === 0}
            onClick={() => onPageChange(0)}
            title="الصفحة الأولى"
            className="size-8 rounded-[4px] bg-[#f5f3ef] dark:bg-[#2c2621] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#eae8e4] dark:hover:bg-[#38332c] text-[#514537] dark:text-[#d1c9bd] flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            disabled={pageIndex === 0}
            onClick={() => onPageChange(pageIndex - 1)}
            title="الصفحة السابقة"
            className="bg-[#f5f3ef] dark:bg-[#2c2621] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#eae8e4] dark:hover:bg-[#38332c] text-[#514537] dark:text-[#d1c9bd] px-2.5 py-1.5 rounded-[4px] font-['Cairo'] font-semibold text-[12px] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
            <span>السابق</span>
          </button>

          <button
            type="button"
            onClick={() => onPageChange(0)}
            className={`size-8 rounded-[4px] font-['Cairo'] text-[12px] flex items-center justify-center transition-colors cursor-pointer ${
              pageIndex === 0
                ? "bg-[#9c6402] text-[#fff3e9] font-bold shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                : "bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] font-semibold hover:bg-[#eae8e4]"
            }`}
          >
            1
          </button>

          {totalPages > 1 && (
            <button
              type="button"
              onClick={() => onPageChange(1)}
              className={`size-8 rounded-[4px] font-['Cairo'] text-[12px] flex items-center justify-center transition-colors cursor-pointer ${
                pageIndex === 1
                  ? "bg-[#9c6402] text-[#fff3e9] font-bold shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                  : "bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] font-semibold hover:bg-[#eae8e4]"
              }`}
            >
              2
            </button>
          )}

          {totalPages > 2 && (
            <button
              type="button"
              onClick={() => onPageChange(2)}
              className={`size-8 rounded-[4px] font-['Cairo'] text-[12px] flex items-center justify-center transition-colors cursor-pointer ${
                pageIndex === 2
                  ? "bg-[#9c6402] text-[#fff3e9] font-bold shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                : "bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] font-semibold hover:bg-[#eae8e4]"
              }`}
            >
              3
            </button>
          )}

          {totalPages > 4 && (
            <span className="px-1 text-[#837565] font-semibold text-[12px]">...</span>
          )}

          {totalPages > 3 && (
            <button
              type="button"
              onClick={() => onPageChange(totalPages - 1)}
              className={`size-8 rounded-[4px] font-['Cairo'] text-[12px] flex items-center justify-center transition-colors cursor-pointer ${
                pageIndex === totalPages - 1
                  ? "bg-[#9c6402] text-[#fff3e9] font-bold shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                  : "bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] font-semibold hover:bg-[#eae8e4]"
              }`}
            >
              {totalPages}
            </button>
          )}

          <button
            type="button"
            disabled={pageIndex >= totalPages - 1}
            onClick={() => onPageChange(pageIndex + 1)}
            title="الصفحة التالية"
            className="bg-[#f5f3ef] dark:bg-[#2c2621] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#eae8e4] dark:hover:bg-[#38332c] text-[#1b1c1a] dark:text-[#fdfbf7] px-2.5 py-1.5 rounded-[4px] font-['Cairo'] font-semibold text-[12px] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>التالي</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            disabled={pageIndex >= totalPages - 1}
            onClick={() => onPageChange(totalPages - 1)}
            title="الصفحة الأخيرة"
            className="size-8 rounded-[4px] bg-[#f5f3ef] dark:bg-[#2c2621] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#eae8e4] dark:hover:bg-[#38332c] text-[#514537] dark:text-[#d1c9bd] flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
