"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from "lucide-react";
import { PageSizeDropdown } from "@/components/shared/PageSizeDropdown";
import { useLanguage } from "@/lib/i18n";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount = -1,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  isLoading = false,
  emptyMessage,
}: DataTableProps<TData, TValue>) {
  const { t } = useLanguage();
  const finalEmptyMessage = emptyMessage || t("لا توجد بيانات متاحة.", "No results found.");
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: (updater) => {
      if (!onPaginationChange || !pagination) return;
      const next = typeof updater === "function" ? updater(pagination) : updater;
      onPaginationChange(next);
    },
    onSortingChange: (updater) => {
      if (!onSortingChange || !sorting) return;
      const next = typeof updater === "function" ? updater(sorting) : updater;
      onSortingChange(next);
    },
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{t("جاري تحميل البيانات...", "Loading data...")}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {finalEmptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">
              {t(
                `صفحة ${pagination.pageIndex + 1} من ${Math.max(1, pageCount)}`,
                `Page ${pagination.pageIndex + 1} of ${Math.max(1, pageCount)}`
              )}
            </div>
            <div className="flex items-center gap-2 border-s border-border ps-3">
              <span className="text-[11px] text-muted-foreground">{t("صفوف بالصفحة:", "Rows per page:")}</span>
              <PageSizeDropdown
                value={pagination.pageSize}
                onChange={(newSize) => {
                  onPaginationChange?.({
                    ...pagination,
                    pageSize: newSize,
                    pageIndex: 0,
                  });
                }}
                options={[5, 10, 20, 50]}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onPaginationChange?.({ ...pagination, pageIndex: 0 })}
              disabled={pagination.pageIndex === 0 || isLoading}
              title={t("الصفحة الأولى", "First page")}
            >
              <ChevronsLeft className="h-4 w-4 rtl:rotate-180" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() =>
                onPaginationChange?.({
                  ...pagination,
                  pageIndex: Math.max(0, pagination.pageIndex - 1),
                })
              }
              disabled={pagination.pageIndex === 0 || isLoading}
              title={t("الصفحة السابقة", "Previous page")}
            >
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() =>
                onPaginationChange?.({
                  ...pagination,
                  pageIndex: pagination.pageIndex + 1,
                })
              }
              disabled={
                pageCount > 0
                  ? pagination.pageIndex >= pageCount - 1
                  : !table.getCanNextPage() || isLoading
              }
              title={t("الصفحة التالية", "Next page")}
            >
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() =>
                onPaginationChange?.({
                  ...pagination,
                  pageIndex: Math.max(0, pageCount - 1),
                })
              }
              disabled={pageCount <= 0 || pagination.pageIndex >= pageCount - 1 || isLoading}
              title={t("الصفحة الأخيرة", "Last page")}
            >
              <ChevronsRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
