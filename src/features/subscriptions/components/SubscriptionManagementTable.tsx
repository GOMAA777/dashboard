"use client";

import React, { useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  PaginationState,
} from "@tanstack/react-table";
import { SubscriptionRecord, SubscriptionStatus } from "../types/subscription.types";
import { SubscriptionRowActionMenu } from "./SubscriptionRowActionMenu";
import { UnifiedPagination } from "@/components/shared/UnifiedPagination";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface SubscriptionManagementTableProps {
  data: SubscriptionRecord[];
  onViewDetails: (sub: SubscriptionRecord) => void;
  onEdit?: (sub: SubscriptionRecord) => void;
  onRenew?: (sub: SubscriptionRecord) => void;
  onCancel?: (sub: SubscriptionRecord) => void;
  onApprove?: (sub: SubscriptionRecord) => void;
  onReject?: (sub: SubscriptionRecord) => void;
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newSize: number) => void;
  className?: string;
}

export function SubscriptionManagementTable({
  data,
  onViewDetails,
  onEdit,
  onRenew,
  onCancel,
  onApprove,
  onReject,
  pageIndex,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  className,
}: SubscriptionManagementTableProps) {
  const { t } = useLanguage();

  const getStatusBadge = useCallback((status: SubscriptionStatus, label: string) => {
    switch (status) {
      case "active":
        if (label === "صلاحيات كاملة" || label === "غير محدود") {
          return (
            <div className="bg-[#fef3c7] border border-amber-300 dark:bg-[#342711] dark:border-amber-500/50 flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit shadow-xs">
              <span className="font-['Cairo'] font-bold text-[11px] text-[#92400e] dark:text-[#fde68a]">
                {t(label, "Full Privileges")}
              </span>
              <div className="bg-[#d97706] shadow-[0_0_8px_#d97706] ring-1 ring-amber-400/60 rounded-full size-[7px] shrink-0" />
            </div>
          );
        }
        return (
          <div className="bg-[#ecfdf5] border border-emerald-200 dark:bg-[#132c21] dark:border-emerald-500/40 dark:shadow-[0_0_10px_rgba(16,185,129,0.15)] flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit">
            <span className="font-['Cairo'] font-bold text-[11px] text-[#065f46] dark:text-[#6ee7b7]">
              {t(label, "Active")}
            </span>
            <div className="bg-[#10b981] shadow-[0_0_8px_#10b981] ring-1 ring-emerald-400/60 rounded-full size-[7px] shrink-0" />
          </div>
        );
      case "pending":
        return (
          <div className="bg-[#fffbeb] border border-amber-200 dark:bg-[#342711] dark:border-amber-500/40 dark:shadow-[0_0_10px_rgba(245,158,11,0.15)] flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit">
            <span className="font-['Cairo'] font-bold text-[11px] text-[#78350f] dark:text-[#fbbf24]">
              {t(label, "Pending")}
            </span>
            <div className="bg-[#f59e0b] shadow-[0_0_8px_#f59e0b] ring-1 ring-amber-400/60 rounded-full size-[7px] shrink-0" />
          </div>
        );
      case "cancelled":
        return (
          <div className="bg-[#f0eeea] border border-[#e2ded8] dark:bg-[#281c15] dark:border-[#4d3627] flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit">
            <span className="font-['Cairo'] font-bold text-[11px] text-[#514537] dark:text-[#cdc5bd]">
              {t(label, "Cancelled")}
            </span>
            <div className="bg-[#837565] rounded-full size-[7px] shrink-0" />
          </div>
        );
      case "expired":
        return (
          <div className="bg-[#fef2f2] border border-red-200 dark:bg-[#311616] dark:border-red-500/40 dark:shadow-[0_0_10px_rgba(239,68,68,0.15)] flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit">
            <span className="font-['Cairo'] font-bold text-[11px] text-[#991b1b] dark:text-[#f87171]">
              {t(label, "Expired")}
            </span>
            <div className="bg-[#ef4444] shadow-[0_0_8px_#ef4444] ring-1 ring-red-400/60 rounded-full size-[7px] shrink-0" />
          </div>
        );
      case "rejected":
        return (
          <div className="bg-[#fff1f2] border border-rose-200 dark:bg-[#38141b] dark:border-rose-500/40 dark:shadow-[0_0_10px_rgba(244,63,94,0.15)] flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit">
            <span className="font-['Cairo'] font-bold text-[11px] text-[#9f1239] dark:text-[#fb7185]">
              {t(label, "Rejected")}
            </span>
            <div className="bg-[#e11d48] shadow-[0_0_8px_#e11d48] ring-1 ring-rose-400/60 rounded-full size-[7px] shrink-0" />
          </div>
        );
      default:
        return (
          <span className="font-['Cairo'] text-[12px] text-[#514537]">{label}</span>
        );
    }
  }, [t]);

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
          <div className="text-start font-['Cairo'] font-bold text-[12px] text-[#514537] dark:text-[#cdc5bd]">
            {t("رقم الاشتراك", "Subscription ID")}
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
                className="font-['Cairo'] font-bold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] hover:text-[#9c6402] dark:hover:text-[#f59e0b] tracking-tight transition-colors text-start cursor-pointer"
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
          <div className="text-start font-['Cairo'] font-bold text-[12px] text-[#514537] dark:text-[#cdc5bd]">
            {t("اسم المكتب والترخيص", "Law Firm & License")}
          </div>
        ),
        cell: ({ row }) => {
          const { firm } = row.original;
          return (
            <div className="flex flex-col items-start text-start">
              <span className="font-['Cairo'] font-semibold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] leading-snug">
                {firm.name}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-[#514537] dark:text-[#a89f91] font-['Cairo'] pt-0.5">
                <span>{firm.city}</span>
                <span>•</span>
                <span>{t("ترخيص:", "License:")} {firm.licenseNumber}</span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "planName",
        header: () => (
          <div className="text-start font-['Cairo'] font-bold text-[12px] text-[#514537] dark:text-[#cdc5bd]">
            {t("الباقة والدورة", "Plan & Cycle")}
          </div>
        ),
        cell: ({ row }) => {
          const sub = row.original;
          const isUnlim = sub.planName === "غير محدود" || sub.billingCycle === "دائم" || sub.statusLabel === "صلاحيات كاملة";
          return (
            <div className="flex flex-col items-start text-start">
              <span className="font-['Cairo'] font-semibold text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1.5">
                {sub.planName}
                {isUnlim && (
                  <span className="text-[10px] font-bold text-[#9c6402] dark:text-[#e29d38] bg-[#9c6402]/10 dark:bg-[#e29d38]/15 px-1.5 py-0.5 rounded-[3px] border border-[#9c6402]/20">
                    VIP
                  </span>
                )}
              </span>
              <span className="font-['Cairo'] font-bold text-[10px] text-[#837565] dark:text-[#a89f91] pt-0.5">
                {isUnlim ? t("بدون سعر (مجاني)", "Free (0 SAR)") : sub.planPrice}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "startDate",
        header: () => (
          <div className="text-start font-['Cairo'] font-bold text-[12px] text-[#514537] dark:text-[#cdc5bd]">
            {t("تاريخ البداية", "Start Date")}
          </div>
        ),
        cell: ({ row }) => (
          <span className="font-['Cairo'] text-[13px] text-[#514537] dark:text-[#cdc5bd]">
            {row.original.startDate}
          </span>
        ),
      },
      {
        accessorKey: "renewalDate",
        header: () => (
          <div className="text-start font-['Cairo'] font-bold text-[12px] text-[#514537] dark:text-[#cdc5bd] leading-[16px]">
            {t("موعد التجديد القادم", "Next Renewal Date")}
          </div>
        ),
        cell: ({ row }) => {
          const sub = row.original;
          const isUnlim = sub.planName === "غير محدود" || sub.billingCycle === "دائم" || sub.statusLabel === "صلاحيات كاملة";
          const isUrgent = sub.daysUrgency === "urgent";
          return (
            <div className="flex flex-col items-start text-start">
              <span className="font-['Cairo'] text-[13px] text-[#514537] dark:text-[#cdc5bd]">
                {isUnlim ? t("دائم (بدون انتهاء)", "Permanent") : sub.renewalDate}
              </span>
              <span
                className={`font-['Cairo'] font-bold pt-0.5 ${
                  isUnlim
                    ? "text-[#9c6402] dark:text-[#e29d38] text-[13px] font-black"
                    : isUrgent
                    ? "text-[#b45309] dark:text-[#fbbf24] text-[10px]"
                    : sub.daysUrgency === "cancelled" || sub.daysUrgency === "expired"
                    ? "text-[#837565] dark:text-[#a89f91] text-[10px]"
                    : "text-[#514537] dark:text-[#a89f91] text-[10px]"
                }`}
              >
                {isUnlim ? "∞" : sub.remainingDaysText}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "paymentMethod",
        header: () => (
          <div className="text-start font-['Cairo'] font-bold text-[12px] text-[#514537] dark:text-[#cdc5bd]">
            {t("طريقة الدفع", "Payment Method")}
          </div>
        ),
        cell: ({ row }) => {
          const pm = row.original.paymentMethod;
          return (
            <div className="flex items-center gap-2">
              <div className="bg-[#f0eeea] dark:bg-[#281c15] px-1.5 py-0.5 rounded-[2px] text-[#514537] dark:text-[#a89f91] font-['Cairo'] font-bold text-[9px] shrink-0">
                {pm.badgeLabel}
              </div>
              <div className="flex flex-col items-start text-start">
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
          <div className="text-start font-['Cairo'] font-bold text-[12px] text-[#514537] dark:text-[#cdc5bd]">
            {t("الحالة", "Status")}
          </div>
        ),
        cell: ({ row }) => {
          return getStatusBadge(row.original.status, row.original.statusLabel);
        },
      },
      {
        id: "actions",
        header: () => (
          <div className="text-center font-['Cairo'] font-bold text-[12px] text-[#514537] dark:text-[#cdc5bd]">
            {t("الإجراءات", "Actions")}
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
              onApprove={onApprove}
              onReject={onReject}
            />
          </div>
        ),
      },
    ],
    [onViewDetails, onEdit, onRenew, onCancel, onApprove, onReject, t, getStatusBadge]
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

  return (
    <div
      className={cn(
        "bg-white dark:bg-[#221812] flex flex-col rounded-[8px] border border-[#f0eeea] dark:border-[#38271c] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] overflow-hidden w-full shrink-0 font-['Cairo',sans-serif]",
        className
      )}
      data-node-id="1:5392"
      data-name="Main Table Container"
    >
      {/* Table Body Area */}
      <div className="overflow-x-auto overflow-y-hidden scrollbar-none w-full max-w-full">
        <table className="w-full border-collapse text-start">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-[#f5f3ef] dark:bg-[#281c15] border-b border-[#eae8e4] dark:border-[#38271c] h-[52px] text-[12px] leading-[18px] font-bold"
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
          <tbody className="divide-y divide-[#f0eeea] dark:divide-[#38271c]">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-[#837565] dark:text-[#a89f91] font-['Cairo'] text-[14px]"
                >
                  {t(
                    "لا توجد اشتراكات مطابقة للفلاتر المحددة.",
                    "No subscriptions match the selected filters."
                  )}
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
                    className={`hover:bg-[#faf9f7] dark:hover:bg-[#2a1d15] transition-colors ${
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

      <UnifiedPagination
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange ?? (() => {})}
        itemLabel={t("اشتراك", "subscriptions")}
      />
    </div>
  );
}
