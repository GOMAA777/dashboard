"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchInvoices,
  fetchAllFirmInvoices,
  fetchInvoiceById,
  type FetchInvoicesParams,
} from "@/lib/api/payments";

export const INVOICES_QUERY_KEYS = {
  all: ["invoices"] as const,
  lists: () => [...INVOICES_QUERY_KEYS.all, "list"] as const,
  list: (params?: FetchInvoicesParams) =>
    [...INVOICES_QUERY_KEYS.lists(), params ?? {}] as const,
  details: () => [...INVOICES_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string | number) =>
    [...INVOICES_QUERY_KEYS.details(), String(id)] as const,
};

export function useInvoicesQuery(params?: FetchInvoicesParams) {
  return useQuery({
    queryKey: INVOICES_QUERY_KEYS.list(params),
    queryFn: () =>
      params?.company_id ? fetchInvoices(params) : fetchAllFirmInvoices(),
  });
}

export function useInvoiceDetailQuery(id: string | number | null | undefined) {
  return useQuery({
    queryKey: INVOICES_QUERY_KEYS.detail(id || ""),
    queryFn: () => fetchInvoiceById(id!),
    enabled: Boolean(id),
  });
}

export function invalidateInvoicesQueries(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({
    queryKey: INVOICES_QUERY_KEYS.all,
  });
}

export function prefetchInvoicesQuery(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.prefetchQuery({
    queryKey: INVOICES_QUERY_KEYS.list({}),
    queryFn: () => fetchAllFirmInvoices(),
  });
}
