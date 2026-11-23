export interface OfficeColorSwatch {
  hex: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
}

export const OFFICE_COLOR_PALETTE: OfficeColorSwatch[] = [
  {
    hex: "#203b3c",
    nameAr: "بترولي كحلي (معتمد)",
    nameEn: "Deep Petrol",
    descriptionAr: "اللون البترولي الكحلي الرسمي للمكاتب القانونية",
  },
  {
    hex: "#d5a058",
    nameAr: "ذهبي وقور (معتمد)",
    nameEn: "Royal Gold",
    descriptionAr: "اللون الذهبي الرسمي المعتمد للهوية القانونية والميزان",
  },
  {
    hex: "#162829",
    nameAr: "بترولي داكن ملكي",
    nameEn: "Dark Slate Petrol",
    descriptionAr: "درجة بترولية عميقة موقرة ومهيبة",
  },
  {
    hex: "#2e5354",
    nameAr: "بترولي هادئ",
    nameEn: "Classic Petrol Slate",
    descriptionAr: "درجة بترولية متزنة وواضحة للشاشات والأنظمة",
  },
  {
    hex: "#c38d45",
    nameAr: "ذهبي برونزي دافئ",
    nameEn: "Warm Bronze Gold",
    descriptionAr: "درجة ذهبية غنية ومريحة للعين",
  },
  {
    hex: "#f7f1e6",
    nameAr: "بيج لؤلؤي فاخر",
    nameEn: "Warm Pearl Linen",
    descriptionAr: "خلفية فاتحة راقية مطابقة لهوية الأوراق الرسمية",
  },
  {
    hex: "#112a20",
    nameAr: "زمردي ملكي داكن",
    nameEn: "Royal Emerald",
    descriptionAr: "خضرة ملكية داكنة توحي بالعدل والوقار",
  },
  {
    hex: "#36121c",
    nameAr: "عنابي بورغندي عميق",
    nameEn: "Royal Burgundy",
    descriptionAr: "فخامة كلاسيكية عريقة للمكاتب الكبرى",
  },
  {
    hex: "#0f1d38",
    nameAr: "كحلي أندلسي ملكي",
    nameEn: "Andalusian Navy",
    descriptionAr: "كحلي ملكي أندلسي رصين وعالي التباين",
  },
  {
    hex: "#2c1b18",
    nameAr: "ماهوجني كلاسيكي دافئ",
    nameEn: "Classic Mahogany",
    descriptionAr: "دفء المكاتب القانونية الخشبية العريقة",
  },
  {
    hex: "#1e242d",
    nameAr: "تيتانيوم عصري",
    nameEn: "Modern Titanium",
    descriptionAr: "رمادي تيتانيوم رصين ومواكب للحداثة",
  },
  {
    hex: "#f3efe6",
    nameAr: "عاجي رسمي فاخر",
    nameEn: "Legal Parchment",
    descriptionAr: "عاجي ورقي هادئ ومريح للمطالعة والعمل الطويل",
  },
  {
    hex: "#24142f",
    nameAr: "بنفسجي إمبراطوري",
    nameEn: "Imperial Violet",
    descriptionAr: "درجة أرجوانية ملكية مهيبة واستثنائية",
  },
  {
    hex: "#142820",
    nameAr: "صنوبري داكن",
    nameEn: "Deep Forest Pine",
    descriptionAr: "خضرة غابية داكنة موقرة للمنشآت القانونية",
  },
  {
    hex: "#251813",
    nameAr: "إسبريسو ملكي",
    nameEn: "Royal Espresso",
    descriptionAr: "بني قهوة داكن فاخر ذو طابع كلاسيكي عريق",
  },
  {
    hex: "#1a212d",
    nameAr: "أردوازي حديدي",
    nameEn: "Slate Steel",
    descriptionAr: "رمادي معدني فخم بلمسة زرقاء داكنة",
  },
];

export const DEFAULT_OFFICE_THEME_COLOR = "#9c6402";
export const DEFAULT_OFFICE_FONT_COLOR = "#ffffff";

