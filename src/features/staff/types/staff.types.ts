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

export interface EmployeeLastLogin {
  time: string | null;
  ip?: string | null;
  city?: string | null;
  location?: string | null;
  note?: string;
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
  departmentId?: string | number;
  email: string;
  phone: string;
  role: EmployeeRole;
  roleId?: string | number;
  status: EmployeeStatus;
  lastLogin: EmployeeLastLogin;
  createdAt?: string;
  directSupervisor?: string;
  twoFactorEnabled?: boolean;
  twoFactorMethod?: string;
  passwordLastChanged?: string;
  permissionsCount?: number;
  /** Permission slugs/labels from the linked role (API). */
  permissions?: string[];
  assignedTicketsCount?: number;
}

export function isEmployeeAdmin(emp: Employee | null | undefined): boolean {
  if (!emp) return false;
  const roleName = (emp.role?.name || "").toLowerCase();
  const empCode = (emp.empCode || "").toUpperCase();
  const name = (emp.name || "").toLowerCase();
  return (
    roleName.includes("super") ||
    roleName.includes("admin") ||
    roleName.includes("مشرف") ||
    empCode === "EMP-ADMIN-01" ||
    empCode.includes("ADMIN") ||
    emp.role?.id === "1" ||
    name.includes("مشرف لوحة التحكم") ||
    name.includes("super admin")
  );
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
