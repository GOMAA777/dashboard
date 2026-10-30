import { CurrencyItem } from "../types/currency-settings.types";

export const initialCurrencies: CurrencyItem[] = [
  {
    id: "cur-1",
    orderNumber: "01",
    name: "الريال السعودي",
    code: "SAR",
    symbol: "ر.س",
    exchangeRate: "3.7500 SAR / 1 USD",
    status: "active",
  },
  {
    id: "cur-2",
    orderNumber: "02",
    name: "الدولار الأمريكي",
    code: "USD",
    symbol: "$",
    exchangeRate: "1.0000 USD (عملة الأساس)",
    isBaseCurrency: true,
    status: "active",
  },
  {
    id: "cur-3",
    orderNumber: "03",
    name: "الدرهم الإماراتي",
    code: "AED",
    symbol: "د.إ",
    exchangeRate: "3.6725 AED / 1 USD",
    status: "active",
  },
  {
    id: "cur-4",
    orderNumber: "04",
    name: "الدينار الكويتي",
    code: "KWD",
    symbol: "د.ك",
    exchangeRate: "0.3075 KWD / 1 USD",
    status: "inactive",
  },
];
