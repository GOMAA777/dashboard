export interface PlanLimitsData {
  lawyers: string;
  cases: string;
  agents: string;
  clients: string;
  storage: string;
  support: string;
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
  code: string;
  description: string;
  monthlyPrice: number;
  annualPrice?: number;
  annualNote?: string;
  subscribedFirmsCount: number;
  sharePercentage: string;
  isActive: boolean;
  isPopular?: boolean;
  isEnterprise?: boolean;
  colorTheme?: string;
  limits: PlanLimitsData;
  features?: PlanFeatureItem[];
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

export type PlanViewMode = "list" | "create" | "silver-details" | "subscribed-firms";
