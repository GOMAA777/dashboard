import { LanguageItem } from "../types/language-settings.types";

export const initialLanguages: LanguageItem[] = [
  {
    id: "lang-1",
    orderNumber: "01",
    name: "العربية",
    nativeName: "",
    code: "ar",
    direction: "rtl",
    isDefault: true,
    status: "active",
    standardBadge: "ISO 639-1",
    systemClassification: "الافتراضية للنظام",
    nationalBenchmark: true,
  },
  {
    id: "lang-2",
    orderNumber: "02",
    name: "English",
    nativeName: "(الإنجليزية)",
    code: "en",
    direction: "ltr",
    isDefault: false,
    status: "active",
    standardBadge: "ISO 639-1",
  },
  {
    id: "lang-3",
    orderNumber: "03",
    name: "Français",
    nativeName: "(الفرنسية)",
    code: "fr",
    direction: "ltr",
    isDefault: false,
    status: "inactive",
    standardBadge: "ISO 639-1",
  },
];
