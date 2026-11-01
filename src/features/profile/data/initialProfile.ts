import { UserProfileData, ActiveSessionItem } from "../types/profile.types";

export const initialProfileData: UserProfileData = {
  id: "",
  firstName: "",
  lastName: "",
  fullName: "",
  jobTitle: "",
  department: "",
  nationalId: "",
  phone: "",
  email: "",
  emailVerified: false,
  emailVerifiedDate: "",
  recoveryEmail: "",
  city: "",
  country: "",
  language: "ar",
  timezone: "",
  bio: "",
  role: "",
  roleBadge: "",
  status: "active",
  statusLabel: "",
  joinDate: "",
  twoFactorEnabled: false,
  twoFactorMethod: "",
  emailNotifications: {
    subscriptions: false,
    invoices: false,
    securityAlerts: false,
    weeklyDigest: false,
    systemUpdates: false,
  },
};

export const initialActiveSessions: ActiveSessionItem[] = [];