export function getOfficeColorName(hex?: string, isEn = false): string {
  if (!hex) return isEn ? "Deep Petrol" : "بترولي كحلي (معتمد)";
  const clean = hex.toLowerCase().trim();
  if (clean === "#9c6402" || clean === "#d5a058") return isEn ? "Royal Gold" : "ذهبي وقور (معتمد)";
  if (clean === "#203b3c") return isEn ? "Deep Petrol" : "بترولي كحلي (معتمد)";
  const match = OFFICE_COLOR_PALETTE.find((s) => s.hex.toLowerCase() === clean);
  if (match) return isEn ? match.nameEn : match.nameAr;
  return clean.startsWith("#") ? clean.toUpperCase() : `#${clean.toUpperCase()}`;
}

export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color.trim());
}

export function isLightColor(hex: string): boolean {
  try {
    const clean = hex.replace("#", "");
    const fullHex =
      clean.length === 3
        ? clean
            .split("")
            .map((c) => c + c)
            .join("")
        : clean;
    if (fullHex.length !== 6) return false;
    const r = parseInt(fullHex.substring(0, 2), 16);
    const g = parseInt(fullHex.substring(2, 4), 16);
    const b = parseInt(fullHex.substring(4, 6), 16);
    // YIQ formula
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 165;
  } catch {
    return false;
  }
}

/**
 * Calculate standard relative luminance according to W3C WCAG 2.1 specs
 */
