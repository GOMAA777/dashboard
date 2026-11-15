import { getLocalizedCityName } from "@/features/clients/constants/saudi-cities";

export { getLocalizedCityName };

const STATUS_EN_MAP: Record<string, string> = {
  "نشط": "Active",
  "نشطة": "Active",
  "نشطة الآن": "Active Now",
  "نشط الآن": "Active Now",
  "فعال": "Active",
  "فعالة": "Active",
  "غير نشط": "Inactive",
  "معطل": "Suspended",
  "معطلة": "Suspended",
  "موقوف": "Suspended",
  "تجربة مجانية": "Free Trial",
  "تحت التجربة": "Trial",
  "فترة تجريبية": "Free Trial",
  "تجريبي": "Trial",
  "منتهي": "Expired",
  "منتهية": "Expired",
  "ملغي": "Cancelled",
  "ملغى": "Cancelled",
  "ملغاة": "Cancelled",
  "مرفوض": "Rejected",
  "مرفوضة": "Rejected",
  "قيد الانتظار": "Pending",
  "قيد المراجعة": "Pending Review",
  "معلق": "Pending",
  "معلقة": "Pending",
  "مدفوع": "Paid",
  "مدفوعة": "Paid",
  "مسددة": "Paid",
  "غير مدفوع": "Unpaid",
  "غير مدفوعة": "Unpaid",
  "متأخر": "Overdue",
  "متأخرة": "Overdue",
  "مفتوح": "Open",
  "مفتوحة": "Open",
  "مغلق": "Closed",
  "مغلقة": "Closed",
  "قيد المعالجة": "In Progress",
  "تم الحل": "Resolved",
  "مكتمل": "Completed",
  "مكتملة": "Completed",
  "ناجح": "Success",
  "ناجحة": "Success",
  "فشل": "Failed",
  "فاشلة": "Failed",
  "مسودة": "Draft",
  "مسودة غير مرسلة": "Unsent Draft",
  "تم الإرسال": "Sent",
  "سليم وموثق": "Verified",
  "جاهز": "Ready",
  "غير محدد": "Not Specified",
  "غير متوفر": "Unavailable",
  "غير مسند": "Unassigned",
};

export function localizeStatus(status: string | undefined | null, isEn: boolean): string {
  if (!status) return isEn ? "Unknown" : "غير محدد";
  if (!isEn) return status;
  const trimmed = status.trim();
  if (STATUS_EN_MAP[trimmed]) return STATUS_EN_MAP[trimmed];
  if (trimmed.includes("تجرب")) return "Free Trial";
  if (trimmed.includes("معطل") || trimmed.includes("غير نشط")) return "Inactive";
  if (trimmed.includes("نشط")) return "Active";
  if (trimmed.includes("منته")) return "Expired";
  if (trimmed.includes("ملغ")) return "Cancelled";
  if (trimmed.includes("متأخر")) return "Overdue";
  if (trimmed.includes("انتظار") || trimmed.includes("معلق")) return "Pending";
  if (trimmed.includes("مدفوع")) return "Paid";
  if (trimmed.includes("مفتوح")) return "Open";
  if (trimmed.includes("مغلق")) return "Closed";
  return trimmed;
}

export function localizeBillingCycle(cycle: string | undefined | null, isEn: boolean): string {
  if (!cycle) return isEn ? "Monthly" : "شهري";
  if (!isEn) return cycle;
  const trimmed = cycle.trim();
  if (trimmed === "اشتراك سنوي (موصى به - خصم شهرين مجاناً)") {
    return "Annual Subscription (Recommended - 2 Months Free)";
  }
  if (trimmed === "اشتراك شهري عادي") {
    return "Standard Monthly Subscription";
  }
  const trialMatch = trimmed.match(/(\d+)\s*يوم/);
  if (trialMatch && (trimmed.includes("تجرب") || trimmed.includes("فترة"))) {
    return `Trial Period (${trialMatch[1]} days)`;
  }
  if (trimmed.includes("سنو") || trimmed.toLowerCase().includes("year") || trimmed.toLowerCase().includes("annu")) {
    return "Annual";
  }
  if (trimmed.includes("شهري") || trimmed.includes("شهر") || trimmed.toLowerCase().includes("month")) {
    return "Monthly";
  }
  if (trimmed.includes("تجرب")) {
    return "Free Trial";
  }
  return trimmed;
}

