export interface GatewayMetaItem {
  label: string;
  value: string;
  isSuccess?: boolean;
  isWarning?: boolean;
  isRecurring?: boolean;
  hasDot?: boolean;
}

export interface PaymentGatewayItem {
  id: string;
  code: string;
  name: string;
  providerSubtitle: string;
  badgeLabel: string;
  badgeBg: string;
  badgeText: string;
  brandType: "bank" | "paypal" | "stripe" | "paddle" | "razorpay" | "custom";
  isEnabled: boolean;
  statusText: string;
  statusSubText?: string;
  description: string;
  metaItems: GatewayMetaItem[];
  clientId: string;
  clientSecret: string;
  developerAppLabel: string;
  providerLegalName: string;
  activeSubscriptionsCount: number;
  baseCurrency: string;
  isOffline?: boolean;
}

export type GatewayFilterStatus = "all" | "active" | "disabled";
