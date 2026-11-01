import { InvoiceItem, InvoiceKpiMetrics } from "../types/invoices.types";

export const initialInvoicesList: InvoiceItem[] = [];

export const initialInvoicesKpis: InvoiceKpiMetrics = {
  totalRevenueSar: 0,
  totalRevenueUsd: 0,
  totalInvoicesCount: 0,
  paidCount: 0,
  paidPercentage: 0,
  pendingCount: 0,
  pendingAmountSar: 0,
  overdueCount: 0,
  overdueAmountSar: 0,
  refundedCount: 0,
};
