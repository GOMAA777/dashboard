export interface CurrencyItem {
  id: string;
  orderNumber: string; // "01", "02", ...
  name: string; // الريال السعودي, الدولار الأمريكي
  code: string; // SAR, USD, AED, KWD
  symbol: string; // ر.س, $, د.إ, د.ك
  exchangeRate: string; // "3.7500 SAR / 1 USD", "1.0000 USD (عملة الأساس)"
  isBaseCurrency?: boolean;
  status: "active" | "inactive";
}
