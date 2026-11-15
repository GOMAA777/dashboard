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
  emptyMessage = "No results found.",
}: DataTableProps<TData, TValue>) {
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
                    <span>Loading data...</span>
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
                  {emptyMessage}
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
              صفحة {pagination.pageIndex + 1} من {Math.max(1, pageCount)}
            </div>
            <div className="flex items-center gap-[6px]">
              <span className="text-[11px] text-muted-foreground">صفوف بالصفحة:</span>
              <select
                value={pagination.pageSize}
                onChange={(e) => {
                  onPaginationChange?.({
                    ...pagination,
                    pageSize: Number(e.target.value),
                    pageIndex: 0,
                  });
                }}
                className="bg-muted text-foreground text-[11px] font-bold py-1 px-2 rounded-[4px] border border-border focus:outline-none cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onPaginationChange?.({ ...pagination, pageIndex: 0 })}
              disabled={pagination.pageIndex === 0 || isLoading}
              title="الصفحة الأولى"
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
              title="الصفحة السابقة"
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
              title="الصفحة التالية"
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
              title="الصفحة الأخيرة"
            >
              <ChevronsRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