const PLAN_NAME_EN_MAP: Record<string, string> = {
  "الباقة الأساسية": "Basic Plan",
  "الباقة الفضية": "Silver Plan",
  "الباقة الذهبية": "Gold Plan",
  "باقة الشركات": "Enterprise Plan",
  "باقة النخبة": "Elite Plan",
  "الباقة الاحترافية": "Professional Plan",
  "الباقة المتقدمة": "Advanced Plan",
  "باقة التميز العدلي": "Legal Excellence Plan",
  "باقة مخصصة": "Custom Plan",
  "تجربة مجانية": "Free Trial",
  "مجاني للمحامي": "Free for Lawyer",
  "باقة المحترف": "Pro Plan",
  "باقة المؤسسات": "Enterprise Plan",
  "الباقة المعتمدة": "Approved Plan",
  "تجربة مجانية مخصصة": "Custom Free Trial",
  "الباقة المخصصة (SLA المؤسسي)": "Custom Plan (Enterprise SLA)",
};

export function localizePlanName(planName: string | undefined | null, isEn: boolean): string {
  if (!planName) return isEn ? "Standard Plan" : "الباقة الأساسية";
  if (!isEn) return planName;
  let result = planName.trim();
  // Exact match
  if (PLAN_NAME_EN_MAP[result]) return PLAN_NAME_EN_MAP[result];
  // Replace known substrings
  for (const [ar, en] of Object.entries(PLAN_NAME_EN_MAP)) {
    if (result.includes(ar)) {
      result = result.replace(ar, en);
    }
  }
  result = result
    .replace(/\s*-\s*Free Trial/gi, " - Free Trial")
    .replace(/باقة\s+(\d+)/g, "Plan $1")
    .replace(/باقة\s+/g, "Plan ");
  return result;
}

export function localizePlanFeature(feature: string | undefined | null, isEn: boolean): string {
  if (!feature) return "";
  if (!isEn) return feature;
  let f = feature.trim();

  const exactMap: Record<string, string> = {
    "دعم مباشر ذو أولوية فائقة (VIP SLA)": "Priority Direct Support (VIP SLA)",
    "دعم مباشر ذو أولوية فائقة (VIP)": "Priority Direct Support (VIP)",
    "دعم مباشر VIP": "Direct VIP Support",
    "دعم ذو أولوية": "Priority Support",
    "دعم فني ذو أولوية للمكتب": "Priority Office Technical Support",
    "دعم فني فوري مخصص 24/7": "24/7 Dedicated VIP Support",
    "فريق دعم وتقنية مخصص 24/7": "Dedicated 24/7 Support & Tech Team",
    "دعم فني قياسي ذو أولوية": "Priority Standard Technical Support",
    "دعم فني قياسي (خلال 24 ساعة)": "Standard Technical Support (Within 24h)",
    "دعم فني قياسي": "Standard Technical Support",
    "غير محدود من المحامين والمستشارين": "Unlimited Lawyers & Consultants",
    "غير محدود من القضايا والوكلاء": "Unlimited Cases & Agents",
    "500 GB سعة سحابية مخصصة": "500 GB Dedicated Cloud Storage",
    "مرونة مطلقة واتفاقية مستوى خدمة مخصصة تلبي كافة الاحتياجات التنظيمية المعقدة.":
      "Full flexibility and a custom SLA tailored to complex organizational requirements.",
    "مدير حساب قانوني معتمد شخصي": "Dedicated Legal Account Manager",
    "مدير حساب استشاري مخصص VIP": "Dedicated VIP Account Manager",
    "تقارير الذكاء القضائي ومؤشرات الأداء المالي (KPIs)": "Legal AI & Financial KPI Reports",
    "تقارير مؤشرات الأداء والتحليلات القضائية (KPIs)": "KPI Reports & Legal Analytics",
    "تقارير مؤشرات الأداء والتحليلات القضائية": "KPI Reports & Legal Analytics",
    "فوترة إلكترونية متوافقة كلياً (ZATCA Phase 2)": "ZATCA Phase 2 E-Invoicing",
    "الفوترة الإلكترونية المتوافقة مع هيئة الزكاة والضريبة (ZATCA Phase 2)": "ZATCA Phase 2 E-Invoicing",
    "الفوترة الإلكترونية ZATCA المرحلة 2": "ZATCA Phase 2 E-Invoicing",
    "ربط تكاملي فوري مع بوابة ناجز ومساند": "Najiz & Musaned Instant Integration",
    "الربط التلقائي المباشر مع منصة ناجز ووزارة العدل": "Direct Najiz & Ministry of Justice Integration",
    "ربط مباشر مع منصة ناجز ووزارة العدل": "Direct Najiz & Ministry of Justice Integration",
    "تكامل واجهة البرمجة (Custom API Integration)": "Custom API Integration",
    "تكامل API خاص لأنظمة ERP": "Custom ERP API Integration",
    "تخصيص كامل لواجهة النظام وهوية المكتب": "Full UI & Office Brand Customization",
    "تكامل API ثنائي الاتجاه مع أنظمة ERP و CRM": "Two-way ERP & CRM API Integration",
    "أعلى معايير تشفير وأمان متوافقة مع الأمن السيبراني": "Highest Cybersecurity Encryption Standards",
    "تدريب ميداني وإعداد مخصص لفريق المكتب": "Dedicated Onboarding & Team Training",
    "تُدفع سنوياً": "Billed annually",
    "تدفع سنوياً أو شهرياً": "Billed annually or monthly",
  };

  if (exactMap[f]) return exactMap[f];

  f = f
    .replace(/غير محدود[ة]?/g, "Unlimited")
    .replace(/محامين ومستشارين/g, "Lawyers & Consultants")
    .replace(/محامٍ/g, "Lawyer")
    .replace(/قضية نشطة/g, "Active Cases")
    .replace(/قضية/g, "Cases")
    .replace(/وكلاء شرعيين/g, "Legal Agents")
    .replace(/وكيل/g, "Agent")
    .replace(/مساعدين ومحاسبين/g, "Assistants & Accountants")
    .replace(/عميل وموكل/g, "Clients")
    .replace(/عميل/g, "Client")
    .replace(/مستند ووثيقة/g, "Documents")
    .replace(/مستند/g, "Document")
    .replace(/مساحة تخزين سحابية/g, "Cloud Storage")
    .replace(/سعة سحابية آمنة/g, "Secure Cloud Storage");

  return f;
}

