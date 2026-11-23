"use client";

import { apiRequest } from "./http";
import { API_COMPANY_ID } from "./config";
import { fetchFirms } from "./firms";
import { unwrapList } from "./helpers";

export interface PaymentGatewaysStats {
  total_gateways?: number;
  active_gateways?: number;
  security_standard?: string;
  zatca_phase?: string;
}

export interface PaymentGatewaysResponse {
  status: boolean;
  message?: string;
  stats?: PaymentGatewaysStats;
  data: Array<Record<string, unknown>>;
}

export interface PaymentGatewayDetailResponse {
  status: boolean;
  message?: string;
  data?: Record<string, unknown>;
}

export interface UpdatePaymentGatewayPayload {
  mode?: "live" | "test" | string;
  is_recurring_supported?: boolean;
  supported_currencies?: string[];
  config?: Record<string, unknown>;
  client_id?: string;
  client_secret?: string;
  public_key?: string;
  secret_key?: string;
  [key: string]: unknown;
}

export interface PaymentGatewayMutationResponse {
  status: boolean;
  message: string;
  data?: unknown;
}

export interface FetchInvoicesParams {
  company_id?: string | number;
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
}

export interface InvoicesListResponse {
  status: boolean;
  message?: string;
  data:
    | Array<Record<string, unknown>>
    | {
        current_page?: number;
        data: Array<Record<string, unknown>>;
        total?: number;
        last_page?: number;
        per_page?: number;
      };
}

export interface InvoiceDetailResponse {
  status: boolean;
  message?: string;
  data: Record<string, unknown>;
}

/** 01. استعراض بوابات الدفع ومعايير التشفير والزكاة GET /admin/payment-gateways */
export async function fetchPaymentGateways(): Promise<PaymentGatewaysResponse> {
  return apiRequest<PaymentGatewaysResponse>("/admin/payment-gateways", {
    method: "GET",
  });
}

/** 02. تفاصيل إعدادات بوابة محددة (مثل Stripe) GET /admin/payment-gateways/{gateway} */
export async function fetchPaymentGateway(
  gatewayId: string
): Promise<PaymentGatewayDetailResponse> {
  return apiRequest<PaymentGatewayDetailResponse>(
    `/admin/payment-gateways/${gatewayId}`,
    { method: "GET" }
  );
}

/** 03. تعديل مفاتيح وإعدادات بوابة الدفع PUT /admin/payment-gateways/{gateway} */
export async function updatePaymentGateway(
  gatewayId: string,
  body: UpdatePaymentGatewayPayload
): Promise<PaymentGatewayMutationResponse> {
  return apiRequest<PaymentGatewayMutationResponse>(
    `/admin/payment-gateways/${gatewayId}`,
    {
      method: "PUT",
      body,
    }
  );
}

/** 04. تعطيل / تفعيل بوابة دفع PATCH /admin/payment-gateways/{gateway}/status */
export async function updatePaymentGatewayStatus(
  gatewayId: string,
  status: "active" | "inactive" | "disabled" | string
): Promise<PaymentGatewayMutationResponse> {
  return apiRequest<PaymentGatewayMutationResponse>(
    `/admin/payment-gateways/${gatewayId}/status`,
    {
      method: "PATCH",
      body: { status },
    }
  );
}

/** 05. فحص حالة الاتصال ببوابة الدفع (Ping Test) POST /admin/payment-gateways/{gateway}/test */
export async function testPaymentGateway(
  gatewayId: string
): Promise<PaymentGatewayMutationResponse> {
  return apiRequest<PaymentGatewayMutationResponse>(
    `/admin/payment-gateways/${gatewayId}/test`,
    {
      method: "POST",
    }
  );
}

/** 06. قائمة فواتير الاشتراكات المركزية للمنصة GET /admin/invoices */
export async function fetchInvoices(
  params?: FetchInvoicesParams
): Promise<InvoicesListResponse> {
  const companyId = params?.company_id ?? API_COMPANY_ID;
  return apiRequest<InvoicesListResponse>("/admin/invoices", {
    method: "GET",
    query: {
      company_id: companyId,
      page: params?.page,
      per_page: params?.per_page,
      search: params?.search,
      status: params?.status,
    },
  });
}

function readLastPage(payload: unknown): number {
  if (!payload || typeof payload !== "object") return 1;
  const data = (payload as Record<string, unknown>).data;
  if (!data || typeof data !== "object" || Array.isArray(data)) return 1;
  const last = Number((data as Record<string, unknown>).last_page);
  return Number.isFinite(last) && last > 0 ? last : 1;
}

/**
 * سجل الفواتير المركزي: الـ API يلزم company_id لكل مكتب.
 * نجمع فواتير كل المكاتب لأن معرّف الشركة الافتراضي ليس مكتباً صالحاً.
 */
export async function fetchAllFirmInvoices(): Promise<InvoicesListResponse> {
  const companyIds: string[] = [];
  let page = 1;
  let lastPage = 1;

  do {
    const firms = await fetchFirms({ status: "all", page, per_page: 100 });
    for (const firm of firms.items) {
      if (firm.id !== undefined && firm.id !== null && String(firm.id) !== "") {
        companyIds.push(String(firm.id));
      }
    }
    lastPage = readLastPage(firms.raw);
    page += 1;
  } while (page <= lastPage);

  const uniqueIds = [...new Set(companyIds)];
  const lists = await Promise.all(
    uniqueIds.map(async (id) => {
      try {
        return await fetchInvoices({ company_id: id });
      } catch {
        return null;
      }
    })
  );

  const data = lists.flatMap((payload) =>
    payload ? unwrapList<Record<string, unknown>>(payload) : []
  );

  return { status: true, data };
}

/** 07. تفاصيل الفاتورة الإلكترونية ومطابقة ZATCA QR GET /admin/invoices/{id} */
export async function fetchInvoiceById(
  invoiceId: string | number,
  companyId?: string | number
): Promise<InvoiceDetailResponse> {
  return apiRequest<InvoiceDetailResponse>(`/admin/invoices/${invoiceId}`, {
    method: "GET",
    query: {
      company_id: companyId ?? API_COMPANY_ID,
    },
  });
}