export function getRelativeLuminance(hex: string): number {
  try {
    const clean = hex.replace("#", "").trim();
    const fullHex =
      clean.length === 3
        ? clean
            .split("")
            .map((c) => c + c)
            .join("")
        : clean;
    if (fullHex.length !== 6) return 0.5;
    const r = parseInt(fullHex.substring(0, 2), 16) / 255;
    const g = parseInt(fullHex.substring(2, 4), 16) / 255;
    const b = parseInt(fullHex.substring(4, 6), 16) / 255;
    const sRGB = [r, g, b].map((val) =>
      val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  } catch {
    return 0.5;
  }
}

export interface HarmonyCheckResult {
  ratio: number;
  ratioString: string;
  isAccessible: boolean; // >= 4.5
  isLargeTextOnly: boolean; // 3.0 <= ratio < 4.5
  isPoor: boolean; // < 3.0
  labelAr: string;
  labelEn: string;
  suggestedTextColor: string;
}

/**
 * Evaluates WCAG 2.1 contrast ratio and harmony between background color and font color.
 */
export function evaluateColorHarmony(bgHex: string, textHex: string): HarmonyCheckResult {
  const L1 = getRelativeLuminance(bgHex);
  const L2 = getRelativeLuminance(textHex);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  const ratio = (lighter + 0.05) / (darker + 0.05);

  const suggestedTextColor = L1 > 0.45 ? "#1b1c1a" : "#ffffff";
  const isAccessible = ratio >= 4.5;
  const isLargeTextOnly = ratio >= 3.0 && ratio < 4.5;
  const isPoor = ratio < 3.0;

  let labelAr = "";
  let labelEn = "";
  if (isAccessible) {
    labelAr = `تناسق وتباين ممتاز (${ratio.toFixed(1)}:1 مطابق لمعايير WCAG AA)`;
    labelEn = `Excellent contrast (${ratio.toFixed(1)}:1 WCAG AA Compliant)`;
  } else if (isLargeTextOnly) {
    labelAr = `تباين متوسط (${ratio.toFixed(1)}:1 صالح للعناوين فقط)`;
    labelEn = `Moderate contrast (${ratio.toFixed(1)}:1 Large text only)`;
  } else {
    labelAr = `تباين ضعيف وغير مقروء (${ratio.toFixed(1)}:1) ينصح بتعديل لون الخط`;
    labelEn = `Poor contrast (${ratio.toFixed(1)}:1) - adjust font color`;
  }

  return {
    ratio,
    ratioString: `${ratio.toFixed(1)}:1`,
    isAccessible,
    isLargeTextOnly,
    isPoor,
    labelAr,
    labelEn,
    suggestedTextColor,
  };
}

export interface ContrastInfo {
  textColor: string;
  isLightBg: boolean;
  contrastRatio: string;
  isAccessible: boolean;
  labelAr: string;
  labelEn: string;
}

export function getContrastInfo(hexColor: string): ContrastInfo {
  const harmony = evaluateColorHarmony(hexColor, isLightColor(hexColor) ? "#18181b" : "#ffffff");
  const isLightBg = isLightColor(hexColor);
  return {
    textColor: harmony.suggestedTextColor,
    isLightBg,
    contrastRatio: harmony.ratioString,
    isAccessible: harmony.isAccessible,
    labelAr: harmony.isAccessible
      ? `متناسق ومطابق لمعايير التباين (${harmony.ratioString} WCAG AA)`
      : `تباين خافت (${harmony.ratioString}) يفضل تعديل اللون`,
    labelEn: harmony.isAccessible
      ? `Harmonious & WCAG AA Compliant (${harmony.ratioString})`
      : `Low contrast (${harmony.ratioString}) - adjustment recommended`,
  };
}

export interface OfficeFontColorPreset {
  hex: string;
  nameAr: string;
  nameEn: string;
  category: "light" | "dark" | "gold";
  descriptionAr: string;
}

export const OFFICE_FONT_COLOR_PRESETS: OfficeFontColorPreset[] = [
  {
    hex: "#ffffff",
    nameAr: "أبيض ناصع",
    nameEn: "Pure White",
    category: "light",
    descriptionAr: "وضوح فائق ومثالي على الخلفيات الداكنة والملونة",
  },
  {
    hex: "#fdfbf7",
    nameAr: "لؤلؤي دافئ",
    nameEn: "Warm Pearl",
    category: "light",
    descriptionAr: "درجة راقية ومريحة للعين، تعطي طابعاً ملكياً",
  },
  {
    hex: "#d5a058",
    nameAr: "ذهبي وقور (معتمد)",
    nameEn: "Royal Gold",
    category: "gold",
    descriptionAr: "اللون الذهبي المعتمد للهوية القانونية من الشعار",
  },
  {
    hex: "#f5e6c8",
    nameAr: "بيج ذهبي مذهب",
    nameEn: "Gold Tint",
    category: "gold",
    descriptionAr: "متناسق مع الهوية الذهبية للمنصة على الخلفيات الداكنة",
  },
  {
    hex: "#203b3c",
    nameAr: "بترولي كحلي (معتمد)",
    nameEn: "Deep Petrol",
    category: "dark",
    descriptionAr: "اللون البترولي الكحلي المعتمد للهوية القانونية من الشعار",
  },
  {
    hex: "#162829",
    nameAr: "بترولي داكن ملكي",
    nameEn: "Dark Slate Petrol",
    category: "dark",
    descriptionAr: "درجة رسمية هادئة تناسب المكاتب الاستشارية العريقة",
  },
  {
    hex: "#1b1c1a",
    nameAr: "أسود كربون وقور",
    nameEn: "Carbon Onyx",
    category: "dark",
    descriptionAr: "الخيار الرسمي الأقوى للخلفيات الفاتحة والصفراء",
  },
  {
    hex: "#334155",
    nameAr: "رمادي أردوازي أنيق",
    nameEn: "Slate Gray",
    category: "dark",
    descriptionAr: "طابع رقمي حديث وواضح جداً",
  },
];

export function getOfficeFontColorName(hex?: string, isEn = false): string {
  if (!hex) return isEn ? "Pure White" : "أبيض ناصع";
  const clean = hex.toLowerCase().trim();
  const match = OFFICE_FONT_COLOR_PRESETS.find((s) => s.hex.toLowerCase() === clean);
  if (match) return isEn ? match.nameEn : match.nameAr;
  return clean.startsWith("#") ? clean.toUpperCase() : `#${clean.toUpperCase()}`;
}

export interface OfficeColorPair {
  id: string;
  nameAr: string;
  nameEn: string;
  bgHex: string;
  fontHex: string;
  bgNameAr: string;
  fontNameAr: string;
}

export interface OfficeColorTrio {
  id: string;
  nameAr: string;
  nameEn: string;
  bgHex: string; // background_color
  accentHex: string; // color (secondary / buttons / active)
  fontHex: string; // font_color
  descriptionAr?: string;
}

export const OFFICE_COLOR_TRIOS: OfficeColorTrio[] = [
  {
    id: "petrol-gold-white",
    nameAr: "بترولي كحلي + ذهبي وقور",
    nameEn: "Deep Petrol & Royal Gold",
    bgHex: "#203b3c",
    accentHex: "#d5a058",
    fontHex: "#ffffff",
    descriptionAr: "الهوية الملكية الأكثر طلباً لمكاتب المحاماة العريقة (مطابقة لشعار الدوسري)",
  },
  {
    id: "royal-blue-electric-white",
    nameAr: "أزرق ملكي + أزرق سماوي",
    nameEn: "Royal Blue & Sapphire",
    bgHex: "#1a237e",
    accentHex: "#2563eb",
    fontHex: "#ffffff",
    descriptionAr: "الهوية الرقمية المعتمدة لنظام البوابة والقوائم الجانبية",
  },
  {
    id: "deep-petrol-bronze-pearl",
    nameAr: "كحلي داكن + برونزي دافئ",
    nameEn: "Dark Slate & Bronze",
    bgHex: "#162829",
    accentHex: "#c38d45",
    fontHex: "#fdfbf7",
    descriptionAr: "طابع رسمي فخم يوحي بالرسوخ والثقة القضائية",
  },
  {
    id: "gold-petrol-white",
    nameAr: "ذهبي وقور + بترولي داكن",
    nameEn: "Royal Gold & Deep Petrol",
    bgHex: "#d5a058",
    accentHex: "#203b3c",
    fontHex: "#ffffff",
    descriptionAr: "هوية ذهبية مشعة وبارزة للشاشات الحديثة",
  },
  {
    id: "carbon-gold-snow",
    nameAr: "فحمي كربوني + ذهبي وقور",
    nameEn: "Carbon Onyx & Royal Gold",
    bgHex: "#1b1c1a",
    accentHex: "#d5a058",
    fontHex: "#f8fafc",
    descriptionAr: "أناقة عصرية داكنة بتباين حاد وفائق الوضوح",
  },
  {
    id: "pearl-petrol-navy",
    nameAr: "بيج لؤلؤي + بترولي كحلي",
    nameEn: "Pearl Linen & Deep Petrol",
    bgHex: "#f7f1e6",
    accentHex: "#203b3c",
    fontHex: "#162829",
    descriptionAr: "خلفية ناصعة مريحة للعين مستوحاة من الأوراق القانونية الرسمية",
  },
  {
    id: "emerald-brass-white",
    nameAr: "زمردي ملكي + نحاسي دافئ",
    nameEn: "Royal Emerald & Warm Brass",
    bgHex: "#112a20",
    accentHex: "#c69248",
    fontHex: "#ffffff",
    descriptionAr: "طابع عدلي مهيب يجمع بين الخضرة الملكية الداكنة والنحاس المصقول",
  },
  {
    id: "burgundy-champagne-snow",
    nameAr: "عنابي بورغندي + ذهبي شمبانيا",
    nameEn: "Royal Burgundy & Champagne",
    bgHex: "#36121c",
    accentHex: "#dfb164",
    fontHex: "#fdfbf7",
    descriptionAr: "فخامة كلاسيكية عريقة ترمز لرسوخ المكاتب الاستشارية الكبرى",
  },
  {
    id: "andalusian-sapphire-white",
    nameAr: "كحلي أندلسي + ياقوتي وهاج",
    nameEn: "Andalusian Navy & Sapphire",
    bgHex: "#0f1d38",
    accentHex: "#3b82f6",
    fontHex: "#ffffff",
    descriptionAr: "طابع تقني وقور بدرجات زرقاء نقية وعالية التباين",
  },
  {
    id: "mahogany-desert-pearl",
    nameAr: "ماهوجني كلاسيكي + رمال صحراوية",
    nameEn: "Classic Mahogany & Desert Sand",
    bgHex: "#2c1b18",
    accentHex: "#d49b55",
    fontHex: "#fdfbf7",
    descriptionAr: "دفء المكاتب القانونية الخشبية العريقة والهوية التراثية الأصيلة",
  },
  {
    id: "titanium-azure-white",
    nameAr: "تيتانيوم عصري + أزرق سماوي",
    nameEn: "Modern Titanium & Azure",
    bgHex: "#1e242d",
    accentHex: "#0ea5e9",
    fontHex: "#ffffff",
    descriptionAr: "حداثة رقمية رائدة بتباين معاصر للمنصات القانونية الحديثة",
  },
  {
    id: "parchment-petrol-navy",
    nameAr: "عاجي رسمي + بترولي كحلي",
    nameEn: "Legal Parchment & Deep Petrol",
    bgHex: "#f3efe6",
    accentHex: "#203b3c",
    fontHex: "#162829",
    descriptionAr: "نمط نهاري فاتح فائق الراحة للقراءة والعمل المكتبي الطويل",
  },
  {
    id: "imperial-purple-gold",
    nameAr: "بنفسجي إمبراطوري + ذهبي ملكي",
    nameEn: "Imperial Violet & Royal Gold",
    bgHex: "#24142f",
    accentHex: "#d5a058",
    fontHex: "#fdfbf7",
    descriptionAr: "فخامة استثنائية راقية تجمع بين الأرجواني الملكي والذهب الوقور",
  },
  {
    id: "forest-pine-gold",
    nameAr: "صنوبري داكن + ذهبي هادئ",
    nameEn: "Forest Pine & Soft Gold",
    bgHex: "#142820",
    accentHex: "#e0a953",
    fontHex: "#ffffff",
    descriptionAr: "طابع رصين موقر مستوحى من درجات الغابات والأخشاب الذهبية",
  },
  {
    id: "espresso-camel-white",
    nameAr: "إسبريسو ملكي + جملي دافئ",
    nameEn: "Royal Espresso & Warm Camel",
    bgHex: "#251813",
    accentHex: "#c89255",
    fontHex: "#ffffff",
    descriptionAr: "طابع كلاسيكي دافئ من ألوان القهوة الفاخرة والجلد الجملي الأصيل",
  },
  {
    id: "slate-steel-copper",
    nameAr: "أردوازي حديدي + نحاس متوهج",
    nameEn: "Slate Steel & Glowing Copper",
    bgHex: "#1a212d",
    accentHex: "#e07a38",
    fontHex: "#ffffff",
    descriptionAr: "حداثة معمارية فاخرة تجمع بين الرمادي الفولاذي والنحاس البراق",
  },
];

export interface OfficeAccentColorPreset {
  hex: string;
  nameAr: string;
  nameEn: string;
}

export const OFFICE_ACCENT_COLOR_PRESETS: OfficeAccentColorPreset[] = [
  { hex: "#d5a058", nameAr: "ذهبي وقور", nameEn: "Royal Gold" },
  { hex: "#2563eb", nameAr: "أزرق حيوي", nameEn: "Vibrant Sapphire" },
  { hex: "#203b3c", nameAr: "بترولي كحلي", nameEn: "Deep Petrol" },
  { hex: "#10b981", nameAr: "أخضر عدلي", nameEn: "Justice Emerald" },
  { hex: "#c38d45", nameAr: "برونزي دافئ", nameEn: "Warm Bronze" },
  { hex: "#881337", nameAr: "عنابي ملكي", nameEn: "Ruby Burgundy" },
  { hex: "#c69248", nameAr: "نحاسي دافئ", nameEn: "Warm Brass" },
  { hex: "#dfb164", nameAr: "ذهبي شمبانيا", nameEn: "Champagne Gold" },
  { hex: "#3b82f6", nameAr: "ياقوتي وهاج", nameEn: "Bright Sapphire" },
  { hex: "#d49b55", nameAr: "رمال صحراوية", nameEn: "Desert Sand" },
  { hex: "#0ea5e9", nameAr: "أزرق سماوي", nameEn: "Sky Azure" },
  { hex: "#e0a953", nameAr: "ذهبي كهرماني", nameEn: "Amber Gold" },
  { hex: "#c89255", nameAr: "جملي دافئ", nameEn: "Warm Camel" },
  { hex: "#e07a38", nameAr: "نحاسي متوهج", nameEn: "Glowing Copper" },
];

export function getOfficeAccentColorName(hex?: string, isEn = false): string {
  if (!hex) return isEn ? "Royal Gold" : "ذهبي وقور";
  const clean = hex.toLowerCase().trim();
  const match = OFFICE_ACCENT_COLOR_PRESETS.find((s) => s.hex.toLowerCase() === clean);
  if (match) return isEn ? match.nameEn : match.nameAr;
  return clean.startsWith("#") ? clean.toUpperCase() : `#${clean.toUpperCase()}`;
}

/**
 * Analyze an image and suggest 3 coordinated harmonious trios (Royal Dark, High Contrast, Warm Light)
 * matching the logo's dominant tones.
 */
export async function suggestMultipleTriosFromLogo(imageSrc: string): Promise<OfficeColorTrio[]> {
  return new Promise((resolve) => {
    const fallbackTrios: OfficeColorTrio[] = [
      {
        id: "logo-trio-dark",
        nameAr: "داكن ملكي (من الشعار)",
        nameEn: "Logo Royal Dark",
        bgHex: "#203b3c",
        accentHex: "#d5a058",
        fontHex: "#ffffff",
        descriptionAr: "طقم داكن فخم يعكس ألوان الشعار الرسمية",
      },
      {
        id: "logo-trio-contrast",
        nameAr: "متباين بارز (من الشعار)",
        nameEn: "Logo High Contrast",
        bgHex: "#14181f",
        accentHex: "#d5a058",
        fontHex: "#ffffff",
        descriptionAr: "طقم داكن عالي التباين لإبراز هوية الشعار",
      },
      {
        id: "logo-trio-light",
        nameAr: "نهاري لؤلؤي (من الشعار)",
        nameEn: "Logo Warm Light",
        bgHex: "#f8f6f0",
        accentHex: "#203b3c",
        fontHex: "#18222d",
        descriptionAr: "طقم فاتح مريح للمطالعة متناسق مع الشعار",
      },
    ];

    if (typeof window === "undefined" || !imageSrc) {
      resolve(fallbackTrios);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          resolve(fallbackTrios);
          return;
        }
        const width = (canvas.width = 72);
        const height = (canvas.height = 72);
        ctx.drawImage(img, 0, 0, width, height);
        const data = ctx.getImageData(0, 0, width, height).data;

        const colorCounts: Record<string, { r: number; g: number; b: number; count: number; lum: number; sat: number }> = {};

        for (let i = 0; i < data.length; i += 4) {
          const a = data[i + 3];
          if (a < 60) continue; // Skip transparent
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const sat = max === 0 ? 0 : (max - min) / max;

          // Bucket to 20-step quantization
          const qr = Math.round(r / 20) * 20;
          const qg = Math.round(g / 20) * 20;
          const qb = Math.round(b / 20) * 20;
          const key = `${qr},${qg},${qb}`;

          if (!colorCounts[key]) {
            colorCounts[key] = { r: qr, g: qg, b: qb, count: 0, lum, sat };
          }
          colorCounts[key].count++;
        }

        const entries = Object.values(colorCounts).sort((a, b) => b.count - a.count);
        if (entries.length === 0) {
          resolve(fallbackTrios);
          return;
        }

        const rgbToHex = (r: number, g: number, b: number) => {
          return "#" + [r, g, b].map((x) => Math.min(255, Math.max(0, x)).toString(16).padStart(2, "0")).join("");
        };

        // Find primary accent (most saturated & weighted by count)
        const nonGreys = entries.filter((c) => c.sat > 0.15 && c.lum > 0.12 && c.lum < 0.9);
        const topAccentEntry = nonGreys.sort((a, b) => b.sat * Math.sqrt(b.count) - a.sat * Math.sqrt(a.count))[0] || entries[0];
        const primaryAccentHex = rgbToHex(topAccentEntry.r, topAccentEntry.g, topAccentEntry.b);

        // Find dark tone in logo (lum < 0.35)
        const darkEntries = entries.filter(
          (c) => c.lum < 0.35 && rgbToHex(c.r, c.g, c.b).toLowerCase() !== primaryAccentHex.toLowerCase()
        );
        let darkBgHex = "#203b3c";
        if (darkEntries.length > 0) {
          darkBgHex = rgbToHex(darkEntries[0].r, darkEntries[0].g, darkEntries[0].b);
        } else {
          // If no natural dark, tint deep slate with the accent hue
          const r = Math.round(18 + topAccentEntry.r * 0.08);
          const g = Math.round(24 + topAccentEntry.g * 0.08);
          const b = Math.round(30 + topAccentEntry.b * 0.08);
          darkBgHex = rgbToHex(r, g, b);
        }

        // Secondary / light tone for Light mode
        const lightToneHex = "#f8f6f0";
        const lightModeAccent = topAccentEntry.lum > 0.65 ? darkBgHex : primaryAccentHex;

        // Trio 1: داكن ملكي
        const trio1: OfficeColorTrio = {
          id: `logo-royal-dark-${Date.now()}-1`,
          nameAr: "داكن ملكي (من الشعار)",
          nameEn: "Logo Royal Dark",
          bgHex: darkBgHex,
          accentHex: primaryAccentHex,
          fontHex: "#ffffff",
          descriptionAr: "الهوية الملكية المتناسقة مع الدرجات الأساسية لشعارك",
        };

        // Trio 2: متباين بارز
        const trio2: OfficeColorTrio = {
          id: `logo-contrast-${Date.now()}-2`,
          nameAr: "متباين بارز (من الشعار)",
          nameEn: "Logo High Contrast",
          bgHex: "#14181f",
          accentHex: primaryAccentHex,
          fontHex: "#ffffff",
          descriptionAr: "تباين حاد وواضح يبرز هوية المكتب بدقة فائقة",
        };

        // Trio 3: نهاري لؤلؤي
        const trio3: OfficeColorTrio = {
          id: `logo-light-${Date.now()}-3`,
          nameAr: "نهاري لؤلؤي (من الشعار)",
          nameEn: "Logo Warm Light",
          bgHex: lightToneHex,
          accentHex: lightModeAccent,
          fontHex: "#18222d",
          descriptionAr: "نمط نهاري مريح للعين مستوحى من ألوان الشعار الرسمية",
        };

        resolve([trio1, trio2, trio3]);
      } catch {
        resolve(fallbackTrios);
      }
    };
    img.onerror = () => {
      resolve(fallbackTrios);
    };
    img.src = imageSrc;
  });
}