const MONTH_EN_MAP: Record<string, string> = {
  "يناير": "Jan",
  "فبراير": "Feb",
  "مارس": "Mar",
  "أبريل": "Apr",
  "مايو": "May",
  "يونيو": "Jun",
  "يوليو": "Jul",
  "أغسطس": "Aug",
  "سبتمبر": "Sep",
  "أكتوبر": "Oct",
  "نوفمبر": "Nov",
  "ديسمبر": "Dec",
};

export function localizeMonth(month: string | undefined | null, isEn: boolean): string {
  if (!month) return "";
  if (!isEn) return month;
  return MONTH_EN_MAP[month.trim()] || month;
}

export function localizeLicense(license: string | undefined | null, isEn: boolean): string {
  if (!license) return "—";
  if (!isEn) return license;
  return license
    .replace(/^ترخيص عدلي\s*:\s*/g, "License: ")
    .replace(/^ترخيص مهني\s*:\s*/g, "License: ")
    .replace("ترخيص معتمد", "Verified License");
}

export function localizeCurrencySymbol(symbol: string | undefined | null, isEn: boolean): string {
  if (!symbol) return isEn ? "SAR" : "ر.س";
  if (!isEn) return symbol;
  return symbol
    .replace("ر.س", "SAR")
    .replace("ريال سعودي", "SAR")
    .replace("دولار أمريكي", "USD");
}

export function localizeRelativeTime(text: string | undefined | null, isEn: boolean): string {
  if (!text) return "";
  if (!isEn) return text;
  let res = text.trim();
  if (res === "اليوم") return "Today";
  if (res === "أمس") return "Yesterday";
  if (res === "الآن") return "Just now";
  res = res
    .replace(/^منذ\s+/, "")
    .replace(/دقائق|دقيقة/g, "mins ago")
    .replace(/ساعات|ساعة/g, "hrs ago")
    .replace(/أيام|يوماً|يوم/g, "days ago")
    .replace(/ثوانٍ|ثانية/g, "secs ago");
  return res;
}

export function localizeRoleOrTitle(text: string | undefined | null, isEn: boolean): string {
  if (!text) return "";
  if (!isEn) return text;
  const map: Record<string, string> = {
    "مشرف النظام العام": "Super System Admin",
    "مشرف عام للنظام": "Super System Admin",
    "مشرف عام النظام": "Super System Admin",
    "مشرف النظام": "System Admin",
    "إشراف النظام": "System Supervision",
    "أخصائي دعم فني": "Technical Support Specialist",
    "الدعم الفني": "Technical Support",
    "الدعم الفني والربط التقني": "Technical Support & Integration",
    "دعم فني وتشغيلي": "Technical & Operational Support",
    "المستشار القانوني": "Legal Advisor",
    "موظف": "Staff Member",
    "نظام أساسي": "System Role",
    "مقيد أمنياً": "Security Restricted",
    "مدى": "Mada",
    "النظام": "System",
    "إجراء إداري": "Admin Action",
    "نشاط إداري": "Admin Activity",
    "حدث إداري": "Admin Event",
    "جميع المكاتب": "All Law Offices",
    "المسؤول": "Administrator",
    "مكتب محاماة": "Law Office",
    "مكتب": "Office",
    "الأكثر طلباً": "Most Popular",
    "الأكثر شيوعاً": "Most Popular",
    "مؤسسية مخصصة": "Custom Enterprise",
    "باقة مخصصة": "Custom Plan",
    "تجربة مجانية مخصصة": "Custom Free Trial",
    "موصى به": "Recommended",
  };
  return map[text.trim()] || text;
}
