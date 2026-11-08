import { Employee, AuditLogEntry, StaffKpis, EmployeeRole } from "../types/staff.types";

export const staffRoles: EmployeeRole[] = [
  {
    id: "1",
    name: "Super Admin",
    category: "الإدارة العليا",
    badgeClass: "bg-[#ffeed9] dark:bg-[#2d1f16] text-[#7b4e00] dark:text-[#f3c27e] border-[#fcd8b0] dark:border-[#e29d38]/40",
    iconType: "shield",
  },
  {
    id: "3",
    name: "موظف",
    category: "فريق العمل",
    badgeClass: "bg-[#f5f3ef] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] border-[#e6e2dc] dark:border-[#38271c]",
    iconType: "briefcase",
  },
];

export const initialStaffMembers: Employee[] = [];

export const initialStaffKpis: StaffKpis = {
  totalStaff: 0,
  totalDepartments: 0,
  activeStaff: 0,
  activePercentage: 0,
  suspendedStaff: 0,
  suspendedReason: "",
  loggedToday: 0,
  lastSessionMinutesAgo: 0,
};

export const sampleSaraAuditLogs: AuditLogEntry[] = [];
