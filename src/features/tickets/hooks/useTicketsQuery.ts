"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchTickets,
  fetchTicketsStats,
  fetchTicketById,
  type FetchTicketsParams,
} from "@/lib/api/tickets";
import { fetchDepartments } from "@/lib/api/departments";
import { QUERY_KEYS, InvalidationGraph } from "@/lib/query-keys";


export const TICKETS_QUERY_KEYS = {
  all: QUERY_KEYS.tickets.all,
  lists: () => QUERY_KEYS.tickets.lists(),
  list: (params?: FetchTicketsParams) =>
    QUERY_KEYS.tickets.list(params),
  stats: (params?: { company_id?: number | string }) => QUERY_KEYS.tickets.stats(params),
  details: () => QUERY_KEYS.tickets.details(),
  detail: (id: string | number) =>
    QUERY_KEYS.tickets.detail(id),
  departments: () => QUERY_KEYS.tickets.departments(),
};

export function useTicketsQuery(params: FetchTicketsParams = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.tickets.list(params),
    queryFn: () => fetchTickets(params),
  });
}

export function useTicketStatsQuery(params?: { company_id?: number | string }) {
  return useQuery({
    queryKey: QUERY_KEYS.tickets.stats(params),
    queryFn: () => fetchTicketsStats(params),
  });
}

export function useTicketDetailQuery(ticketId: string | number | null | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.tickets.detail(ticketId || ""),
    queryFn: () => fetchTicketById(ticketId!),
    enabled: Boolean(ticketId),
  });
}

export function useDepartmentsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.tickets.departments(),
    queryFn: () => fetchDepartments(),
  });
}

export function invalidateTicketsQueries(queryClient: ReturnType<typeof useQueryClient>) {
  return InvalidationGraph.onTicketMutation(queryClient);
}

export function prefetchTicketsQuery(queryClient: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.tickets.list({}),
      queryFn: () => fetchTickets({}),
    }),
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.tickets.stats(),
      queryFn: () => fetchTicketsStats(),
    }),
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.tickets.departments(),
      queryFn: () => fetchDepartments(),
    }),
  ]);
}
