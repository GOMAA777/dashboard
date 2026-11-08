"use client";

import { apiRequest } from "./http";
import type {
  ApiEnvelope,
  Paginated,
  ApiTicketStats,
  ApiTicketItem,
  CreateTicketPayload,
  ReplyTicketPayload,
  AssignTicketPayload,
  UpdateTicketStatusPayload,
} from "./types";

export type {
  ApiTicketStats,
  ApiTicketItem,
  CreateTicketPayload,
  ReplyTicketPayload,
  AssignTicketPayload,
  UpdateTicketStatusPayload,
};

export interface FetchTicketsParams {
  status?: string;
  priority?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

/**
 * 01. إحصائيات تذاكر الدعم ونسب الرضا
 * GET /admin/tickets/stats
 */
export async function fetchTicketsStats() {
  return apiRequest<ApiEnvelope<ApiTicketStats> | ApiTicketStats>(
    "/admin/tickets/stats",
    { method: "GET" }
  );
}

/**
 * 02. استعراض قائمة التذاكر (فلترة بالأولوية والحالة)
 * GET /admin/tickets?status=...&priority=...
 */
export async function fetchTickets(params: FetchTicketsParams = {}) {
  return apiRequest<
    ApiEnvelope<Paginated<ApiTicketItem> | ApiTicketItem[]> | Paginated<ApiTicketItem> | ApiTicketItem[]
  >("/admin/tickets", {
    method: "GET",
    query: {
      status: params.status && params.status !== "all" ? params.status : undefined,
      priority: params.priority && params.priority !== "all" ? params.priority : undefined,
      search: params.search?.trim() || undefined,
      page: params.page,
      per_page: params.per_page,
    },
  });
}

/**
 * 03. إنشاء تذكرة دعم فني جديدة
 * POST /admin/tickets
 */
export async function createTicket(body: CreateTicketPayload) {
  return apiRequest<ApiEnvelope<ApiTicketItem> | ApiTicketItem>(
    "/admin/tickets",
    {
      method: "POST",
      body,
    }
  );
}

/**
 * 04. تفاصيل التذكرة وسجل المحادثة والملاحظات الداخلية
 * GET /admin/tickets/{{ticket_id}}
 */
export async function fetchTicketById(ticketId: string | number) {
  return apiRequest<ApiEnvelope<ApiTicketItem> | ApiTicketItem>(
    `/admin/tickets/${ticketId}`,
    {
      method: "GET",
    }
  );
}

/**
 * 05. كتابة رد موجه للعميل أو ملاحظة داخلية خاصة
 * 06. إضافة ملاحظة داخلية خاصة بالفريق التقني فقط
 * POST /admin/tickets/{{ticket_id}}/reply
 */
export async function replyTicket(
  ticketId: string | number,
  body: ReplyTicketPayload
) {
  return apiRequest<ApiEnvelope<unknown> | unknown>(
    `/admin/tickets/${ticketId}/reply`,
    {
      method: "POST",
      body,
    }
  );
}

/**
 * 07. إسناد التذكرة لموظف دعم مختص
 * POST /admin/tickets/{{ticket_id}}/assign
 */
export async function assignTicket(
  ticketId: string | number,
  body: AssignTicketPayload
) {
  return apiRequest<ApiEnvelope<unknown> | unknown>(
    `/admin/tickets/${ticketId}/assign`,
    {
      method: "POST",
      body,
    }
  );
}

/**
 * 08. تغيير حالة التذكرة (مفتوحة / جاري / معلقة / مغلقة)
 * PATCH /admin/tickets/{{ticket_id}}/status
 */
export async function updateTicketStatus(
  ticketId: string | number,
  body: UpdateTicketStatusPayload
) {
  return apiRequest<ApiEnvelope<unknown> | unknown>(
    `/admin/tickets/${ticketId}/status`,
    {
      method: "PATCH",
      body,
    }
  );
}

/**
 * 09. إغلاق التذكرة بنجاح واعتماد المعالجة
 * POST /admin/tickets/{{ticket_id}}/close
 */
export async function closeTicket(ticketId: string | number) {
  return apiRequest<ApiEnvelope<unknown> | unknown>(
    `/admin/tickets/${ticketId}/close`,
    {
      method: "POST",
    }
  );
}
