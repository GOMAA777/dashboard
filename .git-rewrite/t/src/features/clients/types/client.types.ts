export type AccountStatusType = "active" | "suspended" | "trial";
export type SubscriptionStatusType = "active" | "expiring" | "trial" | "overdue" | "expired";

export interface ClientOffice {
  id: string;
  initial: string;
  initialBg: string;
  initialText: string;
  name: string;
  licenseNumber: string;
  city: string;
  owner: string;
  email: string;
  phone: string;
  plan: string;
  planBadgeClass: string;
  registrationDate: string;
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
