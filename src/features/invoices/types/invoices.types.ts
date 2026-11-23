export type InvoiceStatus = "paid" | "partial" | "pending" | "overdue" | "refunded";

export type PaymentMethodType =
  | "mada"
  | "visa"
  | "mastercard"
  | "apple_pay"
  | "bank_transfer"
  | "stripe"
  | "credit_card"
  | "check"
  | "cash"
  | "other";

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
  invoiceNumber: string;
  qrCodeValue?: string;
  orderNumber: string;
  lawFirmId: string;
  lawFirmName: string;
  lawFirmNameEn: string;
  clientContact: string;
  clientEmail: string;
  clientPhone: string;
  taxNumber: string;
  commercialReg: string;
  city: string;
  planName: string;
  planNameEn: string;
  planBadgeColor?: string;
  billingPeriod: "monthly" | "quarterly" | "annual" | "unspecified";
  description: string;
  issueDate: string;
  dueDate: string;
  paidAt?: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  hasTaxBreakdown: boolean;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  currency: "SAR" | "USD";
  status: InvoiceStatus;
  paymentMethod: PaymentMethodType;
  paymentMethodLabel: string;
  transactionReference: string;
  zatcaComplianceStatus?: "compliant" | "cleared" | "reported";
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
  partialCount: number;
}

export type InvoiceFilterTab = "all" | "paid" | "partial" | "pending" | "overdue" | "refunded";
