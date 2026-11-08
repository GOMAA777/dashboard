export type RoleType = "system" | "custom";

export interface EmployeeInitial {
  label: string;
  bg: string;
  text: string;
}

export interface RoleItem {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description?: string;
  permissionsCount: number;
  permissionsLabel: string;
  hasFullPermissionsBadge?: boolean;
  assignedEmployeesCount: number;
  assignedEmployeesInitials?: EmployeeInitial[];
  type: RoleType;
  typeBadge: {
    label: string;
    sublabel?: string;
    badgeClass: string;
    dotClass: string;
  };
  isProtected: boolean;
  iconType: "shield" | "headset" | "monitor" | "calculator" | "briefcase" | "scale";
  iconBg: string;
  createdAt?: string;
  permissions?: string[];
}

export interface RoleKpiStats {
  totalActiveRoles: number;
  totalPermissions: number;
  totalAssignedStaff: number;
  systemProtectedRoles: number;
  systemSecurityPct: number;
}

export interface PermissionItem {
  id: string;
  label: string;
  isSensitive?: boolean;
  sensitivityBadge?: "مقيد أمنياً" | "عالي الحساسية";
}

export interface PermissionModule {
  id: string;
  name: string;
  description: string;
  iconType: "home" | "users" | "credit-card" | "tag" | "user-check" | "key" | "bell" | "headphones" | "receipt" | "wallet" | "settings";
  permissions: PermissionItem[];
}
