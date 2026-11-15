export interface ServerDirectiveItem {
  id: string;
  orderNumber: number;
  directiveName: string;
  title: string;
  currentValue: string;
  recommendedValue: string;
  recommendedNote?: string;
  status: "compatible" | "needs_review";
}
