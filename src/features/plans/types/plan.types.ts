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

export type PlanViewMode = "list" | "create" | "silver-details";
