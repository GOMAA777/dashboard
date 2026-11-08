export type AccountStatusType = "active" | "suspended" | "inactive" | "trial";
export type SubscriptionStatusType = "active" | "expiring" | "trial" | "overdue" | "expired";

export interface OfficeResourceUsage {
  lawyersUsed: number;
  lawyersLimit: number;
  lawyersPercent: number;
  storageUsedGb: string;
  storageLimitGb: number;
  storagePercent: number;
  activeCases: number;
}

export interface OfficeInternalNote {
  id: number;
  authorName: string;
  authorRole: string;
  note: string;
  createdAt: string;
}

export interface PlanDetails {
  id?: number;
  name: string;
  badge?: string;
  badgeColor?: string;
  type?: string;
  monthlyPrice?: string;
  yearlyPrice?: string;
  yearlyDiscountPercent?: number;
  maxLawyers?: number;
  maxCases?: number;
  maxPowerOfAttorney?: number;
  maxClients?: number;
  maxAssistants?: number;
  storageLimitGb?: number;
  supportLevel?: string;
  features?: string[];
}

export interface ActiveSubscriptionDetails {
  id?: number;
  subscriptionCode?: string;
  companyId?: number;
  planId?: number;
  billingCycle?: string;
  amount?: string;
  paymentMethod?: string;
  autoRenew?: boolean;
  startDate?: string;
  renewalDate?: string;
  status?: string;
  notes?: string | null;
}

export interface ClientOffice {
  id: string;
  companyId?: string | number;
  officeId?: string;
  slug?: string;
  initial: string;
  initialBg: string;
  initialText: string;
  themeColor?: string;
  color?: string;
  primaryColor?: string;
  secondaryColor?: string;
  name: string;
  licenseNumber: string;
  city: string;
  country?: string;
  owner: string;
  email: string;
  phone: string;
  landline?: string;
  address?: string;
  taxNumber?: string;
  logo?: string;
  password?: string;
  initialPassword?: string;
  plan: string;
  planId?: number;
  planType?: string;
  subscriptionPlan?: string;
  planDetails?: PlanDetails;
  activeSubscriptionDetails?: ActiveSubscriptionDetails;
  planBadgeClass: string;
  registrationDate: string;
  billingCycle?: string;
  subscriptionStart?: string;
  subscriptionEnd?: string;
  autoRenew?: boolean;
  resourceUsage?: OfficeResourceUsage;
  internalNotes?: OfficeInternalNote[];
  recentInvoices?: unknown[];
  recentTickets?: unknown[];
  accountStatus: {
    label: string;
    type: AccountStatusType;
    bgClass: string;
    textClass: string;
    dotClass: string;
  };
  subscriptionStatus: {
    label: string;
    type: SubscriptionStatusType;
    note?: string;
    bgClass: string;
    textClass: string;
    dotClass?: string;
  };
}

export type TabFilter = "all" | "active" | "trial" | "suspended";
