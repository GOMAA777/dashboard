import { PricingPlanItem, SubscribedFirm, DetailedSubscribedFirm } from "../types/plan.types";

export const initialPricingPlans: PricingPlanItem[] = [];

export const silverSubscribedFirms: SubscribedFirm[] = [];

export const detailedSilverSubscribedFirms: DetailedSubscribedFirm[] = [];

export function getSubscribedFirmsForPlan(_plan?: PricingPlanItem | null): DetailedSubscribedFirm[] {
  return [];
}
