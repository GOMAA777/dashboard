"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchPaymentGateways,
  fetchPaymentGateway,
} from "@/lib/api/payments";

export const PAYMENT_GATEWAYS_QUERY_KEYS = {
  all: ["payment-gateways"] as const,
  list: () => [...PAYMENT_GATEWAYS_QUERY_KEYS.all, "list"] as const,
  details: () => [...PAYMENT_GATEWAYS_QUERY_KEYS.all, "detail"] as const,
  detail: (code: string) => [...PAYMENT_GATEWAYS_QUERY_KEYS.details(), code] as const,
};

export function usePaymentGatewaysQuery() {
  return useQuery({
    queryKey: PAYMENT_GATEWAYS_QUERY_KEYS.list(),
    queryFn: () => fetchPaymentGateways(),
  });
}

export function usePaymentGatewayDetailQuery(code: string | null | undefined) {
  return useQuery({
    queryKey: PAYMENT_GATEWAYS_QUERY_KEYS.detail(code || ""),
    queryFn: () => fetchPaymentGateway(code!),
    enabled: Boolean(code),
  });
}

export function invalidatePaymentGatewaysQueries(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({
    queryKey: PAYMENT_GATEWAYS_QUERY_KEYS.all,
  });
}

export function prefetchPaymentGatewaysQuery(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.prefetchQuery({
    queryKey: PAYMENT_GATEWAYS_QUERY_KEYS.list(),
    queryFn: () => fetchPaymentGateways(),
  });
}
