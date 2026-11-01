"use client";

import { apiRequest } from "./http";

export async function fetchTicketsStats() {
  return apiRequest("/admin/tickets/stats", { method: "GET" });
}

export async function fetchTickets(params: {
  status?: string;
  priority?: string;
  page?: number;
} = {}) {
  return apiRequest("/admin/tickets", {
    method: "GET",
    query: {
      status: params.status,
      priority: params.priority,
      page: params.page,
    },
  });
}

export async function createTicket(body: Record<string, unknown>) {
  return apiRequest("/admin/tickets", { method: "POST", body });
}

export async function fetchTicketById(ticketId: string | number) {
  return apiRequest(`/admin/tickets/${ticketId}`, { method: "GET" });
}

export async function replyTicket(
  ticketId: string | number,
  body: {
    message: string;
    is_internal_note?: boolean;
    notify_client_sms_email?: boolean;
  }
) {
  return apiRequest(`/admin/tickets/${ticketId}/reply`, {
    method: "POST",
    body,
  });
}

export async function assignTicket(
  ticketId: string | number,
  staffId: string | number,
  reason?: string
) {
  return apiRequest(`/admin/tickets/${ticketId}/assign`, {
    method: "POST",
    body: { staff_id: staffId, reason },
  });
}

export async function updateTicketStatus(ticketId: string | number, status: string) {
  return apiRequest(`/admin/tickets/${ticketId}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export async function closeTicket(ticketId: string | number) {
  return apiRequest(`/admin/tickets/${ticketId}/close`, { method: "POST" });
}
