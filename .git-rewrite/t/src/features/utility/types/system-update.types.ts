export interface SystemUpdateStats {
  backupStatus: string;
  backupTime: string;
  lastScanTime: string;
  lastScanStatus: string;
  environment: string;
  serverLocation: string;
}

export interface SystemVersionInfo {
  installedVersion: string;
  installedDate: string;
  installedStatus: string;
  coreKernelStatus: string;
  latestVersion: string;
  latestReleaseDate: string;
  packageSize: string;
  isMajorUpdate: boolean;
  shaVerified: boolean;
}
