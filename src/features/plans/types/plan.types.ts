export type PlanBillingCycle = "monthly" | "annual" | "custom";
export type PlanStatusFilter = "all" | "active" | "inactive" | "custom";

export interface PlanLimitsData {
  lawyers: string;
  cases: string;
  agents: string;
  clients: string;
  storage: string;
  support: string;
  assistants?: string;
  documents?: string;
  integration?: string;
}

export interface PlanFeatureItem {
  id: string;
  title: string;
  description?: string;
  isIncluded: boolean;
  tag?: string;
}

export interface PricingPlanItem {
  id: string;
  name: string;
  slug?: string;
  code: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  type?: string;
  monthlyPrice: number;
  annualPrice?: number;
  yearlyDiscountPercent?: number;
  annualNote?: string;
  subscribedFirmsCount: number;
  sharePercentage: string;
  isActive: boolean;
  isPopular?: boolean;
  isEnterprise?: boolean;
  colorTheme?: string;
  limits: PlanLimitsData;
  features?: PlanFeatureItem[];
  rawFeatures?: string[];
}

export interface SubscribedFirm {
  id: string;
  initial: string;
  name: string;
  licenseNumber: string;
  city: string;
  owner: string;
  ownerRole: string;
  subscriptionDate: string;
  renewalDate: string;
  billingCycle: string;
  status: "active" | "auto_renew" | "suspended";
}

export interface DetailedSubscribedFirm {
  id: string;
  initial: string;
  name: string;
  licenseNumber: string;
  city: string;
  owner: string;
  contact: string; // phone or email
  logo?: string;
  taxNumber?: string;
  subscriptionCode?: string;
  amount?: string;
  paymentMethod?: string;
  lawyersUsed: number;
  lawyersLimit: number;
  casesUsed: number;
  casesLimit: number;
  casesCritical?: boolean;
  agentsUsed: number;
  agentsLimit: number;
  renewalDate: string;
  renewalCycle: "سنوي" | "شهري" | "تجريبي";
  remainingDaysText: string;
  isOverdue?: boolean;
  status: "active" | "expiring_soon" | "trial" | "pending_payment" | "suspended";
}

export type PlanViewMode = "list" | "create" | "edit" | "silver-details" | "subscribed-firms" | "firm-details";
