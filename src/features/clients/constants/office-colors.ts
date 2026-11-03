export interface OfficeColorSwatch {
  hex: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
}

export const OFFICE_COLOR_PALETTE: OfficeColorSwatch[] = [
  {
    hex: "#9c6402",
    nameAr: "ذهبي ملكي (الافتراضي)",
    nameEn: "Royal Gold",
    descriptionAr: "الهوية الكلاسيكية المعتمدة للمنصة وبوابة الموكلين",
  },
  {
    hex: "#1e3a8a",
    nameAr: "كحلي وقور",
    nameEn: "Navy Slate",
    descriptionAr: "طابع رسمي وموثوق للمكاتب الاستشارية والشركات",
  },
  {
    hex: "#065f46",
    nameAr: "أخضر زمردي",
    nameEn: "Emerald Green",
    descriptionAr: "يعبر عن التوازن والعدالة والنمو المهني المستدام",
  },
  {
    hex: "#0284c7",
    nameAr: "أزرق سماوي",
    nameEn: "Sky Sapphire",
    descriptionAr: "طابع حديث وعصري للشركات القانونية الرقمية",
  },
  {
    hex: "#881337",
    nameAr: "عنابي ملكي",
    nameEn: "Ruby Burgundy",
    descriptionAr: "أناقة وفخامة عالية مخصصة لنخبة مكاتب المحامين",
  },
  {
    hex: "#78350f",
    nameAr: "برونزي ترابي",
    nameEn: "Warm Bronze",
    descriptionAr: "أصالة وتاريخ عريق يوحي بالثقة والرسوخ القانوني",
  },
  {
    hex: "#581c87",
    nameAr: "بنفسجي إمبراطوري",
    nameEn: "Imperial Purple",
    descriptionAr: "تميز استثنائي وهوية بصرية قيادية فريدة",
  },
  {
    hex: "#334155",
    nameAr: "رمادي فحمي",
    nameEn: "Charcoal Slate",
    descriptionAr: "طابع احترافي هادئ وعصري شديد الوضوح والأناقة",
  },
  {
    hex: "#0f766e",
    nameAr: "فيروزي داكن",
    nameEn: "Deep Teal",
    descriptionAr: "مزيج متناسق من الحكمة والاستقرار المؤسسي",
  },
  {
    hex: "#431407",
    nameAr: "بني قهوة دافئ",
    nameEn: "Warm Espresso",
    descriptionAr: "رصانة وجدية تعزز هيبة ووقار الكيان القانوني",
  },
];

export const DEFAULT_OFFICE_THEME_COLOR = "#9c6402";

export function getOfficeColorName(hex?: string): string {
  if (!hex) return "ذهبي ملكي (الافتراضي)";
  const clean = hex.toLowerCase().trim();
  const match = OFFICE_COLOR_PALETTE.find((s) => s.hex.toLowerCase() === clean);
  return match ? match.nameAr : "لون مخصص";
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
