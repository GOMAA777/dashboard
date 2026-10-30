export interface LanguageItem {
  id: string;
  orderNumber: string; // "01", "02", ...
  name: string; // العربية, English, Français
  nativeName?: string; // (الإنجليزية), (الفرنسية)
  code: string; // ar, en, fr
  direction: "rtl" | "ltr";
  isDefault: boolean;
  status: "active" | "inactive";
  standardBadge?: string; // "ISO 639-1"
  systemClassification?: string; // "الافتراضية للنظام"
  nationalBenchmark?: boolean; // "معيار الإسناد الوطني"
}
