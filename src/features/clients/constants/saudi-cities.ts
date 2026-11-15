/**
 * Saudi Arabia Cities & Governorates (قائمة محافظات ومدن المملكة العربية السعودية)
 * Alphabetically sorted in Arabic
 */
const RAW_SAUDI_CITIES: string[] = [
  "أبها",
  "أبو عريش",
  "أحد المسارحة",
  "أحد رفيدة",
  "الأحساء",
  "الأفلاج",
  "الباحة",
  "البدائع",
  "البكيرية",
  "بيشة",
  "تبوك",
  "تثليث",
  "تربة",
  "تيماء",
  "ثادق",
  "جازان",
  "جدة",
  "حائل",
  "حفر الباطن",
  "حوطة بني تميم",
  "الخرج",
  "الخرمة",
  "الخفجي",
  "الخبر",
  "خميس مشيط",
  "الدرعية",
  "الدلم",
  "الدمام",
  "دوامة الجندل",
  "دومة الجندل",
  "رابغ",
  "رأس تنورة",
  "رفحاء",
  "الرياض",
  "الزلفي",
  "سراة عبيدة",
  "سكاكا",
  "شرورة",
  "شقراء",
  "صامطة",
  "صبيا",
  "طبرجل",
  "طريف",
  "الطائف",
  "الظهران",
  "الغاط",
  "القريات",
  "القطيف",
  "القنفذة",
  "القويعية",
  "المجمعة",
  "محايل عسير",
  "المدينة المنورة",
  "المذنب",
  "مكة المكرمة",
  "النماص",
  "نجران",
  "الهفوف",
  "وادي الدواسر",
  "ينبع",
];

// Remove duplicates and sort using Arabic collation
export const SAUDI_CITIES: string[] = Array.from(new Set(RAW_SAUDI_CITIES)).sort(
  (a, b) => a.localeCompare(b, "ar")
);

export const SAUDI_CITIES_EN: Record<string, string> = {
  "أبها": "Abha",
  "أبو عريش": "Abu Arish",
  "أحد المسارحة": "Ahad Al-Masarihah",
  "أحد رفيدة": "Ahad Rafidah",
  "الأحساء": "Al-Ahsa",
  "الأفلاج": "Al-Aflaj",
  "الباحة": "Al-Baha",
  "البدائع": "Al-Badayea",
  "البكيرية": "Al-Bukayriyah",
  "بيشة": "Bisha",
  "تبوك": "Tabuk",
  "تثليث": "Tathleeth",
  "تربة": "Turbah",
  "تيماء": "Tayma",
  "ثادق": "Thadiq",
  "جازان": "Jazan",
  "جدة": "Jeddah",
  "حائل": "Hail",
  "حفر الباطن": "Hafar Al-Batin",
  "حوطة بني تميم": "Hotat Bani Tamim",
  "الخرج": "Al-Kharj",
  "الخرمة": "Al-Khurmah",
  "الخفجي": "Khafji",
  "الخبر": "Khobar",
  "خميس مشيط": "Khamis Mushait",
  "الدرعية": "Diriyah",
  "الدلم": "Al-Dilam",
  "الدمام": "Dammam",
  "دوامة الجندل": "Dumat Al-Jandal",
  "دومة الجندل": "Dumat Al-Jandal",
  "رابغ": "Rabigh",
  "رأس تنورة": "Ras Tanura",
  "رفحاء": "Rafha",
  "الرياض": "Riyadh",
  "الزلفي": "Al-Zulfi",
  "سراة عبيدة": "Sarat Abidah",
  "سكاكا": "Sakaka",
  "شرورة": "Sharurah",
  "شقراء": "Shaqra",
  "صامطة": "Samtah",
  "صبيا": "Sabya",
  "طبرجل": "Tubarjal",
  "طريف": "Turaif",
  "الطائف": "Taif",
  "الظهران": "Dhahran",
  "الغاط": "Al-Ghat",
  "القريات": "Al-Qurayyat",
  "القطيف": "Qatif",
  "القنفذة": "Al-Qunfudhah",
  "القويعية": "Al-Quway'iyah",
  "المجمعة": "Al-Majma'ah",
  "محايل عسير": "Muhayil Asir",
  "المدينة المنورة": "Madinah",
  "المذنب": "Al-Midhnab",
  "مكة المكرمة": "Makkah",
  "النماص": "Al-Namas",
  "نجران": "Najran",
  "الهفوف": "Hofuf",
  "وادي الدواسر": "Wadi Al-Dawasir",
  "ينبع": "Yanbu",
};

export function getLocalizedCityName(city: string, isEn: boolean): string {
  if (!city) return "";
  const cleaned = city.replace("المملكة العربية السعودية - ", "").trim();
  if (!isEn) return cleaned;
  return SAUDI_CITIES_EN[cleaned] || cleaned;
}

/**
 * Normalizes Eastern Arabic (٠-٩) and Persian (۰-۹) numerals to standard Western digits (0-9)
 */
export function normalizeArabicDigits(value: string): string {
  if (!value) return "";
  const eastern = "٠١٢٣٤٥٦٧٨٩";
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  return value
    .replace(/[٠-٩]/g, (d) => String(eastern.indexOf(d)))
    .replace(/[۰-۹]/g, (d) => String(persian.indexOf(d)));
}

/**
 * Known common typos in email domains and their correct suggestions
 */
export const COMMON_DOMAIN_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gmeil.com": "gmail.com",
  "gnail.com": "gmail.com",
  "hotmial.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "hotmil.com": "hotmail.com",
  "hormail.com": "hotmail.com",
  "hotmaill.com": "hotmail.com",
  "yahooo.com": "yahoo.com",
  "yaho.com": "yahoo.com",
  "yaho.co": "yahoo.com",
  "yahoou.com": "yahoo.com",
  "outlok.com": "outlook.com",
  "outloo.com": "outlook.com",
  "otlook.com": "outlook.com",
  "outllok.com": "outlook.com",
  "iclud.com": "icloud.com",
  "icld.com": "icloud.com",
  "iclaud.com": "icloud.com",
};

/**
 * Checks an email and returns the suggested corrected email if a typo domain is detected
 */
export function getEmailDomainSuggestion(email: string): string | null {
  if (!email || !email.includes("@")) return null;
  const parts = email.trim().split("@");
  if (parts.length !== 2) return null;
  const [local, domain] = parts;
  const lowerDomain = domain.toLowerCase();
  const correction = COMMON_DOMAIN_TYPOS[lowerDomain];
  if (correction && correction !== lowerDomain) {
    return `${local}@${correction}`;
  }
  return null;
}
