import { SystemUpdateStats, SystemVersionInfo } from "../types/system-update.types";

export const initialUpdateStats: SystemUpdateStats = {
  backupStatus: "مكتملة ومؤمّنة",
  backupTime: "منذ 3 ساعات (حجم: 18.4 GB)",
  lastScanTime: "اليوم، 09:30 ص",
  lastScanStatus: "فحص سلامة الـ Hash التراكمي: سليم",
  environment: "إنتاجية (Production)",
  serverLocation: "الخادم الرئيسي بالرياض - سحابي",
};

export const initialVersionInfo: SystemVersionInfo = {
  installedVersion: "v4.4.0",
  installedDate: "12 سبتمبر 2024",
  installedStatus: "مُثبّت ويعمل حالياً",
  coreKernelStatus: "النواة المركزية: مستقرة ومفحوصة أمنياً",
  latestVersion: "v4.5.0",
  latestReleaseDate: "20 أكتوبر 2024",
  packageSize: "142.6 ميغابايت (SHA-256 Verified)",
  isMajorUpdate: true,
  shaVerified: true,
};