/**
 * Analyze an image and suggest a 3-color palette (bg, accent, font)
 * matching the logo's dominant tones.
 */
export async function suggestColorsFromLogo(imageSrc: string): Promise<{
  backgroundColor: string;
  accentColor: string;
  fontColor: string;
}> {
  const trios = await suggestMultipleTriosFromLogo(imageSrc);
  const best = trios[0] || {
    bgHex: "#203b3c",
    accentHex: "#d5a058",
    fontHex: "#ffffff",
  };
  return {
    backgroundColor: best.bgHex,
    accentColor: best.accentHex,
    fontColor: best.fontHex,
  };
}

export const OFFICE_COLOR_HARMONY_PAIRS: OfficeColorPair[] = [
  {
    id: "petrol-gold",
    nameAr: "بترولي كحلي + ذهبي وقور",
    nameEn: "Deep Petrol & Royal Gold",
    bgHex: "#203b3c",
    fontHex: "#d5a058",
    bgNameAr: "بترولي كحلي",
    fontNameAr: "ذهبي وقور",
  },
  {
    id: "petrol-white",
    nameAr: "بترولي كحلي + أبيض ناصع",
    nameEn: "Deep Petrol & Pure White",
    bgHex: "#203b3c",
    fontHex: "#ffffff",
    bgNameAr: "بترولي كحلي",
    fontNameAr: "أبيض ناصع",
  },
  {
    id: "gold-petrol",
    nameAr: "ذهبي وقور + بترولي كحلي",
    nameEn: "Royal Gold & Deep Petrol",
    bgHex: "#d5a058",
    fontHex: "#203b3c",
    bgNameAr: "ذهبي وقور",
    fontNameAr: "بترولي كحلي",
  },
  {
    id: "gold-white",
    nameAr: "ذهبي وقور + أبيض ناصع",
    nameEn: "Royal Gold & Pure White",
    bgHex: "#d5a058",
    fontHex: "#ffffff",
    bgNameAr: "ذهبي وقور",
    fontNameAr: "أبيض ناصع",
  },
  {
    id: "deep-petrol-pearl",
    nameAr: "بترولي داكن + لؤلؤي دافئ",
    nameEn: "Dark Petrol & Warm Pearl",
    bgHex: "#162829",
    fontHex: "#fdfbf7",
    bgNameAr: "بترولي داكن",
    fontNameAr: "لؤلؤي دافئ",
  },
  {
    id: "warm-pearl-petrol",
    nameAr: "بيج لؤلؤي + بترولي كحلي",
    nameEn: "Warm Pearl & Deep Petrol",
    bgHex: "#f7f1e6",
    fontHex: "#203b3c",
    bgNameAr: "بيج لؤلؤي",
    fontNameAr: "بترولي كحلي",
  },
];

export const OFFICE_FONT_FAMILIES = [
  { id: "Cairo", nameAr: "خط كايرو (الافتراضي)", sample: "المنظومة القانونية المتكاملة" },
  { id: "Tajawal", nameAr: "خط تجوال (عصري متناسق)", sample: "المنظومة القانونية المتكاملة" },
  { id: "Almarai", nameAr: "خط المراعي (رسمي وأنيق)", sample: "المنظومة القانونية المتكاملة" },
  { id: "IBM Plex Sans Arabic", nameAr: "خط آي بي إم (تقني رصين)", sample: "المنظومة القانونية المتكاملة" },
];
