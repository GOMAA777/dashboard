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
    nameAr: "بترولي كحلي + ذهبي وقور + أبيض",
    nameEn: "Deep Petrol, Gold & White",
    bgHex: "#203b3c",
    accentHex: "#d5a058",
    fontHex: "#ffffff",
    descriptionAr: "الهوية الملكية الأكثر طلباً لمكاتب المحاماة العريقة (مطابقة لشعار الدوسري)",
  },
  {
    id: "royal-blue-electric-white",
    nameAr: "أزرق ملكي + أزرق سماوي + أبيض",
    nameEn: "Royal Blue, Sapphire & White",
    bgHex: "#1a237e",
    accentHex: "#2563eb",
    fontHex: "#ffffff",
    descriptionAr: "الهوية الرقمية المعتمدة لنظام البوابة والقوائم الجانبية",
  },
  {
    id: "deep-petrol-bronze-pearl",
    nameAr: "كحلي داكن + برونزي دافئ + لؤلؤي",
    nameEn: "Dark Slate, Bronze & Pearl",
    bgHex: "#162829",
    accentHex: "#c38d45",
    fontHex: "#fdfbf7",
    descriptionAr: "طابع رسمي فخم يوحي بالرسوخ والثقة القضائية",
  },
  {
    id: "gold-petrol-white",
    nameAr: "ذهبي وقور + بترولي داكن + أبيض",
    nameEn: "Royal Gold, Petrol & White",
    bgHex: "#d5a058",
    accentHex: "#203b3c",
    fontHex: "#ffffff",
    descriptionAr: "هوية ذهبية مشعة وبارزة للشاشات الحديثة",
  },
  {
    id: "carbon-gold-snow",
    nameAr: "فحمي كربوني + ذهبي وقور + ثلجي",
    nameEn: "Carbon Onyx, Gold & Snow",
    bgHex: "#1b1c1a",
    accentHex: "#d5a058",
    fontHex: "#f8fafc",
    descriptionAr: "أناقة عصرية داكنة بتباين حاد وفائق الوضوح",
  },
  {
    id: "pearl-petrol-navy",
    nameAr: "بيج لؤلؤي + بترولي كحلي + كحلي",
    nameEn: "Pearl Linen, Petrol & Navy",
    bgHex: "#f7f1e6",
    accentHex: "#203b3c",
    fontHex: "#162829",
    descriptionAr: "خلفية ناصعة مريحة للعين مستوحاة من الأوراق القانونية الرسمية",
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
];

export function getOfficeAccentColorName(hex?: string, isEn = false): string {
  if (!hex) return isEn ? "Royal Gold" : "ذهبي وقور";
  const clean = hex.toLowerCase().trim();
  const match = OFFICE_ACCENT_COLOR_PRESETS.find((s) => s.hex.toLowerCase() === clean);
  if (match) return isEn ? match.nameEn : match.nameAr;
  return clean.startsWith("#") ? clean.toUpperCase() : `#${clean.toUpperCase()}`;
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
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !imageSrc) {
      resolve({
        backgroundColor: "#203b3c",
        accentColor: "#d5a058",
        fontColor: "#ffffff",
      });
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          resolve({ backgroundColor: "#203b3c", accentColor: "#d5a058", fontColor: "#ffffff" });
          return;
        }
        const width = (canvas.width = 64);
        const height = (canvas.height = 64);
        ctx.drawImage(img, 0, 0, width, height);
        const data = ctx.getImageData(0, 0, width, height).data;

        const colorCounts: Record<string, { r: number; g: number; b: number; count: number; lum: number; sat: number }> = {};

        for (let i = 0; i < data.length; i += 4) {
          const a = data[i + 3];
          if (a < 80) continue; // Skip transparent
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Skip near white and near black for accent detection
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const sat = max === 0 ? 0 : (max - min) / max;

          // Bucket to 24-step quantization
          const qr = Math.round(r / 24) * 24;
          const qg = Math.round(g / 24) * 24;
          const qb = Math.round(b / 24) * 24;
          const key = `${qr},${qg},${qb}`;

          if (!colorCounts[key]) {
            colorCounts[key] = { r: qr, g: qg, b: qb, count: 0, lum, sat };
          }
          colorCounts[key].count++;
        }

        const entries = Object.values(colorCounts).sort((a, b) => b.count - a.count);

        if (entries.length === 0) {
          resolve({ backgroundColor: "#203b3c", accentColor: "#d5a058", fontColor: "#ffffff" });
          return;
        }

        const rgbToHex = (r: number, g: number, b: number) => {
          return "#" + [r, g, b].map((x) => Math.min(255, Math.max(0, x)).toString(16).padStart(2, "0")).join("");
        };

        // Find primary accent (most saturated or distinctive)
        const saturated = [...entries].sort((a, b) => b.sat * b.count - a.sat * a.count);
        const topAccent = saturated[0] || entries[0];
        const accentHex = rgbToHex(topAccent.r, topAccent.g, topAccent.b);

        // Find dark tone for background
        const darks = entries.filter((c) => c.lum < 0.35);
        let bgHex = "#203b3c";
        if (darks.length > 0) {
          bgHex = rgbToHex(darks[0].r, darks[0].g, darks[0].b);
        } else {
          // If logo is light, use a deep slate or complementary dark
          bgHex = topAccent.lum < 0.5 ? accentHex : "#203b3c";
        }

        // If bg and accent are too similar, shift accent or bg
        if (bgHex.toLowerCase() === accentHex.toLowerCase()) {
          const second = entries.find((e) => rgbToHex(e.r, e.g, e.b) !== bgHex);
          if (second) {
            resolve({
              backgroundColor: bgHex,
              accentColor: rgbToHex(second.r, second.g, second.b),
              fontColor: "#ffffff",
            });
            return;
          }
        }

        resolve({
          backgroundColor: bgHex,
          accentColor: accentHex,
          fontColor: "#ffffff",
        });
      } catch {
        resolve({ backgroundColor: "#203b3c", accentColor: "#d5a058", fontColor: "#ffffff" });
      }
    };
    img.onerror = () => {
      resolve({ backgroundColor: "#203b3c", accentColor: "#d5a058", fontColor: "#ffffff" });
    };
    img.src = imageSrc;
  });
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
