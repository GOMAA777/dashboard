export type InvoiceStatus = "paid" | "pending" | "overdue" | "refunded";

export type PaymentMethodType =
  | "mada"
  | "visa"
  | "mastercard"
  | "apple_pay"
  | "bank_transfer"
  | "stripe";

export interface InvoiceLineItem {
  id: string;
  description: string;
  descriptionEn: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string; // e.g. "INV-2026-0891"
  qrCodeValue?: string;
  orderNumber: string; // "01", "02"
  lawFirmId: string;
  lawFirmName: string;
  lawFirmNameEn: string;
  clientContact: string;
  clientEmail: string;
  clientPhone: string;
  taxNumber: string; // VAT ID (15 digits)
  commercialReg: string; // CR Number
  city: string;
  planName: string;
  planNameEn: string;
  planBadgeColor?: string;
  billingPeriod: "monthly" | "quarterly" | "annual";
  issueDate: string; // "2026-10-15"
  dueDate: string; // "2026-10-30"
  paidAt?: string;
  subtotal: number;
  taxRate: number; // 15%
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: "SAR" | "USD";
  status: InvoiceStatus;
  paymentMethod: PaymentMethodType;
  transactionReference: string;
  zatcaComplianceStatus: "compliant" | "cleared" | "reported";
  items: InvoiceLineItem[];
  notes?: string;
}

export interface InvoiceKpiMetrics {
  totalRevenueSar: number;
  totalRevenueUsd: number;
  totalInvoicesCount: number;
  paidCount: number;
  paidPercentage: number;
  pendingCount: number;
  pendingAmountSar: number;
  overdueCount: number;
  overdueAmountSar: number;
  refundedCount: number;
}

export type InvoiceFilterTab = "all" | "paid" | "pending" | "overdue" | "refunded";

