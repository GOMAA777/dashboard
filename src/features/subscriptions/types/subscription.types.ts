export type SubscriptionStatus = "active" | "pending" | "expired" | "cancelled" | "rejected";

export type SubscriptionPlanType = "custom" | "gold" | "silver" | "basic";

export type PaymentMethodType = "mada" | "visa" | "sadad" | "transfer" | "settlement";

export interface LawFirmOffice {
  id: string;
  name: string;
  licenseNumber: string;
  city: string;
  address: string;
  directorName: string;
  email: string;
  phone: string;
}

export interface InvoiceTransaction {
  id: string;
  date: string;
  amount: string;
  vatNote?: string;
  paymentMethod: string;
  paymentMethodDetail: string;
  status: "success" | "failed" | "cancelled" | "authorized";
  statusLabel: string;
  subDescription: string;
}

export interface ActivityTimelineEvent {
  id: string;
  title: string;
  description: string;
  actor: string;
  date: string;
  type: "renewal" | "upgrade" | "payment_update" | "cancellation" | "dispatch" | "bank_auth" | "submitted";
  upgradeFrom?: string;
  upgradeTo?: string;
}

export interface DocumentVerificationItem {
  id: string;
  title: string;
  subtitle: string;
  status: "verified" | "pending" | "rejected";
}

export interface SubscriptionLimitMetric {
  title: string;
  used: number;
  total: number;
  unit: string;
  percentage: number;
  remainingText: string;
  statusBadge?: string;
  isLocked?: boolean;
}

export interface SubscriptionRecord {
  id: string; // e.g. "SUB-2024-8901"
  firm: LawFirmOffice;
  planName: string;
  planPrice: string;
  billingCycle: "سنوية" | "شهرية";
  startDate: string;
  renewalDate: string;
  remainingDaysText: string;
  daysUrgency: "normal" | "urgent" | "expired" | "cancelled";
  status: SubscriptionStatus;
  statusLabel: string;
  paymentMethod: {
    type: PaymentMethodType;
    badgeLabel: string;
    cardNumber?: string;
    statusText: string;
    isAutoPaid: boolean;
  };
  // Detailed metadata for view modes
  taxNumber?: string;
  zatcaCompliant?: boolean;
  cancellationDate?: string;
  cancellationReason?: string;
  rejectionDate?: string;
  rejectionReason?: string;
  submissionDate?: string;
  decisionDate?: string;
  pendingReason?: string;
  assignedSupervisor?: string;
  documents?: DocumentVerificationItem[];
  metrics?: {
    team: SubscriptionLimitMetric;
    cases: SubscriptionLimitMetric;
    clients: SubscriptionLimitMetric;
    agents: SubscriptionLimitMetric;
    storage: SubscriptionLimitMetric;
    addonsCount: number;
    addons: Array<{
      title: string;
      value: string;
      isAvailable: boolean;
      statusColor?: string;
    }>;
  };
  invoices?: InvoiceTransaction[];
  timeline?: ActivityTimelineEvent[];
}

export type SubscriptionTabFilter = "all" | "active" | "pending" | "cancelled_expired";
