export type EmployeeStatus = "active" | "suspended";

export type IconType =
  | "shield"
  | "headset"
  | "calculator"
  | "briefcase"
  | "cart"
  | "cloud"
  | "scales"
  | "monitor";

export interface EmployeeRole {
  id: string;
  name: string;
  category: string;
  badgeClass: string;
  iconType: IconType;
}

export interface Employee {
  id: string;
  empCode: string;
  name: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
  avatarImage?: string;
  jobTitle: string;
  department: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  lastLogin: {
    time: string;
    ip?: string;
    location?: string;
    note?: string;
  };
  createdAt?: string;
  directSupervisor?: string;
  twoFactorEnabled?: boolean;
  twoFactorMethod?: string;
  passwordLastChanged?: string;
}

export interface AuditLogEntry {
  id: string;
  date: string;
  time: string;
  eventType: string;
  eventBadgeClass: string;
  actor: string;
  actorRole: string;
  details: string;
  ip: string;
  device: string;
}

export interface StaffKpis {
  totalStaff: number;
  totalDepartments: number;
  activeStaff: number;
  activePercentage: number;
  suspendedStaff: number;
  suspendedReason: string;
  loggedToday: number;
  lastSessionMinutesAgo: number;
}
