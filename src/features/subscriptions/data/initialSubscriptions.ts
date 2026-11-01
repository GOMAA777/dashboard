import { SubscriptionRecord, SubscriptionStatus } from "../types/subscription.types";

export const initialSubscriptionsList: SubscriptionRecord[] = [];

const createEmptySubscription = (status: SubscriptionStatus, statusLabel: string): SubscriptionRecord => ({
  id: "",
  firm: {
    id: "",
    name: "",
    licenseNumber: "",
    city: "",
    address: "",
    directorName: "",
    email: "",
    phone: "",
  },
  planName: "",
  planPrice: "",
  billingCycle: "سنوية",
  startDate: "",
  renewalDate: "",
  remainingDaysText: "",
  daysUrgency: "normal",
  status,
  statusLabel,
  paymentMethod: {
    type: "mada",
    badgeLabel: "",
    cardNumber: "",
    statusText: "",
    isAutoPaid: false,
  },
  taxNumber: "",
  zatcaCompliant: false,
  invoices: [],
  timeline: [],
  documents: [],
});

export const mockActiveSubscriptionDetails: SubscriptionRecord = createEmptySubscription("active", "نشط");
export const mockCancelledSubscriptionDetails: SubscriptionRecord = createEmptySubscription("cancelled", "ملغي");
export const mockRejectedSubscriptionDetails: SubscriptionRecord = createEmptySubscription("rejected", "مرفوض");
export const mockWaitingSubscriptionDetails: SubscriptionRecord = createEmptySubscription("pending", "قيد الانتظار");
