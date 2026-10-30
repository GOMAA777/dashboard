export interface UserProfileData {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  jobTitle: string;
  department: string;
  nationalId: string;
  phone: string;
  email: string;
  emailVerified: boolean;
  emailVerifiedDate: string;
  recoveryEmail: string;
  city: string;
  country: string;
  language: "ar" | "en";
  timezone: string;
  bio: string;
  role: string;
  roleBadge: string;
  status: "active" | "inactive" | "suspended";
  statusLabel: string;
  joinDate: string;
  twoFactorEnabled: boolean;
  twoFactorMethod: string;
  emailNotifications: {
    subscriptions: boolean;
    invoices: boolean;
    securityAlerts: boolean;
    weeklyDigest: boolean;
    systemUpdates: boolean;
  };
}

export interface ActiveSessionItem {
  id: string;
  device: string;
  browser: string;
  os: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}
