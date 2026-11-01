"use client";

import { apiRequest } from "./http";

export async function fetchPaymentGateways() {
  return apiRequest("/admin/payment-gateways", { method: "GET" });
}

export async function fetchPaymentGateway(gatewayId: string) {
  return apiRequest(`/admin/payment-gateways/${gatewayId}`, { method: "GET" });
}

export async function updatePaymentGateway(
  gatewayId: string,
  body: Record<string, unknown>
) {
  return apiRequest(`/admin/payment-gateways/${gatewayId}`, {
    method: "PUT",
    body,
  });
}

export async function updatePaymentGatewayStatus(gatewayId: string, status: string) {
  return apiRequest(`/admin/payment-gateways/${gatewayId}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export async function testPaymentGateway(gatewayId: string) {
  return apiRequest(`/admin/payment-gateways/${gatewayId}/test`, {
    method: "POST",
  });
}

export async function fetchInvoices() {
  return apiRequest("/admin/invoices", { method: "GET" });
}

export async function fetchInvoiceById(invoiceId: string | number) {
  return apiRequest(`/admin/invoices/${invoiceId}`, { method: "GET" });
}
